# Issue Summary — Chapter 6 Day 2 Scaffold & Read-Only Integration

Paste the content below into your GitHub issue so it mirrors `tasks.md` with live checkboxes.

**Spec URL**: `specs/003-frontend-integration/spec.md`  
**Tasks Source**: `specs/001-scaffold-expenses-ui/tasks.md`  
**Total Tasks**: 29 (Setup 3 · Foundational 5 · US1 7 · US2 5 · US3 5 · Polish 4)  
**MVP Scope**: Finish Phases 1–3 (US1) to demo the live read-only ledger; US2/US3 are additive.

---

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 Initialize the Next.js 15 App Router workspace with `package.json`, `tsconfig.json`, `next.config.mjs`, and base `app/` shell in `frontend/`
- [ ] T002 [P] Add `.env.example` + `.env.local` template documenting `NEXT_PUBLIC_API_URL` and `NEXT_SERVICE_TOKEN` under `frontend/`
- [ ] T003 [P] Author contributor quickstart + workspace README in `frontend/README.md` aligned with `quickstart.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

- [ ] T004 Enforce runtime env validation via `frontend/config/env.ts` and fail builds lacking `NEXT_PUBLIC_API_URL` or `NEXT_SERVICE_TOKEN` through `next.config.mjs`
- [ ] T005 [P] Implement hardened fetch helper with timeout + token injection in `frontend/lib/api/http.ts`
- [ ] T006 [P] Create TanStack Query provider + cache wiring in `frontend/app/providers/query-client.tsx` and wrap `frontend/app/layout.tsx`
- [ ] T007 [P] Configure Vitest + coverage, ESLint, and Playwright shared setup files (`frontend/vitest.config.ts`, `frontend/tests/setup/vitest.setup.ts`, `frontend/playwright.config.ts`)
- [ ] T008 [P] Add npm scripts for `test:ui`, `test:e2e`, `test:ally`, `review-artifacts`, and `build` inside `frontend/package.json` plus `frontend/scripts/review-artifacts.mjs`

---

## Phase 3: User Story 1 — Review team monitors live expenses (Priority: P1)

**Independent Test**: Load `/expenses` with seeded data and confirm descending order, full row layout, and smooth virtualization for ≥1,000 rows.

- [ ] T009 [P] [US1] Create Vitest contract test for proxy success/error paths in `frontend/tests/unit/api/expenses-route.spec.ts`
- [ ] T010 [P] [US1] Add component test covering virtualization + sorting in `frontend/tests/component/ExpensesVirtualList.spec.tsx`
- [ ] T011 [P] [US1] Implement secured proxy handler with service-token injection in `frontend/app/api/expenses/route.ts`
- [ ] T012 [P] [US1] Build typed API client + TanStack Query hook in `frontend/lib/api/expenses.ts`
- [ ] T013 [US1] Compose `/expenses` page with Suspense + query provider in `frontend/app/expenses/page.tsx`
- [ ] T014 [US1] Create `ExpensesVirtualList.tsx`, `ExpensesRow.tsx`, and supporting styles under `frontend/app/expenses/components/`
- [ ] T015 [US1] Expose `/expenses` via shell/navigation updates in `frontend/app/layout.tsx` and `frontend/app/(shell)/Nav.tsx`

---

## Phase 4: User Story 2 — Owner understands empty ledger (Priority: P2)

**Independent Test**: Stub `/api/expenses` to return `[]` and verify empty illustration + copy plus CTA opening the drawer placeholder with focus trapping.

- [ ] T016 [P] [US2] Add component test covering empty-state rendering + CTA focus trap in `frontend/tests/component/EmptyLedger.spec.tsx`
- [ ] T017 [P] [US2] Extend Playwright spec to force empty response and capture screenshot in `frontend/tests/e2e/expenses-empty.spec.ts`
- [ ] T018 [P] [US2] Build `EmptyLedger.tsx` + illustration asset import under `frontend/app/expenses/components/`
- [ ] T019 [US2] Scaffold `AddExpenseDrawer.tsx` placeholder with focus trap + aria labelling in `frontend/app/expenses/drawer/`
- [ ] T020 [US2] Wire CTA + drawer state machine + copy hooks inside `frontend/app/expenses/page.tsx`

---

## Phase 5: User Story 3 — Reviewer recovers from load failures (Priority: P3)

**Independent Test**: Force `/api/expenses` to fail/timeout, observe skeleton → error transition, click retry, and confirm request + telemetry re-fire.

- [ ] T021 [P] [US3] Add Vitest test for skeleton/error transitions in `frontend/tests/component/ExpensesSkeleton.spec.tsx`
- [ ] T022 [P] [US3] Extend Playwright spec to capture loading + error screenshots in `frontend/tests/e2e/expenses-error-loading.spec.ts`
- [ ] T023 [P] [US3] Implement shimmer skeleton + accessibility hooks in `frontend/app/expenses/components/ExpensesSkeleton.tsx`
- [ ] T024 [US3] Build error banner + retry button component in `frontend/app/expenses/components/LoadError.tsx`
- [ ] T025 [US3] Wire TanStack Query retry/invalidation + telemetry logging in `frontend/lib/observability/expenses-telemetry.ts` and `frontend/app/expenses/page.tsx`

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T026 [P] Automate coverage + screenshot bundling in `frontend/scripts/review-artifacts.mjs` and publish to `review-artifacts/index.html`
- [ ] T027 [P] Update GitHub Actions (`.github/workflows/test-ui.yml`, `playwright-smoke.yml`, `ally-check.yml`, `build-frontend.yml`) to run new frontend scripts
- [ ] T028 [P] Document `/expenses` runbook + troubleshooting in `frontend/docs/expenses-readme.md`
- [ ] T029 Validate quickstart instructions end-to-end and capture results in `specs/001-scaffold-expenses-ui/quickstart.md`

---

### Parallel Opportunities

- US1: Proxy route (T011), API hook (T012), and virtualization/tests (T009–T010/T014) can run together.
- US2: Empty component (T018), drawer scaffold (T019), and Playwright capture (T017) touch distinct files.
- US3: Skeleton component (T023) and telemetry/retry wiring (T025) can proceed alongside Playwright screenshots (T022).

### MVP & Follow-ons

- **MVP**: Phases 1–3 (T001–T015).
- **Next**: Layer US2 (T016–T020), then US3 (T021–T025), and close with Polish (T026–T029).
