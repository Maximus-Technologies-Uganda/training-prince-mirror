# Quickstart: Week 5 API Endpoints

**Feature**: Implement MVP API Endpoints (GET /healthz, POST /convert)  
**Branch**: 022-title-week-5  
**Date**: 2025-01-27  

---

## Overview

This guide walks through setting up the development environment, running tests, starting the API server, and making test requests to both endpoints. By the end, you'll have validated that both `GET /healthz` and `POST /convert` endpoints work correctly.

---

## Prerequisites

- Node.js 20+ (LTS) or compatible version
- npm or yarn package manager
- Git for cloning/switching branches
- curl, Postman, or similar tool for HTTP requests (or use Node.js built-in `fetch`)

---

## Setup

### 1. Install Dependencies

```bash
# From repository root
cd api
npm install
```

Expected output includes all packages from `api/package.json`, including:
- `express@4.18.2` (web framework)
- `zod@3.22.4` (validation)
- `vitest@1.1.0` (unit tests)
- `supertest@6.3.3` (integration tests)

### 2. Verify TypeScript Configuration

```bash
npm run lint
```

Should complete without errors.

---

## Running Tests

### Unit Tests (Vitest)

```bash
npm run test
```

Expected output:
```
✓ tests/unit/... (all tests passing)
```

To run with coverage report:

```bash
npm run test:coverage
```

Expected: Coverage report showing ≥80% statement coverage for unit tests.

### Integration Tests (Supertest)

```bash
npm run test -- tests/integration
```

Expected output:
```
✓ GET /healthz returns 200 with correct schema
✓ POST /convert with valid input returns 200
✓ POST /convert with invalid input returns 400
... (all tests passing)
```

### All Tests

```bash
npm run test
```

Runs all tests (unit + integration) and generates coverage report.

---

## Starting the Development Server

### Terminal 1: Run API Server

```bash
npm run dev
```

Expected output:
```
Server running at http://localhost:3000
```

Server is now ready to accept requests.

### Terminal 2: Make Test Requests

---

## Testing Endpoints

### Scenario 1: Health Check (GET /healthz)

#### Request

```bash
curl http://localhost:3000/healthz
```

Or using Node.js:

```javascript
const response = await fetch('http://localhost:3000/healthz');
const data = await response.json();
console.log(data);
```

#### Expected Response (HTTP 200)

```json
{
  "status": "ok",
  "version": "1.0.0",
  "currentTime": "2025-01-27T14:30:45.123Z"
}
```

#### Validation Checklist

- [ ] HTTP Status: 200
- [ ] `status` field exists and is non-empty
- [ ] `version` field matches format: `X.Y.Z` (e.g., `1.0.0`)
- [ ] `currentTime` field is ISO 8601 formatted UTC string (ends with `Z`)
- [ ] Response time < 100ms

**Acceptance Scenario**: ✅ PASS (matches acceptance scenario 1 & 2)

---

### Scenario 2: Temperature Conversion - F to C (POST /convert)

#### Request

```bash
curl -X POST http://localhost:3000/convert \
  -H "Content-Type: application/json" \
  -d '{"value": 32, "from": "F", "to": "C"}'
```

Or using Node.js:

```javascript
const response = await fetch('http://localhost:3000/convert', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ value: 32, from: "F", to: "C" })
});
const data = await response.json();
console.log(data);
```

#### Expected Response (HTTP 200)

```json
{
  "value": 0,
  "unit": "C"
}
```

#### Validation Checklist

- [ ] HTTP Status: 200
- [ ] `value` field is `0` (32°F = 0°C)
- [ ] `unit` field is `"C"` (matches `to` parameter)

**Acceptance Scenario**: ✅ PASS (matches acceptance scenario 3)

---

### Scenario 3: Temperature Conversion - C to F (POST /convert)

#### Request

```bash
curl -X POST http://localhost:3000/convert \
  -H "Content-Type: application/json" \
  -d '{"value": 0, "from": "C", "to": "F"}'
```

#### Expected Response (HTTP 200)

```json
{
  "value": 32,
  "unit": "F"
}
```

#### Validation Checklist

- [ ] HTTP Status: 200
- [ ] `value` field is `32` (0°C = 32°F)
- [ ] `unit` field is `"F"` (matches `to` parameter)

**Acceptance Scenario**: ✅ PASS (matches acceptance scenario 4)

---

### Scenario 4: Identity Conversion - C to C (POST /convert)

#### Request

```bash
curl -X POST http://localhost:3000/convert \
  -H "Content-Type: application/json" \
  -d '{"value": 100, "from": "C", "to": "C"}'
```

#### Expected Response (HTTP 200)

```json
{
  "value": 100,
  "unit": "C"
}
```

#### Validation Checklist

- [ ] HTTP Status: 200
- [ ] `value` field is `100` (unchanged, same unit)
- [ ] `unit` field is `"C"`

**Acceptance Scenario**: ✅ PASS (matches acceptance scenario 5)

---

### Scenario 5: Validation Error - Missing Field (POST /convert)

#### Request

```bash
curl -X POST http://localhost:3000/convert \
  -H "Content-Type: application/json" \
  -d '{"from": "F", "to": "C"}'
```

(Missing `value` field)

#### Expected Response (HTTP 400)

```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "invalid_type",
      "path": ["value"],
      "message": "Required"
    }
  ]
}
```

#### Validation Checklist

- [ ] HTTP Status: 400
- [ ] `error` field is `"Validation failed"`
- [ ] `details` array includes error for missing `value`
- [ ] Error includes `code`, `path`, and `message`

**Acceptance Scenario**: ✅ PASS (matches acceptance scenario 6)

---

### Scenario 6: Validation Error - Invalid Unit (POST /convert)

#### Request

```bash
curl -X POST http://localhost:3000/convert \
  -H "Content-Type: application/json" \
  -d '{"value": 32, "from": "K", "to": "C"}'
```

(Invalid `from` unit: `"K"` is not allowed)

#### Expected Response (HTTP 400)

```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "invalid_enum_value",
      "path": ["from"],
      "message": "From unit must be 'C' or 'F'"
    }
  ]
}
```

#### Validation Checklist

- [ ] HTTP Status: 400
- [ ] `error` field is `"Validation failed"`
- [ ] `details` array includes error for invalid `from` unit
- [ ] Error message mentions allowed values (`'C' or 'F'`)

**Acceptance Scenario**: ✅ PASS (matches acceptance scenario 7)

---

### Scenario 7: Validation Error - Invalid Type (POST /convert)

#### Request

```bash
curl -X POST http://localhost:3000/convert \
  -H "Content-Type: application/json" \
  -d '{"value": "32", "from": "F", "to": "C"}'
```

(Invalid type: `value` is string instead of number)

#### Expected Response (HTTP 400)

```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "invalid_type",
      "path": ["value"],
      "message": "Expected number, received string"
    }
  ]
}
```

#### Validation Checklist

- [ ] HTTP Status: 400
- [ ] `error` field is `"Validation failed"`
- [ ] `details` array includes error for invalid `value` type
- [ ] Error message indicates type mismatch

**Acceptance Scenario**: ✅ PASS (matches acceptance scenario 9)

---

## Integration Test Walkthrough

All test scenarios above are covered by integration tests in `api/tests/integration/convert.test.ts` and `api/tests/integration/health.test.ts`.

To run integration tests with verbose output:

```bash
npm run test -- tests/integration --reporter=verbose
```

Expected output:
```
✓ POST /convert (success case): valid conversion returns 200
✓ POST /convert (identity case): same unit returns value unchanged
✓ POST /convert (error case): missing field returns 400
✓ POST /convert (error case): invalid unit returns 400
✓ POST /convert (error case): invalid type returns 400
✓ GET /healthz: returns 200 with correct schema
```

---

## Code Review Checklist

### Endpoint Implementation
- [ ] `GET /healthz` implemented in `api/src/routes/health.ts` (or similar)
- [ ] `POST /convert` implemented in `api/src/routes/convert.ts` (or similar)
- [ ] Both routes registered in `api/src/server.ts`

### Validation
- [ ] Zod schemas defined for `ConversionRequest` and `ConversionResponse`
- [ ] Validation middleware catches errors and formats as `{ "error": "Validation failed", "details": [...] }`
- [ ] HTTP 400 returned for validation failures

### Conversion Logic
- [ ] Temperature conversion function imported from `src/temp-converter` (reused, not reimplemented)
- [ ] Identity conversion (same unit) returns value unchanged
- [ ] C↔F conversion formulas correct

### Tests
- [ ] Contract tests exist (`api/tests/contract/health.contract.test.ts`, `api/tests/contract/convert.contract.test.ts`)
- [ ] Integration tests cover all acceptance scenarios (≥9 test cases)
- [ ] Unit tests cover conversion logic
- [ ] Coverage report shows ≥70% integration, ≥80% unit

### OpenAPI Specification
- [ ] `api/spec/openapi.yaml` includes `/healthz` endpoint with GET operation
- [ ] `api/spec/openapi.yaml` includes `/convert` endpoint with POST operation
- [ ] Request/response schemas defined and match implementation
- [ ] Error response schema documented

### Code Quality
- [ ] TypeScript compilation successful (`npm run lint`)
- [ ] No ESLint errors
- [ ] Code follows project style guide

---

## Troubleshooting

### Server Won't Start

**Error**: `Port 3000 already in use`
- **Solution**: Kill existing process or change port in `api/src/server.ts`

```bash
lsof -i :3000
kill -9 <PID>
```

### Tests Fail with "Cannot find module"

**Error**: `Cannot find module 'src/temp-converter'`
- **Solution**: Ensure import path is correct; verify `src/temp-converter/index.js` exists in repository root

### Validation Not Working

**Error**: POST /convert accepts invalid requests (e.g., string value)
- **Solution**: Verify Zod middleware is applied to route; check validation schema definition

```typescript
// Should have validation middleware
router.post("/convert", validateBody(ConversionRequestSchema), handler);
```

### Coverage Report Missing

**Error**: `npm run test:coverage` doesn't generate report
- **Solution**: Verify `@vitest/coverage-v8` installed; check `api/vitest.config.ts` has coverage configuration

---

## Next Steps

1. **PR Preparation**: Include coverage report and quickstart results in PR description
2. **Merge**: Request review; ensure all checklists pass
3. **Deployment**: Merge to `development` branch; trigger CI/CD pipeline
4. **Validation**: Verify endpoints accessible in staging/production

---

## References

- **Specification**: `specs/022-title-week-5/spec.md`
- **Data Model**: `specs/022-title-week-5/data-model.md`
- **API Code**: `api/src/`
- **Tests**: `api/tests/`
- **OpenAPI Spec**: `api/spec/openapi.yaml`

---

**Status**: ✅ **READY** - Follow these steps to validate implementation

