# Data Model: Expense & To-Do Filtering

**Feature**: Wednesday UI Polishing - Expense and To-Do Filtering
**Date**: October 22, 2025
**Version**: 1.0

---

## Entity Overview

```
┌─────────────────┐         ┌─────────────────┐         ┌──────────────┐
│   Expense       │         │   To-Do Item    │         │ Filter State │
├─────────────────┤         ├─────────────────┤         ├──────────────┤
│ - id (PK)       │         │ - id (PK)       │         │ - category?  │
│ - description   │         │ - title         │         │ - month?     │
│ - amount        │         │ - description   │         │ - status     │
│ - category      │─────────│ - status        │         │ - priority?  │
│ - date          │         │ - priority      │         │              │
│ - timestamp     │         │ - createdAt     │         │ (In-Memory)  │
└─────────────────┘         └─────────────────┘         └──────────────┘
     (Persisted)                 (Persisted)            (Session-Only)
   data/expenses.json         data/todos.json
```

---

## Entities

### 1. Expense

**Location**: `data/expenses.json` (persisted backend)

**Fields**:

| Field | Type | Required | Constraints | Notes |
|-------|------|----------|-------------|-------|
| `id` | number | ✓ | Unique, auto-generated | Primary key |
| `description` | string | ✓ | Non-empty, ≤200 chars | User-provided label |
| `amount` | number | ✓ | > 0 | Currency value (dollars) |
| `category` | string | ✓ | Non-empty | System-defined; derived from user input |
| `date` | string (ISO 8601) | ✓ | Valid date format | "YYYY-MM-DD" |
| `timestamp` | string (ISO 8601) | ✓ | Valid datetime | "YYYY-MM-DDTHH:MM:SS.000Z" |

**Example Record**:
```json
{
  "id": 1,
  "description": "Coffee",
  "amount": 3.50,
  "category": "Food",
  "date": "2024-10-15",
  "timestamp": "2024-10-15T08:30:00.000Z"
}
```

**Lifecycle**:
1. Created by user via "Add Expense" form
2. Stored in `data/expenses.json`
3. Retrieved and rendered in Expense UI
4. Can be filtered by category and month
5. Deleted only via backend (out of scope for this feature)

**Filter Keys**:
- `category` → Exact match filter
- `date` → Extract month/year for range or specific month filter

---

### 2. To-Do Item

**Location**: `data/todos.json` (persisted backend)

**Fields**:

| Field | Type | Required | Constraints | Notes |
|-------|------|----------|-------------|-------|
| `id` | number | ✓ | Unique, auto-generated | Primary key |
| `title` | string | ✓ | Non-empty, ≤100 chars | Task name |
| `description` | string | ✗ | ≤500 chars | Optional details |
| `status` | enum | ✓ | 'pending' \| 'completed' | Task state |
| `priority` | enum | ✓ | 'High' \| 'Medium' \| 'Low' | Urgency level |
| `createdAt` | string (ISO 8601) | ✓ | Valid datetime | Auto-generated on creation |

**Example Record**:
```json
{
  "id": 1,
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "status": "pending",
  "priority": "High",
  "createdAt": "2024-10-22T10:00:00.000Z"
}
```

**Lifecycle**:
1. Created by user via "Add To-Do" form with title, description, priority
2. Default status: 'pending'
3. Stored in `data/todos.json`
4. Retrieved and rendered in To-Do UI
5. Status toggled by checkbox (pending ↔ completed)
6. Can be filtered by status and priority
7. Deleted via delete action (out of scope for this feature)

**Filter Keys**:
- `status` → Exact match ('pending', 'completed', or 'all' for no filter)
- `priority` → Exact match ('High', 'Medium', 'Low', or null for no filter)

---

### 3. FilterState

**Location**: In-memory (frontend component state)
**Persistence**: Session-only (resets on page close/refresh)
**Scope**: Separate instance per page (Expense page vs. To-Do page)

**Expense FilterState**:

| Field | Type | Default | Constraints | Notes |
|-------|------|---------|-------------|-------|
| `category` | string \| null | null | Non-empty if set; must exist in data | Exact match to expense category |
| `month` | number \| null | null | 1-12 or null | Filters by calendar month |

**Example State**:
```javascript
{
  category: "Food",
  month: 10
}
```

**Interaction**:
- User selects category dropdown → Sets `category` field
- User selects month dropdown → Sets `month` field
- Both filters apply with AND logic (category AND month)
- Filters displayed in dropdown/select UI
- "Clear Filters" button resets to `{ category: null, month: null }`

---

**To-Do FilterState**:

| Field | Type | Default | Constraints | Notes |
|-------|------|---------|-------------|-------|
| `status` | enum | 'all' | 'all' \| 'pending' \| 'completed' | Enum; 'all' shows unfiltered list |
| `priority` | string \| null | null | 'High' \| 'Medium' \| 'Low' \| null | Null = no filter; exact match |

**Example State**:
```javascript
{
  status: "pending",
  priority: "High"
}
```

**Interaction**:
- User selects status button/tab → Sets `status` field
- User selects priority dropdown → Sets `priority` field
- Both filters apply with AND logic (status AND priority)
- "All" status + null priority = unfiltered list
- "Clear Filters" button resets to `{ status: 'all', priority: null }`

---

## Validation Rules

### Expense Filters

**Category Validation**:
- Must be non-empty string
- Must exist in loaded expense data (derived dynamically)
- Exact string match required (case-sensitive)

**Month Validation**:
- Must be integer 1-12, or null
- If set, filters by that calendar month regardless of year
- Null = include all months

**Null Filter Behavior**:
- `null` category → Include all categories
- `null` month → Include all months

---

### To-Do Filters

**Status Validation**:
- Must be exactly 'all', 'pending', or 'completed'
- 'all' is default and means no status filtering
- Case-sensitive string comparison

**Priority Validation**:
- Must be 'High', 'Medium', 'Low', or null
- Null = include all priorities
- Case-sensitive (capitalized priority names)
- If set, exact match required

**Null Filter Behavior**:
- `null` priority → Include all priorities
- status 'all' + null priority → Unfiltered (show all to-dos)

---

## Relationships

### Expense ↔ FilterState

**Filter Application Logic**:
```
filtered_expenses = expenses.filter(expense => {
  const categoryMatch = !filterState.category || expense.category === filterState.category
  const monthMatch = !filterState.month || extractMonth(expense.date) === filterState.month
  return categoryMatch && monthMatch
})
```

**Empty State Trigger**:
- If `filtered_expenses.length === 0`:
  - Show "No matching expenses found" if filters applied
  - Show "No expenses yet" if no filters applied

---

### To-Do Item ↔ FilterState

**Filter Application Logic**:
```
filtered_todos = todos.filter(todo => {
  const statusMatch = filterState.status === 'all' || todo.status === filterState.status
  const priorityMatch = !filterState.priority || todo.priority === filterState.priority
  return statusMatch && priorityMatch
})
```

**Empty State Trigger**:
- If `filtered_todos.length === 0`:
  - Show "No matching tasks found" if filters applied
  - Show "No tasks yet" if no filters applied

---

## State Transitions

### Expense FilterState Transitions

```
Initial State: { category: null, month: null }
       ↓
User selects category → { category: "Food", month: null }
       ↓
User selects month → { category: "Food", month: 10 }
       ↓
User clicks "Clear Filters" → { category: null, month: null }
       ↓
Page closes/refreshes → [State lost, resets to Initial]
```

---

### To-Do FilterState Transitions

```
Initial State: { status: 'all', priority: null }
       ↓
User clicks "Pending" tab → { status: 'pending', priority: null }
       ↓
User selects "High" priority → { status: 'pending', priority: 'High' }
       ↓
User clicks "All" tab → { status: 'all', priority: 'High' }
       ↓
User clicks "Clear Filters" → { status: 'all', priority: null }
       ↓
Page closes/refreshes → [State lost, resets to Initial]
```

---

## Performance Considerations

**Filter Execution**:
- Linear scan: O(n) where n = number of items
- Typical performance: 5-20ms for 100-1000 items
- Well under 300ms target

**State Management**:
- FilterState stored in component local state
- No external state library required
- State updates trigger component re-render only
- No network calls needed

**Empty State Rendering**:
- Computed on every render (not cached)
- Simple boolean check: `list.length === 0`
- Negligible performance cost

---

## Integration Points

### Data Source
- Expenses loaded from `data/expenses.json` via backend API or direct load
- To-Dos loaded from `data/todos.json` via backend API or direct load

### Components
- **ExpenseFilter** component manages Expense FilterState
- **TodoFilter** component manages To-Do FilterState
- **ExpenseList** component consumes filtered expense list
- **TodoList** component consumes filtered to-do list
- **ExpenseEmptyState** component displays when list is empty
- **TodoEmptyState** component displays when list is empty

### Event Flow
1. User interacts with filter control
2. Component updates FilterState
3. Component re-renders with filtered data
4. If empty, empty state component displays

---

## Testing Implications

**Vitest Unit Tests**:
- `filterExpensesByCategory()` - isolate category filter logic
- `filterExpensesByMonth()` - isolate month filter logic
- `filterExpensesByBoth()` - test AND logic for multiple filters
- `filterTodosByStatus()` - isolate status filter logic
- `filterTodosByPriority()` - isolate priority filter logic
- `filterTodosByBoth()` - test AND logic for multiple filters
- `detectEmptyState()` - verify empty state detection
- `resetFilters()` - verify filter state reset

**Playwright E2E Tests**:
- User selects category filter; list updates (expense-filter.spec.ts)
- User selects month filter; list updates (expense-filter.spec.ts)
- User applies both filters; list updates correctly (expense-filter.spec.ts)
- Empty state displays when no matches (expense-filter.spec.ts)
- User selects status filter; list updates (todo-filter.spec.ts)
- User selects priority filter; list updates (todo-filter.spec.ts)
- Empty state displays when no matches (todo-filter.spec.ts)

---

*Data Model completed by /plan command on 2025-10-22*
