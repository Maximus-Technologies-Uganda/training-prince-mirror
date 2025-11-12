
# Implementation Plan: Week 5: Implement MVP API Endpoints (Expenses)

**Branch**: `023-title-week-5` | **Date**: November 5, 2025 | **Spec**: `/specs/023-title-week-5/spec.md`
**Input**: Feature specification from `/specs/023-title-week-5/spec.md`

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

**Primary Feature**: Implement MVP API endpoints for expense management (POST /expenses, GET /expenses/summary) with validation, aggregation, and optional filtering by category and month.

**Technical Approach**: 
1. Create REST API endpoints following existing backend architecture (`src/expense` service module)
2. Implement expense entity with validation (positive amount, ISO 8601 date, category string)
3. Build aggregation service with support for category and month filtering
4. Develop comprehensive unit tests (≥80% coverage) and integration tests
5. Document endpoints in OpenAPI specification for consistency with existing API documentation

## Technical Context
**Language/Version**: TypeScript 5.3.3  
**Primary Dependencies**: Express 4.18.2, Zod 3.22.4, Pino 8.16.2 (logging)
**Storage**: In-memory array during server session (MVP - no persistence)  
**Testing**: Vitest 1.1.0 + Supertest 6.3.3
**Target Platform**: Node.js HTTP server (backend API)
**Project Type**: Web (Express backend + Vite frontend architecture)  
**Performance Goals**: Accurate aggregation (correctness-first per spec)
**Constraints**: MVP phase - prioritize accuracy over performance optimization  
**Scale/Scope**: 2 endpoints (POST, GET with optional filters), ~4 entity fields, 80%+ unit test coverage required

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| **I. No Logic Duplication** | ✅ PASS | Backend expense logic will be in `src/` module; API routes only handle HTTP layer |
| **II. Test Coverage Mandate** | ✅ PASS | API module targets ≥80% unit coverage (spec FR-014); integration tests required (FR-015/016/017) |
| **III. Reviewability is Paramount** | ✅ PASS | Coverage artifacts will be included in CI review-packet per existing workflow |
| **IV. PR Craft** | ✅ PASS | Feature scope: 2 endpoints + validation + tests; single focused PR within 300 LOC baseline |
| **V. Simplicity & Consistency** | ✅ PASS | Uses existing stack (Express, Zod, Vitest, Pino); no new tools required |

**Initial Constitution Check**: PASS - No violations detected. Ready for Phase 0.

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

```
# Web Application: Backend (Express) + Frontend (Vite)

api/                          # Backend API server
├── src/
│   ├── middleware/           # Logging, validation middleware
│   ├── routes/               # Route handlers for endpoints
│   ├── schemas/              # Zod schema definitions (validation)
│   ├── services/             # Business logic (e.g., expense aggregation)
│   ├── types/                # TypeScript type definitions
│   └── server.ts             # Express server entry point
├── tests/
│   ├── contract/             # Contract tests (request/response schemas)
│   ├── integration/          # Integration tests (full endpoint flows)
│   └── unit/                 # Unit tests (service logic, helpers)
├── spec/
│   └── openapi.yaml          # OpenAPI specification
└── vitest.config.ts          # Test configuration

frontend/                      # Vite-powered frontend (separate concern)
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/
```

**Structure Decision**: **Web Application (Option 2)** - Backend and frontend are separate concerns. The expense endpoints will be implemented in `api/src/routes/expenses.ts` with business logic in `api/src/services/expenses.ts`. Tests will follow the existing pattern: contracts in `api/tests/contract/`, integration in `api/tests/integration/`, and units in `api/tests/unit/`.

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh cursor`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

### Task Generation Strategy

Following TDD principles and dependency ordering, tasks will be generated from Phase 1 artifacts:

**Step 1: Type & Schema Foundation** (lowest-level dependencies)
- Task: Create `api/src/types/index.ts` - Expense, ExpenseSummary, request/response interfaces
- Task: Create `api/src/schemas/index.ts` - Zod schema definitions with validation rules

**Step 2: Middleware & Validation** (support layer)
- Task: Update `api/src/middleware/validation.ts` to handle expense validation errors
- Task: Create error handler middleware for 400/500 responses

**Step 3: Business Logic - Service Layer** (core domain logic)
- Task: Create `api/src/services/expenses.ts` - ExpenseStore class with:
  - `create(amount, category, date)` → Expense
  - `summarize(filters)` → ExpenseSummary
  - In-memory storage and filtering logic

**Step 4: Contract Tests** (TDD - tests before implementation)
- Task: Create `api/tests/contract/expenses.contract.test.ts` (from template)
  - Schema validation contracts (failing tests - no implementation yet)

**Step 5: Unit Tests** (business logic validation)
- Task: Create `api/tests/unit/expenses.test.ts` (from template)
  - Service aggregation logic tests (failing tests - no implementation yet)
  - Coverage target: ≥80%

**Step 6: Integration Tests** (HTTP endpoint validation)
- Task: Create `api/tests/integration/expenses.test.ts` (from template)
  - Full endpoint flow tests using Supertest (failing tests - no implementation yet)
  - Coverage target: ≥70%

**Step 7: HTTP Route Handlers** (API layer)
- Task: Create `api/src/routes/expenses.ts` - Express route handlers:
  - POST /expenses - request validation + service call + response formatting
  - GET /expenses/summary - query param parsing + filtering + aggregation
- Task: Update `api/src/server.ts` - import and mount routes

**Step 8: OpenAPI Specification**
- Task: Update `api/spec/openapi.yaml` - add expense endpoints documentation

**Step 9: Manual Testing & Verification**
- Task: Run `npm run test:coverage` - verify ≥80% unit, ≥70% integration coverage
- Task: Execute quickstart.md scenarios - manual curl tests

### Ordering Strategy

**Parallelizable Tasks** [P]:
- Types and schemas (no dependencies)
- Unit tests for services (isolated business logic)
- Contract tests (schema-based, no HTTP needed)

**Sequential Dependencies**:
1. Types → Schemas → Services
2. Services → Unit tests (can run in parallel with service development)
3. Services → Route handlers → Integration tests
4. Routes + Tests → OpenAPI documentation → Manual testing

### Estimated Output
- **25-35 numbered, ordered tasks** in tasks.md
- **Parallel markers** [P] for 3-5 independent tasks
- **TDD structure**: Tests before implementation for each layer

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
- [x] Phase 0: Research complete (/plan command)
  - research.md: All unknowns resolved, 9 decisions documented
- [x] Phase 1: Design complete (/plan command)
  - data-model.md: Entity structures and validation rules defined
  - quickstart.md: 9 acceptance scenarios with curl examples
  - contracts/openapi-expenses.yaml: Full API specification
  - contracts/expenses.contract.test.ts.template: Schema validation tests
  - contracts/expenses.integration.test.ts.template: HTTP flow tests
  - contracts/expenses.unit.test.ts.template: Business logic tests
- [x] Phase 2: Task planning complete (/plan command - approach documented)
  - 9-step task generation strategy defined
  - Dependency ordering established
  - Parallelizable tasks identified
  - Estimated 25-35 tasks to be generated
- [ ] Phase 3: Tasks generated (/tasks command - next step)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS (all 5 principles verified)
- [x] Post-Design Constitution Check: PASS (no new violations in Phase 1)
- [x] All NEEDS CLARIFICATION resolved (research.md complete)
- [x] Complexity deviations documented (none required - straightforward MVP)

---
*Based on Constitution v1.1.0 - See `/memory/constitution.md`*
