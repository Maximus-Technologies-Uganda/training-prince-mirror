# Research – Chapter 6 Day 1 Frontend Integration

## Stack alignment (Next.js vs current Vite shell)
Decision: Document UX, routing, and data guidelines assuming Next.js 15 App Router (React 18) while continuing to store artifacts under the existing `frontend/` workspace; treat the current Vite shell as a temporary host until the Next.js app scaffold lands later this chapter.
Rationale: The Chapter 6 charter and Day 1 spec explicitly target a Next.js dashboard, but the repo still contains a Vite prototype. Planning now for the App Router ensures contracts (loading states, shared filters, telemetry hooks) translate directly once the Next.js codebase is created, without blocking documentation work today.
Alternatives considered: (a) Reinterpret the spec for Vite-only delivery—rejected because it contradicts the signed-off Chapter 6 scope; (b) Defer documentation until the Next.js repo exists—rejected because Phase 0/1 artifacts are gating inputs for the build kickoff.

## Data fetching & caching layer
Decision: Adopt TanStack Query (React Query 5) for GET /expenses, GET /expenses/summary, and POST /expenses mutations, standardizing on query keys that include shared filters and exposing helpers to invalidate/refetch both endpoints in parallel.
Rationale: TanStack Query natively handles deduped requests, background refresh, cacheTime/staleTime controls, mutation side-effects, and optimistic updates—exactly what the spec requires for shared filters, stale banners, and auto-refresh after POST success. It also offers devtools/telemetry hooks we can wrap to emit `frontend.expenses.refresh_ms` metrics.
Alternatives considered: (a) SWR—simple but lacks first-class mutations and granular invalidation hooks needed for simultaneous list + summary refresh; (b) DIY `fetch` + context—would duplicate retry/cache logic and invite state divergence between panes.

## Virtualized list for >200 rows
Decision: Use `react-window`'s `FixedSizeList` to render the expenses table with 56px rows, keyboard-focusable list items, and an offscreen aria-live region announcing item counts when virtualization changes the DOM.
Rationale: `react-window` stays under 2 KB gzipped, fits the spec requirement for a "lightweight" solution, and works in both Vite and Next.js environments without advanced configuration. Fixed heights keep math simple, and the API lets us inject custom renderers for alternating row colors, pagination affordances, and skeleton placeholders while maintaining <2.5 s LCP.
Alternatives considered: (a) `react-virtualized`—heavier (30+ KB) and more complex than we need; (b) Manual windowing—prone to off-by-one/focus bugs and would take longer to vet for accessibility.

## Shared filter orchestration
Decision: Store category/month filters in a dedicated controller (URL search params + React Context), and derive TanStack Query keys (`['expenses', filters]`, `['expenses-summary', filters]`) so a single filter change propagates to both GET endpoints while keeping retry/error states isolated per pane.
Rationale: Centralizing filters guarantees GET /expenses and GET /expenses/summary always receive identical parameters, satisfying FR-003a and avoiding mismatched UI states. Encoding filters in the URL also gives QA deterministic repro steps and screenshot traceability.
Alternatives considered: (a) Let each widget own its own filters—rejected because it violates the shared-filter requirement and complicates QA evidence; (b) Global Redux store—overkill for Day 1 and would duplicate TanStack Query's state machine.

## Telemetry & refresh metric emission
Decision: Wrap manual/automatic refresh flows in a utility that timestamps before/after TanStack Query refetch calls, emits `frontend.expenses.refresh_ms` along with success/failure labels, and forwards the payload to the existing observability client used elsewhere in `frontend/` (same channel as Chapter 5 API logs).
Rationale: The spec mandates instrumentation so reviewers can monitor refresh health. Measuring around the shared refetch ensures both GET endpoints are captured, while reusing the established telemetry client keeps us compliant with the Constitution's "No new tooling without approval" rule.
Alternatives considered: (a) Client-side `console.table` logging only—insufficient for CI pipelines; (b) Creating a bespoke metrics service—would violate the simplicity constraint and add unnecessary governance overhead.
