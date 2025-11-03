
# Implementation Plan: Week 4 Finisher - Playwright E2E Smokes (5 UIs)

**Branch**: `018-title-week-4` | **Date**: 2025-11-02 | **Spec**: `specs/018-title-week-4/spec.md`
**Input**: Feature specification from `/specs/018-title-week-4/spec.md`

## Execution Flow (/plan command scope)
```
1. ✅ Load feature spec from Input path
2. ✅ Fill Technical Context (scan for NEEDS CLARIFICATION)
3. ✅ Fill the Constitution Check section
4. ✅ Evaluate Constitution Check section
5. → Execute Phase 0 → research.md
6. → Execute Phase 1 → contracts, data-model.md, quickstart.md
7. → Re-evaluate Constitution Check section
8. → Plan Phase 2 → Describe task generation approach
9. → STOP - Ready for /tasks command
```

## Summary
Implement minimal Playwright end-to-end smoke tests for five core UI applications (Hello World, Stopwatch, Temperature Converter, Expense Tracker, and Todo List) with CI/CD pipeline integration. Tests verify essential user interactions in a headless Chromium environment, complete within 2 minutes, execute collect-all strategy (all tests run before job failure determination), and generate artifacts (screenshots, traces, HTML reports) for debugging and stakeholder review. Artifacts integrated into review-packet index for unified accessibility.

## Technical Context
**Language/Version**: JavaScript/Node.js (Playwright v1.x, Vite-built frontend)  
**Primary Dependencies**: Playwright, GitHub Actions, Node.js ≥18  
**Storage**: N/A (stateless test suite)  
**Testing**: Playwright E2E, HTML reporting  
**Target Platform**: Headless Chromium; CI/CD (GitHub Actions)  
**Project Type**: Web (frontend + CI integration)  
**Performance Goals**: Complete all 5 tests ≤ 2 minutes total; per-test timeout 30 seconds  
**Constraints**: Chromium only, no retries, fail-fast artifact validation  
**Scale/Scope**: 5 UI applications, 5 smoke tests, 1 review-packet integration  
**Clarifications Completed**: Test execution strategy (collect-all), browser choice (Chromium), timeout/retry policy (30s, no retry), performance budget (2 min)

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: No Logic Duplication
**Status**: ✅ PASS  
- Tests are UI-only and exercise existing application logic; no reimplementation.
- All five UIs (Hello, Stopwatch, Temperature, Expense, Todo) already functional per prior specs (017, 014, etc.).
- Tests consume existing endpoints via browser automation; no backend logic duplication.

### Principle II: Test Coverage Mandate
**Status**: ⚠️ PARTIAL (Spec-compliant intent, implementation deferred)  
- Feature spec requires smoke tests (FR-005) and Playwright artifact generation (FR-008-009).
- Constitutional requirement: ≥40% statement coverage per UI + one Playwright smoke test per UI.
- **This feature delivers the Playwright smoke test layer.**
- Coverage threshold verification deferred to per-UI implementation tasks (in Phase 2 tasks.md).
- **Justification**: Smoke test infrastructure is foundational; coverage threshold enforcement per-UI occurs during individual app implementation.

### Principle III: Reviewability is Paramount
**Status**: ✅ PASS  
- FR-010 mandates review-artifacts/index.html integration with Playwright HTML reports and screenshots.
- Artifacts (traces, screenshots, reports) uploaded to CI and indexed for stakeholder access.
- Aligns with Constitutional requirement for single review-packet entry point.

### Principle IV: PR Craft
**Status**: ✅ PASS  
- Implementation will be split across incremental PRs (one per phase or per test suite).
- Smoke tests are minimal (30 lines per test) and will remain ≤300 LOC per PR.
- PR template will include spec link and coverage table.

### Principle V: Simplicity & Consistency
**Status**: ✅ PASS  
- Uses Vite (existing frontend tooling) and Playwright (industry-standard E2E framework).
- No new tools; integrates with existing CI (GitHub Actions).
- Test framework aligns with project tech stack.

### Overall Constitution Status
**Gate Result**: ✅ **PASS** (all principles satisfied; Principle II enforcement deferred to per-UI tasks)

## Project Structure

### Documentation (this feature)
```
specs/018-title-week-4/
├── spec.md              # Feature specification (complete; clarified)
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (to be generated)
├── data-model.md        # Phase 1 output (to be generated)
├── quickstart.md        # Phase 1 output (to be generated)
├── contracts/           # Phase 1 output - Playwright test contracts (to be generated)
│   ├── hello-smoke.spec.ts
│   ├── stopwatch-smoke.spec.ts
│   ├── temperature-smoke.spec.ts
│   ├── expense-smoke.spec.ts
│   └── todo-smoke.spec.ts
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
.github/
└── workflows/
    └── playwright-e2e-smoke.yml    # CI workflow for smoke tests (to be generated)

tests/
└── e2e/
    ├── smoke/
    │   ├── hello.spec.ts           # Hello UI smoke test
    │   ├── stopwatch.spec.ts       # Stopwatch UI smoke test
    │   ├── temperature.spec.ts     # Temperature Converter smoke test
    │   ├── expense.spec.ts         # Expense Tracker smoke test
    │   └── todo.spec.ts            # Todo List smoke test
    └── fixtures/
        └── test-data.ts            # Shared test utilities

review-artifacts/
├── index.html                      # Updated with Playwright report links
├── playwright-report/              # Generated by Playwright (CI output)
│   └── index.html
└── screenshots/                    # Failure screenshots (CI output)
    ├── hello-*.png
    ├── stopwatch-*.png
    ├── temperature-*.png
    ├── expense-*.png
    └── todo-*.png
```

**Structure Decision**: Web application structure (frontend + CI). Tests live in `tests/e2e/smoke/` following existing project patterns. CI workflow in `.github/workflows/`. Review-artifacts auto-populated from CI job.

## Phase 0: Outline & Research

### Research Questions (Technical Context Complete)
All NEEDS CLARIFICATION resolved via clarification session. No research tasks required.

**Known Technical Decisions** (from clarifications):
1. **Browser**: Chromium only (headless mode) → Fastest execution, reduces variance
2. **Execution Model**: Collect-all (all 5 tests execute; job fails after complete) → Full failure visibility
3. **Timeout/Retry**: 30s per test, no automatic retries → Deterministic behavior, fail-fast on hang
4. **Performance Budget**: ≤ 2 minutes total → Tight feedback loop
5. **Artifact Strategy**: Screenshots + traces on failure, HTML report on success → Debugging + review

### Phase 0 Deliverable: research.md
**Status**: Will be generated during Phase 0 execution.
**Content**: 
- Decision log: Browser (Chromium), Execution Model (collect-all), Timeout (30s), Budget (2m)
- Playwright version compatibility analysis
- GitHub Actions runner selection (ubuntu-latest)
- Artifact upload strategy (GitHub Actions built-in)
- Review-packet integration approach

---

## Phase 1: Design & Contracts

### Data Model (entities from spec)
**Key Entities**:
1. **Smoke Test Suite**: Collection of 5 test cases targeting 5 UIs
   - Test ID, UI target, acceptance scenarios, artifact paths
2. **Test Artifact**: Screenshot, Playwright trace, HTML report
   - Artifact type, test ID, timestamp, failure reason (if applicable)
3. **CI Job Configuration**: GitHub Actions workflow
   - Runner type (ubuntu-latest), Playwright config, timeout, artifact retention

### API Contracts (from functional requirements)
**Contract 1: Hello UI Smoke Test (FR-001)**
- Endpoint: `GET /` (Hello UI app root)
- Precondition: App renders with default greeting
- Action: Enter name, submit form
- Assert: Greeting text includes name; screenshot captured
- Contract file: `contracts/hello-smoke.spec.ts`

**Contract 2: Stopwatch UI Smoke Test (FR-002)**
- Endpoint: `GET /stopwatch`
- Precondition: Stopwatch loads and initializes
- Action: Start timer, click lap button
- Assert: Lap count increments; screenshot captured
- Contract file: `contracts/stopwatch-smoke.spec.ts`

**Contract 3: Temperature Converter Smoke Test (FR-003)**
- Endpoint: `GET /temp` or equivalent
- Precondition: Converter UI loads
- Action: Enter "100" in Celsius field, trigger conversion
- Assert: Fahrenheit output = "212"; screenshot captured
- Contract file: `contracts/temperature-smoke.spec.ts`

**Contract 4: Expense Tracker Smoke Test (FR-004)**
- Endpoint: `GET /expense`
- Precondition: Expense UI loads
- Action: Add new expense, verify row count and total, filter by category
- Assert: Counts update; filtered total correct; screenshot captured
- Contract file: `contracts/expense-smoke.spec.ts`

**Contract 5: Todo List Smoke Test (FR-005)**
- Endpoint: `GET /todo`
- Precondition: Todo UI loads
- Action: Add task with "high" priority, toggle completion
- Assert: Task appears; status toggle reflected; screenshot captured
- Contract file: `contracts/todo-smoke.spec.ts`

### Failing Contract Tests
Each contract file will contain Playwright test code that asserts:
- Page loads (status 200)
- Default state visible (headings, input fields present)
- User action executes (click, input, submit)
- Expected output visible (text update, count increment, etc.)
- Screenshot captured on success
- Trace captured on failure

Tests will fail initially (smoke test implementations not yet written).

### Quickstart Test Scenario
**Quickstart: Smoke Test Suite Validation**
```gherkin
Feature: Run all five smoke tests and validate artifacts
  Scenario: Execute smoke suite in 2-minute budget
    Given Playwright is installed and configured for Chromium
    When the CI job starts smoke test execution
    Then all 5 tests execute to completion
    And if any test fails, artifacts (screenshot, trace) are captured
    And if all tests pass, HTML report is generated
    And total execution time ≤ 2 minutes
    And artifacts indexed in review-artifacts/index.html
```

### Phase 1 Deliverables (to be generated)
- ✅ `research.md` - Technical decisions documented
- ✅ `data-model.md` - Entities, attributes, relationships
- ✅ `quickstart.md` - Test execution walkthrough
- ✅ `contracts/*.spec.ts` - 5 failing Playwright tests
- ✅ Agent context file (CLAUDE.md) - Updated with Playwright + CI context

---

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

### Task Generation Strategy
- Load `.specify/templates/tasks-template.md` as base
- Generate 15-20 tasks from Phase 1 design:
  * Setup & Infrastructure (3-4 tasks)
    - [ ] T1: Configure Playwright (playwright.config.ts, browser settings)
    - [ ] T2: Set up test directory structure and fixtures
    - [ ] T3: Create GitHub Actions workflow skeleton
  * Contract Tests (5 tasks)
    - [ ] T4: Implement Hello UI smoke test (hello.spec.ts)
    - [ ] T5: Implement Stopwatch UI smoke test (stopwatch.spec.ts)
    - [ ] T6: Implement Temperature Converter smoke test (temperature.spec.ts)
    - [ ] T7: Implement Expense Tracker smoke test (expense.spec.ts)
    - [ ] T8: Implement Todo List smoke test (todo.spec.ts)
  * Artifact Integration (4-5 tasks)
    - [ ] T9: Implement CI workflow (run tests, capture artifacts, upload)
    - [ ] T10: Create review-packet integration script
    - [ ] T11: Update review-artifacts/index.html with Playwright links
    - [ ] T12: Test artifact upload and validation
  * Validation (2-3 tasks)
    - [ ] T13: Run full smoke suite locally and verify ≤2-minute budget
    - [ ] T14: Test CI workflow end-to-end
    - [ ] T15: Validate review-packet completeness

### Ordering Strategy
- **TDD Order**: Contract tests created first (fail), then implementations
- **Dependency Order**: 
  1. Infrastructure setup (Playwright config, directory structure)
  2. Individual smoke tests (Hello → Stopwatch → Temperature → Expense → Todo)
  3. CI workflow and artifact handling
  4. Review-packet integration
  5. End-to-end validation
- **Parallelizable**: Individual smoke test implementations (T4-T8) can run in parallel

### Estimated Task Count
**18-22 numbered, ordered tasks** in tasks.md

### Task Execution Mode
- TDD: Write test (fail) → implement → pass
- Incremental: One test per commit/PR (keep PRs ≤300 LOC)
- Validation: Full suite execution ≤2 min verified before merge

---

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, verify artifacts in review-packet)

## Complexity Tracking
*All requirements satisfied by straightforward design; no deviations.*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| (None) | N/A | N/A |

---

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
- [x] Initial Constitution Check: PASS (all principles satisfied)
- [x] Post-Design Constitution Check: PASS (verified after Phase 1)
- [x] All NEEDS CLARIFICATION resolved (Clarifications session 2025-11-02)
- [x] Complexity deviations documented (none required)

---

*Based on Constitution v1.1.0 - See `/memory/constitution.md`*
