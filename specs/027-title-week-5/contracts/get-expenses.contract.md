# Contract: GET /expenses Endpoint

**Feature**: Week 5 Day 2: API Skeleton, Validation & Errors  
**Scope**: GET /expenses endpoint with pagination support  
**Date**: 2025-01-27

---

## Contract Definition

### Input
- HTTP GET request to `/expenses`
- Optional query parameters:
  - `page`: integer (≥ 1, default: 1)
  - `pageSize`: integer (1-100, default: 20)
- Optional header:
  - `request-id`: string (for request correlation)

### Output
- **Success (200 OK)**: Paginated expense response
  ```json
  {
    "data": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "amount": 25.50,
        "category": "food",
        "date": "2025-11-05"
      }
    ],
    "pagination": {
      "totalItems": 50,
      "currentPage": 1,
      "pageSize": 20,
      "totalPages": 3
    }
  }
  ```
- **Error (400 Bad Request)**: Invalid pagination parameters
  ```json
  {
    "code": "VALIDATION_ERROR",
    "message": "Invalid pagination parameters",
    "details": [
      {
        "field": "page",
        "message": "page must be greater than or equal to 1",
        "value": 0
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
   - `page` must be integer ≥ 1 (default: 1)
   - `pageSize` must be integer between 1 and 100 (default: 20)
   - Invalid values return 400 with ErrorEnvelope

2. **Response Structure**:
   - Must return wrapped object with `data` (array) and `pagination` (object)
   - `data` contains Expense objects (can be empty array)
   - `pagination` contains: totalItems, currentPage, pageSize, totalPages

3. **Pagination Calculation**:
   - `totalPages = Math.ceil(totalItems / pageSize)`
   - Empty repository: `{ data: [], pagination: { totalItems: 0, currentPage: 1, pageSize: 20, totalPages: 0 } }`

4. **Request-ID Header**:
   - If provided, must be echoed in error responses

### Failure Conditions
- **ERROR**: Invalid `page` parameter (< 1) → 400 Bad Request with validation error
- **ERROR**: Invalid `pageSize` parameter (< 1 or > 100) → 400 Bad Request with validation error
- **ERROR**: Server error during processing → 500 Internal Server Error with generic error (no internal details)

### Success Criteria
- ✅ Returns 200 OK with paginated expense data
- ✅ Response structure matches PaginatedExpenseResponse schema
- ✅ Pagination metadata is accurate (totalItems, currentPage, pageSize, totalPages)
- ✅ Empty repository returns empty data array with correct pagination metadata
- ✅ Invalid pagination parameters return 400 with ErrorEnvelope
- ✅ Request-id header echoed in error responses

### OpenAPI Specification
- Endpoint: `GET /expenses`
- Response schema must be updated to reflect wrapped structure (not plain array)
- Pagination metadata schema must be defined in components/schemas

---

## Implementation Notes

1. **Route Handler**: Implement in `api/src/routes/expenses.ts`
2. **Service Method**: Extend `ExpenseStore.findExpenses()` with pagination support
3. **Validation**: Use Zod schema for query parameter validation
4. **Error Handling**: Use central error middleware for consistent error responses
5. **OpenAPI Update**: Update `api/spec/openapi.yaml` GET /expenses 200 response schema

