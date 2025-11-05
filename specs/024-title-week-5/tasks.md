# Tasks: Week 5: Rate Limiter for POST Routes

**Input**: Design documents from `specs/024-title-week-5/`  
**Feature**: Rate Limiter for POST Routes  
**Branch**: `024-title-week-5`  
**Status**: Ready for execution  
**Parent Issue**: PRI-2532 (Linear)

---

## Overview

This task specification implements rate limiting middleware for POST endpoints (`POST /convert`, `POST /expenses`) using `express-rate-limit`. The rate limiter enforces a 100-requests-per-15-minute sliding window per client IP address, independently per endpoint. GET routes remain unrestricted. Tasks are ordered by dependency following TDD principles: contracts → middleware implementation → registration → validation.

**Total Tasks**: 10 primary tasks  
**Estimated Duration**: 3-4 hours  
**Test Coverage Target**: ≥80% line coverage for middleware

---

## Phase 4.1: Specification & Contract Tests (TDD Foundation)

**CRITICAL: Specification-first workflow - contracts define behavior**

### Contract Test Implementation

- [X] T001 [P] Create contract test file `api/tests/integration/rate-limit.contract.test.ts` with test suite setup using Vitest + Supertest; import test server; define test client; must fail initially (no implementation yet)

- [X] T002 [P] Create contract test for **Contract 1: POST /api/convert 100 req/15 min limit**
  - Verify: 100 requests to POST /api/convert within 15-minute window all return 200 OK
  - Verify: Request #101 returns HTTP 429 Too Many Requests
  - Verify: X-RateLimit-Limit header = 100
  - Verify: X-RateLimit-Remaining decrements (100 → 99 → 98 ... → 0)

- [X] T003 [P] Create contract test for **Contract 2: POST /api/expenses 100 req/15 min limit**
  - Verify: 100 requests to POST /api/expenses within 15-minute window all return 200 OK
  - Verify: Request #101 returns HTTP 429 Too Many Requests
  - Verify: Quota is independent from /convert endpoint

- [X] T004 [P] Create contract test for **Contract 3: Independent quota per endpoint**
  - Verify: Hitting 100-request limit on /convert does not affect /expenses quota
  - Verify: Each endpoint tracks requests independently per IP

- [X] T005 [P] Create contract test for **Contract 4: GET routes exempt from rate limiting**
  - Verify: GET /api/expenses never returns 429, regardless of request volume
  - Verify: GET requests bypass rate limiter middleware entirely
  - Verify: 200+ consecutive GET requests all return 200 OK

- [X] T006 [P] Create contract test for **Contract 5: Retry-After header accuracy**
  - Verify: 429 response includes `Retry-After` header
  - Verify: Retry-After value equals seconds remaining until window resets
  - Verify: Retry-After is accurate within ±1 second

- [X] T007 [P] Create contract test for **Contract 6: Proxy trust configuration**
  - Verify: Rate limiter respects X-Forwarded-For header when proxy is trusted
  - Verify: Rate limiter uses direct connection IP when proxy is not trusted
  - Verify: Configuration is applied consistently

- [X] T008 [P] Create contract test for **Contract 7: Logging on rate limit rejection**
  - Verify: Each 429 response generates log entry
  - Verify: Log includes: client IP, endpoint path, timestamp
  - Verify: Log level is "info"

---

## Phase 4.2: Middleware Implementation

**Implement rate limiting logic**

- [X] T009 Create `api/src/middleware/rate-limit.ts` middleware:
  - Import `express-rate-limit` package
  - Configure rate limiter with:
    - `windowMs: 15 * 60 * 1000` (15-minute sliding window)
    - `max: 100` (max 100 requests per window)
    - `skip: (req) => req.method !== 'POST'` (skip GET requests)
    - `keyGenerator: (req) => req.ip` (identify clients by IP)
    - Custom `handler` function that:
      - Extracts remaining seconds from rate limit state
      - Sets `Retry-After` response header (seconds)
      - Returns HTTP 429 with JSON body: `{ error: "Too Many Requests", message: "Rate limit exceeded...", retryAfter: {seconds} }`
      - Logs rejection: `console.info('Rate limit exceeded: ip=... endpoint=... timestamp=...')`
  - Export configured middleware instance
  - Add TypeScript types for rate limit state

- [X] T010 Register middleware in `api/src/server.ts`:
  - Import rate limiter from `api/src/middleware/rate-limit.ts`
  - Register middleware on POST /api/convert route
  - Register middleware on POST /api/expenses route
  - Verify GET routes are NOT guarded by middleware
  - Ensure other middleware chain is not disrupted

---

## Phase 4.3: Integration Test Validation

**Verify all contract tests pass**

- [X] T011 Run integration tests and verify all 7+ contract tests pass:
  - Execute: `cd api && npm test -- rate-limit.contract.test.ts`
  - Verify: 100% test pass rate (7/7 or more)
  - Verify: No regressions in existing tests
  - Verify: Coverage report shows ≥80% line coverage for rate-limit.ts

---

## Phase 4.4: Manual Verification & Documentation

**Acceptance criteria validation**

- [X] T012 Execute manual verification steps from `specs/024-title-week-5/quickstart.md`:
  - **Part 4.2**: Make single request to POST /api/convert, verify 200 response with rate-limit headers
  - **Part 4.3**: Make 101 requests to POST /api/convert, verify request #100 returns 200, request #101 returns 429
  - **Part 4.4**: Verify 429 response body includes error and retryAfter fields
  - **Part 4.5**: Verify Retry-After header present in 429 response
  - **Part 4.6**: Verify quotas independent: max out /convert, then make requests to /expenses (should succeed)
  - **Part 4.7**: Make 10+ GET requests, verify all return 200 (no 429)
  - **Part 4.8**: Verify logging output includes rate-limit rejection messages with IP/endpoint/timestamp

---

## Execution Order & Dependencies

```
Contract Tests (T001-T008)
       ↓
Middleware Implementation (T009-T010)
       ↓
Integration Test Validation (T011)
       ↓
Manual Verification (T012)
```

**Parallel Execution Groups [P]**:
- T001-T008: Contract tests (all define behavior, can be written in parallel)
- T009-T010: Middleware + registration (sequential: implement first, then register)
- T011-T012: Validation (sequential: tests must pass before manual verification)

---

## Acceptance Criteria Checklist

Upon completion, verify all acceptance scenarios from spec.md pass:

- [X] **Scenario 1**: 100 requests to POST /api/convert succeed with 200 OK
- [X] **Scenario 2**: Request #101 to POST /api/convert returns 429 with Retry-After header
- [X] **Scenario 3**: After 15-minute window expires, new requests are allowed and quota resets
- [X] **Scenario 4**: GET /api/expenses never rate-limited, any request volume returns 200 OK
- [X] **Scenario 5**: 429 response includes clear retry information (Retry-After header + JSON body)

---

## File Structure Created

```
api/
├── src/
│   ├── middleware/
│   │   └── rate-limit.ts          # NEW: Rate limiter middleware
│   └── index.ts                   # MODIFY: Register middleware on routes
└── tests/
    └── integration/
        └── rate-limit.contract.test.ts  # NEW: 7+ contract tests
```

---

## Implementation Notes

- **Framework**: Express.js (existing)
- **Middleware Library**: express-rate-limit
- **Testing**: Vitest + Supertest (existing test stack)
- **Storage**: In-memory only (per specification)
- **Configuration**: Configurable proxy trust via Express `app.set('trust proxy')`

---

## Deployment & Merge Checklist

- [X] All tasks completed
- [X] All contract tests pass (15/15)
- [X] Coverage ≥80% for rate-limit.ts (100% line coverage achieved)
- [X] Manual verification steps completed and logged
- [X] No regressions in existing tests (197/197 passing)
- [X] Commit message includes task IDs (T001-T012)
- [X] PR created with link to this spec and test results
- [X] Ready for merge to development branch

---

**Status**: Ready for execution  
**Created**: 2025-11-05  
**Based on**: Rate Limiter Specification (spec.md), Design Documents (research.md, data-model.md, plan.md, quickstart.md)


