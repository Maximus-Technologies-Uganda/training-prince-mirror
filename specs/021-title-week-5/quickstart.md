# Quickstart: Week 5 Day-0: API Scaffolding and Spec-First Setup

**Feature**: Week 5 Day-0: API Scaffolding and Spec-First Setup  
**Date**: 2025-01-27

---

## Purpose

This quickstart validates that the Day-0 API scaffolding setup is complete and functional. It verifies:
1. API project structure exists
2. Development environment works
3. Testing infrastructure works
4. Spec-first workflow is established
5. CI workflow is configured

---

## Prerequisites

- Node.js LTS installed
- Git repository cloned
- Feature branch: `021-title-week-5`

---

## Step 1: Verify API Project Structure

**Goal**: Confirm `/api` directory exists with all required files

```bash
# Navigate to repository root
cd /Users/prnceb/Desktop/WORK/hello-world

# Check if /api directory exists
ls -la api/

# Verify required files exist
test -f api/package.json && echo "✅ package.json exists" || echo "❌ package.json missing"
test -f api/tsconfig.json && echo "✅ tsconfig.json exists" || echo "❌ tsconfig.json missing"
test -f api/vitest.config.ts && echo "✅ vitest.config.ts exists" || echo "❌ vitest.config.ts missing"
test -f api/.env.example && echo "✅ .env.example exists" || echo "❌ .env.example missing"

# Verify required directories exist
test -d api/src && echo "✅ src/ directory exists" || echo "❌ src/ missing"
test -d api/tests && echo "✅ tests/ directory exists" || echo "❌ tests/ missing"
test -d api/spec && echo "✅ spec/ directory exists" || echo "❌ spec/ missing"
```

**Expected Output**:
```
✅ package.json exists
✅ tsconfig.json exists
✅ vitest.config.ts exists
✅ .env.example exists
✅ src/ directory exists
✅ tests/ directory exists
✅ spec/ directory exists
```

---

## Step 2: Verify Environment Variables Documentation

**Goal**: Confirm `.env.example` documents required variables

```bash
# Check .env.example content
cat api/.env.example

# Verify PORT is documented
grep -q "PORT" api/.env.example && echo "✅ PORT documented" || echo "❌ PORT missing"

# Verify NODE_ENV is documented
grep -q "NODE_ENV" api/.env.example && echo "✅ NODE_ENV documented" || echo "❌ NODE_ENV missing"
```

**Expected Output**:
```
PORT=3000
NODE_ENV=development
✅ PORT documented
✅ NODE_ENV documented
```

---

## Step 3: Install Dependencies

**Goal**: Verify project dependencies can be installed

```bash
# Navigate to API directory
cd api

# Install dependencies
npm install

# Verify installation succeeded
test -d node_modules && echo "✅ Dependencies installed" || echo "❌ Installation failed"
```

**Expected Output**:
```
✅ Dependencies installed
```

---

## Step 4: Verify OpenAPI Specification

**Goal**: Confirm spec-first workflow is established

```bash
# Check if OpenAPI spec exists
test -f api/spec/openapi.yaml && echo "✅ openapi.yaml exists" || echo "❌ openapi.yaml missing"

# Verify spec contains at least one endpoint
grep -q "/health" api/spec/openapi.yaml && echo "✅ GET /health endpoint defined" || echo "❌ /health endpoint missing"

# Verify OpenAPI version
grep -q "openapi: 3.1" api/spec/openapi.yaml && echo "✅ OpenAPI 3.1 format" || echo "❌ Invalid OpenAPI version"
```

**Expected Output**:
```
✅ openapi.yaml exists
✅ GET /health endpoint defined
✅ OpenAPI 3.1 format
```

---

## Step 5: Verify Testing Infrastructure

**Goal**: Confirm tests can execute (may fail, but command must work)

```bash
# Run tests (should fail initially - no implementation)
npm test

# Verify test command executed (exit code 1 is OK if tests fail)
echo "Test command executed: $?"
```

**Expected Output**:
```
Tests executed (may fail if no implementation exists)
Exit code: 1 (expected if tests fail)
```

---

## Step 6: Verify Coverage Reporting

**Goal**: Confirm coverage reports can be generated

```bash
# Run tests with coverage
npm test -- --coverage

# Check if coverage directory was created
test -d coverage && echo "✅ Coverage directory created" || echo "❌ Coverage missing"

# Verify lcov.info exists
test -f coverage/lcov.info && echo "✅ lcov.info generated" || echo "❌ lcov.info missing"

# Verify HTML coverage exists
test -f coverage/index.html && echo "✅ HTML coverage generated" || echo "❌ HTML coverage missing"
```

**Expected Output**:
```
✅ Coverage directory created
✅ lcov.info generated
✅ HTML coverage generated
```

---

## Step 7: Verify Linting

**Goal**: Confirm linting infrastructure works

```bash
# Run linter
npm run lint

# Verify lint command executed
echo "Lint command executed: $?"
```

**Expected Output**:
```
Lint checks executed
Exit code: 0 (if no issues) or non-zero (if issues found)
```

---

## Step 8: Verify Development Server

**Goal**: Confirm development server can start (may fail if no implementation)

```bash
# Start development server (in background)
npm run dev &
DEV_PID=$!

# Wait a moment for server to start
sleep 2

# Check if server is running
kill -0 $DEV_PID 2>/dev/null && echo "✅ Server started" || echo "❌ Server failed to start"

# Stop server
kill $DEV_PID 2>/dev/null || true
```

**Expected Output**:
```
✅ Server started (or ❌ if implementation missing)
```

---

## Step 9: Verify CI Workflow File

**Goal**: Confirm CI workflow is configured

```bash
# Navigate back to repository root
cd ..

# Check if workflow file exists
test -f .github/workflows/api-checks.yml && echo "✅ api-checks.yml exists" || echo "❌ api-checks.yml missing"

# Verify workflow is valid YAML (basic check)
grep -q "name:" .github/workflows/api-checks.yml && echo "✅ Workflow file valid" || echo "❌ Invalid workflow"
```

**Expected Output**:
```
✅ api-checks.yml exists
✅ Workflow file valid
```

---

## Step 10: Verify Review Artifact Structure

**Goal**: Confirm review artifact generation structure exists

```bash
# Check if review-artifacts directory exists (or will be created by CI)
test -d review-artifacts && echo "✅ review-artifacts/ exists" || echo "⚠️  review-artifacts/ will be created by CI"

# Check if scripts exist for artifact generation
test -f .github/scripts/copy-api-coverage.sh && echo "✅ Copy script exists" || echo "⚠️  Copy script will be created"
test -f .github/scripts/verify-api-artifacts.sh && echo "✅ Verify script exists" || echo "⚠️  Verify script will be created"
```

**Expected Output**:
```
✅ review-artifacts/ exists (or will be created)
✅ Copy script exists (or will be created)
✅ Verify script exists (or will be created)
```

---

## Validation Summary

After completing all steps, verify:

- [ ] `/api` directory exists with complete structure
- [ ] All required configuration files exist
- [ ] Dependencies install successfully
- [ ] OpenAPI specification exists with GET /health endpoint
- [ ] Tests can execute (may fail without implementation)
- [ ] Coverage reports can be generated
- [ ] Linting works
- [ ] Development server can start
- [ ] CI workflow file exists
- [ ] Review artifact structure is ready

---

## Expected Results

### ✅ Success Criteria
- All file/directory checks pass
- All commands execute (even if tests fail)
- OpenAPI specification is valid
- CI workflow is configured

### ⚠️ Expected Failures (Without Implementation)
- Contract tests fail (no implementation exists yet)
- Development server may not start (no routes implemented)
- These failures are expected for Day-0 setup

### ❌ Real Failures (Must Fix)
- Missing files or directories
- Invalid configuration files
- Dependencies fail to install
- Invalid OpenAPI specification
- CI workflow syntax errors

---

## Next Steps

Once Day-0 setup is complete:
1. Implement GET /health endpoint
2. Make contract tests pass
3. Verify CI workflow generates review artifacts
4. Proceed with Week 5 endpoint development

