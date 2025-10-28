# Tasks: Friday Final Polish and Documentation Export

**Input**: Design documents from `/specs/015-friday-final-polish/`  
**Prerequisites**: plan.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅  
**Feature Branch**: `015-friday-final-polish`  
**Date**: October 28, 2025

---

## Execution Flow (main)

```
1. Load plan.md from feature directory ✅
   → Extracted: tech stack (Vite, Vitest, Playwright, vanilla JS)
   → Extracted: structure (5 UI apps + shared components)
   → Extracted: PR limit (300 LOC)
2. Load design documents ✅
   → data-model.md: 3 entities identified (UI Component, Design Token, Visual Polish Issue)
   → contracts/: 3 contract formats defined
   → research.md: 5 research topics completed
   → quickstart.md: 6 validation phases defined
3. Generate tasks by category
   → Setup: Environment, build, test infrastructure
   → Visual Review: 5 per-UI review tasks
   → Visual Polish: Issue fixing by severity
   → Component Inventory: Extraction, documentation, README integration
   → Design Tokens: Extraction, documentation, README integration
   → Testing: Full suite validation
   → Documentation: README sections, PR creation
4. Apply task rules
   → Different UIs = mark [P] for parallel review
   → Same file fixes = sequential (no [P])
   → Tests before documentation (verify no regressions)
5. Number tasks sequentially (T001, T002...)
6. Validate task completeness
   → All 5 UIs reviewed
   → All visual issues prioritized
   → Component inventory complete
   → Design tokens documented
   → All tests pass
   → README updated
   → PR ready
```

---

## Phase 3.1: Setup & Preparation

- [x] **T001** Verify development environment
  - File: `.` (repository root)
  - Steps: 
    1. Checkout branch: `git checkout 015-friday-final-polish`
    2. Pull latest: `git pull origin 015-friday-final-polish`
    3. Install dependencies: `npm install`
    4. Start dev server: `npm run dev`
  - Expected: Dev server running on http://localhost:5173, no errors
  - Acceptance: Dev server responds to all 5 UI routes (/quote, /temp, /expense, /todo, /stopwatch)

- [x] **T002** Document baseline test coverage
  - File: `frontend/tests/` (all test files)
  - Steps:
    1. Run: `npm test` to get baseline coverage
    2. Capture coverage output per app (quote, temp, expense, todo, stopwatch)
    3. Document ≥40% threshold for each app
    4. Create coverage baseline report
  - Expected: All apps ≥40% statement coverage
  - Acceptance: Baseline documented and verified

- [x] **T003** Run full test suite and linting
  - File: `frontend/` (entire frontend)
  - Steps:
    1. Run: `npm test` (unit tests)
    2. Run: `npm run test:e2e` (Playwright e2e tests)
    3. Run: `npm run lint` (ESLint)
    4. Run: `npm run build` (Vite build)
  - Expected: All checks pass, no regressions
  - Acceptance: All 4 checks pass with 0 errors

---

## Phase 3.2: Visual Review (5 UIs - PARALLEL EXECUTION)

Review all five UIs systematically for visual inconsistencies and polish issues.

- [x] **T004** [P] Review Quote UI for visual inconsistencies
  - File: `frontend/src/ui-quote/`
  - URL: http://localhost:5173/quote
  - Checklist: Alignment, spacing, typography, colors, responsive (320px/768px/1920px), glitches
  - Output: Document issues in QUOTE-XXX format with severity levels (critical/high/medium/low)
  - Acceptance: All critical issues identified and documented

- [x] **T005** [P] Review Temperature Converter UI for visual inconsistencies
  - File: `frontend/src/ui-temp/`
  - URL: http://localhost:5173/temp
  - Checklist: Input alignment, spacing, number display, responsive, glitches
  - Output: Document issues in TEMP-XXX format with severity levels
  - Acceptance: All critical issues identified and documented

- [x] **T006** [P] Review Expense Tracker UI for visual inconsistencies
  - File: `frontend/src/ui-expense/`
  - URL: http://localhost:5173/expense
  - Checklist: Form layout, list spacing, colors, total display, responsive, glitches
  - Output: Document issues in EXPENSE-XXX format with severity levels
  - Acceptance: All critical issues identified and documented

- [x] **T007** [P] Review To-Do List UI for visual inconsistencies
  - File: `frontend/src/ui-todo/`
  - URL: http://localhost:5173/todo
  - Checklist: Form layout, list spacing, checkbox alignment, buttons, responsive, glitches
  - Output: Document issues in TODO-XXX format with severity levels
  - Acceptance: All critical issues identified and documented

- [x] **T008** [P] Review Stopwatch UI for visual inconsistencies
  - File: `frontend/src/ui-stopwatch/`
  - URL: http://localhost:5173/stopwatch
  - Checklist: Display layout, button spacing, lap list, responsive, glitches
  - Output: Document issues in STOPWATCH-XXX format with severity levels
  - Acceptance: All critical issues identified and documented

---

## Phase 3.3: Visual Polish Fixes (SEQUENTIAL BY SEVERITY)

Fix identified visual issues prioritized by severity: critical → high → medium → low

- [x] **T009** Fix critical visual issues (all UIs)
  - Files: Per identified critical issues
  - Steps:
    1. Prioritize all critical issues from T004-T008
    2. Fix alignment issues (CSS grid/flexbox adjustments)
    3. Fix spacing inconsistencies (update margin/padding to use design tokens)
    4. Fix overlapping elements (z-index, positioning fixes)
    5. Fix text truncation (add overflow handling, responsive sizing)
    6. Test fixes at multiple breakpoints (320px, 768px, 1920px)
  - Expected: All critical issues resolved
  - Acceptance: Visual inspection confirms no overlaps, text not truncated, proper alignment

- [x] **T010** Fix high-priority visual issues (prioritized subset)
  - Files: Per identified high-priority issues from T004-T008
  - Steps:
    1. Fix slight misalignments (1-5px adjustments)
    2. Fix inconsistent spacing (use design token values)
    3. Update colors to match design tokens
    4. Test responsiveness
  - Expected: High-priority issues resolved as time permits
  - Acceptance: Visual consistency improved across UIs

- [x] **T011** Test visual fixes in browser
  - File: `frontend/` (all src/)
  - Steps:
    1. Test each fixed UI in browser (dev server)
    2. Verify at 3 breakpoints: 320px (mobile), 768px (tablet), 1920px (desktop)
    3. Test in multiple browsers if available (Chrome, Firefox, Safari)
    4. Verify no regressions in other UIs
  - Expected: All fixes render correctly across all breakpoints
  - Acceptance: Visual review checklist from quickstart.md passes

- [x] **T012** Run test suite after visual fixes
  - File: `frontend/` (all tests)
  - Steps:
    1. Run: `npm test` (verify ≥40% coverage maintained)
    2. Run: `npm run test:e2e` (verify smoke tests pass)
    3. Run: `npm run lint` (verify no new lint errors)
    4. Document: Coverage comparison (baseline vs. current)
  - Expected: No test regressions, same or improved coverage
  - Acceptance: All tests pass, coverage maintained or improved

---

## Phase 3.4: Component Inventory (PARALLEL EXECUTION)

Extract and document all reusable UI components organized by type.

- [x] **T013** [P] Scan and identify all reusable components
  - File: `frontend/src/components/` and `frontend/src/ui-*/`
  - Steps:
    1. List all shared components in `frontend/src/components/`
    2. List app-specific components in each `ui-*/` directory
    3. Categorize by type: buttons, inputs, cards, modals, lists, other
    4. Count reusable vs. single-use components
    5. Map usage across applications
  - Output: Complete component list with file locations and app usage
  - Acceptance: 15-25 components documented, organized by type

- [x] **T014** [P] Document component details (Name, File, Description, Usage)
  - File: `frontend/src/components/` (all component files)
  - Steps:
    1. For each component: extract name, purpose, CSS classes
    2. Document CSS variables used (colors, spacing, typography)
    3. List which apps use it (Quote, Temp, Expense, To-Do, Stopwatch)
    4. Create HTML usage examples for each
    5. Note accessibility attributes (ARIA, semantic HTML)
  - Output: Detailed component documentation with usage examples
  - Acceptance: Each component has: name, type, file, apps using it, example HTML

- [x] **T015** [P] Organize components by type in JSON export
  - File: `specs/015-friday-final-polish/contracts/component-inventory.json`
  - Steps:
    1. Create JSON structure: buttons, inputs, cards, modals, lists, other
    2. For each component: id, name, type, description, file_locations, applications, css_classes, example_usage
    3. Add summary: total components, breakdown by type, usage statistics
    4. Validate JSON syntax and completeness
  - Output: Machine-readable component inventory
  - Acceptance: Valid JSON with all 15-25 components, organized by type

---

## Phase 3.5: Design Token Extraction & Documentation

Extract design tokens from Figma and verify code implementation matches.

- [x] **T016** [P] Extract colors from Figma design library
  - File: Figma Design Library (external) + `frontend/src/` (CSS verification)
  - Steps:
    1. Access Figma workspace (get team credentials)
    2. Navigate to Design Library → Colors section
    3. Export or manually list all color tokens
    4. Document each token: name (e.g., color/text/primary), value (e.g., #333333), Figma path
    5. For each token, grep codebase to verify value matches CSS
    6. Create mapping: Figma token → CSS variable → CSS value
  - Output: Complete color token list with code verification
  - Acceptance: All colors documented, code matches Figma values (9 colors expected)

- [x] **T017** [P] Extract spacing tokens from Figma
  - File: Figma Design Library (external) + `frontend/src/` (CSS verification)
  - Steps:
    1. Access Figma → Spacing section
    2. Export spacing tokens (xs, sm, md, lg, xl, xxl, etc.)
    3. Document: token name, value (e.g., 16px), Figma path
    4. Verify code uses tokens (grep for values)
    5. Create CSS variable mappings
  - Output: Complete spacing token list
  - Acceptance: All spacing tokens documented (6 tokens expected)

- [x] **T018** [P] Extract typography tokens from Figma
  - File: Figma Design Library (external) + `frontend/src/` (CSS verification)
  - Steps:
    1. Access Figma → Typography section
    2. Export typography tokens (headings, body, button, caption, etc.)
    3. Document: token name, value (font-size, weight, line-height), Figma path
    4. Verify code implementation matches
  - Output: Complete typography token list
  - Acceptance: All typography tokens documented (7 tokens expected)

- [x] **T019** [P] Extract shadows and borders tokens from Figma
  - File: Figma Design Library (external) + `frontend/src/` (CSS verification)
  - Steps:
    1. Extract shadow tokens (sm, md, lg) and border tokens (radius/sm, md, lg)
    2. Document values and Figma paths
    3. Verify code usage
  - Output: Shadows and borders token list
  - Acceptance: All shadow and border tokens documented (6 tokens expected)

- [x] **T020** Create design tokens JSON export
  - File: `specs/015-friday-final-polish/contracts/design-tokens.json`
  - Steps:
    1. Organize all tokens by category: colors, spacing, typography, shadows, borders
    2. For each token: id, token_name, value, figma_reference, css_variable, applications
    3. Add summary: total tokens (30-50 expected), breakdown by category
    4. Validate JSON syntax
  - Output: Machine-readable design tokens export
  - Acceptance: Valid JSON with 30-50 tokens organized by category

- [x] **T021** Verify code implementation matches Figma tokens
  - File: `frontend/src/` (all CSS and JS files)
  - Steps:
    1. For each token in design-tokens.json: search codebase for value
    2. Document matches and mismatches
    3. Create list of CSS values that don't correspond to any token
    4. Flag any "orphaned" hardcoded CSS values
    5. Identify CSS variables that should be tokens
  - Output: Token verification report
  - Acceptance: All Figma tokens have code implementation, mismatches documented

---

## Phase 3.6: README Documentation

Add component inventory and design tokens to main README.

- [x] **T022** Create Component Library section in README
  - File: `README.md` (project root)
  - Steps:
    1. Open README.md
    2. Add "## UI Component Library" section after overview
    3. Add subsections per type: ### Buttons, ### Inputs, ### Cards, ### Modals, ### Lists, ### Other
    4. For each component type: list name, file location, apps using it, CSS classes, example usage
    5. Use markdown tables or bullets for clarity
    6. Add links to component files where applicable
  - Output: Component inventory section in README
  - Expected LOC: 80-120 lines
  - Acceptance: Component Library section visible, all components listed

- [x] **T023** Create Design System Tokens section in README
  - File: `README.md` (project root)
  - Steps:
    1. Add "## Design System Tokens" section after Component Library
    2. Add subsections per category: ### Colors, ### Spacing, ### Typography, ### Shadows, ### Borders
    3. Use tables for tokens: | Token Name | Value | Usage |
    4. List all tokens from contracts/design-tokens.json
    5. Add note: "Source of Truth: Figma Design Library"
    6. Add instructions for accessing/updating tokens
  - Output: Design Tokens section in README
  - Expected LOC: 60-100 lines
  - Acceptance: Tokens section visible, all tokens documented, Figma reference clear

- [x] **T024** Verify README markdown syntax and formatting
  - File: `README.md`
  - Steps:
    1. Check markdown syntax (headings, tables, links)
    2. Verify no broken links
    3. Verify code examples render correctly
    4. Test table formatting
    5. Preview in GitHub markdown renderer
  - Expected: All formatting correct, no warnings
  - Acceptance: README renders correctly on GitHub

---

## Phase 3.7: Final Validation

Ensure all changes pass tests and meet quality standards.

- [x] **T025** Run complete test suite
  - File: `frontend/` (all tests)
  - Steps:
    1. Run: `npm test` (unit tests with coverage)
    2. Run: `npm run test:e2e` (Playwright e2e tests)
    3. Document coverage per app (Quote, Temp, Expense, To-Do, Stopwatch)
    4. Verify all apps maintain ≥40% coverage
    5. Compare to baseline (T002)
  - Expected: All tests pass, coverage maintained or improved
  - Acceptance: 0 test failures, coverage ≥40% per app

- [x] **T026** Run linting and formatting
  - File: `frontend/` (all source files)
  - Steps:
    1. Run: `npm run lint` (ESLint)
    2. Run: `npm run prettier --check` (format check)
    3. Fix any violations if found
  - Expected: 0 linting errors, proper formatting
  - Acceptance: ESLint clean, Prettier compliant

- [x] **T027** Build production frontend
  - File: `frontend/` (source) → `frontend/dist/` (output)
  - Steps:
    1. Run: `npm run build`
    2. Verify output in `frontend/dist/`
    3. Check build size (should be within baseline)
    4. Verify no build warnings
  - Expected: Build succeeds, output ready for deployment
  - Acceptance: Build completes with 0 errors, dist/ contains all files

---

## Phase 3.8: Documentation & PR Preparation

Prepare final PR with spec, component inventory, and token list.

- [x] **T028** Create PR description with coverage table
  - File: PR description (GitHub)
  - Steps:
    1. Title: "Friday Final Polish and Documentation Export"
    2. Link spec: "Spec: specs/015-friday-final-polish/spec.md"
    3. Create coverage table:
       - Before (baseline from T002)
       - After (current from T025)
       - Per-app coverage for all 5 UIs
    4. List changes:
       - Visual polish fixes (count by severity)
       - Component inventory added (count)
       - Design tokens added (count)
       - README sections added (2 new sections)
    5. Note: "PR ≤300 LOC" status
  - Expected: Clear, well-formatted PR description
  - Acceptance: PR description follows constitutional template

- [x] **T029** Verify PR ≤300 LOC
  - File: All changes in branch
  - Steps:
    1. Count LOC changed: `git diff develop...015-friday-final-polish --stat`
    2. If ≤300 LOC: proceed to merge
    3. If >300 LOC: consider splitting into multiple PRs:
       - PR 1: Visual polish fixes
       - PR 2: Component inventory documentation
       - PR 3: Design tokens documentation
    4. Document LOC breakdown
  - Expected: ≤300 LOC total or validated multiple PRs
  - Acceptance: PR size verified and within limits

- [x] **T030** Final visual spot-check
  - File: `frontend/src/ui-*/` (all 5 UIs)
  - Steps:
    1. Start dev server: `npm run dev`
    2. Visit each UI: http://localhost:5173/{quote, temp, expense, todo, stopwatch}
    3. Check: alignment, spacing, colors, responsive (test at 320px and 1920px)
    4. Verify no overlaps, text truncation, or visual glitches
    5. Test on mobile-sized viewport
  - Expected: All UIs look polished, consistent, responsive
  - Acceptance: Visual review passes, no major issues remaining

- [x] **T031** Commit and prepare for merge
  - File: Repository changes
  - Steps:
    1. Stage all changes: `git add -A`
    2. Create commit message:
       - Title: "Friday Final Polish and Documentation Export [015-friday-final-polish]"
       - Body: Include spec link, changes summary, coverage table
    3. Verify commit is on correct branch
    4. Push to origin: `git push origin 015-friday-final-polish`
  - Expected: Commits pushed to feature branch
  - Acceptance: Branch ready for PR creation

---

## Phase 3.9: Completion & Linear Sub-Issues (OPTIONAL)

After merge, create Linear sub-issues for tracking.

- [ ] **T032** Create Linear sub-issues (optional, requires parent ID)
  - Steps:
    1. **When**: After tasks.md is complete and branch ready
    2. **How**: Use GitHub Actions workflow "Create Linear Sub-Issues (Generic)"
    3. **URL**: https://github.com/Maximus-Technologies-Uganda/training-prince/actions
    4. **Inputs**:
       - Parent Issue ID: `PRI-XXXX` (provide by user)
       - Tasks File: `specs/015-friday-final-polish/tasks.md`
    5. **Result**: All tasks (T001-T031) become Linear sub-issues under parent
  - Note: User must provide parent issue ID
  - Reference: See CREATE_LINEAR_SUB_ISSUES.md for detailed instructions

---

## Dependencies & Execution Order

### Critical Path (No Parallelization)
1. T001-T003: Setup (must run first)
2. T004-T008: Visual Review (can run in parallel [P])
3. T009-T012: Visual Polish Fixes (sequential, tests must pass)
4. T025-T027: Final Validation (tests must pass before merge)
5. T028-T031: PR Preparation (final steps)

### Parallel Execution Groups

**Group 1 - Visual Review (T004-T008) [P]**
```bash
# All 5 UIs can be reviewed independently (different files, no dependencies)
Task: T004 Review Quote UI
Task: T005 Review Temperature Converter UI
Task: T006 Review Expense Tracker UI
Task: T007 Review To-Do List UI
Task: T008 Review Stopwatch UI
```

**Group 2 - Component Documentation (T013-T015) [P]**
```bash
# All can run in parallel (different stages of same component work)
Task: T013 Scan and identify components
Task: T014 Document component details
Task: T015 Organize components in JSON
```

**Group 3 - Token Extraction (T016-T019) [P]**
```bash
# All can run in parallel (different token categories)
Task: T016 Extract colors from Figma
Task: T017 Extract spacing tokens
Task: T018 Extract typography tokens
Task: T019 Extract shadows & borders tokens
```

---

## Execution Commands

### Run Visual Review in Parallel
```bash
# Start 5 UIs in browser tabs simultaneously
npm run dev  # Start dev server

# Then open in browser:
# - http://localhost:5173/quote (T004)
# - http://localhost:5173/temp (T005)
# - http://localhost:5173/expense (T006)
# - http://localhost:5173/todo (T007)
# - http://localhost:5173/stopwatch (T008)
```

### Run Test Suite
```bash
npm test                 # Unit tests (T001, T025)
npm run test:e2e        # E2E tests (T025)
npm run lint            # Linting (T026)
npm run build           # Build (T027)
```

### Create Linear Sub-Issues (After Branch Ready)
```bash
# Via GitHub Actions:
# 1. Go to: https://github.com/Maximus-Technologies-Uganda/training-prince/actions
# 2. Find: "Create Linear Sub-Issues (Generic)"
# 3. Click "Run workflow"
# 4. Enter:
#    - Parent Issue ID: PRI-XXXX (provide by user)
#    - Tasks File: specs/015-friday-final-polish/tasks.md
# 5. Click "Run workflow"
```

---

## Success Criteria

**All of the following must be true**:
- ✅ All 5 UIs visually reviewed (T004-T008)
- ✅ Critical visual issues fixed (T009)
- ✅ All tests pass: unit ≥40% coverage per app (T025)
- ✅ All e2e tests pass (T025)
- ✅ Linting passes (T026)
- ✅ Build succeeds (T027)
- ✅ Component inventory in README (T022)
- ✅ Design tokens in README (T023)
- ✅ PR ≤300 LOC (T029)
- ✅ PR description includes coverage table (T028)
- ✅ Spec file linked in PR (T028)

**When all criteria met**: Feature complete, ready for merge to `development`.

---

## Task Generation Rules Applied

1. **From Quickstart.md** (6 validation phases):
   - T001-T003: Setup matching pre-validation checklist
   - T004-T008: Visual review per each UI
   - T009-T012: Polish fixes and testing
   - T022-T024: README documentation
   - T025-T027: Final validation matching quickstart phases

2. **From Data Model** (3 entities):
   - UI Component → T013-T015 (component inventory)
   - Design Token → T016-T021 (token extraction)
   - Visual Polish Issue → T009 (fixing issues)

3. **From Contracts** (3 formats):
   - component-inventory.json → T013-T015
   - design-tokens.json → T016-T021
   - readme-sections.md → T022-T024

4. **Parallel Execution [P]**:
   - T004-T008: Different UIs (independent files)
   - T013-T015: Component documentation stages
   - T016-T019: Token extraction by category

5. **Task Ordering**:
   - Setup (T001-T003) before everything
   - Visual Review (T004-T008) before fixes
   - Fixes (T009-T012) before testing
   - Testing (T025-T027) before PR prep
   - PR prep (T028-T031) final steps

---

## Validation Checklist

- [x] All components from data-model.md have documentation tasks (T013-T015)
- [x] All contracts have corresponding tasks (component-inventory → T013-T015, design-tokens → T016-T021)
- [x] All user stories covered (visual review T004-T008, component inventory T013-T015, tokens T016-T021, README T022-T024)
- [x] All tests complete before implementation validation (T025-T027 after T022-T024)
- [x] Parallel tasks truly independent (T004-T008, T013-T015, T016-T019 all have no dependencies)
- [x] Each task specifies exact file paths
- [x] No task modifies same file as another [P] task
- [x] All 5 UIs have visual review tasks
- [x] Component inventory complete (15-25 components)
- [x] Design tokens complete (30-50 tokens)
- [x] README sections included
- [x] Final validation gates in place
- [x] Linear sub-issues optional (T032)

---

## Notes

- **[P] tasks**: Can run in parallel if different files and no dependencies
- **Sequential tasks**: Must run one after another (dependencies or same file)
- **Test coverage**: Must maintain ≥40% per app per constitutional requirement
- **PR limit**: 300 LOC per PR (break into multiple if needed)
- **Figma tokens**: Source of truth - code must match Figma values
- **Linear sync**: Optional T032 requires parent issue ID from user

---

*Generated: October 28, 2025*  
*Status: ✅ Ready for Execution*  
*Next: Merge branch to development, then optionally create Linear sub-issues with parent ID*
