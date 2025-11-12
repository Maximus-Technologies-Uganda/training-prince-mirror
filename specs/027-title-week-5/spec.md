# Feature Specification: Week 5 Day 2: API Skeleton, Validation & Errors

**Feature Branch**: `027-title-week-5`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: User description: "Title: Week 5 Day 2: API Skeleton, Validation & Errors

Context: This specification covers the Day 2 objectives from the Week 5 workbook. The goal is to build the API \"skeleton\" (servers, routes, and handlers) to make the failing contract tests from Day 1 pass. This includes implementing validation, error handling, and a temporary in-memory data store.

Core Requirements:

API Skeleton & Routing:

Create the main server file (/api/src/server.ts) using Express.

Create the expenses routes file (/api/src/routes/expenses.ts) and register it with the main server.

Implement the route handlers for GET /expenses, POST /expenses, and GET /expenses/summary.

Data Repository (In-Memory):

Create a simple in-memory repository (e.g., in-memory repo) to store expense data.

This repository must expose functions (e.g., createExpense, findExpenses, getSummary) and starts empty (tests populate data as needed).

Validation & Error Handling:

Implement Zod validation for all incoming request bodies (e.g., for POST /expenses).

Create a central error middleware that catches errors and maps them to the standard error envelope (e.g., { code, message, details }) defined in our openapi.yaml spec.

Testing Requirements:

Contract Tests: All (previously failing) contract tests from Day 1 must now pass.

Unit Tests: Add unit tests for the new validation logic and any data mappers.

Coverage: The Test & Coverage - API job must meet the temporary floor of ≥60% (lines/functions/branches).



Definition of Done:

All contract tests for the expenses resource are passing.

The spec-check and CodeQL CI jobs are green.

The Test & Coverage - API job passes with ≥60% coverage.

The pull request is reviewed and merged."

---

## ⚡ Quick Guidelines
- ✅ Focus on WHAT the API must do (respond correctly, validate input, handle errors consistently)
- ❌ Avoid HOW to implement (no specific framework names, file structures, or code patterns)
- 👥 Written for developers and API consumers who need a working API that matches the contract

---

## User Scenarios & Testing *(mandatory)*

### Primary User Story
As an API consumer, I need the expenses API endpoints to be functional and respond correctly to requests so that:
1. I can retrieve expense records with pagination support
2. I can create new expense records with proper validation
3. I can retrieve expense summaries with filtering
4. I receive consistent, well-structured error responses when something goes wrong
5. The API matches the contract defined in the OpenAPI specification

This ensures the API contract from Day 1 is now implemented and functional, enabling integration testing and further development.

### Acceptance Scenarios
1. **Given** contract tests exist from Day 1, **When** the API skeleton is implemented, **Then** all contract tests pass (confirming API matches the OpenAPI spec)
2. **Given** a client sends a POST request to create an expense, **When** the request body is valid, **Then** the expense is stored and a 201 Created response is returned with the created expense
3. **Given** a client sends a POST request with invalid data, **When** validation fails, **Then** a 400 Bad Request response is returned with an error envelope containing validation details
4. **Given** a client requests expense records, **When** pagination parameters are provided, **Then** the response includes paginated results with metadata (totalItems, currentPage, pageSize, totalPages) in the response body as a wrapped object with `data` and `pagination` properties
5. **Given** an error occurs during request processing, **When** the error middleware catches it, **Then** a standardized error envelope response is returned with appropriate HTTP status code
6. **Given** a client requests expense summary, **When** filter parameters are provided, **Then** the summary response includes aggregated totals matching the filter criteria
7. **Given** contract tests are executed, **When** all endpoints are implemented, **Then** the Test & Coverage - API job passes with ≥60% coverage

### Edge Cases
- What happens when pagination parameters are missing or invalid? → Default values should be applied (page=1, pageSize=20) or validation errors returned
- How is pagination metadata structured in GET /expenses response? → Response body contains wrapped object with `data` array (expense records) and `pagination` object (totalItems, currentPage, pageSize, totalPages)
- How does the system handle duplicate expense IDs (if applicable)? → System should generate unique identifiers or handle conflicts appropriately
- What happens when the in-memory data store is empty? → GET /expenses should return a wrapped response with empty `data` array and pagination metadata (totalItems=0), GET /expenses/summary should return zero totals
- How are validation errors formatted when multiple fields are invalid? → Error envelope details should include all validation errors in a structured format, with each error containing field name, error message, and the invalid value that was rejected
- What happens when an unexpected server error occurs? → Error middleware should catch it and return a 500 error with a generic error envelope (not exposing internal details)
- How does the system handle request-id headers? → Request-id should be echoed in error responses for correlation
- What happens when expense data exceeds memory limits? → No explicit limit enforced; system relies on Node.js memory constraints. If memory is exhausted, error middleware should catch the error and return a 500 Internal Server Error with a generic error envelope (not exposing internal memory details)

---

## Requirements *(mandatory)*

### Functional Requirements

#### API Endpoints
- **FR-001**: System MUST provide a GET /expenses endpoint that returns expense records with pagination support (query parameters for page number and page size)
- **FR-001a**: System MUST return pagination metadata in the response body as a wrapped object containing a `data` array (expense records) and a `pagination` object (with totalItems, currentPage, pageSize, totalPages)
- **FR-002**: System MUST provide a POST /expenses endpoint that accepts expense creation requests and returns the created expense with 201 Created status
- **FR-003**: System MUST provide a GET /expenses/summary endpoint that returns aggregated expense summaries with optional filtering (by category, date range, etc.)
- **FR-004**: System MUST ensure all endpoint responses match the request/response schemas defined in the OpenAPI specification from Day 1
- **FR-004a**: System MUST update the OpenAPI specification to reflect the pagination metadata structure (wrapped object with `data` and `pagination` properties) for GET /expenses endpoint
- **FR-005**: System MUST ensure all endpoints handle the optional request-id header and echo it in error responses

#### Data Storage
- **FR-006**: System MUST provide a data repository that can store expense records in memory (temporary storage solution)
- **FR-007**: System MUST expose repository functions for creating expenses (createExpense), retrieving expenses (findExpenses), and getting summaries (getSummary)
- **FR-008**: System MUST initialize the repository empty (no seed data required; tests create their own data as needed)
- **FR-009**: System MUST ensure expense records persist in memory for the duration of the application session (until server restart)
- **FR-009a**: System MUST NOT enforce an explicit maximum limit on the number of expenses stored in-memory (rely on Node.js memory constraints; handle memory exhaustion errors gracefully via error middleware)

#### Input Validation
- **FR-010**: System MUST validate all incoming request bodies against the schemas defined in the OpenAPI specification
- **FR-011**: System MUST return 400 Bad Request responses with error envelopes when request validation fails
- **FR-012**: System MUST include detailed validation error information in the error envelope details field, including field names, error messages, and invalid values (the actual rejected values) for all validation failures
- **FR-013**: System MUST validate required fields are present in POST /expenses requests (e.g., amount, category, date)
- **FR-014**: System MUST validate data types and formats match the OpenAPI schema (e.g., amount is numeric, date is valid date format)

#### Error Handling
- **FR-015**: System MUST provide a central error handling middleware that catches all errors during request processing
- **FR-016**: System MUST map all errors to the standard error envelope format (containing code, message, details fields) as defined in the OpenAPI specification
- **FR-017**: System MUST return appropriate HTTP status codes (400 for validation errors, 404 for not found, 422 for unprocessable entity, 429 for rate limiting, 500 for server errors)
- **FR-018**: System MUST include the request-id header value (if provided) in error envelope responses for request correlation
- **FR-019**: System MUST ensure error responses do not expose internal implementation details or stack traces to clients

#### Testing & Quality
- **FR-020**: System MUST ensure all contract tests from Day 1 pass (confirming API implementation matches the OpenAPI spec)
- **FR-021**: System MUST provide unit tests for validation logic that verify correct validation behavior for valid and invalid inputs
- **FR-022**: System MUST provide unit tests for data mappers (if any) that transform between API models and internal data structures
- **FR-023**: System MUST achieve ≥60% test coverage (lines/functions/branches) as measured by the Test & Coverage - API CI job
- **FR-024**: System MUST update the OpenAPI specification to include pagination metadata structure for GET /expenses endpoint
- **FR-025**: System MUST ensure the spec-check CI job passes (confirming OpenAPI spec remains valid)
- **FR-026**: System MUST ensure the CodeQL CI job passes (confirming code quality and security checks)

### Key Entities

- **Expense Record**: A data entity representing a single expense entry with required attributes (amount, category, date) and optional attributes (description, and others as defined in the OpenAPI schema)
- **Expense Summary**: An aggregated view of expenses containing totals, counts, and filter metadata (as defined in the OpenAPI schema)
- **Error Envelope**: A standardized error response format containing error code (machine-readable), message (human-readable), details (structured validation errors or additional context), and optional requestId for correlation
- **Data Repository**: An abstraction for storing and retrieving expense data, currently implemented as an in-memory store with functions for create, read, and summary operations
- **Request-ID Header**: An optional HTTP header that clients can provide for request tracking and correlation in logs and error responses

---

## Definition of Done

All of the following must be satisfied before this feature is considered complete:

- [x] All contract tests for GET /expenses endpoint are passing
- [x] All contract tests for POST /expenses endpoint are passing
- [x] All contract tests for GET /expenses/summary endpoint are passing
- [x] OpenAPI specification updated to include pagination metadata structure (wrapped object with `data` and `pagination`) for GET /expenses endpoint
- [x] GET /expenses endpoint implemented and returns paginated expense records with metadata in response body
- [x] POST /expenses endpoint implemented and creates expense records with validation
- [x] GET /expenses/summary endpoint implemented and returns aggregated summaries
- [x] In-memory data repository implemented with createExpense, findExpenses, and getSummary functions
- [x] Input validation implemented for all request bodies (validates against OpenAPI schema)
- [x] Validation errors return 400 Bad Request with error envelope containing validation details
- [x] Central error handling middleware implemented and catches all errors
- [x] Error middleware maps errors to standard error envelope format (code, message, details)
- [x] Error responses include appropriate HTTP status codes (400, 404, 422, 429, 500)
- [x] Request-id header is echoed in error responses when provided
- [x] Unit tests written for validation logic
- [x] Unit tests written for data mappers (if applicable)
- [x] Test & Coverage - API CI job passes with ≥60% coverage (lines/functions/branches)
- [x] spec-check CI job passes (OpenAPI spec validation)
- [x] CodeQL CI job passes (code quality and security)
- [x] Pull Request opened with all changes
- [ ] PR reviewed and approved
- [ ] PR merged to target branch

---

## Review & Acceptance Checklist
*GATE: Automated checks run during specification creation*

### Content Quality
- [x] No implementation details (no specific framework names, file paths, or code patterns)
- [x] Focused on API behaviors and outcomes (what the API must do, not how)
- [x] Written for developers and API consumers understanding API capabilities
- [x] All mandatory sections completed

### Requirement Completeness
- [x] Ambiguities marked with [NEEDS CLARIFICATION] (in-memory storage limits)
- [x] Requirements are testable and unambiguous (contract tests, coverage thresholds)
- [x] Success criteria are measurable (test pass/fail, coverage percentage, CI job status)
- [x] Scope is clearly bounded (API skeleton implementation for expenses resource)
- [x] Dependencies and assumptions identified (Day 1 contract tests exist, OpenAPI spec exists)

---

## Execution Status
*Updated during specification creation*

- [x] User description parsed
- [x] Key concepts extracted (API skeleton, validation, error handling, contract tests)
- [x] Ambiguities marked (in-memory storage limits)
- [x] User scenarios defined
- [x] Requirements generated (25 functional requirements)
- [x] Entities identified (5 key entities)
- [x] Review checklist passed

---

## Clarifications

### Session 2025-01-27
- Q: Are there limits on the number of expenses that can be stored in-memory? → A: No explicit limit (rely on Node.js memory constraints, handle errors gracefully if memory exhausted)
- Q: Should the in-memory repository persist data across server restarts? → A: No, in-memory storage is temporary and data is lost on server restart (this is intentional for Day 2)
- Q: What should happen if an expense with a duplicate ID is created? → A: System should generate unique identifiers for each expense to prevent conflicts
- Q: Should validation use the exact schemas from the OpenAPI spec? → A: Yes, validation must match the schemas defined in the OpenAPI specification from Day 1
- Q: What level of detail should be in validation error details? → A: Error envelope details should include field names, error messages, and invalid values for each validation failure
- Q: Should invalid values be included in validation error details? → A: Yes, always include invalid values in validation error details (helps clients understand what was wrong)
- Q: Should the error middleware handle all error types (validation, not found, server errors)? → A: Yes, central error middleware should catch and map all errors to the standard error envelope format
- Q: What is the minimum coverage threshold? → A: ≥60% coverage (lines/functions/branches) as specified in the requirements
- Q: Should seed data be included in the repository implementation? → A: Yes, repository can be pre-filled with seed data for testing purposes
- Q: How should pagination metadata be included in GET /expenses response? → A: Include pagination metadata in response body (wrapped object with `data` array and `pagination` object)
- Q: What seed data should be included in the repository? → A: No seed data required (repository starts empty, tests create their own data)
- Q: Should the OpenAPI spec be updated to match the pagination metadata requirement? → A: Update OpenAPI spec to include pagination metadata in response body (wrapped object)
- Q: Should there be an explicit maximum limit on in-memory expenses? → A: No explicit limit (rely on Node.js memory constraints, handle errors gracefully if memory exhausted)
- Q: Should invalid values be included in validation error details? → A: Yes, always include invalid values in validation error details (helps clients understand what was wrong)

---

## Notes for Implementation Team

1. **Contract-Driven Development**: This feature implements the API contract defined in Day 1. All endpoints must match the OpenAPI specification exactly, including request/response formats, status codes, and error envelopes. **Note**: The OpenAPI specification must be updated to include the pagination metadata structure (wrapped object with `data` and `pagination` properties) for GET /expenses endpoint as part of this feature.

2. **In-Memory Storage**: The data repository is intentionally temporary (in-memory) for Day 2. This allows focus on API structure, validation, and error handling without database complexity. Data will be lost on server restart.

3. **Validation Strategy**: Input validation should validate against the OpenAPI schema. Consider using a validation library that can validate against JSON Schema or OpenAPI schemas directly, or manually implement validation that matches the schema requirements.

4. **Error Handling Pattern**: Implement a central error middleware that:
   - Catches all errors (validation, not found, server errors)
   - Maps errors to the standard error envelope format
   - Sets appropriate HTTP status codes
   - Includes request-id in error responses when provided
   - Does not expose internal error details to clients

5. **Test Coverage**: Focus on achieving ≥60% coverage across lines, functions, and branches. Prioritize:
   - Contract tests (must pass)
   - Validation logic unit tests
   - Error handling unit tests
   - Data mapper unit tests (if applicable)

6. **CI Integration**: Ensure all CI jobs pass:
   - spec-check: Validates OpenAPI spec remains correct
   - CodeQL: Code quality and security checks
   - Test & Coverage - API: Runs tests and measures coverage (must achieve ≥60%)

7. **Repository Design**: The in-memory repository should expose clear functions:
   - `createExpense(expenseData)`: Creates and stores a new expense, returns created expense
   - `findExpenses(filters, pagination)`: Retrieves expenses matching filters with pagination
   - `getSummary(filters)`: Returns aggregated summary matching filters

8. **Seed Data**: Repository should start empty. Tests and contract tests should create their own data as needed. No pre-populated seed data is required.
