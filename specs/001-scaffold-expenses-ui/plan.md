# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION]  
**Primary Dependencies**: [e.g., FastAPI, UIKit, LLVM or NEEDS CLARIFICATION]  
**Storage**: [if applicable, e.g., PostgreSQL, CoreData, files or N/A]  
**Testing**: [e.g., pytest, XCTest, cargo test or NEEDS CLARIFICATION]  
**Target Platform**: [e.g., Linux server, iOS 15+, WASM or NEEDS CLARIFICATION]
**Project Type**: [single/web/mobile - determines source structure]  
**Performance Goals**: [domain-specific, e.g., 1000 req/s, 10k lines/sec, 60 fps or NEEDS CLARIFICATION]  
**Constraints**: [domain-specific, e.g., <200ms p95, <100MB memory, offline-capable or NEEDS CLARIFICATION]  
**Scale/Scope**: [domain-specific, e.g., 10k users, 1M LOC, 50 screens or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

[Gates determined based on constitution file]

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

## Implementation Plan: Chapter 6 Day 2 — Scaffold & Read-Only Integration

**Branch**: `001-scaffold-expenses-ui` | **Date**: 2025-11-20 | **Spec**: `/specs/001-scaffold-expenses-ui/spec.md`
**Input**: Feature specification from `/specs/001-scaffold-expenses-ui/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Scaffold a production-ready Next.js 15 App Router workspace in `frontend/` that delivers a `/expenses` route backed by a proxy server route to the Chapter 5 API, rendering the read-only ledger with loading/empty/error/success states, virtualization for ≥1k rows, Day 1 visual contract, ≥55% UI coverage, and CI artifacts (coverage report + four Playwright screenshots + smoke + accessibility jobs).

## Technical Context

**Language/Version**: TypeScript + React 18 on Next.js 15 (Node.js 20 runtime)  
**Primary Dependencies**: Next.js 15 App Router, React 18, TanStack Query 5 (data cache + retries), `react-window` (virtualized list), shared Chapter 5 API client, Vitest 3.2.4, Playwright 1.48.2 + `@axe-core/playwright`  
**Storage**: N/A (read-only fetch from Chapter 5 API)  
**Testing**: Vitest (unit + coverage ≥55%), Playwright smoke + screenshot harness, lint via ESLint/Prettier, axe accessibility scan  
**Target Platform**: Web (Next.js 15 App Router deployed via Node 20 / Vercel-like runtime)  
**Project Type**: Web frontend (Next.js monorepo surface in `frontend/`)  
**Performance Goals**: Render 1,000 expense rows at ≥60 FPS via virtualization; initial `/expenses` load resolves into a valid state within 2s on broadband; cache GET `/expenses` results per session  
**Constraints**: Must proxy API via secured Next.js route injecting service token; enforce `NEXT_PUBLIC_API_URL` at build time; honor Chapter 6 constitution (no duplicated backend logic, ≥40% coverage + review packet); Day 1 skeleton + empty/error designs; CI jobs `test-ui`, `playwright-smoke`, `ally-check` cannot regress; coverage artifacts + four screenshots required  
**Scale/Scope**: Single `/expenses` surface plus drawer scaffold, virtualization for up to thousands of rows, supporting server route, state machine, and CI automation hooks

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **No Logic Duplication** – PASS: Read-only data flows reuse Chapter 5 API via a server route proxy (no recreation of ledger logic in the UI).
- **Test Coverage Mandate (≥40%)** – PASS: Plan targets ≥55% statements on the new frontend via Vitest suites plus Playwright instrumentation, exceeding the constitutional minimum.
- **Reviewability is Paramount** – PASS: Deliverables include coverage artifacts and Playwright screenshots referenced from the review packet index.
- **PR Craft + CI Gates** – PASS: Work stays within branch `001-scaffold-expenses-ui`, splits into reviewable chunks (<300 LOC per PR), and runs lint, tests, build, smoke, and accessibility checks under CI.
- **Simplicity & Consistency** – PASS: Implementation sticks with Next.js 15, TanStack Query, `react-window`, and existing lint/test toolchain; any new tooling would require governance approval (none planned).

## Project Structure

### Documentation (this feature)

```text
specs/001-scaffold-expenses-ui/
├── plan.md          # Filled by /speckit.plan (this file)
├── research.md      # Phase 0 research outputs (to be generated)
├── data-model.md    # Entities + relationships (Phase 1)
├── quickstart.md    # Setup + run guide for frontend surface
├── contracts/       # API contracts (OpenAPI fragments for proxy + upstream)
└── tasks.md         # Authored later via /speckit.tasks (Phase 2)
```

### Source Code (repository root)

```text
frontend/
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   └── expenses/
│       ├── page.tsx             # Route entry with suspense + TanStack Query
│       ├── components/
│       │   ├── ExpensesHeader.tsx
│       │   ├── ExpensesVirtualList.tsx
│       │   ├── EmptyLedger.tsx
│       │   └── ErrorBoundary.tsx
│       └── drawer/
│           └── AddExpenseDrawer.tsx (Day 3 placeholder scaffold)
├── lib/
│   ├── api/expenses.ts          # Client calling Next.js proxy route
│   ├── server/expenses-route.ts # Route handler injecting service token
│   └── telemetry/
├── public/
│   └── illustrations/           # Empty-state assets
├── tests/
│   ├── unit/                    # Vitest suites for hooks + components
│   ├── component/
│   └── e2e/
│       ├── playwright.config.ts
│       └── expenses.spec.ts     # Smoke + screenshot orchestration
└── package.json / next.config.js / playwright.config.ts

src/
└── (existing Chapter 5 API + backend libraries) – referenced only via shared API contract documentation; no direct modifications planned for Day 2 UI
```

**Structure Decision**: Chapter 6 deliverables live entirely in `frontend/` under the Next.js 15 App Router paradigm; backend `src/` packages remain untouched aside from consuming the public `/expenses` HTTP surface. Tests and CI assets stay colocated under `frontend/tests` and `frontend/e2e` to satisfy review packet traceability.

## Complexity Tracking

No constitutional violations requiring justification at this stage.

## Post-Design Constitution Check

- **No Logic Duplication** – Still PASS. Data model + contracts reuse the upstream `/expenses` schema; UI only orchestrates presentation states.
- **Test Coverage Mandate** – PASS. Quickstart + research commit to ≥55% statements, with Vitest + Playwright wiring documented.
- **Reviewability** – PASS. Contracts, data model, and quickstart all point to coverage + screenshot artifacts stored under `review-artifacts/`.
- **PR Craft & CI Gates** – PASS. Quickstart enumerates required lint/test/build jobs; no additional tooling beyond approved stack.
- **Simplicity & Consistency** – PASS. New design sticks with Next.js/TanStack Query/`react-window`, matching constitution guidance; no deviations introduced during design.
