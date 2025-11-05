# Feature Specification: Week 5: Implement MVP API Endpoints (Expenses)

**Feature Branch**: `023-title-week-5`  
**Created**: November 5, 2025  
**Status**: Draft  
**Input**: User description: "Title: Week 5: Implement MVP API Endpoints (Expenses). Context: This specification outlines the implementation of the final two MVP endpoints for the Week 5 API: POST /expenses and GET /expenses/summary..."

---

## User Scenarios & Testing

### Primary User Story
The API server needs to provide expense management capabilities to enable users to save and retrieve expense records through HTTP endpoints. The system must validate expense data on submission and provide aggregated expense summaries with optional filtering by category and time period.

### Acceptance Scenarios
1. **Given** no expenses exist, **When** a client submits a valid POST request to `/expenses` with amount, category, and date, **Then** the server returns the newly created expense record with a unique ID.
2. **Given** expenses exist in the system, **When** a client submits a GET request to `/expenses/summary`, **Then** the server returns an aggregated object containing total amount and count of all expenses.
3. **Given** expenses from multiple categories exist, **When** a client submits a GET request to `/expenses/summary?category=food`, **Then** the server returns aggregated totals filtered to only that category.
4. **Given** expenses from multiple months exist, **When** a client submits a GET request to `/expenses/summary?month=2025-11`, **Then** the server returns aggregated totals filtered to only that month.
5. **Given** multiple query filters are provided, **When** a client submits a GET request to `/expenses/summary?category=food&month=2025-11`, **Then** the server returns aggregated totals matching both filter criteria.
6. **Given** invalid or missing required fields in a request, **When** a client submits a POST request to `/expenses`, **Then** the server returns a 400 status with descriptive validation error messages.

### Edge Cases
- **Amount validation**: Zero and negative amounts MUST be rejected with a 400 validation error (clarified: reject both zero and negative).
- **Date format validation**: Invalid date formats MUST return 400 with a specific error message showing the expected format and what was received (clarified: descriptive error).
- What happens when filtering by a category with no matching expenses?
- What happens when filtering by a month with no matching expenses?
- How are multiple expenses with identical values handled in aggregation?

---

## Clarifications

### Session 2025-11-05

- Q: How should the system handle zero and negative values for the amount field? → A: Reject both zero and negative amounts (validation error)
- Q: When an invalid date format is submitted, how detailed should the error message be? → A: Return 400 with specific error message showing expected format and what was received
- Q: Should the Expense entity include only core fields (id, amount, category, date) or additional fields from the CLI schema? → A: Core fields only (four fields total)
- Q: For the expense endpoints in production, what is the priority: correctness, performance, scalability, or fault tolerance? → A: Accurate aggregation (correctness first)

---

## Requirements

### Functional Requirements

#### POST /expenses Endpoint
- **FR-001**: System MUST accept HTTP POST requests to the `/expenses` endpoint with a JSON body containing expense details.
- **FR-002**: System MUST validate the request body against a strict schema including required fields: `amount` (positive number), `category` (string), and `date` (ISO 8601 date format).
- **FR-003**: System MUST reject requests with invalid or missing required fields, returning a 400 status code with validation error details.
- **FR-004**: System MUST assign a unique identifier (ID) to each newly created expense record.
- **FR-005**: System MUST store the expense record in an in-memory array for the duration of the server session.
- **FR-006**: System MUST return the newly created expense record (including the assigned ID) in the response body upon successful POST submission.

#### GET /expenses/summary Endpoint
- **FR-007**: System MUST accept HTTP GET requests to the `/expenses/summary` endpoint.
- **FR-008**: System MUST aggregate stored expense records and return a summary object containing: `total` (sum of all expense amounts), `count` (number of expenses), and `filters` (object describing applied filters).
- **FR-009**: System MUST support an optional `category` query parameter to filter expenses by category name.
- **FR-010**: System MUST support an optional `month` query parameter (format: YYYY-MM) to filter expenses by month.
- **FR-011**: System MUST apply both `category` and `month` filters simultaneously if both are provided.
- **FR-012**: System MUST return an empty summary (total=0, count=0) when no expenses match the filter criteria.
- **FR-013**: System MUST include the applied filters in the response object to indicate which filters were active.

#### Testing & Quality
- **FR-014**: System MUST include unit tests for expense aggregation and filtering logic achieving at least 80% code coverage.
- **FR-015**: System MUST include integration tests validating POST /expenses success cases and validation error scenarios.
- **FR-016**: System MUST include integration tests validating GET /expenses/summary with no filters, single filters, and combined filters.
- **FR-017**: System MUST achieve at least 70% overall integration test coverage for both endpoints.

#### Specification & Documentation
- **FR-018**: System MUST document both POST /expenses and GET /expenses/summary endpoints in the OpenAPI specification with complete request/response schemas.
- **FR-019**: System MUST document all query parameters, required fields, response codes, and example payloads in the API specification.

### Non-Functional Requirements

- **NFR-001**: System priority is correctness and data accuracy over performance optimization or horizontal scalability at this stage (MVP phase).
- **NFR-002**: Expense aggregation calculations MUST be accurate for all filter combinations; this takes precedence over sub-100ms response times or concurrent request handling.

### Key Entities

- **Expense**: Represents a single expense record. Key attributes include:
  - `id`: Unique identifier (auto-assigned)
  - `amount`: Numeric value representing the expense cost (must be positive)
  - `category`: String categorizing the type of expense
  - `date`: ISO 8601 date indicating when the expense occurred
  - (Clarified: only these four core fields; no additional fields from CLI schema)

---

## Review & Acceptance Checklist

### Content Quality
- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness
- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

### Domain Completeness
- [x] Expense data model clearly defined
- [x] POST and GET endpoint behaviors specified
- [x] Filtering and aggregation logic detailed
- [x] Error handling requirements defined
- [x] Test coverage expectations established

---

## Execution Status

- [x] User description parsed
- [x] Key concepts extracted
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [x] Review checklist passed
- [x] Ready for implementation planning
- [x] Implementation complete (27/27 tasks)
- [x] All tests passing (182/182, 86.56% coverage)
- [x] Ready for merge to `development`

---
