# Feature Specification: UI Stopwatch

**Feature Branch**: `002-what-build-a`  
**Created**: 2025-10-06  
**Status**: Draft  
**Input**: User description: "What: Build a UI for the stopwatch application with Start, Stop, and Reset buttons, plus an \"Export CSV\" feature for lap data. The UI must use the existing core logic. Why: To provide a simple graphical interface for timing events and exporting lap data. Acceptance: - Vitest tests for CSV output (golden file and empty state). - Playwright smoke test for start/stop functionality. - ≥40% statement coverage for the ui-stopwatch module."

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

## User Scenarios & Testing *(mandatory)*

### Primary User Story
As a user, I want to control a stopwatch with clear Start, Stop, and Reset actions and export captured lap data to CSV so I can time activities and share results easily.

### Acceptance Scenarios
1. Given the stopwatch is reset and idle, When I press Start, Then elapsed time begins increasing and the UI indicates running state.
2. Given the stopwatch is running, When I press Stop, Then elapsed time stops increasing and the UI indicates stopped state.
3. Given the stopwatch is running or stopped with recorded laps, When I press Reset, Then elapsed time returns to 00:00.000 and laps are cleared.
4. Given there are recorded laps, When I export to CSV, Then I receive a CSV file whose contents match the defined format (golden test).
5. Given there are no laps recorded, When I export to CSV, Then I receive a valid CSV with headers and no data rows (empty-state test).
6. Given the stopwatch is running, When I open the app and run the Playwright smoke, Then it can Start and Stop without error and UI reflects the state.

### Edge Cases
- Rapid successive Start/Stop clicks do not create invalid states; only one running instance is possible at a time.
- Reset while running behaves predictably: resets elapsed time and laps, leaving the stopwatch in an idle state.
- CSV export handles special characters in lap labels (if present) using proper CSV escaping.
- Export is available even when there are no laps (produces headers only), and is disabled if the UI cannot access lap data.
- Time formatting is consistent and stable (e.g., mm:ss.mmm) across the UI and CSV output.

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: Users MUST be able to Start, Stop, and Reset the stopwatch via clear UI controls.
- **FR-002**: Users MUST be able to record and view laps in a list with stable ordering.
- **FR-003**: Users MUST be able to export laps as a CSV file using the existing exporter behavior.
- **FR-004**: The UI MUST reflect running vs stopped states clearly and update elapsed time while running.
- **FR-005**: The system MUST prevent invalid concurrent states (e.g., multiple timers running simultaneously).
- **FR-006**: The UI MUST reuse existing core logic from `src/stopwatch/` for timing and from `src/stopwatch/exporter.js` for CSV generation without duplicating domain logic.
- **FR-007**: Vitest MUST include tests for CSV output: golden-file match (non-empty) and empty-state CSV.
- **FR-008**: A Playwright smoke MUST start and then stop the stopwatch successfully in a running build.
- **FR-009**: The `ui-stopwatch` module MUST achieve ≥40% statement coverage measured by Vitest; coverage MUST be included in the CI review packet.

*Example of marking unclear requirements:*
- **FR-006**: System MUST authenticate users via [NEEDS CLARIFICATION: auth method not specified - email/password, SSO, OAuth?]
- **FR-007**: System MUST retain user data for [NEEDS CLARIFICATION: retention period not specified]

### Key Entities *(include if feature involves data)*
- **StopwatchState**: running (boolean), startTimestamp (instant | null), elapsedMs (number), laps (Lap[])
- **Lap**: ordinal (number), lapDurationMs (number), cumulativeMs (number), label (string | null)

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
