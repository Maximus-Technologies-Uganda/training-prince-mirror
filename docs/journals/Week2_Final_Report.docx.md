# Week 2 Training Report - Prince Buyinza
**Date**: Friday, Week 2  
**Mentor**: Paul Mwanje  
**Repository**: training-prince (private) → training-prince-mirror (public)

---

## Executive Summary
Closed all Week‑2 objectives. Set up a single Review Packet artifact (`review-packet`) with a Coverage Index and per‑app HTML coverage. Hardened CLIs with validation and negative tests. Coverage for all six apps ≥ targets.

---

## Key Outcomes
- One Review Packet artifact per run (private + mirror), with Coverage Index.
- Repo hygiene: runtime state under `data/` and git‑ignored; `.gitattributes` in place.
- CLI fundamentals: pure cores + thin CLIs, explicit non‑zero exits on invalid input, negative tests.
- PR craft: small PRs, green CI, artifact link + coverage table in descriptions.

---

## Coverage Snapshot (Statements)
| Application | % | Target | Status |
|-------------|---:|:------:|:------:|
| Hello | 96.55% | ≥60% | ✅ |
| Stopwatch | 98.26% | ≥50% | ✅ |
| Temp‑converter | 92.95% | ≥50% | ✅ |
| Expense | 94.31% | ≥50% | ✅ |
| To‑Do | 92.03% | ≥50% | ✅ |
| Quote | 87.50% | ≥60% | ✅ |

Source: latest CI run (Vitest v8 coverage). See artifact `review-packet` → `review-artifacts/index.html`.

---

## What Shipped
- Review Packet CI (`.github/workflows/review-packet.yml`) — single artifact `review-packet`.
- HTML coverage enabled in `vitest.config.js`.
- Expense: unknown‑flag validation (+ tests).
- Hello: trims whitespace (+ test).
- To‑Do: workbook flags `--due YYYY-MM-DD`, `--priority <low|med|high>` with legacy flags preserved; validation & tests.
- README updates: To‑Do spec usage + error examples; Coverage Index note.
- PR template prompting artifact link + coverage table.

---

## Evidence
- CI: latest development run (paste URL) — artifact: `review-packet`.
- Coverage Index screenshot: attach `review-artifacts/index.html` page.
- Commits: paste merge SHAs.
- PRs (closed): review‑packet; expense+hello; todo‑align‑spec; thursday‑readme‑updates; week2‑wrap; final‑journal.

---

## Lessons Learned
- Keep CLIs thin; validate flags early; exit non‑zero on invalid input.
- Deterministic testing via injected time (Stopwatch) simplifies negative paths.
- A single artifact + Coverage Index makes review fast and consistent.

---

## Week 3 Focus (Preview)
- Sustain reviewability: artifact on every PR.
- Small UX/validation polish only if it doesn’t reduce coverage.

---

**Prepared by**: Prince Buyinza


