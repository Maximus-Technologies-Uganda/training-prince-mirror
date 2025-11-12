# feat(api): Day 3 - Docs, ReviewPacket, and Playwright Smoke

## Overview

This feature delivers three integrated components for Day 3 objectives:
1. **API Documentation** - Generate and publish interactive API docs via Redoc to GitHub Pages
2. **Playwright Smoke Test** - Validate Expense UI and API integration end-to-end
3. **Review Packet** - Enhance with API documentation link alongside coverage and test reports

**Specification**: [specs/028-week-5-day/spec.md](../../specs/028-week-5-day/spec.md)

---

## Implementation Tasks

Complete tasks in the following order. Tasks marked with [P] can run in parallel.

### Phase 1: Setup (Estimated: 0 hours)
- [ ] T001 Verify Node.js installation: `node --version` should output v18+ in terminal
- [ ] T002 Install dependencies: Run `npm install` in repo root and verify no errors
- [ ] T003 Verify git branch: Confirm branch `028-week-5-day` exists via `git branch`

### Phase 2: Foundational Prerequisites (Estimated: 1-2 hours)
*Blocking: All user stories depend on these*
- [ ] T004 Enable GitHub Pages: Go to Settings → Pages, ensure "Deploy from a branch" or "GitHub Actions" is selected
- [ ] T005 Validate OpenAPI spec: Run `npm install -g @redocly/redoc-cli` and verify docs/openapi.yaml passes validation
- [ ] T006 Create e2e test directory: `mkdir -p frontend/tests/e2e` if not exists
- [ ] T007 Verify Expense UI component: Confirm `frontend/src/` contains working Expense component with form and list display
- [ ] T008 Install Playwright if missing: Run `npm install --save-dev @playwright/test` and verify installation

### Phase 3: US1 - API Documentation Generation (Estimated: 1 hour)
*Can start immediately after Phase 2 | Independent from US2*

**User Story**: As an API consumer, I need access to live, published API documentation generated from the OpenAPI specification, accessible via GitHub Pages.

**Success Criteria**:
- ✅ Redoc CLI installed as dev dependency
- ✅ docs/api.html generated and accessible
- ✅ Documentation live on GitHub Pages at public URL
- ✅ No errors in generation or deployment

**Tasks**:
- [ ] T009 [US1] Install Redoc CLI: `npm install --save-dev @redocly/redoc-cli` and verify in package.json
- [ ] T010 [US1] Test Redoc locally: Run `npx redoc-cli build -o docs/api.html docs/openapi.yaml` and verify docs/api.html generated
- [ ] T011 [P] [US1] Create deploy-pages workflow: Create `.github/workflows/deploy-pages.yml` with Redoc generation step (reference [quickstart.md](../../specs/028-week-5-day/quickstart.md#part-1-api-documentation-generation-with-redoc))
- [ ] T012 [US1] Configure GitHub Pages branch: Set repository to deploy from `gh-pages` branch or configure GitHub Actions as source
- [ ] T013 [US1] Test workflow locally: Verify workflow syntax with `npm run lint` on .github/workflows/deploy-pages.yml
- [ ] T014 [US1] Merge changes to feature branch: Push and verify workflow runs successfully in Actions tab
- [ ] T015 [US1] Verify public accessibility: Test that `https://org.github.io/repo/docs/api.html` is accessible

### Phase 4: US2 - Playwright Smoke Test (Estimated: 2-3 hours)
*Can start immediately after Phase 2 | Can run in parallel with US1*

**User Story**: As a developer, I need automated validation that the Expense UI and API are properly integrated, ensuring a user can create an expense and see it updated in the UI.

**Success Criteria**:
- ✅ Smoke test exists and passes locally
- ✅ Test validates API response (HTTP 201) and UI updates
- ✅ Test handles errors gracefully with clear messages
- ✅ Test integrated into CI as required status check

**Tasks**:
- [ ] T016 [P] [US2] Create smoke test file: Create `frontend/tests/e2e/smoke-expense-api.spec.js` using template from [quickstart.md Part 3](../../specs/028-week-5-day/quickstart.md#part-3-playwright-smoke-test---ui--api-integration)
- [ ] T017 [US2] Implement test setup: Add `test.beforeEach()` to navigate to /expenses and wait for page load
- [ ] T018 [US2] Implement create expense test: Fill form, submit, wait for API response (201), assert UI updates
- [ ] T019 [US2] Add API response assertions: Verify response status 201, includes id/amount/description fields
- [ ] T020 [US2] Add UI update assertions: Verify new expense visible, amount displayed correctly, total updated
- [ ] T021 [US2] Implement error handling test: Add test for invalid input, verify 400 response and error message shown
- [ ] T022 [P] [US2] Test locally: Run `npm run dev` and `npx playwright test --headed frontend/tests/e2e/smoke-expense-api.spec.js` and verify all pass
- [ ] T023 [US2] Create playwright-smoke workflow: Create `.github/workflows/playwright-smoke.yml` with smoke test execution (reference [quickstart.md](../../specs/028-week-5-day/quickstart.md#part-3-playwright-smoke-test---ui--api-integration))
- [ ] T024 [US2] Configure as required check: Update branch protection rules to require Playwright Smoke workflow to pass
- [ ] T025 [US2] Verify workflow execution: Push changes to feature branch and verify playwright-smoke workflow runs

### Phase 5: US3 - Review Packet Enhancement (Estimated: 1 hour)
*Depends on: US1 & US2 complete*

**User Story**: As a reviewer, I need a centralized review packet that links to coverage reports, Playwright test results, AND API documentation in one accessible location.

**Success Criteria**:
- ✅ review-artifacts/index.html includes all three components (Coverage, Playwright, API Docs)
- ✅ All links validated during build
- ✅ Build fails if any link is broken
- ✅ Review packet easily accessible during code review

**Tasks**:
- [ ] T026 [US3] Create/update review-artifacts/index.html: Copy template from [quickstart.md Part 2](../../specs/028-week-5-day/quickstart.md#part-2-review-packet-enhancement), create with three sections
- [ ] T027 [US3] Add API documentation link: Insert link to `./docs/api.html` with text "API Specification (Redoc)"
- [ ] T028 [US3] Create link validation script: Create `scripts/validate-review-packet-links.sh` to check all artifact files exist (reference [quickstart.md](../../specs/028-week-5-day/quickstart.md#link-validation-script))
- [ ] T029 [US3] Make validation script executable: `chmod +x scripts/validate-review-packet-links.sh`
- [ ] T030 [US3] Test validation locally: Run `./scripts/validate-review-packet-links.sh` and verify it passes
- [ ] T031 [P] [US3] Update build-review-packet workflow: Add validation step to `.github/workflows/build-review-packet.yml`

### Phase 6: Polish & Validation (Estimated: 1 hour)
*Depends on: All user stories complete*

**Success Criteria**:
- ✅ All workflows execute successfully on PR
- ✅ Documentation live and accessible
- ✅ Smoke tests pass consistently
- ✅ Review packet builds without errors
- ✅ No lint or type errors
- ✅ PR ready for review and merge

**Tasks**:
- [ ] T032 Run full local test suite: `npm test && npm run lint` to verify all checks pass
- [ ] T033 Verify documentation live: Test `https://org.github.io/repo/docs/api.html` is publicly accessible
- [ ] T034 Test smoke test suite: `npx playwright test frontend/tests/e2e/smoke-expense-api.spec.js` - all pass
- [ ] T035 Verify review packet: Open review-artifacts/index.html locally and verify all links functional
- [ ] T036 Check all workflows pass: Push to feature branch, verify all GitHub Actions jobs pass (spec-check, Coverage, Playwright Smoke, Deploy Pages)
- [ ] T037 Create PR with full description: Open PR to main with title `feat(api): Day 3 - Docs, ReviewPacket, and Playwright Smoke`
- [ ] T038 Add Definition of Done checklist: Include all DoD items from spec as PR comment
- [ ] T039 Request review: Assign reviewers and request code review

---

## Execution Strategy

### Recommended: Parallel Execution (4 hours total)
- **Person A**: Phase 3 (US1 - API Docs) - 1 hour
- **Person B**: Phase 4 (US2 - Smoke Test) - 2-3 hours
- **Combined**: Phase 5 (US3 - Review Packet) - 1 hour after both complete
- **Result**: Complete all by end of day

### Alternative: Sequential (6 hours total)
- Phase 1 (Setup): 15 mins
- Phase 2 (Foundational): 1-2 hours
- Phase 3 (US1): 1 hour
- Phase 4 (US2): 2-3 hours
- Phase 5 (US3): 1 hour
- Phase 6 (Validation): 1 hour

---

## Definition of Done

- [ ] API documentation is live and accessible on GitHub Pages
- [ ] review-artifacts/index.html includes Coverage Table (existing), Playwright Report (existing), API Documentation link (new)
- [ ] API documentation link in review packet is valid and functional
- [ ] Playwright smoke test exists, passes, and validates UI-API integration
- [ ] Smoke test verifies both API response (HTTP 201) and UI updates (new expense visible)
- [ ] All CI checks pass (spec-check, Test & Coverage - API, Playwright Smoke, Deploy Pages)
- [ ] GitHub Pages workflow successfully deploys on merge to main
- [ ] All tasks in tasks.md completed
- [ ] PR reviewed and approved
- [ ] PR merged to main branch

---

## Documentation

- **Specification**: [specs/028-week-5-day/spec.md](../../specs/028-week-5-day/spec.md)
- **Implementation Plan**: [specs/028-week-5-day/plan.md](../../specs/028-week-5-day/plan.md)
- **Quickstart Guide**: [specs/028-week-5-day/quickstart.md](../../specs/028-week-5-day/quickstart.md)
- **Research Findings**: [specs/028-week-5-day/research.md](../../specs/028-week-5-day/research.md)
- **Data Model**: [specs/028-week-5-day/data-model.md](../../specs/028-week-5-day/data-model.md)
- **API Contracts**: [specs/028-week-5-day/contracts/api-integration.md](../../specs/028-week-5-day/contracts/api-integration.md)
- **Implementation Tasks**: [specs/028-week-5-day/tasks.md](../../specs/028-week-5-day/tasks.md)

---

## Branch & Feature Info

- **Feature Branch**: `028-week-5-day`
- **Base Branch**: `main`
- **Estimated Duration**: 4-6 hours
- **Team Size**: 1-2 developers (can work in parallel)
- **Complexity**: Medium
- **Breaking Changes**: None (additive only)

---

## Quick Start

```bash
# Clone/switch to feature branch
git checkout 028-week-5-day

# Install dependencies
npm install

# Start Phase 1-2 setup
node --version                    # Verify v18+
npm run lint                      # Verify no lint errors

# Phase 3 (US1 - API Docs)
npx redoc-cli build -o docs/api.html docs/openapi.yaml
file docs/api.html                # Verify HTML generated

# Phase 4 (US2 - Smoke Test)
npm run dev &                     # Terminal 1
npx playwright test --headed frontend/tests/e2e/smoke-expense-api.spec.js  # Terminal 2

# Phase 5 (US3 - Review Packet)
./scripts/validate-review-packet-links.sh

# Phase 6 (Validation)
npm test && npm run lint          # All pass
# Visit: https://org.github.io/repo/docs/api.html  # Verify live
```

---

## Support & References

For detailed implementation guidance, see:
- Redoc setup: [quickstart.md Part 1](../../specs/028-week-5-day/quickstart.md#part-1-api-documentation-generation-with-redoc)
- Smoke test examples: [quickstart.md Part 3](../../specs/028-week-5-day/quickstart.md#part-3-playwright-smoke-test---ui--api-integration)
- Review packet structure: [quickstart.md Part 2](../../specs/028-week-5-day/quickstart.md#part-2-review-packet-enhancement)
- Troubleshooting: [quickstart.md Troubleshooting](../../specs/028-week-5-day/quickstart.md#troubleshooting)

**Questions?** Refer to the specification and plan documents linked above.

---

## Labels

Suggested GitHub labels:
- `type: feature`
- `area: api`
- `area: ci`
- `area: testing`
- `priority: high`
- `week5`

## Assignees

Recommended assignees based on skills:
- **API Documentation & CI**: Backend/DevOps engineer
- **Playwright Smoke Test**: QA/Frontend engineer
- **Review Packet**: Either (straightforward HTML/scripting)

## Project

Add to GitHub Project: `training-prince` board
- Epic/Feature: `feat(api): Day 3 - Docs, ReviewPacket, and Playwright Smoke`
- Link all sub-tasks (T001-T039) to this parent issue
