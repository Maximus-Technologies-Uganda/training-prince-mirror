# Phase 0: Research Findings

**Date**: October 28, 2025  
**Feature**: Friday Final Polish and Documentation Export  
**Status**: ✅ COMPLETE

---

## Research Topics

### 1. UI Component Inventory Extraction

**Decision**: Manual audit of frontend source code, categorized by component type with emphasis on reusable patterns across all five UIs.

**Rationale**:
- The project uses vanilla JavaScript without a component library like React or Vue
- Components are defined as reusable UI patterns (buttons, inputs, cards, modals, lists)
- Manual audit allows for accurate documentation of usage patterns and dependencies
- Figma design library serves as reference for canonical component definitions

**Alternatives Considered**:
- Automated AST parsing: Too complex for vanilla JS; would require custom parsing logic
- Component-centric tool (Storybook, Chromatic): Adds dependency; not necessary for documentation task
- AI-assisted cataloging: Requires manual verification anyway; less efficient

**Implementation Notes**:
- Scan `frontend/src/components/` for shared component definitions
- Check each UI app (`ui-quote/`, `ui-temp/`, `ui-expense/`, `ui-todo/`, `ui-stopwatch/`) for custom components
- Document component name, type, file location, and cross-app usage
- Create visual examples by referencing HTML templates or rendered screenshots
- Organize final inventory by type (buttons first, then inputs, cards, modals, lists)

---

### 2. Design Token Extraction from Figma

**Decision**: Extract design tokens from Figma design library using Figma's REST API or manual export; use programmatic verification to ensure code implementation matches token definitions.

**Rationale**:
- Figma is the authoritative source (per clarification Q3)
- Token export methods: Figma REST API, Figma CLI plugins, or manual download from design library
- Automated extraction ensures completeness and reduces human error
- Programmatic verification catches CSS implementations that drift from design tokens

**Alternatives Considered**:
- Scrape CSS from deployed app only: Misses tokens not yet implemented; doesn't follow design source of truth
- Manual Figma export + spreadsheet: Labor-intensive; error-prone; difficult to verify completeness
- Use token management tool (Tokens.studio, Supernova): Adds tool dependency; overkill for this task

**Implementation Notes**:
- Identify Figma design library access (check project's Figma workspace and team)
- Use Figma API to export token definitions or manually download from design file
- Organize tokens by category: colors, spacing, typography, shadows, borders, etc.
- For each token, capture: name (e.g., "color/text/primary"), value (e.g., "#333333"), usage, Figma path
- Verify code implementation: Search CSS variables and inline styles for corresponding values
- Document mismatches or missing token implementations
- Create JSON export for machine readability and future automation

---

### 3. Visual Polish Standards & Prioritization

**Decision**: Conduct systematic visual review using severity-based prioritization (critical → high → medium → low); focus on alignment, spacing, responsive behavior, and visual consistency.

**Rationale**:
- Per clarification Q2: "Critical issues fixed; minor issues prioritized by severity"
- Common visual issues in web UIs are alignment, spacing, responsive glitches, color inconsistencies
- Severity classification ensures focus on impactful fixes within time constraints
- Responsive testing covers mobile (320px), tablet (768px), desktop (1920px)

**Alternatives Considered**:
- Automated visual regression testing: Requires baseline images; CI setup complexity; doesn't cover manual review
- Fix all issues equally: Inefficient; doesn't respect prioritization for time-limited final polish
- Designer-only review: Limits team input; creates bottleneck

**Implementation Notes**:
- Create visual review checklist for each UI (Quote, Temp, Expense, To-Do, Stopwatch)
- For each checklist item: alignment verification, spacing consistency, responsive behavior, visual glitches
- Document issues with type, severity, location, and proposed fix
- Fix critical issues first (blocks visual polish acceptance)
- Fix high/medium issues as time permits; defer low-priority to backlog if needed
- Test fixes in browser at multiple breakpoints; run test suite after each change
- Use dev tools to identify CSS rules causing issues

---

### 4. README Documentation Structure

**Decision**: Add two dedicated sections to README: "UI Component Library" (organized by component type with cross-app references) and "Design System Tokens" (organized by category with token name, value, and usage).

**Rationale**:
- Dedicated sections make component library and design tokens discoverable
- Organizing by type (buttons, inputs, etc.) improves navigation and clarity
- Tables provide structured format for tokens with name, value, and usage columns
- Markdown is version-controllable, reviewable, and integrates with GitHub

**Alternatives Considered**:
- Separate documentation files (COMPONENTS.md, TOKENS.md): Harder to discover; requires navigation
- Auto-generated docs from code comments: Requires tooling; adds build step; harder to maintain
- Figma export only: Not version-controlled; requires external tool access
- Collaborative design docs (Google Docs): Not version-controlled; not reviewable via PR

**Implementation Notes**:
- Add "## UI Component Library" section after project overview in README
- Use subsections for each component type (### Buttons, ### Inputs, etc.)
- For each component, include: name, description, file location(s), applications using it, example usage
- Add "## Design System Tokens" section after components
- Use tables for tokens: columns for token name, value, category, and usage
- Group tokens by category: colors, spacing, typography, shadows, borders
- Add note crediting Figma as authoritative source
- Keep formatting consistent with existing README style

---

### 5. Vite & Test Framework Capabilities

**Decision**: Use existing Vite build, Vitest unit test coverage (≥40% per app enforced by constitution), and Playwright e2e smoke tests. CI/CD pipeline runs all checks (lint, test, build).

**Rationale**:
- Vite is already in use; no new setup needed
- Vitest provides coverage reporting and threshold enforcement
- Playwright is already in use for e2e smoke tests
- Constitution mandates 40% coverage per app; must verify before merge
- CI/CD is already configured; verify it runs all required checks

**Alternatives Considered**:
- Other test frameworks (Jest, Mocha): Would add dependency; Vitest already in place
- Manual testing only: Violates constitution requirement for ≥40% coverage
- Skip test verification: Creates regression risk; blocks merge per constitutional gates

**Implementation Notes**:
- Run `npm test` to verify unit test coverage for all five UI apps
- Verify coverage output shows ≥40% statement coverage per app
- Generate coverage report for PR review artifact
- Run `npm run test:e2e` to verify Playwright e2e smoke tests pass
- Run `npm run lint` to verify ESLint passes
- Run `npm run build` to verify Vite build succeeds and output is deployment-ready
- All checks must pass before PR can merge to development

---

## Decisions Summary Table

| Topic | Decision | Tool/Approach | Status |
|-------|----------|---------------|--------|
| Component Inventory | Manual audit, organized by type | Frontend source code inspection + Figma reference | ✅ Ready |
| Design Tokens | Extract from Figma API/CLI + verify code match | Figma REST API or manual export + grep CSS | ✅ Ready |
| Visual Polish | Severity-based prioritization (critical→high→medium→low) | Browser inspection + responsive testing | ✅ Ready |
| README Sections | Add Component Library + Design Tokens sections | Markdown tables + subsections | ✅ Ready |
| Testing | Use existing Vite/Vitest/Playwright setup | npm test, npm run test:e2e, CI pipeline | ✅ Ready |

---

## Open Questions Resolved

- ✅ How to extract components? → Manual audit + Figma reference
- ✅ How to ensure token accuracy? → Figma API + code verification
- ✅ What severity criteria? → Constitutional prioritization (critical first)
- ✅ Where to document? → README with dedicated sections
- ✅ How to validate? → Test suite + quickstart scenarios

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|-----------|
| Incomplete component inventory | Low | Medium | Run multiple passes; peer review |
| Figma tokens outdated or missing | Low | Medium | Verify against code; document gaps |
| Visual glitches re-appear post-fix | Medium | Low | Comprehensive testing; regression checks |
| PR exceeds 300 LOC | Medium | High | Break into multiple PRs if needed |
| CI checks fail | Low | High | Test locally before pushing |

---

## Next Steps

Phase 0 research complete. Ready to proceed to Phase 1:
- Generate data-model.md with component, token, and issue schemas
- Create contract formats (component inventory, tokens, README sections)
- Define quickstart validation scenarios
- Generate CLAUDE.md agent context

**Recommendation**: Execute Phase 1 to create all design artifacts before generating tasks.md via `/tasks` command.
