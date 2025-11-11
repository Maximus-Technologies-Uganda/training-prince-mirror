#!/bin/bash

# Script: Copy API Coverage Reports
# Purpose: Copy API coverage reports from api/coverage/ to review-artifacts/api-coverage/
# Failure: Exits with code 1 if any copy operation fails (fail-fast behavior)
# Success: Exits with code 0 if coverage copied successfully

set -e  # Exit immediately on any error (fail-fast)

SOURCE_DIR="api/coverage"
DEST_DIR="review-artifacts/api-coverage"

echo "📋 Starting API coverage report copying..."
echo "   Source: $SOURCE_DIR"
echo "   Destination: $DEST_DIR"
echo ""

# Verify source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
  echo "❌ Source directory missing: $SOURCE_DIR"
  echo "   Coverage reports not generated. Run 'cd api && npm test -- --coverage' first."
  exit 1
fi

# Verify required files exist in source
if [ ! -f "$SOURCE_DIR/lcov.info" ]; then
  echo "❌ Missing lcov.info in $SOURCE_DIR"
  echo "   Expected coverage file not found"
  exit 1
fi

if [ ! -f "$SOURCE_DIR/index.html" ]; then
  echo "❌ Missing index.html in $SOURCE_DIR"
  echo "   Expected HTML coverage report not found"
  exit 1
fi

# Create destination directory
mkdir -p "$DEST_DIR"
if [ ! -d "$DEST_DIR" ]; then
  echo "❌ Failed to create destination directory: $DEST_DIR"
  exit 1
fi

# Copy coverage files
echo "Copying API coverage reports..."
cp -r "$SOURCE_DIR"/* "$DEST_DIR/"

# Verify destination files
if [ ! -f "$DEST_DIR/lcov.info" ]; then
  echo "❌ Copy failed: lcov.info not found in destination"
  exit 1
fi

if [ ! -f "$DEST_DIR/index.html" ]; then
  echo "❌ Copy failed: index.html not found in destination"
  exit 1
fi

# Verify file sizes (basic sanity check)
LCOV_SIZE=$(stat -f%z "$DEST_DIR/lcov.info" 2>/dev/null || stat -c%s "$DEST_DIR/lcov.info" 2>/dev/null || echo "0")
HTML_SIZE=$(stat -f%z "$DEST_DIR/index.html" 2>/dev/null || stat -c%s "$DEST_DIR/index.html" 2>/dev/null || echo "0")

if [ "$LCOV_SIZE" -lt 100 ]; then
  echo "❌ lcov.info file too small ($LCOV_SIZE bytes). Coverage may be incomplete."
  exit 1
fi

if [ "$HTML_SIZE" -lt 500 ]; then
  echo "❌ index.html file too small ($HTML_SIZE bytes). Coverage may be incomplete."
  exit 1
fi

echo "✅ API coverage reports copied successfully"
echo "   lcov.info: $LCOV_SIZE bytes"
echo "   index.html: $HTML_SIZE bytes"
