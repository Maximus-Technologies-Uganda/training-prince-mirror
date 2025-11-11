# API Contracts: Rate Limiter

**Phase**: Phase 1 - Design & Contracts  
**Date**: 2025-11-05  
**Feature**: Rate Limiter for POST Routes  

---

## Contract 1: POST /api/convert (Rate Limit Protected)

### Endpoint
```
POST /api/convert
```

### Rate Limit Rules
- **Limit**: 100 requests per 15-minute sliding window
- **Scope**: Per client IP address
- **Window**: Independent (separate from /expenses quota)

### Request
```http
POST /api/convert HTTP/1.1
Host: api.example.com
Content-Type: application/json

{
  "value": 32,
  "unit": "celsius"
}
```

### Success Response (200 OK)
**Condition**: Within rate limit AND valid request

```http
HTTP/1.1 200 OK
Content-Type: application/json
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 57
X-RateLimit-Reset: 1730796943000

{
  "celsius": 32,
  "fahrenheit": 89.6
}
```

### Rate Limit Exceeded Response (429)
**Condition**: `requestCount >= 100` in current 15-min window

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Retry-After: 43
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1730796943000

{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded for this endpoint. Retry after 43 seconds.",
  "retryAfter": 43
}
```

### Header Details

| Header | Value | Description |
|--------|-------|-------------|
| `X-RateLimit-Limit` | `100` | Maximum requests per window |
| `X-RateLimit-Remaining` | `0-100` | Requests remaining in current window |
| `X-RateLimit-Reset` | epoch ms | Epoch ms when window resets |
| `Retry-After` | seconds | (429 only) Seconds until retry possible |

### Test Scenarios (Contract Tests)

#### Scenario 1.1: Valid Request Within Limit
```
Given: Client has made 50 requests in current window
When: Client makes request #51
Then: Response is 200 OK with converted result
And: X-RateLimit-Remaining = 49
```

#### Scenario 1.2: Exactly at Limit
```
Given: Client has made 99 requests in current window
When: Client makes request #100
Then: Response is 200 OK with converted result
And: X-RateLimit-Remaining = 0
```

#### Scenario 1.3: Exceeded Limit
```
Given: Client has made 100 requests in current window
When: Client makes request #101
Then: Response is 429 Too Many Requests
And: Response includes Retry-After header
And: Response body includes retryAfter field
```

#### Scenario 1.4: After Window Reset
```
Given: Client exceeded limit
And: 15 minutes have passed since window start
When: Client makes new request
Then: Response is 200 OK (new window started)
And: X-RateLimit-Remaining = 99
```

---

## Contract 2: POST /api/expenses (Rate Limit Protected)

### Endpoint
```
POST /api/expenses
```

### Rate Limit Rules
- **Limit**: 100 requests per 15-minute sliding window
- **Scope**: Per client IP address
- **Window**: Independent (separate from /convert quota)

### Request
```http
POST /api/expenses HTTP/1.1
Host: api.example.com
Content-Type: application/json

{
  "description": "Office supplies",
  "amount": 42.50,
  "category": "supplies"
}
```

### Success Response (200 OK)
**Condition**: Within rate limit AND valid request

```http
HTTP/1.1 200 OK
Content-Type: application/json
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1730796943000

{
  "id": "exp_12345",
  "description": "Office supplies",
  "amount": 42.50,
  "category": "supplies",
  "createdAt": "2025-11-05T14:30:00Z"
}
```

### Rate Limit Exceeded Response (429)
**Condition**: `requestCount >= 100` in current 15-min window

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Retry-After: 127
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1730797547000

{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded for this endpoint. Retry after 127 seconds.",
  "retryAfter": 127
}
```

### Contract Tests (Same as Convert)

#### Scenario 2.1-2.4: (Identical to Contract 1.1-1.4)

---

## Contract 3: Independent Quota Per Endpoint

### Contract
The rate limit quota for `/api/convert` is **independent** from `/api/expenses`.

### Scenario 3.1: Hit Limit on One Endpoint, Other Unaffected
```
Given: Client has made 100 requests to POST /api/convert
And: Client has made 50 requests to POST /api/expenses
When: Client makes request #51 to POST /api/expenses
Then: Response is 200 OK (not rate limited)
And: Remaining count for /expenses is 49

When: Client makes request #101 to POST /api/convert
Then: Response is 429 Too Many Requests
And: Error applies only to /api/convert
```

### Test Implementation
```typescript
// Pseudo-test structure
test('Quotas are independent per endpoint', async () => {
  // Make 100 requests to POST /api/convert
  // Make 101 requests to POST /api/expenses
  // Verify convert returns 429; expenses succeeds
});
```

---

## Contract 4: GET Routes Exempt

### Contract
GET requests to any endpoint are **never** rate limited.

### Scenario 4.1: GET Requests Ignore Rate Limit
```
Given: Client has made 100 requests to POST /api/convert
When: Client makes GET /api/expenses (retrieve list)
Then: Response is 200 OK
And: No Retry-After header
And: No rate limit headers

When: Client makes multiple rapid GET requests
Then: All requests succeed without 429
```

### Test Implementation
```typescript
test('GET routes are not rate limited', async () => {
  // Make many rapid GET requests
  // Verify all succeed with 200
  // Verify no X-RateLimit headers
});
```

---

## Contract 5: Retry-After Accuracy

### Contract
The `Retry-After` header MUST accurately reflect seconds remaining in the current window.

### Scenario 5.1: Retry-After Header Timing
```
Given: Window started at T0
And: Current time is T0 + 10 minutes
And: Window duration is 15 minutes
When: Client exceeds limit and receives 429
Then: Retry-After header = 300 (5 minutes remaining)

When: Another request arrives 1 second later
Then: Retry-After header ≈ 299 seconds
```

### Validation
- Retry-After value should be within ±2 seconds of actual remaining time
- Should decrease as window approaches reset

---

## Contract 6: Proxy Trust Configuration

### Contract
Rate limiter MUST respect Express `trust proxy` setting for X-Forwarded-For header.

### Scenario 6.1: Trusted Proxy
```
Given: Express configured with: app.set('trust proxy', true)
When: Request arrives with header:
      X-Forwarded-For: 10.0.0.1, 10.0.0.2
Then: Rate limiter uses clientIp = 10.0.0.1
And: Quota tracked per 10.0.0.1
```

### Scenario 6.2: Untrusted Proxy
```
Given: Express configured with: app.set('trust proxy', false)
When: Request arrives with header:
      X-Forwarded-For: 10.0.0.1
Then: Rate limiter uses clientIp = direct connection IP
And: X-Forwarded-For is ignored
```

### Test Implementation
```typescript
test('Respects trust proxy configuration', async () => {
  // Configure app with/without proxy trust
  // Verify correct IP identification
});
```

---

## Contract 7: Logging on Rate Limit Rejection

### Contract
Each 429 response MUST be logged at info level with: client IP, endpoint, timestamp.

### Log Format
```
Rate limit exceeded: ip=192.168.1.1 endpoint=/api/convert timestamp=2025-11-05T14:30:00Z
```

### Scenario 7.1: Logging Verification
```
Given: Client exceeds rate limit
When: 429 response is sent
Then: Info log entry created with:
      - Client IP address
      - Target endpoint
      - ISO 8601 timestamp
```

---

## Summary Table

| Contract | Endpoint | Method | Rate Limited | Quota | Window | Independent |
|----------|----------|--------|--------------|-------|--------|-------------|
| 1 | /api/convert | POST | YES | 100 | 15 min | Per endpoint |
| 2 | /api/expenses | POST | YES | 100 | 15 min | Per endpoint |
| 3 | Both | POST | YES | 100 each | 15 min | Independent |
| 4 | Any | GET | NO | N/A | N/A | N/A |
| 5 | Both POST | POST | YES | 100 | 15 min | Retry-After accuracy |
| 6 | Both | POST | YES | 100 | 15 min | Proxy config |
| 7 | Both | POST | YES | 100 | 15 min | Logging |

---

## Implementation Notes for Contract Tests

**Tooling**: Vitest + Supertest  
**Location**: `api/tests/integration/rate-limit.test.ts`  
**Test Pattern**:
```typescript
import request from 'supertest';
import { app } from '../../src/index';

describe('Rate Limiter Contracts', () => {
  test('Contract 1.1: Valid request within limit', async () => {
    const response = await request(app)
      .post('/api/convert')
      .send({ value: 32, unit: 'celsius' });
    
    expect(response.status).toBe(200);
    expect(response.headers['x-ratelimit-remaining']).toBeDefined();
  });
  
  // ... more tests
});
```

---

## Phase 1 Status

- [x] API contracts defined for all POST endpoints
- [x] Success and error responses documented
- [x] Rate limit behavior per contract specified
- [x] Contract test scenarios outlined
- [x] Edge cases documented (proxy trust, GET exemption, independent quotas)
- [x] Logging contract specified
- [x] All contracts map to specification requirements (FR-001 through FR-011)

**Contracts Artifact**: ✅ COMPLETE

---

