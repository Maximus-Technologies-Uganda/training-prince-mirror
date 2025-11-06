
# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

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
Fix review-packet packaging for CI workflow to ensure all five UI test suites (ui-expense, ui-stopwatch, ui-temp, ui-todo, ui-quote) have their complete coverage reports (lcov.info and HTML files) successfully copied into review-artifacts/ and packaged into the final review-packet artifact for stakeholder review. The primary issue is missing or incomplete coverage files creating broken links in the review index. Approach: audit current CI workflow, identify missing coverage generation/copying steps, update workflow to collect and verify all five coverage reports before artifact packaging, implement fail-fast validation to prevent incomplete artifacts.

## Technical Context
**Language/Version**: Node.js 18+ (JavaScript/bash), Vitest test runner  
**Primary Dependencies**: Vitest (test framework), GitHub Actions (CI/CD), nyc/vitest coverage tools  
**Storage**: File system (coverage reports in review-artifacts/ directory)  
**Testing**: Vitest unit tests for five UI test suites (ui-expense, ui-stopwatch, ui-temp, ui-todo, ui-quote)  
**Target Platform**: GitHub Actions CI/CD environment  
**Project Type**: Web (frontend + backend repo with CI/CD)  
**Performance Goals**: Coverage collection and artifact packaging must complete within CI timeout (no specific constraint mentioned)  
**Constraints**: Fail-fast on any coverage generation failure; no partial/incomplete artifacts allowed  
**Scale/Scope**: Five UI test suites, five coverage report sets (lcov.info + HTML per suite), single review-packet artifact

---

### Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Core Principles Review

---

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

### Source Code (Web Application)
```
.github/workflows/
├── test.yml                         # Main test workflow - PRIMARY FOCUS
└── [other CI workflows]

frontend/
├── tests/
│   ├── ui-expense.test.js           # Generates: coverage/ui-expense
│   ├── ui-stopwatch.test.js         # Generates: coverage/ui-stopwatch
│   ├── ui-temp.test.js              # Generates: coverage/ui-temp
│   ├── ui-todo.test.js              # Generates: coverage/ui-todo
│   └── ui-quote.test.js             # Generates: coverage/ui-quote
└── src/                             # Component source code

review-artifacts/                    # DEPLOYMENT DESTINATION FOR COVERAGE REPORTS
├── index.html                       # Index linking all five coverage reports
└── [coverage per suite - created by CI]
    ├── ui-expense/, ui-stopwatch/, ui-temp/, ui-todo/, ui-quote/

vitest.config.js                     # Coverage configuration
package.json
```

**Structure Decision**: Web application with GitHub Actions CI/CD. The feature modifies the CI workflow (`.github/workflows/test.yml`) to execute all five UI test suites with coverage enabled, generate coverage reports (lcov.info + HTML), copy all reports into `review-artifacts/`, verify all five report sets exist, and implement fail-fast validation to prevent incomplete artifact packaging.

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
- [ ] Phase 0: Research complete (/plan command)
- [ ] Phase 1: Design complete (/plan command)
- [ ] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [ ] Initial Constitution Check: PASS
- [ ] Post-Design Constitution Check: PASS
- [ ] All NEEDS CLARIFICATION resolved
- [ ] Complexity deviations documented

---
*Based on Constitution v1.1.0 - See `/memory/constitution.md`*
