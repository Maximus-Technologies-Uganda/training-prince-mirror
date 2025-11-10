# Tasks: Week 5 Day-0 - Final Hygiene & Migration to GitHub Projects

**Input**: Design documents from `/specs/025-week-5-day/`  
**Completed**: plan.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓, quickstart.md ✓  
**Feature**: GitHub Projects setup, branch protection, artifact generation, templates, final merge  
**Target Platform**: GitHub Actions (CI), GitHub Projects (PM), Git (version control)  
**Testing Strategy**: TDD - All infrastructure contract tests written first, then configuration verified

---

## Executive Summary

Week 5 Day-0 focuses on repository hygiene and transitioning from Linear to GitHub Projects. This involves:

1. **Phase A (Preparation)**: Branch cleanup, documentation updates
2. **Phase B (Configuration, Parallel)**: Branch protection, GitHub Project setup, templates
3. **Phase C (Verification)**: Review packet generation, coverage validation, contract test verification
4. **Phase D (Finalization)**: Squash merge, tagging, deployment readiness

**Total Tasks**: 25 sequentially numbered (T001-T025)  
**Parallel Groups**: 3 major parallel execution windows  
**Estimated Duration**: 2-3 hours for full execution (includes manual UI setup and merge operations)
**Exit Criteria**: All checks passing, production-ready main branch, team migrated to GitHub Projects, review packet generated and linked

**Key Changes from Initial Draft**:
- T013 upgraded from verification-only to active generation of review-artifacts/index.html with coverage data
- Removed T026 (GitHub Pages deployment) as out-of-scope for Day-0 (can be addressed in future spec)
- Added edge case recovery procedures for GitHub Project failures
- Clarified effort estimates and environment variable requirements

---

## Phase A: Preparation & Branch Cleanup

### T001 Update main branch README with Week 5 paths
**File**: `README.md`  
**Purpose**: Link to all Week 5 resources and review packet entry point  
**Steps**:
1. Checkout main branch: `git checkout main && git pull origin main`
2. Add Week 5 section with links to: Review Packet, Specifications, Implementation Plan, Data Model, Contract Tests
3. Include note about Linear decommissioning
4. Commit: `git add README.md && git commit -m "docs: update README with Week 5 paths and review packet link"`

**Validation**:
```bash
grep -q "review-artifacts" README.md && echo "✓ Review packet link added"
grep -q "Week 5" README.md && echo "✓ Week 5 section added"
```

**Related to Contract**: Review Packet Generation (artifact must be linked from README)

---

### T002 Identify and remove stray files from main branch
**File**: `git ls-files` (repository root)  
**Purpose**: Clean up incomplete, malformed, or unnecessary files before merge  
**Steps**:
1. Compare branches: `git diff --name-status development...main`
2. Identify stray files: `*.tmp`, `debug.log`, `hello.js..js`, incomplete scripts
3. Remove each: `git rm <file>`
4. Commit: `git add . && git commit -m "chore: remove stray files from main branch"`

**Validation**:
```bash
! git ls-files | grep -E "\\.tmp|debug\\.log|\\.\\.js" && echo "✓ Stray files removed"
git ls-files | grep -E "README|package\\.json|vitest\\.config" && echo "✓ Critical files intact"
```

**Related to**: General repository hygiene before deployment

---

### T003 Document exact CI status check names from existing workflows
**File**: `.github/workflows/` (read-only, analysis task)  
**Purpose**: Extract exact check names to use in branch protection rules  
**Steps**:
1. List all workflows: `ls -la .github/workflows/`
2. Extract status check names: `grep -h "name:" .github/workflows/*.yml | sort | uniq`
3. Document the 5 required checks:
   - `spec-check` (from spec-check.yml)
   - `Test & Coverage - API` (from api-checks.yml)
   - `Playwright Smoke` (from playwright.yml)
   - `CodeQL` (from codeql.yml)
   - `Dependency Review` (from dependency-review.yml)
4. Verify each workflow produces exactly one status check

**Validation**:
```bash
[ $(ls .github/workflows/*.yml | wc -l) -ge 5 ] && echo "✓ All 5 workflows present"
echo "Documented checks: spec-check, Test & Coverage - API, Playwright Smoke, CodeQL, Dependency Review"
```

**Related to Contract**: Branch Protection Rules (exact names must match)

---

## Phase B: Configuration (Parallel Possible)

> **Parallel Window 1**: T004, T005, T006 can run in parallel (different GitHub UI contexts)

### T004 Configure branch protection rule for main branch
**Location**: GitHub Settings UI or GitHub API  
**File**: `.github/` (no file changes; configuration only)  
**Purpose**: Enforce all 5 required status checks before merge to main  
**Prerequisites**: T003 must complete to document exact status check names  
**Skip Condition**: If a branch protection rule already exists on `main`, verify that all 5 required status checks are present and correctly configured. If all checks match the spec, skip this task. If any checks are missing or misconfigured, proceed to update the rule.  
**Steps**:

**Via GitHub Settings UI** (transparent, recommended):
1. Navigate to Settings → Branches → "Add rule" (or edit "main")
2. Set branch pattern: `main`
3. Enable "Require status checks to pass before merging"
4. Search and select each required check:
   - `spec-check`
   - `Test & Coverage - API`
   - `Playwright Smoke`
   - `CodeQL`
   - `Dependency Review`
5. Enable "Require branches to be up to date before merging"
6. Disable "Allow force pushes"
7. Disable "Allow deletions"
8. Click "Save changes"

**Via GitHub API** (alternative, if automation needed):
```bash
gh api repos/{owner}/{repo}/branches/main/protection \
  -X PUT \
  -f required_status_checks.strict=true \
  -f 'required_status_checks.contexts=["spec-check","Test & Coverage - API","Playwright Smoke","CodeQL","Dependency Review"]' \
  -f enforce_admins=false \
  -f allow_deletions=false \
  -f allow_force_pushes=false \
  -f required_linear_history=false
```

**Validation**:
```bash
# Verify via Settings UI (visual check)
# Or via CLI:
gh api repos/{owner}/{repo}/branches/main/protection | jq '.required_status_checks.contexts | length'
# Should output: 5
```

**Related to Contract**: Branch Protection Rules Configuration

---

### T005 [P] Create GitHub Project with custom fields
**Location**: GitHub Projects UI (Web)  
**Purpose**: Establish new project management system replacing Linear  
**Skip Condition**: If a GitHub Project named "Week 5 Day-0" already exists with all 5 custom fields (Status, Priority, Size, Spec URL, Sprint/Week) correctly configured, verify its settings match the spec and skip this task. If it exists but is incomplete or misconfigured, archive the old project and create a fresh one.  
**Steps**:
1. Navigate to repository → Projects tab
2. Click "New project"
3. Choose "Table" layout (recommended for custom fields)
4. Name: "Week 5 Day-0" (or "Sprint Board" for ongoing use)
5. Description: "Track work items across GitHub integrated with specifications"
6. Visibility: "Private" (or as appropriate)
7. Click "Create project"
8. Note the project URL for reference

**Validation**:
```bash
# Project visible at: https://github.com/{owner}/{repo}/projects/{number}
echo "✓ GitHub Project created and accessible"
```

**Parallel with**: T004, T006 (independent GitHub UI operations)

**Related to Contract**: GitHub Project Setup

---

### T006 [P] Configure GitHub Project custom fields
**Location**: GitHub Projects Settings  
**Purpose**: Define fields matching Linear migration plan  
**Prerequisites**: T005 must complete (project must exist before configuring fields)  
**Skip Condition**: If all 5 custom fields already exist in the GitHub Project with correct options and defaults (Status with Backlog/Todo/In Progress/In Review/Done, Priority with P0-P3 options, Size with XS-XL, Spec URL as text field, Sprint/Week with Week 1-5), verify configuration and skip this task.  
**Steps**:
1. In project, click "Settings" (gear icon)
2. Navigate to "Custom fields"
3. Add 5 required fields in order:

**Field 1: Status** (SingleSelect)
- Options: "Backlog", "Todo", "In Progress", "In Review", "Done"
- Default: "Backlog"

**Field 2: Priority** (SingleSelect)
- Options: "P0/Critical", "P1/High", "P2/Medium", "P3/Low"
- Default: "P2/Medium"

**Field 3: Size** (SingleSelect)
- Options: "XS", "S", "M", "L", "XL"
- Default: "M"

**Field 4: Spec URL** (Text)
- Placeholder: "https://..."
- Default: (none)

**Field 5: Sprint/Week** (SingleSelect)
- Options: "Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 5 Day-0"
- Default: "Week 5 Day-0"

4. Click "Save" for each field

**Validation**:
```bash
# Visual verification: all 5 custom fields appear in project view
# Try filtering/sorting by each field to confirm they're active
echo "✓ All 5 custom fields configured and sortable"
```

**Parallel with**: T004, T005 (independent GitHub UI operations)

**Related to Contract**: GitHub Project Custom Fields

---

### T007 Configure GitHub Project automation rules
**Location**: GitHub Projects Automation Settings  
**Purpose**: Auto-add issues/PRs and update status on events  
**Prerequisites**: T005 (project must exist) AND T006 (custom fields must exist before automation rules can reference them) must both complete before this task can begin  
**Sequential Marker**: This task MUST run sequentially after T005 and T006 (both project creation and custom field definitions must be complete). Cannot run in parallel because automation rules reference the custom fields configured in T006.  
**Steps**:
1. In project, click "Settings" → "Automation"
2. Enable or create these rules:

**Rule 1: Auto-add Issues**
- Trigger: Issues opened
- Action: Add to project
- Status: (Leave default)

**Rule 2: Auto-add PRs**
- Trigger: PRs opened
- Action: Add to project
- Status: (Leave default)

**Rule 3: PR Opened → Set Status to "In Review"**
- Trigger: PR opened
- Action: Set custom field "Status" to "In Review"

**Rule 4: PR Merged → Set Status to "Done"**
- Trigger: PR closed and merged
- Action: Set custom field "Status" to "Done"

3. Verify all rules show "Active" status

**Alternative via GitHub Actions** (if not available in Projects UI):
Create `.github/workflows/project-automation.yml` to handle PR events and update project status via GraphQL

**Validation**:
```bash
# Create test issue or PR to verify automation
# Check project to confirm issue/PR auto-appears
echo "✓ GitHub Project automation rules active"
```

**Requires**: T005 (project must exist), T006 (custom fields must exist before automation can reference them)

**Related to Contract**: GitHub Project Setup

---

### T008 [P] Create `.github/ISSUE_TEMPLATE/feature.md`
**File**: `.github/ISSUE_TEMPLATE/feature.md` (new)  
**Purpose**: Guide contributors on submitting feature requests  
**Content**:
```markdown
---
name: Feature Request
about: Suggest a new feature for this project
title: "[FEATURE] "
labels: feature
---

## Description
Brief description of what you want to see added.

## Problem Statement
What problem does this feature solve?

## Proposed Solution
How would you like this feature to be implemented?

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Related Links
Link to specification, existing issues, or discussions.

## Additional Context
Screenshots, mockups, or any other relevant information.
```

**Steps**:
1. Create directory: `mkdir -p .github/ISSUE_TEMPLATE`
2. Create file with template content above
3. Verify no YAML syntax errors
4. Commit: `git add .github/ISSUE_TEMPLATE/feature.md && git commit -m "feat: add feature request template"`

**Validation**:
```bash
[ -f ".github/ISSUE_TEMPLATE/feature.md" ] && echo "✓ Feature template created"
# Verify in GitHub UI: New Issue → should see "Feature Request" option
```

**Parallel with**: T004-T007, T009, T010 (different files, no conflicts)

**Related to Contract**: Issue Templates Validation

---

### T009 [P] Create `.github/ISSUE_TEMPLATE/bug.md`
**File**: `.github/ISSUE_TEMPLATE/bug.md` (new)  
**Purpose**: Guide contributors on submitting bug reports  
**Content**:
```markdown
---
name: Bug Report
about: Report a bug or issue
title: "[BUG] "
labels: bug
---

## Description
Brief description of the bug.

## Reproduction Steps
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen?

## Actual Behavior
What actually happens?

## Environment
- Browser: [e.g., Chrome 120.0]
- OS: [e.g., macOS 13.5]
- App Version: [e.g., week5-day0]

## Screenshots/Logs
Attach images or error logs if applicable.

## Additional Context
Any other relevant information.
```

**Steps**:
1. Create file: `.github/ISSUE_TEMPLATE/bug.md`
2. Add template content above
3. Verify no YAML syntax errors
4. Commit: `git add .github/ISSUE_TEMPLATE/bug.md && git commit -m "feat: add bug report template"`

**Validation**:
```bash
[ -f ".github/ISSUE_TEMPLATE/bug.md" ] && echo "✓ Bug template created"
# Verify in GitHub UI: New Issue → should see "Bug Report" option
```

**Parallel with**: T004-T008, T010 (different files, no conflicts)

**Related to Contract**: Issue Templates Validation

---

### T010 [P] Create/update `.github/pull_request_template.md`
**File**: `.github/pull_request_template.md` (new or update)  
**Purpose**: Standardize PR submissions with mandatory fields  
**Content**:
```markdown
## Spec URL
[Link to the feature specification this PR addresses or Linear issue number]

## Contract Tests
- [ ] Contract tests added/verified
- [ ] Tests cover happy path and error cases
- [ ] All tests passing locally

## Changes Made
Brief description of what was implemented.

## Checks
- [ ] Local tests passing (`npm run test`)
- [ ] Coverage meets thresholds (60% minimum)
- [ ] E2E tests passing (`npm run test:e2e`)
- [ ] CodeQL passing (no security alerts)
- [ ] Dependency Review passing (no vulnerabilities)

## CHANGELOG Updated
- [ ] User-facing changes added to CHANGELOG.md

## Breaking Changes
- [ ] No breaking changes
- [ ] Or describe breaking changes if applicable

## Related Issues
Closes #[issue number]
```

**Steps**:
1. Create or update: `.github/pull_request_template.md`
2. Add template content above
3. Verify valid Markdown syntax
4. Commit: `git add .github/pull_request_template.md && git commit -m "feat: add pull request template with mandatory fields"`

**Validation**:
```bash
[ -f ".github/pull_request_template.md" ] && echo "✓ PR template created"
```

**Manual Verification** (Required):
1. Go to repository → "Pull requests" tab
2. Click "New pull request" button
3. Select any two branches (e.g., main ← develop)
4. Click "Create pull request"
5. **VERIFY**: The PR description field should auto-populate with the template contents
6. If template does NOT auto-fill:
   - Check file encoding: `file -b .github/pull_request_template.md` should output "UTF-8 Unicode text"
   - Check for trailing whitespace after YAML frontmatter: `cat -A .github/pull_request_template.md | head -5`
   - Clear browser cache (Cmd+Shift+Delete on macOS, Ctrl+Shift+Delete on Windows/Linux)
   - Retry after 30 seconds (GitHub caches template files)
7. If still not working, verify the template file is correctly formatted per GitHub documentation

**Parallel with**: T004-T009 (different files, no conflicts)

**Related to Contract**: Pull Request Template Validation

---

## Phase C: Verification & Validation

> **Sequential Window**: T011, T012, T013 must complete in order (dependency chain)

### T011 Verify Vitest coverage configuration in `vitest.config.js`
**File**: `vitest.config.js` (read-only verification, may update if needed)  
**Purpose**: Ensure 60% coverage thresholds are enforced across all 5 UI suites  
**Steps**:
1. Open `vitest.config.js`
2. Verify coverage configuration includes:
   - Provider: 'v8'
   - Reporters: ['text', 'html', 'json']
   - Include paths for all 5 suites: Expense, Stopwatch, Temperature, Todo, Quote
   - Exclude: node_modules, dist, *.spec.ts, *.test.ts
   - Thresholds: lines, branches, functions, statements all >= 60%

3. If missing any includes, add them:
```javascript
coverage: {
  include: [
    'src/components/Expense/**',
    'src/components/Stopwatch/**',
    'src/components/Temperature/**',
    'src/components/Todo/**',
    'src/components/Quote/**'
  ],
  lines: 60,
  functions: 60,
  branches: 60,
  statements: 60
}
```

4. Commit if changes made: `git add vitest.config.js && git commit -m "chore: verify Vitest coverage thresholds for all 5 UI suites"`

**Validation**:
```bash
# Run coverage test:
npm run test:coverage

# Expected output:
# ✓ Coverage thresholds met:
#   lines ≥ 60%     | 62%
#   branches ≥ 60%  | 61%
#   functions ≥ 60% | 60%
#   statements ≥ 60% | 63%
```

**Blocks**: T012 (must verify before running coverage)

**Related to Contract**: Vitest Coverage Thresholds

---

### T012 Run Vitest coverage and generate reports
**Command**: `npm run test:coverage`  
**File**: `coverage/` (output directory)  
**Purpose**: Generate coverage reports to verify 60% thresholds met  
**Steps**:
1. From repository root: `npm run test:coverage`
2. Wait for test run to complete (typically 30-60 seconds)
3. Verify console output shows "Coverage thresholds met"
4. Check that all 4 metrics are >= 60%: lines, branches, functions, statements
5. Verify coverage reports generated: `coverage/index.html`, `coverage/coverage.json`

**Validation**:
```bash
npm run test:coverage 2>&1 | grep -q "Coverage thresholds met" && echo "✓ Coverage thresholds enforced"
[ -f "coverage/index.html" ] && [ -f "coverage/coverage.json" ] && echo "✓ Coverage reports generated"
```

**Requires**: T011 (configuration verification)

**Blocks**: T013 (coverage reports must exist before packaging)

**Related to Contract**: Vitest Coverage Thresholds

---

### T013 Generate and validate review-artifacts/index.html
**File**: `review-artifacts/index.html` (new/updated)  
**Purpose**: Create the primary review packet entry point with all coverage, test results, API docs, and changelog links  
**Prerequisites**: T012 must complete (coverage reports must exist before artifact can be generated)  
**Steps**:
1. Create or update `review-artifacts/index.html` with the following structure:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Week 5 Day-0 Review Packet</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 40px; line-height: 1.6; }
    h1 { color: #333; border-bottom: 3px solid #0969da; padding-bottom: 10px; }
    .section { margin: 30px 0; padding: 20px; background: #f6f8fa; border-left: 4px solid #0969da; }
    .section h2 { margin-top: 0; color: #0969da; }
    a { color: #0969da; text-decoration: none; font-weight: 500; }
    a:hover { text-decoration: underline; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #d0d7de; }
    th { background: #f3f4f6; font-weight: 600; }
    .status-pass { color: #28a745; font-weight: bold; }
    .status-warning { color: #ffc107; font-weight: bold; }
  </style>
</head>
<body>
  <h1>📦 Week 5 Day-0 Review Packet</h1>
  <p><strong>Generated:</strong> {{ GENERATION_DATE }}</p>
  <p><strong>Status:</strong> <span class="status-pass">✅ Production Ready</span></p>
  
  <div class="section">
    <h2>📊 Code Coverage Summary</h2>
    <p><a href="./coverage/index.html">View Full Coverage Report →</a></p>
    <table>
      <tr>
        <th>Suite</th>
        <th>Statements</th>
        <th>Branches</th>
        <th>Functions</th>
        <th>Lines</th>
      </tr>
      <!-- Coverage data inserted from coverage.json -->
    </table>
  </div>
  
  <div class="section">
    <h2>🧪 End-to-End Test Results</h2>
    <p><a href="./playwright-report/index.html">View Playwright Test Report →</a></p>
    <p>Smoke tests for all 5 UI suites (Expense, Stopwatch, Temperature, Todo, Quote)</p>
  </div>
  
  <div class="section">
    <h2>📚 API Documentation</h2>
    <p><a href="./openapi.html">View OpenAPI Documentation →</a></p>
    <p>Complete API schema and endpoint reference</p>
  </div>
  
  <div class="section">
    <h2>📝 Release Notes</h2>
    <p><a href="./CHANGELOG.md">View CHANGELOG →</a></p>
    <p>User-facing changes for Week 5 Day-0 release</p>
  </div>
  
  <hr>
  <p><small>This review packet is the primary artifact of record per project constitution (Principle III: Reviewability is Paramount)</small></p>
</body>
</html>
```

2. Parse `coverage/coverage.json` and populate coverage table with actual metrics
3. Verify all linked files exist:
```bash
test -f review-artifacts/coverage/index.html && echo "✓ coverage/index.html exists"
test -f review-artifacts/playwright-report/index.html && echo "✓ playwright-report/index.html exists"
test -f review-artifacts/openapi.html && echo "✓ openapi.html exists"
test -f CHANGELOG.md && echo "✓ CHANGELOG.md exists (link via ./CHANGELOG.md)"
```

4. Test all links by opening index.html in browser and clicking each link
5. Verify artifact size < 50MB and file count > 10:
```bash
cd review-artifacts/
du -sh . # Should be < 50MB
find . -type f | wc -l # Should have > 10 files
```

6. Commit: `git add review-artifacts/index.html && git commit -m "docs: generate Week 5 Day-0 review packet with coverage, test results, API docs, changelog"`

**Validation**:
```bash
[ -f "review-artifacts/index.html" ] && echo "✓ index.html generated"
grep -q "coverage/index.html" review-artifacts/index.html && echo "✓ Coverage link present"
grep -q "playwright-report" review-artifacts/index.html && echo "✓ Playwright link present"
grep -q "openapi" review-artifacts/index.html && echo "✓ OpenAPI link present"
grep -q "CHANGELOG" review-artifacts/index.html && echo "✓ CHANGELOG link present"
echo "✓ Review packet complete and ready for distribution"
```

**Requires**: T012 (coverage reports must exist before generating artifact)

**Blocks**: T020 (artifact must be verified before running contract tests)

**Related to Contract**: Review Packet Artifact Generation

---

### T014 [P] Write contract test: branch-protection-setup
**File**: `specs/025-week-5-day/contracts/branch-protection-setup.test.ts` (new)  
**Purpose**: Verify branch protection rule configured with all 5 required checks  
**Environment Setup**: This test requires `GITHUB_TOKEN` and `GITHUB_REPOSITORY` environment variables. In CI runners, these are pre-set by GitHub Actions. For local testing, set manually:
```bash
export GITHUB_TOKEN=<your-gh-token>
export GITHUB_REPOSITORY=<owner>/<repo>
```
If running in local environment without GitHub API access, skip this test or mock the API responses.

**Content** (TypeScript/Node.js with GitHub API):
```typescript
import { describe, it, expect, beforeAll } from "vitest";

describe("Branch Protection Rules Contract", () => {
  let protectionRules: any;

  beforeAll(async () => {
    // Fetch branch protection rules from GitHub API
    const response = await fetch(
      `https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/branches/main/protection`,
      {
        headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` },
      }
    );
    protectionRules = await response.json();
  });

  it("should require spec-check status check", () => {
    const checks = protectionRules.required_status_checks?.contexts || [];
    expect(checks).toContain("spec-check");
  });

  it("should require Test & Coverage - API status check", () => {
    const checks = protectionRules.required_status_checks?.contexts || [];
    expect(checks).toContain("Test & Coverage - API");
  });

  it("should require Playwright Smoke status check", () => {
    const checks = protectionRules.required_status_checks?.contexts || [];
    expect(checks).toContain("Playwright Smoke");
  });

  it("should require CodeQL status check", () => {
    const checks = protectionRules.required_status_checks?.contexts || [];
    expect(checks).toContain("CodeQL");
  });

  it("should require Dependency Review status check", () => {
    const checks = protectionRules.required_status_checks?.contexts || [];
    expect(checks).toContain("Dependency Review");
  });

  it("should have exactly 5 required status checks", () => {
    const checks = protectionRules.required_status_checks?.contexts || [];
    expect(checks).toHaveLength(5);
  });

  it("should enforce strict mode (up-to-date requirement)", () => {
    expect(protectionRules.required_status_checks?.strict).toBe(true);
  });

  it("should not allow force pushes", () => {
    expect(protectionRules.allow_force_pushes).toBe(false);
  });

  it("should not allow deletions", () => {
    expect(protectionRules.allow_deletions).toBe(false);
  });
});
```

**Steps**:
1. Create file: `specs/025-week-5-day/contracts/branch-protection-setup.test.ts`
2. Add test content above
3. Add to package.json test script if needed
4. Commit: `git add specs/025-week-5-day/contracts/branch-protection-setup.test.ts && git commit -m "test: add branch protection contract tests"`

**Validation**:
```bash
npm run test -- branch-protection-setup.test.ts
# Should pass if T004 was completed correctly
```

**Note**: This test will FAIL until T004 is completed.

**Parallel with**: T015, T016, T017 (different contract files)

**Related to Contract**: Branch Protection Rules Configuration

---

### T015 [P] Write contract test: github-project-setup
**File**: `specs/025-week-5-day/contracts/github-project-setup.test.ts` (new)  
**Purpose**: Verify GitHub Project created with all 5 custom fields  
**Content** (TypeScript/Node.js with GitHub GraphQL):
```typescript
import { describe, it, expect, beforeAll } from "vitest";

describe("GitHub Project Custom Fields Contract", () => {
  let project: any;
  let customFields: any[];

  beforeAll(async () => {
    // This would query GitHub API to fetch project and custom fields
    // Example using graphql-request or fetch with GraphQL
    // For now, placeholder structure
    customFields = [];
  });

  it("should have Status custom field with 5 options", () => {
    const statusField = customFields.find((f) => f.name === "Status");
    expect(statusField).toBeDefined();
    expect(statusField?.options).toContain("Backlog");
    expect(statusField?.options).toContain("Todo");
    expect(statusField?.options).toContain("In Progress");
    expect(statusField?.options).toContain("In Review");
    expect(statusField?.options).toContain("Done");
    expect(statusField?.options).toHaveLength(5);
  });

  it("should have Priority custom field with 4 options", () => {
    const priorityField = customFields.find((f) => f.name === "Priority");
    expect(priorityField).toBeDefined();
    expect(priorityField?.options).toContain("P0/Critical");
    expect(priorityField?.options).toContain("P1/High");
    expect(priorityField?.options).toContain("P2/Medium");
    expect(priorityField?.options).toContain("P3/Low");
  });

  it("should have Size custom field with 5 options", () => {
    const sizeField = customFields.find((f) => f.name === "Size");
    expect(sizeField).toBeDefined();
    expect(sizeField?.options).toContain("XS");
    expect(sizeField?.options).toContain("S");
    expect(sizeField?.options).toContain("M");
    expect(sizeField?.options).toContain("L");
    expect(sizeField?.options).toContain("XL");
  });

  it("should have Spec URL text field", () => {
    const specUrlField = customFields.find((f) => f.name === "Spec URL");
    expect(specUrlField).toBeDefined();
    expect(specUrlField?.type).toBe("text");
  });

  it("should have Sprint/Week custom field with 6 options", () => {
    const sprintField = customFields.find((f) => f.name === "Sprint/Week");
    expect(sprintField).toBeDefined();
    expect(sprintField?.options).toContain("Week 1");
    expect(sprintField?.options).toContain("Week 5");
    expect(sprintField?.options).toContain("Week 5 Day-0");
  });

  it("should have exactly 5 custom fields", () => {
    expect(customFields).toHaveLength(5);
  });

  it("should auto-add issues to project", () => {
    // Verify automation rule exists for auto-add
    expect(project.automation?.autoAddIssues).toBe(true);
  });

  it("should auto-add PRs to project", () => {
    // Verify automation rule exists for auto-add
    expect(project.automation?.autoAddPRs).toBe(true);
  });
});
```

**Steps**:
1. Create file: `specs/025-week-5-day/contracts/github-project-setup.test.ts`
2. Add test content above
3. Commit: `git add specs/025-week-5-day/contracts/github-project-setup.test.ts && git commit -m "test: add GitHub Project contract tests"`

**Validation**:
```bash
npm run test -- github-project-setup.test.ts
# Should pass if T005-T007 were completed correctly
```

**Note**: This test will FAIL until T005-T007 are completed.

**Parallel with**: T014, T016, T017 (different contract files)

**Related to Contract**: GitHub Project Custom Fields

---

### T016 [P] Write contract test: vitest-coverage-thresholds
**File**: `specs/025-week-5-day/contracts/vitest-coverage-thresholds.test.ts` (new)  
**Purpose**: Verify Vitest coverage configuration and thresholds  
**Content**:
```typescript
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Vitest Coverage Thresholds Contract", () => {
  it("should have coverage.json from latest test run", () => {
    const coveragePath = path.join(process.cwd(), "coverage", "coverage.json");
    expect(fs.existsSync(coveragePath)).toBe(true);
  });

  it("should enforce 60% lines threshold", () => {
    const coverage = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "coverage", "coverage.json"), "utf8")
    );
    const lineCoverage = coverage.total?.lines?.pct || 0;
    expect(lineCoverage).toBeGreaterThanOrEqual(60);
  });

  it("should enforce 60% branches threshold", () => {
    const coverage = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "coverage", "coverage.json"), "utf8")
    );
    const branchCoverage = coverage.total?.branches?.pct || 0;
    expect(branchCoverage).toBeGreaterThanOrEqual(60);
  });

  it("should enforce 60% functions threshold", () => {
    const coverage = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "coverage", "coverage.json"), "utf8")
    );
    const functionCoverage = coverage.total?.functions?.pct || 0;
    expect(functionCoverage).toBeGreaterThanOrEqual(60);
  });

  it("should enforce 60% statements threshold", () => {
    const coverage = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "coverage", "coverage.json"), "utf8")
    );
    const statementCoverage = coverage.total?.statements?.pct || 0;
    expect(statementCoverage).toBeGreaterThanOrEqual(60);
  });

  it("should include all 5 UI suites in coverage", () => {
    const vitestConfig = require("../../vitest.config.js").default;
    const includePaths = vitestConfig.test?.coverage?.include || [];
    const suites = ["Expense", "Stopwatch", "Temperature", "Todo", "Quote"];
    suites.forEach((suite) => {
      const found = includePaths.some((path: string) => path.includes(suite));
      expect(found).toBe(true);
    });
  });

  it("should have coverage/index.html report", () => {
    const reportPath = path.join(process.cwd(), "coverage", "index.html");
    expect(fs.existsSync(reportPath)).toBe(true);
  });
});
```

**Steps**:
1. Create file: `specs/025-week-5-day/contracts/vitest-coverage-thresholds.test.ts`
2. Add test content above
3. Commit: `git add specs/025-week-5-day/contracts/vitest-coverage-thresholds.test.ts && git commit -m "test: add Vitest coverage contract tests"`

**Validation**:
```bash
npm run test:coverage  # First run coverage
npm run test -- vitest-coverage-thresholds.test.ts  # Then run contract test
```

**Parallel with**: T014, T015, T017 (different contract files)

**Related to Contract**: Vitest Coverage Thresholds

---

### T017 [P] Write contract test: review-packet-generation
**File**: `specs/025-week-5-day/contracts/review-packet-generation.test.ts` (new)  
**Purpose**: Verify review packet has all required files and links  
**Content**:
```typescript
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Review Packet Generation Contract", () => {
  const reviewArtifactsDir = path.join(process.cwd(), "review-artifacts");

  it("should have index.html entry point", () => {
    const indexPath = path.join(reviewArtifactsDir, "index.html");
    expect(fs.existsSync(indexPath)).toBe(true);
  });

  it("should have link to coverage report in index.html", () => {
    const indexPath = path.join(reviewArtifactsDir, "index.html");
    const content = fs.readFileSync(indexPath, "utf8");
    expect(content).toMatch(/coverage\/index\.html|coverage\/|coverage report/i);
  });

  it("should have link to Playwright report in index.html", () => {
    const indexPath = path.join(reviewArtifactsDir, "index.html");
    const content = fs.readFileSync(indexPath, "utf8");
    expect(content).toMatch(/playwright-report|e2e|test results/i);
  });

  it("should have link to OpenAPI docs in index.html", () => {
    const indexPath = path.join(reviewArtifactsDir, "index.html");
    const content = fs.readFileSync(indexPath, "utf8");
    expect(content).toMatch(/openapi|api documentation|api docs/i);
  });

  it("should have link to CHANGELOG in index.html", () => {
    const indexPath = path.join(reviewArtifactsDir, "index.html");
    const content = fs.readFileSync(indexPath, "utf8");
    expect(content).toMatch(/changelog|release notes/i);
  });

  it("should have coverage/index.html", () => {
    const coveragePath = path.join(reviewArtifactsDir, "coverage", "index.html");
    expect(fs.existsSync(coveragePath)).toBe(true);
  });

  it("should have playwright-report/index.html", () => {
    const playwrightPath = path.join(reviewArtifactsDir, "playwright-report", "index.html");
    expect(fs.existsSync(playwrightPath)).toBe(true);
  });

  it("should have openapi.html", () => {
    const openAPIPath = path.join(reviewArtifactsDir, "openapi.html");
    expect(fs.existsSync(openAPIPath)).toBe(true);
  });

  it("should have CHANGELOG.md", () => {
    const changelogPath = path.join(reviewArtifactsDir, "CHANGELOG.md");
    const changelogRootPath = path.join(process.cwd(), "CHANGELOG.md");
    const hasChangelog =
      fs.existsSync(changelogPath) || fs.existsSync(changelogRootPath);
    expect(hasChangelog).toBe(true);
  });

  it("should have total package size < 50MB", () => {
    const dirSize = calculateDirSize(reviewArtifactsDir);
    const maxSizeMB = 50;
    expect(dirSize / (1024 * 1024)).toBeLessThan(maxSizeMB);
  });

  it("should use relative links (not absolute)", () => {
    const indexPath = path.join(reviewArtifactsDir, "index.html");
    const content = fs.readFileSync(indexPath, "utf8");
    // Links should be relative (./ or just filenames), not absolute (http:// or file://)
    expect(content).not.toMatch(/http:\/\/|file:\/\//);
  });
});

function calculateDirSize(dirPath: string): number {
  let size = 0;
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      size += calculateDirSize(filePath);
    } else {
      size += stats.size;
    }
  });
  return size;
}
```

**Steps**:
1. Create file: `specs/025-week-5-day/contracts/review-packet-generation.test.ts`
2. Add test content above
3. Commit: `git add specs/025-week-5-day/contracts/review-packet-generation.test.ts && git commit -m "test: add review packet contract tests"`

**Validation**:
```bash
npm run test -- review-packet-generation.test.ts
# Should pass if T013 was completed correctly (all files present)
```

**Parallel with**: T014, T015, T016 (different contract files)

**Related to Contract**: Review Packet Artifact Generation

---

### T018 [P] Write contract test: issue-templates-validation
**File**: `specs/025-week-5-day/contracts/issue-templates-validation.test.ts` (new)  
**Purpose**: Verify issue templates exist and have valid syntax  
**Content**:
```typescript
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Issue Templates Validation Contract", () => {
  const featureTemplatePath = path.join(
    process.cwd(),
    ".github",
    "ISSUE_TEMPLATE",
    "feature.md"
  );
  const bugTemplatePath = path.join(process.cwd(), ".github", "ISSUE_TEMPLATE", "bug.md");

  it("should have feature.md template", () => {
    expect(fs.existsSync(featureTemplatePath)).toBe(true);
  });

  it("should have bug.md template", () => {
    expect(fs.existsSync(bugTemplatePath)).toBe(true);
  });

  it("feature.md should have valid YAML frontmatter", () => {
    const content = fs.readFileSync(featureTemplatePath, "utf8");
    expect(content).toMatch(/^---[\s\S]+?---/);
    expect(content).toMatch(/name:\s*"?Feature Request"?/i);
    expect(content).toMatch(/about:\s*"?[^"]+feature[^"]*"?/i);
  });

  it("bug.md should have valid YAML frontmatter", () => {
    const content = fs.readFileSync(bugTemplatePath, "utf8");
    expect(content).toMatch(/^---[\s\S]+?---/);
    expect(content).toMatch(/name:\s*"?Bug Report"?/i);
    expect(content).toMatch(/about:\s*"?[^"]+bug[^"]*"?/i);
  });

  it("feature.md should have Description section", () => {
    const content = fs.readFileSync(featureTemplatePath, "utf8");
    expect(content).toMatch(/##\s+Description/i);
  });

  it("feature.md should have Acceptance Criteria with checkbox", () => {
    const content = fs.readFileSync(featureTemplatePath, "utf8");
    expect(content).toMatch(/##\s+Acceptance Criteria/i);
    expect(content).toMatch(/- \[\s*\]/);
  });

  it("bug.md should have Reproduction Steps section", () => {
    const content = fs.readFileSync(bugTemplatePath, "utf8");
    expect(content).toMatch(/##\s+Reproduction Steps/i);
  });

  it("bug.md should have Expected Behavior section", () => {
    const content = fs.readFileSync(bugTemplatePath, "utf8");
    expect(content).toMatch(/##\s+Expected Behavior/i);
  });

  it("bug.md should have Actual Behavior section", () => {
    const content = fs.readFileSync(bugTemplatePath, "utf8");
    expect(content).toMatch(/##\s+Actual Behavior/i);
  });

  it("feature.md should have valid Markdown syntax", () => {
    const content = fs.readFileSync(featureTemplatePath, "utf8");
    // Check for common Markdown syntax errors
    expect(content).not.toMatch(/\[\[/); // Double brackets
    expect(content).not.toMatch(/(#{7,})/); // Too many heading levels
  });

  it("bug.md should have valid Markdown syntax", () => {
    const content = fs.readFileSync(bugTemplatePath, "utf8");
    expect(content).not.toMatch(/\[\[/);
    expect(content).not.toMatch(/(#{7,})/);
  });
});
```

**Steps**:
1. Create file: `specs/025-week-5-day/contracts/issue-templates-validation.test.ts`
2. Add test content above
3. Commit: `git add specs/025-week-5-day/contracts/issue-templates-validation.test.ts && git commit -m "test: add issue templates contract tests"`

**Validation**:
```bash
npm run test -- issue-templates-validation.test.ts
# Should pass if T008-T009 were completed correctly
```

**Parallel with**: T014, T015, T016, T017 (different contract files)

**Related to Contract**: Issue Templates Validation

---

### T019 [P] Write contract test: pull-request-template-validation
**File**: `specs/025-week-5-day/contracts/pull-request-template-validation.test.ts` (new)  
**Purpose**: Verify PR template exists and has mandatory sections  
**Content**:
```typescript
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Pull Request Template Validation Contract", () => {
  const prTemplatePath = path.join(
    process.cwd(),
    ".github",
    "pull_request_template.md"
  );

  it("should have pull_request_template.md", () => {
    expect(fs.existsSync(prTemplatePath)).toBe(true);
  });

  it("should have Spec URL section", () => {
    const content = fs.readFileSync(prTemplatePath, "utf8");
    expect(content).toMatch(/##\s+Spec URL/i);
  });

  it("should have Contract Tests section", () => {
    const content = fs.readFileSync(prTemplatePath, "utf8");
    expect(content).toMatch(/##\s+Contract Tests/i);
  });

  it("should have Changes Made section", () => {
    const content = fs.readFileSync(prTemplatePath, "utf8");
    expect(content).toMatch(/##\s+Changes Made/i);
  });

  it("should have Checks section with checkboxes", () => {
    const content = fs.readFileSync(prTemplatePath, "utf8");
    expect(content).toMatch(/##\s+Checks/i);
    expect(content).toMatch(/- \[\s*\].*npm run test/i);
  });

  it("should have CHANGELOG Updated section", () => {
    const content = fs.readFileSync(prTemplatePath, "utf8");
    expect(content).toMatch(/##\s+CHANGELOG Updated/i);
  });

  it("should have Breaking Changes section", () => {
    const content = fs.readFileSync(prTemplatePath, "utf8");
    expect(content).toMatch(/##\s+Breaking Changes/i);
  });

  it("should have Related Issues section", () => {
    const content = fs.readFileSync(prTemplatePath, "utf8");
    expect(content).toMatch(/##\s+Related Issues/i);
  });

  it("should have valid Markdown syntax", () => {
    const content = fs.readFileSync(prTemplatePath, "utf8");
    expect(content).not.toMatch(/\[\[/);
    expect(content).not.toMatch(/(#{7,})/);
  });

  it("should mention local tests requirement", () => {
    const content = fs.readFileSync(prTemplatePath, "utf8");
    expect(content).toMatch(/npm run test|local.*test/i);
  });

  it("should mention coverage thresholds", () => {
    const content = fs.readFileSync(prTemplatePath, "utf8");
    expect(content).toMatch(/coverage|60%/i);
  });

  it("should mention E2E tests", () => {
    const content = fs.readFileSync(prTemplatePath, "utf8");
    expect(content).toMatch(/e2e|end.*to.*end|test:e2e/i);
  });
});
```

**Steps**:
1. Create file: `specs/025-week-5-day/contracts/pull-request-template-validation.test.ts`
2. Add test content above
3. Commit: `git add specs/025-week-5-day/contracts/pull-request-template-validation.test.ts && git commit -m "test: add pull request template contract tests"`

**Validation**:
```bash
npm run test -- pull-request-template-validation.test.ts
# Should pass if T010 was completed correctly
```

**Parallel with**: T014, T015, T016, T017, T018 (different contract files)

**Related to Contract**: Pull Request Template Validation

---

### T020 Run all contract tests to verify D0 compliance
**Command**: `npm run test -- specs/025-week-5-day/contracts/*.test.ts`  
**Purpose**: Verify all D0 infrastructure meets contract specifications  
**Steps**:
1. Run all contract tests: `npm run test specs/025-week-5-day/contracts/`
2. Expected output: All tests passing (5 test files × ~8-10 tests each ≈ 45-50 assertions)
3. Verify console shows: "Test Files  5 passed (5)" or similar
4. Verify no failing tests

**Validation**:
```bash
npm run test specs/025-week-5-day/contracts/ 2>&1 | grep -q "passed" && echo "✓ All contract tests passing"
```

**Requires**: T014-T019 (all contract test files must exist)

**Blocks**: T021 (contract verification before finalization)

---

## Phase D: Finalization & Release

### T021 Create git backup branch before squash merge
**Command**: `git branch backup/week5-dev development`  
**Purpose**: Preserve development branch history in case rollback is needed  
**Steps**:
1. Create backup: `git branch backup/week5-dev development`
2. Verify backup: `git branch -l | grep backup`
3. Push backup to origin: `git push origin backup/week5-dev`

**Validation**:
```bash
git branch -a | grep -q "backup/week5-dev" && echo "✓ Backup branch created"
git ls-remote origin | grep -q "backup/week5-dev" && echo "✓ Backup pushed to origin"
```

**Blocks**: T022 (backup must exist before squashing)

---

### T022 Perform squash merge from development to main
**Command**: `git merge --squash development`  
**Purpose**: Combine all development work into single clean commit on main  
**Steps**:
1. Ensure on main branch: `git checkout main && git pull origin main`
2. Ensure development is current: `git fetch origin && git log -1 origin/development`
3. Perform squash merge: `git merge --squash development`
4. View staged changes: `git status`
5. Create descriptive commit message (see template below)
6. Commit: `git commit -m "..."`

**Commit Message Template**:
```
Week 5 Day-0: Final hygiene and GitHub Projects migration

- Update main branch README.md with Week 5 paths and review packet links
- Remove stray files from repository
- Configure branch protection rules (5 required CI checks: spec-check, Test & Coverage - API, Playwright Smoke, CodeQL, Dependency Review)
- Create GitHub Project "Week 5 Day-0" with custom fields (Status, Priority, Size, Spec URL, Sprint/Week) and automation rules
- Add .github/ISSUE_TEMPLATE/feature.md and .github/ISSUE_TEMPLATE/bug.md for contributor onboarding
- Add .github/pull_request_template.md with mandatory sections (Spec URL, Contract Tests, Checks, CHANGELOG Updated)
- Verify Vitest coverage thresholds (60% minimum across lines, branches, functions, statements)
- Generate review-packet artifact at review-artifacts/index.html with coverage, Playwright reports, API docs, CHANGELOG
- All D0 requirements met (infrastructure complete)

All tests passing: 108/108 unit + 22/22 e2e
Review packet ready at: ./review-artifacts/index.html
Branch protection active on main: 5 required checks enforced
GitHub Projects configured and automations active
Team migrated from Linear to GitHub Projects

Squash merge of development branch (all commits consolidated).
Ready for production deployment.
```

**Validation**:
```bash
git log --oneline -1 | grep -q "Week 5 Day-0" && echo "✓ Commit message correct"
git status | grep -q "nothing to commit" && echo "✓ All changes committed"
```

**Requires**: T021 (backup must exist first)

**Blocks**: T023 (tag must be created after commit)

---

### T023 Create annotated git tag for release
**Command**: `git tag -a week5-day0 -m "..."`  
**Purpose**: Mark the release milestone and enable reference by commit hash  
**Steps**:
1. Create tag: `git tag -a week5-day0 -m "Week 5 Day-0 release"`
2. Include tag message with details (see template below)
3. Verify tag: `git tag -l week5-day0 -n 5` (show first 5 lines of message)
4. Push tag: `git push origin week5-day0`

**Tag Message Template**:
```
Week 5 Day-0 release

GitHub Projects migration complete.
All D0 requirements met (branch protection, templates, artifact generation).
Review packet: https://github.com/{owner}/{repo}/tree/main/review-artifacts

Commit: $(git rev-parse HEAD)
Date: $(date -u +'%Y-%m-%dT%H:%M:%SZ')
Branch: main
```

**Validation**:
```bash
git tag -l | grep -q "week5-day0" && echo "✓ Tag created locally"
git ls-remote origin | grep -q "week5-day0" && echo "✓ Tag pushed to origin"
```

**Requires**: T022 (squash merge must be committed first)

**Related to Contract**: Squash Merge & Tagging

---

### T024 Push main branch and all tags to origin
**Command**: `git push origin main && git push origin --tags`  
**Purpose**: Sync all changes and tags to remote repository  
**Steps**:
1. Push main: `git push origin main`
2. Push tags: `git push origin --tags`
3. Verify: `git ls-remote origin | head -20`

**Validation**:
```bash
git ls-remote origin main | grep -q "main" && echo "✓ Main branch pushed"
git ls-remote origin | grep "refs/tags/week5-day0" && echo "✓ Tag pushed"
```

**Requires**: T023 (tag must exist before pushing)

---

### T025 Verify Definition of Done - Final validation checklist
**Purpose**: Confirm all D0 requirements are complete and main branch is production-ready  
**Checklist**:
```bash
#!/bin/bash
set -e

echo "=== Week 5 Day-0: Definition of Done Validation ==="
echo ""

# Check 1: README updated
echo -n "✓ Check 1: README.md updated with Week 5 paths... "
git checkout main >/dev/null 2>&1
grep -q "review-artifacts" README.md && echo "PASS" || echo "FAIL"

# Check 2: Stray files removed
echo -n "✓ Check 2: Stray files removed from main... "
! git ls-files | grep -E "\\.tmp|debug\\.log|\\.\\.js" >/dev/null 2>&1 && echo "PASS" || echo "FAIL"

# Check 3: Commit exists
echo -n "✓ Check 3: Squash merge commit exists on main... "
git log --oneline -1 | grep -q "Week 5 Day-0" && echo "PASS" || echo "FAIL"

# Check 4: Tag exists
echo -n "✓ Check 4: Tag week5-day0 created... "
git tag -l | grep -q "week5-day0" && echo "PASS" || echo "FAIL"

# Check 5: Branch protection configured (requires GitHub CLI + auth)
echo -n "✓ Check 5: Branch protection rules configured... "
if command -v gh >/dev/null && [ -n "$GITHUB_TOKEN" ]; then
  gh api repos/{owner}/{repo}/branches/main/protection 2>/dev/null | grep -q "spec-check" && echo "PASS" || echo "FAIL (manual verification required)"
else
  echo "SKIP (GitHub CLI not installed or GITHUB_TOKEN not set - manual verification required via GitHub UI)"
fi

# Check 6: Coverage thresholds
echo -n "✓ Check 6: Vitest coverage thresholds verified... "
npm run test:coverage 2>&1 | grep -q "Coverage thresholds met" && echo "PASS" || echo "FAIL"

# Check 7: Review packet
echo -n "✓ Check 7: Review packet complete at review-artifacts/index.html... "
[ -f "review-artifacts/index.html" ] && [ -f "review-artifacts/coverage/index.html" ] && echo "PASS" || echo "FAIL"

# Check 8: GitHub Project
echo -n "✓ Check 8: GitHub Project created with 5 custom fields... "
gh project list --owner {owner} 2>/dev/null | grep -q "Week 5" && echo "PASS" || echo "FAIL (manual verification required)"

# Check 9: Issue templates
echo -n "✓ Check 9: Issue templates created... "
[ -f ".github/ISSUE_TEMPLATE/feature.md" ] && [ -f ".github/ISSUE_TEMPLATE/bug.md" ] && echo "PASS" || echo "FAIL"

# Check 10: PR template
echo -n "✓ Check 10: PR template created... "
[ -f ".github/pull_request_template.md" ] && echo "PASS" || echo "FAIL"

# Check 11: Contract tests
echo -n "✓ Check 11: All contract tests passing... "
npm run test specs/025-week-5-day/contracts/ 2>&1 | grep -q "passed" && echo "PASS" || echo "FAIL"

# Check 12: Backup branch
echo -n "✓ Check 12: Backup branch created... "
git branch -a | grep -q "backup/week5-dev" && echo "PASS" || echo "FAIL"

echo ""
echo "=== End of Definition of Done Validation ==="
```

**Steps**:
1. Run validation script above (save as validate-d0.sh)
2. Verify all checks show "PASS"
3. Manual verification of:
   - GitHub Project visible and accessible
   - Branch protection enforced (create test PR)
   - Issue/PR templates work (create test issue/PR)

**Validation Result**:
```bash
bash validate-d0.sh
# Expected: 12/12 checks PASS
```

**Success Criteria**:
- ✅ All 12 checks passing
- ✅ Main branch is production-ready
- ✅ No breaking changes introduced
- ✅ All team members notified of Linear decommissioning
- ✅ All stakeholders can access GitHub Projects

---

## Parallel Execution Summary

**Parallel Window 1** (Configuration):
```
T004 (Branch Protection)
T005 (GitHub Project Creation)
T006 (Custom Fields Configuration)
T007 (Automation Rules)
↓ (all finish, then proceed)
```

**Parallel Window 2** (Templates):
```
T008 (Feature Template)
T009 (Bug Template)
T010 (PR Template)
↓ (all finish, then proceed)
```

**Parallel Window 3** (Contract Tests):
```
T014 (Branch Protection Tests)
T015 (GitHub Project Tests)
T016 (Coverage Tests)
T017 (Review Packet Tests)
T018 (Issue Templates Tests)
T019 (PR Template Tests)
↓ (all finish, then T020)
```

**Sequential Chain**:
```
T001 → T002 → T003 → T004-T007 (parallel) → T008-T010 (parallel) →
T011 → T012 → T013 → T014-T019 (parallel) → T020 → T021 → T022 → T023 → T024 → T025
```

---

## Task Dependencies

| Task | Depends On | Blocks |
|------|-----------|--------|
| T001 | (start) | T002 |
| T002 | T001 | T003 |
| T003 | T002 | T004 |
| T004 | T003 | T020 |
| T005 | T003 | T020 |
| T006 | T005 | T020 |
| T007 | T006 | T020 |
| T008 | T003 | T020 |
| T009 | T008 | T020 |
| T010 | T009 | T020 |
| T011 | T003 | T012 |
| T012 | T011 | T013 |
| T013 | T012 | T020 |
| T014 | T004 | T020 |
| T015 | T006 | T020 |
| T016 | T012 | T020 |
| T017 | T013 | T020 |
| T018 | T009 | T020 |
| T019 | T010 | T020 |
| T020 | T014-T019 | T021 |
| T021 | T020 | T022 |
| T022 | T021 | T023 |
| T023 | T022 | T024 |
| T024 | T023 | T025 |
| T025 | T024 | (end) |

---

## Estimated Effort

| Phase | Tasks | Est. Time | Notes |
|-------|-------|-----------|-------|
| A (Prep) | T001-T003 | 30 min | Sequential, quick cleanup tasks |
| B (Config) | T004-T010 | 45 min | T004-T007 sequential (25 min), T008-T010 parallel (20 min) |
| C (Verify) | T011-T020 | 60 min | T011-T013 sequential (40 min), T014-T019 parallel (20 min) |
| D (Release) | T021-T025 | 15 min | Sequential final steps |
| E (Deploy) | T026 | 10 min | Pages deployment workflow configuration |
| **TOTAL** | **26 tasks** | **~2 hours 40 min** | Realistic with parallelization |

---

## Success Metrics

After completing all 25 tasks, the following should be true:

1. ✅ **Production-Ready Main Branch**: All tests passing, no stray files, README updated with Week 5 paths
2. ✅ **Branch Protection Enforced**: 5 required CI checks (spec-check, Test & Coverage - API, Playwright Smoke, CodeQL, Dependency Review) block merges until passing
3. ✅ **GitHub Projects Active**: Project created with 5 custom fields (Status, Priority, Size, Spec URL, Sprint/Week) and automation rules (auto-add issues/PRs, PR status updates)
4. ✅ **Contributor Onboarding**: Issue/PR templates guide new contributors with structured sections and default labels
5. ✅ **Review Packet Generated**: review-artifacts/index.html created and linked from README with coverage tables, Playwright reports, OpenAPI docs, CHANGELOG
6. ✅ **Infrastructure Verified**: All 45+ contract tests passing (6 test files: branch-protection, github-project, vitest-coverage, review-packet, issue-templates, pr-template)
7. ✅ **Team Migrated**: Linear decommissioned, all work tracked in GitHub Projects
8. ✅ **Release Tagged**: week5-day0 tag marks milestone on main branch with backup branch created
9. ✅ **Backup & Rollback Ready**: backup/week5-dev branch created and pushed for recovery if needed

---

## Notes & Troubleshooting

### Common Issues

**Q: Branch protection won't accept status check names**  
A: Workflow must have run at least once and produced the check name. Wait for CI to run, then retry.

**Q: GitHub Project custom fields not showing**  
A: Refresh browser, ensure you're in "Table" view (not "Board"), verify project not archived.

**Q: Coverage below 60%**  
A: Run `npm run test:coverage` to see which files aren't covered. Add tests for uncovered paths.

**Q: PR template not auto-filling**  
A: File must be at exact path `.github/pull_request_template.md`. Clear browser cache and retry.

### Rollback Plan

If issues arise after squash merge:
1. Restore development branch: `git reset --hard backup/week5-dev`
2. Push: `git push -f origin development`
3. Revert main: `git revert <squash-commit-hash>`
4. Delete tag: `git tag -d week5-day0 && git push origin :refs/tags/week5-day0`

---

## Constitutional Principles Alignment

✅ **Principle I: No Logic Duplication**
- All infrastructure respects separation of concerns
- No backend logic reimplemented in frontend templates or GitHub workflows
- Each component (CI, templates, projects) performs single responsibility

✅ **Principle II: Test Coverage Mandate**
- Coverage thresholds enforced by Vitest (60% minimum, exceeds 40% constitutional requirement)
- All contract tests written before configuration (TDD approach)
- CI checks block merge until all tests passing

✅ **Principle III: Reviewability is Paramount**
- README links all resources including review-artifacts/index.html
- review-packet contains all deliverables (coverage, Playwright reports, OpenAPI docs, CHANGELOG)
- GitHub Project fields expose status and priorities for visibility
- Templates standardize contributor expectations and include Spec URL requirement
- All CI checks logged and visible in GitHub status checks

---

## References

- [Plan](./plan.md) - Technical approach and architecture
- [Research](./research.md) - Technical decisions and findings
- [Data Model](./data-model.md) - Entity definitions and relationships
- [Quickstart](./quickstart.md) - Step-by-step execution walkthrough
- [Contracts](./contracts/) - Interface specifications (7 contracts)

---

*Tasks ready for execution. Begin with Phase A (T001) and follow dependency chain. Estimated 2 hours 40 minutes to production readiness including GitHub Pages deployment.*


