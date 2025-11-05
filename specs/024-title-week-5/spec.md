# Feature Specification: Rate Limiter for POST Routes

**Feature Branch**: `024-title-week-5`  
**Created**: 2025-11-05  
**Status**: ✅ Complete - Ready for Merge  
**Input**: User description: "Week 5 Stretch Goal: Implement Rate Limiter for POST Routes. Install a standard rate-limiting middleware (e.g., express-rate-limit) and apply it to POST routes (POST /convert and POST /expenses). GET routes should not be limited. Configure reasonable limits (e.g., 100 requests per 15-minute window) and ensure that when exceeded, the API returns a 429 Too Many Requests status code. Add integration tests using Supertest to verify the rate limiter works correctly."

## Execution Flow (main)
```
1. Parse user description from Input
   → COMPLETED: Clear description with specific requirements
2. Extract key concepts from description
   → Identified: actors (API clients), actions (POST requests), data (rate limit state), constraints (100 requests/15min, GET routes exempt)
3. For each unclear aspect:
   → No ambiguities found - all core requirements specified
4. Fill User Scenarios & Testing section
   → Clear user flows identified
5. Generate Functional Requirements
   → All requirements are testable
6. Identify Key Entities
   → Rate limiter state tracked per IP/client
7. Run Review Checklist
   → All checks pass
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines
- ✅ Focus on WHAT clients need and WHY (API protection, abuse prevention)
- ❌ Avoid HOW to implement (no express-rate-limit code, no middleware implementation details)
- 👥 Written for stakeholders understanding API robustness needs

---

## Clarifications

### Session 2025-11-05
- Q: Retry-After header format? → A: Seconds only (e.g., `Retry-After: 60`)
- Q: Rate limit scope per endpoint? → A: Separately per endpoint (each POST route has independent 100-request quota)
- Q: IP address trust with proxies? → A: Configurable trust proxy (allow config of trusted proxies; use X-Forwarded-For only from trusted sources)
- Q: Monitoring & observability signals? → A: Basic logging (log each rate limit rejection at info level: IP, endpoint, timestamp)
- Q: State persistence & deployment? → A: In-memory only (state stored in application memory; resets on restart)

---

## User Scenarios & Testing *(mandatory)*

### Primary User Story
As an API administrator, I want to protect the API from abuse and brute-force attacks by limiting the rate at which clients can submit data through POST endpoints. This allows the API to remain responsive and prevents malicious actors from overwhelming the service with excessive requests.

### Acceptance Scenarios
1. **Given** a client is making requests to POST /convert, **When** they make 100 requests within a 15-minute window, **Then** all requests succeed with 200/201 responses
2. **Given** a client has already made 100 requests in a 15-minute window, **When** they make a 101st request within that same window, **Then** the request is rejected with a 429 Too Many Requests status code
3. **Given** a client received a 429 rate limit error, **When** 15 minutes have passed since the window started, **Then** their request quota is reset and they can make requests again
4. **Given** a client is making requests to GET /expenses, **When** they make any number of requests in rapid succession, **Then** they are never rate limited (no 429 responses)
5. **Given** a client receives a 429 response, **When** they inspect the response headers and body, **Then** they receive clear information about when they can retry

### Edge Cases
- What happens when multiple clients make requests from the same network/proxy (potential false positive rate limiting)?
- How does the system handle clock skew or system time changes during a 15-minute window?
- What happens to the rate limiter during deployment or server restarts?
- How are different POST routes (e.g., /convert vs /expenses) tracked - separately or together?

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: System MUST limit POST requests to /convert endpoint to a maximum of 100 requests per 15-minute sliding window based on client IP address
- **FR-002**: System MUST limit POST requests to /expenses endpoint to a maximum of 100 requests per 15-minute sliding window based on client IP address
- **FR-003**: System MUST NOT apply rate limiting to GET requests (GET /expenses, GET /convert history, etc.)
- **FR-004**: System MUST return HTTP 429 (Too Many Requests) status code when a client exceeds their rate limit
- **FR-005**: System MUST include a `Retry-After` response header in the 429 response indicating seconds remaining until the client can retry (e.g., `Retry-After: 60` for 60 seconds)
- **FR-006**: System MUST track rate limit state per client IP address independently for each POST endpoint (so hitting the 100-request limit on /convert does not affect the separate 100-request quota for /expenses, and vice versa)
- **FR-007**: System MUST automatically reset client quotas after the 15-minute window expires
- **FR-008**: System MUST continue to process valid requests correctly (with proper response status codes and data) when rate limiting is active on other clients
- **FR-009**: System MUST support configurable trust proxy settings to allow operators to specify which proxies are trusted for X-Forwarded-For header inspection (if operating behind a reverse proxy); when not configured, rate limiting uses the direct connection IP address
- **FR-010**: System MUST log each rate limit rejection (429 response) at info level, including the client IP address, targeted endpoint, and timestamp for operational visibility and troubleshooting
- **FR-011**: System MUST store rate limit state in application memory (in-process); state is not persisted across application restarts (rate limits reset when the server restarts)

### Key Entities
- **Rate Limit Window**: A 15-minute time period used to track and reset request counts
- **Client/IP Address**: The source IP identifying the rate limit subject; used as the key for tracking request counts
- **Request Count**: The number of requests made by a client within the current window for a specific endpoint
- **Quota**: The maximum allowed requests (100) per window for a POST endpoint

---

## Review & Acceptance Checklist
*GATE: Automated checks run during specification creation*

### Content Quality
- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs (API protection)
- [x] Written for stakeholders understanding API robustness
- [x] All mandatory sections completed

### Requirement Completeness
- [x] No [NEEDS CLARIFICATION] markers remain (all critical clarifications resolved)
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable (100 requests, 15 minutes, 429 status)
- [x] Scope is clearly bounded (POST routes only, specific endpoints)
- [x] Dependencies and assumptions identified

---

## Execution Status
*Updated during specification creation*

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities resolved through interactive clarification
- [x] User scenarios defined
- [x] Requirements generated and clarified (11 functional requirements)
- [x] Entities identified
- [x] Review checklist fully passed (5 clarifications integrated)

---
