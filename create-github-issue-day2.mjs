#!/usr/bin/env node

/**
 * Create GitHub Issue for Day 2: API Skeleton, Validation & Errors
 * 
 * Usage:
 *   GITHUB_TOKEN=your_token node create-github-issue-day2.mjs
 */

import https from 'https';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'Maximus-Technologies-Uganda';
const REPO_NAME = 'training-prince';

if (!GITHUB_TOKEN) {
  console.error('❌ Error: GITHUB_TOKEN environment variable not set');
  console.error('Usage: GITHUB_TOKEN=your_token node create-github-issue-day2.mjs');
  process.exit(1);
}

/**
 * Make HTTP request to GitHub API
 */
function githubRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path,
      method,
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Node.js',
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

/**
 * Create GitHub issue
 */
async function createIssue(title, body, labels = []) {
  const path = `/repos/${REPO_OWNER}/${REPO_NAME}/issues`;
  const issueData = {
    title,
    body,
    labels: labels.length > 0 ? labels : undefined,
  };

  try {
    const response = await githubRequest('POST', path, issueData);
    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error(`Failed to create issue: ${response.status} - ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    throw new Error(`Error creating issue: ${error.message}`);
  }
}

/**
 * Main execution
 */
async function main() {
  const issueTitle = 'feat(api): Day 2 - API Skeleton, Validation & Errors';
  
  const issueBody = `## Week 5 Day 2: API Skeleton, Validation & Errors

**Feature Branch**: \`027-title-week-5\`  
**Spec**: \`specs/027-title-week-5/spec.md\`

### Overview

This issue tracks the implementation of Day 2 objectives from the Week 5 workbook. The goal is to build the API "skeleton" (servers, routes, and handlers) to make the failing contract tests from Day 1 pass. This includes implementing validation, error handling, and a temporary in-memory data store.

### Core Requirements

#### API Skeleton & Routing
- [ ] Create the main server file (\`/api/src/server.ts\`) using Express
- [ ] Create the expenses routes file (\`/api/src/routes/expenses.ts\`) and register it with the main server
- [ ] Implement the route handlers for GET /expenses, POST /expenses, and GET /expenses/summary

#### Data Repository (In-Memory)
- [ ] Create a simple in-memory repository to store expense data
- [ ] Repository must expose functions: \`createExpense\`, \`findExpenses\`, \`getSummary\`
- [ ] Repository starts empty (no seed data required; tests create their own data)

#### Validation & Error Handling
- [ ] Implement Zod validation for all incoming request bodies (e.g., for POST /expenses)
- [ ] Create a central error middleware that catches errors and maps them to the standard error envelope
- [ ] Error envelope format: \`{ code, message, details }\` as defined in openapi.yaml spec
- [ ] Validation errors return 400 Bad Request with error envelope containing validation details
- [ ] Include invalid values in validation error details

#### Testing Requirements
- [ ] All contract tests from Day 1 must now pass
- [ ] Add unit tests for validation logic
- [ ] Add unit tests for data mappers (if any)
- [ ] Test & Coverage - API job must meet ≥60% coverage (lines/functions/branches)

### Definition of Done

- [ ] All contract tests for the expenses resource are passing
- [ ] GET /expenses endpoint returns paginated expense records with metadata in response body (wrapped object with \`data\` and \`pagination\` properties)
- [ ] POST /expenses endpoint creates expense records with validation
- [ ] GET /expenses/summary endpoint returns aggregated summaries
- [ ] In-memory data repository implemented
- [ ] Input validation implemented for all request bodies
- [ ] Central error handling middleware implemented
- [ ] Error middleware maps errors to standard error envelope format
- [ ] Request-id header is echoed in error responses when provided
- [ ] OpenAPI specification updated to include pagination metadata structure
- [ ] spec-check CI job passes
- [ ] CodeQL CI job passes
- [ ] Test & Coverage - API job passes with ≥60% coverage
- [ ] Pull Request opened, reviewed, and merged

### Related

- **Spec**: \`specs/027-title-week-5/spec.md\`
- **Day 1 PR**: Related to Day 1 implementation (spec-first artifacts)
- **Branch**: \`027-title-week-5\`

### Notes

- This implements the API contract defined in Day 1
- In-memory storage is temporary (data lost on server restart)
- Validation must match OpenAPI schemas from Day 1
- Error responses must not expose internal implementation details
`;

  const labels = ['enhancement', 'api', 'week-5'];

  console.log('🚀 Creating GitHub Issue...\n');
  console.log(`Title: ${issueTitle}\n`);

  try {
    const issue = await createIssue(issueTitle, issueBody, labels);
    console.log('✅ Issue created successfully!\n');
    console.log(`📋 Issue #${issue.number}: ${issue.title}`);
    console.log(`🔗 URL: ${issue.html_url}\n`);
    return issue;
  } catch (error) {
    console.error('❌ Error creating issue:', error.message);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});

