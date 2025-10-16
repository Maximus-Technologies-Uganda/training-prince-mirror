# Tasks: Day 0: CI Maturity, Review Packet Parity, and Repository Hygiene

**Input**: Design documents from `/specs/011-title-day-0/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Web application**: `frontend/`, `src/`, `data/`, `review-artifacts/`
- **CI/CD**: `.github/workflows/`, `scripts/`
- **Testing**: `frontend/e2e/`, `tests/`

## Phase 3.1: Setup
- [x] T001 Create /data/ directory structure for state files
- [x] T002 Update .gitignore to include /data/ directory
- [x] T003 [P] Configure CI pipeline for unified coverage reporting
- [x] T004 [P] Setup Playwright configuration for smoke tests

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [x] T005 [P] Contract test coverage generation API in tests/contract/test-coverage-generation.js
- [x] T006 [P] Contract test review packet generation API in tests/contract/test-review-packet-generation.js
- [x] T007 [P] Contract test state file migration API in tests/contract/test-state-file-migration.js
- [x] T008 [P] Contract test smoke test execution API in tests/contract/test-smoke-test-execution.js
- [x] T009 [P] Contract test review packet access API in tests/contract/test-review-packet-access.js
- [x] T010 [P] Integration test unified coverage reporting in tests/integration/test-coverage-reporting.js
- [x] T011 [P] Integration test repository hygiene in tests/integration/test-repository-hygiene.js
- [x] T012 [P] Integration test smoke test execution in tests/integration/test-smoke-tests.js

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [x] T013 [P] Coverage Report entity model in src/models/coverage-report.js
- [x] T014 [P] UI Coverage Report entity model in src/models/ui-coverage-report.js
- [x] T015 [P] Review Packet entity model in src/models/review-packet.js
- [x] T016 [P] State File entity model in src/models/state-file.js
- [x] T017 [P] Smoke Test entity model in src/models/smoke-test.js
- [x] T018 [P] Review Metadata entity model in src/models/review-metadata.js
- [x] T019 Coverage generation service in scripts/generate-coverage.js
- [x] T020 Review packet generation service in scripts/generate-review-packet.js
- [x] T021 State file migration service in scripts/migrate-state-files.js
- [x] T022 Smoke test execution service in scripts/run-smoke-tests.js
- [x] T023 Review packet access service in scripts/access-review-packet.js

## Phase 3.4: Integration
- [x] T024 Integrate coverage generation into CI pipeline
- [x] T025 Integrate review packet generation into CI pipeline
- [x] T026 Integrate smoke test execution into CI pipeline
- [x] T027 Configure artifact upload and failure handling
- [x] T028 Setup review-artifacts directory structure
- [x] T029 Generate index.html for review packet navigation
- [x] T030 Enrich review.md with environment and commit metadata

## Phase 3.5: Repository Hygiene
- [x] T031 Migrate existing state files to /data/ directory
- [x] T032 Handle state file migration conflicts
- [x] T033 Clean up stray and temporary files
- [x] T034 Update README.md with "How to review me" section
- [x] T035 Verify .gitignore configuration

## Phase 3.6: Smoke Testing
- [x] T036 [P] Create quote filtering smoke test in frontend/e2e/quote.spec.js
- [x] T037 [P] Create expense calculation smoke test in frontend/e2e/expense.smoke.spec.ts
- [x] T038 [P] Create temperature conversion smoke test in frontend/e2e/temp.smoke.spec.ts
- [x] T039 [P] Create todo management smoke test in frontend/e2e/todo.smoke.spec.ts
- [x] T040 [P] Create stopwatch timing smoke test in frontend/e2e/stopwatch.smoke.spec.ts
- [x] T041 Configure Playwright artifact capture on failure
- [x] T042 Integrate smoke tests into CI pipeline

## Phase 3.7: Polish
- [x] T043 [P] Unit tests for coverage report models in tests/unit/test-coverage-models.js
- [x] T044 [P] Unit tests for state file models in tests/unit/test-state-models.js
- [x] T045 [P] Unit tests for review packet models in tests/unit/test-review-models.js
- [x] T046 Performance validation (CI pipeline <10 minutes)
- [x] T047 [P] Update documentation in docs/ci-pipeline.md
- [x] T048 Validate quickstart.md scenarios
- [x] T049 Remove any code duplication
- [x] T050 Final validation and cleanup

## Dependencies
- Tests (T005-T012) before implementation (T013-T023)
- T013-T018 blocks T019-T023 (models before services)
- T019-T023 blocks T024-T030 (services before integration)
- T031-T035 can run parallel with T036-T042 (repository hygiene vs smoke tests)
- T024-T030 blocks T041-T042 (CI integration before smoke test integration)
- All implementation before polish (T043-T050)

## Parallel Example
```
# Launch T005-T012 together (Contract and Integration Tests):
Task: "Contract test coverage generation API in tests/contract/test-coverage-generation.js"
Task: "Contract test review packet generation API in tests/contract/test-review-packet-generation.js"
Task: "Contract test state file migration API in tests/contract/test-state-file-migration.js"
Task: "Contract test smoke test execution API in tests/contract/test-smoke-test-execution.js"
Task: "Contract test review packet access API in tests/contract/test-review-packet-access.js"
Task: "Integration test unified coverage reporting in tests/integration/test-coverage-reporting.js"
Task: "Integration test repository hygiene in tests/integration/test-repository-hygiene.js"
Task: "Integration test smoke test execution in tests/integration/test-smoke-tests.js"

# Launch T013-T018 together (Entity Models):
Task: "Coverage Report entity model in src/models/coverage-report.js"
Task: "UI Coverage Report entity model in src/models/ui-coverage-report.js"
Task: "Review Packet entity model in src/models/review-packet.js"
Task: "State File entity model in src/models/state-file.js"
Task: "Smoke Test entity model in src/models/smoke-test.js"
Task: "Review Metadata entity model in src/models/review-metadata.js"

# Launch T036-T040 together (Smoke Tests):
Task: "Create quote filtering smoke test in frontend/e2e/quote.spec.js"
Task: "Create expense calculation smoke test in frontend/e2e/expense.smoke.spec.ts"
Task: "Create temperature conversion smoke test in frontend/e2e/temp.smoke.spec.ts"
Task: "Create todo management smoke test in frontend/e2e/todo.smoke.spec.ts"
Task: "Create stopwatch timing smoke test in frontend/e2e/stopwatch.smoke.spec.ts"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Avoid: vague tasks, same file conflicts
- State file migration requires manual conflict resolution
- CI pipeline must handle partial coverage failures gracefully
- Smoke tests must capture artifacts on failure

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - Each contract file → contract test task [P]
   - Each endpoint → implementation task
   
2. **From Data Model**:
   - Each entity → model creation task [P]
   - Relationships → service layer tasks
   
3. **From User Stories**:
   - Each story → integration test [P]
   - Quickstart scenarios → validation tasks

4. **Ordering**:
   - Setup → Tests → Models → Services → Integration → Polish
   - Dependencies block parallel execution

## Validation Checklist
*GATE: Checked by main() before returning*

- [x] All contracts have corresponding tests
- [x] All entities have model tasks
- [x] All tests come before implementation
- [x] Parallel tasks truly independent
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
# Trigger workflow
