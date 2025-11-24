#!/usr/bin/env node

/**
 * Create Linear Sub-Issues for 019-title-week-4
 * Week 4 Finisher: Default Branch Hygiene
 * 
 * Usage:
 *   LINEAR_API_KEY=your_key node create-linear-sub-issues-019.mjs
 * 
 * Or set LINEAR_API_KEY as environment variable and run:
 *   node create-linear-sub-issues-019.mjs
 */

import https from 'https';

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;
const PARENT_ISSUE = 'PRI-2427';

if (!LINEAR_API_KEY) {
  console.error('❌ Error: LINEAR_API_KEY environment variable not set');
  console.error('Usage: LINEAR_API_KEY=your_key node create-linear-sub-issues-019.mjs');
  process.exit(1);
}

// Task definitions from tasks.md
const TASKS = [
  {
    id: 'T001',
    title: 'Verify Development Branch is Current',
    description: 'Verify that the development branch contains the latest documentation and is ready to become the default branch. Check README.md has "How to review me" section and verify no legacy state files.',
    type: 'verification',
    dependencies: [],
    priority: 1,
  },
  {
    id: 'T002',
    title: 'Change Default Branch in GitHub Settings',
    description: 'Change the repository default branch setting from main to development using GitHub web interface. Navigate to Settings, locate Default branch section, select development from dropdown.',
    type: 'configuration',
    dependencies: ['T001'],
    priority: 1,
  },
  {
    id: 'T003',
    title: 'Verify Default Branch Change Applied',
    description: 'Confirm that the default branch change was successfully applied by taking a screenshot of GitHub Settings showing development as the new default branch.',
    type: 'verification',
    dependencies: ['T002'],
    priority: 1,
  },
  {
    id: 'T004',
    title: 'Document Change in PR Description',
    description: 'Prepare the PR description with verification screenshot and change documentation including change summary, verification details, and impact analysis.',
    type: 'documentation',
    dependencies: ['T003'],
    priority: 1,
  },
  {
    id: 'T005',
    title: 'Create and Merge PR',
    description: 'Create a Pull Request with the default branch change documentation, obtain review approval, and merge to development branch. Include screenshot verification in PR.',
    type: 'documentation',
    dependencies: ['T004'],
    priority: 1,
  },
];

async function queryLinearAPI(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({ query, variables });

    const options = {
      hostname: 'api.linear.app',
      port: 443,
      path: '/graphql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'Authorization': LINEAR_API_KEY,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.errors) {
            reject(new Error(`Linear API Error: ${JSON.stringify(response.errors)}`));
          } else {
            resolve(response.data);
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function getParentIssueTeamId() {
  const query = `
    query {
      issue(id: "${PARENT_ISSUE}") {
        id
        identifier
        title
        team {
          id
          name
        }
      }
    }
  `;

  try {
    const result = await queryLinearAPI(query);
    if (!result.issue) {
      throw new Error(`Parent issue ${PARENT_ISSUE} not found`);
    }
    return {
      issueId: result.issue.id,
      teamId: result.issue.team.id,
      issueIdentifier: result.issue.identifier,
    };
  } catch (error) {
    throw new Error(`Failed to fetch parent issue: ${error.message}`);
  }
}

async function createSubIssue(task, parentIssueId, teamId) {
  const mutation = `
    mutation CreateIssue(
      $title: String!
      $description: String
      $teamId: String!
      $parentId: String!
      $priority: Int
    ) {
      issueCreate(
        input: {
          title: $title
          description: $description
          teamId: $teamId
          parentId: $parentId
          priority: $priority
        }
      ) {
        success
        issue {
          id
          identifier
          title
          url
        }
      }
    }
  `;

  const variables = {
    title: `${task.id}: ${task.title}`,
    description: task.description,
    teamId: teamId,
    parentId: parentIssueId,
    priority: task.priority,
  };

  return queryLinearAPI(mutation, variables);
}

async function main() {
  console.log('🚀 Creating Linear Sub-Issues for 019-title-week-4');
  console.log(`📌 Parent Issue: ${PARENT_ISSUE}`);
  console.log(`📊 Total Tasks: ${TASKS.length}\n`);

  let parentIssueInfo;
  try {
    console.log(`📋 Fetching parent issue ${PARENT_ISSUE}...`);
    parentIssueInfo = await getParentIssueTeamId();
    console.log(`   ✅ Found: ${parentIssueInfo.issueIdentifier}`);
    console.log(`   👥 Team ID: ${parentIssueInfo.teamId}\n`);
  } catch (error) {
    console.error(`❌ Failed to fetch parent issue: ${error.message}`);
    process.exit(1);
  }

  const results = [];

  for (const task of TASKS) {
    try {
      console.log(`⏳ Creating ${task.id}: ${task.title}...`);
      const result = await createSubIssue(task, parentIssueInfo.issueId, parentIssueInfo.teamId);
      
      if (result.issueCreate.success) {
        const issue = result.issueCreate.issue;
        console.log(`✅ Created: ${issue.identifier} - ${issue.title}`);
        console.log(`   URL: ${issue.url}\n`);
        results.push({
          taskId: task.id,
          success: true,
          linearId: issue.identifier,
          url: issue.url,
        });
      } else {
        console.log(`❌ Failed to create ${task.id}\n`);
        results.push({
          taskId: task.id,
          success: false,
          error: 'Creation failed',
        });
      }
    } catch (error) {
      console.error(`❌ Error creating ${task.id}:`, error.message);
      results.push({
        taskId: task.id,
        success: false,
        error: error.message,
      });
    }

    // Add small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`✅ Successful: ${successful}/${TASKS.length}`);
  console.log(`❌ Failed: ${failed}/${TASKS.length}`);

  if (successful > 0) {
    console.log('\n✅ Created Issues:');
    results.filter(r => r.success).forEach(r => {
      console.log(`  • ${r.taskId} → ${r.linearId}: ${r.url}`);
    });
  }

  if (failed > 0) {
    console.log('\n❌ Failed Issues:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  • ${r.taskId}: ${r.error}`);
    });
  }

  console.log('\n' + '='.repeat(60));
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
