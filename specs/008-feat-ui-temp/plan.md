
# Implementation Plan: UI — Temperature Converter

**Branch**: `008-feat-ui-temp` | **Date**: 2025-10-13 | **Spec**: /specs/008-feat-ui-temp/spec.md
**Input**: Feature specification from `/specs/008-feat-ui-temp/spec.md`

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
Build a simple temperature converter UI that lets users enter a numeric value, pick from/to units (C/F), and see the converted result. Auto-convert on any input/unit change; display inline errors announced via aria-live="assertive"; clear result when inputs are cleared. Reuse conversion logic from `src/temp-converter` core; no duplication. Rounding: 2 dp, trim trailing zeros. Default units: C → F.

## Technical Context
**Language/Version**: JavaScript (ESM)
**Primary Dependencies**: Vite (frontend), Vitest (unit), Playwright (e2e)
**Storage**: N/A (pure UI; logic from core)
**Testing**: Vitest, Playwright
**Target Platform**: Web browser
**Project Type**: Web application (frontend + backend core reuse)
**Performance Goals**: UI updates under 100ms on input changes
**Constraints**: Reuse `src/temp-converter` core; ≥40% UI statement coverage; no logic duplication
**Scale/Scope**: Single UI surface, single page

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- No Logic Duplication: Will import `src/temp-converter` core directly.
- Test Coverage Mandate: Vitest unit tests to ≥40% + one Playwright smoke.
- Reviewability: CI review‑packet includes per‑app coverage and index.
- PR Craft: Keep PR ≤300 LOC; include Spec link and coverage table.

## Project Structure

### Documentation (this feature)
```
specs/008-feat-ui-temp/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
src/
├── temp-converter/           # backend core logic (authority)
│   └── index.js
└── ...

frontend/
├── src/
│   ├── ui-temp/              # new UI module
│   │   ├── index.js
│   │   └── index.test.js
│   └── ...
├── index.html
├── vitest.config.js
└── e2e/
    └── temp.smoke.spec.ts
```

**Structure Decision**: Web app with frontend + backend core reuse; UI module under `frontend/src/ui-temp`, imports from `src/temp-converter`.

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research rounding display trim strategies for web"
     Task: "Research aria-live assertive patterns for inline errors"
   For each technology choice:
     Task: "Best practices for Vite + Vitest + Playwright in vanilla JS"
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
   - UI is local-only; define UI event contracts and DOM IDs under `/contracts/`
   - Document inputs, result region, and error region behaviors

3. **Generate contract tests** from contracts:
   - One test per scenario (C→F, F→C, identical units, non-numeric)
   - Assert DOM updates and aria-live announcements

4. **Extract test scenarios** from user stories:
   - Quickstart test = conversion happy paths + error paths

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh cursor`
   - Preserve recent changes and keep under 150 lines

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each scenario → unit test task [P]
- UI wiring tasks to import core and update DOM
- Playwright smoke to verify page loads and conversion

**Ordering Strategy**:
- TDD order: Tests before implementation 
- Dependency order: Define DOM contracts → write tests → implement UI wiring
- Mark [P] for parallel execution (independent files)

**Estimated Output**: ~20 tasks in tasks.md (small UI surface)

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


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [ ] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [ ] Initial Constitution Check: PASS
- [ ] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [ ] Complexity deviations documented

---
*Based on Constitution v1.1.0 - See `/memory/constitution.md`*
