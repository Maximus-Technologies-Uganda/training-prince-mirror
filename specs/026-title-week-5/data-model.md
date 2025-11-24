# Data Model: Week 5 Day 1 - Expenses API

**Date**: 2025-11-06  
**Feature**: Week 5 Day 1: API Spec & Contracts First (Expenses)

## Entities

### Expense

**Description**: A single expense record with amount, category, date, and unique identifier.

**Fields**:
- `id` (string, UUID, required): Unique identifier assigned by server
- `amount` (number, required): Expense amount, must be > 0
- `category` (string, required): Expense category name, non-empty string
- `date` (string, date format YYYY-MM-DD, required): Expense date in ISO 8601 format
- `description` (string, optional): Additional expense description

**Validation Rules**:
- `amount` must be positive (> 0)
- `category` must be non-empty string (minLength: 1)
- `date` must match pattern `^\d{4}-\d{2}-\d{2}$`
- `id` must be valid UUID format (assigned by server)

**State Transitions**: N/A (spec-first, no implementation)

### ExpenseSummary

**Description**: Aggregated expense data with totals, count, and applied filters.

**Fields**:
- `total` (number, required): Sum of expense amounts matching filters, minimum 0
- `count` (integer, required): Number of expenses matching filters, minimum 0
- `filters` (object, required): Filters applied to generate summary
  - `category` (string, optional): Category filter applied
  - `month` (string, optional): Month filter in YYYY-MM format

**Validation Rules**:
- `total` must be non-negative (≥ 0)
- `count` must be non-negative integer (≥ 0)
- `filters.month` must match pattern `^\d{4}-\d{2}$` if present

**State Transitions**: N/A (spec-first, no implementation)

### ErrorEnvelope

**Description**: Standardized error response format used across all endpoints.

**Fields**:
- `code` (string, required): Machine-readable error code (e.g., "VALIDATION_ERROR", "NOT_FOUND")
- `message` (string, required): Human-readable error message
- `details` (object/array, optional): Additional error context
  - For validation errors: array of field-specific errors
  - For other errors: object with additional context
- `requestId` (string, optional): Request correlation ID (echoed from request-id header)

**Validation Rules**:
- `code` must be non-empty string
- `message` must be non-empty string
- `requestId` should be UUID format if provided

**HTTP Status Code Mapping**:
- 400 (Bad Request): Validation errors, invalid request format
- 404 (Not Found): Resource not found
- 422 (Unprocessable Entity): Business logic validation failures
- 429 (Too Many Requests): Rate limiting
- 500 (Internal Server Error): Server errors

## Request/Response Schemas

### GET /expenses Request

**Query Parameters**:
- `page` (integer, optional): Page number (1-indexed), default: 1, minimum: 1
- `pageSize` (integer, optional): Number of items per page, default: 20, minimum: 1, maximum: 100

**Headers**:
- `request-id` (string, optional): Client-provided request correlation ID

### GET /expenses Response

**Status**: 200 OK

**Body**: Array of Expense objects

**Pagination Metadata** (to be defined in OpenAPI spec):
- Total count, page number, page size (may be in headers or response body)

### POST /expenses Request

**Body**: 
- `amount` (number, required): Must be > 0
- `category` (string, required): Non-empty string
- `date` (string, required): YYYY-MM-DD format
- `description` (string, optional): Additional description

**Headers**:
- `request-id` (string, optional): Client-provided request correlation ID

### POST /expenses Response

**Status**: 201 Created

**Body**: Expense object with server-assigned `id`

**Error Responses**: 400 Bad Request (ErrorEnvelope with validation details)

### GET /expenses/summary Request

**Query Parameters**:
- `category` (string, optional): Filter by category name (case-sensitive)
- `month` (string, optional): Filter by month in YYYY-MM format

**Headers**:
- `request-id` (string, optional): Client-provided request correlation ID

### GET /expenses/summary Response

**Status**: 200 OK

**Body**: ExpenseSummary object

## Relationships

- Expense → ExpenseSummary: Many-to-one aggregation relationship
- ErrorEnvelope → All endpoints: Used by all error responses

## Notes

- This is a spec-first design. No database schema or persistence layer is defined yet.
- All validation rules are enforced at the API contract level (OpenAPI schema).
- Request-id header is optional but recommended for request correlation and debugging.


