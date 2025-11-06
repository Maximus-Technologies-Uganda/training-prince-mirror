# UI Contracts — To-Do List

## DOM Elements & IDs
- `#todo-input`: `<input type="text">` — task text entry (focus returned here after add).
- `#todo-due`: `<input type="date">` — optional due date (ISO `YYYY-MM-DD`).
- `#todo-high`: `<input type="checkbox">` — marks task as high priority.
- `#todo-add`: `<button>` — submits new task; inline error shown if duplicate/invalid.
- `#todo-error`: `<p role="alert" aria-live="assertive">` — inline error feedback region.
- `#todo-list`: `<ul>` — container for task items; each child `<li.todo-item>` contains text and action buttons.
- `#filter-today`: `<input type="checkbox">` — toggles "due today" filter.
- `#filter-high`: `<input type="checkbox">` — toggles "high priority" filter.

## Item Template
Each `li.todo-item` contains:
- `.todo-item__text`: `<span>` with task label.
- `.todo-item__actions`: `<span>` containing:
  - Toggle button: `<button>` with dynamic label (`Toggle` / `Untoggle`) and `aria-label` mentioning task name.
  - Remove button: `<button>` with `aria-label="Remove task: {text}"`.

## Behavioral Contracts
- `todo-add` click → calls core `addTodo` through UI state helper. On success, clears text input and re-renders list.
- Toggle button click → calls core `toggleTodo`; UI re-renders list and clears errors.
- Remove button click → calls core `removeTodo`; UI re-renders immediately (no confirmation modal).
- Filters (`filter-today`, `filter-high`) change → recompute visible items using clock abstraction + high priority flag.
- Errors (duplicate, invalid date, empty text) → message rendered in `#todo-error` and focus moved to the region.

## Accessibility Expectations
- `#todo-error` uses `aria-live="assertive"` to announce validation issues immediately.
- Toggle and remove buttons must remain keyboard accessible (Tab order: text → due → high priority → add → today filter → high filter → list actions).
- Ensure color/contrast of priority indicators and completed state meets WCAG AA (to be handled in CSS when added).

## Clock Abstraction
- UI imports `createClock` returning object with `todayIso()`; tests may inject stub clock.
- "Due today" filter compares `todo.dueDate` string to `clock.todayIso()` output; both must be ISO `YYYY-MM-DD`.
