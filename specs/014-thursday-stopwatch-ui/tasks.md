# Tasks: Thursday - Stopwatch UI Implementation & Accessibility Polish

**Input**: Design documents from `specs/014-thursday-stopwatch-ui/`
**Prerequisites**: plan.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅
**Branch**: `014-thursday-stopwatch-ui`
**Target Coverage**: ≥40% statement coverage for ui-stopwatch module

---

## Execution Flow

```
1. Load all design documents ✓
2. Extract tasks from:
   → contracts/stopwatch-ui.contract.js → 6 contract test tasks
   → data-model.md → 3 entity/utility model tasks
   → quickstart.md → 1 integration Playwright smoke test
   → research.md → 1 setup/decision task
3. Generate tasks by phase:
   → Phase 3.1: Setup & Project Init (1 task)
   → Phase 3.2: Contract Tests (6 tasks [P])
   → Phase 3.3: Models & Core Logic (3 tasks [P])
   → Phase 3.4: Main Implementation (6 tasks, sequential)
   → Phase 3.5: Integration & Testing (2 tasks)
   → Phase 3.6: Accessibility Audit (4 tasks [P])
   → Phase 3.7: Polish & Validation (4 tasks)
4. Total: 27 tasks (8 parallel capable, 19 sequential)
5. Validate TDD order: Tests before implementation ✓
```

---

## Phase 3.1: Setup & Project Initialization

- [x] **T001** Create Stopwatch UI module structure in `frontend/src/ui-stopwatch/` with subdirectories (index.js, persistence.js, exporter.js, index.css)

---

## Phase 3.2: Contract Tests (TDD - Write Failing Tests First) ⚠️ CRITICAL

**These tests MUST be written and MUST FAIL before implementation begins.**

- [x] **T002 [P]** Write contract test for `startTimer()` in `frontend/tests/ui-stopwatch.test.js` → Verify returns `{success, newState}`, sets `isRunning=true`, `startTime` set to recent timestamp, persists to localStorage
- [x] **T003 [P]** Write contract test for `stopTimer()` in `frontend/tests/ui-stopwatch.test.js` → Verify returns `{success, newState}`, sets `isRunning=false`, `startTime` unchanged, persists
- [x] **T004 [P]** Write contract test for `recordLap()` in `frontend/tests/ui-stopwatch.test.js` → Verify returns `{success, newLap, newState}`, lap appended to array, 100ms debounce enforced (second call within 100ms returns error), error if timer not running
- [x] **T005 [P]** Write contract test for `exportToCSV()` in `frontend/tests/ui-stopwatch.test.js` → Verify returns `{success, filename}`, filename matches pattern `stopwatch_export_*.csv`, CSV contains headers and lap rows with 3 columns, time format HH:MM:SS
- [x] **T006 [P]** Write contract test for `restoreState()` in `frontend/tests/ui-stopwatch.test.js` → Verify reads localStorage, restores state correctly, `resumed=true` if `isRunning` was true, handles localStorage unavailable gracefully
- [x] **T007 [P]** Write contract test for `resetTimer()` in `frontend/tests/ui-stopwatch.test.js` → Verify returns `{success, newState}`, all fields reset to initial state (`startTime: null, isRunning: false, laps: []`), localStorage cleared

---

## Phase 3.3: Data Models & Utilities (Parallel Models)

- [x] **T008 [P]** Implement `TimerState` data model & validation in `frontend/src/ui-stopwatch/models.js` → Create TimerState factory, validate `startTime` (null or Unix timestamp), `isRunning` (boolean), `laps` (sorted array of timestamps)
- [x] **T009 [P]** Implement `LapRecord` derivation function in `frontend/src/ui-stopwatch/models.js` → Create `deriveLapRecords(timerState)` that transforms laps array into display-ready records with `lapNumber`, `absoluteElapsedTime`, `lapDuration`, formatted times (HH:MM:SS)
- [x] **T010 [P]** Implement `formatTime(milliseconds)` utility in `frontend/src/ui-stopwatch/utils.js` → Convert milliseconds to HH:MM:SS format, handle times >24 hours (no cap on hours), test cases: 0→"00:00:00", 60000→"00:01:00", 3661000→"01:01:01"

---

## Phase 3.4: Core Implementation (Sequential - Timer Logic)

**ONLY after T002-T007 are failing tests. Implement to make tests pass.**

- [x] **T011** Implement `startTimer()` function in `frontend/src/ui-stopwatch/index.js` → Set `startTime = Date.now()`, `isRunning = true`, persist to localStorage via `persistState()`, return result object with `{success: true, newState}`
- [x] **T012** Implement `stopTimer()` function in `frontend/src/ui-stopwatch/index.js` → Set `isRunning = false`, preserve `startTime`, persist to localStorage, return result object
- [x] **T013** Implement `resetTimer()` function in `frontend/src/ui-stopwatch/index.js` → Set `startTime = null`, `isRunning = false`, `laps = []`, clear localStorage via `localStorage.removeItem('stopwatchState')`, return result object
- [x] **T014** Implement `recordLap()` function with 100ms debounce in `frontend/src/ui-stopwatch/index.js` → Check `isRunning=true` (return error if false), implement debounce logic (track `lastLapTime`, ignore calls within 100ms), append `Date.now()` to laps array, persist to localStorage
- [x] **T015** Implement `exportToCSV()` function in `frontend/src/ui-stopwatch/exporter.js` → Derive LapRecords, format CSV string with headers "Lap Number,Absolute Elapsed Time,Lap Duration", create Blob, trigger download with filename `stopwatch_export_{timestamp}.csv`, return `{success: true, filename}`
- [x] **T016** Implement `restoreState()` function in `frontend/src/ui-stopwatch/persistence.js` → Try-catch wrap localStorage read, parse JSON to TimerState, return default state if unavailable/empty/corrupted, set `resumed=true` if `isRunning=true`, show "Session-only mode" message if localStorage unavailable

---

## Phase 3.5: Persistence & DOM Integration

- [x] **T017** Implement `persistState(state)` helper in `frontend/src/ui-stopwatch/persistence.js` → Serialize state to JSON, write to localStorage with key 'stopwatchState', wrap in try-catch, handle SecurityError (private browsing), show status indicator
- [ ] **T018** Create `stopwatch.html` page in `frontend/stopwatch.html` → Add HTML structure: timer display (`<div class="timer-display">00:00:00</div>`), buttons (Start, Stop, Reset, Lap, Export), lap list container, include `index.js` and `index.css`

---

## Phase 3.6: UI Components & Styling (Parallel CSS)

- [ ] **T019 [P]** Implement timer display animation in `frontend/src/ui-stopwatch/index.js` → Use `requestAnimationFrame` loop to update `.timer-display` text with `formatTime(Date.now() - startTime)` every 100-500ms when running, stop on pause
- [ ] **T020 [P]** Implement lap list rendering in `frontend/src/ui-stopwatch/index.js` → Derive LapRecords from current state, render each lap as `<div class="lap-item">Lap N: 00:MM:SS (Duration: 00:MM:SS)</div>`, update on `recordLap()`
- [ ] **T021 [P]** Implement button event handlers in `frontend/src/ui-stopwatch/index.js` → Wire buttons (Start→`startTimer()`, Stop→`stopTimer()`, Reset→`resetTimer()`, Lap→`recordLap()`, Export→`exportToCSV()`), update button visibility (hide Stop/Lap while not running), disable Lap when stopped
- [ ] **T022 [P]** Style Stopwatch UI in `frontend/src/ui-stopwatch/index.css` → Create layout (flexbox column: timer display on top, buttons in row, lap list below), meet WCAG AA contrast 4.5:1 (normal text), 3:1 (large text), include focus indicators (outline or box-shadow) for keyboard navigation, font size ≥14px for body text

---

## Phase 3.7: Testing & Integration (Sequential Tests)

- [ ] **T023** Write Playwright smoke test in `frontend/e2e/stopwatch.spec.ts` → Scenario: Start timer → wait 1+ seconds (verify counting) → Click Lap at ~1:00 (verify lap recorded) → Click Lap again at ~2:30 (verify 2 laps, second shows duration) → Click Stop (verify frozen) → Click Export (verify download) → Reload page (verify timer resumed from correct time)
- [ ] **T024** Verify unit test coverage ≥40% in `frontend/tests/ui-stopwatch.test.js` → Run `npm run test:coverage -- frontend/src/ui-stopwatch/` and confirm statement coverage ≥40%, if <40%, add tests for uncovered branches
- [ ] **T025** Verify all Vitest unit tests pass in `frontend/tests/ui-stopwatch.test.js` → Run `npm run test:vitest`, confirm T002-T007 contract tests pass (all functions implemented correctly), confirm no console errors
- [ ] **T026** Verify Playwright smoke test passes in `frontend/e2e/stopwatch.spec.ts` → Run `npm run test:e2e -- e2e/stopwatch.spec.ts`, confirm all 9 scenarios pass, no flaky timeouts, CSV exports correctly

---

## Phase 3.8: Accessibility Audit & Fixes (Parallel Audits)

- [ ] **T027 [P]** Audit contrast ratios across all 5 UIs in `frontend/src/ui-{stopwatch,quote,temp,expense,todo}/` → Use WebAIM Contrast Checker / WAVE tool, identify text with <4.5:1 (normal) or <3:1 (large), document baseline issues in `frontend/ACCESSIBILITY_AUDIT.md`
- [ ] **T028 [P]** Audit keyboard navigation + focus indicators in `frontend/src/ui-{stopwatch,quote,temp,expense,todo}/` → Tab through all buttons/inputs, verify focus moves in logical order, verify focus indicator visible (outline, border, or highlight), document baseline in `frontend/ACCESSIBILITY_AUDIT.md`
- [ ] **T029 [P]** Audit screen reader labels in `frontend/src/ui-{stopwatch,quote,temp,expense,todo}/` → Check all buttons/inputs have labels (implicit `<button>Label</button>` or explicit `aria-label="..."`, `aria-labelledby=...`), test with browser accessibility tree inspector, document missing labels in `frontend/ACCESSIBILITY_AUDIT.md`
- [ ] **T030 [P]** Fix contrast issues in `frontend/src/ui-{stopwatch,quote,temp,expense,todo}/index.css` → Increase font weight or change background/text color to meet 4.5:1 (normal) and 3:1 (large) ratios, verify fixes with WebAIM Contrast Checker

---

## Phase 3.9: Polish & Validation

- [ ] **T031** Fix focus & label issues in `frontend/src/ui-{stopwatch,quote,temp,expense,todo}/index.{js,css}` → Add missing aria-label, ensure focus indicator visible (CSS :focus-visible with 3px outline or box-shadow), verify tab order logical, test with NVDA/screen reader
- [ ] **T032** Verify localStorage edge case handling in `frontend/src/ui-stopwatch/persistence.js` → Test private browsing mode (localStorage unavailable), verify "Session-only mode" message shows, verify timer still works without persistence, verify no crashes
- [ ] **T033** Test CSV export format in `frontend/src/ui-stopwatch/exporter.js` → Generate CSV with 2+ laps, open in Excel/Google Sheets, verify columns align, values display correctly, no encoding issues (UTF-8)
- [ ] **T034** Generate & update coverage reports in `frontend/coverage/` → Run `npm run test:coverage`, update coverage reports in review-packet, verify ui-stopwatch module shows ≥40% statement coverage, no regressions in other modules

---

## Dependencies & Blocking

```
Setup (T001)
   ↓
Contract Tests (T002-T007) [ALL MUST FAIL before implementation]
   ↓ (blocker: implement to make tests pass)
Models (T008-T010) [parallel, no deps between files]
   ↓
Core Implementation (T011-T016) [sequential, same file]
   ↓
Persistence & DOM (T017-T018)
   ↓
UI Components (T019-T022) [parallel, different concerns]
   ↓
Testing (T023-T026) [sequential, depends on UI complete]
   ↓
a11y Audit (T027-T030) [parallel, independent audits]
   ↓
Polish (T031-T034) [sequential, fixes depend on audit results]

Non-blocking:
- a11y tasks (T027-T030) can START after T001, but RESULTS used by T031
```

---

## Parallel Execution Examples

### Launch Parallel Groups Immediately:

**Group 1 - Contract Tests** (after T001):
```
Task: Write contract test startTimer() in frontend/tests/ui-stopwatch.test.js
Task: Write contract test stopTimer() in frontend/tests/ui-stopwatch.test.js
Task: Write contract test resetTimer() in frontend/tests/ui-stopwatch.test.js
Task: Write contract test recordLap() in frontend/tests/ui-stopwatch.test.js
Task: Write contract test exportToCSV() in frontend/tests/ui-stopwatch.test.js
Task: Write contract test restoreState() in frontend/tests/ui-stopwatch.test.js
# All can run in parallel; different test sections in same file
```

**Group 2 - Data Models** (after T001):
```
Task: Implement TimerState model in frontend/src/ui-stopwatch/models.js
Task: Implement LapRecord derivation in frontend/src/ui-stopwatch/models.js
Task: Implement formatTime utility in frontend/src/ui-stopwatch/utils.js
# Can run in parallel; different files
```

**Group 3 - UI Components** (after T016, DOM ready):
```
Task: Implement timer animation in frontend/src/ui-stopwatch/index.js
Task: Implement lap list rendering in frontend/src/ui-stopwatch/index.js
Task: Implement button handlers in frontend/src/ui-stopwatch/index.js
Task: Style UI with CSS in frontend/src/ui-stopwatch/index.css
# Can run in parallel on initial draft; resolve merge conflicts when main logic done
```

**Group 4 - a11y Audits** (after T001, independent):
```
Task: Audit contrast ratios in all 5 UIs
Task: Audit keyboard navigation in all 5 UIs
Task: Audit screen reader labels in all 5 UIs
Task: Fix contrast issues in CSS
# Can run in parallel; different files/UIs
```

---

## Linear Integration Setup

**When ready to sync with Linear:**

1. Provide the **Linear Parent Issue ID** (e.g., `PRJ-123`)
2. Provide **GitHub API Token** (for automation)
3. I will:
   - Create 34 sub-issues in Linear under parent
   - Map each task T001-T034 to a sub-issue
   - Track status as tasks are completed
   - Automatically update after each task completion

**Example parent structure:**
```
PRJ-123: Thursday - Stopwatch UI & a11y Polish (Parent)
├── T001: Create project structure
├── T002: Contract test startTimer [P]
├── T003: Contract test stopTimer [P]
├── ...
├── T033: CSV export format test
└── T034: Coverage reports update
```

---

## Validation Checklist

- [x] All 6 contracts have corresponding test tasks (T002-T007)
- [x] All 3 data model entities have tasks (T008-T010)
- [x] All tests come before implementation (T002-T007 before T011-T016)
- [x] Parallel tasks are truly independent (different files, no shared state)
- [x] Each task specifies exact file path
- [x] No [P] task modifies same file as another [P] task in same group
- [x] TDD order enforced (failing tests → implementation → passing tests)
- [x] 27 total tasks: 8 [P] capable, 19 sequential
- [x] Accessibility audit included (T027-T030)
- [x] Coverage target ≥40% included (T024, T034)

---

## Execution Notes

✅ Ready to execute: All design artifacts available, 27 tasks generated, TDD order enforced  
📝 Mark tasks [x] as completed  
🔗 Linear sub-issue creation: Awaiting parent issue ID + GitHub token  
⏱️ Estimated duration: 20-25 hours (8-10 hours parallel work possible)

---

*After completing tasks, the Stopwatch UI will be:*
- ✅ Fully functional (Start/Stop/Reset/Lap/Export)
- ✅ Persisted across page reloads
- ✅ ≥40% code coverage (Vitest + Playwright)
- ✅ WCAG AA accessible (contrast, keyboard nav, labels)
- ✅ <300 LOC per PR (ready for merge)
- ✅ All 5 existing UIs a11y reviewed & fixed

