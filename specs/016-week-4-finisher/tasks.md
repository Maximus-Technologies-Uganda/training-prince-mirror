# Phase 2: Task List

**Feature**: Configure and Enforce Coverage Thresholds  
**Branch**: `016-week-4-finisher`  
**Date**: 2025-10-29  
**Status**: Ready for Implementation  

---

## Overview

This task list implements coverage threshold enforcement in Vitest (60/50/60/60 globally) with CI gating and review-packet integration. Tasks are ordered by dependency with parallel execution guidance [P] for independent work streams.

**Estimated Duration**: 3-4 hours total  
**Parallel Capability**: 6 tasks can run in parallel (marked [P])

---

## Task Ordering & Dependencies

```
Setup Phase (T001-T002)
  ↓
Contract Tests (T003-T005) [P] ← can run together
  ↓
Core Configuration (T006-T008) [P] ← can run together
  ↓
Integration (T009-T011) ← sequential dependencies
  ↓
Validation (T012-T014) [P] ← can run together
  ↓
Documentation (T015)
```

---

## Setup Phase

- [x] **T001: Establish Baseline Coverage Snapshot**

**File**: `scripts/capture-baseline-coverage.js` (NEW)

**Description**: 
Capture current coverage before enforcement to understand what code needs more tests and to document the baseline state for transition.

**Steps**:
1. Run `npm run test:coverage` on current branch
2. Parse `coverage/coverage-final.json`
3. Create snapshot file: `scripts/baseline-coverage-snapshot.json`
4. Document current metrics for each entity:
   - Total statements/branches/functions/lines
   - Percentage covered
   - Gap to 60/50/60/60 thresholds
5. Run verification: `npm run test:coverage` produces exit code 0 or 1 (valid)

**Output**: 
- `scripts/baseline-coverage-snapshot.json` (documented baseline)
- Console output showing coverage gap analysis
- Exit cleanly without errors

**Acceptance Criteria**:
- ✅ Snapshot captures all coverage metrics
- ✅ Baseline file is valid JSON
- ✅ Documents gap between current and 60/50/60/60
- ✅ Script is idempotent (can run multiple times)

---

- [x] **T002: Create npm Script for Coverage with Thresholds**

**File**: `package.json`

**Description**:
Ensure `npm run test:coverage` command exists and is configured to enforce thresholds. This script will be used by both local developers and CI.

**Steps**:
1. Check if `test:coverage` script exists in `package.json`
2. If missing, add: `"test:coverage": "vitest run --coverage"`
3. Verify script includes `--coverage` flag
4. Test script locally: `npm run test:coverage`
5. Verify exit code behavior (0 on pass, 1 on fail)

**Output**:
- Updated `package.json` with test:coverage script
- Script runnable via `npm run test:coverage`

**Acceptance Criteria**:
- ✅ `npm run test:coverage` command exists
- ✅ Runs Vitest with coverage enabled
- ✅ Exit code 0 when tests pass
- ✅ Exit code 1 when tests fail or coverage below threshold (once configured)

---

## Contract Tests Phase [P]

- [x] **T003: Create Vitest Configuration Contract Test [P]**

**File**: `tests/contract/vitest-config.test.js` (NEW) [P]

**Description**:
Test that vitest.config.js will be properly structured with thresholds and excludes per contract specification.

**Steps**:
1. Create test file: `tests/contract/vitest-config.test.js`
2. Write tests for:
   - File exists and is valid JavaScript
   - coverage.all = true
   - coverage.thresholds = {statements: 60, branches: 50, functions: 60, lines: 60}
   - coverage.exclude includes all 9 patterns from data-model.md
   - coverage.include includes src/** and frontend/src/**
   - coverage.provider = 'v8'
3. Tests should FAIL initially (config not yet created)
4. Verify test framework can load config

**Output**:
- `tests/contract/vitest-config.test.js` with 6+ test cases
- All tests initially failing (as expected)

**Acceptance Criteria**:
- ✅ Tests validate all config properties
- ✅ Tests verify threshold values (60/50/60/60)
- ✅ Tests check exclude patterns
- ✅ Tests runnable via `npm run test`
- ✅ Tests fail before implementation, pass after

---

- [x] **T004: Create GitHub Actions CI Contract Test [P]**

**File**: `tests/contract/github-actions-ci.test.js` (NEW) [P]

**Description**:
Test that CI workflow will properly enforce coverage checks and block merges on failure.

**Steps**:
1. Create test file: `tests/contract/github-actions-ci.test.js`
2. Write tests to validate:
   - `.github/workflows/checks.yml` exists
   - Contains "Run tests with coverage" step
   - Step runs `npm run test:coverage`
   - Step does NOT have `continue-on-error: true`
   - Artifacts uploaded via `upload-artifact` action
   - Retention days ≥ 30
3. Parse YAML and verify structure
4. Tests should FAIL initially (workflow updates pending)

**Output**:
- `tests/contract/github-actions-ci.test.js` with 5+ test cases
- All tests initially failing

**Acceptance Criteria**:
- ✅ Tests validate workflow structure
- ✅ Tests check step configuration
- ✅ Tests verify no error bypass
- ✅ Tests validate artifact retention
- ✅ Tests fail before implementation, pass after

---

- [x] **T005: Create Review-Packet Integration Contract Test [P]**

**File**: `tests/contract/review-packet.test.js` (NEW) [P]

**Description**:
Test that review-packet workflow will integrate coverage artifacts into review-artifacts/.

**Steps**:
1. Create test file: `tests/contract/review-packet.test.js`
2. Write tests to validate:
   - `.github/workflows/review-packet.yml` exists (or review workflow)
   - Contains coverage copy step: `cp -r coverage/* review-artifacts/coverage/`
   - Step has `if: always()` to preserve artifacts on failure
   - Review artifact upload includes `review-artifacts/coverage/`
   - Retention days ≥ 30
3. Tests should FAIL initially (review workflow updates pending)

**Output**:
- `tests/contract/review-packet.test.js` with 4+ test cases
- All tests initially failing

**Acceptance Criteria**:
- ✅ Tests validate review workflow structure
- ✅ Tests check coverage artifact copy
- ✅ Tests verify `if: always()` for failure handling
- ✅ Tests validate retention policy
- ✅ Tests fail before implementation, pass after

---

## Core Configuration Phase [P]

- [x] **T006: Configure Vitest Coverage Thresholds [P]**

**File**: `vitest.config.js` (MODIFY) [P]

**Description**:
Add coverage configuration to vitest.config.js with thresholds (60/50/60/60) and exclusion patterns.

**Steps**:
1. Open `vitest.config.js`
2. Add/update coverage section with:
   ```javascript
   coverage: {
     all: true,
     include: ['src/**/*.{js,ts}', 'frontend/src/**/*.{js,ts}'],
     exclude: [
       '**/node_modules/**',
       '**/dist/**', '**/build/**',
       '**/review-artifacts/**',
       '**/*.test.js', '**/*.spec.js', '**/*.spec.ts',
       '**/coverage/**',
       '**/.git/**',
     ],
     thresholds: {
       statements: 60,
       branches: 50,
       functions: 60,
       lines: 60,
     },
     provider: 'v8',
     reporter: ['text', 'json', 'html'],
   }
   ```
3. Validate config syntax: `node -c vitest.config.js`
4. Test config loads: `npm run test:coverage 2>&1 | head -5`
5. Verify thresholds displayed in output

**Output**:
- Updated `vitest.config.js` with coverage config
- Config validation passes
- `npm run test:coverage` executes without config errors

**Acceptance Criteria**:
- ✅ Thresholds set to 60/50/60/60
- ✅ All 9 exclusion patterns included
- ✅ Include patterns cover src/ and frontend/src/
- ✅ Config file valid JavaScript
- ✅ `npm run test:coverage` runs successfully
- ✅ Threshold values displayed in output

---

- [x] **T007: Update GitHub Actions Checks Workflow [P]**

**File**: `.github/workflows/checks.yml` (MODIFY) [P]

**Description**:
Add or update the coverage check step in CI workflow to enforce thresholds and block merges on failure.

**Steps**:
1. Open `.github/workflows/checks.yml`
2. Add/update step for coverage:
   ```yaml
   - name: Run tests with coverage
     run: npm run test:coverage
   ```
3. Ensure step does NOT have `continue-on-error: true`
4. Add artifact upload (if not present):
   ```yaml
   - name: Upload coverage artifacts
     if: always()
     uses: actions/upload-artifact@v3
     with:
       name: coverage
       path: coverage/
       retention-days: 30
   ```
5. Commit and verify workflow loads in GitHub
6. No syntax errors in GitHub Actions

**Output**:
- Updated `.github/workflows/checks.yml`
- Coverage check step properly configured
- Step failure → job failure → PR check failure

**Acceptance Criteria**:
- ✅ Coverage step runs `npm run test:coverage`
- ✅ No continue-on-error bypass
- ✅ Artifacts uploaded even on failure
- ✅ Retention ≥ 30 days
- ✅ Workflow valid YAML
- ✅ No GitHub Actions syntax errors

---

- [x] **T008: Update Review-Packet Workflow for Coverage [P]**

**File**: `.github/workflows/review-packet.yml` (or equivalent) (MODIFY) [P]

**Description**:
Extend review-packet workflow to copy coverage artifacts and integrate into review-artifacts/.

**Steps**:
1. Open review-packet workflow file
2. Add coverage copy step:
   ```yaml
   - name: Copy coverage to review-artifacts
     if: always()
     run: |
       mkdir -p review-artifacts/coverage
       cp -r coverage/* review-artifacts/coverage/ 2>/dev/null || true
   ```
3. Ensure review-packet artifact upload includes `review-artifacts/coverage/`
4. Set retention-days: 60
5. Verify workflow structure is valid YAML
6. No syntax errors

**Output**:
- Updated review-packet workflow
- Coverage copy step properly configured
- Review-packet artifact includes coverage/ directory

**Acceptance Criteria**:
- ✅ Coverage artifacts copied to review-artifacts/
- ✅ Copy step has `if: always()` for failure handling
- ✅ Artifact upload includes coverage directory
- ✅ Retention ≥ 30 days (recommend 60)
- ✅ Workflow valid YAML
- ✅ No syntax errors

---

## Integration Phase

- [x] **T009: Verify Exclusion Patterns Work Correctly**

**File**: `tests/integration/coverage-exclusions.test.js` (NEW)

**Description**:
Integration test to verify that excluded files (test files, build artifacts, etc.) are NOT counted in coverage metrics.

**Steps**:
1. Create `tests/integration/coverage-exclusions.test.js`
2. Test scenario: Verify test files excluded
   - Create dummy test file: `tests/dummy.test.js`
   - Run `npm run test:coverage`
   - Parse `coverage/coverage-final.json`
   - Assert: `dummy.test.js` NOT in coverage.files
3. Test scenario: Verify build artifacts excluded
   - Create dummy build: `mkdir -p dist && echo "// build" > dist/bundle.js`
   - Run `npm run test:coverage`
   - Assert: `dist/bundle.js` NOT in coverage.files
4. Test scenario: Verify UI components ARE included
   - Check `frontend/src/ui-*.js` files ARE in coverage
   - Assert: UI coverage metrics counted
5. Verify coverage metrics unchanged after exclusion test

**Output**:
- `tests/integration/coverage-exclusions.test.js`
- All tests pass
- Coverage unchanged by excluded files

**Acceptance Criteria**:
- ✅ Test files excluded from metrics
- ✅ Build artifacts excluded from metrics
- ✅ UI components included in metrics
- ✅ Coverage percentages correct with exclusions
- ✅ All patterns working as specified

---

- [x] **T010: Verify Threshold Enforcement (Pass Scenario)**

**File**: `tests/integration/coverage-thresholds-pass.test.js` (NEW)

**Description**:
Integration test verifying that code meeting coverage thresholds allows merge (exit code 0).

**Steps**:
1. Create `tests/integration/coverage-thresholds-pass.test.js`
2. Test scenario: All thresholds met
   - Run `npm run test:coverage`
   - Capture exit code
   - Parse coverage metrics
   - Assert: statements ≥ 60%
   - Assert: branches ≥ 50%
   - Assert: functions ≥ 60%
   - Assert: lines ≥ 60%
   - Assert: exit code = 0 (success)
3. Verify metrics displayed in console

**Output**:
- `tests/integration/coverage-thresholds-pass.test.js`
- Test passes if current coverage ≥ thresholds
- Test documents current coverage state

**Acceptance Criteria**:
- ✅ Test validates all 4 threshold metrics
- ✅ Exit code 0 on success
- ✅ Coverage metrics displayed
- ✅ Test runnable locally and in CI

---

- [x] **T011: Document Coverage Policy & Requirements**

**File**: `CONTRIBUTING.md` (MODIFY) + `README.md` (MODIFY)

**Description**:
Update project documentation with coverage threshold requirements and developer workflow.

**Steps**:
1. Update `CONTRIBUTING.md`:
   - Add section: "Code Coverage Requirements"
   - Document: 60/50/60/60 global thresholds
   - Explain: Hard block enforcement (no override)
   - Add: Local testing command: `npm run test:coverage`
   - Add: How to view coverage report: `open coverage/index.html`
2. Update `README.md`:
   - Add note: "Code quality gates enforce 60% minimum coverage"
   - Link to CONTRIBUTING.md for details
   - Mention: CI blocks PRs with insufficient coverage
3. Verify documentation is clear and complete

**Output**:
- Updated `CONTRIBUTING.md` with coverage policy
- Updated `README.md` with coverage note
- Clear guidance for developers

**Acceptance Criteria**:
- ✅ Coverage thresholds documented
- ✅ Hard block policy explained
- ✅ Local testing instructions provided
- ✅ CI enforcement explained
- ✅ Links from README to CONTRIBUTING work

---

## Validation Phase [P]

- [x] **T012: Validate Vitest Config Test Pass [P]**

**File**: Tests from T003

**Description**:
Run T003 contract test to verify vitest config now passes all validations.

**Steps**:
1. Run: `npm run test tests/contract/vitest-config.test.js`
2. All tests should PASS (config created in T006)
3. Verify each validation:
   - ✅ config.coverage.all = true
   - ✅ config.coverage.thresholds = {60, 50, 60, 60}
   - ✅ All 9 exclude patterns present
   - ✅ Include patterns cover src/ and frontend/src/
   - ✅ provider = 'v8'

**Output**:
- All contract tests pass
- Test output shows 6+ passing assertions

**Acceptance Criteria**:
- ✅ All contract tests pass
- ✅ Config structure validated
- ✅ Threshold values correct
- ✅ Patterns complete

---

- [x] **T013: Validate CI Workflow Test Pass [P]**

**File**: Tests from T004

**Description**:
Run T004 contract test to verify CI workflow properly configured.

**Steps**:
1. Run: `npm run test tests/contract/github-actions-ci.test.js`
2. All tests should PASS (workflow updated in T007)
3. Verify validations:
   - ✅ checks.yml has coverage step
   - ✅ Step runs `npm run test:coverage`
   - ✅ No continue-on-error bypass
   - ✅ Artifacts uploaded
   - ✅ Retention ≥ 30 days

**Output**:
- All contract tests pass
- CI workflow validated

**Acceptance Criteria**:
- ✅ All contract tests pass
- ✅ CI step configured correctly
- ✅ No bypass mechanisms
- ✅ Artifacts properly retained

---

- [x] **T014: Validate Review-Packet Integration Test Pass [P]**

**File**: Tests from T005

**Description**:
Run T005 contract test to verify review-packet workflow integrates coverage.

**Steps**:
1. Run: `npm run test tests/contract/review-packet.test.js`
2. All tests should PASS (workflow updated in T008)
3. Verify validations:
   - ✅ review-packet workflow has coverage copy
   - ✅ Step has `if: always()`
   - ✅ Coverage dir in artifact upload
   - ✅ Retention ≥ 30 days

**Output**:
- All contract tests pass
- Review-packet integration validated

**Acceptance Criteria**:
- ✅ All contract tests pass
- ✅ Coverage artifacts copied
- ✅ Artifacts preserved on failure
- ✅ Retention configured

---

## Summary Phase

- [x] **T015: Run Full Test Suite & Verify All Tests Pass**

**File**: Test runner

**Description**:
Execute complete test suite to ensure all contract, integration, and existing tests pass with new coverage configuration.

**Steps**:
1. Run: `npm run test 2>&1` (all tests)
2. Verify exit code = 0 (all pass)
3. Check coverage metrics in output:
   - ✅ statements ≥ 60%
   - ✅ branches ≥ 50%
   - ✅ functions ≥ 60%
   - ✅ lines ≥ 60%
4. Verify contract tests pass (T003, T004, T005)
5. Verify integration tests pass (T009, T010)
6. Generate coverage report: `open coverage/index.html`

**Output**:
- All tests pass
- Coverage report generated
- Metrics meet all thresholds

**Acceptance Criteria**:
- ✅ All tests pass locally
- ✅ Coverage ≥ 60/50/60/60
- ✅ Contract tests pass
- ✅ Integration tests pass
- ✅ HTML report generated
- ✅ No errors or warnings

---

## Parallel Execution Guide

### Option 1: Run All [P] Tasks Together
```bash
# Terminal 1
npm run test tests/contract/vitest-config.test.js

# Terminal 2
npm run test tests/contract/github-actions-ci.test.js

# Terminal 3
npm run test tests/contract/review-packet.test.js

# Terminal 4 (Agent can work on T006)
# Update vitest.config.js

# Terminal 5 (Agent can work on T007)
# Update checks.yml

# Terminal 6 (Agent can work on T008)
# Update review-packet.yml

# After all complete, run T009-T014 sequentially
```

### Option 2: Agent Task Batching
```bash
# Batch 1 (parallel contracts)
task T003 & task T004 & task T005 & wait

# Batch 2 (parallel config updates)
task T006 & task T007 & task T008 & wait

# Batch 3 (sequential integration)
task T009 && task T010 && task T011

# Batch 4 (parallel validation)
task T012 & task T013 & task T014 & wait

# Final
task T015
```

---

## Quick Execution Checklist

- [x] T001: Baseline captured
- [x] T002: npm script ready
- [x] T003: Config contract test ready
- [x] T004: CI contract test ready
- [x] T005: Review-packet contract test ready
- [x] T006: Vitest config updated
- [x] T007: checks.yml updated
- [x] T008: review-packet.yml updated
- [x] T009: Exclusion verification complete
- [x] T010: Threshold pass scenario validated
- [x] T011: Documentation updated
- [x] T012: Config contract tests pass
- [x] T013: CI contract tests pass
- [x] T014: Review-packet contract tests pass
- [x] T015: Full test suite passes

---

## Success Criteria (Definition of Done)

✅ All 15 tasks complete  
✅ Coverage thresholds: 60/50/60/60 configured globally  
✅ Exclusion patterns: 9 patterns configured correctly  
✅ CI enforcement: Hard block enabled (no bypass)  
✅ Review-packet integration: Coverage artifacts persisted  
✅ Local-CI consistency: Same thresholds applied both places  
✅ Documentation: Updated CONTRIBUTING.md and README.md  
✅ All tests pass locally and in CI  
✅ Coverage metrics meet thresholds  
✅ Ready for PR merge to development branch

---

## Notes

- **TDD Approach**: Contract tests (T003-T005) written before implementation
- **Atomic Changes**: Each task modifies one logical unit (one config file or test)
- **Parallel Safety**: [P] tasks don't share file locks or dependencies
- **Baseline Documentation**: T001 captures state for transition planning
- **Hard Block Design**: No overrides; only remedy is increasing coverage

---
