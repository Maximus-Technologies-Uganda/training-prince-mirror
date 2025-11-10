# Implementation Tasks: Week 5 Day 2: API Skeleton, Validation & Errors

**Feature**: Week 5 Day 2: API Skeleton, Validation & Errors  
**Branch**: `027-title-week-5`  
**Date**: 2025-01-27

---

## Task Phases

### Phase 1: Setup & Core Infrastructure
- [x] T001: Create error handling middleware
- [x] T002: Add pagination types to types/index.ts
- [x] T003: Add pagination query validation schema

### Phase 2: Service Layer Extensions
- [x] T004: Extend ExpenseStore with findExpenses() method for pagination

### Phase 3: Route Handlers
- [x] T005: Implement GET /expenses route handler with pagination
- [x] T006: Update POST /expenses to use error middleware
- [x] T007: Update GET /expenses/summary to use error middleware and validate query params

### Phase 4: Integration & Configuration
- [x] T008: Register error middleware in server.ts after all routes
- [x] T009: Update OpenAPI spec for GET /expenses to reflect pagination metadata structure

### Phase 5: Testing & Validation
- [x] T010: Add unit tests for error middleware
- [x] T011: Add unit tests for pagination logic in ExpenseStore
- [x] T012: Update contract tests to expect correct response structures
- [x] T013: Write unit tests for validation middleware (FR-021)
- [x] T014: Verify `Test & Coverage - API` job passes with ≥ 60% coverage (FR-023)
- [x] T015: Verify `spec-check` and `CodeQL` CI jobs are green (FR-025, FR-026)

---

## Task Details

### T001: Create error handling middleware
**File**: `api/src/middleware/error-handler.ts`  
**Description**: Create central error middleware that catches all errors and maps them to ErrorEnvelope format. Must handle validation errors (400), not found (404), business rule violations (422), rate limiting (429), and server errors (500). Must extract request-id header and include in error responses.

**Dependencies**: None  
**Parallel**: No

### T002: Add pagination types to types/index.ts
**File**: `api/src/types/index.ts`  
**Description**: Add PaginatedExpenseResponse and PaginationMetadata interfaces to support paginated GET /expenses responses.

**Dependencies**: None  
**Parallel**: [P] Can run in parallel with T001

### T003: Add pagination query validation schema
**File**: `api/src/schemas/index.ts`  
**Description**: Add Zod schema for validating pagination query parameters (page ≥ 1, pageSize 1-100).

**Dependencies**: None  
**Parallel**: [P] Can run in parallel with T001, T002

### T004: Extend ExpenseStore with findExpenses() method
**File**: `api/src/services/expenses.ts`  
**Description**: Add findExpenses() method that accepts filters and pagination parameters, returns PaginatedExpenseResponse with data array and pagination metadata.

**Dependencies**: T002 (needs pagination types)  
**Parallel**: No

### T005: Implement GET /expenses route handler
**File**: `api/src/routes/expenses.ts`  
**Description**: Add GET /expenses route handler that validates pagination query parameters, calls expenseStore.findExpenses(), and returns wrapped response with data and pagination.

**Dependencies**: T003, T004 (needs validation schema and service method)  
**Parallel**: No

### T006: Update POST /expenses to use error middleware
**File**: `api/src/routes/expenses.ts`  
**Description**: Update POST /expenses handler to remove inline error handling and rely on error middleware. Update validation middleware to throw errors that error middleware can catch.

**Dependencies**: T001 (needs error middleware)  
**Parallel**: No

### T007: Update GET /expenses/summary to use error middleware
**File**: `api/src/routes/expenses.ts`  
**Description**: Update GET /expenses/summary handler to validate query parameters with Zod, remove inline error handling, and rely on error middleware.

**Dependencies**: T001 (needs error middleware)  
**Parallel**: No

### T008: Register error middleware in server.ts
**File**: `api/src/server.ts`  
**Description**: Register error middleware after all routes (Express error middleware pattern).

**Dependencies**: T001 (needs error middleware)  
**Parallel**: No

### T009: Update OpenAPI spec for GET /expenses
**File**: `api/spec/openapi.yaml`  
**Description**: Update GET /expenses 200 response schema from array to wrapped object with data (array) and pagination (object) properties. Add PaginationMetadata schema to components/schemas.

**Dependencies**: None  
**Parallel**: [P] Can run in parallel with other tasks

### T010: Add unit tests for error middleware
**File**: `api/tests/unit/error-handler.test.ts` (NEW)  
**Description**: Create unit tests for error middleware covering all error types (validation, not found, server errors) and request-id header handling.

**Dependencies**: T001 (needs error middleware)  
**Parallel**: [P] Can run in parallel with T011, T012

### T011: Add unit tests for pagination logic
**File**: `api/tests/unit/expenses.test.ts` (update existing)  
**Description**: Add unit tests for ExpenseStore.findExpenses() method covering pagination edge cases (empty store, page boundaries, invalid parameters).

**Dependencies**: T004 (needs findExpenses method)  
**Parallel**: [P] Can run in parallel with T010, T012

### T012: Update contract tests to expect correct response structures
**File**: `api/tests/contract/expenses.contract.test.ts`  
**Description**: Update contract tests to expect 200 OK (not 404) and validate response structures match OpenAPI spec (wrapped object for GET /expenses, ErrorEnvelope for errors).

**Dependencies**: T005, T006, T007 (needs route handlers implemented)  
**Parallel**: No

### T013: Write unit tests for validation middleware
**File**: `api/tests/unit/validation.test.ts`  
**Description**: Add or update unit tests covering request validation middleware to ensure schemas reject and accept inputs per FR-021, including detailed error output.

**Dependencies**: T003, T006  
**Parallel**: [P] Can run in parallel with T010, T011

### T014: Verify `Test & Coverage - API` job passes with ≥ 60% coverage
**File**: `api/` (CI job configuration)  
**Description**: Execute the Test & Coverage - API workflow (or equivalent command) and confirm coverage meets the ≥60% requirement defined in FR-023. Document results in PR notes.

**Dependencies**: T010, T011, T013  
**Parallel**: No

### T015: Verify `spec-check` and `CodeQL` CI jobs are green
**File**: `.github/workflows/` (CI pipelines)  
**Description**: Run or verify spec-check and CodeQL CI jobs complete successfully, satisfying FR-025 and FR-026. Capture results for review.

**Dependencies**: T009, T014  
**Parallel**: No

---

## Execution Order

1. **Setup Phase** (T001, T002, T003) - Can run in parallel
2. **Service Extension** (T004) - Depends on T002
3. **Route Handlers** (T005, T006, T007) - Depends on previous tasks
4. **Integration** (T008, T009) - T008 depends on T001, T009 can run in parallel
5. **Testing & Validation** (T010–T015) - T010/T011/T013 can run in parallel; T014 depends on test completion; T015 follows T009 and T014

---

## Success Criteria

- [ ] All contract tests pass
- [ ] Error middleware catches all errors and returns ErrorEnvelope format
- [ ] GET /expenses returns wrapped response with data and pagination
- [ ] POST /expenses validation errors return ErrorEnvelope format
- [ ] GET /expenses/summary validation errors return ErrorEnvelope format
- [ ] Request-id header echoed in error responses
- [ ] OpenAPI spec updated and passes spec-check
- [ ] Unit tests achieve ≥60% coverage
- [ ] All CI jobs pass (spec-check, CodeQL, Test & Coverage - API)

