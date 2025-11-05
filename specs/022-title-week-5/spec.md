# Feature Specification: Week 5: Implement MVP API Endpoints (Healthz, Convert)

**Feature Branch**: `022-title-week-5`  
**Created**: 2025-01-27  
**Status**: Complete  
**Input**: User description: "Title: Week 5: Implement MVP API Endpoints (Healthz, Convert). Context: This specification outlines the first feature build for the Week 5 API. Now that the Day-0 scaffolding is complete, we will implement the first two endpoints defined in the feedback: GET /healthz and POST /convert. This work must follow our spec-first process."

## Execution Flow (main)
```
1. Parse user description from Input
   → Identified: API endpoints implementation, spec-first workflow, temperature conversion logic reuse
2. Extract key concepts from description
   → Actors: API consumers, developers, CI system
   → Actions: Implement health check endpoint, implement temperature conversion endpoint, validate requests, test endpoints
   → Data: Health status information, temperature conversion requests/responses
   → Constraints: Must follow spec-first process, reuse temp-converter logic, achieve test coverage goals
3. For each unclear aspect:
   → All technical details provided (Zod, Supertest, Vitest)
   → Coverage targets specified (≥70% integration, ≥80% unit)
   → Conversion logic source identified (temp-converter CLI)
4. Fill User Scenarios & Testing section
   → Scenarios defined for both endpoints including success and error cases
5. Generate Functional Requirements
   → Each requirement testable and clear
   → Validation requirements specified
   → Testing requirements specified
6. Identify Key Entities
   → Health check response, conversion request/response
7. Run Review Checklist
   → Technical details necessary for API implementation
   → Focus remains on "what endpoints must do" and "how they must behave"
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines
- ✅ Focus on WHAT endpoints must provide and HOW they must behave
- ✅ API implementation requires technical specificity for validation and testing
- ✅ Written for developers implementing first production endpoints

---

## Clarifications

### Session 2025-01-27
- Q: What should the POST `/convert` response body structure be? → A: JSON object with value and unit: `{ "value": 212, "unit": "F" }`
- Q: How should POST `/convert` handle identical source and target units? → A: Return the same value: `{ "value": 100, "unit": "C" }` (no conversion needed)
- Q: What should the validation error response format be for POST `/convert`? → A: `{ "error": "Validation failed", "details": [...] }` (matches existing validation middleware pattern)
- Q: For GET `/healthz`, what should the `version` field contain? → A: Package version from `package.json`
- Q: What format should the `currentTime` field use in GET `/healthz`? → A: ISO 8601 date-time string (e.g., "2025-01-27T12:00:00.000Z")

---

## User Scenarios & Testing *(mandatory)*

### Primary User Story
As an API consumer, when I need to check the health status of the API or convert temperatures between Celsius and Fahrenheit, I need two endpoints (GET /healthz and POST /convert) that provide accurate responses with proper validation and error handling, so that I can integrate these services into my applications with confidence.

### Acceptance Scenarios

#### GET /healthz Endpoint
1. **Given** the API server is running, **When** a client sends a GET request to `/healthz`, **Then** the server responds with a JSON object containing status, version, and current time
2. **Given** the API server is running, **When** a client checks the `/healthz` endpoint, **Then** the response indicates the service is operational and provides version information

#### POST /convert Endpoint - Success Cases
3. **Given** the API server is running, **When** a client sends a POST request to `/convert` with a valid JSON body `{ value: 32, from: "F", to: "C" }`, **Then** the server responds with a JSON object `{ "value": 0, "unit": "C" }` containing the correctly converted temperature value and unit
4. **Given** the API server is running, **When** a client sends a POST request to `/convert` with `{ value: 0, from: "C", to: "F" }`, **Then** the server responds with a JSON object `{ "value": 32, "unit": "F" }` containing the correctly converted value and unit
5. **Given** the API server is running, **When** a client sends a POST request to `/convert` with `{ value: 100, from: "C", to: "C" }`, **Then** the server responds with a JSON object `{ "value": 100, "unit": "C" }` since no conversion is needed

#### POST /convert Endpoint - Validation Errors
6. **Given** the API server is running, **When** a client sends a POST request to `/convert` with a missing `value` field, **Then** the server responds with HTTP 400 and a JSON error response `{ "error": "Validation failed", "details": [...] }`
7. **Given** the API server is running, **When** a client sends a POST request to `/convert` with an invalid `from` unit (e.g., "K"), **Then** the server responds with HTTP 400 and a JSON error response `{ "error": "Validation failed", "details": [...] }`
8. **Given** the API server is running, **When** a client sends a POST request to `/convert` with an invalid `to` unit (e.g., "K"), **Then** the server responds with HTTP 400 and a JSON error response `{ "error": "Validation failed", "details": [...] }`
9. **Given** the API server is running, **When** a client sends a POST request to `/convert` with a non-numeric `value` field, **Then** the server responds with HTTP 400 and a JSON error response `{ "error": "Validation failed", "details": [...] }`

### Edge Cases
- What happens when the conversion logic encounters extreme values? → System must handle all valid numeric inputs that the temp-converter CLI supports
- What happens if the request body is malformed JSON? → System must return HTTP 400 with JSON error response `{ "error": "Validation error", "message": "..." }` or similar structure
- What happens if required fields are null or undefined? → System must return HTTP 400 with JSON error response `{ "error": "Validation failed", "details": [...] }`
- What happens if the `value` field is a string that represents a number? → System must validate that `value` is a number type, not a string
- What happens when `from` and `to` units are identical? → System must return the same value with the target unit (no conversion needed) rather than throwing an error

---

## Requirements *(mandatory)*

### Functional Requirements

#### GET /healthz Endpoint
- **FR-001**: System MUST provide a GET `/healthz` endpoint that returns a JSON response
- **FR-002**: The `/healthz` endpoint response MUST include a `status` field indicating the service health
- **FR-003**: The `/healthz` endpoint response MUST include a `version` field containing the package version from `package.json`
- **FR-004**: The `/healthz` endpoint response MUST include a `currentTime` field containing the current server time in ISO 8601 date-time format (e.g., "2025-01-27T12:00:00.000Z")
- **FR-005**: The `/healthz` endpoint MUST be defined in the API specification (openapi.yml or equivalent) with accurate response schema

#### POST /convert Endpoint - Core Functionality
- **FR-006**: System MUST provide a POST `/convert` endpoint that performs temperature conversion
- **FR-007**: The `/convert` endpoint MUST reuse the core conversion logic from the temp-converter CLI application. When `from` and `to` units are identical, the endpoint MUST return the same value with the target unit (no conversion needed) rather than throwing an error
- **FR-008**: The `/convert` endpoint MUST accept a JSON request body with the structure: `{ value: number, from: "C" | "F", to: "C" | "F" }`
- **FR-009**: The `/convert` endpoint MUST return a JSON response with structure `{ "value": number, "unit": "C" | "F" }` containing the converted temperature value and target unit
- **FR-010**: The `/convert` endpoint MUST be defined in the API specification (openapi.yml or equivalent) including request body and response schemas

#### POST /convert Endpoint - Validation
- **FR-011**: System MUST validate incoming request bodies for POST `/convert` using a schema validation library (Zod)
- **FR-012**: System MUST reject requests with missing required fields (`value`, `from`, `to`) and return HTTP 400 with JSON error response `{ "error": "Validation failed", "details": [...] }` where `details` contains Zod validation error information
- **FR-013**: System MUST reject requests with invalid `from` or `to` unit values (values other than "C" or "F") and return HTTP 400 with JSON error response `{ "error": "Validation failed", "details": [...] }` where `details` contains Zod validation error information
- **FR-014**: System MUST reject requests where `value` is not a number type and return HTTP 400 with JSON error response `{ "error": "Validation failed", "details": [...] }` where `details` contains Zod validation error information

#### Testing Requirements
- **FR-015**: System MUST include unit tests (using Vitest) for the core temperature conversion logic if it was refactored from the CLI application
- **FR-016**: System MUST include integration tests (using Supertest) for POST `/convert` with a valid request body
- **FR-017**: System MUST include integration tests (using Supertest) for POST `/convert` with invalid request bodies (missing value, invalid units) asserting 400-level validation errors
- **FR-018**: System MUST include integration tests (using Supertest) for GET `/healthz` endpoint
- **FR-019**: Test coverage MUST work towards achieving ≥70% integration test coverage and ≥80% unit test coverage goals

#### Specification Requirements
- **FR-020**: The API specification (openapi.yml or equivalent) MUST be updated to include both GET `/healthz` and POST `/convert` endpoints
- **FR-021**: The API specification MUST accurately define the request body schema for POST `/convert`
- **FR-022**: The API specification MUST accurately define the response schemas for both endpoints

### Key Entities *(include if feature involves data)*

#### Health Check Response
- Represents the operational status of the API service
- Attributes: `status` (health status indicator), `version` (package version from `package.json`), `currentTime` (ISO 8601 date-time string of response, e.g., "2025-01-27T12:00:00.000Z")

#### Conversion Request
- Represents a temperature conversion operation request
- Attributes: `value` (numeric temperature value), `from` (source unit: "C" or "F"), `to` (target unit: "C" or "F")

#### Conversion Response
- Represents the result of a temperature conversion operation
- Attributes: `value` (numeric converted temperature value), `unit` (target unit: "C" or "F")

---

## Review & Acceptance Checklist
*GATE: Automated checks run during main() execution*

### Content Quality
- [x] Technical details necessary for API endpoint specification
- [x] Focused on endpoint behavior and validation requirements
- [x] Written for developers implementing API endpoints
- [x] All mandatory sections completed

### Requirement Completeness
- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous  
- [x] Success criteria are measurable (coverage targets specified)
- [x] Scope is clearly bounded (two endpoints only)
- [x] Dependencies identified (temp-converter CLI logic, spec-first process)

---

## Definition of Done

- [x] The openapi.yml spec (or equivalent) is updated with both GET `/healthz` and POST `/convert` endpoints
- [x] The server correctly implements both endpoints, reusing the temp-converter logic
- [x] Zod validation is implemented for the POST `/convert` request body
- [x] Supertest integration tests for both endpoints (including failure cases) are implemented and passing
- [x] Unit tests for conversion logic (if refactored) are implemented and passing
- [x] Test coverage is working towards ≥70% integration and ≥80% unit test goals
- [x] The pull request is submitted with all required documentation and successfully merged

---

## Execution Status
*Updated by main() during processing*

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [x] Review checklist passed

---
