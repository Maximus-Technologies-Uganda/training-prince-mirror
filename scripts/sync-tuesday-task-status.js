#!/usr/bin/env node

/**
 * Syncs completed tasks to Linear for Tuesday (PRI-1112)
 * Reads tasks.md for completed items (marked with [x])
 * Updates corresponding Linear issues to "Done" status
 * Usage: LINEAR_API_KEY=xxx node scripts/sync-tuesday-task-status.js
 */

import fs from 'fs';
import https from 'https';

const TASKS_FILE = 'specs/012-title-tuesday-spec/tasks.md';
const MAPPING_FILE = 'specs/012-title-tuesday-spec/linear-map.json';
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
  console.error('   Please download linear-map.json from GitHub Actions artifact');
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

async function graphqlRequest(query, variables = {}) {
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
              const errorMsg = json.errors.map(e => {
                if (e.message) return e.message;
                return JSON.stringify(e);
              }).join('; ');
              reject(new Error(errorMsg));
            } else {
              resolve(json.data);
            }
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

async function getIssue(issueId) {
  const query = `
    query GetIssue($id: String!) {
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

async function getTeamStates(teamId) {
  const query = `
    query GetTeamStates($teamId: String!) {
      team(id: $teamId) {
        states(first: 100) {
          nodes { id name }
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

async function updateIssueState(issueId, stateId) {
  const query = `
    mutation UpdateIssue($id: String!, $stateId: String!) {
      issueUpdate(id: $id, stateId: $stateId) {
        success
        issue {
          id
          identifier
          state { id name }
        }
      }
    }
  `;
  const data = await graphqlRequest(query, { id: issueId, stateId });
  return data?.issueUpdate?.success;
}

async function main() {
  try {
    console.log('🚀 Syncing Tuesday (PRI-1112) Tasks to Linear\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('📋 Reading tasks.md...');
    const markdown = fs.readFileSync(TASKS_FILE, 'utf8');
    const tasks = parseTasksMarkdown(markdown);
    
    console.log(`✅ Found ${tasks.length} tasks\n`);
    
    console.log('📖 Reading mapping file...');
    const mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf8'));
    console.log(`✅ Parent Issue: ${mapping.parent}\n`);
    
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
      const mappingEntry = mapping.tasks?.find(t => t.title === task.title);
      if (!mappingEntry) {
        console.warn(`⚠️  Task not in mapping: ${task.title}`);
        continue;
      }
      
      try {
        // Get current issue state
        const issue = await getIssue(mappingEntry.linear_id);
        if (!issue) {
          console.error(`❌ Issue not found: ${mappingEntry.linear_id}`);
          continue;
        }
        
        // Get team states
        const states = await getTeamStates(issue.team.id);
        const doneStateId = findStateId(states, 'Done');
        
        if (!doneStateId) {
          console.warn(`⚠️  "Done" state not found on team for ${mappingEntry.linear_id}`);
          continue;
        }
        
        // Check if already "Done"
        if (issue.state.name.toLowerCase() === 'done') {
          console.log(`  ✓ Already Done: ${mappingEntry.linear_id}`);
          synced++;
          continue;
        }
        
        // Update to "Done"
        const success = await updateIssueState(issue.id, doneStateId);
        if (success) {
          console.log(`  ✅ Synced to Done: ${mappingEntry.linear_id}`);
          synced++;
        } else {
          console.error(`  ❌ Update failed for ${mappingEntry.linear_id}`);
        }
        
      } catch (err) {
        console.error(`  ❌ Failed to sync ${mappingEntry.linear_id}: ${err.message}`);
      }
    }
    
    console.log(`\n✨ Done! Synced ${synced}/${completedTasks.length} tasks`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
    process.exit(1);
  }
}

main();
