# Phase 0 Research: Week 5 API Endpoints

**Feature**: Implement MVP API Endpoints (GET /healthz, POST /convert)  
**Branch**: 022-title-week-5  
**Date**: 2025-01-27  
**Status**: Complete

---

## Executive Summary

All research questions from the feature specification have been resolved through the Clarifications Session (2025-01-27). The feature is well-defined with concrete API contracts, validation schemas, and response formats. All technological decisions are aligned with existing project infrastructure (Express.js, Zod, Vitest, Supertest).

**Key Finding**: Temperature conversion logic is already available in `src/temp-converter/` CLI application and can be cleanly reused in the API layer, eliminating code duplication.

---

## Research Questions & Resolutions

### 1. API Response Formats

**Q1: What should the POST `/convert` response body structure be?**
- **Decision**: JSON object with `value` and `unit` fields
- **Example**: `{ "value": 212, "unit": "F" }`
- **Rationale**: RESTful pattern; response structure mirrors user intent (converted value + result unit)
- **Source**: Feature spec clarifications, line 47

**Q2: How should POST `/convert` handle identical source and target units?**
- **Decision**: Return the same value with target unit (no error thrown)
- **Example**: `{ "value": 100, "unit": "C" }` when converting C→C
- **Rationale**: Simplifies client error handling; edge case per acceptance scenario 5
- **Source**: Feature spec clarifications, line 48

**Q3: What should the validation error response format be for POST `/convert`?**
- **Decision**: `{ "error": "Validation failed", "details": [...] }` with Zod error details
- **Example**: `{ "error": "Validation failed", "details": [{ "field": "value", "message": "Expected number" }] }`
- **Rationale**: Matches existing validation middleware pattern in API codebase; Zod errors included for debugging
- **Source**: Feature spec clarifications, line 49

### 2. Health Check Endpoint Fields

**Q4: For GET `/healthz`, what should the `version` field contain?**
- **Decision**: Package version from `api/package.json` (currently `1.0.0`)
- **Rationale**: Industry standard; enables version tracking in observability tools; semantic versioning support
- **Alternatives Considered**: 
  - Hardcoded version string (rejected: maintenance burden)
  - Git commit SHA (rejected: runtime dependency on git)
- **Source**: Feature spec clarifications, line 50

**Q5: What format should the `currentTime` field use in GET `/healthz`?**
- **Decision**: ISO 8601 date-time string (e.g., `"2025-01-27T12:00:00.000Z"`)
- **Rationale**: Language-agnostic; widely supported across client libraries; UTC timezone eliminates ambiguity
- **Alternatives Considered**:
  - Unix timestamp (rejected: less human-readable for debugging)
  - RFC 2822 format (rejected: less standard for REST APIs)
- **Source**: Feature spec clarifications, line 51

### 3. Technology Stack Decisions

**Q6: How should request validation be implemented?**
- **Decision**: Zod schema validation with middleware
- **Rationale**: 
  - Already in `api/package.json` dependencies (v3.22.4)
  - Type-safe; integrates with TypeScript
  - Clean error formatting (available for Zod)
  - Minimal runtime overhead
- **Alternatives Considered**:
  - Manual validation (rejected: verbose, error-prone)
  - Class-validator (rejected: unnecessary; Zod already present)
- **Verification**: Confirmed in `/api/package.json` line 19

**Q7: Which testing frameworks should be used?**
- **Decision**: 
  - **Unit Tests**: Vitest 1.1.0 (with coverage)
  - **Integration Tests**: Supertest 6.3.3
- **Rationale**: 
  - Both in `api/package.json` devDependencies
  - Vitest: Fast execution, TypeScript support out-of-box
  - Supertest: HTTP assertion library designed for Express.js
  - Aligned with project-wide testing strategy
- **Verification**: Confirmed in `/api/package.json` lines 29, 33

**Q8: Should temperature conversion logic be reimplemented?**
- **Decision**: NO - Reuse existing CLI logic from `src/temp-converter/`
- **Rationale**: 
  - Single source of truth for conversion algorithm
  - Follows Constitutional Principle I (No Logic Duplication)
  - Existing implementation battle-tested
  - Reduces bugs and maintenance
- **Verification**: Conversion utility exists at `src/temp-converter/index.js`
- **Integration Approach**: 
  - Extract pure conversion function from CLI
  - Export as library function
  - Import in `api/src/routes/convert.ts`

### 4. API Specification & Documentation

**Q9: How should endpoints be specified?**
- **Decision**: OpenAPI 3.1.0 specification (YAML)
- **Rationale**: 
  - Standard format; wide tooling support
  - Existing `api/spec/openapi.yaml` in place
  - Enables contract testing and documentation generation
  - Aligns with spec-first process
- **Verification**: Confirmed at `/api/spec/openapi.yaml`

---

## Technology Stack Confirmation

| Component | Technology | Version | Status | Verification |
|-----------|-----------|---------|--------|--------------|
| Runtime | Node.js | 20+ (LTS) | ✅ Confirmed | package.json engines (if set) |
| Language | TypeScript | 5.3.3 | ✅ Confirmed | `/api/package.json:35` |
| Web Framework | Express.js | 4.18.2 | ✅ Confirmed | `/api/package.json:18` |
| Validation | Zod | 3.22.4 | ✅ Confirmed | `/api/package.json:19` |
| Logging | Pino + pino-http | 8.16.2 + 8.5.0 | ✅ Confirmed | `/api/package.json:20-21` |
| Unit Testing | Vitest | 1.1.0 | ✅ Confirmed | `/api/package.json:29` |
| Integration Testing | Supertest | 6.3.3 | ✅ Confirmed | `/api/package.json:33` |
| Coverage | @vitest/coverage-v8 | 1.1.0 | ✅ Confirmed | `/api/package.json:28` |
| Linting | ESLint + @typescript-eslint | 8.56.0 + 6.15.0 | ✅ Confirmed | `/api/package.json:30-31` |

---

## Existing Infrastructure Assessment

### ✅ API Scaffolding Already in Place
- Express.js server structure established (`api/src/server.ts`)
- Middleware system in place (logger, validation)
- TypeScript configuration complete (`api/tsconfig.json`)
- Vitest configuration ready (`api/vitest.config.ts`)
- OpenAPI spec template started (`api/spec/openapi.yaml` with GET /health)

### ✅ Reusable Components Available
- **Temperature Conversion Logic**: `src/temp-converter/index.js`
  - CLI application with argument parsing
  - Pure conversion function exportable
  - Test coverage exists in parent project
- **Package Metadata**: `api/package.json`
  - Version field accessible at runtime (`require('./package.json').version` or ESM equivalent)
  - Stable; updated only during releases

### ✅ Project Standards Aligned
- **Constitutional Principles**: Design complies with all 5 principles
- **Tech Stack**: No new dependencies required
- **Testing Strategy**: TDD workflow supported by existing test infrastructure
- **CI/CD**: GitHub Actions integration available for coverage reporting

---

## Dependencies Analysis

### Direct Dependencies
```json
{
  "express": "^4.18.2",          // Web framework
  "zod": "^3.22.4",              // Request validation
  "pino": "^8.16.2",             // Structured logging
  "pino-http": "^8.5.0"          // HTTP request logging
}
```

### Dev Dependencies (for testing/quality)
```json
{
  "@types/express": "^4.17.21",            // TypeScript types
  "@types/node": "^20.10.6",               // Node.js types
  "@types/supertest": "^2.0.16",           // Supertest types
  "@vitest/coverage-v8": "^1.1.0",         // Coverage reporting
  "supertest": "^6.3.3",                   // HTTP assertions
  "vitest": "^1.1.0"                       // Unit test framework
}
```

**No new dependencies required**. All technologies present and compatible.

---

## Architectural Decisions

### 1. Request Validation Strategy
- **Approach**: Schema-based validation at route handler entry point
- **Implementation**: Zod schema middleware or inline validation
- **Error Handling**: Validation errors caught → formatted as `{ "error": "Validation failed", "details": [...] }` → HTTP 400 response
- **Benefit**: Type-safe; automatic error formatting; reusable schemas

### 2. Conversion Logic Reuse
- **Approach**: Extract pure function from `src/temp-converter` CLI
- **Exposure**: Export as library function (e.g., `export function convertTemperature(value, from, to)`)
- **Integration**: Import in `api/src/routes/convert.ts`
- **Benefit**: Single source of truth; DRY principle; consistent behavior across CLI + API

### 3. Test Organization
- **Unit Tests**: Test conversion logic in isolation (Vitest)
- **Integration Tests**: Test endpoint contracts with realistic HTTP calls (Supertest)
- **Contract Tests**: Verify request/response schemas match OpenAPI spec
- **Coverage Targets**: 
  - Unit: ≥80% (core logic)
  - Integration: ≥70% (endpoint behavior + error handling)

### 4. Specification-First Process
- **Step 1**: Define endpoints in OpenAPI spec
- **Step 2**: Write contract tests (assert schema compliance)
- **Step 3**: Implement routes to pass contracts
- **Step 4**: Extend with integration tests
- **Benefit**: Contract acts as executable specification; tests drive implementation

---

## Risk Assessment & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Temp-converter logic differs between CLI and API | Low | High | Extract pure function; test equivalence in unit tests |
| Zod validation errors unclear for clients | Low | Medium | Document error format in OpenAPI spec; include examples |
| Coverage targets unmet | Medium | Medium | TDD approach; early unit/integration test creation |
| Identical unit conversion edge case | Low | Low | Acceptance scenario 5 explicitly handles; simple logic (return value as-is) |

---

## Blockers & Dependencies

**None identified**. 

All required infrastructure (tech stack, tooling, existing logic) is in place. Feature is ready for Phase 1 design.

---

## Recommendations for Implementation

1. **Extract Temperature Conversion Function**
   - Create `api/src/services/converter.ts` with clean function signature
   - Import temp-converter logic; wrap in type-safe interface
   - Test equivalence with CLI output

2. **Establish Middleware Pattern**
   - Reuse validation middleware from `api/src/middleware/validation.ts`
   - Ensure Zod error details are formatted per spec

3. **Use TDD Strictly**
   - Contract tests first (assert schema)
   - Integration tests next (assert behavior)
   - Unit tests for conversion logic (assert math)

4. **Version Management**
   - Read package version at runtime (e.g., `import pkg from './package.json'`)
   - Ensure version matches actual release version

5. **Logging & Observability**
   - Use pino logger for request/response tracking
   - Include operation ID for tracing

---

## References

- **Feature Spec**: `specs/022-title-week-5/spec.md`
- **Constitution**: `.specify/memory/constitution.md` (v1.1.0)
- **Existing API Code**: `api/src/server.ts`, `api/src/routes/health.ts`
- **Existing CLI Logic**: `src/temp-converter/index.js`
- **OpenAPI Spec**: `api/spec/openapi.yaml`

---

**Status**: ✅ **COMPLETE** - All research questions resolved. Ready for Phase 1 design.

