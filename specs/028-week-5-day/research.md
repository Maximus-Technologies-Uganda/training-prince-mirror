# Research: Week 5 Day 3 - Docs, ReviewPacket, and Playwright Smoke

**Date**: 2025-11-11  
**Feature**: 028-week-5-day  
**Status**: Complete

---

## 1. Redoc Documentation Generation

### Decision
Use **@redocly/redoc-cli** - Node.js-based CLI tool for generating static HTML documentation from OpenAPI specifications.

### Rationale
- **Mature ecosystem**: Widely adopted in API documentation (10k+ GitHub stars)
- **Simple setup**: Single npm package, zero external dependencies at runtime
- **Excellent OpenAPI 3.x support**: Full compliance with OpenAPI 3.0 and 3.1 specs
- **Standalone HTML output**: Generates single-file HTML with embedded styles and scripts (no external CDN required)
- **Performance**: Documentation generation typically completes in <10 seconds
- **Zero-configuration**: Works with default settings, customizable via options if needed

### Alternatives Considered
- **Scalar**: Modern, feature-rich alternative with better interactive features but newer/less proven in CI environments, slightly heavier output
- **Swagger UI**: Older standard, requires more configuration, less visually polished
- **ReDoc (web-hosted)**: Would require embedding iframe, less portable

### Implementation Details
```bash
# Installation (runs once in CI)
npm install --save-dev @redocly/redoc-cli

# Generation command (adds ~30 seconds to CI workflow)
npx redoc-cli build -o docs/api.html docs/openapi.yaml

# Options available
npx redoc-cli build \
  -o docs/api.html \
  --title "API Documentation" \
  docs/openapi.yaml
```

### CI Integration Point
- **Location**: Add as step in `deploy-pages.yml` or `build-docs.yml` workflow
- **Trigger**: On merge to main branch (after tests pass)
- **Prerequisites**: `docs/openapi.yaml` must exist and be valid
- **Failure Mode**: Step fails if spec is invalid (prevents deployment)
- **Output Artifact**: `docs/api.html` committed to GitHub Pages branch

---

## 2. GitHub Pages Deployment Configuration

### Decision
Configure `deploy-pages` GitHub Action to publish generated documentation automatically on merge to main.

### Rationale
- **GitHub-native**: Built-in support in all repositories with GitHub Pages enabled
- **No external hosting needed**: Leverages GitHub's infrastructure
- **Branch-based publishing**: Clean separation between PR previews and production docs
- **Auto-expiring**: Old documentation automatically replaced on new deployments

### Deployment Flow
```
Code → Push to feature branch → PR created
  ↓
Run documentation generation (for preview/validation)
  ↓
PR reviewed and approved
  ↓
Merge to main
  ↓
GitHub Actions trigger deploy-pages workflow
  ↓
Run Redoc CLI to generate docs/api.html
  ↓
Commit to gh-pages branch (or docs/ folder)
  ↓
GitHub Pages rebuilds and publishes
  ↓
Documentation live at: https://org.github.io/repo/docs/api.html
```

### Configuration Requirements
1. **Ensure GitHub Pages enabled**:
   - Go to repository Settings → Pages
   - Source: Deploy from a branch OR GitHub Actions
   - Branch: `gh-pages` or `main` (with /docs folder)

2. **Workflow file structure**:
```yaml
name: Deploy API Documentation
on:
  push:
    branches: [main]
    paths:
      - 'docs/openapi.yaml'
      - '.github/workflows/deploy-pages.yml'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm install @redocly/redoc-cli
      - run: npx redoc-cli build -o docs/api.html docs/openapi.yaml
      - uses: actions/upload-pages-artifact@v3
        with:
          path: 'docs/'
      - uses: actions/deploy-pages@v4
```

### URL Structure
- **Production**: `https://org.github.io/repo/docs/api.html`
- **Preview (on PR)**: Can be generated as artifact, commented on PR, or stored temporarily

---

## 3. Playwright Integration Testing Patterns

### Decision
Use Playwright's built-in `page.waitForResponse()` API to intercept and verify HTTP requests during smoke tests.

### Rationale
- **Native support**: Playwright provides network interception without additional libraries
- **Reliability**: Waits for actual network response, not just DOM changes
- **Debugging**: Captures full response body for assertion and error reporting
- **Timeout handling**: Built-in timeout management prevents hanging tests

### Smoke Test Pattern
```javascript
// Pattern for UI-API integration test
test('Create expense and verify API integration', async ({ page }) => {
  // Navigate to Expense UI
  await page.goto('/expenses');
  
  // Set up response listener BEFORE action
  const responsePromise = page.waitForResponse(
    response => response.url().includes('/api/expenses') && response.status() === 201
  );
  
  // Perform user action
  await page.fill('input[name="amount"]', '50.00');
  await page.fill('input[name="description"]', 'Coffee');
  await page.click('button[type="submit"]');
  
  // Wait for API response
  const response = await responsePromise;
  const data = await response.json();
  
  // Assert API success
  expect(response.status()).toBe(201);
  expect(data).toHaveProperty('id');
  
  // Assert UI updated
  await expect(page.locator('text=Coffee')).toBeVisible();
  await expect(page.locator('text=50.00')).toBeVisible();
  
  // Assert total/summary updated
  const total = await page.locator('[data-testid="total"]').textContent();
  expect(total).toContain('50.00');
});
```

### Assertion Strategy
| Assertion Level | What to Check | Why |
|-----------------|---------------|-----|
| **API Response** | HTTP 200, valid JSON, expected fields | Proves backend processed request |
| **UI Rendering** | New item visible in list, correct data displayed | Proves frontend received and rendered data |
| **State Update** | Summary totals, counts, form cleared | Proves full end-to-end flow worked |

### Error Handling
```javascript
// Capture detailed error information
test('Handle API errors gracefully', async ({ page }) => {
  const errorResponsePromise = page.waitForResponse(
    response => response.url().includes('/api/expenses')
  );
  
  // Trigger error scenario (e.g., invalid amount)
  await page.fill('input[name="amount"]', '-50.00');
  await page.click('button[type="submit"]');
  
  const response = await errorResponsePromise;
  const errorData = await response.json();
  
  // Assert failure
  expect(response.status()).toBe(400);
  
  // Assert error displayed to user
  await expect(page.locator('[role="alert"]')).toContainText(errorData.message);
  
  // Assert UI not updated
  await expect(page.locator('text=-50.00')).not.toBeVisible();
});
```

---

## 4. Review Packet Enhancement Patterns

### Decision
Update `review-artifacts/index.html` to include API documentation link alongside existing coverage and Playwright reports.

### Rationale
- **Single entry point**: All review artifacts (coverage, tests, docs) accessible from one page
- **Link validation**: Can validate all links exist before publishing
- **Maintainable structure**: Clean HTML structure for easy updates

### HTML Structure Pattern
```html
<div class="review-artifacts">
  <h1>Review Packet - Week 5 Day 3</h1>
  
  <section class="coverage">
    <h2>Coverage Reports</h2>
    <ul>
      <li><a href="./coverage/api.html" target="_blank">API Coverage</a></li>
      <li><a href="./coverage/frontend.html" target="_blank">Frontend Coverage</a></li>
    </ul>
  </section>
  
  <section class="tests">
    <h2>Test Results</h2>
    <ul>
      <li><a href="./playwright-report/index.html" target="_blank">Playwright Report</a></li>
    </ul>
  </section>
  
  <section class="documentation">
    <h2>API Documentation</h2>
    <ul>
      <li><a href="./docs/api.html" target="_blank">API Specification (Redoc)</a></li>
    </ul>
  </section>
</div>
```

### Link Validation Strategy
```bash
# Validation script (runs in build-review-packet workflow)
function validate_links() {
  local base_dir="review-artifacts"
  
  # Check coverage reports exist
  [ -f "$base_dir/coverage/api.html" ] || exit 1
  [ -f "$base_dir/coverage/frontend.html" ] || exit 1
  
  # Check Playwright report exists
  [ -f "$base_dir/playwright-report/index.html" ] || exit 1
  
  # Check API docs exist
  [ -f "$base_dir/docs/api.html" ] || exit 1
  
  echo "✓ All review artifact links validated"
}
```

### Accessibility Considerations
- Use semantic HTML: `<section>`, `<h2>`, `<ul>`, `<li>`
- Provide descriptive link text (not "Click here")
- Use `target="_blank"` for external/artifact links with `rel="noopener noreferrer"`
- Ensure sufficient color contrast for links

---

## 5. CI Workflow Integration & Orchestration

### Decision
Integrate Redoc generation and smoke testing into existing GitHub Actions workflows with proper sequencing.

### Rationale
- **Minimal disruption**: Reuse existing workflow structure where possible
- **Clear dependencies**: Document generation → review packet update → deployment
- **Fail-fast approach**: Validation early, publishing only on success

### Workflow Orchestration

```
┌─ On Push to Feature Branch ─────────────────────┐
│                                                 │
│ 1. Run linter, unit tests (existing)            │
│ 2. Generate API docs (validate spec)            │
│ 3. Run Playwright Smoke tests                   │
│ 4. Build review packet (with all artifacts)     │
│                                                 │
└─ On PR Open ────────────────────────────────────┘
     ↓
  Review & Approval
     ↓
┌─ On Merge to Main ──────────────────────────────┐
│                                                 │
│ 1. Run full CI (lint, test, coverage)           │
│ 2. Generate API docs (production version)       │
│ 3. Deploy to GitHub Pages (docs/api.html)       │
│ 4. Update review packet with live links         │
│                                                 │
└─────────────────────────────────────────────────┘
```

### CI Step Timing
| Phase | Job | Duration | Trigger |
|-------|-----|----------|---------|
| Validation | Lint + Unit Tests | ~30s | Every push |
| Integration | Documentation Gen + Smoke Tests | ~60s | Every push |
| Deployment | GitHub Pages Publish | ~20s | Merge to main only |

### Workflow File Structure
```yaml
name: Build and Test

on: [push, pull_request]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    # ... existing steps

  build-docs:
    needs: lint-and-test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm install @redocly/redoc-cli
      - run: npx redoc-cli build -o docs/api.html docs/openapi.yaml
      - uses: actions/upload-artifact@v3
        with:
          name: api-docs
          path: docs/api.html

  playwright-smoke:
    needs: build-docs
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install
      - run: npm run test:smoke
      - uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/

  build-review-packet:
    needs: [build-docs, playwright-smoke]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v3
      - run: bash scripts/build-review-packet.sh
      - uses: actions/upload-artifact@v3
        with:
          name: review-artifacts
          path: review-artifacts/

  deploy-pages:
    if: github.ref == 'refs/heads/main'
    needs: build-review-packet
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm install @redocly/redoc-cli
      - run: npx redoc-cli build -o docs/api.html docs/openapi.yaml
      - uses: actions/upload-pages-artifact@v3
        with:
          path: docs/
      - uses: actions/deploy-pages@v4
```

---

## 6. Performance & Reliability Targets

### Documentation Generation
- **Target**: < 1 minute per generation
- **Actual**: ~10-30 seconds with Redoc CLI
- **Scaling**: No scaling concerns; static generation

### Smoke Test Execution
- **Target**: < 2 minutes for full suite
- **Timeout for API calls**: 10-30 seconds (configurable)
- **Timeout for UI updates**: 5-10 seconds (configurable)

### Deployment
- **Target**: < 2 minutes for GitHub Pages publish
- **Actual**: ~20-30 seconds
- **Failure recovery**: Automatic retry on transient failures

---

## 7. Error Scenarios & Mitigation

| Scenario | Detection | Mitigation |
|----------|-----------|-----------|
| Invalid OpenAPI spec | Redoc CLI exits with error | CI step fails, prevents merge |
| GitHub Pages unavailable | Deployment fails | Manual retry, or hold merge until Pages restored |
| Smoke test times out | Playwright timeout | Clear error message, suggests API availability check |
| API returns error (5xx) | Response status check fails | Test fails with response body logged for debugging |
| UI doesn't update | Assertion fails (element not found) | Test fails with timeout info, suggests UI logic issue |
| Link validation fails | Review packet build fails | CI reports missing artifact, blocks merge |

---

## 8. Recommendations for Implementation

1. **Start with Redoc documentation**:
   - Install `@redocly/redoc-cli` first
   - Test generation locally: `npx redoc-cli build -o docs/api.html docs/openapi.yaml`
   - Verify docs/api.html opens correctly in browser

2. **Set up GitHub Pages workflow**:
   - Enable GitHub Pages in repository settings
   - Create initial `deploy-pages.yml` workflow
   - Test deployment on feature branch first

3. **Add Playwright smoke test**:
   - Create `frontend/tests/e2e/smoke-expense-api.spec.js`
   - Use `page.waitForResponse()` for API verification
   - Test both happy path and error scenarios

4. **Update review packet**:
   - Add section for API documentation link
   - Implement link validation
   - Test review packet generation locally

5. **Orchestrate CI workflows**:
   - Ensure proper job dependencies in GitHub Actions
   - Add appropriate timeouts
   - Configure required status checks

---

## Summary

All research questions resolved. Key decisions:
- ✅ **Redoc** for documentation generation
- ✅ **GitHub Pages** via `deploy-pages` action for hosting
- ✅ **Playwright `waitForResponse()`** pattern for API verification
- ✅ **HTML link validation** in review packet build
- ✅ **Main-branch-only deployment** with PR previews for documentation

Ready to proceed with Phase 1 design and implementation.
