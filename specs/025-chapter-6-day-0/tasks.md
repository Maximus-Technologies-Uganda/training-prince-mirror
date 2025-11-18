# Tasks: Chapter 6 Day 0 - FinishtoGreen & CI Tightening

**Branch**: `025-chapter-6-day-0` | **Date**: 18 November 2025  
**Spec**: [specs/025-chapter-6-day-0/spec.md](./spec.md) | **Plan**: [specs/025-chapter-6-day-0/plan.md](./plan.md)

---

## Overview

This document contains all tasks needed to implement Chapter 6 Day 0 setup. Tasks are organized by priority (P1, P2) with dependencies shown. Total estimated time: **3-4 hours** across three parallelizable workstreams.

### Task Statistics

- **Total Tasks**: 13 main tasks + 3 preparation tasks = 16 tasks
- **User Story 1 (P1) - FinishtoGreen**: 4 tasks (1-1.5h)
- **User Story 2 (P1) - CI Tightening**: 6 tasks (1.5-2h)  
- **User Story 3 (P2) - Review Packet & Project**: 3 tasks (30min)
- **Parallelizable**: 8 tasks can run independently across workstreams
- **MVP Scope**: Complete User Story 1 + 2 (US3 can follow in second pass)

---

## Phase 1: Setup & Prerequisites

**Objective**: Prepare repository state for main work

- [ ] T001 Verify git branch is `025-chapter-6-day-0` and main branch is accessible
  - **Description**: Check current branch, verify main is clean, no uncommitted changes
  - **File Paths**: N/A (verification only)
  - **Acceptance**: `git status` shows clean working directory; `git branch` shows current branch

- [ ] T002 Ensure all design documents are loaded (spec.md, plan.md, research.md, data-model.md, quickstart.md)
  - **Description**: Verify Phase 1 planning artifacts are complete and accessible
  - **File Paths**: 
    - `specs/025-chapter-6-day-0/spec.md`
    - `specs/025-chapter-6-day-0/plan.md`
    - `specs/025-chapter-6-day-0/research.md`
    - `specs/025-chapter-6-day-0/data-model.md`
    - `specs/025-chapter-6-day-0/quickstart.md`
  - **Acceptance**: All files readable; no NEEDS CLARIFICATION items remain; constitution check passed

- [ ] T003 Update .github/copilot-instructions.md with Chapter 6 technologies (if not already done)
  - **Description**: Sync agent context with @axe-core/playwright, ally-check, GitHub Projects APIs
  - **File Path**: `.github/copilot-instructions.md`
  - **Acceptance**: Active Technologies section includes "025-chapter-6-day-0" entry; Recent Changes updated

---

## Phase 2: Foundational Infrastructure

**Objective**: Set up CI/CD configuration that blocks subsequent work

- [ ] T004 Create SECURITY.md in repository root with responsible disclosure policy
  - **Description**: Add vulnerability reporting guidelines, contact information, and supported versions
  - **File Path**: `SECURITY.md` (repository root)
  - **Acceptance**: File exists; contains Security Policy section, Reporting section, Supported Versions table
  - **Blocking**: None (can be done anytime before merge)

- [ ] T005 Create .github/workflows/ally-check.yml GitHub Actions workflow
  - **Description**: Define ally-check job for accessibility scanning with baseline comparison
  - **File Path**: `.github/workflows/ally-check.yml`
  - **Template**:
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
    ```
  - **Acceptance**: Workflow syntax valid; triggers on PRs to main; uploads accessibility report artifact

- [ ] T006 Create .github/accessibility/ally-check-baseline.json with initial baseline
  - **Description**: Establish Day 0 baseline of known accessibility violations (initially empty or pre-scanned)
  - **File Path**: `.github/accessibility/ally-check-baseline.json`
  - **Template**:
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
  - **Acceptance**: File is valid JSON; baseline_date set to today; violations array populated or empty per Day 0 scan

- [ ] T007 Create placeholder scripts: .github/scripts/run-ally-check.js and compare-ally-baseline.js
  - **Description**: Scaffold accessibility scanning and baseline comparison (implement in Day 1)
  - **File Paths**:
    - `.github/scripts/run-ally-check.js`
    - `.github/scripts/compare-ally-baseline.js`
  - **Acceptance**: Files exist; are valid JavaScript; exit with code 0 (placeholder implementation)

---

## Phase 3: User Story 1 (P1) - FinishtoGreen: Chapter 5 API Work Complete

**Goal**: Formally close Chapter 5 API development and document completion

**User Story**: As a DevOps/Release manager, I need to clean up the main branch, document the Chapter 5 completion, and ensure all branch protections are properly configured so that Chapter 5 API development is formally closed and the repository is ready for Chapter 6 frontend work.

**Parallelizable**: Yes - Can run in parallel with US2 (different team members)

**Independent Test Criteria**:
1. Main branch has no extraneous files (verified via `git status`)
2. README.md contains links to Review Packet, API docs, Chapter 6 instructions
3. Branch protection rule on main includes all 4 required checks
4. chapter5-complete tag exists and is visible in GitHub releases

### Tasks

- [ ] T008 [P] [US1] Clean main branch: remove stray/debug files
  - **Description**: Identify and remove extraneous files (e.g., hello.js..js, temp test files, debug scripts) from main branch per FR-001
  - **File Paths**: 
    - Check: `git status` output (no untracked files)
    - Remove: Any stray debug/test files
  - **Sub-Issue Description**:
    ```markdown
    ## Description
    Remove any extraneous or stray files from the main branch that were created during 
    development but should not be part of the final Chapter 5 completion.
    
    ## Problem Statement
    Main branch may have debug files, temporary test files, or incomplete code that need 
    cleanup before formally closing Chapter 5. This prevents technical debt and ensures 
    a clean baseline.
    
    ## Proposed Solution
    1. Run `git status` to identify stray files
    2. Review each file to determine if it should be removed
    3. Remove files using `git rm`
    4. Commit with message: "chore: remove stray debug files from main branch"
    5. Push to origin main
    
    ## Acceptance Criteria
    - [ ] `git status` shows clean working directory
    - [ ] No hello.js..js or other debug files present
    - [ ] Commit is pushed to main
    - [ ] No uncommitted changes remain
    
    ## Related Links
    - Spec: specs/025-chapter-6-day-0/spec.md (FR-001)
    - Quickstart: specs/025-chapter-6-day-0/quickstart.md (Task 1.1)
    ```
  - **Acceptance**: `git status` is clean; no stray files remain

- [ ] T009 [P] [US1] Update README.md with links to Review Packet, API docs, and Chapter 6
  - **Description**: Add/update links in README.md referencing live API documentation on GitHub Pages, Review Packet artifact location, and Chapter 6 setup guide per FR-002 and FR-016
  - **File Path**: `README.md`
  - **Sub-Issue Description**:
    ```markdown
    ## Description
    Update the main README.md file to include links to:
    1. Live API documentation on GitHub Pages
    2. Review Packet artifact (review-artifacts/index.html)
    3. Chapter 6 Day 0 setup guide
    
    This allows stakeholders and contributors to quickly find essential documentation.
    
    ## Problem Statement
    README.md currently lacks direct links to published API docs and Review Packet. 
    Users must search or navigate GitHub to find these resources. This friction increases 
    onboarding time and reduces visibility into project status.
    
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
    - [ ] Changes committed to main branch
    
    ## Related Links
    - Spec: specs/025-chapter-6-day-0/spec.md (FR-002, FR-016)
    - Quickstart: specs/025-chapter-6-day-0/quickstart.md (Task 1.2)
    ```
  - **Acceptance**: README.md contains 3 new links; all links valid; file committed to main

- [ ] T010 [US1] Create and push git tag `chapter5-complete` marking final Chapter 5 commit
  - **Description**: Create annotated git tag on current main branch HEAD, push to origin, verify visibility in GitHub releases per FR-004 and FR-005
  - **File Path**: N/A (git tag operation)
  - **Sub-Issue Description**:
    ```markdown
    ## Description
    Create a git tag named `chapter5-complete` that marks the final commit of Chapter 5 API 
    development. This tag will be visible in GitHub releases and create an audit trail.
    
    ## Problem Statement
    Chapter 5 API development is complete, but there's no formal milestone marker in git history. 
    Without a tag, it's difficult to track when this phase ended and reference the exact commit 
    state for Chapter 6 baseline comparisons.
    
    ## Proposed Solution
    1. Ensure on main branch: `git checkout main && git pull origin main`
    2. Create annotated tag: `git tag -a chapter5-complete -m "Chapter 5 API Development Complete: FinishtoGreen baseline established. All API endpoints tested and documented. Ready for Chapter 6 frontend development."`
    3. Push tag: `git push origin chapter5-complete`
    4. Verify in GitHub: Settings → Releases should show chapter5-complete tag
    
    ## Acceptance Criteria
    - [ ] Tag created on current main HEAD
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
  - **Acceptance**: Tag created, pushed, and visible in `git log --decorate`; appears in GitHub releases within 30s

- [ ] T011 [US1] Verify branch protection rule on main requires all 4 existing status checks
  - **Description**: Confirm GitHub Settings → Branches → main has required status checks: spec-check, test-api, codeql, dependency-review (ally-check added in US2) per FR-003
  - **File Path**: N/A (GitHub Settings verification)
  - **Sub-Issue Description**:
    ```markdown
    ## Description
    Verify that the main branch protection rule is properly configured with all required 
    status checks. This ensures no PRs can merge without passing security, testing, and 
    specification checks.
    
    ## Problem Statement
    Branch protection must be in place to prevent low-quality code from merging to main. 
    This is foundational for Chapter 6 work. Verification ensures we have a baseline before 
    adding new gates.
    
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
  - **Acceptance**: Screenshot shows all 4 checks enabled; no changes needed (verification only)

---

## Phase 4: User Story 2 (P1) - CI Tightening: New Quality Gates

**Goal**: Establish coverage thresholds and accessibility scanning baseline

**User Story**: As a DevSecOps engineer, I need to add new CI/CD quality gates and coverage thresholds for Chapter 6 so that the frontend and API maintain consistent, measurable quality standards and accessibility compliance.

**Parallelizable**: Yes - Can run in parallel with US1 (different team members); some tasks can run in parallel within US2

**Independent Test Criteria**:
1. SECURITY.md exists and contains vulnerability policy
2. ally-check workflow runs on PRs and blocks merges on NEW violations
3. API coverage threshold set to 70% in vitest.config.ts
4. UI coverage threshold set to 55% in frontend/vitest.config.js
5. Coverage failures block PR merges (hard blocker)

### Tasks

- [ ] T012 [US2] Update API coverage threshold to 70% in api/vitest.config.ts
  - **Description**: Verify or update API coverage configuration to enforce ≥70% for lines, functions, branches per FR-009
  - **File Path**: `api/vitest.config.ts`
  - **Sub-Issue Description**:
    ```markdown
    ## Description
    Update or verify the API vitest configuration to enforce a 70% coverage threshold 
    for lines, functions, and branches. This ensures API code maintains high quality 
    and prevents regressions.
    
    ## Problem Statement
    API code is critical business logic and must maintain strict quality standards. 
    The current configuration may have lower or missing thresholds. Enforcing 70% 
    coverage ensures all new code meets minimum quality bar.
    
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
  - **Acceptance**: Thresholds set to 70% in config; verified via local test run

- [ ] T013 [P] [US2] Update frontend coverage threshold from 40% to 55% in frontend/vitest.config.js
  - **Description**: Update UI coverage configuration to enforce ≥55% for lines, functions, branches (increased from 40%) per FR-010
  - **File Path**: `frontend/vitest.config.js`
  - **Sub-Issue Description**:
    ```markdown
    ## Description
    Update the frontend vitest configuration to increase coverage threshold from 40% to 55%. 
    This reflects the increased complexity of Chapter 6 frontend work while remaining realistic 
    for UI-heavy applications.
    
    ## Problem Statement
    Current UI threshold is 40%. For Chapter 6 frontend development with stricter quality gates, 
    we need to raise this to 55% to ensure UI components maintain reasonable test coverage without 
    being overly burdensome.
    
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
  - **Acceptance**: Thresholds updated to 55%; verified via local test run

- [ ] T014 [US2] Implement .github/scripts/run-ally-check.js accessibility scanning logic
  - **Description**: Implement actual axe-core accessibility scanning using Playwright (placeholder script from T007)
  - **File Path**: `.github/scripts/run-ally-check.js`
  - **Sub-Issue Description**:
    ```markdown
    ## Description
    Implement the ally-check accessibility scanning script that uses axe-core to scan 
    frontend pages and identify accessibility violations.
    
    ## Problem Statement
    T007 created a placeholder script. This task implements the actual accessibility 
    scanning logic that integrates axe-core and generates a report for comparison 
    against the baseline.
    
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
  - **Acceptance**: Script implements axe-core scanning; generates JSON results; exits code 0

- [ ] T015 [US2] Implement .github/scripts/compare-ally-baseline.js baseline comparison logic
  - **Description**: Implement baseline comparison that identifies NEW violations not in ally-check-baseline.json
  - **File Path**: `.github/scripts/compare-ally-baseline.js`
  - **Sub-Issue Description**:
    ```markdown
    ## Description
    Implement the baseline comparison logic that compares new accessibility scan results 
    against the established baseline and fails only if NEW violations are detected.
    
    ## Problem Statement
    The ally-check job needs to compare scan results from run-ally-check.js against 
    the known baseline violations. Only NEW violations should trigger CI failure, 
    allowing existing issues to be tracked separately.
    
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
  - **Acceptance**: Script compares baseline vs. results; fails on NEW violations; passes otherwise

- [ ] T016 [P] [US2] Add ally-check to branch protection required status checks
  - **Description**: Update GitHub Settings → Branches → main to require ally-check as a status check per FR-008
  - **File Path**: N/A (GitHub Settings update)
  - **Sub-Issue Description**:
    ```markdown
    ## Description
    Add the new ally-check job as a required status check on the main branch. This ensures 
    no PRs can merge to main if they introduce NEW accessibility violations.
    
    ## Problem Statement
    The ally-check workflow has been created, but it's not yet a required check. Without 
    making it required, developers can merge PRs that introduce accessibility regressions.
    
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
  - **Acceptance**: ally-check added to required checks; screenshot confirms; cannot be bypassed

---

## Phase 5: User Story 3 (P2) - Review Packet & Project Hygiene

**Goal**: Update Review Packet and verify GitHub Projects configuration

**User Story**: As a project manager, I need to update the Review Packet to document Chapter 6 work, verify GitHub Projects configuration, and ensure all project automation and fields are correct so stakeholders can track progress.

**Parallelizable**: Yes - Can run in parallel with US1 and US2; tasks within US3 can run independently

**Independent Test Criteria**:
1. Review Packet index.html includes Projects evidence link/screenshot
2. Chapter 6 UI Assets placeholder section exists in Review Packet
3. GitHub Projects board has all 5 required fields visible
4. Project automations (auto-add, PR-to-Done) are tested and working

### Tasks

- [ ] T017 [P] [US3] Update Review Packet index.html to include Projects evidence section
  - **Description**: Add link or screenshot of GitHub Projects board to review-artifacts/index.html and create Chapter 6 UI Assets placeholder per FR-012 and FR-013
  - **File Path**: `review-artifacts/index.html` or build script that generates it
  - **Sub-Issue Description**:
    ```markdown
    ## Description
    Update the Review Packet (review-artifacts/index.html) to include:
    1. A "Projects Evidence" section showing the GitHub Projects board configuration
    2. A "Chapter 6 UI Assets" placeholder section for future UI reports
    
    This extends the Review Packet artifact to document project infrastructure and 
    reserve space for Chapter 6 deliverables.
    
    ## Problem Statement
    The Review Packet currently focuses on coverage and test results. It lacks visibility 
    into project management infrastructure (GitHub Projects) and has no reserved space for 
    upcoming UI reports (coverage, E2E, Lighthouse).
    
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
         <!-- Optional: screenshot URL -->
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
  - **Acceptance**: index.html contains both sections; renders correctly; links functional

- [ ] T018 [P] [US3] Verify GitHub Projects "Training Prince" board has all 5 required fields
  - **Description**: Confirm GitHub Projects board is configured with Status, Priority, Size, Spec URL, Sprint/Chapter fields per FR-014
  - **File Path**: N/A (GitHub Projects verification)
  - **Sub-Issue Description**:
    ```markdown
    ## Description
    Verify that the Training Prince GitHub Projects board (v2) has all 5 required custom fields 
    configured and visible on all items.
    
    ## Problem Statement
    GitHub Projects may not have all fields configured or may have them in wrong state. 
    This verification ensures the project tracking infrastructure is complete before Day 1.
    
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
  - **Acceptance**: All 5 fields present and visible; test item created successfully

- [ ] T019 [P] [US3] Test GitHub Projects automations: auto-add and PR-to-Done
  - **Description**: Create test issue and PR to verify automations function: auto-add (new issues added to project) and PR-to-Done (PRs move items to Done) per FR-015
  - **File Path**: N/A (GitHub Projects automations testing)
  - **Sub-Issue Description**:
    ```markdown
    ## Description
    Test that GitHub Projects automations are working correctly:
    1. Auto-add: New issues/PRs should automatically be added to Training Prince project
    2. PR-to-Done: When a PR is merged, linked items should move to "Done" status
    
    ## Problem Statement
    Automations reduce manual overhead but can fail silently. Testing ensures they work 
    before Day 1 when many issues will be created.
    
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
  - **Acceptance**: Both automations tested; test issue appears on board and moves to Done when PR merged

---

## Phase 6: Validation & Integration

**Objective**: Verify all tasks complete and system ready for merge

- [ ] T020 Create comprehensive test PR on 025-chapter-6-day-0 branch
  - **Description**: Create PR from 025-chapter-6-day-0 to main that triggers all CI checks (spec-check, test-api, codeql, dependency-review, ally-check)
  - **File Path**: N/A (PR creation)
  - **Acceptance**: PR created; all status checks appear; can be used to validate implementation

- [ ] T021 Verify Review Packet artifact generates correctly
  - **Description**: Download review-packet artifact from test PR and verify all sections render (Coverage, Test Results, API Docs link, Projects Evidence, Chapter 6 UI Assets placeholder)
  - **File Path**: `review-artifacts/index.html`
  - **Acceptance**: Artifact downloads; all sections render; links not broken

- [ ] T022 Verify coverage threshold enforcement blocks low-coverage PRs
  - **Description**: Create minimal test branch with intentionally low coverage to verify thresholds block PR (then discard branch)
  - **File Path**: Test branch only
  - **Acceptance**: CI fails with coverage error; demonstrates thresholds are enforced

- [ ] T023 Merge PR to main and confirm chapter5-complete tag visible
  - **Description**: After all checks pass, merge test PR to main and verify chapter5-complete tag is visible in GitHub releases
  - **File Path**: N/A (merge confirmation)
  - **Acceptance**: PR merged; tag visible in releases; no rebase needed

---

## Dependencies & Execution Order

### Critical Path (Must Complete in Order)
```
T001 (setup) 
  → T002 (setup) 
  → T003 (setup)
  → T004/T005/T006/T007 (foundational - can run parallel)
  → T008-T011 (US1) 
  → T012-T016 (US2)
  → T017-T019 (US3)
  → T020-T023 (validation)
```

### Parallelizable Tasks
- **T008-T011 (US1 FinishtoGreen)**: Can run in parallel with US2
- **T012-T016 (US2 CI Tightening)**: Can run in parallel with US1
- **T017-T019 (US3 Project Hygiene)**: Can run in parallel with US1 and US2
- **Within US2**: T012-T013 (config updates) can run in parallel; T014-T015 (implementation) depends on T005-T007

### Workstream Assignment
- **DevOps Lead**: T008-T011 (US1)
- **DevSecOps**: T012-T016 (US2)
- **Project Manager**: T017-T019 (US3)
- **Cross-functional**: T001-T003, T020-T023

---

## Execution Strategy

### MVP Scope (First Pass)
Complete User Stories 1 & 2:
- Tasks T001-T003 (Setup): 15 min
- Tasks T004-T007 (Foundational): 30 min
- Tasks T008-T011 (US1 - FinishtoGreen): 1-1.5 hours
- Tasks T012-T016 (US2 - CI Tightening): 1.5-2 hours
- Tasks T020-T023 (Validation): 30 min
- **Total for MVP**: 3-4 hours

### Full Scope (Second Pass)
Add User Story 3:
- Tasks T017-T019 (US3 - Projects): 30 min
- **Total additional**: 30 min

### Parallel Execution Example
**Team A (DevOps) - 2 hours**:
- T001-T003 (10 min)
- T004-T007 in parallel with Team B (10 min)
- T008-T011 (1.5-2 hours)
- T020 (create PR, 5 min)

**Team B (DevSecOps) - 2.5 hours**:
- T001-T003 (10 min)  
- T004-T007 in parallel with Team A (30 min)
- T012-T016 (1.5-2 hours)
- T021-T022 (validation, 30 min)

**Team C (PM) - 1 hour**:
- T017-T019 (45 min)
- T023 (merge confirmation, 15 min)

**Total Elapsed Time**: ~2.5-3 hours (parallel) vs. 4-5 hours (sequential)

---

## Success Criteria & Completion

### Chapter 5 FinishtoGreen (US1) - ✅ Complete
- [ ] T008: Main branch cleaned
- [ ] T009: README.md updated with links
- [ ] T010: chapter5-complete tag pushed
- [ ] T011: Branch protection verified
- **Status**: Ready when all 4 tasks done

### CI Tightening (US2) - ✅ Complete
- [ ] T004: SECURITY.md created
- [ ] T005: ally-check.yml workflow created
- [ ] T006: ally-check-baseline.json created
- [ ] T007: Placeholder scripts created
- [ ] T012: API coverage at 70%
- [ ] T013: Frontend coverage at 55%
- [ ] T014: run-ally-check.js implemented
- [ ] T015: compare-ally-baseline.js implemented
- [ ] T016: ally-check added to branch protection
- **Status**: Ready when all 9 tasks done

### Review Packet & Projects (US3) - ✅ Complete
- [ ] T017: Projects Evidence and UI Assets sections added to index.html
- [ ] T018: All 5 GitHub Projects fields verified
- [ ] T019: Auto-add and PR-to-Done automations tested
- **Status**: Ready when all 3 tasks done

### Validation (Final) - ✅ Complete
- [ ] T020: Test PR created
- [ ] T021: Review Packet artifact verified
- [ ] T022: Coverage thresholds tested
- [ ] T023: PR merged; chapter5-complete tag visible
- **Status**: READY FOR CHAPTER 6 DAY 1

---

## Appendix: Sub-Issue Descriptions for GitHub Issues

When creating GitHub issues from these tasks, use the sub-issue descriptions provided above in the **Sub-Issue Description** blocks. Each block contains markdown-formatted text that can be directly pasted into a GitHub issue's description field.

The descriptions follow this structure:
1. **## Description** - What needs to be done
2. **## Problem Statement** - Why it matters
3. **## Proposed Solution** - How to do it (with code examples where applicable)
4. **## Acceptance Criteria** - Checklist of completion criteria
5. **## Related Links** - Links to spec, quickstart, data model

Example usage:
- Create GitHub issue for T008
- Paste the T008 sub-issue description into the issue body
- Assignees can directly follow the "Proposed Solution" steps
- Use "Acceptance Criteria" as the issue's success checklist

---

**Tasks Generated**: 18 November 2025  
**Total Tasks**: 23 (3 setup + 7 foundational + 16 user story + 4 validation)  
**Estimated Time**: 3-4 hours (parallel execution recommended)  
**Status**: ✅ Ready for Implementation

---

**NEXT STEPS**:
1. Review task list for completeness
2. Create GitHub issues from Tasks T001-T023
3. Assign to team members per workstream
4. Track progress via GitHub Projects
5. Execute tasks in parallel per Execution Strategy
6. Merge PR when all validation tasks complete
