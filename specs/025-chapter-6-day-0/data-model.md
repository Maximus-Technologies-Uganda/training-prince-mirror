# Data Model: Chapter 6 Day 0 - FinishtoGreen & CI Tightening

**Branch**: `025-chapter-6-day-0` | **Date**: 18 November 2025  
**Status**: Design Complete | **Next**: Phase 1 Contracts & Quickstart

---

## Entity Definitions

### 1. Git Tag Entity

**Name**: Git Tag  
**Purpose**: Mark named milestones in repository history for release management and audit trails

**Fields**:
| Field | Type | Required | Validation Rules | Notes |
|-------|------|----------|------------------|-------|
| `name` | String | Yes | Format: `[chapter]-(complete\|release\|baseline)` e.g., `chapter5-complete` | Unique identifier; immutable once pushed |
| `commit_sha` | String (SHA-1) | Yes | Valid Git commit hash; must exist on main branch | Identifies exact state at tag creation |
| `annotated` | Boolean | No | True for annotated tags (recommended) | Includes tagger name, date, message |
| `message` | String | Yes | Descriptive message; min 20 chars | e.g., "Chapter 5 API Development Complete: FinishtoGreen baseline established" |
| `release_date` | ISO8601 Datetime | No | YYYY-MM-DDTHH:MM:SSZ format | Auto-populated from git creation time |
| `published_to_releases` | Boolean | No | True if visible in GitHub Releases | Managed by GitHub; visible 24h after push |

**State Transitions**:
```
Created (local) → Pushed (origin) → Published (GitHub Releases) → Archived
```

**Relationships**:
- Points to exactly one Commit
- May be referenced by Multiple Release Notes
- Links to One Chapter Milestone (Chapter 5, Chapter 6, etc.)

**Validation**:
- Git tag name MUST follow format convention
- Commit MUST exist on main branch
- Tag MUST be signed or annotated
- Message MUST be present and descriptive

**Example**:
```json
{
  "name": "chapter5-complete",
  "commit_sha": "abc123def456",
  "annotated": true,
  "message": "Chapter 5 API Development Complete: FinishtoGreen baseline established",
  "release_date": "2025-11-18T10:30:00Z",
  "published_to_releases": true
}
```

---

### 2. GitHub Actions Workflow Entity

**Name**: GitHub Actions Workflow  
**Purpose**: Define CI/CD automation for testing, security, and quality checks

**Fields**:
| Field | Type | Required | Validation Rules | Notes |
|-------|------|----------|------------------|-------|
| `name` | String | Yes | Unique per repository | e.g., "ally-check", "api-checks", "test.yml" |
| `file_path` | String | Yes | `.github/workflows/*.yml` | YAML workflow definition location |
| `triggers` | Array[String] | Yes | Valid GitHub Actions events: push, pull_request, workflow_dispatch | Conditions that invoke workflow |
| `jobs` | Array[Object] | Yes | Each job has name, runs-on, steps | Job definitions within workflow |
| `required_status_check` | Boolean | Yes | True if result blocks merge on protected branch | Enforced via branch protection rule |
| `timeout_minutes` | Integer | No | 1-1440; default 360 | Max execution time before timeout |
| `environment` | String | No | Environment name for secrets/context | e.g., "github-pages" |
| `permissions` | Object | No | contents, pages, id-token, etc. | OIDC token scopes and access levels |
| `status` | Enum | Yes | PASS, FAIL, SKIPPED, PENDING | Current workflow status on latest run |

**State Transitions**:
```
Defined (local) → Committed (branch) → Active (origin) → Triggered (on event)
  → Running → PASS/FAIL → Block/Allow merge
```

**Relationships**:
- One workflow file MAY contain Multiple Jobs
- Workflows reference Zero or More External Scripts
- Workflows consume Zero or More Secrets
- Workflows produce One or More Artifacts

**Validation**:
- YAML syntax MUST be valid
- All referenced actions MUST exist in GitHub Actions Marketplace or be local
- Required status checks MUST be enabled in branch protection
- Environment (if specified) MUST exist in repository settings

**Example** (ally-check):
```json
{
  "name": "ally-check",
  "file_path": ".github/workflows/ally-check.yml",
  "triggers": ["pull_request"],
  "required_status_check": true,
  "timeout_minutes": 30,
  "jobs": [
    {
      "name": "accessibility-check",
      "runs_on": "ubuntu-latest",
      "steps": [
        "checkout",
        "setup-node",
        "install-deps",
        "run-axe-scan",
        "check-baseline",
        "report-results"
      ]
    }
  ],
  "permissions": {
    "contents": "read",
    "pull_requests": "read"
  },
  "status": "PENDING"
}
```

---

### 3. Branch Protection Rule Entity

**Name**: Branch Protection Rule  
**Purpose**: Enforce code quality, security, and review policies on protected branches (main, development)

**Fields**:
| Field | Type | Required | Validation Rules | Notes |
|-------|------|----------|------------------|-------|
| `branch` | String | Yes | Branch name pattern; e.g., "main" | Target branch to protect |
| `required_status_checks` | Array[String] | Yes | List of workflow job names that MUST pass | e.g., ["spec-check", "test-api", "codeql", "ally-check"] |
| `require_code_review` | Boolean | Yes | Minimum reviewers required | Typically 1 for main branch |
| `dismiss_stale_pr_approvals` | Boolean | No | Auto-dismiss reviews if PR is updated | Prevents outdated approvals |
| `require_branches_up_to_date` | Boolean | No | PR branch MUST be up to date before merge | Prevents merge conflicts |
| `enforce_admins` | Boolean | No | Admins must also pass all checks | For strict enforcement |
| `allow_force_push` | Boolean | No | Allow force push even when protected | False for main; use only in dev branches |
| `allow_deletions` | Boolean | No | Allow branch deletion | False for main; protects against accidents |
| `required_linear_history` | Boolean | No | Require linear Git history | No merge commits allowed |

**State Transitions**:
```
Unconfigured → Configured → Active → Enforced on all PRs
```

**Relationships**:
- One branch may have Multiple Rules
- Each rule references Multiple Status Checks (Workflows)
- Rules apply to All PRs targeting protected branch

**Validation**:
- All referenced status checks MUST exist as workflow jobs
- Cannot have conflicting rules (e.g., require_code_review=true + no reviewers)
- Branch name MUST exist in repository

**Example**:
```json
{
  "branch": "main",
  "required_status_checks": [
    "spec-check",
    "test-api",
    "codeql",
    "dependency-review",
    "ally-check"
  ],
  "require_code_review": true,
  "minimum_reviewers": 1,
  "dismiss_stale_pr_approvals": true,
  "require_branches_up_to_date": true,
  "enforce_admins": false,
  "allow_force_push": false,
  "allow_deletions": false,
  "required_linear_history": false
}
```

---

### 4. Test Coverage Configuration Entity

**Name**: Test Coverage Configuration  
**Purpose**: Define minimum test coverage thresholds per application to maintain code quality

**Fields**:
| Field | Type | Required | Validation Rules | Notes |
|-------|------|----------|------------------|-------|
| `app_name` | String | Yes | Unique per application | e.g., "api", "frontend", "cli" |
| `config_file` | String | Yes | vitest.config.js or vitest.config.ts | Location of config file |
| `provider` | Enum | Yes | "v8" (default) or "c8" | Coverage tool provider |
| `threshold_lines` | Integer (%) | Yes | 0-100; API: 70%, UI: 55% | Minimum lines coverage required |
| `threshold_statements` | Integer (%) | Yes | 0-100; API: 70%, UI: 55% | Minimum statement coverage |
| `threshold_functions` | Integer (%) | Yes | 0-100; API: 70%, UI: 55% | Minimum function coverage |
| `threshold_branches` | Integer (%) | Yes | 0-100; API: 70%, UI: 55% | Minimum branch coverage |
| `enabled` | Boolean | Yes | True to enforce; False to warn | Controls hard blocker behavior |
| `reporter_formats` | Array[String] | Yes | text, json, lcov, html, text-summary | Output formats for coverage reports |
| `reports_directory` | String | Yes | Path to store coverage reports | e.g., "./coverage" |
| `include_patterns` | Array[String] | Yes | File glob patterns to include in coverage | e.g., ["src/**/*.js"] |
| `exclude_patterns` | Array[String] | Yes | File glob patterns to exclude | e.g., ["**/*.test.js", "node_modules/**"] |

**State Transitions**:
```
Configured (default: warnings) → Baseline assessed → Thresholds hardened → Enforced as blocker
```

**Relationships**:
- One app has One Configuration
- Configuration referenced by CI workflow
- Thresholds may differ per app (API 70%, UI 55%)

**Validation**:
- Thresholds MUST be >= 0 and <= 100
- Include/exclude patterns MUST be valid glob syntax
- Reporter format MUST be supported by Vitest
- If enabled=true, current coverage MUST meet threshold or CI fails

**Example** (API):
```json
{
  "app_name": "api",
  "config_file": "./api/vitest.config.ts",
  "provider": "v8",
  "threshold_lines": 70,
  "threshold_statements": 70,
  "threshold_functions": 70,
  "threshold_branches": 70,
  "enabled": true,
  "reporter_formats": ["text", "lcov", "html", "json"],
  "reports_directory": "./coverage",
  "include_patterns": ["api/src/**/*.ts"],
  "exclude_patterns": [
    "**/node_modules/**",
    "**/dist/**",
    "**/*.test.ts",
    "**/*.spec.ts"
  ]
}
```

**Example** (Frontend):
```json
{
  "app_name": "frontend",
  "config_file": "./frontend/vitest.config.js",
  "provider": "v8",
  "threshold_lines": 55,
  "threshold_statements": 55,
  "threshold_functions": 55,
  "threshold_branches": 55,
  "enabled": true,
  "reporter_formats": ["text", "lcov", "html"],
  "reports_directory": "./coverage",
  "include_patterns": ["frontend/src/ui-*/**/*.js"],
  "exclude_patterns": [
    "**/node_modules/**",
    "**/dist/**",
    "**/e2e/**",
    "**/*.test.js"
  ]
}
```

---

### 5. GitHub Project Entity

**Name**: GitHub Project (Projects v2)  
**Purpose**: Track work items, PRs, and issues with custom metadata and automation

**Fields**:
| Field | Type | Required | Validation Rules | Notes |
|-------|------|----------|------------------|-------|
| `name` | String | Yes | Unique per organization | e.g., "Training Prince" |
| `description` | String | No | Free text; max 2000 chars | Project purpose and scope |
| `template` | Enum | No | table, board | View type; can have multiple |
| `fields` | Array[Object] | Yes | Custom field definitions | See below |
| `automations` | Array[Object] | No | Workflow automations | See below |
| `visibility` | Enum | Yes | "public" or "private" | Access control |
| `closed_status_values` | Array[String] | No | e.g., ["Done", "Archived"] | Statuses considered complete |

**Custom Fields** (Required for Training Prince):
| Field Name | Type | Values | Required | Purpose |
|------------|------|--------|----------|---------|
| Status | Single select | Not Started, In Progress, In Review, Done | Yes | Work item state |
| Priority | Single select | P0, P1, P2, P3 | Yes | Urgency ranking |
| Size | Single select | S, M, L, XL | Yes | Effort estimation |
| Spec URL | Text | URL string | Yes | Link to specification or Linear issue |
| Sprint/Chapter | Single select | Chapter 5, Chapter 6, etc. | Yes | Release grouping |

**Automations** (Configured):
| Automation | Trigger | Action | Status |
|-----------|---------|--------|--------|
| Auto-add | Issue/PR created | Add to project | ✅ Enabled |
| PR-to-Done | PR merged | Move to "Done" status | ✅ Enabled |
| Auto-archive | Item status = "Done" for 30d | Archive item | Optional |

**State Transitions**:
```
Created → Configured → Items added → Automated updates
```

**Relationships**:
- One Project has Many Issues
- One Project has Many PRs
- One Project has Multiple Custom Fields
- One Project has Multiple Automations

**Validation**:
- Project name MUST be unique
- All 5 required fields MUST be present
- Automations MUST be tested after configuration
- Custom field values MUST be consistent across items

**Example**:
```json
{
  "name": "Training Prince",
  "description": "Chapter 6 Next.js Frontend Development & Chapter 5 API FinishtoGreen",
  "template": "table",
  "fields": [
    {
      "name": "Status",
      "type": "single_select",
      "options": ["Not Started", "In Progress", "In Review", "Done"]
    },
    {
      "name": "Priority",
      "type": "single_select",
      "options": ["P0", "P1", "P2", "P3"]
    },
    {
      "name": "Size",
      "type": "single_select",
      "options": ["S", "M", "L", "XL"]
    },
    {
      "name": "Spec URL",
      "type": "text"
    },
    {
      "name": "Sprint/Chapter",
      "type": "single_select",
      "options": ["Chapter 5", "Chapter 6"]
    }
  ],
  "automations": [
    {
      "name": "Auto-add",
      "trigger": "issue_created",
      "action": "add_to_project",
      "enabled": true
    },
    {
      "name": "PR-to-Done",
      "trigger": "pull_request_merged",
      "action": "move_to_status",
      "target_status": "Done",
      "enabled": true
    }
  ],
  "visibility": "public"
}
```

---

### 6. Accessibility Baseline Entity

**Name**: Accessibility Baseline  
**Purpose**: Store known/acceptable accessibility violations; ay-check only fails on NEW violations

**Fields**:
| Field | Type | Required | Validation Rules | Notes |
|-------|------|----------|------------------|-------|
| `baseline_date` | ISO8601 Date | Yes | YYYY-MM-DD format | When baseline was established |
| `baseline_version` | String | Yes | Semantic versioning; starts at "1.0.0" | Track baseline changes over time |
| `violations` | Array[Object] | Yes | Array of known violations | See below |
| `documentation` | String | Yes | Explanation of known issues and remediation plan | Link to tracking issue if applicable |
| `scan_tool` | String | Yes | "axe-core", "axe-playwright", etc. | Tool used for scanning |
| `scan_pages` | Array[String] | Yes | List of pages/routes scanned | e.g., ["/", "/about", "/contact"] |

**Violation Entry** (each item in violations array):
| Field | Type | Value | Notes |
|-------|------|-------|-------|
| `id` | String | Unique ID from axe | e.g., "color-contrast" |
| `description` | String | Human-readable issue description | From axe violation description |
| `impact` | Enum | "minor", "moderate", "serious", "critical" | Severity level |
| `instances` | Integer | Count of instances found | e.g., 5 |
| `remediation_plan` | String | How/when this will be fixed | e.g., "Schedule 026-accessibility-remediation" |
| `responsible_team` | String | Team/person tracking fix | e.g., "DevSecOps" |
| `due_date` | ISO8601 Date | Target fix date | e.g., "2025-12-01" |

**State Transitions**:
```
Baseline established (Day 0) → Tracked (violations logged) → Fixed (removed from baseline)
```

**Validation**:
- Baseline date MUST be after branch creation
- Each violation MUST have unique ID
- Impact MUST be one of the 4 severity levels
- Remediation plan MUST reference tracking issue or ticket

**Example**:
```json
{
  "baseline_date": "2025-11-18",
  "baseline_version": "1.0.0",
  "scan_tool": "axe-core",
  "scan_pages": ["/", "/about", "/contact", "/api-docs"],
  "documentation": "Chapter 6 Day 0 accessibility baseline. Known issues tracked in GitHub Issues and Linear. Remediation scheduled for Chapter 6 Day 2.",
  "violations": [
    {
      "id": "color-contrast",
      "description": "Text contrast ratio is too low (2.5:1 instead of 4.5:1)",
      "impact": "serious",
      "instances": 3,
      "remediation_plan": "Update CSS color variables in src/ui-theme",
      "responsible_team": "DevSecOps",
      "due_date": "2025-12-05"
    },
    {
      "id": "image-alt",
      "description": "Image missing alt text",
      "impact": "critical",
      "instances": 1,
      "remediation_plan": "Add alt text to hero image",
      "responsible_team": "Frontend",
      "due_date": "2025-11-30"
    }
  ]
}
```

---

## Review Packet Artifact Entity

**Name**: Review Packet  
**Purpose**: Unified, single-entry-point artifact for coverage, test results, and project evidence

**Fields**:
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `artifact_name` | String | Yes | "review-packet" |
| `entry_point` | File | Yes | review-artifacts/index.html (main index) |
| `sections` | Array[Object] | Yes | Organized sections (see below) |
| `generation_date` | ISO8601 Datetime | Yes | When artifact was built |
| `commit_sha` | String | Yes | Git commit SHA of artifacts |
| `branch` | String | Yes | Branch name (e.g., "025-chapter-6-day-0") |

**Sections** (included in index.html):
| Section | Content | Status | Notes |
|---------|---------|--------|-------|
| Coverage Index | Links to backend/UI coverage reports | ✅ Existing | Points to lcov reports |
| Test Results | E2E smoke test report (Playwright) | ✅ Existing | test-results/smoke-test-report.html |
| API Documentation | Link to live API docs on GitHub Pages | 🔄 To Add | Verify URL + add link |
| Projects Evidence | Link/screenshot of GitHub Projects board | 🔄 To Add | Demonstrate configured fields + automations |
| Chapter 6 UI Assets | Placeholder section for UI reports | ⚠️ Placeholder | To be populated in future PRs |
| Metadata | Environment, Node version, coverage summary | ✅ Existing | review-artifacts/review.md |

**Validation**:
- Entry point (index.html) MUST be valid HTML
- All links MUST be resolvable or clearly marked as "Coming Soon"
- Coverage reports MUST be generated and linked
- Projects evidence MUST be current (not stale screenshots)

**Example Structure**:
```
review-artifacts/
├── index.html                           # Main entry point
├── review.md                            # Metadata + summary
├── coverage/
│   ├── backend/
│   │   └── index.html                   # API coverage report
│   └── ui/
│       └── index.html                   # Frontend coverage report
├── test-results/
│   └── smoke-test-report.html          # Playwright E2E results
└── evidence/
    ├── projects-board.png              # Screenshot or link
    └── api-docs-link.md                # Verification of GitHub Pages
```

---

## Entity Relationships Diagram

```
┌─────────────────────────────────────┐
│ Git Tag (chapter5-complete)         │
│ ├─ Marks final Chapter 5 commit     │
│ └─ Published to GitHub Releases     │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│ Branch Protection Rule (main)       │
│ ├─ Requires status checks:          │
│ │  ├─ spec-check                    │
│ │  ├─ test-api                      │
│ │  ├─ codeql                        │
│ │  ├─ dependency-review             │
│ │  └─ ally-check (NEW)              │
│ └─ Enforces code review             │
└─────────────────────────────────────┘
         ↑                    ↑
    references           requires
         │                    │
         └────────┬───────────┘
                  ↓
    ┌─────────────────────────────────┐
    │ GitHub Actions Workflow         │
    ├─ ally-check.yml (NEW)           │
    ├─ test-api.yml (existing)        │
    ├─ api-checks.yml (existing)      │
    └─ spec-check.yml (existing)      │
                  │
         consumes │ coverage reports
                  ↓
    ┌─────────────────────────────────┐
    │ Test Coverage Configuration     │
    ├─ API: 70% thresholds            │
    ├─ UI: 55% thresholds             │
    └─ Enforced as hard blocker       │
                  │
         generates │ reports
                  ↓
    ┌─────────────────────────────────┐
    │ Review Packet Artifact          │
    ├─ Coverage Index (HTML)          │
    ├─ Test Results (Playwright)      │
    ├─ API Docs Link (GH Pages)       │
    ├─ Projects Evidence              │
    └─ Chapter 6 UI Assets (placeholder)
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ GitHub Project (Training Prince)    │
│ ├─ Fields: Status, Priority, Size   │
│ ├─ Spec URL, Sprint/Chapter         │
│ └─ Automations: auto-add, PR-to-Done│
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Accessibility Baseline              │
│ ├─ Known violations (ally-check)    │
│ ├─ Baseline version: 1.0.0          │
│ └─ Only NEW violations fail CI      │
└─────────────────────────────────────┘
```

---

## Data Persistence & Storage

**Note**: This feature is **configuration-only** and has no traditional data persistence beyond:

1. **Git artifacts**: Tags, commits, branch protection rules (stored in Git & GitHub)
2. **Workflow files**: YAML definitions (stored in `.github/workflows/`)
3. **Config files**: vitest.config.js, ally-check-baseline.json (stored in repository)
4. **Documentation**: README.md, SECURITY.md, research.md, plan.md (stored in repository)

All data is stored in version control or GitHub repository settings (no database, external storage, or APIs).

---

## Constitution Alignment

**All entities align with Hello-World UI Initiative Constitution (v1.1.0)**:

✅ **Reviewability is Paramount**: Coverage reports consolidated in Review Packet; single entry point (index.html)  
✅ **Test Coverage Mandate**: Thresholds enforced (API 70%, UI 55%) as hard blockers  
✅ **PR Craft**: Branch protection requires all checks + code review  
✅ **Simplicity & Consistency**: Uses existing tech stack (Vitest, GitHub Actions, git)  
✅ **No Logic Duplication**: Configuration-only; no business logic reimplemented  

---

**Data Model Status**: ✅ COMPLETE  
**Ready for Phase 1: Contracts & Quickstart**
