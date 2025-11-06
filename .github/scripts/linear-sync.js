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

// Query to find an issue by its key (e.g., PRI-1545)
// Uses team and number which are valid Linear API filters
async function findIssueByKey(issueKey) {
  console.log(`  🔍 Looking up: ${issueKey}`);
  
  // Parse the key: "PRI-1545" -> teamKey="PRI", number=1545
  const match = issueKey.match(/^([A-Z]+)-(\d+)$/);
  if (!match) {
    throw new Error(`Invalid issue key format: ${issueKey}. Expected: TEAM-NUMBER`);
  }
  
  const [, teamKey, numberStr] = match;
  const number = parseInt(numberStr, 10);
  console.log(`    Team: ${teamKey}, Number: ${number}`);
  
  // Query for issues in the team - increase batch to 1000 to ensure we get it
  const data = await graphqlFetch(
    `query FindIssueByNumber($teamKey: String!) {
      issues(filter: { team: { key: { eq: $teamKey } } }, first: 1000) {
        nodes {
          id
          identifier
          number
          title
          parent {
            id
            identifier
          }
        }
      }
    }`,
    { teamKey }
  );
  
  // Filter by number in JavaScript
  const issues = data.issues?.nodes || [];
  console.log(`    Found ${issues.length} total issues in team ${teamKey}`);
  
  // Show range of issue numbers for debugging
  if (issues.length > 0) {
    const numbers = issues.map(i => i.number).sort((a, b) => a - b);
    const min = numbers[0];
    const max = numbers[numbers.length - 1];
    console.log(`    Issue number range: ${min} - ${max}`);
    
    // Show issues near our target number for debugging
    const nearby = issues
      .filter(i => Math.abs(i.number - number) <= 5)
      .map(i => i.identifier)
      .join(', ');
    if (nearby) {
      console.log(`    Issues near #${number}: ${nearby}`);
    }
  }
  
  const issue = issues.find(issue => issue.number === number);
  if (!issue) {
    const availableNumbers = issues.map(i => i.identifier).slice(0, 15).join(', ');
    throw new Error(`Issue ${issueKey} not found in team ${teamKey}. Available issues: ${availableNumbers}${issues.length > 15 ? '...' : ''}`);
  }
  
  console.log(`    ✓ Found: ${issue.identifier} - ${issue.title}`);
  return issue;
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
    let parentIssueKey = null;
    if (fs.existsSync(linearParentFile)) {
      parentIssueKey = fs.readFileSync(linearParentFile, 'utf8').trim();
      console.log(`\n📌 PARENT ISSUE REQUIRED: ${parentIssueKey}`);
      
      // Parent issue is REQUIRED if .linear-parent exists
      const parentIssue = await findIssueByKey(parentIssueKey);
      if (!parentIssue) {
        throw new Error(`CRITICAL: Parent issue ${parentIssueKey} is REQUIRED but was not found in Linear`);
      }
      
      parentIssueId = parentIssue.id;
      console.log(`✅ Parent issue found: ${parentIssueKey} (ID: ${parentIssueId})`);
    }

    const markdown = fs.readFileSync(file, 'utf8');
    const tasks = parseTasksMarkdown(markdown);
    const mapPath = path.join(specDir, 'linear-map.json');
    let map = {};
    if (fs.existsSync(mapPath)) {
      try { map = JSON.parse(fs.readFileSync(mapPath, 'utf8')); } catch {}
    }
    let changed = false;
    console.log(`\n📋 Processing ${tasks.length} tasks from ${file.replace(process.cwd(), '.')}`);
    for (const task of tasks) {
      if (task.key) {
        // Already linked to a Linear issue via key
        continue;
      }
      const existing = Object.entries(map).find(([, v]) => v.title === task.title);
      if (existing) continue;
      
      // Create issue as sub-issue if parentIssueId exists
      const issue = await ensureSubIssue(teamId, parentIssueId, task.title);
      
      map[issue.identifier] = { title: task.title };
      changed = true;
      const parentInfo = parentIssueId ? ` under parent ${parentIssueKey}` : ' (standalone)';
      console.log(`  ✓ ${issue.identifier}: ${task.title}${parentInfo}`);
    }
    if (changed) {
      fs.writeFileSync(mapPath, JSON.stringify(map, null, 2));
      console.log(`\n✅ Saved mapping: ${mapPath}`);
    }
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});


