# Phase 1 Data Model: Coverage Lift, Edge Cases & Security Hardening

**Date**: 2025-11-11  
**Feature**: Week 5 Day 4 Coverage Hardening  
**Status**: Complete  

## Test Data Model

This section defines the data structures used for testing negative paths and edge cases.

### Entity 1: Expense Record (Valid)

**Purpose**: Represents a valid expense entry for happy-path and boundary testing.

**Fields**:
- `date` (string, ISO 8601 format): "2024-11-11"
- `category` (string, non-empty): "Food", "Transport", "Entertainment"
- `amount` (number, positive): 10.50, 100, 0.01

**Validation Rules**:
- `date` MUST be valid ISO 8601 format (YYYY-MM-DD)
- `date` SHOULD NOT be in the future (implementation-dependent)
- `category` MUST NOT be empty string or whitespace-only
- `category` MUST be a string
- `amount` MUST be > 0
- `amount` MUST be a number (not string)

**Example**:
```json
{
  "date": "2024-11-10",
  "category": "Groceries",
  "amount": 45.99
}
```

---

### Entity 2: Invalid Expense Records (for Negative Testing)

**Purpose**: Represents various invalid expense entries to test validation error handling.

#### 2a. Invalid Date Format

| Test Case | Input | Expected Error | HTTP Code |
|-----------|-------|-----------------|-----------|
| Malformed date | `date: "2024-13-45"` | "Invalid date format. Expected YYYY-MM-DD" | 400 |
| Wrong delimiter | `date: "2024/11/10"` | "Invalid date format. Expected YYYY-MM-DD" | 400 |
| Missing date | `date: undefined` or omitted | "Date is required" | 400 |
| String date | `date: "not-a-date"` | "Invalid date format. Expected YYYY-MM-DD" | 400 |
| Future date | `date: "2099-12-31"` | May accept or reject (implementation-dependent) | 400 or 201 |

#### 2b. Invalid Category

| Test Case | Input | Expected Error | HTTP Code |
|-----------|-------|-----------------|-----------|
| Empty category | `category: ""` | "Category cannot be empty" | 400 |
| Whitespace only | `category: "   "` | "Category cannot be empty" | 400 |
| Missing category | `category: undefined` or omitted | "Category is required" | 400 |
| Type mismatch | `category: 123` | "Category must be a string" | 400 |
| Null value | `category: null` | "Category cannot be empty" | 400 |

#### 2c. Invalid Amount

| Test Case | Input | Expected Error | HTTP Code |
|-----------|-------|-----------------|-----------|
| Zero amount | `amount: 0` | "Amount must be greater than 0" | 400 |
| Negative amount | `amount: -50.00` | "Amount must be greater than 0" | 400 |
| Type mismatch (string) | `amount: "50.00"` | "Amount must be a number" | 400 |
| Missing amount | `amount: undefined` or omitted | "Amount is required" | 400 |
| Non-numeric string | `amount: "abc"` | "Amount must be a number" | 400 |
| Very large number | `amount: 999999999999999999` | May accept or overflow (implementation-dependent) | 201 or 400 |

---

### Entity 3: Query Parameter Validation (GET /expenses/summary)

**Purpose**: Defines valid and invalid query parameters for expense summary endpoint.

#### Valid Query Parameters

| Parameter | Type | Range | Example |
|-----------|------|-------|---------|
| month | integer | 1-12 | month=11 |
| year | integer | positive | year=2024 |

#### Invalid Query Parameters

| Test Case | Input | Expected Error | HTTP Code |
|-----------|-------|-----------------|-----------|
| Invalid month (< 1) | `month=0` | "Invalid month. Must be between 1 and 12" | 400 |
| Invalid month (> 12) | `month=13` | "Invalid month. Must be between 1 and 12" | 400 |
| Non-numeric month | `month=abc` | "Month must be a number" | 400 |
| Missing month | (omitted) | May use current month (implementation-dependent) | 200 or 400 |
| Negative year | `year=-2024` | "Year must be positive" | 400 or accept |
| Non-numeric year | `year=abc` | "Year must be a number" | 400 |

---

### Entity 4: Path Parameter Validation (GET /expenses/{id})

**Purpose**: Defines valid and invalid resource IDs for expense retrieval.

#### Valid ID Patterns

| Pattern | Type | Example |
|---------|------|---------|
| Numeric ID | integer | /expenses/123 |
| UUID | string (UUID format) | /expenses/550e8400-e29b-41d4-a716-446655440000 |

#### Invalid ID Patterns

| Test Case | Input | Expected Response | HTTP Code |
|-----------|-------|-------------------|-----------|
| Non-existent numeric ID | /expenses/99999 | "Expense not found" | 404 |
| Non-existent UUID | /expenses/00000000-0000-0000-0000-000000000000 | "Expense not found" | 404 |
| Invalid UUID format | /expenses/not-a-uuid | "Invalid expense ID format" | 400 |
| Missing ID | /expenses/ (trailing slash) | Route not found | 404 |
| String instead of ID | /expenses/abc | "Invalid expense ID format" (if numeric expected) or 404 | 400 or 404 |

---

### Entity 5: Validation Error Response

**Purpose**: Standard error response structure returned by API for validation failures.

**Structure**:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "[field-specific error message]",
    "details": {
      "[field]": "[error description]"
    }
  }
}
```

**Example - Invalid Category**:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Category cannot be empty",
    "details": {
      "category": "Category is required and cannot be empty"
    }
  }
}
```

**Example - Invalid Amount**:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Amount must be greater than 0",
    "details": {
      "amount": "Amount must be a positive number"
    }
  }
}
```

**Example - Not Found (404)**:
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Expense not found",
    "details": {
      "id": "Expense with ID 99999 does not exist"
    }
  }
}
```

---

### Entity 6: Coverage Metrics

**Purpose**: Tracks test coverage across codebase modules.

**Metrics Tracked**:
- **Statements**: Percentage of executable statements covered by tests
- **Branches**: Percentage of conditional branches (if/else, switch) covered
- **Functions**: Percentage of defined functions called by tests
- **Lines**: Percentage of lines of code executed by tests

**Current State** (before feature):
- Target: 60% for all metrics
- Actual: TBD (to be measured)

**Target State** (after feature):
- Target: 70% for all metrics (hard threshold enforced in vitest.config.js)
- Expectation: All modules reach ≥70% for lines, branches, functions, statements

**Modules Requiring Coverage Lift**:
1. `src/expense/validator.js` - validation logic for date, category, amount
2. `src/expense/mapper.js` - transformation functions for request/response mapping
3. `src/expense/error-handler.js` (if exists) - error handling and response formatting
4. Any middleware validating expense endpoints

**Coverage Report Locations**:
- HTML Report: `coverage/index.html`
- JSON Report: `coverage/coverage-final.json`
- Summary: Printed to console on `npm test -- --coverage`

---

## State Transitions & Validation Paths

### Happy Path (Valid Request)

```
Request → Validation Layer → Business Logic → Database → Response (201/200)
```

### Validation Error Path (Invalid Input)

```
Request → Validation Layer → Error Check
                                    ↓
                          Validation Failed → Format Error Response → Response (400)
```

### Not Found Path (Valid Format, Resource Missing)

```
Request → Validation Layer ✓ → Business Logic → Lookup → Not Found → Response (404)
```

---

## Edge Cases Covered

| Edge Case | Category | Test Location |
|-----------|----------|---------------|
| Date in future | Date validation | tests/integration/expense-api-negative.test.js |
| Amount as string | Type checking | tests/integration/expense-api-negative.test.js |
| Month=0 or >12 | Range validation | tests/integration/expense-api-negative.test.js |
| Category whitespace | Trimming/validation | tests/integration/expense-api-negative.test.js |
| Non-existent ID | Resource lookup | tests/integration/expense-api-negative.test.js |
| Very large amounts | Numeric limits | tests/unit/expense-validator.test.js (if applicable) |
| Concurrent requests | Concurrency handling | tests/integration/ (stress test, optional) |
| Validator exceptions | Error handling | tests/unit/expense-error-handler.test.js |
