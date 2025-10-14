# Tasks: UI — To-Do

**Input**: Design artifacts in `/Users/prnceb/Desktop/WORK/hello-world/specs/009-feat-ui-todo/`

## Phase 3.1: Setup & Scaffolding
- [ ] T001 Create `frontend/src/ui-todo/` folder with placeholder `index.js`, `index.test.js`, and `clock.js` importing `createClock` skeleton. [Path: `frontend/src/ui-todo/`]
- [ ] T002 Wire `initTodoUI` import/export in `frontend/src/main.js` and ensure entry point invokes it (no implementation yet). [Path: `frontend/src/main.js`]
- [ ] T003 Add To-Do section markup (inputs, filters, error region, list container) to `frontend/index.html` matching contracts README. [Path: `frontend/index.html`]

## Phase 3.2: Tests First (Vitest + Playwright)
- [ ] T004 [P] Author unit test for duplicate guard (same text + date) showing inline error without mutating state. [Path: `frontend/src/ui-todo/index.test.js`]
- [ ] T005 [P] Author unit test for due-today filter using injected test clock (`todayIso`) and ISO dates. [Path: `frontend/src/ui-todo/index.test.js`]
- [ ] T006 [P] Author unit test for invalid toggle (out-of-range index or redundant toggle) ensuring error surfaced. [Path: `frontend/src/ui-todo/index.test.js`]
- [ ] T007 [P] Author unit test for high-priority filter pipeline (due-today → high priority order). [Path: `frontend/src/ui-todo/index.test.js`]
- [ ] T008 Author Playwright smoke spec to add a task, toggle it, and verify filters impact list. [Path: `frontend/e2e/todo.smoke.spec.ts`]

## Phase 3.3: Core Implementation (sequential)
- [ ] T009 Implement `clock.js` helper returning `todayIso()` with timezone support (Africa/Kampala default) and test stub support. [Path: `frontend/src/ui-todo/clock.js`]
- [ ] T010 Implement state helpers in `index.js` to reuse `src/todo/core.js` (`addTodo`, `toggleTodo`, `removeTodo`) while attaching `dueDate` & `isHighPriority`. [Path: `frontend/src/ui-todo/index.js`]
- [ ] T011 Implement duplicate detection + inline error plumbing (normalization, error messaging) per research decisions. [Path: `frontend/src/ui-todo/index.js`]
- [ ] T012 Implement filter pipeline and DOM rendering (due-today via clock, high-priority flag, aria-labels). [Path: `frontend/src/ui-todo/index.js`]
- [ ] T013 Connect event handlers in `index.js` to DOM elements created in T003 (add/filters/toggle/remove) respecting accessibility contracts. [Path: `frontend/src/ui-todo/index.js`]

## Phase 3.4: Integration & A11y
- [ ] T014 Verify focus management and aria-live behavior for `#todo-error`; adjust DOM or JS to ensure announcements. [Path: `frontend/src/ui-todo/index.js`]
- [ ] T015 Ensure keyboard tab order and button labels in HTML/CSS meet accessibility expectations (update styles or attributes as needed). [Path: `frontend/index.html`]
- [ ] T016 Hook To-Do coverage output into CI by ensuring Vitest coverage directory `ui-coverage-todo` is produced (update config if necessary). [Path: `frontend/vitest.config.js`]

## Phase 3.5: Polish & Evidence
- [ ] T017 Confirm `scripts/generate-coverage-index.js` links to `ui-coverage-todo` (update script/tests if required). [Path: `scripts/generate-coverage-index.js`]
- [ ] T018 Update README Frontend section with To-Do details if new instructions/screenshots needed. [Path: `README.md`]
- [ ] T019 Validate quickstart instructions (run commands) and update if steps changed. [Path: `specs/009-feat-ui-todo/quickstart.md`]
- [ ] T020 Ensure Linear sync runs with completed checklist (update `.linear-parent` once parent ID known, run workflow). [Path: `specs/009-feat-ui-todo/` + `scripts/linear-sync.js`]
- [ ] T021 Run `spec:lint`, unit, e2e, coverage locally; capture summary for PR. [Path: repo root commands]
- [ ] T022 Stage and push To-Do feature branch, prepare PR with coverage table and spec link. [Path: repo root]

## Dependencies
- T001–T003 must complete before any tests (T004–T008) or implementation tasks.
- T004–T007 (unit tests) should be written before T010–T013 implementations. T008 before final UI wiring to honor TDD.
- T010 depends on T009; T011–T013 depend on T010.
- A11y tasks (T014–T015) follow core implementation T010–T013.
- Coverage/index polish (T016–T017) comes after tests and implementation are green.
- Documentation and sync (T018–T020) happen post integration; final validation (T021) precedes PR prep (T022).

## Parallel Execution Examples
```
# Parallel: author unit tests before implementation
Task: "T004 Author unit test for duplicate guard" (frontend/src/ui-todo/index.test.js)
Task: "T005 Author unit test for due-today filter" (frontend/src/ui-todo/index.test.js)
Task: "T006 Author unit test for invalid toggle" (frontend/src/ui-todo/index.test.js)

# Parallel: polish tasks after core implementation
Task: "T017 Confirm coverage index entry" (scripts/generate-coverage-index.js)
Task: "T018 Update README Frontend section" (README.md)
Task: "T019 Validate quickstart instructions" (specs/009-feat-ui-todo/quickstart.md)
```
