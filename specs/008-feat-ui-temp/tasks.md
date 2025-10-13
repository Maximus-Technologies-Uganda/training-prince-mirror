# Tasks: UI — Temperature Converter

**Input**: Design documents from `/Users/prnceb/Desktop/WORK/hello-world/specs/008-feat-ui-temp/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Phase 3.1: Setup
- [x] T001 Ensure frontend project has Vite + Vitest + Playwright configured [Path: `/Users/prnceb/Desktop/WORK/hello-world/frontend/`]
- [ ] T002 [P] Add DOM contracts to `index.html` (ids: `#temp-value`, `#temp-from`, `#temp-to`, `#temp-result`, `#temp-error`) [Path: `/Users/prnceb/Desktop/WORK/hello-world/frontend/index.html`]
- [ ] T003 [P] Create UI module scaffolding `frontend/src/ui-temp/index.js` + `index.test.js` [Path: `/Users/prnceb/Desktop/WORK/hello-world/frontend/src/ui-temp/`]
 - [x] T002 [P] Add DOM contracts to `index.html` (ids: `#temp-value`, `#temp-from`, `#temp-to`, `#temp-result`, `#temp-error`) [Path: `/Users/prnceb/Desktop/WORK/hello-world/frontend/index.html`]
 - [x] T003 [P] Create UI module scaffolding `frontend/src/ui-temp/index.js` + `index.test.js` [Path: `/Users/prnceb/Desktop/WORK/hello-world/frontend/src/ui-temp/`]

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
- [ ] T004 [P] Unit: C→F conversion displays 32 (rounded 2 dp; trim zeros) [Path: `/Users/prnceb/Desktop/WORK/hello-world/frontend/src/ui-temp/index.test.js`]
- [ ] T005 [P] Unit: F→C conversion displays 0 (rounded 2 dp; trim zeros) [Path: `/Users/prnceb/Desktop/WORK/hello-world/frontend/src/ui-temp/index.test.js`]
- [ ] T006 [P] Unit: identical units → inline error (aria-live assertive), result cleared [Path: `/Users/prnceb/Desktop/WORK/hello-world/frontend/src/ui-temp/index.test.js`]
- [ ] T007 [P] Unit: non-numeric input → inline error (aria-live assertive), result cleared [Path: `/Users/prnceb/Desktop/WORK/hello-world/frontend/src/ui-temp/index.test.js`]
- [ ] T008 [P] Unit: inputs cleared → neutral state (no error, no result) [Path: `/Users/prnceb/Desktop/WORK/hello-world/frontend/src/ui-temp/index.test.js`]
- [ ] T009 [P] E2E smoke: page loads; enter 0 C→F shows 32 [Path: `/Users/prnceb/Desktop/WORK/hello-world/frontend/e2e/temp.smoke.spec.ts`]

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T010 Import conversion logic from `src/temp-converter` into UI module; wire auto-convert on change [Path: `/Users/prnceb/Desktop/WORK/hello-world/frontend/src/ui-temp/index.js`]
- [ ] T011 Implement rounding to 2 dp and trim trailing zeros for display [Path: `/Users/prnceb/Desktop/WORK/hello-world/frontend/src/ui-temp/index.js`]
- [ ] T012 Implement error handling: identical units and non-numeric → inline error (aria-live assertive); clear result [Path: `/Users/prnceb/Desktop/WORK/hello-world/frontend/src/ui-temp/index.js`]
- [ ] T013 Implement inputs-cleared behavior → clear error and result (neutral) [Path: `/Users/prnceb/Desktop/WORK/hello-world/frontend/src/ui-temp/index.js`]

## Phase 3.4: Integration & A11y
- [ ] T014 Ensure `#temp-result` is aria-live="polite" (or output) and `#temp-error` aria-live="assertive" [Path: `/Users/prnceb/Desktop/WORK/hello-world/frontend/index.html`]
- [ ] T015 Labels associated to inputs; default units C→F; keyboard order logical [Path: `/Users/prnceb/Desktop/WORK/hello-world/frontend/index.html`]

## Phase 3.5: Polish & Coverage
- [ ] T016 Verify UI coverage ≥40% statements; export lcov HTML into `ui-coverage-temp` [Path: `/Users/prnceb/Desktop/WORK/hello-world/frontend/vitest.config.js`]
- [ ] T017 Update quickstart.md if test commands or paths change [Path: `/Users/prnceb/Desktop/WORK/hello-world/specs/008-feat-ui-temp/quickstart.md`]

## Dependencies
- Tests (T004–T009) before implementation (T010–T013)
- T010 blocks T011–T013
- A11y adjustments (T014–T015) can run in parallel after T010
- Coverage polish (T016–T017) after all tests pass

## Parallel Example
```
# Launch unit tests and e2e test authoring together
Task: "T004 Unit: C→F conversion displays 32 (rounded 2 dp; trim zeros)"
Task: "T005 Unit: F→C conversion displays 0 (rounded 2 dp; trim zeros)"
Task: "T006 Unit: identical units → inline error (aria-live assertive), result cleared"
Task: "T007 Unit: non-numeric input → inline error (aria-live assertive), result cleared"
Task: "T008 Unit: inputs cleared → neutral state"
Task: "T009 E2E smoke: page loads; enter 0 C→F shows 32"
```

<!-- sync: touch to retrigger linear-tasks-sync -->
\n
 

 
 
