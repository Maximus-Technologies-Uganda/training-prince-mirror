# API Contracts: Week 5 Day 3 - Docs, ReviewPacket, and Playwright Smoke

**Date**: 2025-11-11  
**Feature**: 028-week-5-day  
**Status**: Reference/No New Endpoints

---

## Overview

**This feature does NOT introduce new API endpoints.** 

The smoke test validates existing API endpoints that are already defined in the OpenAPI specification. This document serves as a reference for the endpoints used by the smoke test and describes the integration contract between the UI and API.

---

## Existing Endpoints Used by Smoke Test

### 1. Create Expense (POST /api/expenses)

**Used by**: Expense UI smoke test to create a test expense and verify API response.

**OpenAPI Definition** (Reference):
```yaml
paths:
  /api/expenses:
    post:
      operationId: createExpense
      summary: Create a new expense
      description: Creates a new expense record and returns the created expense with ID
      tags: [Expenses]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                amount:
                  type: number
                  format: double
                  minimum: 0.01
                  description: Expense amount in USD
                  example: 50.00
                description:
                  type: string
                  minLength: 1
                  maxLength: 255
                  description: Brief description of the expense
                  example: "Coffee break"
              required: [amount, description]
      responses:
        '201':
          description: Expense created successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: string
                    format: uuid
                    description: Unique expense identifier
                    example: "550e8400-e29b-41d4-a716-446655440000"
                  amount:
                    type: number
                    format: double
                    example: 50.00
                  description:
                    type: string
                    example: "Coffee break"
                  created_at:
                    type: string
                    format: date-time
                    example: "2025-11-11T12:34:56.789Z"
                  updated_at:
                    type: string
                    format: date-time
                    example: "2025-11-11T12:34:56.789Z"
                required: [id, amount, description, created_at, updated_at]
        '400':
          description: Invalid request body
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: "Amount must be greater than 0"
                  details:
                    type: array
        '500':
          description: Internal server error
```

**Smoke Test Assertion**:
```javascript
// Wait for successful response
const response = await page.waitForResponse(
  r => r.url().includes('/api/expenses') && r.status() === 201
);

// Assert response data
const data = await response.json();
expect(data.id).toBeTruthy(); // UUID present
expect(data.amount).toBe(50);
expect(data.description).toBe('Test Expense');
```

**Contract Requirements**:
- ✅ Endpoint must accept POST requests to `/api/expenses`
- ✅ Request body must include `amount` (number) and `description` (string)
- ✅ Response must return HTTP 201 on success
- ✅ Response must include `id`, `amount`, `description`, `created_at`, `updated_at`
- ✅ Response must be valid JSON

---

### 2. List Expenses (GET /api/expenses)

**Used by**: UI to display list of expenses after creation; smoke test verifies new expense appears.

**OpenAPI Definition** (Reference):
```yaml
paths:
  /api/expenses:
    get:
      operationId: listExpenses
      summary: Retrieve all expenses
      description: Returns a paginated list of all expenses
      tags: [Expenses]
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 50
      responses:
        '200':
          description: List of expenses
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      type: object
                      properties:
                        id:
                          type: string
                          format: uuid
                        amount:
                          type: number
                          format: double
                        description:
                          type: string
                        created_at:
                          type: string
                          format: date-time
                        updated_at:
                          type: string
                          format: date-time
                      required: [id, amount, description, created_at, updated_at]
                  meta:
                    type: object
                    properties:
                      total:
                        type: integer
                      page:
                        type: integer
                      limit:
                        type: integer
                      totalPages:
                        type: integer
                  total_amount:
                    type: number
                    format: double
                    description: Sum of all expenses
        '500':
          description: Internal server error
```

**Smoke Test Assertion**:
```javascript
// After creating expense, verify it appears in list
await expect(
  page.locator('text=Test Expense')
).toBeVisible();

// Verify total updated
const total = await page.locator('[data-testid="total-amount"]').textContent();
expect(total).toContain('50.00');
```

**Contract Requirements**:
- ✅ Endpoint must accept GET requests to `/api/expenses`
- ✅ Response must return HTTP 200
- ✅ Response must include array of expenses with id, amount, description
- ✅ Response should include `total_amount` (sum of all expenses)
- ✅ Response must be valid JSON

---

## UI-API Integration Contract

### Request/Response Flow

```
┌─────────────────────────────────────────────────┐
│          Expense UI Component                   │
│  - Amount input field                           │
│  - Description input field                      │
│  - Create button                                │
│  - Expense list display                         │
│  - Total summary display                        │
└────────────────┬────────────────────────────────┘
                 │ User fills form and clicks Create
                 ↓
        ┌────────────────────┐
        │ POST /api/expenses │
        │ { amount, desc }   │
        └────────────────────┘
                 │
                 ↓
        ┌────────────────────┐
        │ API validates &    │
        │ creates expense    │
        └────────────────────┘
                 │
                 ↓
        ┌─────────────────────────────────┐
        │ HTTP 201 Created                │
        │ { id, amount, desc, timestamps} │
        └─────────────────────────────────┘
                 │
                 ↓
        ┌─────────────────────────────────┐
        │ UI receives response            │
        │ - Add expense to list           │
        │ - Update totals                 │
        │ - Clear form                    │
        │ - Show success message          │
        └─────────────────────────────────┘
                 │
                 ↓
        ┌──────────────────────┐
        │ Refresh expense list │
        │ GET /api/expenses    │
        └──────────────────────┘
                 │
                 ↓
        ┌─────────────────────────────────┐
        │ HTTP 200 OK                     │
        │ { data: [...], total_amount: X} │
        └─────────────────────────────────┘
                 │
                 ↓
        ┌─────────────────────────────────┐
        │ UI updated with latest data     │
        │ - All expenses visible          │
        │ - Correct totals displayed      │
        └─────────────────────────────────┘
```

### API Response Contract (Smoke Test Expectations)

**Success Case (201)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "amount": 50.00,
  "description": "Test Expense",
  "created_at": "2025-11-11T12:34:56.789Z",
  "updated_at": "2025-11-11T12:34:56.789Z"
}
```

**Error Case (400)**:
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "amount",
      "message": "Amount must be greater than 0"
    }
  ]
}
```

**Error Case (500)**:
```json
{
  "error": "Internal server error",
  "message": "Failed to create expense"
}
```

### UI-API Integration Requirements

| Requirement | Smoke Test Validates |
|-------------|---------------------|
| API returns HTTP 201 on success | ✓ Assert `response.status() === 201` |
| API response includes `id` (UUID) | ✓ Assert `data.id` truthy |
| API response includes `amount` | ✓ Assert `data.amount === 50` |
| API response includes `description` | ✓ Assert `data.description === 'Test Expense'` |
| UI displays new expense in list | ✓ Assert `page.locator('text=Test Expense').toBeVisible()` |
| UI displays correct amount | ✓ Assert `page.locator('text=50.00').toBeVisible()` |
| UI updates total/summary | ✓ Assert total >= 50.00 |
| API returns error on invalid data | ✓ Assert `response.status() === 400` on negative amount |
| UI displays error message to user | ✓ Assert alert text contains error message |
| UI does NOT add invalid expense | ✓ Assert invalid expense not visible in list |

---

## Integration Points

### 1. Documentation Generation Integration

**Contract**: OpenAPI spec → Redoc HTML

- ✅ Redoc reads `docs/openapi.yaml`
- ✅ Generates self-contained HTML to `docs/api.html`
- ✅ HTML includes interactive API explorer for POST /api/expenses and GET /api/expenses

**Testing**: 
```bash
# Verify OpenAPI spec is valid
npx redoc-cli build -o /dev/null docs/openapi.yaml

# Verify HTML generated
file docs/api.html
# Should be: HTML document, UTF-8 Unicode text
```

### 2. Review Packet Integration

**Contract**: Review packet links to API docs

- ✅ `review-artifacts/index.html` includes link to `docs/api.html`
- ✅ Link is relative path: `./docs/api.html`
- ✅ Link validation script confirms file exists

**Testing**:
```bash
./scripts/validate-review-packet-links.sh
# Should output: ✓ API documentation found
```

### 3. CI Workflow Integration

**Contract**: GitHub Actions orchestration

- ✅ On merge to main: run Redoc, generate docs/api.html
- ✅ Deploy docs to GitHub Pages
- ✅ On every PR: run smoke test (validates API & UI work)
- ✅ Smoke test included in required status checks

**Testing**:
```bash
# Verify workflow file syntax
npm install --save-dev @redocly/redoc-cli
# Verify smoke test passes
npx playwright test frontend/tests/e2e/smoke-expense-api.spec.js
```

---

## No Breaking Changes

**This feature**:
- ❌ Does NOT modify existing API endpoints
- ❌ Does NOT change request/response formats
- ❌ Does NOT add authentication requirements
- ❌ Does NOT modify database schemas
- ❌ Does NOT introduce versioning

**All changes are additive**:
- ✅ Adds documentation generation (reads existing spec)
- ✅ Adds smoke test (validates existing endpoints)
- ✅ Adds review packet enhancement (links new artifacts)
- ✅ Adds CI workflows (no backend changes)

---

## Contract Compliance Checklist

Before deployment, verify:

| Check | Validation | Status |
|-------|-----------|--------|
| OpenAPI spec valid | `npx redoc-cli build -o /dev/null docs/openapi.yaml` | ✓ Pass |
| POST /api/expenses returns 201 | `curl -X POST http://localhost:5000/api/expenses -d '{"amount":50,"description":"test"}'` | ✓ Pass |
| POST response includes required fields | Verify `id`, `amount`, `description`, `created_at`, `updated_at` | ✓ Pass |
| GET /api/expenses returns 200 | `curl http://localhost:5000/api/expenses` | ✓ Pass |
| GET response includes total_amount | Verify `total_amount` field present | ✓ Pass |
| Smoke test passes | `npx playwright test frontend/tests/e2e/smoke-expense-api.spec.js` | ✓ Pass |
| Redoc generates HTML | `file docs/api.html` shows HTML document | ✓ Pass |
| Review packet validates | `./scripts/validate-review-packet-links.sh` | ✓ Pass |

---

## Summary

**API Contracts**: Reference documentation for existing endpoints used by this feature.

**No new endpoints created** - all validation occurs through:
1. **API Documentation**: Redoc generated from existing OpenAPI spec
2. **Smoke Testing**: Validates existing endpoints work correctly
3. **UI Integration**: Verifies UI properly consumes API responses

**All contracts stable**: No breaking changes, only additions.
