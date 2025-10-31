#!/bin/bash

# Script: Copy Coverage Reports
# Purpose: Copy all five UI coverage report directories from frontend/coverage/ to review-artifacts/
# Failure: Exits with code 1 if any copy operation fails (fail-fast behavior)
# Success: Exits with code 0 if all five suites copied successfully

set -e  # Exit immediately on any error (fail-fast)

SUITES=("ui-expense" "ui-stopwatch" "ui-temp" "ui-todo" "ui-quote")
SOURCE_DIR="frontend/coverage"
DEST_DIR="review-artifacts"

echo "📋 Starting coverage report copying..."
echo "   Source: $SOURCE_DIR"
echo "   Destination: $DEST_DIR"
echo ""

# Create destination directory if it doesn't exist
mkdir -p "$DEST_DIR"
if [ ! -d "$DEST_DIR" ]; then
  echo "❌ Failed to create destination directory: $DEST_DIR"
  exit 1
fi

# Copy each suite's coverage reports
for suite in "${SUITES[@]}"; do
  SOURCE="$SOURCE_DIR/$suite"
  DEST="$DEST_DIR/$suite"

  echo "Copying $suite..."

  # Verify source directory exists
  if [ ! -d "$SOURCE" ]; then
    echo "❌ Source directory missing: $SOURCE"
    echo "   Expected coverage files for $suite not found"
    exit 1
  fi

  # Verify required files exist in source
  if [ ! -f "$SOURCE/lcov.info" ]; then
    echo "❌ Missing lcov.info in $SOURCE"
    exit 1
  fi

  if [ ! -f "$SOURCE/index.html" ]; then
    echo "❌ Missing index.html in $SOURCE"
    exit 1
  fi

  # Get file sizes for verification
  LCOV_SIZE=$(wc -c < "$SOURCE/lcov.info")
  HTML_SIZE=$(wc -c < "$SOURCE/index.html")

  if [ "$LCOV_SIZE" -lt 1024 ]; then
    echo "❌ lcov.info too small: $LCOV_SIZE bytes (minimum: 1024)"
    exit 1
  fi

  if [ "$HTML_SIZE" -lt 512 ]; then
    echo "❌ index.html too small: $HTML_SIZE bytes (minimum: 512)"
    exit 1
  fi

  # Create destination and copy
  mkdir -p "$DEST"
  cp -r "$SOURCE"/* "$DEST/"

  # Verify copy completed successfully
  if [ ! -f "$DEST/lcov.info" ]; then
    echo "❌ Copy failed for $DEST/lcov.info"
    exit 1
  fi

  if [ ! -f "$DEST/index.html" ]; then
    echo "❌ Copy failed for $DEST/index.html"
    exit 1
  fi

  # Verify destination files are same size as source
  DEST_LCOV_SIZE=$(wc -c < "$DEST/lcov.info")
  DEST_HTML_SIZE=$(wc -c < "$DEST/index.html")

  if [ "$DEST_LCOV_SIZE" -ne "$LCOV_SIZE" ]; then
    echo "❌ lcov.info copy incomplete: $DEST_LCOV_SIZE bytes vs $LCOV_SIZE bytes"
    exit 1
  fi

  if [ "$DEST_HTML_SIZE" -ne "$HTML_SIZE" ]; then
    echo "❌ index.html copy incomplete: $DEST_HTML_SIZE bytes vs $HTML_SIZE bytes"
    exit 1
  fi

  echo "  ✅ Copied $suite ($LCOV_SIZE + $HTML_SIZE bytes)"
done

echo ""
echo "================================"
echo "✅ All coverage reports copied successfully"
echo "   Destination: $DEST_DIR"
echo "   Suites: ${#SUITES[@]}"
echo "================================"
exit 0
