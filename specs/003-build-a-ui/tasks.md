# Tasks: UI Stopwatch

**Input**: Design documents from `/Users/prnceb/Desktop/WORK/hello-world/specs/003-build-a-ui/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: structure, testing approach, UI-module paths
2. Load optional design documents:
   → data-model.md: Entities → model/UI state tasks
   → contracts/: Each action → contract test
   → research.md: Decisions → setup tasks
   → quickstart.md: Scenarios → smoke tasks
3. Generate tasks by category:
   → Setup: ui-stopwatch skeleton
   → Tests: Vitest CSV + guards, Playwright smoke
   → Core: UI wiring to src/stopwatch/
   → Integration: coverage + review-packet
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
- [ ] T001 [P] Create `frontend/src/ui-stopwatch/` skeleton (index.js, clock.js, styles.css)
- [ ] T002 [P] Ensure Playwright config includes stopwatch e2e path `frontend/e2e/`

### Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
- [ ] T003 [P] Vitest unit: CSV empty-state → header only in `frontend/src/ui-stopwatch/stopwatch.test.js`
- [ ] T004 [P] Vitest unit: CSV golden with sample laps in `frontend/src/ui-stopwatch/stopwatch.test.js`
- [ ] T005 Vitest unit: guard invalid transitions (start while running, stop while stopped)
- [ ] T006 [P] Playwright smoke: start then stop shows non-zero time in `frontend/e2e/stopwatch.smoke.spec.ts`

### Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T007 Implement `clock.js` injectable seam (mirror `ui-todo/clock.js`) in `frontend/src/ui-stopwatch/clock.js`
- [ ] T008 Implement UI controls (Start, Stop, Reset, Lap) and time display in `frontend/src/ui-stopwatch/index.js`
- [ ] T009 Wire CSV export using `src/stopwatch/exporter.js` and `formatTime` in `frontend/src/ui-stopwatch/index.js`
- [ ] T010 Enforce guard transitions (no duplicate timers, no stop when stopped) in `frontend/src/ui-stopwatch/index.js`

### Phase 3.4: Integration
- [ ] T011 Ensure Vitest coverage includes `ui-stopwatch`; verify ≥40% statements
- [ ] T012 Ensure review‑packet includes `ui-coverage-stopwatch` in CI outputs

### Phase 3.5: Polish
- [ ] T013 [P] Update quickstart with exact commands and file paths
- [ ] T014 [P] Add README snippet linking UI and review‑packet location
- [ ] T015 Accessibility labels for buttons and live region for time display

## Dependencies
- T003–T006 before T007–T010 (TDD)
- T007 blocks T008–T010
- T008 blocks T009–T010
- Integration tasks (T011–T012) after core implementation

## Parallel Example
```
# Launch unit test tasks together:
Task: "Vitest CSV empty-state in frontend/src/ui-stopwatch/stopwatch.test.js"
Task: "Vitest CSV golden in frontend/src/ui-stopwatch/stopwatch.test.js"
Task: "Vitest invalid transitions in frontend/src/ui-stopwatch/stopwatch.test.js"
```

## Validation Checklist
- [ ] All interactions covered by tests before implementation
- [ ] Clock abstraction is injectable; no direct Date.now in UI logic
- [ ] UI imports domain logic from src/stopwatch/, no duplication
- [ ] Coverage ≥40% for ui-stopwatch and present in review‑packet
- [ ] Playwright smoke passes (start then stop)
