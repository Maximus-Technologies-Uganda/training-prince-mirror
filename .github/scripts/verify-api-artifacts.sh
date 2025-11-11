#!/bin/bash

# Script: Verify API Artifacts
# Purpose: Verify all required files exist before artifact upload (fail-fast validation)
# Failure: Exits with code 1 if any required file is missing
# Success: Exits with code 0 if all files verified

set -e  # Exit immediately on any error (fail-fast)

echo "🔍 Verifying API review artifacts..."
echo ""

REVIEW_ARTIFACTS_DIR="review-artifacts"
ERRORS=0

# Check if review-artifacts directory exists
if [ ! -d "$REVIEW_ARTIFACTS_DIR" ]; then
  echo "❌ review-artifacts/ directory missing"
  ERRORS=$((ERRORS + 1))
fi

# Verify index.html exists
if [ ! -f "$REVIEW_ARTIFACTS_DIR/index.html" ]; then
  echo "❌ review-artifacts/index.html missing"
  echo "   Required: Navigation structure for API review artifacts"
  ERRORS=$((ERRORS + 1))
else
  # Basic HTML validation
  if ! grep -q "<html" "$REVIEW_ARTIFACTS_DIR/index.html" 2>/dev/null; then
    echo "⚠️  review-artifacts/index.html may not be valid HTML"
  else
    echo "✅ review-artifacts/index.html exists"
  fi
fi

# Verify OpenAPI specification exists
if [ ! -f "$REVIEW_ARTIFACTS_DIR/openapi.yaml" ]; then
  echo "❌ review-artifacts/openapi.yaml missing"
  echo "   Required: API specification file"
  ERRORS=$((ERRORS + 1))
else
  # Basic YAML validation (check for OpenAPI version)
  if ! grep -q "openapi:" "$REVIEW_ARTIFACTS_DIR/openapi.yaml" 2>/dev/null; then
    echo "⚠️  review-artifacts/openapi.yaml may not be a valid OpenAPI spec"
  else
    echo "✅ review-artifacts/openapi.yaml exists"
  fi
fi

# Verify API coverage directory exists
if [ ! -d "$REVIEW_ARTIFACTS_DIR/api-coverage" ]; then
  echo "❌ review-artifacts/api-coverage/ directory missing"
  echo "   Required: API test coverage reports"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ review-artifacts/api-coverage/ directory exists"
  
  # Verify lcov.info exists
  if [ ! -f "$REVIEW_ARTIFACTS_DIR/api-coverage/lcov.info" ]; then
    echo "❌ review-artifacts/api-coverage/lcov.info missing"
    echo "   Required: LCOV format coverage data"
    ERRORS=$((ERRORS + 1))
  else
    # Validate LCOV format (check for TN: marker)
    if ! grep -q "^TN:" "$REVIEW_ARTIFACTS_DIR/api-coverage/lcov.info" 2>/dev/null; then
      echo "⚠️  review-artifacts/api-coverage/lcov.info may not be valid LCOV format"
    else
      echo "✅ review-artifacts/api-coverage/lcov.info exists"
    fi
  fi
  
  # Verify HTML coverage exists
  if [ ! -f "$REVIEW_ARTIFACTS_DIR/api-coverage/index.html" ]; then
    echo "❌ review-artifacts/api-coverage/index.html missing"
    echo "   Required: HTML coverage report"
    ERRORS=$((ERRORS + 1))
  else
    # Basic HTML validation
    if ! grep -q "<html" "$REVIEW_ARTIFACTS_DIR/api-coverage/index.html" 2>/dev/null; then
      echo "⚠️  review-artifacts/api-coverage/index.html may not be valid HTML"
    else
      echo "✅ review-artifacts/api-coverage/index.html exists"
    fi
  fi
fi

# Summary
echo ""
if [ $ERRORS -eq 0 ]; then
  echo "✅ All API artifacts verified successfully"
  exit 0
else
  echo "❌ Verification failed: $ERRORS error(s) found"
  echo "   Artifact upload will be skipped (fail-fast)"
  exit 1
fi
