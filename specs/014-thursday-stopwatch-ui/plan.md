
# Implementation Plan: Thursday - Stopwatch UI Implementation and Accessibility Polish

**Branch**: `014-thursday-stopwatch-ui` | **Date**: October 24, 2025 | **Spec**: `specs/014-thursday-stopwatch-ui/spec.md`
**Input**: Feature specification with 5 resolved clarifications (lap behavior, CSV format, persistence scope, duration limit, debouncing)

## Summary

Implement a full-featured Stopwatch UI with Start/Stop/Reset/Lap controls, localStorage persistence, and CSV export functionality. The implementation follows the constitution's core principles: import/reuse existing `src/stopwatch` core logic; achieve ≥40% statement coverage via Vitest + one Playwright smoke test; maintain <300 LOC change constraint across incremental PRs. Secondary objective: conduct WCAG AA accessibility audit (4.5:1 contrast, keyboard nav, screen reader labels) across all five existing UIs and apply targeted fixes.

## Technical Context

**Language/Version**: JavaScript (ES6+), Vite build system  
**Primary Dependencies**: Vite, Vitest, Playwright, Vanilla DOM APIs, localStorage, CSV generation library (e.g., csv-stringify or simple string building)  
**Storage**: Browser localStorage (minimal state: startTime, isRunning, laps array)  
**Testing**: Vitest (unit, ≥40% coverage), Playwright (smoke test: start → lap → stop → export flow)  
**Target Platform**: Web browser (modern ES6+ support)  
**Project Type**: Web application (frontend-only component; backend core logic in `src/stopwatch/core.js`)  
**Performance Goals**: Real-time timer updates (smooth 60 FPS UI updates); 100ms debounce on Lap button  
**Constraints**: PR ≤300 LOC per merge; no localStorage availability → graceful degradation; unlimited timer duration (format expansion for HH > 99)  
**Scale/Scope**: Single UI feature + accessibility audit of 5 existing UIs; estimated 8-12 new tests; 2-3 PRs for full feature + accessibility polish

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. No Logic Duplication ✅
- Stopwatch UI will import timer core logic from existing `src/stopwatch/core.js` (already implemented CLI; reuse its logic)
- UI handles presentation, event dispatch, localStorage sync, CSV export (UI-only responsibilities)
- **Status**: PASS (Stopwatch core already extracted in `src/stopwatch/core.js`)

### II. Test Coverage Mandate ✅
- Target: ≥40% statement coverage for new `frontend/src/ui-stopwatch/` module
- Unit tests: Vitest covering timer state management, CSV formatting, persistence handlers
- Smoke test: Playwright single flow (start → lap → stop → export) validates end-to-end UI contract
- Existing UIs a11y fixes: no coverage requirement (documentation/audit scope)
- **Status**: PASS (achievable target with focused test strategy)

### III. Reviewability is Paramount ✅
- Each PR will include updated coverage reports (separate before/after for ui-stopwatch module)
- PR description includes coverage table (new UI + any a11y fixes to existing UIs)
- Artifacts indexed in review-packet/index.html
- **Status**: PASS (CI/coverage infrastructure already in place)

### IV. PR Craft ✅
- Feature split into 2-3 incremental PRs (each <300 LOC):
  - PR1: Stopwatch UI + persistence (Start/Stop/Reset/Lap + localStorage sync)
  - PR2: Stopwatch UI export (CSV generation + download)
  - PR3: Accessibility fixes (contrast/focus/labels audit + targeted fixes across 5 UIs)
- All PRs: pass ESLint/Prettier, Vitest, Playwright, Vite build
- PR descriptions: full coverage table + spec link
- **Status**: PASS (incremental approach enables <300 LOC per PR)

### V. Simplicity & Consistency ✅
- Tech stack: Vite, Vitest, Playwright, Vanilla JS (no new tools)
- Simple state management: localStorage + direct DOM manipulation (no state library needed)
- CSV export: native Blob + download link (no external CSV lib unless already available)
- a11y fixes: inline ARIA labels, CSS contrast tweaks (no new accessibility framework)
- **Status**: PASS (stays within project conventions)

## Project Structure

### Documentation (this feature)
```
specs/014-thursday-stopwatch-ui/
├── spec.md                 # Feature specification (completed with 5 clarifications)
├── plan.md                 # This file (/plan command output)
├── research.md             # Phase 0 output (/plan command) - TBD
├── data-model.md           # Phase 1 output (/plan command) - TBD
├── quickstart.md           # Phase 1 output (/plan command) - TBD
├── contracts/              # Phase 1 output (/plan command) - TBD
│   └── stopwatch-ui.contract.js  # Contract tests for UI module
└── tasks.md                # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (Web Application)
```
backend/ (existing, shared core logic)
├── src/
│   ├── stopwatch/
│   │   ├── core.js         # Existing timer logic (reused by UI)
│   │   └── core.test.js
│   ├── quote/, expense/, temp-converter/, todo/
│   └── models/

frontend/ (this feature adds/modifies)
├── src/
│   ├── ui-stopwatch/         # NEW: Stopwatch UI (Phase 1 design output)
│   │   ├── index.js          # Main UI component + event handlers
│   │   ├── persistence.js    # localStorage sync handlers
│   │   ├── exporter.js       # CSV generation + download
│   │   └── index.css         # Styling (including a11y fixes)
│   ├── ui-quote/, ui-temp/, ui-expense/, ui-todo/  # MODIFIED: a11y audit fixes
│   ├── index.html
│   └── server.js
├── tests/                    # NEW: Unit tests for ui-stopwatch
│   ├── ui-stopwatch.test.js  # Vitest coverage ≥40%
│   └── …existing tests…
├── e2e/                      # NEW: Playwright smoke test
│   ├── stopwatch.spec.ts     # Smoke test: start → lap → stop → export
│   └── …existing e2e tests…
├── stopwatch.html            # NEW: Standalone Stopwatch page
└── vite.config.js, vitest.config.js (unchanged)
```

**Structure Decision**: Web application with frontend focus. Stopwatch UI module lives in `frontend/src/ui-stopwatch/` and imports reusable core from `src/stopwatch/core.js` (backend package). Accessibility audit spans all five existing UIs in `frontend/src/ui-*/`. Tests organized by Vitest (unit) + Playwright (e2e smoke) following project standards.

---

## Phase 0: Outline & Research

### Unknowns to Research
1. **CSV Generation Library**: Determine if `csv-stringify` or similar is available; if not, implement simple Blob-based export
2. **LocalStorage Availability Handling**: How to gracefully degrade if localStorage is unavailable (disable persistence, warn user, or fall back to session-only)
3. **WCAG AA Audit Scope**: Prioritize which of the 5 UIs need contrast/focus/label fixes (budget constraints)
4. **Existing Stopwatch Core API**: Confirm exact shape/exports of `src/stopwatch/core.js` and integrate with UI state management

### Research Tasks
1. **Task R1**: Research CSV export patterns in vanilla JavaScript (Blob API, download trigger, filename handling)
   - Decision: Use native Blob + `a.href = URL.createObjectURL(blob)` approach (no new dependency)
   - Rationale: Keeps code minimal, aligns with Simplicity principle
   - Alternative: csv-stringify npm package (adds dependency; evaluate if cost justified)

2. **Task R2**: Audit existing UI contrast ratios and a11y labeling
   - Decision: Use WebAIM Contrast Checker / WAVE browser extension; identify low-contrast text, missing labels
   - Rationale: Quick, automated discovery; documents baseline for fixes
   - Alternative: Manual audit (more thorough but time-consuming)

3. **Task R3**: Confirm `src/stopwatch/core.js` exports and performance characteristics
   - Decision: Load module, inspect API, test timer accuracy under page reload scenarios
   - Rationale: Ensures UI design aligns with core behavior
   - Alternative: Reimplement timer in UI (violates No Logic Duplication principle)

4. **Task R4**: localStorage failure modes and recovery
   - Decision: Wrap localStorage calls in try-catch; disable persistence if unavailable; user sees "Session-only mode" indicator
   - Rationale: Handles private browsing, quota exceeded, security policy restrictions gracefully
   - Alternative: Fail hard if localStorage unavailable (poor UX; not acceptable)

**Output**: research.md documenting decisions for all 4 research tasks

---

## Phase 1: Design & Contracts

### 1. Data Model (data-model.md)

**Key Entities**:

- **TimerState** (in-memory + persisted to localStorage)
  - `startTime`: Unix timestamp (null if stopped or reset)
  - `isRunning`: boolean (true = timer active)
  - `laps`: array of lap timestamps (Unix milliseconds)
  - Validation: startTime must be in past; isRunning must be boolean; laps must be sorted ascending
  - State transitions: [reset] → [start] → [running] → [stop] → [stopped] → [reset/start]

- **LapRecord** (derived in-memory; each lap entry)
  - `lapNumber`: sequential index (1, 2, 3, ...)
  - `absoluteTime`: elapsed time from session start (HH:MM:SS format display)
  - `lapDuration`: time delta from previous lap (HH:MM:SS format display)
  - `recordedAt`: Unix timestamp

- **ExportedCSV** (generated on export)
  - Headers: `Lap Number,Absolute Elapsed Time,Lap Duration`
  - Rows: one per lap, with numeric lap #, HH:MM:SS times, HH:MM:SS duration
  - File name: `stopwatch_export_{timestamp}.csv`
  - MIME type: `text/csv`

### 2. API Contracts (contracts/stopwatch-ui.contract.js)

**User Actions → UI Module Functions**:

| User Action | Function | Input | Output | Notes |
|-------------|----------|-------|--------|-------|
| Click Start | `startTimer()` | none | `{success: bool, newState: TimerState}` | Sets startTime, isRunning=true; persists to localStorage |
| Click Stop | `stopTimer()` | none | `{success: bool, newState: TimerState}` | isRunning=false; persists to localStorage |
| Click Reset | `resetTimer()` | none | `{success: bool, newState: TimerState}` | startTime=null, isRunning=false, laps=[]; clears localStorage |
| Click Lap | `recordLap()` | none | `{success: bool, newLap: LapRecord, newState: TimerState}` | Ignores if !isRunning; debounces 100ms; persists to localStorage |
| Click Export | `exportToCSV()` | none | `{success: bool, filename: string}` | Generates CSV Blob, triggers download, updates UI |
| Page Load | `restoreState()` | none | `{success: bool, state: TimerState, resumed: bool}` | Loads from localStorage; if isRunning=true, resumes timer from startTime |

### 3. Contract Tests (contracts/stopwatch-ui.contract.test.js)

Vitest contract tests validating each function's input/output schema:
- `startTimer()`: returns object with `{success: bool, newState: TimerState}`; sets isRunning=true; persists
- `stopTimer()`: returns object; sets isRunning=false; persists
- `resetTimer()`: clears all state; persists empty
- `recordLap()`: appends lap timestamp; enforces 100ms debounce (second call within 100ms returns error)
- `recordLap()` when stopped: returns error (not ignored silently)
- `exportToCSV()`: triggers download; generates CSV with 3 columns; file name includes timestamp
- `restoreState()`: retrieves from localStorage; calculates elapsed time correctly if isRunning=true at load

### 4. Acceptance Test Scenarios (quickstart.md)

**Quickstart Test Workflow** (Playwright):
```
Scenario: Full Stopwatch Workflow
  Given: User opens stopwatch.html
  When: Clicks Start button
  Then: Timer begins counting; display shows 00:00:01, 00:00:02, etc.
  
  When: Clicks Lap button at 00:01:00
  Then: Lap 1 recorded; lap list shows "Lap 1: 00:01:00, Duration: 00:01:00"
  
  When: Clicks Lap button again at 00:02:30
  Then: Lap 2 recorded; lap list shows "Lap 2: 00:02:30, Duration: 00:01:30"
  
  When: Clicks Stop button
  Then: Timer freezes at current time; stop button becomes Start
  
  When: Clicks Export to CSV button
  Then: File download triggered; file contains 2 laps with correct times and durations
  
  When: Reloads page without clearing localStorage
  Then: Timer resumes from stored startTime; both laps restored; continues counting

Scenario: Accessibility
  Given: User navigates with keyboard (Tab key)
  Then: Focus moves through Start → Stop → Reset → Lap → Export buttons in logical order
  And: All buttons have visible focus indicator
  
  Given: Screen reader enabled (e.g., NVDA)
  Then: All buttons announce their function (e.g., "Start button")
  And: Elapsed time and lap list are readable
  And: Text contrast meets WCAG AA (4.5:1 normal, 3:1 large)
```

### 5. Agent-Specific File Update

Execute `.specify/scripts/bash/update-agent-context.sh cursor` to generate/update `CLAUDE.md` with:
- New tech: Stopwatch UI module, localStorage recovery patterns, CSV Blob API, 100ms debouncing strategy
- Architecture decision: Reuse `src/stopwatch/core.js` for timer logic; UI layer handles presentation + persistence
- Key constraints: <300 LOC per PR, ≥40% coverage target, WCAG AA compliance

**Phase 1 Output**: data-model.md, contracts/stopwatch-ui.contract.js, contracts/stopwatch-ui.contract.test.js, quickstart.md, CLAUDE.md (updated)

---

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

### Task Generation Strategy

The `/tasks` command will:

1. **Generate contract test tasks [P]** (parallel):
   - Task: "Write contract test for startTimer() function" [P]
   - Task: "Write contract test for stopTimer() function" [P]
   - Task: "Write contract test for resetTimer() function" [P]
   - Task: "Write contract test for recordLap() + debounce logic" [P]
   - Task: "Write contract test for exportToCSV() function" [P]
   - Task: "Write contract test for restoreState() on page load" [P]

2. **Generate model/core reuse tasks [P]**:
   - Task: "Import and validate src/stopwatch/core.js API in UI context" [P]
   - Task: "Create TimerState entity with validation in frontend" [P]

3. **Generate implementation tasks (TDD order)**:
   - Task: "Implement startTimer() to pass contract tests"
   - Task: "Implement stopTimer() to pass contract tests"
   - Task: "Implement resetTimer() to pass contract tests"
   - Task: "Implement recordLap() with 100ms debounce to pass contract tests"
   - Task: "Implement exportToCSV() Blob + download to pass contract tests"
   - Task: "Implement restoreState() + timer resume logic to pass contract tests"

4. **Generate UI component tasks**:
   - Task: "Create stopwatch.html with buttons (Start, Stop, Reset, Lap, Export)"
   - Task: "Implement real-time display update (HH:MM:SS tick)" [P can run in parallel with logic]
   - Task: "Implement lap list rendering (show all recorded laps)" [P]
   - Task: "Add CSS styling for buttons, timer display, lap list (including a11y contrast)" [P]

5. **Generate integration & smoke test tasks**:
   - Task: "Write Playwright smoke test: start → lap → stop → export workflow"
   - Task: "Verify coverage ≥40% for ui-stopwatch module"

6. **Generate accessibility audit + fix tasks** (lower priority / separate PR):
   - Task: "Audit Quote, Temp, Expense, Todo UIs for WCAG AA contrast (4.5:1, 3:1)"
   - Task: "Audit all 5 UIs for keyboard navigation + focus indicators"
   - Task: "Audit all 5 UIs for screen reader labels (ARIA / implicit)"
   - Task: "Fix identified contrast issues (update CSS)" [P]
   - Task: "Fix identified focus/label issues" [P]

### Ordering & Dependencies

**TDD-First Order**:
1. Contract tests (all [P] - parallel)
2. Core imports + validation (all [P] - parallel)
3. startTimer() implementation + test
4. stopTimer() implementation + test
5. resetTimer() implementation + test
6. recordLap() + debounce implementation + test
7. exportToCSV() implementation + test
8. restoreState() implementation + test
9. UI component HTML/display (can start in parallel with step 3, depends on startTimer working)
10. Real-time tick update + lap list rendering
11. Styling (CSS, including a11y fixes)
12. Playwright smoke test
13. Coverage verification
14. Accessibility audit & fixes (separate PR)

**Estimated Task Count**: 20-25 implementation + test tasks (stopwatch) + 8-10 a11y tasks (5 UIs) = 28-35 total

**Estimated PR Structure**:
- PR1: Stopwatch UI core (Start/Stop/Reset/Lap/Persist) - ~40 tasks, <300 LOC frontend change
- PR2: Stopwatch Export (CSV) - ~10 tasks, <150 LOC
- PR3: Accessibility audit + fixes - ~15 tasks, <200 LOC (spread across 5 UIs)

---

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution  
- `/tasks` command creates tasks.md with all 28-35 ordered tasks
- Each task references contract test(s) and acceptance criteria
- Tasks marked [P] can execute in parallel (separate files/concerns)

**Phase 4**: Implementation  
- Execute tasks.md following TDD: tests first, then implementation
- Each PR: ≤300 LOC, pass all tests, pass ESLint/Prettier, update coverage reports
- Update PR description template with coverage table + spec link

**Phase 5**: Validation  
- Run Vitest suite: confirm ≥40% coverage for ui-stopwatch
- Run Playwright e2e: confirm quickstart workflow passes
- Manual a11y audit: contrast checker, NVDA/JAWS testing for labels + focus
- Build verification: `npm run build` succeeds; dist/ ready for deployment

---

## Complexity Tracking

*No violations detected. Constitution Check fully PASS.*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|-----------|-----|
| (none) | (all principles satisfied) | (N/A) |

---

## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research outline complete (no external research needed; decisions in Phase 0 section above)
- [x] Phase 1: Design complete (data model, contracts, test scenarios, agent file planned)
- [x] Phase 2: Task planning approach described (TDD order, parallelization strategy, 28-35 task estimate)
- [ ] Phase 3: Tasks generated (/tasks command - NOT created by /plan)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS (all 5 principles satisfied)
- [x] Post-Design Constitution Check: PASS (design adheres to all constraints)
- [x] All NEEDS CLARIFICATION resolved (5 clarifications from /clarify session documented)
- [x] Complexity deviations documented (none)

---

*Based on Constitution v1.1.0 - See `/memory/constitution.md`*
