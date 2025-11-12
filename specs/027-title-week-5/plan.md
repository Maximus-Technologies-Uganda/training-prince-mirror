
# Implementation Plan: Week 5 Day 2: API Skeleton, Validation & Errors

**Branch**: `027-title-week-5` | **Date**: 2025-01-27 | **Spec**: `/specs/027-title-week-5/spec.md`
**Input**: Feature specification from `/specs/027-title-week-5/spec.md`

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

Build the API skeleton (server, routes, handlers) for the expenses resource to make failing contract tests from Day 1 pass. Implement GET /expenses with pagination, POST /expenses with validation, and GET /expenses/summary endpoints. Add in-memory data repository, Zod-based request validation, and central error handling middleware that maps errors to the standard error envelope format. Achieve ≥60% test coverage and ensure all contract tests pass.

## Technical Context
**Language/Version**: TypeScript 5.3.3, Node.js (ES modules)  
**Primary Dependencies**: Express 4.18.2, Zod 3.22.4, supertest 6.3.3, pino 8.16.2  
**Storage**: In-memory (temporary, data lost on server restart)  
**Testing**: Vitest 1.1.0 with supertest for contract tests, @vitest/coverage-v8 for coverage  
**Target Platform**: Node.js server (Linux/macOS/Windows), Express HTTP server  
**Project Type**: web (backend API + frontend, but this feature focuses on backend API)  
**Performance Goals**: Not specified (Day 2 focuses on correctness, not performance)  
**Constraints**: Must match OpenAPI spec exactly, ≥60% test coverage, all contract tests must pass, error responses must match ErrorEnvelope schema  
**Scale/Scope**: In-memory storage (no explicit limit, relies on Node.js memory constraints), temporary solution for Day 2

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: No Logic Duplication
✅ **PASS**: API routes delegate business logic to service layer (`ExpenseStore`). Routes only handle HTTP concerns (request/response, status codes). No duplication of business logic in routes.

### Principle II: Test Coverage Mandate
✅ **PASS**: Feature requires ≥60% coverage (lines/functions/branches) measured by Vitest. Contract tests exist from Day 1 and must pass. Unit tests required for validation logic and data mappers.

### Principle III: Reviewability is Paramount
✅ **PASS**: CI review-packet includes coverage reports. Test & Coverage - API CI job measures coverage. All tests must pass for merge.

### Principle IV: PR Craft
✅ **PASS**: PR must pass all CI checks (spec-check, CodeQL, Test & Coverage - API). PR description must include coverage table and Spec link.

### Principle V: Simplicity & Consistency
✅ **PASS**: Uses existing Express + Zod + Vitest stack. In-memory storage is intentionally simple for Day 2. No new tools required.

**Result**: ✅ All constitutional principles satisfied. No violations detected.

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
api/                          # Backend API server
├── src/
│   ├── server.ts             # Express server entry point (exists, needs GET /expenses route)
│   ├── routes/
│   │   └── expenses.ts        # Expense routes (exists, needs GET /expenses handler)
│   ├── services/
│   │   └── expenses.ts        # ExpenseStore service (exists, needs pagination support)
│   ├── middleware/
│   │   ├── validation.ts      # Zod validation middleware (exists)
│   │   └── error-handler.ts   # Central error middleware (NEW - needs creation)
│   ├── schemas/
│   │   └── index.ts           # Zod schemas (exists, may need updates)
│   └── types/
│       └── index.ts           # TypeScript types (exists, may need pagination types)
├── tests/
│   ├── contract/
│   │   └── expenses.contract.test.ts  # Contract tests (exists, currently failing)
│   ├── integration/
│   │   └── expenses.test.ts   # Integration tests (may need updates)
│   └── unit/
│       ├── expenses.test.ts   # Unit tests for service (exists)
│       └── validation.test.ts # Unit tests for validation (NEW - needs creation)
├── spec/
│   └── openapi.yaml           # OpenAPI spec (exists, needs pagination metadata update)
└── package.json               # Dependencies (exists)

frontend/                      # Frontend (unchanged, not part of this feature)
└── [existing structure]

src/                          # CLI apps (unchanged, not part of this feature)
└── [existing structure]
```

**Structure Decision**: **Web Application (Option 2)** - Backend API in `/api` directory with Express routes, services, middleware, and tests. The feature extends existing API structure by adding GET /expenses endpoint, error middleware, and pagination support. Frontend and CLI apps are separate concerns and not modified in this feature.

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

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Contract tests already exist (from Day 1), so focus on implementation tasks to make them pass
- Each contract → implementation task to satisfy contract
- Each entity → service/repository extension task [P]
- Error handling → middleware creation task
- OpenAPI spec → update task

**Ordering Strategy**:
- TDD order: Contract tests exist, implement to make them pass
- Dependency order: 
  1. Error middleware (needed by all routes)
  2. Service/repository extensions (pagination support)
  3. Route handlers (GET /expenses, update POST /expenses, update GET /expenses/summary)
  4. OpenAPI spec update
  5. Unit tests for validation and error handling
- Mark [P] for parallel execution (independent files)

**Task Categories**:
1. **Error Handling** (1 task):
   - Create central error middleware (`api/src/middleware/error-handler.ts`)

2. **Service/Repository Extensions** (1 task):
   - Extend `ExpenseStore` with `findExpenses()` method for pagination

3. **Route Handlers** (2-3 tasks):
   - Implement GET /expenses route handler with pagination
   - Update POST /expenses error handling (if needed)
   - Update GET /expenses/summary error handling (if needed)

4. **OpenAPI Specification** (1 task):
   - Update GET /expenses response schema to reflect pagination metadata

5. **Unit Tests** (2-3 tasks):
   - Unit tests for pagination logic
   - Unit tests for error middleware
   - Unit tests for validation (if not already covered)

6. **Integration & Validation** (1-2 tasks):
   - Verify all contract tests pass
   - Verify coverage ≥60%

**Estimated Output**: 10-15 numbered, ordered tasks in tasks.md

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
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (none - all principles satisfied)

---
*Based on Constitution v1.1.0 - See `/memory/constitution.md`*
