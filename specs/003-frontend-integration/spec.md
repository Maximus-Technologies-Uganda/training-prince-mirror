# Feature Specification: Chapter 6 Day 1 – Spec & UX Plan (Frontend Integration)

**Feature Branch**: `003-frontend-integration`  
**Created**: 2025-11-19  
**Status**: Draft  
**Input**: Chapter 6 Day 1 request to define the Next.js frontend UX contract for integrating with the Chapter 5 expenses API (GET /expenses, POST /expenses, GET /expenses/summary) including UI states, accessibility expectations, and the performance budget.

## Clarifications

### Session 2025-11-19

- Q: Which UI surface should host the "Add expense" form so contributors can record entries without leaving the dashboard? → A: Use a right-side drawer that slides over the content while leaving the list partially visible.
- Q: How should the frontend plan for >200 expense rows while keeping LCP under budget? → A: Apply a lightweight windowing library such as `react-window` with fixed-height rows to virtualize the list.
- Q: When users apply category/month filters, should the list and summary stay in sync? → A: Yes—filters are shared so both GET /expenses and GET /expenses/summary use the same parameters and refresh together.
- Q: What telemetry should be captured so reviewers can monitor refresh health? → A: Emit a custom metric like `frontend.expenses.refresh_ms` on each manual or auto refresh to track latency alongside backend logs.
- Q: How should the UI communicate data staleness after 5 minutes? → A: Show a dismissible "Data may be stale" banner with the last refreshed timestamp plus a "Refresh now" CTA that reruns both GET endpoints without breaking context.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Review daily expenses (Priority: P1)

Finance reviewers need to open the dashboard and understand which expenses already exist before deciding what actions to take next.

**Why this priority**: Reading the current data is prerequisite for every other action and is the first deliverable for Day 1.

**Independent Test**: Point the frontend at the Chapter 5 GET /expenses endpoint (per `api/spec/openapi.yaml`) with mocked responses that cover loading, empty, error, and success states and verify that each visual state renders with the mandated copy, CTA, and screenshot evidence.

**Acceptance Scenarios**:

1. **Given** the user opens the page without cached data, **When** GET /expenses is in-flight, **Then** the UI shows a full-width loading skeleton for the list rows plus dimmed summary tiles labeled "Loading expenses…" so the state is obvious within 200 ms.
2. **Given** GET /expenses completes with `data: []`, **When** the UI renders, **Then** the user sees "No expenses found" copy, a short paragraph explaining that they can add one, and a primary "Add expense" CTA above the fold.
3. **Given** GET /expenses fails with a 4xx/5xx, **When** the UI handles the error, **Then** the user sees "Failed to load expenses" copy, an inline error icon, the captured requestId, and a prominent "Retry" button that re-triggers the fetch without requiring a page reload.
4. **Given** GET /expenses succeeds with at least one record, **When** the UI renders the success state, **Then** expenses display in a responsive list with amount, category, date, pagination metadata, and keyboard focus outlines for list rows.

---

### User Story 2 - Capture a new expense (Priority: P2)

Budget contributors need to record a new expense without leaving the screen so the dataset stays current.

**Why this priority**: Creation is the primary state change action and must reuse the Chapter 5 POST /expenses contract without ambiguity.

**Independent Test**: Trigger the creation form, submit valid and invalid payloads against POST /expenses, and confirm the UI surfaces validation errors inline, resets to a pristine state upon success, and refreshes the list view automatically.

**Acceptance Scenarios**:

1. **Given** the user opens the "Add expense" form, **When** they submit required fields (amount, category, date) that conform to the OpenAPI schema, **Then** the UI sends POST /expenses and shows a transient success toast "Expense added" while injecting the returned record into the list without a full reload; the form lives in a right-side drawer that overlays the content while keeping the list visible for context.
2. **Given** the API rejects the payload (e.g., future date), **When** the response returns a `VALIDATION_ERROR`, **Then** each invalid field is flagged with helper text sourced from the response `details` array and focus is moved to the first errored field.
3. **Given** the user dismisses the modal or drawer, **When** they reopen it, **Then** the form is empty and screen reader labels announce field purpose and required status.

---

### User Story 3 - Understand summary trends (Priority: P3)

Finance leads need to read the aggregated totals so they can judge burn rate and category spread.

**Why this priority**: Summary insight is critical for Chapter 6 planning but can ship after the core CRUD path.

**Independent Test**: Call GET /expenses/summary with and without filters, assert the UI renders totals, counts, and applied filters exactly as defined in the OpenAPI schema, and verify loading/empty/error/success visualizations plus screenshot capture in the Review Packet.

**Acceptance Scenarios**:

1. **Given** summary data is loading, **When** GET /expenses/summary is pending, **Then** shimmer placeholders appear inside each summary tile and are labeled with `aria-live="polite"` status text so screen readers are aware of updates.
2. **Given** the summary endpoint returns `count: 0`, **When** the UI renders, **Then** it shows "No summary data yet" with the filters applied and a CTA to "Add an expense" that routes to the creation form.
3. **Given** a user applies category or month filters, **When** GET /expenses/summary returns filtered totals, **Then** chips representing the active filters appear with clearable buttons and the summary cards restate the filters in body copy.
4. **Given** the summary endpoint fails, **When** the user tries again, **Then** the retry button only refreshes the summary pane without reloading the entire page.

### Edge Cases

- Pagination boundaries: pageSize capped at 100 per OpenAPI spec; display notice when user asks for more.
- Mixed states: list succeeds while summary fails (or vice versa); each panel must recover independently with localized error treatment while retaining any shared filters in effect.
- Offline/timeout: if fetch exceeds 10 s show "Still working" hint and keep retry CTA enabled.
- Long lists: when data includes >200 rows, virtualized scrolling plan must be documented (using a lightweight windowing library such as `react-window` with fixed-height rows) to keep LCP under budget even though implementation may happen later.
- Duplicate submission: protect POST /expenses from double-click by disabling the submit button until response resolves.
- Accessibility regression: ensure focus is returned to the triggering button after modal close even if submission failed.
- Stale data: after 5 minutes without a refresh, display a dismissible "Data may be stale" banner that includes the last refreshed timestamp and a "Refresh now" CTA wired to rerun both GET endpoints in place.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The frontend specification MUST describe how the expenses list consumes GET /expenses (see `api/spec/openapi.yaml` → `PaginatedExpenseResponse`) including required columns, pagination controls, and metadata copy.
- **FR-002**: The creation form contract MUST map every POST /expenses field (amount, category, date) to visible inputs, define input masks/placeholders, and state how validation errors from the OpenAPI error envelope surface in-line; the form is delivered via a right-side drawer overlay so contributors never leave the dashboard context.
- **FR-012**: For large datasets (>200 rows), the spec must call for a lightweight windowing library (e.g., `react-window`) with fixed-height rows so the list remains performant without compromising LCP.
- **FR-003**: The summary section MUST reference GET /expenses/summary response fields (`total`, `count`, `filters`) and explain how category/month filters map to UI inputs and chips.
- **FR-003a**: Category and month filters are shared controls: adjusting them updates both GET /expenses and GET /expenses/summary calls with identical parameters so list rows and summary totals always stay aligned.
- **FR-004**: Document the four canonical UI states for both the list and summary panes with copy decks, iconography, motion expectations, and fallback interactions:
  - *Loading*: skeleton rows + shimmering summary tiles triggered within 200 ms, `aria-busy="true"` applied to containers.
  - *Empty*: "No expenses found" / "No summary data yet" message, CTA to open the creation form, and illustration guidance limited to ≤40 KB SVG.
  - *Error*: Inline alert with "Failed to load" copy, space for requestId text (if server returns it), and a Retry button that replays the exact request parameters.
  - *Success*: Paginated list with alternating row background, summary tiles showing total amount, total count, and applied filters; data refresh icon available.
- **FR-005**: Specify that screenshots capturing each state (Loading, Empty, Error, Success) are mandatory artifacts in the Chapter 6 Review Packet, named `state-{state}.png` and stored under the feature folder during implementation and included in the final Review Packet.
- **FR-006**: Define the accessibility plan: every interactive element must have semantic HTML or aria-labels; modals/drawers must trap focus, and list rows require `role="listitem"` inside a `role="list"` container.
- **FR-007**: Describe keyboard navigation expectations: tab order proceeds header → filters → list → summary → form, `Enter` activates primary CTAs, `Esc` dismisses modals, and focus return behavior is documented.
- **FR-008**: Note the WCAG AA contrast requirement (4.5:1 for text, 3:1 for large text/icons) and document how designers will verify it (e.g., reference CI ally scan plus manual contrast swatches in the design file).
- **FR-009**: Establish the performance budget: Largest Contentful Paint must stay < 2.5 s on a cold load in local/dev, specify that hero/illustration assets stay under 150 KB (prefer inline SVG), and any blocking script is deferred until after initial data fetch completes.
- **FR-010**: Outline data refresh and resiliency expectations: list auto-refreshes after POST success, manual refresh button reruns both GET endpoints in parallel, and stale data banners appear if data is >5 minutes old.
- **FR-010a**: Document telemetry hooks so every manual or automatic refresh records a `frontend.expenses.refresh_ms` metric (or equivalent) capturing fetch latency and success/failure state, feeding the existing observability pipeline.
- **FR-010b**: Specify that once data is older than 5 minutes, the UI surfaces a dismissible "Data may be stale" banner showing the last refreshed timestamp plus a "Refresh now" CTA that replays both GET requests without disrupting focus.
- **FR-011**: Include QA evidence expectations: test cases for pagination edges, validation errors, summary filters, and accessibility checks must be enumerated so QA can execute them before implementation PRs merge.

### Key Entities *(include if feature involves data)*

- **Expense (Read Model)**: Mirrors the `Expense` schema from the OpenAPI spec (id, amount, category, date); UI must show currency-formatted amount, localized date, and display the server-provided UUID for troubleshooting.
- **PaginatedExpenseResponse**: Contains `data[]` and `pagination` metadata (totalItems, currentPage, pageSize, totalPages); informs list footer copy and "Showing X–Y of Z" text.
- **ExpenseSummary**: Aggregated totals with optional `filters.category` and `filters.month`; drives summary tiles and filter chips.
- **ExpenseFilters**: UI representation of currently applied filters (category dropdown, month picker) plus derived label tokens reused in screenshot captions.
- **UIStateEvidence Artifact**: Collection of four annotated screenshots and copy references proving Loading/Empty/Error/Success designs exist before build kickoff.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Finance reviewers can reach the Success state of the expenses list (data rendered, focusable rows) within 2.5 s LCP (measured on a throttled local dev profile) in 95% of acceptance runs.
- **SC-002**: 100% of interactive controls defined in the spec include explicit semantic roles and aria-label guidance, and a keyboard-only walkthrough completes every flow without focus traps.
- **SC-003**: The Review Packet contains four screenshots (Loading, Empty, Error, Success) plus captions referencing their related FR numbers prior to `/speckit.plan`; reviewers sign off with no missing evidence.
- **SC-004**: Validation matrix exercises for POST /expenses cover at least five error permutations, each documented with the errant field behavior and resulting copy, providing QA a deterministic checklist.
- **SC-005**: Summary insight users can apply category and month filters and see updated totals with the correct chips in ≤3 interactions, confirmed through moderated UX review.

## Assumptions

- The Next.js frontend already has authenticated access to the Chapter 5 API base URL and does not require additional auth scope changes for these endpoints.
- Currency formatting follows the locale of the signed-in user (default: en-US, USD) and can be updated later without revisiting the API contract.
- Pagination defaults (page=1, pageSize=20) per OpenAPI spec are sufficient for Day 1; advanced sorting/filtering will be defined in future days.
- Designers will use lightweight SVG or CSS-only illustrations to stay within the image budget; no raster hero artwork is planned for Day 1.

## References

- Chapter 5 OpenAPI spec (`api/spec/openapi.yaml`): GET /expenses, POST /expenses, GET /expenses/summary definitions.
- Accessibility guardrails from `ACCESSIBILITY_AUDIT.md`.
- Performance expectations from CI ally workflow (`.github/workflows/ally-check.yml`) informing the WCAG AA requirement.
