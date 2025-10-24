# Implementation Tasks: Wednesday UI Polishing - Expense & To-Do Filtering

**Feature**: Wednesday UI Polishing - Expense and To-Do Filtering  
**Branch**: `feature/PRI-289-wednesday-ui-polishing`  
**Parent Linear Issue**: PRI-289 - "Wednesday: Polished UI Filters & Empty States for Expense & To-Do"  
**Date Created**: October 22, 2025

---

## Task List (24 Tasks)

### Phase 1: Contract Tests & Utilities Setup

- [x] Create filterUtils.js module with filter function stubs
- [x] Write Vitest unit tests for expense filtering logic
- [x] Write Vitest unit tests for to-do filtering logic
- [x] Write Playwright E2E smoke test for expense filtering
- [x] Write Playwright E2E smoke test for to-do filtering

### Phase 2: Implement Filter Logic (Make Tests Pass)

- [x] Implement filterExpensesByCategory() to make tests pass
- [x] Implement filterExpensesByMonth() to make tests pass
- [x] Implement filterExpensesByBoth() with AND logic
- [x] Implement filterTodosByStatus() to make tests pass
- [x] Implement filterTodosByPriority() to make tests pass
- [x] Implement filterTodosByBoth() with AND logic
- [x] Implement detectEmptyState() helper function

### Phase 3: Create Filter Components

- [x] Create ExpenseFilter React component with category & month dropdowns
- [x] Create ExpenseEmptyState component with icon & CTA button
- [x] Create TodoFilter component with status tabs & priority dropdown
- [x] Create TodoEmptyState component with icon & CTA button

### Phase 4: Integrate Components into Pages

- [x] Integrate ExpenseFilter component into expense page UI
- [x] Add filtering logic to ExpenseList component
- [x] Integrate TodoFilter component into to-do page UI
- [x] Add filtering logic to TodoList component

### Phase 5: Testing & Validation

- [x] Run Vitest unit tests and verify ≥50% coverage for UI modules
- [x] Run Playwright E2E smoke tests for filter functionality
- [x] Manually validate all quickstart test scenarios (12 scenarios)
- [x] Generate coverage reports and prepare PR documentation

---

## Detailed Task Descriptions

### Task 1: Create filterUtils.js module with filter function stubs
**File**: `frontend/src/utils/filterUtils.js`
**Functions to stub**:
- `filterExpensesByCategory(expenses, category)`
- `filterExpensesByMonth(expenses, month)`
- `filterExpensesByBoth(expenses, filters)`
- `filterTodosByStatus(todos, status)`
- `filterTodosByPriority(todos, priority)`
- `filterTodosByBoth(todos, filters)`
- `detectEmptyState(items, filters)`
- `resetFilters()`

**Acceptance**: File exists with all function signatures and JSDoc comments

---

### Task 2: Write Vitest unit tests for expense filtering logic
**File**: `frontend/tests/expense-filter.test.js`
**Tests**:
- filterExpensesByCategory() returns matching category items
- filterExpensesByCategory() returns all items when category is null
- filterExpensesByMonth() returns matching month items
- filterExpensesByMonth() returns all items when month is null
- filterExpensesByBoth() applies AND logic correctly
- filterExpensesByBoth() handles null filters
- detectEmptyState() identifies empty results

**Acceptance**: All 7 tests written and failing (TDD red phase)

---

### Task 3: Write Vitest unit tests for to-do filtering logic
**File**: `frontend/tests/todo-filter.test.js`
**Tests**:
- filterTodosByStatus() returns pending tasks
- filterTodosByStatus() returns completed tasks
- filterTodosByStatus() returns all items when status is 'all'
- filterTodosByPriority() returns matching priority items
- filterTodosByPriority() returns all items when priority is null
- filterTodosByBoth() applies AND logic correctly
- detectEmptyState() identifies empty todo results

**Acceptance**: All 7 tests written and failing (TDD red phase)

---

### Task 4: Write Playwright E2E smoke test for expense filtering
**File**: `frontend/e2e/expense-filter.spec.ts`
**Scenarios**:
- User selects category filter → list updates with matching items
- User selects month filter → list updates with matching items
- User applies both filters → AND logic applied correctly
- Empty state displays when no matches exist
- Clear filters button resets state and shows full list
- Filter update completes within 300ms performance target

**Acceptance**: All tests written and failing until implementation complete

---

### Task 5: Write Playwright E2E smoke test for to-do filtering
**File**: `frontend/e2e/todo-filter.spec.ts`
**Scenarios**:
- User clicks status filter (Pending/Completed/All) → list updates
- User selects priority filter → list updates with matching items
- User applies both filters → AND logic applied correctly
- Empty state displays when no matches exist
- Clear filters button resets state and shows full list
- Filter update completes within 300ms performance target

**Acceptance**: All tests written and failing until implementation complete

---

### Task 6: Implement filterExpensesByCategory() to make tests pass
**Function**: `filterUtils.filterExpensesByCategory(expenses, category)`
**Logic**: Filter expenses array by exact category match; null category returns all
**Tests passing**: 2 tests from Task 2
**Acceptance**: All category-related tests pass in `npm run test:unit`

---

### Task 7: Implement filterExpensesByMonth() to make tests pass
**Function**: `filterUtils.filterExpensesByMonth(expenses, month)`
**Logic**: Extract month from ISO date and match with filter month (1-12)
**Tests passing**: 2 tests from Task 2
**Acceptance**: All month-related tests pass

---

### Task 8: Implement filterExpensesByBoth() with AND logic
**Function**: `filterUtils.filterExpensesByBoth(expenses, filters)`