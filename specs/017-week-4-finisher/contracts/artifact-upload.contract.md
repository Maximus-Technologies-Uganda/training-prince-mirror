# Contract: Artifact Upload to GitHub Actions

**Responsibility**: Upload the verified review-packet artifact to GitHub Actions  
**Triggered By**: CI workflow after successful verification  
**Produces**: GitHub Actions Artifact (accessible from workflow run)

---

## INPUT

```
{
  artifactName: "review-packet",
  artifactPath: "review-artifacts/",
  artifactDescription: "Complete review-packet with coverage reports for all five UI test suites",
  gitHubAction: "actions/upload-artifact@v4",
  verificationRequired: true,
  retention: {
    days: 90,  // GitHub default, per NFR-003
    minDays: 1
  }
}
```

---

## OUTPUT

**On Success**:
- GitHub Actions Artifact created with name: `review-packet`
- Accessible from GitHub Actions workflow run details
- Contains complete `review-artifacts/` directory structure
- Includes all 5 coverage report sets (ui-expense, ui-stopwatch, ui-temp, ui-todo, ui-quote)
- Includes review-artifacts/index.html with valid links

**On Failure**:
- Artifact upload is NOT attempted
- CI build FAILS with error
- User notified of verification failure (upstream step)

---

## VALIDATION RULES

✅ **Pre-Upload Checks**:
1. Verification step MUST pass (exit code 0)
2. All five coverage directories MUST exist
3. All ten required files MUST be present
4. No errors from verification script
5. GitHub Actions environment variables available

❌ **Failure Conditions**:
- Verification step failed → Do not upload
- Missing directories → Do not upload
- Missing files → Do not upload
- GitHub Actions permissions insufficient → FAIL
- Network error uploading to GitHub → FAIL with retry
- Artifact size exceeds GitHub limits → FAIL (unlikely, no size limit for review-packet per NFR-001)

---

## FAILURE HANDLING

**If Upload Fails**:
1. GitHub Actions logs the error
2. CI workflow logs the failure
3. CI build marked as FAILED
4. Artifact is NOT accessible to stakeholders
5. Error message indicates why upload failed

**Error Message Format**:
```
❌ Artifact upload failed
   Artifact Name: review-packet
   Path: review-artifacts/
   Error: [permission denied | network error | quota exceeded | other]
   Build Status: FAILED
   Action Required: Check GitHub Actions permissions and retry
```

---

## SUCCESS CRITERIA

**Build succeeds ONLY if**:
- ✅ Verification step passed (upstream)
- ✅ `actions/upload-artifact@v4` action completes without error
- ✅ Artifact appears in workflow run details
- ✅ Artifact is downloadable
- ✅ Downloaded artifact contains all expected files
- ✅ Artifact retention is set per NFR-003

---

## Implementation Notes

### GitHub Actions Workflow Step Example
```yaml
- name: Upload Review-Packet Artifact
  if: success()  # Only run if all previous steps passed
  uses: actions/upload-artifact@v4
  with:
    name: review-packet
    path: review-artifacts/
    retention-days: 90
    if-no-files-found: error
    compression-level: 0  # No compression per NFR-001 (uncompressed)
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Verification Step (Must Run Before Upload)
```yaml
- name: Verify Coverage Reports
  run: |
    bash .github/scripts/verify-coverage-reports.sh
    # This script MUST exit with code 0, otherwise upload does not run
```

---

## YAML Workflow Structure

```yaml
jobs:
  ci-build:
    runs-on: ubuntu-latest
    steps:
      # ... prior steps (lint, build, test, coverage generation) ...
      
      - name: Generate Coverage Reports
        run: npm run test:ui:coverage
        
      - name: Copy Coverage to Review Artifacts
        run: bash .github/scripts/copy-coverage-reports.sh
        
      - name: Verify Coverage Reports
        run: bash .github/scripts/verify-coverage-reports.sh
        # Exits with code 1 on ANY failure → stops pipeline
        
      - name: Upload Review-Packet Artifact
        if: success()  # Only runs if verification passed
        uses: actions/upload-artifact@v4
        with:
          name: review-packet
          path: review-artifacts/
          retention-days: 90
          if-no-files-found: error
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────┐
│ Coverage Generation                 │
│ (npm run test:ui:coverage)          │
│ Output: coverage/[5 suites]/         │
└─────────────┬───────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Copy Coverage Reports               │
│ (bash copy-coverage-reports.sh)      │
│ Output: review-artifacts/[5 suites]/ │
└─────────────┬───────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Verify Coverage Reports             │
│ (bash verify-coverage-reports.sh)    │
│ ✅ Pass → Continue                   │
│ ❌ Fail → Stop Pipeline              │
└─────────────┬───────────────────────┘
              ↓ (if passed)
┌─────────────────────────────────────┐
│ Upload to GitHub Actions            │
│ (actions/upload-artifact@v4)        │
│ Output: GitHub Artifact             │
└─────────────────────────────────────┘
```

---

## Artifacts Access

**Stakeholders can access the artifact via**:
1. GitHub Actions workflow run page
2. Artifact download link (e.g., `https://github.com/...workflow/runs/.../artifacts`)
3. Automated scripts using GitHub API

**Retention Policy**:
- Default: 90 days (configurable)
- After retention expires: Artifact automatically deleted
- Per NFR-003: Artifact remains accessible for retention period

---

## Notes

- This step MUST be the final step in the CI workflow
- Only runs if all prior steps succeed (if: success() gate)
- `if-no-files-found: error` ensures CI fails if review-artifacts/ is empty
- `compression-level: 0` ensures uncompressed storage per NFR-001
- Artifact size is unlimited for this feature (no constraints per spec)
- GitHub Actions maintains the artifact per configuration

---

*Requirement Source: FR-012, FR-013, NFR-002, NFR-003, EHP-001, EHP-003*
