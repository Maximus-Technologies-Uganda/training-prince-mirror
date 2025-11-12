#!/usr/bin/env node

/**
 * Update Linear Issue Status for 022-title-week-5 Tasks
 * Changes T010, T022, T025, T026 from Triage to In Progress
 */

import https from 'https';

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;

if (!LINEAR_API_KEY) {
  console.error('❌ Error: LINEAR_API_KEY environment variable not set');
  console.error('Usage: export LINEAR_API_KEY="your-key" && node update-linear-status-022.mjs');
  process.exit(1);
}

// Parent issue - we'll find all sub-issues under this
const PARENT_ISSUE = 'PRI-2473';

/**
 * Make HTTP request to Linear API
 */
function makeRequest(query) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query });

    const options = {
      hostname: 'api.linear.app',
      path: '/graphql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Authorization': LINEAR_API_KEY
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

/**
 * Get workflow state ID for "In Progress"
 */
async function getInProgressStateId() {
  const query = `
    query {
      workflows(first: 10) {
        nodes {
          id
          name
          states {
            id
            name
          }
        }
      }
    }
  `;

  try {
    const response = await makeRequest(query);
    if (response.data?.workflows?.nodes?.length > 0) {
      for (const workflow of response.data.workflows.nodes) {
        const inProgressState = workflow.states.find(
          state => state.name.toLowerCase().includes('progress') || state.name.toLowerCase().includes('in progress')
        );
        if (inProgressState) {
          return inProgressState.id;
        }
      }
    }
    console.error('❌ Could not find "In Progress" state');
    return null;
  } catch (error) {
    console.error('❌ Failed to get workflow states:', error.message);
    return null;
  }
}

/**
 * Update a single issue status
 */
async function updateIssueStatus(issueId, stateId) {
  const mutation = `
    mutation {
      issueUpdate(id: "${issueId}", input: { stateId: "${stateId}" }) {
        success
        issue {
          id
          identifier
          title
          state {
            name
          }
        }
      }
    }
  `;

  try {
    const response = await makeRequest(mutation);

    if (response.errors) {
      console.error(`❌ Error updating ${issueId}:`, response.errors[0]?.message);
      return false;
    }

    if (response.data?.issueUpdate?.success) {
      const issue = response.data.issueUpdate.issue;
      console.log(`✅ ${issue.identifier}: Updated to "${issue.state.name}"`);
      return true;
    } else {
      console.error(`❌ Failed to update ${issueId}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Request failed for ${issueId}:`, error.message);
    return false;
  }
}

/**
 * Get all sub-issues for a parent issue
 */
async function getSubIssues(parentIssueIdentifier) {
  const query = `
    query {
      issues(filter: { identifier: { eq: "${parentIssueIdentifier}" } }, first: 1) {
        nodes {
          id
          identifier
          children(first: 50) {
            nodes {
              id
              identifier
              title
            }
          }
        }
      }
    }
  `;

  try {
    const response = await makeRequest(query);
    if (response.data?.issues?.nodes?.length > 0) {
      const parent = response.data.issues.nodes[0];
      return parent.children.nodes.map(child => child.id);
    }
    console.error('❌ Could not find parent issue');
    return [];
  } catch (error) {
    console.error('❌ Failed to get sub-issues:', error.message);
    return [];
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('');
  console.log('🔄 Updating Linear Issue Status for 022-title-week-5');
  console.log(`   Parent Issue: ${PARENT_ISSUE}`);
  console.log('');

  // Get all sub-issues
  console.log('📋 Fetching all sub-issues under ' + PARENT_ISSUE + '...');
  const subIssueIds = await getSubIssues(PARENT_ISSUE);
  if (subIssueIds.length === 0) {
    console.error('❌ No sub-issues found');
    process.exit(1);
  }
  console.log(`✅ Found ${subIssueIds.length} sub-issues`);
  console.log('');

  // Get the "In Progress" state ID
  console.log('📋 Getting workflow states...');
  const stateId = await getInProgressStateId();
  if (!stateId) {
    console.error('❌ Could not determine "In Progress" state ID');
    process.exit(1);
  }
  console.log(`✅ Found "In Progress" state: ${stateId}`);
  console.log('');

  // Update each issue
  console.log('🔄 Updating all issues to "In Progress"...');
  console.log('');

  let updated = 0;
  let failed = 0;

  for (const issueId of subIssueIds) {
    const success = await updateIssueStatus(issueId, stateId);
    if (success) {
      updated++;
    } else {
      failed++;
    }
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log('');
  console.log('✨ Summary:');
  console.log(`   Updated: ${updated}/${subIssueIds.length}`);
  if (failed > 0) {
    console.log(`   Failed: ${failed}/${subIssueIds.length}`);
  }
  console.log('');

  if (failed === 0) {
    console.log('🎉 All ' + updated + ' issues updated to "In Progress"!');
    console.log(`   View them at: https://linear.app/issue/${PARENT_ISSUE}`);
  } else {
    console.log('⚠️  Some issues failed to update. Check errors above.');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Fatal error:', error.message);
  process.exit(1);
});

