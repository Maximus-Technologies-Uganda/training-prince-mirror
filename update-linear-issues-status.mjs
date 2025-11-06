#!/usr/bin/env node

/**
 * Update Linear Issues Status Script
 * 
 * Updates all sub-issues of PRI-1514 to "In Progress" status
 * 
 * Usage:
 *   LINEAR_API_KEY=your_key node update-linear-issues-status.mjs
 */

import https from 'https';

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;
const PARENT_ISSUE = 'PRI-1514';

if (!LINEAR_API_KEY) {
  console.error('❌ Error: LINEAR_API_KEY environment variable not set');
  process.exit(1);
}

/**
 * Make HTTP request to Linear GraphQL API
 */
function linearRequest(query) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query });

    const options = {
      hostname: 'api.linear.app',
      path: '/graphql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': LINEAR_API_KEY,
        'Content-Length': Buffer.byteLength(data),
      },
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          if (parsed.errors) {
            reject(new Error(parsed.errors.map(e => e.message).join(', ')));
          } else {
            resolve(parsed.data);
          }
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
 * Get parent issue and its sub-issues
 */
async function getSubIssues() {
  const query = `
    query GetSubIssues {
      issue(id: "${PARENT_ISSUE}") {
        id
        identifier
        team {
          id
          states {
            nodes {
              id
              name
            }
          }
        }
        children {
          nodes {
            id
            identifier
          }
        }
      }
    }
  `;

  try {
    const result = await linearRequest(query);
    if (result.issue) {
      const inProgressState = result.issue.team.states.nodes.find(
        state => state.name.toLowerCase() === 'in progress'
      );

      if (!inProgressState) {
        throw new Error('Could not find "In Progress" state');
      }

      return {
        subIssues: result.issue.children.nodes,
        inProgressStateId: inProgressState.id,
        teamId: result.issue.team.id,
      };
    } else {
      throw new Error(`Issue ${PARENT_ISSUE} not found`);
    }
  } catch (error) {
    console.error(`❌ Error fetching sub-issues: ${error.message}`);
    throw error;
  }
}

/**
 * Update an issue's state
 */
async function updateIssueState(issueId, stateId) {
  const query = `
    mutation UpdateIssue {
      issueUpdate(id: "${issueId}", input: {
        stateId: "${stateId}"
      }) {
        success
        issue {
          identifier
          state {
            name
          }
        }
      }
    }
  `;

  try {
    const result = await linearRequest(query);
    if (result.issueUpdate?.success) {
      const stateName = result.issueUpdate.issue.state.name;
      console.log(`✅ Updated ${result.issueUpdate.issue.identifier} → ${stateName}`);
      return true;
    } else {
      console.log(`⚠️  Could not update ${issueId}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error updating ${issueId}:`, error.message);
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🔄 Updating Linear Sub-Issues Status\n');
  console.log(`📌 Parent Issue: ${PARENT_ISSUE}\n`);

  // Fetch sub-issues
  console.log('📋 Fetching sub-issues...');
  let subIssues, inProgressStateId;
  try {
    const data = await getSubIssues();
    subIssues = data.subIssues;
    inProgressStateId = data.inProgressStateId;
    console.log(`   ✅ Found ${subIssues.length} sub-issues\n`);
  } catch (error) {
    process.exit(1);
  }

  if (subIssues.length === 0) {
    console.log('⚠️  No sub-issues found to update\n');
    return;
  }

  console.log('🔄 Updating to "In Progress" status...\n');

  let updatedCount = 0;
  for (const issue of subIssues) {
    const updated = await updateIssueState(issue.id, inProgressStateId);
    if (updated) updatedCount++;
    // Rate limit
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log(`\n✨ Status update complete!`);
  console.log(`📊 Updated: ${updatedCount}/${subIssues.length}\n`);
}

main().catch(error => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});
