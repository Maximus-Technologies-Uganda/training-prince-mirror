#!/usr/bin/env node

/**
 * Create Linear Sub-Issues for 020-title-week-4
 * Week 4 Finisher: Update PR Template for Spec Discipline
 * 
 * Usage:
 *   LINEAR_API_KEY=your_key node create-linear-sub-issues-020.mjs
 * 
 * Or set LINEAR_API_KEY as environment variable and run:
 *   node create-linear-sub-issues-020.mjs
 */

import https from 'https';

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;
const PARENT_ISSUE = 'PRI-2433';

if (!LINEAR_API_KEY) {
  console.error('❌ Error: LINEAR_API_KEY environment variable not set');
  console.error('Usage: LINEAR_API_KEY=your_key node create-linear-sub-issues-020.mjs');
  process.exit(1);
}

// Task definitions from tasks.md
const TASKS = [
  {
    id: 'T001',
    title: 'Review Current PR Template',
    description: 'Review .github/pull_request_template.md and document current state'
  },
  {
    id: 'T002',
    title: 'Create New PR Template with Mandatory Sections',
    description: 'Update PR template to include Spec URL, Figma Dev Mode Link, and Acceptance Checklist'
  },
  {
    id: 'T003',
    title: 'Create GitHub Actions Validation Workflow',
    description: 'Create .github/workflows/validate-pr-template.yml with PR body validation logic'
  },
  {
    id: 'T004',
    title: 'Configure Validation Logic for Field Detection',
    description: 'Implement Spec URL and Figma Link validation with regex patterns'
  },
  {
    id: 'T005',
    title: 'Set Up Branch Protection Rule for development Branch',
    description: 'Configure GitHub branch protection to require PR template validation'
  },
  {
    id: 'T006',
    title: 'Test Valid PR - All Fields Properly Filled',
    description: 'Create test PR with valid Spec URL, Figma Link, and Acceptance Checklist'
  },
  {
    id: 'T007',
    title: 'Test Invalid PR - Missing Spec URL',
    description: 'Create test PR with missing Spec URL to verify validation blocks merge'
  },
  {
    id: 'T008',
    title: 'Test Edge Case - N/A Figma Field with Justification',
    description: 'Create test PR with N/A Figma field to verify N/A pattern acceptance'
  },
  {
    id: 'T009',
    title: 'Test Merge Blocking When Validation Fails',
    description: 'Create test PR with empty Figma field to verify hard enforcement'
  },
  {
    id: 'T010',
    title: 'Document Validation Error Messages & Developer Guidance',
    description: 'Verify quickstart.md covers all validation scenarios and error messages'
  },
  {
    id: 'T011',
    title: 'Create and Merge PR to development',
    description: 'Create and merge PR with all changes to development branch'
  }
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
            reject(new Error(`Linear API Error: ${response.errors[0]?.message || 'Unknown error'}`));
          } else {
            resolve(response.data);
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      });
    });

    req.on('error', (e) => reject(e));
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
        }
      }
    }
  `;
  
  const data = await queryLinearAPI(query);
  if (!data.issue) {
    throw new Error(`Parent issue ${PARENT_ISSUE} not found`);
  }
  
  return {
    issueId: data.issue.id,
    issueIdentifier: data.issue.identifier,
    issueTitle: data.issue.title,
    teamId: data.issue.team.id
  };
}

async function createSubIssue(parentIssueId, teamId, task) {
  const query = `
    mutation {
      issueCreate(input: {
        teamId: "${teamId}"
        title: "[${task.id}] ${task.title}"
        description: "${task.description.replace(/"/g, '\\"')}"
        parentId: "${parentIssueId}"
        statusId: "in_progress"
      }) {
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

  const data = await queryLinearAPI(query);
  if (!data.issueCreate.success) {
    throw new Error(`Failed to create sub-issue for ${task.id}`);
  }

  return data.issueCreate.issue;
}

async function main() {
  console.log('🚀 Creating Linear Sub-Issues for 020-title-week-4');
  console.log(`📌 Parent Issue: ${PARENT_ISSUE}`);
  console.log(`📊 Total Tasks: ${TASKS.length}\n`);

  let parentIssueInfo;
  try {
    console.log(`📋 Fetching parent issue ${PARENT_ISSUE}...`);
    parentIssueInfo = await getParentIssueTeamId();
    console.log(`   ✅ Found: ${parentIssueInfo.issueIdentifier}`);
    console.log(`   📝 Title: ${parentIssueInfo.issueTitle}`);
    console.log(`   👥 Team ID: ${parentIssueInfo.teamId}\n`);
  } catch (error) {
    console.error(`❌ Failed to fetch parent issue: ${error.message}`);
    process.exit(1);
  }

  const results = [];
  let successCount = 0;
  let failureCount = 0;

  for (const task of TASKS) {
    try {
      console.log(`⏳ Creating ${task.id}: ${task.title}...`);
      const subIssue = await createSubIssue(parentIssueInfo.issueId, parentIssueInfo.teamId, task);
      console.log(`   ✅ Created: ${subIssue.identifier}`);
      results.push({
        taskId: task.id,
        linearId: subIssue.identifier,
        status: 'created',
        title: subIssue.title
      });
      successCount++;
    } catch (error) {
      console.error(`   ❌ Failed: ${error.message}`);
      results.push({
        taskId: task.id,
        status: 'failed',
        error: error.message
      });
      failureCount++;
    }

    // Small delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n📊 Summary:\n');
  console.log(`✅ Successfully created: ${successCount}/${TASKS.length}`);
  console.log(`❌ Failed: ${failureCount}/${TASKS.length}\n`);

  if (successCount > 0) {
    console.log('Created Issues:');
    results.forEach(r => {
      if (r.status === 'created') {
        console.log(`  • ${r.taskId} → ${r.linearId}: ${r.title}`);
      }
    });
  }

  if (failureCount > 0) {
    console.log('\nFailed Issues:');
    results.forEach(r => {
      if (r.status === 'failed') {
        console.log(`  • ${r.taskId}: ${r.error}`);
      }
    });
  }

  if (failureCount > 0) {
    process.exit(1);
  } else {
    console.log('\n✅ All sub-issues created successfully!');
  }
}

main();
