#!/usr/bin/env node

/**
 * Create Linear Sub-Issues for 021-title-week-5
 * Week 5 Day-0: API Scaffolding and Spec-First Setup
 */

import https from 'https';

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;
const PARENT_ISSUE = 'PRI-2445';

if (!LINEAR_API_KEY) {
  console.error('❌ Error: LINEAR_API_KEY environment variable not set');
  console.error('Usage: LINEAR_API_KEY=your_key node create-linear-sub-issues-021.mjs');
  process.exit(1);
}

// Task definitions from tasks.md
const TASKS = [
  {
    id: 'T001',
    title: 'Create /api Directory Structure',
    description: 'Create /api directory at repository root with src/, tests/, and spec/ subdirectories'
  },
  {
    id: 'T002',
    title: 'Create api/package.json',
    description: 'Create api/package.json with Express, Zod, pino, supertest dependencies and scripts (test, lint, dev)'
  },
  {
    id: 'T003',
    title: 'Create api/tsconfig.json',
    description: 'Create api/tsconfig.json with ES modules and strict TypeScript configuration'
  },
  {
    id: 'T004',
    title: 'Create api/vitest.config.ts',
    description: 'Create api/vitest.config.ts with coverage reporting configuration (lcov + HTML)'
  },
  {
    id: 'T005',
    title: 'Create api/.env.example',
    description: 'Create api/.env.example file documenting PORT and NODE_ENV environment variables'
  },
  {
    id: 'T006',
    title: 'Create OpenAPI Specification',
    description: 'Create /api/spec/openapi.yaml with OpenAPI 3.1 format and GET /health endpoint definition'
  },
  {
    id: 'T007',
    title: 'Create Contract Test for GET /health',
    description: 'Create contract test api/tests/contract/health.contract.test.ts validating GET /health matches OpenAPI spec (must fail initially)'
  },
  {
    id: 'T008',
    title: 'Configure Development Server',
    description: 'Configure development server setup in api/package.json with tsx + nodemon for hot-reload'
  },
  {
    id: 'T009',
    title: 'Create Server Entry Point',
    description: 'Create api/src/server.ts entry point with Express server initialization'
  },
  {
    id: 'T010',
    title: 'Create Validation Middleware Structure',
    description: 'Create api/src/middleware/validation.ts structure for Zod request validation middleware (placeholder)'
  },
  {
    id: 'T011',
    title: 'Create Logger Middleware Structure',
    description: 'Create api/src/middleware/logger.ts structure for pino structured logging middleware (placeholder)'
  },
  {
    id: 'T012',
    title: 'Create Type Definitions',
    description: 'Create api/src/types/index.ts for TypeScript type definitions'
  },
  {
    id: 'T013',
    title: 'Implement GET /health Route Handler',
    description: 'Implement GET /health route handler in api/src/routes/health.ts matching OpenAPI specification'
  },
  {
    id: 'T014',
    title: 'Register Health Route',
    description: 'Register health route in api/src/server.ts and make contract test pass'
  },
  {
    id: 'T015',
    title: 'Implement Request Validation Middleware',
    description: 'Implement basic request validation middleware in api/src/middleware/validation.ts using Zod'
  },
  {
    id: 'T016',
    title: 'Implement Structured Logging Middleware',
    description: 'Implement structured logging middleware in api/src/middleware/logger.ts using pino'
  },
  {
    id: 'T017',
    title: 'Create CI Workflow File',
    description: 'Create .github/workflows/api-checks.yml workflow file with lint, test, and coverage steps'
  },
  {
    id: 'T018',
    title: 'Create Copy Coverage Script',
    description: 'Create .github/scripts/copy-api-coverage.sh script to copy coverage reports from api/coverage/ to review-artifacts/'
  },
  {
    id: 'T019',
    title: 'Create Verify Artifacts Script',
    description: 'Create .github/scripts/verify-api-artifacts.sh script to verify all required files exist before artifact upload (fail-fast)'
  },
  {
    id: 'T020',
    title: 'Create Generate Index Script',
    description: 'Create .github/scripts/generate-api-index.sh script to generate review-artifacts/index.html with navigation structure'
  },
  {
    id: 'T021',
    title: 'Update CI Workflow with Artifact Generation',
    description: 'Update .github/workflows/api-checks.yml to include artifact generation steps (copy → verify → generate index.html → upload review-packet-api)'
  },
  {
    id: 'T022',
    title: 'Verify Contract Test Passes',
    description: 'Run contract test api/tests/contract/health.contract.test.ts and verify it passes after implementation'
  },
  {
    id: 'T023',
    title: 'Verify Test Infrastructure',
    description: 'Verify npm test executes successfully with coverage reporting in api/ directory'
  },
  {
    id: 'T024',
    title: 'Verify Linting',
    description: 'Verify npm run lint executes successfully in api/ directory'
  },
  {
    id: 'T025',
    title: 'Verify Development Server',
    description: 'Verify npm run dev starts development server successfully'
  },
  {
    id: 'T026',
    title: 'Verify CI Workflow',
    description: 'Verify CI workflow .github/workflows/api-checks.yml executes successfully and generates review-packet-api artifact'
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

async function getWorkflowStates(teamId) {
  const query = `
    query {
      team(id: "${teamId}") {
        states {
          nodes {
            id
            name
          }
        }
      }
    }
  `;
  
  const data = await queryLinearAPI(query);
  if (!data.team || !data.team.states) {
    throw new Error('Failed to fetch team states');
  }
  
  // Find "In Progress" state - try multiple name variations
  const states = data.team.states.nodes;
  const inProgressState = states.find(s => 
    s.name.toLowerCase().includes('in progress') || 
    s.name.toLowerCase().includes('progress') ||
    s.name.toLowerCase() === 'in_progress' ||
    s.name === 'In Progress'
  );
  
  if (!inProgressState) {
    console.warn('⚠️  "In Progress" state not found. Available states:');
    states.forEach(s => console.warn(`   - ${s.name} (${s.id})`));
    throw new Error('Cannot find "In Progress" state');
  }
  
  return inProgressState.id;
}

async function createSubIssue(parentIssueId, teamId, stateId, task) {
  const query = `
    mutation {
      issueCreate(input: {
        teamId: "${teamId}"
        title: "[${task.id}] ${task.title}"
        description: "${task.description.replace(/"/g, '\\"')}"
        parentId: "${parentIssueId}"
        stateId: "${stateId}"
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
  console.log('🚀 Creating Linear Sub-Issues for 021-title-week-5');
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

  let stateId;
  try {
    console.log(`🔍 Fetching workflow states...`);
    stateId = await getWorkflowStates(parentIssueInfo.teamId);
    console.log(`   ✅ Found "In Progress" state: ${stateId}\n`);
  } catch (error) {
    console.error(`❌ Failed to fetch states: ${error.message}`);
    process.exit(1);
  }

  const results = [];
  let successCount = 0;
  let failureCount = 0;

  for (const task of TASKS) {
    try {
      console.log(`⏳ Creating ${task.id}: ${task.title}...`);
      const subIssue = await createSubIssue(parentIssueInfo.issueId, parentIssueInfo.teamId, stateId, task);
      console.log(`   ✅ Created: ${subIssue.identifier} (${subIssue.state.name})`);
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

