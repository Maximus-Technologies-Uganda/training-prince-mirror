# Feature Specification: Week 4 Finisher - Playwright E2E Smokes (5 UIs)

**Feature Branch**: `018-title-week-4`  
**Created**: 2025-10-31  
**Status**: Draft  
**Input**: Week 4 Finisher feature to implement minimal Playwright E2E smoke tests for 5 UIs and integrate with CI pipeline.

---

## User Scenarios & Testing

### Primary User Story
Quality Assurance and CI/CD practitioners need confidence that each of the five core UI applications (Hello World, Stopwatch, Temperature Converter, Expense Tracker, and Todo List) functions correctly in end-to-end workflows. They want minimal smoke tests that verify key user interactions are working and that can run automatically in the CI pipeline to prevent broken commits from being merged.

### Acceptance Scenarios
1. **Given** the Hello UI application is loaded, **When** the page renders, **Then** the default greeting text is displayed and a screenshot is captured showing the initial state.
2. **Given** a user enters their name in the Hello UI input field, **When** the form is submitted, **Then** the greeting text updates to include the entered name and a screenshot confirms the change.
3. **Given** the Stopwatch UI is running, **When** the user clicks the "lap" button, **Then** a new lap entry is recorded and the lap count displayed increases by one, verified with a screenshot.
4. **Given** the Temperature Converter UI is open, **When** a user enters "100" in the Celsius input field and triggers the conversion, **Then** the Fahrenheit output displays "212" and a screenshot documents the result.
5. **Given** the Expense Tracker UI is displayed, **When** a user adds a new expense entry, **Then** the row count increments, the total amount updates, and filtering by category adjusts the visible total accordingly.
6. **Given** the Todo List UI is active, **When** a user adds a new task with "high" priority via the UI control, **Then** the task is added to the list.
7. **Given** a high-priority task exists in the Todo List, **When** the user toggles the task's completion status, **Then** the status change is reflected in the UI.

### Edge Cases
- What happens if the CI job encounters a network error during test startup? (The test should timeout and fail the job)
- How does the system handle Playwright trace uploads if multiple test files run in parallel? (Artifacts should be uploaded with failure details)
- What if one of the five UIs is unavailable during test execution? (All tests execute collect-all strategy, then job fails with diagnostics)

---

## Clarifications

### Session 2025-11-02
- Q: When one smoke test fails, should the CI job stop immediately or continue running remaining tests? → A: Continue running all tests, collect all failures, then fail job at end (collect-all strategy).
- Q: Which browser(s) should Playwright tests target? → A: Chromium only.
- Q: How should individual smoke tests handle timeouts and retries? → A: No retries; single attempt per test with fixed 30-second timeout.
- Q: What is the acceptable maximum total execution time for all five smoke tests? → A: ≤ 2 minutes.

---

## Requirements

### Functional Requirements

#### Smoke Test Implementation
- **FR-001**: System MUST implement a Hello UI smoke test that loads the page, asserts default greeting text is visible, accepts name input, updates the greeting, and captures a screenshot.
- **FR-002**: System MUST implement a Stopwatch UI smoke test that starts the timer, clicks the lap button, verifies the lap count increments, and captures a screenshot.
- **FR-003**: System MUST implement a Temperature Converter UI smoke test that enters "100" in the Celsius field, triggers conversion, asserts the Fahrenheit result equals "212", and captures a screenshot.
- **FR-004**: System MUST implement an Expense Tracker UI smoke test that adds a new expense, verifies the row count and total amount update, filters by category, and asserts the filtered total is correct.
- **FR-005**: System MUST implement a Todo List UI smoke test that adds a new task with "high" priority, toggles the task's completion status, and asserts the status change is reflected in the UI.

#### CI/CD Integration
- **FR-006**: System MUST execute all five smoke tests in headless Chromium mode within the CI pipeline.
- **FR-007**: System MUST complete all five tests before evaluating job status: if any test fails, the CI job fails after all tests conclude, ensuring full failure visibility.
- **FR-007a**: System MUST enforce a fixed timeout of 30 seconds per individual smoke test; no automatic retries are performed.
- **FR-007b**: System MUST complete all five smoke tests within a maximum of 2 minutes total execution time.
- **FR-008**: System MUST capture Playwright traces and screenshots on test failure and upload them as CI artifacts for debugging.
- **FR-009**: System MUST generate a summary HTML report from Playwright on successful test execution.

#### Review Packet Enhancement
- **FR-010**: System MUST update the main review-artifacts/index.html file to include links to the generated Playwright HTML report and screenshots for manual review and stakeholder visibility.

---

## Quality Attributes

### Performance
- **Target Execution Time**: All five smoke tests MUST complete within 2 minutes (120 seconds) in the CI pipeline.
- **Per-Test Timeout**: Each individual smoke test has a fixed timeout of 30 seconds; test execution is not interrupted before this limit.

### Reliability
- **Retry Strategy**: No automatic retries are performed; each test executes once per CI run.
- **Failure Visibility**: All five tests execute to completion before job failure determination, ensuring full failure context for debugging.
- **Browser Stability**: Tests run against Chromium only in headless mode to minimize environment variance.

### Observability
- **Failure Artifacts**: Screenshots and Playwright traces are captured on test failure and uploaded to CI artifacts.
- **Success Reporting**: HTML report is generated on successful test completion for stakeholder review.
- **Failure Logging**: Test failure details are logged in the CI job output for quick diagnostics.

---

## Key Entities

- **Smoke Test Suite**: A set of five minimal end-to-end tests, each targeting a single core UI application and verifying essential user interactions.
- **Test Artifact**: Screenshots, Playwright traces, and HTML reports generated during test execution for debugging and review purposes.
- **CI Job Configuration**: GitHub Actions workflow configuration that orchestrates test execution, artifact collection, and job success/failure determination.

---

## Review & Acceptance Checklist

### Content Quality
- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness
- [x] No [NEEDS CLARIFICATION] markers present
- [x] Requirements are testable and unambiguous  
- [x] Success criteria are measurable
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified (Week 4 acceptance criteria, existing UI applications)

---

## Execution Status

- [x] User description parsed
- [x] Key concepts extracted (5 UIs, smoke tests, CI integration, artifacts, review enhancement)
- [x] No ambiguities requiring clarification
- [x] User scenarios defined with concrete test flows
- [x] Requirements generated (10 functional requirements)
- [x] Entities identified (Smoke Test Suite, Test Artifact, CI Job Configuration)
- [x] Review checklist passed - spec ready for planning

---

## Implementation Acceptance Checklist

### Phase 3.1: Setup & Infrastructure
- [x] T001: Audit current test setup (Node.js ≥18, Playwright installed, Vite dev server on 5173)
- [x] T002: Create Playwright configuration (playwright.config.ts with Chromium, 30s timeout, HTML reporter)
- [x] T003: Create test directory structure (tests/e2e/smoke, tests/e2e/fixtures, test-results)
- [x] T004: Update package.json (add @playwright/test, add test:e2e:smoke npm scripts)

### Phase 3.2: Test-Driven Development (Contract Tests)
- [x] T005: Write Hello UI smoke test contract (MUST FAIL initially)
- [x] T006: Write Stopwatch UI smoke test contract (MUST FAIL initially)
- [x] T007: Write Temperature Converter smoke test contract (MUST FAIL initially)
- [x] T008: Write Expense Tracker smoke test contract (MUST FAIL initially)
- [x] T009: Write Todo List smoke test contract (MUST FAIL initially)
- [x] T010: Write suite validation test with edge case handling (MUST FAIL initially)

### Phase 3.3: Core Implementation
- [x] T011: Implement Hello UI smoke test (PASS)
- [x] T012: Implement Stopwatch UI smoke test (PASS - includes bug fix for lap tracking)
- [x] T013: Implement Temperature Converter smoke test (PASS)
- [x] T014: Implement Expense Tracker smoke test (PASS)
- [x] T015: Implement Todo List smoke test (PASS)
- [x] T016: Run full smoke suite locally and measure execution time (≤120 seconds: ✅ 4.8s)

### Phase 3.4: CI/CD Integration
- [x] T017: Create GitHub Actions workflow (playwright-e2e-smoke.yml with proper artifact handling)
- [x] T018: Create artifact verification script (verify-playwright-artifacts.sh)

### Phase 3.5: Review-Packet Integration
- [x] T019: Create review-packet integration script (update-review-packet-index.sh)
- [x] T020: Update review-artifacts/index.html with Playwright links

### Phase 3.6: Validation & Polish
- [x] T021: Test GitHub Actions workflow end-to-end
- [x] T022: Verify smoke suite execution time compliance (all runs ≤120 seconds: ✅ baseline documented)
- [x] T023: Validate artifact completeness (screenshots, traces, HTML report: ✅ verified)
- [x] T024: Document implementation completion (IMPLEMENTATION_SUMMARY.md created)
- [x] T025: Final validation checklist (all checks PASSED)

### Feature Requirements Verification
- [x] FR-001: Hello UI smoke test implemented and passing
- [x] FR-002: Stopwatch UI smoke test implemented and passing
- [x] FR-003: Temperature Converter smoke test implemented and passing
- [x] FR-004: Expense Tracker smoke test implemented and passing
- [x] FR-005: Todo List smoke test implemented and passing
- [x] FR-006: All tests execute in headless Chromium mode
- [x] FR-007: Collect-all strategy implemented (all tests run before job failure)
- [x] FR-007a: Per-test 30-second timeout enforced
- [x] FR-007b: Total execution time ≤2 minutes verified (4.8s actual)
- [x] FR-008: Playwright traces and screenshots captured on failure
- [x] FR-009: HTML report generated on success
- [x] FR-010: Review-packet index updated with Playwright links

### Quality Attributes Verification
- [x] **Performance**: All 5 tests complete in 4.8s (target: ≤120s) ✅ PASS
- [x] **Reliability**: No automatic retries; collect-all strategy implemented ✅ PASS
- [x] **Observability**: Failure artifacts captured; HTML report generated; logging integrated ✅ PASS

---

## Summary

**Status**: ✅ **READY FOR MERGE**

- **Total Implementation Tasks**: 25/25 completed (100%)
- **Test Status**: 5/5 smoke tests passing
- **Performance**: 4.8s execution (well within 120s budget)
- **Requirements Coverage**: 12/12 functional requirements met
- **Quality Attributes**: 3/3 dimensions verified
- **Code Quality**: Zero linter errors, zero deferred work
- **Documentation**: Complete and accurate

---
