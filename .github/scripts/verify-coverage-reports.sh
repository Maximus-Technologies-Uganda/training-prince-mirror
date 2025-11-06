#!/bin/bash

# Script: Verify Coverage Reports
# Purpose: Verify all five UI coverage reports exist with valid files before artifact upload
# Failure: Exits with code 1 if verification fails (fail-fast)
# Success: Exits with code 0 if all five suites verified

set -e  # Exit immediately on any error (fail-fast)

ARTIFACT_DIR="review-artifacts"
SUITES=("ui-expense" "ui-stopwatch" "ui-temp" "ui-todo" "ui-quote")
MIN_LCOV_SIZE=1024        # Must be >1KB
MIN_HTML_SIZE=512         # Must be >512 bytes
PASSED=0
FAILED=0
FAILED_SUITES=()

echo "🔍 Verifying coverage reports in $ARTIFACT_DIR/"
echo ""

# Check if artifact directory exists
if [ ! -d "$ARTIFACT_DIR" ]; then
  echo "❌ Artifact directory not found: $ARTIFACT_DIR"
  exit 1
fi

# Verify each suite
for suite in "${SUITES[@]}"; do
  SUITE_DIR="$ARTIFACT_DIR/$suite"
  LCOV_FILE="$SUITE_DIR/lcov.info"
  HTML_FILE="$SUITE_DIR/index.html"

  echo "Checking $suite..."

  # Check directory exists
  if [ ! -d "$SUITE_DIR" ]; then
    echo "  ❌ Directory missing: $SUITE_DIR"
    FAILED=$((FAILED + 1))
    FAILED_SUITES+=("$suite: missing directory")
    continue
  fi

  # Check lcov.info exists
  if [ ! -f "$LCOV_FILE" ]; then
    echo "  ❌ Missing: lcov.info"
    FAILED=$((FAILED + 1))
    FAILED_SUITES+=("$suite: missing lcov.info")
    continue
  fi

  # Check lcov.info size
  LCOV_SIZE=$(wc -c < "$LCOV_FILE")
  if [ "$LCOV_SIZE" -lt "$MIN_LCOV_SIZE" ]; then
    echo "  ❌ lcov.info too small: $LCOV_SIZE bytes (minimum: $MIN_LCOV_SIZE)"
    FAILED=$((FAILED + 1))
    FAILED_SUITES+=("$suite: lcov.info too small ($LCOV_SIZE bytes)")
    continue
  fi

  # Check index.html exists
  if [ ! -f "$HTML_FILE" ]; then
    echo "  ❌ Missing: index.html"
    FAILED=$((FAILED + 1))
    FAILED_SUITES+=("$suite: missing index.html")
    continue
  fi

  # Check html size
  HTML_SIZE=$(wc -c < "$HTML_FILE")
  if [ "$HTML_SIZE" -lt "$MIN_HTML_SIZE" ]; then
    echo "  ❌ index.html too small: $HTML_SIZE bytes (minimum: $MIN_HTML_SIZE)"
    FAILED=$((FAILED + 1))
    FAILED_SUITES+=("$suite: index.html too small ($HTML_SIZE bytes)")
    continue
  fi

  # Basic lcov validation - check for LCOV format markers
  if ! grep -q "^TN:" "$LCOV_FILE"; then
    echo "  ⚠️  lcov.info may be invalid (no TN: lines found)"
  fi

  if ! grep -q "^end_of_record" "$LCOV_FILE"; then
    echo "  ⚠️  lcov.info may be invalid (missing end_of_record)"
  fi

  # Basic HTML validation - check for HTML tags
  if ! grep -qi "<html" "$HTML_FILE"; then
    echo "  ⚠️  index.html may be invalid (no HTML tag found)"
  fi

  echo "  ✅ $suite verified ($LCOV_SIZE + $HTML_SIZE bytes)"
  PASSED=$((PASSED + 1))
done

# Print summary
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
  for failure in "${FAILED_SUITES[@]}"; do
    echo "  - $failure"
  done
  echo ""
  echo "❌ Verification FAILED - Artifact will NOT be uploaded"
  echo "Build Status: FAILED - Coverage verification incomplete"
  exit 1
fi

echo ""
echo "✅ All coverage reports verified successfully"
echo "✅ Ready for artifact upload"
exit 0
