
# Implementation Plan: UI To‑Do Management

**Branch**: `001-what-build-a` | **Date**: 2025-10-06 | **Spec**: /Users/prnceb/Desktop/WORK/hello-world/specs/001-what-build-a/spec.md
**Input**: Feature specification from "/Users/prnceb/Desktop/WORK/hello-world/specs/001-what-build-a/spec.md"

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

## Summary
Build a simple To‑Do UI that reuses domain logic from `src/todo/`. Users can add,
toggle, and remove items, filter by "due‑today" (using a clock abstraction pinned to
Africa/Kampala, UTC+3) and by "high‑priority". Enforce duplicate prevention via
normalized comparison. Provide Vitest unit coverage (≥40% for this UI module) and a
Playwright smoke test that adds and toggles an item. Ensure the review‑packet
contains `ui-coverage-todo`.

## Technical Context
**Language/Version**: JavaScript (ES Modules)  
**Primary Dependencies**: Vite, Vitest, Playwright, ESLint, Prettier  
**Storage**: In-memory (no persistence)  
**Testing**: Vitest for unit tests and coverage; Playwright smoke test  
**Target Platform**: Web browser (Vite dev server, GitHub Pages build)  
**Project Type**: web  
**Performance Goals**: N/A (simple UI; responsiveness reasonable)  
**Constraints**: ≥40% UI statement coverage; no logic duplication; clock abstraction
(fixed TZ Africa/Kampala); review‑packet includes per‑app coverage; deployable build  
**Scale/Scope**: Small single‑page UI

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- No Logic Duplication: UI will import from `src/todo/` and avoid domain reimplementation. → PASS
- Test Coverage Mandate: Vitest coverage ≥40% plus one Playwright smoke test for UI. → PASS
- Reviewability is Paramount: CI review‑packet to include `ui-coverage-todo`. → PASS
- PR Craft: ≤300 LOC, all CI checks passing, PR template includes coverage table and `Spec:` link. → PASS
- Simplicity & Consistency: Vite vanilla JS, ESLint + Prettier; new tools require governance approval. → PASS

## Project Structure

### Documentation (this feature)
```
specs/001-what-build-a/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
└── contracts/           # Phase 1 output (/plan command): UI interaction & clock contracts
```

### Source Code (repository root)
```
frontend/
├── src/
│   ├── main.js          # entry (Vite)
│   ├── ui-todo/         # new UI module for To‑Do
│   └── tests/           # Vitest unit tests (or colocated *.test.js)
└── e2e/                 # Playwright smoke test

src/
└── todo/                # existing core logic (domain source of truth)
```

**Structure Decision**: Web application using existing `frontend/`. Domain logic is
consumed from `src/todo/` to satisfy no-duplication. Tests live alongside UI or in
`frontend/src/tests`. One Playwright smoke test under `frontend/e2e`.

## Phase 0: Outline & Research
1. Extract unknowns from Technical Context above:
   - Timezone for "today" → RESOLVED: Africa/Kampala (UTC+3)
   - Duplicate normalization → RESOLVED: case-insensitive + collapse whitespace
   - Removal under filters → RESOLVED: keep filter applied
   - Invalid due dates → RESOLVED: block add, inline error, keep input
   - Persistence → RESOLVED: in-memory only

2. Consolidate findings in `research.md` (created) with Decisions/Rationale/Alternatives.

**Output**: research.md with clarifications encoded. → COMPLETE

## Phase 1: Design & Contracts
1. Data model extracted to `data-model.md`: ToDoItem fields, normalization rules,
   state transitions, and filters.
2. UI contracts written under `contracts/`:
   - `ui-interactions.md`: Add/Toggle/Remove flows and guardrails
   - `clock.md`: Clock abstraction contract (fixed TZ)
3. quickstart.md provides run/test/build steps and smoke path.

**Output**: data-model.md, contracts/*, quickstart.md. → COMPLETE

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (interactions, data model, quickstart)
- Each interaction → unit tests + UI implementation tasks
- Clock abstraction → unit tests + injection tasks
- Smoke scenario → Playwright test + wiring tasks

**Ordering Strategy**:
- TDD order: tests before implementation
- Dependency order: model and clock before UI behaviors
- Mark [P] for parallel execution where files are independent

**Estimated Output**: 20-25 numbered tasks in tasks.md

## Phase 3+: Future Implementation
*Beyond /plan scope*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*No deviations planned.*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|

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
- [ ] Complexity deviations documented

---
*Based on Constitution v1.1.0 - See `/memory/constitution.md`*
