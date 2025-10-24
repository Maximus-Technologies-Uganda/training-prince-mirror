#!/usr/bin/env node

/**
 * Creates Linear sub-issues under PRI-289 from tasks.md
 * Sets all issues to "In Progress"
 * Saves mapping file for status tracking
 * Usage: LINEAR_API_KEY=xxx node scripts/create-wednesday-sub-issues.js
 */

import fs from 'fs';
import https from 'https';
import path from 'path';

const TASKS_FILE = 'specs/013-title-wednesday-spec/tasks.md';
const MAPPING_FILE = 'specs/013-title-wednesday-spec/linear-map.json';
const PARENT_ISSUE_ID = 'PRI-289';
const API_KEY = process.env.LINEAR_API_KEY;

if (!API_KEY) {
  console.error('❌ Error: LINEAR_API_KEY environment variable not set');
  process.exit(1);
}

if (!fs.existsSync(TASKS_FILE)) {
  console.error(`❌ Error: Tasks file not found: ${TASKS_FILE}`);
  process.exit(1);
}

function parseTasksMarkdown(markdown) {
  const lines = markdown.split(/\r?\n/);
  const tasks = [];
  for (const line of lines) {
    // Match: - [ ] Task Title or - [x] Task Title
    const m = /^- \[( |x)\] (.+)$/.exec(line.trim());
    if (m) {
      const done = m[1] === 'x';
      const title = m[2].trim();
      tasks.push({ title, done });
    }
  }
  return tasks;
}

async function graphqlRequest(query, variables) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query, variables });
    const req = https.request(
      {
        method: 'POST',
        hostname: 'api.linear.app',
        path: '/graphql',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
          'Authorization': API_KEY
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

async function getParentIssueId(identifier) {
  const query = `
    query($identifier: String!) {
      issue(id: $identifier) {
        id
        identifier
        team { id name key }
      }
    }
  `;
  const data = await graphqlRequest(query, { identifier });
  if (!data?.issue) {
    throw new Error(`Parent issue not found: ${identifier}`);
  }
  return data.issue;
}

async function getTeamStates(teamId) {
  const query = `
    query($teamId: String!) {
      team(id: $teamId) {
        states(first: 100) {
          nodes { id name type }
        }
      }
    }
  `;
  const data = await graphqlRequest(query, { teamId });
  return data?.team?.states?.nodes ?? [];
}

function findStateId(states, preferredName) {
  const lowerPreferred = String(preferredName).toLowerCase();
  const state = states.find(s => String(s.name).toLowerCase() === lowerPreferred);
  return state?.id || null;
}

async function createSubIssue(teamId, parentId, title) {
  const query = `
    mutation($input: IssueCreateInput!) {
      issueCreate(input: $input) {
        success
        issue {
          id
          identifier
          title
        }
      }
    }
  `;
  const data = await graphqlRequest(query, {
    input: {
      teamId,
      title,
      parentId
    }
  });
  return data.issueCreate.issue;
}

async function updateIssueState(issueId, stateId) {
  const query = `
    mutation($input: IssueUpdateInput!) {
      issueUpdate(id: $input) {
        success
      }
    }
  `;
  await graphqlRequest(query, {
    input: {
      id: issueId,
      stateId
    }
  });
}

async function main() {
  try {
    console.log('📋 Reading tasks.md...');
    const markdown = fs.readFileSync(TASKS_FILE, 'utf8');
    const tasks = parseTasksMarkdown(markdown);
    
    if (tasks.length === 0) {
      console.error('❌ No tasks parsed from file');
      process.exit(1);
    }
    
    console.log(`✅ Found ${tasks.length} tasks\n`);
    
    console.log('🔍 Getting parent issue...');
    const parentIssue = await getParentIssueId(PARENT_ISSUE_ID);
    console.log(`✅ Parent issue: ${parentIssue.identifier} (Team: ${parentIssue.team.name})\n`);
    
    console.log('🔍 Getting team states...');
    const states = await getTeamStates(parentIssue.team.id);
    const inProgressStateId = findStateId(states, 'In Progress');
    if (!inProgressStateId) {
      console.warn('⚠️  "In Progress" state not found on team');
    }
    
    console.log('🚀 Creating sub-issues...\n');
    const created = [];
    const mapping = {};
    
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      try {
        const issue = await createSubIssue(parentIssue.team.id, parentIssue.id, task.title);
        created.push(issue);
        mapping[issue.identifier] = {
          title: task.title,
          id: issue.id,
          linearId: issue.identifier
        };
        
        // Set to "In Progress"
        if (inProgressStateId) {
          await updateIssueState(issue.id, inProgressStateId);
          console.log(`  ✅ [${i + 1}/${tasks.length}] ${issue.identifier}: ${issue.title} → In Progress`);
        } else {
          console.log(`  ✅ [${i + 1}/${tasks.length}] ${issue.identifier}: ${issue.title}`);
        }
      } catch (err) {
        console.error(`  ❌ [${i + 1}/${tasks.length}] Failed: ${task.title}`);
        console.error(`     Error: ${err.message}`);
      }
    }
    
    // Save mapping file
    fs.writeFileSync(MAPPING_FILE, JSON.stringify(mapping, null, 2));
    console.log(`\n💾 Saved mapping to ${MAPPING_FILE}`);
    
    console.log(`\n✨ Done! Created ${created.length}/${tasks.length} sub-issues under ${PARENT_ISSUE_ID}`);
    console.log(`✅ All issues set to "In Progress"\n`);
    
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
    process.exit(1);
  }
}

main();
