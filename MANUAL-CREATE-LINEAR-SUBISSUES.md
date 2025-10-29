# Manual Linear Sub-Issues Creation Guide

**Feature**: 016-week-4-finisher - Configure and Enforce Coverage Thresholds  
**Parent Issue**: `PRI-1514`  
**Total Sub-Issues**: 15  
**Time to Create**: ~10-15 minutes

---

## Instructions

1. Go to Linear: https://linear.app
2. Open parent issue: **PRI-1514**
3. Click "Create sub-issue" (or + button)
4. Copy-paste each task below into Linear
5. Verify all dependencies are set correctly

---

## Sub-Issue Template

**Use this format for each task:**
- Title: Copy from "### Title" below
- Description: Copy from "**Description**" section
- Priority: Set as indicated
- Dependencies: Link to other tasks as shown

---

## Tasks to Create

### 1️⃣ T001: Establish Baseline Coverage Snapshot

**Type**: Setup  
**Priority**: High (blocks others)  
**Dependencies**: None  
**Parallel**: ❌ No

**Title**: T001: Establish Baseline Coverage Snapshot

**Description**:
```
Feature: 016-week-4-finisher - Configure and Enforce Coverage Thresholds
Parent: PRI-1514
Type: setup
File: scripts/capture-baseline-coverage.js

Capture current coverage before enforcement to understand what code needs more tests and to document the baseline state for transition.

## Acceptance Criteria
- ✅ Snapshot captures all coverage metrics
- ✅ Baseline file is valid JSON
- ✅ Documents gap between current and 60/50/60/60
- ✅ Script is idempotent (can run multiple times)
```

---

### 2️⃣ T002: Create npm Script for Coverage with Thresholds

**Type**: Setup  
**Priority**: High (blocks T003-T005)  
**Dependencies**: T001  
**Parallel**: ❌ No

**Title**: T002: Create npm Script for Coverage with Thresholds

**Description**:
```
Feature: 016-week-4-finisher - Configure and Enforce Coverage Thresholds
Parent: PRI-1514
Type: setup
File: package.json
Dependencies: T001

Ensure `npm run test:coverage` command exists and is configured to enforce thresholds. This script will be used by both local developers and CI.

## Acceptance Criteria
- ✅ `npm run test:coverage` command exists
- ✅ Runs Vitest with coverage enabled
- ✅ Exit code 0 when tests pass
- ✅ Exit code 1 when tests fail or coverage below threshold
```

---

### 3️⃣ T003: Create Vitest Configuration Contract Test

**Type**: Test  
**Priority**: High  
**Dependencies**: T002  
**Parallel**: ⚡ YES (can run with T004, T005)

**Title**: T003: Create Vitest Configuration Contract Test

**Description**:
```
Feature: 016-week-4-finisher - Configure and Enforce Coverage Thresholds
Parent: PRI-1514
Type: test
File: tests/contract/vitest-config.test.js
Parallel: Yes - can run alongside other [P] tasks
Dependencies: T002

Test that vitest.config.js will be properly structured with thresholds and excludes per contract specification.

## Acceptance Criteria
- ✅ Tests validate all config properties
- ✅ Tests verify threshold values (60/50/60/60)
- ✅ Tests check exclude patterns
- ✅ Tests runnable via `npm run test`
- ✅ Tests fail before implementation, pass after
```

---

### 4️⃣ T004: Create GitHub Actions CI Contract Test

**Type**: Test  
**Priority**: High  
**Dependencies**: T002  
**Parallel**: ⚡ YES (can run with T003, T005)

**Title**: T004: Create GitHub Actions CI Contract Test

**Description**:
```
Feature: 016-week-4-finisher - Configure and Enforce Coverage Thresholds
Parent: PRI-1514
Type: test
File: tests/contract/github-actions-ci.test.js
Parallel: Yes - can run alongside other [P] tasks
Dependencies: T002

Test that CI workflow will properly enforce coverage checks and block merges on failure.

## Acceptance Criteria
- ✅ Tests validate workflow structure
- ✅ Tests check step configuration
- ✅ Tests verify no error bypass
- ✅ Tests validate artifact retention
- ✅ Tests fail before implementation, pass after
```

---

### 5️⃣ T005: Create Review-Packet Integration Contract Test

**Type**: Test  
**Priority**: High  
**Dependencies**: T002  
**Parallel**: ⚡ YES (can run with T003, T004)

**Title**: T005: Create Review-Packet Integration Contract Test

**Description**:
```
Feature: 016-week-4-finisher - Configure and Enforce Coverage Thresholds
Parent: PRI-1514
Type: test
File: tests/contract/review-packet.test.js
Parallel: Yes - can run alongside other [P] tasks
Dependencies: T002

Test that review-packet workflow will integrate coverage artifacts into review-artifacts/.

## Acceptance Criteria
- ✅ Tests validate review workflow structure
- ✅ Tests check coverage artifact copy
- ✅ Tests verify `if: always()` for failure handling
- ✅ Tests validate retention policy
- ✅ Tests fail before implementation, pass after
```

---

### 6️⃣ T006: Configure Vitest Coverage Thresholds

**Type**: Config  
**Priority**: High  
**Dependencies**: T003  
**Parallel**: ⚡ YES (can run with T007, T008)

**Title**: T006: Configure Vitest Coverage Thresholds

**Description**:
```
Feature: 016-week-4-finisher - Configure and Enforce Coverage Thresholds
Parent: PRI-1514
Type: config
File: vitest.config.js
Parallel: Yes - can run alongside other [P] tasks
Dependencies: T003

Add coverage configuration to vitest.config.js with thresholds (60/50/60/60) and exclusion patterns.

## Acceptance Criteria
- ✅ Thresholds set to 60/50/60/60
- ✅ All 9 exclusion patterns included
- ✅ Include patterns cover src/ and frontend/src/
- ✅ Config file valid JavaScript
- ✅ `npm run test:coverage` runs successfully
- ✅ Threshold values displayed in output
```

---

### 7️⃣ T007: Update GitHub Actions Checks Workflow

**Type**: Config  
**Priority**: High  
**Dependencies**: T004  
**Parallel**: ⚡ YES (can run with T006, T008)

**Title**: T007: Update GitHub Actions Checks Workflow

**Description**:
```
Feature: 016-week-4-finisher - Configure and Enforce Coverage Thresholds
Parent: PRI-1514
Type: config
File: .github/workflows/checks.yml
Parallel: Yes - can run alongside other [P] tasks
Dependencies: T004

Add or update the coverage check step in CI workflow to enforce thresholds and block merges on failure.

## Acceptance Criteria
- ✅ Coverage step runs `npm run test:coverage`
- ✅ No continue-on-error bypass
- ✅ Artifacts uploaded even on failure
- ✅ Retention ≥ 30 days
- ✅ Workflow valid YAML
- ✅ No GitHub Actions syntax errors
```

---

### 8️⃣ T008: Update Review-Packet Workflow for Coverage

**Type**: Config  
**Priority**: High  
**Dependencies**: T005  
**Parallel**: ⚡ YES (can run with T006, T007)

**Title**: T008: Update Review-Packet Workflow for Coverage

**Description**:
```
Feature: 016-week-4-finisher - Configure and Enforce Coverage Thresholds
Parent: PRI-1514
Type: config
File: .github/workflows/review-packet.yml
Parallel: Yes - can run alongside other [P] tasks
Dependencies: T005

Extend review-packet workflow to copy coverage artifacts and integrate into review-artifacts/.

## Acceptance Criteria
- ✅ Coverage artifacts copied to review-artifacts/
- ✅ Copy step has `if: always()` for failure handling
- ✅ Artifact upload includes coverage directory
- ✅ Retention ≥ 30 days (recommend 60)
- ✅ Workflow valid YAML
- ✅ No syntax errors
```

---

### 9️⃣ T009: Verify Exclusion Patterns Work Correctly

**Type**: Integration  
**Priority**: Medium  
**Dependencies**: T006, T007, T008  
**Parallel**: ❌ No

**Title**: T009: Verify Exclusion Patterns Work Correctly

**Description**:
```
Feature: 016-week-4-finisher - Configure and Enforce Coverage Thresholds
Parent: PRI-1514
Type: integration
File: tests/integration/coverage-exclusions.test.js
Dependencies: T006, T007, T008

Integration test to verify that excluded files (test files, build artifacts, etc.) are NOT counted in coverage metrics.

## Acceptance Criteria
- ✅ Test files excluded from metrics
- ✅ Build artifacts excluded from metrics
- ✅ UI components included in metrics
- ✅ Coverage percentages correct with exclusions
- ✅ All patterns working as specified
```

---

### 🔟 T010: Verify Threshold Enforcement (Pass Scenario)

**Type**: Integration  
**Priority**: Medium  
**Dependencies**: T006, T007, T008  
**Parallel**: ❌ No

**Title**: T010: Verify Threshold Enforcement (Pass Scenario)

**Description**:
```
Feature: 016-week-4-finisher - Configure and Enforce Coverage Thresholds
Parent: PRI-1514
Type: integration
File: tests/integration/coverage-thresholds-pass.test.js
Dependencies: T006, T007, T008

Integration test verifying that code meeting coverage thresholds allows merge (exit code 0).

## Acceptance Criteria
- ✅ Test validates all 4 threshold metrics
- ✅ Exit code 0 on success
- ✅ Coverage metrics displayed
- ✅ Test runnable locally and in CI
```

---

### 1️⃣1️⃣ T011: Document Coverage Policy & Requirements

**Type**: Docs  
**Priority**: Medium  
**Dependencies**: T009, T010  
**Parallel**: ❌ No

**Title**: T011: Document Coverage Policy & Requirements

**Description**:
```
Feature: 016-week-4-finisher - Configure and Enforce Coverage Thresholds
Parent: PRI-1514
Type: docs
File: CONTRIBUTING.md + README.md
Dependencies: T009, T010

Update project documentation with coverage threshold requirements and developer workflow.

## Acceptance Criteria
- ✅ Coverage thresholds documented
- ✅ Hard block policy explained
- ✅ Local testing instructions provided
- ✅ CI enforcement explained
- ✅ Links from README to CONTRIBUTING work
```

---

### 1️⃣2️⃣ T012: Validate Vitest Config Test Pass

**Type**: Validation  
**Priority**: Medium  
**Dependencies**: T006  
**Parallel**: ⚡ YES (can run with T013, T014)

**Title**: T012: Validate Vitest Config Test Pass

**Description**:
```
Feature: 016-week-4-finisher - Configure and Enforce Coverage Thresholds
Parent: PRI-1514
Type: validation
File: tests/contract/vitest-config.test.js
Parallel: Yes - can run alongside other [P] tasks
Dependencies: T006

Run T003 contract test to verify vitest config now passes all validations.

## Acceptance Criteria
- ✅ All contract tests pass
- ✅ Config structure validated
- ✅ Threshold values correct
- ✅ Patterns complete
```

---

### 1️⃣3️⃣ T013: Validate CI Workflow Test Pass

**Type**: Validation  
**Priority**: Medium  
**Dependencies**: T007  
**Parallel**: ⚡ YES (can run with T012, T014)

**Title**: T013: Validate CI Workflow Test Pass

**Description**:
```
Feature: 016-week-4-finisher - Configure and Enforce Coverage Thresholds
Parent: PRI-1514
Type: validation
File: tests/contract/github-actions-ci.test.js
Parallel: Yes - can run alongside other [P] tasks
Dependencies: T007

Run T004 contract test to verify CI workflow properly configured.

## Acceptance Criteria
- ✅ All contract tests pass
- ✅ CI step configured correctly
- ✅ No bypass mechanisms
- ✅ Artifacts properly retained
```

---

### 1️⃣4️⃣ T014: Validate Review-Packet Integration Test Pass

**Type**: Validation  
**Priority**: Medium  
**Dependencies**: T008  
**Parallel**: ⚡ YES (can run with T012, T013)

**Title**: T014: Validate Review-Packet Integration Test Pass

**Description**:
```
Feature: 016-week-4-finisher - Configure and Enforce Coverage Thresholds
Parent: PRI-1514
Type: validation
File: tests/contract/review-packet.test.js
Parallel: Yes - can run alongside other [P] tasks
Dependencies: T008

Run T005 contract test to verify review-packet workflow integrates coverage.

## Acceptance Criteria
- ✅ All contract tests pass
- ✅ Coverage artifacts copied
- ✅ Artifacts preserved on failure
- ✅ Retention configured
```

---

### 1️⃣5️⃣ T015: Run Full Test Suite & Verify All Tests Pass

**Type**: Summary  
**Priority**: High (final validation)  
**Dependencies**: T012, T013, T014  
**Parallel**: ❌ No

**Title**: T015: Run Full Test Suite & Verify All Tests Pass

**Description**:
```
Feature: 016-week-4-finisher - Configure and Enforce Coverage Thresholds
Parent: PRI-1514
Type: summary
File: test runner
Dependencies: T012, T013, T014

Execute complete test suite to ensure all contract, integration, and existing tests pass with new coverage configuration.

## Acceptance Criteria
- ✅ All tests pass locally
- ✅ Coverage ≥ 60/50/60/60
- ✅ Contract tests pass
- ✅ Integration tests pass
- ✅ HTML report generated
- ✅ No errors or warnings
```

---

## Summary Table

| # | Task | Type | Dependencies | Parallel | Priority |
|---|------|------|-------------|----------|----------|
| 1 | T001 | Setup | None | ❌ | High |
| 2 | T002 | Setup | T001 | ❌ | High |
| 3 | T003 | Test | T002 | ⚡ | High |
| 4 | T004 | Test | T002 | ⚡ | High |
| 5 | T005 | Test | T002 | ⚡ | High |
| 6 | T006 | Config | T003 | ⚡ | High |
| 7 | T007 | Config | T004 | ⚡ | High |
| 8 | T008 | Config | T005 | ⚡ | High |
| 9 | T009 | Integration | T006, T007, T008 | ❌ | Medium |
| 10 | T010 | Integration | T006, T007, T008 | ❌ | Medium |
| 11 | T011 | Docs | T009, T010 | ❌ | Medium |
| 12 | T012 | Validation | T006 | ⚡ | Medium |
| 13 | T013 | Validation | T007 | ⚡ | Medium |
| 14 | T014 | Validation | T008 | ⚡ | Medium |
| 15 | T015 | Summary | T012, T013, T014 | ❌ | High |

---

## ✅ Verification Checklist

After creating all 15 sub-issues, verify:
- [ ] All 15 sub-issues created under PRI-1514
- [ ] Dependencies linked correctly
- [ ] Priority levels set appropriately
- [ ] Parallel tasks [⚡] marked in description
- [ ] File paths correct in each description
- [ ] Acceptance criteria clear and testable

---

## 🚀 Next Steps

1. ✅ Create all 15 sub-issues in Linear using this guide
2. ✅ Set start date for Phase 1 (T001-T002)
3. ✅ Assign team members to tasks
4. ✅ Begin execution with T001
5. ✅ Track progress in Linear as tasks complete
