# Tasks: UI To‑Do Management

**Input**: Design documents from `/Users/prnceb/Desktop/WORK/hello-world/specs/001-what-build-a/`
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
   → quickstart.md: Extract scenarios → smoke tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: unit tests, smoke test
   → Core: UI module, clock abstraction wiring
   → Integration: coverage artifacts, review-packet wiring
   → Polish: docs and cleanup
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness
```

## Tasks

### Phase 3.1: Setup
- [X] T001 Ensure frontend dependencies installed (Vite, Vitest, Playwright, ESLint, Prettier)
- [X] T002 [P] Create `frontend/src/ui-todo/` directory skeleton (index.js, styles.css)
- [X] T003 [P] Configure ESLint/Prettier includes for new paths (if needed)

### Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
- [X] T004 [P] Vitest unit tests for duplicate guard per normalization in `frontend/src/ui-todo/todo.test.js`
- [X] T005 [P] Vitest unit tests for due‑today boundary using injected clock (Africa/Kampala)
- [X] T006 [P] Vitest unit tests for invalid toggle/removal state (no state change + error)
- [X] T007 Playwright smoke: add new item then toggle in `frontend/e2e/todo.smoke.spec.ts`

### Phase 3.3: Core Implementation (ONLY after tests are failing)
- [X] T008 Implement clock abstraction adapter in UI and injection seam `frontend/src/ui-todo/clock.js`
- [X] T009 Implement add/toggle/remove UI, wiring to `src/todo/` core logic `frontend/src/ui-todo/index.js`
- [X] T010 Implement filters UI: due‑today (clock.today) and high‑priority
- [X] T011 Enforce duplicate prevention (normalized compare) and inline validation messages
- [X] T012 Enforce invalid due date handling (block add, preserve input)

### Phase 3.4: Integration
- [X] T013 Ensure Vitest coverage reporting includes ui-todo; verify ≥40% statements
- [X] T014 Ensure review‑packet includes `ui-coverage-todo` folder in CI outputs

### Phase 3.5: Polish
- [X] T015 [P] Update quickstart with exact file paths and commands
- [X] T016 [P] Add brief README section linking UI and review‑packet location
- [X] T017 Cleanup styles and accessibility labels (aria) where applicable

## Dependencies
- T004–T007 before T008–T012 (TDD)
- T008 blocks T009–T012
- T009 blocks T010–T012
- Coverage/reporting (T013–T014) after core implementation

## Parallel Example
```
# Launch unit test tasks together:
Task: "Vitest duplicate guard tests in frontend/src/ui-todo/todo.test.js"
Task: "Vitest due‑today boundary tests with clock in frontend/src/ui-todo/todo.test.js"
Task: "Vitest invalid state tests in frontend/src/ui-todo/todo.test.js"
```

## Validation Checklist
- [ ] All interactions covered by tests before implementation
- [ ] Clock abstraction is injectable; no direct Date.now in filter logic
- [ ] UI imports domain logic from src/todo/, no duplication
- [ ] Coverage ≥40% for ui-todo and present in review‑packet
- [ ] Playwright smoke passes (add then toggle)
