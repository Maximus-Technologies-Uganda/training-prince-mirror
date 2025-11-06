# Phase 0: Research & Technical Decisions

**Feature**: Week 4 Finisher - Playwright E2E Smokes (5 UIs)  
**Date**: 2025-11-02  
**Status**: Complete

## Technical Context Resolution

All NEEDS CLARIFICATION items resolved via clarification session (2025-11-02). No ambiguities remain.

### Decision 1: Browser Selection

**Decision**: Chromium only (headless mode)

**Rationale**:
- Chromium provides fastest execution (~30s per test × 5 = 150s, well within 2-min budget)
- Headless mode reduces overhead; no GUI rendering in CI
- Focused coverage on primary browser; mobile browsers (WebKit, Firefox) deferred to future phases
- Reduces flakiness from multi-browser environment variance

**Alternatives Considered**:
- ❌ Chromium + Firefox + WebKit: Triple execution time (~9+ min); exceeds 2-min budget
- ❌ Chromium + Firefox: 2× time; still tight for 2-min budget
- ✅ Chromium only: Optimal speed + reliability tradeoff

**Implementation**: Playwright config `playwright.config.ts` will specify Chromium as sole browser target.

---

### Decision 2: Test Execution Strategy

**Decision**: Collect-all (run all 5 tests to completion before job failure determination)

**Rationale**:
- Full visibility of failures; developers see all broken tests in single CI run (not cascading)
- Reduces iteration cycles (fix one test, re-run, discover next problem in same run)
- Complies with Principle III (Reviewability); all artifacts captured before job fails
- Enables parallel execution of independent tests (potential future optimization)

**Alternatives Considered**:
- ❌ Fail-fast (stop on first test failure): Single failure masks downstream issues; requires multiple runs
- ✅ Collect-all: Recommended for comprehensive visibility

**Implementation**: GitHub Actions workflow will use `if: always()` to ensure all tests execute regardless of prior failures.

---

### Decision 3: Timeout & Retry Policy

**Decision**: 30-second per-test timeout; no automatic retries

**Rationale**:
- 30s provides sufficient time for typical UI interactions (load, input, click, assert, screenshot)
- No retries enforce deterministic test behavior; flaky tests surface immediately (not hidden by retries)
- Simplifies debugging: single test run = single failure report
- Aligns with CI/CD principle: fail fast, fix once

**Alternatives Considered**:
- ❌ 60s timeout + 2 retries: Exceeds 2-min budget; hides flakiness
- ❌ No timeout: Risk of hang jobs consuming CI resources
- ✅ 30s, no retry: Tight, deterministic, fits budget

**Implementation**: Playwright `globalTimeout: 30000` in config; no `retries` option set (default 0).

---

### Decision 4: Performance Budget

**Decision**: ≤ 2 minutes total execution time (120 seconds)

**Rationale**:
- Aggressive target drives tight, focused test design
- Enables rapid CI feedback loop (5-test suite in < 2 min = developer iteration in < 5 min)
- Aligns with project CI/CD goals (fast feedback, prevent broken merges)
- Budget breakdown: ~24s per test (30s timeout includes setup/teardown) × 5 = 120s max

**Alternatives Considered**:
- ❌ 5-10 min budget: Slower feedback; elongates development cycle
- ✅ 2-min budget: Aggressive, achievable with focused smoke tests

**Implementation**: GitHub Actions job step will include timing measurement; job fails if total duration exceeds 120s.

---

### Decision 5: Artifact Strategy

**Decision**: Capture screenshots + Playwright traces on test failure; generate HTML report on success

**Rationale**:
- **Failure Artifacts**: Screenshots provide visual context (UI state at failure); traces enable step-by-step playback
- **Success Report**: HTML report documents passing test outcomes for stakeholder review
- **Review-Packet Integration**: All artifacts indexed in `review-artifacts/index.html` per Principle III
- **Debugging**: Traces + screenshots drastically reduce time-to-root-cause for flaky tests

**Alternatives Considered**:
- ❌ Screenshots only: Insufficient for complex failures (timing, state)
- ❌ Traces only: Not human-readable; hard for non-technical review
- ✅ Screenshots + traces + report: Full context for both debugging and review

**Implementation**: 
- Playwright `use: { screenshot: 'only-on-failure', trace: 'on-first-failure' }`
- GitHub Actions artifact upload with `playwright-report/` directory
- Custom script to index reports in `review-artifacts/index.html`

---

### Decision 6: Dependencies & Versions

**Decision**: Playwright v1.x (latest stable), Node.js ≥18, Vite (existing frontend)

**Rationale**:
- **Playwright v1.x**: Mature, stable, industry-standard E2E framework
- **Node.js ≥18**: LTS version; sufficient for ES2022 features
- **Vite**: Already used by project frontend; no additional tooling required
- **GitHub Actions**: Native CI platform; no external service needed

**Alternatives Considered**:
- ❌ Cypress: Overkill for smoke tests; heavier setup
- ❌ Puppeteer: Lower-level API; more boilerplate
- ✅ Playwright: Optimal balance of power + simplicity

**Implementation**:
- `package.json`: `@playwright/test: ^1.40.0` (or latest stable)
- `.github/workflows/playwright-e2e-smoke.yml`: `node-version: 18`

---

### Decision 7: Test Framework

**Decision**: Playwright Test (built-in test runner)

**Rationale**:
- Integrated with Playwright; no additional dependencies
- Parallel test execution (can run multiple test files simultaneously)
- HTML reporting built-in
- Supports fixtures, hooks, BDD syntax (optional)

**Alternatives Considered**:
- ❌ Vitest + Playwright: Overkill; Playwright Test sufficient for E2E
- ✅ Playwright Test: Minimal, purpose-built

**Implementation**: Tests written in `tests/e2e/smoke/*.spec.ts` using Playwright Test syntax.

---

### Decision 8: CI Runner

**Decision**: `ubuntu-latest` GitHub Actions runner

**Rationale**:
- Standard Linux environment; reliable Chromium support
- Minimal cost vs. larger runners
- Sufficient resources for headless browser + test execution
- Widely supported by Playwright

**Alternatives Considered**:
- ❌ macOS, Windows runners: Unnecessary cost; Linux sufficient
- ✅ ubuntu-latest: Standard, cost-effective

**Implementation**: `.github/workflows/playwright-e2e-smoke.yml`: `runs-on: ubuntu-latest`

---

## Technical Stack Summary

| Component | Decision | Version |
|-----------|----------|---------|
| E2E Framework | Playwright Test | v1.x (latest) |
| Browser | Chromium | Headless |
| Runtime | Node.js | ≥18 |
| CI Platform | GitHub Actions | Native |
| Frontend Build | Vite | Existing |
| Test Runner | Playwright Test | Built-in |
| Reporting | Playwright HTML Reporter | Built-in |

---

## Integration Points

### 1. Frontend Build (Vite)
- Tests consume built frontend at `frontend/dist/` or dev server
- Dev server mode: Use `npm run dev` with dynamic port detection
- CI mode: Use pre-built `frontend/dist/` or build-on-demand

### 2. GitHub Actions Workflow
- Workflow file: `.github/workflows/playwright-e2e-smoke.yml`
- Trigger: On `push` to feature branches; on `pull_request` to `development`
- Steps: Install → Build frontend → Run tests → Collect artifacts → Upload to CI

### 3. Review-Packet Integration
- Artifacts uploaded to GitHub Actions
- Custom script indexes reports in `review-artifacts/index.html`
- Links generated for each test suite (hello, stopwatch, temp, expense, todo)

### 4. Constitutional Compliance
- ✅ **Principle I (No Logic Duplication)**: Tests exercise existing UIs; no reimplementation
- ✅ **Principle II (Test Coverage Mandate)**: Smoke tests + coverage reporting (per-UI)
- ✅ **Principle III (Reviewability)**: Artifacts indexed in review-packet
- ✅ **Principle IV (PR Craft)**: Smoke tests remain ≤300 LOC per PR
- ✅ **Principle V (Simplicity)**: Playwright + Vite; no new tools

---

## Remaining Unknowns

**None**. All technical context resolved.

---

## Next Phase

**Phase 1: Design & Contracts** will define:
- Entity models (Test Artifact, Smoke Test Suite, CI Config)
- API contracts for each smoke test
- Failing test implementations
- Quickstart scenario
