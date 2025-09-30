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


