# Contract: Spec-Check CI Job

**Feature**: Week 5 Day 1: API Spec & Contracts First (Expenses)  
**Scope**: GitHub Actions CI job to validate OpenAPI specification  
**Date**: 2025-11-06

---

## Contract Definition

### Input
- OpenAPI specification file (`/specs/core/openapi.yaml` or `api/spec/openapi.yaml`)
- OpenAPI validation tool (e.g., `@apidevtools/swagger-cli` or `swagger-parser`)

### Output
- `.github/workflows/spec-check.yml` - CI workflow file
- Validation results (pass/fail) as required status check

### Validation Rules

1. **Workflow File**: Must exist at `.github/workflows/spec-check.yml` (FR-020)
2. **Required Status Check**: Must be configured as required status check for PRs (FR-021)
3. **Trigger**: Must run on PRs that include changes to OpenAPI spec files (FR-022)
4. **Validation**: Must validate OpenAPI syntax and schema correctness (FR-007)

### Workflow Structure

```yaml
name: Spec Check

on:
  pull_request:
    branches: [development]
    paths:
      - 'specs/core/openapi.yaml'
      - 'api/spec/openapi.yaml'
      - '.github/workflows/spec-check.yml'

jobs:
  spec-check:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install OpenAPI validator
        run: npm install -g @apidevtools/swagger-cli
      
      - name: Validate OpenAPI spec
        run: |
          swagger-cli validate specs/core/openapi.yaml
          # Or validate api/spec/openapi.yaml if that's the source
```

### Failure Conditions
- **ERROR**: Workflow file missing → Spec validation not configured
- **ERROR**: Validation tool fails → OpenAPI spec has errors
- **ERROR**: Not configured as required status check → Can merge invalid specs

### Success Criteria
- ✅ `.github/workflows/spec-check.yml` exists
- ✅ Workflow validates OpenAPI spec syntax and schema
- ✅ Workflow configured as required status check
- ✅ Workflow runs on PRs with OpenAPI spec changes
- ✅ Validation passes for valid OpenAPI spec

---

## Related Contracts
- `openapi-spec.contract.md`: This CI job validates that contract
- `review-packet-ci.contract.md`: Review packet includes validated spec


