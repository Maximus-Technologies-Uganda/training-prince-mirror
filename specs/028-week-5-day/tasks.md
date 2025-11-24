# Implementation Tasks: Week 5 Day 3 - Docs, ReviewPacket, and Playwright Smoke

**Feature Branch**: `028-week-5-day`  
**Created**: 2025-11-11  
**Spec**: [./spec.md](./spec.md)  
**Plan**: [./plan.md](./plan.md)

---

## Overview

This feature delivers three integrated components:
1. **API Documentation** - Generate and publish interactive API docs via Redoc to GitHub Pages
2. **Review Packet Enhancement** - Link API documentation alongside coverage and test reports
3. **Playwright Smoke Test** - Validate Expense UI and API integration end-to-end

**Total Tasks**: 16  
**Estimated Duration**: 4-6 hours  
**MVP Scope**: US1 (Documentation) + US2 (Smoke Test)

---

## Task Dependencies & Execution Order

```
Phase 1: Setup (0 hrs)
├─ No dependencies

Phase 2: Foundational (1-2 hrs)
├─ Dependency: Phase 1 complete
├─ Blocks: All user stories
├─ Tasks: Validate environment, prepare CI workflows

Phase 3: US1 - API Documentation Generation (1 hr)
├─ Dependency: Phase 2 complete
├─ Independent: Can run in parallel with US2
├─ Tasks: Redoc setup, workflow creation, GitHub Pages verification

Phase 4: US2 - Playwright Smoke Test (2-3 hrs)
├─ Dependency: Phase 2 complete
├─ Independent: Can run in parallel with US1
├─ Tasks: Test file creation, assertions, CI integration

Phase 5: US3 - Review Packet Enhancement (1 hr)
├─ Dependency: US1 & US2 complete (needs docs and test artifacts)
├─ Tasks: HTML structure, link validation, integration

Phase 6: Polish & Validation (1 hr)
├─ Dependency: All user stories complete
├─ Tasks: End-to-end testing, CI verification, PR prep
```

**Parallel Execution Opportunity**:
- US1 (Documentation) and US2 (Smoke Test) can be implemented in parallel
- Both depend only on Phase 2 foundational tasks
- Combined execution time: 2-3 hours instead of sequential 3-4 hours

---

## Phase 1: Setup

### Phase Goal
Validate development environment and prepare repository for feature implementation.

### Independent Test Criteria
- ✅ All dependencies installed and verified
- ✅ Node.js version compatible (18+)
- ✅ Git branch 028-week-5-day exists and is active
- ✅ docs/openapi.yaml exists and is readable

### Tasks

- [X] T001 Verify Node.js installation: `node --version` should output v18+ in terminal
- [X] T002 Install dependencies: Run `npm install` in repo root and verify no errors
- [X] T003 Verify git branch: Confirm branch `028-week-5-day` exists via `git branch`

---

## Phase 2: Foundational (Blocking Prerequisites)

### Phase Goal
Prepare CI infrastructure and validate existing API/UI components for integration.

### Independent Test Criteria
- ✅ GitHub Pages enabled in repository settings
- ✅ .github/workflows/ directory exists with at least one existing workflow
- ✅ docs/openapi.yaml is valid OpenAPI 3.x specification
- ✅ frontend/tests/e2e/ directory exists (or can be created)
- ✅ frontend/src/ contains Expense UI component

### Tasks

- [X] T004 Enable GitHub Pages: Go to Settings → Pages, ensure "Deploy from a branch" or "GitHub Actions" is selected
- [X] T005 Validate OpenAPI spec: Run `npm install -g @redocly/redoc-cli` (optional) and verify docs/openapi.yaml passes validation
- [X] T006 Create e2e test directory: `mkdir -p frontend/tests/e2e` if not exists
- [X] T007 Verify Expense UI component: Confirm `frontend/src/` contains working Expense component with form and list display
- [X] T008 Install Playwright if missing: Run `npm install --save-dev @playwright/test` and verify installation

---

## Phase 3: US1 - API Documentation Generation & Publishing

### User Story Goal
As an API consumer, I need access to live, published API documentation generated from the OpenAPI specification, accessible via GitHub Pages.

**Acceptance Criteria**:
1. Redoc CLI installed as dev dependency
2. GitHub Actions workflow generates docs/api.html from docs/openapi.yaml on merge to main
3. Generated HTML is deployed to GitHub Pages at `https://org.github.io/repo/docs/api.html`
4. Documentation is accessible and renders without errors

### Independent Test Criteria
- ✅ `docs/api.html` exists after Redoc generation
- ✅ HTML file is > 50KB (self-contained with styles)
- ✅ Opening HTML in browser shows interactive Redoc documentation
- ✅ GitHub Pages deployment completes without errors
- ✅ Public URL is accessible (no 404)

### Tasks

- [X] T009 [US1] Install Redoc CLI: `npm install --save-dev @redocly/redoc-cli` and verify in package.json
- [X] T010 [US1] Test Redoc locally: Run `npx redoc-cli build -o docs/api.html docs/openapi.yaml` and verify docs/api.html generated
- [X] T011 [P] [US1] Create deploy-pages workflow: Create `.github/workflows/deploy-pages.yml` with Redoc generation step (reference quickstart.md for template)
- [X] T012 [US1] Configure GitHub Pages branch: Set repository to deploy from `gh-pages` branch or configure GitHub Actions as source
- [X] T013 [US1] Test workflow locally: Verify workflow syntax with `npm run lint` (or similar) on .github/workflows/deploy-pages.yml
- [X] T014 [US1] Document generation in CI: Merge changes to feature branch and verify workflow runs successfully in Actions tab
- [X] T015 [US1] Verify public accessibility: Test that `https://org.github.io/repo/docs/api.html` is accessible (may take 2-3 min after merge)

---

## Phase 4: US2 - Playwright Smoke Test (UI + API Integration)

### User Story Goal
As a developer, I need automated validation that the Expense UI and API are properly integrated, ensuring a user can create an expense and see it updated in the UI.

**Acceptance Criteria**:
1. Playwright smoke test file created at frontend/tests/e2e/smoke-expense-api.spec.js
2. Test loads Expense UI, creates expense via API, verifies UI updates
3. Test validates both API response (HTTP 201) and UI changes (new expense visible)
4. Test handles errors gracefully with clear failure messages
5. Test integrated into CI/CD as required status check

### Independent Test Criteria
- ✅ Test file exists and is syntactically valid JavaScript
- ✅ Test runs without errors: `npx playwright test frontend/tests/e2e/smoke-expense-api.spec.js`
- ✅ Test passes when API and UI working correctly
- ✅ Test fails with clear message when API unavailable or UI not updating
- ✅ GitHub Actions workflow includes smoke test job

### Tasks

- [X] T016 [P] [US2] Create smoke test file: Create `frontend/tests/e2e/smoke-expense-api.spec.js` using template from quickstart.md
- [X] T017 [US2] Implement test setup: Add `test.beforeEach()` to navigate to /expenses and wait for page load
- [X] T018 [US2] Implement create expense test: Add test that fills form, submits, waits for API response (201), and asserts UI updates (reference quickstart.md for `page.waitForResponse()` pattern)
- [X] T019 [US2] Add API response assertions: Verify response status 201, response includes id/amount/description fields
- [X] T020 [US2] Add UI update assertions: Verify new expense visible in list, amount displayed correctly, total updated
- [X] T021 [US2] Implement error handling test: Add test for invalid input (negative amount), verify 400 response and error message shown to user
- [X] T022 [P] [US2] Test locally: Run `npm run dev` in one terminal, `npx playwright test --headed frontend/tests/e2e/smoke-expense-api.spec.js` in another and verify tests pass
- [X] T023 [US2] Create playwright-smoke workflow: Create `.github/workflows/playwright-smoke.yml` with smoke test execution (reference quickstart.md)
- [X] T024 [US2] Configure as required check: Update repository branch protection rules to require Playwright Smoke workflow to pass before merge
- [X] T025 [US2] Verify workflow execution: Push test changes to feature branch and verify playwright-smoke workflow runs in Actions tab

---

## Phase 5: US3 - Review Packet Enhancement

### User Story Goal
As a reviewer, I need a centralized review packet that links to coverage reports, Playwright test results, AND API documentation in one accessible location.

**Acceptance Criteria**:
1. review-artifacts/index.html includes three sections: Coverage, Playwright Reports, API Documentation
2. API documentation link points to live GitHub Pages docs/api.html
3. All links are validated during build process
4. Review packet build fails if any link is broken
5. Review packet is easily accessible during code review

### Independent Test Criteria
- ✅ review-artifacts/index.html exists with proper HTML structure
- ✅ File includes three distinct sections with links
- ✅ API documentation link uses relative or absolute URL to docs/api.html
- ✅ Link validation script exists and passes: `./scripts/validate-review-packet-links.sh`
- ✅ Review packet build includes validation step

### Tasks

- [X] T026 [US3] Create/update review-artifacts/index.html: Copy template from quickstart.md, create HTML file with three sections (Coverage, Playwright, API Docs)
- [X] T027 [US3] Add API documentation link: Insert link to `./docs/api.html` with text "API Specification (Redoc)" in documentation section
- [X] T028 [US3] Create link validation script: Create `scripts/validate-review-packet-links.sh` to check all artifact files exist (reference quickstart.md)
- [X] T029 [US3] Make validation script executable: `chmod +x scripts/validate-review-packet-links.sh`
- [X] T030 [US3] Test validation locally: Run `./scripts/validate-review-packet-links.sh` and verify it passes when artifacts exist
- [X] T031 [P] [US3] Update build-review-packet workflow: Add validation step to `.github/workflows/build-review-packet.yml` to run link validation before publishing

---

## Phase 6: Polish & Cross-Cutting Concerns

### Phase Goal
Verify complete end-to-end functionality, clean up code, and prepare for merge.

### Independent Test Criteria
- ✅ All workflows execute successfully on PR
- ✅ Documentation is live and accessible
- ✅ Smoke test passes consistently
- ✅ Review packet builds without errors
- ✅ No lint or type errors in added code
- ✅ PR description complete with all artifacts linked

### Tasks

- [X] T032 Run full local test suite: Execute `npm test && npm run lint` to verify all checks pass locally
- [X] T033 Verify documentation live: Test that `https://org.github.io/repo/docs/api.html` is publicly accessible and renders correctly
- [X] T034 Test smoke test suite: Run `npx playwright test frontend/tests/e2e/smoke-expense-api.spec.js` and verify all tests pass
- [X] T035 Verify review packet: Open review-artifacts/index.html locally and verify all links functional
- [X] T036 Check all workflows pass: Push to feature branch and verify all GitHub Actions jobs complete successfully (spec-check, Test & Coverage, Playwright Smoke, Deploy Pages)
- [X] T037 Create PR with full description: Open PR to main branch with title `feat(api): Day 3 - Docs, ReviewPacket, and Playwright Smoke` and include links to spec, plan, and generated artifacts
- [X] T038 Add Definition of Done checklist to PR: Include all items from spec.md Definition of Done section as PR comment or template
- [X] T039 Request review: Assign reviewers and request code review on PR

---

## Implementation Strategy

### MVP Scope (Recommended Start)
Start with **Phase 1 + Phase 2 + Phase 3 (US1)** - this gives:
- ✅ API documentation generated and published (user-facing value)
- ✅ CI infrastructure updated for docs
- ✅ Time estimate: 2-3 hours
- ✅ Independently testable: Documentation accessible, no UI changes

### Incremental Delivery Path
1. **Week 5 Day 3 - Morning**: Complete Phase 1-3 (Documentation) → Merge
2. **Week 5 Day 3 - Afternoon**: Complete Phase 4 (Smoke Test) → Merge
3. **Week 5 Day 3 - Evening**: Complete Phase 5 (Review Packet) → Merge

### Parallel Execution (Recommended for Time-Boxed Delivery)
- **Person A**: Work on Phase 3 (US1 - Documentation)
- **Person B**: Work on Phase 4 (US2 - Smoke Test)
- **Combine**: Phase 5 (US3 - Review Packet) once both complete
- **Result**: 4 hours instead of 6 hours total

---

## Success Criteria (Definition of Done)

- [X] API documentation is live and accessible on GitHub Pages
- [X] review-artifacts/index.html includes all three required components (Coverage, Playwright, API Docs)
- [X] API documentation link in review packet is valid and functional
- [X] Playwright smoke test exists and passes consistently
- [X] Playwright smoke test validates both API response and UI update
- [X] All CI checks pass (spec-check, Test & Coverage, Playwright Smoke, Deploy Pages)
- [ ] GitHub Pages workflow successfully deploys on merge
- [ ] PR merged to main branch
- [ ] Feature branch deleted

---

## Testing Strategy

### Local Testing Checklist

```bash
# Phase 1-2: Setup & Foundational
node --version                    # v18+
npm install                       # No errors
git branch                        # 028-week-5-day active

# Phase 3: US1 - Documentation
npx redoc-cli build -o docs/api.html docs/openapi.yaml  # Success
file docs/api.html               # HTML document, readable
# Open docs/api.html in browser  # Renders correctly

# Phase 4: US2 - Smoke Test
npm run dev &                     # Start dev server
npx playwright test frontend/tests/e2e/smoke-expense-api.spec.js --headed  # All pass
# Verify test output shows:
#   ✓ Create expense and verify API integration
#   ✓ Handle API error gracefully

# Phase 5: US3 - Review Packet
./scripts/validate-review-packet-links.sh  # All links valid
cat review-artifacts/index.html  # Contains all 3 sections

# Phase 6: Polish & Validation
npm test && npm run lint         # All pass
# Visit: https://org.github.io/repo/docs/api.html  # Accessible
# Check Actions tab              # All workflows green
```

### CI Testing (GitHub Actions)

```yaml
# Expected workflow runs on PR:
1. spec-check                          # ✓ Pass
2. Test & Coverage - API              # ✓ Pass (no new API code)
3. Playwright Smoke                    # ✓ Pass
4. Deploy Pages (dry-run on PR)        # ✓ Pass

# Expected workflow runs on merge:
1. All above                           # ✓ Pass
2. Deploy to GitHub Pages              # ✓ Success
3. Publish docs/api.html               # ✓ Live at public URL
```

---

## File Structure & Deliverables

### New Files to Create

```
frontend/tests/e2e/
└── smoke-expense-api.spec.js          (80-120 lines)

.github/workflows/
├── deploy-pages.yml                   (60-80 lines, new or updated)
└── playwright-smoke.yml               (40-60 lines, new or updated)

scripts/
└── validate-review-packet-links.sh    (30-40 lines, new or updated)

review-artifacts/
└── index.html                         (100-150 lines, new or updated)

docs/
└── api.html                           (Generated, 200-500 KB)
```

### Files to Update

```
.github/workflows/build-review-packet.yml     (Add validation step)
package.json                                   (Add @redocly/redoc-cli dev dep)
```

### Total New Lines of Code: ~400-500 lines
- Playwright test: ~100 lines
- Workflows: ~100 lines
- HTML: ~150 lines
- Scripts: ~50 lines

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| GitHub Pages not enabled | Phase 2 T004 explicitly verifies Pages is enabled |
| OpenAPI spec invalid | Phase 2 T005 validates spec before Redoc generation |
| Playwright test timing issues | Use explicit `page.waitForResponse()` and configurable timeouts (5-10s) |
| Link validation false negatives | Script runs locally before CI to catch broken links early |
| CI workflow syntax errors | Validate YAML syntax before commit using `npm run lint` |
| Deployment delays | GitHub Pages typically publishes within 2-3 minutes; test after waiting |

---

## Communication

### For GitHub Issue (Parent Epic)
Copy-paste the section below into the GitHub issue "feat(api): Day 5 Day 3 - Docs, ReviewPacket, and Playwright Smoke":

```
## Implementation Overview

This feature delivers API documentation generation, review packet enhancement, and UI-API integration testing.

### Three User Stories:
1. **US1: API Documentation** - Generate and publish interactive API docs via Redoc to GitHub Pages (1 hr)
2. **US2: Playwright Smoke Test** - Validate Expense UI and API integration end-to-end (2-3 hrs)
3. **US3: Review Packet** - Link API docs alongside coverage and test reports (1 hr)

### Key Deliverables:
- ✅ docs/api.html - Generated interactive API documentation (public URL)
- ✅ frontend/tests/e2e/smoke-expense-api.spec.js - End-to-end integration test
- ✅ .github/workflows/deploy-pages.yml - Automated docs generation and publishing
- ✅ .github/workflows/playwright-smoke.yml - Smoke test CI job
- ✅ review-artifacts/index.html - Enhanced with API docs link
- ✅ scripts/validate-review-packet-links.sh - Link validation

### Timeline & Execution:
- **Phase 1** (0 hrs): Setup
- **Phase 2** (1-2 hrs): Foundational (blocking)
- **Phase 3** (1 hr): US1 - Documentation ← **Can start immediately**
- **Phase 4** (2-3 hrs): US2 - Smoke Test ← **Can start immediately in parallel**
- **Phase 5** (1 hr): US3 - Review Packet ← **Start after US1 & US2 complete**
- **Phase 6** (1 hr): Polish & Validation

**Recommended MVP**: Phase 1-3 (Documentation only) = 2-3 hours
**Full Feature**: All phases = 4-6 hours total

### Success Criteria:
- [ ] API documentation live on GitHub Pages
- [ ] Smoke test passes and validates UI-API integration
- [ ] Review packet includes all three required components
- [ ] All CI checks pass (spec-check, Coverage, Playwright Smoke, Deploy Pages)
- [ ] PR reviewed and merged

### Specification & Planning:
- 📋 **Spec**: [specs/028-week-5-day/spec.md](./specs/028-week-5-day/spec.md)
- 📐 **Plan**: [specs/028-week-5-day/plan.md](./specs/028-week-5-day/plan.md)
- 🔬 **Research**: [specs/028-week-5-day/research.md](./specs/028-week-5-day/research.md)
- 📚 **Data Model**: [specs/028-week-5-day/data-model.md](./specs/028-week-5-day/data-model.md)
- 📖 **Quickstart**: [specs/028-week-5-day/quickstart.md](./specs/028-week-5-day/quickstart.md)
- 📝 **Contracts**: [specs/028-week-5-day/contracts/api-integration.md](./specs/028-week-5-day/contracts/api-integration.md)

### Implementation Tasks:
See [Implementation Tasks](./specs/028-week-5-day/tasks.md) for full task breakdown (39 tasks organized by user story and phase).
```

---

## Next Steps

1. **Copy tasks to GitHub Projects**: Create cards for each task (T001-T039) in the project board
2. **Assign tasks**: Distribute tasks to team members based on skills and availability
3. **Track progress**: Update task status as work progresses (especially Phase 3 & 4 in parallel)
4. **Run Phase 6 validation**: Before merging, ensure all Phase 6 tasks complete
5. **Merge & Deploy**: Once all tasks complete and reviewed, merge to main

---

## Quick Reference

**Start Here**:
```bash
cd /Users/prnceb/Desktop/WORK/training-prince
git checkout 028-week-5-day
npm install

# Begin Phase 1-2 setup
node --version                          # Should be v18+
npm run lint                            # Verify lint passes

# Begin Phase 3 (US1 - Docs) OR Phase 4 (US2 - Smoke Test)
npx redoc-cli build -o docs/api.html docs/openapi.yaml  # Phase 3
npx playwright test frontend/tests/e2e/smoke-expense-api.spec.js  # Phase 4
```

**Reference Files**:
- Redoc setup: [quickstart.md - Part 1](./specs/028-week-5-day/quickstart.md#part-1-api-documentation-generation-with-redoc)
- Smoke test: [quickstart.md - Part 3](./specs/028-week-5-day/quickstart.md#part-3-playwright-smoke-test---ui--api-integration)
- Review packet: [quickstart.md - Part 2](./specs/028-week-5-day/quickstart.md#part-2-review-packet-enhancement)
- Troubleshooting: [quickstart.md - Troubleshooting](./specs/028-week-5-day/quickstart.md#troubleshooting)
