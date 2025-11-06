# Quickstart: Smoke Test Execution & Validation

**Feature**: Week 4 Finisher - Playwright E2E Smokes (5 UIs)  
**Date**: 2025-11-02  
**Purpose**: Quick reference for running smoke tests locally and in CI

---

## Local Development Quickstart

### Prerequisites
- Node.js ≥18 installed
- Playwright installed: `npm install @playwright/test`
- Frontend built: `npm run build` (or running dev server: `npm run dev`)
- Current working directory: repository root

### 1. Install Dependencies
```bash
npm install
npm install --save-dev @playwright/test
```

### 2. Configure Playwright
Create `playwright.config.ts` in repository root:
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e/smoke',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 0 : 0,
  workers: 1,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:5173', // Vite dev server default
    trace: 'on-first-failure',
    screenshot: 'only-on-failure',
  },
  
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  
  webServer: {
    command: 'npm run dev',
    reuseExistingServer: !process.env.CI,
    port: 5173,
  },
});
```

### 3. Create Test Directory
```bash
mkdir -p tests/e2e/smoke
mkdir -p tests/e2e/fixtures
```

### 4. Write First Smoke Test
Create `tests/e2e/smoke/hello.spec.ts`:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Hello UI Smoke Test', () => {
  test('should display default greeting and accept name input', async ({ page }) => {
    // Load the Hello UI
    await page.goto('/');
    
    // Assert default greeting is visible
    const greeting = await page.locator('h1');
    await expect(greeting).toContainText('Hello');
    
    // Enter name in input field
    await page.fill('input[type="text"]', 'John');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Assert greeting updated with name
    await expect(greeting).toContainText('John');
    
    // Screenshot on success (captured by Playwright config)
  });
});
```

### 5. Run Tests Locally
```bash
# Run all smoke tests
npx playwright test

# Run specific test file
npx playwright test tests/e2e/smoke/hello.spec.ts

# Run in debug mode
npx playwright test --debug

# Show HTML report
npx playwright show-report
```

### 6. Expected Output (Local Success)
```
✓ tests/e2e/smoke/hello.spec.ts (1 passed)
✓ tests/e2e/smoke/stopwatch.spec.ts (1 passed)
✓ tests/e2e/smoke/temperature.spec.ts (1 passed)
✓ tests/e2e/smoke/expense.spec.ts (1 passed)
✓ tests/e2e/smoke/todo.spec.ts (1 passed)

5 passed (88.2s)
```

---

## Test Scenario: Successful Execution

### Scenario: All 5 Smoke Tests Pass

**Given**: 
- All 5 UIs (Hello, Stopwatch, Temperature, Expense, Todo) are functional
- Playwright is installed and configured for Chromium headless
- Frontend is running at `http://localhost:5173`

**When**:
- Developer runs `npx playwright test` in repository root

**Then**:
- ✅ Test 'hello': Greeting loads, accepts name, updates greeting → **PASSED** (15s)
- ✅ Test 'stopwatch': Timer starts, lap button records entry → **PASSED** (18s)
- ✅ Test 'temperature': Celsius 100 → Fahrenheit 212 conversion works → **PASSED** (13s)
- ✅ Test 'expense': Expense added, row count increases, filter works → **PASSED** (22s)
- ✅ Test 'todo': Task added with priority, completion toggle works → **PASSED** (19s)

**Result**:
- Suite status: **PASSED**
- Total execution time: **87s** ✓ (within 2-min budget)
- HTML report generated at `playwright-report/index.html`
- No screenshots (only on failure)

**Verification**:
```bash
open playwright-report/index.html
# Review each test: ✓ Hello, ✓ Stopwatch, ✓ Temperature, ✓ Expense, ✓ Todo
```

---

## Test Scenario: Failure with Artifacts

### Scenario: Stopwatch Test Fails (Lap Button Not Working)

**Given**:
- Stopwatch UI has a bug: lap button not recording entries
- Playwright is running in CI with artifact capture enabled

**When**:
- Developer pushes code to feature branch
- GitHub Actions workflow triggers `playwright-e2e-smoke.yml`
- Test suite executes in headless Chromium

**Then**:
- ✅ Test 'hello': PASSED (15s)
- ❌ Test 'stopwatch': **FAILED** at assertion "lap count incremented" (18s)
  - Screenshot captured: `stopwatch-failure-001.png`
  - Trace captured: `stopwatch-failure-001.zip` (for step-by-step replay)
  - Reason: Expected lap count 1, got 0
- ✅ Test 'temperature': PASSED (13s)
- ✅ Test 'expense': PASSED (22s)
- ✅ Test 'todo': PASSED (19s)

**Result**:
- Suite status: **FAILED**
- Total execution time: **87s** (all tests ran despite failure)
- GitHub Actions job: **FAILED**
- Artifacts uploaded to GitHub Actions

**Developer Review**:
```
Review artifacts in GitHub Actions job:
├── screenshots/
│   └── stopwatch-failure-001.png (visual state of UI at failure)
├── traces/
│   └── stopwatch-failure-001.zip (step-by-step browser actions)
└── playwright-report/
    └── index.html (test summary)

Developer opens trace in Playwright Inspector to replay failure:
$ npx playwright show-trace stopwatch-failure-001.zip
→ Identifies: Lap button click not triggering event handler
→ Fixes code, pushes new commit
→ CI reruns; all tests pass
```

---

## Test Scenario: Suite Timeout

### Scenario: Suite Exceeds 2-Minute Budget

**Given**:
- One test has become slow (e.g., Temperature UI added heavy computation)
- All 5 tests take: 25s + 25s + 40s + 25s + 25s = **140 seconds**

**When**:
- GitHub Actions workflow triggers
- Test suite starts executing at t=0

**Then**:
- ✅ Test 'hello': PASSED (25s, cumulative: 25s)
- ✅ Test 'stopwatch': PASSED (25s, cumulative: 50s)
- ⏱ Test 'temperature': Running (started at 50s)
- At t=120s (2-min limit), test 'temperature' hits timeout
  - ⏸ Status: **TIMEOUT** (exceeded 30s per-test limit? No—job timeout at suite level)
  - Screenshot captured: current state of Temperature UI
- ❌ Test 'expense': **SKIPPED** (no time to start, cumulative exceeded)
- ❌ Test 'todo': **SKIPPED** (no time to start, cumulative exceeded)

**Result**:
- Suite status: **FAILED**
- Total execution time: **120s** (job terminated at time limit)
- GitHub Actions job: **FAILED** (suite execution exceeded 2-min SLA)
- Alert: "Smoke suite execution exceeded 2-minute budget; check test performance"

**Developer Action**:
```
1. Review performance: which test is slow?
2. Identify root cause (computation, network, selector delay)
3. Optimize: reduce test scope, improve selector, add waits
4. Verify locally: npx playwright test --headed
5. Push fix; verify CI passes within 2-min budget
```

---

## CI/CD Quickstart

### GitHub Actions Workflow Execution

**Workflow File**: `.github/workflows/playwright-e2e-smoke.yml`

```yaml
name: Playwright E2E Smoke Tests

on:
  push:
    branches: [main, development, 018-title-week-4]
  pull_request:
    branches: [development]

jobs:
  smoke-tests:
    runs-on: ubuntu-latest
    timeout-minutes: 5

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Build frontend
        run: npm run build

      - name: Run Playwright smoke tests
        run: npx playwright test
        if: always()  # Continue even if previous steps fail

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

      - name: Upload screenshots on failure
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: failure-screenshots
          path: test-results/
          retention-days: 30

      - name: Update review-packet index
        if: always()
        run: |
          scripts/update-review-packet-index.sh

      - name: Comment PR with results
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            // Post test results summary as PR comment
            const fs = require('fs');
            const reportData = JSON.parse(fs.readFileSync('playwright-report/index.html', 'utf8'));
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `✅ Playwright E2E Smoke Tests: All 5 tests passed!\n\n[View Report](artifacts/playwright-report/index.html)`
            });
```

### Workflow Execution Steps

1. **Checkout**: Pull code from feature branch
2. **Setup Node.js**: Install Node.js 18
3. **Install Dependencies**: `npm install`
4. **Install Browsers**: `npx playwright install --with-deps`
5. **Build Frontend**: `npm run build` (or dev server)
6. **Run Tests**: `npx playwright test` with `if: always()` to ensure all tests run
7. **Upload Results**: Artifacts uploaded to GitHub Actions
8. **Update Review-Packet**: Index HTML updated with links to reports
9. **PR Comment**: Optional; posts results summary as comment

### CI Result Examples

**✅ Success**:
```
✓ tests/e2e/smoke/hello.spec.ts
✓ tests/e2e/smoke/stopwatch.spec.ts
✓ tests/e2e/smoke/temperature.spec.ts
✓ tests/e2e/smoke/expense.spec.ts
✓ tests/e2e/smoke/todo.spec.ts

5 passed (87s)

Artifacts: playwright-report/index.html
```

**❌ Failure**:
```
✓ tests/e2e/smoke/hello.spec.ts
✗ tests/e2e/smoke/stopwatch.spec.ts
✓ tests/e2e/smoke/temperature.spec.ts
✓ tests/e2e/smoke/expense.spec.ts
✓ tests/e2e/smoke/todo.spec.ts

1 failed, 4 passed (89s)

Artifacts:
- playwright-report/index.html
- failure-screenshots/stopwatch-failure-001.png
- failure-traces/stopwatch-failure-001.zip
```

---

## Acceptance Criteria Checklist

### ✅ Functional Requirements

- [ ] **FR-001**: Hello UI smoke test loads, accepts name, updates greeting → Screenshot captured
- [ ] **FR-002**: Stopwatch smoke test starts timer, clicks lap, verifies count increment → Screenshot captured
- [ ] **FR-003**: Temperature smoke test enters 100 Celsius, asserts 212 Fahrenheit → Screenshot captured
- [ ] **FR-004**: Expense smoke test adds expense, verifies row count, tests filter → Screenshot captured
- [ ] **FR-005**: Todo smoke test adds task with priority, toggles completion → Screenshot captured
- [ ] **FR-006**: All 5 tests execute in headless Chromium mode
- [ ] **FR-007**: CI job completes all tests before failure determination (collect-all)
- [ ] **FR-007a**: Individual test timeout = 30 seconds, no retries
- [ ] **FR-007b**: Total suite execution ≤ 2 minutes
- [ ] **FR-008**: Failure artifacts (screenshots, traces) uploaded to CI
- [ ] **FR-009**: Success artifacts (HTML report) generated and available
- [ ] **FR-010**: Review-artifacts/index.html updated with Playwright report links

### ✅ Constitutional Requirements

- [ ] **Principle I**: Tests exercise existing UI logic; no reimplementation
- [ ] **Principle II**: Playwright smoke tests + coverage reporting (per-UI)
- [ ] **Principle III**: Artifacts indexed in review-packet for stakeholder review
- [ ] **Principle IV**: Implementation remains ≤300 LOC per PR; incremental PRs
- [ ] **Principle V**: Uses Vite + Playwright; no new tools; aligns with tech stack

### ✅ Performance & Quality

- [ ] Suite execution time verified ≤2 minutes locally
- [ ] CI job completes within 5-minute timeout
- [ ] All artifacts uploaded and indexed successfully
- [ ] Failure scenarios properly documented in artifacts
- [ ] HTML report displays all test results clearly
- [ ] Screenshots on failure are useful for debugging
- [ ] Traces on failure enable step-by-step replay

---

## Troubleshooting

### Test Hangs or Timeout
```bash
# Check if app is accessible
curl http://localhost:5173

# Check selector validity
npx playwright test --debug
# Inspect page in Playwright Inspector; validate selectors

# Increase timeout for debugging (local only)
# Edit playwright.config.ts: globalTimeout: 60000
```

### Selector Not Found
```bash
# Test selectors interactively
npx playwright test --debug
# In Inspector, use page.locator() to test selectors

# Common issues:
# - Wrong URL path (e.g., /temp vs /temperature)
# - Selector changed in UI code
# - Dynamic class names not handled
```

### GitHub Actions Artifact Not Generated
```bash
# Check workflow logs for errors
# Ensure paths in upload-artifact step match actual generated paths

# Locally generate artifacts:
npx playwright test
npx playwright show-report
# If missing, check playwright.config.ts reporter settings
```

---

## Next Steps

- **Phase 2 Tasks**: Generate 18-22 implementation tasks from this plan
- **Implementation**: Execute tasks following TDD (test first, then implementation)
- **Validation**: Run full suite, verify <2-min performance, validate artifacts
- **Review**: Merge PR; update review-packet; close feature spec
