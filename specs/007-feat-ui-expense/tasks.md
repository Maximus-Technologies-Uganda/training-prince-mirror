# Tasks: UI Expense — Filters + Total

**Input**: `/Users/prnceb/Desktop/WORK/hello-world/specs/007-feat-ui-expense/`  
**Prerequisites**: plan.md (required), research.md, data-model.md

## Phase 2.1: Tests First (TDD)
- [ ] T001 [P] Unit: month-only filter totals correctly (table-driven)
- [ ] T002 [P] Unit: category-only filter totals correctly (table-driven)
- [ ] T003 [P] Unit: both filters applied totals correctly (table-driven)
- [ ] T004 [P] Unit: no filters totals all items (table-driven)
- [ ] T005 [P] Unit: empty-state shows "No expenses found" and total 0
- [ ] T006 [P] E2E smoke: page loads and totals area visible

## Phase 2.2: Core Implementation
- [ ] T007 Import `src/expense/core.js`; derive category options from data (unique, sorted, add "All")
- [ ] T008 Implement filters UI: month (1–12) + category dropdown; reactive updates
- [ ] T009 Render table with columns: Date, Category, Amount; compute total via core

## Phase 2.3: Polish & A11y
- [ ] T010 Labels associated to inputs; keyboard focus order logical
- [ ] T011 Ensure UI coverage ≥40% statements; export lcov HTML

## Validation Checklist
- [ ] Tests precede implementation (T001–T006 before T007–T009)
- [ ] Coverage threshold satisfied (≥40%)
- [ ] Review-packet includes UI‑expense coverage
