# Research: Week 5 Day 2: API Skeleton, Validation & Errors

**Feature**: Week 5 Day 2: API Skeleton, Validation & Errors  
**Date**: 2025-01-27

---

## Overview

This research consolidates findings for implementing the API skeleton for expenses endpoints, including pagination, validation, error handling, and in-memory data storage. All clarifications from the spec have been resolved, and technical decisions are based on existing project patterns.

---

## Research Findings

### 1. Pagination Response Structure

**Decision**: GET /expenses endpoint will return a wrapped object with `data` array and `pagination` object (per spec requirement FR-001a), even though OpenAPI spec currently shows array response.

**Rationale**: 
- Spec explicitly requires wrapped response: `{ data: Expense[], pagination: { totalItems, currentPage, pageSize, totalPages } }`
- This is more RESTful and provides better metadata
- OpenAPI spec must be updated to match (FR-004a, FR-024)

**Alternatives Considered**:
- Array response (as shown in current OpenAPI spec) - Rejected because spec explicitly requires wrapped structure
- Pagination in headers - Rejected because spec requires pagination metadata in response body

**Implementation Notes**:
- OpenAPI spec at `api/spec/openapi.yaml` needs update for GET /expenses 200 response schema
- Response structure: `{ data: Expense[], pagination: { totalItems: number, currentPage: number, pageSize: number, totalPages: number } }`
- Default pagination: page=1, pageSize=20 (per OpenAPI spec defaults)

---

### 2. Error Handling Middleware Pattern

**Decision**: Create central error middleware (`api/src/middleware/error-handler.ts`) that catches all errors and maps them to ErrorEnvelope format.

**Rationale**:
- Centralized error handling ensures consistent error responses across all endpoints
- Matches OpenAPI ErrorEnvelope schema: `{ code: string, message: string, details?: array|object, requestId?: string }`
- Handles validation errors (400), not found (404), unprocessable entity (422), rate limiting (429), server errors (500)
- Echoes request-id header in error responses for correlation

**Alternatives Considered**:
- Inline error handling in each route - Rejected because it violates DRY and risks inconsistent error formats
- Separate error handlers per route - Rejected because central middleware is simpler and more maintainable

**Implementation Notes**:
- Middleware must be registered after all routes (Express error middleware pattern)
- Must catch Zod validation errors and map to ErrorEnvelope format
- Must extract request-id header and include in error responses
- Must not expose internal error details (stack traces) to clients

---

### 3. Validation Strategy

**Decision**: Use existing Zod validation middleware (`validateExpenseBody`) for POST /expenses, extend for query parameter validation (pagination, summary filters).

**Rationale**:
- Zod is already in use and proven in the codebase
- Existing `validateExpenseBody` middleware returns expense-specific error format: `{ errors: [{ field, message }] }`
- Need to map Zod errors to ErrorEnvelope format for consistency
- Query parameter validation can use Zod schemas with `.query()` method

**Alternatives Considered**:
- Manual validation - Rejected because Zod provides type safety and better error messages
- Different validation library - Rejected because Zod is already established in the project

**Implementation Notes**:
- POST /expenses: Use existing `CreateExpenseSchema` with `validateExpenseBody` middleware
- GET /expenses: Validate query parameters (page, pageSize) with Zod, return ErrorEnvelope on validation failure
- GET /expenses/summary: Validate query parameters (category, month) with Zod
- Error format: Map validation errors to ErrorEnvelope `{ code: "VALIDATION_ERROR", message: "...", details: [{ field, message, value }] }`
- Must include invalid values in error details (per spec FR-012)

---

### 4. In-Memory Data Repository

**Decision**: Extend existing `ExpenseStore` class (`api/src/services/expenses.ts`) with pagination support. Repository starts empty (no seed data).

**Rationale**:
- `ExpenseStore` already exists with `create()`, `getAll()`, `filter()`, `summarize()` methods
- Need to add `findExpenses(filters, pagination)` method that returns paginated results
- In-memory storage is temporary for Day 2 (per spec clarifications)
- No seed data required (tests create their own data)

**Alternatives Considered**:
- Create new repository - Rejected because existing `ExpenseStore` is well-structured and can be extended
- Add seed data - Rejected because spec clarification states repository starts empty

**Implementation Notes**:
- Add `findExpenses(filters?: { category?: string, month?: string }, pagination?: { page: number, pageSize: number })` method
- Return paginated results with metadata: `{ data: Expense[], pagination: { totalItems, currentPage, pageSize, totalPages } }`
- Default pagination: page=1, pageSize=20
- Calculate totalPages: `Math.ceil(totalItems / pageSize)`
- Handle empty repository: return `{ data: [], pagination: { totalItems: 0, currentPage: 1, pageSize: 20, totalPages: 0 } }`

---

### 5. GET /expenses Endpoint Implementation

**Decision**: Implement GET /expenses route handler in `api/src/routes/expenses.ts` that uses `ExpenseStore.findExpenses()` with pagination support.

**Rationale**:
- Route handler already exists for POST /expenses and GET /expenses/summary
- Need to add GET /expenses handler that extracts query parameters, validates them, calls service, returns wrapped response
- Must validate pagination parameters (page ≥ 1, pageSize between 1-100) and return 400 with ErrorEnvelope if invalid

**Alternatives Considered**:
- Separate route file - Rejected because all expense routes belong together in `expenses.ts`
- No validation - Rejected because spec requires validation of pagination parameters

**Implementation Notes**:
- Extract query parameters: `page` (default 1), `pageSize` (default 20)
- Validate with Zod schema: `page >= 1`, `pageSize >= 1 && pageSize <= 100`
- Call `expenseStore.findExpenses(undefined, { page, pageSize })` (no filters for GET /expenses)
- Return 200 with wrapped response: `{ data: Expense[], pagination: {...} }`
- Handle request-id header (echo in error responses)

---

### 6. Error Envelope Format Consistency

**Decision**: All error responses must match OpenAPI ErrorEnvelope schema: `{ code: string, message: string, details?: array|object, requestId?: string }`.

**Rationale**:
- OpenAPI spec defines ErrorEnvelope as standard error format
- Spec requires consistent error responses (FR-016, FR-017)
- Validation errors use `details` as array: `[{ field, message, value }]`
- Server errors use `details` as object or omit it

**Alternatives Considered**:
- Different error formats per endpoint - Rejected because spec requires consistency
- No requestId in errors - Rejected because spec requires echoing request-id header

**Implementation Notes**:
- Validation errors: `{ code: "VALIDATION_ERROR", message: "Validation failed", details: [{ field, message, value }], requestId?: string }`
- Not found errors: `{ code: "NOT_FOUND", message: "...", requestId?: string }`
- Server errors: `{ code: "INTERNAL_ERROR", message: "An unexpected error occurred", requestId?: string }` (no internal details exposed)
- Extract request-id header: `req.headers['request-id']` or `req.get('request-id')`

---

### 7. OpenAPI Specification Update

**Decision**: Update `api/spec/openapi.yaml` to reflect pagination metadata structure (wrapped object with `data` and `pagination` properties) for GET /expenses endpoint.

**Rationale**:
- Spec requires OpenAPI spec update (FR-004a, FR-024)
- Current spec shows array response, but implementation must return wrapped object
- Spec-check CI job validates OpenAPI spec, so update must be valid

**Alternatives Considered**:
- Keep array response - Rejected because spec explicitly requires wrapped structure
- Skip spec update - Rejected because spec requires it (FR-024)

**Implementation Notes**:
- Update GET /expenses 200 response schema from `array` to object with `data` (array) and `pagination` (object) properties
- Define pagination schema in components/schemas
- Ensure spec remains valid (passes spec-check CI job)

---

## Summary

All technical decisions are based on existing project patterns (Express, Zod, Vitest) and spec requirements. No new dependencies or tools required. Implementation extends existing code structure (ExpenseStore, routes, middleware) rather than creating new patterns. All clarifications from spec have been resolved, and no NEEDS CLARIFICATION items remain.

