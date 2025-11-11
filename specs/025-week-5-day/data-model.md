# Data Model & Entities: Week 5 Day-0

**Branch**: `025-week-5-day` | **Date**: November 6, 2025  
**Purpose**: Define all entities, relationships, and validation rules for D0 infrastructure

---

## Entity: GitHub Project Configuration

**Purpose**: Container for tracking work items with custom fields and automation

**Fields**:

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| id | UUID | Yes | Project identifier (auto-generated) | `PRJ_123abc` |
| name | String | Yes | Human-readable project name | "Week 5 Day-0" |
| description | String | No | Project summary | "Final hygiene and GitHub Projects migration" |
| visibility | Enum | Yes | Public or private | "private" |
| team_members | Array[String] | Yes | GitHub usernames with access | ["alice", "bob", "charlie"] |
| created_at | Timestamp | Yes | Creation timestamp | `2025-11-06T10:30:00Z` |
| custom_fields | Array[CustomField] | Yes | Field definitions (see below) | (see Custom Fields) |
| automation_rules | Array[AutomationRule] | Yes | Automation triggers (see below) | (see Automation Rules) |

**Custom Fields** (nested):

| Field | Type | Options | Used For |
|-------|------|---------|----------|
| Status | SingleSelect | "Backlog", "Todo", "In Progress", "In Review", "Done" | Workflow state |
| Priority | SingleSelect | "P0/Critical", "P1/High", "P2/Medium", "P3/Low" | Issue importance |
| Size | SingleSelect | "XS", "S", "M", "L", "XL" | Story points/effort |
| Spec URL | Text | (free text) | Link to specification |
| Sprint/Week | SingleSelect | "Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 5 Day-0" | Release cycle |

**Automation Rules** (nested):

| Trigger | Action | Condition | Example |
|---------|--------|-----------|---------|
| issue.opened | auto-add | Always | New issues auto-added to project |
| pull_request.opened | auto-add | Always | New PRs auto-added to project |
| pull_request.opened | set_status | Always | Set Status to "In Review" |
| pull_request.closed | set_status | merged == true | Set Status to "Done" |

**Validation Rules**:
- `name` must not be empty
- `custom_fields` must include all 5 required fields (Status, Priority, Size, Spec URL, Sprint/Week)
- `automation_rules` must include all 4 core automation triggers
- `visibility` must be "private" (security requirement)
- `team_members` must include all active maintainers

**Relationships**:
- Links to GitHub repository (one-to-many: one repo can have multiple projects)
- Links to GitHub Issues (many-to-many: issues belong to one or more projects)
- Links to GitHub PRs (many-to-many: PRs belong to one or more projects)

---

## Entity: Branch Protection Rule

**Purpose**: Enforce code quality gates before merge to main

**Fields**:

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| branch_name_pattern | String | Yes | Git branch name or pattern | "main" |
| required_status_checks | Array[String] | Yes | Status check names (must pass) | ["spec-check", "Test & Coverage - API", "Playwright Smoke", "CodeQL", "Dependency Review"] |
| strict_mode | Boolean | Yes | Require branch to be up-to-date before merge | true |
| allow_admins_bypass | Boolean | No | Allow repo admins to bypass checks | false |
| allow_force_pushes | Boolean | No | Allow force pushes to this branch | false |
| allow_deletions | Boolean | No | Allow branch deletion | false |
| require_linear_history | Boolean | No | Require all commits to be reachable from PR base | false |
| created_at | Timestamp | Yes | When rule was created | `2025-11-06T10:30:00Z` |
| updated_at | Timestamp | Yes | Last modification timestamp | `2025-11-06T10:30:00Z` |

**Status Checks** (required array values):

| Check Name | Workflow | Purpose |
|------------|----------|---------|
| spec-check | `.github/workflows/spec-check.yml` | Validates specification format/completeness |
| Test & Coverage - API | `.github/workflows/api-checks.yml` | API tests + coverage reporting (60% threshold) |
| Playwright Smoke | `.github/workflows/playwright.yml` | End-to-end smoke tests |
| CodeQL | `.github/workflows/codeql.yml` | Static security analysis |
| Dependency Review | GitHub native workflow | Supply chain security scanning |

**Validation Rules**:
- `branch_name_pattern` must be non-empty
- `required_status_checks` must include ALL 5 checks (no substitutions)
- `strict_mode` must be true (up-to-date requirement)
- `allow_admins_bypass` should be false (except for critical hotfixes)
- `allow_force_pushes` must be false (prevent history rewriting on main)
- No more than one rule per branch (prevent conflicts)

**Relationships**:
- Applies to exactly one branch on the repository (main)
- Does not apply to development or feature branches
- Each required status check must exist in `.github/workflows/`

---

## Entity: CI Workflow & Artifacts

**Purpose**: Configure and validate continuous integration checks

**Fields**:

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| workflow_name | String | Yes | Workflow identifier | "spec-check" |
| file_path | String | Yes | Path to workflow file | ".github/workflows/spec-check.yml" |
| trigger | Enum | Yes | When workflow runs | "push_to_pr", "schedule", "manual" |
| status_check_name | String | Yes | Name in branch protection | "spec-check" |
| artifacts_generated | Array[String] | No | Output artifact paths | ["review-artifacts/coverage/", "review-artifacts/playwright-report/"] |
| artifact_validation | Object | Yes | How to validate output (see below) | (see Artifact Validation) |
| created_at | Timestamp | Yes | Workflow creation date | `2025-11-06T10:30:00Z` |

**Artifact Validation** (nested):

| Workflow | Artifact Type | Validation |
|----------|---------------|-----------|
| api-checks.yml | coverage.json | Must have: statements, branches, functions, lines >= 60% for each suite |
| api-checks.yml | coverage/index.html | Human-readable coverage report |
| playwright.yml | playwright-report/ | Directory must contain index.html + trace/video files |
| | openapi.html | Static HTML file (valid HTML5 syntax) |
| | CHANGELOG.md | Markdown file with user-facing changes |

**Coverage Thresholds**:
```
Lines:        >= 60%
Branches:     >= 60%
Functions:    >= 60%
Statements:   >= 60%
```

**Suite Inclusion** (for vitest.config.js):
- ui-expense: `src/components/Expense/**`
- ui-stopwatch: `src/components/Stopwatch/**`
- ui-temp: `src/components/Temperature/**`
- ui-todo: `src/components/Todo/**`
- ui-quote: `src/components/Quote/**`

**Validation Rules**:
- All 5 required workflows must exist in `.github/workflows/`
- Each workflow must produce a status check (required for branch protection)
- Coverage thresholds must be enforced by vitest.config.js
- Artifact generation must complete in < 10 minutes
- All artifact files must be present before packaging

**Relationships**:
- Each workflow produces one or more artifacts
- Artifacts feed into review-packet/index.html
- Status checks feed into branch protection rules

---

## Entity: Review Artifact Package

**Purpose**: Curated collection of all reviewable outputs for a release

**Files & Structure**:

```
review-artifacts/
├── index.html              [GENERATED] Entry point with links to all sections
├── coverage/
│   ├── index.html          [FROM vitest] Coverage report HTML
│   ├── coverage.json       [FROM vitest] Coverage data (JSON)
│   └── (coverage files)    [FROM vitest] Detailed per-file coverage
├── playwright-report/
│   ├── index.html          [FROM playwright] Test results HTML
│   ├── index.json          [FROM playwright] Test metadata
│   └── (traces, videos)    [FROM playwright] Test execution traces
├── openapi.html            [GENERATED/STATIC] API documentation
├── CHANGELOG.md            [LINKED] Release notes
└── metadata.json           [GENERATED] Artifact manifest with verification checksums
```

**Fields**:

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| version | String | Yes | Release version (matches git tag) | "week5-day0" |
| generated_at | Timestamp | Yes | Generation timestamp | `2025-11-06T11:00:00Z` |
| files | Array[File] | Yes | All included files (see File object) | (see below) |
| checksums | Object | Yes | SHA256 of critical files | `{"coverage.json": "abc123..."}` |
| links | Object | Yes | Links to all sections (see Links object) | (see below) |
| verification_status | Enum | Yes | Package integrity status | "VALID" or "INVALID" |

**File Object** (nested):

| Field | Type | Example |
|-------|------|---------|
| path | String | "coverage/index.html" |
| size_bytes | Number | 125432 |
| sha256 | String | "abc123def456..." |
| exists | Boolean | true |

**Links Object** (nested):

| Link | URL | Purpose |
|------|-----|---------|
| coverage | ./coverage/index.html | Full coverage breakdown by file |
| playwright | ./playwright-report/index.html | Test results with traces |
| api_docs | ./openapi.html | API specification |
| changelog | ./CHANGELOG.md | Release notes |

**Validation Rules**:
- All files in manifest must exist before marking as VALID
- All checksums must match actual files
- Total package size must be < 50MB
- All links must be relative paths (not absolute)
- Generated at timestamp must be recent (< 1 hour old)

**Generation Workflow**:
1. Run vitest with coverage → generates coverage/
2. Run playwright tests → generates playwright-report/
3. Verify openapi.html exists
4. Verify CHANGELOG.md exists
5. Generate index.html with all links
6. Create metadata.json with checksums
7. Validate all files present
8. Mark as VALID if all checks pass

**Relationships**:
- Generated during CI workflow (on every push to main)
- Referenced in README.md as the main entry point for reviewers
- Packaged as GitHub Actions artifact for download by maintainers

---

## Entity: Issue Template

**Purpose**: Guide contributors on creating feature requests and bug reports

**Fields**:

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| template_name | String | Yes | Template file (without .md) | "feature" or "bug" |
| file_path | String | Yes | Location in repo | ".github/ISSUE_TEMPLATE/feature.md" |
| frontmatter | Object | Yes | YAML metadata (name, about, labels) | (see below) |
| sections | Array[Section] | Yes | Markdown sections user fills out | (see Section object) |
| validation_rules | Array[String] | Yes | What must be filled before submission | (see Validation Rules) |
| created_at | Timestamp | Yes | Template creation date | `2025-11-06T10:30:00Z` |

**Frontmatter Object**:

```yaml
name: "Feature Request"  # Display name in template selector
about: "Suggest a new feature"  # Help text
title: "[FEATURE] "  # Prefix for auto-filled title
labels: ["feature"]  # Auto-assigned labels
```

**Section Object** (nested):

| Section | Type | Required | Content |
|---------|------|----------|---------|
| Description | Text | Yes | Brief description of the feature/bug |
| Problem Statement / Reproduction Steps | Text | Yes | Context or how to reproduce |
| Acceptance Criteria / Expected Behavior | Checklist | Yes | Definition of done or expected behavior |
| Related Links | Text | No | Links to spec, issue, or discussion |
| Additional Context | Text | No | Mockups, logs, or extra details |

**Validation Rules**:

For Feature template:
- Description must not be empty
- Acceptance Criteria must have at least 1 checkbox
- At least one of (Problem Statement, Related Links) must be filled

For Bug template:
- Description must not be empty
- Reproduction Steps must have at least 1 step
- Expected Behavior must be filled
- Environment (browser/OS) should be filled

**Relationships**:
- Templates are stored in `.github/ISSUE_TEMPLATE/`
- GitHub automatically offers templates when creating new issues
- Templates are optional (users can ignore and create blank issues)
- Multiple templates can coexist (feature.md, bug.md, chore.md, etc.)

---

## Entity: Pull Request Template

**Purpose**: Standardize PR submissions with mandatory fields for traceability

**Fields**:

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| file_path | String | Yes | Location in repo | ".github/pull_request_template.md" |
| sections | Array[Section] | Yes | Markdown sections user fills out | (see below) |
| mandatory_fields | Array[String] | Yes | Fields that must be completed | ["Spec URL", "Checks", "CHANGELOG Updated"] |
| guidance_text | Object | Yes | Hints for each section | (see Guidance Text) |
| created_at | Timestamp | Yes | Template creation date | `2025-11-06T10:30:00Z` |

**Sections**:

| Section | Type | Required | Content | Purpose |
|---------|------|----------|---------|---------|
| Spec URL | Text | Yes | Link to feature spec or Linear issue | Traceability |
| Contract Tests | Checklist | Yes | Verify tests added/passing | Quality gate |
| Changes Made | Text | Yes | Brief description of implementation | Context |
| Checks | Checklist | Yes | Verify CI, coverage, E2E, CodeQL passing | Quality gate |
| CHANGELOG Updated | Checkbox | Yes | Confirm user-facing changes documented | Release notes |
| Breaking Changes | Checkbox | No | Document any API/UI breaking changes | Communication |
| Related Issues | Text | No | Links to issues this PR closes | Linking |

**Guidance Text** (nested):

```markdown
### Spec URL
[Link to the feature specification this PR implements. Leave blank only for housekeeping PRs.]

### Contract Tests
[Ensure contract tests exist and are passing. If new contracts were added, verify they're defined.]

### Checks
[This section requires all CI checks to pass. Don't merge until GitHub shows all green.]
- [ ] Local tests passing (`npm run test`)
- [ ] Coverage meets thresholds (`npm run test:coverage`)
- [ ] E2E tests passing (`npm run test:e2e`)
- [ ] CodeQL passing
- [ ] Dependency Review passing

### CHANGELOG Updated
[Include user-facing changes in CHANGELOG.md. Use existing format (## [Version] - YYYY-MM-DD).]
```

**Validation Rules**:
- Spec URL must contain at least one URL or note it's a housekeeping PR
- Contract Tests must have at least one checkbox checked
- Checks section must have all boxes marked before merge approval
- CHANGELOG Updated must be marked true for feature/bug PRs
- PR cannot be merged if mandatory fields are incomplete (enforced via PR review policy)

**Relationships**:
- Applies to all PRs targeting main branch
- Complements branch protection rules (checks are automated; template is manual guidance)
- Links PRs to specifications and Linear/GitHub issues for traceability

---

## Entity: Git Tag

**Purpose**: Mark release milestones and enable easy reference

**Fields**:

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| tag_name | String | Yes | Tag identifier (release marker) | "week5-day0" |
| commit_sha | String | Yes | Commit being tagged | "abc123def456..." |
| created_at | Timestamp | Yes | Tag creation timestamp | `2025-11-06T11:30:00Z` |
| message | String | Yes | Annotated tag message | "Week 5 Day-0 release - GitHub Projects migration complete" |
| author | String | Yes | GitHub username who created tag | "alice" |
| signed | Boolean | No | Whether tag is GPG-signed | false |

**Naming Convention**:
- Format: `week{N}-day{D}` or `week{N}-finisher`
- Example: "week5-day0", "week5-finisher", "week4-day2"
- All lowercase, no spaces, hyphen-separated

**Validation Rules**:
- Tag must point to main branch (not development or feature branches)
- Tag must be created after squash merge (not before)
- Tag message must be descriptive (include what was merged/completed)
- Tag name must follow naming convention (enable pattern matching for scripts)

**Relationships**:
- Created on main branch after merge
- Linked to a specific release/milestone
- Used by CI to trigger deployment, changelog generation, or versioning

---

## Validation & Integrity Checks

**Cross-Entity Validation**:

1. **Project Status Match**:
   - GitHub Project custom field values must align with PR/Issue status updates
   - If PR Status in project is "In Review", PR must exist and be open
   - If PR Status in project is "Done", PR must be merged

2. **Branch Protection Consistency**:
   - All required status checks in branch protection rules must have workflows
   - All workflows must produce the status check name
   - No required status check can be skipped or manually bypassed

3. **Artifact Package Completeness**:
   - All files referenced in review-artifacts/index.html must exist
   - All links in index.html must resolve (no 404s)
   - Coverage data must match Vitest configuration (same thresholds)

4. **Template Syntax**:
   - Issue templates must have valid Markdown syntax (GitHub parser can parse)
   - PR template must not contain broken links
   - Both templates must render correctly in GitHub UI

5. **Merge Finalization**:
   - Squash merge must occur AFTER all D0.1-1.3 tasks are complete
   - Git tag week5-day0 must exist on main branch
   - README.md must point to review-artifacts/index.html
   - No stray files remaining on main branch

---

*Data model complete. Ready to proceed to Phase 1 contract generation.*


