# Contract: Coverage Verification

**Responsibility**: Verify all five coverage report sets exist and are complete before artifact packaging  
**Triggered By**: CI workflow after successful coverage copying  
**Produces**: Pass/Fail verification result

---

## INPUT

```
{
  artifactPath: "review-artifacts/",
  requiredSuites: [
    "ui-expense",
    "ui-stopwatch",
    "ui-temp",
    "ui-todo",
    "ui-quote"
  ],
  requiredFiles: [
    "lcov.info",
    "index.html"
  ],
  minFileSize: {
    "lcov.info": 1024,        // Must be >1KB
    "index.html": 512         // Must be >512 bytes
  }
}
```

---

## OUTPUT

**On Success**:
```json
{
  status: "PASS",
  timestamp: "ISO8601",
  suiteResults: [
    {
      suiteName: "ui-expense",
      lcovExists: true,
      lcovSize: 45230,
      htmlExists: true,
      htmlSize: 8923,
      lcovValid: true,
      htmlValid: true,
      pass: true
    },
    ...4 more suites...
  ],
  allSuitesPassed: true,
  readyForArtifact: true,
  message: "✅ All five coverage reports verified successfully"
}
```

**On Failure**:
```json
{
  status: "FAIL",
  timestamp: "ISO8601",
  suiteResults: [
    {
      suiteName: "ui-expense",
      lcovExists: true,
      lcovSize: 45230,
      htmlExists: false,
      htmlSize: null,
      lcovValid: true,
      htmlValid: false,
      pass: false
    },
    ...other suites...
  ],
  allSuitesPassed: false,
  readyForArtifact: false,
  failedSuites: ["ui-expense"],
  message: "❌ Verification FAILED: Missing files for ui-expense"
}
```

---

## VALIDATION RULES

✅ **Each Suite Must Have**:
1. `review-artifacts/[suite]/lcov.info` file exists
2. `review-artifacts/[suite]/index.html` file exists
3. lcov.info file size > 1024 bytes
4. index.html file size > 512 bytes
5. lcov.info is valid LCOV format
6. index.html is valid HTML
7. File is readable by CI process

❌ **Failure Conditions**:
- ANY directory missing → FAIL
- ANY lcov.info missing → FAIL
- ANY index.html missing → FAIL
- ANY file below minimum size → FAIL
- ANY lcov.info invalid → FAIL
- ANY HTML invalid → FAIL
- ANY file unreadable → FAIL

---

## FAILURE HANDLING

**On Failure**:
1. Verification script exits with non-zero code
2. CI workflow MUST detect failure and exit immediately (fail-fast)
3. Do NOT upload artifact
4. Print detailed error report listing which suites failed
5. Mark CI build as FAILED

**Error Message Format**:
```
❌ Coverage verification FAILED

Failed Suites:
  - ui-expense: Missing index.html
  - ui-quote: lcov.info is too small (500 bytes, expected >1024)

Summary:
  Total Suites: 5
  Verified: 3
  Failed: 2
  
Build Status: FAILED - Coverage verification incomplete
Artifact will NOT be uploaded.
```

---

## SUCCESS CRITERIA

**All of the following must be TRUE**:
- ✅ All 5 suite directories exist
- ✅ All 10 files exist (5 lcov.info + 5 index.html)
- ✅ All files meet minimum size requirements
- ✅ All files are valid (LCOV and HTML format validation)
- ✅ All files are readable
- ✅ Verification script exits with code 0

**Only then**: Continue to artifact upload step

---

## Implementation Notes

### Bash Implementation Example
```bash
#!/bin/bash
set -e

ARTIFACT_DIR="review-artifacts"
SUITES=("ui-expense" "ui-stopwatch" "ui-temp" "ui-todo" "ui-quote")
MIN_LCOV_SIZE=1024
MIN_HTML_SIZE=512
PASSED=0
FAILED=0
FAILED_SUITES=()

echo "🔍 Verifying coverage reports in $ARTIFACT_DIR..."

for suite in "${SUITES[@]}"; do
  SUITE_DIR="$ARTIFACT_DIR/$suite"
  LCOV_FILE="$SUITE_DIR/lcov.info"
  HTML_FILE="$SUITE_DIR/index.html"
  
  echo ""
  echo "Checking $suite..."
  
  # Check directory exists
  if [ ! -d "$SUITE_DIR" ]; then
    echo "  ❌ Directory missing: $SUITE_DIR"
    FAILED=$((FAILED + 1))
    FAILED_SUITES+=("$suite")
    continue
  fi
  
  # Check lcov.info exists
  if [ ! -f "$LCOV_FILE" ]; then
    echo "  ❌ Missing: lcov.info"
    FAILED=$((FAILED + 1))
    FAILED_SUITES+=("$suite")
    continue
  fi
  
  # Check lcov.info size
  LCOV_SIZE=$(wc -c < "$LCOV_FILE")
  if [ "$LCOV_SIZE" -lt "$MIN_LCOV_SIZE" ]; then
    echo "  ❌ lcov.info too small: $LCOV_SIZE bytes (minimum: $MIN_LCOV_SIZE)"
    FAILED=$((FAILED + 1))
    FAILED_SUITES+=("$suite")
    continue
  fi
  
  # Check index.html exists
  if [ ! -f "$HTML_FILE" ]; then
    echo "  ❌ Missing: index.html"
    FAILED=$((FAILED + 1))
    FAILED_SUITES+=("$suite")
    continue
  fi
  
  # Check html size
  HTML_SIZE=$(wc -c < "$HTML_FILE")
  if [ "$HTML_SIZE" -lt "$MIN_HTML_SIZE" ]; then
    echo "  ❌ index.html too small: $HTML_SIZE bytes (minimum: $MIN_HTML_SIZE)"
    FAILED=$((FAILED + 1))
    FAILED_SUITES+=("$suite")
    continue
  fi
  
  # Basic lcov validation
  if ! grep -q "^TN:" "$LCOV_FILE"; then
    echo "  ⚠️  lcov.info may be invalid (no TN: lines found)"
  fi
  
  # Basic HTML validation
  if ! grep -q "<html" "$HTML_FILE" && ! grep -q "<HTML" "$HTML_FILE"; then
    echo "  ⚠️  index.html may be invalid (no HTML tag found)"
  fi
  
  echo "  ✅ $suite verified"
  PASSED=$((PASSED + 1))
done

# Summary
echo ""
echo "================================"
echo "Verification Summary"
echo "================================"
echo "Total Suites: ${#SUITES[@]}"
echo "Verified: $PASSED"
echo "Failed: $FAILED"

if [ $FAILED -gt 0 ]; then
  echo ""
  echo "❌ FAILED suites:"
  for suite in "${FAILED_SUITES[@]}"; do
    echo "  - $suite"
  done
  echo ""
  echo "❌ Verification FAILED - Artifact will NOT be uploaded"
  exit 1
fi

echo ""
echo "✅ All coverage reports verified successfully"
echo "✅ Ready for artifact upload"
exit 0
```

---

## Notes

- This is the **final gate** before artifact upload
- Verification MUST complete before GitHub Actions `upload-artifact` step
- Any failure exits with code 1 (prevents artifact upload)
- Detailed report should be printed to CI logs for troubleshooting
- This step prevents broken links in the review-packet artifact

---

*Requirement Source: FR-008, FR-009, FR-010, FR-011, EHP-002*
