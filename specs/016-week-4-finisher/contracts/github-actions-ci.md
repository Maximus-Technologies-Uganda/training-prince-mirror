# Contract 2: GitHub Actions CI Enforcement

**Purpose**: Define the CI workflow requirements to enforce coverage thresholds and block merges on failure.

**File**: `.github/workflows/checks.yml` (or equivalent CI workflow)

---

## Input

**Current State**:
- GitHub Actions workflow exists (checks.yml)
- Tests currently run via `npm run test`
- Coverage checks may be missing or incomplete
- PR merge gates may not include coverage validation

---

## Output

**Desired State**:
- Workflow includes step: "Run tests with coverage"
- Command: `npm run test:coverage`
- Step fails (exit code 1) if coverage thresholds not met
- Failed coverage check blocks PR merge
- Artifacts preserved even on failure
- Clear error message shown to developer

---

## Workflow Step Example

```yaml
# .github/workflows/checks.yml

name: CI Checks

on:
  pull_request:
    branches: [main, development]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests with coverage
        run: npm run test:coverage
        # Vitest automatically exits with code 1 if thresholds not met
        # This step will fail, which fails the job, which fails the PR check
        continue-on-error: false  # Ensure step failure propagates
      
      - name: Upload coverage artifacts
        if: always()  # Run even if tests fail
        uses: actions/upload-artifact@v3
        with:
          name: coverage
          path: coverage/
          retention-days: 30
      
      - name: Copy coverage to review-artifacts
        if: always()
        run: |
          mkdir -p review-artifacts/coverage
          cp -r coverage/* review-artifacts/coverage/
      
      - name: Upload review artifacts
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: review-packet
          path: review-artifacts/
          retention-days: 30
```

---

## Workflow Validation Rules

### Rule 1: Step Execution
- ✅ Step must run `npm run test:coverage`
- ✅ Step must NOT have `continue-on-error: true`
- ✅ Step must propagate exit code to job status

**Validation**:
```yaml
# DO: Step fails if npm run test:coverage exits with code 1
- name: Run tests with coverage
  run: npm run test:coverage

# DON'T: This would hide failures
- name: Run tests with coverage
  run: npm run test:coverage
  continue-on-error: true  # ❌ WRONG
```

---

### Rule 2: GitHub PR Check Integration
- ✅ Failed step → Job failure → PR check failure
- ✅ PR merge button disabled when check fails
- ✅ Developer sees clear error message

**Validation**:
1. Create PR with code failing coverage thresholds
2. Observe CI workflow runs
3. Observe coverage step fails
4. Observe PR shows red ✗ (check failed)
5. Observe merge button is disabled

---

### Rule 3: Artifact Preservation
- ✅ Coverage artifacts uploaded even on test failure
- ✅ Artifacts accessible for debugging
- ✅ Review-packet artifacts generated

**Validation**:
```bash
# In GitHub Actions UI:
# - Artifacts tab shows "coverage" and "review-packet"
# - Even when workflow fails
```

---

### Rule 4: Hard Block Enforcement
- ✅ NO override or bypass mechanism
- ✅ Only way forward: increase coverage or amend specification
- ✅ No "Dismiss review" or force-merge option
- ✅ Aligns with clarification: "Hard block - prevent all merges"

**Validation**:
- Coverage check is REQUIRED (not optional)
- Branch protection rules include this check
- No admin bypass available for coverage failures

---

### Rule 5: Visibility & Messaging
- ✅ Coverage check appears in PR checks list
- ✅ Step name is clear: "Run tests with coverage"
- ✅ Error message shows which metrics failed

**Validation**:
```bash
# In PR, Checks tab shows:
✅ Lint
✅ Build
❌ Run tests with coverage  # <- Shows which metrics failed
```

---

## Test Scenarios

### Scenario 1: PR with Sufficient Coverage

**Test Setup**:
1. Write code with 65% statements, 55% branches, 62% functions, 63% lines
2. Write tests to match
3. Create PR

**Expected**:
```
✅ Run tests with coverage PASSED
```

**Result**: ✅ Merge allowed

---

### Scenario 2: PR with Insufficient Coverage

**Test Setup**:
1. Write code with 40% statements, 65% branches, 55% functions, 48% lines
2. Write minimal tests
3. Create PR

**Expected**:
```
❌ Run tests with coverage FAILED
   └─ Coverage thresholds not met
      ✗ Statements: 40% < 60%
      ✗ Lines: 48% < 60%
```

**Result**: ❌ Merge blocked

**Developer action**:
1. Add more tests
2. Push new commit
3. CI re-runs automatically
4. If thresholds now met: Merge allowed

---

### Scenario 3: Coverage Check Separate from Other Checks

**Test Setup**:
1. All tests pass
2. All lints pass
3. Build succeeds
4. Coverage below threshold

**Expected**:
```
✅ Lint
✅ Build
✅ Test Results
❌ Run tests with coverage  # <- Fails separately
```

**Result**: ❌ PR fails overall (coverage check failed)

---

### Scenario 4: Artifacts Preserved on Failure

**Test Setup**:
1. Run workflow with insufficient coverage
2. Workflow fails
3. Check GitHub Actions Artifacts tab

**Expected**:
```
Artifacts:
├── coverage/
│   ├── coverage-final.json
│   ├── index.html
│   └── [coverage reports]
└── review-packet/
    ├── coverage/
    └── [review artifacts]
```

**Result**: ✅ Artifacts available for debugging despite failure

---

## Success Criteria

✅ Workflow includes "Run tests with coverage" step  
✅ Step runs: `npm run test:coverage`  
✅ Step failure propagates to PR check failure  
✅ PR merge blocked when coverage fails  
✅ No bypass or override mechanism  
✅ Coverage artifacts uploaded even on failure  
✅ Clear error messages shown to developers  
✅ Hard block enforcement (matches specification FR-007)

---

## Integration with Branch Protection

```yaml
# Repository Settings → Branch Protection → Require Status Checks
# Must include: "Run tests with coverage" (or job name)
# Action: Dismiss stale reviews: NO
# Require branches to be up to date: YES
# Require status checks to pass: YES
#   ├── Lint
#   ├── Build
#   └── Run tests with coverage  # <- REQUIRED
```

---

## Related Artifacts

- **Vitest Config Contract**: `vitest-config.md` (provides coverage metrics)
- **Review-Packet Contract**: `review-packet.md` (stores artifacts)
- **Specification**: `/specs/016-week-4-finisher/spec.md` (FR-007, FR-009)

---

## Troubleshooting

### Issue: Coverage check not appearing in PR

**Diagnosis**:
- Branch not in workflow triggers?
- Workflow disabled?
- Job name mismatch in branch protection?

**Solution**:
1. Verify workflow triggers include PR branch
2. Check `.github/workflows/checks.yml` is committed
3. Verify branch protection rules match job name

---

### Issue: Coverage step passes but should fail

**Diagnosis**:
- Vitest thresholds not configured?
- `npm run test:coverage` not enforcing?

**Solution**:
1. Verify `vitest.config.js` has coverage.thresholds
2. Run locally: `npm run test:coverage` and check exit code
3. Verify configuration matches vitest-config.md contract

---

### Issue: Merge button visible despite failed check

**Diagnosis**:
- Coverage check not required in branch protection?
- Check marked as optional?

**Solution**:
1. Go to Repository Settings → Branches
2. Edit branch protection rule
3. Enable: "Require status checks to pass before merging"
4. Add "Run tests with coverage" to required checks

---
