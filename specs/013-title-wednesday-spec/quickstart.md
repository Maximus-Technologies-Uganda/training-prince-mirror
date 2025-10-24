# Quickstart: Expense & To-Do Filtering Feature

**Feature**: Wednesday UI Polishing - Expense and To-Do Filtering
**Date**: October 22, 2025
**Purpose**: Manual validation and Playwright smoke test scenarios

---

## Overview

This guide documents how to manually test and verify the filtering and empty state features for Expense and To-Do UIs. Each scenario can be executed manually or automated via Playwright.

---

## Test Environment Setup

**Prerequisites**:
- Fresh browser session (filters start unfiltered)
- Sample data loaded:
  - Expense: 10-15 items across 3-4 categories and multiple months
  - To-Do: 15-20 items with mixed status (pending/completed) and priorities (High/Medium/Low)

**Load Sample Data**:
```bash
# From project root, ensure data is seeded
npm run seed  # or manual fixture load
```

---

## Scenario 1: Expense Category Filtering

**Objective**: Verify that selecting a category filter displays only expenses from that category.

**Setup**:
1. Open Expense page in browser
2. Verify initial state shows all expenses (unfiltered)
3. Identify available categories from dropdown (e.g., Food, Transport, Entertainment)

**Steps**:
1. Open category dropdown
2. Select "Food"
3. **Verify**:
   - Expense list updates to show only "Food" expenses
   - Other categories disappear from visible list
   - List update completes < 300ms (visually instant)
   - Empty state NOT shown (matches exist for "Food")

4. Select "Transport" category
5. **Verify**:
   - List updates to show only "Transport" expenses
   - Previous "Food" expenses removed

**Expected Outcome**: ✅ List updates correctly; no latency issues

---

## Scenario 2: Expense Month Filtering

**Objective**: Verify that selecting a month filter displays only expenses from that month.

**Setup**:
1. Open Expense page (ensure no category filter active)
2. Verify list shows all expenses from multiple months
3. Identify available months from dropdown

**Steps**:
1. Click month dropdown
2. Select "October 2024" (or current month with data)
3. **Verify**:
   - Expense list updates to show only expenses from October 2024
   - Expenses from other months removed
   - Update completes instantly (< 300ms)

4. Select "September 2024"
5. **Verify**:
   - List updates to show only September 2024 expenses

**Expected Outcome**: ✅ Month filter works independently

---

## Scenario 3: Expense Combined Filters (Category + Month)

**Objective**: Verify that category AND month filters work together (AND logic).

**Setup**:
1. Open Expense page with all filters reset
2. Verify full list displays

**Steps**:
1. Select category "Food"
2. Select month "October 2024"
3. **Verify**:
   - List shows ONLY "Food" expenses from October 2024
   - Expense count is smallest (subset of each individual filter)
   - Both filter controls show selected values

4. Change category to "Transport"
5. **Verify**:
   - List updates to show "Transport" expenses from October 2024
   - Month filter still active (not reset)

6. Click "Clear Filters" button
7. **Verify**:
   - Both filter dropdowns reset to "All" or placeholder
   - Full expense list displays again

**Expected Outcome**: ✅ Filters combine with AND logic; clear button resets both

---

## Scenario 4: Expense Empty State (No Matches)

**Objective**: Verify empty state displays when filters result in zero matches.

**Setup**:
1. Open Expense page
2. Have data with gaps (e.g., no "Entertainment" in October)

**Steps**:
1. Select category "Entertainment"
2. Select month "October 2024"
3. **Verify**:
   - List becomes empty
   - **Empty state component appears** with:
     - Icon (SVG folder or inbox graphic)
     - Message: "No matching expenses found"
     - Secondary text: "Try adjusting your filters to find expenses"
     - CTA Button: "Adjust Filters" or "Clear Filters" (links to clear filters)

4. Click the CTA button
5. **Verify**:
   - Filters reset
   - Full list displays
   - Empty state disappears

**Expected Outcome**: ✅ Empty state displays correctly with actionable CTA

---

## Scenario 5: Expense Empty State (No Data)

**Objective**: Verify empty state displays when no expenses exist at all.

**Setup**:
1. Clear or reset expense data to zero records
2. Open Expense page

**Steps**:
1. **Verify**:
   - No filters applied (all dropdowns show "All" or placeholder)
   - List is empty
   - **Empty state component appears** with:
     - Icon (SVG graphic)
     - Message: "No expenses yet"
     - Secondary text: "Start by adding your first expense"
     - CTA Button: "Add Your First Expense" (navigates to add form)

2. (Optional) Click CTA button
3. **Verify**:
   - Navigation to "Add Expense" form or modal

**Expected Outcome**: ✅ Empty state appropriate for no data (not filtering)

---

## Scenario 6: To-Do Status Filtering

**Objective**: Verify that status filters (All, Pending, Completed) display correct tasks.

**Setup**:
1. Open To-Do page
2. Verify mix of pending and completed tasks visible (no filters)
3. Count pending vs completed tasks

**Steps**:
1. Click "Pending" status filter (button or tab)
2. **Verify**:
   - List shows ONLY pending tasks
   - Completed tasks removed
   - Count matches expected pending total
   - Status filter button shows as active/selected

3. Click "Completed" status filter
4. **Verify**:
   - List shows ONLY completed tasks
   - Pending tasks removed

5. Click "All" status filter
6. **Verify**:
   - List shows all tasks (pending + completed)
   - Returns to initial unfiltered state

**Expected Outcome**: ✅ Status filter works; all three options functional

---

## Scenario 7: To-Do Priority Filtering

**Objective**: Verify that priority filters display correct tasks.

**Setup**:
1. Open To-Do page (reset status to "All")
2. Verify tasks with mixed priorities visible
3. Count per priority level (High, Medium, Low)

**Steps**:
1. Click priority dropdown
2. Select "High"
3. **Verify**:
   - List shows ONLY High priority tasks
   - Medium and Low tasks removed
   - Count matches expected High total

4. Select "Medium" priority
5. **Verify**:
   - List updates to show ONLY Medium priority tasks

6. Select "Low" priority
7. **Verify**:
   - List updates to show ONLY Low priority tasks

8. Select "All Priorities" (or null/default)
9. **Verify**:
   - List shows all tasks regardless of priority

**Expected Outcome**: ✅ Priority filter works; all four options (High/Medium/Low/All) functional

---

## Scenario 8: To-Do Combined Filters (Status + Priority)

**Objective**: Verify that status AND priority filters work together.

**Setup**:
1. Open To-Do page with all filters reset
2. Verify full list displays

**Steps**:
1. Select status "Pending"
2. Select priority "High"
3. **Verify**:
   - List shows ONLY High priority pending tasks
   - List is smallest (subset)
   - Both filter controls show selected values

4. Change status to "Completed"
5. **Verify**:
   - List updates to show High priority completed tasks
   - Priority filter still active

6. Change priority to "Medium"
7. **Verify**:
   - List shows Medium priority completed tasks

8. Click "Clear Filters" button
9. **Verify**:
   - Status resets to "All"
   - Priority resets to null/default
   - Full to-do list displays

**Expected Outcome**: ✅ Filters combine with AND logic; clear resets both

---

## Scenario 9: To-Do Empty State (No Matches)

**Objective**: Verify empty state displays when filters result in zero matches.

**Setup**:
1. Open To-Do page
2. Have data with gaps (e.g., no High priority completed tasks)

**Steps**:
1. Select status "Completed"
2. Select priority "High"
3. **Verify**:
   - List becomes empty (no High priority completed tasks)
   - **Empty state component appears** with:
     - Icon (SVG graphic)
     - Message: "No matching tasks found"
     - Secondary text: "Try adjusting your filters"
     - CTA Button: "Adjust Filters" (clears filters)

4. Click CTA button
5. **Verify**:
   - Filters reset to status "All" + priority null
   - Full list displays
   - Empty state disappears

**Expected Outcome**: ✅ Empty state displays with correct message and CTA

---

## Scenario 10: To-Do Empty State (No Data)

**Objective**: Verify empty state displays when no to-do items exist.

**Setup**:
1. Clear or reset to-do data to zero records
2. Open To-Do page

**Steps**:
1. **Verify**:
   - No filters applied (all show defaults)
   - List is empty
   - **Empty state component appears** with:
     - Icon (SVG graphic)
     - Message: "No tasks yet"
     - Secondary text: "Create your first task to get started"
     - CTA Button: "Create Your First Task" (navigates to add form)

2. (Optional) Click CTA button
3. **Verify**:
   - Navigation to "Add Task" form or modal

**Expected Outcome**: ✅ Empty state appropriate for no data

---

## Scenario 11: Filter State Reset on Page Reload

**Objective**: Verify that filters reset when page is closed/refreshed (session-only).

**Setup**:
1. Open Expense or To-Do page
2. Apply filters (e.g., "Food" category + October month)
3. Verify filtered list displays

**Steps**:
1. Press F5 or Cmd+R to refresh page
2. **Verify**:
   - Page reloads
   - **Filters reset to defaults** (no category, no month, status "All", priority null)
   - **Full unfiltered list displays**
   - Filter controls show no selections

**Expected Outcome**: ✅ Filters are session-only; reload clears state

---

## Scenario 12: Performance Verification (< 300ms Latency)

**Objective**: Verify filter updates complete in < 300ms.

**Setup**:
1. Open Expense or To-Do page with full list loaded
2. Have browser DevTools open (optional, for Timeline recording)

**Steps**:
1. Record start time
2. Click filter control to select a filter
3. Observe list update visually
4. Record end time
5. **Verify**:
   - Visual update appears immediately (feels instant)
   - No noticeable lag or stutter
   - Time from click to visible update: < 300ms

6. Repeat with rapid filter changes
7. **Verify**:
   - System handles rapid changes without lag
   - No UI stutter or frozen state

**Expected Outcome**: ✅ Latency < 300ms; feels responsive

---

## Automated Test Execution (Playwright)

### Run Smoke Tests
```bash
npm run test:e2e

# Or specific suite
npm run test:e2e -- expense-filter.spec.ts
npm run test:e2e -- todo-filter.spec.ts
```

### Run Unit Tests (Vitest)
```bash
npm run test:unit

# Coverage report
npm run test:coverage
```

### Expected Results
- All Playwright tests pass
- Vitest coverage ≥50% for UI modules
- No performance warnings in DevTools

---

## Validation Checklist

**Must Pass Before Feature Complete**:
- [ ] Scenario 1-3: Expense filtering works (category, month, combined)
- [ ] Scenario 4-5: Expense empty states display correctly
- [ ] Scenario 6-8: To-Do filtering works (status, priority, combined)
- [ ] Scenario 9-10: To-Do empty states display correctly
- [ ] Scenario 11: Filters reset on page reload (session-only)
- [ ] Scenario 12: All updates < 300ms latency
- [ ] Playwright smoke tests: All pass
- [ ] Vitest unit tests: All pass, ≥50% coverage
- [ ] No console errors or warnings
- [ ] Responsive design: Works on desktop and mobile

---

## Troubleshooting

**Issue**: Empty state not displaying
- **Check**: Verify list is actually empty (count items)
- **Check**: Verify empty state component is conditionally rendered

**Issue**: Filters not updating list
- **Check**: Verify filter state is changing (console log)
- **Check**: Verify filter function logic is correct
- **Check**: Verify list component is re-rendering

**Issue**: Latency exceeds 300ms
- **Check**: Profile with DevTools Performance tab
- **Check**: Verify no extra re-renders happening
- **Check**: Check for network calls (should be none)

**Issue**: Filters persist after reload
- **Check**: Verify session storage not being used
- **Check**: Verify localStorage not being used
- **Check**: State should be component-local only

---

*Quickstart guide completed by /plan command on 2025-10-22*
