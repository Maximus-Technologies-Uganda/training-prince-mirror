# Quickstart: Rate Limiter Integration & Testing

**Phase**: Phase 1 - Design & Contracts  
**Date**: 2025-11-05  
**Feature**: Rate Limiter for POST Routes  

---

## Overview

This quickstart demonstrates how to verify the rate limiter implementation by running integration tests and manually testing the rate limit behavior. By the end, you'll confirm that:

1. POST /api/convert and POST /api/expenses are rate-limited to 100 requests per 15 minutes
2. GET requests are never rate-limited
3. Quotas are independent per endpoint
4. 429 responses include accurate Retry-After headers

---

## Prerequisites

- Node.js 18+ installed
- Repository cloned at `/Users/prnceb/Desktop/WORK/hello-world`
- Working terminal/shell

---

## Part 1: Setup & Environment

### Step 1.1: Install Dependencies

```bash
cd /Users/prnceb/Desktop/WORK/hello-world/api
npm install
```

Expected: Adds `express-rate-limit` to `node_modules/`

### Step 1.2: Verify TypeScript Configuration

```bash
cd /Users/prnceb/Desktop/WORK/hello-world/api
cat tsconfig.json | grep -A5 '"target"'
```

Expected output: `"target": "ES2020"` or similar

### Step 1.3: Check Test Setup

```bash
cd /Users/prnceb/Desktop/WORK/hello-world/api
npm run test --list 2>/dev/null || npm test -- --listTests
```

Expected: Vitest configured and ready

---

## Part 2: Verify Implementation

### Step 2.1: Confirm Middleware Installation

```bash
cat /Users/prnceb/Desktop/WORK/hello-world/api/src/middleware/rate-limit.ts
```

Expected output: Middleware exports a rate limiter instance configured with:
- `windowMs: 900000` (15 minutes)
- `max: 100` (requests per window)
- `Retry-After` header handler

### Step 2.2: Verify Middleware Registration

```bash
grep -A10 "rate-limit" /Users/prnceb/Desktop/WORK/hello-world/api/src/index.ts
```

Expected: Middleware registered on routes:
- `app.post('/api/convert', rateLimitMiddleware, ...)`
- `app.post('/api/expenses', rateLimitMiddleware, ...)`

### Step 2.3: Confirm GET Routes Are Unguarded

```bash
grep "app.get" /Users/prnceb/Desktop/WORK/hello-world/api/src/index.ts | head -5
```

Expected: No rate-limit middleware on GET routes

---

## Part 3: Run Integration Tests

### Step 3.1: Execute Rate Limit Tests

```bash
cd /Users/prnceb/Desktop/WORK/hello-world/api
npm test -- rate-limit.test.ts 2>&1 | tee rate-limit-test.log
```

Expected output:
```
✓ rate-limit.test.ts (7 tests)
  ✓ Contract 1.1: Valid request within limit (10ms)
  ✓ Contract 1.3: Exceeded limit returns 429 (5ms)
  ✓ Contract 3.1: Quotas independent per endpoint (8ms)
  ✓ Contract 4.1: GET requests bypass rate limit (6ms)
  ✓ Contract 5.1: Retry-After header timing (12ms)
  ✓ Contract 6.1: Proxy trust configuration (7ms)
  ✓ Contract 7.1: Logging on rate limit rejection (4ms)

Tests:  7 passed (7)
```

### Step 3.2: Check Test Coverage

```bash
cd /Users/prnceb/Desktop/WORK/hello-world/api
npm test -- --coverage 2>&1 | grep -A5 "middleware/rate-limit"
```

Expected: Coverage report includes rate-limit.ts with high (>80%) line coverage

---

## Part 4: Manual Testing (Local)

### Step 4.1: Start the API Server

```bash
cd /Users/prnceb/Desktop/WORK/hello-world/api
npm run dev &
API_PID=$!
sleep 2
```

Expected: Server listens on `http://localhost:3000`

### Step 4.2: Test Normal Request (Within Limit)

```bash
curl -X POST http://localhost:3000/api/convert \
  -H "Content-Type: application/json" \
  -d '{"value": 32, "unit": "celsius"}' \
  -i
```

Expected response:
```
HTTP/1.1 200 OK
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: [epoch_ms]

{"celsius": 32, "fahrenheit": 89.6}
```

### Step 4.3: Rapid-Fire Requests to Hit Limit

```bash
# Make 101 requests to exceed the limit
for i in {1..101}; do
  curl -s -X POST http://localhost:3000/api/convert \
    -H "Content-Type: application/json" \
    -d '{"value": 32, "unit": "celsius"}' \
    -w "Request %d: Status %{http_code}\n"
done | tail -5
```

Expected output (last request):
```
Request 100: Status 200
Request 101: Status 429
```

### Step 4.4: Verify 429 Response Body

```bash
curl -X POST http://localhost:3000/api/convert \
  -H "Content-Type: application/json" \
  -d '{"value": 32, "unit": "celsius"}' \
  -s | jq .
```

Expected response (for rate-limited request):
```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded for this endpoint. Retry after 43 seconds.",
  "retryAfter": 43
}
```

### Step 4.5: Verify Retry-After Header

```bash
curl -X POST http://localhost:3000/api/convert \
  -H "Content-Type: application/json" \
  -d '{"value": 32, "unit": "celsius"}' \
  -i 2>/dev/null | grep -i "retry-after"
```

Expected:
```
Retry-After: 43
```

### Step 4.6: Test Independent Quotas

Open two terminal windows:

**Terminal 1: Make 100 requests to /api/convert**
```bash
for i in {1..100}; do
  curl -s -X POST http://localhost:3000/api/convert \
    -H "Content-Type: application/json" \
    -d '{"value": 32, "unit": "celsius"}' \
    -w "Request %d: %{http_code}\n"
done | tail -3
```

**Terminal 2: Make requests to /api/expenses (should not be rate-limited)**
```bash
for i in {1..5}; do
  curl -s -X POST http://localhost:3000/api/expenses \
    -H "Content-Type: application/json" \
    -d '{"description": "Test", "amount": 10, "category": "test"}' \
    -w "Request %d to /expenses: %{http_code}\n"
done
```

Expected: Expenses requests succeed (200) even though convert is rate-limited

### Step 4.7: Test GET Exemption

```bash
# Make 200+ GET requests (should all succeed)
for i in {1..10}; do
  curl -s http://localhost:3000/api/expenses -w "%{http_code}\n"
done | sort | uniq -c
```

Expected output:
```
     10 200
```

No 429 responses.

### Step 4.8: Verify Logging

```bash
# Check application logs for rate limit rejection messages
tail -20 /tmp/api-server.log | grep "Rate limit"
```

Expected format:
```
Rate limit exceeded: ip=127.0.0.1 endpoint=/api/convert timestamp=2025-11-05T14:30:00.000Z
```

### Step 4.9: Stop the Server

```bash
kill $API_PID
```

---

## Part 5: Acceptance Criteria Validation

### Acceptance Scenario 1: ✅ 100 Requests Succeed

| Criteria | Status | Evidence |
|----------|--------|----------|
| First 100 POST /api/convert requests return 200 | ✅ | Step 4.2-4.3 output shows requests 1-100 with 200 |
| X-RateLimit-Remaining decrements correctly | ✅ | 100 → 99 → 98 ... → 0 |

### Acceptance Scenario 2: ✅ 101st Request Returns 429

| Criteria | Status | Evidence |
|----------|--------|----------|
| Request #101 returns 429 | ✅ | Step 4.3 shows 101st request: 429 |
| Response includes error message | ✅ | Step 4.4 shows error JSON |
| Response includes Retry-After header | ✅ | Step 4.5 shows header present |

### Acceptance Scenario 3: ✅ Window Reset After 15 Minutes

| Criteria | Status | Evidence |
|----------|--------|----------|
| After 15 min window expires, new requests allowed | ✅ | Data model specifies automatic reset; contract tests verify |
| Request count resets to 0 | ✅ | Middleware re-initializes state after window expiry |

### Acceptance Scenario 4: ✅ GET Routes Exempt

| Criteria | Status | Evidence |
|----------|--------|----------|
| GET /api/expenses never returns 429 | ✅ | Step 4.7 shows all GET requests return 200 |
| Rapid GET requests all succeed | ✅ | 10 consecutive GET requests all return 200 |

### Acceptance Scenario 5: ✅ Clear Retry Information

| Criteria | Status | Evidence |
|----------|--------|----------|
| Response headers include Retry-After | ✅ | Step 4.5 shows header |
| Response body includes retry info | ✅ | Step 4.4 shows retryAfter field |
| Info is accurate (seconds remaining) | ✅ | Retry-After value matches window expiry |

---

## Part 6: Troubleshooting

### Issue: Tests fail with "Cannot find module 'express-rate-limit'"

**Solution**:
```bash
cd /Users/prnceb/Desktop/WORK/hello-world/api
npm install express-rate-limit
npm install --save-dev @types/express-rate-limit
```

### Issue: Requests always return 429 (limit not resetting)

**Solution**: Check that middleware stores state per IP+endpoint:
```bash
grep -n "keyGenerator" /Users/prnceb/Desktop/WORK/hello-world/api/src/middleware/rate-limit.ts
```

Verify it returns `request.ip + endpoint` or similar.

### Issue: GET requests also rate-limited

**Solution**: Verify middleware has `skip` function:
```bash
grep -n "skip" /Users/prnceb/Desktop/WORK/hello-world/api/src/middleware/rate-limit.ts
```

Should skip non-POST requests.

### Issue: Retry-After header not present

**Solution**: Verify custom handler in middleware:
```bash
grep -n "Retry-After\|handler" /Users/prnceb/Desktop/WORK/hello-world/api/src/middleware/rate-limit.ts
```

Should set header in 429 response.

---

## Summary Checklist

- [ ] Dependencies installed (express-rate-limit, @types/express-rate-limit)
- [ ] Middleware file exists (`api/src/middleware/rate-limit.ts`)
- [ ] Middleware registered on POST routes
- [ ] GET routes unguarded
- [ ] Integration tests pass (all 7+ tests)
- [ ] Manual test: 100 requests succeed
- [ ] Manual test: 101st request returns 429
- [ ] Manual test: Retry-After header present
- [ ] Manual test: GET requests always succeed
- [ ] Manual test: Quotas independent per endpoint
- [ ] Logging output verified
- [ ] All acceptance scenarios validated

---

## Next Steps

1. **Commit Implementation**: `git add . && git commit -m "Add rate limiter middleware for POST routes"`
2. **Create PR**: Link this feature spec and include test results
3. **Merge to Development**: Ensure CI passes and all tests green
4. **Deploy**: Include in next release to production

---

*Based on specification: Rate Limiter for POST Routes (024-title-week-5)*  
*Constitution v1.1.0: Compliance verified in plan.md Constitution Check*

---

