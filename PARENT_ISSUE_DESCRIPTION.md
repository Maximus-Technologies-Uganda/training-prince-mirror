# Week 5 Day 4: Coverage Lift, Edge Cases & Security Hardening

## Overview

This feature hardens the expense API by expanding negative path test coverage, lifting API test coverage from 60% to ≥70%, and ensuring security CI checks (CodeQL, Dependency Review) are clean.

## Spec

**Spec URL**: `specs/029-coverage-hardening/spec.md`

## All Tasks

### Phase 1: Setup (Shared Infrastructure)

- [ ] T001 Verify Vitest and supertest installation in `package.json`
- [ ] T002 Verify GitHub Actions workflows with CodeQL and Dependency Review in `.github/workflows/`
- [ ] T003 Create `tests/integration/` directory structure if not present
- [ ] T004 Review existing coverage configuration in `vitest.config.js` (current thresholds: 60%)

### Phase 2: Foundational (Blocking Prerequisites)

- [ ] T005 Update `vitest.config.js` coverage thresholds from 60% to 70% (lines, functions, branches, statements)
- [ ] T006 [P] Create `tests/unit/expense-validator.test.js` test file structure
- [ ] T007 [P] Create `tests/unit/expense-mapper.test.js` test file structure
- [ ] T008 [P] Create `tests/integration/expense-api-negative.test.js` test file for negative path tests
- [ ] T009 Document validation requirements in `data-model.md` (already complete - reference during implementation)

### Phase 3: User Story 1 - Negative Path Testing for Expense Endpoints

- [ ] T010 [P] [US1] Add POST /expenses invalid date format test in `tests/integration/expense-api-negative.test.js`
- [ ] T011 [P] [US1] Add POST /expenses empty category test in `tests/integration/expense-api-negative.test.js`
- [ ] T012 [P] [US1] Add POST /expenses zero/negative amount test in `tests/integration/expense-api-negative.test.js`
- [ ] T013 [P] [US1] Add POST /expenses type mismatch tests (string amount, wrong date format) in `tests/integration/expense-api-negative.test.js`
- [ ] T014 [P] [US1] Add GET /expenses/summary invalid month query parameter test in `tests/integration/expense-api-negative.test.js`
- [ ] T015 [P] [US1] Add GET /expenses/summary edge case tests (month=0, month=13, non-numeric month) in `tests/integration/expense-api-negative.test.js`
- [ ] T016 [P] [US1] Add GET /expenses/{id} non-existent ID returns 404 test in `tests/integration/expense-api-negative.test.js`
- [ ] T017 [P] [US1] Add GET /expenses/{id} invalid ID format test in `tests/integration/expense-api-negative.test.js`
- [ ] T018 [US1] Verify validation middleware/layer exists in `src/expense/` and returns proper error responses
- [ ] T019 [US1] Add test for validation error response structure matches contract in `contracts/openapi-negative-paths.yaml`
- [ ] T020 [US1] Run `npm test tests/integration/expense-api-negative.test.js` to confirm all negative path tests pass

### Phase 4: User Story 2 - Coverage Gap Analysis and Closure

- [ ] T021 [US2] Run `npm test -- --coverage` and analyze `coverage/` directory output
- [ ] T022 [US2] Review `coverage/index.html` to identify uncovered code in `src/expense/` modules
- [ ] T023 [US2] Identify coverage gaps in `src/expense/validator.js` (date validation, category validation, amount validation)
- [ ] T024 [P] [US2] Add unit tests for date validation edge cases in `tests/unit/expense-validator.test.js`
- [ ] T025 [P] [US2] Add unit tests for category validation edge cases in `tests/unit/expense-validator.test.js`
- [ ] T026 [P] [US2] Add unit tests for amount validation edge cases in `tests/unit/expense-validator.test.js`
- [ ] T027 [US2] Identify coverage gaps in `src/expense/mapper.js` (request mapping, response formatting)
- [ ] T028 [P] [US2] Add unit tests for request mapping edge cases in `tests/unit/expense-mapper.test.js`
- [ ] T029 [P] [US2] Add unit tests for error response formatting in `tests/unit/expense-mapper.test.js`
- [ ] T030 [US2] Identify and test error handling paths (throw/catch scenarios) in `src/expense/` modules
- [ ] T031 [P] [US2] Add unit tests for error exception handling in appropriate test files
- [ ] T032 [US2] Run `npm test -- --coverage` to verify all modules now at ≥70% threshold
- [ ] T033 [US2] Confirm HTML coverage report shows no red (uncovered) lines in expense modules
- [ ] T034 [US2] Re-run tests to ensure no threshold violations on subsequent runs

### Phase 5: User Story 3 - Security CI Pipeline Validation

- [ ] T035 [US3] Review GitHub Actions workflow configuration in `.github/workflows/` for CodeQL job
- [ ] T036 [US3] Confirm CodeQL job is enabled and triggers on pull requests
- [ ] T037 [US3] Review GitHub Actions workflow configuration for Dependency Review job
- [ ] T038 [US3] Confirm Dependency Review job is enabled and triggers on pull requests
- [ ] T039 [US3] Create pull request from branch `029-coverage-hardening` to `development`
- [ ] T040 [US3] Wait for GitHub Actions to run CodeQL job and review results
- [ ] T041 [US3] Verify CodeQL job shows PASSED status in PR checks
- [ ] T042 [US3] Verify CodeQL report shows 0 high/critical vulnerabilities (check: Alerts tab in GitHub)
- [ ] T043 [US3] Verify Dependency Review job shows PASSED status in PR checks
- [ ] T044 [US3] Verify Dependency Review report shows 0 high/critical vulnerabilities (check: PR conversation)
- [ ] T045 [US3] Document CodeQL and Dependency Review status in PR description
- [ ] T046 [US3] Confirm Test & Coverage CI job passes with ≥70% coverage threshold

### Phase 6: Integration & Validation

- [ ] T047 Run full test suite: `npm test` and verify all tests pass
- [ ] T048 Run coverage report: `npm test -- --coverage` and confirm ≥70% threshold met
- [ ] T049 Review full PR diff: ensure ≤300 LOC changed
- [ ] T050 Verify all three user stories working together: Integration tests execute without regression (US1), Coverage stays ≥70% (US2), All CI security checks pass (US3)
- [ ] T051 Update PR description with feature spec link and coverage summary table
- [ ] T052 Request code review from team leads

### Phase 7: Polish & Final Validation

- [ ] T053 Run linter: `npm run lint` and fix any violations
- [ ] T054 Run formatter: `npm run format` (if configured)
- [ ] T055 Add inline comments to complex validation logic
- [ ] T056 Update `specs/029-coverage-hardening/quickstart.md` with actual file paths if changed
- [ ] T057 Verify test error messages are clear and actionable
- [ ] T058 Final smoke test: Create a test expense via CLI to ensure happy path still works
- [ ] T059 Document any deviations from original spec in PR notes
- [ ] T060 Merge PR to development branch once approved

## User Stories (All Priority P1)

### User Story 1: Negative Path Testing for Expense Endpoints
QA engineers and developers need comprehensive negative path test coverage for all expense API endpoints to identify and prevent invalid states and error conditions from reaching production.

**Acceptance Criteria**:
- POST /expenses rejects invalid date format with HTTP 400
- POST /expenses rejects empty category with HTTP 400
- POST /expenses rejects zero/negative amount with HTTP 400
- GET /expenses/summary rejects invalid query parameters (month=13) with HTTP 400
- GET /expenses/{id} returns HTTP 404 for non-existent ID

**Related Tasks**: T010--T020 (11 tasks)

### User Story 2: Coverage Gap Analysis and Closure
Development teams need to identify and close all coverage gaps in the API codebase to meet the ≥70% coverage floor, focusing on error paths and edge case handling that were previously untested.

**Acceptance Criteria**:
- All lines of code have ≥70% coverage
- All functions have ≥70% coverage
- All branches have ≥70% coverage
- vitest.config.js enforces 70% threshold (test fails if dropped below)

**Related Tasks**: T021--T034 (14 tasks)

### User Story 3: Security CI Pipeline Validation
DevOps engineers and security teams need to verify that all security-related CI jobs (CodeQL and Dependency Review) are running cleanly and passing without high or critical vulnerabilities.

**Acceptance Criteria**:
- CodeQL CI job completes successfully with no high/critical vulnerabilities
- Dependency Review CI job completes successfully with no high/critical vulnerabilities
- All security-related jobs show passing status before merge

**Related Tasks**: T035--T046 (12 tasks)

## Implementation Plan

### Phase 1: Setup (T001--T004)
Verify test infrastructure readiness and review existing configuration.

### Phase 2: Foundational (T005--T009)
Update coverage thresholds and create test file structures.

### Phase 3: User Story 1 - Negative Path Testing (T010--T020)
Create comprehensive integration tests for invalid inputs across all expense endpoints.

### Phase 4: User Story 2 - Coverage Gap Closure (T021--T034)
Analyze coverage report and add unit tests to reach ≥70% threshold.

### Phase 5: User Story 3 - Security CI Validation (T035--T046)
Verify CodeQL and Dependency Review CI jobs pass without vulnerabilities.

### Phase 6: Integration & Validation (T047--T052)
Cross-story validation and full test suite execution.

### Phase 7: Polish & Final Validation (T053--T060)
Code quality checks and merge readiness.

## Success Criteria

- [ ] All integration tests for negative paths pass (100% test pass rate)
- [ ] API coverage reaches ≥70% for lines, functions, branches, statements
- [ ] vitest.config.js enforces 70% coverage threshold
- [ ] CodeQL CI job passes with no high/critical vulnerabilities
- [ ] Dependency Review CI job passes with no high/critical vulnerabilities
- [ ] All error handling paths are covered by tests
- [ ] PR passes all CI checks: lint, test, coverage, CodeQL, Dependency Review
- [ ] PR ≤300 LOC changed

## Documentation

| Document | Location | Purpose |
|----------|----------|---------|
| Feature Specification | `specs/029-coverage-hardening/spec.md` | Feature requirements & acceptance criteria |
| Implementation Plan | `specs/029-coverage-hardening/plan.md` | Technical architecture & decisions |
| Research Findings | `specs/029-coverage-hardening/research.md` | Design rationale & decision analysis |
| Data Model | `specs/029-coverage-hardening/data-model.md` | Test data structures & validation rules |
| API Contracts | `specs/029-coverage-hardening/contracts/openapi-negative-paths.yaml` | OpenAPI specification for validation responses |
| Quick Start | `specs/029-coverage-hardening/quickstart.md` | Developer implementation guide |
| Tasks | `specs/029-coverage-hardening/tasks.md` | 60 implementation tasks across 7 phases |

## Task Summary

**Total Tasks**: 60 across 7 phases

| Phase | Name | Tasks | Focus |
|-------|------|-------|-------|
| 1 | Setup | 4 | Infrastructure verification |
| 2 | Foundational | 5 | Coverage threshold & test structures |
| 3 | US1: Negative Paths | 11 | Invalid input testing |
| 4 | US2: Coverage Gaps | 14 | Coverage analysis & closure |
| 5 | US3: Security CI | 12 | CI validation |
| 6 | Integration & Validation | 6 | Cross-story validation |
| 7 | Polish & Final | 8 | Code quality & merge readiness |

## MVP Scope (Recommended First Iteration)

Start with Phases 1-3 (20 tasks):
- **Phase 1** (1 day): Setup & verification
- **Phase 2** (1 day): Coverage threshold update
- **Phase 3** (1-2 days): Negative path integration tests

**Effort**: ~2-3 hours for experienced developer  
**Deliverable**: Hardened API with negative path validation

## Parallel Execution

After Phase 2 is complete, run in parallel:
- **Developer A**: Phase 3 (US1) - 11 tasks
- **Developer B**: Phase 4 (US2) - 14 tasks
- **Developer C**: Phase 5 (US3) - 12 tasks

## Related PR

This feature is tracked in branch: `029-coverage-hardening`

## Branch

`029-coverage-hardening`
