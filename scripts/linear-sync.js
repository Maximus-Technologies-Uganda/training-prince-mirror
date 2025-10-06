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

const TASKS_FILE = '/Users/prnceb/Desktop/WORK/hello-world/specs/001-what-build-a/tasks.md';
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
          'Authorization': `Bearer ${apiKey}`
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
    query($name: String!) {
      teams(first: 50, filter: { name: { eq: $name } }) {
        nodes { id name key }
      }
    }
  `;
  const data = await graphqlRequest(query, { name });
  const nodes = data?.teams?.nodes ?? [];
  return nodes.find(t => t.name === name) || null;
}

async function getProjectByName(name) {
  const query = `
    query($name: String!) {
      projects(first: 200, filter: { name: { eq: $name } }) {
        nodes { id name }
      }
    }
  `;
  const data = await graphqlRequest(query, { name });
  const nodes = data?.projects?.nodes ?? [];
  return nodes.find(p => p.name === name) || null;
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
        nodes { id identifier }
      }
    }
  `;
  const data = await graphqlRequest(query, { teamKey, number });
  const node = data?.issues?.nodes?.[0];
  if (!node) {
    fail(`Parent issue not found for ${identifier}`);
  }
  return node.id;
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

    const team = await getTeamByName(teamName);
    if (!team) fail(`Team not found: ${teamName}`);
    const project = await getProjectByName(projectName);
    if (!project) fail(`Project not found: ${projectName}`);
    const parentId = await getIssueIdByIdentifier(parentIdentifier);

    const created = [];
    for (const t of tasks) {
      const issue = await createIssue({
        teamId: team.id,
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


