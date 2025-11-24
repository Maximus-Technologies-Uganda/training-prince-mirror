# Data Model: Week 5 API Endpoints

**Feature**: Implement MVP API Endpoints (GET /healthz, POST /convert)  
**Branch**: 022-title-week-5  
**Date**: 2025-01-27  

---

## Overview

This document defines the data structures, validation rules, and relationships for the two MVP endpoints. All entities are stateless (no persistence); requests/responses are transient HTTP payloads.

---

## Entities

### 1. Health Check Response

**Purpose**: Communicate API service health, version, and server time  
**Endpoint**: `GET /healthz` (200 OK response)  
**Frequency**: On-demand (typically periodic health checks every 30s)

#### Fields

| Field | Type | Format | Example | Validation Rule |
|-------|------|--------|---------|-----------------|
| `status` | string | Enum | `"ok"` | Must be non-empty; typically `"ok"` for success |
| `version` | string | Semantic Version | `"1.0.0"` | Read from `api/package.json`; must match `MAJOR.MINOR.PATCH` pattern |
| `currentTime` | string | ISO 8601 UTC | `"2025-01-27T12:00:00.000Z"` | Must be valid ISO 8601 format; timezone always UTC (Z suffix) |

#### Structure

```typescript
interface HealthCheckResponse {
  status: string;           // Indicator of service health
  version: string;          // Package version from package.json
  currentTime: string;      // ISO 8601 formatted current time
}
```

#### Example Payload

```json
{
  "status": "ok",
  "version": "1.0.0",
  "currentTime": "2025-01-27T12:00:00.000Z"
}
```

#### Validation Schema (Zod)

```typescript
const HealthCheckResponseSchema = z.object({
  status: z.string().min(1, "Status must not be empty"),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, "Version must be semantic version"),
  currentTime: z.string().datetime({ offset: true }).or(z.string().regex(/Z$/))
});
```

---

### 2. Temperature Conversion Request

**Purpose**: Specify source temperature, source unit, and target unit for conversion  
**Endpoint**: `POST /convert` (request body)  
**Frequency**: On-demand (user-triggered conversion)

#### Fields

| Field | Type | Constraint | Example | Validation Rule |
|-------|------|-----------|---------|-----------------|
| `value` | number | Integer or decimal | `32`, `98.6`, `0` | Must be a number; no minimum/maximum (system handles all valid numeric inputs) |
| `from` | string | Enum | `"F"` or `"C"` | Must be exactly `"C"` or `"F"` (case-sensitive) |
| `to` | string | Enum | `"C"` or `"F"` | Must be exactly `"C"` or `"F"` (case-sensitive); can equal `from` |

#### Structure

```typescript
interface ConversionRequest {
  value: number;                    // Temperature value
  from: "C" | "F";                  // Source unit
  to: "C" | "F";                    // Target unit
}
```

#### Example Payloads

**Normal Conversion (F → C)**:
```json
{
  "value": 32,
  "from": "F",
  "to": "C"
}
```

**Identity Conversion (C → C)**:
```json
{
  "value": 100,
  "from": "C",
  "to": "C"
}
```

**Decimal Value**:
```json
{
  "value": 98.6,
  "from": "F",
  "to": "C"
}
```

#### Validation Schema (Zod)

```typescript
const ConversionRequestSchema = z.object({
  value: z.number("Value must be a number"),
  from: z.enum(["C", "F"], {
    errorMap: () => ({ message: "From unit must be 'C' or 'F'" })
  }),
  to: z.enum(["C", "F"], {
    errorMap: () => ({ message: "To unit must be 'C' or 'F'" })
  })
});
```

#### Validation Rules (Detailed)

1. **Type Validation**:
   - `value` must be a number type (not string)
   - `from` must be a string (will be checked against enum)
   - `to` must be a string (will be checked against enum)

2. **Enum Validation**:
   - `from` must be exactly `"C"` or `"F"` (case-sensitive)
   - `to` must be exactly `"C"` or `"F"` (case-sensitive)
   - Invalid values (e.g., `"K"`, `"c"`, `"Celsius"`) → HTTP 400 error

3. **Required Fields**:
   - All three fields (`value`, `from`, `to`) are mandatory
   - Missing fields → HTTP 400 error

4. **Edge Cases**:
   - `value` can be negative (e.g., -40°F is valid)
   - `value` can be decimal (e.g., 98.6)
   - `from` can equal `to` (identity conversion, see Conversion Response below)

---

### 3. Temperature Conversion Response

**Purpose**: Return converted temperature value and target unit  
**Endpoint**: `POST /convert` (200 OK response)  
**Derived From**: ConversionRequest + conversion logic

#### Fields

| Field | Type | Format | Example | Validation Rule |
|-------|------|--------|---------|-----------------|
| `value` | number | Result of conversion | `0`, `36.67`, `-40` | Numeric result from conversion math; inherits precision from calculation |
| `unit` | string | Enum | `"C"` or `"F"` | Must match target unit from request (`request.to`) |

#### Structure

```typescript
interface ConversionResponse {
  value: number;        // Converted temperature value
  unit: "C" | "F";      // Target unit (matches request.to)
}
```

#### Example Payloads

**Normal Conversion Result (F → C)**:
```json
{
  "value": 0,
  "unit": "C"
}
```
(Input: 32°F → Output: 0°C)

**Identity Conversion Result (C → C)**:
```json
{
  "value": 100,
  "unit": "C"
}
```
(Input: 100°C → Output: 100°C, unchanged)

**Decimal Result (F → C)**:
```json
{
  "value": 37.77777777777778,
  "unit": "C"
}
```
(Input: 98.6°F → Output: ~37.78°C)

#### Validation Schema (Zod)

```typescript
const ConversionResponseSchema = z.object({
  value: z.number("Value must be a number"),
  unit: z.enum(["C", "F"], {
    errorMap: () => ({ message: "Unit must be 'C' or 'F'" })
  })
});
```

#### Conversion Logic Rules

1. **Formula: Celsius to Fahrenheit**:
   - Formula: `(C × 9/5) + 32`
   - Example: `0°C → (0 × 9/5) + 32 = 32°F`

2. **Formula: Fahrenheit to Celsius**:
   - Formula: `(F - 32) × 5/9`
   - Example: `32°F → (32 - 32) × 5/9 = 0°C`

3. **Identity (Same Unit)**:
   - Formula: Return value as-is
   - Example: `100°C → 100°C` (no conversion)

4. **Special Points**:
   - Absolute zero: `-273.15°C = -459.67°F`
   - Triple point of water: `0.01°C = 32.018°F`
   - Boiling point: `100°C = 212°F`

---

### 4. Validation Error Response

**Purpose**: Report validation failure with details  
**Endpoint**: `POST /convert` (400 Bad Request response)  
**Triggered By**: Missing fields, invalid types, invalid enum values

#### Fields

| Field | Type | Content | Example |
|-------|------|---------|---------|
| `error` | string | Constant | `"Validation failed"` |
| `details` | array | Zod error objects | See examples below |

#### Structure

```typescript
interface ValidationErrorResponse {
  error: "Validation failed";
  details: Array<{
    code?: string;       // Zod error code (e.g., "invalid_type", "invalid_enum_value")
    message: string;     // Human-readable error message
    path?: Array<string | number>; // JSON path to field (e.g., ["value"])
  }>;
}
```

#### Example Payloads

**Missing Required Field** (`value`):
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

**Invalid Type** (`value` is string instead of number):
```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "invalid_type",
      "path": ["value"],
      "message": "Value must be a number"
    }
  ]
}
```

**Invalid Enum Value** (`from` is not "C" or "F"):
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

**Multiple Validation Errors**:
```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "invalid_type",
      "path": ["value"],
      "message": "Expected number, received string"
    },
    {
      "code": "invalid_enum_value",
      "path": ["from"],
      "message": "From unit must be 'C' or 'F'"
    }
  ]
}
```

#### Schema Generation

Zod error details are automatically formatted when validation fails. The validation middleware extracts and structures errors in the format above.

---

## Relationships & State Transitions

### Request → Response Flow (POST /convert)

```
1. Client sends ConversionRequest
   ↓
2. Server receives request body
   ↓
3. Zod validates against ConversionRequestSchema
   ├─ If invalid → Return HTTP 400 + ValidationErrorResponse
   └─ If valid → Continue
   ↓
4. Extract: value, from, to
   ↓
5. Call conversion function: convertTemperature(value, from, to)
   ├─ If from === to → Return value (identity)
   ├─ If from="F", to="C" → Return (value - 32) × 5/9
   └─ If from="C", to="F" → Return (value × 9/5) + 32
   ↓
6. Construct ConversionResponse
   ├─ response.value = converted value
   └─ response.unit = to parameter
   ↓
7. Return HTTP 200 + ConversionResponse
```

### Request → Response Flow (GET /healthz)

```
1. Client sends GET request to /healthz
   ↓
2. Server handler executes
   ↓
3. Construct HealthCheckResponse
   ├─ status = "ok"
   ├─ version = read from package.json
   └─ currentTime = new Date().toISOString()
   ↓
4. Return HTTP 200 + HealthCheckResponse
```

---

## Constraints & Assumptions

| Constraint | Rationale |
|-----------|-----------|
| `value` has no min/max | System handles all numeric inputs; extreme values treated as edge cases |
| Unit comparison is case-sensitive | Prevents accidental mismatches (e.g., `"c"` vs `"C"`) |
| Identity conversion returns value unchanged | Simplifies client logic; expected per acceptance scenario 5 |
| Validation errors always include `details` array | Enables client-side debugging and field-specific error handling |
| `currentTime` always UTC (Z suffix) | Eliminates timezone ambiguity; standard for APIs |
| Version matches semantic versioning | Supports version tracking; follows npm conventions |

---

## Implementation Patterns

### Validation Middleware

```typescript
// In api/src/middleware/validation.ts
export function validateBody(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: result.error.errors.map(err => ({
          code: err.code,
          path: err.path,
          message: err.message
        }))
      });
    }
    req.body = result.data;
    next();
  };
}
```

### Route Handler Pattern

```typescript
// In api/src/routes/convert.ts
import { ConversionRequest, ConversionResponse } from "../types";
import { validateBody } from "../middleware/validation";
import { convertTemperature } from "../services/converter";

router.post(
  "/convert",
  validateBody(ConversionRequestSchema),
  (req: Request, res: Response) => {
    const { value, from, to } = req.body as ConversionRequest;
    const converted = convertTemperature(value, from, to);
    const response: ConversionResponse = {
      value: converted,
      unit: to
    };
    res.json(response);
  }
);
```

---

## Testing Coverage

### Unit Tests (Vitest)

- ConversionRequest validation schema (valid/invalid cases)
- ConversionResponse validation schema
- ValidationErrorResponse formatting
- Conversion logic (C→F, F→C, identity)

### Integration Tests (Supertest)

- GET /healthz successful response (200 + schema match)
- POST /convert success case (200 + correct result)
- POST /convert identity case (200 + unchanged value)
- POST /convert missing field (400 + error details)
- POST /convert invalid type (400 + error details)
- POST /convert invalid enum (400 + error details)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-01-27 | Initial data model for healthz and convert endpoints |

---

**Status**: ✅ **COMPLETE** - Ready for implementation

