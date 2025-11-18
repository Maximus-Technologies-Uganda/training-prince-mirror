# Feature Specification: Chapter 6 Day 0: FinishtoGreen & CI Tightening

**Feature Branch**: `025-chapter-6-day-0`  
**Created**: 18 November 2025  
**Status**: Draft  
**Input**: User description: "Chapter 6 Day 0: FinishtoGreen & CI Tightening - Phase 0 setup and hygiene tasks to finalize Chapter 5 (API) work on main branch and raise CI/CD quality gates for Chapter 6 Next.js frontend"

## Clarifications

### Session 2025-11-18

- Q: Should coverage thresholds be hard blockers on Day 0 or transition to hard blockers on Day 1? → A: Hard blockers on Day 0 (Option A). Coverage thresholds enforced immediately; PRs below thresholds are rejected. Baseline coverage is assessed and documented.
- Q: Should ally-check fail on any violation or use a baseline of acceptable violations? → A: Baseline with exceptions (Option B). Establish baseline of known violations on Day 0; only new violations trigger job failure. Document exceptions in allowlist file.
- Q: Is GitHub Pages API documentation already published or needs setup on Day 0? → A: Already published (Option A). API docs currently published to GitHub Pages; Day 0 only verifies URL and links it in README.md. Publishing setup is not part of Day 0 scope.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - DevOps Lead Finalizes Chapter 5 API Work (Priority: P1)

As a DevOps/Release manager, I need to clean up the main branch, document the Chapter 5 completion, and ensure all branch protections are properly configured so that Chapter 5 API development is formally closed and the repository is ready for Chapter 6 frontend work.

**Why this priority**: This is critical because it formally closes Chapter 5 work, creates an audit trail via git tags, and ensures main branch is in a known-good state before introducing new Chapter 6 quality gates. Without this, we cannot establish proper baselines for the next phase.

**Independent Test**: Can be tested by verifying: (1) main branch has no extraneous files, (2) README.md links to Review Packet and API docs, (3) chapter5-complete tag exists on final commit, (4) all required branch protection checks are enabled.

**Acceptance Scenarios**:

1. **Given** the current main branch state, **When** cleanup is performed, **Then** no stray files (e.g., hello.js..js) remain on main
2. **Given** the main README.md, **When** updated, **Then** it contains links to Review Packet, live API docs on GitHub Pages, and Chapter 6 instructions
3. **Given** branch protection configuration, **When** verified, **Then** main is protected by required checks: spec-check, test-api, codeql, dependency-review
4. **Given** the final Chapter 5 commit, **When** tag is created and pushed, **Then** chapter5-complete tag points to that commit and is visible in git history

---

### User Story 2 - DevSecOps Engineer Implements CI/CD Quality Gates (Priority: P1)

As a DevSecOps engineer, I need to add new CI/CD quality gates and coverage thresholds for Chapter 6 so that the frontend and API maintain consistent, measurable quality standards and accessibility compliance.

**Why this priority**: Critical because it establishes the foundation for Chapter 6 quality standards. Accessibility and coverage requirements must be in place before frontend development begins to prevent technical debt and ensure compliance.

**Independent Test**: Can be tested by verifying: (1) SECURITY.md file exists with disclosure info, (2) ally-check job runs in CI and is required, (3) vitest.config.ts has 70% threshold for API and 55% for UI, (4) accessibility violations block merges when enabled.

**Acceptance Scenarios**:

1. **Given** a new repository, **When** security configuration is reviewed, **Then** SECURITY.md file exists in root with responsible disclosure guidelines
2. **Given** the CI pipeline configuration, **When** frontend changes are submitted, **Then** ally-check job runs automatically and is marked as a required status check
3. **Given** the vitest configuration, **When** test coverage is calculated, **Then** API must meet ≥70% (lines, functions, branches) and UI must meet ≥55%
4. **Given** CI checks failing due to accessibility violations, **When** PR review occurs, **Then** ally-check must pass before merge is allowed

---

### User Story 3 - Project Manager Updates Review Packet & Hygiene (Priority: P2)

As a project manager, I need to update the Review Packet to document Chapter 6 work, verify GitHub Projects configuration, and ensure all project automation and fields are correct so stakeholders can track progress.

**Why this priority**: Important for project transparency and stakeholder communication, but can proceed in parallel with technical setup. Ensures proper tracking and documentation infrastructure is in place before Day 1.

**Independent Test**: Can be tested by verifying: (1) review-packet/index.html includes Projects evidence link/screenshot, (2) Chapter 6 UI Assets section is reserved in Review Packet, (3) GitHub Projects board has all required fields (Status, Priority, Size, Spec URL, Sprint/Chapter), (4) automations (auto-add, PR-to-Done) are functioning.

**Acceptance Scenarios**:

1. **Given** the build-review-packet workflow, **When** executed, **Then** review-artifacts/index.html contains link or screenshot for "Projects evidence"
2. **Given** the Review Packet structure, **When** viewed, **Then** a reserved section titled "Chapter 6 UI Assets" exists (placeholder for UI Coverage, Playwright reports, Lighthouse reports)
3. **Given** the Training Prince project board, **When** inspected, **Then** all required fields are present and configured: Status, Priority, Size, Spec URL, Sprint/Chapter
4. **Given** a new issue is created, **When** linked to the project, **Then** auto-add automation triggers and issue appears on board; when PR is opened, PR-to-Done automation moves item correctly

---

### Edge Cases

- What happens if stray files on main are referenced by uncommitted code? (Must identify and archive before cleanup)
- How should ally-check handle accessibility issues in third-party components? (Document known issues and baseline)
- What if existing coverage is below new thresholds? (Establish transition period or document baseline for later hardening)
- How should Review Packet handle missing UI reports on Day 0? (Use placeholder sections and update as reports become available)

## Requirements *(mandatory)*

### Functional Requirements

**Chapter 5 FinishtoGreen (D0.1)**

- **FR-001**: Main branch MUST have no extraneous or stray files (e.g., hello.js..js, test files, debug scripts)
- **FR-002**: README.md on main branch MUST be updated to reference: Review Packet, live API docs on GitHub Pages, and Chapter 6 instructions
- **FR-003**: Main branch MUST be protected by required status checks: spec-check, test-api, codeql, and dependency-review
- **FR-004**: A git tag named `chapter5-complete` MUST be created on the final Chapter 5 commit and pushed to origin
- **FR-005**: Git tag `chapter5-complete` MUST be visible in repository history and GitHub releases

**Chapter 6 CI Tightening (D0.2)**

- **FR-006**: A SECURITY.md file MUST exist in the repository root with responsible disclosure information
- **FR-007**: A new CI job named `ally-check` MUST run automated accessibility checks (using axe) against the frontend
- **FR-007a**: Ally-check MUST establish a baseline of known/acceptable accessibility violations on Day 0; violations in baseline are excluded from job failure
- **FR-007b**: Ally-check MUST fail only on NEW accessibility violations not in the baseline allowlist; baseline allowlist MUST be documented in version control
- **FR-008**: The `ally-check` CI job MUST be configured as a required status check for all PRs
- **FR-009**: API test coverage thresholds (vitest.config.ts or CI scripts) MUST be set to ≥70% for lines, functions, and branches; configured as hard blocker (PR rejection if violated)
- **FR-010**: UI test coverage thresholds (vitest.config.ts or CI scripts) MUST be set to ≥55% for lines, functions, and branches; configured as hard blocker (PR rejection if violated)
- **FR-011**: Coverage threshold failures MUST block PR merges until thresholds are met

**Review Packet & Project Hygiene (D0.2)**

- **FR-012**: The build-review-packet workflow script MUST be updated to include link or screenshot for "Projects evidence" in review-artifacts/index.html
- **FR-013**: A reserved section titled "Chapter 6 UI Assets" MUST be created in the review-packet structure (placeholder for UI Coverage, Playwright reports, Lighthouse reports)
- **FR-014**: GitHub Projects "Training Prince" board MUST have all required fields: Status, Priority, Size, Spec URL, Sprint/Chapter
- **FR-015**: GitHub Projects automations MUST be functional: auto-add (issues/PRs added to project) and PR-to-Done (PRs move items to Done)
- **FR-016**: README.md MUST link to live API docs on GitHub Pages (API docs are already published; Day 0 task is verification and linking)

### Key Entities *(include if feature involves data)*

- **Git Tag**: A named reference to a specific commit; used to mark release milestones (chapter5-complete)
- **GitHub Actions Workflow**: Automated job definition; includes spec-check, test-api, codeql, dependency-review, ally-check
- **Branch Protection Rule**: Repository setting that enforces required checks and review policies on protected branches
- **Test Coverage Configuration**: Settings in vitest.config.ts or CI scripts that define minimum threshold percentages
- **GitHub Project**: Work tracking system with fields for Status, Priority, Size, Spec URL, Sprint/Chapter; includes automations for issue/PR management
- **Review Packet Artifact**: HTML documentation artifact generated from CI that consolidates test results, coverage, and project evidence

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Chapter 5 is formally closed: `chapter5-complete` tag is pushed and visible in GitHub releases and git log
- **SC-002**: Main branch passes all existing required status checks: spec-check, test-api, codeql, dependency-review
- **SC-003**: SECURITY.md file exists, contains disclosure guidelines, and is accessible from repository root
- **SC-004**: Ally-check job executes successfully on a sample frontend feature branch and blocks merge if accessibility violations are found
- **SC-005**: All new coverage thresholds are configured: API ≥70%, UI ≥55%; violations are detected and reported in CI output; thresholds enforced as hard blockers (PRs below thresholds are rejected)
- **SC-006**: Review Packet includes "Projects evidence" section and "Chapter 6 UI Assets" placeholder section; both render correctly in HTML
- **SC-007**: GitHub Projects "Training Prince" board has all 5 required fields configured and visible on all cards
- **SC-008**: Project automations are tested: new issue appears on board automatically; PR moves item to Done when merged
- **SC-009**: All Day 0 tasks are documented and repository is ready for Day 1 frontend development (0 blocking issues)
- **SC-010**: Chapter 6 baseline documentation is complete and stakeholders can access Chapter 5 completion evidence and Chapter 6 setup status
- **SC-011**: Ally-check baseline is established with documented accessibility exceptions; only new violations trigger job failure (no exceptions added after Day 0 baseline scan)
- **SC-012**: README.md links to live API docs on GitHub Pages (docs already published; Day 0 adds link only)

### Assumptions

- Main branch currently exists and is protected with some checks already in place (spec-check, test-api, codeql, dependency-review)
- GitHub Pages is already configured to publish API docs from a build artifact or docs folder
- Review Packet build-review-packet workflow already exists and is functional; we are extending it
- GitHub Projects board "Training Prince" already exists with some field structure in place; we are verifying/completing it
- Vitest is already the test runner for both API and UI; configurations exist and need threshold updates
- Axe library is suitable for ally-check accessibility tests and can run in CI environment
- No breaking changes to existing CI workflows; all new gates are additions or extensions

### Out of Scope

- Actual frontend development or Next.js setup (that is Chapter 6 Day 1-5 work)
- Detailed accessibility remediation on existing code (ally-check is a new gate; baseline violations may need separate issue tracking)
- Rewriting README.md entirely (only update links and add Chapter 6 pointers)
- Creating new GitHub Project from scratch (assuming it exists; only verifying/completing fields)
- Changing or removing existing branch protection rules (only verifying they are in place)


