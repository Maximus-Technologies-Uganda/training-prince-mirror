# Tasks: Week 4 Finisher - Fix Review-Packet Packaging for CI

**Input**: Design documents from `/specs/017-week-4-finisher/`  
**Prerequisites**: plan.md, research.md, data-model.md, contracts/, quickstart.md  
**Feature**: Ensure all five UI test suites (ui-expense, ui-stopwatch, ui-temp, ui-todo, ui-quote) generate complete coverage reports (lcov.info + HTML) that are copied to review-artifacts/ and packaged into the final review-packet artifact.

---

## Execution Flow

```
1. Setup: Configure project structure and dependencies
2. Tests: Write contract tests (TDD) - MUST FAIL before implementation
3. Core: Implement CI workflow changes, scripts, and verification
4. Integration: Connect all pieces together in the workflow
5. Polish: Validation, documentation, and final verification
6. Result: All coverage reports packaged into GitHub Actions artifact with fail-fast validation
```

---

## Phase 3.1: Setup (Prerequisites)

- [ ] **T001** Audit current `.github/workflows/test.yml` to understand existing coverage configuration and identify gaps in coverage generation/copying/verification
- [ ] **T002** Verify vitest.config.js has coverage enabled with reporters: ["lcov", "html"] and all five UI test suites are included or covered by pattern matching
- [ ] **T003** Create `.github/scripts/` directory if it doesn't exist to house helper scripts for coverage copying and verification

---

## Phase 3.2: Tests First (TDD) ⚠️ CRITICAL - MUST FAIL BEFORE IMPLEMENTATION

**Contract tests validate the interface boundaries. These MUST be written and MUST FAIL before ANY implementation.**

- [ ] **T004** [P] Write contract test for Coverage Generation in `tests/contracts/test-coverage-generation.js` - verify Vitest executes all five UI test suites and produces lcov.info + HTML for each (MUST FAIL - no implementation yet)
- [ ] **T005** [P] Write contract test for Coverage Copying in `tests/contracts/test-coverage-copying.js` - verify all five coverage directories are successfully copied from coverage/ to review-artifacts/ (MUST FAIL)
- [ ] **T006** [P] Write contract test for Coverage Verification in `tests/contracts/test-coverage-verification.js` - verify verification script confirms all five suites have lcov.info and index.html files with minimum size requirements (MUST FAIL)
- [ ] **T007** [P] Write contract test for Artifact Upload in `tests/contracts/test-artifact-upload.js` - verify artifact packaging only proceeds if verification passes (MUST FAIL)
- [ ] **T008** [P] Integration test: End-to-end workflow in `tests/integration/test-review-packet-workflow.js` - simulate complete flow from coverage generation → copying → verification → artifact (MUST FAIL)

---

## Phase 3.3: Core Implementation (ONLY after tests are failing)

### Vitest Configuration

- [ ] **T009** Update `vitest.config.js` to ensure coverage is enabled with reporters: ["lcov", "html", "text-summary"] for all five UI test suites (ui-expense, ui-stopwatch, ui-temp, ui-todo, ui-quote)
- [ ] **T010** Set coverage output directory to `coverage/` in vitest.config.js with 40% minimum statement threshold per Constitutional requirement
- [ ] **T011** Verify each test suite generates output in separate coverage/[suite-name]/ directory structure (not aggregated)

### CI Workflow: Coverage Generation Step

- [ ] **T012** Audit existing test.yml workflow to see if coverage is already being generated; if not, add step: `npm run test:ui:coverage` with fail-fast behavior (exit code check)
- [ ] **T013** Create npm script `test:ui:coverage` in package.json that runs Vitest with coverage enabled for all five UI test suites: `vitest run --coverage -- frontend/tests/ui-*.test.js`
- [ ] **T014** Ensure coverage generation step fails the build immediately if any test suite fails or coverage is below 40% threshold

### Coverage Copying Script

- [ ] **T015** Create `.github/scripts/copy-coverage-reports.sh` bash script that:
  - Creates review-artifacts/ directory
  - Copies coverage/ui-expense/ → review-artifacts/ui-expense/
  - Copies coverage/ui-stopwatch/ → review-artifacts/ui-stopwatch/
  - Copies coverage/ui-temp/ → review-artifacts/ui-temp/
  - Copies coverage/ui-todo/ → review-artifacts/ui-todo/
  - Copies coverage/ui-quote/ → review-artifacts/ui-quote/
  - Exits with error code 1 if any copy fails

- [ ] **T016** Add copy script step to `.github/workflows/test.yml` workflow: `bash .github/scripts/copy-coverage-reports.sh` after coverage generation completes

### Coverage Verification Script

- [ ] **T017** Create `.github/scripts/verify-coverage-reports.sh` bash script that:
  - Checks all five suite directories exist in review-artifacts/
  - Verifies each suite has lcov.info (>1024 bytes) and index.html (>512 bytes)
  - Validates lcov.info contains valid LCOV format (TN: lines)
  - Validates index.html contains valid HTML tags
  - Reports pass/fail status with detailed failure messages
  - Exits with code 0 on success, 1 on failure

- [ ] **T018** Add verification step to `.github/workflows/test.yml` workflow: `bash .github/scripts/verify-coverage-reports.sh` after coverage copying completes

---

## Phase 3.4: Integration

### Review Index Validation

- [ ] **T019** Audit `review-artifacts/index.html` to ensure it references all five coverage suites with correct relative links:
  - `./ui-expense/index.html` and `./ui-expense/lcov.info`
  - `./ui-stopwatch/index.html` and `./ui-stopwatch/lcov.info`
  - `./ui-temp/index.html` and `./ui-temp/lcov.info`
  - `./ui-todo/index.html` and `./ui-todo/lcov.info`
  - `./ui-quote/index.html` and `./ui-quote/lcov.info`

- [ ] **T020** Update review-artifacts/index.html if needed to include all five suite links with proper formatting

### CI Workflow Artifact Upload

- [ ] **T021** Add artifact upload step to `.github/workflows/test.yml` using `actions/upload-artifact@v4`:
  - Runs only if verification step succeeds (`if: success()`)
  - Artifact name: `review-packet`
  - Artifact path: `review-artifacts/`
  - Retention days: 90

- [ ] **T022** Ensure workflow fails immediately on any error (fail-fast behavior):
  - Coverage generation failure → stop
  - Coverage copying failure → stop
  - Verification failure → stop
  - No artifact uploaded if any step fails

### GitHub Actions Workflow Validation

- [ ] **T023** Verify complete `.github/workflows/test.yml` workflow contains steps in correct order:
  1. Run all tests (existing)
  2. Generate coverage (new/updated)
  3. Copy coverage to review-artifacts (new)
  4. Verify all reports exist (new)
  5. Upload artifact (new/updated)

---

## Phase 3.5: Polish & Validation

### Local Validation

- [ ] **T024** [P] Run quickstart.md Step 1: Verify Vitest configuration - confirm all five suites have coverage enabled
- [ ] **T025** [P] Run quickstart.md Step 2: Generate local coverage with `npm run test:ui:coverage` - verify all five suites execute
- [ ] **T026** [P] Run quickstart.md Step 3: Verify coverage files exist - ensure lcov.info and index.html for all five suites in coverage/
- [ ] **T027** [P] Run quickstart.md Step 4: Execute copy script locally - verify files copied to review-artifacts/
- [ ] **T028** [P] Run quickstart.md Step 5: Execute verification script locally - confirm all reports verified successfully

### Failure Scenario Testing

- [ ] **T029** Test failure scenario: Remove one coverage file and run verification script - confirm it fails with proper error message
- [ ] **T030** Test failure scenario: Mock test failure by temporarily modifying a test file - confirm coverage generation fails and verification is skipped
- [ ] **T031** Test failure scenario: Delete a suite directory - confirm verification fails and artifact upload is prevented

### Documentation & Cleanup

- [ ] **T032** Create/update docs/COVERAGE_WORKFLOW.md documenting:
  - How coverage is generated for five UI test suites
  - Where coverage reports are stored (coverage/ and review-artifacts/)
  - How to verify coverage locally
  - What to do if verification fails

- [ ] **T033** Add comments to `.github/scripts/copy-coverage-reports.sh` explaining the coverage copying process
- [ ] **T034** Add comments to `.github/scripts/verify-coverage-reports.sh` explaining the verification logic

### Final Integration Test

- [ ] **T035** Run quickstart.md Step 8: Simulate complete CI workflow locally - execute all steps in sequence and confirm success
- [ ] **T036** Run quickstart.md Step 9: Verify CI workflow configuration - check .github/workflows/test.yml has all required steps
- [ ] **T037** Commit all changes with message: "feat(017): Fix review-packet packaging for all five UI test suites"

---

## Dependencies

```
T001, T002, T003          → Setup (must complete first)
                           ↓
T004-T008                 → Tests (write FAILING tests) [P] - can run in parallel
                           ↓
T009-T011                 → Vitest config [P]
T012-T014                 → Coverage generation [P]
T015-T016                 → Coverage copying [P]
T017-T018                 → Coverage verification [P]
                           ↓
T019-T020                 → Review index [P]
T021-T023                 → Artifact workflow [P]
                           ↓
T024-T031                 → Validation [P] - can run in parallel
T032-T034                 → Documentation [P]
                           ↓
T035-T037                 → Final integration & commit
```

---

## Parallel Execution Examples

### Setup Phase (all independent):
```
Task: "Audit current .github/workflows/test.yml"
Task: "Verify vitest.config.js has coverage enabled"
Task: "Create .github/scripts/ directory"
```

### Contract Tests (all independent files):
```
Task: "Write contract test for Coverage Generation"
Task: "Write contract test for Coverage Copying"
Task: "Write contract test for Coverage Verification"
Task: "Write contract test for Artifact Upload"
Task: "Integration test: End-to-end workflow"
```

### Core Implementation (can parallelize by component):
```
Task: "Update vitest.config.js for coverage"
Task: "Add test:ui:coverage npm script"
Task: "Create copy-coverage-reports.sh script"
Task: "Create verify-coverage-reports.sh script"
Task: "Update .github/workflows/test.yml with new steps"
```

### Validation (all independent):
```
Task: "Run local coverage generation verification"
Task: "Test coverage copying locally"
Task: "Test verification script locally"
Task: "Test failure scenarios"
Task: "Create documentation"
```

---

## Success Criteria

✅ **Feature is complete WHEN**:

1. **T001-T003** Setup verified - vitest.config.js configured, scripts directory created
2. **T004-T008** All contract tests written and FAILING (prove implementation needed)
3. **T009-T018** All core implementation complete:
   - Vitest configured for five UI test suites with lcov + html reporters
   - npm run test:ui:coverage executes all five suites
   - Coverage files generated in coverage/[suite-name]/ structure
   - Copy script successfully copies all five suite directories to review-artifacts/
   - Verification script confirms all five suites have lcov.info + index.html
4. **T019-T023** Integration complete:
   - Review index references all five suites
   - CI workflow has all steps in correct order with fail-fast behavior
5. **T024-T031** All local validations pass - all nine quickstart steps execute successfully
6. **T032-T034** Documentation complete and scripts have clarifying comments
7. **T035-T037** Final integration test passes and changes committed

---

## Notes

- [P] tasks = different files/scripts, no dependencies, can run in parallel
- Contract tests must FAIL before implementation begins (TDD principle)
- Fail-fast behavior is mandatory: any test/coverage/verification failure stops CI
- All five UI test suites MUST be included: ui-expense, ui-stopwatch, ui-temp, ui-todo, ui-quote
- Minimum coverage threshold: 40% statements per Constitutional Principle II
- Review-packet artifact must be uploaded to GitHub Actions Artifacts

---

## Related Documents

- **Specification**: `/specs/017-week-4-finisher/spec.md`
- **Research**: `/specs/017-week-4-finisher/research.md`
- **Data Model**: `/specs/017-week-4-finisher/data-model.md`
- **Contracts**: `/specs/017-week-4-finisher/contracts/`
- **Quickstart**: `/specs/017-week-4-finisher/quickstart.md`

---

*Based on Constitution v1.1.0 - TDD (Tests First), Reviewability (Complete Coverage), Test Coverage Mandate (40% minimum)*








