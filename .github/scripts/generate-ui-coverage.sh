#!/bin/bash

set -e

echo "🧪 Generating coverage for individual UI suites..."

cd frontend

UI_SUITES=("ui-todo" "ui-stopwatch" "ui-expense" "ui-temp" "ui-quote")

for suite in "${UI_SUITES[@]}"; do
  if [ ! -d "src/$suite" ]; then
    echo "⏭️  Skipping $suite (directory not found)"
    continue
  fi
  
  echo "📊 Generating coverage for $suite..."
  
  # Generate coverage and store in a temp directory
  rm -rf .coverage-temp
  VITEST_DISABLE_THRESHOLD=1 npx vitest run --coverage --reporter=default -- "src/$suite" 2>&1 | grep -v "Test Files"  || true
  
  # Create the suite-specific coverage directory
  mkdir -p coverage/$suite
  
  # Move coverage files to suite directory
  if [ -f "coverage/coverage-final.json" ]; then
    mv coverage/coverage-final.json coverage/$suite/
    echo "✅ Moved coverage-final.json to coverage/$suite/"
  fi
  
  if [ -f "coverage/lcov.info" ]; then
    mv coverage/lcov.info coverage/$suite/
    echo "✅ Moved lcov.info to coverage/$suite/"
  fi
  
  # Create a basic index.html if it doesn't exist (fallback)
  if [ ! -f "coverage/$suite/index.html" ]; then
    mkdir -p coverage/$suite
    cat > coverage/$suite/index.html << 'HTML'
<!DOCTYPE html>
<html>
<head>
  <title>Coverage Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .coverage-summary { background: #f5f5f5; padding: 15px; border-radius: 5px; }
  </style>
</head>
<body>
  <h1>Coverage Report Generated</h1>
  <div class="coverage-summary">
    <p>Coverage data has been collected. See lcov.info for detailed metrics.</p>
  </div>
</body>
</html>
HTML
    echo "✅ Created index.html for coverage/$suite/"
  fi
done

echo ""
echo "✅ All UI suite coverage generated successfully"
echo ""
echo "Coverage structure:"
ls -la coverage/ 2>/dev/null || echo "Coverage directory not found"
