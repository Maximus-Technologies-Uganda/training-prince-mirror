# Feature Specification: Week 5 Day-0: Final Hygiene & Migration to GitHub Projects

**Feature Branch**: `025-week-5-day`  
**Created**: November 6, 2025  
**Status**: Draft  
**Input**: User description: "Week 5 Day-0: Final Hygiene & Migration to GitHub Projects - This specification covers all Day 0 setup and migration tasks from the Week 5 workbook. The goal is to make the repository reviewer-friendly, configure all required CI checks, and fully migrate our project management from Linear to GitHub Projects."

---

## User Scenarios & Testing *(mandatory)*

### Primary User Story
As a repository maintainer, I need to finalize the development workflow by:
1. Ensuring main branch is clean, properly documented, and ready for production
2. Protecting main with comprehensive CI checks to maintain code quality
3. Migrating all project management from Linear to GitHub Projects for self-contained workflow
4. Creating standardized issue and PR templates for contributor consistency

This ensures reviewers have a professional, well-documented repository experience and the team operates on a unified platform without external dependencies.

### Acceptance Scenarios
1. **Given** development branch has been thoroughly tested, **When** all CI checks pass and D0 tasks are complete, **Then** development can be squash-merged into main with a week5-day0 tag
2. **Given** a PR is created against main, **When** the PR is submitted, **Then** all required status checks (spec-check, API coverage, Playwright, CodeQL, Dependency Review) must pass before merge
3. **Given** the GitHub Project is configured, **When** a new issue is created, **Then** it is auto-added to the project with configurable fields (Status, Priority, Size, Spec URL, Sprint/Week)
4. **Given** a PR is merged to main, **When** the merge completes, **Then** the GitHub Project status is automatically set to Done
5. **Given** a contributor wants to report a bug, **When** they select the bug template, **Then** they see structured fields for reproduction steps, expected behavior, and environment details
6. **Given** the review packet artifact exists, **When** review-artifacts/index.html is generated, **Then** it includes coverage tables, Playwright reports, OpenAPI docs, and changelog

### Edge Cases
- What happens if a required status check fails? → Merge is blocked; maintainer must fix the underlying issue
- What if the main branch already has protection rules? → Rules must be updated (not replaced) to add missing checks
- What if a repository uses an older GitHub Projects format? → Migrate to GitHub Projects (new) for consistency
- What if there are stray files on main that weren't in development? → Identify and remove them before squash merge

---

## Requirements *(mandatory)*

### Functional Requirements

#### D0.1: Branch Hygiene & Merge to main
- **FR-001**: System MUST update main branch README.md to point to Week 5 specification paths and the review-packet artifact
- **FR-002**: System MUST identify and remove all stray/deprecated files from main branch. Stray files are defined as files matching: `*.tmp`, `*.log`, `debug.*`, `hello.js..js`, `*.bak`, or incomplete test stubs not referenced in package.json or documentation
- **FR-003**: System MUST perform a squash merge of development into main only after all other D0 tasks are confirmed complete and development is green (all tests passing)
- **FR-004**: System MUST create a git tag named `week5-day0` on the squashed commit to main for release tracking
- **FR-005**: System MUST ensure main branch README clearly links to current week's documentation and development guidelines

#### D0.2: Required CI Checks
- **FR-006**: System MUST configure branch protection rules on main to require status check: `spec-check` (validates specification format/completeness)
- **FR-007**: System MUST configure branch protection rules on main to require status check: `Test & Coverage - API` (API test suite with coverage reporting)
- **FR-008**: System MUST configure branch protection rules on main to require status check: `Playwright Smoke` (end-to-end smoke tests)
- **FR-009**: System MUST configure branch protection rules on main to require status check: `CodeQL` (static security analysis)
- **FR-010**: System MUST configure branch protection rules on main to require status check: `Dependency Review` (supply chain security scanning)
- **FR-011**: System MUST enforce that PRs cannot be merged to main unless all required checks pass
- **FR-012**: System MUST ensure development branch does not have these same restrictions (allows faster iteration)

#### D0.3 & D0.4: Verify Coverage & Review Packet
- **FR-013**: System MUST enforce Vitest configuration with 60% minimum thresholds for statements, branches, functions, and lines coverage on initial runs
- **FR-014**: System MUST configure Vitest with correct include/exclude paths for UI suites (ui-expense, ui-stopwatch, ui-temp, ui-todo, ui-quote)
- **FR-015**: System MUST generate review-artifacts/index.html containing:
  - Coverage summary table (statements, branches, functions, lines per suite)
  - Links to Playwright HTML report (test results and traces)
  - Links to OpenAPI HTML documentation
  - Links to CHANGELOG with recent updates
- **FR-016**: System MUST verify all artifact files are present before packaging review-artifacts

#### 1.1: GitHub Project Setup
- **FR-017**: System MUST create a new GitHub Project named "Week 5 Day-0" (using GitHub Projects - new format, not legacy). If a project by this name already exists, verify it has all 5 required custom fields; if not, archive the old project and create a fresh one.
- **FR-018**: System MUST configure project custom fields to match Linear migration plan:
  - Status (Todo, In Progress, In Review, Done)
  - Priority (P0/Critical, P1/High, P2/Medium, P3/Low)
  - Size (XS, S, M, L, XL)
  - Spec URL (link to spec documentation)
  - Sprint/Week (W1-W5, Week 5 Day-0, etc.)
- **FR-019**: System MUST auto-add new Issues to the GitHub Project upon creation
- **FR-020**: System MUST auto-add new PRs to the GitHub Project upon creation
- **FR-021**: System MUST automatically set PR Status to "In Review" when a PR is opened
- **FR-022**: System MUST automatically set PR Status to "Done" when a PR is merged
- **FR-023**: System MUST provide automation rules UI for manual configuration (GitHub Projects automation interface)

#### 1.2: Issue Templates
- **FR-024**: System MUST provide `.github/ISSUE_TEMPLATE/feature.md` template with sections:
  - Description (what feature is needed)
  - Acceptance Criteria (clear definition of done)
  - Related Links (specs, related issues)
  - Labels (feature, priority, size defaults suggested)
- **FR-025**: System MUST provide `.github/ISSUE_TEMPLATE/bug.md` template with sections:
  - Description (what is broken)
  - Reproduction Steps (step-by-step to reproduce)
  - Expected Behavior (what should happen)
  - Actual Behavior (what actually happens)
  - Environment (browser, OS, app version)
  - Screenshots/Logs (attachments)
  - Labels (bug, priority defaults suggested)

#### 1.3: Pull Request Template
- **FR-026**: System MUST provide `.github/pull_request_template.md` with mandatory sections:
  - Spec URL (link to the feature specification)
  - Contract Tests (list of contract tests added/verified)
  - Checks (confirmation of passing checks)
  - CHANGELOG Updated (confirmation that CHANGELOG.md was updated with user-facing changes)
  - Related Issues (links to issue(s) being addressed)
  - Testing (description of manual testing performed)
  - Breaking Changes (if any)
- **FR-027**: System MUST require these fields be completed before PR is marked ready for review
- **FR-028**: System MUST include instructions for maintainers (e.g., "Squash merge only for weekly integrations")

### Key Entities

- **GitHub Project**: Container for tracking work items with custom fields and automation
- **Branch Protection Rule**: Configuration enforcing code quality gates before merge to main
- **Workflow Artifact**: Review packet (index.html, coverage reports, OpenAPI docs, changelog)
- **Git Tag**: Release marker (week5-day0) for version tracking
- **Issue Template**: Standardized form guiding contributors on issue creation
- **Pull Request Template**: Standardized form guiding contributors on PR submission

---

## Definition of Done

All of the following must be satisfied before D0 is considered complete:

- [ ] Main branch README.md updated with Week 5 paths and review-packet links
- [ ] Stray files removed from main branch (validated via git diff)
- [ ] Development branch merged to main via squash commit (verified via git log)
- [ ] `week5-day0` tag created on main branch (verified via git tag -l)
- [ ] Branch protection rules on main configured to require all 5 status checks (verified in repo settings)
- [ ] Vitest config enforces 60% thresholds with correct include/exclude paths (verified via vitest.config.js)
- [ ] review-artifacts/index.html includes coverage table, Playwright report link, OpenAPI link, changelog link
- [ ] GitHub Project created with all custom fields configured (Status, Priority, Size, Spec URL, Sprint/Week)
- [ ] GitHub Project automation configured (auto-add issues/PRs, PR opened→In Review, PR merged→Done)
- [ ] `.github/ISSUE_TEMPLATE/feature.md` created and validates against template structure
- [ ] `.github/ISSUE_TEMPLATE/bug.md` created and validates against template structure
- [ ] `.github/pull_request_template.md` created with all required sections
- [ ] All team members notified that Linear has been decommissioned and GitHub Projects is the source of truth
- [ ] Development workflow is fully operational on GitHub platform
- [ ] Main branch is the target for all incoming PRs (no more development branch PRs)

---

## Execution Status
*Updated by implementation team during task execution*

- [ ] Branch D0.1 tasks planned
- [ ] Branch D0.2 tasks planned  
- [ ] Branch D0.3 & D0.4 tasks planned
- [ ] Branch 1.1 tasks planned
- [ ] Branch 1.2 tasks planned
- [ ] Branch 1.3 tasks planned
- [ ] All tasks executed and verified
- [ ] Definition of Done checklist confirmed complete

---

## Clarifications

### Session 2025-11-06
- Q: Who performs each D0 task (automated vs manual)? → A: Hybrid approach - automation where possible (auto-add issues/PRs via GitHub native), manual UI for initial GitHub Project field setup and branch protection configuration
- Q: Failure recovery & rollback strategy? → A: No formal rollback plan; D0 is one-time setup. Document manual cleanup steps for partial failures (e.g., how to delete GitHub Project, remove branch protection, revert template changes)
- Q: How to handle pre-existing GitHub Projects? → A: Additive approach - create new "Week 5 Day-0" project fresh; leave any existing projects as-is for backward compatibility

---

## Notes for Implementation Team

1. **Execution Model (Hybrid)**: 
   - **Manual via UI**: Initial GitHub Project creation, custom field definitions, branch protection rule configuration (one-time setup)
   - **Automated via GitHub Actions**: PR status updates (when opened/merged), issue/PR auto-add workflows
   - **Manual via CLI/Scripts**: Squash merge, tagging, README updates (can be scripted but recommend manual review)

2. **Merge Strategy**: The squash merge to main should consolidate all development work into a single commit with a clear message like: "Week 5 Day-0: Final hygiene and GitHub Projects migration"

3. **CI Check Names**: Ensure the exact status check names match what GitHub Actions workflows produce (case-sensitive)

4. **GitHub Project Strategy (Additive)**:
   - Create new dedicated project: "Week 5 Day-0"
   - Do NOT migrate or consolidate existing projects (backward compatibility)
   - If "Week 5 Day-0" project already exists, verify it has all 5 custom fields before skipping creation
   - All issues/PRs moving forward auto-add to the new project
   - Custom fields are created via the GitHub Projects UI or GraphQL API; recommend manual UI setup for initial configuration

5. **Automation Sequencing**: GitHub Project automation rules should be configured in this order:
   - Auto-add rules (issues/PRs) - GitHub native automation
   - Status update rules (on open/merge) - GitHub Actions workflow or native automation
   - Any custom field update rules

6. **Linear Decommission**: After successful migration, document the cutoff date and advise team members not to create new issues in Linear

7. **Review Packet**: Verify that the index.html generation script produces absolute or root-relative links (not relative paths) so links work from any context

8. **Failure Recovery** (One-Time Setup - No Rollback):
   - If GitHub Project setup fails midway: Manually delete project via Settings, restart from scratch
   - If branch protection fails: Manually remove/reconfigure rule via Settings → Branches
   - If template creation fails: Delete .github/ files manually, recreate or skip
   - If squash merge fails: Reset to pre-merge state with `git reset --soft origin/main`, clean up, retry
   - Document all manual cleanup steps in implementation runbook for team reference

---
