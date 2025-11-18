# Parent Issue Description: Chapter 6 Day 0 - FinishtoGreen & CI Tightening

**Branch**: `025-chapter-6-day-0` | **Spec**: [specs/025-chapter-6-day-0/spec.md](./specs/025-chapter-6-day-0/spec.md)

---

## Overview

Implementation of Chapter 6 Day 0: FinishtoGreen & CI Tightening. This parent issue tracks all 23 tasks needed to close Chapter 5 API work and establish quality gates for Chapter 6 frontend development.

**Total Tasks**: 23 across 6 phases  
**Estimated Time**: 3-4 hours (parallel execution recommended)  
**Parallelizable**: 8 tasks can run independently  
**Status**: Ready for team execution

---

## Phase 1: Setup & Prerequisites

- [ ] T001 Verify git branch is `025-chapter-6-day-0` and main branch is accessible
- [ ] T002 Ensure all design documents are loaded (spec.md, plan.md, research.md, data-model.md, quickstart.md)
- [ ] T003 Update .github/copilot-instructions.md with Chapter 6 technologies (if not already done)

---

## Phase 2: Foundational Infrastructure

- [ ] T004 Create SECURITY.md in repository root with responsible disclosure policy
- [ ] T005 Create .github/workflows/ally-check.yml GitHub Actions workflow
- [ ] T006 Create .github/accessibility/ally-check-baseline.json with initial baseline
- [ ] T007 Create placeholder scripts: .github/scripts/run-ally-check.js and compare-ally-baseline.js

---

## Phase 3: User Story 1 (P1) - FinishtoGreen: Chapter 5 API Work Complete

**Goal**: Formally close Chapter 5 API development and document completion

- [ ] T008 [P] [US1] Clean main branch: remove stray/debug files
- [ ] T009 [P] [US1] Update README.md with links to Review Packet, API docs, and Chapter 6
- [ ] T010 [US1] Create and push git tag `chapter5-complete` marking final Chapter 5 commit
- [ ] T011 [US1] Verify branch protection rule on main requires all 4 existing status checks

---

## Phase 4: User Story 2 (P1) - CI Tightening: New Quality Gates

**Goal**: Establish coverage thresholds and accessibility scanning baseline

- [ ] T012 [US2] Update API coverage threshold to 70% in api/vitest.config.ts
- [ ] T013 [P] [US2] Update frontend coverage threshold from 40% to 55% in frontend/vitest.config.js
- [ ] T014 [US2] Implement .github/scripts/run-ally-check.js accessibility scanning logic
- [ ] T015 [US2] Implement .github/scripts/compare-ally-baseline.js baseline comparison logic
- [ ] T016 [P] [US2] Add ally-check to branch protection required status checks

---

## Phase 5: User Story 3 (P2) - Review Packet & Project Hygiene

**Goal**: Update Review Packet and verify GitHub Projects configuration

- [ ] T017 [P] [US3] Update Review Packet index.html to include Projects evidence section
- [ ] T018 [P] [US3] Verify GitHub Projects "Training Prince" board has all 5 required fields
- [ ] T019 [P] [US3] Test GitHub Projects automations: auto-add and PR-to-Done

---

## Phase 6: Validation & Integration

- [ ] T020 Create comprehensive test PR on 025-chapter-6-day-0 branch
- [ ] T021 Verify Review Packet artifact generates correctly
- [ ] T022 Verify coverage threshold enforcement blocks low-coverage PRs
- [ ] T023 Merge PR to main and confirm chapter5-complete tag visible

---

## Sub-Issue Descriptions by Task

Each task below includes a complete sub-issue description ready to copy-paste into individual GitHub issues.

---

### T001: Verify git branch and main branch accessibility

**Use this as the issue body:**

```markdown
## Description
Verify current git branch is `025-chapter-6-day-0` and main branch is clean with no uncommitted changes. This ensures the repository is in a clean state before starting implementation work.

## Problem Statement
Unexpected branch or uncommitted changes can cause merge conflicts or loss of work. We need to establish a baseline repository state before proceeding.

## Proposed Solution
1. Run `git branch` to verify current branch is `025-chapter-6-day-0`
2. Run `git status` to verify clean working directory
3. Run `git checkout main && git pull origin main` to verify main is accessible
4. Return to feature branch: `git checkout 025-chapter-6-day-0`
5. Verify no uncommitted changes: `git status` should show "nothing to commit"

## Acceptance Criteria
- [ ] Current branch is `025-chapter-6-day-0`
- [ ] `git status` shows clean working directory
- [ ] Main branch pulls successfully
- [ ] No uncommitted changes remain
- [ ] Feature branch still has all commits intact

## Related Links
- Spec: specs/025-chapter-6-day-0/spec.md
- Quickstart: specs/025-chapter-6-day-0/quickstart.md (Task 1)
```

---

### T002: Ensure all design documents are loaded

**Use this as the issue body:**

```markdown
## Description
Verify that all Phase 1 planning documents are accessible and complete. These documents provide context for all implementation tasks.

## Problem Statement
Missing or incomplete documentation can lead to rework or misunderstanding of requirements. We need to ensure all reference materials are available before starting implementation.

## Proposed Solution
1. Verify these files exist and are readable:
   - specs/025-chapter-6-day-0/spec.md (requirements)
   - specs/025-chapter-6-day-0/plan.md (technical plan)
   - specs/025-chapter-6-day-0/research.md (clarifications)
   - specs/025-chapter-6-day-0/data-model.md (entity definitions)
   - specs/025-chapter-6-day-0/quickstart.md (execution walkthrough)

2. Verify no NEEDS CLARIFICATION items remain in any document
3. Verify constitution check in plan.md shows: "PASS"

## Acceptance Criteria
- [ ] spec.md is readable and contains 3 user stories
- [ ] plan.md is readable and shows constitution check: PASS
- [ ] research.md is readable and contains resolved clarifications
- [ ] data-model.md is readable and contains 6 entity definitions
- [ ] quickstart.md is readable and contains 13 tasks
- [ ] No NEEDS CLARIFICATION markers remain

## Related Links
- Spec: specs/025-chapter-6-day-0/spec.md
- Plan: specs/025-chapter-6-day-0/plan.md
- Research: specs/025-chapter-6-day-0/research.md
```

---

### T003: Update .github/copilot-instructions.md

**Use this as the issue body:**

```markdown
## Description
Update the AI agent context file to include Chapter 6 Day 0 technologies. This ensures future AI-assisted work has proper context.

## Problem Statement
Without updated context, AI agents may not understand the new tools and approaches introduced in Chapter 6 (ally-check, @axe-core/playwright, GitHub Projects APIs).

## Proposed Solution
1. Open .github/copilot-instructions.md
2. Find the "Active Technologies" section
3. Add new bullet point for 025-chapter-6-day-0:
   - GitHub Actions (YAML), Node.js 20
   - @axe-core/playwright (accessibility scanning)
   - Vitest v3.2.4, @vitest/coverage-v8
   - GitHub Projects API
   - Git tags for milestones
4. Update "Recent Changes" section to include:
   - ally-check workflow implementation
   - coverage threshold enforcement (API 70%, UI 55%)
   - GitHub Projects automation setup

## Acceptance Criteria
- [ ] Chapter 6 technologies added to Active Technologies section
- [ ] @axe-core/playwright listed as new dependency
- [ ] Coverage thresholds documented (API 70%, UI 55%)
- [ ] GitHub Projects APIs mentioned
- [ ] Recent Changes section updated
- [ ] File is valid YAML/Markdown

## Related Links
- File: .github/copilot-instructions.md
- Spec: specs/025-chapter-6-day-0/spec.md
```

---

### T004: Create SECURITY.md

**Use this as the issue body:**

```markdown
## Description
Create a SECURITY.md file in the repository root with responsible vulnerability disclosure policy. This establishes formal security reporting procedures.

## Problem Statement
Without a documented security policy, reporters don't know how to disclose vulnerabilities responsibly. A SECURITY.md file provides clear guidelines.

## Proposed Solution
1. Create file: SECURITY.md in repository root
2. Add content:
   ```markdown
   # Security Policy

   ## Reporting a Vulnerability

   Please report security vulnerabilities to: [contact email]

   Do not publicly disclose vulnerabilities before receiving acknowledgment from the security team.

   ## Supported Versions

   | Version | Supported          |
   |---------|--------------------|
   | 1.0.x   | :white_check_mark: |
   | < 1.0   | :x:                |

   ## Security Expectations

   - Coverage thresholds: API 70%, UI 55%
   - Accessibility compliance: No NEW violations
   - Code review: All PRs require approval
   - Dependency scanning: Active (GitHub Dependabot)
   ```

## Acceptance Criteria
- [ ] SECURITY.md exists in repository root
- [ ] Contains Security Policy section
- [ ] Contains Reporting section with contact info
- [ ] Contains Supported Versions table
- [ ] File is in Markdown format
- [ ] No broken sections

## Related Links
- Spec: specs/025-chapter-6-day-0/spec.md (FR-006)
- Data Model: specs/025-chapter-6-day-0/data-model.md
```

---

### T005: Create .github/workflows/ally-check.yml

**Use this as the issue body:**

```markdown
## Description
Create the GitHub Actions workflow for accessibility scanning using axe-core and Playwright.

## Problem Statement
Currently, there's no automated accessibility scanning. We need a CI job that identifies violations on every PR.

## Proposed Solution
1. Create file: .github/workflows/ally-check.yml
2. Add workflow content:
   ```yaml
   name: ally-check
   on:
     pull_request:
       branches: [main, development]
       paths:
         - 'frontend/**'
         - '.github/workflows/ally-check.yml'
     push:
       branches: [main]
   
   jobs:
     accessibility-scan:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: '20'
             cache: 'npm'
         - run: npm ci --prefix frontend
         - run: npm run build --prefix frontend
         - run: npm install --save-dev @axe-core/playwright
         - run: node .github/scripts/run-ally-check.js
         - run: node .github/scripts/compare-ally-baseline.js
         - uses: actions/upload-artifact@v4
           with:
             name: accessibility-report
             path: .github/accessibility/scan-results.json
   ```
3. Ensure workflow triggers on PRs to main and pushes to main
4. Verify syntax with `yamllint` or GitHub's syntax checker

## Acceptance Criteria
- [ ] File exists at .github/workflows/ally-check.yml
- [ ] YAML syntax is valid
- [ ] Triggers on PR to main
- [ ] Triggers on push to main
- [ ] Installs dependencies correctly
- [ ] Runs accessibility scanning scripts
- [ ] Uploads artifact

## Related Links
- Spec: specs/025-chapter-6-day-0/spec.md (FR-007)
- Research: specs/025-chapter-6-day-0/research.md (Ally-Check Integration)
```

---

### T006: Create .github/accessibility/ally-check-baseline.json

**Use this as the issue body:**

```markdown
## Description
Create the baseline file that establishes the initial set of known accessibility violations. Only NEW violations (not in baseline) will trigger CI failure.

## Problem Statement
We need a way to track which accessibility violations are pre-existing vs. newly introduced. The baseline captures the Day 0 state.

## Proposed Solution
1. Create directory: .github/accessibility/ (if not exists)
2. Create file: .github/accessibility/ally-check-baseline.json
3. Add content:
   ```json
   {
     "baseline_date": "2025-11-18",
     "baseline_version": "1.0.0",
     "scan_tool": "axe-core",
     "scan_pages": ["/", "/about"],
     "documentation": "Chapter 6 Day 0 baseline. Only NEW violations trigger CI failure.",
     "violations": []
   }
   ```
4. Run ally-check locally to populate violations array (if needed)
5. Commit file to repository

## Acceptance Criteria
- [ ] File exists at .github/accessibility/ally-check-baseline.json
- [ ] File is valid JSON
- [ ] Contains baseline_date (today's date)
- [ ] Contains baseline_version
- [ ] Contains scan_tool: "axe-core"
- [ ] Contains violations array (empty or populated)
- [ ] File committed to branch

## Related Links
- Spec: specs/025-chapter-6-day-0/spec.md (FR-007)
- Data Model: specs/025-chapter-6-day-0/data-model.md (Accessibility Baseline)
```

---

### T007: Create placeholder scripts

**Use this as the issue body:**

```markdown
## Description
Create placeholder scripts for accessibility scanning and baseline comparison. These will be implemented fully in T014-T015.

## Problem Statement
The ally-check.yml workflow references scripts that don't exist yet. We need placeholder implementations so the workflow can run.

## Proposed Solution
1. Create directory: .github/scripts/ (if not exists)

2. Create file: .github/scripts/run-ally-check.js
   ```javascript
   #!/usr/bin/env node
   // Placeholder: Accessibility scanning script
   // Full implementation in T014
   console.log('placeholder: ally-check scanning...');
   process.exit(0);
   ```

3. Create file: .github/scripts/compare-ally-baseline.js
   ```javascript
   #!/usr/bin/env node
   // Placeholder: Baseline comparison script
   // Full implementation in T015
   console.log('placeholder: comparing baseline...');
   process.exit(0);
   ```

4. Make scripts executable: `chmod +x .github/scripts/*.js`
5. Commit both scripts

## Acceptance Criteria
- [ ] run-ally-check.js exists and is valid JavaScript
- [ ] compare-ally-baseline.js exists and is valid JavaScript
- [ ] Both scripts are executable
- [ ] Both exit with code 0 (success)
- [ ] Can be run by CI workflow without errors
- [ ] Files committed to branch

## Related Links
- Spec: specs/025-chapter-6-day-0/spec.md (FR-007)
- Quickstart: specs/025-chapter-6-day-0/quickstart.md (Task 2.1)
```

---

### T008: Clean main branch - remove stray/debug files [P] [US1]

**Use this as the issue body:**

```markdown
## Description
Remove any extraneous or stray files from the main branch that were created during development but should not be part of the final Chapter 5 completion.

## Problem Statement
Main branch may have debug files, temporary test files, or incomplete code that need cleanup before formally closing Chapter 5. This prevents technical debt and ensures a clean baseline.

## Proposed Solution
1. Run `git status` to identify stray files
2. Review each file to determine if it should be removed
3. Remove files using `git rm`
4. Commit with message: "chore: remove stray debug files from main branch"
5. Push to origin 025-chapter-6-day-0

## Acceptance Criteria
- [ ] `git status` shows clean working directory
- [ ] No hello.js..js or other debug files present
- [ ] Commit is pushed to feature branch
- [ ] No uncommitted changes remain

## Related Links
- Spec: specs/025-chapter-6-day-0/spec.md (FR-001)
- Quickstart: specs/025-chapter-6-day-0/quickstart.md (Task 1.1)
```

---

### T009: Update README.md with links [P] [US1]

**Use this as the issue body:**

```markdown
## Description
Update the main README.md file to include links to:
1. Live API documentation on GitHub Pages
2. Review Packet artifact (review-artifacts/index.html)
3. Chapter 6 Day 0 setup guide

This allows stakeholders and contributors to quickly find essential documentation.

## Problem Statement
README.md currently lacks direct links to published API docs and Review Packet. Users must search or navigate GitHub to find these resources. This friction increases onboarding time and reduces visibility into project status.

## Proposed Solution
Add a new section titled "Chapter 5 API Development Complete" containing:
- Link to GitHub Pages API documentation
- Link to Review Packet (review-artifacts/index.html)
- Link to Chapter 6 setup guide (specs/025-chapter-6-day-0/)

Example:
```markdown
## Chapter 5 API Development Complete

✅ **Live API Documentation**: [GitHub Pages - API Docs](https://maximus-technologies-uganda.github.io/training-prince/)
✅ **Review Packet**: [review-artifacts/index.html](./review-artifacts/index.html)
✅ **Chapter 6 Setup**: [specs/025-chapter-6-day-0/](./specs/025-chapter-6-day-0/)
```

## Acceptance Criteria
- [ ] README.md contains link to GitHub Pages API docs
- [ ] Link to review-artifacts/index.html is present
- [ ] Link to Chapter 6 specs folder is included
- [ ] All links are formatted as Markdown links
- [ ] No broken links (verify locally)
- [ ] Changes committed to branch

## Related Links
- Spec: specs/025-chapter-6-day-0/spec.md (FR-002, FR-016)
- Quickstart: specs/025-chapter-6-day-0/quickstart.md (Task 1.2)
```

---

### T010: Create and push git tag chapter5-complete [US1]

**Use this as the issue body:**

```markdown
## Description
Create a git tag named `chapter5-complete` that marks the final commit of Chapter 5 API development. This tag will be visible in GitHub releases and create an audit trail.

## Problem Statement
Chapter 5 API development is complete, but there's no formal milestone marker in git history. Without a tag, it's difficult to track when this phase ended and reference the exact commit state for Chapter 6 baseline comparisons.

## Proposed Solution
1. Ensure on feature branch: `git checkout 025-chapter-6-day-0 && git pull origin 025-chapter-6-day-0`
2. Create annotated tag: `git tag -a chapter5-complete -m "Chapter 5 API Development Complete: FinishtoGreen baseline established. All API endpoints tested and documented. Ready for Chapter 6 frontend development."`
3. Push tag: `git push origin chapter5-complete`
4. Verify in GitHub: Settings → Releases should show chapter5-complete tag

## Acceptance Criteria
- [ ] Tag created on current HEAD
- [ ] Tag message is descriptive (min 20 chars)
- [ ] Tag is annotated (not lightweight)
- [ ] Tag pushed to origin successfully
- [ ] Tag visible in `git log --oneline --decorate`
- [ ] Tag appears in GitHub Releases page (within 30 seconds)
- [ ] `git describe --tags` returns chapter5-complete or later tag

## Related Links
- Spec: specs/025-chapter-6-day-0/spec.md (FR-004, FR-005)
- Quickstart: specs/025-chapter-6-day-0/quickstart.md (Task 1.3)
- Data Model: specs/025-chapter-6-day-0/data-model.md (Git Tag entity)
```

---

### T011: Verify branch protection rule [US1]

**Use this as the issue body:**

```markdown
## Description
Verify that the main branch protection rule is properly configured with all required status checks. This ensures no PRs can merge without passing security, testing, and specification checks.

## Problem Statement
Branch protection must be in place to prevent low-quality code from merging to main. This is foundational for Chapter 6 work. Verification ensures we have a baseline before adding new gates.

## Proposed Solution
1. Navigate to GitHub: Settings → Branches
2. Select "main" branch protection rule
3. Under "Require status checks to pass before merging":
   - Verify `spec-check` is listed and required
   - Verify `test-api` is listed and required
   - Verify `codeql` is listed and required
   - Verify `dependency-review` is listed and required
4. Verify additional settings:
   - "Require branches to be up to date before merging": YES
   - "Dismiss stale pull request approvals": YES
   - "Require 1 approval": YES
5. Take screenshot showing all 4 checks enabled
6. Document any missing checks for remediation

## Acceptance Criteria
- [ ] spec-check: Required ✅
- [ ] test-api: Required ✅
- [ ] codeql: Required ✅
- [ ] dependency-review: Required ✅
- [ ] PR approvals required: 1 or more
- [ ] Branches must be up to date: YES
- [ ] Stale approvals dismissed: YES
- [ ] Screenshot captured and attached to this issue

## Related Links
- Spec: specs/025-chapter-6-day-0/spec.md (FR-003)
- Quickstart: specs/025-chapter-6-day-0/quickstart.md (Task 1.4)
- Data Model: specs/025-chapter-6-day-0/data-model.md (Branch Protection Rule entity)
```

---

### T012: Update API coverage threshold to 70% [US2]

**Use this as the issue body:**

```markdown
## Description
Update or verify the API vitest configuration to enforce a 70% coverage threshold for lines, functions, and branches. This ensures API code maintains high quality and prevents regressions.

## Problem Statement
API code is critical business logic and must maintain strict quality standards. The current configuration may have lower or missing thresholds. Enforcing 70% coverage ensures all new code meets minimum quality bar.

## Proposed Solution
1. Review current `api/vitest.config.ts` threshold settings
2. Ensure configuration includes:
   ```typescript
   coverage: {
     thresholds: {
       statements: 70,
       functions: 70,
       branches: 70,
       lines: 70
     }
   }
   ```
3. Test locally: `npm test -- --coverage` from api/ directory
4. Verify that coverage below 70% causes test failure
5. Commit changes with message: "test: enforce 70% API coverage thresholds per Chapter 6 Day 0"

## Acceptance Criteria
- [ ] api/vitest.config.ts has statements threshold: 70%
- [ ] api/vitest.config.ts has functions threshold: 70%
- [ ] api/vitest.config.ts has branches threshold: 70%
- [ ] api/vitest.config.ts has lines threshold: 70%
- [ ] Local test run shows coverage calculated correctly
- [ ] Configuration is committed to branch
- [ ] Changes linked to this task

## Related Links
- Spec: specs/025-chapter-6-day-0/spec.md (FR-009)
- Quickstart: specs/025-chapter-6-day-0/quickstart.md (Task 2.3a)
- Data Model: specs/025-chapter-6-day-0/data-model.md (Test Coverage Configuration)
```

---

### T013: Update frontend coverage threshold to 55% [P] [US2]

**Use this as the issue body:**

```markdown
## Description
Update the frontend vitest configuration to increase coverage threshold from 40% to 55%. This reflects the increased complexity of Chapter 6 frontend work while remaining realistic for UI-heavy applications.

## Problem Statement
Current UI threshold is 40%. For Chapter 6 frontend development with stricter quality gates, we need to raise this to 55% to ensure UI components maintain reasonable test coverage without being overly burdensome.

## Proposed Solution
1. Open `frontend/vitest.config.js`
2. Locate the coverage.thresholds section
3. Update all threshold values from 40 to 55:
   ```javascript
   thresholds: {
     statements: 55,
     functions: 55,
     branches: 55,
     lines: 55
   }
   ```
4. Test locally: `npm test -- --coverage` from frontend/ directory
5. Verify that coverage below 55% causes test failure
6. Commit changes with message: "test: increase frontend coverage threshold to 55% for Chapter 6"

## Acceptance Criteria
- [ ] frontend/vitest.config.js has statements threshold: 55%
- [ ] frontend/vitest.config.js has functions threshold: 55% (if present)
- [ ] frontend/vitest.config.js has branches threshold: 55% (if present)
- [ ] frontend/vitest.config.js has lines threshold: 55%
- [ ] Local test run shows updated threshold
- [ ] Coverage below 55% fails tests (verified)
- [ ] Configuration is committed to branch

## Related Links
- Spec: specs/025-chapter-6-day-0/spec.md (FR-010)
- Quickstart: specs/025-chapter-6-day-0/quickstart.md (Task 2.3b)
- Data Model: specs/025-chapter-6-day-0/data-model.md (Test Coverage Configuration)
```

---

### T014: Implement run-ally-check.js [US2]

**Use this as the issue body:**

```markdown
## Description
Implement the ally-check accessibility scanning script that uses axe-core to scan frontend pages and identify accessibility violations.

## Problem Statement
T007 created a placeholder script. This task implements the actual accessibility scanning logic that integrates axe-core and generates a report for comparison against the baseline.

## Proposed Solution
1. Install dependencies if not already present:
   - @axe-core/playwright (already in ally-check.yml)
   - axe-html-reporter (for HTML reports)

2. Implement scan logic in run-ally-check.js:
   ```javascript
   const playwright = require('@axe-core/playwright');
   const { chromium } = require('playwright');
   const fs = require('fs');
   
   (async () => {
     const browser = await chromium.launch();
     const page = await browser.newPage();
     
     const pagesToScan = ['/', '/about'];
     const results = [];
     
     for (const pageUrl of pagesToScan) {
       const violations = await playwright(page, `http://localhost:3000${pageUrl}`);
       results.push({ page: pageUrl, violations });
     }
     
     fs.writeFileSync('.github/accessibility/scan-results.json', JSON.stringify(results, null, 2));
     await browser.close();
   })();
   ```

3. Script should:
   - Launch headless browser
   - Scan configured pages
   - Save results to .github/accessibility/scan-results.json
   - Exit with code 0 (always pass; comparison done separately)

4. Test locally or in CI workflow

## Acceptance Criteria
- [ ] Script exists and is valid JavaScript
- [ ] Uses @axe-core/playwright for scanning
- [ ] Scans all configured pages
- [ ] Generates JSON report
- [ ] Exits cleanly (code 0)
- [ ] Can be run in CI environment

## Related Links
- Spec: specs/025-chapter-6-day-0/spec.md (FR-007)
- Research: specs/025-chapter-6-day-0/research.md (Ally-Check Integration section)
```

---

### T015: Implement compare-ally-baseline.js [US2]

**Use this as the issue body:**

```markdown
## Description
Implement the baseline comparison logic that compares new accessibility scan results against the established baseline and fails only if NEW violations are detected.

## Problem Statement
The ally-check job needs to compare scan results from run-ally-check.js against the known baseline violations. Only NEW violations should trigger CI failure, allowing existing issues to be tracked separately.

## Proposed Solution
1. Load baseline from .github/accessibility/ally-check-baseline.json
2. Load scan results from .github/accessibility/scan-results.json
3. Compare violations:
   - Extract violation IDs from baseline (known violations)
   - Extract violation IDs from scan results (current violations)
   - Identify NEW violations: current - known
4. Output results:
   - If NEW violations found: fail with count and details (exit 1)
   - If no NEW violations: pass (exit 0)
5. Generate summary comment for PR if possible

Example logic:
```javascript
const baseline = JSON.parse(fs.readFileSync('.github/accessibility/ally-check-baseline.json'));
const results = JSON.parse(fs.readFileSync('.github/accessibility/scan-results.json'));

const knownViolationIds = baseline.violations.map(v => v.id);
const currentViolationIds = results.flatMap(r => r.violations.map(v => v.id));
const newViolations = currentViolationIds.filter(id => !knownViolationIds.includes(id));

if (newViolations.length > 0) {
  console.error(`❌ Found ${newViolations.length} NEW accessibility violations`);
  process.exit(1);
} else {
  console.log('✅ No NEW accessibility violations detected');
  process.exit(0);
}
```

## Acceptance Criteria
- [ ] Script loads baseline correctly
- [ ] Script loads scan results correctly
- [ ] Compares violation IDs accurately
- [ ] Fails (exit 1) when NEW violations found
- [ ] Passes (exit 0) when only known violations present
- [ ] Generates readable output for CI logs
- [ ] Can optionally comment on PR with summary

## Related Links
- Spec: specs/025-chapter-6-day-0/spec.md (FR-007a, FR-007b)
- Research: specs/025-chapter-6-day-0/research.md (Ally-Check Baseline Strategy)
- Data Model: specs/025-chapter-6-day-0/data-model.md (Accessibility Baseline entity)
```

---

### T016: Add ally-check to branch protection [P] [US2]

**Use this as the issue body:**

```markdown
## Description
Add the new ally-check job as a required status check on the main branch. This ensures no PRs can merge to main if they introduce NEW accessibility violations.

## Problem Statement
The ally-check workflow has been created, but it's not yet a required check. Without making it required, developers can merge PRs that introduce accessibility regressions.

## Proposed Solution
1. Navigate to GitHub: Settings → Branches
2. Click on "main" branch protection rule
3. Find "Require status checks to pass before merging" section
4. Search for and add: "ally-check"
5. The full path should be: "ally-check / Automated Accessibility Checks" (or similar)
6. Ensure these settings are also checked:
   - "Require branches to be up to date before merging": YES
   - "Dismiss stale pull request approvals": YES
7. Click Save
8. Verify by navigating to a draft PR and confirming ally-check appears in status checks

## Acceptance Criteria
- [ ] ally-check appears in required status checks list
- [ ] Branch protection rule is saved
- [ ] ally-check is marked as "required" (not optional)
- [ ] Test PR shows ally-check in status checks
- [ ] ally-check status must pass before PR can be merged
- [ ] Screenshot attached showing updated branch protection rule

## Related Links
- Spec: specs/025-chapter-6-day-0/spec.md (FR-008)
- Quickstart: specs/025-chapter-6-day-0/quickstart.md (Task 2.6)
- Data Model: specs/025-chapter-6-day-0/data-model.md (Branch Protection Rule entity)
```

---

### T017: Update Review Packet with Projects evidence [P] [US3]

**Use this as the issue body:**

```markdown
## Description
Update the Review Packet (review-artifacts/index.html) to include:
1. A "Projects Evidence" section showing the GitHub Projects board configuration
2. A "Chapter 6 UI Assets" placeholder section for future UI reports

This extends the Review Packet artifact to document project infrastructure and reserve space for Chapter 6 deliverables.

## Problem Statement
The Review Packet currently focuses on coverage and test results. It lacks visibility into project management infrastructure (GitHub Projects) and has no reserved space for upcoming UI reports (coverage, E2E, Lighthouse).

## Proposed Solution
1. Identify the Review Packet build script or template (likely in .github/scripts or a workflow)
2. Add new section after "Test Results" section:
   ```html
   <section id="projects-evidence">
     <h2>Projects Evidence</h2>
     <p>The Training Prince GitHub Projects board tracks all work items with:</p>
     <ul>
       <li><strong>Status</strong>: Not Started → In Progress → In Review → Done</li>
       <li><strong>Priority</strong>: P0 (Critical), P1 (High), P2 (Medium), P3 (Low)</li>
       <li><strong>Size</strong>: S, M, L, XL</li>
       <li><strong>Spec URL</strong>: Link to specification</li>
       <li><strong>Sprint/Chapter</strong>: Chapter 5, Chapter 6, etc.</li>
     </ul>
     <p><a href="https://github.com/orgs/Maximus-Technologies-Uganda/projects/X">View Training Prince Project Board</a></p>
   </section>
   ```

3. Add new section for Chapter 6 placeholder:
   ```html
   <section id="chapter-6-ui-assets">
     <h2>Chapter 6 UI Assets (Placeholder)</h2>
     <p>Reserved for Chapter 6 frontend deliverables:</p>
     <ul>
       <li>UI Coverage Report (Coming in PR 026)</li>
       <li>Playwright E2E Report (Coming in PR 027)</li>
       <li>Lighthouse Performance Report (Coming in PR 028)</li>
     </ul>
   </section>
   ```

4. Regenerate Review Packet via CI or manually
5. Verify both sections render correctly in browser

## Acceptance Criteria
- [ ] "Projects Evidence" section exists in index.html
- [ ] Section includes link to GitHub Projects board
- [ ] Section describes all 5 required fields
- [ ] "Chapter 6 UI Assets" placeholder section exists
- [ ] Placeholder lists UI Coverage, E2E, Lighthouse as coming soon
- [ ] HTML is valid and renders correctly
- [ ] Links are not broken
- [ ] Changes committed to branch

## Related Links
- Spec: specs/025-chapter-6-day-0/spec.md (FR-012, FR-013)
- Quickstart: specs/025-chapter-6-day-0/quickstart.md (Task 2.4)
- Data Model: specs/025-chapter-6-day-0/data-model.md (Review Packet entity)
```

---

### T018: Verify GitHub Projects has all 5 required fields [P] [US3]

**Use this as the issue body:**

```markdown
## Description
Verify that the Training Prince GitHub Projects board (v2) has all 5 required custom fields configured and visible on all items.

## Problem Statement
GitHub Projects may not have all fields configured or may have them in wrong state. This verification ensures the project tracking infrastructure is complete before Day 1.

## Proposed Solution
1. Navigate to GitHub Projects: Training Prince board
2. Click "Settings" (gear icon)
3. Navigate to "Custom fields" section
4. Verify these 5 fields exist and are configured:

   **Field 1: Status**
   - Type: Single select
   - Options: "Not Started", "In Progress", "In Review", "Done"
   - Required: Yes

   **Field 2: Priority**
   - Type: Single select
   - Options: "P0", "P1", "P2", "P3"
   - Required: Yes

   **Field 3: Size**
   - Type: Single select
   - Options: "S", "M", "L", "XL"
   - Required: Yes

   **Field 4: Spec URL**
   - Type: Text
   - Description: Link to specification or Linear issue
   - Required: Yes

   **Field 5: Sprint/Chapter**
   - Type: Single select
   - Options: "Chapter 5", "Chapter 6", "Sprint 1", "Sprint 2", etc.
   - Required: Yes

5. For each field:
   - Verify it appears in the board view when creating/editing items
   - Check that field values are populated correctly on sample items
   - Confirm field is visible in table/card views

6. Create test item:
   - Add new issue to project
   - Fill all 5 fields with sample values
   - Verify fields persist and display correctly
   - Delete test item

## Acceptance Criteria
- [ ] Status field configured with 4 options (Not Started, In Progress, In Review, Done)
- [ ] Priority field configured with 4 options (P0, P1, P2, P3)
- [ ] Size field configured with 4 options (S, M, L, XL)
- [ ] Spec URL field is text type
- [ ] Sprint/Chapter field has Chapter 5 and Chapter 6 options
- [ ] All 5 fields visible in project board
- [ ] Test item created and values populated successfully
- [ ] Screenshot attached showing board with all fields

## Related Links
- Spec: specs/025-chapter-6-day-0/spec.md (FR-014)
- Quickstart: specs/025-chapter-6-day-0/quickstart.md (Task 2.5)
- Data Model: specs/025-chapter-6-day-0/data-model.md (GitHub Project entity)
```

---

### T019: Test GitHub Projects automations [P] [US3]

**Use this as the issue body:**

```markdown
## Description
Test that GitHub Projects automations are working correctly:
1. Auto-add: New issues/PRs should automatically be added to Training Prince project
2. PR-to-Done: When a PR is merged, linked items should move to "Done" status

## Problem Statement
Automations reduce manual overhead but can fail silently. Testing ensures they work before Day 1 when many issues will be created.

## Proposed Solution

### Test 1: Auto-Add Automation
1. Create a new test issue on this branch:
   - Title: "Test: Projects Auto-Add - DELETE ME"
   - Add label: "test"
   - Description: "This is a test issue to verify auto-add automation"
2. Note the issue number (e.g., #123)
3. Wait 1-2 minutes
4. Navigate to Training Prince project board
5. Verify the test issue appears on the board automatically
6. Fill in all 5 custom fields (Status, Priority, Size, Spec URL, Sprint/Chapter)
7. Verify fields persist

### Test 2: PR-to-Done Automation
1. In the same PR (or create a new one), add to PR description: "Closes #123"
2. Commit change: `git commit --allow-empty -m "test: trigger PR-to-Done automation"`
3. Push to origin
4. Create PR with this commit
5. Once PR is merged, navigate to Projects board
6. Verify the test issue has moved to "Done" status
7. Note the automation moved it automatically

### Cleanup
1. Delete test issue #123
2. Verify it no longer appears on project board

## Acceptance Criteria
- [ ] Test issue created (issue #XYZ recorded)
- [ ] Issue appears on board within 2 minutes (auto-add working)
- [ ] All 5 fields can be populated on test item
- [ ] PR created with "Closes #XYZ" in description
- [ ] After PR merge, issue moves to "Done" (PR-to-Done working)
- [ ] Both automations verified and working
- [ ] Test issue deleted
- [ ] Test PR merged or closed
- [ ] Screenshot attached showing issue on board and in Done status

## Related Links
- Spec: specs/025-chapter-6-day-0/spec.md (FR-015)
- Quickstart: specs/025-chapter-6-day-0/quickstart.md (Task 2.5)
- Data Model: specs/025-chapter-6-day-0/data-model.md (GitHub Project entity, Automations section)
```

---

### T020: Create comprehensive test PR

**Use this as the issue body:**

```markdown
## Description
Create a PR from 025-chapter-6-day-0 to main that triggers all CI checks (spec-check, test-api, codeql, dependency-review, ally-check).

## Problem Statement
Before finalizing the implementation, we need to verify that all CI checks pass and work correctly. A comprehensive test PR validates the entire system.

## Proposed Solution
1. Ensure all implementation tasks (T001-T019) are complete and committed
2. Push feature branch: `git push origin 025-chapter-6-day-0`
3. Create PR on GitHub:
   - Title: "chore: Chapter 6 Day 0 setup - FinishtoGreen & CI Tightening"
   - Base: main
   - Compare: 025-chapter-6-day-0
4. In PR description, include:
   - Link to spec: specs/025-chapter-6-day-0/spec.md
   - Checklist of all 19 tasks completed
   - Reference to all 5 user stories
5. Submit PR
6. Monitor all status checks until they complete
7. Note any failures for remediation

## Acceptance Criteria
- [ ] PR created from 025-chapter-6-day-0 to main
- [ ] PR title is clear and follows convention
- [ ] PR description includes task checklist
- [ ] All 5 status checks appear in PR:
   - spec-check
   - test-api
   - codeql
   - dependency-review
   - ally-check
- [ ] PR can be opened for review
- [ ] No merge conflicts exist

## Related Links
- Spec: specs/025-chapter-6-day-0/spec.md
- Quickstart: specs/025-chapter-6-day-0/quickstart.md (Task 3.1)
```

---

### T021: Verify Review Packet artifact

**Use this as the issue body:**

```markdown
## Description
Download review-packet artifact from test PR and verify all sections render correctly. This confirms the artifact generation and all documentation is accessible.

## Problem Statement
The Review Packet is critical for communicating project status. If it fails to generate or has broken sections, stakeholders can't access essential documentation.

## Proposed Solution
1. Navigate to test PR (T020)
2. Look for "Artifacts" section in PR or Actions
3. Download review-packet artifact
4. Extract and open review-artifacts/index.html in browser
5. Verify all sections load and render:
   - Coverage Report
   - Test Results
   - API Documentation links
   - Projects Evidence (new section from T017)
   - Chapter 6 UI Assets placeholder (new section from T017)
6. Test all links:
   - GitHub Pages API docs link works
   - GitHub Projects link works
   - Internal links work
7. Verify no broken images or styling issues
8. Document any issues found

## Acceptance Criteria
- [ ] Artifact downloads successfully
- [ ] index.html opens in browser
- [ ] Coverage Report section renders
- [ ] Test Results section renders
- [ ] API Documentation section renders
- [ ] Projects Evidence section renders (new)
- [ ] Chapter 6 UI Assets section renders (new)
- [ ] All external links are functional
- [ ] No broken images or styling
- [ ] Screenshot attached showing full page

## Related Links
- Spec: specs/025-chapter-6-day-0/spec.md (FR-012, FR-013)
- Quickstart: specs/025-chapter-6-day-0/quickstart.md (Task 3.2)
```

---

### T022: Verify coverage threshold enforcement

**Use this as the issue body:**

```markdown
## Description
Create a minimal test to verify coverage thresholds block PRs when coverage is too low. This confirms the quality gates are enforced.

## Problem Statement
Coverage thresholds are only effective if they actually block PRs. We need to test that thresholds work as intended.

## Proposed Solution
1. Create temporary test branch: `git checkout -b test-coverage-enforcement`
2. Create a simple test file with intentionally low coverage
3. Commit changes: `git commit -m "test: verify coverage threshold enforcement"`
4. Push to origin: `git push origin test-coverage-enforcement`
5. Create PR to main
6. Watch for test-api status check to fail due to low coverage
7. Note the failure demonstrates thresholds are enforced
8. Close the PR without merging
9. Delete the test branch: `git branch -D test-coverage-enforcement && git push origin --delete test-coverage-enforcement`

## Acceptance Criteria
- [ ] Test branch created successfully
- [ ] Low-coverage test files added
- [ ] PR created to main
- [ ] test-api check fails due to coverage below threshold
- [ ] Failure message clearly indicates coverage issue
- [ ] Demonstrates thresholds are enforced (not ignored)
- [ ] Test branch deleted

## Related Links
- Spec: specs/025-chapter-6-day-0/spec.md (FR-009, FR-010)
- Quickstart: specs/025-chapter-6-day-0/quickstart.md (Task 3.3)
```

---

### T023: Merge PR and verify chapter5-complete tag

**Use this as the issue body:**

```markdown
## Description
After all checks pass on test PR (T020), merge it to main and verify that chapter5-complete tag is visible in GitHub releases.

## Problem Statement
The final step is to merge all implementation work to main and confirm the Chapter 5 closure milestone is visible to stakeholders.

## Proposed Solution
1. Verify all status checks on test PR are passing:
   - spec-check: ✅
   - test-api: ✅
   - codeql: ✅
   - dependency-review: ✅
   - ally-check: ✅
2. Click "Merge pull request" button
3. Select "Squash and merge" or "Create a merge commit" (per team preference)
4. In commit message, include: "Closes #[parent issue]"
5. Confirm merge
6. Navigate to GitHub: Releases
7. Verify chapter5-complete tag appears at top of releases list
8. Tag should be visible within 30 seconds of merge
9. Click on tag to confirm it has:
   - Correct date (today)
   - Correct commit hash (from T010)
   - Release notes (if applicable)
10. Confirm Repository ready for Chapter 6 Day 1

## Acceptance Criteria
- [ ] All 5 status checks passing before merge
- [ ] PR merged to main successfully
- [ ] Merge commit includes parent issue reference
- [ ] chapter5-complete tag visible in releases
- [ ] Tag appears within 30 seconds of merge
- [ ] Tag has correct metadata (date, commit hash)
- [ ] No additional commits needed after merge
- [ ] Main branch is clean: `git status` shows "Your branch is up to date"
- [ ] Screenshot showing tag in releases attached

## Related Links
- Spec: specs/025-chapter-6-day-0/spec.md (FR-004, FR-005)
- Quickstart: specs/025-chapter-6-day-0/quickstart.md (Task 3.3)
- Git Tag: Pushed in task T010
```

---

## How to Use This Document

1. **Copy the parent issue body** above (starting from "Overview" to end of summary)
2. **Paste into your GitHub parent issue description** under the parent issue "chore(repo): Chapter 6 Day 0 - FinishtoGreen & CI Tightening"

3. **For each sub-issue (T001-T023)**:
   - Create a new GitHub issue
   - **Title**: Use the task title exactly as shown (e.g., "T001 Verify git branch and main branch accessibility")
   - **Body**: Copy the "Use this as the issue body:" markdown block
   - **Labels**: Add "chore(repo)" + relevant story label ([US1], [US2], or [US3])
   - **Assign**: To appropriate team member
   - **Link to parent**: In the parent issue checklist, add a link to each sub-issue

All descriptions are formatted and ready to paste—no additional editing needed!

---

**Generated**: 18 November 2025  
**Status**: Ready for GitHub Issue Creation  
**Total Sub-Issues**: 23 (all with complete descriptions)
