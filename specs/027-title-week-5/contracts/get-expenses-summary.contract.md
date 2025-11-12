# Contract: GET /expenses/summary Endpoint

**Feature**: Week 5 Day 2: API Skeleton, Validation & Errors  
**Scope**: GET /expenses/summary endpoint with filtering support  
**Date**: 2025-01-27

---

## Contract Definition

### Input
- HTTP GET request to `/expenses/summary`
- Optional query parameters:
  - `category`: string (case-sensitive category filter)
  - `month`: string (YYYY-MM format, pattern `^\d{4}-\d{2}$`)
- Optional header:
  - `request-id`: string (for request correlation)

### Output
- **Success (200 OK)**: Expense summary with aggregated data
  ```json
  {
    "total": 150.75,
    "count": 5,
    "filters": {
      "category": "food",
      "month": "2025-11"
    }
  }
  ```
- **Error (400 Bad Request)**: Invalid query parameters
  ```json
  {
    "code": "VALIDATION_ERROR",
    "message": "Invalid query parameters",
    "details": [
      {
        "field": "month",
        "message": "month must be in YYYY-MM format",
        "value": "2025-11-05"
      }
    ],
    "requestId": "550e8400-e29b-41d4-a716-446655440000"
  }
  ```
- **Error (500 Internal Server Error)**: Server error
  ```json
  {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred",
    "requestId": "550e8400-e29b-41d4-a716-446655440000"
  }
  ```

### Validation Rules
1. **Query Parameters**:
   - `category`: optional string (case-sensitive, non-empty if provided)
   - `month`: optional string (must match pattern `^\d{4}-\d{2}$` if provided)
   - Invalid `month` format returns 400 with ErrorEnvelope

2. **Response Structure**:
   - Must return ExpenseSummary with `total`, `count`, and `filters`
   - `total`: sum of expense amounts matching filters (≥ 0)
   - `count`: number of expenses matching filters (≥ 0)
   - `filters`: object with applied filters (can be empty if no filters)

3. **Filter Logic**:
   - Filters are AND logic (both category and month if provided)
   - Empty repository: `{ total: 0, count: 0, filters: {} }`
   - No matching expenses: `{ total: 0, count: 0, filters: {...} }`

4. **Request-ID Header**:
   - If provided, must be echoed in error responses

### Failure Conditions
- **ERROR**: Invalid `month` format (not YYYY-MM) → 400 Bad Request with validation error
- **ERROR**: Server error during processing → 500 Internal Server Error with generic error (no internal details)

### Success Criteria
- ✅ Returns 200 OK with expense summary
- ✅ Response structure matches ExpenseSummary schema
- ✅ Filters applied correctly (category and/or month)
- ✅ Empty repository returns zero totals with empty filters
- ✅ No matching expenses returns zero totals with applied filters
- ✅ Invalid query parameters return 400 with ErrorEnvelope
- ✅ Request-id header echoed in error responses

### OpenAPI Specification
- Endpoint: `GET /expenses/summary`
- Query parameters: `category` (optional string), `month` (optional string, pattern `^\d{4}-\d{2}$`)
- Response schema: `ExpenseSummary`
- Error responses: `ErrorEnvelope` (400, 500)

---

## Implementation Notes

1. **Route Handler**: Already exists in `api/src/routes/expenses.ts`, may need updates for error handling
2. **Service Method**: Use existing `ExpenseStore.summarize()` method
3. **Validation**: Use Zod schema for query parameter validation (month format)
4. **Error Handling**: Use central error middleware for consistent error responses
5. **Filter Logic**: Category filter is case-sensitive, month filter matches YYYY-MM format

