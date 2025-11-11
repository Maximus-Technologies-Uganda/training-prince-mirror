# Feature Specification: Week 5 Day 4: Coverage Lift, Edge Cases & Security Hardening

**Feature Branch**: `029-coverage-hardening`  
**Created**: 2025-11-11  
**Status**: Draft  
**Input**: User description: "Week 5 Day 4: Coverage Lift, Edge Cases & Security Hardening - Expand negative testing for edge cases, achieve ≥70% API coverage, and ensure security CI checks are clean"

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Negative Path Testing for Expense Endpoints (Priority: P1)

QA engineers and developers need comprehensive negative path test coverage for all expense API endpoints to identify and prevent invalid states and error conditions from reaching production.

**Why this priority**: This is critical for ensuring the API is hardened against invalid inputs and edge cases. Negative testing is foundational to security and reliability.

**Independent Test**: Can be fully tested by running supertest integration tests against expense endpoints with invalid inputs (malformed dates, zero/negative amounts, empty categories, non-existent IDs). Tests pass if all endpoints properly validate inputs and return appropriate HTTP error responses.

**Acceptance Scenarios**:

1. **Given** POST /expenses endpoint exists, **When** a request is sent with invalid date format (e.g., "2024-13-45"), **Then** the API returns HTTP 400 Bad Request with validation error message
2. **Given** POST /expenses endpoint exists, **When** a request is sent with empty category field, **Then** the API returns HTTP 400 Bad Request
3. **Given** POST /expenses endpoint exists, **When** a request is sent with amount=0 or negative amount, **Then** the API returns HTTP 400 Bad Request with appropriate error message
4. **Given** GET /expenses/summary endpoint exists, **When** a request is sent with invalid query parameter (e.g., month=13), **Then** the API returns HTTP 400 Bad Request
5. **Given** GET /expenses/{id} endpoint exists, **When** a request is sent with non-existent ID, **Then** the API returns HTTP 404 Not Found

---

### User Story 2 - Coverage Gap Analysis and Closure (Priority: P1)

Development teams need to identify and close all coverage gaps in the API codebase to meet the ≥70% coverage floor, focusing on error paths and edge case handling that were previously untested.

**Why this priority**: Coverage is a leading indicator of code quality and test completeness. The 70% threshold ensures critical paths and error handling are properly tested. This directly impacts API reliability in production.

**Independent Test**: Can be fully tested by running `npm test -- --coverage`, analyzing the coverage report for modules/functions below 70%, adding unit tests to cover gaps (validators, mappers, error handlers), and re-running coverage until all modules meet the 70% threshold. Test passes when coverage report shows all lines/functions/branches at ≥70%.

**Acceptance Scenarios**:

1. **Given** npm test suite with coverage flag runs, **When** coverage report is generated, **Then** all lines of code have ≥70% coverage
2. **Given** npm test suite with coverage flag runs, **When** coverage report is generated, **Then** all functions have ≥70% coverage
3. **Given** npm test suite with coverage flag runs, **When** coverage report is generated, **Then** all branches have ≥70% coverage
4. **Given** vitest.config.ts is updated, **When** tests run, **Then** test suite fails if coverage drops below 70% thresholds

---

### User Story 3 - Security CI Pipeline Validation (Priority: P1)

DevOps engineers and security teams need to verify that all security-related CI jobs (CodeQL and Dependency Review) are running cleanly and passing without high or critical vulnerabilities.

**Why this priority**: Security CI checks are non-negotiable for production readiness. High vulnerabilities in dependencies or code quality issues detected by CodeQL create unacceptable security risks and must be resolved before merge.

**Independent Test**: Can be fully tested by reviewing GitHub Actions CI/CD logs for the CodeQL and Dependency Review jobs, confirming both jobs complete successfully with no high/critical vulnerabilities reported. Test passes when all security CI jobs show green status with no vulnerability findings.

**Acceptance Scenarios**:

1. **Given** CodeQL CI job runs on pull request, **When** the job completes, **Then** no high or critical vulnerabilities are reported
2. **Given** Dependency Review CI job runs on pull request, **When** the job completes, **Then** no high or critical vulnerabilities are reported in dependencies
3. **Given** PR is ready for merge, **When** all CI jobs are reviewed, **Then** all security-related jobs show passing status

---

### Edge Cases

- What happens when POST /expenses receives a date in future tense (e.g., next year)?
- What happens when POST /expenses receives amount as string instead of number?
- What happens when GET /expenses/summary receives month=0 or month > 12?
- What happens when GET /expenses/{id} receives a string instead of numeric ID?
- What happens when POST /expenses receives a very large amount (exceeds number limits)?
- How does the system handle concurrent requests to the same endpoints?
- What happens when category field contains only whitespace?
- How does error handling behave when validators throw unexpected exceptions?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: API MUST validate POST /expenses request date format and reject invalid formats with HTTP 400 response
- **FR-002**: API MUST validate POST /expenses request category field is not empty and reject empty values with HTTP 400 response
- **FR-003**: API MUST validate POST /expenses request amount is positive (> 0) and reject zero or negative amounts with HTTP 400 response
- **FR-004**: API MUST validate GET /expenses/summary query parameters (e.g., month between 1-12) and reject invalid values with HTTP 400 response
- **FR-005**: API MUST return HTTP 404 Not Found when GET /expenses/{id} is called with a non-existent ID
- **FR-006**: Test suite MUST include integration tests using supertest for all negative paths and edge cases
- **FR-007**: vitest.config.ts MUST enforce ≥70% coverage threshold for lines, functions, and branches
- **FR-008**: Test suite MUST fail if coverage drops below 70% thresholds
- **FR-009**: CodeQL CI job MUST run and pass without reporting high or critical code vulnerabilities
- **FR-010**: Dependency Review CI job MUST run and pass without reporting high or critical dependency vulnerabilities
- **FR-011**: All error handling code paths MUST be tested to ensure proper error messages are returned to clients

### Key Entities

- **Expense Record**: Represents a single expense entry with required fields (date, category, amount) validated through multiple layers
- **Validation Error Response**: Contains HTTP status codes (400, 404) and error messages describing what validation failed
- **Coverage Metrics**: Includes line coverage, function coverage, and branch coverage tracked across the entire test suite

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All integration tests for negative paths and edge cases execute successfully and pass (100% test pass rate)
- **SC-002**: API coverage reaches and maintains ≥70% for lines, functions, and branches as verified by coverage report
- **SC-003**: vitest.config.ts enforces 70% coverage threshold and test suite fails if coverage drops below threshold
- **SC-004**: CodeQL CI job completes successfully with no high or critical vulnerabilities reported
- **SC-005**: Dependency Review CI job completes successfully with no high or critical vulnerabilities in dependencies
- **SC-006**: All error handling paths are covered by tests (no error-path code remains untested)
- **SC-007**: PR passes all CI checks including Test & Coverage, CodeQL, and Dependency Review before merge

### Assumptions

- The existing expense API endpoints (POST /expenses, GET /expenses/summary, GET /expenses/{id}) are already implemented
- Supertest is already configured for integration testing in the test suite
- vitest is the test framework and coverage tool in use
- GitHub Actions is the CI/CD platform with CodeQL and Dependency Review jobs already configured
- The team has access to modify vitest.config.ts configuration
