# Quickstart: Chapter 6 Day 1 – Frontend Integration

This quickstart explains how to stand up the Day 1 frontend planning environment, exercise the API contracts, and capture the evidence required before implementation PRs begin.

## 1. Prerequisites

- Node.js 20+
- PNPM or npm (repo standard: npm)
- Access to Chapter 5 API base URL (see `.env.example` under `frontend/`)
- Ability to run Vitest + Playwright locally (CI parity)

## 2. Install & Bootstrap

```bash
npm install
```

- Keep using the existing `frontend/` Vite workspace for previews until the Next.js App Router shell lands. The UX contracts in this feature folder already assume Next.js 15; once the scaffold exists, port the same components there.
- Copy `.env.example` → `.env` under `frontend/` and set `VITE_API_BASE_URL` (later reused by Next.js `NEXT_PUBLIC_API_BASE_URL`).

## 3. Run the UI shell

```bash
npm run dev --workspace frontend
```

- Navigate to `/expense` to preview the expenses dashboard mock.
- Use browser devtools to throttle network (Fast 3G) and confirm skeletons appear within 200 ms.

## 4. Apply the Contracts

1. **Shared Filters**: Update `frontend/src/ui-expense/filters.js` (placeholder) so category + month push to `URLSearchParams` and emit a single filter object. Mirror this behavior later in Next.js via `useSearchParams`.
2. **TanStack Query**: Install when implementation begins:
   ```bash
   npm install @tanstack/react-query
   ```
   Create a `queryClient` provider at the app root and register hooks `useExpensesQuery(filters)` + `useSummaryQuery(filters)` that reference the contract query keys.
3. **Virtualization**: Add `react-window` once the Next.js page exists:
   ```bash
   npm install react-window
   ```
   Implement `FixedSizeList` with `itemSize=56` and accessibility wrappers per contract.
4. **Add Expense Drawer**: Wire the form component to POST /expenses; ensure field labels, helper text, and aria messaging match `contracts/add-expense-drawer.contract.md`.
5. **Telemetry**: Introduce `trackRefresh` helper under `frontend/src/utils/telemetry.js` that emits `frontend.expenses.refresh_ms` by posting to the existing observability endpoint (see Chapter 5 logging utilities).

## 5. Capture Mandatory Evidence (FR-005)

- Before `/speckit.tasks`, create `state-loading.png`, `state-empty.png`, `state-error.png`, `state-success.png` inside `specs/003-frontend-integration/`.
- Each screenshot caption must reference the FR number and filters used. Store captions in the Review Packet index.

## 6. Testing & QA Checklist (FR-011)

| Area | Command | Notes |
|------|---------|-------|
| Unit tests | `npm run test` | Ensure TanStack Query hooks covered (≥40% UI statements) |
| Lint | `npm run lint` | ESLint/Prettier gates from Constitution |
| Playwright smoke | `npm run test:e2e` | Add scenario covering drawer submission + auto-refresh |

- Record pagination edge-case tests (pageSize bounds) and validation matrix (≥5 permutations) in QA tracker.
- Run `axe-core` scan (ally-check workflow) once the UI states are mocked to catch focus/aria regressions early.

## 7. Handoff Checklist

- `plan.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md` committed on feature branch `003-frontend-integration`.
- `.github/copilot-instructions.md` updated via agent script so future AI sessions inherit the new tech context (TanStack Query, `react-window`, telemetry metric).
- Phase 2 (`tasks.md`) will be generated via `/speckit.tasks` after this plan is accepted.
