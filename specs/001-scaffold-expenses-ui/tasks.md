# Tasks: Chapter 6 Day 2 — Scaffold & Read-Only Integration

**Input**: Design documents from `/specs/001-scaffold-expenses-ui/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the Next.js 15 workspace, env scaffolding, and contributor docs before any feature work.

- [x] T001 Initialize the Next.js 15 App Router workspace with `package.json`, `tsconfig.json`, `next.config.mjs`, and base `app/` shell in `frontend/`
- [x] T002 [P] Add `.env.example` + `.env.local` template documenting `NEXT_PUBLIC_API_URL` and `NEXT_SERVICE_TOKEN` under `frontend/`
- [x] T003 [P] Author contributor quickstart + workspace README in `frontend/README.md` aligned with quickstart.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Configure environment validation, shared clients, and test/CI scaffolding required by every user story.

- [x] T004 Enforce runtime env validation via `frontend/config/env.ts` and fail builds lacking `NEXT_PUBLIC_API_URL` or `NEXT_SERVICE_TOKEN` through `next.config.mjs`
- [x] T005 [P] Implement hardened fetch helper with timeout + token injection in `frontend/lib/api/http.ts`
- [x] T006 [P] Create TanStack Query provider + cache wiring in `frontend/app/providers/query-client.tsx` and wrap `frontend/app/layout.tsx`
- [x] T007 [P] Configure Vitest + coverage, ESLint, and Playwright shared setup files (`frontend/vitest.config.ts`, `frontend/tests/setup/vitest.setup.ts`, `frontend/playwright.config.ts`)
- [x] T008 [P] Add npm scripts for `test:ui`, `test:e2e`, `test:ally`, `review-artifacts`, and `build` inside `frontend/package.json` plus `frontend/scripts/review-artifacts.mjs`

**Checkpoint**: Foundation ready — user stories can now proceed in parallel.

---

## Phase 3: User Story 1 — Review team monitors live expenses (Priority: P1) 🎯 MVP

**Goal**: Deliver a `/expenses` route that proxies Chapter 5 data, caches results, and renders the Day 1 ledger layout with virtualization.

**Independent Test**: Seed the API with ≥1 row, visit `/expenses`, and confirm merchant/category/date/status/amount render in descending purchase date order with smooth scrolling for 1,000+ rows.

### Tests (write before implementation)

- [x] T009 [P] [US1] Create Vitest contract test for proxy success/error paths in `frontend/tests/unit/api/expenses-route.spec.ts`
- [x] T010 [P] [US1] Add component test covering virtualization + sorting in `frontend/tests/component/ExpensesVirtualList.spec.tsx`

### Implementation

- [x] T011 [P] [US1] Implement secured proxy handler with service-token injection in `frontend/app/api/expenses/route.ts`
- [x] T012 [P] [US1] Build typed API client + TanStack Query hook in `frontend/lib/api/expenses.ts`
- [x] T013 [US1] Compose `/expenses` page with Suspense + query provider in `frontend/app/expenses/page.tsx`
- [x] T014 [US1] Create `ExpensesVirtualList.tsx`, `ExpensesRow.tsx`, and supporting styles under `frontend/app/expenses/components/`
- [x] T015 [US1] Expose `/expenses` via global shell/navigation updates in `frontend/app/layout.tsx` and `frontend/app/(shell)/Nav.tsx`

**Parallel opportunities**: T009 and T010 can run concurrently with T011/T012; T014 can start once T012 establishes data shapes.

---

## Phase 4: User Story 2 — Owner understands empty ledger (Priority: P2)

**Goal**: Provide the approved empty state with illustration, copy, and CTA that opens the add-expense drawer placeholder with focus trapping.

**Independent Test**: Stub `/api/expenses` to return `[]` and verify the empty illustration, copy, and CTA open the drawer placeholder while trapping focus.

### Tests

- [x] T016 [P] [US2] Add component test covering empty-state rendering + CTA focus trap in `frontend/tests/component/EmptyLedger.spec.tsx`
- [x] T017 [P] [US2] Extend Playwright spec to force empty response and capture screenshot in `frontend/tests/e2e/expenses-empty.spec.ts`

### Implementation

- [x] T018 [P] [US2] Build `EmptyLedger.tsx` + illustration asset import under `frontend/app/expenses/components/`
- [x] T019 [US2] Scaffold `AddExpenseDrawer.tsx` placeholder with focus trap + aria labelling in `frontend/app/expenses/drawer/`
- [x] T020 [US2] Wire CTA + drawer state machine + copy hooks inside `frontend/app/expenses/page.tsx`

**Parallel opportunities**: T016 and T017 can run once T018 stub exists; T019 and T020 can progress in parallel after CTA contract defined.

---

## Phase 5: User Story 3 — Reviewer recovers from load failures (Priority: P3)

**Goal**: Surface skeleton loaders, explicit error banners, and retry/telemetry wiring so reviewers can self-serve when API calls fail.

**Independent Test**: Force `/api/expenses` to timeout, observe skeleton → error transition, click retry, and confirm request reissues plus telemetry logs.

### Tests

- [x] T021 [P] [US3] Add Vitest test for skeleton/error transitions in `frontend/tests/component/ExpensesSkeleton.spec.tsx`
- [x] T022 [P] [US3] Extend Playwright spec to capture loading + error screenshots in `frontend/tests/e2e/expenses-error-loading.spec.ts`

### Implementation

- [x] T023 [P] [US3] Implement shimmer skeleton + accessibility hooks in `frontend/app/expenses/components/ExpensesSkeleton.tsx`
- [x] T024 [US3] Build error banner + retry button component in `frontend/app/expenses/components/LoadError.tsx`
- [x] T025 [US3] Wire TanStack Query retry/invalidation + telemetry logging in `frontend/lib/observability/expenses-telemetry.ts` and `frontend/app/expenses/page.tsx`

**Parallel opportunities**: T021/T022 can run alongside T023; T024 and T025 can proceed once telemetry contract is finalized.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finalize review artifacts, CI wiring, and documentation that span all user stories.

- [x] T026 [P] Automate coverage + screenshot bundling in `frontend/scripts/review-artifacts.mjs` and publish to `review-artifacts/index.html`
- [x] T027 [P] Update GitHub Actions (`.github/workflows/test-ui.yml`, `playwright-smoke.yml`, `ally-check.yml`, `build-frontend.yml`) to run new frontend scripts
- [x] T028 [P] Document `/expenses` runbook + troubleshooting in `frontend/docs/expenses-readme.md`
- [x] T029 Validate quickstart instructions end-to-end and capture results in `specs/001-scaffold-expenses-ui/quickstart.md`

---

## Dependencies & Execution Order

1. **Phase 1 → Phase 2**: Setup must complete before foundational work (`T001-T003` → `T004-T008`).
2. **Phase 2 → User Stories**: All user stories depend on the foundational env, API client, and testing harness being in place.
3. **User Story Order**: Execute in priority order (US1 → US2 → US3) for MVP delivery, but once Phase 2 is complete teams can staff them in parallel as long as shared files are coordinated.
4. **Polish**: Phase 6 tasks (`T026-T029`) require all user stories to finish so artifacts + docs cover every state.

## Parallel Execution Examples per Story

- **US1**: While one dev codes the proxy route (T011) another can implement the API hook (T012) and a third can focus on virtualization components/tests (T009-T010, T014).
- **US2**: Empty-state component work (T018) can happen simultaneously with the drawer placeholder (T019) and Playwright screenshot wiring (T017) because they touch different files.
- **US3**: Skeleton component (T023) and telemetry wiring (T025) can progress independently, with Playwright assertions (T022) running in parallel once intercept fixtures exist.

## Implementation Strategy

1. **MVP (US1 only)**: Complete Phases 1-2, finish all US1 tasks (T009-T015), and demo the populated ledger.
2. **Incremental Delivery**: Layer in US2 (T016-T020) for empty-state readiness, then US3 (T021-T025) for resiliency; each story remains independently testable per its criteria.
3. **Hardening & Artifacts**: Close with Phase 6 polish tasks (T026-T029) to keep CI, documentation, and review packet outputs compliant with FR-009/FR-010.
