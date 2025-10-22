
# Implementation Plan: Wednesday UI Polishing - Expense and To-Do Filtering

**Branch**: `013-title-wednesday-spec` | **Date**: October 22, 2025 | **Spec**: `specs/013-title-wednesday-spec/spec.md`
**Input**: Feature specification from `/specs/013-title-wednesday-spec/spec.md`

---

## Summary

**Primary Requirement**: Implement robust filtering and empty state UIs for Expense and To-Do modules.
- **Expense filtering**: By category (system-defined) and month
- **To-Do filtering**: By status (All/Pending/Completed) and priority (High/Medium/Low)
- **Empty states**: Text + icon + CTA button for both modules
- **Performance**: Filter updates must complete within 300ms
- **Coverage**: ≥50% statement coverage for UI modules via Vitest + Playwright smoke tests

**Technical Approach**: Build stateless filter components that reuse existing backend logic from `src/expense/` and `src/todo/`, implement in-memory filter state management (session-only), and add comprehensive test coverage with Vitest unit tests and Playwright smoke tests.

---

## Technical Context

**Language/Version**: JavaScript (ES6+) / Node.js  
**Primary Dependencies**: Vite, Vitest, Playwright, Vanilla JS  
**Storage**: Existing JSON-based storage (backend: `data/expenses.json`, `data/todos.json`)  
**Testing**: Vitest (unit), Playwright (E2E smoke tests)  
**Target Platform**: Web browser (desktop + mobile responsive)  
**Project Type**: Web application (frontend + backend)  
**Performance Goals**: Filter updates < 300ms latency; smooth rapid filter changes  
**Constraints**: Session-only filter state (no persistence); reuse existing category/priority definitions  
**Scale/Scope**: 2 UI modules (Expense, To-Do); ~8-12 filtering components; ~20-30 unit tests; 2 smoke tests

---

## Constitution Check

**Constitution v1.1.0 Requirements Analysis**:

| Principle | Requirement | Status | Notes |
|-----------|------------|--------|-------|
| **No Logic Duplication** | Reuse `src/expense/` and `src/todo/` logic | ✅ COMPLIANT | Filter logic will import and reuse backend models; UI only handles state management + rendering |
| **Test Coverage Mandate** | ≥40% statement coverage (UI modules) | ✅ COMPLIANT | Spec requires ≥50% coverage for UI modules via Vitest (exceeds mandate) |
| **Reviewability** | Include coverage reports in review packet | ✅ COMPLIANT | Coverage artifacts generated during test execution; included in PR packet |
| **PR Craft** | ≤300 LOC changed; pass all CI checks | ✅ COMPLIANT | Feature scope bounded; filtered implementation prevents scope creep |
| **Tech Stack** | Vite + Vanilla JS + Vitest + Playwright | ✅ COMPLIANT | Using established project stack; no new tooling required |

**Complexity Deviations**: None. Feature aligns with constitution principles.

**Post-Design Check**: Will re-verify after Phase 1 design artifacts.

---

## Project Structure

### Documentation (this feature)
```
specs/013-title-wednesday-spec/
├── spec.md                 # Feature specification (completed)
├── plan.md                 # This file (/plan command output)
├── research.md             # Phase 0 output (/plan command)
├── data-model.md           # Phase 1 output (/plan command)
├── quickstart.md           # Phase 1 output (/plan command)
├── contracts/              # Phase 1 output (/plan command)
│   ├── ui-expense-filtering.md
│   ├── ui-todo-filtering.md
│   └── empty-state-contract.md
└── tasks.md                # Phase 2 output (/tasks command)
```

### Source Code Structure (Web application)
```
frontend/
├── src/
│   ├── components/
│   │   ├── ExpenseFilter/       # New: Category & Month filter controls
│   │   ├── ExpenseEmptyState/   # New: Empty state for Expense UI
│   │   ├── TodoFilter/          # New: Status & Priority filter controls
│   │   ├── TodoEmptyState/      # New: Empty state for To-Do UI
│   │   └── [existing components]
│   ├── pages/
│   │   ├── expense.html         # Updates: Integrate filter components
│   │   ├── todo.html            # Updates: Integrate filter components
│   │   └── [existing pages]
│   ├── utils/
│   │   └── filterUtils.js       # New: Filter logic, state management
│   └── [existing structure]
└── tests/
    ├── expense-filter.test.js   # New: Unit tests for Expense filter logic
    ├── todo-filter.test.js      # New: Unit tests for To-Do filter logic
    └── e2e/
        ├── expense-filter.spec.ts  # New: Playwright smoke tests
        └── todo-filter.spec.ts     # New: Playwright smoke tests
```

**Structure Decision**: Web application with existing backend + frontend. New components and utilities added to frontend; tests colocated with feature code. Reuses `src/` backend models via imports.

---

## Phase 0: Outline & Research

### Research Tasks

1. **Current Expense UI Implementation Review**
   - Decision: Audit existing `frontend/src/` Expense components and `src/expense/` backend logic
   - Rationale: Understand current state before adding filters
   - Task: Document component structure, data flow, category extraction points

2. **Current To-Do UI Implementation Review**
   - Decision: Audit existing `frontend/src/` To-Do components and `src/todo/` backend logic
   - Rationale: Understand current state before adding filters
   - Task: Document component structure, data flow, status/priority extraction points

3. **Performance Target Validation (300ms)**
   - Decision: Confirm 300ms latency is achievable with client-side filtering (no network calls)
   - Rationale: Ensure performance goal is realistic before design
   - Task: Benchmark existing Expense/To-Do list rendering; identify bottlenecks

4. **Vitest + Playwright Coverage Best Practices**
   - Decision: Review project's existing test setup; confirm ≥50% coverage achievable
   - Rationale: Ensure testing strategy aligns with project standards
   - Task: Document existing test patterns; identify coverage targets per component

5. **Icon Library Selection for Empty States**
   - Decision: Use existing project icon approach or select minimal icon library
   - Rationale: Maintain visual consistency; avoid scope creep
   - Task: Document current icon usage in project; decide on library or SVG approach

**Output**: `research.md` consolidating findings and decisions

---

## Phase 1: Design & Contracts

### 1. Data Model (`data-model.md`)

**Entities**:

- **FilterState** (In-memory, session-only)
  - Expense Filters: `{ category: string | null, month: number | null }`
  - To-Do Filters: `{ status: 'all' | 'pending' | 'completed', priority: 'High' | 'Medium' | 'Low' | null }`
  - Lifecycle: Initialized on page load; reset on page close/refresh

- **Expense**
  - Fields: `id`, `description`, `amount`, `category`, `date`, `timestamp`
  - Filter Keys: `category`, `date` (month/year extraction)

- **ToDoItem**
  - Fields: `id`, `title`, `description`, `status`, `priority`, `createdAt`
  - Filter Keys: `status`, `priority`

**Validation Rules**:
- Category: Non-empty string from existing system categories
- Month: Integer 1-12, or null for "all months"
- Status: Enum: 'all', 'pending', 'completed'
- Priority: Enum: 'High', 'Medium', 'Low', or null for "all priorities"

---

### 2. API Contracts (`contracts/`)

**Expense Filtering Contract**:
```
GET /api/expenses/filtered?category=Food&month=10
Response:
{
  expenses: [{ id, description, amount, category, date, timestamp }],
  total: number,
  metadata: { appliedFilters: { category, month } }
}
```

**To-Do Filtering Contract**:
```
GET /api/todos/filtered?status=pending&priority=High
Response:
{
  todos: [{ id, title, description, status, priority, createdAt }],
  count: number,
  metadata: { appliedFilters: { status, priority } }
}
```

**Empty State Detection**:
```
Response with empty array + metadata flag:
{ expenses: [], metadata: { isEmpty: true, reason: 'no-matches' | 'no-data' } }
```

---

### 3. Component Contracts

**ExpenseFilter Component**:
- Props: `categories: string[]`, `onFilter: (filters) => void`
- State: Manages category + month selections
- Output: Emits filter object on change
- Performance: Latency < 300ms from user input to parent re-render

**ExpenseEmptyState Component**:
- Props: `reason: 'no-data' | 'filtered'`, `onAddExpense: () => void`, `onClearFilter: () => void`
- Display: Icon + message + CTA button
- Accessibility: ARIA labels for button

**TodoFilter Component**:
- Props: `priorities: string[]`, `onFilter: (filters) => void`
- State: Manages status + priority selections
- Output: Emits filter object on change
- Performance: Latency < 300ms

**TodoEmptyState Component**:
- Props: `reason: 'no-data' | 'filtered'`, `onAddTodo: () => void`, `onClearFilter: () => void`
- Display: Icon + message + CTA button
- Accessibility: ARIA labels for button

---

### 4. Quickstart (`quickstart.md`)

**Test User Scenario 1: Expense Category Filter**
```
1. Load Expense page with 10 expenses across 3 categories
2. Select "Food" from category dropdown
3. Verify: List shows only Food expenses (< 300ms latency)
4. Verify: Empty state not shown (matches exist)
5. Select "Transport" category
6. Verify: List updates to show Transport expenses
```

**Test User Scenario 2: Empty State - Expense**
```
1. Filter Expense list to category + month with no matches
2. Verify: Empty state appears with icon + message + CTA button
3. Click "Add Your First Expense" button
4. Verify: Page navigates to add expense form (or modal)
```

**Test User Scenario 3: To-Do Status Filter**
```
1. Load To-Do page with 15 tasks (10 pending, 5 completed)
2. Select "Pending" status filter
3. Verify: List shows only pending tasks
4. Select "Completed" status filter
5. Verify: List shows only completed tasks
6. Select "All" to reset
```

**Test User Scenario 4: To-Do Priority Filter**
```
1. Load To-Do page with tasks across High/Medium/Low priorities
2. Select "High" priority filter
3. Verify: List shows only High priority tasks
4. Combine with status filter (e.g., "Pending + High")
5. Verify: List shows High priority pending tasks only
```

**Validation Steps**:
- [ ] All acceptance scenarios pass
- [ ] Coverage ≥50% for both UI modules
- [ ] Performance: All filter updates < 300ms
- [ ] Empty states display correctly
- [ ] Filters reset on page reload

---

### 5. Test Contracts (Failing Tests - TDD approach)

**Vitest Unit Tests**:
- `filterExpensesByCategory()` - filters list by category
- `filterExpensesByMonth()` - filters list by month
- `filterExpensesByBoth()` - AND logic for category + month
- `detectEmptyState()` - returns `isEmpty: true` when no matches
- `filterTodosByStatus()` - filters list by status (pending/completed/all)
- `filterTodosByPriority()` - filters list by priority
- `filterTodosByBoth()` - AND logic for status + priority
- `resetFilters()` - clears all filters and returns full list

**Playwright Smoke Tests**:
- `expense-filter.spec.ts`: E2E test covering filter UI, rendering, and empty state
- `todo-filter.spec.ts`: E2E test covering filter UI, rendering, and empty state

---

## Phase 2: Task Planning Approach

**Task Generation Strategy** (to be executed by `/tasks` command):

1. **Contract Tests** (P - Parallel)
   - Create 8 Vitest unit test files for filter logic (P)
   - Create 2 Playwright smoke test files (P)
   - All tests must fail initially (TDD)

2. **Data Model & Utilities** (Sequential → Parallel)
   - Create `filterUtils.js` with all filter functions
   - Implement filter logic to make Vitest tests pass (sequential by dependency)

3. **Component Creation** (Sequential, but parallel within tier)
   - Tier 1: Create `ExpenseFilter` and `TodoFilter` components (P)
   - Tier 2: Create `ExpenseEmptyState` and `TodoEmptyState` components (P)

4. **Component Integration** (Sequential)
   - Integrate filters into Expense page
   - Integrate filters into To-Do page
   - Integrate empty states

5. **Test Execution & Coverage** (Final)
   - Run Vitest to verify ≥50% coverage
   - Run Playwright smoke tests
   - Generate coverage reports

**Ordering Strategy**: TDD → Models → Components → Integration → Validation

**Estimated Output**: 20-25 numbered tasks in `tasks.md`

---

## Phase 1 Completion (Post-Design)

### Constitution Re-Check

| Principle | Status | Notes |
|-----------|--------|-------|
| **No Logic Duplication** | ✅ PASS | Filter logic isolated in `filterUtils.js`; reuses backend model imports |
| **Test Coverage Mandate** | ✅ PASS | 8 unit tests + 2 smoke tests planned; ≥50% coverage target |
| **Reviewability** | ✅ PASS | Design docs (data-model, contracts) provide clear review artifacts |
| **PR Craft** | ✅ PASS | Incremental component additions; no large monolithic changes |
| **Tech Stack** | ✅ PASS | Vite + Vanilla JS + Vitest + Playwright (approved) |

**Result**: ✅ **POST-DESIGN CONSTITUTION CHECK: PASS**

---

## Complexity Tracking

No constitutional violations. Feature scope is well-bounded and aligns with project principles.

| Violation | Why Needed | Simpler Alternative Rejected |
|-----------|-----------|------|
| (None) | (None) | (None) |

---

## Progress Tracking

**Phase Status**:
- [x] Phase 0: Research outline (/plan command)
- [x] Phase 1: Design complete (/plan command)
  - [x] Data model defined
  - [x] Contracts specified
  - [x] Component contracts defined
  - [x] Quickstart scenarios documented
- [x] Phase 2: Task planning approach documented (/plan command - ready for /tasks)
- [ ] Phase 3: Tasks generated (/tasks command - NEXT)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved (5/5 from /clarify)
- [x] Complexity deviations: None

**Ready for Next Phase**: ✅ **READY FOR `/tasks` COMMAND**

---

*Based on Constitution v1.1.0 - See `.specify/memory/constitution.md`*
