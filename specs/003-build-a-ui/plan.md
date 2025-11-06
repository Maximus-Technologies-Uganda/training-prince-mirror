
# Implementation Plan: UI Stopwatch with CSV Export

**Branch**: `003-build-a-ui` | **Date**: 2025-10-06 | **Spec**: `/Users/prnceb/Desktop/WORK/hello-world/specs/003-build-a-ui/spec.md`
**Input**: Feature specification from `/specs/003-build-a-ui/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure (frontend + root src)
   → Set Structure Decision based on project type (add ui-stopwatch to frontend)
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

## Summary
- Build a front-end UI to operate the existing `src/stopwatch/` core (start, stop, reset, lap) and export laps as CSV.  
- Provide tests: Vitest for CSV (golden + empty) and Playwright smoke for start/stop.  
- Achieve ≥40% statement coverage for `ui-stopwatch` and include results in review packet.

## Technical Context
- **Language/Version**: Node.js (ESM) with Vitest and Playwright (from existing project)
- **Primary Dependencies**: Existing core in `src/stopwatch/` (`core.js`, `exporter.js`, `index.js`)
- **Storage**: N/A (in-memory UI; CLI persists to file but UI does not)
- **Testing**: Vitest for unit tests, Playwright for smoke E2E (frontend)
- **Target Platform**: Browser UI (served from `frontend`)
- **Project Type**: Web (frontend + root `src/` domain logic)
- **Performance Goals**: Responsive lap capture; CSV export O(n) with small n
- **Constraints**: Deterministic tests via injectable clock abstraction; no duplication of domain logic
- **Scale/Scope**: Single-page UI module `frontend/src/ui-stopwatch/`

## Constitution Check
- UI reuses domain logic from `src/stopwatch/` via imports (no duplication).
- Deterministic testing requires injectable clock → provide `clock.js` adapter as in `ui-todo`.
- Tests before implementation (TDD) and coverage targets satisfied.

## Project Structure

### Documentation (this feature)
```
specs/003-build-a-ui/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/tasks)
```

### Source Code (repository root)
```
frontend/
└── src/
    └── ui-stopwatch/
        ├── index.js        # UI module (buttons, time display, lap list)
        ├── clock.js        # Injected clock abstraction (Date.now seam)
        ├── styles.css      # Minimal styles
        └── stopwatch.test.js  # Vitest unit tests for CSV and state transitions

src/
└── stopwatch/
    ├── core.js            # existing
    ├── exporter.js        # existing (table export helper)
    └── index.js           # CLI (unchanged)

frontend/e2e/
└── stopwatch.smoke.spec.ts  # Playwright smoke: start -> stop
```

**Structure Decision**: Add `frontend/src/ui-stopwatch/` mirroring the `ui-todo` approach with a `clock.js` seam and tests colocated in frontend.

## Phase 0: Outline & Research
1. Unknowns / NEEDS CLARIFICATION
   - Reset behavior while running (block vs confirm vs allow): default to block in UI; document.
   - CSV schema: headers and columns. Decide on headers: `Lap,Time` aligned with table exporter (tabs vs commas) → UI uses comma-separated CSV: `Lap,Time` while preserving `formatTime` output.
   - Lap capture from UI: provide a Lap button? Minimum scope keeps Start/Stop/Reset; lap capture supported for export tests. Add Lap button.
2. Research tasks
   - Patterns for injectable clocks in UI modules (reuse `ui-todo/clock.js`).
   - Convert table export to CSV lines using `formatTime` (verify separators/escaping).
3. Consolidate findings in `research.md` with decisions above and rationale.

## Phase 1: Design & Contracts
1. Data model (UI):
   - Elapsed ms, isRunning, laps: number[] (ms per lap), derived display string via `formatTime`.
2. Contracts:
   - UI actions: start(), stop(), reset(), lap(), exportCsv().
   - CSV: header `Lap,Time`, rows `index,formattedTime`.
3. Contract tests (Vitest):
   - CSV golden string when laps present; empty state header-only.
   - Guard invalid transitions (start while running; stop while stopped).
4. Scenarios (Playwright):
   - Start then Stop shows non-zero time and stable UI elements.

## Phase 2: Task Planning Approach
- Generate tasks from spec: tests first (Vitest CSV + guards), then UI wiring, then Playwright smoke, then coverage and docs.
- Mark [P] for items in different files (tests vs UI vs e2e) to enable parallelization.

## Phase 3+: Future Implementation
- Execute tasks file after /tasks generation following TDD.

## Complexity Tracking
| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | — | — |

## Progress Tracking
**Phase Status**:
- [ ] Phase 0: Research complete (/plan command)
- [ ] Phase 1: Design complete (/plan command)
- [ ] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [ ] Initial Constitution Check: PASS
- [ ] Post-Design Constitution Check: PASS
- [ ] All NEEDS CLARIFICATION resolved
- [ ] Complexity deviations documented

---
*Based on Constitution v1.1.0 - See `/memory/constitution.md`*
