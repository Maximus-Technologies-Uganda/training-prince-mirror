# Implementation Plan: Chapter 6 Day 1 – Frontend Integration

**Branch**: `003-frontend-integration` | **Date**: 2025-11-19 | **Spec**: [`/specs/003-frontend-integration/spec.md`](./spec.md)
**Input**: Feature specification from `/specs/003-frontend-integration/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This plan scopes the Chapter 6 Day 1 frontend integration work: document how the
Next.js dashboard consumes GET /expenses and GET /expenses/summary, exposes the
right-side drawer POST /expenses form, and guarantees shared filters, focus
management, telemetry, and performance (virtualized list + <2.5 s LCP). The spec
will enumerate UI states, accessibility cues, screenshot evidence, and refresh
behavior so implementation can proceed without ambiguity.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: Next.js 15 App Router (React 18) documented under the existing Vite workspace until the app scaffold lands later this chapter  
**Primary Dependencies**: TanStack Query 5 for shared caching + mutations, `react-window` for virtualization, telemetry hooks reusing the established frontend observability client  
**Storage**: N/A (frontend fetches Chapter 5 API)  
**Testing**: Vitest v3.2.4, Playwright v1.48.2 per repo standards  
**Target Platform**: Web dashboard (desktop-first, responsive down to 1024px)  
**Project Type**: Single web app (Next.js dashboard under `frontend/`)  
**Performance Goals**: LCP < 2.5 s on cold load, filters + summary interactions < 3 steps  
**Constraints**: WCAG AA (4.5:1 text contrast), hero assets ≤150 KB, virtualized list required >200 rows, telemetry for `frontend.expenses.refresh_ms`  
**Scale/Scope**: Up to 10k expenses/day, pagination 100 max per page, shared filters for list + summary

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

1. **No Logic Duplication** – PASS: plan only documents UI behavior consuming
  Chapter 5 APIs; no business logic moves client-side.
2. **Test Coverage Mandate** – PASS (planning): deliverables focus on specs and
  QA evidence expectations so implementation can keep ≥40% coverage + smoke
  Playwright test later.
3. **Reviewability** – PASS: plan mandates screenshot artifacts and contracts so
  review packet remains source of truth.
4. **PR Craft** – PASS: documenting scope now keeps future PRs within 300 LOC by
  constraining implementation slices.
5. **Simplicity & Consistency** – PASS: plan sticks to Vite/Next.js stack,
  `react-window`, Vitest/Playwright, ESLint/Prettier; new tooling deferred unless
  research discovers a hard blocker.

  **Post-Design Recheck (Phase 1)**: Research, data-model, contracts, and quickstart
  lock in the same tech stack, provide coverage/QA evidence expectations, and avoid
  introducing any extra tools. All gates remain PASS, so Phase 2 planning may begin
  after stakeholders review this package.

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

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
src/
├── expense/
├── hello/
├── models/
├── quote/
├── stopwatch/
├── temp-converter/
└── todo/

tests/
├── contract/
├── contracts/
├── e2e/
├── integration/
├── unit/
└── *.test.js suites covering expense|hello|quote|stopwatch|temp|todo

frontend/
└── (Next.js app – feature will add UX copy/contracts, not code, during this plan)
```

**Structure Decision**: Use the existing single-repo layout (`src/` libs powering
APIs + shared logic, `tests/` for Vitest/Playwright suites, `frontend/` for the
Next.js UI). The plan adds documentation under `specs/003-frontend-integration`
without restructuring source code.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | Existing structure already satisfies constitution |
