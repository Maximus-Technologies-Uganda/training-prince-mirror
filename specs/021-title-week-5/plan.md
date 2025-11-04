
# Implementation Plan: Week 5 Day-0: API Scaffolding and Spec-First Setup

**Branch**: `021-title-week-5` | **Date**: 2025-01-27 | **Spec**: `/specs/021-title-week-5/spec.md`
**Input**: Feature specification from `/specs/021-title-week-5/spec.md`

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

This feature establishes the Day-0 foundation for Week 5 REST API development. The primary requirement is to scaffold a new `/api` directory with a complete Node.js/TypeScript project structure, implement spec-first workflow discipline (reusing Week 4 patterns), and integrate CI/CD workflows that generate review artifacts. The API project must include an initial OpenAPI specification (with at least one example endpoint), testing infrastructure using Vitest, and a GitHub Actions workflow that generates `review-packet-api` artifacts matching Week 4 review artifact patterns.

## Technical Context
**Language/Version**: TypeScript (Node.js ES modules) / Node.js LTS  
**Primary Dependencies**: Express.js (server framework), Zod (validation), pino (logging), Supertest (HTTP testing), tsx + nodemon (development)  
**Storage**: N/A (Day-0 setup only, no persistence layer required)  
**Testing**: Vitest v3.2.4+ (with @vitest/coverage-v8), HTTP testing library (supertest or similar)  
**Target Platform**: Node.js server (development and production environments)  
**Project Type**: web (frontend + backend/API structure)  
**Performance Goals**: N/A for Day-0 (scaffolding only, no endpoint implementation)  
**Constraints**: Must follow Week 4 CI patterns, must reuse spec-first discipline, must generate review artifacts with index.html navigation structure, no security features in Day-0 (CORS/auth/rate limiting out of scope)  
**Scale/Scope**: Single API project directory (`/api`), initial specification with one example endpoint (GET /health), CI workflow for one project (api-checks.yml)

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: No Logic Duplication
- ✅ **PASS**: API project is new; no existing logic to duplicate. Frontend UI logic remains in `frontend/`, backend CLI logic remains in `src/`. API will be separate project.

### Principle II: Test Coverage Mandate
- ✅ **PASS**: API project will use Vitest with coverage reporting (no minimum threshold for Day-0, but coverage generation capability required). Coverage reports will be included in review-packet-api artifact.

### Principle III: Reviewability is Paramount
- ✅ **PASS**: CI workflow will generate `review-packet-api` artifact containing index.html with navigation structure, API specification, test coverage reports, and test execution reports. Follows Week 4 review artifact patterns.

### Principle IV: PR Craft
- ✅ **PASS**: Day-0 setup is foundational scaffolding; PR will be structured following project standards. PR description will include coverage table and Spec link.

### Principle V: Simplicity & Consistency
- ✅ **PASS**: Uses existing tech stack (Vitest, TypeScript, ES modules). Selected tools (Express, Zod, pino) are standard, well-documented choices. No unnecessary complexity for Day-0 setup.

**Initial Constitution Check**: ✅ PASS (all principles satisfied)

**Post-Design Constitution Check**: ✅ PASS (all principles remain satisfied after Phase 1 design)

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
api/
├── package.json              # API project dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── vitest.config.ts          # Vitest test configuration
├── .env.example              # Environment variables template (PORT, NODE_ENV)
├── src/
│   ├── server.ts             # HTTP server entry point
│   ├── routes/
│   │   └── health.ts         # Example route (GET /health)
│   ├── middleware/
│   │   ├── validation.ts     # Request validation middleware
│   │   └── logger.ts         # Structured logging middleware
│   └── types/
│       └── index.ts          # TypeScript type definitions
├── tests/
│   ├── contract/             # Contract tests for API endpoints
│   │   └── health.contract.test.ts
│   ├── integration/          # Integration tests
│   └── unit/                 # Unit tests
├── spec/                     # API specification directory
│   └── openapi.yaml          # Initial OpenAPI specification (GET /health example)

frontend/                     # Existing frontend (unchanged)
├── src/
└── tests/

src/                          # Existing CLI apps (unchanged)
├── hello/
├── temp-converter/
├── stopwatch/
└── quote/

.github/
└── workflows/
    └── api-checks.yml        # CI workflow for API project
```

**Structure Decision**: Web application structure (Option 2). The repository already has a `frontend/` directory for UI, and we're adding a new `/api` directory for the REST API backend. This follows a clear separation: frontend for UI, API for REST endpoints, and `src/` for CLI applications. The `/api` directory is self-contained with its own `package.json`, `src/`, `tests/`, and `spec/` directories, following Node.js best practices.

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

### Review Artifact Structure (review-packet-api)

The `review-packet-api` artifact must include an `index.html` file with navigation structure matching Week 4 patterns. The index.html must include:

1. **Navigation Structure**: A clear navigation section with links to:
   - **Spec Section**: Link to `spec/openapi.yaml` (OpenAPI specification)
   - **Coverage Section**: Link to `api-coverage/index.html` (coverage report HTML view)
   - **Coverage LCOV**: Link to `api-coverage/lcov.info` (coverage LCOV file for download)
   - **Test Results**: Link to test execution reports (if available)

2. **File Organization**: All files must be organized in `review-artifacts/` directory:
   - `review-artifacts/index.html` (navigation entry point)
   - `review-artifacts/openapi.yaml` (copied from `api/spec/openapi.yaml`)
   - `review-artifacts/api-coverage/` (coverage reports directory)
   - `review-artifacts/api-coverage/index.html` (coverage HTML)
   - `review-artifacts/api-coverage/lcov.info` (coverage LCOV)

3. **Week 4 Pattern Alignment**: The structure must match Week 4 review artifact patterns, providing a single entry point (`index.html`) that links to all review materials (specification, coverage, test results).

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- **Project Structure Tasks**: Create `/api` directory structure, configuration files (package.json, tsconfig.json, vitest.config.ts, .env.example)
- **Spec-First Tasks**: Create `/api/spec/openapi.yaml` with GET /health endpoint definition
- **Contract Test Tasks**: Create contract tests for GET /health endpoint (must fail initially)
- **Development Environment Tasks**: Set up development server with hot-reload (tsx + nodemon)
- **CI Workflow Tasks**: Create `.github/workflows/api-checks.yml` with lint, test, coverage, artifact generation steps
- **Review Artifact Tasks**: Create scripts for copying coverage, verifying artifacts, generating index.html

**Ordering Strategy**:
1. **Foundation First**: Project structure → Configuration files → Dependencies
2. **Spec-First Discipline**: OpenAPI specification → Contract tests (before implementation)
3. **Development Setup**: Dev server configuration → Hot-reload setup
4. **CI Integration**: CI workflow → Artifact scripts → Verification scripts
5. **TDD Order**: Contract tests (fail) → Implementation → Tests pass

**Parallel Execution Opportunities [P]**:
- Configuration files (package.json, tsconfig.json, vitest.config.ts) can be created in parallel
- Contract test files can be created independently
- CI workflow and artifact scripts can be developed in parallel

**Estimated Output**: 20-25 numbered, ordered tasks in tasks.md covering:
- 5-6 tasks: Project structure and configuration
- 2-3 tasks: OpenAPI specification and spec-first workflow
- 2-3 tasks: Contract tests
- 2-3 tasks: Development environment setup
- 4-5 tasks: CI workflow and artifact generation
- 2-3 tasks: Validation and verification

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
- [x] Complexity deviations documented (none required)

**Artifacts Generated**:
- [x] research.md - All technical decisions resolved (Express, OpenAPI, Zod, pino, Supertest)
- [x] data-model.md - Infrastructure entities defined (APIProject, APISpecification, APIEndpoint, ReviewPacketArtifact, CIWorkflow, TestSuite)
- [x] contracts/ - 4 contract files (api-project-structure, api-specification, ci-workflow, review-artifact)
- [x] contracts/tests/ - Contract test for GET /health endpoint
- [x] quickstart.md - 10-step validation guide
- [x] Agent context updated (.cursor/rules/specify-rules.mdc)

---
*Based on Constitution v1.1.0 - See `/memory/constitution.md`*
