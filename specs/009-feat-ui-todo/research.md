# Research — UI To-Do

## Decisions
- **Core integration**: Reuse `src/todo/core.js` helpers (`addTodo`, `toggleTodo`, `removeTodo`, persistence hooks) directly in the UI state layer; extend returned items in-place for UI-only attributes (due date ISO string, `isHighPriority`).
- **Clock abstraction**: Inject a shared clock object that exposes `todayIso()` so the UI can evaluate "due today" via calendar date comparison without relying on `Date.now()` directly.
- **Duplicate detection**: Normalize task text (trim + lowercase + collapse whitespace) and pair with due date to guard against duplicate entries; surface inline error beside the add form.
- **Filtering pipeline**: Apply filters in deterministic order (due-today first, then high-priority) on the already-mutated UI state to keep results predictable and coverage-friendly.
- **Accessibility feedback**: Use an inline error region with `aria-live="assertive"` for validation issues (duplicate, invalid date) and ensure focus/announced updates when errors appear.

## Rationale
- Centralizing business rules in the core module honours the "No Logic Duplication" constitution clause and cuts maintenance overhead.
- The clock abstraction makes due-date boundaries easy to test by swapping clock implementations in unit tests; avoids brittle reliance on system time.
- Duplicate guard prevents silent data corruption and matches spec expectation for inline feedback without breaking existing tasks.
- A consistent filter order simplifies reasoning about combined filters and is easy to cover with table-driven unit tests.
- Inline aria-live errors keep assistive technology users informed immediately while maintaining visual continuity around the form.

## Alternatives Considered
- **Local clone of core logic**: Rejected; violates constitution and risks drift.
- **System time checks (`new Date()`)**: Rejected; hard to test deterministically and breaks timezone requirements.
- **Modal/Toast duplicate warnings**: Rejected; spec mandates inline error near add form for clarity and minimal disruption.
- **Filter via separate derived arrays for each toggle**: Rejected; single pipeline keeps complexity low and avoids redundant iterations at current scale.
- **Global error banner**: Rejected; inline form feedback aligns better with user focus and accessibility guidelines.
