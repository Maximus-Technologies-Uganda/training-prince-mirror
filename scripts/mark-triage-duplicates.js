#!/usr/bin/env node

/**
 * Marks all Triage issues as duplicates in Linear
 * This removes them from Triage and archives them
 * Usage: LINEAR_API_KEY=xxx node scripts/mark-triage-duplicates.js
 */

import https from 'https';

const API_KEY = process.env.LINEAR_API_KEY;

if (!API_KEY) {
  console.error('❌ Error: LINEAR_API_KEY environment variable not set');
  process.exit(1);
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

async function getTriageIssues() {
  const query = `
    query GetTriageIssues($after: String) {
      issues(filter: { state: { name: { eq: "Triage" } } }, first: 100, after: $after) {
        nodes {
          id
          identifier
          title
          state { id name }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;
  
  let allIssues = [];
  let hasNextPage = true;
  let endCursor = null;
  let pageCount = 0;
  
  console.log('  📄 Fetching pages...');
  
  while (hasNextPage) {
    pageCount++;
    console.log(`    Page ${pageCount}: fetching...`);
    
    const data = await graphqlRequest(query, { after: endCursor });
    const issues = data?.issues;
    
    if (!issues || !issues.nodes || issues.nodes.length === 0) {
      console.log(`    Page ${pageCount}: No more issues found`);
      break;
    }
    
    allIssues = allIssues.concat(issues.nodes);
    console.log(`    Page ${pageCount}: ✅ Got ${issues.nodes.length} issues (total: ${allIssues.length})`);
    
    hasNextPage = issues.pageInfo?.hasNextPage || false;
    endCursor = issues.pageInfo?.endCursor || null;
    
    if (!hasNextPage) {
      console.log(`    No more pages`);
      break;
    }
  }
  
  console.log(`  Total fetched: ${allIssues.length} Triage issue(s)\n`);
  return allIssues;
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

async function getIssueTeam(issueId) {
  const query = `
    query GetIssue($id: String!) {
      issue(id: $id) {
        id
        team { id }
        state { id }
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
    mutation UpdateIssue($issueId: String!, $stateId: String!) {
      issueUpdate(id: $issueId, input: { stateId: $stateId }) {
        success
        issue {
          id
          identifier
          state { id name }
        }
      }
    }
  `;
  const data = await graphqlRequest(query, { issueId, stateId });
  return data?.issueUpdate?.success;
}

async function main() {
  try {
    console.log('🚀 Marking Triage Issues as Duplicates\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('📋 Fetching all Triage issues...');
    const issues = await getTriageIssues();
    
    if (!issues || issues.length === 0) {
      console.log('✅ No Triage issues found!\n');
      return;
    }
    
    console.log(`✅ Found ${issues.length} Triage issue(s)\n`);
    
    console.log('🔄 Processing issues...\n');
    let marked = 0;
    let failed = 0;
    
    for (const issue of issues) {
      try {
        // Get the issue's team to find available states
        const issueData = await getIssueTeam(issue.id);
        const states = await getTeamStates(issueData.team.id);
        
        // Try to find a "Duplicate" or "Cancelled" state
        let targetStateId = findStateId(states, 'Duplicate');
        if (!targetStateId) {
          targetStateId = findStateId(states, 'Cancelled');
        }
        if (!targetStateId) {
          targetStateId = findStateId(states, 'Closed');
        }
        if (!targetStateId) {
          targetStateId = findStateId(states, 'Done');
        }
        
        if (!targetStateId) {
          console.warn(`⚠️  No suitable state found for ${issue.identifier}`);
          failed++;
          continue;
        }
        
        // Update to duplicate/cancelled state
        const success = await updateIssueState(issue.id, targetStateId);
        if (success) {
          console.log(`  ✅ Marked as Duplicate: ${issue.identifier}`);
          marked++;
        } else {
          console.error(`  ❌ Failed to mark ${issue.identifier}`);
          failed++;
        }
        
      } catch (err) {
        console.error(`  ❌ Error processing ${issue.identifier}: ${err.message}`);
        failed++;
      }
    }
    
    console.log(`\n✨ Done! Marked ${marked}/${issues.length} issues as duplicates`);
    if (failed > 0) {
      console.log(`⚠️  ${failed} issues failed to update`);
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
    process.exit(1);
  }
}

main();
