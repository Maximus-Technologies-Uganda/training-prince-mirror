# Contract: Add Expense Drawer (POST /expenses)

**Feature**: Chapter 6 Day 1 – Frontend Integration  
**Component**: `<AddExpenseDrawer />` + POST mutation  
**Date**: 19 November 2025

---

## Interaction Model

- Trigger buttons: header primary CTA + empty/error states.
- Drawer slides from right ( width `420px` ) overlaying content but leaving list visible.
- Focus order: trigger button → drawer container (`role="dialog" aria-modal="true"`) → first field.
- Close controls: `Esc` key, close icon button, backdrop click (with confirmation if dirty form).

## Fields & Validation (FR-002)

| Field | Input Type | Requirements | Error Source |
|-------|------------|--------------|--------------|
| `amount` | Text input with currency mask | Required, > 0, supports cents; displays placeholder `"0.00"` | API `details[].message` or client-side mask |
| `category` | Select dropdown | Required, options from `/expenses/categories` seed (fallback to static list) | API validation or missing selection |
| `date` | Date picker | Required, must be `<= today`, matches `YYYY-MM-DD` | API `VALIDATION_ERROR` for future dates |

- Helper text uses API error envelope: backend returns `{ errors: [{ field, message }] }`.
- On validation failure:
  - Field border turns error red (meets 3:1 contrast).
  - Error text announced via `aria-live="assertive"`.
  - Focus moves to first errored field.
- Each validation failure additionally emits telemetry `frontend.expenses.validation_error` with the offending field list for FR-010a evidence.

### Validation Matrix (FR-011 Evidence)

| Scenario | Steps | Expected Outcome | Evidence |
|----------|-------|------------------|----------|
| Positive submission | Fill all fields with valid values, click **Submit** | Button swaps to `Submitting…`, toast `Expense added` appears, drawer stays open | `tests/contract/add-expense-drawer.contract.test.tsx` success case · `tests/e2e/add-expense-drawer.spec.ts` focus/duplicate test |
| Missing amount | Leave form blank, press **Submit** | Inline error "Amount must be greater than 0", focus remains on amount, telemetry `["amount"]` | Contract test "blocks submission when amount is missing" |
| Missing category | Provide amount + date only | Inline error "Select a category", focus shifts to select, telemetry `["category"]` | Contract test "shows validation when category missing" |
| Missing date | Provide amount + category only | Inline error "Date is required", telemetry `["date"]` | Contract test "shows validation when date is missing" |
| Future date | Enter `2999-01-01` | Inline error "Date cannot be in the future", telemetry `["date"]` | Contract test "shows validation when date is in future" |
| API field error | Mock POST response `{ details: [{ field: 'category', message: 'Category is invalid' }] }` | Inline server copy shown under field, focus shifts to select, telemetry `["category"]` | Contract test "maps API field errors…" |
| Network / 500 error | Force mutation rejection without details | Alert banner `Failed to save expense` rendered with Retry button that replays last payload | Contract test "surfaces retry control…" |

## Submission Flow

1. User clicks `Submit` (loading spinner replaces label; button disabled to prevent double clicks).
2. Mutation payload:
   ```json
   {
     "amount": 45.60,
     "category": "travel",
     "date": "2025-11-18"
   }
   ```
3. On success:
   - Show toast `"Expense added"` for 4 seconds with checkmark icon.
   - Drawer resets to pristine state but stays open so user can add another expense.
   - TanStack Query `invalidateQueries(['expenses', filters])` and `invalidateQueries(['expenses-summary', filters])` run in parallel.
   - Optimistically insert returned record at top of list while real refetch occurs.
4. On error:
   - If server returns `errors` array, render inline field errors.
   - If network/500 error, show inline alert `"Failed to save expense"` with Retry button (resubmits last payload).

## Accessibility & Keyboard (FR-006, FR-007)

- Drawer has `aria-labelledby` referencing its title `"Add expense"`.
- Focus trapped within drawer until closed.
- `Esc` closes drawer and returns focus to triggering element.
- Validation errors announced via `aria-live="assertive"`; role="alert" on summary block.
- Backdrop clicks and close icon trigger `window.confirm('Discard unsaved expense?')` whenever the form is dirty. Cancelling keeps the drawer open; accepting closes it and restores focus to the CTA that launched the drawer (header button, filters, list empty state, or summary panel).

## Performance & Resiliency (FR-009, FR-010)

- POST request timeout set to 10 s; if exceeded, show hint `"Still working…"` and keep Retry enabled.
- After 5 minutes without interaction, drawer shows passive hint to refresh data before creating more entries (aligns with stale banner messaging elsewhere).

## Telemetry (FR-010a)

- Mutation success triggers `trackRefresh('post-success', durationMs, true)` that chains into refetch timer emission so reviewers see POST-induced refresh latency.
- Validation failures log `frontend.expenses.validation_error` with field list for QA visibility.

## QA Evidence (FR-011)

Test permutations to enumerate in Review Packet:
- Positive path: valid payload -> toast -> list auto-refresh.
- Validation errors: missing amount, missing category, missing date, future date, API field error.
- Drawer focus return: open → submit → close → focus returns to triggering CTA.
- Duplicate submit protection: verify button disabled until response (payload only posts once).
- Dirty-close confirmation: attempt to close with partially completed form, dismiss confirm to stay, accept confirm to close and restore CTA focus.
- Screen reader run-through confirming labels + helper text.
