# Contract: OpenAPI Specification for Expenses API

**Feature**: Week 5 Day 1: API Spec & Contracts First (Expenses)  
**Scope**: Complete OpenAPI 3.1.x specification for expenses resource  
**Date**: 2025-11-06

---

## Contract Definition

### Input
- Feature specification requirements (FR-001 to FR-008)
- Existing `api/spec/openapi.yaml` (partial spec with POST /expenses and GET /expenses/summary)
- Research findings on pagination, error envelope, request-id header

### Output
- `/specs/core/openapi.yaml` - Complete OpenAPI 3.1.x specification
- Updated `api/spec/openapi.yaml` - Synchronized with core spec

### Validation Rules

1. **OpenAPI Version**: Must be OpenAPI 3.1.x (FR-001)
2. **Expense Endpoints**: Must define:
   - GET /expenses with pagination (FR-002)
   - POST /expenses with request body schema (FR-003)
   - GET /expenses/summary with query parameters (FR-004)
3. **Error Envelope**: Must define shared ErrorEnvelope schema referenced by all error responses (FR-005)
4. **Request-ID Header**: Must define request-id header support (FR-006)
5. **Spec Validation**: Must pass spec-check CI validation (FR-007)
6. **Examples**: Must include example request/response payloads for each endpoint (FR-008)

### Endpoint Specifications

#### GET /expenses
- **Pagination**: Query parameters `page` (integer, default: 1, min: 1) and `pageSize` (integer, default: 20, min: 1, max: 100)
- **Response**: 200 OK with array of Expense objects
- **Error Responses**: 400 (Bad Request), 500 (Internal Server Error) using ErrorEnvelope
- **Headers**: Optional `request-id` header

#### POST /expenses
- **Request Body**: CreateExpenseRequest schema (amount, category required; description, date optional per clarifications)
- **Response**: 201 Created with Expense object (includes server-assigned UUID)
- **Error Responses**: 400 (Validation Error), 422 (Unprocessable Entity), 500 (Internal Server Error) using ErrorEnvelope
- **Headers**: Optional `request-id` header

#### GET /expenses/summary
- **Query Parameters**: Optional `category` (string) and `month` (string, YYYY-MM format)
- **Response**: 200 OK with ExpenseSummary object
- **Error Responses**: 400 (Bad Request), 500 (Internal Server Error) using ErrorEnvelope
- **Headers**: Optional `request-id` header

### Schema Definitions

#### ErrorEnvelope (Shared)
```yaml
ErrorEnvelope:
  type: object
  required:
    - code
    - message
  properties:
    code:
      type: string
      description: Machine-readable error code
      example: "VALIDATION_ERROR"
    message:
      type: string
      description: Human-readable error message
      example: "Validation failed"
    details:
      oneOf:
        - type: array
          items:
            type: object
            properties:
              field: { type: string }
              message: { type: string }
        - type: object
          description: Additional error context
    requestId:
      type: string
      description: Request correlation ID (echoed from request-id header)
      example: "550e8400-e29b-41d4-a716-446655440000"
```

#### Expense
```yaml
Expense:
  type: object
  required:
    - id
    - amount
    - category
    - date
  properties:
    id:
      type: string
      format: uuid
      description: Unique expense identifier (server-assigned)
    amount:
      type: number
      exclusiveMinimum: 0
      description: Expense amount (must be positive)
    category:
      type: string
      minLength: 1
      description: Expense category
    date:
      type: string
      format: date
      pattern: '^\d{4}-\d{2}-\d{2}$'
      description: Expense date (YYYY-MM-DD)
    description:
      type: string
      description: Optional expense description
```

### Failure Conditions
- **ERROR**: OpenAPI spec syntax invalid → spec-check CI fails
- **ERROR**: Missing required endpoints → Contract incomplete
- **ERROR**: Error Envelope not shared → Inconsistent error responses
- **ERROR**: Missing request-id header definition → FR-006 not satisfied

### Success Criteria
- ✅ OpenAPI 3.1.x specification file exists at `/specs/core/openapi.yaml`
- ✅ All three expense endpoints defined with complete schemas
- ✅ Shared ErrorEnvelope schema defined and referenced
- ✅ Request-id header defined for all endpoints
- ✅ Example request/response payloads included
- ✅ spec-check CI job passes validation

---

## Related Contracts
- `contract-tests.contract.md`: Contract tests validate this spec
- `spec-check-ci.contract.md`: CI job validates spec correctness


