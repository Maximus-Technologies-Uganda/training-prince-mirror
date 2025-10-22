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

- [ ] Integrate ExpenseFilter component into expense page UI
- [ ] Add filtering logic to ExpenseList component
- [ ] Integrate TodoFilter component into to-do page UI
- [ ] Add filtering logic to TodoList component

### Phase 5: Testing & Validation

- [ ] Run Vitest unit tests and verify ≥50% coverage for UI modules
- [ ] Run Playwright E2E smoke tests for filter functionality
- [ ] Manually validate all quickstart test scenarios (12 scenarios)
- [ ] Generate coverage reports and prepare PR documentation

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
**Logic**: Apply both category AND month filters (both must match)
**Tests passing**: 2 tests from Task 2
**Acceptance**: Combined filter tests pass; AND logic verified

---

### Task 9: Implement filterTodosByStatus() to make tests pass
**Function**: `filterUtils.filterTodosByStatus(todos, status)`
**Logic**: Handle 'all' (no filter), 'pending', 'completed' states
**Tests passing**: 3 tests from Task 3
**Acceptance**: All status-related tests pass

---

### Task 10: Implement filterTodosByPriority() to make tests pass
**Function**: `filterUtils.filterTodosByPriority(todos, priority)`
**Logic**: Match High/Medium/Low priorities; null = all priorities
**Tests passing**: 2 tests from Task 3
**Acceptance**: All priority-related tests pass

---

### Task 11: Implement filterTodosByBoth() with AND logic
**Function**: `filterUtils.filterTodosByBoth(todos, filters)`
**Logic**: Apply both status AND priority filters (both must match)
**Tests passing**: 2 tests from Task 3
**Acceptance**: Combined filter tests pass; AND logic verified

---

### Task 12: Implement detectEmptyState() helper function
**Function**: `filterUtils.detectEmptyState(items, filters)`
**Logic**: Return true if filtered list is empty
**Tests passing**: 2 tests (1 from Task 2, 1 from Task 3)
**Acceptance**: Empty state detection tests pass

---

### Task 13: Create ExpenseFilter React component with category & month dropdowns
**File**: `frontend/src/components/ExpenseFilter/index.js`
**Features**:
- Category dropdown (dynamically populated from expense data)
- Month dropdown (1-12 with month names)
- Clear Filters button
- Emit onFilter callback on any change

**Props**: `categories: string[]`, `onFilter: (filterState) => void`
**Acceptance**: Component renders; filters emit events; styled with CSS

---

### Task 14: Create ExpenseEmptyState component with icon & CTA button
**File**: `frontend/src/components/ExpenseEmptyState/index.js`
**Features**:
- Icon (inline SVG or emoji)
- Conditional message ("No matching expenses" vs "No expenses yet")
- CTA button ("Add Your First Expense" or "Clear Filters")
- Keyboard accessible

**Props**: `reason: 'filtered' | 'no-data'`, `onAddExpense`, `onClearFilters`
**Acceptance**: Component renders correctly for both reasons; buttons functional

---

### Task 15: Create TodoFilter component with status tabs & priority dropdown
**File**: `frontend/src/components/TodoFilter/index.js`
**Features**:
- Status filter tabs (All, Pending, Completed)
- Priority dropdown (All, High, Medium, Low)
- Clear Filters button
- Emit onFilter callback on any change

**Props**: `onFilter: (filterState) => void`
**Acceptance**: Component renders; filters emit events; styled with CSS

---

### Task 16: Create TodoEmptyState component with icon & CTA button
**File**: `frontend/src/components/TodoEmptyState/index.js`
**Features**:
- Icon (inline SVG or emoji)
- Conditional message ("No matching tasks" vs "No tasks yet")
- CTA button ("Create Your First Task" or "Clear Filters")
- Keyboard accessible

**Props**: `reason: 'filtered' | 'no-data'`, `onAddTodo`, `onClearFilters`
**Acceptance**: Component renders correctly for both reasons; buttons functional

---

### Task 17: Integrate ExpenseFilter component into expense page UI
**File**: `frontend/src/pages/expense.js` or main Expense component
**Changes**:
- Import ExpenseFilter component
- Add filter state management to page
- Pass onFilter callback
- Connect filter state to list rendering

**Acceptance**: Filter controls visible on page; no errors on interaction

---

### Task 18: Add filtering logic to ExpenseList component
**Changes**:
- Apply filter functions when filterState changes
- Show ExpenseEmptyState when list is empty
- Pass correct reason prop to empty state
- Ensure performance: updates complete < 300ms

**Acceptance**: List updates when filters applied; empty state displays correctly

---

### Task 19: Integrate TodoFilter component into to-do page UI
**File**: `frontend/src/pages/todo.js` or main Todo component
**Changes**:
- Import TodoFilter component
- Add filter state management to page
- Pass onFilter callback
- Connect filter state to list rendering

**Acceptance**: Filter controls visible on page; no errors on interaction

---

### Task 20: Add filtering logic to TodoList component
**Changes**:
- Apply filter functions when filterState changes
- Show TodoEmptyState when list is empty
- Pass correct reason prop to empty state
- Ensure performance: updates complete < 300ms

**Acceptance**: List updates when filters applied; empty state displays correctly

---

### Task 21: Run Vitest unit tests and verify ≥50% coverage for UI modules
**Commands**:
```bash
npm run test:unit
npm run test:coverage
```

**Acceptance Criteria**:
- All 14 unit tests pass (TDD green phase)
- Expense module: ≥50% coverage
- To-Do module: ≥50% coverage
- Coverage report generated

---

### Task 22: Run Playwright E2E smoke tests for filter functionality
**Commands**:
```bash
npm run test:e2e
npm run test:e2e -- expense-filter.spec.ts
npm run test:e2e -- todo-filter.spec.ts
```

**Acceptance Criteria**:
- All 10 Playwright tests pass
- No timeout errors
- All UI interactions work as expected

---

### Task 23: Manually validate all quickstart test scenarios (12 scenarios)
**Scenarios**:
1. Expense category filtering
2. Expense month filtering
3. Expense combined filters
4. Expense empty state (no matches)
5. Expense empty state (no data)
6. To-Do status filtering
7. To-Do priority filtering
8. To-Do combined filters
9. To-Do empty state (no matches)
10. To-Do empty state (no data)
11. Filter state reset on page reload
12. Performance verification (< 300ms)

**Reference**: `specs/013-title-wednesday-spec/quickstart.md`
**Acceptance**: All 12 scenarios pass; no console errors

---

### Task 24: Generate coverage reports and prepare PR documentation
**Output**:
- Coverage reports for expense-ui and todo-ui modules
- Updated PR template with:
  - Feature link to spec
  - "How to test" section (reference quickstart.md)
  - Coverage table
  - Screenshots/GIFs (optional)

**Acceptance**: PR ready for review; all documentation complete

---

## Summary

**Total Tasks**: 24  
**Phases**: 5 (Tests, Logic, Components, Integration, Validation)
**Parallel Potential**: Tasks can be parallelized within phases
**Estimated Duration**: 3-4 days
**TDD Approach**: Tests first, implementations to make tests pass

---

## Progress Tracking

| Phase | Tasks | Status |
|-------|-------|--------|
| Phase 1: Tests & Utils | 5 | 🔴 Pending |
| Phase 2: Filter Logic | 7 | 🔴 Pending |
| Phase 3: Components | 4 | 🔴 Pending |
| Phase 4: Integration | 4 | 🔴 Pending |
| Phase 5: Validation | 4 | 🔴 Pending |
| **TOTAL** | **24** | **0% Complete** |

---

*Tasks generated for PRI-289 on 2025-10-22*


