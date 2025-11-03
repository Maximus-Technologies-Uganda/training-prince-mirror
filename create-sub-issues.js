#!/usr/bin/env node
/**
 * Update Linear sub-issues status from Triage to In Progress
 * Usage: LINEAR_API_KEY=xxx node create-sub-issues.js
 */

import fs from 'fs';

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;
if (!LINEAR_API_KEY) {
  console.error('❌ Error: LINEAR_API_KEY environment variable is required');
  console.error('Usage: LINEAR_API_KEY=your_key node create-sub-issues.js');
  process.exit(1);
}

async function graphqlFetch(query, variables) {
  const res = await fetch('https://api.linear.app/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': LINEAR_API_KEY
    },
    body: JSON.stringify({ query, variables })
  });
  const json = await res.json();
  if (json.errors) {
    throw new Error(`Linear API error: ${JSON.stringify(json.errors)}`);
  }
  return json.data;
}

async function updateSubIssuesToInProgress(parentKey) {
  console.log(`\n🔍 Finding all sub-issues of ${parentKey}...\n`);
  
  // Extract number from issue identifier (e.g., 2338 from PRI-2338)
  const match = parentKey.match(/^([A-Z]+)-(\d+)$/);
  if (!match) throw new Error(`Invalid issue key: ${parentKey}`);
  
  const [, teamKey, numberStr] = match;
  const number = parseInt(numberStr, 10);
  
  // Find parent issue
  let allIssues = [];
  let after = null;
  let hasMore = true;
  
  while (hasMore) {
    const query = after 
      ? `query FindIssues($after: String) {
          issues(first: 100, after: $after) {
            pageInfo { hasNextPage endCursor }
            nodes { id identifier number title team { id key } parent { id } }
          }
        }`
      : `query FindIssues {
          issues(first: 100) {
            pageInfo { hasNextPage endCursor }
            nodes { id identifier number title team { id key } parent { id } }
          }
        }`;
    
    const data = await graphqlFetch(query, after ? { after } : {});
    allIssues = allIssues.concat(data.issues.nodes);
    
    hasMore = data.issues.pageInfo.hasNextPage;
    after = data.issues.pageInfo.endCursor;
  }
  
  const parentIssue = allIssues.find(i => i.number === number && i.team.key === teamKey);
  if (!parentIssue) {
    throw new Error(`Parent issue ${parentKey} not found`);
  }
  
  console.log(`✅ Found parent: ${parentIssue.identifier}\n`);
  
  // Find all sub-issues
  const subIssues = allIssues.filter(i => i.parent && i.parent.id === parentIssue.id);
  console.log(`📋 Found ${subIssues.length} sub-issues to update\n`);
  
  if (subIssues.length === 0) {
    console.log('⚠️  No sub-issues found!');
    return;
  }
  
  // Get the "In Progress" state ID using team ID from parent issue
  const statesData = await graphqlFetch(
    `query GetWorkflowStates($teamId: String!) {
      team(id: $teamId) {
        states(first: 100) {
          nodes { id name }
        }
      }
    }`,
    { teamId: parentIssue.team.id }
  );
  
  let inProgressStateId = null;
  for (const state of statesData.team.states.nodes) {
    if (state.name.toLowerCase() === 'in progress') {
      inProgressStateId = state.id;
      break;
    }
  }
  
  if (!inProgressStateId) {
    throw new Error('Could not find "In Progress" state');
  }
  
  console.log(`🔄 Updating ${subIssues.length} issues to "In Progress"...\n`);
  
  let updated = 0;
  for (const issue of subIssues) {
    try {
      await graphqlFetch(
        `mutation UpdateIssue($input: IssueUpdateInput!) {
          issueUpdate(input: $input) {
            success
            issue { id identifier }
          }
        }`,
        { input: { id: issue.id, stateId: inProgressStateId } }
      );
      console.log(`✅ Updated ${issue.identifier} to In Progress`);
      updated++;
    } catch (err) {
      console.error(`❌ Failed to update ${issue.identifier}: ${err.message}`);
    }
  }
  
  console.log(`\n🎉 Summary: Updated ${updated}/${subIssues.length} issues to In Progress`);
}

async function main() {
  try {
    const parentPath = './specs/017-week-4-finisher/.linear-parent';
    if (!fs.existsSync(parentPath)) {
      throw new Error(`Parent file not found: ${parentPath}`);
    }
    
    const parentKey = fs.readFileSync(parentPath, 'utf8').trim();
    await updateSubIssuesToInProgress(parentKey);
    
  } catch (err) {
    console.error(`\n❌ Error: ${err.message}`);
    process.exit(1);
  }
}

main();
