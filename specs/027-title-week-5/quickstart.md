# Quickstart: Week 5 Day 2: API Skeleton, Validation & Errors

**Feature**: Week 5 Day 2: API Skeleton, Validation & Errors  
**Date**: 2025-01-27

---

## Overview

This quickstart guide validates the implementation of the expenses API endpoints with pagination, validation, and error handling. It follows the user scenarios from the feature specification and confirms all contract tests pass.

---

## Prerequisites

1. API server running on `http://localhost:3000`
2. All dependencies installed (`npm install` in `/api` directory)
3. Contract tests exist in `/api/tests/contract/expenses.contract.test.ts`

---

## Validation Steps

### 1. Verify GET /expenses Endpoint with Pagination

**Scenario**: Retrieve paginated expense records

```bash
# Test basic GET request (default pagination)
curl -X GET http://localhost:3000/expenses \
  -H "request-id: test-001" \
  -H "Content-Type: application/json"

# Expected: 200 OK with wrapped response
# {
#   "data": [],
#   "pagination": {
#     "totalItems": 0,
#     "currentPage": 1,
#     "pageSize": 20,
#     "totalPages": 0
#   }
# }
```

```bash
# Test with pagination parameters
curl -X GET "http://localhost:3000/expenses?page=1&pageSize=10" \
  -H "request-id: test-002" \
  -H "Content-Type: application/json"

# Expected: 200 OK with paginated response
```

```bash
# Test invalid pagination parameters (should return 400)
curl -X GET "http://localhost:3000/expenses?page=0" \
  -H "request-id: test-003" \
  -H "Content-Type: application/json"

# Expected: 400 Bad Request with ErrorEnvelope
# {
#   "code": "VALIDATION_ERROR",
#   "message": "Invalid pagination parameters",
#   "details": [
#     {
#       "field": "page",
#       "message": "page must be greater than or equal to 1",
#       "value": 0
#     }
#   ],
#   "requestId": "test-003"
# }
```

**Validation Checklist**:
- [ ] GET /expenses returns 200 OK
- [ ] Response structure matches PaginatedExpenseResponse (wrapped object with data and pagination)
- [ ] Pagination metadata is accurate (totalItems, currentPage, pageSize, totalPages)
- [ ] Invalid pagination parameters return 400 with ErrorEnvelope
- [ ] Request-id header echoed in error responses

---

### 2. Verify POST /expenses Endpoint with Validation

**Scenario**: Create expense records with proper validation

```bash
# Test valid expense creation
curl -X POST http://localhost:3000/expenses \
  -H "request-id: test-004" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 25.50,
    "category": "food",
    "date": "2025-11-05"
  }'

# Expected: 201 Created with expense object
# {
#   "id": "550e8400-e29b-41d4-a716-446655440000",
#   "amount": 25.50,
#   "category": "food",
#   "date": "2025-11-05"
# }
```

```bash
# Test validation error (negative amount)
curl -X POST http://localhost:3000/expenses \
  -H "request-id: test-005" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": -10,
    "category": "food",
    "date": "2025-11-05"
  }'

# Expected: 400 Bad Request with ErrorEnvelope
# {
#   "code": "VALIDATION_ERROR",
#   "message": "Validation failed",
#   "details": [
#     {
#       "field": "amount",
#       "message": "amount must be greater than 0",
#       "value": -10
#     }
#   ],
#   "requestId": "test-005"
# }
```

```bash
# Test validation error (invalid date format)
curl -X POST http://localhost:3000/expenses \
  -H "request-id: test-006" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 25.50,
    "category": "food",
    "date": "11/05/2025"
  }'

# Expected: 400 Bad Request with ErrorEnvelope
# {
#   "code": "VALIDATION_ERROR",
#   "message": "Validation failed",
#   "details": [
#     {
#       "field": "date",
#       "message": "date must be in YYYY-MM-DD format (received: 11/05/2025)",
#       "value": "11/05/2025"
#     }
#   ],
#   "requestId": "test-006"
# }
```

```bash
# Test validation error (missing required field)
curl -X POST http://localhost:3000/expenses \
  -H "request-id: test-007" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 25.50
  }'

# Expected: 400 Bad Request with ErrorEnvelope containing validation errors for missing fields
```

**Validation Checklist**:
- [ ] POST /expenses returns 201 Created with created expense (server-assigned UUID)
- [ ] Response structure matches Expense schema
- [ ] Validation errors return 400 with ErrorEnvelope
- [ ] Invalid values included in error details (per spec FR-012)
- [ ] Multiple validation errors returned in details array
- [ ] Request-id header echoed in error responses

---

### 3. Verify GET /expenses/summary Endpoint with Filtering

**Scenario**: Retrieve expense summaries with optional filtering

```bash
# Test summary without filters
curl -X GET http://localhost:3000/expenses/summary \
  -H "request-id: test-008" \
  -H "Content-Type: application/json"

# Expected: 200 OK with summary
# {
#   "total": 0,
#   "count": 0,
#   "filters": {}
# }
```

```bash
# Test summary with category filter
curl -X GET "http://localhost:3000/expenses/summary?category=food" \
  -H "request-id: test-009" \
  -H "Content-Type: application/json"

# Expected: 200 OK with filtered summary
# {
#   "total": 25.50,
#   "count": 1,
#   "filters": {
#     "category": "food"
#   }
# }
```

```bash
# Test summary with month filter
curl -X GET "http://localhost:3000/expenses/summary?month=2025-11" \
  -H "request-id: test-010" \
  -H "Content-Type: application/json"

# Expected: 200 OK with filtered summary
```

```bash
# Test summary with both filters
curl -X GET "http://localhost:3000/expenses/summary?category=food&month=2025-11" \
  -H "request-id: test-011" \
  -H "Content-Type: application/json"

# Expected: 200 OK with filtered summary
```

```bash
# Test validation error (invalid month format)
curl -X GET "http://localhost:3000/expenses/summary?month=2025-11-05" \
  -H "request-id: test-012" \
  -H "Content-Type: application/json"

# Expected: 400 Bad Request with ErrorEnvelope
# {
#   "code": "VALIDATION_ERROR",
#   "message": "Invalid query parameters",
#   "details": [
#     {
#       "field": "month",
#       "message": "month must be in YYYY-MM format",
#       "value": "2025-11-05"
#     }
#   ],
#   "requestId": "test-012"
# }
```

**Validation Checklist**:
- [ ] GET /expenses/summary returns 200 OK with summary
- [ ] Response structure matches ExpenseSummary schema
- [ ] Filters applied correctly (category and/or month)
- [ ] Empty repository returns zero totals with empty filters
- [ ] Invalid query parameters return 400 with ErrorEnvelope
- [ ] Request-id header echoed in error responses

---

### 4. Verify Error Handling Middleware

**Scenario**: Central error handling returns consistent error responses

```bash
# Test server error handling (if applicable)
# Trigger an unexpected error and verify generic error response

# Expected: 500 Internal Server Error with ErrorEnvelope
# {
#   "code": "INTERNAL_ERROR",
#   "message": "An unexpected error occurred",
#   "requestId": "test-013"
# }
# (No internal details exposed)
```

**Validation Checklist**:
- [ ] All errors caught by error middleware
- [ ] Error responses match ErrorEnvelope schema
- [ ] Appropriate HTTP status codes returned (400, 404, 422, 429, 500)
- [ ] Request-id header echoed in error responses
- [ ] Server errors return generic message (no internal details exposed)

---

### 5. Verify Contract Tests Pass

**Scenario**: All contract tests from Day 1 must pass

```bash
# Run contract tests
cd api
npm test -- tests/contract/expenses.contract.test.ts

# Expected: All tests pass
# ✅ GET /expenses tests pass
# ✅ POST /expenses tests pass
# ✅ GET /expenses/summary tests pass
```

**Validation Checklist**:
- [ ] All contract tests for GET /expenses pass
- [ ] All contract tests for POST /expenses pass
- [ ] All contract tests for GET /expenses/summary pass
- [ ] Test & Coverage - API CI job passes with ≥60% coverage

---

### 6. Verify OpenAPI Specification Update

**Scenario**: OpenAPI spec reflects pagination metadata structure

```bash
# Check OpenAPI spec
cat api/spec/openapi.yaml | grep -A 20 "GET /expenses"

# Expected: GET /expenses 200 response schema shows wrapped object with data and pagination
```

**Validation Checklist**:
- [ ] OpenAPI spec updated for GET /expenses endpoint
- [ ] Response schema shows wrapped object (not plain array)
- [ ] Pagination metadata schema defined in components/schemas
- [ ] spec-check CI job passes

---

## Success Criteria

All of the following must be satisfied:

- [ ] GET /expenses endpoint implemented and returns paginated expense records with metadata
- [ ] POST /expenses endpoint implemented and creates expense records with validation
- [ ] GET /expenses/summary endpoint implemented and returns aggregated summaries
- [ ] In-memory data repository extended with pagination support
- [ ] Input validation implemented for all request bodies and query parameters
- [ ] Validation errors return 400 Bad Request with ErrorEnvelope containing validation details
- [ ] Central error handling middleware implemented and catches all errors
- [ ] Error middleware maps errors to standard ErrorEnvelope format
- [ ] Error responses include appropriate HTTP status codes (400, 404, 422, 429, 500)
- [ ] Request-id header echoed in error responses when provided
- [ ] All contract tests pass
- [ ] Test & Coverage - API CI job passes with ≥60% coverage
- [ ] OpenAPI specification updated to include pagination metadata structure
- [ ] spec-check CI job passes
- [ ] CodeQL CI job passes

---

## Notes

1. **Pagination**: GET /expenses returns wrapped response with `data` and `pagination` properties, not a plain array (per spec FR-001a).

2. **Error Format**: All errors use ErrorEnvelope format. Validation errors include invalid values in `details` array (per spec FR-012).

3. **Request-ID**: Optional `request-id` header is echoed in error responses for correlation (per spec FR-005, FR-018).

4. **In-Memory Storage**: Repository is temporary, data lost on server restart. No seed data, starts empty.

5. **OpenAPI Spec Update**: GET /expenses response schema must be updated to reflect pagination metadata structure (per spec FR-004a, FR-024).

