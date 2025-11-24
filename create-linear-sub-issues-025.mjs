#!/usr/bin/env node

/**
 * Create Linear Sub-Issues for 025-week-5-day
 * Week 5 Day-0: Final Hygiene & Migration to GitHub Projects
 * 
 * Usage:
 *   export LINEAR_API_KEY="your-linear-api-key"
 *   node create-linear-sub-issues-025.mjs
 * 
 * This script creates 25 sub-issues under PRI-2545 (parent issue).
 * Each sub-issue maps to a task in specs/025-week-5-day/tasks.md
 */

import https from 'https';

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;
const PARENT_ISSUE = 'PRI-2545';

if (!LINEAR_API_KEY) {
  console.error('❌ Error: LINEAR_API_KEY environment variable not set');
  console.error('');
  console.error('Usage:');
  console.error('  export LINEAR_API_KEY="your-api-key"');
  console.error('  node create-linear-sub-issues-025.mjs');
  console.error('');
  console.error('Get your API key from: https://linear.app/settings/api');
  process.exit(1);
}

// Task definitions from specs/025-week-5-day/tasks.md
const TASKS = [
  // Phase A: Preparation & Branch Cleanup
  {
    id: 'T001',
    title: 'Update main branch README with Week 5 paths',
    description: 'Link to all Week 5 resources and review packet entry point in README.md. Add section with links to: Review Packet, Specifications, Implementation Plan, Data Model, Contract Tests. Include note about Linear decommissioning.'
  },
  {
    id: 'T002',
    title: 'Identify and remove stray files from main branch',
    description: 'Clean up incomplete, malformed, or unnecessary files before merge. Identify unnecessary files (*.tmp, debug.log, hello.js..js, old test files). Remove stray files and commit.'
  },
  {
    id: 'T003',
    title: 'Document exact CI status check names from existing workflows',
    description: 'Extract exact check names to use in branch protection rules from .github/workflows/. Expected checks: spec-check, Test & Coverage - API, Playwright Smoke, CodeQL, Dependency Review.'
  },

  // Phase B: Configuration
  {
    id: 'T004',
    title: 'Configure branch protection rule for main branch',
    description: 'Enforce all 5 required status checks before merge to main via GitHub Settings UI (Settings → Branches → Add rule). Enable strict mode, disable force pushes and deletions.'
  },
  {
    id: 'T005',
    title: '[P] Create GitHub Project with custom fields',
    description: 'Establish new project management system replacing Linear. Navigate to repository → Projects tab → New project. Choose Table layout, name "Week 5 Day-0", private visibility.'
  },
  {
    id: 'T006',
    title: '[P] Configure GitHub Project custom fields',
    description: 'Add 5 required custom fields to GitHub Project: Status (Backlog, Todo, In Progress, In Review, Done), Priority (P0/Critical, P1/High, P2/Medium, P3/Low), Size (XS, S, M, L, XL), Spec URL (Text), Sprint/Week (Week 1-5, Week 5 Day-0).'
  },
  {
    id: 'T007',
    title: '[P] Configure GitHub Project automation rules',
    description: 'Auto-add issues/PRs and update status on events. Create rules: auto-add issues, auto-add PRs, PR opened → set Status to "In Review", PR merged → set Status to "Done".'
  },
  {
    id: 'T008',
    title: '[P] Create .github/ISSUE_TEMPLATE/feature.md',
    description: 'Guide contributors on submitting feature requests. Create template with frontmatter (name, about, title, labels) and sections: Description, Problem Statement, Proposed Solution, Acceptance Criteria (checkboxes), Related Links, Additional Context.'
  },
  {
    id: 'T009',
    title: '[P] Create .github/ISSUE_TEMPLATE/bug.md',
    description: 'Guide contributors on submitting bug reports. Create template with frontmatter and sections: Description, Reproduction Steps, Expected Behavior, Actual Behavior, Environment (browser/OS), Screenshots/Logs.'
  },
  {
    id: 'T010',
    title: '[P] Create/update .github/pull_request_template.md',
    description: 'Standardize PR submissions with mandatory sections. Include: Spec URL, Contract Tests (checkboxes), Changes Made, Checks (test, coverage, E2E, CodeQL, Dependency Review), CHANGELOG Updated, Breaking Changes, Related Issues.'
  },

  // Phase C: Verification & Validation
  {
    id: 'T011',
    title: 'Verify Vitest coverage configuration in vitest.config.js',
    description: 'Ensure 60% coverage thresholds are enforced across all 5 UI suites. Verify: provider v8, reporters text/html/json, include all 5 suites (Expense, Stopwatch, Temperature, Todo, Quote), exclude node_modules/dist/test files, thresholds 60% for all metrics.'
  },
  {
    id: 'T012',
    title: 'Run Vitest coverage and generate reports',
    description: 'Generate coverage reports to verify 60% thresholds met. Run: npm run test:coverage. Verify console shows "Coverage thresholds met" with all metrics ≥ 60%. Check coverage/index.html and coverage/coverage.json generated.'
  },
  {
    id: 'T013',
    title: 'Verify review-artifacts directory contains all required files',
    description: 'Ensure all linked artifacts exist: coverage/index.html, playwright-report/index.html, openapi.html, CHANGELOG.md. Verify all files present and review-artifacts/index.html contains links to all sections.'
  },
  {
    id: 'T014',
    title: '[P] Write contract test: branch-protection-setup',
    description: 'Create contract test file specs/025-week-5-day/contracts/branch-protection-setup.test.ts. Verify branch protection rule with all 5 required checks: spec-check, Test & Coverage - API, Playwright Smoke, CodeQL, Dependency Review. Test strict mode, no force pushes, no deletions.'
  },
  {
    id: 'T015',
    title: '[P] Write contract test: github-project-setup',
    description: 'Create contract test file specs/025-week-5-day/contracts/github-project-setup.test.ts. Verify GitHub Project created with all 5 custom fields, correct options for each field, automation rules active (auto-add issues/PRs, status updates).'
  },
  {
    id: 'T016',
    title: '[P] Write contract test: vitest-coverage-thresholds',
    description: 'Create contract test file specs/025-week-5-day/contracts/vitest-coverage-thresholds.test.ts. Verify coverage.json exists, all metrics ≥ 60% (lines, branches, functions, statements), all 5 UI suites included in coverage configuration, coverage/index.html report generated.'
  },
  {
    id: 'T017',
    title: '[P] Write contract test: review-packet-generation',
    description: 'Create contract test file specs/025-week-5-day/contracts/review-packet-generation.test.ts. Verify index.html entry point exists with links to coverage, Playwright, OpenAPI, CHANGELOG. Verify all linked files exist, package < 50MB, links are relative.'
  },
  {
    id: 'T018',
    title: '[P] Write contract test: issue-templates-validation',
    description: 'Create contract test file specs/025-week-5-day/contracts/issue-templates-validation.test.ts. Verify feature.md and bug.md exist with valid YAML frontmatter, required sections, valid Markdown syntax, no syntax errors.'
  },
  {
    id: 'T019',
    title: '[P] Write contract test: pull-request-template-validation',
    description: 'Create contract test file specs/025-week-5-day/contracts/pull-request-template-validation.test.ts. Verify PR template exists with all mandatory sections (Spec URL, Contract Tests, Checks, CHANGELOG Updated), guidance text, valid Markdown syntax.'
  },
  {
    id: 'T020',
    title: 'Run all contract tests to verify D0 compliance',
    description: 'Execute all 6 contract test files to verify D0 infrastructure meets specifications. Run: npm run test specs/025-week-5-day/contracts/. Verify: all ~45-50 assertions passing, no failing tests, complete coverage of all contracts.'
  },

  // Phase D: Finalization & Release
  {
    id: 'T021',
    title: 'Create git backup branch before squash merge',
    description: 'Preserve development branch history in case rollback needed. Run: git branch backup/week5-dev development. Push backup: git push origin backup/week5-dev. Verify backup exists: git branch -a | grep backup/week5-dev.'
  },
  {
    id: 'T022',
    title: 'Perform squash merge from development to main',
    description: 'Combine all development work into single clean commit on main. Run: git merge --squash development. Create comprehensive commit message with all D0 changes listed. Commit: git commit -m "Week 5 Day-0: Final hygiene and GitHub Projects migration..."'
  },
  {
    id: 'T023',
    title: 'Create annotated git tag for release',
    description: 'Mark the release milestone with tag week5-day0. Run: git tag -a week5-day0 -m "Week 5 Day-0 release - GitHub Projects migration complete...". Verify tag: git tag -l week5-day0 -n. Push tag: git push origin week5-day0.'
  },
  {
    id: 'T024',
    title: 'Push main branch and all tags to origin',
    description: 'Sync all changes and tags to remote repository. Run: git push origin main && git push origin --tags. Verify: main branch pushed to origin, week5-day0 tag visible in git ls-remote origin.'
  },
  {
    id: 'T025',
    title: 'Verify Definition of Done - Final validation checklist',
    description: 'Confirm all D0 requirements complete and main branch production-ready. Run validation script checking: README updated, stray files removed, squash merge commit exists, tag created, branch protection configured, coverage at 60%, review packet complete, GitHub Project created, templates exist, contract tests passing.'
  },
];

// Create GraphQL mutation for creating a sub-issue
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

// Get team ID and parent issue UUID from parent issue
async function getTeamAndParentId() {
  const query = `
    query {
      issue(id: "${PARENT_ISSUE}") {
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
    console.error(`\n❌ Error: Could not find parent issue ${PARENT_ISSUE}`);
    console.error(`   Details: ${response.errors[0].message}`);
    process.exit(1);
  }
  
  const teamId = response.data?.issue?.team?.id;
  const parentId = response.data?.issue?.id;
  
  if (!teamId || !parentId) {
    console.error(`\n❌ Error: Could not extract team ID or parent issue ID`);
    process.exit(1);
  }
  
  return { teamId, parentId };
}

async function main() {
  console.log('\n🚀 Creating 25 Linear sub-issues\n');
  console.log(`Parent Issue: ${PARENT_ISSUE}`);
  console.log('Title: Week 5 Day-0: Final Hygiene & Migration to GitHub Projects');
  console.log('Spec: 025-week-5-day\n');

  // Get team ID and parent issue UUID
  console.log('🔍 Fetching team ID and parent issue ID...');
  const { teamId, parentId } = await getTeamAndParentId();
  console.log(`✅ Team ID: ${teamId}`);
  console.log(`✅ Parent ID: ${parentId}\n`);

  let successCount = 0;
  let failureCount = 0;

  // Phase A
  console.log('📋 Phase A: Preparation & Branch Cleanup (T001-T003)');
  for (const task of TASKS.slice(0, 3)) {
    try {
      const response = await makeRequest(
        createSubIssueQuery(task.title, task.description, parentId, teamId)
      );

      if (response.errors) {
        console.log(`  ❌ ${task.id}: ${response.errors[0].message}`);
        failureCount++;
      } else if (response.data?.issueCreate?.success) {
        const issue = response.data.issueCreate.issue;
        console.log(`  ✅ ${issue.identifier}: ${task.id} - ${task.title}`);
        successCount++;
      } else {
        console.log(`  ❌ ${task.id}: Unknown error`);
        failureCount++;
      }
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`  ❌ ${task.id}: ${error.message}`);
      failureCount++;
    }
  }

  // Phase B
  console.log('\n⚙️  Phase B: Configuration (T004-T010)');
  for (const task of TASKS.slice(3, 10)) {
    try {
      const response = await makeRequest(
        createSubIssueQuery(task.title, task.description, parentId, teamId)
      );

      if (response.errors) {
        console.log(`  ❌ ${task.id}: ${response.errors[0].message}`);
        failureCount++;
      } else if (response.data?.issueCreate?.success) {
        const issue = response.data.issueCreate.issue;
        console.log(`  ✅ ${issue.identifier}: ${task.id} - ${task.title}`);
        successCount++;
      } else {
        console.log(`  ❌ ${task.id}: Unknown error`);
        failureCount++;
      }
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`  ❌ ${task.id}: ${error.message}`);
      failureCount++;
    }
  }

  // Phase C
  console.log('\n✅ Phase C: Verification & Validation (T011-T020)');
  for (const task of TASKS.slice(10, 20)) {
    try {
      const response = await makeRequest(
        createSubIssueQuery(task.title, task.description, parentId, teamId)
      );

      if (response.errors) {
        console.log(`  ❌ ${task.id}: ${response.errors[0].message}`);
        failureCount++;
      } else if (response.data?.issueCreate?.success) {
        const issue = response.data.issueCreate.issue;
        console.log(`  ✅ ${issue.identifier}: ${task.id} - ${task.title}`);
        successCount++;
      } else {
        console.log(`  ❌ ${task.id}: Unknown error`);
        failureCount++;
      }
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`  ❌ ${task.id}: ${error.message}`);
      failureCount++;
    }
  }

  // Phase D
  console.log('\n🎯 Phase D: Finalization & Release (T021-T025)');
  for (const task of TASKS.slice(20)) {
    try {
      const response = await makeRequest(
        createSubIssueQuery(task.title, task.description, parentId, teamId)
      );

      if (response.errors) {
        console.log(`  ❌ ${task.id}: ${response.errors[0].message}`);
        failureCount++;
      } else if (response.data?.issueCreate?.success) {
        const issue = response.data.issueCreate.issue;
        console.log(`  ✅ ${issue.identifier}: ${task.id} - ${task.title}`);
        successCount++;
      } else {
        console.log(`  ❌ ${task.id}: Unknown error`);
        failureCount++;
      }
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`  ❌ ${task.id}: ${error.message}`);
      failureCount++;
    }
  }

  console.log(`\n📊 Summary: Successfully created ${successCount}/${TASKS.length} sub-issues\n`);
  console.log(`✨ All 25 sub-issues created under ${PARENT_ISSUE}\n`);
}

main().catch((error) => {
  console.error('\n❌ Fatal error:', error.message);
  process.exit(1);
});
