# Phase 1: Data Model & Entities

**Branch**: `023-title-week-5` | **Date**: November 5, 2025  
**Status**: Design Complete

---

## Entity: Expense

Represents a single expense record with core attributes for tracking spending.

### Fields

| Field | Type | Required | Constraints | Notes |
|-------|------|----------|-------------|-------|
| `id` | string | Yes | UUID v4 format | Auto-assigned by server on creation |
| `amount` | number | Yes | Positive (> 0) | Reject zero and negative values |
| `category` | string | Yes | Non-empty | e.g., "food", "transport", "utilities" |
| `date` | string | Yes | ISO 8601 (YYYY-MM-DD) | Must be a valid date |

### Validation Rules

```typescript
// Pseudo-code for Zod schema
const ExpenseSchema = {
  amount: positiveNumber() // > 0, reject 0 and negatives
  category: nonEmptyString()
  date: isoDateString() // YYYY-MM-DD format, valid date
}
```

### State Lifecycle

```
[Request] → Validation → [Create] → Storage → [Retrieve]
   ↓
Invalid Input → 400 Error Response
```

1. **Request**: Client submits POST with expense details
2. **Validation**: Zod schema validates request body (amount > 0, valid date format, category string)
3. **Create**: Service generates UUID, stores in memory
4. **Storage**: Expense added to in-memory array
5. **Retrieve**: GET /expenses/summary queries stored expenses

### Relationships

- **1:N relationship with ExpenseSummary**: Multiple expenses contribute to a single summary
- **Filtering**: Expenses grouped by category or month for aggregation

### JSON Schema (OpenAPI)

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid",
      "description": "Unique identifier (auto-assigned)"
    },
    "amount": {
      "type": "number",
      "exclusiveMinimum": 0,
      "description": "Expense amount (must be positive)"
    },
    "category": {
      "type": "string",
      "minLength": 1,
      "description": "Expense category"
    },
    "date": {
      "type": "string",
      "format": "date",
      "pattern": "^\\d{4}-\\d{2}-\\d{2}$",
      "description": "ISO 8601 date (YYYY-MM-DD)"
    }
  },
  "required": ["id", "amount", "category", "date"]
}
```

---

## Entity: ExpenseSummary

Represents aggregated expense data with optional filters applied.

### Fields

| Field | Type | Required | Constraints | Notes |
|-------|------|----------|-------------|-------|
| `total` | number | Yes | Non-negative | Sum of amounts matching filter criteria |
| `count` | number | Yes | Non-negative | Number of expenses matching filter criteria |
| `filters` | object | Yes | See structure below | Describes which filters were applied |

### Filters Object Structure

```typescript
{
  category?: string    // If category filter applied, value provided
  month?: string       // If month filter applied, YYYY-MM format
  // Both can be present simultaneously
}
```

### Example Scenarios

**Scenario 1: No filters**
```json
{
  "total": 150.75,
  "count": 5,
  "filters": {}
}
```

**Scenario 2: Category filter only**
```json
{
  "total": 45.50,
  "count": 2,
  "filters": { "category": "food" }
}
```

**Scenario 3: Month filter only**
```json
{
  "total": 230.00,
  "count": 8,
  "filters": { "month": "2025-11" }
}
```

**Scenario 4: Both filters (AND logic)**
```json
{
  "total": 12.99,
  "count": 1,
  "filters": { "category": "food", "month": "2025-11" }
}
```

**Scenario 5: No matching expenses**
```json
{
  "total": 0,
  "count": 0,
  "filters": { "category": "nonexistent" }
}
```

### JSON Schema (OpenAPI)

```json
{
  "type": "object",
  "properties": {
    "total": {
      "type": "number",
      "minimum": 0,
      "description": "Sum of amounts matching filter criteria"
    },
    "count": {
      "type": "integer",
      "minimum": 0,
      "description": "Number of expenses matching filter criteria"
    },
    "filters": {
      "type": "object",
      "properties": {
        "category": {
          "type": "string",
          "description": "Category filter applied (if present)"
        },
        "month": {
          "type": "string",
          "pattern": "^\\d{4}-\\d{2}$",
          "description": "Month filter applied (if present)"
        }
      },
      "additionalProperties": false
    }
  },
  "required": ["total", "count", "filters"]
}
```

---

## Storage & Lifecycle

### In-Memory Storage Structure

```typescript
// Global store during server session
expenses: Expense[] = []

// Operations
- create(amount, category, date) → Expense
- getAll() → Expense[]
- filter(category?, month?) → Expense[]
- summarize(filters?) → ExpenseSummary
```

### Data Integrity

- **Uniqueness**: IDs are globally unique (UUID v4)
- **Atomicity**: Each POST operation is atomic (add or fail)
- **Consistency**: All expenses in memory are valid (validated on creation)
- **Availability**: All expenses readable immediately after creation

### Constraints

- **No persistence**: Data lost when server restarts (MVP scope)
- **Memory bounded**: Reasonable for MVP scale (<1000 expenses)
- **Concurrency**: Node.js single-threaded; no race conditions for MVP

---

## TypeScript Interfaces (Implementation Reference)

```typescript
// api/src/types/index.ts
export interface Expense {
  id: string;        // UUID v4
  amount: number;    // > 0
  category: string;  // Non-empty
  date: string;      // YYYY-MM-DD
}

export interface ExpenseSummary {
  total: number;
  count: number;
  filters: {
    category?: string;
    month?: string;
  };
}

export interface CreateExpenseRequest {
  amount: number;
  category: string;
  date: string;
}

export interface GetExpenseSummaryQuery {
  category?: string;
  month?: string;
}
```

---

## Validation Rules (Implementation Reference)

### Amount Validation
- Must be a number: fail with "amount must be a number"
- Must be > 0: fail with "amount must be greater than 0" (reject zero and negative)
- Must not be NaN/Infinity: fail with "amount must be a valid number"

### Category Validation
- Must be a string: fail with "category must be a string"
- Must not be empty: fail with "category must not be empty"
- Must be non-empty after trim: fail with "category must not be whitespace only"

### Date Validation
- Must be a string: fail with "date must be a string"
- Must match YYYY-MM-DD format: fail with "date must be in YYYY-MM-DD format (received: {value})"
- Must be a valid calendar date: fail with "date must be a valid date (received: {value})"

---

## Relationships with API Endpoints

### POST /expenses → Creates Expense
- Input: CreateExpenseRequest (amount, category, date)
- Process: Validate + Generate ID + Store
- Output: Expense (with assigned ID)
- Error: 400 with validation details

### GET /expenses/summary → Returns ExpenseSummary
- Input: Optional query params (category, month)
- Process: Filter stored expenses + Aggregate
- Output: ExpenseSummary with filters
- Error: Always returns 200 (even if empty)

---

*Based on Constitution v1.1.0 and Specification 023-title-week-5*

