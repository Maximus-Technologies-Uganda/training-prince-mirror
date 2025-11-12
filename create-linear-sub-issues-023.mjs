#!/usr/bin/env node

/**
 * Create Linear Sub-Issues for 023-title-week-5
 * Week 5: Implement MVP API Endpoints (Expenses)
 * 
 * Usage:
 *   export LINEAR_API_KEY="your-linear-api-key"
 *   node create-linear-sub-issues-023.mjs
 * 
 * This script creates 30 sub-issues under PRI-2501 (parent issue).
 * Each sub-issue maps to a task in specs/023-title-week-5/tasks.md
 * All sub-issues will be marked as "In Progress" upon creation.
 */

import https from 'https';

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;
const PARENT_ISSUE = 'PRI-2501';

if (!LINEAR_API_KEY) {
  console.error('❌ Error: LINEAR_API_KEY environment variable not set');
  console.error('');
  console.error('Usage:');
  console.error('  export LINEAR_API_KEY="your-api-key"');
  console.error('  node create-linear-sub-issues-023.mjs');
  console.error('');
  console.error('Get your API key from: https://linear.app/settings/api');
  process.exit(1);
}

// Task definitions from specs/023-title-week-5/tasks.md
const TASKS = [
  // Phase 4.1: Specification & Contract Tests (TDD Foundation)
  {
    id: 'T001',
    title: 'Create contract test for POST /expenses [P]',
    description: 'Create contract test `api/tests/contract/expenses.contract.test.ts` validating POST `/expenses` request schema matches spec (amount > 0, category string, date ISO 8601) with Zod error assertions; must fail initially (no implementation)'
  },
  {
    id: 'T002',
    title: 'Create contract test POST /expenses response schema [P]',
    description: 'Create contract test `api/tests/contract/expenses.contract.test.ts` - POST `/expenses` response schema validation: response includes `id` (UUID), `amount`, `category`, `date` fields; must pass when expense created successfully'
  },
  {
    id: 'T003',
    title: 'Create contract test POST /expenses validation errors [P]',
    description: 'Create contract test `api/tests/contract/expenses.contract.test.ts` - validation error cases: missing required fields, negative amount, zero amount, invalid date format; each returns HTTP 400 with error schema'
  },
  {
    id: 'T004',
    title: 'Create contract test GET /expenses/summary response [P]',
    description: 'Create contract test `api/tests/contract/expenses.contract.test.ts` - GET `/expenses/summary` response schema validation: returns object with `total` (number), `count` (number), `filters` (object); must pass when summary retrieved'
  },
  {
    id: 'T005',
    title: 'Create contract test GET /expenses/summary query params [P]',
    description: 'Create contract test `api/tests/contract/expenses.contract.test.ts` - GET `/expenses/summary` query parameter validation: category filter (string), month filter (YYYY-MM format), both filters simultaneously all result in correct schema responses'
  },

  // Phase 4.2: Type Definitions & Validation Schemas
  {
    id: 'T006',
    title: 'Create TypeScript type definitions [P]',
    description: 'Create `api/src/types/index.ts` with TypeScript interfaces: `Expense` (id: string, amount: number, category: string, date: string), `ExpenseSummary` (total: number, count: number, filters: object), `CreateExpenseRequest` (amount, category, date), `GetExpenseSummaryQuery` (category?, month?), `ValidationErrorResponse` (errors array with field and message)'
  },
  {
    id: 'T007',
    title: 'Create Zod validation schemas [P]',
    description: 'Create `api/src/schemas/index.ts` with Zod validation schemas: `CreateExpenseSchema` with `amount.positive()` (reject ≤0), `category.min(1)` (non-empty), `date.regex(/^\\d{4}-\\d{2}-\\d{2}$/)` with custom error messages showing expected format and received value. Custom refine for date to validate actual date exists (e.g., 2025-02-30 invalid). Export formatted error responses.'
  },
  {
    id: 'T008',
    title: 'Create validation middleware [P]',
    description: 'Create `api/src/middleware/validation.ts` - enhance existing or create `validateBody` middleware: catches Zod validation errors, extracts field name and message, returns HTTP 400 with standardized error format: `{ errors: [{ field, message }] }`. Include descriptive messages: "amount must be greater than 0", "date must be in YYYY-MM-DD format (received: {value})"'
  },

  // Phase 4.3: OpenAPI Specification Update
  {
    id: 'T009',
    title: 'Update OpenAPI spec - POST /expenses endpoint',
    description: 'Update `/api/spec/openapi.yaml` with POST `/expenses` endpoint: request body schema with amount (positive number), category (string), date (ISO 8601), response schema 201 Created: id (UUID), amount, category, date, response schema 400 Bad Request: errors array with field/message structure, example payloads for both success and error cases'
  },
  {
    id: 'T010',
    title: 'Update OpenAPI spec - GET /expenses/summary endpoint',
    description: 'Update `/api/spec/openapi.yaml` with GET `/expenses/summary` endpoint: query parameters: category (optional string), month (optional YYYY-MM format), response schema 200: total (number), count (number), filters (object), example responses: no filters, category only, month only, both filters, empty result'
  },
  {
    id: 'T011',
    title: 'Update OpenAPI spec - error response schema',
    description: 'Update `/api/spec/openapi.yaml` with complete error response schema for both endpoints'
  },

  // Phase 4.4: Expense Service & Storage Layer
  {
    id: 'T012',
    title: 'Create ExpenseStore service class [P]',
    description: 'Create `api/src/services/expenses.ts` with `ExpenseStore` class: private in-memory array `expenses: Expense[] = []`, method `create(request: CreateExpenseRequest): Expense` generates UUID via `crypto.randomUUID()`, creates object with id/amount/category/date, adds to array and returns, method `getAll(): Expense[]` returns copy of array, method `filter(category?: string, month?: string): Expense[]` filters by category/month with AND logic support'
  },
  {
    id: 'T013',
    title: 'Implement ExpenseStore aggregation [P]',
    description: 'Create `api/src/services/expenses.ts` continuation - `ExpenseStore` aggregation: method `summarize(filters?: { category?: string, month?: string }): ExpenseSummary` calls filter() with provided filters, calculates `total = sum of filtered amounts`, `count = length of filtered array`, returns object: `{ total, count, filters: filters || {} }`, returns `{ total: 0, count: 0, filters: {...} }` if no matches'
  },
  {
    id: 'T014',
    title: 'Create ExpenseStore singleton export [P]',
    description: 'Create singleton export in `api/src/services/expenses.ts`: export instance: `export const expenseStore = new ExpenseStore()`. This allows tests to reset state if needed and routes to access shared store'
  },

  // Phase 4.5: Core Route Implementation
  {
    id: 'T015',
    title: 'Implement POST /expenses route handler',
    description: 'Implement POST `/expenses` route handler in `api/src/routes/expenses.ts`: accept validated request body via middleware, call `expenseStore.create(request)` from service, return response with 201 status code: `{ id, amount, category, date }`, validation errors automatically handled by middleware → 400'
  },
  {
    id: 'T016',
    title: 'Implement GET /expenses/summary route handler',
    description: 'Implement GET `/expenses/summary` route handler in `api/src/routes/expenses.ts`: extract query parameters: `category`, `month` (both optional), call `expenseStore.summarize({ category, month })` from service, return response with 200 status code: `{ total, count, filters }`, always return 200 even if no expenses match'
  },
  {
    id: 'T017',
    title: 'Register routes in server.ts',
    description: 'Register routes in `api/src/server.ts`: import `expenses` router from `api/src/routes/expenses.ts`, mount at `/expenses` path using `app.use(\'/expenses\', expensesRouter)`, verify routes accessible at POST `/expenses` and GET `/expenses/summary`, ensure validation middleware applied to POST requests'
  },

  // Phase 4.6: Integration Tests
  {
    id: 'T018',
    title: 'Create POST /expenses integration tests - success [P]',
    description: 'Create `api/tests/integration/expenses.test.ts` - POST /expenses success cases (Supertest): POST with `{ amount: 25.50, category: "food", date: "2025-11-05" }` returns 201 with all fields including UUID in id, POST with `{ amount: 100, category: "transport", date: "2025-11-01" }` returns 201, response id field is valid UUID v4 format, amount and category echo correctly in response'
  },
  {
    id: 'T019',
    title: 'Create POST /expenses integration tests - validation errors [P]',
    description: 'Create `api/tests/integration/expenses.test.ts` - POST /expenses validation error cases: missing `amount`, `category`, `date` each return 400, negative/zero amount returns 400 with message "amount must be greater than 0", empty/whitespace category returns 400, invalid date format (e.g., "11/05/2025") returns 400 with expected format and received value shown, invalid calendar date (e.g., "2025-13-01") returns 400'
  },
  {
    id: 'T020',
    title: 'Create GET /expenses/summary integration tests - no filters [P]',
    description: 'Create `api/tests/integration/expenses.test.ts` - GET /expenses/summary no filters: after creating expenses: food 20, transport 30, food 15 across different dates, GET `/expenses/summary` returns 200 with total 65, count 3, filters: {}, response structure verified'
  },
  {
    id: 'T021',
    title: 'Create GET /expenses/summary integration tests - category filter [P]',
    description: 'Create `api/tests/integration/expenses.test.ts` - GET /expenses/summary with category filter: GET `/expenses/summary?category=food` returns 200 with total 35 (20+15), count 2, filters: { category: "food" }, GET `/expenses/summary?category=transport` returns total 30, count 1, GET `/expenses/summary?category=nonexistent` returns total 0, count 0'
  },
  {
    id: 'T022',
    title: 'Create GET /expenses/summary integration tests - month filter [P]',
    description: 'Create `api/tests/integration/expenses.test.ts` - GET /expenses/summary with month filter: create expenses across months: 2025-10-15 (100), 2025-11-01 (20), 2025-11-15 (45), GET `/expenses/summary?month=2025-11` returns total 65 (20+45), count 2, GET `/expenses/summary?month=2025-10` returns total 100, count 1, GET `/expenses/summary?month=2025-12` returns total 0'
  },
  {
    id: 'T023',
    title: 'Create GET /expenses/summary integration tests - both filters [P]',
    description: 'Create `api/tests/integration/expenses.test.ts` - GET /expenses/summary with both filters: GET `/expenses/summary?category=food&month=2025-11` returns correct aggregation with both filters applied (AND logic), filters object includes both category and month keys, verify filters applied independently in combinations'
  },

  // Phase 4.7: Unit Tests
  {
    id: 'T024',
    title: 'Create unit tests for ExpenseStore.create() [P]',
    description: 'Create `api/tests/unit/expenses.test.ts` - ExpenseStore.create(): creates expense with provided fields, assigns UUID to id field, returns object matching Expense interface, multiple calls generate different IDs, test with various amounts (1, 0.01, 999.99), test with various categories (single char, long string, special chars)'
  },
  {
    id: 'T025',
    title: 'Create unit tests for ExpenseStore.filter() [P]',
    description: 'Create `api/tests/unit/expenses.test.ts` - ExpenseStore.filter(): filter by category returns only matching expenses, filter by month returns only matching expenses (date.startsWith(month)), filter by both returns intersection (AND logic), empty array when no matches, original array unchanged (returns new array)'
  },
  {
    id: 'T026',
    title: 'Create unit tests for ExpenseStore.summarize() [P]',
    description: 'Create `api/tests/unit/expenses.test.ts` - ExpenseStore.summarize(): no filter: total = sum of all amounts, count = total expenses, category filter: correct subset aggregation, month filter: correct subset aggregation, both filters: correct AND logic aggregation, empty expenses: returns { total: 0, count: 0, filters: {} }, decimal amounts aggregated correctly, no matching expenses: returns empty summary with filters preserved'
  },

  // Phase 4.8: Coverage Verification
  {
    id: 'T027',
    title: 'Verify test coverage meets requirements [P]',
    description: 'Run `npm run test:coverage` in `api/` directory and verify: unit test coverage ≥80% statements for `api/src/services/expenses.ts`, unit test coverage ≥80% statements for `api/src/schemas/index.ts`, integration test coverage ≥70% overall for expense endpoints, generate coverage report and document in PR'
  },

  // Phase 4.9: Documentation & Manual Testing
  {
    id: 'T028',
    title: 'Update API documentation',
    description: 'Update `api/README.md` or create endpoint documentation: link to OpenAPI spec for `/expenses` and `/expenses/summary`, quick reference for curl examples from quickstart.md, environment setup instructions'
  },
  {
    id: 'T029',
    title: 'Execute quickstart scenarios manually',
    description: 'Execute quickstart.md acceptance scenarios manually: run API server: `npm run dev` from `api/` directory, execute Scenario 1-9 from quickstart.md with curl or Postman, verify each scenario passes with expected responses, document any issues or clarifications needed'
  },
  {
    id: 'T030',
    title: 'Verify no console errors or warnings',
    description: 'Verify no console errors or warnings: run tests with `npm run test` in `api/`, run server with `npm run dev` and make sample requests, check for TypeScript type errors: `npm run typecheck` (if available), ensure linting passes: `npm run lint` (if available)'
  }
];

// GraphQL query to create sub-issue
const createSubIssueQuery = (title, description, parentIssueId, teamId) => `
  mutation {
    issueCreate(input: {
      title: "${title.replace(/"/g, '\\"').replace(/\\/g, '\\\\')}"
      description: "${description.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"
      teamId: "${teamId}"
      parentId: "${parentIssueId}"
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

// Get "In Progress" state ID
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
    console.log('⚠️  Could not fetch workflow states. Issues will use default state.');
    return null;
  }
  
  const states = response.data?.workflows?.nodes?.[0]?.states?.nodes || [];
  const inProgressState = states.find(s => s.name.toLowerCase() === 'in progress' || s.name.toLowerCase() === 'in-progress');
  
  return inProgressState?.id || null;
}

// GraphQL query to update issue state to "In Progress"
const updateIssueStateQuery = (issueId, stateId) => `
  mutation {
    issueUpdate(id: "${issueId}", input: {
      stateId: "${stateId}"
    }) {
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

// Helper function to make GraphQL requests
const makeRequest = (query) => {
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
      res.on('data', (chunk) => {
        data += chunk;
      });
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
};

// Get team ID and parent issue ID from Linear
async function getTeamAndParentId() {
  // First, try to get team from the parent issue itself
  const query = `
    query {
      issue(id: "PRI-2501") {
        id
        identifier
        team {
          id
          name
        }
      }
    }
  `;
  
  const response = await makeRequest(query);
  
  if (response.errors) {
    console.error('\n⚠️  Could not find parent issue PRI-2501.');
    console.error('GraphQL Error:', response.errors[0]?.message);
    console.error('\nTo fix this:');
    console.error('1. Make sure PRI-2501 exists in your Linear workspace');
    console.error('2. Verify your LINEAR_API_KEY is correct');
    console.error('3. Try running: export LINEAR_TEAM_ID="your-team-id" first\n');
    throw new Error('Parent issue lookup failed.');
  }
  
  const issue = response.data?.issue;
  const teamId = issue?.team?.id;
  const parentId = issue?.id;
  
  if (!teamId || !parentId) {
    console.error('\n❌ Parent issue PRI-2501 not found or has no team.');
    console.error('Make sure PRI-2501 exists in your Linear workspace.\n');
    console.error('Response:', JSON.stringify(response.data, null, 2));
    throw new Error('Could not find team or parent ID from issue.');
  }
  
  return { teamId, parentId };
}

// Main execution
async function main() {
  console.log(`\n🚀 Creating ${TASKS.length} sub-issues for ${PARENT_ISSUE}...\n`);

  let successCount = 0;
  let failureCount = 0;
  const createdIssues = [];

  // Get team ID and parent issue ID
  let teamId = process.env.LINEAR_TEAM_ID;
  let parentId = PARENT_ISSUE;
  
  try {
    console.log('🔍 Fetching parent issue details...');
    const { teamId: fetchedTeamId, parentId: fetchedParentId } = await getTeamAndParentId();
    teamId = fetchedTeamId;
    parentId = fetchedParentId;
    console.log(`✅ Team ID: ${teamId}`);
    console.log(`✅ Parent ID: ${parentId}\n`);
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }

  // Get "In Progress" state ID
  console.log('🔍 Fetching "In Progress" state...');
  const inProgressStateId = await getInProgressStateId(teamId);
  if (inProgressStateId) {
    console.log(`✅ Will set issues to "In Progress"\n`);
  } else {
    console.log(`⚠️  Will use default state for new issues\n`);
  }

  for (const task of TASKS) {
    try {
      console.log(`📝 Creating ${task.id}: ${task.title}...`);

      const response = await makeRequest(
        createSubIssueQuery(task.title, task.description, parentId, teamId)
      );

      if (response.errors) {
        console.error(`  ❌ Error: ${response.errors[0].message}`);
        failureCount++;
        continue;
      }

      if (response.data?.issueCreate?.success) {
        const issue = response.data.issueCreate.issue;
        console.log(`  ✅ Created: ${issue.identifier} - ${issue.title}`);
        createdIssues.push(issue);
        successCount++;

        // Update state to "In Progress" if we have the state ID
        if (inProgressStateId) {
          const updateResponse = await makeRequest(
            updateIssueStateQuery(issue.id, inProgressStateId)
          );
          if (updateResponse.data?.issueUpdate?.success) {
            console.log(`     ✅ Status: In Progress`);
          }
        }

        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
      } else {
        console.error(`  ❌ Failed to create issue`);
        failureCount++;
      }
    } catch (error) {
      console.error(`  ❌ Error: ${error.message}`);
      failureCount++;
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 Summary:`);
  console.log(`  ✅ Created: ${successCount}/${TASKS.length}`);
  console.log(`  ❌ Failed: ${failureCount}/${TASKS.length}`);
  console.log(`${'='.repeat(60)}\n`);

  if (createdIssues.length > 0) {
    console.log(`Created issues:`);
    createdIssues.forEach(issue => {
      console.log(`  - ${issue.identifier}: ${issue.title}`);
    });
    console.log('');
  }

  if (failureCount > 0) {
    process.exit(1);
  }
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

