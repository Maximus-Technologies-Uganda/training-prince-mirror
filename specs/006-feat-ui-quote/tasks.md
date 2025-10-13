# Tasks: UI Quote - Random + Filter by Author

**Input**: Design documents from `/Users/prnceb/Desktop/WORK/hello-world/specs/006-feat-ui-quote/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Phase 3.1: Setup
- [x] T001 Ensure `frontend/vitest.config.js` thresholds enforce ≥40% statements (no change needed) [Path: `/Users/prnceb/Desktop/WORK/hello-world/frontend/vitest.config.js`]
- [x] T002 [P] Validate Playwright base URL config usable via `BASE_URL` env [Path: `/Users/prnceb/Desktop/WORK/hello-world/frontend/e2e/quote.spec.js`]

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
- [x] T003 [P] Unit test: initial random quote renders on load [Path: `/Users/prnceb/Desktop/WORK/hello-world/frontend/src/main.test.js`]
- [x] T004 [P] Unit test: case-insensitive filter updates to author’s quote [Path: `/Users/prnceb/Desktop/WORK/hello-world/frontend/src/main.test.js`]
- [x] T005 [P] Unit test: empty state shows "No quotes found" and disables shuffle [Path: `/Users/prnceb/Desktop/WORK/hello-world/frontend/src/main.test.js`]
- [x] T006 [P] E2E smoke: typing author updates displayed quote [Path: `/Users/prnceb/Desktop/WORK/hello-world/frontend/e2e/quote.spec.js`]

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [x] T007 Import `src/quote/core.js` into UI; render random quote; wire live filter [Path: `/Users/prnceb/Desktop/WORK/hello-world/frontend/src/main.js`]
- [x] T008 Implement empty state: text → "No quotes found"; author blank; disable shuffle [Path: `/Users/prnceb/Desktop/WORK/hello-world/frontend/src/main.js`]
- [x] T009 Add repeat-avoidance on shuffle when >1 filtered result [Path: `/Users/prnceb/Desktop/WORK/hello-world/frontend/src/main.js`]

## Phase 3.4: Integration & A11y
- [x] T010 Ensure label "Author" correctly associated with input `#author-filter` and announced [Path: `/Users/prnceb/Desktop/WORK/hello-world/frontend/index.html`]
- [x] T011 Quote region uses `role="status"` and is aria-live polite [Path: `/Users/prnceb/Desktop/WORK/hello-world/frontend/index.html`]

## Phase 3.5: Polish
- [x] T012 [P] Ensure UI coverage ≥40% statements; export lcov HTML [Path: `/Users/prnceb/Desktop/WORK/hello-world/frontend/vitest.config.js`]
- [x] T013 [P] Update quickstart if UI details changed [Path: `/Users/prnceb/Desktop/WORK/hello-world/specs/006-feat-ui-quote/quickstart.md`]

## Dependencies
- Tests (T003–T006) before implementation (T007–T009)
- T007 blocks T008–T009
- A11y adjustments (T010–T011) can be parallel with polish once core passes

## Parallel Example
```
# Launch unit tests and e2e test authoring together
Task: "T003 Unit test: initial random quote renders on load"
Task: "T004 Unit test: case-insensitive filter updates to author’s quote"
Task: "T005 Unit test: empty state shows 'No quotes found' and disables shuffle"
Task: "T006 E2E smoke: typing author updates displayed quote"
```

## Validation Checklist
- [ ] All tests defined before implementation
- [ ] Each task references exact absolute path
- [ ] Parallel tasks only for independent files
- [ ] Coverage threshold satisfied
