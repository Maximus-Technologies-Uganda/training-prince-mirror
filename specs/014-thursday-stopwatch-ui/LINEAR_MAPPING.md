# Linear Sub-Issues Mapping: PRI-1412

**Feature**: Thursday - Stopwatch UI Implementation & Accessibility Polish  
**Parent Issue**: PRI-1412  
**Status**: Ready for Sub-Issue Creation  
**Total Tasks**: 34  
**Parallel Capable**: 8  
**Sequential**: 26

---

## Sub-Issues to Create Under PRI-1412

### Phase 3.1: Setup (1 task)

| Task ID | Title | Description | File Path | Status |
|---------|-------|-------------|-----------|--------|
| **T001** | Create project structure | Create Stopwatch UI module structure in `frontend/src/ui-stopwatch/` with subdirectories (index.js, persistence.js, exporter.js, index.css) | `frontend/src/ui-stopwatch/` | [ ] |

---

### Phase 3.2: Contract Tests [P] (6 tasks - PARALLEL)

| Task ID | Title | Description | File Path | Status |
|---------|-------|-------------|-----------|--------|
| **T002** [P] | Contract test startTimer() | Write contract test in Vitest - verify returns `{success, newState}`, sets `isRunning=true`, `startTime` set to recent timestamp, persists to localStorage | `frontend/tests/ui-stopwatch.test.js` | [ ] |
| **T003** [P] | Contract test stopTimer() | Write contract test - verify returns `{success, newState}`, sets `isRunning=false`, `startTime` unchanged, persists to localStorage | `frontend/tests/ui-stopwatch.test.js` | [ ] |
| **T004** [P] | Contract test resetTimer() | Write contract test - verify returns `{success, newState}`, all fields reset to initial state (`startTime: null, isRunning: false, laps: []`), localStorage cleared | `frontend/tests/ui-stopwatch.test.js` | [ ] |
| **T005** [P] | Contract test recordLap() | Write contract test - verify lap appended, 100ms debounce enforced (second call within 100ms returns error), error if timer not running | `frontend/tests/ui-stopwatch.test.js` | [ ] |
| **T006** [P] | Contract test exportToCSV() | Write contract test - verify returns `{success, filename}`, filename matches pattern `stopwatch_export_*.csv`, CSV contains headers and lap rows with 3 columns, HH:MM:SS format | `frontend/tests/ui-stopwatch.test.js` | [ ] |
| **T007** [P] | Contract test restoreState() | Write contract test - verify localStorage read, state restored correctly, `resumed=true` if `isRunning` was true, handles localStorage unavailable gracefully | `frontend/tests/ui-stopwatch.test.js` | [ ] |

---

### Phase 3.3: Data Models & Utilities [P] (3 tasks - PARALLEL)

| Task ID | Title | Description | File Path | Status |
|---------|-------|-------------|-----------|--------|
| **T008** [P] | Implement TimerState model | Create TimerState factory and validation in models.js - validate `startTime` (null or Unix timestamp), `isRunning` (boolean), `laps` (sorted array of timestamps) | `frontend/src/ui-stopwatch/models.js` | [ ] |
| **T009** [P] | Implement LapRecord derivation | Create `deriveLapRecords(timerState)` function - transforms laps array into display-ready records with `lapNumber`, `absoluteElapsedTime`, `lapDuration`, formatted times (HH:MM:SS) | `frontend/src/ui-stopwatch/models.js` | [ ] |
| **T010** [P] | Implement formatTime utility | Create `formatTime(milliseconds)` utility - converts milliseconds to HH:MM:SS format, handles times >24 hours (no cap), test cases: 0→"00:00:00", 60000→"00:01:00", 3661000→"01:01:01" | `frontend/src/ui-stopwatch/utils.js` | [ ] |

---

### Phase 3.4: Core Implementation (6 tasks - SEQUENTIAL)

| Task ID | Title | Description | File Path | Status |
|---------|-------|-------------|-----------|--------|
| **T011** | Implement startTimer() | Set `startTime = Date.now()`, `isRunning = true`, persist to localStorage via `persistState()`, return `{success: true, newState}` | `frontend/src/ui-stopwatch/index.js` | [ ] |
| **T012** | Implement stopTimer() | Set `isRunning = false`, preserve `startTime`, persist to localStorage, return result object | `frontend/src/ui-stopwatch/index.js` | [ ] |
| **T013** | Implement resetTimer() | Set `startTime = null`, `isRunning = false`, `laps = []`, clear localStorage via `localStorage.removeItem('stopwatchState')`, return result object | `frontend/src/ui-stopwatch/index.js` | [ ] |
| **T014** | Implement recordLap() | Check `isRunning=true`, implement 100ms debounce logic (track `lastLapTime`), append `Date.now()` to laps array, persist to localStorage, return result | `frontend/src/ui-stopwatch/index.js` | [ ] |
| **T015** | Implement exportToCSV() | Derive LapRecords, format CSV string with headers "Lap Number,Absolute Elapsed Time,Lap Duration", create Blob, trigger download with filename `stopwatch_export_{timestamp}.csv` | `frontend/src/ui-stopwatch/exporter.js` | [ ] |
| **T016** | Implement restoreState() | Try-catch wrap localStorage read, parse JSON to TimerState, return default state if unavailable/empty/corrupted, set `resumed=true` if `isRunning=true`, show "Session-only mode" message | `frontend/src/ui-stopwatch/persistence.js` | [ ] |

---

### Phase 3.5: Persistence & DOM Integration (2 tasks - SEQUENTIAL)

| Task ID | Title | Description | File Path | Status |
|---------|-------|-------------|-----------|--------|
| **T017** | Implement persistState() | Serialize state to JSON, write to localStorage with key 'stopwatchState', wrap in try-catch, handle SecurityError (private browsing), show status indicator | `frontend/src/ui-stopwatch/persistence.js` | [ ] |
| **T018** | Create stopwatch.html | Add HTML structure: timer display (`<div class="timer-display">00:00:00</div>`), buttons (Start, Stop, Reset, Lap, Export), lap list container, include `index.js` and `index.css` | `frontend/stopwatch.html` | [ ] |

---

### Phase 3.6: UI Components & Styling [P] (4 tasks - PARALLEL)

| Task ID | Title | Description | File Path | Status |
|---------|-------|-------------|-----------|--------|
| **T019** [P] | Implement timer animation | Use `requestAnimationFrame` loop to update `.timer-display` text with `formatTime(Date.now() - startTime)` every 100-500ms when running, stop on pause | `frontend/src/ui-stopwatch/index.js` | [ ] |
| **T020** [P] | Implement lap list rendering | Derive LapRecords, render each lap as `<div class="lap-item">Lap N: 00:MM:SS (Duration: 00:MM:SS)</div>`, update on `recordLap()` | `frontend/src/ui-stopwatch/index.js` | [ ] |
| **T021** [P] | Implement button handlers | Wire buttons (Start→`startTimer()`, Stop→`stopTimer()`, Reset→`resetTimer()`, Lap→`recordLap()`, Export→`exportToCSV()`), update button visibility, disable Lap when stopped | `frontend/src/ui-stopwatch/index.js` | [ ] |
| **T022** [P] | Style Stopwatch UI | Create layout (flexbox), meet WCAG AA contrast 4.5:1 (normal), 3:1 (large), include focus indicators, font size ≥14px | `frontend/src/ui-stopwatch/index.css` | [ ] |

---

### Phase 3.7: Testing & Integration (4 tasks - SEQUENTIAL)

| Task ID | Title | Description | File Path | Status |
|---------|-------|-------------|-----------|--------|
| **T023** | Write Playwright smoke test | Scenario: Start → wait 1+ sec → Lap at ~1:00 → Lap at ~2:30 → Stop → Export → Reload page (verify timer resumed) | `frontend/e2e/stopwatch.spec.ts` | [ ] |
| **T024** | Verify coverage ≥40% | Run `npm run test:coverage -- frontend/src/ui-stopwatch/`, confirm statement coverage ≥40%, add tests if <40% | `frontend/tests/ui-stopwatch.test.js` | [ ] |
| **T025** | Verify Vitest tests pass | Run `npm run test:vitest`, confirm T002-T007 contract tests pass, no console errors | `frontend/tests/ui-stopwatch.test.js` | [ ] |
| **T026** | Verify Playwright tests pass | Run `npm run test:e2e -- e2e/stopwatch.spec.ts`, confirm all scenarios pass, no timeouts, CSV exports correctly | `frontend/e2e/stopwatch.spec.ts` | [ ] |

---

### Phase 3.8: Accessibility Audit & Fixes [P] (4 tasks - PARALLEL)

| Task ID | Title | Description | File Path | Status |
|---------|-------|-------------|-----------|--------|
| **T027** [P] | Audit contrast ratios | Use WebAIM/WAVE on all 5 UIs, identify text <4.5:1 (normal) or <3:1 (large), document in `frontend/ACCESSIBILITY_AUDIT.md` | `frontend/src/ui-{stopwatch,quote,temp,expense,todo}/` | [ ] |
| **T028** [P] | Audit keyboard navigation | Tab through all UIs, verify focus order logical, focus indicator visible, document in `frontend/ACCESSIBILITY_AUDIT.md` | `frontend/src/ui-{stopwatch,quote,temp,expense,todo}/` | [ ] |
| **T029** [P] | Audit screen reader labels | Check all buttons/inputs have labels (implicit or explicit aria-label), test with accessibility tree, document missing labels | `frontend/src/ui-{stopwatch,quote,temp,expense,todo}/` | [ ] |
| **T030** [P] | Fix contrast issues | Update CSS to meet 4.5:1 (normal) and 3:1 (large) ratios, verify with WebAIM | `frontend/src/ui-{stopwatch,quote,temp,expense,todo}/index.css` | [ ] |

---

### Phase 3.9: Polish & Validation (4 tasks - SEQUENTIAL)

| Task ID | Title | Description | File Path | Status |
|---------|-------|-------------|-----------|--------|
| **T031** | Fix focus & labels | Add missing aria-label, ensure focus indicator visible (CSS :focus-visible with 3px outline), verify tab order, test with screen reader | `frontend/src/ui-{stopwatch,quote,temp,expense,todo}/index.{js,css}` | [ ] |
| **T032** | Test localStorage edge cases | Test private browsing (localStorage unavailable), verify "Session-only mode" message, timer works without persistence, no crashes | `frontend/src/ui-stopwatch/persistence.js` | [ ] |
| **T033** | Test CSV export format | Generate CSV with 2+ laps, open in Excel/Google Sheets, verify columns align, values correct, no encoding issues (UTF-8) | `frontend/src/ui-stopwatch/exporter.js` | [ ] |
| **T034** | Generate coverage reports | Run `npm run test:coverage`, update reports in review-packet, verify ui-stopwatch ≥40%, check for regressions | `frontend/coverage/` | [ ] |

---

## How to Create Sub-Issues in Linear

### Option 1: GitHub Actions Workflow (Automated) ✅
The workflow is already pushed. To trigger:
1. Go to: https://github.com/Maximus-Technologies-Uganda/training-prince/actions
2. Find: "Create Linear Sub-Issues for PRI-1412"
3. Click "Run workflow" 
4. Leave parent_id as: `PRI-1412`
5. Click "Run workflow"

### Option 2: Manual Creation
Copy each task from the table above and create as sub-issue in Linear under PRI-1412.

### Option 3: Run Script Locally (requires LINEAR_API_KEY)
```bash
LINEAR_API_KEY="your-key" node create-sub-issues-pri1412.mjs
```

---

## Execution Flow

```
T001 (Setup)
   ↓
T002-T007 (Contract Tests) [PARALLEL]
   ↓ (MUST FAIL before implementation)
T008-T010 (Data Models) [PARALLEL]
   ↓
T011-T016 (Core Implementation) [Sequential]
   ↓
T017-T018 (Persistence & DOM)
   ↓
T019-T022 (UI Components) [PARALLEL]
   ↓
T023-T026 (Testing)
   ↓
T027-T030 (a11y Audits) [PARALLEL, can start earlier]
   ↓
T031-T034 (Polish)
```

---

## Status Tracking

After workflow completes, all sub-issues will appear under PRI-1412 in Linear with:
- ✅ Task ID in title
- ✅ Description with file paths
- ✅ Status: Backlog
- ✅ Mapped to parent

**Ready to begin Phase 3.2 contract tests (T002-T007)!** 🚀
