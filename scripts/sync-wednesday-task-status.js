#!/usr/bin/env node

/**
 * Syncs completed tasks to Linear
 * Reads tasks.md for completed items (marked with [x])
 * Updates corresponding Linear issues to "Done" status
 * Usage: LINEAR_API_KEY=xxx node scripts/sync-wednesday-task-status.js
 */

import fs from 'fs';
import https from 'https';

const TASKS_FILE = 'specs/013-title-wednesday-spec/tasks.md';
const MAPPING_FILE = 'specs/013-title-wednesday-spec/linear-map.json';
const API_KEY = process.env.LINEAR_API_KEY;

if (!API_KEY) {
  console.error('❌ Error: LINEAR_API_KEY environment variable not set');
  process.exit(1);
}

if (!fs.existsSync(TASKS_FILE)) {
  console.error(`❌ Error: Tasks file not found: ${TASKS_FILE}`);
  process.exit(1);
}

if (!fs.existsSync(MAPPING_FILE)) {
  console.error(`❌ Error: Mapping file not found: ${MAPPING_FILE}`);
  console.error('   Run create-wednesday-sub-issues.js first');
  process.exit(1);
}

function parseTasksMarkdown(markdown) {
  const lines = markdown.split(/\r?\n/);
  const tasks = [];
  for (const line of lines) {
    // Match: - [x] Task Title or - [ ] Task Title
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

async function getIssue(issueId) {
  const query = `
    query($id: String!) {
      issue(id: $id) {
        id
        identifier
        title
        team { id }
        state { id name }
      }
    }
  `;
  const data = await graphqlRequest(query, { id: issueId });
  return data?.issue;
}

function findStateId(states, preferredName) {
  const lowerPreferred = String(preferredName).toLowerCase();
  const state = states.find(s => String(s.name).toLowerCase() === lowerPreferred);
  return state?.id || null;
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
    
    console.log(`✅ Found ${tasks.length} tasks\n`);
    
    console.log('📖 Reading mapping file...');
    const mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf8'));
    
    const completedTasks = tasks.filter(t => t.done);
    if (completedTasks.length === 0) {
      console.log('✅ No completed tasks to sync\n');
      return;
    }
    
    console.log(`📊 Found ${completedTasks.length} completed task(s)\n`);
    
    console.log('🔄 Syncing to Linear...\n');
    let synced = 0;
    
    for (const task of completedTasks) {
      // Find mapping for this task
      const mappingEntry = Object.entries(mapping).find(([_, v]) => v.title === task.title);
      if (!mappingEntry) {
        console.warn(`⚠️  Task not in mapping: ${task.title}`);
        continue;
      }
      
      const [linearId, entry] = mappingEntry;
      
      try {
        // Get current issue state
        const issue = await getIssue(entry.id);
        if (!issue) {
          console.error(`❌ Issue not found: ${linearId}`);
          continue;
        }
        
        // Get team states
        const states = await getTeamStates(issue.team.id);
        const doneStateId = findStateId(states, 'Done');
        
        if (!doneStateId) {
          console.warn(`⚠️  "Done" state not found on team for ${linearId}`);
          continue;
        }
        
        // Check if already "Done"
        if (issue.state.name.toLowerCase() === 'done') {
          console.log(`  ✓ Already Done: ${linearId}`);
          synced++;
          continue;
        }
        
        // Update to "Done"
        await updateIssueState(entry.id, doneStateId);
        console.log(`  ✅ Synced to Done: ${linearId} - ${task.title}`);
        synced++;
        
      } catch (err) {
        console.error(`  ❌ Failed to sync ${linearId}: ${err.message}`);
      }
    }
    
    console.log(`\n✨ Done! Synced ${synced}/${completedTasks.length} tasks\n`);
    
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
    process.exit(1);
  }
}

main();
