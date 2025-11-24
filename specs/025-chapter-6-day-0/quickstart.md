# Quick Start: Chapter 6 Day 0 - FinishtoGreen & CI Tightening

**Branch**: `025-chapter-6-day-0` | **Date**: 18 November 2025  
**Input**: Feature specification from `/specs/025-chapter-6-day-0/spec.md`

---

## Execution Overview

This quick start guides you through implementing Chapter 6 Day 0 tasks in sequence. All tasks are **configuration-only** (no code rewrites) and can be executed in parallel workstreams by different team members.

**Total estimated time**: 3-4 hours  
**Prerequisites**: 
- Admin access to GitHub repository
- Write access to main branch (for tag creation)
- Node.js 18+ installed locally
- Git CLI configured

---

## Phase 1: Chapter 5 FinishtoGreen (1-1.5 hours)

### Task 1.1: Clean Main Branch (15 min)

**Objective**: Remove stray/debug files from main branch  
**Acceptance**: No extraneous files remaining; clean `git status`

```bash
# On main branch
cd /Users/prnceb/Desktop/WORK/training-prince

# Step 1: Identify stray files
git status

# Step 2: Review and remove any debug/test files
# Examples to remove if present:
# - hello.js..js
# - temp-test.js
# - debug-output.json
# - Any files created during development but not committed to spec

# For each stray file:
git rm <filename>
git commit -m "chore: remove stray debug file - <filename>"
git push origin main

# Verify
git status # Should show "nothing to commit, working tree clean"
```

**Verification**:
```bash
git log --oneline main | head -5
# Last commit should be clean; no "remove debug" messages on clean repos
```

---

### Task 1.2: Update README.md with Links (20 min)

**Objective**: Link to Review Packet, API docs, and Chapter 6 instructions  
**Acceptance**: README.md contains three new links; GitHub Pages URL verified

```bash
# Step 1: Verify GitHub Pages is configured and accessible
# Navigate to: https://maximus-technologies-uganda.github.io/training-prince/
# (or repository-specific URL)

# Step 2: Update README.md
# Add after the existing "Resources & Documentation" section:

cat >> README.md << 'EOF'

## Chapter 5 API Development Complete

✅ **Chapter 5 Finalized**: API development complete with Chapter 5 FinishtoGreen baseline established.

### Quick Links

- 📚 **Live API Documentation**: [GitHub Pages - API Docs](https://maximus-technologies-uganda.github.io/training-prince/)
- 📋 **Chapter 5 Review Packet**: [review-artifacts/index.html](./review-artifacts/index.html)
- 🚀 **Chapter 6 Setup**: See [specs/025-chapter-6-day-0/](./specs/025-chapter-6-day-0/) for Day 0 tasks and [specs/025-chapter-6-day-0/quickstart.md](./specs/025-chapter-6-day-0/quickstart.md) for execution guide

EOF

# Step 3: Commit and push
git add README.md
git commit -m "docs: add Chapter 5 completion links and Chapter 6 setup pointers"
git push origin main
```

**Verification**:
```bash
# Verify links render in GitHub UI
curl -s https://maximus-technologies-uganda.github.io/training-prince/ | head -20

# Verify markdown links
grep -A 5 "Chapter 5 API Development Complete" README.md
```

---

### Task 1.3: Create chapter5-complete Git Tag (15 min)

**Objective**: Tag the final Chapter 5 commit; make visible in GitHub Releases  
**Acceptance**: Tag exists; visible in GitHub git history and Releases page

```bash
# Step 1: Ensure on main branch with latest changes
git checkout main
git pull origin main

# Step 2: Get latest commit SHA
COMMIT_SHA=$(git rev-parse HEAD)
echo "Tagging commit: $COMMIT_SHA"

# Step 3: Create annotated tag
git tag -a chapter5-complete \
  -m "Chapter 5 API Development Complete: FinishtoGreen baseline established. All API endpoints tested and documented. Ready for Chapter 6 frontend development." \
  $COMMIT_SHA

# Step 4: Push tag to origin
git push origin chapter5-complete

# Step 5: Verify tag
git describe --tags
git tag -l chapter5-complete -n2
```

**Verification**:
```bash
# Local verification
git log --oneline --decorate | head -10
# Should show: (tag: chapter5-complete, origin/main, main)

# GitHub verification (30 seconds delay)
# Navigate to: https://github.com/Maximus-Technologies-Uganda/training-prince/releases
# Should see "chapter5-complete" in Releases list
```

---

### Task 1.4: Verify Branch Protection Rules (10 min)

**Objective**: Confirm main branch has required status checks enabled  
**Acceptance**: All 4 checks visible in branch protection; ally-check to be added next

```bash
# Step 1: Navigate to GitHub Settings
# Go to: Settings → Branches → Branch protection rules → main

# Step 2: Verify these required status checks are ENABLED:
# ✅ spec-check
# ✅ test-api
# ✅ codeql
# ✅ dependency-review

# (ally-check will be added in Phase 2)

# Step 3: Verify other settings:
# ✅ Require a pull request before merging: YES
# ✅ Require code reviews: 1 or more approvals
# ✅ Dismiss stale PR approvals: YES
# ✅ Require branches to be up to date before merging: YES

# Verification via GitHub CLI (if installed):
# gh api repos/Maximus-Technologies-Uganda/training-prince/branches/main/protection
```

**Verification**: Screenshot of branch protection rule showing all 5 checks (including ally-check which will be added next).

---

## Phase 2: Chapter 6 CI Tightening (1.5-2 hours)

### Task 2.1: Create SECURITY.md File (15 min)

**Objective**: Add responsible disclosure policy to repository root  
**Acceptance**: SECURITY.md exists with clear vulnerability reporting guidelines

```bash
# Step 1: Create SECURITY.md in repository root
cat > /Users/prnceb/Desktop/WORK/training-prince/SECURITY.md << 'EOF'
# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly:

### GitHub Security Advisory (Recommended)
Create a private security advisory: https://github.com/Maximus-Technologies-Uganda/training-prince/security/advisories/new

### Email Notification
Or email the maintainers with vulnerability details.

**Please do not open public issues for security vulnerabilities.**

## Responsible Disclosure Guidelines

We commit to:
1. **Acknowledge**: Respond to reports within 48 hours
2. **Assess**: Evaluate vulnerability severity and impact
3. **Fix**: Provide patches within 30 days or public disclosure timeline
4. **Coordinate**: Work with reporter on responsible disclosure timeline

## Vulnerability Details to Include

When reporting, please provide:
- **Description**: What is the vulnerability?
- **Affected Version**: Which version(s) are impacted?
- **Reproduction Steps**: How can we reproduce it?
- **Impact**: What are the potential consequences?
- **Suggested Fix**: Do you have a suggested mitigation?

## Supported Versions

| Version | Support Status | Security Updates |
|---------|----------------|------------------|
| Latest  | ✅ Full        | Yes              |
| N-1     | ⚠️  Limited    | Critical only    |
| Older   | ❌ None        | No               |

## Security Considerations

This project enforces:
- **Code Quality**: Mandatory coverage thresholds (API 70%, UI 55%)
- **Static Analysis**: CodeQL scanning on all pushes
- **Dependency Security**: Dependency review on all PRs
- **Accessibility**: Automated accessibility checks with ally-check

## Third-Party Dependencies

We use:
- **Testing**: Vitest v3.2.4, Playwright v1.48.2
- **CI/CD**: GitHub Actions
- **Accessibility**: axe-core for automated scanning
- **Documentation**: Redoc for API documentation

Monitor GitHub's dependency alerts for security updates.

## Questions?

For security policy questions, contact the project maintainers through a private security advisory.

---

**Last Updated**: 2025-11-18  
**Next Review**: 2025-12-18
EOF

# Step 2: Verify file was created
cat /Users/prnceb/Desktop/WORK/training-prince/SECURITY.md | head -20

# Step 3: Commit and push
cd /Users/prnceb/Desktop/WORK/training-prince
git add SECURITY.md
git commit -m "security: add responsible disclosure policy and vulnerability reporting guidelines"
git push origin 025-chapter-6-day-0
```

**Verification**:
```bash
# Verify file exists in repo
git ls-files | grep SECURITY.md

# Verify on GitHub (when PR is merged)
# https://github.com/Maximus-Technologies-Uganda/training-prince/blob/main/SECURITY.md
```

---

### Task 2.2: Create ally-check GitHub Actions Workflow (30 min)

**Objective**: Add ally-check job for automated accessibility scanning  
**Acceptance**: Workflow executes on PRs; establishes baseline; blocks PRs with new violations

```bash
# Step 1: Create ally-check workflow directory
mkdir -p /Users/prnceb/Desktop/WORK/training-prince/.github/workflows
mkdir -p /Users/prnceb/Desktop/WORK/training-prince/.github/accessibility

# Step 2: Create ally-check.yml workflow
cat > /Users/prnceb/Desktop/WORK/training-prince/.github/workflows/ally-check.yml << 'EOF'
name: ally-check

on:
  pull_request:
    branches: [main, development]
    paths:
      - 'frontend/**'
      - '.github/workflows/ally-check.yml'
      - '.github/accessibility/**'
  push:
    branches: [main]
    paths:
      - 'frontend/**'
      - '.github/accessibility/**'

jobs:
  accessibility-scan:
    runs-on: ubuntu-latest
    name: Automated Accessibility Checks
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci --prefix frontend

      - name: Build frontend
        run: npm run build --prefix frontend
        continue-on-error: true

      - name: Install axe-playwright
        run: npm install --save-dev @axe-core/playwright axe-html-reporter

      - name: Run accessibility scan
        id: scan
        run: |
          node .github/scripts/run-ally-check.js
        continue-on-error: true

      - name: Compare against baseline
        id: compare
        run: |
          node .github/scripts/compare-ally-baseline.js
        continue-on-error: true

      - name: Upload accessibility report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: accessibility-report
          path: .github/accessibility/report.html

      - name: Comment on PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const report = fs.readFileSync('.github/accessibility/summary.md', 'utf8');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: report
            });
        continue-on-error: true

      - name: Fail if new violations found
        if: failure()
        run: |
          echo "::error::New accessibility violations detected. See artifact for details."
          exit 1
EOF

# Step 3: Create baseline file (Day 0: empty baseline, will be populated on first scan)
cat > /Users/prnceb/Desktop/WORK/training-prince/.github/accessibility/ally-check-baseline.json << 'EOF'
{
  "baseline_date": "2025-11-18",
  "baseline_version": "1.0.0",
  "scan_tool": "axe-core",
  "scan_pages": ["/", "/about"],
  "documentation": "Chapter 6 Day 0 accessibility baseline. Established 2025-11-18. Initial scan to identify known violations. Only NEW violations (not in this baseline) trigger CI failure.",
  "violations": []
}
EOF

# Step 4: Create placeholder scripts (will be implemented in Day 1)
mkdir -p /Users/prnceb/Desktop/WORK/training-prince/.github/scripts

cat > /Users/prnceb/Desktop/WORK/training-prince/.github/scripts/run-ally-check.js << 'EOF'
/**
 * Placeholder: Run accessibility scan with axe-core
 * To be implemented in Chapter 6 Day 1
 */
console.log('Placeholder: ally-check scan will run here');
process.exit(0);
EOF

cat > /Users/prnceb/Desktop/WORK/training-prince/.github/scripts/compare-ally-baseline.js << 'EOF'
/**
 * Placeholder: Compare scan results against baseline
 * To be implemented in Chapter 6 Day 1
 */
console.log('Placeholder: baseline comparison will run here');
process.exit(0);
EOF

# Step 5: Commit and push
cd /Users/prnceb/Desktop/WORK/training-prince
git add .github/workflows/ally-check.yml
git add .github/accessibility/
git add .github/scripts/run-ally-check.js
git add .github/scripts/compare-ally-baseline.js
git commit -m "ci: add ally-check workflow for automated accessibility scanning with baseline exceptions"
git push origin 025-chapter-6-day-0
```

**Verification**:
```bash
# Verify workflow file syntax
yamllint .github/workflows/ally-check.yml 2>/dev/null || echo "YAML valid"

# Verify baseline file is valid JSON
cat .github/accessibility/ally-check-baseline.json | jq . > /dev/null && echo "JSON valid"

# When PR is created, verify workflow appears in PR status checks
# Look for "ally-check / Automated Accessibility Checks" in PR status
```

---

### Task 2.3: Update Coverage Thresholds (15 min)

**Objective**: Increase UI coverage from 40% to 55%; verify API at 70%  
**Acceptance**: Both configs updated; coverage reports reflect new thresholds

#### Step 2.3a: Frontend Coverage Update

```bash
cd /Users/prnceb/Desktop/WORK/training-prince

# Update frontend/vitest.config.js
# Change from:
#   thresholds: { statements: 40, lines: 40 }
# To:
#   thresholds: { statements: 55, lines: 55, functions: 55, branches: 55 }

# Review current config
cat frontend/vitest.config.js

# Update with new thresholds
# (Use editor or sed command)
```

#### Step 2.3b: Verify API Config

```bash
# API config should already have:
#   thresholds: { statements: 70, branches: 70, functions: 70, lines: 70 }

cat api/vitest.config.ts | grep -A 5 "thresholds"
# Should show 70% for all metrics
```

#### Step 2.3c: Test Coverage Locally

```bash
# Run tests locally to verify thresholds
npm test -- --coverage

# Expected result: 
# - If coverage meets thresholds: ✅ PASS
# - If coverage below thresholds: ❌ FAIL with message showing current coverage
```

**Verification**:
```bash
# Commit updated config
git add frontend/vitest.config.js
git commit -m "test: increase frontend coverage threshold from 40% to 55% for Chapter 6"
git push origin 025-chapter-6-day-0
```

---

### Task 2.4: Update Review Packet Structure (20 min)

**Objective**: Add GitHub Projects evidence section and Chapter 6 placeholder  
**Acceptance**: review-artifacts/index.html renders with new sections

```bash
cd /Users/prnceb/Desktop/WORK/training-prince

# Step 1: Find the review packet build script
find . -name "*review*packet*" -o -name "build-review*" | head -5

# Step 2: Update the HTML template to include new sections
# The template is likely in .github/scripts/ or a workflow

# Step 3: Add to the HTML index:
# - "Projects Evidence" section with link to GitHub Projects board
# - "Chapter 6 UI Assets" placeholder section

# Example additions to index.html template:

cat >> review-artifacts/index.html << 'EOF'

## Projects Evidence

The Training Prince GitHub Projects board tracks all work items with custom fields:
- **Status**: Not Started → In Progress → In Review → Done
- **Priority**: P0 (Critical), P1 (High), P2 (Medium), P3 (Low)
- **Size**: S (Small), M (Medium), L (Large), XL (Extra Large)
- **Spec URL**: Link to specification or Linear issue
- **Sprint/Chapter**: Chapter 5, Chapter 6, etc.

**View Board**: [Training Prince Project](https://github.com/orgs/Maximus-Technologies-Uganda/projects/X)

---

## Chapter 6 UI Assets (Placeholder)

Reserved for Chapter 6 frontend deliverables. Sections to be populated during Days 1-5:

### UI Coverage Report
*Coming in PR 026-ui-components*

### Playwright E2E Report
*Coming in PR 027-e2e-tests*

### Lighthouse Performance Report
*Coming in PR 028-performance*

EOF
```

**Verification**:
```bash
# Check that index.html is valid
if [ -f review-artifacts/index.html ]; then
  echo "✅ Review packet index exists"
  grep "Projects Evidence" review-artifacts/index.html && echo "✅ Projects section added"
  grep "Chapter 6 UI Assets" review-artifacts/index.html && echo "✅ Chapter 6 placeholder added"
fi
```

---

### Task 2.5: Verify GitHub Projects Configuration (15 min)

**Objective**: Confirm all 5 required fields are present; test automations  
**Acceptance**: All fields visible; automations tested and working

```bash
# Step 1: Navigate to GitHub Projects
# URL: https://github.com/orgs/Maximus-Technologies-Uganda/projects/X

# Step 2: Verify these 5 fields are present in board settings:
# ✅ Status (single select: Not Started, In Progress, In Review, Done)
# ✅ Priority (single select: P0, P1, P2, P3)
# ✅ Size (single select: S, M, L, XL)
# ✅ Spec URL (text field)
# ✅ Sprint/Chapter (single select: Chapter 5, Chapter 6)

# Step 3: Test auto-add automation
# Create a test issue on this branch:
# - Title: "Test: Projects Auto-Add"
# - Label: "test"
# Expected: Issue appears on Training Prince board within 1 minute

# Step 4: Test PR-to-Done automation
# Create a test PR that closes a test issue (add "Closes #ISSUE_NUMBER" to PR body)
# Expected: When PR is merged, issue moves to "Done" status

# Step 5: Verify automations in Projects settings
# Settings → Automations
# Should show:
# - "When issues are added to the project" → Action: auto-add
# - "When PRs are added to the project" → Action: move to "Done" on merge
```

**Verification**:
Take screenshots showing:
1. All 5 fields visible in board view
2. Automation settings configured
3. Sample item showing all fields filled

---

### Task 2.6: Add ally-check to Branch Protection (10 min)

**Objective**: Require ally-check as a status check on main branch  
**Acceptance**: ally-check appears in required status checks; blocks PRs with accessibility violations

```bash
# Step 1: Navigate to Settings → Branches → Branch protection rules → main

# Step 2: Under "Require status checks to pass before merging":
# ✅ Add "ally-check" to required status checks

# Current required checks (keep these):
# - spec-check
# - test-api
# - codeql
# - dependency-review

# New check to add:
# - ally-check

# Step 3: Verify settings:
# ✅ Require branches to be up to date before merging: YES
# ✅ Dismiss stale PR approvals: YES

# Step 4: Save changes
```

**Verification**:
Screenshot showing all 5 required status checks including ally-check.

---

## Phase 3: Validation & Testing (30 min)

### Task 3.1: Create Test PR (10 min)

**Objective**: Create a PR on 025-chapter-6-day-0 branch to verify all CI checks  
**Acceptance**: All status checks pass; Review Packet generated

```bash
# Step 1: Make a trivial change to trigger CI
cd /Users/prnceb/Desktop/WORK/training-prince

echo "# Day 0 Complete" > DAY_0_STATUS.md
git add DAY_0_STATUS.md
git commit -m "doc: mark Day 0 tasks complete"
git push origin 025-chapter-6-day-0

# Step 2: Create PR via GitHub UI
# Title: "025: Chapter 6 Day 0 - FinishtoGreen & CI Tightening"
# Body:
# ```
# Implements Chapter 6 Day 0 setup tasks:
# - ✅ Chapter 5 FinishtoGreen complete
# - ✅ SECURITY.md added with responsible disclosure policy
# - ✅ ally-check workflow for accessibility scanning
# - ✅ Coverage thresholds updated (API 70%, UI 55%)
# - ✅ Review Packet extended with Projects evidence
# - ✅ GitHub Projects verified with all 5 required fields
# - ✅ Branch protection updated to require ally-check
# 
# Spec: https://github.com/Maximus-Technologies-Uganda/training-prince/blob/025-chapter-6-day-0/specs/025-chapter-6-day-0/spec.md
# ```

# Step 3: Monitor PR status checks
# Expected checks to pass:
# - ✅ spec-check
# - ✅ test-api
# - ✅ codeql
# - ✅ dependency-review
# - ⏳ ally-check (will run but should pass as placeholder)
```

**Verification**:
- All status checks pass (or are skipped if not applicable)
- Review Packet artifact generated
- Link to review-artifacts/index.html available in PR

---

### Task 3.2: Verify Review Packet Rendering (10 min)

**Objective**: Download review packet and verify it renders correctly  
**Acceptance**: All sections visible and links functional

```bash
# Step 1: In PR, go to Checks tab
# Step 2: Find artifact "review-packet"
# Step 3: Download and extract

# Step 4: Open review-artifacts/index.html in browser
# Verify these sections are present:
# - ✅ Coverage Index (with links to backend/UI coverage)
# - ✅ Test Results (Playwright E2E report link)
# - ✅ API Documentation (link to GitHub Pages)
# - ✅ Projects Evidence (link/screenshot of board)
# - ✅ Chapter 6 UI Assets (placeholder section)

# Step 5: Click each link to verify it's functional
```

---

### Task 3.3: Test Coverage Threshold Enforcement (10 min)

**Objective**: Verify that coverage thresholds block PRs if not met  
**Acceptance**: PR with insufficient coverage is rejected by CI

```bash
# Step 1: This is a verification task; if you have low coverage code:

# Intentionally reduce coverage to below threshold
# (This is for testing; don't merge!)

# Create a new branch:
git checkout -b test/coverage-below-threshold

# Add an untested function to frontend:
cat >> frontend/src/test-uncovered.js << 'EOF'
export function uncoveredFunction() {
  return Math.random() * 1000;
}
EOF

git add frontend/src/test-uncovered.js
git commit -m "test: add uncovered function to verify threshold enforcement"
git push origin test/coverage-below-threshold

# Create PR; observe CI failure due to low coverage

# Expected result:
# PR status check fails: "Coverage below threshold: 55% required, X% found"

# Step 2: Clean up test branch
git checkout main
git branch -D test/coverage-below-threshold
git push origin --delete test/coverage-below-threshold
```

---

## Success Checklist

- [ ] Chapter 5 FinishtoGreen Complete
  - [ ] Main branch cleaned (no stray files)
  - [ ] README.md updated with links
  - [ ] chapter5-complete tag created and pushed
  - [ ] Branch protection verified (4 checks: spec-check, test-api, codeql, dependency-review)

- [ ] Chapter 6 CI Tightening Complete
  - [ ] SECURITY.md file created in root
  - [ ] ally-check workflow created (.github/workflows/ally-check.yml)
  - [ ] Accessibility baseline established (.github/accessibility/ally-check-baseline.json)
  - [ ] Frontend coverage thresholds updated to 55%
  - [ ] API coverage thresholds verified at 70%
  - [ ] Review Packet updated with Projects evidence section
  - [ ] Chapter 6 UI Assets placeholder section added
  - [ ] GitHub Projects verified with all 5 required fields
  - [ ] Project automations tested (auto-add, PR-to-Done)
  - [ ] ally-check added to branch protection required status checks

- [ ] Validation Complete
  - [ ] Test PR created and all checks pass
  - [ ] Review Packet artifact renders correctly
  - [ ] Coverage thresholds enforced (test with intentionally low coverage)
  - [ ] Day 0 status documented in README.md

---

## Troubleshooting

### Issue: GitHub Actions workflow not appearing in PR status

**Solution**: 
1. Verify workflow file is in `.github/workflows/` directory
2. Check YAML syntax: `yamllint .github/workflows/ally-check.yml`
3. Workflow file must be on the same branch as the PR
4. Force refresh: close and reopen PR

### Issue: Review Packet artifact not generated

**Solution**:
1. Verify `review-packet.yml` workflow exists
2. Check that build script succeeds
3. Verify artifact upload step in workflow
4. Check GitHub Actions logs for errors

### Issue: Coverage thresholds not enforced

**Solution**:
1. Verify `VITEST_DISABLE_THRESHOLD` environment variable is NOT set to "1"
2. Confirm threshold values in vitest.config.js
3. Run `npm test -- --coverage` locally to see current coverage
4. Check that CI is running `npm test` with coverage

### Issue: Projects automation not working

**Solution**:
1. Verify automations are enabled in Projects settings
2. Check that issues/PRs are added to the board manually first
3. Automation may take 1-2 minutes; wait and refresh
4. Verify custom fields are populated (automation requires fields)

---

## Next Steps (Chapter 6 Day 1)

Once Day 0 is complete and PR is merged:

1. **Ally-check Implementation**: Implement actual accessibility scanning with axe-core
2. **Review Packet Polish**: Add CI job to generate Projects screenshot automatically
3. **Frontend Setup**: Set up Next.js frontend (Chapter 6 Day 1-5)
4. **E2E Expansion**: Expand Playwright tests for new frontend components

---

## Resources

- **Specification**: [specs/025-chapter-6-day-0/spec.md](../spec.md)
- **Data Model**: [specs/025-chapter-6-day-0/data-model.md](../data-model.md)
- **Research Findings**: [specs/025-chapter-6-day-0/research.md](../research.md)
- **Constitution**: [.specify/memory/constitution.md](./.specify/memory/constitution.md)

---

**Quick Start Status**: ✅ COMPLETE  
**Next**: Execute Phase 1, 2, 3 tasks in sequence or parallel by team  
**Estimated Completion Time**: 3-4 hours total
