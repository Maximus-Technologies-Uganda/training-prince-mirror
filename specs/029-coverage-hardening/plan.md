# Implementation Plan: Week 5 Day 4: Coverage Lift, Edge Cases & Security Hardening

**Branch**: `029-coverage-hardening` | **Date**: 2025-11-11 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/029-coverage-hardening/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This feature hardens the expense API by expanding negative path test coverage, lifting API test coverage from current 60% to ≥70%, and ensuring security CI checks (CodeQL, Dependency Review) are clean. The implementation focuses on:

1. **Negative Path Testing**: Add supertest integration tests for invalid inputs (malformed dates, zero/negative amounts, empty categories, invalid query parameters, non-existent IDs)
2. **Coverage Gap Closure**: Identify untested modules/error paths and add unit tests to validators, mappers, and error handlers
3. **Coverage Enforcement**: Update vitest.config.js to enforce 70% threshold for lines, functions, and branches
4. **Security Validation**: Verify CodeQL and Dependency Review CI jobs run cleanly with no high/critical vulnerabilities

## Technical Context

**Language/Version**: JavaScript (Node.js, ES modules)  
**Primary Dependencies**: Vitest (v3.2.4), @vitest/coverage-v8, supertest, Playwright (v1.48.2)  
**Storage**: N/A (test-focused feature, no data persistence changes)  
**Testing**: Vitest (unit + integration with supertest), Playwright (E2E smoke tests)  
**Target Platform**: Node.js runtime (CLI and backend API testing)  
**Project Type**: Backend API with test suite (single project)  
**Performance Goals**: Tests complete in < 30 seconds total
**Constraints**: Coverage thresholds (lines, functions, branches ≥70%); Zero high/critical vulnerabilities  
**Scale/Scope**: 3 expense API endpoints, ~15-20 new test cases, vitest.config.js update

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Applicable Principles** (from `.specify/memory/constitution.md`):

- **Test Coverage Mandate**: ✅ PASS - Feature directly addresses coverage requirements (aim ≥70% vs current 60%)
- **Reviewability**: ✅ PASS - CI/CD artifacts (coverage reports, CodeQL results) will be included in review packet
- **PR Craft**: ✅ PASS - Negative tests and coverage updates can be implemented as focused PR ≤300 LOC changes
- **Simplicity & Consistency**: ✅ PASS - Uses existing test framework (Vitest), linting (ESLint), no new tools required

**Status**: ✅ **CONSTITUTION CHECK PASSES** - No violations. Feature aligns with coverage mandate and CI review practices.

## Project Structure

### Documentation (this feature)

```text
specs/029-coverage-hardening/
├── spec.md              # Feature specification
├── plan.md              # This file (implementation plan)
├── research.md          # Phase 0 output (research findings)
├── data-model.md        # Phase 1 output (test data model)
├── quickstart.md        # Phase 1 output (getting started guide)
├── contracts/           # Phase 1 output (OpenAPI schema for negative paths)
└── checklists/
    └── requirements.md  # Specification quality checklist
```

### Source Code (repository root)

```text
src/
├── expense/
│   ├── api.js
│   ├── validator.js
│   ├── mapper.js
│   └── index.js
├── models/
├── hello/
├── quote/
├── stopwatch/
└── temp-converter/

tests/
├── integration/
│   └── expense-api-negative.test.js     # NEW: Negative path integration tests
├── unit/
│   ├── expense-validator.test.js        # NEW/UPDATE: Validator coverage gaps
│   ├── expense-mapper.test.js           # NEW/UPDATE: Mapper coverage gaps
│   └── ...
├── contracts/                           # Contract tests (existing)
├── expense.cli.test.js
├── expense.negative.test.js
├── expense.unit.test.js
└── ...
```

**Structure Decision**: Using existing single-project structure (src/ + tests/) with focused additions:
- New integration test file: `tests/integration/expense-api-negative.test.js`
- Enhanced unit tests for coverage gaps in validators, mappers
- Updated `vitest.config.js` with enforced 70% threshold

## Complexity Tracking

No Constitution violations. All complexity is justified and within single-project scope:

| Item | Justification |
|------|---------------|
| Coverage threshold increase (60% → 70%) | Required by specification; existing infrastructure supports it |
| Negative path testing expansion | Directly addresses spec requirement for hardening API against invalid inputs |
| vitest.config.js update | Minimal change; enforces measurable quality gate without architectural change |
| No architectural complexity | Feature stays within existing test framework, no new tools required |
