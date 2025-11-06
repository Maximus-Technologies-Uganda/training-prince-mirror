# Contracts Index: Week 5 Day-0

**Branch**: `025-week-5-day` | **Date**: November 6, 2025  
**Purpose**: Define the contract specifications for all D0 systems

---

## Contracts Overview

This directory contains formal contract definitions for each D0 subsystem. Contracts define the interface, inputs, outputs, and success criteria for each system component.

---

## Contract 1: Branch Protection Rules Configuration

**File**: `branch-protection-setup.contract.md`  
**Purpose**: Define the configuration contract for GitHub branch protection rules

**Contract Scope**:
- Branch: `main`
- Required status checks: 5 (exact names must match)
- Strict mode: Enabled
- Force pushes: Disabled
- Deletions: Disabled

**Inputs**:
- Repository owner and name
- List of 5 status check names (from workflows)

**Outputs**:
- Branch protection rule applied to main
- All 5 checks marked as required
- Development branch remains unprotected

**Success Criteria**:
- PR cannot be merged to main without all checks passing
- Required checks are visible in PR status
- Legitimate PRs can still merge (no false blocks)

**Failure Scenarios**:
- Status check name doesn't match workflow output → Merge stuck
- Missing one of the 5 checks → Incomplete protection
- Force push allowed → Security vulnerability

---

## Contract 2: GitHub Project Custom Fields

**File**: `github-project-setup.contract.md`  
**Purpose**: Define the configuration contract for GitHub Project custom fields

**Contract Scope**:
- Project: Week 5 Day-0 (GitHub Projects new format)
- 5 custom fields required
- Auto-add issues/PRs automation
- Status update automation on PR events

**Custom Fields Definition**:

| Field | Type | Options | Default |
|-------|------|---------|---------|
| Status | SingleSelect | Backlog, Todo, In Progress, In Review, Done | Backlog |
| Priority | SingleSelect | P0/Critical, P1/High, P2/Medium, P3/Low | P2/Medium |
| Size | SingleSelect | XS, S, M, L, XL | M |
| Spec URL | Text | Any URL | (none) |
| Sprint/Week | SingleSelect | Week 1-5, Week 5 Day-0 | Week 5 Day-0 |

**Inputs**:
- Project configuration (name, description, visibility)
- Custom field definitions (names, types, options)
- Automation triggers (events, actions)

**Outputs**:
- Project created and accessible
- All 5 custom fields configurable
- Automation rules active

**Success Criteria**:
- New issues auto-add to project
- New PRs auto-add to project
- PR Status set to "In Review" on open
- PR Status set to "Done" on merge
- All custom fields visible and sortable in project view

**Failure Scenarios**:
- Custom field missing → Project incomplete
- Automation not triggered → Manual updates required
- Status updates not working → Project state out-of-sync with GitHub

---

## Contract 3: Vitest Coverage Thresholds

**File**: `vitest-coverage-thresholds.contract.md`  
**Purpose**: Define the coverage enforcement contract for Vitest

**Contract Scope**:
- Minimum thresholds: 60% across all metrics (lines, branches, functions, statements)
- Include paths: 5 UI suites (Expense, Stopwatch, Temp, Todo, Quote)
- Exclude paths: node_modules, dist, test files

**Configuration Contract**:
```
lines:       >= 60%
branches:    >= 60%
functions:   >= 60%
statements:  >= 60%
```

**Inputs**:
- vitest.config.js configuration
- Test suite with coverage collection enabled

**Outputs**:
- Coverage report (HTML and JSON)
- Console message: "Coverage thresholds met" or failure
- Non-zero exit code if thresholds not met

**Success Criteria**:
- `npm run test:coverage` completes successfully
- All metrics >= 60% for all included paths
- Coverage reports generated and accessible
- CI check "Test & Coverage - API" passes

**Failure Scenarios**:
- Coverage < 60% → CI fails, PR merge blocked
- Include path missing a suite → Incomplete coverage reporting
- Threshold not enforced in vitest.config.js → Coverage not mandatory

---

## Contract 4: Review Packet Artifact Generation

**File**: `review-packet-generation.contract.md`  
**Purpose**: Define the artifact generation and packaging contract

**Contract Scope**:
- Entry point: review-artifacts/index.html
- Linked resources: coverage, Playwright reports, OpenAPI docs, changelog
- Artifact size: < 50MB
- Generation time: < 10 minutes

**Artifact Structure**:
```
review-artifacts/
├── index.html              (entry point with all links)
├── coverage/index.html     (from Vitest)
├── playwright-report/index.html  (from Playwright)
├── openapi.html            (API documentation)
└── CHANGELOG.md            (or link)
```

**Inputs**:
- Vitest coverage report (coverage.json)
- Playwright test results (playwright-report)
- OpenAPI specification (openapi.html)
- CHANGELOG.md file

**Outputs**:
- index.html with relative links to all resources
- All linked files verified to exist
- Total package size reported

**Success Criteria**:
- All 4 links present in index.html
- All linked files exist and are accessible
- Links are relative (not absolute) for portability
- Package can be viewed offline
- Total size < 50MB

**Failure Scenarios**:
- Missing coverage report → Link broken
- Playwright report not generated → Link 404
- Links are absolute paths → Doesn't work after download
- File size > 50MB → Too large to distribute

---

## Contract 5: Issue Templates Validation

**File**: `issue-templates-validation.contract.md`  
**Purpose**: Define the contract for issue template creation and parsing

**Contract Scope**:
- Templates: feature.md, bug.md
- Location: .github/ISSUE_TEMPLATE/
- Format: Markdown with YAML frontmatter

**Template Contracts**:

**feature.md**:
- Frontmatter: name, about, title, labels
- Sections: Description, Problem Statement, Proposed Solution, Acceptance Criteria, Related Links, Additional Context
- Required: Description, Acceptance Criteria (must have >= 1 checkbox)

**bug.md**:
- Frontmatter: name, about, title, labels
- Sections: Description, Reproduction Steps, Expected Behavior, Actual Behavior, Environment, Screenshots/Logs
- Required: Description, Reproduction Steps (>= 1), Expected Behavior, Actual Behavior

**Inputs**:
- Template markdown file
- YAML frontmatter (optional)

**Outputs**:
- Template appears in "New Issue" selector
- Template pre-fills issue description
- User can complete form and submit

**Success Criteria**:
- Templates valid Markdown (no syntax errors)
- Templates appear in GitHub issue creation UI
- Template contents display correctly
- YAML frontmatter parsed without errors
- Issue created from template has expected structure

**Failure Scenarios**:
- Invalid YAML → Template not parsed
- File path incorrect → Template not found
- Markdown syntax error → Template fails to render
- Labels referenced don't exist → UI shows error

---

## Contract 6: Pull Request Template Validation

**File**: `pull-request-template-validation.contract.md`  
**Purpose**: Define the contract for PR template creation and usage

**Contract Scope**:
- Template: pull_request_template.md
- Location: .github/ (root of .github directory)
- Format: Markdown
- Mandatory sections: Spec URL, Contract Tests, Checks, CHANGELOG Updated

**PR Template Sections**:
- Spec URL (required, must contain link or "housekeeping")
- Contract Tests (required, >= 1 checkbox)
- Changes Made (required, >= 1 line)
- Checks (required, >= 1 checkbox marked)
- CHANGELOG Updated (required, checkbox)
- Breaking Changes (optional)
- Related Issues (optional)

**Inputs**:
- PR template markdown file
- PR creation form in GitHub

**Outputs**:
- Template auto-fills PR description on creation
- User completes mandatory fields
- PR summary shows completed sections

**Success Criteria**:
- Template auto-loads when creating PR to main
- All sections visible and editable
- Template has clear guidance text for each section
- PR cannot be merged without mandatory sections completed (enforced via review process)

**Failure Scenarios**:
- Template file not at .github/pull_request_template.md → Not used
- Invalid Markdown → Template renders incorrectly
- Missing mandatory sections → Contributors create inconsistent PRs
- Links to undefined labels → PR submission fails

---

## Contract 7: Squash Merge & Tagging

**File**: `squash-merge-tagging.contract.md`  
**Purpose**: Define the contract for the final merge and release tagging

**Contract Scope**:
- Merge type: Squash (not regular merge)
- Source: development branch
- Target: main branch
- Tag: week5-day0 (annotated)

**Merge Contract**:
- All D0 tasks completed before merge
- Commit message descriptive and comprehensive
- development branch fully up-to-date
- main branch unmodified (no new commits)

**Inputs**:
- development branch with all changes
- main branch clean and current
- git user configured (name, email)

**Outputs**:
- Single squashed commit on main
- Commit message includes D0 summary
- Tag week5-day0 points to commit
- Both pushed to origin

**Success Criteria**:
- `git log main --oneline | head -1` shows "Week 5 Day-0" commit
- `git tag -l | grep week5-day0` returns the tag
- `git show week5-day0` shows full commit details
- Tag pushed to origin (`git ls-remote origin | grep week5-day0`)

**Failure Scenarios**:
- Merge not squashed → Multiple commits pollute main history
- Tag not created → No release marker
- development behind origin → Stale changes not included
- Commit message incomplete → Future maintainers lack context

---

## Implementation Order

Contracts should be implemented in this order to respect dependencies:

1. ✅ **Branch Protection Rules** (D0.2) → Must exist before PR testing
2. ✅ **Vitest Coverage Thresholds** (D0.3) → Must exist before PR testing
3. ✅ **Review Packet Generation** (D0.4) → Can run independently
4. ✅ **GitHub Project Setup** (1.1) → Can run independently
5. ✅ **Issue Templates** (1.2) → Can run independently
6. ✅ **PR Template** (1.3) → Can run independently
7. ✅ **Squash Merge & Tagging** (finalization) → Must be last after all others verified

---

## Contract Validation Tests

Each contract should have corresponding failing tests (initially) that verify compliance:

### Test: Branch Protection Rules
```typescript
describe("Branch Protection Rules", () => {
  it("main branch requires spec-check status check", async () => {
    // Query GitHub API for branch protection rules
    // Assert spec-check in required_status_checks
  });
  
  it("main branch requires all 5 status checks", async () => {
    // Assert array length === 5
    // Assert all check names present
  });
});
```

### Test: GitHub Project Custom Fields
```typescript
describe("GitHub Project Custom Fields", () => {
  it("project has Status custom field with 5 options", async () => {
    // Query project fields
    // Assert Status field exists
    // Assert options include: Backlog, Todo, In Progress, In Review, Done
  });
});
```

### Test: Vitest Coverage
```typescript
describe("Vitest Coverage Thresholds", () => {
  it("enforces 60% coverage threshold on lines", async () => {
    // Run vitest coverage
    // Assert lines >= 60%
  });
  
  it("includes all 5 UI suites", async () => {
    // Parse vitest.config.js include paths
    // Assert Expense, Stopwatch, Temp, Todo, Quote all present
  });
});
```

### Test: Review Packet
```typescript
describe("Review Packet Generation", () => {
  it("generates index.html with all 4 links", async () => {
    // Parse review-artifacts/index.html
    // Assert links to coverage, playwright, openapi, changelog
  });
  
  it("all linked files exist", async () => {
    // Check file existence for all links
  });
});
```

---

## Summary

All 7 contracts are defined and ready for implementation. Each contract specifies:
- What the system must do (Outputs)
- How to verify success (Success Criteria)
- What indicates failure (Failure Scenarios)

Implementation teams should refer to these contracts while building to ensure compliance.

---

*Contracts complete. Ready for task generation phase.*

