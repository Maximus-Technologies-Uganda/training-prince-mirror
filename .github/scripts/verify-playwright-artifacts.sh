#!/bin/bash

# Playwright Artifacts Verification Script
# Verifies that all expected artifact directories and files exist

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "🔍 Verifying Playwright artifacts..."

# Track verification status
VERIFICATION_PASSED=true

# Check playwright-report directory
if [ -d "$PROJECT_ROOT/playwright-report" ]; then
  echo "✅ playwright-report/ directory exists"
  
  # Check for index.html
  if [ -f "$PROJECT_ROOT/playwright-report/index.html" ]; then
    echo "✅ playwright-report/index.html exists"
    
    # Verify HTML is valid (basic check)
    if grep -q "<html" "$PROJECT_ROOT/playwright-report/index.html"; then
      echo "✅ playwright-report/index.html is valid HTML"
    else
      echo "❌ playwright-report/index.html does not appear to be valid HTML"
      VERIFICATION_PASSED=false
    fi
  else
    echo "⚠️  playwright-report/index.html not found (expected after tests)"
  fi
else
  echo "⚠️  playwright-report/ directory not found (expected after tests)"
fi

# Check test-results directory (contains screenshots/traces on failure)
if [ -d "$PROJECT_ROOT/test-results" ]; then
  echo "✅ test-results/ directory exists"
  
  # Count screenshot files
  SCREENSHOT_COUNT=$(find "$PROJECT_ROOT/test-results" -name "*.png" 2>/dev/null | wc -l)
  if [ "$SCREENSHOT_COUNT" -gt 0 ]; then
    echo "✅ Found $SCREENSHOT_COUNT screenshot(s) in test-results/"
  else
    echo "ℹ️  No screenshots found in test-results/ (expected if all tests passed)"
  fi
  
  # Count trace files
  TRACE_COUNT=$(find "$PROJECT_ROOT/test-results" -name "*.zip" 2>/dev/null | wc -l)
  if [ "$TRACE_COUNT" -gt 0 ]; then
    echo "✅ Found $TRACE_COUNT trace file(s) in test-results/"
  else
    echo "ℹ️  No traces found in test-results/ (expected if all tests passed)"
  fi
else
  echo "ℹ️  test-results/ directory not found (expected if all tests passed)"
fi

# Final status
echo ""
if [ "$VERIFICATION_PASSED" = true ]; then
  echo "✅ Artifact verification PASSED"
  exit 0
else
  echo "❌ Artifact verification FAILED"
  exit 1
fi
