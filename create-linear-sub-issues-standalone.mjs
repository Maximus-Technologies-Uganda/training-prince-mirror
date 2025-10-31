#!/usr/bin/env node

/**
 * Standalone Script: Create Linear Sub-Issues for 016-week-4-finisher
 * 
 * Usage:
 *   LINEAR_API_KEY=your_key node create-linear-sub-issues-standalone.mjs
 * 
 * Or set LINEAR_API_KEY as environment variable and run:
 *   node create-linear-sub-issues-standalone.mjs
 */

import https from 'https';

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;
const PARENT_ISSUE = 'PRI-1514';

if (!LINEAR_API_KEY) {
  console.error('❌ Error: LINEAR_API_KEY environment variable not set');
  console.error('Usage: LINEAR_API_KEY=your_key node create-linear-sub-issues-standalone.mjs');
  process.exit(1);
}

// Task definitions
const TASKS = [
  {
    id: 'T001',
    title: 'Establish Baseline Coverage Snapshot',
    description: 'Capture current coverage before enforcement to understand what code needs more tests',
    type: 'setup',
    dependencies: [],
    priority: 1,
  },
  {
    id: 'T002',
    title: 'Create npm Script for Coverage with Thresholds',
    description: 'Ensure npm run test:coverage command exists and is configured to enforce thresholds',
    type: 'setup',
    dependencies: ['T001'],
    priority: 1,
  },
  {
    id: 'T003',
    title: 'Create Vitest Configuration Contract Test',
    description: 'Test that vitest.config.js will be properly structured with thresholds and excludes',
    type: 'test',
    dependencies: ['T002'],
    priority: 1,
  },
  {
    id: 'T004',
    title: 'Create GitHub Actions CI Contract Test',
    description: 'Test that CI workflow will properly enforce coverage checks and block merges on failure',
    type: 'test',
    dependencies: ['T002'],
    priority: 1,
  },
  {
    id: 'T005',
    title: 'Create Review-Packet Integration Contract Test',
    description: 'Test that review-packet workflow will integrate coverage artifacts into review-artifacts',
    type: 'test',
    dependencies: ['T002'],
    priority: 1,
  },
  {
    id: 'T006',
    title: 'Configure Vitest Coverage Thresholds',
    description: 'Add coverage configuration to vitest.config.js with thresholds (60/50/60/60)',
    type: 'config',
    dependencies: ['T003'],
    priority: 1,
  },
  {
    id: 'T007',
    title: 'Update GitHub Actions Checks Workflow',
    description: 'Add or update the coverage check step in CI workflow to enforce thresholds',
    type: 'config',
    dependencies: ['T004'],
    priority: 1,
  },
  {
    id: 'T008',
    title: 'Update Review-Packet Workflow for Coverage',
    description: 'Extend review-packet workflow to copy coverage artifacts and integrate into review-artifacts',
    type: 'config',
    dependencies: ['T005'],
    priority: 1,
  },
  {
    id: 'T009',
    title: 'Verify Exclusion Patterns Work Correctly',
    description: 'Integration test to verify that excluded files are NOT counted in coverage metrics',
    type: 'integration',
    dependencies: ['T006', 'T007', 'T008'],
    priority: 0,
  },
  {
    id: 'T010',
    title: 'Verify Threshold Enforcement (Pass Scenario)',
    description: 'Integration test verifying that code meeting coverage thresholds allows merge',
    type: 'integration',
    dependencies: ['T006', 'T007', 'T008'],
    priority: 0,
  },
  {
    id: 'T011',
    title: 'Document Coverage Policy & Requirements',
    description: 'Update project documentation with coverage threshold requirements and developer workflow',
    type: 'docs',
    dependencies: ['T009', 'T010'],
    priority: 0,
  },
  {
    id: 'T012',
    title: 'Validate Vitest Config Test Pass',
    description: 'Run T003 contract test to verify vitest config now passes all validations',
    type: 'validation',
    dependencies: ['T006'],
    priority: 0,
  },
  {
    id: 'T013',
    title: 'Validate CI Workflow Test Pass',
    description: 'Run T004 contract test to verify CI workflow properly configured',
    type: 'validation',
    dependencies: ['T007'],
    priority: 0,
  },
  {
    id: 'T014',
    title: 'Validate Review-Packet Integration Test Pass',
    description: 'Run T005 contract test to verify review-packet workflow integrates coverage',
    type: 'validation',
    dependencies: ['T008'],
    priority: 0,
  },
  {
    id: 'T015',
    title: 'Run Full Test Suite & Verify All Tests Pass',
    description: 'Execute complete test suite to ensure all tests pass with new coverage configuration',
    type: 'summary',
    dependencies: ['T012', 'T013', 'T014'],
    priority: 1,
  },
];

// Store created issue IDs for linking
const createdIssues = {};

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
 * Create a Linear issue
 */
async function createIssue(task, parentIssueId, teamId, inProgressStateId) {
  const description = `Feature: 016-week-4-finisher - Configure and Enforce Coverage Thresholds
Parent: ${PARENT_ISSUE}
Type: ${task.type}

${task.description}

## Acceptance Criteria
- ✅ Task completed successfully
- ✅ All acceptance criteria from tasks.md met
- ✅ Code changes committed and pushed
- ✅ Tests passing (if applicable)
- ✅ Documentation updated (if applicable)`;

  const query = `
    mutation CreateIssue {
      issueCreate(input: {
        title: "${task.id}: ${task.title.replace(/"/g, '\\"')}"
        description: "${description.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"
        priority: ${task.priority}
        teamId: "${teamId}"
        stateId: "${inProgressStateId}"
        relations: {
          create: [
            {
              relationType: "relates to"
              issueIdB: "${parentIssueId}"
            }
          ]
        }
      }) {
        success
        issue {
          id
          identifier
        }
      }
    }
  `;

  try {
    const result = await linearRequest(query);
    if (result.issueCreate?.success) {
      const issueId = result.issueCreate.issue.identifier;
      createdIssues[task.id] = issueId;
      console.log(`✅ Created ${issueId}: ${task.title}`);
      return issueId;
    } else {
      throw new Error('Issue creation returned false');
    }
  } catch (error) {
    console.error(`❌ Error creating ${task.id}:`, error.message);
    throw error;
  }
}

/**
 * Fetch parent issue details and team states
 */
async function getParentIssueDetails() {
  const query = `
    query GetIssueAndStates {
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
      }
    }
  `;

  try {
    const result = await linearRequest(query);
    if (result.issue) {
      // Find "In Progress" state
      const inProgressState = result.issue.team.states.nodes.find(
        state => state.name.toLowerCase() === 'in progress'
      );
      
      if (!inProgressState) {
        throw new Error('Could not find "In Progress" state in team workflow');
      }

      return {
        id: result.issue.id,
        identifier: result.issue.identifier,
        teamId: result.issue.team.id,
        inProgressStateId: inProgressState.id,
      };
    } else {
      throw new Error(`Issue ${PARENT_ISSUE} not found`);
    }
  } catch (error) {
    console.error(`❌ Error fetching parent issue: ${error.message}`);
    throw error;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Creating Linear Sub-Issues\n');
  console.log(`📌 Parent Issue: ${PARENT_ISSUE}`);
  console.log(`📊 Total Tasks: ${TASKS.length}\n`);

  // Fetch parent issue details and team states
  console.log('📋 Fetching parent issue details and team states...');
  let parentIssueId, teamId, inProgressStateId;
  try {
    const parentInfo = await getParentIssueDetails();
    parentIssueId = parentInfo.id;
    teamId = parentInfo.teamId;
    inProgressStateId = parentInfo.inProgressStateId;
    console.log(`   ✅ Found: ${parentInfo.identifier} (Team: ${teamId})`);
    console.log(`   ✅ State: In Progress (${inProgressStateId})\n`);
  } catch (error) {
    console.error('Failed to fetch parent issue. Make sure PRI-1514 exists.\n');
    process.exit(1);
  }

  console.log('📋 Creating sub-issues with "In Progress" status...\n');

  let successCount = 0;
  let failureCount = 0;

  for (const task of TASKS) {
    try {
      await createIssue(task, parentIssueId, teamId, inProgressStateId);
      successCount++;
      // Rate limit: wait 500ms between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      failureCount++;
      // Continue with next task
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  console.log('\n✨ Sub-issue creation complete!\n');
  console.log('📊 Summary:');
  console.log(`   Created: ${successCount}/${TASKS.length}`);
  if (failureCount > 0) {
    console.log(`   Failed: ${failureCount}`);
  }
  console.log(`   Parent: ${PARENT_ISSUE}`);
  console.log(`   Status: In Progress\n`);

  console.log('🔗 Created Issues:');
  Object.entries(createdIssues).forEach(([taskId, issueId]) => {
    console.log(`   ${taskId} → ${issueId}`);
  });

  console.log('\n🎉 Done! Check Linear at: https://linear.app\n');

  if (failureCount > 0) {
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});
