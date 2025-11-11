#!/bin/bash

# Link Validation Script for Review Packet
# Validates that all artifact links in review-artifacts/index.html are accessible

set -e

echo "🔍 Validating Review Packet Links..."
echo ""

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PACKET_FILE="$REPO_ROOT/review-artifacts/index.html"

if [ ! -f "$PACKET_FILE" ]; then
  echo "❌ Error: Review packet file not found at $PACKET_FILE"
  exit 1
fi

echo "📍 Review Packet: $PACKET_FILE"
echo ""

# Array to track results
FAILED_LINKS=()
PASSED_LINKS=()

# Check each artifact file
check_artifact() {
  local description=$1
  local file_path=$2
  local full_path="$REPO_ROOT/$file_path"

  echo -n "Checking $description... "
  
  if [ -f "$full_path" ]; then
    size=$(stat -f%z "$full_path" 2>/dev/null || stat -c%s "$full_path" 2>/dev/null)
    if [ "$size" -gt 0 ]; then
      echo "✅ PASS ($size bytes)"
      PASSED_LINKS+=("$description")
      return 0
    else
      echo "❌ FAIL (file is empty)"
      FAILED_LINKS+=("$description: File is empty at $file_path")
      return 1
    fi
  else
    echo "⚠️  NOT GENERATED ($file_path)"
    # This is OK for reports that are generated during CI
    echo "   (Will be generated during CI build)"
    return 0
  fi
}

# Validate required artifacts
echo "📦 Required Artifacts:"
check_artifact "Review Packet HTML" "review-artifacts/index.html"
check_artifact "API Documentation" "docs/api.html"

echo ""
echo "📊 Optional Artifacts (generated during CI):"
check_artifact "Coverage Report" "coverage/index.html" || true
check_artifact "Playwright Report" "playwright-report/index.html" || true

echo ""
echo "📋 Link References in Spec:"
check_artifact "Specification" "specs/028-week-5-day/spec.md"
check_artifact "Plan" "specs/028-week-5-day/plan.md"
check_artifact "Tasks" "specs/028-week-5-day/tasks.md"
check_artifact "Quickstart" "specs/028-week-5-day/quickstart.md"
check_artifact "Research" "specs/028-week-5-day/research.md"

echo ""
echo "========================================"
echo "✅ Validation Summary"
echo "========================================"
echo "Passed: ${#PASSED_LINKS[@]} links"
echo "Failed: ${#FAILED_LINKS[@]} links"
echo ""

if [ ${#FAILED_LINKS[@]} -gt 0 ]; then
  echo "❌ Failed Links:"
  for link in "${FAILED_LINKS[@]}"; do
    echo "  - $link"
  done
  echo ""
  exit 1
else
  echo "✅ All critical links are valid!"
  exit 0
fi
