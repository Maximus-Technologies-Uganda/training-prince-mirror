#!/bin/bash

# Review-Packet Index Update Script
# Appends Playwright test results to review-artifacts/index.html

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
REVIEW_PACKET_DIR="$PROJECT_ROOT/review-artifacts"
INDEX_FILE="$REVIEW_PACKET_DIR/index.html"

echo "📝 Updating review-packet index with Playwright results..."

# Create review-artifacts directory if it doesn't exist
mkdir -p "$REVIEW_PACKET_DIR"

# Get current timestamp
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Build the Playwright section
PLAYWRIGHT_SECTION="
<!-- Playwright E2E Smoke Tests Section -->
<section class=\"playwright-results\" style=\"margin-top: 2rem; padding: 1rem; border: 1px solid #ddd; border-radius: 4px;\">
  <h2>Playwright E2E Smoke Tests</h2>
  <p><strong>Executed:</strong> $TIMESTAMP</p>
"

# Add Playwright report link if it exists
if [ -f "$PROJECT_ROOT/playwright-report/index.html" ]; then
  echo "✅ Adding Playwright report link"
  PLAYWRIGHT_SECTION+="
  <p>
    <a href=\"../playwright-report/index.html\" target=\"_blank\" rel=\"noopener noreferrer\">
      📊 View Full Test Report
    </a>
  </p>
"
fi

# Add failure screenshots if they exist
if [ -d "$PROJECT_ROOT/test-results" ]; then
  SCREENSHOT_COUNT=$(find "$PROJECT_ROOT/test-results" -name "*.png" 2>/dev/null | wc -l)
  if [ "$SCREENSHOT_COUNT" -gt 0 ]; then
    echo "✅ Adding failure screenshots link"
    PLAYWRIGHT_SECTION+="
  <p>
    <a href=\"../test-results/\" target=\"_blank\" rel=\"noopener noreferrer\">
      📸 View Failure Screenshots ($SCREENSHOT_COUNT found)
    </a>
  </p>
"
  fi
fi

# Close the section
PLAYWRIGHT_SECTION+="
</section>
"

# Update or create the index.html file
if [ -f "$INDEX_FILE" ]; then
  echo "📄 Updating existing review-artifacts/index.html"
  
  # Append the Playwright section before closing body tag
  if grep -q "</body>" "$INDEX_FILE"; then
    sed -i.bak "s|</body>|$PLAYWRIGHT_SECTION</body>|" "$INDEX_FILE"
    rm -f "$INDEX_FILE.bak"
  else
    # Fallback: append to end of file
    echo "$PLAYWRIGHT_SECTION" >> "$INDEX_FILE"
  fi
else
  echo "📄 Creating new review-artifacts/index.html"
  
  # Create a basic HTML structure
  cat > "$INDEX_FILE" << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Review Artifacts</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 2rem; max-width: 1200px; margin: auto; }
    h1 { color: #333; }
    a { color: #0066cc; text-decoration: none; }
    a:hover { text-decoration: underline; }
    section { margin-bottom: 2rem; }
  </style>
</head>
<body>
  <h1>Review Artifacts</h1>
EOF
  
  echo "$PLAYWRIGHT_SECTION" >> "$INDEX_FILE"
  
  cat >> "$INDEX_FILE" << 'EOF'
</body>
</html>
EOF
fi

# Validate HTML
if grep -q "<html" "$INDEX_FILE"; then
  echo "✅ review-artifacts/index.html updated successfully"
else
  echo "❌ HTML validation failed"
  exit 1
fi

echo "📦 Review-packet integration complete"
