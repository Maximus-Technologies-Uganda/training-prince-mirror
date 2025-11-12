# Data Model: Rate Limiter

**Phase**: Phase 1 - Design & Contracts  
**Date**: 2025-11-05  
**Feature**: Rate Limiter for POST Routes  

---

## Overview

The rate limiter maintains state about client request patterns. All state is in-memory, tracked per client IP address and endpoint.

---

## Core Entities

### RateLimitState

**Purpose**: Tracks request counts and window reset times per client IP per endpoint

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `clientIp` | string | Client IP address (from request.ip after proxy trust evaluation) | "192.168.1.100" |
| `endpoint` | string | Target POST endpoint (/convert, /expenses) | "/api/convert" |
| `windowStart` | number | Epoch milliseconds when current window began | 1730796600000 |
| `requestCount` | number | Number of requests in current window | 42 |
| `maxRequests` | number | Quota limit for this endpoint | 100 |
| `windowMs` | number | Window duration in milliseconds | 900000 (15 min) |

**Key Invariants**:
- `requestCount` ≤ `maxRequests` (after enforcement)
- `windowStart` + `windowMs` > `now()` (window active) OR quota reset
- Per-endpoint independent state (IP 192.168.1.1 has separate counts for /convert and /expenses)

**State Lifecycle**:
1. **Creation**: On first request from IP to endpoint → state created with `requestCount=1`
2. **Incremented**: Subsequent requests within window → `requestCount++`
3. **Rejected**: `requestCount >= maxRequests` → return 429
4. **Reset**: Window expires (`now() >= windowStart + windowMs`) → new window starts, `requestCount=0`
5. **Purged**: State removed from memory (no references); garbage collected after reset

---

## Key Entities (Specification FR Mapping)

### Rate Limit Window
- **Field**: `windowStart` (epoch ms), `windowMs` (duration)
- **Related Spec**: FR-001, FR-002, FR-007
- **Behavior**: Sliding 15-minute window per IP per endpoint
- **Reset**: Automatic after window expiration

### Client/IP Address
- **Field**: `clientIp`
- **Related Spec**: FR-001, FR-002, FR-006, FR-009
- **Behavior**: Extracted from `request.ip` (respects `trust proxy` config)
- **Scope**: Unique per endpoint (independent quotas)

### Request Count
- **Field**: `requestCount`
- **Related Spec**: FR-003, FR-004, FR-008
- **Behavior**: Incremented per request; compared against quota
- **Enforcement**: If `requestCount >= maxRequests`, respond with 429

### Quota
- **Field**: `maxRequests`
- **Related Spec**: FR-001, FR-002, FR-004
- **Value**: 100 requests per POST endpoint
- **Non-applicable**: GET routes never checked (FR-003)

---

## API Contract State

### Request Flow (POST /convert)

```
Client Request: POST /convert
  ↓
Express Middleware: rate-limit.ts
  ├─ Extract clientIp from request.ip
  ├─ Lookup state[clientIp]['/convert']
  ├─ Check: Is current window expired?
  │   ├─ YES → Reset state, start new window
  │   └─ NO → Use current window
  ├─ Check: requestCount >= 100?
  │   ├─ YES → Return 429 (Too Many Requests)
  │   │         Headers: Retry-After: {seconds remaining}
  │   └─ NO → Increment requestCount, allow request
  │           Headers: X-RateLimit-Limit: 100
  │                    X-RateLimit-Remaining: {100 - requestCount}
  │                    X-RateLimit-Reset: {resetTime epoch ms}
  ↓
Next Middleware / Route Handler
```

### Response Headers (429 Case)

```
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Retry-After: 43
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1730796943000

{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Retry after 43 seconds."
}
```

### Response Headers (Success Case)

```
HTTP/1.1 200 OK
Content-Type: application/json
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 57
X-RateLimit-Reset: 1730796943000

{ "result": "..." }
```

---

## Validation Rules

### IP Address Validation
- **Rule**: Must be non-empty string, valid IPv4 or IPv6 address
- **Enforced**: By Express `request.ip` property (framework level)
- **Error Handling**: If malformed, middleware skips (rare; Express validates)

### Window Timing Validation
- **Rule**: `windowStart + windowMs` must equal reset time
- **Enforced**: By middleware initialization
- **Error Handling**: If clock skew detected, reset and start new window

### Quota Enforcement
- **Rule**: `requestCount <= maxRequests` before increment
- **Enforced**: By middleware before calling `next()`
- **Error Handling**: If exceeded, respond 429; do not proceed to handler

---

## State Transitions

```
State Machine: Rate Limit Window

┌─────────────────────────────────────────────────────────────┐
│ INITIAL                                                     │
│ (No state for IP+endpoint)                                  │
└────────────────────────┬────────────────────────────────────┘
                         │ First request
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ COUNTING (requestCount < maxRequests)                       │
│ - windowStart = now()                                       │
│ - requestCount = 1                                          │
│ - Can process requests                                      │
└────────────────────────┬────────────────────────────────────┘
                         │ Each subsequent request
                         ├─ Window not expired → requestCount++, allow
                         └─ Window expired → RESET
                         
┌─────────────────────────────────────────────────────────────┐
│ LIMIT_REACHED (requestCount >= maxRequests)                 │
│ - Cannot process more requests                              │
│ - Return 429                                                │
└────────────────────────┬────────────────────────────────────┘
                         │ When window expires
                         ↓
                    (Back to COUNTING)
```

---

## Configuration Data

### Middleware Configuration

| Setting | Value | Type | Rationale |
|---------|-------|------|-----------|
| `windowMs` | 900000 | ms | 15 minutes (spec FR-001) |
| `max` | 100 | count | Per endpoint quota (spec FR-001, FR-002) |
| `trustProxy` | configurable | boolean or array | Support proxied deployments (spec FR-009) |
| `keyGenerator` | `(req) => req.ip` | function | Extract client IP respecting proxy config |
| `handler` | custom | function | Return 429 with Retry-After header |
| `skip` | `(req) => req.method !== 'POST'` | function | Exempt GET routes (spec FR-003) |

---

## Memory Footprint Estimation

**Per Client per Endpoint**:
- `clientIp`: ~20 bytes (IPv4/IPv6 string)
- `endpoint`: ~15 bytes (string "/convert" or "/expenses")
- `windowStart`: 8 bytes (number)
- `requestCount`: 8 bytes (number)
- Other fields: ~50 bytes (metadata)
- **Total per entry**: ~100 bytes

**Scaling Example** (one app instance):
- 1000 active clients × 2 endpoints = 2000 entries
- 2000 × 100 bytes = ~200 KB memory
- Acceptable for in-memory storage

---

## Compatibility & Dependencies

- **Express.js**: Built-in `request.ip` property ✅
- **express-rate-limit**: External package, added to api/package.json ✅
- **TypeScript**: Types available (@types/express-rate-limit) ✅
- **Vitest**: Existing test framework ✅
- **Supertest**: HTTP testing for integration tests ✅

---

## Completion Status

- [x] Core entities defined (RateLimitState)
- [x] API contract states documented
- [x] Validation rules specified
- [x] State transitions mapped
- [x] Configuration parameters listed
- [x] Memory footprint estimated
- [x] All FR requirements mapped to entities

**Phase 1 Artifact**: ✅ COMPLETE

---

