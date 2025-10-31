<!--
Sync Impact Report
- Version change: 0.0.0 → 1.1.0
- Modified principles: [template placeholders] → concrete names (see Core Principles)
- Added sections: Section 2 (Project Standards & Constraints), Section 3 (Workflow & Quality Gates)
- Removed sections: None
- Templates requiring updates:
  ✅ .specify/templates/plan-template.md (reference/version alignment)
  ✅ .specify/templates/spec-template.md (no conflicts; guidance aligned)
  ✅ .specify/templates/tasks-template.md (no conflicts; category mapping consistent)
  ⚠️ README.md: add brief pointer to constitution (optional)
- Deferred items:
  - TODO(RATIFICATION_DATE): Original adoption date unknown; needs project lead input
-->

# Hello-World UI Initiative Constitution

## Core Principles

### I. No Logic Duplication
UIs MUST import and reuse existing core logic from `src/<app>` libraries.
Reimplementation of backend functionality in the frontend is prohibited. Any
UI-only utilities are limited to presentation and input handling. Rationale:
prevents divergence, reduces bugs, and concentrates tests in one source of truth.

### II. Test Coverage Mandate
Each UI module MUST maintain ≥40% statement coverage, measured by Vitest unit
tests, plus one Playwright smoke test per UI. Coverage must be reported per-app
and included in the CI review‑packet. Failing to meet the threshold blocks merges.

### III. Reviewability is Paramount
The CI review‑packet is the primary artifact of record. It MUST include separate,
indexed coverage reports for all backend and UI applications, accessible from a
single `review-artifacts/index.html` index. PRs are reviewed primarily via this
packet.

### IV. PR Craft
PRs MUST: be ≤300 LOC changed; pass all CI checks; and use the required PR
description template including the full backend and UI coverage table and a
`Spec:` link. Large changes MUST be split into incremental PRs.

### V. Simplicity & Consistency
Prefer simple, explicit solutions. Follow the project’s tech stack: Vite-powered
vanilla JavaScript frontend, Vitest/Playwright for testing, ESLint + Prettier for
linting/formatting. New tools require a justification and approval via Governance.

## Project Standards & Constraints
- Frontend lives in `frontend/` and is built with Vite. The final build in
  `frontend/dist/` MUST be deployable to GitHub Pages.
- Testing: Vitest for unit coverage; Playwright for a single smoke test per UI.
- Linting/Formatting: ESLint + Prettier are required gates in CI.
- Coverage: Per-app coverage artifacts MUST be generated and indexed in the
  review‑packet artifact. Minimum UI coverage: 40% statements.
- Backend logic authority: `src/<app>` packages remain the single source of truth.

## Development Workflow & Quality Gates
- Work begins from a feature spec linked in the PR body via `Spec: <url>`.
- TDD encouraged; tests authored or updated alongside changes.
- CI MUST run: lint, unit tests with coverage, Playwright smoke, and build.
- Merge gates: all checks passing, coverage thresholds met, review‑packet updated.
- Release: `frontend/dist/` MUST be build‑clean; deployment to GitHub Pages is
  required by end of week for the current milestone.

## Governance
- This Constitution supersedes conflicting practices. Amendments require a PR
  describing changes, rationale, version bump per semantic rules, and any
  migration or process updates needed.
- Versioning Policy:
  - MAJOR: Backward‑incompatible removals/redefinitions of principles or governance.
  - MINOR: New principle/section added or materially expanded guidance.
  - PATCH: Clarifications or non‑semantic refinements.
- Compliance Review: Reviewers MUST verify adherence (no logic duplication,
  coverage thresholds, review‑packet completeness, PR craft) before approval.

**Version**: 1.1.0 | **Ratified**: TODO(RATIFICATION_DATE): original adoption date unknown | **Last Amended**: 2025-10-06