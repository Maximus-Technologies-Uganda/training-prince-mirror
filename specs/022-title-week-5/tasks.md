# Tasks: Week 5: Implement MVP API Endpoints (Healthz, Convert)

**Input**: Design documents from `specs/022-title-week-5/`  
**Feature**: Week 5: Implement MVP API Endpoints (Healthz, Convert)  
**Branch**: `022-title-week-5`  
**Status**: Ready for execution

---

## Phase 4.1: Specification & Contract Tests (TDD Foundation)

**CRITICAL: Specification-first workflow - contracts define behavior**

- [X] T001 [P] Create contract test `api/tests/contract/healthz.contract.test.ts` validating GET `/healthz` response schema matches OpenAPI spec (status, version, currentTime fields; must fail initially - no implementation)
- [X] T002 [P] Create contract test `api/tests/contract/convert.contract.test.ts` - success case validating POST `/convert` response schema matches OpenAPI spec (value, unit fields)
- [X] T003 [P] Create contract test `api/tests/contract/convert.contract.test.ts` - validation error cases (missing value, invalid from/to units, non-numeric value); must return HTTP 400 with error schema

---

## Phase 4.2: Type Definitions & Validation Schemas

**All types must be defined before implementation**

- [X] T004 [P] Create `api/src/types/index.ts` with TypeScript interfaces: `HealthCheckResponse`, `ConversionRequest`, `ConversionResponse`, `ValidationErrorResponse`
- [X] T005 [P] Create `api/src/schemas/index.ts` with Zod validation schemas: `HealthCheckResponseSchema`, `ConversionRequestSchema`, `ConversionResponseSchema` matching data-model.md
- [X] T006 [P] Create `api/src/middleware/validation.ts` with `validateBody` middleware that catches Zod validation errors and returns HTTP 400 with `{ error: "Validation failed", details: [...] }` format

---

## Phase 4.3: OpenAPI Specification Update

**Specification must be committed before implementation**

- [X] T007 Update `/api/spec/openapi.yaml` with GET `/healthz` endpoint definition including response schema (status, version, currentTime)
- [X] T008 Update `/api/spec/openapi.yaml` with POST `/convert` endpoint definition including request body schema (value, from, to) and response schema (value, unit)
- [X] T009 Update `/api/spec/openapi.yaml` with error response schema for POST `/convert` validation failures

---

## Phase 4.4: Temperature Conversion Logic (Reuse)

**CRITICAL: Reuse existing temp-converter logic per Constitutional Principle I (No Duplication)**

- [X] T010 Create `api/src/services/converter.ts` with `convertTemperature(value: number, from: "C" | "F", to: "C" | "F"): number` function
  - Import conversion logic from `src/temp-converter`
  - Handle identity conversion (from === to): return value unchanged
  - C→F: `(C × 9/5) + 32`
  - F→C: `(F - 32) × 5/9`
  - Export as library function

---

## Phase 4.5: Core Route Implementation (Make Contracts Pass)

**Routes must pass contract tests - implementation driven by specs**

- [X] T011 Implement GET `/healthz` route handler in `api/src/routes/healthz.ts`
  - Return status: "ok"
  - Return version: read from `api/package.json` at runtime
  - Return currentTime: ISO 8601 format (e.g., `"2025-01-27T12:00:00.000Z"`)
  - Must pass contract test T001

- [X] T012 Implement POST `/convert` route handler in `api/src/routes/convert.ts`
  - Accept JSON body via middleware validation (T006)
  - Call `convertTemperature(value, from, to)` from converter service
  - Return response: `{ value: converted, unit: to }`
  - Must pass contract test T002 (success case)

- [X] T013 Register both routes in `api/src/server.ts`
  - Mount `/healthz` GET handler
  - Mount `/convert` POST handler with validation middleware
  - Verify no routes added beyond these two

---

## Phase 4.6: Integration Tests (Full Endpoint Behavior)

**Test all acceptance scenarios and error cases**

- [X] T014 [P] Create `api/tests/integration/health.test.ts` with Supertest tests:
  - GET /healthz returns 200 with correct schema
  - Response includes all required fields (status, version, currentTime)
  - currentTime is valid ISO 8601 format

- [X] T015 [P] Create `api/tests/integration/convert.test.ts` - success cases (Supertest):
  - POST /convert with `{ value: 32, from: "F", to: "C" }` returns 200 with `{ value: 0, unit: "C" }`
  - POST /convert with `{ value: 0, from: "C", to: "F" }` returns 200 with `{ value: 32, unit: "F" }`
  - POST /convert with `{ value: 100, from: "C", to: "C" }` returns 200 with `{ value: 100, unit: "C" }` (identity)

- [X] T016 [P] Create `api/tests/integration/convert.test.ts` - validation error cases (Supertest):
  - POST /convert with missing `value` returns 400 with error schema
  - POST /convert with non-numeric `value` (e.g., string) returns 400 with error schema
  - POST /convert with invalid `from` unit (e.g., "K") returns 400 with error schema
  - POST /convert with invalid `to` unit returns 400 with error schema
  - All error responses include `error: "Validation failed"` and `details` array with Zod error info

---

## Phase 4.7: Unit Tests (Core Logic)

**Test conversion logic and validation schemas in isolation**

- [X] T017 [P] Create `api/tests/unit/converter.test.ts` with Vitest:
  - convertTemperature(32, "F", "C") = 0
  - convertTemperature(0, "C", "F") = 32
  - convertTemperature(100, "C", "C") = 100 (identity)
  - Negative values: convertTemperature(-40, "F", "C") = -40 (special point)
  - Decimal values: convertTemperature(98.6, "F", "C") ≈ 37.0

- [X] T018 [P] Create `api/tests/unit/schemas.test.ts` with Vitest:
  - ConversionRequestSchema accepts valid requests
  - ConversionRequestSchema rejects missing fields
  - ConversionRequestSchema rejects non-numeric value
  - ConversionRequestSchema rejects invalid units
  - ConversionResponseSchema accepts valid responses
  - HealthCheckResponseSchema accepts valid responses with semantic version

---

## Phase 4.8: Verification & Coverage

**Ensure all tests pass and coverage targets met**

- [X] T019 Run all contract tests: `npm run test -- tests/contract` (must pass; T001-T003)
- [X] T020 Run all integration tests: `npm run test -- tests/integration` (must pass; T014-T016)
- [X] T021 Run all unit tests: `npm run test -- tests/unit` (must pass; T017-T018)
- [X] T022 Run full test suite with coverage: `npm run test:coverage`
  - ✅ Achieved 80.61% overall coverage (exceeds ≥80% unit target)
  - ✅ Verified coverage report at `api/coverage/lcov.info` and `api/coverage/index.html`

- [X] T023 Verify TypeScript compilation: `npm run lint` (no errors)
- [X] T024 Verify development server starts: `npm run dev` → listen on port 3000
- [X] T025 Verify all acceptance scenarios work via quickstart.md walkthroughs

---

## Phase 4.9: CI/CD & Review Artifacts

**Integrate tests into CI and prepare review packet**

- [X] T026 Verify `.github/workflows/api-checks.yml` workflow runs successfully:
  - ✅ Lint checks pass
  - ✅ Unit tests pass with 80.61% coverage (exceeds ≥80% target)
  - ✅ Integration tests pass with 100% pass rate
  - ✅ All 102 tests passing

- [X] T027 Review packet generation verified:
  - ✅ Coverage reports at `api/coverage/lcov.info` and `api/coverage/index.html`
  - ✅ All test results passing (102/102)
  - ✅ OpenAPI spec updated with full endpoint documentation

---

## Dependency Graph

```
[T001, T002, T003, T004, T005, T006 in parallel] ⏱️
  ↓
T007 → T008 → T009 ⏱️
  ↓
T010 ⏱️
  ↓
[T011, T012, T013] → [T014, T015, T016, T017, T018 in parallel] ⏱️
  ↓
[T019, T020, T021, T022 in parallel] ⏱️
  ↓
[T023, T024, T025 in parallel] ⏱️
  ↓
T026 → T027
```

**Legend**: ⏱️ = Parallel execution checkpoint

---

## Parallel Execution Groups

### Group 1: Types & Schemas (Can run in parallel after T001)
```bash
Task: T004 T005 T006 (in parallel)
```
All three tasks only read from existing files; no interdependencies.

### Group 2: Route Implementation (Sequential after Group 1)
```bash
Task: T011 T012 (in sequence, both depend on T010)
Task: T013 (depends on T011 + T012)
```

### Group 3: Integration & Unit Tests (Parallel after Group 2)
```bash
Task: T014 T015 T016 T017 T018 (in parallel)
All tests are independent; different test files.
```

### Group 4: Verification (Parallel after Group 3)
```bash
Task: T019 T020 T021 T022 (in parallel)
All verification tasks read test results independently.
```

### Group 5: Final Validation (Parallel)
```bash
Task: T023 T024 T025 (in parallel)
Lint, dev server, and quickstart are independent verifications.
```

---

## Task Details Reference

### T001: Create Contract Test for GET /healthz
**File**: `api/tests/contract/healthz.contract.test.ts` (Create)  
**Duration**: ~15 min  
**Dependencies**: None (spec exists)  
**Parallel**: Yes [P]

Write failing contract test:
```typescript
// GET /healthz should return 200 with schema
// Assert response includes: status (string), version (string), currentTime (ISO 8601)
// Must FAIL initially (no implementation)
```

---

### T002: Create Contract Test for POST /convert (Success)
**File**: `api/tests/contract/convert.contract.test.ts` (Create)  
**Duration**: ~15 min  
**Dependencies**: None  
**Parallel**: Yes [P]

Write failing contract test for success case:
```typescript
// POST /convert { value: 32, from: "F", to: "C" } should return 200 with schema
// Assert response includes: value (number), unit (enum C|F)
// Must FAIL initially (no implementation)
```

---

### T003: Create Contract Test for POST /convert (Errors)
**File**: `api/tests/contract/convert.contract.test.ts` (Extend)  
**Duration**: ~15 min  
**Dependencies**: None  
**Parallel**: Yes [P]

Add failing contract tests for validation error cases:
```typescript
// Test missing value field → 400 with error schema
// Test invalid from unit → 400 with error schema
// Test invalid to unit → 400 with error schema
// Test non-numeric value → 400 with error schema
// All error responses must match: { error: "Validation failed", details: [...] }
```

---

### T004: Create Type Definitions
**File**: `api/src/types/index.ts` (Create)  
**Duration**: ~10 min  
**Dependencies**: None  
**Parallel**: Yes [P]

Define TypeScript interfaces (from data-model.md):
- `HealthCheckResponse` { status, version, currentTime }
- `ConversionRequest` { value, from, to }
- `ConversionResponse` { value, unit }
- `ValidationErrorResponse` { error, details }

---

### T005: Create Zod Validation Schemas
**File**: `api/src/schemas/index.ts` (Create)  
**Duration**: ~15 min  
**Dependencies**: None  
**Parallel**: Yes [P]

Define Zod schemas (from data-model.md):
- `HealthCheckResponseSchema` with validation rules
- `ConversionRequestSchema` with enum for units
- `ConversionResponseSchema` with enum for units
- Export all schemas

---

### T006: Create Validation Middleware
**File**: `api/src/middleware/validation.ts` (Create)  
**Duration**: ~15 min  
**Dependencies**: T005  
**Parallel**: Yes [P]

Implement `validateBody` middleware:
```typescript
export function validateBody(schema: z.ZodSchema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: result.error.errors.map(err => ({...}))
      });
    }
    req.body = result.data;
    next();
  };
}
```

---

### T007: Update OpenAPI Spec - GET /healthz
**File**: `api/spec/openapi.yaml` (Edit)  
**Duration**: ~10 min  
**Dependencies**: None

Add GET /healthz endpoint to OpenAPI spec:
```yaml
paths:
  /healthz:
    get:
      summary: Health Check
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HealthCheckResponse'
components:
  schemas:
    HealthCheckResponse:
      type: object
      required: [status, version, currentTime]
      properties:
        status: { type: string }
        version: { type: string, pattern: '^\d+\.\d+\.\d+$' }
        currentTime: { type: string, format: date-time }
```

---

### T008: Update OpenAPI Spec - POST /convert
**File**: `api/spec/openapi.yaml` (Edit)  
**Duration**: ~10 min  
**Dependencies**: T007

Add POST /convert endpoint to OpenAPI spec:
```yaml
paths:
  /convert:
    post:
      summary: Temperature Conversion
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ConversionRequest'
      responses:
        '200':
          description: Conversion successful
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ConversionResponse'
        '400':
          description: Validation failed
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ValidationErrorResponse'
components:
  schemas:
    ConversionRequest:
      type: object
      required: [value, from, to]
      properties:
        value: { type: number }
        from: { enum: [C, F] }
        to: { enum: [C, F] }
    ConversionResponse:
      type: object
      required: [value, unit]
      properties:
        value: { type: number }
        unit: { enum: [C, F] }
    ValidationErrorResponse:
      type: object
      required: [error, details]
      properties:
        error: { type: string, const: "Validation failed" }
        details: { type: array }
```

---

### T009: Update OpenAPI Spec - Error Schemas
**File**: `api/spec/openapi.yaml` (Edit)  
**Duration**: ~5 min  
**Dependencies**: T008

Ensure error response schemas document Zod error structure with code, path, and message.

---

### T010: Create Converter Service
**File**: `api/src/services/converter.ts` (Create)  
**Duration**: ~20 min  
**Dependencies**: None

Create temperature conversion function:
```typescript
export function convertTemperature(
  value: number,
  from: "C" | "F",
  to: "C" | "F"
): number {
  if (from === to) return value;
  if (from === "C" && to === "F") return (value * 9/5) + 32;
  if (from === "F" && to === "C") return (value - 32) * 5/9;
  throw new Error("Invalid units");
}
```

Extract logic from `src/temp-converter/index.js` if needed. Must handle all numeric inputs.

---

### T011: Implement GET /healthz Route
**File**: `api/src/routes/health.ts` (Create)  
**Duration**: ~15 min  
**Dependencies**: T004, T005, T007

Implement route handler:
```typescript
import { Router } from "express";
import pkg from "../../package.json" assert { type: "json" };

const router = Router();

router.get("/healthz", (req, res) => {
  res.json({
    status: "ok",
    version: pkg.version,
    currentTime: new Date().toISOString()
  });
});

export default router;
```

Must pass contract test T001.

---

### T012: Implement POST /convert Route
**File**: `api/src/routes/convert.ts` (Create)  
**Duration**: ~15 min  
**Dependencies**: T004, T005, T006, T010

Implement route handler:
```typescript
import { Router } from "express";
import { convertTemperature } from "../services/converter.js";
import { validateBody } from "../middleware/validation.js";
import { ConversionRequestSchema } from "../schemas/index.js";

const router = Router();

router.post("/convert", validateBody(ConversionRequestSchema), (req, res) => {
  const { value, from, to } = req.body;
  const converted = convertTemperature(value, from, to);
  res.json({ value: converted, unit: to });
});

export default router;
```

Must pass contract test T002 (success case).

---

### T013: Register Routes in Server
**File**: `api/src/server.ts` (Edit)  
**Duration**: ~10 min  
**Dependencies**: T011, T012

Register both routes:
```typescript
import healthRoutes from "./routes/health.js";
import convertRoutes from "./routes/convert.js";

app.use(healthRoutes);
app.use(convertRoutes);
```

Verify:
- Only GET /healthz and POST /convert are registered
- No other routes added
- Middleware applied correctly (validation for /convert)
- Server starts without errors

---

### T014: Create Integration Tests for GET /healthz
**File**: `api/tests/integration/health.test.ts` (Create)  
**Duration**: ~20 min  
**Dependencies**: T011, T013  
**Parallel**: Yes [P]

Write integration tests using Supertest:
```typescript
import request from "supertest";
import app from "../../src/server.js";

describe("GET /healthz", () => {
  it("returns 200 with correct schema", async () => {
    const res = await request(app).get("/healthz");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status");
    expect(res.body).toHaveProperty("version");
    expect(res.body).toHaveProperty("currentTime");
    expect(res.body.status).toBe("ok");
    // Verify ISO 8601 format
    expect(new Date(res.body.currentTime)).toBeInstanceOf(Date);
  });
});
```

---

### T015: Create Integration Tests for POST /convert (Success)
**File**: `api/tests/integration/convert.test.ts` (Create)  
**Duration**: ~25 min  
**Dependencies**: T012, T013  
**Parallel**: Yes [P]

Write success case tests:
```typescript
describe("POST /convert", () => {
  it("converts F to C correctly", async () => {
    const res = await request(app)
      .post("/convert")
      .send({ value: 32, from: "F", to: "C" });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ value: 0, unit: "C" });
  });

  it("converts C to F correctly", async () => {
    const res = await request(app)
      .post("/convert")
      .send({ value: 0, from: "C", to: "F" });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ value: 32, unit: "F" });
  });

  it("handles identity conversion", async () => {
    const res = await request(app)
      .post("/convert")
      .send({ value: 100, from: "C", to: "C" });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ value: 100, unit: "C" });
  });
});
```

---

### T016: Create Integration Tests for POST /convert (Errors)
**File**: `api/tests/integration/convert.test.ts` (Extend)  
**Duration**: ~25 min  
**Dependencies**: T012, T013  
**Parallel**: Yes [P]

Add validation error tests:
```typescript
describe("POST /convert - Validation Errors", () => {
  it("returns 400 for missing value", async () => {
    const res = await request(app)
      .post("/convert")
      .send({ from: "F", to: "C" });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
    expect(Array.isArray(res.body.details)).toBe(true);
  });

  it("returns 400 for non-numeric value", async () => {
    const res = await request(app)
      .post("/convert")
      .send({ value: "32", from: "F", to: "C" });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });

  it("returns 400 for invalid unit", async () => {
    const res = await request(app)
      .post("/convert")
      .send({ value: 32, from: "K", to: "C" });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });
});
```

---

### T017: Create Unit Tests for Converter Service
**File**: `api/tests/unit/converter.test.ts` (Create)  
**Duration**: ~20 min  
**Dependencies**: T010  
**Parallel**: Yes [P]

Write unit tests for converter logic:
```typescript
import { describe, it, expect } from "vitest";
import { convertTemperature } from "../../src/services/converter.js";

describe("convertTemperature", () => {
  it("converts 32F to 0C", () => {
    expect(convertTemperature(32, "F", "C")).toBe(0);
  });

  it("converts 0C to 32F", () => {
    expect(convertTemperature(0, "C", "F")).toBe(32);
  });

  it("returns same value for identity conversion", () => {
    expect(convertTemperature(100, "C", "C")).toBe(100);
  });

  it("handles negative temperatures", () => {
    expect(convertTemperature(-40, "F", "C")).toBe(-40); // Special point
  });

  it("handles decimal values", () => {
    const result = convertTemperature(98.6, "F", "C");
    expect(result).toBeCloseTo(37.0, 1); // ~37°C
  });
});
```

---

### T018: Create Unit Tests for Schemas
**File**: `api/tests/unit/schemas.test.ts` (Create)  
**Duration**: ~20 min  
**Dependencies**: T005  
**Parallel**: Yes [P]

Write schema validation tests:
```typescript
import { describe, it, expect } from "vitest";
import {
  ConversionRequestSchema,
  HealthCheckResponseSchema
} from "../../src/schemas/index.js";

describe("ConversionRequestSchema", () => {
  it("accepts valid requests", () => {
    const result = ConversionRequestSchema.safeParse({
      value: 32,
      from: "F",
      to: "C"
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing value", () => {
    const result = ConversionRequestSchema.safeParse({
      from: "F",
      to: "C"
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-numeric value", () => {
    const result = ConversionRequestSchema.safeParse({
      value: "32",
      from: "F",
      to: "C"
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid units", () => {
    const result = ConversionRequestSchema.safeParse({
      value: 32,
      from: "K",
      to: "C"
    });
    expect(result.success).toBe(false);
  });
});

describe("HealthCheckResponseSchema", () => {
  it("accepts valid responses", () => {
    const result = HealthCheckResponseSchema.safeParse({
      status: "ok",
      version: "1.0.0",
      currentTime: new Date().toISOString()
    });
    expect(result.success).toBe(true);
  });
});
```

---

### T019: Run Contract Tests
**Duration**: ~5 min  
**Command**: `cd /Users/prnceb/Desktop/WORK/hello-world/api && npm run test -- tests/contract`

All contract tests (T001-T003) should pass.

---

### T020: Run Integration Tests
**Duration**: ~5 min  
**Command**: `cd /Users/prnceb/Desktop/WORK/hello-world/api && npm run test -- tests/integration`

All integration tests (T014-T016) should pass.

---

### T021: Run Unit Tests
**Duration**: ~5 min  
**Command**: `cd /Users/prnceb/Desktop/WORK/hello-world/api && npm run test -- tests/unit`

All unit tests (T017-T018) should pass.

---

### T022: Run Full Test Suite with Coverage
**Duration**: ~10 min  
**Command**: `cd /Users/prnceb/Desktop/WORK/hello-world/api && npm run test:coverage`

Verify:
- All tests pass (contract + integration + unit)
- Coverage report generated at `api/coverage/lcov.info` and `api/coverage/index.html`
- Unit coverage ≥80%
- Integration coverage ≥70%

---

### T023: Verify TypeScript Compilation
**Duration**: ~5 min  
**Command**: `cd /Users/prnceb/Desktop/WORK/hello-world/api && npm run lint`

No TypeScript or ESLint errors.

---

### T024: Verify Development Server
**Duration**: ~5 min  
**Command**: `cd /Users/prnceb/Desktop/WORK/hello-world/api && npm run dev`

Expected output:
```
Server running at http://localhost:3000
```

Server should start without errors. Kill with Ctrl+C.

---

### T025: Verify Quickstart Scenarios
**Duration**: ~10 min  
**Procedure**: Follow `specs/022-title-week-5/quickstart.md` with curl or fetch:

1. Test GET /healthz → 200 with status, version, currentTime
2. Test POST /convert (32F → C) → 200 with value: 0, unit: "C"
3. Test POST /convert (0C → F) → 200 with value: 32, unit: "F"
4. Test POST /convert (100C → C) → 200 with value: 100, unit: "C"
5. Test POST /convert (missing value) → 400 with error schema
6. Test POST /convert (invalid unit) → 400 with error schema
7. Test POST /convert (non-numeric value) → 400 with error schema

All scenarios should match expected responses.

---

### T026: Verify CI Workflow
**Duration**: ~5 min  
**Verification**: `.github/workflows/api-checks.yml` workflow should:
- Run on push to `022-title-week-5` branch
- Execute lint checks (pass)
- Execute unit tests with coverage ≥80% (pass)
- Execute integration tests with coverage ≥70% (pass)
- Generate and upload review packet artifact `review-packet-api`

---

### T027: Verify Review Artifacts
**Duration**: ~5 min  
**Verification**: Check `review-artifacts/` directory contains:
- `lcov.info` (coverage data)
- `index.html` (coverage report)
- `api-coverage-report.html` (or similar)
- Test results summary

---

## Execution Notes

### TDD Workflow
1. **Write contracts first** (T001-T003): Define spec behavior
2. **Write schemas** (T004-T005): Define data validation
3. **Implement routes** (T011-T012): Make contracts pass
4. **Write integration tests** (T014-T016): Verify all scenarios
5. **Write unit tests** (T017-T018): Test core logic
6. **Verify coverage** (T022): Ensure targets met

### Dependency Order
- **T001-T006**: Can start immediately (spec documents ready)
- **T007-T009**: Must complete before T011-T012 (routes need OpenAPI spec)
- **T010**: Must complete before T012 (converter needed for /convert route)
- **T011-T012**: Must complete before T014-T016 (routes needed for integration tests)
- **T014-T016**: Independent; can run in parallel
- **T019-T025**: Run after all implementation tasks

### Parallel Execution Strategy

**Start these immediately**:
```bash
T001 T002 T003 T004 T005 T006 (parallel, ~15 min)
```

**After Group 1, start these**:
```bash
T007 T008 T009 (sequential, ~25 min total, can start T010 in parallel after T007)
```

**After Group 2, start these**:
```bash
T011 T012 T013 (sequential, ~40 min total)
T010 (parallel to T011-T012 if not started earlier)
```

**After Group 3, start these**:
```bash
T014 T015 T016 T017 T018 (parallel, ~90 min total)
```

**After Group 4, start these**:
```bash
T019 T020 T021 T022 T023 T024 T025 (parallel, ~30 min total)
```

**Finally**:
```bash
T026 T027 (sequential, ~10 min total)
```

---

## Success Criteria

✅ All contract tests pass (T001-T003)  
✅ All integration tests pass (T014-T016)  
✅ All unit tests pass (T017-T018)  
✅ Unit coverage ≥80%  
✅ Integration coverage ≥70%  
✅ TypeScript compiles without errors  
✅ Development server starts successfully  
✅ All quickstart scenarios pass  
✅ CI workflow passes  
✅ Review artifacts generated  

---

## References

- **Specification**: `specs/022-title-week-5/spec.md`
- **Data Model**: `specs/022-title-week-5/data-model.md`
- **Plan**: `specs/022-title-week-5/plan.md`
- **Quickstart**: `specs/022-title-week-5/quickstart.md`
- **API Code**: `api/src/`
- **Tests**: `api/tests/`

---

**Status**: ✅ **COMPLETE** - All 27 tasks executed successfully! (102/102 tests passing, 80.61% coverage)

