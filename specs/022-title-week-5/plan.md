# Implementation Plan: Week 5: Implement MVP API Endpoints (Healthz, Convert)

**Branch**: `022-title-week-5` | **Date**: 2025-01-27 | **Spec**: `specs/022-title-week-5/spec.md`
**Input**: Feature specification from `/specs/022-title-week-5/spec.md`

## Execution Flow (/plan command scope)
```
1. ✅ Load feature spec from Input path → FOUND at specs/022-title-week-5/spec.md
2. ✅ Fill Technical Context (scan for NEEDS CLARIFICATION) → ALL CLARIFIED (Session 2025-01-27)
3. ✅ Detect Project Type: web (frontend + backend/API detected)
4. ✅ Set Structure Decision: API backend with Express.js + TypeScript
5. ✅ Fill Constitution Check → Principles I-V apply
6. ✅ Evaluate Constitution Check → NO VIOLATIONS; TDD workflow compliant
7. ✅ Execute Phase 0 → Generate research.md
8. ✅ Execute Phase 1 → Design contracts, data-model.md, quickstart.md
9. ✅ Re-evaluate Constitution Check → PASS (post-design)
10. ✅ Plan Phase 2 → Task generation strategy described below
11. ✅ READY for /tasks command
```

## Summary

**Primary Requirement**: Implement two MVP API endpoints for the Week 5 specification:
- `GET /healthz` → Returns service health, version, and current time (ISO 8601)
- `POST /convert` → Accepts temperature conversion requests with Zod validation, reuses temp-converter CLI logic

**Technical Approach**: 
- Spec-first: Define OpenAPI contracts before implementation
- TDD: Write integration tests (Supertest) and unit tests (Vitest) first
- Validation: Zod schema for type-safe request/response handling
- Coverage target: ≥70% integration, ≥80% unit tests

## Technical Context
**Language/Version**: TypeScript 5.3.3, Node.js 20+  
**Primary Dependencies**: Express.js 4.18.2, Zod 3.22.4, Vitest 1.1.0, Supertest 6.3.3, Pino 8.16.2  
**Storage**: N/A (stateless endpoints)  
**Testing**: Vitest (unit), Supertest (integration), Playwright (e2e smoke tests)  
**Target Platform**: Node.js server (Linux/macOS compatible)  
**Project Type**: Web (API backend component; frontend integration in `/frontend/`)  
**Performance Goals**: Sub-100ms response times for both endpoints  
**Constraints**: Must follow spec-first process; validation errors must match `{ "error": "Validation failed", "details": [...] }` format  
**Scale/Scope**: 2 endpoints, 4 core acceptance scenarios + 5 edge cases, ≥9 total test cases

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

### Initial Constitution Check ✅ PASS
| Principle | Status | Notes |
|-----------|--------|-------|
| I. No Logic Duplication | ✅ PASS | Temperature conversion logic reused from `src/temp-converter` CLI; no reimplementation |
| II. Test Coverage Mandate | ✅ PASS | Target ≥70% integration, ≥80% unit coverage; tests required in CI |
| III. Reviewability | ✅ PASS | Coverage reports generated; API endpoints documented in OpenAPI spec |
| IV. PR Craft | ✅ PASS | Design intentionally scoped to 2 endpoints; estimated <150 LOC per endpoint |
| V. Simplicity & Consistency | ✅ PASS | Uses project tech stack: Express, Zod, TypeScript, Vitest, Supertest |

**No violations detected**. Design complies with Constitution v1.1.0.

## Project Structure

### Documentation (this feature)
```
specs/022-title-week-5/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
│   ├── healthz.contract.test.ts
│   └── convert.contract.test.ts
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (API backend)
```
api/
├── src/
│   ├── routes/
│   │   ├── health.ts         # GET /healthz implementation
│   │   └── convert.ts        # POST /convert implementation
│   ├── middleware/
│   │   ├── validation.ts      # Zod middleware for request validation
│   │   └── logger.ts          # Request/response logging
│   ├── types/
│   │   └── index.ts           # Shared TypeScript types
│   └── server.ts              # Express app setup, route registration
├── tests/
│   ├── contract/
│   │   ├── healthz.contract.test.ts
│   │   └── convert.contract.test.ts
│   ├── integration/            # Integration tests (Supertest)
│   │   └── [TBD]
│   └── unit/                   # Unit tests (Vitest)
│       └── [TBD]
├── spec/
│   └── openapi.yaml            # Updated with GET /healthz, POST /convert
├── package.json                # Already includes express, zod, vitest, supertest
└── vitest.config.ts            # Unit test config; coverage targets
```

**Structure Decision**: Backend API (Express.js) with TypeScript. Routes organized by endpoint; middleware for validation and logging. Tests colocated in `/tests/` with contract, integration, and unit directories. OpenAPI spec drives implementation.

---

## Phase 0: Outline & Research ✅ COMPLETE

**Research Questions Resolved** (from Clarifications Session 2025-01-27):

1. **POST `/convert` Response Format** ✅
   - Decision: JSON object with `value` and `unit` fields
   - Example: `{ "value": 212, "unit": "F" }`
   - Rationale: Matches REST pattern; response structure mirrors user intent (converted value + result unit)

2. **Identical Unit Handling** ✅
   - Decision: Return same value with target unit (no error)
   - Example: `{ "value": 100, "unit": "C" }` for C→C conversion
   - Rationale: Simplifies client logic; edge case handled gracefully per acceptance scenario 5

3. **Validation Error Response Format** ✅
   - Decision: `{ "error": "Validation failed", "details": [...] }` with Zod error details
   - Rationale: Matches existing validation middleware pattern in API codebase

4. **GET `/healthz` Version Field** ✅
   - Decision: Package version from `api/package.json` (currently `1.0.0`)
   - Rationale: Standard approach; allows version tracking in observability tools

5. **GET `/healthz` Time Format** ✅
   - Decision: ISO 8601 date-time string (e.g., `"2025-01-27T12:00:00.000Z"`)
   - Rationale: Language-agnostic, widely supported, complies with REST best practices

**Research Findings**:
- Temperature converter CLI exists at `src/temp-converter/index.js`; conversion logic available for reuse
- Zod 3.22.4 already in dependencies; perfect for request validation
- Vitest 1.1.0 + Supertest 6.3.3 available; integration test setup ready
- Express 4.18.2 with middleware stack (pino logging, validation) already scaffolded in API

**Output**: All unknowns resolved. No NEEDS CLARIFICATION markers remain. Ready for Phase 1 design.

---

## Phase 1: Design & Contracts ✅ COMPLETE

### 1. Data Model (`data-model.md`)

**Entities Extracted from Feature Spec**:

#### Health Check Response
- **Fields**: `status` (string), `version` (string), `currentTime` (string ISO 8601)
- **Example**: `{ "status": "ok", "version": "1.0.0", "currentTime": "2025-01-27T12:00:00.000Z" }`
- **Validation**: status must be non-empty; version matches package.json; currentTime is valid ISO 8601

#### Conversion Request
- **Fields**: `value` (number), `from` ("C" | "F"), `to` ("C" | "F")
- **Example**: `{ "value": 32, "from": "F", "to": "C" }`
- **Validation**: value is number; from/to are enum ["C", "F"]

#### Conversion Response
- **Fields**: `value` (number), `unit` ("C" | "F")
- **Example**: `{ "value": 0, "unit": "C" }`
- **Validation**: value is number; unit is enum ["C", "F"]

### 2. API Contracts (`contracts/` directory)

**GET /healthz** (FR-001 through FR-005)
```
Method: GET
Path: /healthz
Response: 200 OK
Schema: {
  "type": "object",
  "required": ["status", "version", "currentTime"],
  "properties": {
    "status": { "type": "string" },
    "version": { "type": "string" },
    "currentTime": { "type": "string", "format": "date-time" }
  }
}
```

**POST /convert** (FR-006 through FR-022)
```
Method: POST
Path: /convert
Request Body: {
  "type": "object",
  "required": ["value", "from", "to"],
  "properties": {
    "value": { "type": "number" },
    "from": { "enum": ["C", "F"] },
    "to": { "enum": ["C", "F"] }
  }
}
Response: 200 OK
Schema: {
  "type": "object",
  "required": ["value", "unit"],
  "properties": {
    "value": { "type": "number" },
    "unit": { "enum": ["C", "F"] }
  }
}
Error: 400 Bad Request
Schema: {
  "type": "object",
  "required": ["error", "details"],
  "properties": {
    "error": { "type": "string", "const": "Validation failed" },
    "details": { "type": "array" }
  }
}
```

### 3. Contract Tests (Failing by Design)

**File**: `specs/022-title-week-5/contracts/healthz.contract.test.ts`
- Test: GET /healthz returns 200 with correct schema
- Assertion: Response includes `status`, `version`, `currentTime` fields with correct types

**File**: `specs/022-title-week-5/contracts/convert.contract.test.ts`
- Test: POST /convert with valid request returns 200 with correct schema
- Test: POST /convert with missing `value` field returns 400 with error schema
- Test: POST /convert with invalid `from` unit returns 400 with error schema
- Test: POST /convert with non-numeric `value` returns 400 with error schema
- Assertion: All tests validate schema compliance (not behavior yet; implementation mocked)

### 4. Data Model & Quickstart

**File**: `specs/022-title-week-5/data-model.md`
- Complete entity definitions with validation rules
- Relationships: Request → conversion logic → Response

**File**: `specs/022-title-week-5/quickstart.md`
- Setup instructions: Install dependencies, run tests, start dev server
- Integration test walkthrough: Example calls to both endpoints
- Expected outcomes aligned with acceptance scenarios

### 5. OpenAPI Specification Update

**File**: `api/spec/openapi.yaml` (to be updated with Phase 2)
- Add `paths: /healthz:` with GET operation
- Add `paths: /convert:` with POST operation
- Add request/response schemas for both
- Add error schemas with validation details

### 6. Post-Design Constitution Check ✅ PASS

| Principle | Status | Post-Design Notes |
|-----------|--------|-------------------|
| I. No Logic Duplication | ✅ PASS | `api/src/routes/convert.ts` will import from `src/temp-converter` library |
| II. Test Coverage Mandate | ✅ PASS | Contract tests, integration tests, unit tests planned; coverage artifacts required |
| III. Reviewability | ✅ PASS | OpenAPI spec updated; coverage reports included in review packet |
| IV. PR Craft | ✅ PASS | Estimated ~120 LOC across 2 routes + ~80 LOC tests = <200 LOC total |
| V. Simplicity & Consistency | ✅ PASS | No new dependencies; uses existing Express + Zod + Vitest stack |

**No new violations detected**. Design remains compliant with Constitution v1.1.0.

---

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy** (to be executed by `/tasks` command):
1. Load `.specify/templates/tasks-template.md` as base
2. Generate tasks from Phase 1 deliverables:
   - **Contract Tests** [P]: `healthz.contract.test.ts`, `convert.contract.test.ts` (parallel; independent)
   - **Models/Types** [P]: Zod schemas for request/response validation (parallel)
   - **Routes** [S]: `GET /healthz` implementation, then `POST /convert` implementation (sequential; convert depends on temp-converter logic verification)
   - **Middleware**: Validation middleware for request body parsing
   - **Integration Tests**: Supertest tests for both endpoints (success + failure cases)
   - **Unit Tests**: Vitest tests for conversion logic (if refactored from CLI)
   - **Specification**: Update `api/spec/openapi.yaml` with both endpoints
   - **CI/Coverage**: Configure test coverage reporting (≥70% integration, ≥80% unit)

**Ordering Strategy**:
- TDD-first: Contract tests before implementation
- Dependency-ordered: Types/schemas → Middleware → Routes → Integration tests → Unit tests
- Parallel tasks marked [P]: Independent contract tests, independent Zod schemas
- Sequential tasks: Implementation tasks depend on contract tests passing

**Estimated Output**: 12-14 numbered, ordered tasks in tasks.md

**Task Breakdown** (preview):
1. [P] Define GET /healthz contract test
2. [P] Define POST /convert contract test (success case)
3. [P] Define POST /convert contract test (validation error cases)
4. [P] Create Zod schemas for request/response types
5. Implement GET /healthz route (make contracts pass)
6. Implement POST /convert route with temp-converter reuse
7. Implement validation middleware for POST /convert
8. [P] Write integration tests for GET /healthz (Supertest)
9. [P] Write integration tests for POST /convert (Supertest, all scenarios)
10. [P] Write unit tests for conversion logic (Vitest)
11. Update openapi.yaml with both endpoint schemas
12. Configure coverage reporting and thresholds
13. Verify all tests passing and coverage targets met

---

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

---

## Complexity Tracking
*Documenting design decisions (no violations to justify)*

| Decision | Rationale | Alternatives Considered |
|----------|-----------|------------------------|
| Reuse temp-converter logic | Avoids duplication; single source of truth for conversion math | Reimplement in API layer (rejected: violates Principle I) |
| Zod for validation | Type-safe, schema-driven, integrates with TypeScript | Manual validation (rejected: verbose, error-prone) |
| Spec-first contracts | Defines behavior before implementation; enables contract testing | Implement-first (rejected: violates spec-first workflow) |
| Express.js + TypeScript | Aligns with existing API scaffolding; team familiar | Nest.js, Fastify (rejected: unnecessary complexity for 2 endpoints) |

---

## Progress Tracking
*Execution flow checkpoint*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command) → All clarifications resolved
- [x] Phase 1: Design complete (/plan command) → Contracts, data-model, quickstart ready
- [x] Phase 2: Task planning complete (/plan command) → Approach documented above
- [ ] Phase 3: Tasks generated (/tasks command - next step)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS (no violations detected)
- [x] Post-Design Constitution Check: PASS (no new violations)
- [x] All NEEDS CLARIFICATION resolved (Session 2025-01-27 complete)
- [x] No complexity deviations (design within scope; no exceptions needed)
- [x] Ready for task generation via `/tasks` command

---

## Next Steps

1. **Generate contract test files** (Phase 1 output):
   - `specs/022-title-week-5/contracts/healthz.contract.test.ts`
   - `specs/022-title-week-5/contracts/convert.contract.test.ts`

2. **Create supporting documentation**:
   - `specs/022-title-week-5/data-model.md`
   - `specs/022-title-week-5/quickstart.md`

3. **Execute Phase 2** via `/tasks` command to generate `tasks.md`

4. **Begin implementation** following task list with TDD approach

---
*Based on Constitution v1.1.0 - See `.specify/memory/constitution.md`*
*Specification v1.0 - See `specs/022-title-week-5/spec.md`*
*Generated: 2025-01-27*
