# Tasks: Stopwatch UI Implementation

**Input**: Design documents from `/specs/010-feat-ui-stopwatch/`
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
- **Web app**: `frontend/src/`, `src/` (backend)
- Paths based on plan.md structure: frontend UI module importing backend core logic

## Phase 3.1: Setup
- [ ] T001 Create frontend UI module structure in `frontend/src/ui-stopwatch/`
- [ ] T002 Initialize stopwatch UI HTML page in `frontend/src/ui-stopwatch/index.html`
- [ ] T003 [P] Configure CSS styling in `frontend/src/ui-stopwatch/style.css`

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T004 [P] Contract test StopwatchUI class in `frontend/src/ui-stopwatch/stopwatch-ui.test.js`
- [ ] T005 [P] Contract test backend integration in `tests/stopwatch-ui-integration.test.js`
- [ ] T006 [P] Integration test timer operations in `tests/stopwatch-ui-timer.test.js`
- [ ] T007 [P] Integration test CSV export in `tests/stopwatch-ui-export.test.js`
- [ ] T008 [P] E2E smoke test in `frontend/e2e/stopwatch.smoke.spec.ts`

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T009 [P] Timer state management in `frontend/src/ui-stopwatch/stopwatch-ui.js`
- [ ] T010 [P] Backend module integration imports in `frontend/src/ui-stopwatch/stopwatch-ui.js`
- [ ] T011 [P] Time formatting utility in `frontend/src/ui-stopwatch/stopwatch-ui.js`
- [ ] T012 Timer display updates in `frontend/src/ui-stopwatch/stopwatch-ui.js`
- [ ] T013 Button state management in `frontend/src/ui-stopwatch/stopwatch-ui.js`
- [ ] T014 Lap recording logic in `frontend/src/ui-stopwatch/stopwatch-ui.js`
- [ ] T015 CSV export functionality in `frontend/src/ui-stopwatch/stopwatch-ui.js`
- [ ] T016 CSV download implementation in `frontend/src/ui-stopwatch/stopwatch-ui.js`

## Phase 3.4: Integration
- [ ] T017 Wire up HTML elements to JavaScript in `frontend/src/ui-stopwatch/index.js`
- [ ] T018 Event handling for all buttons in `frontend/src/ui-stopwatch/index.js`
- [ ] T019 State persistence with localStorage in `frontend/src/ui-stopwatch/stopwatch-ui.js`
- [ ] T020 Update main.js entry point in `frontend/src/main.js`

## Phase 3.5: Polish
- [ ] T021 [P] Unit tests for timer logic in `tests/stopwatch-ui-unit.test.js`
- [ ] T022 [P] Unit tests for CSV export in `tests/stopwatch-ui-csv.test.js`
- [ ] T023 Performance validation (<200ms response, 60fps updates)
- [ ] T024 [P] Update frontend documentation in `frontend/README.md`
- [ ] T025 Remove any code duplication
- [ ] T026 Run quickstart validation scenarios
- [ ] T027 Verify ≥40% statement coverage

## Dependencies
- Tests (T004-T008) before implementation (T009-T016)
- T009 blocks T010-T016 (all in same file)
- T017 blocks T018 (both in index.js)
- T019 depends on T009-T016 (needs timer logic)
- Implementation before polish (T021-T027)

## Parallel Example
```
# Launch T004-T008 together (all different files):
Task: "Contract test StopwatchUI class in frontend/src/ui-stopwatch/stopwatch-ui.test.js"
Task: "Contract test backend integration in tests/stopwatch-ui-integration.test.js"
Task: "Integration test timer operations in tests/stopwatch-ui-timer.test.js"
Task: "Integration test CSV export in tests/stopwatch-ui-export.test.js"
Task: "E2E smoke test in frontend/e2e/stopwatch.smoke.spec.ts"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Avoid: vague tasks, same file conflicts
- All UI logic must import from `src/stopwatch/` backend modules

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - StopwatchUI class → contract test task [P]
   - Backend integration → contract test task [P]
   
2. **From Data Model**:
   - Timer entity → state management task
   - LapData entity → lap recording task
   - CSVExport entity → export functionality task
   
3. **From User Stories**:
   - Timer operations → integration test [P]
   - CSV export → integration test [P]
   - E2E scenarios → smoke test [P]

4. **Ordering**:
   - Setup → Tests → Core Implementation → Integration → Polish
   - Dependencies block parallel execution

## Validation Checklist
*GATE: Checked by main() before returning*

- [x] All contracts have corresponding tests
- [x] All entities have implementation tasks
- [x] All tests come before implementation
- [x] Parallel tasks truly independent
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] Backend module reuse enforced
- [x] Coverage requirements included
