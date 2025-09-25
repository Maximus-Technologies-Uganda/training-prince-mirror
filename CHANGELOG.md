# Changelog

## Week 1 → Week 2 Transition

### Added
- Quote CLI scaffold with pure core and thin CLI; tests for formatting and author filtering.
- Expense hardening: `--month` filter, help/validation; table‑driven tests.
- To‑Do hardening: `--highPriority`, `--dueToday`, duplicate guard; list filters; tests.
- Stopwatch exporter and golden‑file tests for empty and populated states.
- Temp‑converter hardening: lowercase flags, NaN guard, strict non‑zero exits; table‑driven tests.
- Review Packet workflow and Coverage Summary in job Summary.
- CONTRIBUTING.md with branch/PR conventions and Linear integration guidelines.
- Comprehensive CLI unit tests for Expense and To-Do with 97.87% and 93.69% coverage respectively.
- READMEs for Expense and To-Do CLIs with copy-pasteable examples.
- .gitattributes for EOL normalization and golden file protection.
- vitest.config.js with proper coverage reporters (text, json, lcov, text-summary).
- Quote edge-case tests: 28 comprehensive tests covering empty/invalid inputs, case-insensitive filtering.
- Stopwatch CLI unit tests: 98.16% coverage with comprehensive CLI command testing.
- Version flags: Added `--version` to Hello and Quote CLIs for better UX.
- READMEs for Stopwatch CLI with copy-pasteable examples and error cases.

### Changed
- Moved runtime state to `data/` and added ignore rules; updated code to use `data/*`.
- README: added “How to review me” and CLI usage examples.

### Notes
- All tests green in CI; coverage collected and included in the Review Packet artifact.

## Week 2 Wrap

### Added
- Review Packet artifact (single `review-packet`): `review.md`, Coverage Index, per‑app HTML coverage.
- HTML coverage output via Vitest reporter.

### Changed
- Hello: trim whitespace in name input; unknown flag validation.
- Expense: validate unknown flags per command; error exits on invalid input.
- To‑Do: align CLI to workbook spec (`--due`, `--priority`) with backward compatibility; validation for bad date/priority.
- README: updated To‑Do usage and error examples.

### Notes
- Private and public mirror both produce `review‑packet` artifacts; Coverage Index verified.
