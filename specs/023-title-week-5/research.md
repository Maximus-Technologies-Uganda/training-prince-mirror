# Phase 0 Research: Week 5 Expense API Endpoints

**Branch**: `023-title-week-5` | **Date**: November 5, 2025  
**Status**: Complete | **All NEEDS CLARIFICATION resolved**

---

## Research Overview

This document captures research findings for implementing the POST /expenses and GET /expenses/summary MVP endpoints, addressing unknowns in the technical context.

---

## 1. Express + Zod Validation Pattern for Expense Endpoints

### Decision
Use **Express + Zod** for request/response validation, following existing patterns in `api/src/routes/convert.ts` and `api/src/schemas/index.ts`.

### Rationale
- Zod provides runtime schema validation with TypeScript integration
- Express middleware pattern enables reusable validation across endpoints
- Existing project already uses this stack; adding new endpoints maintains consistency
- Type-safe request bodies reduce runtime bugs

### Findings
- **Existing validation pattern**: `api/src/middleware/validation.ts` already handles validation
- **Expense schema requirements**: 
  - `amount`: Positive number (> 0, reject 0 and negative)
  - `category`: Non-empty string
  - `date`: ISO 8601 date (YYYY-MM-DD format)
- **Request structure**: `{ amount: number, category: string, date: string }`
- **Response structure**: `{ id: string, amount: number, category: string, date: string }`

### Implementation Approach
1. Define Zod schema in `api/src/schemas/index.ts` with `.positive()` for amount
2. Use existing validation middleware pattern
3. Leverage Zod's descriptive error messages for validation failures

---

## 2. In-Memory Storage for MVP (Session-Based)

### Decision
Use **in-memory array** to store expenses for the duration of the server session.

### Rationale
- MVP scope: no persistent storage requirement specified
- Simplifies testing and deployment
- Aligns with spec clarification: correctness prioritized over scalability
- Easy to refactor to database later (service layer abstraction)

### Findings
- **Storage pattern**: Global or Express app context variable
- **Best practice**: Encapsulate in a service module (e.g., `ExpenseStore` class) for testability
- **Unique ID generation**: Use `crypto.randomUUID()` (Node.js built-in) or `nanoid` (already in project dependencies)
- **Data persistence**: Array is reset when server restarts (acceptable for MVP)

### Implementation Approach
1. Create `ExpenseStore` service class in `api/src/services/expenses.ts`
2. Store instances in memory with auto-incrementing or UUID-based IDs
3. Provide methods: `create(expense)`, `getAll()`, `filter(category, month)`
4. Make store injectable for testing (pass to routes or use singleton pattern)

---

## 3. Aggregation & Filtering Logic

### Decision
Implement aggregation with support for **category** and **month** filters independently and in combination.

### Rationale
- Spec requires dual filters (category + month) to work independently and combined
- Aggregation = sum of amounts + count of matching records
- Filtering before aggregation ensures accurate results
- Simple array operations are sufficient for MVP scale

### Findings
- **Filter combinations**:
  - No filters: sum all expenses
  - Category filter: sum expenses where category matches
  - Month filter: sum expenses where date matches YYYY-MM prefix
  - Both: sum expenses matching both conditions (AND logic)
- **Empty result handling**: Return `{ total: 0, count: 0, filters: {...} }` per spec
- **Date parsing**: JavaScript `Date` object or date library (e.g., `date-fns`) for month extraction
- **Date format validation**: ISO 8601 (YYYY-MM-DD) must be validated on input

### Implementation Approach
1. Define `Expense` interface in `api/src/types/index.ts`
2. Implement `summarize(expenses[], filters)` method in service
3. Use filter array then reduce for aggregation
4. Return summary: `{ total, count, filters }`

---

## 4. Test Coverage Strategy (≥80% for Units, ≥70% Integration)

### Decision
Implement **three test layers** following existing project pattern:

1. **Contract tests** (`tests/contract/expenses.contract.test.ts`): Schema validation
2. **Integration tests** (`tests/integration/expenses.test.ts`): Full endpoint flows
3. **Unit tests** (`tests/unit/expenses.test.ts`): Service logic (aggregation, filtering)

### Rationale
- Contract tests ensure request/response match OpenAPI spec
- Integration tests validate end-to-end behavior
- Unit tests achieve high coverage for business logic
- Existing test infrastructure (Vitest + Supertest) supports this

### Findings
- **Vitest coverage reporting**: `npm run test:coverage` generates lcov reports
- **Supertest pattern**: Available for HTTP testing (existing in `tests/integration/convert.test.ts`)
- **Coverage thresholds**: Spec requires ≥80% statements for units, ≥70% overall
- **Test organization**: 
  - Contract: validate request schemas, response schemas, status codes
  - Integration: POST success, POST validation errors, GET no filters, GET with category, GET with month, GET with both filters
  - Unit: summarize logic, filter combinations, edge cases (empty arrays, zero amounts)

### Implementation Approach
1. Create contract test file with schema assertions
2. Create integration test file with Supertest HTTP tests
3. Create unit test file for service methods
4. Use `.only()` during development, ensure all tests run before commit
5. Run `npm run test:coverage` to verify ≥80% coverage

---

## 5. OpenAPI Specification Documentation

### Decision
Document both endpoints in **OpenAPI 3.0.0** spec, added to existing `api/spec/openapi.yaml`.

### Rationale
- Existing project uses OpenAPI/Swagger for API documentation
- Spec requirement (FR-018, FR-019): document endpoints with request/response schemas
- Enables API documentation tools (Swagger UI) and code generation

### Findings
- **Current spec location**: `api/spec/openapi.yaml`
- **Existing examples**: `paths.convert` shows POST pattern
- **Required sections**:
  - POST /expenses: requestBody with schema, 201/400 responses
  - GET /expenses/summary: query parameters (category, month), 200 response
  - Both: `x-code-samples` for documentation

### Implementation Approach
1. Add `/expenses` POST endpoint to OpenAPI spec
2. Add `/expenses/summary` GET endpoint to OpenAPI spec
3. Include request schemas, response schemas, query parameters
4. Document error responses (400 for validation)

---

## 6. Error Message Clarity & Validation

### Decision
Use **Zod's built-in error messages** with custom refinements for specific validation failures.

### Rationale
- Spec clarification: descriptive error messages showing expected format and received value
- Zod messages are developer-friendly by default
- Customization via `.refine()` or `.superRefine()` for domain-specific messages

### Findings
- **Zod error format**: Returns array of validation issues with `path`, `message`, `code`
- **Custom messages**: Use `.refine((val) => condition, "message")` for field-level validation
- **Amount validation**: `.positive()` provides message "Number must be greater than 0"
- **Date validation**: Use `.regex()` or custom refine for ISO 8601 validation
- **HTTP response format**: 
  ```json
  {
    "errors": [
      { "field": "amount", "message": "Amount must be greater than 0" },
      { "field": "date", "message": "Date must be in YYYY-MM-DD format (received: invalid-date)" }
    ]
  }
  ```

### Implementation Approach
1. Define Zod schemas with `.refine()` for custom validations
2. Extract validation errors in middleware
3. Return 400 with standardized error structure
4. Include expected format and received value in messages

---

## 7. ID Generation Strategy

### Decision
Use **`crypto.randomUUID()`** for unique expense IDs.

### Rationale
- Node.js built-in (no external dependency)
- Guarantees global uniqueness (UUID v4)
- Better for distributed systems than auto-increment
- Project already uses `nanoid` as fallback if needed

### Findings
- **UUID v4**: 36-character string format (e.g., `550e8400-e29b-41d4-a716-446655440000`)
- **Collision probability**: Negligible for MVP scale
- **Performance**: Negligible overhead for MVP
- **Testing**: Easy to mock with Jest/Vitest

### Implementation Approach
1. Use `crypto.randomUUID()` in `ExpenseStore.create()` method
2. Assign ID before adding to array
3. Mock in tests using `vi.spyOn(crypto, 'randomUUID')`

---

## 8. Date Handling & Month Filtering

### Decision
Use **ISO 8601 date strings (YYYY-MM-DD)** stored as strings; extract month with string prefix matching.

### Rationale
- Spec requires YYYY-MM format for month filter
- Storing dates as strings simplifies testing and serialization
- Month filtering via string prefix is efficient for MVP
- Avoids timezone issues with Date objects

### Findings
- **Date format**: ISO 8601 YYYY-MM-DD (JavaScript native `Date.toISOString().split('T')[0]`)
- **Month extraction**: Split date string and take first 7 chars (YYYY-MM)
- **Validation**: Regex `/^\d{4}-\d{2}-\d{2}$/` plus Date parsing to ensure valid date
- **Edge case**: Filter by month with no matching expenses → return `{ total: 0, count: 0 }`

### Implementation Approach
1. Store expense dates as ISO 8601 strings
2. Validate dates with Zod using `.regex()` and custom refine for valid dates
3. Extract month from dates using `date.substring(0, 7)`
4. Filter using month prefix matching

---

## 9. Integration with Existing API Architecture

### Decision
Follow existing patterns in `api/src/routes/convert.ts` and `api/src/services/converter.ts`.

### Rationale
- Consistency reduces cognitive load for future maintainers
- Leverages existing middleware (logging, error handling)
- Simplifies CI/CD integration (no new patterns to document)

### Findings
- **Route pattern**: Export route factory function, import in `server.ts`
- **Middleware stack**: Request → Validation → Route handler → Response
- **Error handling**: 400 for validation, 500 for server errors
- **Logging**: Pino logger already integrated
- **Testing**: Supertest for HTTP testing with port binding

### Implementation Approach
1. Create `api/src/routes/expenses.ts` following `convert.ts` pattern
2. Create `api/src/services/expenses.ts` for business logic
3. Update `api/src/schemas/index.ts` with Expense schemas
4. Update `api/src/types/index.ts` with Expense interface
5. Import route in `api/src/server.ts` app.use()
6. Follow existing error handling middleware

---

## Summary: All Unknowns Resolved

| Unknown | Decision | Source |
|---------|----------|--------|
| Request validation | Zod + Express middleware | Existing pattern |
| Storage | In-memory array | Spec scope |
| Aggregation logic | Array filter + reduce | Spec requirements |
| Test coverage strategy | 3-layer (contract/integration/unit) | Constitution II + Spec FR-014 |
| OpenAPI spec | Document in existing spec file | Spec FR-018 |
| Error messages | Zod + custom refine | Spec clarification |
| ID generation | crypto.randomUUID() | Node.js built-in |
| Date handling | ISO 8601 strings + month prefix filter | Spec format |
| Architecture | Follow existing patterns | Project consistency |

**Status**: ✅ Phase 0 Complete - No NEEDS CLARIFICATION remain

---

*Based on Constitution v1.1.0 and Specification 023-title-week-5*

