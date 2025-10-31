#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function findTaskFiles(startDir) {
  const files = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.git')) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && entry.name.toLowerCase() === 'tasks.md') files.push(full);
    }
  }
  walk(startDir);
  return files;
}

function parseTasksMarkdown(markdown) {
  const lines = markdown.split(/\r?\n/);
  const tasks = [];
  for (const line of lines) {
    const m = /^[-*] \[( |x)\] (.+)$/.exec(line.trim());
    if (m) {
      const done = m[1] === 'x';
      const text = m[2].trim();
      // Optional inline key ref: [ABC-123]
      const keyMatch = text.match(/\[([A-Z]+-\d+)\]$/);
      const key = keyMatch ? keyMatch[1] : null;
      const title = key ? text.replace(/\s*\[[A-Z]+-\d+\]$/, '').trim() : text;
      tasks.push({ title, done, key });
    }
  }
  return tasks;
}

async function graphqlFetch(query, variables) {
  const res = await fetch('https://api.linear.app/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': process.env.LINEAR_API_KEY || ''
    },
    body: JSON.stringify({ query, variables })
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Linear API error ${res.status}: ${body}`);
  }
  const json = await res.json();
  if (json.errors && json.errors.length) {
    throw new Error(`Linear API errors: ${JSON.stringify(json.errors)}`);
  }
  return json.data;
}

// Query to find an issue by its identifier (e.g., PRI-1545)
async function findIssueByIdentifier(identifier) {
  const data = await graphqlFetch(
    `query FindIssue($filter: IssueFilter!) {
      issues(filter: $filter, first: 1) {
        nodes {
          id
          identifier
          title
          parentId
        }
      }
    }`,
    { filter: { identifier: { eq: identifier } } }
  );
  return data.issues?.nodes?.[0] || null;
}

async function ensureSubIssue(teamId, parentId, title) {
  const data = await graphqlFetch(
    `mutation CreateIssue($input: IssueCreateInput!) { 
      issueCreate(input: $input) { 
        success 
        issue { 
          id 
          identifier 
        } 
      } 
    }`,
    { input: { teamId, title, parentId } }
  );
  return data.issueCreate.issue;
}

async function resolveTeamIdFromEnv() {
  const explicitId = process.env.LINEAR_TEAM_ID;
  if (explicitId) return explicitId;
  const key = process.env.LINEAR_TEAM_KEY;
  if (key) {
    const data = await graphqlFetch(
      `query TeamByKey($key: String!) {
        teams(filter: { key: { eq: $key } }) { nodes { id key name } }
      }`,
      { key }
    );
    const node = data.teams?.nodes?.[0];
    if (!node) throw new Error(`No Linear team found for key ${key}`);
    return node.id;
  }
  // Fallback: pick the first team the API key has access to
  const fallback = await graphqlFetch(
    `query ViewerTeams { viewer { teams(first: 1) { nodes { id key name } } } }`,
    {}
  );
  const node = fallback.viewer?.teams?.nodes?.[0];
  if (!node) throw new Error('Provide LINEAR_TEAM_ID or LINEAR_TEAM_KEY');
  console.log(`No team provided; using default team ${node.key} (${node.name}).`);
  return node.id;
}

async function run() {
  const apiKey = process.env.LINEAR_API_KEY;
  if (!apiKey) {
    console.error('Missing LINEAR_API_KEY');
    process.exit(1);
  }
  const teamId = await resolveTeamIdFromEnv();
  const repoRoot = path.resolve(__dirname, '..', '..');
  const taskFiles = findTaskFiles(repoRoot);
  if (taskFiles.length === 0) {
    console.log('No tasks.md files found.');
    return;
  }

  for (const file of taskFiles) {
    const specDir = path.dirname(file);
    const linearParentFile = path.join(specDir, '.linear-parent');
    
    // Check for parent issue reference
    let parentIssueId = null;
    if (fs.existsSync(linearParentFile)) {
      const parentIdentifier = fs.readFileSync(linearParentFile, 'utf8').trim();
      console.log(`Found parent issue reference: ${parentIdentifier}`);
      const parentIssue = await findIssueByIdentifier(parentIdentifier);
      if (parentIssue) {
        parentIssueId = parentIssue.id;
        console.log(`Resolved parent issue ID: ${parentIssueId}`);
      } else {
        throw new Error(`Parent issue ${parentIdentifier} not found in Linear`);
      }
    }

    const markdown = fs.readFileSync(file, 'utf8');
    const tasks = parseTasksMarkdown(markdown);
    const mapPath = path.join(specDir, 'linear-map.json');
    let map = {};
    if (fs.existsSync(mapPath)) {
      try { map = JSON.parse(fs.readFileSync(mapPath, 'utf8')); } catch {}
    }
    let changed = false;
    for (const task of tasks) {
      if (task.key) {
        // Already linked to a Linear issue via key
        continue;
      }
      const existing = Object.entries(map).find(([, v]) => v.title === task.title);
      if (existing) continue;
      
      // Create issue as sub-issue if parentIssueId exists, otherwise as standalone
      const issue = parentIssueId 
        ? await ensureSubIssue(teamId, parentIssueId, task.title)
        : await ensureSubIssue(teamId, null, task.title);
      
      map[issue.identifier] = { title: task.title };
      changed = true;
      const parentInfo = parentIssueId ? ` under parent ${linearParentFile}` : '';
      console.log(`Created Linear issue ${issue.identifier} for task: ${task.title}${parentInfo}`);
    }
    if (changed) {
      fs.writeFileSync(mapPath, JSON.stringify(map, null, 2));
      console.log(`Updated mapping file: ${mapPath}`);
    }
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});


