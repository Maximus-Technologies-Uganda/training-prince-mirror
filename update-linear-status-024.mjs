#!/usr/bin/env node

/**
 * Update Linear Sub-Issues Status for 024-title-week-5
 * Changes all sub-issues under PRI-2532 from "Triage" to "In Progress"
 * 
 * Usage:
 *   export LINEAR_API_KEY="your-linear-api-key"
 *   node update-linear-status-024.mjs
 */

import https from 'https';

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;
const PARENT_ISSUE = 'PRI-2532';

if (!LINEAR_API_KEY) {
  console.error('❌ Error: LINEAR_API_KEY environment variable not set');
  console.error('');
  console.error('Usage:');
  console.error('  export LINEAR_API_KEY="your-api-key"');
  console.error('  node update-linear-status-024.mjs');
  console.error('');
  console.error('Get your API key from: https://linear.app/settings/api');
  process.exit(1);
}

/**
 * Make GraphQL request to Linear API
 */
function makeRequest(query) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query });

    const options = {
      hostname: 'api.linear.app',
      port: 443,
      path: '/graphql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Authorization': LINEAR_API_KEY
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse response: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

/**
 * Get parent issue ID
 */
async function getParentIssueId() {
  const query = `
    query {
      issue(id: "${PARENT_ISSUE}") {
        id
        identifier
        title
      }
    }
  `;
  
  const response = await makeRequest(query);
  if (response.errors) {
    throw new Error(`Failed to fetch parent issue: ${response.errors[0].message}`);
  }
  
  return response.data.issue.id;
}

/**
 * Get all child issues (sub-issues)
 */
async function getChildIssues(parentId) {
  const query = `
    query {
      issue(id: "${parentId}") {
        children(first: 50) {
          nodes {
            id
            identifier
            title
            state {
              id
              name
            }
          }
        }
      }
    }
  `;
  
  const response = await makeRequest(query);
  if (response.errors) {
    throw new Error(`Failed to fetch child issues: ${response.errors[0].message}`);
  }
  
  return response.data.issue.children.nodes || [];
}

/**
 * Get "In Progress" state ID from team
 */
async function getInProgressStateId(teamId) {
  const query = `
    query {
      workflows(first: 1, filter: { team: { id: { eq: "${teamId}" } } }) {
        nodes {
          states(first: 50) {
            nodes {
              id
              name
            }
          }
        }
      }
    }
  `;
  
  const response = await makeRequest(query);
  
  if (response.errors) {
    throw new Error(`Failed to fetch workflow states: ${response.errors[0].message}`);
  }
  
  const states = response.data?.workflows?.nodes?.[0]?.states?.nodes || [];
  const inProgressState = states.find(s => 
    s.name.toLowerCase() === 'in progress' || 
    s.name.toLowerCase() === 'in-progress'
  );
  
  if (!inProgressState) {
    throw new Error(`Could not find "In Progress" state. Available states: ${states.map(s => s.name).join(', ')}`);
  }
  
  return inProgressState.id;
}

/**
 * Get team ID from an issue
 */
async function getTeamId(issueId) {
  const query = `
    query {
      issue(id: "${issueId}") {
        team {
          id
        }
      }
    }
  `;
  
  const response = await makeRequest(query);
  if (response.errors) {
    throw new Error(`Failed to fetch team: ${response.errors[0].message}`);
  }
  
  return response.data.issue.team.id;
}

/**
 * Update issue state
 */
async function updateIssueState(issueId, stateId) {
  const query = `
    mutation {
      issueUpdate(id: "${issueId}", input: { stateId: "${stateId}" }) {
        issue {
          id
          identifier
          state {
            name
          }
        }
        success
      }
    }
  `;
  
  const response = await makeRequest(query);
  if (response.errors) {
    throw new Error(`${response.errors[0].message}`);
  }
  
  return response.data.issueUpdate.issue;
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log(`🚀 Updating Linear sub-issues status for 024-title-week-5`);
    console.log(`📍 Parent issue: ${PARENT_ISSUE}`);
    console.log('');

    // Get parent issue ID
    console.log('🔍 Fetching parent issue...');
    const parentId = await getParentIssueId();
    console.log(`✅ Parent ID: ${parentId}`);
    console.log('');

    // Get team ID
    console.log('🔍 Fetching team ID...');
    const teamId = await getTeamId(parentId);
    console.log(`✅ Team ID: ${teamId}`);
    console.log('');

    // Get "In Progress" state ID
    console.log('🔍 Fetching "In Progress" state ID...');
    const inProgressStateId = await getInProgressStateId(teamId);
    console.log(`✅ In Progress State ID: ${inProgressStateId}`);
    console.log('');

    // Get child issues
    console.log('🔍 Fetching child issues...');
    const childIssues = await getChildIssues(parentId);
    console.log(`✅ Found ${childIssues.length} sub-issues`);
    console.log('');

    if (childIssues.length === 0) {
      console.warn('⚠️  No child issues found under ' + PARENT_ISSUE);
      return;
    }

    // Update each issue's state
    console.log('📝 Updating states...');
    console.log('');

    let successCount = 0;
    let errorCount = 0;
    let alreadyInProgress = 0;

    for (const issue of childIssues) {
      try {
        // Check if already in progress
        if (issue.state.name.toLowerCase() === 'in progress' || issue.state.name.toLowerCase() === 'in-progress') {
          console.log(`⏭️  ${issue.identifier}: Already "In Progress"`);
          alreadyInProgress++;
        } else {
          const updated = await updateIssueState(issue.id, inProgressStateId);
          console.log(`✅ ${updated.identifier}: ${issue.state.name} → ${updated.state.name}`);
          successCount++;
        }
      } catch (error) {
        console.error(`❌ ${issue.identifier}: ${error.message}`);
        errorCount++;
      }
    }

    console.log('');
    console.log('═'.repeat(60));
    console.log(`📊 Summary:`);
    console.log(`   ✅ Updated: ${successCount}`);
    console.log(`   ⏭️  Already In Progress: ${alreadyInProgress}`);
    console.log(`   ❌ Failed: ${errorCount}`);
    console.log('═'.repeat(60));
    console.log('');
    console.log(`✨ All sub-issues under ${PARENT_ISSUE} status updated`);
    console.log(`🔗 View in Linear: https://linear.app/issues/PRI-2532`);
    console.log('');

    if (errorCount > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

main();

