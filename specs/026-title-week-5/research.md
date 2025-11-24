# Research: Week 5 Day 1 - API Spec & Contracts First (Expenses)

**Date**: 2025-11-06  
**Feature**: Week 5 Day 1: API Spec & Contracts First (Expenses)

## Research Findings

### 1. OpenAPI Specification Location

**Decision**: Create/update OpenAPI spec at both `api/spec/openapi.yaml` (existing location) and `specs/core/openapi.yaml` (per spec requirement FR-001).

**Rationale**: 
- Existing API project uses `api/spec/openapi.yaml` (already exists with some endpoints)
- Spec requirement FR-001 explicitly requires `/specs/core/openapi.yaml`
- Both locations should be kept in sync or one should reference the other

**Alternatives Considered**:
- Single location only: Rejected - spec explicitly requires `/specs/core/openapi.yaml`
- Symlink: Could work but adds complexity
- Copy during CI: Chosen approach - maintain source at `api/spec/openapi.yaml`, copy to `specs/core/openapi.yaml` in CI

### 2. Pagination Pattern for GET /expenses

**Decision**: Use page-based pagination with `page` and `pageSize` query parameters.

**Rationale**:
- Common REST API pattern, easy to understand
- Matches OpenAPI standard pagination examples
- Simple to implement and test

**Alternatives Considered**:
- Offset-based (`offset`/`limit`): More flexible but less intuitive
- Cursor-based: Better for large datasets but more complex
- Page-based: Chosen for simplicity and clarity

### 3. Error Envelope Schema Design

**Decision**: Create shared Error Envelope schema with fields: `code` (string), `message` (string), `details` (object/array), `requestId` (string, optional).

**Rationale**:
- Standard error response format across all endpoints
- Includes request-id correlation support (FR-006)
- Supports structured error details for validation errors
- Compatible with existing error response patterns

**Alternatives Considered**:
- Simple error object: Too limited for detailed validation errors
- Nested error structure: Chosen for flexibility and clarity

### 4. Request-ID Header Handling

**Decision**: Define `request-id` as optional request header (string, UUID format preferred but not required).

**Rationale**:
- Optional header allows clients to provide correlation ID
- System can generate one if not provided (implementation detail, not spec concern)
- Echoed in error responses for correlation

**Alternatives Considered**:
- Required header: Too restrictive, breaks backward compatibility
- Optional header: Chosen for flexibility

### 5. OpenAPI Documentation Generation Tool

**Decision**: Use Redoc CLI for generating OpenAPI HTML documentation.

**Rationale**:
- Redoc is widely used, well-maintained, and generates standalone HTML
- Can run in CI environment (Node.js based)
- Supports OpenAPI 3.1.x
- Generates beautiful, interactive documentation

**Alternatives Considered**:
- Scalar: Also good option, but Redoc has more CI integration examples
- Swagger UI: Requires server, not standalone HTML
- Redoc: Chosen for standalone HTML generation and CI compatibility

### 6. Contract Test Framework

**Decision**: Use supertest (already in dependencies) for HTTP contract tests.

**Rationale**:
- Already included in `api/package.json` devDependencies
- Standard tool for Express API testing
- Can make HTTP requests and validate responses
- Integrates with Vitest test runner

**Alternatives Considered**:
- Manual fetch tests: More verbose, less maintainable
- Supertest: Chosen - already available and standard

### 7. Spec-Check CI Job Implementation

**Decision**: Create `.github/workflows/spec-check.yml` that validates OpenAPI spec using `@apidevtools/swagger-cli` or `swagger-parser`.

**Rationale**:
- Need to validate OpenAPI syntax and schema correctness
- Standard tools available for OpenAPI validation
- Can run as required status check

**Alternatives Considered**:
- Custom validation script: More maintenance overhead
- Standard OpenAPI validator: Chosen for reliability

### 8. Contract Test Initial Failure Strategy

**Decision**: Write contract tests that make HTTP requests to endpoints that don't exist yet, expecting 404 or connection errors.

**Rationale**:
- Confirms spec-first approach (tests written before implementation)
- Tests will fail until handlers are implemented
- Clear indication that endpoints need to be built

**Alternatives Considered**:
- Mock tests: Defeats purpose of contract testing
- Real HTTP tests to non-existent endpoints: Chosen - validates spec-first workflow

## Summary

All technical decisions resolved. Ready to proceed with Phase 1 design and contract generation.


