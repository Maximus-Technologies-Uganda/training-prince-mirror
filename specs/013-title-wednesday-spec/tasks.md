# Implementation Tasks: Wednesday UI Polishing - Expense & To-Do Filtering

**Feature**: Wednesday UI Polishing - Expense and To-Do Filtering  
**Branch**: `013-title-wednesday-spec`  
**Parent Linear Issue**: PRI-289 - "Wednesday: Polished UI Filters & Empty States for Expense & To-Do"  
**Date Created**: October 22, 2025

---

## Task Overview

**Total Tasks**: 24  
**Estimated Duration**: 3-4 days  
**TDD Approach**: Tests first, then implementation  
**Parallel Tasks**: Marked with [P]

---

## Phase 1: Contract Tests & Utilities Setup

### Task 1: Create filterUtils.js with stub functions [P]
- [ ] **Status**: Pending
- **Linear Sub-Issue**: "Create filterUtils.js module with filter function stubs"
- **Description**: Create `frontend/src/utils/filterUtils.js` with function signatures for all filter operations
- **Functions to stub**:
  - `filterExpensesByCategory(expenses, category)`
  - `filterExpensesByMonth(expenses, month)`
  - `filterExpensesByBoth(expenses, filters)`
  - `filterTodosByStatus(todos, status)`
  - `filterTodosByPriority(todos, priority)`
  - `filterTodosByBoth(todos, filters)`
  - `detectEmptyState(items, filters)`
  - `resetFilters()`
- **Output**: Stub file with JSDoc comments
- **Acceptance**: File exists with all function signatures

---

### Task 2: Write Vitest unit tests for expense filtering [P]
- [ ] **Status**: Pending
- **Linear Sub-Issue**: "Write Vitest unit tests for expense filtering logic"
- **Description**: Create `frontend/tests/expense-filter.test.js` with comprehensive unit tests
- **Tests to write** (all should FAIL initially):
  - `filterExpensesByCategory()` returns matching category items
  - `filterExpensesByCategory()` returns all items when category is null
  - `filterExpensesByMonth()` returns matching month items
  - `filterExpensesByMonth()` returns all items when month is null
  - `filterExpensesByBoth()` applies AND logic correctly
  - `filterExpensesByBoth()` handles null filters
  - `detectEmptyState()` identifies empty results
- **Tools**: Vitest + expect assertions
- **Output**: 7 failing tests
- **Acceptance**: All tests written; all fail (red phase of TDD)

---

### Task 3: Write Vitest unit tests for to-do filtering [P]
- [ ] **Status**: Pending
- **Linear Sub-Issue**: "Write Vitest unit tests for to-do filtering logic"
- **Description**: Create `frontend/tests/todo-filter.test.js` with comprehensive unit tests
- **Tests to write** (all should FAIL initially):
  - `filterTodosByStatus()` returns pending tasks
  - `filterTodosByStatus()` returns completed tasks
  - `filterTodosByStatus()` returns all items when status is 'all'
  - `filterTodosByPriority()` returns matching priority items
  - `filterTodosByPriority()` returns all items when priority is null
  - `filterTodosByBoth()` applies AND logic correctly
  - `detectEmptyState()` identifies empty todo results
- **Tools**: Vitest + expect assertions
- **Output**: 7 failing tests
- **Acceptance**: All tests written; all fail (red phase of TDD)

---

### Task 4: Write Playwright smoke tests for expense filtering [P]
- [ ] **Status**: Pending
- **Linear Sub-Issue**: "Write Playwright E2E smoke test for expense filtering"
- **Description**: Create `frontend/e2e/expense-filter.spec.ts` with Playwright smoke tests
- **Scenarios to test**:
  - User selects category filter → list updates with matching items
  - User selects month filter → list updates with matching items
  - User applies both filters → AND logic applied correctly
  - Empty state displays when no matches exist
  - Clear filters button resets state and shows full list
  - Performance: filter update < 300ms
- **Output**: Failing Playwright tests
- **Acceptance**: Tests written; all fail until implementation complete

---

### Task 5: Write Playwright smoke tests for to-do filtering [P]
- [ ] **Status**: Pending
- **Linear Sub-Issue**: "Write Playwright E2E smoke test for to-do filtering"
- **Description**: Create `frontend/e2e/todo-filter.spec.ts` with Playwright smoke tests
- **Scenarios to test**:
  - User clicks status filter (Pending/Completed/All) → list updates
  - User selects priority filter → list updates with matching items
  - User applies both filters → AND logic applied correctly
  - Empty state displays when no matches exist
  - Clear filters button resets state and shows full list
  - Performance: filter update < 300ms
- **Output**: Failing Playwright tests
- **Acceptance**: Tests written; all fail until implementation complete

---

## Phase 2: Implement Filter Logic (Make Tests Pass)

### Task 6: Implement filterExpensesByCategory() function
- [ ] **Status**: Pending
- **Linear Sub-Issue**: "Implement filterExpensesByCategory() to make tests pass"
- **Description**: Implement logic in `filterUtils.js` to filter expenses by category
- **Implementation**:
  ```javascript
  export function filterExpensesByCategory(expenses, category) {
    if (!category) return expenses;
    return expenses.filter(e => e.category === category);
  }
  ```
- **Tests passing**: Task 2 (3 related tests)
- **Acceptance**: All category-related tests pass in `npm run test:unit`

---

### Task 7: Implement filterExpensesByMonth() function
- [ ] **Status**: Pending
- **Linear Sub-Issue**: "Implement filterExpensesByMonth() to make tests pass"
- **Description**: Implement logic to filter expenses by month
- **Implementation**: Extract month from ISO date and match with filter month
- **Tests passing**: Task 2 (3 related tests)
- **Acceptance**: All month-related tests pass

---

### Task 8: Implement filterExpensesByBoth() function
- [ ] **Status**: Pending
- **Linear Sub-Issue**: "Implement filterExpensesByBoth() with AND logic"
- **Description**: Implement combined category AND month filtering
- **Implementation**: Apply both filters with AND logic
- **Tests passing**: Task 2 (2 related tests)
- **Acceptance**: Combined filter tests pass; AND logic verified

---

### Task 9: Implement filterTodosByStatus() function
- [ ] **Status**: Pending
- **Linear Sub-Issue**: "Implement filterTodosByStatus() to make tests pass"
- **Description**: Implement logic to filter todos by status
- **Implementation**: Handle 'all', 'pending', 'completed' states
- **Tests passing**: Task 3 (3 related tests)
- **Acceptance**: All status-related tests pass

---

### Task 10: Implement filterTodosByPriority() function
- [ ] **Status**: Pending
- **Linear Sub-Issue**: "Implement filterTodosByPriority() to make tests pass"
- **Description**: Implement logic to filter todos by priority
- **Implementation**: Match High/Medium/Low priorities; null = all
- **Tests passing**: Task 3 (2 related tests)
- **Acceptance**: All priority-related tests pass

---

### Task 11: Implement filterTodosByBoth() function
- [ ] **Status**: Pending
- **Linear Sub-Issue**: "Implement filterTodosByBoth() with AND logic"
- **Description**: Implement combined status AND priority filtering
- **Implementation**: Apply both filters with AND logic
- **Tests passing**: Task 3 (2 related tests)
- **Acceptance**: Combined filter tests pass; AND logic verified

---

### Task 12: Implement detectEmptyState() function
- [ ] **Status**: Pending
- **Linear Sub-Issue**: "Implement detectEmptyState() helper function"
- **Description**: Implement empty state detection logic
- **Implementation**: Return true if filtered list is empty
- **Tests passing**: Tasks 2 & 3 (empty state detection tests)
- **Acceptance**: Empty state detection tests pass

---

## Phase 3: Create Filter Components

### Task 13: Create ExpenseFilter component [P]
- [ ] **Status**: Pending
- **Linear Sub-Issue**: "Create ExpenseFilter React component with category & month dropdowns"
- **Description**: Create `frontend/src/components/ExpenseFilter/index.js`
- **Features**:
  - Category dropdown (dynamically populated)
  - Month dropdown (1-12)
  - Clear Filters button
  - Emit `onFilter` callback on any change
- **Props**: `categories: string[]`, `onFilter: (filterState) => void`
- **Output**: Functional component with UI controls
- **Acceptance**: Component renders; filters emit events; CSS styled

---

### Task 14: Create ExpenseEmptyState component [P]
- [ ] **Status**: Pending
- **Linear Sub-Issue**: "Create ExpenseEmptyState component with icon & CTA button"
- **Description**: Create `frontend/src/components/ExpenseEmptyState/index.js`
- **Features**:
  - Icon (inline SVG or emoji)
  - Conditional message ("No matching expenses" vs "No expenses yet")
  - CTA button ("Add Your First Expense" or "Clear Filters")
  - Keyboard accessible
- **Props**: `reason: 'filtered' | 'no-data'`, `onAddExpense`, `onClearFilters`
- **Output**: Functional component with conditional rendering
- **Acceptance**: Component renders correctly for both reasons; buttons functional

---

### Task 15: Create TodoFilter component [P]
- [ ] **Status**: Pending
- **Linear Sub-Issue**: "Create TodoFilter component with status tabs & priority dropdown"
- **Description**: Create `frontend/src/components/TodoFilter/index.js`
- **Features**:
  - Status filter tabs (All, Pending, Completed)
  - Priority dropdown (All, High, Medium, Low)
  - Clear Filters button
  - Emit `onFilter` callback on any change
- **Props**: `onFilter: (filterState) => void`
- **Output**: Functional component with tab + dropdown UI
- **Acceptance**: Component renders; filters emit events; CSS styled

---

### Task 16: Create TodoEmptyState component [P]
- [ ] **Status**: Pending
- **Linear Sub-Issue**: "Create TodoEmptyState component with icon & CTA button"
- **Description**: Create `frontend/src/components/TodoEmptyState/index.js`
- **Features**:
  - Icon (inline SVG or emoji)
  - Conditional message ("No matching tasks" vs "No tasks yet")
  - CTA button ("Create Your First Task" or "Clear Filters")
  - Keyboard accessible
- **Props**: `reason: 'filtered' | 'no-data'`, `onAddTodo`, `onClearFilters`
- **Output**: Functional component with conditional rendering
- **Acceptance**: Component renders correctly for both reasons; buttons functional

---

## Phase 4: Integrate Components into Pages

### Task 17: Integrate ExpenseFilter into Expense page
- [ ] **Status**: Pending
- **Linear Sub-Issue**: "Integrate ExpenseFilter component into expense page UI"
- **Description**: Update expense page to include filter controls
- **Changes**:
  - Import ExpenseFilter component
  - Add filter state management to page
  - Pass `onFilter` callback
  - Connect filter state to list rendering
- **File**: `frontend/src/pages/expense.js` or main Expense component
- **Acceptance**: Filter controls visible on page; clicking filters doesn't error

---

### Task 18: Integrate ExpenseList with filtering logic
- [ ] **Status**: Pending
- **Linear Sub-Issue**: "Add filtering logic to ExpenseList component"
- **Description**: Update expense list to apply filters and show empty state
- **Changes**:
  - Apply filter functions when filterState changes
  - Show ExpenseEmptyState when list is empty
  - Pass correct `reason` prop to empty state component
  - Performance: updates complete < 300ms
- **File**: Expense list component or parent
- **Acceptance**: List updates when filters applied; empty state displays correctly

---

### Task 19: Integrate TodoFilter into To-Do page
- [ ] **Status**: Pending
- **Linear Sub-Issue**: "Integrate TodoFilter component into to-do page UI"
- **Description**: Update to-do page to include filter controls
- **Changes**:
  - Import TodoFilter component
  - Add filter state management to page
  - Pass `onFilter` callback
  - Connect filter state to list rendering
- **File**: `frontend/src/pages/todo.js` or main Todo component
- **Acceptance**: Filter controls visible on page; clicking filters doesn't error

---

### Task 20: Integrate TodoList with filtering logic
- [ ] **Status**: Pending
- **Linear Sub-Issue**: "Add filtering logic to TodoList component"
- **Description**: Update to-do list to apply filters and show empty state
- **Changes**:
  - Apply filter functions when filterState changes
  - Show TodoEmptyState when list is empty
  - Pass correct `reason` prop to empty state component
  - Performance: updates complete < 300ms
- **File**: To-do list component or parent
- **Acceptance**: List updates when filters applied; empty state displays correctly

---

## Phase 5: Testing & Validation

### Task 21: Run all Vitest tests and achieve ≥50% coverage
- [ ] **Status**: Pending
- **Linear Sub-Issue**: "Run Vitest unit tests and verify ≥50% coverage for UI modules"
- **Description**: Execute unit tests and generate coverage report
- **Commands**:
  ```bash
  npm run test:unit
  npm run test:coverage
  ```
- **Acceptance Criteria**:
  - All 14 unit tests pass (green phase of TDD)
  - Expense module: ≥50% coverage
  - To-Do module: ≥50% coverage
  - Coverage report generated

---

### Task 22: Run Playwright smoke tests
- [ ] **Status**: Pending
- **Linear Sub-Issue**: "Run Playwright E2E smoke tests for filter functionality"
- **Description**: Execute Playwright smoke tests
- **Commands**:
  ```bash
  npm run test:e2e
  # Or specific suites:
  npm run test:e2e -- expense-filter.spec.ts
  npm run test:e2e -- todo-filter.spec.ts
  ```
- **Acceptance Criteria**:
  - All 10 Playwright tests pass
  - No timeout errors
  - All UI interactions work as expected

---

### Task 23: Manual validation of all 12 quickstart scenarios
- [ ] **Status**: Pending
- **Linear Sub-Issue**: "Manually validate all quickstart test scenarios (12 scenarios)"
- **Description**: Execute manual test scenarios from `quickstart.md`
- **Scenarios to validate**:
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
- **Acceptance**: All 12 scenarios pass; no console errors

---

### Task 24: Generate coverage reports and update PR documentation
- [ ] **Status**: Pending
- **Linear Sub-Issue**: "Generate coverage reports and prepare PR documentation"
- **Description**: Create coverage artifacts and PR description
- **Output**:
  - Coverage reports for expense-ui and todo-ui modules
  - Updated PR template with:
    - Feature link to spec
    - "How to test" section (reference quickstart.md)
    - Coverage table
    - Screenshots/GIFs of filters in action (optional)
- **Acceptance**: PR ready for review; all documentation complete

---

## Summary

**Total Tasks**: 24  
**Phases**:
- Phase 1: Contract Tests & Utilities (5 tasks)
- Phase 2: Filter Logic Implementation (7 tasks)
- Phase 3: Component Creation (4 tasks)
- Phase 4: Integration (4 tasks)
- Phase 5: Testing & Validation (4 tasks)

**Parallel Tasks Identified** [P]:
- Tasks 1-5 can run in parallel (test setup)
- Tasks 6-12 depend on tasks 1-5 (sequential, but each function can be parallel)
- Tasks 13-16 can run in parallel (component creation)
- Tasks 17-20 can run in parallel (integration)
- Tasks 21-24 sequential (validation/reporting)

**Estimated Effort**: 3-4 days for full completion

---

## Progress Tracking

| Phase | Tasks | Completed | Status |
|-------|-------|-----------|--------|
| **1: Tests & Utils** | 5 | 0/5 | 🔴 Not Started |
| **2: Filter Logic** | 7 | 0/7 | 🔴 Not Started |
| **3: Components** | 4 | 0/4 | 🔴 Not Started |
| **4: Integration** | 4 | 0/4 | 🔴 Not Started |
| **5: Validation** | 4 | 0/4 | 🔴 Not Started |
| **TOTAL** | **24** | **0/24** | 🔴 0% |

---

## Linear Sub-Issue Mapping (PRI-289)

Copy these titles into Linear to create sub-issues under PRI-289:

```
1. Create filterUtils.js module with filter function stubs
2. Write Vitest unit tests for expense filtering logic
3. Write Vitest unit tests for to-do filtering logic
4. Write Playwright E2E smoke test for expense filtering
5. Write Playwright E2E smoke test for to-do filtering
6. Implement filterExpensesByCategory() to make tests pass
7. Implement filterExpensesByMonth() to make tests pass
8. Implement filterExpensesByBoth() with AND logic
9. Implement filterTodosByStatus() to make tests pass
10. Implement filterTodosByPriority() to make tests pass
11. Implement filterTodosByBoth() with AND logic
12. Implement detectEmptyState() helper function
13. Create ExpenseFilter React component with category & month dropdowns
14. Create ExpenseEmptyState component with icon & CTA button
15. Create TodoFilter component with status tabs & priority dropdown
16. Create TodoEmptyState component with icon & CTA button
17. Integrate ExpenseFilter component into expense page UI
18. Add filtering logic to ExpenseList component
19. Integrate TodoFilter component into to-do page UI
20. Add filtering logic to TodoList component
21. Run Vitest unit tests and verify ≥50% coverage for UI modules
22. Run Playwright E2E smoke tests for filter functionality
23. Manually validate all quickstart test scenarios (12 scenarios)
24. Generate coverage reports and prepare PR documentation
```

---

*Tasks generated by /tasks command on 2025-10-22*
