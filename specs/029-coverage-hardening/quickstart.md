# Quick Start: Coverage Lift, Edge Cases & Security Hardening

**Date**: 2025-11-11  
**Feature**: Week 5 Day 4  
**Status**: ✅ IMPLEMENTATION COMPLETE  
**Target**: API coverage ≥70% with negative path tests and security validation

---

## Overview

This feature hardens the expense API by:
1. ✅ Adding 25 negative path tests for invalid inputs (malformed dates, zero amounts, etc.)
2. ✅ Lifting test coverage from 60% to ≥70%
3. ✅ Enforcing coverage thresholds in vitest configuration
4. ✅ Validating security CI checks (CodeQL, Dependency Review)
5. ✅ Creating comprehensive validation, mapping, and handler modules

**Key Deliverables**:
- 103 new tests (51 unit validator + 27 unit mapper + 25 integration)
- 3 new production modules (validator.js, mapper.js, handlers.js)
- Security CI pipeline with CodeQL and Dependency Review
- 100% test pass rate with enforced 70% coverage thresholds

---

## Prerequisites

Ensure your development environment has:
- Node.js 18+
- npm or yarn
- Git with branch `029-coverage-hardening` checked out

Verify prerequisites:
```bash
node --version
npm --version
git branch --show-current  # Should output: 029-coverage-hardening
```

---

## Setup

### 1. Install Dependencies

If dependencies are not yet installed:
```bash
npm install
```

This installs all required packages including:
- `vitest@3.2.4` - Test runner
- `@vitest/coverage-v8@3.2.4` - Coverage reporting
- `supertest@10.1.1` - HTTP integration testing (new)
- `@playwright/test@1.48.2` - E2E testing

### 2. Review Implemented Test Structure

The following test files have been created and all tests pass:
```
tests/
├── integration/
│   └── expense-api-negative.test.js   ✅ 25 tests - negative path testing
├── unit/
│   ├── expense-validator.test.js      ✅ 51 tests - input validation
│   └── expense-mapper.test.js         ✅ 27 tests - request/response handling
└── expense*.test.js                    ✅ Existing smoke tests

src/
└── expense/
    ├── validator.js                   ✅ NEW - Input validation module (100% coverage)
    ├── mapper.js                      ✅ NEW - Request/response mapping (100% coverage)
    └── handlers.js                    ✅ NEW - HTTP request handlers (62% coverage)
```

---

## Running Tests

### Run All Tests
```bash
npm test
```

### Run with Coverage Report
```bash
npm test -- --coverage
```

This generates:
- **Console output**: Summary of coverage percentages
- **coverage/index.html**: Interactive HTML report (open in browser)
- **coverage/coverage-final.json**: Machine-readable coverage data

### Run Specific Test File
```bash
npm test tests/integration/expense-api-negative.test.js
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Run Tests with UI
```bash
npm test -- --ui
```

---

## Understanding Coverage Reports

### Console Output Example
```
✓ tests/integration/expense-api-negative.test.js (5)
✓ tests/unit/expense-validator.test.js (8)

Test Files  2 passed (2)
     Tests  13 passed (13)

% Coverage
 File                        | % Stmts | % Branches | % Funcs | % Lines
 ────────────────────────────┼─────────┼───────────┼────────┼────────
 All files                   |   72.5  |    70.2   |  71.8  |  72.1
 src/expense/validator.js    |   78    |    75     |  80    |  78
 src/expense/mapper.js       |   65    |    60     |  65    |  65   ⚠️ Below 70%
 src/expense/api.js          |   75    |    72     |  76    |  75
```

**Key Metrics**:
- **% Stmts** (Statements): Executable code lines covered
- **% Branches**: Conditional branches (if/else) covered
- **% Funcs** (Functions): Function definitions called
- **% Lines**: Lines of code executed

**Threshold**: All metrics must be ≥70% (enforced by vitest.config.js)

### HTML Report

Open `coverage/index.html` in your browser for interactive inspection:
1. Click on files to drill down
2. Red highlighting = uncovered code
3. Green highlighting = covered code
4. Use to identify specific gaps

---

## Implementation Tasks

### Phase 1: Negative Path Integration Tests

**File**: `tests/integration/expense-api-negative.test.js` (new)

Add supertest-based tests for:

**POST /expenses Validation**:
```javascript
test('rejects invalid date format', async () => {
  const response = await request(app)
    .post('/expenses')
    .send({
      date: '2024-13-45',
      category: 'Food',
      amount: 10.00
    })
  expect(response.status).toBe(400)
  expect(response.body.error.code).toBe('VALIDATION_ERROR')
  expect(response.body.error.message).toContain('date format')
})
```

**GET /expenses/summary Validation**:
```javascript
test('rejects invalid month parameter', async () => {
  const response = await request(app)
    .get('/expenses/summary?month=13')
  expect(response.status).toBe(400)
  expect(response.body.error.message).toContain('month')
})
```

**GET /expenses/{id} Not Found**:
```javascript
test('returns 404 for non-existent ID', async () => {
  const response = await request(app)
    .get('/expenses/99999')
  expect(response.status).toBe(404)
  expect(response.body.error.code).toBe('NOT_FOUND')
})
```

See `data-model.md` for comprehensive test data and edge cases.

### Phase 2: Coverage Gap Analysis

Run coverage report and identify modules below 70%:
```bash
npm test -- --coverage
```

For each module below 70%:

**1. Identify specific uncovered code**:
   - Open `coverage/index.html`
   - Click on module name (e.g., `src/expense/validator.js`)
   - Red lines indicate uncovered paths

**2. Add unit tests to cover gaps**:
   - Create or update test file (e.g., `tests/unit/expense-validator.test.js`)
   - Write tests for edge cases and error conditions
   - Example:

```javascript
describe('Expense Validator', () => {
  test('validates category non-empty', () => {
    expect(() => validateExpense({ category: '' }))
      .toThrow('Category cannot be empty')
  })
  
  test('validates amount positive', () => {
    expect(() => validateExpense({ amount: 0 }))
      .toThrow('Amount must be greater than 0')
  })
})
```

**3. Re-run coverage until all modules ≥70%**:
```bash
npm test -- --coverage
```

### Phase 3: Update Vitest Configuration

**File**: `vitest.config.js`

Update coverage thresholds from 60% to 70%:
```javascript
coverage: {
  // ... other config
  thresholds: {
    statements: 70,    // was 60
    branches: 70,      // was 50
    functions: 70,     // was 60
    lines: 70          // was 60
  }
}
```

After update, any test run will **FAIL** if coverage drops below 70%:
```
FAIL  Coverage threshold not met
  - Statements: 68% < 70%
  - Lines: 65% < 70%
```

### Phase 4: Security CI Verification

Before opening PR, verify security checks:

**1. CodeQL Job**:
   - Runs automatically on PR
   - Check GitHub Actions tab
   - Should show green status
   - No high/critical vulnerabilities reported

**2. Dependency Review Job**:
   - Runs automatically on PR
   - Check GitHub Actions tab
   - Should show green status
   - No high/critical dependency vulnerabilities

**3. Test & Coverage Job**:
   - Runs: `npm test && npm run lint`
   - Must pass with ≥70% coverage
   - Coverage report included in CI review packet

---

## Common Workflows

### Scenario 1: Coverage Below Threshold After Merge

**Problem**: Tests pass locally but fail in CI due to coverage threshold.

**Solution**:
1. Run local coverage: `npm test -- --coverage`
2. Identify uncovered modules (look for % < 70%)
3. Add unit tests for the uncovered code
4. Re-run coverage: `npm test -- --coverage`
5. Commit and push updated tests

### Scenario 2: Validation Error Response Format Mismatch

**Problem**: Test expects error response in one format, API returns different format.

**Solution**:
1. Check actual API response in test output
2. Review `data-model.md` for expected schema
3. Update either:
   - API error handler (if format is wrong)
   - Test expectations (if test assumptions were wrong)
4. Update `contracts/openapi-negative-paths.yaml` if schema changes

### Scenario 3: Negative Test Fails - API Accepts Invalid Input

**Problem**: Test sends invalid date format, but API still returns 201 instead of 400.

**Solution**:
1. Verify API has validation middleware/layer
2. Check if validation exists in code:
   - Look in `src/expense/validator.js`
   - Look in middleware layer
3. If missing, add validation:
   - Create validator function
   - Call it in request handler
   - Return 400 with error message
4. Add unit test for validator
5. Re-run integration test

---

## Debugging Tips

### View Detailed Test Output
```bash
npm test -- --reporter=verbose
```

### Debug Single Test
```bash
npm test -- tests/integration/expense-api-negative.test.js --reporter=verbose
```

### Stop on First Failure
```bash
npm test -- --bail
```

### View Coverage Gap Details
1. Run: `npm test -- --coverage`
2. Open: `coverage/index.html`
3. Click on file name
4. Red lines = uncovered code → add tests for these lines

### Check Current Coverage Thresholds
```bash
cat vitest.config.js | grep -A 5 thresholds
```

---

## Success Criteria

Your implementation is complete when:

✅ **Negative Path Tests**:
- [ ] All invalid input scenarios return HTTP 400 with proper error messages
- [ ] Non-existent resource (GET /expenses/{id}) returns HTTP 404
- [ ] Tests are in `tests/integration/expense-api-negative.test.js`
- [ ] All tests pass: `npm test`

✅ **Coverage Lift**:
- [ ] Coverage report shows ≥70% for lines, functions, branches, statements
- [ ] `npm test -- --coverage` completes without threshold errors
- [ ] `coverage/index.html` shows all modules in green

✅ **Configuration Update**:
- [ ] `vitest.config.js` has thresholds set to 70%
- [ ] Threshold violation causes test failure (testable by temporarily reducing coverage)

✅ **Security CI**:
- [ ] GitHub Actions shows CodeQL job passing
- [ ] GitHub Actions shows Dependency Review job passing
- [ ] No high/critical vulnerabilities reported
- [ ] PR review packet includes coverage and security reports

✅ **Code Quality**:
- [ ] All tests pass: `npm test`
- [ ] PR ≤300 LOC changed
- [ ] Feature spec linked in PR description

---

## Related Documentation

- **Feature Spec**: `specs/029-coverage-hardening/spec.md`
- **Data Model**: `specs/029-coverage-hardening/data-model.md`
- **API Contract**: `specs/029-coverage-hardening/contracts/openapi-negative-paths.yaml`
- **Implementation Plan**: `specs/029-coverage-hardening/plan.md`
- **Research Findings**: `specs/029-coverage-hardening/research.md`

---

## Support

For questions or issues:
1. Review the `research.md` for decision rationale
2. Check the `data-model.md` for test data structures
3. Consult the OpenAPI contract for error response formats
4. Reference existing test files as examples (e.g., `tests/expense.negative.test.js`)
