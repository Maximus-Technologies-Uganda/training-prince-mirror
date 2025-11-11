# Research: Rate Limiter Implementation

**Phase**: Phase 0 - Outline & Research  
**Date**: 2025-11-05  
**Feature**: Rate Limiter for POST Routes  

---

## Research Summary

All technical unknowns from the feature specification have been resolved. The specification contains explicit clarifications (Session 2025-11-05) for the critical design decisions.

---

## Decision 1: Express-Rate-Limit Library

**Decision**: Use `express-rate-limit` (npm package) as the primary rate limiter middleware  

**Rationale**:
- Industry standard, actively maintained, ~2M weekly downloads
- Minimal dependencies (only required libraries already in api/package.json)
- Flexible store backends (default: memory; can use Redis, Memcached, etc.)
- HTTP 429 status + Retry-After header built-in
- Configurable per-route (can apply selectively to POST endpoints)
- TypeScript types available (@types/express-rate-limit)
- Aligns with Express.js architecture (no additional abstractions needed)

**Alternatives Considered**:
- Custom middleware: Rejected - higher maintenance burden, potential bugs, slower time-to-market
- Redis-backed limiter: Rejected - specification requires in-memory only; introduces operational complexity
- Nginx rate limit: Rejected - shifts responsibility outside application; violates spec requirement for 429 via application API

**Outcome**: ✅ express-rate-limit selected

---

## Decision 2: Client Identification

**Decision**: Use client IP from `request.ip` (Express property) with configurable proxy trust  

**Rationale**:
- Express handles proxy trust configuration via `app.set('trust proxy', ...)`
- Built into Express; no additional dependencies
- Aligns with specification requirement: "configurable trust proxy" (FR-009)
- When proxy is trusted, Express automatically reads X-Forwarded-For
- When proxy is not trusted, falls back to direct connection IP

**Alternatives Considered**:
- Hardcoded X-Forwarded-For parsing: Rejected - security risk in un-proxied deployments
- Custom IP extraction logic: Rejected - Express already handles this; redundant

**Outcome**: ✅ Express `app.set('trust proxy')` + `request.ip` selected

---

## Decision 3: Window Management

**Decision**: Use sliding window with time-based window size (15 minutes)  

**Rationale**:
- express-rate-limit uses rolling (sliding) window by default with `windowMs` setting
- 15-minute window = `windowMs: 15 * 60 * 1000` (milliseconds)
- Request count stored per IP; automatically reset after window expires
- No manual cleanup needed - stale entries removed by library

**Alternatives Considered**:
- Fixed window: Rejected - allows request clustering at window boundaries
- Custom sliding window: Rejected - added complexity; library handles this

**Outcome**: ✅ Sliding window (15 minutes) via express-rate-limit default

---

## Decision 4: Per-Endpoint Quota Tracking

**Decision**: Create separate middleware instances per endpoint  

**Rationale**:
- express-rate-limit creates separate state per middleware instance
- Applying different middleware to `/convert` vs `/expenses` achieves independent quotas
- Simple configuration: `const limiter = rateLimit({...}); app.post('/convert', limiter, handler)`

**Alternatives Considered**:
- Single middleware with endpoint-aware logic: Rejected - adds complexity; per-instance is cleaner
- Request routing after middleware: Rejected - violates specification requirement to track independently

**Outcome**: ✅ Separate middleware instances per endpoint

---

## Decision 5: Retry-After Header

**Decision**: Use express-rate-limit's built-in `skip` and custom headers via middleware options  

**Rationale**:
- express-rate-limit's `skip` handler and handler functions allow custom logic
- Library supports `Retry-After` header in response via store implementations
- Specification requires: `Retry-After: 60` (seconds until quota reset)
- express-rate-limit default behavior includes X-RateLimit-Reset header (epoch ms); custom handler can convert to Retry-After (seconds)

**Implementation Pattern**:
```typescript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: (req, res) => {
    const retryAfter = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000);
    res.set('Retry-After', String(retryAfter));
    res.status(429).json({ error: 'Too Many Requests' });
  }
});
```

**Outcome**: ✅ Custom handler + Retry-After header

---

## Decision 6: Testing Strategy

**Decision**: Use Supertest + Vitest for integration testing  

**Rationale**:
- Supertest provides HTTP assertions for Express apps
- Vitest is already configured in api/ for unit tests
- Integration tests verify rate limiter behavior end-to-end
- No external dependencies beyond what's already in test stack

**Test Coverage**:
- Happy path: 100 requests succeed, 101st returns 429
- Window reset: Requests allowed after 15-minute window expires
- Independent endpoints: Limit on `/convert` doesn't affect `/expenses`
- GET isolation: GET requests never rate limited
- Header validation: 429 responses include Retry-After header

**Outcome**: ✅ Supertest + Vitest integration tests

---

## Decision 7: Logging & Observability

**Decision**: Emit structured log entries via `console.info` (or existing logger if available)  

**Rationale**:
- Specification requires basic logging: "IP, endpoint, timestamp" (FR-010)
- Express apps typically use console or pino/winston
- Check existing api/src/index.ts for logger pattern
- If no existing logger, use `console.info` for simplicity (meets specification requirement)

**Log Format**:
```
Rate limit exceeded: ip=192.168.1.1 endpoint=/convert timestamp=2025-11-05T14:30:00Z
```

**Outcome**: ✅ info-level logging via app's existing logger pattern

---

## Decision 8: Storage Backend

**Decision**: In-memory store (default express-rate-limit)  

**Rationale**:
- Specification explicitly requires: "In-memory only" (FR-011)
- express-rate-limit uses memory store by default
- No external state service needed
- State resets on application restart (per spec)

**Outcome**: ✅ In-memory (default)

---

## Technical Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Rate limiter state loss on restart | All clients reset quota after restart | Document behavior; specification explicitly allows this |
| Memory usage growth in long-running apps | Potential memory leak | Library handles cleanup; monitor in production |
| Proxy misconfiguration bypasses limiter | Wrong IP identified, limits ineffective | Document `trust proxy` configuration; clear error messages |
| Window boundary edge case | Request clustering at 15-min boundary | Sliding window (default) handles this; not fixed window |

---

## Approval Checklist

- [x] Technology choices aligned with specification clarifications
- [x] No NEEDS CLARIFICATION markers remain
- [x] All functional requirements addressable with chosen approach
- [x] Testing strategy defined
- [x] Logging/observability plan documented
- [x] No constitutional violations (verified in plan.md Constitution Check)

**Phase 0 Status**: ✅ COMPLETE - Ready for Phase 1 Design

---

