
# Implementation Plan: Rate Limiter for POST Routes

**Branch**: `024-title-week-5` | **Date**: 2025-11-05 | **Spec**: [Rate Limiter Specification](./spec.md)
**Input**: Feature specification from `/specs/024-title-week-5/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Implement a rate limiter middleware for POST routes (`POST /convert`, `POST /expenses`) to protect the API from abuse and brute-force attacks. The rate limiter will enforce a 100-requests-per-15-minute sliding window per client IP address, independently per endpoint. GET routes remain unrestricted. When exceeded, the API returns HTTP 429 with `Retry-After` headers. State is in-memory with configurable proxy trust settings for XFF header inspection.

## Technical Context
**Language/Version**: Node.js/TypeScript (api/ backend uses TypeScript)  
**Primary Dependencies**: express-rate-limit (middleware), Express.js, Supertest (testing)  
**Storage**: In-memory state (no persistence across restarts)  
**Testing**: Vitest + Supertest (integration tests)  
**Target Platform**: Node.js server (api/ backend)
**Project Type**: Web (frontend + backend architecture detected)  
**Performance Goals**: Low-latency rate limit checks (< 5ms per request), minimal memory overhead  
**Constraints**: In-memory only; no external state store; 15-minute window precision  
**Scale/Scope**: Two endpoints protected; independent quota tracking per IP per endpoint

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Principle I - No Logic Duplication**: ✅ PASS  
- Rate limiter is a middleware concern, not business logic duplication  
- All state tracking occurs at the API boundary layer  

**Principle II - Test Coverage Mandate**: ✅ PASS  
- Rate limiter integration tests via Supertest (Vitest)  
- Tests verify 429 responses, Retry-After headers, window reset behavior  
- Backend API coverage maintained at existing thresholds  

**Principle III - Reviewability is Paramount**: ✅ PASS  
- Integration tests included in CI review packet  
- Middleware configuration documented in contracts/  

**Principle IV - PR Craft**: ✅ PASS  
- Rate limiter middleware addition ≤ 100 LOC (typical express-rate-limit config)  
- Integration tests ≤ 150 LOC  
- Total change well under 300 LOC limit  

**Principle V - Simplicity & Consistency**: ✅ PASS  
- Use standard express-rate-limit (minimal, well-maintained package)  
- Follows existing TypeScript/Vitest test patterns  
- No new tools or frameworks introduced  

**Overall**: ✅ ALL GATES PASS - No violations. Approach is compliant.

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)

This is a **Web Application** (frontend + backend detected). The rate limiter implementation modifies the API backend only:

```
api/
├── src/
│   ├── middleware/          # ← NEW: Rate limiter middleware
│   │   └── rate-limit.ts
│   ├── services/
│   ├── models/
│   └── index.ts             # ← MODIFY: Register middleware
└── tests/
    └── integration/
        └── rate-limit.test.ts   # ← NEW: Integration tests

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/
    # No frontend changes for this feature
```

**Structure Decision**: Backend-only modification. Rate limiter is implemented as Express middleware in `api/src/middleware/rate-limit.ts` and registered in the Express app initialization. Integration tests verify rate limiting behavior across POST endpoints.

## Phase 0: Outline & Research ✅ COMPLETE

**Executed**: 2025-11-05 14:30 UTC

**Findings Summary**:
- Technology choice: `express-rate-limit` (industry standard, maintained, fits architecture)
- Client identification: Express `request.ip` with configurable proxy trust
- Window management: Sliding window (15 min), library default behavior
- Per-endpoint quotas: Separate middleware instances per route
- Retry-After header: Custom handler converts window reset time to seconds
- Testing: Supertest + Vitest integration tests (existing stack)
- Logging: info-level structured logs (IP, endpoint, timestamp)
- Storage: In-memory only (per specification requirement)

**Output**: `research.md` with 8 decisions, all NEEDS CLARIFICATION resolved ✅

## Phase 1: Design & Contracts ✅ COMPLETE

**Executed**: 2025-11-05 14:30 UTC

**Artifacts Generated**:

1. ✅ **data-model.md**
   - Core entity: RateLimitState (IP, endpoint, window tracking, request count)
   - State lifecycle: Creation → Counting → Limit_Reached → Reset → Purged
   - Key invariants: Per-endpoint independent quotas, sliding window
   - Configuration: windowMs=900000 (15 min), max=100 per endpoint
   - Memory footprint: ~100 bytes per IP+endpoint entry

2. ✅ **contracts/rate-limit-contracts.md**
   - Contract 1: POST /api/convert (100 req/15 min, independent quota)
   - Contract 2: POST /api/expenses (100 req/15 min, independent quota)
   - Contract 3: Independent quota per endpoint
   - Contract 4: GET routes exempt from rate limiting
   - Contract 5: Retry-After header accuracy
   - Contract 6: Proxy trust configuration (X-Forwarded-For)
   - Contract 7: Logging on rate limit rejection
   - 7 contract test scenarios (Vitest + Supertest pattern)

3. ✅ **quickstart.md**
   - Setup instructions (dependencies, environment)
   - Implementation verification (middleware, registration, GET exemption)
   - Integration test execution (npm test)
   - Manual testing guide (curl commands for all scenarios)
   - Acceptance criteria validation (5 scenarios)
   - Troubleshooting guide
   - Compliance checklist

4. ✅ **Agent Context Updated**
   - Ran: `.specify/scripts/bash/update-agent-context.sh cursor`
   - Updated: `.cursor/rules/specify-rules.mdc`
   - Added: Node.js/TypeScript, express-rate-limit, in-memory storage

**Design Review**:
- ✅ No constitutional violations (re-verified post-Phase-1)
- ✅ All FR-001 through FR-011 addressed in contracts
- ✅ Test scenarios map to acceptance criteria
- ✅ Logging and observability included
- ✅ Proxy configuration covered

**Output**: All Phase 1 artifacts complete

## Phase 2: Task Planning Approach ✅ DOCUMENTED

**Task Generation Strategy** (to be executed by /tasks command):

1. **Contract-Driven Tests** [P - parallel]
   - Task: Create `api/tests/integration/rate-limit.test.ts`
   - Scenarios: All 7 contracts (convert, expenses, quotas, GET exempt, Retry-After, proxy, logging)
   - Tests must fail initially (no implementation yet)
   - ~80-100 LOC

2. **Middleware Implementation** [Sequential]
   - Task: Create `api/src/middleware/rate-limit.ts`
   - Implement: express-rate-limit config, window tracking, 429 handler
   - Include: Custom Retry-After header logic
   - Include: Logging on rejection
   - Include: Skip function for GET routes
   - ~60-80 LOC

3. **Application Registration** [Sequential]
   - Task: Register middleware in `api/src/index.ts`
   - Register: POST /api/convert route
   - Register: POST /api/expenses route
   - Ensure: GET routes not guarded
   - Verify: No existing tests broken
   - ~20-30 LOC

4. **Integration Test Validation** [Sequential]
   - Task: Run `npm test` in api/ directory
   - Verify: All 7+ rate limit tests pass
   - Verify: No regression in existing tests
   - Coverage: Middleware rates at >80% line coverage

5. **Manual Verification** [Sequential]
   - Task: Run quickstart.md steps (setup, server test, curl tests)
   - Verify: 100 requests succeed, 101st returns 429
   - Verify: Retry-After header accurate
   - Verify: GET requests bypass limit
   - Verify: Independent quotas per endpoint
   - Verify: Logging output includes IP/endpoint/timestamp

**Ordering Dependency Graph**:
```
Contract Tests (fail) → Middleware → Register in App → Verify Tests Pass → Manual Test
```

**Estimated Output**: 10-12 numbered tasks in tasks.md (well under 300 LOC change limit)

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*Updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command) ✅ 2025-11-05 14:30
  - 8 technology decisions documented in research.md
  - No NEEDS CLARIFICATION markers remain
- [x] Phase 1: Design complete (/plan command) ✅ 2025-11-05 14:30
  - data-model.md: RateLimitState entity, state lifecycle, invariants
  - contracts/rate-limit-contracts.md: 7 contracts with test scenarios
  - quickstart.md: Setup, verification, manual testing, acceptance criteria
  - Agent context updated (Cursor IDE)
- [x] Phase 2: Task planning complete (/plan command - describe approach only) ✅ 2025-11-05 14:30
  - 5-step approach documented (tests → middleware → registration → validation → manual verify)
  - Dependency graph specified
  - Estimated 10-12 tasks, <300 LOC total
- [ ] Phase 3: Tasks generated (/tasks command) ⏳ Pending
- [ ] Phase 4: Implementation complete ⏳ Pending
- [ ] Phase 5: Validation passed ⏳ Pending

**Gate Status**:
- [x] Initial Constitution Check: PASS ✅ (Principles I-V all pass)
- [x] Post-Design Constitution Check: PASS ✅ (No new violations, design compliant)
- [x] All NEEDS CLARIFICATION resolved ✅ (Feature spec has Session 2025-11-05 clarifications)
- [x] Complexity deviations documented ✅ (None; approach is straightforward)

**Final Status**: ✅ /plan command COMPLETE - Ready for /tasks command

---
*Based on Constitution v1.1.0 - See `/memory/constitution.md`*
