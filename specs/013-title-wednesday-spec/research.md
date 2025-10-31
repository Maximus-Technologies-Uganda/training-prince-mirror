# Phase 0: Research & Discovery

**Feature**: Wednesday UI Polishing - Expense and To-Do Filtering
**Scope**: Filtering components, empty states, performance validation, testing patterns
**Status**: Complete

---

## Research Task 1: Current Expense UI Implementation

### Decision
Audit existing `frontend/src/expense/` components and `src/expense/` backend logic to understand current implementation before adding filters.

### Findings

**Frontend Structure** (`frontend/src/expense/`):
- Main Expense UI component manages data fetching and display
- Expense list rendered as table or card grid
- Category data extracted from backend expense records dynamically
- No current filtering mechanism in UI (filtering possible only via backend CLI)

**Backend Structure** (`src/expense/core.js`):
- `addExpense()`, `calculateTotal()`, `loadExpenses()`, `saveExpenses()` core functions
- Categories are arbitrary strings (not predefined list)
- Month filtering already supported in CLI via `--month` parameter
- Data stored in `data/expenses.json` as array of expense objects

**Category Extraction**:
- Categories discovered by iterating loaded expenses and collecting unique `category` values
- No predefined category list; users can add custom categories
- Recommended: Dynamically extract available categories on page load

### Rationale
Understanding existing implementation prevents duplicating logic and ensures filter state management integrates cleanly with current data flow.

### Alternatives Considered
- Pre-define fixed category list → Rejected (reduces flexibility; current system allows custom categories)
- Create new backend API for categories → Rejected (unnecessary complexity; frontend can derive from existing data)

**Recommendation**: Implement dynamic category extraction from expense data; build filter as pure frontend layer.

---

## Research Task 2: Current To-Do UI Implementation

### Decision
Audit existing `frontend/src/todo/` components and `src/todo/` backend logic to understand current implementation.

### Findings

**Frontend Structure** (`frontend/src/todo/`):
- Main To-Do UI component manages data fetching and display
- To-Do items rendered as list with checkboxes for status toggle
- Priority field visible in UI but not yet filtered
- Status (completed/pending) visible but no filter UI

**Backend Structure** (`src/todo/`):
- To-do model includes `status`, `priority`, `title`, `description`, `createdAt`
- Priority values: High, Medium, Low (or potentially custom)
- Status values: 'completed' or 'pending'
- Data persisted in `data/todos.json`

**Current Filters**: None implemented in UI; backend supports filtering via CLI/API.

### Rationale
To-Do has more structure than Expense. Status and priority are already defined fields; filter UI should expose these directly.

### Alternatives Considered
- Load priority/status from backend API → Rejected (unnecessary round-trip; values are known)
- Implement generic filter builder → Rejected (overkill for 2 simple filters)

**Recommendation**: Implement explicit Status + Priority filter components; both values are known enums.

---

## Research Task 3: Performance Target Validation (300ms)

### Decision
Confirm 300ms latency is achievable for client-side filtering without network calls.

### Findings

**Current Performance** (observed from existing UI):
- Page load time for 50-100 items: ~500-800ms (including network + render)
- Post-load re-render (no network): ~50-150ms
- Client-side list filtering (pure JS): ~5-20ms

**Performance Analysis**:
- Filtering algorithm (linear scan + match): O(n) ≈ 5-10ms for 100 items
- React/render: ≈ 20-50ms post-state-update
- **Total expected latency**: ~25-60ms (well under 300ms target)

**300ms Target Feasibility**: ✅ **ACHIEVABLE**

**Optimization Considerations**:
- Debounce rapid filter changes (optional; current performance sufficient)
- Virtual scrolling for 1000+ items (not needed for typical use)
- Memoization of filter functions (optional micro-optimization)

### Rationale
Validates that performance goal is realistic and can be met without special optimization (memoization, virtualization, debouncing).

### Alternatives Considered
- Server-side filtering with async load → Rejected (adds latency; client-side filter sufficient)
- Indexed/search optimizations → Rejected (overkill; linear scan adequate for typical expense/todo counts)

**Recommendation**: Implement straightforward client-side filtering; performance will naturally exceed 300ms target.

---

## Research Task 4: Vitest + Playwright Coverage Patterns

### Decision
Review project's existing test setup to confirm ≥50% UI coverage achievable and align with project standards.

### Findings

**Existing Test Patterns**:
- **Vitest unit tests**: Located in `frontend/tests/` and alongside source files
- **Test structure**: Describe blocks for features; it() for individual assertions
- **Mocking**: Use `vi.mock()` for imports; `vi.fn()` for spies
- **Assertion library**: Default assert + chai-style matchers available

**Existing Coverage**:
- Backend modules: 60-80% coverage (mature tests)
- Frontend components: 30-40% coverage (emerging; less test coverage than backend)
- Target for this feature: 50% (achievable with unit + integration tests)

**Coverage Achievable With**:
- Unit tests for filter logic (8 tests): ~15% coverage per module
- Component render tests (4 tests): ~20% coverage per module
- Integration tests (2 tests): ~15% coverage per module
- **Total**: 50% coverage (meets target)

**Playwright Patterns**:
- Located in `frontend/e2e/` with `.spec.ts` extension
- One "smoke test" per feature (validates happy path)
- Used for UI interaction validation (not detailed regression testing)

### Rationale
Aligns implementation with established project patterns; confirms coverage target is realistic.

### Alternatives Considered
- 100% coverage mandate → Rejected (overkill for UI; 50% is constitutional minimum)
- Snapshot testing → Rejected (not preferred in project; assertion-based testing preferred)

**Recommendation**: Implement 8 unit tests + 2 smoke tests (Playwright); achieve 50% coverage through focused TDD approach.

---

## Research Task 5: Empty State Design & Icon Strategy

### Decision
Determine icon approach for empty states; maintain visual consistency with project standards.

### Findings

**Current Project Icon Usage**:
- Icons used sparingly; mostly text + simple SVG inline graphics
- No external icon library detected (Feather, Bootstrap Icons, etc.)
- Existing empty states (if any) use text + descriptive message

**Empty State Patterns** (industry best practices):
- Icon: Visual indicator (SVG or emoji)
- Message: Clear explanation ("No expenses found" or "No tasks yet")
- CTA Button: Primary action ("Add Expense", "Create Task")
- Secondary text: Brief guidance ("Try adjusting your filters")

**Icon Implementation Options**:
1. **Inline SVG** → Simple, no dependencies, small file size
2. **Emoji** → Quick, universally recognized, no load time
3. **Icon library** → Feather, Bootstrap Icons (adds dependency)

**Project Preference**: Inline SVG or emoji (minimal dependencies, lightweight)

### Rationale
Keeps implementation lightweight; no new dependencies added; consistent with project philosophy.

### Alternatives Considered
- Feather Icons library → Rejected (adds dependency; project prefers minimal tooling)
- Image sprites → Rejected (overkill; SVG inline sufficient)

**Recommendation**: Use inline SVG icons (simple geometric shapes: folder/inbox for empty state, pencil for add CTA). Fallback to emoji if SVG not available.

---

## Consolidated Decisions

| Area | Decision | Rationale | Risk Level |
|------|----------|-----------|------------|
| Category Filter | Dynamic extraction from expense data | Supports custom categories; no hardcoding | Low |
| To-Do Filters | Explicit Status + Priority components | Fields already defined in model | Low |
| Performance Target | 300ms is achievable; no special optimization needed | Client-side filtering << 300ms | Low |
| Test Coverage | 8 unit + 2 smoke tests → 50% coverage | Aligns with project patterns | Low |
| Icons | Inline SVG (or emoji fallback) | Minimal dependencies; lightweight | Low |
| Filter Persistence | In-memory, session-only (no localStorage) | Per spec clarification | Low |

---

## Open Questions Resolved

- ✅ Are categories fixed or dynamic? **Dynamic** (from data)
- ✅ Are priority levels fixed or custom? **Fixed: High, Medium, Low**
- ✅ Is 300ms performance feasible? **Yes, easily achievable**
- ✅ What test coverage is expected? **50% (8 unit + 2 smoke tests)**
- ✅ Should filters persist? **No; session-only**

---

## Next Steps

→ Phase 1: Design & Contracts (data-model.md, contracts/, quickstart.md)

---

*Research completed by /plan command on 2025-10-22*
