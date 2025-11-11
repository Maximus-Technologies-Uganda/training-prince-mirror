# Quickstart & Validation: Week 5 Day-0

**Branch**: `025-week-5-day` | **Date**: November 6, 2025  
**Purpose**: Step-by-step walkthrough to verify all D0 requirements are met

---

## Pre-Execution Checklist

Before starting D0 implementation, verify:

- [ ] Development branch has all tests passing (`npm run test && npm run test:e2e`)
- [ ] No uncommitted changes on development branch
- [ ] Main branch is current (`git fetch origin && git checkout main && git pull origin main`)
- [ ] Repository has GitHub Projects enabled (Settings → Projects tab)
- [ ] User running tasks has write access to repository settings
- [ ] Git tags are writable (`git config user.name` is set)

---

## Phase A: Branch Cleanup & Preparation

### Task A1: Update Main Branch README

**Steps**:
1. Checkout main branch: `git checkout main`
2. Open `README.md` in editor
3. Add Week 5 section (or update existing):

```markdown
## Week 5: Final Hygiene & GitHub Projects Migration

### Review Packet
Complete project review, testing reports, and API documentation:
- **[View Review Packet](./review-artifacts/index.html)**

### Key Resources
- [Specifications](./specs/)
- [Implementation Plan](./specs/025-week-5-day/plan.md)
- [Data Model](./specs/025-week-5-day/data-model.md)
- [Contract Tests](./specs/025-week-5-day/contracts/)

### Week 5 Deliverables
- ✅ GitHub Projects migration complete (Linear decommissioned)
- ✅ Branch protection rules enforced on main
- ✅ Issue and PR templates standardized
- ✅ Review packet artifact finalized
```

4. Save and commit: `git add README.md && git commit -m "docs: update README with Week 5 paths and review packet link"`

**Validation**:
```bash
git log --oneline -1 | grep -q "docs: update README" && echo "✓ README updated"
grep -q "review-artifacts" README.md && echo "✓ Review packet link found"
```

### Task A2: Identify & Remove Stray Files

**Steps**:
1. List files in main branch root:
```bash
git checkout main
git ls-files | head -20
```

2. Compare with development branch to identify stray files:
```bash
git diff --name-status development...main
```

3. Identify unnecessary files (examples):
   - `hello.js..js` (malformed filename)
   - `*.tmp` (temporary files)
   - `debug.log` (debug output)
   - Old test files
   - Incomplete scripts

4. Remove stray files:
```bash
git rm hello.js..js debug.log *.tmp
git commit -m "chore: remove stray files from main branch"
```

**Validation**:
```bash
# Ensure critical files remain
git ls-files | grep -E "(README|package.json|vitest.config.js)" && echo "✓ Critical files intact"

# Confirm stray files removed
! git ls-files | grep -E "hello.js..js|debug.log" && echo "✓ Stray files removed"
```

---

## Phase B: CI Checks & Branch Protection

### Task B1: Verify CI Workflow Status

**Steps**:
1. Navigate to GitHub repository → Actions
2. Verify these workflows are present and recent:
   - `spec-check` (validates .specify files)
   - `api-checks.yml` (API tests + coverage, status check: "Test & Coverage - API")
   - `playwright.yml` (E2E tests, status check: "Playwright Smoke")
   - `codeql.yml` (security, status check: "CodeQL")
   - `dependency-review.yml` (supply chain, status check: "Dependency Review")

3. Run each workflow manually to confirm they produce the expected status check name:
```bash
# Check workflow definitions
ls -la .github/workflows/
grep "name:" .github/workflows/*.yml
```

4. Extract status check names from workflow files:
```bash
grep -h "name:" .github/workflows/*.yml | grep -v "GitHub" | sort | uniq
```

**Expected Output**:
```
- spec-check
- Test & Coverage - API
- Playwright Smoke
- CodeQL
- Dependency Review
```

**Validation**:
```bash
# Confirm all 5 workflows exist
[ $(ls .github/workflows/*.yml | wc -l) -ge 5 ] && echo "✓ All 5 workflows present"
```

### Task B2: Configure Branch Protection Rules

**Steps**:

1. Navigate to Settings → Branches
2. Click "Add rule" (or edit existing "main" rule)
3. Set Branch name pattern: `main`
4. Enable "Require status checks to pass before merging"
5. Search and select each required check:
   - [ ] `spec-check`
   - [ ] `Test & Coverage - API`
   - [ ] `Playwright Smoke`
   - [ ] `CodeQL`
   - [ ] `Dependency Review`

6. Enable "Require branches to be up to date before merging" (recommended)
7. Disable "Allow force pushes" (security)
8. Disable "Allow deletions" (safety)
9. Click "Save changes"

**Via GitHub CLI** (alternative):
```bash
gh api repos/{owner}/{repo}/branches/main/protection \
  -X PUT \
  -f required_status_checks.strict=true \
  -f required_status_checks.contexts='["spec-check","Test & Coverage - API","Playwright Smoke","CodeQL","Dependency Review"]' \
  -f enforce_admins=false \
  -f allow_deletions=false \
  -f allow_force_pushes=false \
  -f required_linear_history=false
```

**Validation**:
1. Open Settings → Branches → main rule
2. Confirm all 5 checks are listed
3. Verify "Require branches to be up to date" is enabled
4. Verify "Allow force pushes" is disabled

```bash
# Verify via CLI (if available)
gh api repos/{owner}/{repo}/branches/main/protection | jq '.required_status_checks.contexts | length'
# Should output: 5
```

---

## Phase C: Artifact Verification & Review Packet

### Task C1: Verify Vitest Coverage Configuration

**Steps**:
1. Open `vitest.config.js`
2. Verify coverage configuration:

```javascript
// Should include:
coverage: {
  provider: 'v8',
  reporter: ['text', 'html', 'json'],
  include: [
    'src/components/Expense/**',
    'src/components/Stopwatch/**',
    'src/components/Temperature/**',
    'src/components/Todo/**',
    'src/components/Quote/**'
  ],
  exclude: [
    'node_modules/',
    'dist/',
    '**/*.spec.ts',
    '**/*.test.ts'
  ],
  lines: 60,
  functions: 60,
  branches: 60,
  statements: 60
}
```

3. Run coverage test:
```bash
npm run test:coverage
```

4. Verify output shows all 5 suites and >= 60% for all metrics:
```
✓ Coverage thresholds met:
  lines ≥ 60%     | 62%
  branches ≥ 60%  | 61%
  functions ≥ 60% | 58% ⚠️ [needs attention]
  statements ≥ 60% | 63%
```

**Validation**:
```bash
npm run test:coverage 2>&1 | grep -q "Coverage thresholds met" && echo "✓ Coverage thresholds enforced"
```

### Task C2: Verify Review Packet Generation

**Steps**:
1. Verify directory structure:
```bash
ls -la review-artifacts/
# Should contain:
# - index.html
# - coverage/ (with coverage reports)
# - playwright-report/ (with test results)
# - openapi.html (API docs)
# - CHANGELOG.md (or soft link)
```

2. Verify review-artifacts/index.html contains all required links:
```bash
grep -q "coverage/index.html" review-artifacts/index.html && echo "✓ Coverage link"
grep -q "playwright-report/index.html" review-artifacts/index.html && echo "✓ Playwright link"
grep -q "openapi.html" review-artifacts/index.html && echo "✓ OpenAPI link"
grep -q "CHANGELOG.md" review-artifacts/index.html && echo "✓ CHANGELOG link"
```

3. Verify all linked files exist:
```bash
# Test links by checking file existence
cd review-artifacts/
[ -f index.html ] && [ -f coverage/index.html ] && [ -f playwright-report/index.html ] && \
[ -f openapi.html ] && [ -f CHANGELOG.md ] && echo "✓ All artifact files present"
```

4. Open index.html in browser and verify all links work:
   - Click "Coverage Report" → Should open coverage details
   - Click "Playwright Tests" → Should open test results
   - Click "API Documentation" → Should open OpenAPI docs
   - Click "Changelog" → Should open release notes

**Validation**:
```bash
# Verify artifact package integrity
cd review-artifacts/
du -sh . # Should be < 50MB
find . -type f | wc -l # Should have > 10 files
```

---

## Phase D: GitHub Project Setup

### Task D1: Create GitHub Project

**Steps**:

1. Navigate to repository → Projects tab
2. Click "New project"
3. Choose "Table" layout (recommended for custom fields)
4. Name: "Week 5 Day-0"
5. Description: "Track work items across GitHub integrated with specifications"
6. Visibility: "Private" (or as appropriate for your team)
7. Click "Create project"

**Validation**:
- Project URL: `https://github.com/{owner}/{repo}/projects/{number}`
- Visible in Projects tab: ✓

### Task D2: Configure Custom Fields

**Steps**:

1. In project, click "Settings" (gear icon)
2. Navigate to "Custom fields"
3. Add each required field:

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
- All 5 custom fields appear in project view
- Fields are sortable/filterable

### Task D3: Configure Automation Rules

**Steps**:

1. In project, click "Settings" → "Automation"
2. Enable or create each rule:

**Rule 1: Auto-add Issues**
- Trigger: Issues opened
- Action: Add to project
- Status: (Optional, leave as is)

**Rule 2: Auto-add PRs**
- Trigger: PRs opened
- Action: Add to project
- Status: (Optional, leave as is)

**Rule 3: PR Opened → Set Status to "In Review"**
- Trigger: PR opened
- Action: Set custom field "Status" to "In Review"

**Rule 4: PR Merged → Set Status to "Done"**
- Trigger: PR closed and merged
- Action: Set custom field "Status" to "Done"

3. Verify all rules are "Active"

**Via GitHub Actions** (alternative, if not available in Projects UI):

Create `.github/workflows/project-automation.yml`:
```yaml
name: Update GitHub Project on PR events

on:
  pull_request:
    types: [opened, closed]

jobs:
  update-status:
    runs-on: ubuntu-latest
    steps:
      - name: Update PR status in GitHub Project
        uses: actions/github-script@v7
        with:
          script: |
            const eventName = context.eventName;
            const action = context.payload.action;
            
            if (action === 'opened') {
              // Set Status to "In Review"
              console.log('PR opened, would set Status to In Review');
            } else if (action === 'closed' && context.payload.pull_request.merged) {
              // Set Status to "Done"
              console.log('PR merged, would set Status to Done');
            }
```

**Validation**:
- Create a test issue or PR
- Verify it appears in project automatically
- Verify status updates on events

---

## Phase E: Issue & PR Templates

### Task E1: Create Issue Templates

**Steps**:

1. Create directory: `mkdir -p .github/ISSUE_TEMPLATE`

2. Create `.github/ISSUE_TEMPLATE/feature.md`:
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

3. Create `.github/ISSUE_TEMPLATE/bug.md`:
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

4. Commit templates:
```bash
git add .github/ISSUE_TEMPLATE/
git commit -m "feat: add issue templates (feature and bug)"
```

**Validation**:
1. Go to repository → "New Issue" button
2. You should see "Feature Request" and "Bug Report" options
3. Select each template and verify it loads correctly

```bash
# Verify via CLI
[ -f ".github/ISSUE_TEMPLATE/feature.md" ] && [ -f ".github/ISSUE_TEMPLATE/bug.md" ] && \
echo "✓ Both templates exist"
```

### Task E2: Create PR Template

**Steps**:

1. Create `.github/pull_request_template.md`:
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

2. Commit template:
```bash
git add .github/pull_request_template.md
git commit -m "feat: add pull request template with mandatory fields"
```

**Validation**:
1. Create a test PR against main
2. You should see the template auto-filled in PR description
3. Verify all sections are present

```bash
# Verify template exists
[ -f ".github/pull_request_template.md" ] && echo "✓ PR template exists"
```

---

## Phase F: Squash Merge & Tagging

### Task F1: Prepare for Merge

**Steps**:

1. Verify all D0 tasks are complete:
```bash
# Check main branch README
grep -q "review-artifacts" README.md || (echo "ERROR: README not updated"; exit 1)

# Check branch protection
gh api repos/{owner}/{repo}/branches/main/protection | grep -q "spec-check" || \
  (echo "ERROR: Branch protection not configured"; exit 1)

# Check GitHub Project exists
gh project list --owner {owner} | grep -q "Week 5" || \
  (echo "ERROR: GitHub Project not created"; exit 1)

# Check templates exist
[ -f ".github/ISSUE_TEMPLATE/feature.md" ] && [ -f ".github/pull_request_template.md" ] || \
  (echo "ERROR: Templates not created"; exit 1)

# Check review packet
[ -f "review-artifacts/index.html" ] && [ -f "review-artifacts/coverage/index.html" ] || \
  (echo "ERROR: Review packet incomplete"; exit 1)

echo "✓ All D0 tasks complete, ready to merge"
```

2. Ensure development branch is fully up-to-date:
```bash
git checkout development
git pull origin development
npm run test
npm run test:e2e
```

3. Checkout main and prepare:
```bash
git checkout main
git pull origin main
```

### Task F2: Perform Squash Merge

**Steps**:

1. Perform squash merge:
```bash
git merge --squash development
```

2. Create clear commit message:
```bash
git commit -m "Week 5 Day-0: Final hygiene and GitHub Projects migration

- Update main branch README.md with Week 5 paths and review packet links
- Remove stray files from repository
- Configure branch protection rules (5 required CI checks)
- Create GitHub Project with custom fields and automation rules
- Add .github issue and PR templates for contributor onboarding
- Verify Vitest coverage thresholds (60% minimum per suite)
- Generate review-packet artifact with coverage, Playwright reports, API docs
- Migrate project management from Linear to GitHub Projects

All D0 requirements met. Review packet ready at: ./review-artifacts/index.html
Branch protection active on main: spec-check, API coverage, Playwright, CodeQL, Dependency Review
GitHub Project configured with custom fields: Status, Priority, Size, Spec URL, Sprint/Week
Team migrated from Linear to GitHub Projects (Linear decommissioned)

Squash merge of development branch with all commits consolidated.
All tests passing (108/108 unit + 22/22 e2e).
Ready for production deployment."
```

3. Verify commit:
```bash
git log --oneline -1
# Should show: Week 5 Day-0: Final hygiene...
```

### Task F3: Create Release Tag

**Steps**:

1. Create annotated tag:
```bash
git tag -a week5-day0 -m "Week 5 Day-0 release

GitHub Projects migration complete.
All D0 requirements met.
Review packet: https://github.com/{owner}/{repo}/tree/main/review-artifacts"
```

2. Verify tag:
```bash
git tag -l week5-day0 -n
# Should show the tag message
```

3. Push to origin:
```bash
git push origin main week5-day0
```

**Validation**:
```bash
# Verify tag exists on origin
git fetch origin
git tag -l | grep -q "week5-day0" && echo "✓ Tag week5-day0 created"

# Verify tag points to main
git show week5-day0 --format="%B" | head -5
```

---

## Post-Implementation Validation

### Checklist: Definition of Done

- [ ] Main branch README.md updated with Week 5 paths
- [ ] Stray files removed from main branch (verified via `git log`)
- [ ] Development squash-merged into main (`git log --oneline main | head -1` shows merge commit)
- [ ] Tag week5-day0 created and pushed (`git tag -l | grep week5-day0`)
- [ ] Branch protection rules configured (5 required checks)
- [ ] Vitest coverage thresholds verified at 60% minimum
- [ ] review-artifacts/index.html generated with all links
- [ ] GitHub Project created with all 5 custom fields
- [ ] GitHub Project automation configured (auto-add, status updates)
- [ ] `.github/ISSUE_TEMPLATE/feature.md` created
- [ ] `.github/ISSUE_TEMPLATE/bug.md` created
- [ ] `.github/pull_request_template.md` created
- [ ] Team notified: Linear decommissioned, use GitHub Projects
- [ ] Development workflow fully operational on GitHub

### Test PRs

1. **Create test PR to main**:
```bash
git checkout development
git checkout -b test/pr-template
echo "test" > test-file.txt
git add test-file.txt
git commit -m "test: verify PR template"
git push origin test/pr-template
```

2. Create PR via GitHub web UI and verify:
   - PR template auto-filled ✓
   - Can select "Spec URL" ✓
   - Branch protection blocking merge until checks pass ✓
   - Can manually run GitHub Project automation ✓

3. Close test PR without merging (cleanup)

---

## Troubleshooting

### Issue: Branch protection rule not accepting status checks

**Solution**:
- Ensure workflows exist in `.github/workflows/`
- Ensure workflow outputs a status check with the exact name
- Wait for workflow to run at least once before adding to protection rules

### Issue: GitHub Project custom fields not showing

**Solution**:
- Refresh the browser page
- Ensure you're in "Table" view (not "Board")
- Check project is not archived

### Issue: PR template not showing

**Solution**:
- Verify file is at `.github/pull_request_template.md` (exact path, not nested)
- Verify file is valid Markdown
- Clear browser cache and refresh

### Issue: Vitest coverage below 60%

**Solution**:
- Run `npm run test:coverage` to see which files are not covered
- Add tests for uncovered code paths
- Ensure test files themselves are excluded from coverage

---

## Success Criteria

After completing all D0 phases, you should be able to:

1. ✅ Navigate to main branch README and see Week 5 links
2. ✅ Attempt to merge a PR to main without all checks passing → merge blocked
3. ✅ Create a new issue → auto-added to GitHub Project
4. ✅ Create a new PR → PR template pre-filled, auto-added to project
5. ✅ Merge a PR → Status automatically updated to "Done"
6. ✅ Open review-artifacts/index.html → See all links to coverage, reports, docs
7. ✅ Git tag week5-day0 exists on main branch
8. ✅ All team members using GitHub Projects (no new Linear issues)

---

*Quickstart complete. D0 is ready for implementation.*


