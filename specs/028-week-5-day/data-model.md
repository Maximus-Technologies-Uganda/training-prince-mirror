# Data Model: Week 5 Day 3 - Docs, ReviewPacket, and Playwright Smoke

**Date**: 2025-11-11  
**Feature**: 028-week-5-day  
**Status**: Complete

---

## Overview

This feature does not introduce new persistent data entities. Instead, it operates on and generates artifacts from existing system entities. The data model focuses on artifact relationships and metadata rather than database records.

---

## Entity: API Documentation

### Purpose
Interactive HTML documentation generated from OpenAPI specification, published to GitHub Pages for consumption by API users and reviewers.

### Attributes

| Attribute | Type | Required | Source | Description |
|-----------|------|----------|--------|-------------|
| `filename` | string | Yes | Generated | `docs/api.html` - static filename |
| `source_spec` | string | Yes | Fixed | `docs/openapi.yaml` - source OpenAPI spec |
| `generation_timestamp` | ISO8601 | Yes | Generated | When HTML was generated |
| `public_url` | URL | Yes | Computed | `https://org.github.io/repo/docs/api.html` |
| `spec_version` | string | Yes | From spec | OpenAPI version (e.g., "3.0.0", "3.1.0") |
| `valid` | boolean | Yes | Validation | Whether HTML renders without errors |
| `size_bytes` | integer | No | Metadata | File size of generated HTML (typically 100-500 KB) |

### Relationships

```
OpenAPI Specification (docs/openapi.yaml)
           ↓ (input)
    Redoc CLI Build Process
           ↓ (output)
    API Documentation (docs/api.html)
           ↓ (referenced by)
    Review Packet Index (review-artifacts/index.html)
           ↓
    GitHub Pages Deployment
           ↓
    Public URL (accessible to API consumers)
```

### Constraints & Validation Rules

1. **Source Spec Validation**:
   - OpenAPI spec file must exist at `docs/openapi.yaml`
   - Spec must be valid OpenAPI 3.0 or 3.1 JSON/YAML
   - Generation step MUST fail if spec is invalid
   - Redoc CLI will reject invalid specs automatically

2. **Output Generation**:
   - Generated HTML must be self-contained (all CSS/JS inline)
   - File size must be < 2MB (typical 200-500 KB)
   - HTML must pass basic accessibility checks (lighthouse)

3. **Availability**:
   - Documentation must be accessible at public URL within 2 minutes of merge to main
   - URL must remain stable and consistent across deployments
   - Documentation should not expire or be deleted (permanent archive)

### Lifecycle

```
PENDING (spec committed)
    ↓
GENERATING (Redoc CLI running)
    ↓
GENERATED (HTML file created locally)
    ↓
PUBLISHING (GitHub Actions deploying to Pages)
    ↓
PUBLISHED (Accessible at public URL)
```

### Transitions

| From | To | Trigger | Condition |
|------|----|---------|-----------:|
| PENDING | GENERATING | Merge to main | spec changed or docs forced rebuild |
| GENERATING | GENERATED | Redoc CLI success | spec valid, HTML created |
| GENERATING | FAILED | Redoc CLI error | spec invalid or syntax error |
| GENERATED | PUBLISHING | GitHub Pages job triggered | artifact upload complete |
| PUBLISHING | PUBLISHED | Deploy pages success | GitHub Pages updated |
| PUBLISHING | FAILED | Deploy pages error | permissions, quota, or Pages disabled |

---

## Entity: Review Packet

### Purpose
Central artifact index linking all review materials (coverage reports, test results, API documentation) in a single HTML page for easy access during code review.

### Attributes

| Attribute | Type | Required | Source | Description |
|-----------|------|----------|--------|-------------|
| `filename` | string | Yes | Fixed | `review-artifacts/index.html` |
| `coverage_table_link` | URL | Yes | Fixed | Link to `coverage/api.html` |
| `playwright_report_link` | URL | Yes | Fixed | Link to `playwright-report/index.html` |
| `api_docs_link` | URL | Yes | Generated | Link to `docs/api.html` (NEW) |
| `generated_timestamp` | ISO8601 | Yes | Generated | When review packet was built |
| `build_number` | string | No | CI/CD | GitHub Actions run number or timestamp |
| `commit_sha` | string | Yes | Git | Commit hash this packet represents |
| `all_links_valid` | boolean | Yes | Validation | Whether link validation passed |

### Relationships

```
Coverage Reports
    ↓
Review Packet Index ←──── API Documentation
    ↓                      ↑
Playwright Reports    GitHub Pages URL
    ↓
Accessibility by Reviewers
```

### Components (must all be present)

1. **Coverage Table**:
   - API coverage metrics
   - Frontend coverage metrics
   - Links to detailed coverage reports
   - Threshold met indicator (✓ or ✗)

2. **Playwright Report**:
   - Link to Playwright HTML report
   - Test summary (passed/failed/skipped counts)
   - Smoke test results specifically

3. **API Documentation Link** (NEW):
   - Direct link to `docs/api.html`
   - Text: "API Documentation (Redoc)"
   - Accessible to all reviewers

### Constraints & Validation Rules

1. **All Links Must Be Valid**:
   - Build-review-packet workflow MUST validate all links exist
   - Validation fails if any link is broken or missing
   - CI step MUST fail on validation failure

2. **Component Completeness**:
   - Review packet must include ALL THREE components
   - Missing any component is a build failure
   - No partial/degraded states allowed

3. **Content Integrity**:
   - Generated HTML must be valid semantic HTML5
   - All links must use relative paths (portable)
   - Must be accessible from root: `/review-artifacts/index.html`

### Lifecycle

```
BUILDING (workflow running, collecting artifacts)
    ↓
VALIDATING (checking all links exist and accessible)
    ↓
GENERATED (HTML created locally)
    ↓
PUBLISHED (uploaded as artifact/to Pages)
```

### Transitions

| From | To | Trigger | Condition |
|------|----|---------|-----------:|
| BUILDING | VALIDATING | All artifacts collected | coverage, report, docs available |
| VALIDATING | GENERATED | Links valid | all 3 links validated ✓ |
| VALIDATING | FAILED | Links invalid | any link missing or broken |
| GENERATED | PUBLISHED | Artifact upload | review-artifacts/ ready |

---

## Entity: Playwright Smoke Test

### Purpose
Automated end-to-end test validating UI and API are properly integrated by performing a realistic user workflow and asserting both API response success and UI update.

### Attributes

| Attribute | Type | Required | Source | Description |
|-----------|------|----------|--------|-------------|
| `filename` | string | Yes | Fixed | `frontend/tests/e2e/smoke-expense-api.spec.js` |
| `ui_component` | string | Yes | Fixed | "Expense" (Expense UI) |
| `test_name` | string | Yes | Code | "Create expense and verify UI updates" |
| `user_action` | enum | Yes | Fixed | CREATE_EXPENSE |
| `api_endpoint` | string | Yes | Fixed | POST /api/expenses |
| `api_expected_status` | integer | Yes | Fixed | 200 or 201 |
| `ui_assertion_count` | integer | Yes | Code | 3+ assertions (API response + UI visible + summary updated) |
| `timeout_api_ms` | integer | Yes | Code | 10000 (10 seconds) |
| `timeout_ui_ms` | integer | Yes | Code | 5000 (5 seconds) |
| `enabled` | boolean | Yes | Config | true (active) |

### Relationships

```
Playwright Test File
    ↓
Loads Expense UI Component
    ↓
Performs Create Expense Action (user input)
    ↓
API Call (POST /api/expenses)
    ↓
API Response (200/201 with data)
    ↓
UI Update (new expense visible)
    ↓
Assertions (API + UI validated)
    ↓
Test Report (success/failure)
    ↓
Review Packet (links to Playwright report)
```

### Test Assertions

| Assertion Type | What | Expected | Fail Scenario |
|---|---|---|---|
| **API Response** | HTTP status | 200 or 201 | API returns error (4xx/5xx) |
| **API Data** | Response contains expense ID | `{ id: <uuid> }` | API response missing required fields |
| **API Data** | Response contains created_at | Valid ISO8601 timestamp | API response malformed |
| **UI Rendering** | New expense visible in list | Item text appears on page | UI failed to update or timeout |
| **UI Rendering** | Expense amount visible | "50.00" appears on page | Amount not displayed or wrong value |
| **UI State** | Total/summary updated | Sum includes new expense | Total calculation failed |

### Constraints & Validation Rules

1. **API Verification**:
   - Must use `page.waitForResponse()` to capture actual HTTP response
   - Must verify response status code (200 or 201)
   - Must verify response body contains expected data structure
   - Must fail with detailed error message if API call fails

2. **UI Verification**:
   - Must verify new expense appears in the UI list
   - Must verify all displayed data matches API response
   - Must verify totals/summaries are recalculated
   - Must use explicit waits (not polling)

3. **Error Handling**:
   - Test MUST fail if API returns non-2xx status
   - Test MUST fail if UI doesn't update within timeout
   - Test MUST log full error details (status, body, message)
   - Errors MUST be actionable by developers

4. **Reliability**:
   - Test must handle network latency (10-second API timeout)
   - Test must handle UI rendering delays (5-second UI timeout)
   - Test must not be flaky (deterministic pass/fail)
   - Test must clean up after itself (optional: clear data before test)

### Lifecycle

```
PENDING (test file created)
    ↓
RUNNING (Playwright executes test)
    ↓
WAITING_API (waiting for API response)
    ↓
API_RESPONSE_RECEIVED (response captured)
    ↓
ASSERTING_API (verifying API data)
    ↓
ASSERTING_UI (waiting for UI update)
    ↓
PASSED (all assertions succeeded) OR FAILED (assertion failed)
    ↓
REPORTED (result added to test report)
```

### Transitions

| From | To | Trigger | Condition |
|------|----|---------|-----------:|
| RUNNING | WAITING_API | User action performed | form submitted, API request sent |
| WAITING_API | API_RESPONSE_RECEIVED | Network response | server responds within 10s |
| WAITING_API | FAILED | Timeout or error | no response within 10s, or 5xx error |
| API_RESPONSE_RECEIVED | ASSERTING_API | Response intercepted | verify status code and body |
| ASSERTING_API | ASSERTING_UI | API assertions pass | status 200/201, data valid |
| ASSERTING_API | FAILED | API assertion fails | wrong status or invalid data |
| ASSERTING_UI | PASSED | UI update verified | new expense visible, totals updated |
| ASSERTING_UI | FAILED | UI assertion fails | element not found or timeout |

---

## Entity: GitHub Pages Site

### Purpose
GitHub's static site hosting service that publishes API documentation to a public URL for consumption by API users and reviewers.

### Attributes

| Attribute | Type | Required | Source | Description |
|-----------|------|----------|--------|-------------|
| `repository_name` | string | Yes | Fixed | training-prince |
| `organization` | string | Yes | Fixed | Maximus-Technologies-Uganda |
| `publish_source` | enum | Yes | Config | "gh-pages branch" or "main /docs folder" |
| `domain` | URL | Yes | Computed | `https://org.github.io/repo` |
| `docs_path` | string | Yes | Fixed | `/docs/api.html` |
| `full_url` | URL | Yes | Computed | `https://org.github.io/repo/docs/api.html` |
| `ssl_enabled` | boolean | Yes | Default | true |
| `custom_domain` | URL | No | Optional | None (uses GitHub domain) |

### Constraints & Validation Rules

1. **Configuration**:
   - GitHub Pages must be enabled in repository settings
   - Source must be configured (branch or Actions)
   - Build source must have `.nojekyll` file (if needed)

2. **Deployment**:
   - Documentation files must be deployed via GitHub Actions
   - Files must be in `docs/` directory or committed to `gh-pages` branch
   - Deployment must complete within 2 minutes

3. **Availability**:
   - Site must be accessible 24/7
   - SSL certificate auto-renewed (GitHub managed)
   - No additional configuration needed for HTTPS

---

## Entity: OpenAPI Specification

### Purpose
Single source of truth for API contract definition; used as input for documentation generation and smoke test validation.

### Attributes

| Attribute | Type | Required | Source | Description |
|-----------|------|----------|--------|-------------|
| `filename` | string | Yes | Fixed | `docs/openapi.yaml` |
| `format` | enum | Yes | Fixed | YAML (JSON also acceptable) |
| `openapi_version` | string | Yes | File | "3.0.0", "3.0.1", "3.1.0", etc. |
| `info_title` | string | Yes | File | API title from spec |
| `info_version` | string | Yes | File | API version from spec |
| `servers` | array | No | File | Server URLs (for smoke test) |
| `paths` | object | Yes | File | All endpoints defined |
| `valid` | boolean | Yes | Validation | Passes OpenAPI validator |

### Required Endpoints (for smoke test)

```yaml
paths:
  /api/expenses:
    post:
      summary: Create expense
      requestBody:
        required: true
        content:
          application/json:
            schema:
              properties:
                amount:
                  type: number
                description:
                  type: string
      responses:
        '201':
          description: Expense created
          content:
            application/json:
              schema:
                properties:
                  id:
                    type: string
                    format: uuid
                  amount:
                    type: number
                  description:
                    type: string
    get:
      summary: List expenses
      responses:
        '200':
          description: List of expenses
          content:
            application/json:
              schema:
                type: array
```

### Constraints & Validation Rules

1. **Spec Validity**:
   - Must be valid OpenAPI 3.0+ specification
   - Must pass OpenAPI validator (e.g., Redoc CLI validation)
   - Invalid specs block documentation generation and deployment

2. **Endpoint Requirements**:
   - Must include `POST /api/expenses` for smoke test
   - Must include `GET /api/expenses` for smoke test
   - Endpoints must have proper request/response schemas

---

## Data Relationships Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Specification                                │
│              (docs/openapi.yaml)                                │
│           - format: YAML                                        │
│           - version: 3.0+                                       │
│           - paths: /api/expenses                                │
└──────────────┬─────────────────────────────────────────┬────────┘
               │                                         │
               │ (input)                                 │ (validates)
               ↓                                         ↓
    ┌──────────────────────┐              ┌──────────────────────┐
    │ Redoc CLI Build      │              │ Playwright Smoke     │
    │ Process              │              │ Test                 │
    └──────────────────────┘              └──────────────────────┘
               │                                         │
               │ (outputs)                              │ (generates)
               ↓                                         ↓
    ┌──────────────────────┐              ┌──────────────────────┐
    │ API Documentation    │              │ Test Report          │
    │ (docs/api.html)      │              │ (playwright-report/) │
    │ - HTML file          │              │ - HTML + JSON        │
    │ - Self-contained     │              │ - Pass/Fail status   │
    └──────────────┬───────┘              └──────────┬───────────┘
                   │                                 │
                   │ (referenced by)                 │ (referenced by)
                   └────────┬──────────┬─────────────┘
                            ↓          ↓
                   ┌──────────────────────────┐
                   │ Review Packet Index      │
                   │ (review-artifacts/)      │
                   │ - Coverage table         │
                   │ - Playwright link        │
                   │ - API docs link (NEW)    │
                   └────────────┬─────────────┘
                                │
                                │ (published as)
                                ↓
                   ┌──────────────────────────┐
                   │ GitHub Pages Site        │
                   │ https://org.github.io/   │
                   │   repo/docs/api.html     │
                   │ https://org.github.io/   │
                   │   repo/artifacts/        │
                   └──────────────────────────┘
```

---

## Summary

**No new persistent database entities created**. This feature:
- Generates static artifacts (API documentation, review packet)
- Validates existing APIs and UI components
- Links artifacts together in a review-focused structure
- Publishes artifacts to GitHub Pages and CI artifacts

All data is transient or derived from existing sources (OpenAPI spec, test results).
