# Quickstart Guide: Week 5 Day 3 - Docs, ReviewPacket, and Playwright Smoke

**Date**: 2025-11-11  
**Feature**: 028-week-5-day  
**Status**: Ready for Implementation

---

## Overview

This quickstart provides copy-paste commands and code snippets to get started with each component of this feature: API documentation generation, review packet enhancement, and Playwright smoke testing.

---

## Part 1: API Documentation Generation with Redoc

### 1.1 Local Setup & Testing

```bash
# Navigate to project root
cd /path/to/training-prince

# Install Redoc CLI (dev dependency)
npm install --save-dev @redocly/redoc-cli

# Generate documentation locally
npx redoc-cli build -o docs/api.html docs/openapi.yaml

# Verify generation
ls -lh docs/api.html
# Output: -rw-r--r-- 1 user staff 256K Nov 11 12:00 docs/api.html

# Test locally in browser (if you have a local server)
# Option 1: Using Python
cd docs
python3 -m http.server 8000
# Visit: http://localhost:8000/api.html

# Option 2: Using Node.js http-server
npx http-server docs/
# Visit: http://localhost:8080/api.html
```

### 1.2 GitHub Actions Workflow Integration

Create or update `.github/workflows/deploy-pages.yml`:

```yaml
name: Deploy API Documentation to GitHub Pages

on:
  push:
    branches: [main]
    paths:
      - 'docs/openapi.yaml'
      - '.github/workflows/deploy-pages.yml'

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build-and-deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install Redoc CLI
        run: npm install --save-dev @redocly/redoc-cli

      - name: Generate API documentation
        run: npx redoc-cli build -o docs/api.html docs/openapi.yaml

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: 'docs/'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 1.3 Verify GitHub Pages is Enabled

```bash
# Check if GitHub Pages is enabled in your repo
# Go to: Settings → Pages
# Ensure:
#   - Pages is enabled
#   - Source is "GitHub Actions" (or "Deploy from a branch")
#   - If using branch source, ensure gh-pages branch exists
```

---

## Part 2: Review Packet Enhancement

### 2.1 Update Review Packet HTML

Edit or create `review-artifacts/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Review Packet - Week 5 Day 3</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            margin: 40px;
            line-height: 1.6;
            color: #333;
        }
        h1 {
            color: #0066cc;
            border-bottom: 3px solid #0066cc;
            padding-bottom: 10px;
        }
        h2 {
            margin-top: 30px;
            color: #0052a3;
        }
        section {
            margin: 20px 0;
            padding: 15px;
            background: #f5f5f5;
            border-radius: 5px;
        }
        a {
            color: #0066cc;
            text-decoration: none;
            font-weight: 500;
        }
        a:hover {
            text-decoration: underline;
        }
        ul {
            list-style: none;
            padding: 0;
        }
        li {
            padding: 8px 0;
            border-bottom: 1px solid #ddd;
        }
        li:last-child {
            border-bottom: none;
        }
        .status {
            display: inline-block;
            margin-left: 10px;
            font-weight: bold;
        }
        .status.pass {
            color: #28a745;
        }
        .status.fail {
            color: #dc3545;
        }
    </style>
</head>
<body>
    <h1>📋 Review Packet - Week 5 Day 3</h1>
    <p><strong>Build Date:</strong> <span id="build-date"></span></p>
    <p><strong>Commit:</strong> <span id="commit-sha" style="font-family: monospace;"></span></p>

    <section class="coverage">
        <h2>📊 Coverage Reports</h2>
        <ul>
            <li>
                <a href="./coverage/api.html" target="_blank" rel="noopener noreferrer">
                    API Coverage
                </a>
            </li>
            <li>
                <a href="./coverage/frontend.html" target="_blank" rel="noopener noreferrer">
                    Frontend Coverage
                </a>
            </li>
        </ul>
    </section>

    <section class="tests">
        <h2>🧪 Test Results</h2>
        <ul>
            <li>
                <a href="./playwright-report/index.html" target="_blank" rel="noopener noreferrer">
                    Playwright Test Report
                </a>
            </li>
        </ul>
    </section>

    <section class="documentation">
        <h2>📚 API Documentation</h2>
        <ul>
            <li>
                <a href="./docs/api.html" target="_blank" rel="noopener noreferrer">
                    API Specification (Redoc)
                </a>
                <span class="status pass">✓ NEW</span>
            </li>
        </ul>
    </section>

    <section class="footer" style="margin-top: 40px; padding: 20px; background: #e8f4f8; border-left: 4px solid #0066cc;">
        <p><strong>ℹ️ How to use this packet:</strong></p>
        <ol>
            <li>Review the <strong>Coverage Reports</strong> to see test coverage metrics</li>
            <li>Check the <strong>Playwright Test Report</strong> for UI testing results</li>
            <li>Explore the <strong>API Documentation</strong> to understand the API specification</li>
            <li>All links open in new tabs for easy navigation</li>
        </ol>
    </section>

    <script>
        // Populate build date and commit (will be filled by CI/build script)
        document.getElementById('build-date').textContent = 
            new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        
        // Commit SHA would come from environment variable (filled during build)
        document.getElementById('commit-sha').textContent = 
            process.env.GITHUB_SHA ? process.env.GITHUB_SHA.substring(0, 7) : 'unknown';
    </script>
</body>
</html>
```

### 2.2 Link Validation Script

Create `scripts/validate-review-packet-links.sh`:

```bash
#!/bin/bash
set -e

# Validate all links in review packet exist
PACKET_DIR="review-artifacts"

echo "🔍 Validating review packet links..."

# Check coverage reports
if [ ! -f "$PACKET_DIR/coverage/api.html" ]; then
    echo "❌ Missing: $PACKET_DIR/coverage/api.html"
    exit 1
fi
echo "✓ API coverage report found"

if [ ! -f "$PACKET_DIR/coverage/frontend.html" ]; then
    echo "❌ Missing: $PACKET_DIR/coverage/frontend.html"
    exit 1
fi
echo "✓ Frontend coverage report found"

# Check Playwright report
if [ ! -f "$PACKET_DIR/playwright-report/index.html" ]; then
    echo "❌ Missing: $PACKET_DIR/playwright-report/index.html"
    exit 1
fi
echo "✓ Playwright report found"

# Check API documentation (NEW)
if [ ! -f "$PACKET_DIR/docs/api.html" ]; then
    echo "❌ Missing: $PACKET_DIR/docs/api.html"
    exit 1
fi
echo "✓ API documentation found"

echo ""
echo "✅ All review packet links validated successfully!"
```

Make executable and test:
```bash
chmod +x scripts/validate-review-packet-links.sh
./scripts/validate-review-packet-links.sh
```

---

## Part 3: Playwright Smoke Test - UI + API Integration

### 3.1 Create Smoke Test File

Create `frontend/tests/e2e/smoke-expense-api.spec.js`:

```javascript
import { test, expect } from '@playwright/test';

test.describe('Expense UI + API Integration Smoke Test', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Expense UI
    await page.goto('/expenses');
    
    // Wait for page to load
    await expect(page).toHaveTitle(/Expense/i);
  });

  test('Create expense and verify API integration', async ({ page }) => {
    // Set up listener for API response BEFORE performing action
    const responsePromise = page.waitForResponse(
      response => 
        response.url().includes('/api/expenses') && 
        response.status() >= 200 && 
        response.status() < 300,
      { timeout: 10000 } // 10 second timeout for API
    );

    // Perform user action: create an expense
    await page.fill('input[name="amount"]', '50.00');
    await page.fill('input[name="description"]', 'Test Expense');
    await page.click('button[type="submit"]');

    // Wait for API response
    let response;
    try {
      response = await responsePromise;
    } catch (error) {
      test.fail(`API call timed out or failed: ${error.message}`);
    }

    // Assert 1: Verify API response is successful
    expect(response.status()).toBeLessThan(300);
    expect(response.status()).toBeGreaterThanOrEqual(200);

    // Get response data
    const responseData = await response.json();

    // Assert 2: Verify API returned required fields
    expect(responseData).toHaveProperty('id');
    expect(responseData).toHaveProperty('amount', 50);
    expect(responseData).toHaveProperty('description', 'Test Expense');

    // Assert 3: Verify UI updated with new expense
    // Wait for new item to appear in list (5 second timeout)
    await expect(
      page.locator('text=Test Expense'),
      { timeout: 5000 }
    ).toBeVisible();

    // Assert 4: Verify amount is displayed correctly
    await expect(
      page.locator('text=50.00'),
      { timeout: 5000 }
    ).toBeVisible();

    // Assert 5: Verify total/summary updated
    const totalLocator = page.locator('[data-testid="total-amount"]');
    const totalText = await totalLocator.textContent({ timeout: 5000 });
    const totalAmount = parseFloat(totalText.replace(/[^\d.]/g, ''));
    expect(totalAmount).toBeGreaterThanOrEqual(50);
  });

  test('Handle API error gracefully', async ({ page }) => {
    // Set up listener for error response
    const errorResponsePromise = page.waitForResponse(
      response => response.url().includes('/api/expenses'),
      { timeout: 10000 }
    );

    // Attempt to create expense with invalid data (negative amount)
    await page.fill('input[name="amount"]', '-50.00');
    await page.fill('input[name="description"]', 'Invalid Expense');
    await page.click('button[type="submit"]');

    // Wait for response
    const response = await errorResponsePromise;

    // Assert: API rejects invalid input
    expect([400, 422]).toContain(response.status());

    // Get error response
    const errorData = await response.json();

    // Assert: Error message is displayed to user
    await expect(
      page.locator('[role="alert"]'),
      { timeout: 5000 }
    ).toContainText(/negative|invalid|amount/i);

    // Assert: Invalid expense NOT added to list
    await expect(
      page.locator('text=-50.00')
    ).not.toBeVisible();
  });

  test('Handle API timeout gracefully', async ({ page, context }) => {
    // Simulate slow/unresponsive API by delaying responses
    await context.route('**/api/expenses**', route => {
      // Delay response by 15 seconds (longer than test timeout)
      setTimeout(() => {
        route.continue();
      }, 15000);
    });

    // Attempt to create expense
    await page.fill('input[name="amount"]', '50.00');
    await page.click('button[type="submit"]');

    // Test should timeout waiting for response
    await expect(
      page.locator('[role="alert"]'),
      { timeout: 15000 }
    ).toContainText(/timeout|unavailable|connection/i);
  });
});
```

### 3.2 Configure Playwright Configuration

Ensure `playwright.config.js` includes the smoke test:

```javascript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './frontend/tests',
  
  /* Smoke test specific config */
  projects: [
    {
      name: 'chromium-smoke',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/*smoke*.spec.js',
    },
  ],

  /* Shared timeout settings */
  timeout: 30000, // 30 second per test
  expect: {
    timeout: 5000, // 5 second assertion timeout
  },

  /* Web Server */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
```

### 3.3 Run Smoke Test Locally

```bash
# Install dependencies
npm install

# Start dev server (in background or separate terminal)
npm run dev

# Run smoke tests
npx playwright test frontend/tests/e2e/smoke-expense-api.spec.js

# Run with headed browser (see what's happening)
npx playwright test --headed frontend/tests/e2e/smoke-expense-api.spec.js

# Run with debugging
npx playwright test --debug frontend/tests/e2e/smoke-expense-api.spec.js
```

### 3.4 GitHub Actions Workflow for Smoke Tests

Add to `.github/workflows/playwright-smoke.yml`:

```yaml
name: Playwright Smoke Tests

on:
  push:
    branches: ['main', '028-*']
  pull_request:
    branches: ['main']

jobs:
  playwright:
    timeout-minutes: 10
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Start API server
        run: npm run start:api &
        
      - name: Start frontend dev server
        run: npm run dev &
        
      - name: Wait for servers to be ready
        run: sleep 5
      
      - name: Run Playwright smoke tests
        run: npx playwright test frontend/tests/e2e/smoke-expense-api.spec.js
      
      - name: Upload Playwright report
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

---

## Part 4: Integration & Testing Locally

### 4.1 Full Local Test Run

```bash
# 1. Generate documentation
npm install --save-dev @redocly/redoc-cli
npx redoc-cli build -o docs/api.html docs/openapi.yaml

# 2. Verify documentation generated
file docs/api.html
# Should output: docs/api.html: HTML document, UTF-8 Unicode text

# 3. Start dev server
npm run dev &
sleep 3

# 4. Run smoke tests
npx playwright test frontend/tests/e2e/smoke-expense-api.spec.js

# 5. Validate review packet links
./scripts/validate-review-packet-links.sh

# 6. View Playwright report
npx playwright show-report
```

### 4.2 Verify Review Packet

```bash
# Copy all artifacts together
mkdir -p review-artifacts/{coverage,playwright-report,docs}

# Copy generated files
cp docs/api.html review-artifacts/docs/
cp coverage/* review-artifacts/coverage/ 2>/dev/null || true
cp -r playwright-report/* review-artifacts/playwright-report/

# Copy review packet index
cp review-artifacts/index.html review-artifacts/index.html

# Validate
./scripts/validate-review-packet-links.sh

# Serve locally
cd review-artifacts
npx http-server
# Visit: http://localhost:8080/index.html
```

---

## Part 5: CI/CD Integration Checklist

### Before Merging

```bash
# ✓ API documentation generates without errors
npx redoc-cli build -o docs/api.html docs/openapi.yaml

# ✓ Smoke tests pass locally
npx playwright test frontend/tests/e2e/smoke-expense-api.spec.js

# ✓ Review packet validates
./scripts/validate-review-packet-links.sh

# ✓ No lint or type errors
npm run lint
npm run type-check

# ✓ All CI checks pass (GitHub Actions)
# - spec-check
# - Test & Coverage - API
# - Playwright Smoke
# - Deploy Pages
```

### After Merge to Main

```bash
# ✓ GitHub Actions workflows executed successfully
# Check: https://github.com/Maximus-Technologies-Uganda/training-prince/actions

# ✓ API documentation published
# Check: https://maximus-technologies-uganda.github.io/training-prince/docs/api.html

# ✓ GitHub Pages shows no build errors
# Check: Repository Settings → Pages

# ✓ Review packet accessible
# Check: https://maximus-technologies-uganda.github.io/training-prince/review-artifacts/index.html
```

---

## Troubleshooting

### Redoc Build Fails

```bash
# Check OpenAPI spec validity
npx redoc-cli build -o /dev/null docs/openapi.yaml

# Error: spec invalid
# → Fix OpenAPI spec, re-run
# → Common issues: missing required fields, invalid types, malformed YAML
```

### Smoke Test Timeout

```bash
# Issue: "API call timed out"
# → Check if API server is running: curl http://localhost:5000/api/expenses
# → Check if endpoint exists in OpenAPI spec
# → Increase timeout in test (not recommended)

# Issue: "UI element not found"
# → Check if element has correct data-testid or selector
# → Verify UI updates after API response
# → Check browser console for errors
```

### GitHub Pages Not Publishing

```bash
# Issue: "404 - Page not found"
# → Verify GitHub Pages enabled: Settings → Pages
# → Verify workflow completed successfully: Actions tab
# → Verify docs/api.html exists in gh-pages branch
```

---

## Summary

This quickstart provides:
- ✅ Redoc CLI setup and integration
- ✅ Review packet HTML structure and validation
- ✅ Complete Playwright smoke test implementation
- ✅ GitHub Actions workflow configurations
- ✅ Local testing procedures
- ✅ Troubleshooting guide

**Next Steps**:
1. Copy code snippets from each section
2. Test locally with provided commands
3. Commit changes and push to feature branch
4. Verify GitHub Actions workflows pass
5. Merge to main and confirm deployment
