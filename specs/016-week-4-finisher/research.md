# Phase 0: Research Findings

**Feature**: Configure and Enforce Coverage Thresholds  
**Date**: 2025-10-29  
**Status**: Complete

---

## Research Area 1: Vitest Coverage Configuration

**Question**: How do we configure coverage thresholds in Vitest to enforce 60/50/60/60 globally?

**Decision**: Use Vitest's native `coverage` configuration object with `all: true` and `thresholds` properties in `vitest.config.js`

**Rationale**: 
- Vitest v0.30+ supports coverage thresholds natively via config
- `all: true` enables global enforcement across all files
- Thresholds support per-metric values (statements, branches, functions, lines)
- No external tools required; integrates seamlessly with existing test infrastructure

**Configuration Approach**:
```javascript
export default defineConfig({
  test: {
    coverage: {
      all: true,  // Apply to all files, not just imported ones
      include: ['src/**', 'frontend/src/**'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/review-artifacts/**',
        '**/*.test.js',
        '**/*.spec.js',
        '**/*.spec.ts',
        '**/coverage/**'
      ],
      thresholds: {
        statements: 60,
        branches: 50,
        functions: 60,
        lines: 60
      },
      provider: 'v8'  // Use V8 for optimal compatibility
    }
  }
});
```

**Alternatives Considered**:
- Istanbul/nyc: More heavyweight, separate tool; Vitest coverage is simpler
- Custom threshold script: Brittle; Vitest native approach preferred
- Per-module thresholds: Rejected per clarification; global only

**Output Format**: JSON (coverage-final.json), HTML reports via Vitest

---

## Research Area 2: GitHub Actions CI Gate Implementation

**Question**: How do we configure GitHub Actions to fail PRs when coverage thresholds are not met?

**Decision**: Run `npm run test:coverage` in CI workflow; Vitest exits with code 1 on threshold failure

**Rationale**:
- Vitest automatically fails exit code when thresholds not met (no custom script needed)
- GitHub Actions step failure = PR check failure = merge blocked
- Clean integration with existing checks.yml workflow
- Provides clear error message to developers

**Implementation Pattern**:
```yaml
- name: Run tests with coverage
  run: npm run test:coverage
  # If coverage below thresholds, Vitest exits with code 1 → step fails → PR check fails
```

**CI Behavior**:
- ✅ Coverage ≥ thresholds: Exit code 0 → Step passes → PR check passes → Merge allowed
- ❌ Coverage < thresholds: Exit code 1 → Step fails → PR check fails → Merge blocked

**Hard Block Enforcement**: Yes
- No override flag or bypass mechanism in GitHub Actions
- Only way to proceed: increase coverage or update spec + rebuild thresholds
- Aligns with clarification: "Hard block - prevent all merges"

---

## Research Area 3: Exclusion Pattern Formats

**Question**: What glob patterns does Vitest use for coverage excluses, and how do we specify file exclusions?

**Decision**: Use minimatch-style glob patterns in `coverage.exclude` array

**Rationale**:
- Vitest uses glob-ignore (minimatch) for pattern matching
- Patterns evaluated as "exclude if matches any pattern"
- Standard glob syntax familiar to developers
- Supports wildcards, negation, character classes

**Exclusion Pattern Specifications**:
| Pattern | Purpose | Rationale |
|---------|---------|-----------|
| `**/node_modules/**` | External dependencies | Third-party code not ours |
| `**/dist/**`, `**/build/**` | Build artifacts | Generated code, not source |
| `**/*.test.js`, `**/*.spec.js`, `**/*.spec.ts` | Test files | Infrastructure, not application |
| `**/review-artifacts/**` | Review artifacts | Metadata/reports, not application |
| `**/coverage/**` | Coverage directory | Avoid coverage-of-coverage |
| `**/.git/**` | Git metadata | Irrelevant to coverage |

**Pattern Testing**:
- `frontend/src/ui-button.js` → ❌ Excluded? NO (matches source pattern)
- `tests/unit/app.test.js` → ✅ Excluded? YES (matches `*.test.js`)
- `node_modules/vitest/index.js` → ✅ Excluded? YES (matches `node_modules`)
- `dist/bundle.js` → ✅ Excluded? YES (matches `dist/`)

---

## Research Area 4: Review-Packet Integration

**Question**: How do we integrate coverage reports into the review-packet artifact for historical tracking?

**Decision**: Extend existing review-packet workflow to copy Vitest coverage output to review-artifacts/

**Rationale**:
- Review-packet workflow already runs `npm run test:coverage` (from T024 work)
- Coverage output already generated as coverage-final.json + HTML
- Just need to persist output to review-artifacts/ directory
- Aligns with constitution "Reviewability is Paramount"

**Integration Points**:
1. **Vitest Output Location**: `coverage/` (default Vitest output)
2. **Review-Packet Target**: `review-artifacts/coverage-<build-number>/` or `review-artifacts/coverage/`
3. **Index Integration**: Add coverage metrics table to `review-artifacts/index.html`
4. **Artifacts Retained**: coverage-final.json (machine-readable), coverage/index.html (HTML view)

**Workflow Step Example**:
```yaml
- name: Copy coverage to review-artifacts
  run: cp -r coverage/* review-artifacts/coverage/
  if: always()  # Even if tests fail, preserve coverage data
```

**Accessibility**: Coverage accessible via:
- Direct file: `review-artifacts/coverage/index.html`
- Indexed view: `review-artifacts/index.html` (with coverage summary row)
- CI logs: Vitest console output shows threshold pass/fail

---

## Research Area 5: Baseline Calculation & Transition

**Question**: How do we handle existing coverage in the codebase when enforcing new thresholds?

**Decision**: Calculate baseline coverage before enforcement; transition with grace period or phased rollout

**Rationale**:
- Current codebase may not meet 60/50/60/60 thresholds initially
- Hard-block enforcement immediately would break all PRs
- Need snapshot of current coverage to inform transition strategy

**Baseline Assessment Approach**:
1. Run `npm run test:coverage` on current main branch
2. Document current coverage for each metric and module
3. Identify gaps: which modules fall short of thresholds
4. Strategy:
   - **Option A (Enforcement-Ready)**: If baseline already ≥60/50/60/60, enable immediately
   - **Option B (Phased)**: If gaps exist, set thresholds lower temporarily, raise over sprints
   - **Option C (Waiver)**: Document exempt baseline modules with explicit approval

**Recommendation**: Capture baseline before enabling enforcement in CI; determine rollout approach in tasks phase

**Success Criteria**:
- Baseline coverage snapshot documented
- Transition strategy defined (immediate or phased)
- All PRs after enforcement rollout must meet or exceed thresholds
- No historical debt carried forward

---

## Research Findings Summary

| Area | Finding | Status |
|------|---------|--------|
| Vitest Config | Native thresholds via coverage.all + coverage.thresholds | ✅ Ready |
| CI Gate | Vitest exit code 1 on threshold failure = PR check failure | ✅ Ready |
| Exclusion Patterns | Minimatch glob syntax; patterns chain with OR logic | ✅ Ready |
| Review-Packet | Extend workflow to copy coverage/ to review-artifacts/ | ✅ Ready |
| Baseline Calculation | Snapshot before enforcement; determine rollout strategy | ✅ Ready |

**No NEEDS CLARIFICATION markers remain.**

---

## Recommended Next Steps

1. **Plan Phase**: Create data-model.md, contracts, and quickstart.md (Phase 1)
2. **Tasks Phase**: Generate implementation tasks from contracts (Phase 2)
3. **Implementation**: Execute tasks in order (Phase 3+)
4. **Validation**: Run full test suite and verify CI enforcement before merge

---
