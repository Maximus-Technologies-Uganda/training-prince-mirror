# Quickstart: Testing the Expense API Endpoints

**Branch**: `023-title-week-5` | **Date**: November 5, 2025  
**Purpose**: Manual validation of MVP endpoints following acceptance scenarios

---

## Prerequisites

1. **Environment**: Node.js 20+, npm installed
2. **API Server**: Running on `http://localhost:3000`
3. **Tool**: `curl` for HTTP requests, or Postman/Insomnia for GUI

---

## Setup

### 1. Start the API Server

```bash
cd /Users/prnceb/Desktop/WORK/hello-world/api
npm install
npm run dev
```

Expected output:
```
Server listening on http://localhost:3000
```

### 2. Verify Server Health

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{ "status": "ok" }
```

---

## Acceptance Scenario 1: Create an Expense

**Story**: No expenses exist. Client submits valid POST to `/expenses`. Server returns created expense with ID.

### Test Steps

**Step 1**: Submit a valid expense request
```bash
curl -X POST http://localhost:3000/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 25.50,
    "category": "food",
    "date": "2025-11-05"
  }'
```

**Expected Response** (201 Created):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "amount": 25.50,
  "category": "food",
  "date": "2025-11-05"
}
```

**Verification**: Response includes auto-assigned UUID in `id` field ✅

---

## Acceptance Scenario 2: Get Expense Summary (No Filters)

**Story**: Expenses exist. Client submits GET to `/expenses/summary`. Server returns aggregated totals.

### Test Steps

**Step 1**: Create two expenses
```bash
curl -X POST http://localhost:3000/expenses \
  -H "Content-Type: application/json" \
  -d '{ "amount": 20.00, "category": "food", "date": "2025-11-01" }'

curl -X POST http://localhost:3000/expenses \
  -H "Content-Type: application/json" \
  -d '{ "amount": 30.00, "category": "transport", "date": "2025-11-02" }'
```

**Step 2**: Retrieve summary without filters
```bash
curl http://localhost:3000/expenses/summary
```

**Expected Response** (200 OK):
```json
{
  "total": 50.00,
  "count": 2,
  "filters": {}
}
```

**Verification**: `total` is sum (20 + 30), `count` is 2, no filters applied ✅

---

## Acceptance Scenario 3: Get Summary with Category Filter

**Story**: Multiple categories exist. Client filters by category. Server returns category-specific totals.

### Test Steps

**Step 1**: Create expenses in different categories
```bash
curl -X POST http://localhost:3000/expenses \
  -H "Content-Type: application/json" \
  -d '{ "amount": 15.00, "category": "food", "date": "2025-11-03" }'

curl -X POST http://localhost:3000/expenses \
  -H "Content-Type: application/json" \
  -d '{ "amount": 50.00, "category": "utilities", "date": "2025-11-03" }'
```

**Step 2**: Filter by food category
```bash
curl "http://localhost:3000/expenses/summary?category=food"
```

**Expected Response** (200 OK):
```json
{
  "total": 35.00,
  "count": 2,
  "filters": { "category": "food" }
}
```

**Verification**: Only food expenses included (20 + 15 = 35), count is 2, filter shown ✅

---

## Acceptance Scenario 4: Get Summary with Month Filter

**Story**: Multiple months exist. Client filters by month. Server returns month-specific totals.

### Test Steps

**Step 1**: Create expenses in different months
```bash
curl -X POST http://localhost:3000/expenses \
  -H "Content-Type: application/json" \
  -d '{ "amount": 100.00, "category": "transport", "date": "2025-10-15" }'

curl -X POST http://localhost:3000/expenses \
  -H "Content-Type: application/json" \
  -d '{ "amount": 45.00, "category": "transport", "date": "2025-11-15" }'
```

**Step 2**: Filter by month 2025-11
```bash
curl "http://localhost:3000/expenses/summary?month=2025-11"
```

**Expected Response** (200 OK):
```json
{
  "total": 140.00,
  "count": 3,
  "filters": { "month": "2025-11" }
}
```

**Verification**: Only November expenses included, month filter shown ✅

---

## Acceptance Scenario 5: Get Summary with Both Filters

**Story**: Multiple filters provided. Client sends both category and month. Server applies AND logic.

### Test Steps

**Step 1**: Request with both filters
```bash
curl "http://localhost:3000/expenses/summary?category=food&month=2025-11"
```

**Expected Response** (200 OK):
```json
{
  "total": 35.00,
  "count": 2,
  "filters": { "category": "food", "month": "2025-11" }
}
```

**Verification**: Both filters applied (food AND November), both shown in response ✅

---

## Acceptance Scenario 6: Validation Error - Invalid Amount

**Story**: Invalid data submitted. Server rejects with 400 and descriptive error.

### Test Steps: Negative Amount

**Step 1**: Submit negative amount
```bash
curl -X POST http://localhost:3000/expenses \
  -H "Content-Type: application/json" \
  -d '{ "amount": -10, "category": "food", "date": "2025-11-05" }'
```

**Expected Response** (400 Bad Request):
```json
{
  "errors": [
    {
      "field": "amount",
      "message": "amount must be greater than 0"
    }
  ]
}
```

### Test Steps: Zero Amount

**Step 2**: Submit zero amount
```bash
curl -X POST http://localhost:3000/expenses \
  -H "Content-Type: application/json" \
  -d '{ "amount": 0, "category": "food", "date": "2025-11-05" }'
```

**Expected Response** (400 Bad Request):
```json
{
  "errors": [
    {
      "field": "amount",
      "message": "amount must be greater than 0"
    }
  ]
}
```

**Verification**: Both zero and negative rejected with clear message ✅

---

## Acceptance Scenario 7: Validation Error - Invalid Date Format

**Story**: Invalid date submitted. Server returns 400 with expected format shown.

### Test Steps

**Step 1**: Submit invalid date format
```bash
curl -X POST http://localhost:3000/expenses \
  -H "Content-Type: application/json" \
  -d '{ "amount": 25.00, "category": "food", "date": "11/05/2025" }'
```

**Expected Response** (400 Bad Request):
```json
{
  "errors": [
    {
      "field": "date",
      "message": "date must be in YYYY-MM-DD format (received: 11/05/2025)"
    }
  ]
}
```

**Verification**: Expected format shown, received value shown ✅

---

## Acceptance Scenario 8: No Matching Expenses

**Story**: Filter applied with no matches. Server returns empty summary.

### Test Steps

**Step 1**: Filter by non-existent category
```bash
curl "http://localhost:3000/expenses/summary?category=nonexistent"
```

**Expected Response** (200 OK):
```json
{
  "total": 0,
  "count": 0,
  "filters": { "category": "nonexistent" }
}
```

**Step 2**: Filter by non-existent month
```bash
curl "http://localhost:3000/expenses/summary?month=2024-12"
```

**Expected Response** (200 OK):
```json
{
  "total": 0,
  "count": 0,
  "filters": { "month": "2024-12" }
}
```

**Verification**: Empty results returned with filters still indicated ✅

---

## Acceptance Scenario 9: Missing Required Fields

**Story**: Required field omitted. Server returns 400 with validation error.

### Test Steps

**Step 1**: Submit without amount
```bash
curl -X POST http://localhost:3000/expenses \
  -H "Content-Type: application/json" \
  -d '{ "category": "food", "date": "2025-11-05" }'
```

**Expected Response** (400 Bad Request):
```json
{
  "errors": [
    {
      "field": "amount",
      "message": "amount is required"
    }
  ]
}
```

**Step 2**: Submit without category
```bash
curl -X POST http://localhost:3000/expenses \
  -H "Content-Type: application/json" \
  -d '{ "amount": 25.00, "date": "2025-11-05" }'
```

**Expected Response** (400 Bad Request):
```json
{
  "errors": [
    {
      "field": "category",
      "message": "category is required"
    }
  ]
}
```

**Verification**: Each missing field caught with specific error ✅

---

## Smoke Test (Quick Validation)

Run this sequence to quickly verify both endpoints work:

```bash
# 1. Create expense
RESPONSE=$(curl -s -X POST http://localhost:3000/expenses \
  -H "Content-Type: application/json" \
  -d '{ "amount": 42.99, "category": "test", "date": "2025-11-05" }')

echo "Created: $RESPONSE"

# 2. Get summary
curl -s http://localhost:3000/expenses/summary | jq .

# 3. Get summary with filter
curl -s "http://localhost:3000/expenses/summary?category=test" | jq .
```

**Expected**: 
- Step 1: Response includes `id`, `amount`, `category`, `date`
- Step 2: Response includes the created expense in totals
- Step 3: Response shows category filter applied

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 already in use | Kill process: `lsof -ti:3000 \| xargs kill -9` |
| 404 Not Found on /expenses | Verify route handler imported in server.ts |
| Validation not working | Check Zod schema in schemas/index.ts |
| Tests failing | Run `npm run test:coverage` to diagnose |

---

*Based on Specification 023-title-week-5 Acceptance Scenarios*

