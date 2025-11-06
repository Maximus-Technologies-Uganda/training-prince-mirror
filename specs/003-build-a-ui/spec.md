# Feature Specification: UI Stopwatch with CSV Export

**Feature Branch**: `003-build-a-ui`  
**Created**: 2025-10-06  
**Status**: Draft  
**Input**: User description: "Build a UI for the `stopwatch` application with Start, Stop, and Reset buttons, plus an "Export CSV" feature for lap data. The UI must use the existing core logic. Why: To provide a simple graphical interface for timing events and exporting lap data. Acceptance: - Vitest tests for CSV output (golden file and empty state). - Playwright smoke test for start/stop functionality. - ≥40% statement coverage for the `ui-stopwatch` module."

## Execution Flow (main)
```
1. Parse user description from Input
   → If empty: ERROR "No feature description provided"
2. Extract key concepts from description
   → Identify: actors, actions, data, constraints
3. For each unclear aspect:
   → Mark with [NEEDS CLARIFICATION: specific question]
4. Fill User Scenarios & Testing section
   → If no clear user flow: ERROR "Cannot determine user scenarios"
5. Generate Functional Requirements
   → Each requirement must be testable
   → Mark ambiguous requirements
6. Identify Key Entities (if data involved)
7. Run Review Checklist
   → If any [NEEDS CLARIFICATION]: WARN "Spec has uncertainties"
   → If implementation details found: ERROR "Remove tech details"
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines
- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, not developers

### Section Requirements
- **Mandatory sections**: Must be completed for every feature
- **Optional sections**: Include only when relevant to the feature
- When a section doesn't apply, remove it entirely (don't leave as "N/A")

### For AI Generation
When creating this spec from a user prompt:
1. **Mark all ambiguities**: Use [NEEDS CLARIFICATION: specific question] for any assumption you'd need to make
2. **Don't guess**: If the prompt doesn't specify something (e.g., "login system" without auth method), mark it
3. **Think like a tester**: Every vague requirement should fail the "testable and unambiguous" checklist item
4. **Common underspecified areas**:
   - User types and permissions
   - Data retention/deletion policies  
   - Performance targets and scale
   - Error handling behaviors
   - Integration requirements
   - Security/compliance needs

---

## User Scenarios & Testing (mandatory)

### Primary User Story
As a user, I want to control a stopwatch through a simple UI (Start, Stop, Reset) and export recorded laps to CSV so I can measure and share timing results.

### Acceptance Scenarios
1. Given the stopwatch is idle at 00:00.000, When I click Start, Then the elapsed time begins increasing and the Start button disables (or toggles to Stop).
2. Given the stopwatch is running, When I click Stop, Then elapsed time freezes and the Stop button disables (or toggles to Start).
3. Given the stopwatch has been started at least once, When I click Reset, Then elapsed time returns to 00:00.000 and laps are cleared.
4. Given I have captured one or more laps, When I click Export CSV, Then a CSV file is produced with headers and one row per lap in a stable column order.
5. Given there are no laps, When I click Export CSV, Then the CSV contains only headers with no data rows.
6. Given the stopwatch is running, When I capture a lap, Then the lap is added to the list with an increasing index and accurate timestamps relative to start.

### Edge Cases
- Starting when already running should have no effect and not duplicate timers.  
- Stopping when already stopped should have no effect.  
- Reset while running should be blocked or require confirmation [NEEDS CLARIFICATION: confirm reset behavior during run].  
- Exporting CSV with special characters in lap labels should properly escape values.  
- Very long runs (hours) should keep formatting consistent and not degrade UI responsiveness.

## Requirements (mandatory)

### Functional Requirements
- **FR-001**: Users MUST be able to Start the stopwatch from an idle or stopped state.
- **FR-002**: Users MUST be able to Stop the stopwatch from a running state.
- **FR-003**: Users MUST be able to Reset the stopwatch; resetting returns elapsed time to zero and clears laps.
- **FR-004**: Users MUST be able to capture laps while running; laps are recorded in order captured.
- **FR-005**: Users MUST be able to Export CSV of laps with header row and one row per lap.
- **FR-006**: The UI MUST use existing core stopwatch logic from `src/stopwatch/` (no duplication of domain logic).
- **FR-007**: The UI MUST display elapsed time with millisecond precision and consistent formatting.
- **FR-008**: The system MUST prevent duplicate timers or inconsistent state transitions (e.g., Start while already running).
- **FR-009**: The system MUST provide Playwright smoke test for start/stop flow.
- **FR-010**: The `ui-stopwatch` module MUST achieve ≥40% statement coverage measured by Vitest; include coverage in CI review packet.
- **FR-011**: The CSV export MUST be verified by Vitest via golden file comparison and empty-state snapshot.
- **FR-012**: Time computation MUST rely on an injectable clock abstraction for deterministic tests [reuse pattern from ui-todo].

### Key Entities (include if feature involves data)
- **StopwatchState**: elapsedMs (number), isRunning (boolean), laps (Lap[]), startedAt (timestamp|null).
- **Lap**: index (number), timestampMs (number), deltaMs (number), label (optional string).

---

## Review & Acceptance Checklist
*GATE: Automated checks run during main() execution*

### Content Quality
- [ ] No implementation details (languages, frameworks, APIs)
- [ ] Focused on user value and business needs
- [ ] Written for non-technical stakeholders
- [ ] All mandatory sections completed

### Requirement Completeness
- [ ] No [NEEDS CLARIFICATION] markers remain
- [ ] Requirements are testable and unambiguous  
- [ ] Success criteria are measurable
- [ ] Scope is clearly bounded
- [ ] Dependencies and assumptions identified

---

## Execution Status
*Updated by main() during processing*

- [ ] User description parsed
- [ ] Key concepts extracted
- [ ] Ambiguities marked
- [ ] User scenarios defined
- [ ] Requirements generated
- [ ] Entities identified
- [ ] Review checklist passed

---
