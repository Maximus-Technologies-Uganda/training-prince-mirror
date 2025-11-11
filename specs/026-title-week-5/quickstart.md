# Quickstart: Week 5 Day 1 - API Spec & Contracts First (Expenses)

**Date**: 2025-11-06  
**Feature**: Week 5 Day 1: API Spec & Contracts First (Expenses)

## Overview

This quickstart validates that the spec-first approach is working correctly:
1. OpenAPI specification is complete and valid
2. Contract tests are written and initially failing
3. CI jobs are configured correctly

## Prerequisites

- Node.js 20+ installed
- Repository cloned
- Dependencies installed (`npm ci` in root and `api/`)

## Validation Steps

### Step 1: Verify OpenAPI Specification

```bash
# Navigate to repository root
cd /path/to/hello-world

# Validate OpenAPI spec syntax (if swagger-cli installed)
npx @apidevtools/swagger-cli validate specs/core/openapi.yaml

# Or validate api/spec/openapi.yaml
npx @apidevtools/swagger-cli validate api/spec/openapi.yaml
```

**Expected Result**: ✅ Validation passes (no syntax errors)

**If Fails**: Check OpenAPI spec syntax, ensure all required fields are present

---

### Step 2: Verify Contract Tests Exist

```bash
# Check contract test file exists
ls -la api/tests/contract/expenses.contract.test.ts

# View test file to confirm structure
cat api/tests/contract/expenses.contract.test.ts | head -50
```

**Expected Result**: ✅ Test file exists with supertest-based HTTP tests

**If Missing**: Contract tests not created yet

---

### Step 3: Run Contract Tests (Expected to Fail)

```bash
# Navigate to API directory
cd api

# Run contract tests
npm test -- expenses.contract.test.ts
```

**Expected Result**: ❌ Tests fail with 404 errors (endpoints don't exist yet)

**Example Failure Output**:
```
✓ GET /expenses should return 404 initially (endpoint not implemented) (50ms)
✗ GET /expenses should validate pagination parameters (100ms)
  Error: Expected 200, got 404
```

**If Tests Pass**: Endpoints may have been implemented prematurely (violates spec-first approach)

---

### Step 4: Verify Spec-Check CI Job

```bash
# Check workflow file exists
ls -la .github/workflows/spec-check.yml

# View workflow configuration
cat .github/workflows/spec-check.yml
```

**Expected Result**: ✅ Workflow file exists with OpenAPI validation step

**If Missing**: Spec-check CI job not created yet

---

### Step 5: Verify Review Packet CI Enhancement

```bash
# Check review-packet workflow includes OpenAPI HTML generation
grep -A 10 "OpenAPI" .github/workflows/review-packet.yml

# Check if Redoc/Scalar installation step exists
grep -i "redoc\|scalar" .github/workflows/review-packet.yml
```

**Expected Result**: ✅ Workflow includes OpenAPI HTML generation step

**If Missing**: Review packet CI not updated yet

---

### Step 6: Manual OpenAPI HTML Generation (Optional)

```bash
# Install Redoc CLI
npm install -g @redocly/cli

# Generate HTML documentation
redocly build-docs api/spec/openapi.yaml -o openapi.html

# Open in browser
open openapi.html  # macOS
# or
xdg-open openapi.html  # Linux
```

**Expected Result**: ✅ HTML documentation generated and displays correctly

**If Fails**: Check OpenAPI spec validity, ensure Redoc supports OpenAPI 3.1.x

---

## Success Criteria

All validation steps should show:
- ✅ OpenAPI spec exists and validates
- ✅ Contract tests exist and fail initially (as expected)
- ✅ Spec-check CI job configured
- ✅ Review packet CI includes OpenAPI HTML generation
- ✅ OpenAPI HTML can be generated manually

## Next Steps

Once spec-first artifacts are validated:
1. Open Pull Request with all changes
2. Verify spec-check CI job passes
3. Verify Test & Coverage - API job runs (allowed to fail initially)
4. Verify review packet includes OpenAPI HTML documentation
5. Get PR reviewed and merged

## Troubleshooting

### OpenAPI Validation Fails
- Check YAML syntax (indentation, quotes)
- Verify OpenAPI 3.1.x version specified
- Ensure all required schema fields are defined

### Contract Tests Don't Fail
- Verify endpoints don't exist in `api/src/routes/expenses.ts`
- Check test is making HTTP requests (not just schema validation)
- Ensure Express app is set up correctly in test file

### CI Jobs Not Running
- Check workflow file paths match actual file locations
- Verify workflow triggers (on: pull_request, paths:)
- Check GitHub Actions permissions

---

**Status**: Ready for implementation when all validation steps pass ✅


