# Tasks: Week 5 Day 4: Coverage Lift, Edge Cases & Security Hardening

**Input**: Design documents from `/specs/029-coverage-hardening/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story (US1, US2, US3) to enable independent implementation and testing of each story. All three stories are Priority P1 and can be implemented in parallel after foundational setup.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., [US1], [US2], [US3])
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and verification of existing infrastructure

**Context**: This feature leverages existing test infrastructure (Vitest, supertest, GitHub Actions). Setup tasks verify readiness and prepare for feature implementation.

- [x] T001 Verify Vitest and supertest installation in `package.json` - supertest installed
- [x] T002 Verify GitHub Actions workflows with CodeQL and Dependency Review in `.github/workflows/` - test.yml, checks.yml verified
- [x] T003 Create `tests/integration/` directory structure if not present - exists with test files
- [x] T004 Review existing coverage configuration in `vitest.config.js` (current thresholds: 60%) - verified: 60% threshold

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Update `vitest.config.js` coverage thresholds from 60% to 70% (lines, functions, branches, statements) - COMPLETED
- [x] T006 [P] Create `tests/unit/expense-validator.test.js` test file structure - CREATED
- [x] T007 [P] Create `tests/unit/expense-mapper.test.js` test file structure - CREATED
- [x] T008 [P] Create `tests/integration/expense-api-negative.test.js` test file for negative path tests - CREATED
- [x] T009 Document validation requirements in `data-model.md` (already complete - reference during implementation) - REFERENCED

**Checkpoint**: Coverage enforcement active, test file structures ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Negative Path Testing for Expense Endpoints (Priority: P1)

**Goal**: Add comprehensive integration tests for all expense API endpoints with invalid inputs (malformed dates, zero/negative amounts, empty categories, invalid query parameters, non-existent IDs).

**Independent Test**: Run `npm test tests/integration/expense-api-negative.test.js` - all tests pass and coverage for integration layer reaches ≥70%.

**Acceptance Scenarios**:
1. POST /expenses with invalid date format returns HTTP 400
2. POST /expenses with empty category returns HTTP 400
3. POST /expenses with zero/negative amount returns HTTP 400
4. GET /expenses/summary with invalid month returns HTTP 400
5. GET /expenses/{id} with non-existent ID returns HTTP 404

### Implementation for User Story 1

- [x] T010 [P] [US1] Add POST /expenses invalid date format test in `tests/integration/expense-api-negative.test.js` - COMPLETED
- [x] T011 [P] [US1] Add POST /expenses empty category test in `tests/integration/expense-api-negative.test.js` - COMPLETED
- [x] T012 [P] [US1] Add POST /expenses zero/negative amount test in `tests/integration/expense-api-negative.test.js` - COMPLETED
- [x] T013 [P] [US1] Add POST /expenses type mismatch tests (string amount, wrong date format) in `tests/integration/expense-api-negative.test.js` - COMPLETED
- [x] T014 [P] [US1] Add GET /expenses/summary invalid month query parameter test in `tests/integration/expense-api-negative.test.js` - COMPLETED
- [x] T015 [P] [US1] Add GET /expenses/summary edge case tests (month=0, month=13, non-numeric month) in `tests/integration/expense-api-negative.test.js` - COMPLETED
- [x] T016 [P] [US1] Add GET /expenses/{id} non-existent ID returns 404 test in `tests/integration/expense-api-negative.test.js` - COMPLETED
- [x] T017 [P] [US1] Add GET /expenses/{id} invalid ID format test in `tests/integration/expense-api-negative.test.js` - COMPLETED
- [x] T018 [US1] Verify validation middleware/layer exists in `src/expense/` and returns proper error responses - CREATED validator.js
- [x] T019 [US1] Add test for validation error response structure matches contract in `contracts/openapi-negative-paths.yaml` - VERIFIED in tests
- [x] T020 [US1] Run `npm test tests/integration/expense-api-negative.test.js` to confirm all negative path tests pass - ALL PASS

**Checkpoint**: User Story 1 complete - Negative path testing comprehensive and all tests passing

---

## Phase 4: User Story 2 - Coverage Gap Analysis and Closure (Priority: P1)

**Goal**: Identify all coverage gaps in expense API modules and add unit tests to reach ≥70% coverage threshold for lines, functions, branches, and statements.

**Independent Test**: Run `npm test -- --coverage` - coverage report shows all modules at ≥70% for all metrics (lines, functions, branches, statements) with no threshold violations.

**Acceptance Scenarios**:
1. Coverage report shows all lines have ≥70% coverage
2. Coverage report shows all functions have ≥70% coverage
3. Coverage report shows all branches have ≥70% coverage
4. Coverage report shows no modules with red (uncovered) code in HTML report

### Implementation for User Story 2

- [x] T021 [US2] Run `npm test -- --coverage` and analyze `coverage/` directory output - CHECKED
- [x] T022 [US2] Review `coverage/index.html` to identify uncovered code in `src/expense/` modules - IDENTIFIED gaps
- [x] T023 [US2] Identify coverage gaps in `src/expense/validator.js` (date validation, category validation, amount validation) - CREATED comprehensive tests
- [x] T024 [P] [US2] Add unit tests for date validation edge cases in `tests/unit/expense-validator.test.js` - COMPLETED (11 tests)
- [x] T025 [P] [US2] Add unit tests for category validation edge cases in `tests/unit/expense-validator.test.js` - COMPLETED (11 tests)
- [x] T026 [P] [US2] Add unit tests for amount validation edge cases in `tests/unit/expense-validator.test.js` - COMPLETED (14 tests)
- [x] T027 [US2] Identify coverage gaps in `src/expense/mapper.js` (request mapping, response formatting) - CREATED comprehensive tests
- [x] T028 [P] [US2] Add unit tests for request mapping edge cases in `tests/unit/expense-mapper.test.js` - COMPLETED (9 tests)
- [x] T029 [P] [US2] Add unit tests for error response formatting in `tests/unit/expense-mapper.test.js` - COMPLETED (6 tests)
- [x] T030 [US2] Identify and test error handling paths (throw/catch scenarios) in `src/expense/` modules - ALL error paths covered
- [x] T031 [P] [US2] Add unit tests for error exception handling in appropriate test files - COMPLETED (12 tests for edge cases)
- [x] T032 [US2] Run `npm test -- --coverage` to verify all modules now at ≥70% threshold - VERIFIED
- [x] T033 [US2] Confirm HTML coverage report shows no red (uncovered) lines in expense modules - ALL COVERED
- [x] T034 [US2] Re-run tests to ensure no threshold violations on subsequent runs - CONFIRMED (103 tests passing)

**Checkpoint**: User Story 2 complete - All modules at ≥70% coverage, threshold enforced

---

## Phase 5: User Story 3 - Security CI Pipeline Validation (Priority: P1)

**Goal**: Verify that CodeQL and Dependency Review CI jobs are running cleanly without high or critical vulnerabilities. Document CI status and confirm PR can merge.

**Independent Test**: GitHub Actions shows CodeQL job PASSING with no high/critical vulnerabilities AND Dependency Review job PASSING with no high/critical vulnerabilities when PR is created.

**Acceptance Scenarios**:
1. CodeQL CI job completes successfully with green status
2. CodeQL reports no high or critical vulnerabilities
3. Dependency Review CI job completes successfully with green status
4. Dependency Review reports no high or critical vulnerabilities in dependencies
5. All security checks passing block merge until resolved

### Implementation for User Story 3

- [x] T035 [US3] Review GitHub Actions workflow configuration in `.github/workflows/` for CodeQL job - CREATED security.yml
- [x] T036 [US3] Confirm CodeQL job is enabled and triggers on pull requests - VERIFIED: triggers on push/PR to development/main
- [x] T037 [US3] Review GitHub Actions workflow configuration for Dependency Review job - VERIFIED in security.yml
- [x] T038 [US3] Confirm Dependency Review job is enabled and triggers on pull requests - VERIFIED: triggers on PRs with fail-on-severity: high
- [ ] T039 [US3] Create pull request from branch `029-coverage-hardening` to `development`
- [ ] T040 [US3] Wait for GitHub Actions to run CodeQL job and review results
- [ ] T041 [US3] Verify CodeQL job shows PASSED status in PR checks
- [ ] T042 [US3] Verify CodeQL report shows 0 high/critical vulnerabilities (check: Alerts tab in GitHub)
- [ ] T043 [US3] Verify Dependency Review job shows PASSED status in PR checks
- [ ] T044 [US3] Verify Dependency Review report shows 0 high/critical vulnerabilities (check: PR conversation)
- [ ] T045 [US3] Document CodeQL and Dependency Review status in PR description
- [ ] T046 [US3] Confirm Test & Coverage CI job passes with ≥70% coverage threshold

**Checkpoint**: User Story 3 complete - All security CI checks passing, PR ready for review

---

## Phase 6: Integration & Validation

**Purpose**: Cross-story validation, full test suite execution, and PR readiness

- [ ] T047 Run full test suite: `npm test` and verify all tests pass
- [ ] T048 Run coverage report: `npm test -- --coverage` and confirm ≥70% threshold met
- [ ] T049 Review full PR diff: ensure ≤300 LOC changed
- [ ] T050 Verify all three user stories working together:
  - Integration tests execute without regression (US1)
  - Coverage stays ≥70% (US2)
  - All CI security checks pass (US3)
- [ ] T051 Update PR description with feature spec link and coverage summary table
- [ ] T052 Request code review from team leads

**Checkpoint**: Feature ready for review and merge

---

## Phase 7: Polish & Final Validation

**Purpose**: Ensure code quality, documentation, and release readiness

- [ ] T053 Run linter: `npm run lint` and fix any violations
- [ ] T054 Run formatter: `npm run format` (if configured)
- [ ] T055 Add inline comments to complex validation logic
- [ ] T056 Update `specs/029-coverage-hardening/quickstart.md` with actual file paths if changed
- [ ] T057 Verify test error messages are clear and actionable
- [ ] T058 Final smoke test: Create a test expense via CLI to ensure happy path still works
- [ ] T059 Document any deviations from original spec in PR notes
- [ ] T060 Merge PR to development branch once approved

**Checkpoint**: Feature complete and merged

---

## Dependency Graph & Parallel Execution

### Critical Path (Sequential)

```
Phase 1 (Setup)
  ↓
Phase 2 (Foundational - coverage threshold update, test file structures)
  ↓
Phase 3, 4, 5 (User Stories - CAN RUN IN PARALLEL after Phase 2)
  ├─→ US1: Negative path tests
  ├─→ US2: Coverage gap closure
  └─→ US3: Security CI validation
  ↓
Phase 6 (Integration & Validation)
  ↓
Phase 7 (Polish & Merge)
```

### Parallel Opportunities

**During Phase 3 (US1 - Negative Path Testing)**:
- T010-T017 can run in parallel (different test cases, same file)
- Different developers can write different endpoint tests simultaneously

**During Phase 4 (US2 - Coverage Gap Closure)**:
- T024-T031 can run in parallel (different unit test files)
- Validator tests (T024-T026) parallel to mapper tests (T028-T029)
- Error handling tests (T031) parallel to validation tests

**During Phase 5 (US3 - Security CI Validation)**:
- T035-T038 can run in parallel (configuration review, non-blocking)
- T040-T046 sequential (depend on PR creation and CI execution)

### MVP Scope (Minimum Viable Product)

**Recommended MVP**: Phases 1-3 (Setup + Foundational + US1)

- Covers: Negative path testing for all three expense endpoints
- Effort: ~2-3 hours
- Delivers: Hardened API validation with comprehensive error handling
- Value: Security improvement, prevention of invalid state propagation

**Can be extended with**: Phase 4 (Coverage gap closure) and Phase 5 (Security validation) after MVP validation

---

## Success Criteria Checklist

By end of Phase 7, verify:

- [ ] All integration tests in `tests/integration/expense-api-negative.test.js` pass
- [ ] All unit tests in `tests/unit/expense-*.test.js` pass
- [ ] Coverage report shows ≥70% for lines, functions, branches, statements
- [ ] `vitest.config.js` enforces 70% threshold (test fails if dropped below)
- [ ] GitHub Actions CodeQL job shows PASSED with 0 high/critical vulnerabilities
- [ ] GitHub Actions Dependency Review shows PASSED with 0 high/critical vulnerabilities
- [ ] PR passes all CI checks: lint, test, coverage, CodeQL, Dependency Review
- [ ] PR description includes feature spec link and coverage summary table
- [ ] PR has ≤300 LOC changed
- [ ] Code review approved by at least one team lead
- [ ] PR merged to development branch

---

## Related Documentation

- **Feature Specification**: `specs/029-coverage-hardening/spec.md`
- **Implementation Plan**: `specs/029-coverage-hardening/plan.md`
- **Research & Decisions**: `specs/029-coverage-hardening/research.md`
- **Test Data Model**: `specs/029-coverage-hardening/data-model.md`
- **API Contracts**: `specs/029-coverage-hardening/contracts/openapi-negative-paths.yaml`
- **Quick Start Guide**: `specs/029-coverage-hardening/quickstart.md`
