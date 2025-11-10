# Implementation Plan: Week 5 Day-0: Final Hygiene & Migration to GitHub Projects

**Branch**: `025-week-5-day` | **Date**: November 6, 2025 | **Spec**: `/specs/025-week-5-day/spec.md`  
**Input**: Feature specification from `/specs/025-week-5-day/spec.md`

---

## Summary

**Primary Objective**: Complete all Day 0 repository setup tasks to transition from Linear-based project management to GitHub Projects while ensuring main branch is production-ready with comprehensive CI checks.

**Technical Approach**:
1. Clean and prepare main branch (README updates, stray file removal)
2. Configure GitHub branch protection rules with 5 required status checks
3. Verify Vitest coverage thresholds (60% minimum) and review-packet artifact generation
4. Create GitHub Project with custom fields and automation rules
5. Establish standardized issue/PR templates for contributor onboarding
6. Validate all systems are operational before merging development → main

---

## Technical Context

**Language/Version**: Bash, YAML (GitHub Actions), TypeScript/JavaScript (Vitest, Node.js), Markdown  
**Primary Dependencies**: GitHub Actions, GitHub API (Projects), Vitest 8.x, Playwright, CodeQL, Dependency Review  
**Storage**: Git repository + GitHub (no external databases)  
**Testing**: Vitest (unit/coverage), Playwright (e2e), Contract tests (via GitHub Actions)  
**Target Platform**: Linux (CI runners), macOS/Windows (local development)  
**Project Type**: Web application (frontend + backend/api)  
**Performance Goals**: Individual CI checks must complete within 15 minutes; total D0 execution including manual UI tasks and merge estimated 2.5-3 hours with parallelization; branch protection must not delay legitimate merges  
**Constraints**: All checks must be deterministic; no flaky tests; coverage thresholds must be enforceable  
**Scale/Scope**: Multi-suite testing (5 UI suites), code coverage across UI and API, 6 distinct infrastructure subsystems (branch setup, CI rules, artifact generation, GitHub Projects, issue templates, PR template)

---

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Based on the constitutional principles from `.specify/memory/constitution.md` v1.1.0:

✅ **Principle I: No Logic Duplication**
- UI templates and GitHub automation do NOT duplicate backend logic from `src/<app>`
- All CI checks validate existing backend services (API tests, spec validation)
- No reimplementation of business logic detected
- *Status*: PASS - All infrastructure respects single source of truth

✅ **Principle II: Test Coverage Mandate**
- Vitest enforces 60% minimum coverage thresholds (exceeds constitutional minimum of 40%)
- Each UI module maintained with ≥40% statement coverage per constitution requirement
- Contract tests verify all infrastructure configurations before deployment
- Coverage reports included in review-packet artifact per Principle III
- *Status*: PASS - Test coverage is mandatory and measurable

✅ **Principle III: Reviewability is Paramount**
- review-artifacts/index.html is the primary artifact of record (Principle III mandate)
- README.md links to review-packet with coverage reports, Playwright results, OpenAPI docs, CHANGELOG
- GitHub Project custom fields expose work item status and priorities for reviewer visibility
- All CI checks logged and visible in GitHub status checks with clear pass/fail indicators
- PR template mandates Spec URL and contract test verification for reviewability
- *Status*: PASS - Reviewability is central to all infrastructure decisions

⚠️ **Complexity Assessment**: This feature involves 6 distinct subsystems (branch setup, CI rules, artifact generation, GitHub Projects configuration, 2 template types). **Justification**: All subsystems are essential for the "Definition of Done" and cannot be decomposed further; they represent the minimum viable setup for a professional repository.

---

## Project Structure

### Documentation (this feature)
```
specs/025-week-5-day/
├── spec.md              # Feature specification (requirements + acceptance criteria)
├── plan.md              # This file (implementation plan)
├── research.md          # Phase 0 output (technical research + decisions)
├── data-model.md        # Phase 1 output (entities, data structures)
├── quickstart.md        # Phase 1 output (execution walkthrough + validation steps)
├── contracts/           # Phase 1 output (API contracts, CI workflow contracts)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
.github/
├── workflows/
│   ├── api-checks.yml           # (existing) API test & coverage
│   ├── spec-check.yml           # (existing) Specification validation
│   ├── playwright.yml           # (existing) E2E smoke tests
│   ├── codeql.yml               # (existing) Security analysis
│   └── dependency-review.yml    # (existing) Supply chain security
├── ISSUE_TEMPLATE/
│   ├── feature.md               # (new) Feature request template
│   └── bug.md                   # (new) Bug report template
└── pull_request_template.md     # (new/updated) PR submission template

README.md                         # (updated) Links to Week 5 paths, review-packet
vitest.config.js                 # (verify) Coverage thresholds set to 60%

review-artifacts/
├── index.html                   # (verify) Links to coverage, reports, docs
├── coverage/                    # (existing) Vitest coverage reports
├── playwright-report/           # (existing) E2E test results
├── openapi.html                 # (existing) OpenAPI documentation
└── CHANGELOG.md                 # (existing) Release notes
```

**Structure Decision**: This is a web application with frontend and backend. The D0.1 tasks work directly with repository root files (README, .github templates). D0.2 tasks configure GitHub settings (not file-based). D0.3/D0.4 tasks verify existing workflows and artifact generation. Section 1.1-1.3 tasks complete GitHub Project setup via UI + API. All work is coordinated across these layers.

---

## Phase 0: Outline & Research

### Research Tasks

1. **GitHub Projects API & Automation**
   - How to create a GitHub Project via REST API or UI
   - How to configure custom fields (Status, Priority, Size, Spec URL, Sprint/Week)
   - How to set up automation rules (auto-add issues/PRs, status updates on PR events)
   - Output: decision on manual (UI) vs. automated (API) setup approach

2. **GitHub Branch Protection Rules**
   - How to configure branch protection via REST API or Settings UI
   - Exact status check names required by existing CI workflows
   - How GitHub enforces "required" checks (blocking vs. warning)
   - Output: list of exact check names and configuration steps

3. **Vitest Coverage Thresholds**
   - Current Vitest version and configuration
   - How to enforce 60% thresholds per suite (ui-expense, ui-stopwatch, ui-temp, ui-todo, ui-quote)
   - Include/exclude path patterns for multi-suite coverage
   - Output: validated vitest.config.js with thresholds + include/exclude rules

4. **Review Packet Artifact Generation**
   - Current script for generating review-artifacts/index.html
   - How to include coverage tables (statements/branches/functions/lines)
   - How to embed Playwright report links and OpenAPI docs
   - How to reference CHANGELOG in artifact
   - Output: updated generation script with all required links

5. **GitHub Issue & PR Templates**
   - Best practices for Markdown-based issue templates
   - How GitHub parses issue/PR templates (YAML frontmatter, sections, form inputs)
   - Template validation and required field enforcement
   - Output: tested feature.md, bug.md, and pull_request_template.md

6. **Squash Merge Strategy**
   - Git squash merge workflow and commit message conventions
   - Git tagging for release markers
   - Validation that all development → main merges use squash strategy
   - Output: git commands and CI hook configuration

---

## Phase 1: Design & Contracts

### 1. Data Model (`data-model.md`)

**Entities Identified**:

- **GitHub Project Configuration**
  - Fields: Custom field definitions (name, type, options)
  - Automation rules: Trigger conditions, actions
  - Relationships: Links to repository, team members
  - Validation: Field names must match Linear migration plan

- **Branch Protection Rule**
  - Fields: Branch name pattern, required status checks, reviewers
  - Checks: Array of check names (spec-check, API coverage, Playwright, CodeQL, Dependency Review)
  - Relationships: Applies to main branch only
  - Validation: Cannot block legitimate hotfixes; development branch excluded

- **CI Workflow & Artifacts**
  - Fields: Workflow name, triggers (push, PR), artifact outputs
  - Coverage: 60% threshold per suite
  - Relationships: Links spec.md files to test suites
  - Validation: All 5 UI suites included; coverage reports generated

- **Issue & PR Templates**
  - Fields: Template content (Markdown sections), labels (default), form fields
  - Sections: Mandatory (Description, Acceptance Criteria) vs. optional
  - Relationships: Templates guide all GitHub contributions
  - Validation: Templates must be parseable by GitHub; no syntax errors

- **Review Artifact Package**
  - Fields: index.html, coverage reports, Playwright reports, OpenAPI docs, CHANGELOG
  - Links: Absolute or root-relative (not relative)
  - Validation: All files present; links are functional; no broken references

### 2. API Contracts (`contracts/`)

**Contracts to Generate**:

- **GitHub Projects GraphQL Queries**
  - `createProject(name, description)` → Project ID
  - `addCustomField(projectId, name, type)` → Field ID
  - `createProjectAutomation(projectId, trigger, action)` → Automation ID
  - Success criteria: All custom fields created; automations active

- **GitHub REST API for Branch Protection**
  - `PUT /repos/{owner}/{repo}/branches/main/protection` with required status checks
  - Payload: `required_status_checks`, `required_pull_request_reviews`, `restrictions`
  - Success criteria: Branch protection enforced; legitimate PRs can still merge

- **CI Workflow Outputs**
  - Spec-check: Validates `.specify/*/spec.md` format and completeness
  - API coverage: Outputs coverage.json with statement/branch/function/line metrics
  - Playwright: Outputs HTML report with test traces
  - CodeQL: Generates security alerts (if any) for review
  - Dependency Review: Blocks high-severity vulnerabilities
  - Success criteria: All checks pass on main; failing checks block merge

- **Artifact Generation Contract**
  - Input: Coverage files, Playwright reports, OpenAPI schema, CHANGELOG.md
  - Output: review-artifacts/index.html with all links validated
  - Success criteria: Links are functional; artifact size < 50MB; generation completes in < 5min

### 3. Contract Tests (`contracts/`)

**Test Files to Generate**:

- `github-projects-setup.test.ts`: Validate custom fields, automation rules
- `branch-protection-setup.test.ts`: Validate required checks, enforcement
- `vitest-coverage.test.ts`: Validate 60% thresholds, suite inclusion
- `artifact-generation.test.ts`: Validate review-artifacts/index.html content and links
- `templates-validation.test.ts`: Validate issue/PR template structure and required fields

**Test Strategy**: TDD - write failing tests first; they document the contract; implementation makes them pass.

### 4. Data Model & Quick Start (`data-model.md`, `quickstart.md`)

**Quickstart Scenario**:

```gherkin
Given the repository is on the development branch with all tests passing
When a maintainer runs the D0 automation tasks
Then:
  1. Main branch README.md is updated with Week 5 links
  2. Stray files are removed from main branch
  3. Development is squash-merged into main with tag week5-day0
  4. Branch protection rules are applied to main (5 required checks)
  5. GitHub Project is created with custom fields and automations
  6. Issue/PR templates are added to .github/
  7. review-artifacts/index.html is generated with all links
  8. All stakeholders are notified to migrate from Linear to GitHub Projects
And the main branch is production-ready and receiver-friendly
```

**Validation Steps**:
1. Verify git tag `week5-day0` exists on main
2. Verify main branch README points to `/review-artifacts/index.html`
3. Verify branch protection rule `main` has 5 required status checks
4. Verify GitHub Project custom fields exist: Status, Priority, Size, Spec URL, Sprint/Week
5. Verify `.github/ISSUE_TEMPLATE/feature.md` and `.github/ISSUE_TEMPLATE/bug.md` exist
6. Verify `.github/pull_request_template.md` has required sections
7. Verify `review-artifacts/index.html` contains links to coverage, reports, docs

### 5. Agent Context Update

The agent context file (CLAUDE.md) will be updated incrementally to include:
- GitHub Projects API details (custom field types, automation triggers)
- Vitest configuration patterns (coverage thresholds, suite organization)
- Review-artifacts generation approach (index.html templating, link validation)

**Command to execute**: `.specify/scripts/bash/update-agent-context.sh cursor`

---

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:

1. **Load tasks template** from `.specify/templates/tasks-template.md`

2. **Group tasks by subsystem** (dependency-ordered):
   - **Subsystem 1: Branch Cleanup** (D0.1)
     - Update README.md with Week 5 paths
     - Remove stray files
     - Prepare merge commit message
   
   - **Subsystem 2: CI Check Configuration** (D0.2)
     - Document exact status check names from workflows
     - Configure branch protection rule via Settings UI or API
     - Validate all 5 checks are enforced
   
   - **Subsystem 3: Artifact & Coverage Verification** (D0.3 & D0.4)
     - Verify Vitest config has 60% thresholds
     - Verify include/exclude paths for all 5 UI suites
     - Update review-artifacts/index.html generation script
     - Verify artifact links (coverage table, Playwright, OpenAPI, changelog)
   
   - **Subsystem 4: GitHub Project Setup** (1.1)
     - Create GitHub Project (new format)
     - Create custom fields (Status, Priority, Size, Spec URL, Sprint/Week)
     - Configure automation rules (auto-add issues/PRs, PR open→In Review, PR merge→Done)
   
   - **Subsystem 5: Issue Templates** (1.2)
     - Create `.github/ISSUE_TEMPLATE/feature.md`
     - Create `.github/ISSUE_TEMPLATE/bug.md`
     - Validate template syntax
   
   - **Subsystem 6: PR Template** (1.3)
     - Create/update `.github/pull_request_template.md`
     - Add required sections (Spec URL, Contract Tests, Checks, CHANGELOG Updated)
     - Validate template syntax

3. **Task Ordering**:
   - **Phase A (Preparation)**: Branch cleanup, CI check names documentation
   - **Phase B (Configuration, Parallel)**: Branch protection setup, GitHub Project creation, template creation
   - **Phase C (Verification)**: Validate all configurations; test artifact generation
   - **Phase D (Finalization)**: Squash merge dev → main, create tag, notify team

4. **Parallelization**:
   - Subsystems 4, 5, 6 can execute in parallel (GitHub Project setup doesn't block templates)
   - Subsystem 2 can execute in parallel with 3 (CI config is independent of artifact generation)

5. **Estimated Output**: 20-25 numbered, ordered tasks in tasks.md

---

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

- **Phase 3**: Task execution (/tasks command creates tasks.md)
- **Phase 4**: Implementation (execute tasks following TDD: write tests, then code)
- **Phase 5**: Validation (run all tests, execute quickstart.md, verify Definition of Done checklist)

---

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| 6 subsystems (CI, artifacts, project, templates, branch, merge) | Each is essential for Definition of Done; cannot be deferred | Attempting to combine would create circular dependencies (e.g., branch protection before CI checks exist; GitHub Project before templates are ready) |
| GitHub Project custom fields + automation rules | GitHub requires separate setup for each automation; no single API endpoint | Manual template-based approach would be error-prone and not reproducible |
| Verification tasks for Vitest + artifacts | Thresholds are enforceable and affect merge decisions; must be validated before deployment | Skipping verification risks incomplete CI checks or broken artifact links on production |

---

## Progress Tracking

**Phase Status**:
- [x] Phase 0: Research complete (/plan command - outline above; detailed research.md to follow)
- [ ] Phase 1: Design complete (data-model.md, contracts/, quickstart.md to follow)
- [ ] Phase 2: Task planning complete (approach documented above)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS (all three principles satisfied)
- [ ] Post-Design Constitution Check: PASS (to verify after Phase 1 completion)
- [x] All NEEDS CLARIFICATION resolved (none identified in spec)
- [x] Complexity deviations documented (none; complexity is justified)

---

## Next Steps

1. ✅ **Completed**: Feature specification (spec.md)
2. ✅ **Completed**: Implementation plan (this file)
3. **TODO**: Execute `/research` command to generate research.md with technical findings
4. **TODO**: Execute `/design` or equivalent command to generate data-model.md, contracts/, quickstart.md
5. **TODO**: Execute `/tasks` command to generate tasks.md with numbered, ordered work items
6. **TODO**: Execute implementation tasks following TDD approach

---

*Based on Constitutional Principles - Testability First, Progressive Enhancement, Transparency & Documentation*

