# Data Model — UI To-Do

## Entities

### ToDoItem
- **id**: string (stable identifier provided by core when persisted; fallback to index for in-memory)
- **text**: string (original user-entered task label)
- **completed**: boolean (`false` when active, `true` when toggled complete)
- **dueDate**: string | null (ISO `YYYY-MM-DD`; null when not specified)
- **isHighPriority**: boolean (true when user marks task high priority)

### UiState
- **items**: `ToDoItem[]` (reflects current list returned from core operations)
- **error**: string | null (current inline error message)
- **filters**: `FilterState`

### FilterState
- **dueToday**: boolean (true when "show only due today" is active)
- **highPriority**: boolean (true when "show only high priority" is active)

## Derived Data
- **VisibleItems**: result of applying filters serially (`dueToday` → `highPriority`) to `UiState.items`.  
- **Counts**: optional derived totals (all items vs. filtered) for future enhancements; not part of minimal UI scope but noted for coverage.

## Relationships & Constraints
- `UiState.items[*]` derives from `src/todo/core.js` operations; UI MUST not mutate items outside these helpers.
- Duplicate detection is based on normalized `text` plus `dueDate`; duplicates are rejected before reaching core.
- `dueToday` evaluation uses injected clock abstraction (`clock.todayIso()`) to compare ISO date strings; UI MUST avoid direct `Date.now()` usage.
- Removing/toggling operations rely on item index mapping to the core-managed list; UI should re-render after each mutation to keep indices aligned.
