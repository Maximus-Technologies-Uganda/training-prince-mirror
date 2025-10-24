# Feature Specification: Day 0: CI Maturity, Review Packet Parity, and Repository Hygiene

**Feature Branch**: `011-title-day-0`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: User description: "Title: Day 0: CI Maturity, Review Packet Parity, and Repository Hygiene

Context: This specification outlines the necessary \"Finish-to-Green\" tasks required to clear carry-over blockers before starting new Week 4 scope . The goal is to establish a mature, reviewable, and stable baseline for our project. We will enhance our Continuous Integration (CI) pipeline, improve repository hygiene, and implement foundational end-to-end (E2E) smoke tests.

Core Requirements:

Review Packet Parity & CI Enhancement :

Unified Coverage Reporting: The CI process must generate and collect both backend and UI test coverage reports for all five applications (quote, expense, temp, todo, stopwatch) . All reports should be consolidated into a single review-artifacts directory .

Coverage Index: Create a central review-artifacts/index.html that serves as a single entry point, linking to both the backend and UI coverage reports for each application .

Enriched review.md: The review.md artifact must be augmented to include environment details (Node/npm versions), a log of the last 20 commits, a two-level repository map, and summary tables for both backend and UI coverage statistics .

Repository Hygiene & Clarity :

State File Management: Relocate all runtime state files (e.g., expenses.json, todo.json, stopwatch-state.json) into a new, dedicated /data/ directory .

Gitignore Update: The /data/ directory must be added to .gitignore to prevent state files from being committed to the repository .

Mirror and README: The default branch on the mirror repository should be set to development . If not possible, the README.md on the main branch must include a \"How to review me\" section with clear instructions for reviewers to find and use the review-packet from the development branch CI runs .

File Cleanup: Remove any stray or temporary files from all branches to ensure a clean repository state .

E2E Smoke Testing with Playwright :

Test Implementation: Create one foundational Playwright smoke test for each of the five UIs, verifying a key piece of functionality (e.g., quote filtering, expense calculation, temperature conversion) .

Failure Artifacts: Configure the CI pipeline to automatically capture and upload Playwright traces and screenshots as artifacts whenever a smoke test fails .

PR Integration: The link to the CI smoke test run must be referenced in the corresponding pull request for easy access and review .

Definition of Done:

A CI run on the mirror repository successfully generates and uploads a single review-packet artifact .

The review-packet contains distinct coverage-<app> and ui-coverage-<app> folders, along with the main Coverage Index index.html .

The review.md file within the artifact is fully enriched as per the requirements .

The repository's README.md is updated with the review instructions, and the default branch is clarified .

The /data/ directory exists and is correctly ignored by Git .

Playwright smoke tests for all five UIs are present and integrated into the CI pipeline ."

## Execution Flow (main)
```
1. Parse user description from Input
   → If empty: ERROR "No feature description provided"
2. Extract key concepts from description
   → Identify: actors, actions, data, constraints
3. For each unclear aspect:
   → Mark with [NEEDS CLARIFICATION: specific question]
4. Fill User Scenarios & Testing section
   → If no clear user flow: ERROR "Cannot determine user scenarios"
5. Generate Functional Requirements
   → Each requirement must be testable
   → Mark ambiguous requirements
6. Identify Key Entities (if data involved)
7. Run Review Checklist
   → If any [NEEDS CLARIFICATION]: WARN "Spec has uncertainties"
   → If implementation details found: ERROR "Remove tech details"
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines
- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, not developers

### Section Requirements
- **Mandatory sections**: Must be completed for every feature
- **Optional sections**: Include only when relevant to the feature
- When a section doesn't apply, remove it entirely (don't leave as "N/A")

### For AI Generation
When creating this spec from a user prompt:
1. **Mark all ambiguities**: Use [NEEDS CLARIFICATION: specific question] for any assumption you'd need to make
2. **Don't guess**: If the prompt doesn't specify something (e.g., "login system" without auth method), mark it
3. **Think like a tester**: Every vague requirement should fail the "testable and unambiguous" checklist item
4. **Common underspecified areas**:
   - User types and permissions
   - Data retention/deletion policies  
   - Performance targets and scale
   - Error handling behaviors
   - Integration requirements
   - Security/compliance needs

---

## Clarifications

### Session 2025-01-27
- Q: What should happen when coverage report generation fails for one or more applications? → A: CI pipeline should continue and generate partial review packet with available reports plus error indicators
- Q: What should happen when Playwright test failures occur but artifacts cannot be uploaded? → A: CI pipeline should fail completely and not proceed with review packet generation
- Q: What should happen if the /data/ directory already exists with conflicting files? → A: Fail migration and require manual resolution of conflicts
- Q: What constitutes "key functionality" for each UI's smoke test? → A: One primary user workflow per application (e.g., quote filtering, expense calculation)
- Q: What specific information should be included in the "How to review me" section of README.md? → A: Detailed step-by-step guide including prerequisites, access methods, and artifact interpretation

## User Scenarios & Testing *(mandatory)*

### Primary User Story
As a project reviewer, I need a comprehensive review packet that consolidates all test coverage reports and repository information so that I can efficiently assess the project's quality and readiness for production deployment.

### Acceptance Scenarios
1. **Given** a CI pipeline runs on the development branch, **When** the build completes, **Then** a single review-packet artifact is generated containing unified coverage reports for all five applications
2. **Given** a reviewer accesses the review-artifacts/index.html, **When** they navigate the interface, **Then** they can access both backend and UI coverage reports for each application (quote, expense, temp, todo, stopwatch)
3. **Given** a reviewer opens the review.md file, **When** they read the contents, **Then** they find environment details, commit history, repository structure, and coverage statistics
4. **Given** a developer pushes changes to any branch, **When** Playwright smoke tests run, **Then** failure artifacts (traces and screenshots) are automatically captured and uploaded
5. **Given** a pull request is created, **When** CI runs complete, **Then** the PR includes links to smoke test results for easy reviewer access

### Edge Cases
- When coverage reports fail to generate for one or more applications, the CI pipeline continues and generates a partial review packet with available reports plus clear error indicators for failed applications
- When Playwright test failures occur but artifacts cannot be uploaded, the CI pipeline fails completely and does not proceed with review packet generation
- When the /data/ directory already exists with conflicting files, the migration fails and requires manual resolution of conflicts before proceeding

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: System MUST generate unified coverage reports for all five applications (quote, expense, temp, todo, stopwatch) in both backend and UI formats
- **FR-002**: System MUST consolidate all coverage reports into a single review-artifacts directory structure
- **FR-003**: System MUST create a central review-artifacts/index.html entry point linking to all application coverage reports
- **FR-004**: System MUST augment review.md with environment details (Node/npm versions), last 20 commits log, two-level repository map, and coverage statistics tables
- **FR-005**: System MUST relocate all runtime state files (expenses.json, todo.json, stopwatch-state.json) into a dedicated /data/ directory
- **FR-006**: System MUST add /data/ directory to .gitignore to prevent state file commits
- **FR-007**: System MUST update README.md with "How to review me" section containing detailed step-by-step guide including prerequisites, access methods, and artifact interpretation for accessing development branch CI review-packets
- **FR-008**: System MUST remove stray and temporary files from all branches to ensure clean repository state
- **FR-009**: System MUST create foundational Playwright smoke tests for all five UIs verifying one primary user workflow per application (e.g., quote filtering, expense calculation, temperature conversion, todo management, stopwatch timing)
- **FR-010**: System MUST automatically capture and upload Playwright traces and screenshots as artifacts when smoke tests fail
- **FR-011**: System MUST reference CI smoke test run links in corresponding pull requests

### Key Entities
- **Review Packet**: Consolidated artifact containing coverage reports, enriched review.md, and repository information for project assessment
- **Coverage Report**: Test coverage data for individual applications in both backend and UI formats
- **State Files**: Runtime data files (expenses.json, todo.json, stopwatch-state.json) that maintain application state
- **Smoke Test**: Foundational E2E test verifying key functionality of each UI application

---

## Review & Acceptance Checklist
*GATE: Automated checks run during main() execution*

### Content Quality
- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness
- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous  
- [x] Success criteria are measurable
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

---

## Execution Status
*Updated by main() during processing*

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [x] Review checklist passed

---