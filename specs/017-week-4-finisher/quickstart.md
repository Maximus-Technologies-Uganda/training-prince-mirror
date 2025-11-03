# Quickstart: Week 4 Finisher - Review-Packet Coverage Workflow

**Feature**: Fix review-packet packaging for CI workflow  
**Date**: October 31, 2025

---

## Overview

This quickstart validates that the review-packet feature works end-to-end: all five UI test suites generate coverage reports, they are copied to review-artifacts/, verified to exist, and packaged into a GitHub Actions Artifact.

---

## Prerequisites

- Node.js 18+ installed
- Repository cloned locally
- `npm install` completed
- GitHub Actions workflow file exists: `.github/workflows/test.yml`
- Vitest configured: `vitest.config.js`

---

## Validation Steps

### Step 1: Verify Vitest Configuration

**Goal**: Ensure all five UI test suites have coverage enabled

```bash
# Check vitest.config.js for coverage configuration
cat vitest.config.js

# Look for:
# - coverage.enabled = true
# - coverage.reporters includes "lcov" and "html"
# - All five test files listed or covered by pattern matching
```

**Expected Output**:
```
✅ Coverage is enabled
✅ Reporters: ["lcov", "html", ...]
✅ Test files:
  - frontend/tests/ui-expense.test.js
  - frontend/tests/ui-stopwatch.test.js
  - frontend/tests/ui-temp.test.js
  - frontend/tests/ui-todo.test.js
  - frontend/tests/ui-quote.test.js
```

---

### Step 2: Run Local Coverage Generation

**Goal**: Generate coverage reports locally for all five suites

```bash
# Run the test suite with coverage
npm run test:ui:coverage

# Or if using vitest directly:
npm run vitest -- --coverage
```

**Expected Output**:
```
✓ ui-expense tests pass
✓ ui-stopwatch tests pass
✓ ui-temp tests pass
✓ ui-todo tests pass
✓ ui-quote tests pass

Coverage written to:
  coverage/ui-expense/
  coverage/ui-stopwatch/
  coverage/ui-temp/
  coverage/ui-todo/
  coverage/ui-quote/
```

---

### Step 3: Verify Coverage Files

**Goal**: Confirm all coverage files were generated

```bash
# Check coverage directory structure
ls -la coverage/
for suite in ui-expense ui-stopwatch ui-temp ui-todo ui-quote; do
  echo "=== $suite ==="
  ls -lh coverage/$suite/lcov.info coverage/$suite/index.html
done

# Verify file sizes are reasonable
find coverage/ -name "lcov.info" -exec wc -c {} \;
find coverage/ -name "index.html" -exec wc -c {} \;
```

**Expected Output**:
```
coverage/ui-expense/lcov.info     45230 bytes
coverage/ui-expense/index.html     8923 bytes
coverage/ui-stopwatch/lcov.info   52100 bytes
coverage/ui-stopwatch/index.html  10200 bytes
coverage/ui-temp/lcov.info        38900 bytes
coverage/ui-temp/index.html        7600 bytes
coverage/ui-todo/lcov.info        61200 bytes
coverage/ui-todo/index.html       12300 bytes
coverage/ui-quote/lcov.info       35600 bytes
coverage/ui-quote/index.html       6800 bytes

✅ All 10 files present
✅ All files > 512 bytes
```

---

### Step 4: Run Copy Script

**Goal**: Copy coverage reports to review-artifacts/

```bash
# Run the copy script
bash .github/scripts/copy-coverage-reports.sh

# Or manually copy
mkdir -p review-artifacts
for suite in ui-expense ui-stopwatch ui-temp ui-todo ui-quote; do
  cp -r coverage/$suite review-artifacts/
done
```

**Expected Output**:
```
✅ Copied ui-expense coverage to review-artifacts/ui-expense
✅ Copied ui-stopwatch coverage to review-artifacts/ui-stopwatch
✅ Copied ui-temp coverage to review-artifacts/ui-temp
✅ Copied ui-todo coverage to review-artifacts/ui-todo
✅ Copied ui-quote coverage to review-artifacts/ui-quote
✅ All coverage reports copied successfully
```

---

### Step 5: Run Verification Script

**Goal**: Verify all five coverage report sets exist and are complete

```bash
# Run the verification script
bash .github/scripts/verify-coverage-reports.sh

# Or verify manually
for suite in ui-expense ui-stopwatch ui-temp ui-todo ui-quote; do
  if [ -f "review-artifacts/$suite/lcov.info" ] && [ -f "review-artifacts/$suite/index.html" ]; then
    echo "✅ $suite verified"
  else
    echo "❌ $suite missing files"
  fi
done
```

**Expected Output**:
```
🔍 Verifying coverage reports in review-artifacts/

Checking ui-expense...
  ✅ ui-expense verified

Checking ui-stopwatch...
  ✅ ui-stopwatch verified

Checking ui-temp...
  ✅ ui-temp verified

Checking ui-todo...
  ✅ ui-todo verified

Checking ui-quote...
  ✅ ui-quote verified

================================
Verification Summary
================================
Total Suites: 5
Verified: 5
Failed: 0

✅ All coverage reports verified successfully
✅ Ready for artifact upload
```

---

### Step 6: Verify Review Index

**Goal**: Ensure index.html references all five coverage reports

```bash
# Check if index.html exists
ls -la review-artifacts/index.html

# View the file
cat review-artifacts/index.html | grep -E "(ui-expense|ui-stopwatch|ui-temp|ui-todo|ui-quote)"

# Verify all links are correct
grep "href=" review-artifacts/index.html
```

**Expected Output**:
```
✅ review-artifacts/index.html exists

Links found:
  <a href="./ui-expense/index.html">ui-expense coverage</a>
  <a href="./ui-expense/lcov.info">ui-expense lcov.info</a>
  <a href="./ui-stopwatch/index.html">ui-stopwatch coverage</a>
  <a href="./ui-stopwatch/lcov.info">ui-stopwatch lcov.info</a>
  <a href="./ui-temp/index.html">ui-temp coverage</a>
  <a href="./ui-temp/lcov.info">ui-temp lcov.info</a>
  <a href="./ui-todo/index.html">ui-todo coverage</a>
  <a href="./ui-todo/lcov.info">ui-todo lcov.info</a>
  <a href="./ui-quote/index.html">ui-quote coverage</a>
  <a href="./ui-quote/lcov.info">ui-quote lcov.info</a>

✅ All 10 links reference valid files
```

---

### Step 7: Test Artifact Structure

**Goal**: Verify the final artifact is ready for upload

```bash
# List the entire review-artifacts structure
tree review-artifacts/ -L 2

# Count files
find review-artifacts -type f | wc -l

# Check total size
du -sh review-artifacts/
```

**Expected Output**:
```
review-artifacts/
├── index.html
├── ui-expense/
│   ├── lcov.info
│   ├── index.html
│   └── [source files...]
├── ui-stopwatch/
│   ├── lcov.info
│   ├── index.html
│   └── [source files...]
├── ui-temp/
│   ├── lcov.info
│   ├── index.html
│   └── [source files...]
├── ui-todo/
│   ├── lcov.info
│   ├── index.html
│   └── [source files...]
└── ui-quote/
    ├── lcov.info
    ├── index.html
    └── [source files...]

Total files: 50+ (5 lcov.info + 5 index.html + source annotations)
Total size: ~400 KB (example)

✅ Artifact is ready for packaging
```

---

### Step 8: Simulate CI Workflow Execution

**Goal**: Run the complete workflow as it would execute in CI

```bash
# Simulate the CI steps in sequence
echo "Step 1: Generate Coverage"
npm run test:ui:coverage
if [ $? -ne 0 ]; then echo "❌ Coverage generation failed"; exit 1; fi

echo ""
echo "Step 2: Copy Coverage"
bash .github/scripts/copy-coverage-reports.sh
if [ $? -ne 0 ]; then echo "❌ Copying failed"; exit 1; fi

echo ""
echo "Step 3: Verify Coverage"
bash .github/scripts/verify-coverage-reports.sh
if [ $? -ne 0 ]; then echo "❌ Verification failed"; exit 1; fi

echo ""
echo "✅ All steps completed successfully"
echo "✅ Ready for GitHub Actions artifact upload"
```

**Expected Output**:
```
Step 1: Generate Coverage
✓ All tests pass
✓ Coverage generated

Step 2: Copy Coverage
✅ All coverage reports copied successfully

Step 3: Verify Coverage
✅ All coverage reports verified successfully
✅ Ready for artifact upload

✅ All steps completed successfully
✅ Ready for GitHub Actions artifact upload
```

---

### Step 9: Verify CI Workflow Configuration

**Goal**: Ensure the CI workflow is properly configured

```bash
# Check the workflow file
cat .github/workflows/test.yml | grep -A 10 "coverage\|artifact"

# Look for:
# 1. Coverage generation step
# 2. Copy script step
# 3. Verification step
# 4. Upload artifact step with conditions
```

**Expected Output**:
```
- name: Generate Coverage
  run: npm run test:ui:coverage

- name: Copy Coverage to Review Artifacts
  run: bash .github/scripts/copy-coverage-reports.sh

- name: Verify Coverage Reports
  run: bash .github/scripts/verify-coverage-reports.sh

- name: Upload Review-Packet Artifact
  if: success()
  uses: actions/upload-artifact@v4
  with:
    name: review-packet
    path: review-artifacts/
    retention-days: 90
```

---

## Testing Failure Scenarios

### Scenario 1: Missing Coverage File

**Test**: Remove one coverage file and run verification

```bash
rm coverage/ui-quote/lcov.info

bash .github/scripts/verify-coverage-reports.sh
# Expected: ❌ Verification FAILED - exit code 1
```

---

### Scenario 2: Test Suite Fails

**Test**: Mock a test failure

```bash
# Modify a test to fail, then run coverage
npm run test:ui:coverage
# Expected: ❌ Coverage generation failed - exit code 1

# Restore the test
git checkout frontend/tests/ui-quote.test.js
```

---

### Scenario 3: Broken Index Links

**Test**: Check index.html for broken links

```bash
# Remove a coverage directory
rm -rf review-artifacts/ui-quote

# Try to verify
bash .github/scripts/verify-coverage-reports.sh
# Expected: ❌ Verification FAILED - exit code 1
```

---

## Success Criteria

✅ **Feature is complete WHEN**:
1. All five UI test suites execute without errors
2. Coverage is generated for all five suites (lcov.info + HTML)
3. All coverage files are copied to review-artifacts/
4. Verification script confirms all files exist and are valid
5. review-artifacts/index.html contains valid links to all five suites
6. CI workflow fails immediately if any step fails (fail-fast)
7. GitHub Actions artifact is created and accessible

---

## Troubleshooting

| Issue | Diagnosis | Solution |
|-------|-----------|----------|
| Missing lcov.info | Test suite didn't run | Check npm run test:ui:coverage output |
| Coverage too low | Tests don't cover UI | Add more test coverage to suites |
| Copy fails | Source files missing | Ensure coverage generation completed |
| Verification fails | Files missing/corrupt | Re-run coverage generation and copy |
| Artifact upload fails | Verification didn't pass | Check verification script output |
| Broken index links | File was deleted | Ensure all five suite directories exist |

---

## Next Steps

After successful validation:
1. Commit the plan.md, research.md, data-model.md, contracts/, and quickstart.md files
2. Run `/tasks` command to generate tasks.md with implementation steps
3. Execute tasks in order to implement the CI workflow changes
4. Run final validation against a real GitHub Actions workflow

---

*Based on User Scenarios & Testing from feature specification*  
*Aligns with Acceptance Scenarios 1-4 from spec*
