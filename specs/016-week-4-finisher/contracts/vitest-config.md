# Contract 1: Vitest Coverage Configuration

**Purpose**: Define the configuration requirements for Vitest to enforce coverage thresholds globally.

**File**: `vitest.config.js` or `vitest.config.ts`

---

## Input

**Current State** (before implementation):
- `vitest.config.js` exists (may or may not have coverage config)
- Tests exist and can be run via `npm run test:coverage`
- Coverage is optional or partially configured

---

## Output

**Desired State** (after implementation):
- Vitest configuration includes:
  - `coverage.all: true` - Apply thresholds to all files
  - `coverage.include: ['src/**', 'frontend/src/**']` - Include app source
  - `coverage.exclude: [...]` - Exclude non-app files per data-model.md
  - `coverage.thresholds: {statements: 60, branches: 50, functions: 60, lines: 60}` - Global thresholds
  - `coverage.provider: 'v8'` - V8 coverage provider
- `npm run test:coverage` runs without errors
- Coverage metrics displayed and validated against thresholds
- Thresholds enforcement: If any metric < threshold, exit code 1

---

## Configuration Example

```javascript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      // Include all files, not just imported ones
      all: true,
      
      // Include application source code
      include: [
        'src/**/*.{js,ts}',
        'frontend/src/**/*.{js,ts}',
      ],
      
      // Exclude non-application code
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/review-artifacts/**',
        '**/*.test.js',
        '**/*.spec.js',
        '**/*.spec.ts',
        '**/coverage/**',
        '**/.git/**',
      ],
      
      // Global coverage thresholds (all metrics must be met)
      thresholds: {
        statements: 60,
        branches: 50,
        functions: 60,
        lines: 60,
      },
      
      // Use V8 for optimal compatibility
      provider: 'v8',
      
      // Optional: Generate HTML reports
      reporter: ['text', 'json', 'html'],
    }
  }
});
```

---

## Validation Rules

### Rule 1: Configuration Syntax
- ✅ File must be valid JavaScript/TypeScript
- ✅ Must export `defineConfig` or default configuration
- ✅ Coverage object must contain all required properties

**Validation Command**:
```bash
node -c vitest.config.js  # Check syntax
```

---

### Rule 2: Threshold Values
- ✅ All threshold values must be integers (0-100)
- ✅ All thresholds must be positive
- ✅ No per-module overrides (global only)
- ✅ Values must match specification: statements=60, branches=50, functions=60, lines=60

**Validation**:
```bash
grep -A 10 "thresholds:" vitest.config.js
# Must show: statements: 60, branches: 50, functions: 60, lines: 60
```

---

### Rule 3: Inclusion Patterns
- ✅ Must include `src/**` for backend code
- ✅ Must include `frontend/src/**` for UI code
- ✅ Patterns must be valid glob syntax

**Validation**:
```bash
grep "include" vitest.config.js
# Should show both src/ and frontend/src/ patterns
```

---

### Rule 4: Exclusion Patterns
- ✅ Must exclude all patterns from data-model.md Table 2
- ✅ Patterns must be valid minimatch syntax
- ✅ Exclusions must not match application source files

**Validation**:
```bash
npm run test:coverage 2>&1 | grep "Excluded\|Exclude"
# Verify: node_modules, dist, test files not in coverage
```

---

### Rule 5: Executable Validation
- ✅ `npm run test:coverage` must run without syntax errors
- ✅ If all tests pass and thresholds met: exit code 0
- ✅ If thresholds not met: exit code 1

**Validation Command**:
```bash
npm run test:coverage
echo "Exit code: $?"  # Should be 0 or 1 (not other errors)
```

---

### Rule 6: Output Generation
- ✅ Must generate `coverage/coverage-final.json` (machine-readable)
- ✅ Must generate `coverage/index.html` (human-readable)
- ✅ Files must be valid JSON and HTML respectively

**Validation**:
```bash
ls -l coverage/
file coverage/coverage-final.json  # Should say "JSON data"
file coverage/index.html           # Should say "HTML document"
```

---

## Test Scenarios

### Scenario 1: Valid Configuration - All Thresholds Met

**Test Setup**:
1. Configure vitest.config.js per example above
2. Ensure tests provide 60%+ coverage
3. Run: `npm run test:coverage`

**Expected**:
```
✓ Coverage statements: [65%] >= [60%]
✓ Coverage branches: [55%] >= [50%]
✓ Coverage functions: [62%] >= [60%]
✓ Coverage lines: [63%] >= [60%]
```

**Exit Code**: 0 ✅

---

### Scenario 2: Thresholds Not Met

**Test Setup**:
1. Configure vitest.config.js per example above
2. Write minimal tests (e.g., 40% coverage)
3. Run: `npm run test:coverage`

**Expected**:
```
✗ Coverage statements: [40%] < [60%]
✗ Coverage functions: [35%] < [60%]
```

**Exit Code**: 1 ❌

---

### Scenario 3: Exclusion Patterns Working

**Test Setup**:
1. Create test file: `tests/dummy.test.js` (uncovered)
2. Create build artifact: `dist/bundle.js` (uncovered)
3. Run: `npm run test:coverage`

**Expected**:
- Both files are NOT included in coverage metrics
- Coverage calculation unaffected by their presence

**Validation**:
```bash
grep -c "dummy.test.js\|bundle.js" coverage/coverage-final.json
# Should output: 0
```

---

### Scenario 4: UI Components Included

**Test Setup**:
1. Ensure UI components exist in `frontend/src/ui-*.js`
2. Ensure tests cover UI components
3. Run: `npm run test:coverage`

**Expected**:
- UI files appear in `coverage/coverage-final.json`
- UI coverage metrics included in overall totals

**Validation**:
```bash
grep -c "frontend/src/ui" coverage/coverage-final.json
# Should output: > 0
```

---

## Success Criteria

✅ Configuration file is valid JavaScript/TypeScript  
✅ Thresholds are exactly 60/50/60/60  
✅ Include patterns cover both backend and UI source  
✅ Exclude patterns cover all non-app files  
✅ `npm run test:coverage` exits with code 0 or 1 (never crashes)  
✅ Coverage reports (JSON + HTML) generated  
✅ Threshold enforcement working (exit 1 if thresholds not met)  
✅ Local and CI configurations identical

---

## Related Artifacts

- **Data Model**: `/specs/016-week-4-finisher/data-model.md` (Table 2: Exclusion Patterns)
- **CI Contract**: `github-actions-ci.md` (uses output from this config)
- **Review-Packet Contract**: `review-packet.md` (consumes coverage artifacts)

---
