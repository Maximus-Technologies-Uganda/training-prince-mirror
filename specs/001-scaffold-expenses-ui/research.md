# Phase 0 Research — Chapter 6 Day 2 Scaffold

## Decision: Proxy Chapter 5 `/expenses` through a Next.js 15 App Router server route
- **Rationale**: A route handler at `frontend/app/api/expenses/route.ts` can run server-side only, inject the shared service token via `NEXT_SERVICE_TOKEN`, and call `process.env.NEXT_PUBLIC_API_URL + '/expenses'` with hardened timeouts/logging. This keeps secrets off the client, centralizes error handling, and allows caching headers aligned with Chapter 5 API expectations.
- **Alternatives considered**:
  - Direct client-side fetch from the browser → rejected because it would expose the service token and block future auth changes.
  - Reusing a legacy Vite proxy → rejected because Chapter 6 mandates the Next.js 15 workspace and we need App Router middleware for telemetry.

## Decision: Use TanStack Query 5 for read-through caching + manual refresh controls
- **Rationale**: `useQuery` with `{ queryKey: ['expenses'], staleTime: 2 * 60 * 1000, gcTime: 10 * 60 * 1000 }` covers the “reuse cached results unless stale” requirement while enabling manual retry via `queryClient.invalidateQueries`. Suspense integration keeps the loading skeleton consistent across route transitions.
- **Alternatives considered**:
  - Custom React context + fetch → rejected because it would reimplement cache/retry logic and conflict with Constitution principle I (no duplicated logic) for data orchestration.
  - SWR → rejected because the team standardized on TanStack Query 5 per Chapter 6 tech stack and we need tight control over retries/backoff.

## Decision: Virtualize the list with `react-window` `FixedSizeList`
- **Rationale**: Expenses rows share a fixed height under the Day 1 design, letting us render 1,000+ items at 60 FPS with `FixedSizeList`. It has minimal bundle cost, proven ergonomics with keyboard navigation, and existing typings.
- **Alternatives considered**:
  - `react-virtualized` → heavier bundle, no longer the recommended library from our frontend guild.
  - CSS-only lazy rendering → insufficient for 1k rows and would still paint all DOM nodes, missing the performance goal.

## Decision: Capture loading/empty/error/success screenshots via Playwright state forcing
- **Rationale**: A Playwright suite can intercept the `/api/expenses` proxy, respond with fixtures per state, drive the CTA/drawer interactions, and call `page.screenshot({ path: 'review-artifacts/ui-states/<state>.png' })`. Running in CI ensures reproducibility and ties screenshots to commit SHA.
- **Alternatives considered**:
  - Manual screenshot collection → error-prone and not automatable for CI review packets.
  - Component-level Storybook capture → out of scope for Chapter 6; our CI already funds Playwright smoke jobs, so extending them is lower overhead.

## Decision: Produce coverage via Vitest + `@vitest/coverage-v8` wired into review packet
- **Rationale**: Vitest already runs in other chapters, and `@vitest/coverage-v8` emits the Istanbul JSON/HTML artifacts we index inside `review-artifacts/index.html`. Enforcing `--coverage.enabled true` plus a UI-specific threshold (≥55% statements) aligns with FR-010 and Constitution II.
- **Alternatives considered**:
  - Jest → no longer part of the active toolchain and would add duplicate configs.
  - `c8` CLI only → would complicate per-suite thresholds and hamper Vitest integration.

## Decision: Run accessibility checks with `@axe-core/playwright` in the smoke flow
- **Rationale**: `@axe-core/playwright` already ships in Chapter 6 automation (per constitution), so extending the smoke spec to call `await new AxeBuilder({ page }).analyze()` against `/expenses` satisfies FR-009 and SC-003 without new dependencies.
- **Alternatives considered**:
  - Deque CLI or manual audits → slower feedback and not integrated with the existing GitHub Actions job.
  - Pa11y → extra dependency, no current CI wiring, and redundant with axe which the team already adopted.
