# Feature Specification: Week 5 Day 3: Docs, ReviewPacket, and Playwright Smoke

**Feature Branch**: `028-week-5-day`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: User description: "Title: Week 5 Day 3: Docs, ReviewPacket, and Playwright Smoke

Context: This specification covers the Day 3 objectives from the Week 5 workbook. The goal is to generate and publish our API documentation, update the main review-packet to include it, and create a new Playwright smoke test that validates the UI and API work together.

Core Requirements:

API Documentation (Redoc/Scalar):

Create a CI step (or update an existing one) to build an HTML documentation file from our openapi.yaml spec using Redoc or Scalar.

Configure the deploy-pages workflow to publish this new docs/api.html file to GitHub Pages.

Review Packet Enhancement:

Update the build-review-packet workflow.

The review-artifacts/index.html must now include:

The Coverage Table (existing).

The Playwright Report (existing).

A new link to the live GitHub Pages API documentation (docs/api.html).


Playwright UI + API Smoke Test:

Create a new Playwright smoke test (or update an existing one).

This test must prove the UI and API are integrated.

Test Flow:

Load the Expense or To-Do UI.

Perform an action that calls the new API (e.g., create an expense, add a task).

Wait for the API call to complete and assert that the UI updates correctly (e.g., the new item appears in the list, the summary total changes).

This new smoke test must be added to the required Playwright Smoke CI job.


Definition of Done:

The API documentation is live on GitHub Pages.

The review-artifacts/index.html file is updated with a valid link to the API documentation.

The new Playwright smoke test is implemented and passes, proving the UI-to-API connection.

All CI checks (spec-check, Test & Coverage - API, Playwright Smoke) are green.

The pull request is reviewed and merged."

---

## ⚡ Quick Guidelines
- ✅ Focus on WHAT documentation and integration testing capabilities are needed and WHY (documentation accessibility, UI-API integration validation)
- ❌ Avoid HOW to implement specific CI tools or test frameworks (no detailed CI script code, no Playwright test implementation details)
- 👥 Written for reviewers, API consumers, and developers who need to validate system integration

---

## User Scenarios & Testing *(mandatory)*

### Primary User Story
As a reviewer or API consumer, I need:
1. Access to live, published API documentation that is automatically generated from the OpenAPI specification
2. A review packet that includes all necessary artifacts (coverage, test reports, and API documentation) in one accessible location
3. Confidence that the Expense UI and API are properly integrated through automated smoke tests that validate end-to-end workflows

This ensures reviewers can access complete documentation, API consumers can discover and understand the API, and the development team can verify UI-API integration before deployment.

### Acceptance Scenarios
1. **Given** an OpenAPI specification exists, **When** a CI workflow runs, **Then** an HTML documentation file is generated and published to GitHub Pages, making it accessible to all users
2. **Given** the review packet is generated, **When** a reviewer accesses review-artifacts/index.html, **Then** they can navigate to the live API documentation via a link, view coverage reports, and access Playwright test results
3. **Given** a Playwright smoke test is executed, **When** the test performs a UI action (creating an expense) that triggers an API call, **Then** the test validates that the UI updates correctly after the API call completes (e.g., new expense appears, summary updates)
4. **Given** the Playwright Smoke CI job runs, **When** all smoke tests execute, **Then** the UI-API integration is validated and the job passes, confirming the system works end-to-end
5. **Given** API documentation is published to GitHub Pages, **When** a user accesses the documentation URL, **Then** they can view the complete API specification in an interactive format

### Edge Cases
- What happens if the OpenAPI spec is invalid or missing? → Documentation generation step should fail and prevent deployment
- What if GitHub Pages deployment fails? → CI workflow should fail and prevent incomplete documentation from being published
- What if the API is unavailable during smoke test execution? → Test should fail with a clear error message indicating API connectivity issues
- What if the UI doesn't update after an API call? → Smoke test should fail, indicating a UI-API integration problem
- What if the review packet link to API documentation is broken? → Link validation should be part of the review packet build process
- What happens if the smoke test times out waiting for UI updates? → Test should have appropriate timeouts and fail with a clear timeout message

---

## Requirements *(mandatory)*

### Functional Requirements

#### API Documentation Generation and Publishing
- **FR-001**: System MUST generate an HTML documentation file from the openapi.yaml specification file using Redoc
- **FR-002**: System MUST execute the documentation generation step as part of a CI workflow (either as a new step or within an existing workflow)
- **FR-003**: System MUST publish the generated HTML documentation file to GitHub Pages at the path docs/api.html
- **FR-004**: System MUST configure the deploy-pages workflow (or equivalent) to include the documentation generation and publishing steps
- **FR-005**: System MUST ensure the API documentation is accessible via a public URL on GitHub Pages
- **FR-006**: System MUST ensure documentation generation fails if the OpenAPI specification is invalid or missing

#### Review Packet Enhancement
- **FR-007**: System MUST update the build-review-packet workflow to include a link to the live GitHub Pages API documentation
- **FR-008**: System MUST ensure review-artifacts/index.html includes the Coverage Table (existing functionality must be preserved)
- **FR-009**: System MUST ensure review-artifacts/index.html includes the Playwright Report link (existing functionality must be preserved)
- **FR-010**: System MUST add a new link in review-artifacts/index.html that points to the live GitHub Pages API documentation (docs/api.html)
- **FR-011**: System MUST ensure the review packet build process validates that all links (including the new API documentation link) are accessible
- **FR-012**: System MUST ensure the review packet includes all three required components: Coverage Table, Playwright Report, and API Documentation link

#### Playwright UI + API Smoke Test
- **FR-013**: System MUST provide a Playwright smoke test that validates UI and API integration
- **FR-014**: System MUST ensure the smoke test loads the Expense UI component
- **FR-015**: System MUST ensure the smoke test performs a user action that triggers an API call (e.g., creating an expense)
- **FR-016**: System MUST ensure the smoke test waits for the API call to complete before making assertions
- **FR-017**: System MUST ensure the smoke test asserts both that: (a) the API request succeeded (HTTP 200 response), AND (b) the UI updated correctly to display the new expense data (item appears in list, summary total changes)
- **FR-018**: System MUST ensure the smoke test asserts that the API response was successfully received and processed
- **FR-019**: System MUST ensure the Playwright Smoke CI job is configured as a required status check for pull requests
- **FR-020**: System MUST ensure the smoke test provides clear failure messages if UI-API integration fails
- **FR-021**: System MUST ensure the smoke test fails if any API errors occur, with detailed error information including HTTP status code, response body, and error message for debugging purposes

#### CI/CD Integration
- **FR-022**: System MUST ensure all CI checks (spec-check, Test & Coverage - API, Playwright Smoke) pass before allowing merge
- **FR-023**: System MUST ensure the Playwright Smoke CI job runs on every pull request
- **FR-024**: System MUST ensure API documentation is published to GitHub Pages on merge to main branch only
- **FR-025**: System MUST generate validation/preview documentation on pull requests for verification purposes

### Key Entities

- **API Documentation**: An HTML file generated from the OpenAPI specification that provides interactive documentation for API consumers, accessible via GitHub Pages
- **Review Packet**: A collection of artifacts (coverage reports, Playwright test results, API documentation links) packaged in review-artifacts/index.html for reviewer access
- **Smoke Test**: An automated end-to-end test that validates critical UI-API integration workflows by performing user actions and verifying UI updates after API calls
- **GitHub Pages**: A hosting service for publishing documentation and static content, accessible via public URLs
- **OpenAPI Specification**: The source of truth for API contract definition, used to generate documentation

---

## Definition of Done

All of the following must be satisfied before this feature is considered complete:

- [ ] CI workflow step created/updated to generate HTML documentation from openapi.yaml using Redoc or Scalar
- [ ] Documentation generation step executes successfully in CI
- [ ] deploy-pages workflow (or equivalent) configured to publish docs/api.html to GitHub Pages
- [ ] API documentation is live and accessible on GitHub Pages
- [ ] build-review-packet workflow updated to include API documentation link
- [ ] review-artifacts/index.html includes Coverage Table (existing functionality preserved)
- [ ] review-artifacts/index.html includes Playwright Report link (existing functionality preserved)
- [ ] review-artifacts/index.html includes new link to live GitHub Pages API documentation (docs/api.html)
- [ ] Review packet link validation confirms all links are accessible
- [ ] Playwright smoke test created that loads Expense or To-Do UI
- [ ] Playwright smoke test performs action that triggers API call (e.g., create expense, add task)
- [ ] Playwright smoke test waits for API call completion
- [ ] Playwright smoke test asserts UI updates correctly after API call (e.g., item appears, summary changes)
- [ ] Playwright smoke test integrated into Playwright Smoke CI job
- [ ] Playwright Smoke CI job configured as required status check
- [ ] Playwright smoke test passes, proving UI-API integration
- [ ] spec-check CI job passes
- [ ] Test & Coverage - API CI job passes
- [ ] Playwright Smoke CI job passes (all checks green)
- [ ] Pull Request opened with all changes
- [ ] PR reviewed and approved
- [ ] PR merged to target branch

---

## Review & Acceptance Checklist
*GATE: Automated checks run during specification creation*

### Content Quality
- [x] No implementation details (no specific CI script code, no Playwright test implementation code)
- [x] Focused on documentation accessibility and integration testing value
- [x] Written for reviewers, API consumers, and developers validating system integration
- [x] All mandatory sections completed

### Requirement Completeness
- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous (CI jobs pass/fail, tests execute, documentation accessible)
- [x] Success criteria are measurable (documentation live, links work, tests pass)
- [x] Scope is clearly bounded (Day 3 objectives: docs, review packet, smoke test)
- [x] Dependencies and assumptions identified (OpenAPI spec exists, GitHub Pages available, UI components exist)

---

## Execution Status
*Updated during specification creation*

- [x] User description parsed
- [x] Key concepts extracted (API documentation, review packet enhancement, UI-API integration testing)
- [x] Ambiguities resolved (all requirements are clear)
- [x] User scenarios defined
- [x] Requirements generated (24 functional requirements)
- [x] Entities identified (5 key entities)
- [x] Review checklist passed

---

## Clarifications

### Session 2025-01-27 (Prior)
- Q: Which documentation tool should be used (Redoc vs Scalar)? → A: Either tool is acceptable; choose based on team preference and CI environment compatibility
- Q: Should the smoke test cover both Expense and To-Do UIs, or just one? → A: At least one UI must be tested; covering both is preferred but one is sufficient to prove integration
- Q: What specific API endpoints should the smoke test call? → A: The test should call endpoints that create or modify data (e.g., POST /expenses, POST /todos) to validate UI updates
- Q: Should the API documentation be published on every PR or only on merge to main? → A: Documentation should be published on merge to main (or appropriate target branch); PRs can generate preview documentation if desired
- Q: What happens if GitHub Pages is not available or configured? → A: The deploy-pages workflow should fail clearly, and documentation generation should be validated before publishing
- Q: Should the smoke test run against a local API or deployed API? → A: The test should run against the API environment available in CI (typically local/test environment)
- Q: What UI update assertions are required? → A: At minimum, the test must verify that data created via API appears in the UI (e.g., new item in list, updated summary). Additional assertions (form reset, error handling) are beneficial but not strictly required

### Session 2025-11-11
- Q: Which documentation tool should be used (Redoc vs Scalar)? → A: Redoc (mature, widely-adopted, excellent OpenAPI support, generates standalone HTML)
- Q: Should the smoke test cover both Expense and To-Do UIs, or focus on one? → A: Expense only (focused scope, reduced maintenance burden)
- Q: On which branch should API documentation be published to GitHub Pages? → A: Main branch only (production docs); optional preview on PRs
- Q: What assertions should the smoke test validate? → A: Both visible data changes (new expense in list, updated total) AND verify API response success
- Q: How should the smoke test handle API errors? → A: Fail with clear error details (status code, response body, error message)

---

## Notes for Implementation Team

1. **Documentation Generation**: Choose a tool (Redoc or Scalar) that:
   - Can run in CI environment (Node.js compatible)
   - Generates standalone HTML files
   - Supports the OpenAPI version used in the spec
   - Produces visually appealing, interactive documentation

2. **GitHub Pages Deployment**: 
   - Ensure GitHub Pages is enabled for the repository
   - Configure the deploy-pages workflow to run on merge to main (or appropriate branch)
   - The docs/api.html file should be accessible at: `https://[org].github.io/[repo]/docs/api.html`

3. **Review Packet Structure**: The review-artifacts/index.html should maintain existing functionality while adding the new API documentation link. Consider organizing links in a clear, navigable structure.

4. **Smoke Test Strategy**: The smoke test should:
   - Start with a clean state (clear any existing data if needed)
   - Perform a clear, observable action (create expense, add todo)
   - Wait for network requests to complete
   - Assert visible UI changes (item appears, count updates, summary changes)
   - Handle timeouts appropriately (wait for API response, wait for UI update)

5. **CI Job Configuration**:
   - Playwright Smoke job should run on every PR
   - Documentation generation can run on PR for validation, but publishing should occur on merge
   - All required checks must pass before merge

6. **Integration Testing Approach**: The smoke test validates the critical path:
   - UI → API request → API response → UI update
   - This proves the frontend and backend are properly connected
   - Focus on happy path initially; error handling can be added later

7. **Link Validation**: Consider adding a validation step in the review packet build that checks all links (coverage, Playwright report, API docs) are accessible before packaging.
