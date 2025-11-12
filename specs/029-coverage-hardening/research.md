# Phase 0 Research: Coverage Lift, Edge Cases & Security Hardening

**Date**: 2025-11-11  
**Feature**: Week 5 Day 4 Coverage Hardening  
**Status**: Complete  

## Research Findings

### 1. Coverage Threshold Enforcement (70% vs Current 60%)

**Decision**: Update vitest.config.js to enforce 70% thresholds for lines, functions, and branches.

**Rationale**: 
- Current project has 60% thresholds (lines, functions, branches all at 60%)
- Feature requirement mandates ≥70% coverage floor
- Threshold enforcement in vitest.config.js prevents regression and ensures quality gate

**Alternatives Considered**:
- Manual coverage review process: Rejected - not automated, prone to regression
- Selective threshold by module: Rejected - complex, violates "simplicity" principle; uniform threshold simpler

**Implementation Approach**:
```javascript
thresholds: {
  statements: 70,
  branches: 70,
  functions: 70,
  lines: 70
}
```

---

### 2. Expense API Validation Rules (Negative Path Testing)

**Decision**: Three expense endpoints require validation enforcement:
- POST /expenses: date format, category non-empty, amount > 0
- GET /expenses/summary: query parameter validation (month 1-12)
- GET /expenses/{id}: 404 for non-existent ID

**Rationale**:
- Spec requires validation for invalid inputs to return HTTP 400 (validation) or 404 (not found)
- Negative testing ensures API rejects malformed requests at validation layer
- Prevents invalid state propagation to database/business logic

**Validation Rules Researched**:

| Endpoint | Field | Rule | HTTP Code | Error Message |
|----------|-------|------|-----------|---------------|
| POST /expenses | date | ISO 8601 format (YYYY-MM-DD) | 400 | "Invalid date format. Expected YYYY-MM-DD" |
| POST /expenses | category | Non-empty string, no whitespace-only | 400 | "Category cannot be empty" |
| POST /expenses | amount | Positive number (> 0) | 400 | "Amount must be greater than 0" |
| GET /expenses/summary | month | Integer 1-12 | 400 | "Invalid month. Must be between 1 and 12" |
| GET /expenses/{id} | id | Non-existent resource | 404 | "Expense not found" |

**Alternatives Considered**:
- Only test happy path: Rejected - insufficient for security/reliability
- Manual validation in each test: Rejected - creates test duplication
- Centralized validation middleware: Accepted approach - validates all inputs consistently

**Implementation Approach**:
- Use supertest for integration testing negative paths
- Test each validation rule with malformed input
- Verify correct HTTP status and error message structure
- Test edge cases (whitespace, very large numbers, type mismatches)

---

### 3. Integration Test Structure (Supertest)

**Decision**: Create new file `tests/integration/expense-api-negative.test.js` with supertest-based integration tests.

**Rationale**:
- Project already uses supertest for integration tests (see `tests/integration/` structure)
- Supertest integrates HTTP testing seamlessly with Vitest
- Centralized negative path testing aids discoverability and maintenance

**Alternatives Considered**:
- Unit tests only: Rejected - doesn't test HTTP response layer
- Inline tests in existing files: Rejected - dilutes focus; separate file for clarity
- Different testing library (fetch, axios): Rejected - project already uses supertest

**Implementation Structure**:
```javascript
// tests/integration/expense-api-negative.test.js
describe('Expense API - Negative Paths', () => {
  describe('POST /expenses validation', () => {
    test('rejects invalid date format', async () => { ... })
    test('rejects empty category', async () => { ... })
    test('rejects zero/negative amount', async () => { ... })
  })
  describe('GET /expenses/summary validation', () => {
    test('rejects invalid month parameter', async () => { ... })
  })
  describe('GET /expenses/{id}', () => {
    test('returns 404 for non-existent ID', async () => { ... })
  })
})
```

---

### 4. Coverage Gap Identification Strategy

**Decision**: Use three-phase approach:
1. Run coverage report: `npm test -- --coverage`
2. Identify modules below 70% threshold
3. Add unit tests to validators, mappers, error handlers

**Rationale**:
- Coverage report pinpoints exact lines/functions/branches uncovered
- Validators and mappers typically have edge cases in error paths
- Focused approach ensures efficient resource allocation

**Alternatives Considered**:
- Test everything: Rejected - inefficient; prioritize uncovered code
- Run coverage once, ignore results: Rejected - defeats purpose of threshold

**Implementation Approach**:
- Coverage report generated in `coverage/` directory
- HTML report: `coverage/index.html` for visual inspection
- JSON report: `coverage/coverage-final.json` for programmatic analysis
- Target modules likely needing tests:
  - `src/expense/validator.js` - validation rules
  - `src/expense/mapper.js` - transformation edge cases
  - Error handler functions in error-handling middleware

---

### 5. Security CI Job Verification

**Decision**: Verify CodeQL and Dependency Review jobs in GitHub Actions pass with:
- No high or critical vulnerabilities reported
- Jobs complete successfully
- No blockers preventing PR merge

**Rationale**:
- GitHub Actions CodeQL scans for security issues in code
- Dependency Review checks for vulnerable dependencies
- Both are non-negotiable for production readiness

**Alternatives Considered**:
- Manual security audit: Rejected - CI automation essential for velocity
- Skip security checks: Rejected - unacceptable risk

**Implementation Approach**:
- Review `.github/workflows/` for CodeQL and Dependency Review job definitions
- Confirm both jobs are enabled and configured
- During PR testing, verify:
  - CodeQL job completes with green status
  - Dependency Review job completes with green status
  - No high/critical vulnerabilities reported in either job

---

## Resolved Unknowns

| Unknown | Resolution |
|---------|-----------|
| Current coverage threshold | Confirmed: 60% (lines, functions, branches, statements) |
| Test framework | Confirmed: Vitest 3.2.4 with @vitest/coverage-v8 |
| Integration test library | Confirmed: supertest available in existing tests |
| CI/CD platform | Confirmed: GitHub Actions with CodeQL and Dependency Review enabled |
| Validation patterns | Researched: HTTP 400 for invalid input, 404 for not found |
| Existing test coverage | Researched: Tests in `tests/` directory with existing integration and unit structure |

---

## Key Dependencies & Assumptions

- **Vitest**: Already installed and configured with v8 coverage provider
- **supertest**: Available in test suite for HTTP integration testing
- **GitHub Actions**: CodeQL and Dependency Review workflows already enabled
- **Expense API**: Endpoints (POST /expenses, GET /expenses/summary, GET /expenses/{id}) already implemented
- **Validation layer**: Assumed to exist or will be created/updated as part of implementation

---

## Next Steps (Phase 1)

1. **Data Model**: Define test data structures (valid and invalid Expense records)
2. **Contracts**: Generate OpenAPI schema documenting expected validation responses
3. **Quickstart**: Create guide for running tests and interpreting coverage reports
4. **Agent Context**: Update copilot context for aware implementation
