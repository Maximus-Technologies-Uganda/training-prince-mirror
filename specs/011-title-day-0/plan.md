
# Implementation Plan: Day 0: CI Maturity, Review Packet Parity, and Repository Hygiene

**Branch**: `011-title-day-0` | **Date**: 2025-01-27 | **Spec**: `/specs/011-title-day-0/spec.md`
**Input**: Feature specification from `/specs/011-title-day-0/spec.md`

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
Establish mature CI/CD pipeline with unified coverage reporting, repository hygiene improvements, and foundational E2E smoke testing. Create consolidated review-packets with enriched metadata for efficient project assessment. Migrate state files to dedicated /data/ directory and implement comprehensive Playwright testing with failure artifact capture.

## Technical Context
**Language/Version**: Node.js 18+, JavaScript ES6+  
**Primary Dependencies**: Vite, Vitest, Playwright, ESLint, Prettier  
**Storage**: JSON files in /data/ directory (expenses.json, todo.json, stopwatch-state.json)  
**Testing**: Vitest for unit tests, Playwright for E2E smoke tests  
**Target Platform**: GitHub Pages deployment, CI/CD pipeline
**Project Type**: Web application (frontend + backend)  
**Performance Goals**: CI pipeline completion <10 minutes, coverage report generation <5 minutes  
**Constraints**: Must maintain ≥40% UI coverage, PRs ≤300 LOC, review-packet must be single artifact  
**Scale/Scope**: 5 applications (quote, expense, temp, todo, stopwatch), unified coverage reporting

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Core Principles Compliance:
- ✅ **No Logic Duplication**: UIs import from existing `src/<app>` libraries
- ✅ **Test Coverage Mandate**: ≥40% statement coverage + Playwright smoke tests per UI
- ✅ **Reviewability is Paramount**: Single review-packet with indexed coverage reports
- ✅ **PR Craft**: ≤300 LOC, CI checks passing, required PR description template
- ✅ **Simplicity & Consistency**: Vite-powered vanilla JS, Vitest/Playwright, ESLint/Prettier

### Project Standards Compliance:
- ✅ Frontend in `frontend/` with Vite build → `frontend/dist/` deployable to GitHub Pages
- ✅ Testing: Vitest for unit coverage, Playwright for smoke tests
- ✅ Linting/Formatting: ESLint + Prettier as CI gates
- ✅ Coverage: Per-app artifacts indexed in review-packet
- ✅ Backend logic authority: `src/<app>` packages remain single source of truth

**Status**: PASS - No violations detected

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
# Web application structure (frontend + backend detected)
backend/
├── src/
│   ├── quote/
│   ├── expense/
│   ├── temp-converter/
│   ├── todo/
│   ├── stopwatch/
│   └── hello/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
├── e2e/
│   ├── quote.spec.js
│   ├── expense.smoke.spec.ts
│   ├── temp.smoke.spec.ts
│   ├── todo.smoke.spec.ts
│   └── stopwatch.smoke.spec.ts
└── tests/

data/
├── expenses.json
├── todo.json
└── stopwatch-state.json

review-artifacts/
├── index.html
├── review.md
├── coverage-quote/
├── coverage-expense/
├── coverage-temp/
├── coverage-todo/
├── coverage-stopwatch/
├── ui-coverage-quote/
├── ui-coverage-expense/
├── ui-coverage-temp/
├── ui-coverage-todo/
└── ui-coverage-stopwatch/
```

**Structure Decision**: Web application structure selected based on existing `frontend/` and `src/` directories. Backend logic in `src/<app>` packages, frontend in `frontend/` with Vite build system. New `/data/` directory for state files, `/review-artifacts/` for CI-generated coverage reports.

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
- Each contract → contract test task [P]
- Each entity → model creation task [P] 
- Each user story → integration test task
- Implementation tasks to make tests pass

**Ordering Strategy**:
- TDD order: Tests before implementation 
- Dependency order: Models before services before UI
- Mark [P] for parallel execution (independent files)

**Estimated Output**: 25-30 numbered, ordered tasks in tasks.md

**Specific Task Categories for this Feature**:
1. **CI Pipeline Tasks**: Coverage report generation, artifact consolidation, review packet creation
2. **Repository Hygiene Tasks**: State file migration, .gitignore updates, file cleanup
3. **Smoke Testing Tasks**: Playwright test creation, CI integration, artifact capture
4. **Documentation Tasks**: README updates, review instructions, quickstart validation
5. **Contract Testing Tasks**: API contract tests, validation scripts, error handling

**Task Dependencies**:
- State file migration must complete before CI pipeline updates
- Smoke tests must be created before CI integration
- Contract tests must be written before implementation
- Documentation updates can be parallel with implementation

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
- [x] Complexity deviations documented

---
*Based on Constitution v1.1.0 - See `/memory/constitution.md`*
