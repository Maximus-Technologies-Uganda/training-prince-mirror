# Date
06/09/2025

# Project
Definition of Done (DoD) for Month 1

# Today’s goal
Resolve merge conflicts blocking the PR and harden CI mirroring; update `.gitignore`; ensure all tests pass; prepare management journal.

## Prompts I used
- Which secrets/conditions should the CI use to prefer SSH and fallback to HTTPS?
- What additional runtime files should be ignored to keep the repo clean?

## Bugs and fixes
**Bug:** Mirror workflow had conflicting branches and ambiguous secret checks causing merge conflicts and possible runtime failures.  
**Fix:** Unified the workflow to prefer `DEPLOY_KEY` (SSH) and fallback to `MIRROR_TOKEN` (HTTPS). Added `workflow_dispatch` and guarded on `secrets.*` directly.

**Bug:** Repository diffs included local tool and runtime JSON files.  
**Fix:** Added `.cursor/`, `review-artifacts/`, `data/*.json`, `coverage-summary.json`, and CLI JSON state files to `.gitignore`.

## Concepts learned
- SSH deploy keys vs HTTPS tokens for GitHub Actions
- Safe secret gating in workflows using `secrets.*` conditions
- Hygiene rules for ignoring generated data and artifacts

## What happened/output
- Successfully resolved conflicts and pushed updates to `feature/LIN-QUO-quote-cli`.
- All tests passed: 222/222 (Vitest). 
- CI workflow supports manual dispatch and robust secret checks.
- New management journal added for 2025‑09‑30.

## Reflection
Started as a conflict resolution task but evolved into a CI hardening exercise. I now better understand secure mirroring strategies and repository hygiene that prevents noisy diffs.

---

# Workbook alignment (Week 2 — Strengthening)

## Executive Objectives — Status
- Reviewability: Mirror uploads single `review-packet` artifact per run with Coverage Index and per-app HTML coverage for all six CLIs — Achieved earlier this week; validated again today.
- Repo hygiene: Runtime data under `/data/` and ignored; added `.gitattributes`; removed stray files — Achieved; reinforced today by extending `.gitignore`.
- CLI fundamentals: Pure core + thin CLI across apps; non‑zero exits on invalid input; negative tests present — Achieved in prior PRs; unchanged today.
- Coverage targets: Met or exceeded for all apps; tests still pass (222/222) — Maintained.
- PR craft: Small PRs with artifact link and coverage table; Linear‑style branch naming used — Maintained.

## Pre‑Flight — Clean‑ups
- Mirror parity: `review-packet` artifact name and structure verified.
- README (mirror): “How to review me” present from earlier docs PR.
- Repo hygiene: Moved/ignored runtime files (`/data/*.json` etc.); added new ignores today.
- `.gitattributes`: Present to normalize newlines.
- Branch protection: `development` requires CI — unchanged.

## Mon–Fri Plan — What’s covered by today’s work
- Monday — Review Packet + Hygiene: validated artifact structure; tightened ignore rules.
- Tuesday — Hello + Expense: no code changes today; status preserved and tests green.
- Wednesday — Stopwatch + Temp: no code changes today; status preserved and tests green.
- Thursday — To‑Do + Quote: no code changes today; status preserved and tests green.
- Friday — Week 2 Wrap: documentation and journal updates completed; no coverage regressions.

## Acceptance Criteria — Checklist
- [x] Mirror produces `review-packet` with Coverage Index and per‑app HTML coverage
- [x] Repo hygiene: no tracked runtime data; `/data/` git‑ignored; `.gitattributes` present
- [x] Coverage thresholds met (maintained)
- [x] PR craft: Green CI, artifact link, coverage table
- [x] Mirror README explains how to download/open Review Packet

---

# Tooling & Tracking

## Spec Kit (CLI Specifications)
- Used Spec Kit to codify CLI contracts (flags, validation, exit codes) for all six apps.
- Guided tests and negative-path coverage; ensured parity between README usage and actual CLI behavior.
- Applied during To‑Do and Quote hardening to align `--due`, `--priority`, and `--by` behaviors with spec.

## Linear Integration
- Branch naming and PR titles follow Linear ticket keys for auto-linking (e.g., `feature/LIN-QUO-quote-cli`).
- PR descriptions include artifact link and coverage table, satisfying Reviewability criteria.
- The current CI conflict‑resolution PR maintains Linear discipline and passes checks.

