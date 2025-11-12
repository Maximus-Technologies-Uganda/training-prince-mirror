# Contract: Review Artifact

**Feature**: Week 5 Day-0: API Scaffolding and Spec-First Setup  
**Scope**: Review packet artifact generation and structure  
**Date**: 2025-01-27

---

## Contract Definition

### Input
- Coverage reports from Vitest (lcov.info + HTML)
- Test execution reports
- API specification (`/api/spec/openapi.yaml`)
- Test results

### Output
- `review-packet-api` artifact (GitHub Actions artifact)
- Contains:
  - `index.html` with navigation structure
  - OpenAPI specification
  - Coverage reports (lcov.info + HTML)
  - Test execution reports

### Validation Rules
1. **Index.html**: Must exist with navigation structure matching Week 4 patterns
2. **Navigation Structure**: Must include links to:
   - OpenAPI specification
   - Coverage reports (HTML view)
   - Coverage reports (lcov.info download)
   - Test execution reports
3. **File Existence**: All referenced files must exist before artifact upload
4. **Fail-Fast**: Verification must fail if any required file is missing
5. **Artifact Location**: Files must be in `review-artifacts/` directory before upload

### Index.html Structure
```html
<!DOCTYPE html>
<html>
<head>
  <title>API Review Artifacts</title>
</head>
<body>
  <h1>API Review Artifacts</h1>
  <nav>
    <a href="./openapi.yaml">OpenAPI Specification</a>
    <a href="./coverage/index.html">Coverage Report</a>
    <a href="./coverage/lcov.info">Coverage LCOV</a>
    <a href="./test-results.html">Test Results</a>
  </nav>
</body>
</html>
```

### Failure Conditions
- **ERROR**: `index.html` missing → No navigation entry point
- **ERROR**: Referenced files missing → Broken links in artifact
- **ERROR**: Coverage reports missing → Incomplete review materials
- **ERROR**: OpenAPI spec missing → Specification not available for review

### Success Criteria
- ✅ `index.html` exists with valid HTML structure
- ✅ All navigation links reference existing files
- ✅ OpenAPI specification is included
- ✅ Coverage reports (lcov.info + HTML) are included
- ✅ Test execution reports are included
- ✅ Artifact verification passes before upload

---

## Implementation Notes

- Artifact name: `review-packet-api` (distinct from `review-packet` for UI)
- Follows Week 4 review artifact patterns (FR-021)
- Verification script must check all files before upload
- Artifact must be complete and self-contained

---

## Related Contracts
- `ci-workflow.contract.md`: Generates and uploads artifact
- `api-specification.contract.md`: Includes specification in artifact

