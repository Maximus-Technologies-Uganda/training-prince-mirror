# Contract: Review Packet CI Enhancement

**Feature**: Week 5 Day 1: API Spec & Contracts First (Expenses)  
**Scope**: Update build-review-packet CI job to generate OpenAPI HTML documentation  
**Date**: 2025-11-06

---

## Contract Definition

### Input
- OpenAPI specification file (`api/spec/openapi.yaml` or `specs/core/openapi.yaml`)
- Documentation generation tool (Redoc CLI)
- Existing `.github/workflows/review-packet.yml` workflow

### Output
- Updated `.github/workflows/review-packet.yml` with OpenAPI HTML generation step
- Generated OpenAPI HTML file in `review-artifacts/`
- Updated `review-artifacts/index.html` with link to OpenAPI documentation

### Validation Rules

1. **Documentation Generation**: Must generate HTML from OpenAPI spec using Redoc or Scalar (FR-016)
2. **Index Link**: Must add link to OpenAPI HTML in `review-artifacts/index.html` (FR-017)
3. **Workflow Integration**: Must execute before packaging artifacts (FR-018)
4. **Artifact Inclusion**: Must include OpenAPI HTML file in review-artifacts package (FR-019)

### Workflow Step Pattern

```yaml
- name: Generate OpenAPI HTML Documentation
  run: |
    npm install -g @redocly/cli
    redocly build-docs api/spec/openapi.yaml -o review-artifacts/openapi.html
    # Or use redoc-cli for standalone HTML:
    # npx @redocly/cli build-docs api/spec/openapi.yaml -o review-artifacts/openapi.html

- name: Update review-artifacts/index.html with OpenAPI link
  run: |
    # Add link to OpenAPI documentation section
    # Format: <a href="openapi.html">OpenAPI Documentation</a>
```

### Index HTML Update

Add to `review-artifacts/index.html`:
```html
<section class="suite">
  <h2>API Documentation</h2>
  <div class="suite-links">
    <a href="openapi.html" class="link-button">OpenAPI Documentation</a>
  </div>
</section>
```

### Failure Conditions
- **ERROR**: Documentation generation fails → Incomplete review packet
- **ERROR**: OpenAPI HTML not included in artifacts → Reviewers can't access docs
- **ERROR**: Index.html not updated → No navigation to OpenAPI docs

### Success Criteria
- ✅ OpenAPI HTML file generated in `review-artifacts/`
- ✅ Link added to `review-artifacts/index.html`
- ✅ OpenAPI HTML included in review-packet artifact
- ✅ Documentation generation step executes before artifact packaging
- ✅ Review packet includes complete API documentation

---

## Related Contracts
- `openapi-spec.contract.md`: Documentation generated from this spec
- `spec-check-ci.contract.md`: Spec validated before documentation generation


