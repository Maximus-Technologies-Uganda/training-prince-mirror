# Tasks: Tuesday: Spec-First Polishing for Quote and Temp UIs

**Input**: Design documents from `/specs/012-title-tuesday-spec/`
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
- **Web app**: `backend/src/`, `frontend/src/`
- Paths based on plan.md structure: separate backend logic and frontend UI

### Phase 3.1: Setup
- [x] T001 Verify existing project structure and dependencies
- [x] T002 [P] Configure ESLint and Prettier for frontend UI modules
- [x] T003 [P] Update Vitest configuration for new test files

### Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [x] T004 [P] Contract test quote filtering in tests/contract/test_quote_filtering.js
- [x] T005 [P] Contract test temperature conversion in tests/contract/test_temperature_converter.js
- [x] T006 [P] Integration test quote UI filter functionality in tests/integration/test_quote_ui.js
- [x] T007 [P] Integration test temperature converter UI in tests/integration/test_temp_ui.js
- [x] T008 [P] Unit test quote filter logic in frontend/src/quote-ui/quote-ui.test.js
- [x] T009 [P] Unit test temperature converter logic in frontend/src/temp-ui/temp-ui.test.js
- [x] T010 [P] E2E test quote UI filtering in frontend/tests/e2e/quote-ui.spec.js
- [x] T011 [P] E2E test temperature converter in frontend/tests/e2e/temp-ui.spec.js

### Phase 3.3: Core Implementation (ONLY after tests are failing)
- [x] T012 [P] Enhanced quote filtering logic in src/quote/quote.js
- [x] T013 [P] Enhanced temperature conversion logic in src/temp-converter/temp-converter.js
- [x] T014 [P] Quote UI debounced filter implementation in frontend/src/quote-ui/quote-ui.js
- [x] T015 [P] Temperature UI input validation in frontend/src/temp-ui/temp-ui.js
- [x] T016 [P] Error handling utilities in frontend/src/components/error-handler.js
- [x] T017 [P] Formatting utilities in frontend/src/components/formatter.js

### Phase 3.4: Integration
- [ ] T018 Connect quote UI to enhanced backend filtering logic
- [ ] T019 Connect temperature UI to enhanced backend conversion logic
- [ ] T020 Implement debounced input handling for quote filter
- [ ] T021 Implement input validation for temperature converter
- [ ] T022 Add error state display for both UIs
- [ ] T023 Add loading states for filter operations

### Phase 3.5: Polish
- [ ] T024 [P] Performance optimization for debounced filtering
- [ ] T025 [P] Accessibility improvements for error messages
- [ ] T026 [P] Update documentation in quickstart.md
- [ ] T027 [P] Remove code duplication between UIs
- [ ] T028 [P] Run manual testing scenarios from quickstart.md
- [ ] T029 [P] Verify ≥40% test coverage for both UI modules
- [ ] T030 [P] Update CI configuration for new test files

## Dependencies
- Tests (T004-T011) before implementation (T012-T017)
- T012 blocks T018 (quote backend integration)
- T013 blocks T019 (temperature backend integration)
- T014 blocks T020 (quote UI integration)
- T015 blocks T021 (temperature UI integration)
- Implementation before polish (T024-T030)

## Parallel Example
```
# Launch T004-T011 together (all test tasks):
Task: "Contract test quote filtering in tests/contract/test_quote_filtering.js"
Task: "Contract test temperature conversion in tests/contract/test_temperature_converter.js"
Task: "Integration test quote UI filter functionality in tests/integration/test_quote_ui.js"
Task: "Integration test temperature converter UI in tests/integration/test_temp_ui.js"
Task: "Unit test quote filter logic in frontend/src/quote-ui/quote-ui.test.js"
Task: "Unit test temperature converter logic in frontend/src/temp-ui/temp-ui.test.js"
Task: "E2E test quote UI filtering in frontend/tests/e2e/quote-ui.spec.js"
Task: "E2E test temperature converter in frontend/tests/e2e/temp-ui.spec.js"
```

## Linear Integration Notes
- Each task should create a Linear sub-issue under the parent issue
- Update Linear status from "In Progress" to "Done" when task completes
- Link each task to corresponding Linear sub-issue for tracking

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Avoid: vague tasks, same file conflicts
- Follow constitutional requirements: no logic duplication, ≥40% coverage

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - quote-filtering.md → contract test task [P]
   - temperature-converter.md → contract test task [P]
   - Each endpoint → implementation task
   
2. **From Data Model**:
   - Quote entity → enhanced filtering logic
   - Temperature entity → enhanced conversion logic
   - FilterState entity → UI state management
   - ConversionResult entity → formatting logic
   
3. **From User Stories**:
   - Quote UI enhancements → integration test [P]
   - Temperature UI enhancements → integration test [P]
   - Quickstart scenarios → validation tasks

4. **Ordering**:
   - Setup → Tests → Models → Services → Endpoints → Polish
   - Dependencies block parallel execution

## Validation Checklist
*GATE: Checked by main() before returning*

- [x] All contracts have corresponding tests
- [x] All entities have model tasks
- [x] All tests come before implementation
- [x] Parallel tasks truly independent
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
