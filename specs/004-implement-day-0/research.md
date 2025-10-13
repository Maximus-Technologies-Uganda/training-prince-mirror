# Research: Day 0 Blockers

## Decisions
- Artifact name remains `review-packet`.
- Backend coverage apps: hello, stopwatch, temp-converter, expense, todo, quote.
- UI coverage directories: `review-artifacts/ui-coverage-<app>/lcov-report/`.
- UI modules in scope for scaffold: quote, expense, temp, todo, stopwatch.
- README review box mentions PR runs only.

## Rationale
- Aligns with Week 2/3 workbook conventions and mirrors.
- Keeps single artifact simplifying reviewer workflow.
- UI scaffold enables future growth without blocking.

## Alternatives Considered
- Rename artifact → rejected (breaks parity).
- UI coverage under `ui/<app>` → rejected (path inconsistency).
