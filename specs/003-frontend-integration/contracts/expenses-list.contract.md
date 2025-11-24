# Contract: Expenses List Pane (GET /expenses)

**Feature**: Chapter 6 Day 1 – Frontend Integration  
**Component**: `<ExpensesList />` (virtualized table + shared filters)  
**Date**: 19 November 2025

---

## Endpoint

- **Method**: `GET /expenses`
- **Query Params**:
  | Param | Type | Required | Notes |
  |-------|------|----------|-------|
  | `page` | integer | No (default `1`) | 1-indexed; UI enforces `>=1` |
  | `pageSize` | integer | No (default `20`) | Clamp to `100`; display notice when user requests more |
  | `category` | string | No | Mirrors `ExpenseFilters.category`; omit when null |
  | `month` | string (YYYY-MM) | No | Mirrors `ExpenseFilters.month`; omit when null |
- **Response**: `PaginatedExpenseResponse` per `api/spec/openapi.yaml`

## Loading State (FR-004)

- Triggered within **200 ms** of mount or refetch. 
- Render **20 skeleton rows** with alternating shimmer gradient; container has `aria-busy="true"`.
- Summary tiles above fold dim to 60% opacity with label "Loading expenses…" (shared copy deck).

## Empty State (FR-001, FR-004)

- Condition: `response.data.length === 0`.
- Copy: `"No expenses found"` headline + paragraph "Add your first expense to see it here.".
- CTA: Primary button "Add expense" that opens the drawer and shifts focus into `<AddExpenseDrawer />`.
- Illustration: Inline SVG ≤40 KB referenced as `assets/empty-expenses.svg`.

## Error State (FR-001, FR-004)

- Condition: HTTP 4xx/5xx or network failure.
- Render inline alert banner:
  - Title `"Failed to load expenses"` + body `"Request ID: {requestId || 'N/A'}"`.
  - Include `Retry` button (solid secondary) that replays the exact query params.
  - Icon: 24px alert-triangle with `role="img" aria-label="Error"`.

## Success State & Virtualization (FR-001, FR-012)

- Use `react-window` `FixedSizeList` with:
  - `itemSize = 56` px
  - `height = min(viewportHeight - header - filters, 480)`
  - `overscanCount = 5` for smooth scroll.
- Each row is a `button` with `role="listitem"` nested within `role="list"` container.
- Columns: Amount (right-aligned, currency formatted), Category, Date (localized), Pagination summary ("Showing X–Y of Z"), hidden `id` for copy.
- Keyboard: Up/Down arrows move focus to prev/next row; `Enter` opens drawer pre-filled with that row (future Day 2 behavior but focus contract recorded).

## Pagination & Filters

- Footer contains: Prev/Next buttons, page indicator, "Rows per page" select (options 20, 50, 100).
- Changing page triggers TanStack Query `refetch` but preserves scroll offset.
- Filters live in shared controller; when category/month changes, list and summary refetch in parallel.

## Accessibility & UX Guarantees (FR-006, FR-007)

- `aria-live="polite"` announcer announces: `"Expenses updated, showing {visibleCount} of {totalItems}"` after each refresh.
- Focus trap: When drawer closes, focus returns to row that triggered it, even if data refreshed.
- Contrast: Row text ≥4.5:1; alternating background difference ≥3:1.

## Telemetry & Refresh Budget (FR-009, FR-010, FR-010a)

- Manual refresh icon (circular arrow) triggers both GET endpoints; `aria-label="Refresh list and summary"`.
- Wrap refresh flow with `trackRefresh('manual' | 'auto', durationMs, success)` and emit `frontend.expenses.refresh_ms` metric.
- On POST success, mutation invalidates `['expenses', filters]` and replays fetch with optimistic insertion while spinner overlays rows ≤500 ms.

## QA Evidence (FR-005, FR-011)

- Capture screenshots `state-loading.png`, `state-empty.png`, `state-error.png`, `state-success.png` from this pane.
- Tests to enumerate:
  - Pagination edge cases (pageSize > 100 warning, boundary navigation)
  - Error retry flows (requestId surfaces)
  - Keyboard navigation through virtualized rows (focus retention)
  - Auto-refresh after POST success (list updates without full reload)
