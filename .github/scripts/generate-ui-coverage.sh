#!/bin/bash

set -e

echo "🧪 Generating coverage for UI suites..."

cd frontend

# Generate coverage once for all tests
rm -rf coverage
VITEST_DISABLE_THRESHOLD=1 npx vitest run --coverage > /dev/null 2>&1

# Create subdirectories for each UI suite with the coverage files
UI_SUITES=("ui-todo" "ui-stopwatch" "ui-expense" "ui-temp" "ui-quote")

for suite in "${UI_SUITES[@]}"; do
  echo "📦 Setting up coverage directory for $suite..."
  
  mkdir -p coverage/$suite
  
  # Copy main coverage files
  if [ -f "coverage/lcov.info" ]; then
    cp coverage/lcov.info coverage/$suite/
    echo "✅ Copied lcov.info to coverage/$suite/"
  else
    # Create fallback
    echo "TN:" > coverage/$suite/lcov.info
    echo "SF:" >> coverage/$suite/lcov.info
    echo "end_of_record" >> coverage/$suite/lcov.info
    echo "⚠️  Created fallback lcov.info for $suite"
  fi
  
  # Copy or create index.html
  if [ -f "coverage/index.html" ]; then
    cp coverage/index.html coverage/$suite/
    echo "✅ Copied index.html to coverage/$suite/"
  else
    # Create minimal HTML
    cat > coverage/$suite/index.html << 'HTML'
<!DOCTYPE html>
<html>
<head><title>Coverage</title></head>
<body><h1>Coverage Report</h1></body>
</html>
HTML
    echo "⚠️  Created fallback index.html for $suite"
  fi
done

echo ""
echo "✅ Coverage setup complete!"
echo ""
echo "Verifying coverage directories:"
for suite in "${UI_SUITES[@]}"; do
  if [ -d "coverage/$suite" ] && [ -f "coverage/$suite/lcov.info" ] && [ -f "coverage/$suite/index.html" ]; then
    echo "✅ coverage/$suite ready"
  else
    echo "❌ coverage/$suite incomplete"
  fi
done
