# Feature Specification: Thursday - Stopwatch UI Implementation and Accessibility Polish

**Feature Branch**: `014-thursday-stopwatch-ui`  
**Created**: October 24, 2025  
**Status**: Draft  
**Input**: User description: "Thursday: Stopwatch UI Implementation and Accessibility Polish - primary objective is to implement full-featured Stopwatch UI with persistence and CSV export; secondary objective is accessibility (a11y) review and tidy-up across all five UIs"

---

## User Scenarios & Testing

### Primary User Story

A user wants to time their workout sessions and keep track of split times (laps) without interrupting the timer. After completing their session, they want to export the lap times as a CSV file for analysis or record-keeping. The timer should persist across page refreshes so they don't lose their session data if their browser accidentally closes or they reload the page.

### Acceptance Scenarios

1. **Given** the Stopwatch UI is open and the timer is at 00:00:00, **When** the user clicks the Start button, **Then** the timer begins counting upward in real-time with time displayed in HH:MM:SS format.

2. **Given** the timer is running at 00:01:30, **When** the user clicks the Lap button, **Then** the current time (00:01:30) is recorded as a lap and added to a list of laps displayed below the timer, and the timer continues running.

3. **Given** the timer has recorded multiple laps, **When** the user clicks the Stop button, **Then** the timer pauses and displays the current elapsed time.

4. **Given** the timer is stopped, **When** the user clicks the Reset button, **Then** the timer returns to 00:00:00, all laps are cleared, and the UI is ready for a new session.

5. **Given** the user has recorded laps and stopped the timer, **When** the user clicks the Export to CSV button, **Then** a CSV file is downloaded containing the lap times in a readable format with proper headers.

6. **Given** the user has an active timer session with laps recorded, **When** the page is accidentally refreshed or reloaded, **Then** the timer continues from the last recorded time with all lap data intact.

7. **Given** the Quote, Temperature, Expense, To-Do, and Stopwatch UIs are displayed, **When** text contrast is measured, **Then** all text meets WCAG AA standards (4.5:1 for normal text, 3:1 for large text).

8. **Given** a user is navigating the interface using only a keyboard, **When** they press Tab to move through interactive elements, **Then** focus order is logical and all buttons/inputs are properly labeled for screen readers.

### Edge Cases

- How does the system behave if localStorage is unavailable or disabled? (Should provide graceful degradation or user warning)

---

## Requirements

### Functional Requirements

**Stopwatch Core Functionality:**
- **FR-001**: System MUST provide a Start button that initiates the timer when clicked and changes the button state/label to indicate the timer is running.
- **FR-002**: System MUST provide a Stop button that pauses the timer at the current elapsed time when clicked.
- **FR-003**: System MUST provide a Reset button that clears the timer to 00:00:00 and removes all recorded lap times.
- **FR-004**: System MUST display the elapsed time in HH:MM:SS format and update it in real-time while the timer is running. Timer duration is unlimited (no maximum cap; format expands beyond 24 hours as needed: HH can exceed 99 if necessary).

**Lap Tracking:**
- **FR-005**: System MUST provide a Lap button that records the current elapsed time without stopping the timer.
- **FR-006**: System MUST display a list of all recorded laps below the timer showing each lap's duration or time when recorded.
- **FR-007**: System MUST disable or ignore the Lap button when the timer is stopped (laps are only recordable while timer is actively running).
- **FR-008**: System MUST implement debouncing on the Lap button to prevent accidental duplicate lap entries; any Lap clicks within 100ms of the previous lap recording are ignored.

**Persistence:**
- **FR-009**: System MUST persist the minimal essential timer state to browser localStorage: startTime (timestamp), isRunning (boolean flag), and laps (array of lap times). No UI preferences or theme data should be persisted.
- **FR-010**: System MUST automatically restore the persisted timer state on page load and resume the timer from the correct elapsed time if it was running at the time of page unload.
- **FR-011**: System MUST calculate currentElapsedTime from startTime to accurately determine the elapsed duration since session began, accounting for any time passed during page reload.

**Export to CSV:**
- **FR-012**: System MUST provide an Export to CSV button that generates a CSV file containing all recorded laps.
- **FR-013**: System MUST format the CSV export with appropriate headers and lap data in a human-readable format.
- **FR-014**: System MUST trigger a browser download of the CSV file with a timestamped or descriptive filename when the export button is clicked.
- **FR-015**: System MUST include the following columns in the CSV export: Lap Number, Absolute Elapsed Time (HH:MM:SS), and Lap Duration/Split Time (time delta from previous lap in HH:MM:SS).

**Accessibility (a11y) Across All Five UIs:**
- **FR-016**: System MUST ensure all text in Quote, Temperature, Expense, To-Do, and Stopwatch UIs achieves a minimum contrast ratio of 4.5:1 for normal-weight text (< 700 font-weight) and 3:1 for large text (≥18pt or ≥14pt + bold) per WCAG AA standards.
- **FR-017**: System MUST verify that all interactive elements (buttons, inputs, links) are reachable via keyboard navigation with a logical, predictable tab order.
- **FR-018**: System MUST ensure all buttons and form controls have accessible labels that are announced by screen readers (via aria-label, aria-labelledby, or implicit labeling).
- **FR-019**: System MUST verify that focus indicators are visible and meet color contrast requirements for users navigating with keyboard.

### Key Entities

- **Timer State** (persisted): Minimal essential data for stopwatch recovery with attributes: startTime (Unix timestamp when session began), isRunning (boolean), laps (array of lap timestamps). No UI state or preferences are persisted.
- **Lap Record**: Represents a single lap entry with attributes: lapTime (elapsed time when lap was recorded), lapNumber (sequential index), recordedAt (timestamp), lapDuration (delta time from previous lap, null for first lap).
- **Exported CSV**: A downloadable file containing lap records with columns: Lap Number, Absolute Elapsed Time (HH:MM:SS), and Lap Duration (HH:MM:SS delta from previous lap).

---

## Review & Acceptance Checklist

### Content Quality
- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness
- [x] No [NEEDS CLARIFICATION] markers remain - all 5 critical ambiguities resolved
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

---

## Clarifications Needed

*(All critical clarifications have been resolved in this session.)*

## Clarifications Session (October 24, 2025)

- Q: Should laps be recordable only while timer is running, or also while paused? → A: **Laps only recordable while timer is running**; Lap button disabled/inactive when stopped.
- Q: What data should CSV export include? → A: **Both absolute elapsed time AND lap duration** in separate columns.
- Q: What should be persisted to storage? → A: **Minimal essential data only**: startTime, isRunning flag, and recorded laps (no UI state/preferences).
- Q: What is the maximum timer duration? → A: **Unlimited** (no explicit cap; system handles as high as JavaScript allows).
- Q: How should rapid Lap button clicks be handled? → A: **Implement debouncing (100ms threshold)**: ignore clicks within 100ms of previous lap.

---

## Execution Status

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [x] Review checklist initialized

---
