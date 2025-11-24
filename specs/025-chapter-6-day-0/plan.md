# Implementation Plan: Chapter 6 Day 0 - FinishtoGreen & CI Tightening

**Branch**: `025-chapter-6-day-0` | **Date**: 18 November 2025 | **Spec**: [specs/025-chapter-6-day-0/spec.md](./spec.md)  
**Input**: Feature specification from `/specs/025-chapter-6-day-0/spec.md`

## Summary

Chapter 6 Day 0 formalizes Chapter 5 API development completion and establishes CI/CD quality gates for Chapter 6 frontend work. Three workstreams execute in parallel:

1. **FinishtoGreen (D0.1)**: Clean main branch, document Chapter 5 completion with `chapter5-complete` git tag, verify GitHub Pages API docs, update README with links
2. **CI Tightening (D0.2)**: Add ally-check accessibility scanning with baseline exceptions, establish coverage thresholds (API 70%, UI 55%), add SECURITY.md, extend Review Packet with Projects evidence
3. **Project Hygiene (D0.3)**: Verify GitHub Projects board has all 5 required fields (Status, Priority, Size, Spec URL, Sprint/Chapter), test automations (auto-add, PR-to-Done)

Technical approach: Configuration-only; no code reimplementation. Uses existing tech stack (GitHub Actions, Vitest, Playwright, axe-core). All new gates are additions; no breaking changes to existing CI.

## Technical Context

**Language/Version**: Node.js 18+ (backend/CLI); JavaScript/TypeScript; GitHub Actions YAML  
**Primary Dependencies**: 
- Testing: Vitest v3.2.4, @vitest/coverage-v8, supertest, Playwright v1.48.2
- Accessibility: @axe-core/playwright (NEW for Day 0)
- CI/CD: GitHub Actions, Redoc CLI v0.13.21
- Documentation: GitHub Pages (already published)

**Storage**: N/A (configuration-only feature; no data persistence)  
**Testing**: Vitest v3.2.4 (unit), Playwright v1.48.2 (E2E), Coverage thresholds enforced in CI  
**Target Platform**: GitHub Actions (ubuntu-latest), Node.js 20 runtime  
**Project Type**: Monorepo (api/, frontend/, src/ with separate test suites)  
**Performance Goals**: CI efficiency; test suite runs <5min; fast feedback on coverage  
**Constraints**: Hard blockers on coverage thresholds; branch protection enforces all checks; ally-check baseline prevents blocking on pre-existing accessibility issues  
**Scale/Scope**: 3 applications (CLI, API, Frontend); 17+ GitHub Actions workflows; 5+ custom GitHub Projects fields

## Constitution Check

*GATE: Must pass before Phase 1 contracts. Re-check after Phase 1 design.*

✅ **No Logic Duplication**: N/A - Configuration only; no business logic duplicated  
✅ **Test Coverage Mandate**: Enforced - Coverage thresholds (API 70%, UI 55%) are hard blockers in CI  
✅ **Reviewability is Paramount**: Enhanced - Review Packet updated with Projects evidence; unified coverage index maintained  
✅ **PR Craft**: Enforced - Branch protection requires all checks pass before merge; ally-check blocks PRs with accessibility violations  
✅ **Simplicity & Consistency**: Maintained - Uses existing tech stack (Vitest, Playwright, GitHub Actions); no new tools introduced; follows project conventions

## Project Structure

### Documentation (this feature)

```text
specs/025-chapter-6-day-0/
├── plan.md              # This file
├── research.md          # Phase 0: Research & clarifications ✅ COMPLETE
├── data-model.md        # Phase 1: Entity definitions ✅ COMPLETE
├── quickstart.md        # Phase 1: Execution walkthrough ✅ COMPLETE
└── checklists/
    └── requirements.md
```

### Configuration & Workflows (repository root)

```text
.github/
├── workflows/
│   ├── ally-check.yml                    # NEW: Accessibility scanning with baseline exceptions
│   ├── api-checks.yml                    # EXISTING: API tests with coverage
│   ├── spec-check.yml                    # EXISTING: Specification validation
│   ├── deploy-pages.yml                  # EXISTING: GitHub Pages deployment
│   └── [14 other workflows...]           # EXISTING: CI/CD infrastructure
├── scripts/
│   ├── run-ally-check.js                 # NEW: Placeholder for axe-core scanning
│   ├── compare-ally-baseline.js          # NEW: Placeholder for baseline comparison
│   └── [other build scripts...]
└── accessibility/
    └── ally-check-baseline.json          # NEW: Accessibility baseline exceptions

.specify/
├── memory/
│   └── constitution.md                   # Project governance (reference)
└── scripts/
    └── bash/
        └── update-agent-context.sh       # Auto-update agent instructions

Root Configuration Files:
├── vitest.config.js                      # UPDATED: API coverage thresholds 70%
├── api/
│   └── vitest.config.ts                  # VERIFIED: Coverage thresholds 70%
├── frontend/
│   └── vitest.config.js                  # UPDATED: Coverage thresholds 55% (was 40%)
├── SECURITY.md                           # NEW: Responsible disclosure policy
└── README.md                             # UPDATED: Links to API docs, Review Packet, Chapter 6
```

### Source Code (no changes)

```text
src/                     # Existing: CLI applications (HELLO, STOPWATCH, TEMP-CONVERTER)
api/                     # Existing: Backend API
frontend/                # Existing: Frontend (Next.js setup planned for Day 1-5)
tests/                   # Existing: Test suites
data/                    # Existing: Data directory (per hygiene standards)
```

**Structure Decision**: Configuration-only feature. No new source code directories. All changes are:
- GitHub Actions workflows (`.github/workflows/ally-check.yml`)
- Configuration files (vitest.config.js updates, ally-check-baseline.json)
- Documentation (SECURITY.md, README.md updates, spec documents)
- Agent context updates (.github/copilot-instructions.md)

## Execution Notes & Guardrails

- **Ally-check implementation cadence**: Day 0 creates the workflow, baseline file, and placeholder scripts. Full axe-core + Playwright automation (T014/T015) is explicitly scheduled for Chapter 6 Day 1 once the frontend shell lands. The plan keeps the scripts lightweight (exit 0) to unblock CI wiring without introducing flaky scans on an unfinished UI.
- **Baseline governance**: T006 now requires a short Markdown summary (`.github/accessibility/ALLY_BASELINE_NOTES.md`) that lists every allowed violation, links to remediation issues, and references the Review Packet evidence. This ensures the baseline cannot be silently expanded.
- **Coverage enforcement test**: T012/T013 must include a sacrificial branch that intentionally drops coverage (e.g., skip tests) so the CI run proves thresholds fail PRs. Evidence (screenshot or CI URL) goes into Review Packet and the chapter Daily Log.
- **Branch protection timing**: Ally-check becomes a required status check immediately after the Day 0 PR merges to `main`. This avoids bricking the feature branch mid-review while still ensuring all subsequent Chapter 6 PRs inherit the stricter gate.
- **Documentation links**: README updates must point to the canonical GitHub Pages URL `https://maximus-technologies-uganda.github.io/training-prince/` plus the latest Review Packet artifact to keep stakeholders aligned.
