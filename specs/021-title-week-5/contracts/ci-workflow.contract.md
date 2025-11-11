# Contract: CI Workflow

**Feature**: Week 5 Day-0: API Scaffolding and Spec-First Setup  
**Scope**: GitHub Actions CI workflow for API project  
**Date**: 2025-01-27

---

## Contract Definition

### Input
- API project structure (`/api` directory)
- Test suite results
- Coverage reports
- API specification

### Output
- `.github/workflows/api-checks.yml` workflow file
- CI workflow execution results
- `review-packet-api` artifact (on success)

### Validation Rules
1. **Workflow File**: `.github/workflows/api-checks.yml` must exist
2. **Workflow Steps**: Must execute in order:
   - Lint checks (`npm run lint` in `/api`)
   - Test execution with coverage (`npm test` in `/api`)
   - Copy coverage reports to `review-artifacts/`
   - Verify all required files exist
   - Generate `index.html` with navigation structure
   - Upload `review-packet-api` artifact
3. **Fail-Fast**: Workflow must fail if any step fails
4. **Artifact Generation**: Must generate `review-packet-api` artifact containing:
   - `index.html` with navigation structure
   - OpenAPI specification
   - Coverage reports (lcov.info + HTML)
   - Test execution reports
5. **Pattern Alignment**: Must follow Week 4 CI workflow patterns (FR-022)

### Workflow Structure
```yaml
name: API Checks
on:
  push:
    branches: [main, develop]
  pull_request:
jobs:
  api-checks:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
      - name: Install dependencies
        run: cd api && npm ci
      - name: Lint
        run: cd api && npm run lint
      - name: Test with coverage
        run: cd api && npm test -- --coverage
      - name: Copy coverage to review-artifacts
        run: bash .github/scripts/copy-api-coverage.sh
      - name: Verify review artifacts
        run: bash .github/scripts/verify-api-artifacts.sh
      - name: Upload review-packet-api
        if: success()
        uses: actions/upload-artifact@v4
        with:
          name: review-packet-api
          path: review-artifacts/
```

### Failure Conditions
- **ERROR**: Workflow file missing → CI validation not configured
- **ERROR**: Lint step fails → Code quality issues
- **ERROR**: Test step fails → Tests failing
- **ERROR**: Coverage generation fails → Coverage reports missing
- **ERROR**: Artifact verification fails → Incomplete artifact
- **ERROR**: Artifact upload fails → Review materials unavailable

### Success Criteria
- ✅ `.github/workflows/api-checks.yml` exists and is valid YAML
- ✅ Workflow executes all steps successfully
- ✅ Lint checks pass
- ✅ Tests execute with coverage reporting
- ✅ `review-packet-api` artifact is generated and uploaded
- ✅ Artifact contains all required files (index.html, spec, coverage, reports)

---

## Implementation Notes

- Workflow name: `api-checks.yml` (unique from other workflows)
- Runs independently of other workflows
- Follows Week 4 patterns: coverage generation → copy → verify → upload
- Artifact name: `review-packet-api` (distinct from `review-packet`)

---

## Related Contracts
- `review-artifact.contract.md`: Artifact structure and verification
- `api-project-structure.contract.md`: Validates project structure

