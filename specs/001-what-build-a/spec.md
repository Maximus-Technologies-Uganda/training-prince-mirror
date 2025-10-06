# Feature Specification: UI To‑Do Management

**Feature Branch**: `001-what-build-a`  
**Created**: 2025-10-06  
**Status**: Approved  
**Input**: Build a UI for the to‑do application with add, toggle, remove; filters for
"due‑today" and "high‑priority"; require a clock abstraction for deterministic tests;
wire UI to existing todo core logic.

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

### Session 2025-10-06
- Q: What timezone should define “today” for the due‑today filter? → A: Fixed TZ: Africa/Kampala (UTC+3)
- Q: Should duplicate detection treat “Buy milk” and “buy  milk” as the same? → A: Case-insensitive and collapse internal whitespace
- Q: What should happen when removing an item while a filter is active? → A: Remove from the underlying list; keep current filter applied
- Q: How should invalid due dates entered by the user be handled? → A: Block add with inline error, keep input
- Q: Should to-dos persist across page reloads? → A: No, in-memory for now

---

## User Scenarios & Testing (mandatory)

### Primary User Story
As a user, I want to manage my to‑dos in a simple UI so I can add tasks, mark them
complete, remove them, and quickly focus on items due today or marked high priority.

### Acceptance Scenarios
1. Given the to‑do list is empty, When I add "Buy milk" with due date today and
   priority high, Then I see the new item in the list with correct attributes.
2. Given an existing incomplete to‑do, When I toggle it, Then it becomes completed
   and is visually indicated as such.
3. Given an existing completed to‑do, When I toggle it, Then it becomes incomplete
   and is visually indicated as such.
4. Given multiple items with varying due dates, When I apply the "due‑today" filter,
   Then only items whose due date equals "today" per the clock abstraction are shown.
5. Given multiple items with different priorities, When I apply the "high‑priority"
   filter, Then only items marked high priority are shown.
6. Given an existing item with text "Buy milk", When I try to add another item with
   the exact same text, Then I am prevented from adding a duplicate and see an error.

### Edge Cases
- Adding an empty or whitespace‑only task should be rejected with a clear message.
- Duplicate detection is case‑insensitive with whitespace normalization (trim +
  collapse internal sequences).
- "Due‑today" boundary uses the provided clock abstraction in timezone
  Africa/Kampala (UTC+3); items exactly at 00:00 or 23:59 of "today" are included as
  due today.
- Toggling from an invalid state (e.g., missing item, out‑of‑bounds index) is
  rejected with a clear error state without mutating list data.
- Removing an item under an active filter removes it from the source list and keeps
  the current filter applied; the filtered view updates without switching modes.
- Invalid or unparsable due dates block the add action; an inline error is shown and
  the current input values are preserved for user correction.
- Reloading the page clears the current to‑do list (no persistence).

## Requirements (mandatory)

### Functional Requirements
- **FR-001**: Users MUST be able to add a to‑do with text, optional due date, and
  optional priority (default normal).
- **FR-002**: Users MUST be able to toggle completion status of an existing to‑do.
- **FR-003**: Users MUST be able to remove an existing to‑do. Removal MUST update the
  list while preserving the current filter mode (no reset to All).
- **FR-004**: UI MUST provide a "due‑today" filter that uses a clock abstraction with
  fixed timezone Africa/Kampala (UTC+3) to determine "today" deterministically.
- **FR-005**: UI MUST provide a "high‑priority" filter to view only high‑priority items.
- **FR-006**: The system MUST prevent adding duplicate tasks (same text after
  normalization: trim, collapse internal whitespace, and case-insensitive compare).
- **FR-007**: Invalid state transitions (e.g., toggling a non‑existent item) MUST be
  guarded and leave state unchanged with a clear user feedback.
- **FR-008**: UI MUST reuse existing core logic from `src/todo/` for domain
  behavior (add, toggle, remove, validation) without duplicating logic.
- **FR-009**: A Playwright smoke flow MUST add a new item and then toggle it
  successfully in a running build.
- **FR-010**: The `ui-todo` module MUST achieve ≥40% statement coverage (unit tests)
  measured by Vitest; coverage MUST be included in the CI review‑packet.
- **FR-011**: The PR MUST link to the `review-packet` artifact and confirm
  presence of the `ui-coverage-todo` folder.
- **FR-012**: Invalid due dates MUST block adding the item and display an inline error
  while preserving the user's input for correction.
- **FR-013**: To‑dos are session-only (in-memory); reloading the page resets the list.

### Key Entities (include if feature involves data)
- **ToDoItem**: text (string), completed (boolean), dueDate (date | null),
  priority (enum: high | normal), id/index (stable identifier).
- **Filters**: mode (all | due‑today | high‑priority), computed using clock abstraction
  (for due‑today) and item priority.

---

## Review & Acceptance Checklist
*GATE: Automated checks run during main() execution*

### Content Quality
- [ ] No implementation details (languages, frameworks, APIs)
- [ ] Focused on user value and business needs
- [ ] Written for non-technical stakeholders
- [ ] All mandatory sections completed

### Requirement Completeness
- [ ] No [NEEDS CLARIFICATION] markers remain
- [ ] Requirements are testable and unambiguous  
- [ ] Success criteria are measurable
- [ ] Scope is clearly bounded
- [ ] Dependencies and assumptions identified

---

## Execution Status
*Updated by main() during processing*

- [ ] User description parsed
- [ ] Key concepts extracted
- [ ] Ambiguities marked
- [ ] User scenarios defined
- [ ] Requirements generated
- [ ] Entities identified
- [ ] Review checklist passed

---
