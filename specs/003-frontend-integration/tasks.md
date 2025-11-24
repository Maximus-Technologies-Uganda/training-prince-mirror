---
description: "Execution tasks for Chapter 6 Day 1 – Frontend Integration"
---

# Tasks: Chapter 6 Day 1 – Frontend Integration

**Input**: Documentation set under `/Users/prnceb/Desktop/WORK/training-prince/specs/003-frontend-integration/`

**Prerequisites**: `/plan.md`, `/spec.md`, `/research.md`, `/data-model.md`, `/contracts/*.md`, `/quickstart.md`

**Tests**: FR-011 mandates explicit QA coverage; test tasks are included in every user story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the frontend workspace so feature work can run on the documented stack.

- [X] T001 Configure API + telemetry environment variables in `/Users/prnceb/Desktop/WORK/training-prince/frontend/.env` by copying `frontend/.env.example` and setting `NEXT_PUBLIC_API_BASE_URL` plus `NEXT_PUBLIC_TELEMETRY_REFRESH_ENDPOINT`.
- [X] T002 [P] Add `@tanstack/react-query`, `@tanstack/react-query-devtools`, `react-window`, `date-fns`, and `classnames` dependencies plus workspace scripts inside `/Users/prnceb/Desktop/WORK/training-prince/frontend/package.json` (run install to refresh lockfile).
- [X] T003 Update `/Users/prnceb/Desktop/WORK/training-prince/package.json` scripts and `/Users/prnceb/Desktop/WORK/training-prince/frontend/README.md` so `npm run dev:frontend`, `npm run test:frontend`, and `npm run lint:frontend` follow the Quickstart instructions (Fast 3G throttle + screenshot capture prep).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the shared providers, models, and telemetry utilities that every user story depends on.

- [X] T004 Create the Next.js App Router shell for `/expenses` in `/Users/prnceb/Desktop/WORK/training-prince/frontend/app/expenses/layout.tsx`, injecting the TanStack Query + filter providers and base grid structure defined in `plan.md`.
- [X] T005 [P] Implement `QueryProvider` with a preconfigured `QueryClient`, devtools toggle, and default stale/refetch timings in `/Users/prnceb/Desktop/WORK/training-prince/frontend/app/providers/QueryProvider.tsx`.
- [X] T006 [P] Build the shared filter controller + hook (`ExpenseFiltersProvider` and `useExpenseFilters`) under `/Users/prnceb/Desktop/WORK/training-prince/frontend/app/expenses/context/ExpenseFiltersProvider.tsx` and `/Users/prnceb/Desktop/WORK/training-prince/frontend/app/expenses/hooks/useExpenseFilters.ts`, syncing URL search params and emitting telemetry metadata.
- [X] T007 [P] Define the client-side data mappers for `Expense`, `PaginatedExpenseResponse`, `ExpenseSummary`, and `UIStateEvidence` at `/Users/prnceb/Desktop/WORK/training-prince/frontend/app/expenses/models/expense.ts`, `paginatedResponse.ts`, and `summary.ts` to match `data-model.md` (including formatting helpers + validation guards).
- [X] T008 Implement telemetry + stale timer utilities in `/Users/prnceb/Desktop/WORK/training-prince/frontend/app/expenses/utils/trackRefresh.ts` and `/Users/prnceb/Desktop/WORK/training-prince/frontend/app/expenses/utils/staleTimers.ts` so manual/auto refreshes emit `frontend.expenses.refresh_ms` and stale banners fire after five minutes.

**Checkpoint**: Foundation complete—user stories can now proceed in priority order.

---

## Phase 3: User Story 1 – Review daily expenses (Priority: P1) 🎯 MVP

**Goal**: Finance reviewers can open the dashboard, see GET `/expenses` data with shared filters, and understand list states.

**Independent Test**: Point the frontend at GET `/expenses` mock responses covering loading, empty, error, and success states; verify each renders with the mandated copy, CTA, pagination, and accessibility cues from `spec.md` scenarios US1-S1…S4.

### Tests for User Story 1 (required by FR-011)

- [X] T009 [P] [US1] Author Vitest contract coverage for GET `/expenses` loading/empty/error/success permutations in `/Users/prnceb/Desktop/WORK/training-prince/tests/contract/expenses-list.contract.test.tsx` using the OpenAPI fixtures.
- [X] T010 [P] [US1] Create a Playwright journey `/Users/prnceb/Desktop/WORK/training-prince/tests/e2e/expenses-list.spec.ts` that throttles to Fast 3G, asserts skeleton appearance within 200 ms, and exercises retry/pagination paths.

### Implementation for User Story 1

- [X] T011 [P] [US1] Implement the accessible filter toolbar with category + month inputs, URL sync, and shared CTA wiring inside `/Users/prnceb/Desktop/WORK/training-prince/frontend/app/expenses/components/ExpenseFiltersBar.tsx`.
- [X] T012 [P] [US1] Build the virtualized list UI (20 skeleton rows, alternating colors, pagination footer) with `react-window` inside `/Users/prnceb/Desktop/WORK/training-prince/frontend/app/expenses/components/ExpensesList.tsx`.
- [X] T013 [US1] Create the TanStack Query hook for GET `/expenses` with cache keys tied to filters, error handling, and stale banner metadata in `/Users/prnceb/Desktop/WORK/training-prince/frontend/app/expenses/hooks/useExpensesQuery.ts`.
- [X] T014 [US1] Compose `/Users/prnceb/Desktop/WORK/training-prince/frontend/app/expenses/page.tsx` so the list, filters, stale banner, and manual refresh icon share telemetry + focus restoration per FR-004/FR-010.
- [X] T015 [US1] Capture and store `state-loading.png`, `state-empty.png`, `state-error.png`, and `state-success.png` artifacts under `/Users/prnceb/Desktop/WORK/training-prince/specs/003-frontend-integration/` with captions referencing FR-005.

### Parallel execution example – User Story 1

- Run T009 and T010 concurrently because tests touch `/tests` while implementation has not begun.
- Develop T011 and T012 in parallel (separate component files) while T013 prepares the data hook; integrate via T014 afterward.

---

## Phase 4: User Story 2 – Capture a new expense (Priority: P2)

**Goal**: Contributors can open the right-side drawer, submit POST `/expenses`, and see validation plus auto-refresh without leaving the page.

**Independent Test**: Trigger the drawer, submit valid/invalid payloads against POST `/expenses`, confirm inline errors map to the API response, success toasts fire, and the list refreshes immediately.

### Tests for User Story 2 (required by FR-011)

- [X] T016 [P] [US2] Write Vitest validation-matrix tests covering positive flow + five error permutations in `/Users/prnceb/Desktop/WORK/training-prince/tests/contract/add-expense-drawer.contract.test.ts`.
- [X] T017 [P] [US2] Extend Playwright coverage in `/Users/prnceb/Desktop/WORK/training-prince/tests/e2e/add-expense-drawer.spec.ts` to verify drawer focus trap, duplicate submit prevention, and toast behavior.
- [ ] T031 [P] [US2] Implement a Playwright keyboard-navigation journey that tabs through the “Add expense” drawer, submits with Enter, and confirms focus returns correctly without mouse input.

### Implementation for User Story 2

- [X] T018 [P] [US2] Build `<AddExpenseDrawer />` with focus trap, aria labels, and helper text inside `/Users/prnceb/Desktop/WORK/training-prince/frontend/app/expenses/components/AddExpenseDrawer.tsx` following the contract table.
- [X] T019 [P] [US2] Implement `useCreateExpenseMutation` in `/Users/prnceb/Desktop/WORK/training-prince/frontend/app/expenses/hooks/useCreateExpenseMutation.ts` to post payloads, disable the submit button, and optimistically insert new rows.
- [X] T020 [US2] Wire drawer triggers (header CTA, empty state CTA, summary CTA) plus focus restoration within `/Users/prnceb/Desktop/WORK/training-prince/frontend/app/expenses/page.tsx`.
- [X] T021 [US2] Emit telemetry + validation logs for successes/errors via `/Users/prnceb/Desktop/WORK/training-prince/frontend/app/expenses/utils/trackRefresh.ts` and ensure stale banners clear after POST success.
- [X] T022 [US2] Document the validation matrix + screenshot references for the drawer in `/Users/prnceb/Desktop/WORK/training-prince/specs/003-frontend-integration/contracts/add-expense-drawer.contract.md` so QA evidence stays synced.

### Parallel execution example – User Story 2

- Prepare tests (T016, T017) while component work begins.
- T018 and T019 can progress simultaneously because one builds UI and the other handles mutations; T020-T021 integrate afterward.

---

## Phase 5: User Story 3 – Understand summary trends (Priority: P3)

**Goal**: Finance leads can read GET `/expenses/summary` totals, adjust filters, and recover independently from errors.

**Independent Test**: Hit GET `/expenses/summary` with/without filters, verify loading shimmers, empty/error copy, retry-only summary refresh, and filter chips stay in sync.

### Tests for User Story 3 (required by FR-011)

- [X] T023 [P] [US3] Implement Vitest contract assertions for summary totals + filter chips in `/Users/prnceb/Desktop/WORK/training-prince/tests/contract/expenses-summary.contract.test.ts`.
- [X] T024 [P] [US3] Add Playwright e2e coverage at `/Users/prnceb/Desktop/WORK/training-prince/tests/e2e/expenses-summary.spec.ts` for load/empty/error flows plus retry-only summary behavior.

### Implementation for User Story 3

- [X] T025 [P] [US3] Build `useExpenseSummaryQuery` with shared cache keys and generatedAt timestamps under `/Users/prnceb/Desktop/WORK/training-prince/frontend/app/expenses/hooks/useExpenseSummaryQuery.ts`.
- [X] T026 [P] [US3] Create `<ExpenseSummaryPanel />` with three tiles, loading shimmers, and retry-only refresh logic inside `/Users/prnceb/Desktop/WORK/training-prince/frontend/app/expenses/components/ExpenseSummaryPanel.tsx`.
- [X] T027 [US3] Implement filter chip rendering + clear buttons plus aria-live messaging in `/Users/prnceb/Desktop/WORK/training-prince/frontend/app/expenses/components/FilterChips.tsx`, ensuring chips update both list and summary.
- [X] T028 [US3] Capture summary-state screenshots (loading/empty/error/success) and store them beside captions in `/Users/prnceb/Desktop/WORK/training-prince/specs/003-frontend-integration/` to satisfy FR-005.

### Parallel execution example – User Story 3

- Run T023 and T024 together to lock QA expectations.
- T025 (hook) and T026 (panel) can advance in parallel; T027 integrates chips afterward.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Harden accessibility, documentation, and telemetry after all user stories function independently.

- [X] T029 [P] Add automated Axe + `@axe-core/playwright` accessibility regression suite at `/Users/prnceb/Desktop/WORK/training-prince/tests/e2e/expenses-accessibility.spec.ts` and resolve any WCAG AA violations.
- [ ] T030 [P] Verify the performance budget via Lighthouse (or local Web Vitals audit): confirm LCP < 2.5 s on Fast 3G and bundle/assets stay within the documented caps, then capture the results in the PR notes.
- [X] T032 [P] Update `/Users/prnceb/Desktop/WORK/training-prince/ACCESSIBILITY_AUDIT.md` and `/Users/prnceb/Desktop/WORK/training-prince/CHANGELOG.md` with the new UI states, telemetry metric, and screenshot references.
- [X] T033 Run the Quickstart validation (`npm run dev:frontend`, `npm run test`, `npm run lint`, `npm run test:e2e`) and record outcomes plus troubleshooting tips inside `/Users/prnceb/Desktop/WORK/training-prince/specs/003-frontend-integration/quickstart.md`.

---

## Dependencies & Execution Order

1. **Setup (Phase 1)** → enables tooling + scripts.
2. **Foundational (Phase 2)** → depends on Setup; blocks all user stories until providers/models/telemetry exist.
3. **User Story 1 (Phase 3)** → first deliverable (MVP); unlocks base dashboard once tests + implementation tasks (T009–T015) finish.
4. **User Story 2 (Phase 4)** → depends on Foundational + US1 hooks (drawer CTA integration) but can proceed once list shell exists.
5. **User Story 3 (Phase 5)** → depends on Foundational (filters + telemetry) yet largely independent from US2 aside from shared CTAs.
6. **Polish (Phase 6)** → runs after targeted user stories complete to consolidate QA + docs.

User stories can proceed in parallel after Phase 2 if staffing allows, but testing + integration checkpoints (e.g., T014, T020, T027) must verify independence before moving on.

## Implementation Strategy (MVP-first, incremental)

1. Finish Phases 1–2 to establish the shared providers.
2. Deliver Phase 3 completely (tests + implementation + screenshots) as the MVP; validate independently via Vitest + Playwright before merging.
3. Layer in Phase 4 to unlock creation flows, again running its dedicated test suite before integration.
4. Add Phase 5 summary insights; confirm chips + retry logic without regressing earlier stories.
5. Close with Phase 6 polish to document accessibility, telemetry, and runbook outcomes.

## Validation Checklist

- **User Story 1**: T009–T015 ensure GET `/expenses` states, shared filters, and screenshot artifacts exist with independent tests.
- **User Story 2**: T016–T022 cover POST `/expenses` validation, focus handling, telemetry, and QA documentation.
- **User Story 3**: T023–T028 guarantee summary tiles, filter chips, retry-only refresh, and screenshot evidence.
- **Cross-cutting**: T029–T033 verify accessibility, performance audits, documentation, and Quickstart parity.

Each story’s tasks include everything needed (tests + implementation + evidence) so they can be developed, tested, and shipped independently.
