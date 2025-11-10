# Feature Specification: Week 5 Day 1: API Spec & Contracts First (Expenses)

**Feature Branch**: `026-title-week-5`  
**Created**: 2025-11-06  
**Status**: Draft  
**Input**: User description: "Title: Week 5 Day 1: API Spec & Contracts First (Expenses)

Context: This specification covers the Day 1 objectives from the Week 5 workbook. The goal is to create the \"spec-first\" artifacts for our API. We will define the full OpenAPI spec for the expenses resource and write the initial (failing) contract tests.

Core Requirements:

OpenAPI Specification (/specs/core/openapi.yaml):

Create or update the openapi.yaml file.

Define the complete API for the expenses resource, including:

GET /expenses (with pagination)

POST /expenses

GET /expenses/summary

Define a shared Error Envelope (e.g., { code, message, details }).


Include support for a request-id header.

The spec must pass the spec-check CI job.


Contract Tests (/api/tests/):

Using supertest, write contract tests for all defined endpoints.

These tests should be written from the spec examples before the handlers are built.


The tests must initially fail (as the endpoints don't exist yet).

These tests must be integrated into the Test & Coverage - API CI job.

Review Packet Enhancement:

The build-review-packet CI job must be updated to:

Run a tool like Redoc or Scalar to generate an HTML documentation page from the openapi.yaml file.

Add a link to this new OpenAPI HTML file in the review-artifacts/index.html.

Definition of Done:

A new Pull Request is opened.

The PR includes the new openapi.yaml file.

The PR includes the new (and failing) contract tests.

The spec-check CI job is created, required, and passing.


The Test & Coverage - API job runs but is allowed to fail (since the tests are expected to fail).

The PR is reviewed, approved, and merged."

---

## ⚡ Quick Guidelines
- ✅ Focus on WHAT the API contract defines and WHY (clear API boundaries, contract-driven development)
- ❌ Avoid HOW to implement handlers (no route handler code, no database queries)
- 👥 Written for API consumers and developers who need to understand the API contract

---

## User Scenarios & Testing *(mandatory)*

### Primary User Story
As an API consumer, I need a clearly defined API contract for the expenses resource that specifies:
1. How to retrieve expenses with pagination support
2. How to create new expense records
3. How to retrieve expense summaries
4. What error responses look like and how to handle them
5. How to include request tracking via request-id headers

This ensures API consumers can understand the API before implementation, enables contract-driven development, and provides clear documentation for integration.

### Acceptance Scenarios
1. **Given** an API specification exists, **When** a developer reads the OpenAPI spec, **Then** they can understand all available endpoints, request/response formats, and error handling for the expenses resource
2. **Given** contract tests are written, **When** the tests are executed, **Then** they initially fail because the endpoints don't exist yet (confirming spec-first approach)
3. **Given** the spec-check CI job runs, **When** a PR includes the openapi.yaml file, **Then** the spec is validated for correctness and completeness
4. **Given** the review packet is generated, **When** a reviewer accesses review-artifacts/index.html, **Then** they can navigate to the OpenAPI documentation page to view the API contract
5. **Given** a client makes a request with a request-id header, **When** they receive an error response, **Then** the error envelope includes the request-id for correlation

### Edge Cases
- What happens if the OpenAPI spec is invalid or malformed? → spec-check CI job fails and blocks merge
- What if contract tests pass before handlers are implemented? → This indicates handlers may have been implemented prematurely; tests should fail initially
- What if pagination parameters are missing or invalid? → Error envelope should be returned with clear validation messages
- How are request-id headers handled if not provided by the client? → System should generate one or handle gracefully
- What happens if the OpenAPI documentation generation tool fails? → build-review-packet job should fail and prevent incomplete review packets

---

## Requirements *(mandatory)*

### Functional Requirements

#### OpenAPI Specification
- **FR-001**: System MUST provide a complete OpenAPI 3.1.x specification file at `/specs/core/openapi.yaml` that defines the expenses resource API contract (endpoints are public and do not require authentication)
- **FR-002**: System MUST define GET /expenses endpoint with pagination support (query parameters for page number, page size, or offset/limit). The response body MUST include pagination metadata (e.g., totalItems, currentPage, pageSize) to enable clients to navigate paginated results.
- **FR-003**: System MUST define POST /expenses endpoint with request body schema for creating expense records (required fields: amount, category, date; optional fields: description, and others as defined in the schema)
- **FR-004**: System MUST define GET /expenses/summary endpoint for retrieving expense summaries (response includes aggregated totals, count, and filter parameters)
- **FR-005**: System MUST define a shared Error Envelope schema (e.g., containing fields like `code`, `message`, `details`) that is referenced by all error responses (error responses use HTTP status codes: 400, 404, 422, 429, 500)
- **FR-006**: System MUST define support for a `request-id` header (request header that clients can provide for request tracking and correlation)
- **FR-007**: System MUST ensure the OpenAPI specification passes validation checks (syntax, schema correctness, completeness) via the spec-check CI job
- **FR-008**: System MUST include example request/response payloads in the OpenAPI spec for each endpoint to guide contract test development

#### Contract Tests
- **FR-009**: System MUST provide contract tests for GET /expenses endpoint that validate request/response format matches the OpenAPI spec
- **FR-010**: System MUST provide contract tests for POST /expenses endpoint that validate request/response format matches the OpenAPI spec
- **FR-011**: System MUST provide contract tests for GET /expenses/summary endpoint that validate request/response format matches the OpenAPI spec
- **FR-012**: System MUST ensure contract tests are written using a testing framework that can make HTTP requests (e.g., supertest) and validate responses against the OpenAPI spec
- **FR-013**: System MUST ensure contract tests initially fail when executed (because endpoint handlers don't exist yet), confirming the spec-first approach
- **FR-014**: System MUST integrate contract tests into the Test & Coverage - API CI job so they run on every PR
- **FR-015**: System MUST allow the Test & Coverage - API CI job to fail initially (since tests are expected to fail before handlers are implemented)

#### Review Packet Enhancement
- **FR-016**: System MUST generate an HTML documentation page from the openapi.yaml file using a documentation generation tool (e.g., Redoc or Scalar)
- **FR-017**: System MUST include a link to the generated OpenAPI HTML documentation in review-artifacts/index.html
- **FR-018**: System MUST ensure the build-review-packet CI job executes the documentation generation step before packaging artifacts
- **FR-019**: System MUST ensure the OpenAPI HTML file is included in the review-artifacts package for reviewers to access

#### CI/CD Integration
- **FR-020**: System MUST create a spec-check CI job that validates the OpenAPI specification file
- **FR-021**: System MUST configure the spec-check CI job as a required status check for PRs (must pass before merge)
- **FR-022**: System MUST ensure the spec-check CI job runs on every PR that includes changes to openapi.yaml or related spec files

### Key Entities

- **OpenAPI Specification**: A machine-readable document defining the API contract, including endpoints, request/response schemas, and error formats
- **Expense Resource**: The primary entity being managed through the API (expense records with required attributes: amount, category; optional attributes: description, date, and others as defined in the OpenAPI schema)
- **Error Envelope**: A standardized error response format containing error code, message, and optional details for consistent error handling
- **Request-ID Header**: An optional HTTP header that clients can provide for request tracking and correlation in logs and error responses
- **Contract Test**: An automated test that validates API endpoints match the OpenAPI specification before handlers are implemented
- **Review Packet**: A collection of artifacts (coverage reports, test results, API documentation) packaged for reviewer access

---

## Definition of Done

All of the following must be satisfied before this feature is considered complete:

- [ ] OpenAPI specification file created/updated at `/specs/core/openapi.yaml`
- [ ] OpenAPI spec defines GET /expenses endpoint with pagination parameters
- [ ] OpenAPI spec defines POST /expenses endpoint with request body schema
- [ ] OpenAPI spec defines GET /expenses/summary endpoint
- [ ] OpenAPI spec defines shared Error Envelope schema referenced by all error responses
- [ ] OpenAPI spec includes request-id header support
- [ ] spec-check CI job created and configured to validate openapi.yaml
- [ ] spec-check CI job set as required status check for PRs
- [ ] spec-check CI job passes when run against the new openapi.yaml file
- [ ] Contract tests written for GET /expenses endpoint (using supertest or similar)
- [ ] Contract tests written for POST /expenses endpoint
- [ ] Contract tests written for GET /expenses/summary endpoint
- [ ] Contract tests initially fail when executed (confirming endpoints don't exist yet)
- [ ] Contract tests integrated into Test & Coverage - API CI job
- [ ] Test & Coverage - API CI job configured to allow failures initially (tests expected to fail)
- [ ] build-review-packet CI job updated to generate OpenAPI HTML documentation (using Redoc or Scalar)
- [ ] OpenAPI HTML documentation file generated and included in review-artifacts
- [ ] review-artifacts/index.html updated with link to OpenAPI documentation
- [ ] Pull Request opened with all changes
- [ ] PR includes openapi.yaml file
- [ ] PR includes contract test files
- [ ] PR reviewed and approved
- [ ] PR merged to target branch

---

## Review & Acceptance Checklist
*GATE: Automated checks run during specification creation*

### Content Quality
- [x] No implementation details (no route handler code, no database queries)
- [x] Focused on API contract definition and contract-driven development value
- [x] Written for API consumers and developers understanding API boundaries
- [x] All mandatory sections completed

### Requirement Completeness
- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous (spec validation, test execution)
- [x] Success criteria are measurable (CI jobs pass/fail, tests fail initially)
- [x] Scope is clearly bounded (expenses resource API contract only)
- [x] Dependencies and assumptions identified (OpenAPI spec format, testing framework)

---

## Execution Status
*Updated during specification creation*

- [x] User description parsed
- [x] Key concepts extracted (API contract, spec-first development, contract tests)
- [x] Ambiguities resolved (all requirements are clear)
- [x] User scenarios defined
- [x] Requirements generated (22 functional requirements)
- [x] Entities identified (6 key entities)
- [x] Review checklist passed

---

## Clarifications

### Session 2025-11-06
- Q: What format should pagination use (page-based vs offset-based)? → A: OpenAPI spec should support common pagination patterns; contract tests should validate the chosen approach matches the spec
- Q: Should request-id be required or optional? → A: Optional header that clients can provide; system should handle cases where it's not provided
- Q: What should be included in expense summary? → A: OpenAPI spec should define the summary response schema; common fields might include total amount, count, date range, category breakdown
- Q: Should error envelope details field be structured or free-form? → A: OpenAPI spec should define the details field structure (could be an object with specific fields or an array of error objects)
- Q: Which documentation tool (Redoc vs Scalar)? → A: Either tool is acceptable; choose based on team preference and CI environment compatibility
- Q: What are the required fields for an expense record in POST /expenses? → A: amount and category are required fields; description, date, and other fields are optional
- Q: Do the expenses API endpoints require authentication/authorization? → A: No authentication required (public endpoints)
- Q: Which OpenAPI specification version should be used? → A: OpenAPI 3.1.x
- Q: Which HTTP status codes should the API return for error responses? → A: 400 (Bad Request), 404 (Not Found), 422 (Unprocessable Entity), 429 (Too Many Requests), 500 (Internal Server Error)
- Q: What data should GET /expenses/summary return in its response? → A: Aggregated totals, count, filters

---

## Notes for Implementation Team

1. **Spec-First Approach**: This feature emphasizes defining the API contract before implementing handlers. Contract tests should fail initially, confirming the spec-first workflow.

2. **OpenAPI Specification Location**: The spec should be placed at `/specs/core/openapi.yaml` to align with the project structure. Consider versioning if multiple API versions are planned.

3. **Contract Test Strategy**: Contract tests validate that endpoints match the OpenAPI spec. They should check:
   - Request/response status codes
   - Request/response body schemas
   - Header presence and format
   - Error envelope structure

4. **CI Job Configuration**: 
   - spec-check should validate OpenAPI syntax and schema correctness
   - Test & Coverage - API should run contract tests but allow failures initially
   - build-review-packet should generate documentation and include it in artifacts

5. **Documentation Generation**: Choose a tool (Redoc or Scalar) that:
   - Can run in CI environment
   - Generates standalone HTML files
   - Supports the OpenAPI version used in the spec

6. **Error Envelope Design**: Consider including:
   - `code`: Machine-readable error code
   - `message`: Human-readable error message
   - `details`: Additional context (validation errors, field-specific issues)
   - `requestId`: Echo of request-id header for correlation

7. **Pagination Design**: Common approaches include:
   - Page-based: `?page=1&pageSize=20`
   - Offset-based: `?offset=0&limit=20`
   - Cursor-based: `?cursor=abc123&limit=20`
   Choose based on API requirements and document in OpenAPI spec.
