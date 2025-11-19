```markdown
# Changelog

## Chapter 6 Day 1 – Expenses Insights & Accessibility (2025-11-20)

Summary experience for `/expenses` now ships with telemetry, fully-tested tiles, and an automated accessibility gate.

### Added
- **Expense Summary Panel (US3)**
  - TanStack Query hook `useExpenseSummaryQuery` with shared cache keys, generatedAt timestamps, and manual refresh telemetry (`frontend.expenses.refresh_ms`).
  - Accessible `<ExpenseSummaryPanel />` tiles with aria-live announcements, request-ID error messaging, and "Still working…" helper during background refetches.
  - Filter chips with clear-all controls, sr-only announcements, and URL/search param sync to keep list + summary panes aligned.
- **QA Assets**
  - Vitest contract: `tests/contract/expenses-summary.contract.test.tsx` covering loading/error/empty/success permutations plus chip interactions.
  - Playwright journeys: `tests/e2e/expenses-summary.spec.ts` (retry-only summary, filter-chip refreshes) and `tests/e2e/expenses-accessibility.spec.ts` (axe-core WCAG AA scan).
  - Screenshot set (`summary-state-{loading,empty,error,success}.png`) referenced from the summary contract for FR-005 evidence.

### Changed
- `frontend/app/expenses/components/ExpenseSummaryPanel.tsx` and `FilterChips.tsx` now expose aria-live messaging, request IDs, and deterministic `data-testid`s for QA harnesses.
- Quickstart + Accessibility Audit updated with the new validation flow, telemetry metrics, and axe coverage expectations.

### Notes
- `npm run test:e2e` now targets `tests/e2e/` via `tests/e2e/playwright.config.ts`, which spins up the Next.js dev server automatically.
- Accessibility regression fails the pipeline on any `serious`/`critical` axe violation to satisfy FR-006/FR-007.

## Week 5 - Final Polish (2025-11-12)

Documentation finalization, review packet assembly, and mentor demo preparation

### Added
- **API Scaffolding**: Added API scaffolding with Express middleware pipeline
  - Implemented RESTful API foundation with standardized middleware stack
  - Request/response handling with proper error management
  - Routes organized by domain (hello, temp-converter, stopwatch, todo, quote, expense)
- **POST /expenses Endpoint**: Added POST /expenses endpoint - create and track new expenses
  - Expense creation with validation (amount, description, category)
  - Automatic timestamp and ID generation
  - Request/response schemas documented in OpenAPI spec
  - Coverage: 89.95% (hello module: 96.55%, expense module: 89.95%)
- **GET /expenses/summary Endpoint**: Added GET /expenses/summary endpoint - retrieve expense summary with calculations
  - Summary calculations: total, average, by-category breakdown
  - Filter support for date ranges and categories
  - Response includes aggregated metrics
  - Integration with POST /expenses for complete CRUD workflow
- **Rate Limiter Middleware**: Added Rate Limiter middleware - throttle requests to 100 per 10-minute window, return 429 on limit exceeded
  - Window: 10 minutes
  - Limit: 100 requests per window
  - Status: 429 (Too Many Requests) on limit exceeded
  - Applies to all API endpoints with clear rate-limit headers
- **Coverage Hardening**: Hardened test coverage to 70% threshold across all API modules
  - Target: 70% API coverage
  - Modules verified: hello (96.55%), stopwatch (88.8%), temp-converter (80.6%), expense (89.95%), todo (91.78%), quote (85.26%)
  - Overall API coverage: 80.52% (Statements: 80.52%, Branches: 86.27%, Functions: 70.33%, Lines: 80.5%)
  - All 542 tests passing across 42 test files
- **Security CI Workflow**: Added automated security CI checks to review-packet workflow
  - Coverage collection for all modules (6 modules: hello, stopwatch, temp-converter, expense, todo, quote)
  - OpenAPI HTML documentation generation via Redoc CLI (v0.13.21)
  - Playwright test report integration
  - Automated artifact assembly for review packet

### Changed
- CHANGELOG updated with comprehensive Week 5 summary
- review-artifacts/index.html enhanced with 4-section review packet structure
- CI workflow (review-packet.yml) optimized for multi-module coverage collection

### Notes
- All tests passing (542/542) with no critical blockers
- Coverage meets 70% threshold for all core modules
- OpenAPI spec includes all Week 5 endpoints (POST /expenses, GET /expenses, GET /expenses/summary)
- Ready for production deployment after mentor sign-off
- Demo script prepared for 10-minute walkthrough of all Week 5 deliverables

---

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
- Linear PR title lint and PR→Linear sync (state + comments).
- Spec requirement: PRs must include `Spec: <url>` (enforced by CI).
- Repo hygiene: ignore runtime data in `/data/` and known CLI state files.

### Changed
- Hello: trim whitespace in name input; unknown flag validation.
- Expense: validate unknown flags per command; error exits on invalid input.
- To‑Do: align CLI to workbook spec (`--due`, `--priority`) with backward compatibility; validation for bad date/priority.
- README: updated To‑Do usage and error examples.

### Notes
- Private and public mirror both produce `review‑packet` artifacts; Coverage Index verified.
 - Linear statuses now update automatically on PR open/merge; older tickets may need a one‑time manual state change.
