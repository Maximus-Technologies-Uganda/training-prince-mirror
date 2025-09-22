# Changelog

## Week 1 → Week 2 Transition

### Added
- Quote CLI scaffold with pure core and thin CLI; tests for formatting and author filtering.
- Expense hardening: `--month` filter, help/validation; table‑driven tests.
- To‑Do hardening: `--highPriority`, `--dueToday`, duplicate guard; list filters; tests.
- Stopwatch exporter and golden‑file tests for empty and populated states.
- Temp‑converter hardening: lowercase flags, NaN guard, strict non‑zero exits; table‑driven tests.
- Review Packet workflow and Coverage Summary in job Summary.

### Changed
- Moved runtime state to `data/` and added ignore rules; updated code to use `data/*`.
- README: added “How to review me” and CLI usage examples.

### Notes
- All tests green in CI; coverage collected and included in the Review Packet artifact.
