# Phase 1: Quickstart & Validation

**Feature**: Configure and Enforce Coverage Thresholds  
**Date**: 2025-10-29  
**Audience**: Developers, QA, reviewers  

---

## Quickstart: Validate Coverage Thresholds

This guide walks through setting up and validating coverage thresholds locally and in CI.

---

## Part 1: Local Development Workflow

### Step 1: Run Tests with Coverage Locally

```bash
npm run test:coverage
```

**Expected Output**:
```
✓ Vitest runs all tests
✓ Generates coverage/coverage-final.json
✓ Generates coverage/index.html
✓ Displays coverage summary in console
✓ Lists any thresholds NOT met
```

### Step 2: Check Coverage Metrics

Open the HTML report in your browser:
```bash
open coverage/index.html
```

**Expected**: 
- Tables showing statements, branches, functions, lines covered
- Color-coded (green = good, red = needs work)
- Per-file breakdown showing which files need more test coverage

### Step 3: Validate Thresholds

Run and check for errors:
```bash
npm run test:coverage 2>&1 | grep -i "threshold\|coverage"
```

**Success Case** (all thresholds met):
```
✓ File Coverage lines: [60%] >= [60%]
✓ File Coverage statements: [60%] >= [60%]
✓ File Coverage functions: [60%] >= [60%]
✓ File Coverage branches: [50%] >= [50%]
```

**Failure Case** (thresholds NOT met):
```
✗ File Coverage statements: [45%] < [60%]
✗ File Coverage functions: [40%] < [60%]
Coverage thresholds not met. Task failed.
```

### Step 4: Add Tests to Fix Coverage Gaps

If thresholds not met:
1. Open `coverage/index.html` and identify red (uncovered) lines
2. Write additional tests in `tests/` directory
3. Re-run `npm run test:coverage`
4. Verify all thresholds now pass

---

## Part 2: CI Workflow Validation

### Scenario 1: PR with Sufficient Coverage

**Setup**: Push code to feature branch with tests meeting 60/50/60/60 thresholds

**In GitHub**:
1. Create a pull request
2. CI workflow (`checks.yml`) runs automatically
3. Step: "Run tests with coverage" executes
4. Exit code 0 (success)

**Expected Outcome**:
```
✅ Coverage Check                    PASS
   └─ All metrics meet thresholds
      ✓ Statements: 65% >= 60%
      ✓ Branches: 55% >= 50%
      ✓ Functions: 62% >= 60%
      ✓ Lines: 63% >= 60%
```

**Result**: ✅ Merge allowed

---

### Scenario 2: PR with Insufficient Coverage

**Setup**: Push code to feature branch with tests meeting only 45% statements

**In GitHub**:
1. Create a pull request
2. CI workflow runs automatically
3. Step: "Run tests with coverage" executes
4. Exit code 1 (failure - thresholds not met)

**Expected Outcome**:
```
❌ Coverage Check                    FAIL
   └─ Threshold violation detected
      ✗ Statements: 45% < 60%
      ✓ Branches: 52% >= 50%
      ✓ Functions: 61% >= 60%
      ✓ Lines: 48% < 60%
```

**Result**: ❌ Merge blocked (red X on PR)

**Developer action**:
- Add more tests to increase coverage
- Push new commit
- CI re-runs automatically
- Merge allowed once thresholds met

---

### Scenario 3: Verifying Exclusions Work

**Setup**: Add files that SHOULD be excluded and verify they don't affect coverage

**Test Exclusions**:
```bash
# Add a test file with NO coverage
echo "// This test file has 0 coverage" > tests/dummy.test.js
echo "describe('unused', () => { it('skipped', () => {}) })" >> tests/dummy.test.js

# Add a build artifact with NO coverage
mkdir -p dist
echo "// Build artifact" > dist/bundle.js

# Run coverage
npm run test:coverage
```

**Expected**:
- ✅ Test file `tests/dummy.test.js` NOT in coverage report
- ✅ Build artifact `dist/bundle.js` NOT in coverage report
- ✅ Coverage metrics unchanged from before
- ✅ All thresholds still pass

---

### Scenario 4: Verifying UI Components Are Included

**Setup**: Check that UI components from `frontend/src/ui-*` are included

**Verify Inclusion**:
```bash
# Check if UI components are in coverage report
npm run test:coverage 2>&1 | grep -i "ui-"

# Or inspect the coverage report
grep -r "frontend/src/ui" coverage/coverage-final.json
```

**Expected**:
- ✅ UI files appear in coverage report (not excluded)
- ✅ Coverage metrics reflect UI test coverage
- ✅ UI statements/functions/lines counted toward thresholds

---

## Part 3: Contract Fulfillment Validation

### Contract 1: Vitest Configuration

**Validation Steps**:
1. File exists: `vitest.config.js`
2. Contains `coverage.all: true`
3. Contains `coverage.thresholds: { statements: 60, branches: 50, functions: 60, lines: 60 }`
4. Contains `coverage.exclude: [...]` with patterns from data-model.md
5. `npm run test:coverage` executes without errors

**Test Command**:
```bash
npm run test:coverage 2>&1 | head -20
```

**Expected Output**: Vitest runs, displays coverage metrics, exits cleanly

---

### Contract 2: GitHub Actions CI Gate

**Validation Steps**:
1. File exists: `.github/workflows/checks.yml`
2. Contains step: `Run tests with coverage` (or similar)
3. Command: `npm run test:coverage`
4. Configured to fail job if exit code != 0
5. PR shows red ✗ when coverage fails

**Test Scenario**:
1. Create PR with failing coverage
2. Observe CI step failure
3. Merge is blocked (cannot merge with failing check)

**Expected**: Merge prevented until coverage fixed

---

### Contract 3: Review-Packet Integration

**Validation Steps**:
1. Coverage artifacts generated: `coverage/coverage-final.json`, `coverage/index.html`
2. During CI, artifacts copied to: `review-artifacts/coverage/`
3. Review-packet index updated with coverage summary
4. Coverage metrics accessible in `review-artifacts/index.html`

**Test Command**:
```bash
# After CI runs:
ls -la review-artifacts/coverage/
cat review-artifacts/coverage/coverage-final.json | head -20
open review-artifacts/index.html
```

**Expected**: Coverage data persisted and indexed

---

## Part 4: Acceptance Criteria Validation

### Acceptance 1: Hard Block Enforcement

**Criteria**: Build fails and prevents merge if coverage below thresholds

**Validation**:
1. Push code with 45% statements coverage
2. PR created
3. CI workflow runs
4. Step exits with code 1
5. GitHub shows: "All checks have failed"
6. Merge button disabled (red X)

**Status**: ✅ PASS when ALL above conditions met

---

### Acceptance 2: Correct Exclusions

**Criteria**: Non-application code excluded; app code included

**Validation**:
```bash
npm run test:coverage 2>&1 | grep -E "Excluded|Include"
grep "node_modules\|dist\|\.test\|\.spec" coverage/coverage-final.json | wc -l
# Should be 0 (excluded files not in report)
```

**Status**: ✅ PASS when excluded files not in metrics

---

### Acceptance 3: UI File Inclusion

**Criteria**: UI components from `frontend/src/ui-*` included in coverage

**Validation**:
```bash
npm run test:coverage
grep "frontend/src/ui" coverage/coverage-final.json | head -3
```

**Status**: ✅ PASS when UI files appear in report

---

### Acceptance 4: Local-CI Consistency

**Criteria**: Local `npm run test:coverage` shows same thresholds as CI

**Validation**:
1. Run locally: `npm run test:coverage` → note pass/fail status
2. Push to PR
3. CI runs (can see output in GitHub Actions)
4. Compare: Local result == CI result

**Status**: ✅ PASS when results match

---

## Part 5: Troubleshooting

### Issue: Coverage below thresholds locally

**Diagnosis**:
```bash
npm run test:coverage 2>&1 | tail -20
```

**Solution**:
1. Identify uncovered lines in `coverage/index.html`
2. Write tests for those lines
3. Re-run coverage
4. Once thresholds met, commit and push

---

### Issue: PR check failing but local coverage passes

**Diagnosis**:
- Different code between local and PR branch?
- Different node versions?
- CI has cached old dependencies?

**Solution**:
```bash
# On CI branch:
git fetch origin
npm clean-install  # Fresh install
npm run test:coverage

# Compare output with local result
```

---

### Issue: Excluded files appearing in coverage

**Diagnosis**:
- Exclusion patterns not applied?
- Pattern syntax error?

**Solution**:
```bash
# Check vitest.config.js
cat vitest.config.js | grep -A 20 "coverage.exclude"

# Validate pattern syntax
npm run test:coverage 2>&1 | grep "Excluding\|Excluded"
```

---

## Part 6: Summary

| Step | Command | Expected Output |
|------|---------|-----------------|
| **Local Test** | `npm run test:coverage` | Coverage ≥ 60/50/60/60 |
| **View Report** | `open coverage/index.html` | Detailed per-file breakdown |
| **Push to PR** | Git push | CI workflow runs |
| **CI Check** | (Automatic) | ✅ or ❌ merge status |
| **Merge** | (If ✅) | PR merged to development |
| **Artifacts** | `review-artifacts/` | Coverage persisted in packet |

---

## Next Steps

1. ✅ Completed: Spec, Clarifications, Research, Data Model, Quickstart
2. ⏭️ Next: Run `/tasks` to generate implementation tasks
3. ⏭️ Then: Execute tasks to configure vitest.config.js and checks.yml
4. ⏭️ Finally: Validate in CI and document baseline coverage

---
