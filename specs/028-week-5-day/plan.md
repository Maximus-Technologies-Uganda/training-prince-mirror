# Implementation Plan: Week 5 Day 3: Docs, ReviewPacket, and Playwright Smoke

**Branch**: `028-week-5-day` | **Date**: 2025-11-11 | **Spec**: [./spec.md](./spec.md)
**Input**: Feature specification from `/specs/028-week-5-day/spec.md`

## Summary

Generate and publish API documentation using Redoc from the existing OpenAPI specification, integrate the documentation link into the review packet alongside coverage and test reports, and create a Playwright smoke test that validates the Expense UI and API are properly integrated by performing a complete user action workflow (create expense → API call → UI update).

## Technical Context

**Language/Version**: Node.js (Redoc generation), YAML (OpenAPI spec), JavaScript (Playwright test)  
**Primary Dependencies**: Redoc CLI (documentation generation), Playwright (UI testing), GitHub Actions (CI/CD workflow)  
**Storage**: N/A (documentation generation, CI/CD only)  
**Testing**: Playwright for smoke testing, existing CI test framework  
**Target Platform**: GitHub Pages (documentation hosting), CI environment (Playwright tests)
**Project Type**: Web + CI/CD integration (frontend UI testing + documentation generation)  
**Performance Goals**: Documentation generation < 1 min, smoke test < 2 min in CI  
**Constraints**: Documentation must generate successfully on invalid spec (fail fast), smoke test timeout handling for API unavailability  
**Scale/Scope**: One Expense smoke test, one documentation generation step, one review packet link

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. No Logic Duplication | ✅ PASS | Feature is CI/documentation only; no UI logic reimplementation. Smoke test reuses existing Expense UI and API. |
| II. Test Coverage Mandate | ✅ PASS | Playwright smoke test validates UI-API integration. Documentation generation does not introduce new UI code requiring coverage. |
| III. Reviewability is Paramount | ✅ PASS | Review packet enhanced with API documentation link alongside coverage and Playwright reports. All artifacts indexed in review-artifacts/index.html. |
| IV. PR Craft | ✅ PASS | Changes are scoped: CI workflow updates, documentation generation config, one smoke test. Expected PR size manageable (<300 LOC). |
| V. Simplicity & Consistency | ✅ PASS | Uses Redoc (simple, standard tool), Playwright (existing test framework), GitHub Actions (existing CI platform). No new tools requiring justification. |

**Gate Result**: ✅ **PASS** - Feature complies with all core principles. Proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/028-week-5-day/
├── spec.md              # Feature specification (clarified)
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

Feature impacts the following existing directories:

```text
.github/workflows/
├── deploy-pages.yml      # UPDATED: Add Redoc documentation generation step
├── build-review-packet.yml # UPDATED: Add API docs link to review-artifacts/index.html
└── playwright-smoke.yml  # UPDATED: Add new Expense UI + API integration test

frontend/
├── src/
│   └── (existing Expense and To-Do components)
└── tests/
    ├── e2e/
    │   └── smoke-expense-api.spec.js  # NEW: Expense + API integration smoke test
    └── (existing tests)

docs/
├── api.html              # NEW: Generated Redoc documentation file
└── openapi.yaml          # EXISTING: OpenAPI specification

review-artifacts/
└── index.html            # UPDATED: Add API docs link alongside coverage and Playwright reports
```

**Structure Decision**: This feature integrates with existing CI/CD workflows and frontend structure. No new directories or application code required. Changes are localized to:
- GitHub Actions workflow configuration files (.github/workflows/)
- Review packet HTML generation (review-artifacts/index.html)
- Documentation generation output (docs/api.html)
- One new Playwright smoke test file

## Phase 0: Research & Analysis

### Research Tasks

Based on the technical context and feature requirements, the following research tasks are identified:

1. **Redoc Documentation Generation**: Best practices for integrating Redoc CLI into GitHub Actions workflows, build configuration, performance optimization
2. **GitHub Pages Deployment**: Configuration of deploy-pages workflow for documentation generation and publishing, branch triggers, artifact structure
3. **Playwright Integration Testing**: Best practices for UI-API smoke tests, request interception/verification patterns, assertion strategies, timeouts
4. **Review Packet Enhancement**: HTML generation patterns for linking external artifacts, link validation approaches, accessibility best practices
5. **CI Workflow Integration**: GitHub Actions workflow orchestration, conditional steps, documentation generation timing relative to other jobs

### Key Unknowns Resolved

| Unknown | Answer | Status |
|---------|--------|--------|
| Redoc vs Scalar tool choice | Redoc (confirmed via clarification) | ✅ |
| Smoke test UI scope | Expense only (confirmed via clarification) | ✅ |
| Documentation publishing trigger | Main branch only with PR preview (confirmed via clarification) | ✅ |
| Smoke test assertion strategy | Data + Response validation (confirmed via clarification) | ✅ |
| API error handling | Fail with error details (confirmed via clarification) | ✅ |
| Redoc CLI availability and setup | Node.js-based, install via npm | ✅ |
| GitHub Pages domain structure | `https://[org].github.io/[repo]/docs/api.html` | ✅ |
| Playwright test location | `frontend/tests/e2e/smoke-expense-api.spec.js` | ✅ |
| Review artifact link format | Relative or absolute URL in review-artifacts/index.html | ✅ |

### Deliverables

**research.md** will document:
- Redoc installation, configuration, and CLI usage patterns
- GitHub Actions workflow structure for documentation generation and publishing
- Playwright smoke test patterns for API request verification
- Review packet HTML generation and link validation
- Integration points between CI jobs

---

## Phase 1: Design & Contracts

### Data Model

No new persistent data models required. The feature operates on existing entities:

| Entity | Purpose | Interactions |
|--------|---------|---------------|
| **API Documentation (HTML)** | Generated artifact published to GitHub Pages | Consumed by: review packet, external users |
| **Review Packet Index** | Central artifact linking coverage, tests, docs | Updated to include new API docs link |
| **Playwright Smoke Test** | E2E test validating UI-API integration | Runs in CI, reports to review packet |
| **GitHub Pages Site** | Hosts API documentation | Exposed to public via URL |

### API Contracts

No new REST endpoints required. The feature:
- **Reads**: Existing OpenAPI specification file (docs/openapi.yaml)
- **Generates**: HTML documentation file (docs/api.html)
- **Validates**: Playwright test verifies existing Expense API endpoints (POST /expenses, GET /expenses)

### CI Workflow Integration

The feature updates existing CI workflows:

1. **deploy-pages.yml** (or equivalent):
   - Add step: Run Redoc CLI on openapi.yaml → generate docs/api.html
   - Trigger: On merge to main branch
   - Output: Artifact published to GitHub Pages at docs/api.html

2. **build-review-packet.yml**:
   - Add link to docs/api.html in review-artifacts/index.html
   - Validate link accessibility during build
   - Trigger: After documentation and tests complete

3. **playwright-smoke.yml** (or add to existing):
   - Add new test: smoke-expense-api.spec.js
   - Test sequence: Load Expense UI → Create expense (API call) → Wait for response → Assert UI updates
   - Trigger: On every PR, after API tests pass

### Quickstart

**For documentation generation**:
```bash
npm install @redocly/redoc-cli
npx redoc-cli build -o docs/api.html docs/openapi.yaml
```

**For review packet enhancement**:
- Add HTML link element to review-artifacts/index.html pointing to docs/api.html
- Link format: `<a href="./docs/api.html" target="_blank">API Documentation</a>` (relative URL)

**For Playwright smoke test**:
- Location: `frontend/tests/e2e/smoke-expense-api.spec.js`
- Pattern: Test sequence using `page.waitForResponse()` to capture and verify API calls
- Assertion: Verify both HTTP 200 response and UI updated with new expense

---

## Phase 1 Complete: Validation

Constitution Check (Post-Design):
- ✅ No logic duplication: Feature reuses existing UI and API components
- ✅ Test coverage: Smoke test follows existing Playwright framework
- ✅ Reviewability: Review packet includes all required artifacts
- ✅ PR Craft: Changes scoped and bounded (<300 LOC expected)
- ✅ Simplicity: Standard tools and workflows, no custom implementations

**All gates pass. Ready for Phase 2 task decomposition via /speckit.tasks**
