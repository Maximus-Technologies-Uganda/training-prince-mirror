#!/usr/bin/env node

/**
 * Create Linear Sub-Issues for 024-title-week-5
 * Week 5: Rate Limiter for POST Routes
 * 
 * Usage:
 *   export LINEAR_API_KEY="your-linear-api-key"
 *   node create-linear-sub-issues-024.mjs
 * 
 * This script creates 12 sub-issues under PRI-2532 (parent issue).
 * Each sub-issue maps to a task in specs/024-title-week-5/tasks.md
 * All sub-issues will be marked as "Backlog" upon creation.
 */

import https from 'https';

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;
const PARENT_ISSUE = 'PRI-2532';

if (!LINEAR_API_KEY) {
  console.error('❌ Error: LINEAR_API_KEY environment variable not set');
  console.error('');
  console.error('Usage:');
  console.error('  export LINEAR_API_KEY="your-api-key"');
  console.error('  node create-linear-sub-issues-024.mjs');
  console.error('');
  console.error('Get your API key from: https://linear.app/settings/api');
  process.exit(1);
}

// Task definitions from specs/024-title-week-5/tasks.md
const TASKS = [
  // Phase 4.1: Contract Tests
  {
    id: 'T001',
    title: 'Create contract test file rate-limit.contract.test.ts [P]',
    description: 'Create contract test file `api/tests/integration/rate-limit.contract.test.ts` with test suite setup using Vitest + Supertest; import test server; define test client; must fail initially (no implementation yet)'
  },
  {
    id: 'T002',
    title: 'Contract 1: POST /api/convert 100 req/15 min limit [P]',
    description: 'Create contract test for POST /api/convert rate limit: verify 100 requests within 15-minute window all return 200 OK; verify request #101 returns HTTP 429; verify X-RateLimit-Limit header = 100; verify X-RateLimit-Remaining decrements correctly'
  },
  {
    id: 'T003',
    title: 'Contract 2: POST /api/expenses 100 req/15 min limit [P]',
    description: 'Create contract test for POST /api/expenses rate limit: verify 100 requests within 15-minute window all return 200 OK; verify request #101 returns HTTP 429; verify quota is independent from /convert endpoint'
  },
  {
    id: 'T004',
    title: 'Contract 3: Independent quota per endpoint [P]',
    description: 'Create contract test for independent quotas: verify hitting 100-request limit on /convert does not affect /expenses quota; verify each endpoint tracks requests independently per IP'
  },
  {
    id: 'T005',
    title: 'Contract 4: GET routes exempt from rate limiting [P]',
    description: 'Create contract test for GET exemption: verify GET /api/expenses never returns 429 regardless of request volume; verify GET requests bypass rate limiter middleware; verify 200+ consecutive GET requests all return 200 OK'
  },
  {
    id: 'T006',
    title: 'Contract 5: Retry-After header accuracy [P]',
    description: 'Create contract test for Retry-After header: verify 429 response includes Retry-After header; verify Retry-After value equals seconds remaining until window resets; verify accuracy within ±1 second'
  },
  {
    id: 'T007',
    title: 'Contract 6: Proxy trust configuration [P]',
    description: 'Create contract test for proxy trust: verify rate limiter respects X-Forwarded-For header when proxy is trusted; verify rate limiter uses direct connection IP when proxy is not trusted; verify configuration applied consistently'
  },
  {
    id: 'T008',
    title: 'Contract 7: Logging on rate limit rejection [P]',
    description: 'Create contract test for logging: verify each 429 response generates log entry; verify log includes client IP, endpoint path, timestamp; verify log level is "info"'
  },

  // Phase 4.2: Middleware Implementation
  {
    id: 'T009',
    title: 'Create rate-limit.ts middleware with express-rate-limit',
    description: 'Create `api/src/middleware/rate-limit.ts` middleware: configure express-rate-limit with windowMs=900000 (15 min), max=100, skip GET requests, keyGenerator for IP identification; custom handler function sets Retry-After header, returns 429 with JSON body, logs rejection; add TypeScript types'
  },
  {
    id: 'T010',
    title: 'Register rate limiter in api/src/index.ts',
    description: 'Register middleware in `api/src/index.ts`: import rate limiter; register on POST /api/convert route; register on POST /api/expenses route; verify GET routes NOT guarded; ensure other middleware chain not disrupted'
  },

  // Phase 4.3: Integration Test Validation
  {
    id: 'T011',
    title: 'Run integration tests and verify all contract tests pass',
    description: 'Execute `cd api && npm test -- rate-limit.contract.test.ts`; verify 100% test pass rate (7/7 or more); verify no regressions in existing tests; verify coverage report shows ≥80% line coverage for rate-limit.ts'
  },

  // Phase 4.4: Manual Verification
  {
    id: 'T012',
    title: 'Execute manual verification from quickstart.md',
    description: 'Complete manual verification from specs/024-title-week-5/quickstart.md: verify single request returns 200 with rate-limit headers; verify 101 requests with 101st returning 429; verify response body and Retry-After header; verify independent quotas; verify GET exemption; verify logging output'
  }
];

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
 * Get team ID and parent issue UUID from parent issue identifier
 */
async function getTeamAndParentId() {
  const query = `
    query {
      issue(id: "${PARENT_ISSUE}") {
        id
        team {
          id
        }
      }
    }
  `;
  
  const response = await makeRequest(query);
  if (response.errors) {
    throw new Error(`Failed to fetch parent issue: ${response.errors[0].message}`);
  }
  
  const issue = response.data.issue;
  return {
    teamId: issue.team.id,
    parentId: issue.id
  };
}

/**
 * Get "Backlog" state ID
 */
async function getBacklogStateId(teamId) {
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
    console.log('⚠️  Could not fetch workflow states. Issues will use default state.');
    return null;
  }
  
  const states = response.data?.workflows?.nodes?.[0]?.states?.nodes || [];
  const backlogState = states.find(s => s.name.toLowerCase() === 'backlog');
  
  return backlogState?.id || null;
}

/**
 * Create a sub-issue
 */
async function createSubIssue(teamId, parentId, task) {
  const title = task.title.replace(/"/g, '\\"').replace(/\\/g, '\\\\');
  const description = task.description.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');

  const query = `
    mutation {
      issueCreate(input: {
        title: "${title}"
        description: "${description}"
        teamId: "${teamId}"
        parentId: "${parentId}"
      }) {
        issue {
          id
          identifier
          title
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
    throw new Error(`Failed to create sub-issue ${task.id}: ${response.errors[0].message}`);
  }

  return response.data.issueCreate.issue;
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log(`🚀 Creating Linear sub-issues for 024-title-week-5`);
    console.log(`📍 Parent issue: ${PARENT_ISSUE}`);
    console.log(`📋 Total tasks: ${TASKS.length}`);
    console.log('');

    // Get team ID and parent issue UUID
    console.log('🔍 Fetching team and parent issue...');
    const { teamId, parentId } = await getTeamAndParentId();
    console.log(`✅ Team ID: ${teamId}`);
    console.log(`✅ Parent ID: ${parentId}`);
    console.log('');

    // Create sub-issues
    console.log('📝 Creating sub-issues...');
    console.log('');

    let successCount = 0;
    let errorCount = 0;

    for (const task of TASKS) {
      try {
        const issue = await createSubIssue(teamId, parentId, task);
        console.log(`✅ ${task.id}: ${issue.identifier} - ${issue.title}`);
        successCount++;
      } catch (error) {
        console.error(`❌ ${task.id}: ${error.message}`);
        errorCount++;
      }
    }

    console.log('');
    console.log('═'.repeat(60));
    console.log(`📊 Summary: ${successCount} created, ${errorCount} failed`);
    console.log('═'.repeat(60));
    console.log('');
    console.log(`✨ Sub-issues created under ${PARENT_ISSUE}`);
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

