# Data Model: Week 5 Day 2: API Skeleton, Validation & Errors

**Feature**: Week 5 Day 2: API Skeleton, Validation & Errors  
**Date**: 2025-01-27

---

## Overview

This data model defines the entities, types, and relationships for the expenses API endpoints, including pagination, validation, and error handling structures.

---

## Entities

### 1. Expense Record

**Entity**: `Expense`  
**Purpose**: Represents a single expense entry with required and optional attributes

**Fields**:
- `id`: string (UUID v4, required, auto-assigned by server)
- `amount`: number (required, must be > 0)
- `category`: string (required, non-empty string)
- `date`: string (required, ISO 8601 format YYYY-MM-DD)
- `description`: string (optional, not in current schema but mentioned in spec)

**Validation Rules**:
- `amount` must be positive (> 0, exclusiveMinimum)
- `category` must be non-empty string (minLength: 1)
- `date` must match pattern `^\d{4}-\d{2}-\d{2}$` (YYYY-MM-DD format)
- `id` is auto-generated UUID v4 by server (not provided by client)

**Relationships**:
- Stored in `ExpenseStore` (in-memory repository)
- Referenced by `ExpenseSummary` (aggregated view)
- Part of `PaginatedExpenseResponse.data` array

**State Transitions**:
- Created via POST /expenses → `Expense` with server-assigned UUID
- Retrieved via GET /expenses → Returns `Expense` objects in paginated response
- Aggregated via GET /expenses/summary → Included in summary totals

---

### 2. Paginated Expense Response

**Entity**: `PaginatedExpenseResponse`  
**Purpose**: Wrapped response structure for GET /expenses endpoint with pagination metadata

**Fields**:
- `data`: Expense[] (required, array of expense records)
- `pagination`: PaginationMetadata (required, pagination information)

**Validation Rules**:
- `data` must be an array (can be empty)
- `pagination` must contain all required fields (totalItems, currentPage, pageSize, totalPages)

**Relationships**:
- Contains multiple `Expense` entities in `data` array
- Contains one `PaginationMetadata` entity

---

### 3. Pagination Metadata

**Entity**: `PaginationMetadata`  
**Purpose**: Metadata about pagination state for GET /expenses response

**Fields**:
- `totalItems`: number (required, total count of expenses matching query, ≥ 0)
- `currentPage`: number (required, current page number, ≥ 1)
- `pageSize`: number (required, number of items per page, 1-100)
- `totalPages`: number (required, total number of pages, ≥ 0, calculated as `Math.ceil(totalItems / pageSize)`)

**Validation Rules**:
- `totalItems` must be non-negative integer
- `currentPage` must be ≥ 1
- `pageSize` must be between 1 and 100 (inclusive)
- `totalPages` must be calculated correctly: `Math.ceil(totalItems / pageSize)`

**Relationships**:
- Part of `PaginatedExpenseResponse.pagination`

**State Transitions**:
- Calculated when GET /expenses is called with pagination parameters
- Default values: page=1, pageSize=20 (if not provided)

---

### 4. Expense Summary

**Entity**: `ExpenseSummary`  
**Purpose**: Aggregated expense data with optional filters applied

**Fields**:
- `total`: number (required, sum of expense amounts matching filters, ≥ 0)
- `count`: number (required, number of expenses matching filters, ≥ 0)
- `filters`: ExpenseSummaryFilters (required, filters applied to generate summary)

**Validation Rules**:
- `total` must be non-negative number
- `count` must be non-negative integer
- `filters` must be object (can be empty if no filters applied)

**Relationships**:
- Aggregates multiple `Expense` entities
- Contains one `ExpenseSummaryFilters` entity

**State Transitions**:
- Generated when GET /expenses/summary is called
- Filters applied: category (optional), month (optional, YYYY-MM format)
- Always returns 200 OK even if no expenses match (total=0, count=0)

---

### 5. Expense Summary Filters

**Entity**: `ExpenseSummaryFilters`  
**Purpose**: Filters applied to expense summary query

**Fields**:
- `category`: string (optional, case-sensitive category filter)
- `month`: string (optional, month filter in YYYY-MM format, pattern `^\d{4}-\d{2}$`)

**Validation Rules**:
- `category` must be non-empty string if provided
- `month` must match pattern `^\d{4}-\d{2}$` if provided (YYYY-MM format)
- Both fields optional (can be empty object if no filters)

**Relationships**:
- Part of `ExpenseSummary.filters`

---

### 6. Error Envelope

**Entity**: `ErrorEnvelope`  
**Purpose**: Standardized error response format used across all endpoints

**Fields**:
- `code`: string (required, machine-readable error code, e.g., "VALIDATION_ERROR", "NOT_FOUND", "INTERNAL_ERROR")
- `message`: string (required, human-readable error message)
- `details`: array | object (optional, structured error details)
  - For validation errors: array of `{ field: string, message: string, value?: any }`
  - For other errors: object with additional context
- `requestId`: string (optional, request correlation ID echoed from request-id header)

**Validation Rules**:
- `code` must be non-empty string
- `message` must be non-empty string
- `details` format depends on error type:
  - Validation errors: array of field-specific errors with `field`, `message`, and `value` (invalid value that was rejected)
  - Other errors: object or omitted
- `requestId` must match request-id header value if provided

**Relationships**:
- Returned by error middleware for all error responses
- Referenced by all endpoints for error responses (400, 404, 422, 429, 500)

**State Transitions**:
- Created when validation fails → 400 Bad Request with validation error details
- Created when resource not found → 404 Not Found
- Created when business rule violation → 422 Unprocessable Entity
- Created when rate limit exceeded → 429 Too Many Requests
- Created when server error occurs → 500 Internal Server Error (no internal details exposed)

---

### 7. Expense Store (Repository)

**Entity**: `ExpenseStore`  
**Purpose**: In-memory data repository for expense records

**Fields**:
- `expenses`: Expense[] (private, array of expense records stored in memory)

**Methods**:
- `create(request: CreateExpenseRequest): Expense` - Creates new expense with UUID, stores in memory
- `getAll(): Expense[]` - Returns copy of all expenses
- `filter(category?: string, month?: string): Expense[]` - Filters expenses by category and/or month
- `findExpenses(filters?: { category?: string, month?: string }, pagination?: { page: number, pageSize: number }): PaginatedExpenseResponse` - Returns paginated expenses with metadata
- `summarize(filters?: { category?: string, month?: string }): ExpenseSummary` - Returns aggregated summary with filters
- `clear(): void` - Clears all expenses (utility for testing)

**Validation Rules**:
- Expenses persist in memory for duration of server session
- Data lost on server restart (intentional for Day 2)
- No explicit maximum limit (relies on Node.js memory constraints)
- Repository starts empty (no seed data)

**Relationships**:
- Stores multiple `Expense` entities
- Used by expense route handlers for data operations

**State Transitions**:
- Initialized empty on server start
- Expenses added via `create()` method
- Expenses retrieved via `findExpenses()` or `getAll()`
- Cleared via `clear()` (testing only)

---

## Type Definitions

### CreateExpenseRequest
```typescript
{
  amount: number;      // > 0, exclusiveMinimum
  category: string;    // minLength: 1
  date: string;        // YYYY-MM-DD format
}
```

### Expense
```typescript
{
  id: string;          // UUID v4
  amount: number;      // > 0
  category: string;    // non-empty
  date: string;        // YYYY-MM-DD
}
```

### PaginatedExpenseResponse
```typescript
{
  data: Expense[];
  pagination: {
    totalItems: number;    // ≥ 0
    currentPage: number;   // ≥ 1
    pageSize: number;      // 1-100
    totalPages: number;    // ≥ 0, calculated
  };
}
```

### ExpenseSummary
```typescript
{
  total: number;       // ≥ 0
  count: number;       // ≥ 0
  filters: {
    category?: string;
    month?: string;     // YYYY-MM format
  };
}
```

### ErrorEnvelope
```typescript
{
  code: string;        // e.g., "VALIDATION_ERROR"
  message: string;
  details?: Array<{
    field: string;
    message: string;
    value?: any;       // Invalid value that was rejected
  }> | object;
  requestId?: string;  // Echoed from request-id header
}
```

---

## Validation Rules Summary

### Request Validation
- POST /expenses: Validate `amount` (> 0), `category` (non-empty), `date` (YYYY-MM-DD format)
- GET /expenses: Validate `page` (≥ 1, default 1), `pageSize` (1-100, default 20)
- GET /expenses/summary: Validate `month` (YYYY-MM format if provided), `category` (non-empty if provided)

### Response Validation
- All error responses must match ErrorEnvelope schema
- GET /expenses must return PaginatedExpenseResponse (wrapped object with data and pagination)
- POST /expenses must return Expense with server-assigned UUID
- GET /expenses/summary must return ExpenseSummary with total, count, filters

### Error Handling
- Validation errors: 400 Bad Request with ErrorEnvelope containing validation details
- Not found errors: 404 Not Found with ErrorEnvelope
- Business rule violations: 422 Unprocessable Entity with ErrorEnvelope
- Server errors: 500 Internal Server Error with ErrorEnvelope (no internal details)

---

## Notes

1. **Pagination**: GET /expenses returns wrapped response with `data` and `pagination` properties, not a plain array (per spec FR-001a).

2. **Error Format**: All errors use ErrorEnvelope format. Validation errors include invalid values in `details` array (per spec FR-012).

3. **Request-ID**: Optional `request-id` header is echoed in error responses for correlation (per spec FR-005, FR-018).

4. **In-Memory Storage**: Repository is temporary, data lost on server restart. No seed data, starts empty.

5. **OpenAPI Spec Update**: GET /expenses response schema must be updated to reflect pagination metadata structure (per spec FR-004a, FR-024).

