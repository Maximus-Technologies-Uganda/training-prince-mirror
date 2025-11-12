# Contract: POST /expenses Endpoint

**Feature**: Week 5 Day 2: API Skeleton, Validation & Errors  
**Scope**: POST /expenses endpoint with validation and error handling  
**Date**: 2025-01-27

---

## Contract Definition

### Input
- HTTP POST request to `/expenses`
- Request body (JSON):
  ```json
  {
    "amount": 25.50,
    "category": "food",
    "date": "2025-11-05"
  }
  ```
- Optional header:
  - `request-id`: string (for request correlation)

### Output
- **Success (201 Created)**: Created expense with server-assigned UUID
  ```json
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 25.50,
    "category": "food",
    "date": "2025-11-05"
  }
  ```
- **Error (400 Bad Request)**: Validation failed
  ```json
  {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "amount",
        "message": "amount must be greater than 0",
        "value": -10
      },
      {
        "field": "date",
        "message": "date must be in YYYY-MM-DD format (received: 11/05/2025)",
        "value": "11/05/2025"
      }
    ],
    "requestId": "550e8400-e29b-41d4-a716-446655440000"
  }
  ```
- **Error (422 Unprocessable Entity)**: Business rule violation
  ```json
  {
    "code": "BUSINESS_RULE_VIOLATION",
    "message": "Expense violates business rules",
    "details": {
      "reason": "Expense date cannot be in the future"
    },
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
1. **Required Fields**:
   - `amount`: number, must be > 0 (exclusiveMinimum: 0)
   - `category`: string, must be non-empty (minLength: 1)
   - `date`: string, must match pattern `^\d{4}-\d{2}-\d{2}$` (YYYY-MM-DD format)

2. **Validation Error Format**:
   - Must return ErrorEnvelope with `code: "VALIDATION_ERROR"`
   - `details` must be array of `{ field, message, value }` objects
   - `value` must contain the actual invalid value that was rejected (per spec FR-012)

3. **Response Format**:
   - Success: 201 Created with Expense object containing server-assigned UUID
   - Error: 400 Bad Request with ErrorEnvelope containing validation details

4. **Request-ID Header**:
   - If provided, must be echoed in error responses

### Failure Conditions
- **ERROR**: Missing required field → 400 Bad Request with validation error
- **ERROR**: Invalid `amount` (≤ 0) → 400 Bad Request with validation error
- **ERROR**: Invalid `category` (empty string) → 400 Bad Request with validation error
- **ERROR**: Invalid `date` format (not YYYY-MM-DD) → 400 Bad Request with validation error
- **ERROR**: Multiple validation errors → 400 Bad Request with all errors in details array
- **ERROR**: Business rule violation → 422 Unprocessable Entity with ErrorEnvelope
- **ERROR**: Server error → 500 Internal Server Error with generic error (no internal details)

### Success Criteria
- ✅ Returns 201 Created with created expense (server-assigned UUID)
- ✅ Response structure matches Expense schema
- ✅ Validation errors return 400 with ErrorEnvelope containing all validation failures
- ✅ Invalid values included in error details (per spec FR-012)
- ✅ Request-id header echoed in error responses
- ✅ All validation errors include field name, message, and invalid value

### OpenAPI Specification
- Endpoint: `POST /expenses`
- Request body schema: `CreateExpenseRequest`
- Response schema: `Expense` (201 Created)
- Error responses: `ErrorEnvelope` (400, 422, 500)

---

## Implementation Notes

1. **Route Handler**: Already exists in `api/src/routes/expenses.ts`, may need updates for error handling
2. **Validation Middleware**: Use existing `validateExpenseBody(CreateExpenseSchema)` middleware
3. **Error Format**: Map Zod validation errors to ErrorEnvelope format with invalid values
4. **Service Method**: Use existing `ExpenseStore.create()` method
5. **Error Handling**: Use central error middleware for consistent error responses

