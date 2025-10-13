#!/usr/bin/env node
/*
 Automates creation of Linear sub-issues from tasks in specs/001-what-build-a/tasks.md
 Expected environment variables:
   - LINEAR_API_KEY (required)
   - LINEAR_TEAM_NAME (required)
   - LINEAR_PROJECT_NAME (required)
   - LINEAR_PARENT_IDENTIFIER e.g. "PRI-25" (required)
*/

import fs from 'fs';
import path from 'path';
import https from 'https';

const DEFAULT_TASKS_FILE = '/Users/prnceb/Desktop/WORK/hello-world/specs/001-what-build-a/tasks.md';
const TASKS_FILE = (process.env.TASKS_FILE && process.env.TASKS_FILE.trim()) || DEFAULT_TASKS_FILE;
const LINEAR_GRAPHQL_URL = 'https://api.linear.app/graphql';

function fail(message, exitCode = 1) {
  console.error(message);
  process.exit(exitCode);
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value || String(value).trim() === '') {
    fail(`Missing required env var: ${name}`);
  }
  return value.trim();
}

const apiKey = requireEnv('LINEAR_API_KEY');
const teamName = requireEnv('LINEAR_TEAM_NAME');
const projectName = requireEnv('LINEAR_PROJECT_NAME');
const parentIdentifier = requireEnv('LINEAR_PARENT_IDENTIFIER'); // e.g., PRI-25
const targetStateName = (process.env.LINEAR_TARGET_STATE_NAME && process.env.LINEAR_TARGET_STATE_NAME.trim()) || 'In Progress';
const doneStateName = (process.env.LINEAR_DONE_STATE_NAME && process.env.LINEAR_DONE_STATE_NAME.trim()) || 'Done';
const updateExisting = ((process.env.LINEAR_UPDATE_EXISTING || 'true').toLowerCase() === 'true');

function graphqlRequest(query, variables) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query, variables });
    const url = new URL(LINEAR_GRAPHQL_URL);
    const req = https.request(
      {
        method: 'POST',
        hostname: url.hostname,
        path: url.pathname,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
          'Authorization': `${apiKey}`
        }
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (json.errors) {
              const msg = json.errors.map(e => e.message).join('; ');
              return reject(new Error(msg));
            }
            resolve(json.data);
          } catch (err) {
            reject(err);
          }
        });
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function getTeamByName(name) {
  const query = `
    query {
      teams(first: 200) { nodes { id name key } }
    }
  `;
  const data = await graphqlRequest(query, {});
  const nodes = data?.teams?.nodes ?? [];
  return nodes.find(t => t.name === name) || null;
}

function normalizeName(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

async function listAllProjects() {
  const query = `
    query {
      projects(first: 200) { nodes { id name } }
    }
  `;
  const data = await graphqlRequest(query, {});
  return data?.projects?.nodes ?? [];
}

async function getProjectByName(name) {
  const projects = await listAllProjects();
  const exact = projects.find(p => p.name === name);
  if (exact) return exact;
  const normalizedTarget = normalizeName(name);
  const ci = projects.find(p => normalizeName(p.name) === normalizedTarget);
  if (ci) return ci;
  return null;
}

function parseIdentifier(identifier) {
  // e.g., PRI-25 => key: PRI, number: 25
  const m = /^([A-Z]+)-(\d+)$/.exec(identifier.trim());
  if (!m) {
    fail(`Invalid parent identifier format: ${identifier}`);
  }
  return { teamKey: m[0] && m[1], number: Number(m[2]) };
}

async function getIssueIdByIdentifier(identifier) {
  const { teamKey, number } = parseIdentifier(identifier);
  const query = `
    query($teamKey: String!, $number: Float!) {
      issues(first: 1, filter: { number: { eq: $number }, team: { key: { eq: $teamKey } } }) {
        nodes { id identifier team { id name key } }
      }
    }
  `;
  const data = await graphqlRequest(query, { teamKey, number });
  const node = data?.issues?.nodes?.[0];
  if (!node) {
    fail(`Parent issue not found for ${identifier}`);
  }
  return node;
}

async function getTeamStatesById(teamId) {
  const query = `
    query($teamId: String!) {
      team(id: $teamId) { id states(first: 100) { nodes { id name type } } }
    }
  `;
  const data = await graphqlRequest(query, { teamId });
  const nodes = data?.team?.states?.nodes ?? [];
  return nodes;
}

async function createIssue({ teamId, projectId, parentId, title }) {
  const mutation = `
    mutation($input: IssueCreateInput!) {
      issueCreate(input: $input) {
        success
        issue { id identifier title }
      }
    }
  `;
  const variables = {
    input: {
      teamId,
      projectId,
      parentId,
      title
    }
  };
  const data = await graphqlRequest(mutation, variables);
  const res = data?.issueCreate;
  if (!res?.success) {
    fail(`Failed to create issue: ${title}`);
  }
  return res.issue;
}

async function listIssuesUnderParent(parentId) {
  const query = `
    query($parentId: ID!) {
      issues(first: 200, filter: { parent: { id: { eq: $parentId } } }) {
        nodes { id identifier title }
      }
    }
  `;
  const data = await graphqlRequest(query, { parentId });
  return data?.issues?.nodes ?? [];
}

function matchIssuesByTaskId(issues, taskId) {
  const needle = `T${taskId}:`;
  return issues.filter(i => (i?.title || '').startsWith(needle));
}

async function updateIssueState(issueId, stateId) {
  const mutation = `
    mutation($id: String!, $stateId: String) {
      issueUpdate(id: $id, input: { stateId: $stateId }) { success }
    }
  `;
  const data = await graphqlRequest(mutation, { id: issueId, stateId });
  const ok = data?.issueUpdate?.success;
  if (!ok) fail(`Failed to update state for issue ${issueId}`);
}

function parseTasksFromFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const lines = raw.split(/\r?\n/);
  const tasks = [];
  let currentCategory = '';

  for (const line of lines) {
    const phaseMatch = /^###\s+[^:]+:\s*(.+)$/.exec(line);
    if (phaseMatch) {
      currentCategory = phaseMatch[1].trim();
      continue;
    }
    const taskMatch = /^-\s*\[([ xX])\]\s*T(\d{3})(.*)$/.exec(line);
    if (taskMatch) {
      const box = taskMatch[1];
      const id = taskMatch[2];
      const rest = taskMatch[3].trim();
      const completed = /x/i.test(box);
      const hasParallel = /\[P\]/.test(rest);
      // remove [P] token and any leading separators
      const cleaned = rest.replace(/\[P\]\s*/g, '').trim();
      const description = cleaned.replace(/^:|^-\s*/, '').trim();
      const title = `T${id}: [${currentCategory}]${hasParallel ? ' [P]' : ''}: ${description}`;
      tasks.push({ id: `T${id}`, title, category: currentCategory, parallel: hasParallel, description, completed });
      continue;
    }

    // Support enumerated task format: "T001. Description..."
    const enumMatch = /^T(\d{3})\.\s+(.+)$/.exec(line);
    if (enumMatch) {
      const id = enumMatch[1];
      const description = enumMatch[2].trim();
      const title = `T${id}: [${currentCategory || 'Ordered'}]: ${description}`;
      tasks.push({ id: `T${id}`, title, category: currentCategory || 'Ordered', parallel: false, description, completed: false });
      continue;
    }
  }
  return tasks;
}

(async () => {
  try {
    if (!fs.existsSync(TASKS_FILE)) {
      fail(`Tasks file not found at ${TASKS_FILE}`);
    }

    const tasks = parseTasksFromFile(TASKS_FILE);
    if (!tasks.length) {
      fail('No tasks parsed from file.');
    }

    const parentIssue = await getIssueIdByIdentifier(parentIdentifier);
    const derivedTeam = parentIssue.team;
    const team = (await getTeamByName(teamName)) || derivedTeam;
    if (!team) fail(`Team not found by name and cannot derive from parent: ${teamName}`);
    if (team.id !== derivedTeam.id) {
      console.warn(`Warning: Provided team \"${teamName}\" differs from parent's team \"${derivedTeam.name}\". Using parent's team.`);
    }
    const project = await getProjectByName(projectName);
    if (!project) {
      const all = await listAllProjects();
      console.error('Project not found by name. Available projects:');
      for (const p of all) console.error(`- ${p.name}`);
      fail(`Project not found: ${projectName}`);
    }
    const parentId = parentIssue.id;

    const created = [];
    const teamStates = await getTeamStatesById(derivedTeam.id);
    const byName = (n) => String(n || '').toLowerCase();
    const findStateId = (preferredName, synonyms = []) => {
      const lowerPreferred = byName(preferredName);
      let s = teamStates.find(ss => byName(ss.name) === lowerPreferred);
      if (s) return s.id || null;
      for (const syn of synonyms) {
        const lowerSyn = byName(syn);
        s = teamStates.find(ss => {
          const ln = byName(ss.name);
          return ln === lowerSyn || ln.includes(lowerSyn);
        });
        if (s) return s.id || null;
      }
      return null;
    };

    // Prefer by workflow type if available
    const startedState = teamStates.find(s => String(s.type || '').toLowerCase() === 'started');
    const completedState = teamStates.find(s => String(s.type || '').toLowerCase() === 'completed');
    let targetStateId = startedState?.id || findStateId(targetStateName, ['in progress', 'active', 'doing', 'started']);
    let doneStateId = completedState?.id || findStateId(doneStateName, ['done', 'completed', 'complete', 'closed', 'resolved', 'finished']);

    console.log('Team states:');
    for (const s of teamStates) {
      console.log(`- ${s.name} (type=${s.type || 'n/a'}, id=${s.id})`);
    }
    console.log(`Selected target(In Progress) stateId=${targetStateId || 'null'}`);
    console.log(`Selected done stateId=${doneStateId || 'null'}`);
    if (!targetStateId) console.warn(`Warning: Target state "${targetStateName}" not found on team; skipping 'In Progress' updates.`);
    if (!doneStateId) console.warn(`Warning: Done state "${doneStateName}" not found on team; skipping 'Done' updates.`);
    const existingIssues = await listIssuesUnderParent(parentId);
    for (const t of tasks) {
      const desiredStateId = t.completed ? doneStateId : targetStateId;
      const matches = matchIssuesByTaskId(existingIssues, t.id.replace(/^T/, ''));
      if (matches.length > 0) {
        for (const m of matches) {
          console.log(`Exists: ${m.identifier} -> ${m.title}`);
          if (updateExisting && desiredStateId) {
            await updateIssueState(m.id, desiredStateId);
            console.log(`Updated state -> ${t.completed ? doneStateName : targetStateName}`);
          }
        }
        continue;
      }
      const issue = await createIssue({ teamId: derivedTeam.id, projectId: project.id, parentId, title: t.title });
      created.push(issue);
      console.log(`Created: ${issue.identifier} -> ${issue.title}`);
      if (desiredStateId) {
        await updateIssueState(issue.id, desiredStateId);
        console.log(`Set state -> ${t.completed ? doneStateName : targetStateName}`);
      }
    }

    console.log(`Done. Created ${created.length} sub-issues under ${parentIdentifier}.`);
  } catch (err) {
    fail(String(err?.message || err));
  }
})();


