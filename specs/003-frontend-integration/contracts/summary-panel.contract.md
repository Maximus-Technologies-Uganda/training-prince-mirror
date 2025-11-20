# Contract: Summary Panel (GET /expenses/summary)

**Feature**: Chapter 6 Day 1 – Frontend Integration  
**Component**: `<ExpenseSummaryPanel />`  
**Date**: 19 November 2025

---

## Endpoint

- **Method**: `GET /expenses/summary`
- **Query Params**: identical to `/expenses` (category, month). Component receives filters from shared controller.
- **Response**: `ExpenseSummary` schema from OpenAPI.

## Layout & Content (FR-003, FR-004)

- Three tiles: Total Amount, Expense Count, Active Filters.
- Each tile contains label, value, supporting text (e.g., "Filters: Food · Nov 2025").
- Loading shimmer overlays tile with `aria-live="polite"` announcement `"Updating summary"`.

## Empty State

- Condition: `count === 0`.
- Copy: `"No summary data yet"` + body referencing current filters.
- CTA: Secondary button "Add an expense" -> opens drawer.

## Error State

- Inline card with `"Failed to load summary"`, requestId text, and Retry button that only re-fetches summary endpoint.
- List pane remains untouched; filter controls stay enabled.

## Success State

- Currency formatting shared with list.
- Filter chips rendered directly under tiles with clear buttons.
- Chips have `aria-label="Remove filter {name}"`.

## Accessibility (FR-006, FR-007)

- Tile group uses `role="status"` for live updates.
- Keyboard order: header → filters → list → summary → drawer triggers; summary chips participate in regular tab order.

## Performance & Staleness (FR-009, FR-010b)

- `generatedAt` timestamp fed into stale banner logic; once >5 minutes old, banner appears across layout referencing this timestamp.
- Retry respects <10 s timeout and surfaces "Still working" helper while awaiting response.

## Telemetry (FR-010a)

- Summary refetch participates in the shared `trackRefresh` metric emitter; event payload includes `pane: 'summary'` plus filter hash for correlation.

## QA Evidence (FR-005, FR-011)

Checklist includes:
- Loading shimmer screenshot (`state-loading.png` – summary variant callout).
- Empty, Error, Success screenshots with captions listing filters.
- Tests enumerating: filter sync, retry-only summary, chip clear restores list/summary, aria-live announcements.

## Test Coverage (FR-011)

| Scenario | Tests |
| --- | --- |
| Loading shimmer announces "Updating summary" and shows tiles skeleton | `tests/contract/expenses-summary.contract.test.tsx` · Loading state case |
| Error card renders request ID + retry-only control | `tests/contract/expenses-summary.contract.test.tsx` · Error case · `tests/e2e/expenses-summary.spec.ts` · Retry summary test |
| Empty state CTA opens drawer + references active filters | `tests/contract/expenses-summary.contract.test.tsx` · Empty state |
| Success tiles mirror totals + filters, background refetch shows "Still working" | `tests/contract/expenses-summary.contract.test.tsx` success case |
| Filter chips emit aria-live announcement, chips + clear buttons sync both panes | `tests/contract/expenses-summary.contract.test.tsx` FilterChips suite |
| Refresh-only summary path leaves list cache untouched | `tests/e2e/expenses-summary.spec.ts` retry test |
| Filter chips + manual refresh update telemetry + stale banner timestamp | `tests/e2e/expenses-summary.spec.ts` filter + refresh test |
| Axe-core regression ensures WCAG AA | `tests/e2e/expenses-accessibility.spec.ts` |

## Screenshot Inventory (FR-005)

| State | File | Notes |
| --- | --- | --- |
| Loading | `specs/003-frontend-integration/summary-state-loading.png` | Captured with shimmer + sr-only announcement |
| Empty | `specs/003-frontend-integration/summary-state-empty.png` | Filters set to `travel` + `2025-11`; CTA highlighted |
| Error | `specs/003-frontend-integration/summary-state-error.png` | Request ID visible with Retry control |
| Success | `specs/003-frontend-integration/summary-state-success.png` | Tiles showing totals, active filters, and chips underneath |

Captions for the above screenshots live in `specs/003-frontend-integration/parent-issue-summary.md` to keep QA packets synchronized.

## Accessibility & Telemetry Notes

- Summary panel and filter chips use `aria-live="polite"` + `role="status"` so screen readers announce updates inline without stealing focus.
- Retry + refresh interactions emit `frontend.expenses.refresh_ms` via `trackRefresh` with `{ pane: 'summary', source: 'manual' }` payloads. Background refetches surface the helper text "Still working on the latest totals…".
- The dedicated axe-core Playwright scan (`tests/e2e/expenses-accessibility.spec.ts`) fails the build on any `serious`/`critical` WCAG 2.1 AA violation.
