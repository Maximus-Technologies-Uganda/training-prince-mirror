#!/bin/bash

# Script: Copy Coverage Reports
# Purpose: Copy Next.js UI coverage from frontend/coverage/ui/ to review-artifacts/
# Failure: Exits with code 1 if copy operation fails
# Success: Exits with code 0 if coverage copied successfully

set -e  # Exit immediately on any error (fail-fast)

SOURCE_DIR="frontend/coverage/ui"
DEST_DIR="review-artifacts/ui-coverage-expense"

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

# Verify source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
  echo "❌ Source directory missing: $SOURCE_DIR"
  echo "   Expected coverage files not found"
  exit 1
fi

# Verify required files exist in source
if [ ! -f "$SOURCE_DIR/index.html" ]; then
  echo "❌ Missing index.html in $SOURCE_DIR"
  exit 1
fi

if [ ! -f "$SOURCE_DIR/coverage-final.json" ]; then
  echo "❌ Missing coverage-final.json in $SOURCE_DIR"
  exit 1
fi

# Get file sizes for verification
HTML_SIZE=$(wc -c < "$SOURCE_DIR/index.html")
JSON_SIZE=$(wc -c < "$SOURCE_DIR/coverage-final.json")

if [ "$HTML_SIZE" -lt 512 ]; then
  echo "❌ index.html too small: $HTML_SIZE bytes (minimum: 512)"
  exit 1
fi

if [ "$JSON_SIZE" -lt 100 ]; then
  echo "❌ coverage-final.json too small: $JSON_SIZE bytes (minimum: 100)"
  exit 1
fi

echo "Copying Next.js UI coverage..."

# Copy all coverage files
cp -r "$SOURCE_DIR"/* "$DEST_DIR/"

# Verify copy completed successfully
if [ ! -f "$DEST_DIR/index.html" ]; then
  echo "❌ Copy failed for $DEST_DIR/index.html"
  exit 1
fi

if [ ! -f "$DEST_DIR/coverage-final.json" ]; then
  echo "❌ Copy failed for $DEST_DIR/coverage-final.json"
  exit 1
fi

# Verify destination files are same size as source
DEST_HTML_SIZE=$(wc -c < "$DEST_DIR/index.html")
DEST_JSON_SIZE=$(wc -c < "$DEST_DIR/coverage-final.json")

if [ "$DEST_HTML_SIZE" -ne "$HTML_SIZE" ]; then
  echo "❌ index.html copy incomplete: $DEST_HTML_SIZE bytes vs $HTML_SIZE bytes"
  exit 1
fi

if [ "$DEST_JSON_SIZE" -ne "$JSON_SIZE" ]; then
  echo "❌ coverage-final.json copy incomplete: $DEST_JSON_SIZE bytes vs $JSON_SIZE bytes"
  exit 1
fi

echo "  ✅ Copied UI coverage ($HTML_SIZE HTML + $JSON_SIZE JSON bytes)"

echo ""
echo "================================"
echo "✅ Coverage reports copied successfully"
echo "   Destination: $DEST_DIR"
echo "   Suites: ${#SUITES[@]}"
echo "================================"
exit 0
