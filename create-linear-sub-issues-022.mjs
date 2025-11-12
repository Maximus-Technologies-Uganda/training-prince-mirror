#!/usr/bin/env node

/**
 * Create Linear Sub-Issues for 022-title-week-5
 * Week 5: Implement MVP API Endpoints (Healthz, Convert)
 * 
 * Usage:
 *   export LINEAR_API_KEY="your-linear-api-key"
 *   node create-linear-sub-issues-022.mjs
 * 
 * This script creates 27 sub-issues under PRI-2472 (parent issue).
 * Each sub-issue maps to a task in specs/022-title-week-5/tasks.md
 */

import https from 'https';

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;
const PARENT_ISSUE = 'PRI-2473';

if (!LINEAR_API_KEY) {
  console.error('❌ Error: LINEAR_API_KEY environment variable not set');
  console.error('');
  console.error('Usage:');
  console.error('  export LINEAR_API_KEY="your-api-key"');
  console.error('  node create-linear-sub-issues-022.mjs');
  console.error('');
  console.error('Get your API key from: https://linear.app/settings/api');
  process.exit(1);
}

// Task definitions from tasks.md - RETRY ONLY: T010, T022, T025, T026
const TASKS = [
  {
    id: 'T010',
    title: 'Create temperature converter service',
    description: 'Create `api/src/services/converter.ts` with `convertTemperature(value: number, from: "C" | "F", to: "C" | "F"): number` function. Import conversion logic from `src/temp-converter`. Handle identity conversion (from === to): return value unchanged. C→F: `(C × 9/5) + 32`, F→C: `(F - 32) × 5/9`'
  },
  {
    id: 'T022',
    title: 'Run full test suite with coverage',
    description: 'Run full test suite with coverage: `npm run test:coverage`. Verify ≥80% unit test coverage, ≥70% integration test coverage. Generate coverage report at `api/coverage/lcov.info` and `api/coverage/index.html`'
  },
  {
    id: 'T025',
    title: 'Verify quickstart scenarios',
    description: 'Follow `specs/022-title-week-5/quickstart.md`. Test all 7 scenarios: GET /healthz (200), POST /convert F→C (200), POST /convert C→F (200), POST /convert identity (200), POST /convert missing value (400), POST /convert invalid unit (400), POST /convert non-numeric value (400). All scenarios must match expected responses'
  },
  {
    id: 'T026',
    title: 'Verify CI workflow',
    description: 'Verify `.github/workflows/api-checks.yml` workflow runs successfully on push to `022-title-week-5`. Workflow should execute lint checks (pass), unit tests with coverage ≥80% (pass), integration tests with coverage ≥70% (pass), generate and upload review packet artifact `review-packet-api`'
  }
];

// ORIGINAL FULL TASK LIST (commented out to prevent duplicates)
/*
const TASKS_FULL = [
  {
    id: 'T001',
    title: 'Create contract test for GET /healthz [P]',
    description: 'Create contract test `api/tests/contract/healthz.contract.test.ts` validating GET `/healthz` response schema matches OpenAPI spec (status, version, currentTime fields; must fail initially - no implementation)'
  },
  {
    id: 'T002',
    title: 'Create contract test for POST /convert - success [P]',
    description: 'Create contract test `api/tests/contract/convert.contract.test.ts` - success case validating POST `/convert` response schema matches OpenAPI spec (value, unit fields)'
  },
  {
    id: 'T003',
    title: 'Create contract test for POST /convert - validation errors [P]',
    description: 'Create contract test `api/tests/contract/convert.contract.test.ts` - validation error cases (missing value, invalid from/to units, non-numeric value); must return HTTP 400 with error schema'
  },
  {
    id: 'T004',
    title: 'Create TypeScript type definitions [P]',
    description: 'Create `api/src/types/index.ts` with TypeScript interfaces: `HealthCheckResponse`, `ConversionRequest`, `ConversionResponse`, `ValidationErrorResponse`'
  },
  {
    id: 'T005',
    title: 'Create Zod validation schemas [P]',
    description: 'Create `api/src/schemas/index.ts` with Zod validation schemas: `HealthCheckResponseSchema`, `ConversionRequestSchema`, `ConversionResponseSchema` matching data-model.md'
  },
  {
    id: 'T006',
    title: 'Create validation middleware [P]',
    description: 'Create `api/src/middleware/validation.ts` with `validateBody` middleware that catches Zod validation errors and returns HTTP 400 with `{ error: "Validation failed", details: [...] }` format'
  },
  {
    id: 'T007',
    title: 'Update OpenAPI spec - GET /healthz',
    description: 'Update `/api/spec/openapi.yaml` with GET `/healthz` endpoint definition including response schema (status, version, currentTime)'
  },
  {
    id: 'T008',
    title: 'Update OpenAPI spec - POST /convert',
    description: 'Update `/api/spec/openapi.yaml` with POST `/convert` endpoint definition including request body schema (value, from, to) and response schema (value, unit)'
  },
  {
    id: 'T009',
    title: 'Update OpenAPI spec - error schemas',
    description: 'Update `/api/spec/openapi.yaml` with error response schema for POST `/convert` validation failures'
  },
  {
    id: 'T010',
    title: 'Create temperature converter service',
    description: 'Create `api/src/services/converter.ts` with `convertTemperature(value: number, from: "C" | "F", to: "C" | "F"): number` function. Import conversion logic from `src/temp-converter`. Handle identity conversion (from === to): return value unchanged. C→F: `(C × 9/5) + 32`, F→C: `(F - 32) × 5/9`'
  },
  {
    id: 'T011',
    title: 'Implement GET /healthz route',
    description: 'Implement GET `/healthz` route handler in `api/src/routes/health.ts`. Return status: "ok", version: read from `api/package.json` at runtime, currentTime: ISO 8601 format. Must pass contract test T001'
  },
  {
    id: 'T012',
    title: 'Implement POST /convert route',
    description: 'Implement POST `/convert` route handler in `api/src/routes/convert.ts`. Accept JSON body via middleware validation. Call `convertTemperature(value, from, to)` from converter service. Return response: `{ value: converted, unit: to }`. Must pass contract test T002 (success case)'
  },
  {
    id: 'T013',
    title: 'Register routes in server',
    description: 'Register both routes in `api/src/server.ts`. Mount `/healthz` GET handler and `/convert` POST handler with validation middleware. Verify no routes added beyond these two'
  },
  {
    id: 'T014',
    title: 'Create integration tests for GET /healthz [P]',
    description: 'Create `api/tests/integration/health.test.ts` with Supertest tests: GET /healthz returns 200 with correct schema, response includes all required fields (status, version, currentTime), currentTime is valid ISO 8601 format'
  },
  {
    id: 'T015',
    title: 'Create integration tests for POST /convert - success [P]',
    description: 'Create `api/tests/integration/convert.test.ts` - success cases (Supertest): POST /convert with `{ value: 32, from: "F", to: "C" }` returns 200 with `{ value: 0, unit: "C" }`, POST /convert with `{ value: 0, from: "C", to: "F" }` returns 200 with `{ value: 32, unit: "F" }`, POST /convert with identity conversion returns 200 with `{ value: 100, unit: "C" }`'
  },
  {
    id: 'T016',
    title: 'Create integration tests for POST /convert - errors [P]',
    description: 'Create `api/tests/integration/convert.test.ts` - validation error cases (Supertest): missing value returns 400, non-numeric value returns 400, invalid from/to unit returns 400. All error responses include `error: "Validation failed"` and `details` array with Zod error info'
  },
  {
    id: 'T017',
    title: 'Create unit tests for converter service [P]',
    description: 'Create `api/tests/unit/converter.test.ts` with Vitest. Test: convertTemperature(32, "F", "C") = 0, convertTemperature(0, "C", "F") = 32, convertTemperature(100, "C", "C") = 100 (identity), negative values, decimal values'
  },
  {
    id: 'T018',
    title: 'Create unit tests for validation schemas [P]',
    description: 'Create `api/tests/unit/schemas.test.ts` with Vitest. Test ConversionRequestSchema accepts valid requests, rejects missing fields, rejects non-numeric value, rejects invalid units. Test HealthCheckResponseSchema accepts valid responses'
  },
  {
    id: 'T019',
    title: 'Run contract tests',
    description: 'Run all contract tests: `npm run test -- tests/contract` (must pass; T001-T003). Verify all contract tests execute successfully'
  },
  {
    id: 'T020',
    title: 'Run integration tests',
    description: 'Run all integration tests: `npm run test -- tests/integration` (must pass; T014-T016). Verify all integration tests execute successfully'
  },
  {
    id: 'T021',
    title: 'Run unit tests',
    description: 'Run all unit tests: `npm run test -- tests/unit` (must pass; T017-T018). Verify all unit tests execute successfully'
  },
  {
    id: 'T022',
    title: 'Run full test suite with coverage',
    description: 'Run full test suite with coverage: `npm run test:coverage`. Verify ≥80% unit test coverage, ≥70% integration test coverage. Generate coverage report at `api/coverage/lcov.info` and `api/coverage/index.html`'
  },
  {
    id: 'T023',
    title: 'Verify TypeScript compilation',
    description: 'Run: `npm run lint`. Verify no TypeScript or ESLint errors'
  },
  {
    id: 'T024',
    title: 'Verify development server',
    description: 'Run: `npm run dev`. Verify server starts without errors and listens on port 3000. Expected output: "Server running at http://localhost:3000"'
  },
  {
    id: 'T025',
    title: 'Verify quickstart scenarios',
    description: 'Follow `specs/022-title-week-5/quickstart.md`. Test all 7 scenarios: GET /healthz (200), POST /convert F→C (200), POST /convert C→F (200), POST /convert identity (200), POST /convert missing value (400), POST /convert invalid unit (400), POST /convert non-numeric value (400). All scenarios must match expected responses'
  },
  {
    id: 'T026',
    title: 'Verify CI workflow',
    description: 'Verify `.github/workflows/api-checks.yml` workflow runs successfully on push to `022-title-week-5`. Workflow should execute lint checks (pass), unit tests with coverage ≥80% (pass), integration tests with coverage ≥70% (pass), generate and upload review packet artifact `review-packet-api`'
  },
  {
    id: 'T027',
    title: 'Verify review artifacts',
    description: 'Check `review-artifacts/` directory contains: `lcov.info` (coverage data), `index.html` (coverage report), `api-coverage-report.html` (or similar), test results summary'
  }
];

/**
 * Make HTTP request to Linear API
 */
function makeRequest(query, debug = false) {
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
          const parsed = JSON.parse(body);
          if (debug) {
            console.log('   [DEBUG] Response:', JSON.stringify(parsed, null, 2));
          }
          resolve(parsed);
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
 * Escape string for GraphQL
 */
function escapeGraphQL(str) {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\\\')      // Backslash
    .replace(/"/g, '\\"')         // Double quote
    .replace(/\n/g, '\\n')        // Newline
    .replace(/\r/g, '\\r')        // Carriage return
    .replace(/\t/g, '\\t')        // Tab
    .replace(/\b/g, '\\b')        // Backspace
    .replace(/\f/g, '\\f');       // Form feed
}

/**
 * Create a single sub-issue
 */
async function createSubIssue(task, parentIssueId, teamId) {
  const escapedTitle = escapeGraphQL(task.title);
  const escapedDesc = escapeGraphQL(task.description);
  
  const mutation = `
    mutation {
      issueCreate(input: {
        teamId: "${teamId}"
        title: "${escapedTitle}"
        description: "${escapedDesc}"
        parentId: "${parentIssueId}"
      }) {
        success
        issue {
          id
          identifier
          title
        }
      }
    }
  `;

  try {
    const response = await makeRequest(mutation);

    if (response.errors) {
      console.error(`❌ GraphQL Error for ${task.id}:`, response.errors[0]?.message);
      return null;
    }

    if (response.data?.issueCreate?.success && response.data?.issueCreate?.issue) {
      const issue = response.data.issueCreate.issue;
      console.log(`✅ ${task.id}: Created ${issue.identifier} - ${issue.title}`);
      return issue;
    } else {
      console.error(`❌ ${task.id}: Creation failed - Response:`, response.data?.issueCreate);
      return null;
    }
  } catch (error) {
    console.error(`❌ ${task.id}: Request failed -`, error.message);
    return null;
  }
}

/**
 * Get Linear issue info by identifier (e.g., PRI-2473)
 */
async function getIssueInfo(issueIdentifier) {
  try {
    console.log(`   Attempting to lookup ${issueIdentifier}...`);
    
    // Method 1: Direct identifier filter (might not work immediately after creation)
    console.log(`   Method 1: Searching by identifier...`);
    const query1 = `
      query {
        issues(filter: { identifier: { eq: "${issueIdentifier}" } }, first: 10) {
          nodes {
            id
            identifier
            team {
              id
            }
          }
        }
      }
    `;
    
    const response1 = await makeRequest(query1);
    if (response1.data?.issues?.nodes?.length > 0) {
      const issue = response1.data.issues.nodes[0];
      console.log(`   ✅ Found: ${issue.identifier}`);
      return {
        id: issue.id,
        teamId: issue.team.id
      };
    }
    
    // Method 2: Fetch all issues and search manually
    console.log(`   Method 2: Fetching all issues and searching...`);
    const query2 = `
      query {
        issues(first: 100) {
          nodes {
            id
            identifier
            team {
              id
            }
          }
        }
      }
    `;
    
    const response2 = await makeRequest(query2);
    if (response2.data?.issues?.nodes?.length > 0) {
      const match = response2.data.issues.nodes.find(
        issue => issue.identifier === issueIdentifier
      );
      if (match) {
        console.log(`   ✅ Found: ${match.identifier}`);
        return {
          id: match.id,
          teamId: match.team.id
        };
      }
    }
    
    // Method 3: Try with text search
    console.log(`   Method 3: Trying text search...`);
    const query3 = `
      query {
        issues(filter: { searchableText: "${issueIdentifier}" }, first: 20) {
          nodes {
            id
            identifier
            team {
              id
            }
          }
        }
      }
    `;
    
    const response3 = await makeRequest(query3);
    if (response3.data?.issues?.nodes?.length > 0) {
      const match = response3.data.issues.nodes.find(
        issue => issue.identifier === issueIdentifier
      );
      if (match) {
        console.log(`   ✅ Found: ${match.identifier}`);
        return {
          id: match.id,
          teamId: match.team.id
        };
      }
    }
    
    console.error(`❌ Could not find issue: ${issueIdentifier} after trying 3 methods`);
    console.error('');
    console.error('   SOLUTION: Use the internal Linear ID instead of the identifier:');
    console.error('   1. Open https://linear.app/issue/${issueIdentifier} in your browser');
    console.error('   2. Click the three dots menu (⋯) in the top right');
    console.error('   3. Select "Copy issue ID"');
    console.error('   4. Edit create-linear-sub-issues-022.mjs line 18');
    console.error('   5. Replace PRI-2473 with the ID you copied (e.g., 9a2c8f...)');
    console.error('   6. Run the script again');
    return null;
  } catch (error) {
    console.error(`❌ Failed to get issue info for ${issueIdentifier}:`, error.message);
    return null;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('');
  console.log('🚀 Creating Linear Sub-Issues for 022-title-week-5');
  console.log(`   Parent Issue: ${PARENT_ISSUE}`);
  console.log(`   Total Tasks: ${TASKS.length}`);
  console.log('');

  // Get parent issue info and team ID
  console.log(`📋 Looking up parent issue ${PARENT_ISSUE}...`);
  const issueInfo = await getIssueInfo(PARENT_ISSUE);
  if (!issueInfo) {
    console.error('❌ Failed to get issue info. Make sure the parent issue exists in Linear.');
    process.exit(1);
  }
  console.log(`✅ Found issue: ${PARENT_ISSUE}`);
  console.log(`✅ Team ID: ${issueInfo.teamId}`);
  console.log('');

  // Create sub-issues
  console.log('📝 Creating sub-issues...');
  console.log('');

  let created = 0;
  let failed = 0;

  for (const task of TASKS) {
    const issue = await createSubIssue(task, issueInfo.id, issueInfo.teamId);
    if (issue) {
      created++;
    } else {
      failed++;
    }
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log('');
  console.log('✨ Summary:');
  console.log(`   Created: ${created}/${TASKS.length}`);
  if (failed > 0) {
    console.log(`   Failed: ${failed}/${TASKS.length}`);
  }
  console.log('');

  if (failed === 0) {
    console.log('🎉 All sub-issues created successfully!');
    console.log(`   View them at: https://linear.app/issue/${PARENT_ISSUE}`);
  } else {
    console.log('⚠️  Some sub-issues failed to create. Check errors above.');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Fatal error:', error.message);
  process.exit(1);
});

