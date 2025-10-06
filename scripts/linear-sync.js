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
  const qTeam = `
    query($teamKey: String!) { teamByKey(key: $teamKey) { id name key } }
  `;
  const dTeam = await graphqlRequest(qTeam, { teamKey });
  const team = dTeam?.teamByKey;
  if (!team) fail(`Team not found for key ${teamKey}`);

  const qIssue = `
    query($teamId: String!, $number: Int!) {
      issueByNumber(teamId: $teamId, number: $number) {
        id identifier team { id name key } project { id name } children(first: 500) { nodes { id title } }
      }
    }
  `;
  const dIssue = await graphqlRequest(qIssue, { teamId: team.id, number });
  const issue = dIssue?.issueByNumber;
  if (!issue) fail(`Parent issue not found for ${identifier}`);
  return issue;
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
    const taskMatch = /^-\s*\[[ xX]\]\s*T(\d{3})(.*)$/.exec(line);
    if (taskMatch) {
      const id = taskMatch[1];
      const rest = taskMatch[2].trim();
      const hasParallel = /\[P\]/.test(rest);
      // remove [P] token and any leading separators
      const cleaned = rest.replace(/\[P\]\s*/g, '').trim();
      const description = cleaned.replace(/^:|^-\s*/, '').trim();
      const title = `T${id}: [${currentCategory}]${hasParallel ? ' [P]' : ''}: ${description}`;
      tasks.push({ id: `T${id}`, title, category: currentCategory, parallel: hasParallel, description });
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
    const project = parentIssue.project || (await getProjectByName(projectName));
    if (!project) {
      const all = await listAllProjects();
      console.error('Project not found by name. Available projects:');
      for (const p of all) console.error(`- ${p.name}`);
      fail(`Project not found: ${projectName}`);
    }
    const parentId = parentIssue.id;

    const existingTitles = new Set((parentIssue.children?.nodes || []).map(n => n.title));
    const created = [];
    for (const t of tasks) {
      if (existingTitles.has(t.title)) {
        console.log(`Skip existing: ${t.title}`);
        continue;
      }
      const issue = await createIssue({
        teamId: derivedTeam.id,
        projectId: project.id,
        parentId,
        title: t.title
      });
      created.push(issue);
      console.log(`Created: ${issue.identifier} -> ${issue.title}`);
    }

    console.log(`Done. Created ${created.length} sub-issues under ${parentIdentifier}.`);
  } catch (err) {
    fail(String(err?.message || err));
  }
})();


