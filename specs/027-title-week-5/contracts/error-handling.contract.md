# Contract: Error Handling Middleware

**Feature**: Week 5 Day 2: API Skeleton, Validation & Errors  
**Scope**: Central error handling middleware for standardized error responses  
**Date**: 2025-01-27

---

## Contract Definition

### Input
- Any error thrown during request processing (validation, not found, server errors)
- Request object with optional `request-id` header

### Output
- **Error Response**: Standardized ErrorEnvelope format
  ```json
  {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "amount",
        "message": "amount must be greater than 0",
        "value": -10
      }
    ],
    "requestId": "550e8400-e29b-41d4-a716-446655440000"
  }
  ```

### Error Types and Status Codes
1. **Validation Errors (400 Bad Request)**:
   - Code: `"VALIDATION_ERROR"`
   - Message: Descriptive validation error message
   - Details: Array of `{ field, message, value }` objects
   - Invalid values must be included in details (per spec FR-012)

2. **Not Found Errors (404 Not Found)**:
   - Code: `"NOT_FOUND"`
   - Message: Resource not found message
   - Details: Optional object with additional context

3. **Business Rule Violations (422 Unprocessable Entity)**:
   - Code: `"BUSINESS_RULE_VIOLATION"`
   - Message: Business rule violation message
   - Details: Object with reason or additional context

4. **Rate Limiting (429 Too Many Requests)**:
   - Code: `"RATE_LIMIT_EXCEEDED"`
   - Message: Rate limit exceeded message
   - Details: Optional object with retry information

5. **Server Errors (500 Internal Server Error)**:
   - Code: `"INTERNAL_ERROR"`
   - Message: Generic error message ("An unexpected error occurred")
   - Details: Omitted (no internal details exposed to clients)

### Validation Rules
1. **Error Envelope Structure**:
   - `code`: required string (machine-readable error code)
   - `message`: required string (human-readable error message)
   - `details`: optional array or object (structured error details)
   - `requestId`: optional string (echoed from request-id header)

2. **Request-ID Header**:
   - Extract from `req.headers['request-id']` or `req.get('request-id')`
   - Include in error response if provided
   - Used for request correlation in logs and error responses

3. **Error Mapping**:
   - Zod validation errors → 400 Bad Request with validation details
   - Not found errors → 404 Not Found
   - Business rule violations → 422 Unprocessable Entity
   - Rate limit errors → 429 Too Many Requests
   - Unexpected errors → 500 Internal Server Error (generic message)

4. **Security**:
   - Do not expose internal error details (stack traces, file paths, etc.)
   - Server errors return generic message only
   - Validation errors include only field-level details, not internal state

### Failure Conditions
- **ERROR**: Error middleware not registered → Errors not caught, Express default error handler used
- **ERROR**: Error middleware registered before routes → Errors not caught from route handlers
- **ERROR**: Internal details exposed → Security risk, violates spec FR-019

### Success Criteria
- ✅ All errors caught and mapped to ErrorEnvelope format
- ✅ Appropriate HTTP status codes returned (400, 404, 422, 429, 500)
- ✅ Request-id header echoed in error responses when provided
- ✅ Validation errors include invalid values in details
- ✅ Server errors return generic message (no internal details exposed)
- ✅ Error responses match OpenAPI ErrorEnvelope schema

### OpenAPI Specification
- Error response schema: `ErrorEnvelope` (defined in components/schemas)
- Used by all endpoints for error responses (400, 404, 422, 429, 500)

---

## Implementation Notes

1. **Middleware Location**: Create `api/src/middleware/error-handler.ts`
2. **Registration**: Register after all routes in `api/src/server.ts` (Express error middleware pattern)
3. **Error Mapping**: Map different error types to appropriate status codes and ErrorEnvelope format
4. **Zod Integration**: Catch Zod validation errors and format as ErrorEnvelope with validation details
5. **Request-ID Extraction**: Extract from request headers and include in error responses
6. **Security**: Ensure no internal error details (stack traces) are exposed to clients

---

## Error Handling Flow

```
Request → Route Handler → Service Layer
                              ↓
                         Error Thrown
                              ↓
                    Error Middleware Catches
                              ↓
                    Map to ErrorEnvelope
                              ↓
                    Extract request-id header
                              ↓
                    Return Error Response
                    (400/404/422/429/500)
```

