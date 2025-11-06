
# Implementation Plan: Friday Final Polish and Documentation Export

**Branch**: `015-friday-final-polish` | **Date**: October 28, 2025 | **Spec**: `/specs/015-friday-final-polish/spec.md`  
**Input**: Feature specification from `/specs/015-friday-final-polish/spec.md`

## Summary

Conduct final visual polish across five UIs (Quote, Temperature Converter, Expense Tracker, To-Do List, Stopwatch) by identifying and fixing critical alignment, spacing, and visual glitches (prioritized by severity). Compile all reusable UI components (organized by type) and design tokens (extracted from Figma as authoritative source) and document both in dedicated README sections. Ensure all tests pass and CI checks complete before merging to development.

---

## Technical Context

**Language/Version**: JavaScript (ES6+), Node.js  
**Primary Dependencies**: Vite, Vue.js/Vanilla JS, Vitest, Playwright, ESLint, Prettier  
**Storage**: N/A (documentation-only tasks for polish + export)  
**Testing**: Vitest (unit coverage ≥40%), Playwright (e2e smoke tests)  
**Target Platform**: Web browsers (desktop/responsive)  
**Project Type**: Web application (frontend + backend; Vite-powered vanilla JavaScript frontend)  
**Performance Goals**: No new performance targets; maintain current performance baselines  
**Constraints**: Visual polish only (no functional changes); 300 LOC PR limit per constitutional requirements  
**Scale/Scope**: Five UI applications total; reusable component inventory across all five; design token set from Figma library

---

## Constitution Check

**✅ INITIAL CONSTITUTION CHECK: PASS**

| Principle | Status | Verification |
|-----------|--------|--------------|
| **I. No Logic Duplication** | ✅ PASS | Feature is UI polish + documentation only; no backend logic modification required. All five UIs already import core logic from `src/<app>`. |
| **II. Test Coverage Mandate** | ✅ PASS | Existing UI coverage (≥40% per app) will be maintained. No regressions allowed (FR-010, FR-011); test suite must pass as completion gate. |
| **III. Reviewability is Paramount** | ✅ PASS | Final PR will include ticked spec, component inventory, and token documentation in README. Review-packet index must include all coverage reports. |
| **IV. PR Craft** | ✅ PASS | PR will be ≤300 LOC (documentation additions to README + spec file); pass all CI checks; include required PR description template with coverage table and Spec link. |
| **V. Simplicity & Consistency** | ✅ PASS | Using existing tech stack (Vite, Vitest, Playwright, ESLint, Prettier); no new tools introduced. Vanilla JS UI polish and markdown documentation. |

**Gate Result**: Initial check PASS. Proceed to Phase 0.

---

## Project Structure

### Documentation (this feature)
```
specs/015-friday-final-polish/
├── spec.md              # Feature specification (completed)
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (research findings, decisions)
├── data-model.md        # Phase 1 output (component inventory structure, token schema)
├── quickstart.md        # Phase 1 output (validation test scenarios)
├── contracts/           # Phase 1 output (component/token export formats)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
frontend/
├── src/
│   ├── ui-quote/        # Quote UI
│   ├── ui-temp/         # Temperature Converter UI
│   ├── ui-expense/      # Expense Tracker UI
│   ├── ui-todo/         # To-Do List UI
│   ├── ui-stopwatch/    # Stopwatch UI
│   └── components/      # Shared component library (reusable buttons, inputs, cards, etc.)
├── dist/                # Vite build output (deployment target)
└── tests/
    ├── unit/            # Vitest unit tests (maintain ≥40% coverage per app)
    └── e2e/             # Playwright e2e tests (smoke tests per UI)

README.md                # Project root documentation (target for component inventory + token list sections)

Figma Design Library
├── Design Tokens        # Colors, spacing, typography (authoritative source per FR-006)
└── Component Library    # Figma components matching reusable UI components
```

**Structure Decision**: Web application structure confirmed. Five independent UI applications share a common component library and core business logic from `src/<app>`. Frontend is Vite-powered vanilla JavaScript. All visual assets and design decisions originate from the Figma design library (single source of truth for tokens).

---

## Phase 0: Outline & Research

### Research Tasks

Based on the feature requirements and technical context, Phase 0 will research and document:

1. **UI Component Inventory Extraction**
   - Best practices for cataloging reusable UI components in vanilla JavaScript
   - Identifying component boundaries (buttons, inputs, cards, modals, lists)
   - Tool recommendations for visual component documentation
   - How to extract component usage patterns from the five UIs

2. **Design Token Extraction from Figma**
   - Figma API access and token export methods
   - Tools for programmatic design token extraction (Figma plugins, CLI tools)
   - Token naming conventions and categorization (colors, spacing, typography)
   - Ensuring code implementation matches Figma tokens
   - Best practices for token documentation in markdown

3. **Visual Polish Standards & Prioritization**
   - Common visual glitches in web UIs (alignment, spacing, responsive inconsistencies)
   - Severity classification for UI issues (critical vs. minor)
   - Browser compatibility and responsive design testing
   - Visual regression testing approaches

4. **README Documentation Structure**
   - Best practices for component inventory documentation in README
   - Design token documentation formats (tables, code blocks)
   - Organizing component inventory by type with cross-app locations
   - Markdown formatting and readability

5. **Vite & Test Framework Capabilities**
   - Vite build configuration for production-ready frontend deployment
   - Vitest coverage reporting and thresholds enforcement
   - Playwright e2e test expectations for smoke testing
   - CI/CD integration for all checks (lint, tests, build)

### Consolidation Approach

Research findings will be documented in `research.md` with:
- **Decision**: What method/tool/approach was selected
- **Rationale**: Why it was chosen (best for this project)
- **Alternatives Considered**: Other options evaluated and why rejected
- **Implementation Notes**: Specific guidance for Phase 1 design

**Output**: `research.md` - complete research artifact with all unknowns resolved and decisions ratified.

---

## Phase 1: Design & Contracts

### 1. Data Model Extraction (`data-model.md`)

Extract three key entities from the feature spec:

#### Entity: UI Component
```
- Name: [component identifier, e.g., "PrimaryButton", "FormInput"]
- Type: [category: button | input | card | modal | list | other]
- Description: [purpose and usage pattern]
- Applications: [list of 1-5 apps using this component]
- File Location: [path(s) in frontend/src/]
- Styling: [CSS class, inline styles, or Tailwind if applicable]
- Props/Configuration: [any configurable aspects: size, variant, state]
- Example Usage: [code snippet or reference]
- Accessibility: [ARIA attributes, semantic HTML notes]
- Responsive Behavior: [mobile/tablet/desktop adaptations]
```

#### Entity: Design Token
```
- Token Name: [hierarchical name, e.g., "color/text/primary"]
- Category: [colors | spacing | typography | shadows | borders | etc.]
- Value: [concrete value, e.g., "#333333", "16px", "14px/1.5 sans-serif"]
- Figma Reference: [path in Figma library, e.g., "Colors/Text/Primary"]
- Applications: [which UIs use this token]
- CSS Variable: [if defined in code, e.g., "--color-text-primary"]
- Description: [usage context and rationale]
- Aliases: [alternative names or deprecated references]
```

#### Entity: Visual Polish Issue
```
- ID: [issue identifier, e.g., "QUOTE-001"]
- Type: [alignment | spacing | glitch | responsive | color | typography | other]
- Severity: [critical | high | medium | low]
- Affected App: [which UI(s)]
- Location: [screen/component path]
- Description: [what needs fixing]
- Root Cause: [why it occurred if known]
- Proposed Fix: [specific action]
- Status: [pending | in-progress | resolved | verified]
```

**Output**: `data-model.md` with complete schema for components, tokens, and issues.

### 2. Component Inventory Contract (`contracts/component-inventory.json`)

Define export format for the component inventory to be embedded in README:

```json
{
  "format_version": "1.0",
  "exported_date": "2025-10-28",
  "component_categories": {
    "buttons": [
      {
        "name": "string",
        "type": "button",
        "description": "string",
        "applications": ["app1", "app2"],
        "file_locations": ["path1", "path2"],
        "example_usage": "string or code block"
      }
    ],
    "inputs": [...],
    "cards": [...],
    "modals": [...],
    "lists": [...]
  }
}
```

### 3. Design Token Export Contract (`contracts/design-tokens.json`)

Define export format for design tokens:

```json
{
  "format_version": "1.0",
  "source": "Figma Design Library",
  "exported_date": "2025-10-28",
  "tokens": {
    "colors": [
      {
        "name": "string (e.g., 'color/text/primary')",
        "value": "string (e.g., '#333333')",
        "description": "string",
        "applications": ["app1", "app2"],
        "figma_path": "string"
      }
    ],
    "spacing": [...],
    "typography": [...]
  }
}
```

### 4. README Documentation Contract (`contracts/readme-sections.md`)

Define markdown sections to be added to the main README:

#### Component Inventory Section
```markdown
## UI Component Library

All reusable UI components are organized by type and documented below.
Each component lists the applications using it and links to implementation details.

### Buttons
- [List of button components with descriptions, usage across apps]

### Inputs
- [List of input components with descriptions, usage across apps]

### Cards
- [List of card components with descriptions, usage across apps]

### Modals
- [List of modal components with descriptions, usage across apps]

### Lists
- [List of list components with descriptions, usage across apps]
```

#### Design Token Section
```markdown
## Design System Tokens

Design tokens are the source of truth for visual consistency.
All tokens are defined in the Figma design library and implemented in code.

### Colors
| Token Name | Value | Usage |
|------------|-------|-------|
| color/text/primary | #333333 | Primary text |
| ... | ... | ... |

### Spacing
| Token Name | Value | Usage |
|------------|-------|-------|
| spacing/xs | 4px | Small spacing |
| ... | ... | ... |

### Typography
| Token Name | Value | Usage |
|------------|-------|-------|
| typography/body | 14px/1.5 sans-serif | Body text |
| ... | ... | ... |
```

### 5. Quickstart Validation Test Scenarios (`quickstart.md`)

Define test scenarios for validating the polish work:

```
## Quickstart: Friday Final Polish Validation

### Pre-Validation
1. Frontend build passes: `npm run build`
2. All unit tests pass: `npm test`
3. All e2e tests pass: `npm run test:e2e`

### Visual Review Validation
For each of the five UIs (Quote, Temp, Expense, To-Do, Stopwatch):
1. Open the UI in browser at http://localhost:5173/[ui-path]
2. Check alignment of all major UI elements (left, center, right alignment)
3. Verify spacing consistency (margins, padding match token values)
4. Look for any visual glitches (overlapping elements, cut-off text, color inconsistencies)
5. Test responsive behavior at 320px (mobile), 768px (tablet), 1920px (desktop)
6. Document any issues found with severity level

### Component Inventory Validation
1. README contains a "UI Component Library" section
2. Each component type (buttons, inputs, cards, modals, lists) has dedicated subsection
3. Each component lists name, description, and applications using it
4. File locations and example usage are provided for at least 50% of components

### Design Token Validation
1. README contains a "Design System Tokens" section
2. Design tokens are organized by category (colors, spacing, typography)
3. Each token shows name, value, and usage description
4. All colors, spacing, and typography from Figma are documented
5. No hardcoded CSS values exist in code that don't correspond to a token

### Final Checks
1. PR passes all CI checks (lint, test, build)
2. PR is ≤300 LOC
3. PR includes spec file link and coverage table in description
4. No test regressions introduced
```

### 6. Agent Context Update

Execute the update-agent-context script to generate `CLAUDE.md` in the repository root with current technical context:

```bash
.specify/scripts/bash/update-agent-context.sh cursor
```

This creates an agent-specific file with condensed technical context for Claude, including:
- Tech stack summary
- Component library structure
- Token extraction approach
- Five UI applications structure
- Test requirements per constitution
- Recent decisions from clarifications and research

---

## Phase 1 Summary

**Outputs Generated**:
- ✅ `research.md` - All research findings, decisions, alternatives
- ✅ `data-model.md` - Component, token, and issue schemas
- ✅ `contracts/component-inventory.json` - Export format
- ✅ `contracts/design-tokens.json` - Token export format
- ✅ `contracts/readme-sections.md` - README markdown structure
- ✅ `quickstart.md` - Validation test scenarios
- ✅ `CLAUDE.md` - Agent context (repository root)

### Post-Design Constitution Check

**✅ POST-DESIGN CONSTITUTION CHECK: PASS**

All designs align with constitutional principles:
- No logic duplication (documentation only)
- Test coverage maintained (no regressions)
- Reviewability intact (README + spec in PR)
- PR craft compliant (≤300 LOC, coverage table, spec link)
- Simplicity maintained (vanilla JS, existing tools only)

---

## Phase 2: Task Planning Approach

**This section describes what the /tasks command will do. Phase 2 is NOT executed during /plan.**

### Task Generation Strategy

The `/tasks` command will load `.specify/templates/tasks-template.md` and generate ordered tasks from Phase 1 artifacts:

1. **Visual Review Tasks** - One task per UI application
   - Task: Review Quote UI for visual inconsistencies
   - Task: Review Temperature Converter UI for visual inconsistencies
   - Task: Review Expense Tracker UI for visual inconsistencies
   - Task: Review To-Do List UI for visual inconsistencies
   - Task: Review Stopwatch UI for visual inconsistencies
   - Subtasks: Identify issues, prioritize by severity, document in issue tracker

2. **Visual Polish Fix Tasks** - Generated based on identified issues during review
   - Fix critical visual issues in each UI (priority order)
   - Fix high-priority visual issues
   - Fix medium-priority visual issues
   - Verify fixes in browser and automated tests

3. **Component Inventory Tasks** - Extract and document components
   - Task: Scan all five UIs and identify all reusable components
   - Task: Document each component (name, type, description, file locations, usage examples)
   - Task: Categorize components by type (buttons, inputs, cards, modals, lists)
   - Task: Prepare component inventory JSON export
   - Task: Create component inventory section in README

4. **Design Token Tasks** - Extract Figma tokens and document
   - Task: Access Figma design library and extract all design tokens
   - Task: Organize tokens by category (colors, spacing, typography, etc.)
   - Task: Document each token (name, value, Figma reference, usage)
   - Task: Verify code implementation matches token definitions
   - Task: Create design token export JSON
   - Task: Create design token section in README

5. **Testing & Validation Tasks**
   - Task: Run full test suite (unit + e2e)
   - Task: Verify no test regressions
   - Task: Run linting (ESLint) and formatting (Prettier)
   - Task: Execute quickstart validation scenarios
   - Task: Verify responsive design at multiple breakpoints

6. **PR & Documentation Tasks**
   - Task: Create final PR with spec, component inventory, token list
   - Task: Update PR description with coverage table and Spec link
   - Task: Ensure PR ≤300 LOC (break into multiple PRs if needed)
   - Task: Verify all CI checks pass
   - Task: Merge PR to development branch

### Ordering Strategy

- **TDD Order**: Tests must be passing before documentation exports (FR-010, FR-011)
- **Dependency Order**: 
  1. Review UIs first (identify all issues)
  2. Fix critical issues (visual polish)
  3. Extract components (after polish complete)
  4. Extract tokens (after polish complete)
  5. Document in README (after extraction complete)
  6. Test and validate (final gate)

- **[P] Parallel Execution**: The following can run in parallel:
  - Visual review of all five UIs (independent files)
  - Fixing visual issues per UI (independent files)
  - Documenting different component types (independent categories)
  - Documenting different token categories (independent categories)

### Estimated Output

- **25-35 numbered, ordered tasks** in `tasks.md`
- Tasks marked with `[P]` for parallel execution where independent
- Dependencies explicitly called out (e.g., "Requires completion of visual review for Quote UI")
- Estimated effort per task (1-2 hour, 2-4 hour, 4-8 hour buckets)
- Definition of Done for each task aligned with acceptance criteria

**IMPORTANT**: Phase 2 task generation is executed by the `/tasks` command, NOT by `/plan`.

---

## Phase 3+: Future Implementation

**These phases are beyond the scope of the /plan command:**

- **Phase 3**: Task execution (`/tasks` command creates tasks.md with detailed subtasks)
- **Phase 4**: Implementation (execute tasks.md following constitutional principles, one UI at a time)
- **Phase 5**: Validation (run all tests, execute quickstart scenarios, visual spot-check, performance baseline check)

---

## Complexity Tracking

No complexity violations identified. Feature is well-scoped (UI polish + documentation) and aligns with project architecture (five independent UIs sharing component library and core logic). No new tools, services, or architectural patterns required.

| Item | Status |
|------|--------|
| Constitution Alignment | ✅ Full compliance |
| Technology Stack | ✅ Existing tools only (Vite, Vitest, Playwright, ESLint, Prettier) |
| Scope Boundaries | ✅ Clearly bounded (polish only, no features) |
| Dependencies | ✅ All identified (Figma library, existing test suites) |
| Rework Risk | ✅ Low (clarifications completed, decisions locked) |

---

## Progress Tracking

**Phase Status**:
- [x] Phase 0: Research complete (/plan command) - Strategy documented
- [x] Phase 1: Design complete (/plan command) - Contracts, data model, quickstart defined
- [x] Phase 2: Task planning complete (/plan command) - Approach documented
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved (4 clarifications documented in spec)
- [x] Complexity deviations documented (none - full compliance)

**Artifacts Generated**:
- [x] plan.md (this file)
- [ ] research.md (Phase 0 output - ready to generate)
- [ ] data-model.md (Phase 1 output - ready to generate)
- [ ] quickstart.md (Phase 1 output - ready to generate)
- [ ] contracts/component-inventory.json (Phase 1 output)
- [ ] contracts/design-tokens.json (Phase 1 output)
- [ ] contracts/readme-sections.md (Phase 1 output)
- [ ] CLAUDE.md (Phase 1 output - repository root)
- [ ] tasks.md (Phase 2 output - via /tasks command)

---

*Based on Constitution v1.1.0 - See `/memory/constitution.md`*  
*Plan Date: October 28, 2025 | Status: Ready for Phase 0 Research & Phase 1 Design Execution*
