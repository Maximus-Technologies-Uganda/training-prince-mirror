
# Implementation Plan: Week 5 Day 1: API Spec & Contracts First (Expenses)

**Branch**: `026-title-week-5` | **Date**: 2025-11-06 | **Spec**: `/specs/026-title-week-5/spec.md`
**Input**: Feature specification from `/specs/026-title-week-5/spec.md`

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
Create a complete OpenAPI 3.1.x specification for the expenses resource API (GET /expenses with pagination, POST /expenses, GET /expenses/summary) with shared Error Envelope schema and request-id header support. Write contract tests using supertest that initially fail (spec-first approach). Create spec-check CI job to validate OpenAPI spec. Update build-review-packet CI job to generate OpenAPI HTML documentation using Redoc or Scalar and include it in review artifacts.

## Technical Context
**Language/Version**: TypeScript 5.3.3, Node.js 20  
**Primary Dependencies**: Express 4.18.2, supertest 6.3.3, zod 3.22.4, OpenAPI 3.1.x  
**Storage**: N/A (spec-first, no implementation yet)  
**Testing**: Vitest 1.1.0, supertest for HTTP contract tests  
**Target Platform**: Node.js server (Express API)  
**Project Type**: web (frontend + backend)  
**Performance Goals**: N/A (spec-only phase)  
**Constraints**: OpenAPI spec must pass validation, contract tests must fail initially (endpoints don't exist), spec-check CI must be required status check  
**Scale/Scope**: 3 expense endpoints (GET /expenses, POST /expenses, GET /expenses/summary), shared Error Envelope schema, request-id header support, OpenAPI HTML documentation generation

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Principle I - No Logic Duplication**: ✅ PASS  
- This feature defines API contracts only (OpenAPI spec + contract tests)  
- No implementation logic, no duplication concerns

**Principle II - Test Coverage Mandate**: ✅ PASS  
- Contract tests written for all endpoints (FR-009 to FR-011)  
- Tests integrated into Test & Coverage - API CI job (FR-014)  
- Tests initially fail (expected, endpoints don't exist yet)

**Principle III - Reviewability is Paramount**: ✅ PASS  
- OpenAPI HTML documentation generated and included in review-artifacts (FR-016, FR-019)  
- Link added to review-artifacts/index.html (FR-017)  
- OpenAPI spec included in review packet

**Principle IV - PR Craft**: ✅ PASS  
- OpenAPI spec file + contract tests + CI updates ≤ 300 LOC  
- All CI checks must pass (spec-check required, Test & Coverage allowed to fail initially)

**Principle V - Simplicity & Consistency**: ✅ PASS  
- Uses existing OpenAPI 3.1.x standard  
- Uses existing supertest framework (already in dependencies)  
- Uses standard documentation tools (Redoc or Scalar)  
- Follows existing CI workflow patterns

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

This is a **Web Application** (frontend + backend detected). The spec-first artifacts modify the API backend specification and tests:

```
api/
├── spec/
│   └── openapi.yaml          # ← UPDATE: Add GET /expenses with pagination, Error Envelope, request-id header
├── tests/
│   └── contract/
│       └── expenses.contract.test.ts  # ← UPDATE: Add HTTP contract tests using supertest (initially failing)

specs/
└── core/
    └── openapi.yaml           # ← NEW: Copy/update from api/spec/openapi.yaml (per spec requirement)

.github/
├── workflows/
│   ├── spec-check.yml        # ← NEW: CI job to validate OpenAPI spec
│   └── review-packet.yml     # ← UPDATE: Add OpenAPI HTML generation step

review-artifacts/
└── index.html                 # ← UPDATE: Add link to OpenAPI HTML documentation
```

**Structure Decision**: Web application structure (Option 2). The repository has a `frontend/` directory for UI and an `api/` directory for the REST API backend. This feature updates the OpenAPI specification at `api/spec/openapi.yaml` (and creates `specs/core/openapi.yaml` per spec requirement), adds HTTP contract tests using supertest in `api/tests/contract/`, creates a new `spec-check.yml` CI workflow, and updates `review-packet.yml` to generate OpenAPI HTML documentation.

## Phase 0: Outline & Research ✅ COMPLETE

**Executed**: 2025-11-06

**Findings Summary**:
- OpenAPI spec location: Maintain at `api/spec/openapi.yaml`, create `specs/core/openapi.yaml` per spec requirement
- Pagination pattern: Page-based (`page`, `pageSize`) for simplicity
- Error Envelope: Shared schema with `code`, `message`, `details`, `requestId` fields
- Request-ID header: Optional header for correlation
- Documentation tool: Redoc CLI for standalone HTML generation
- Contract tests: Use supertest (already in dependencies)
- Spec-check: Use `@apidevtools/swagger-cli` for validation

**Output**: ✅ `research.md` created with all technical decisions resolved

## Phase 1: Design & Contracts ✅ COMPLETE

**Executed**: 2025-11-06

1. **Data Model** → ✅ `data-model.md`:
   - Expense entity: id (UUID), amount, category, date, description (optional)
   - ExpenseSummary entity: total, count, filters (category, month)
   - ErrorEnvelope entity: code, message, details, requestId (optional)
   - Validation rules and request/response schemas defined

2. **API Contracts** → ✅ `/contracts/`:
   - `openapi-spec.contract.md`: Complete OpenAPI specification contract
   - `contract-tests.contract.md`: HTTP contract tests using supertest
   - `spec-check-ci.contract.md`: CI job for OpenAPI validation
   - `review-packet-ci.contract.md`: Review packet enhancement contract

3. **Contract Tests**: Contract defined in `contract-tests.contract.md`
   - Tests will be implemented in `api/tests/contract/expenses.contract.test.ts`
   - Tests must fail initially (endpoints don't exist)

4. **Quickstart** → ✅ `quickstart.md`:
   - Validation steps for OpenAPI spec, contract tests, CI jobs
   - Success criteria and troubleshooting guide

5. **Agent Context Update**: ✅ Executed
   - Ran `.specify/scripts/bash/update-agent-context.sh cursor`

**Output**: ✅ data-model.md, 4 contract files, quickstart.md, agent context updated

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs:
  - OpenAPI spec contract → Update `api/spec/openapi.yaml` and create `specs/core/openapi.yaml` [P]
  - Contract tests contract → Write HTTP contract tests in `api/tests/contract/expenses.contract.test.ts` [P]
  - Spec-check CI contract → Create `.github/workflows/spec-check.yml` [P]
  - Review packet CI contract → Update `.github/workflows/review-packet.yml` [P]
  - Data model → Reference for OpenAPI schema definitions
  - Quickstart → Validation tasks for verification

**Ordering Strategy**:
- Spec-first order: OpenAPI spec → Contract tests → CI jobs
- Parallel execution: OpenAPI spec, contract tests, and CI jobs can be done in parallel [P]
- Validation: Quickstart validation tasks at end

**Task Categories**:
- [P] OpenAPI specification updates (independent file changes)
- [P] Contract test implementation (independent test file)
- [P] CI workflow creation/updates (independent workflow files)
- Validation and verification tasks

**Estimated Output**: 15-20 numbered, ordered tasks in tasks.md

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
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command) ✅
- [x] Phase 1: Design complete (/plan command) ✅
- [x] Phase 2: Task planning complete (/plan command - describe approach only) ✅
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS ✅
- [x] Post-Design Constitution Check: PASS ✅
- [x] All NEEDS CLARIFICATION resolved ✅
- [x] Complexity deviations documented ✅ (No violations)

**Artifacts Generated**:
- ✅ `research.md` - Technical decisions and rationale
- ✅ `data-model.md` - Entity definitions and schemas
- ✅ `contracts/openapi-spec.contract.md` - OpenAPI specification contract
- ✅ `contracts/contract-tests.contract.md` - Contract tests contract
- ✅ `contracts/spec-check-ci.contract.md` - Spec-check CI contract
- ✅ `contracts/review-packet-ci.contract.md` - Review packet CI contract
- ✅ `quickstart.md` - Validation and verification guide

---
*Based on Constitution v1.1.0 - See `/memory/constitution.md`*
