# Contract: Contract Tests for Expenses API

**Feature**: Week 5 Day 1: API Spec & Contracts First (Expenses)  
**Scope**: HTTP contract tests using supertest for expense endpoints  
**Date**: 2025-11-06

---

## Contract Definition

### Input
- OpenAPI specification from `openapi-spec.contract.md`
- Supertest framework (already in dependencies)
- Express server setup (for test server)

### Output
- `api/tests/contract/expenses.contract.test.ts` - HTTP contract tests using supertest
- Tests integrated into Test & Coverage - API CI job

### Validation Rules

1. **Test Framework**: Must use supertest for HTTP requests (FR-012)
2. **Endpoint Coverage**: Must test all three endpoints:
   - GET /expenses (FR-009)
   - POST /expenses (FR-010)
   - GET /expenses/summary (FR-011)
3. **Initial Failure**: Tests must fail initially (endpoints don't exist yet) (FR-013)
4. **CI Integration**: Tests must run in Test & Coverage - API CI job (FR-014)
5. **CI Failure Tolerance**: Test & Coverage - API job allowed to fail initially (FR-015)

### Test Structure

#### GET /expenses Contract Tests
- Test pagination parameters (page, pageSize)
- Validate response structure matches OpenAPI spec
- Test error responses (400, 500) match ErrorEnvelope schema
- Test request-id header handling

#### POST /expenses Contract Tests
- Test valid request body (amount, category, date)
- Validate 201 Created response matches Expense schema
- Test validation errors (400) match ErrorEnvelope schema
- Test request-id header handling

#### GET /expenses/summary Contract Tests
- Test query parameters (category, month)
- Validate response structure matches ExpenseSummary schema
- Test error responses match ErrorEnvelope schema
- Test request-id header handling

### Test Implementation Pattern

```typescript
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../src/server'; // Express app

describe('GET /expenses', () => {
  it('should return 404 initially (endpoint not implemented)', async () => {
    const response = await request(app)
      .get('/expenses')
      .set('request-id', 'test-request-id')
      .expect(404); // Initially fails - endpoint doesn't exist
    
    // Once implemented, expect 200 with Expense array
  });
  
  it('should validate pagination parameters', async () => {
    // Test page and pageSize query parameters
  });
});
```

### Failure Conditions
- **ERROR**: Tests pass before endpoints exist → Implementation happened before spec
- **ERROR**: Tests don't validate response schemas → Contract not enforced
- **ERROR**: Tests not integrated into CI → FR-014 not satisfied

### Success Criteria
- ✅ Contract tests written for all three endpoints
- ✅ Tests use supertest for HTTP requests
- ✅ Tests initially fail (404 or connection errors)
- ✅ Tests validate request/response schemas match OpenAPI spec
- ✅ Tests integrated into Test & Coverage - API CI job
- ✅ CI job configured to allow failures initially

---

## Related Contracts
- `openapi-spec.contract.md`: Tests validate this OpenAPI specification
- `test-coverage-ci.contract.md`: CI job runs these tests


