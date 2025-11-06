# Coverage Workflow Documentation

**Feature**: Week 4 Finisher - Fix Review-Packet Packaging for CI  
**Date**: October 31, 2025  
**Status**: Complete

---

## Overview

This document describes how coverage is generated, packaged, and made available for stakeholder review through the review-packet artifact. The workflow ensures all five UI test suites have complete coverage reports (lcov.info + HTML) before packaging.

---

## Five UI Test Suites

The following five UI modules are required to generate and include coverage reports:

1. **ui-expense** - Expense tracking UI component
2. **ui-stopwatch** - Stopwatch timer UI component
3. **ui-temp** - Temperature converter UI component
4. **ui-todo** - Todo list UI component
5. **ui-quote** - Quote display UI component

---

## Coverage Generation

### How Coverage is Generated

Coverage is generated using **Vitest** with the **v8 provider** during test execution.

#### Configuration

**File**: `frontend/vitest.config.js`

```javascript
coverage: {
  reporter: ['text', 'lcov', 'html'],
  include: ['src/ui-*/**/*.js', 'src/main.js'],
  thresholds: {
    statements: 40,
    lines: 40,
  }
}
```

**Key Settings**:
- **Provider**: v8 (built-in code coverage)
- **Reporters**: 
  - `text` - Console output
  - `lcov` - LCOV format (parseable by coverage tools)
  - `html` - HTML coverage report
- **Include pattern**: `src/ui-*/**/*.js` (all five UI modules)
- **Minimum threshold**: 40% statements (per Constitutional Principle II)
- **Output directory**: `frontend/coverage/`

#### Running Coverage Generation

```bash
# From project root
npm run test:ui:coverage

# Or manually
cd frontend
npm run test:coverage
```

This command:
1. Runs all tests in `frontend/tests/` and `src/` directories
2. Collects code coverage using v8 provider
3. Generates coverage files in `frontend/coverage/[suite-name]/` directories

#### Output Structure

After successful coverage generation:

```
frontend/coverage/
├── ui-expense/
│   ├── lcov.info           # LCOV format coverage data
│   ├── index.html          # Interactive HTML report
│   └── [source files]/     # Annotated source code
├── ui-stopwatch/
│   ├── lcov.info
│   ├── index.html
│   └── [source files]/
├── ui-temp/
│   ├── lcov.info
│   ├── index.html
│   └── [source files]/
├── ui-todo/
│   ├── lcov.info
│   ├── index.html
│   └── [source files]/
└── ui-quote/
    ├── lcov.info
    ├── index.html
    └── [source files]/
```

---

## Coverage Copying

### Purpose

Copy all five coverage report directories from `frontend/coverage/` to `review-artifacts/` for packaging and stakeholder review.

### Script Location

**File**: `.github/scripts/copy-coverage-reports.sh`

### How It Works

The copy script:
1. Creates the `review-artifacts/` destination directory
2. Verifies each source directory exists in `frontend/coverage/`
3. Checks that required files (lcov.info, index.html) exist in source
4. Validates file sizes meet minimum thresholds:
   - lcov.info: ≥ 1024 bytes (>1KB)
   - index.html: ≥ 512 bytes (>512 bytes)
5. Copies entire directory with all annotated source files
6. Verifies destination files match source file sizes
7. Exits with code 0 on success, code 1 on any failure

### Running Locally

```bash
# From project root
bash .github/scripts/copy-coverage-reports.sh

# Expected output:
# 📋 Starting coverage report copying...
# Copying ui-expense...
#   ✅ Copied ui-expense (45230 + 8923 bytes)
# ...
# ✅ All coverage reports copied successfully
```

### Failure Scenarios

The script exits immediately with error code 1 if:
- Source directory `frontend/coverage/[suite]/` does not exist
- Required files are missing (lcov.info or index.html)
- Files are below minimum size thresholds
- Copy operation fails (permission error, disk space, etc.)
- Destination file is incomplete or truncated

---

## Coverage Verification

### Purpose

Verify all five coverage report sets are complete and valid BEFORE packaging the artifact. This gate prevents broken links and incomplete documentation.

### Script Location

**File**: `.github/scripts/verify-coverage-reports.sh`

### Verification Checks

For each of the five suites, the script verifies:

✅ **Directory Exists**
- `review-artifacts/[suite]/` directory present

✅ **Files Exist**
- `review-artifacts/[suite]/lcov.info` file present
- `review-artifacts/[suite]/index.html` file present

✅ **File Sizes**
- lcov.info ≥ 1024 bytes (at least 1 KB)
- index.html ≥ 512 bytes (at least 512 bytes)

✅ **File Formats**
- lcov.info contains valid LCOV format markers:
  - Starts with content including coverage lines
  - Ends with `end_of_record`
- index.html contains valid HTML tags (e.g., `<html`)

✅ **Readability**
- All files are readable by the CI process

### Running Locally

```bash
# From project root (after running copy script)
bash .github/scripts/verify-coverage-reports.sh

# Expected output on success:
# 🔍 Verifying coverage reports in review-artifacts/
# Checking ui-expense...
#   ✅ ui-expense verified (45230 + 8923 bytes)
# ...
# ✅ All coverage reports verified successfully
# ✅ Ready for artifact upload
```

### Failure Scenarios

The script exits immediately with error code 1 if ANY suite:
- Directory is missing
- lcov.info is missing or below minimum size
- index.html is missing or below minimum size
- Files have invalid format (not LCOV or HTML)
- Files are not readable

**Example failure output**:
```
❌ Coverage verification FAILED

Failed Suites:
  - ui-quote: lcov.info too small (500 bytes, expected >1024)

Summary:
  Total Suites: 5
  Verified: 4
  Failed: 1

❌ Verification FAILED - Artifact will NOT be uploaded
```

---

## Coverage Reports Storage

### After Generation (`frontend/coverage/`)

Temporary location where Vitest generates coverage files during test runs.

- **Lifetime**: Stays for local development, typically cleaned by build systems
- **Access**: For local viewing and development
- **Size**: ~50-100 MB for all five suites

### After Copying (`review-artifacts/`)

Central location for all coverage reports before artifact packaging.

- **Lifetime**: Preserved until artifact is packaged and uploaded
- **Access**: Accessible to CI/CD pipeline
- **Includes**: All files needed for stakeholder review:
  - `index.html` - Entry point linking all five suites
  - Five suite directories with complete coverage reports

### After Packaging (GitHub Actions Artifact)

Final packaged artifact available in GitHub Actions.

- **Name**: `review-packet`
- **Lifetime**: 90 days (configurable)
- **Access**: Download from GitHub Actions workflow run details
- **Includes**: Complete `review-artifacts/` directory with all coverage reports

---

## Entry Point: review-artifacts/index.html

The `index.html` file serves as the entry point for reviewing all coverage reports.

### Features

- **Landing page** linking to all five coverage suites
- **Interactive navigation** with buttons for each suite
- **Two types of links** for each suite:
  - 📈 View Coverage Report (interactive HTML)
  - 📄 Download lcov.info (raw LCOV format file)
- **Quick stats** showing:
  - Total suites: 5
  - Coverage reports: 10 (2 per suite)
  - Completeness: 100% (all suites included)
- **Metadata**:
  - Generation timestamp
  - Coverage tool: Vitest v8
  - Minimum threshold: 40% statements

### Accessing Reports

After artifact is downloaded:

1. Extract `review-packet.zip`
2. Open `review-artifacts/index.html` in web browser
3. Click on any suite to view detailed coverage
4. Click on `lcov.info` to download raw coverage data

---

## CI/CD Integration

### Workflow File

**File**: `.github/workflows/test.yml`

### Pipeline Stages

**Stage 1: Coverage Generation**
- Runs: `npm run test:ui:coverage`
- Verifies all five suites have coverage files
- Fails if any test fails or coverage is incomplete

**Stage 2: Coverage Copying**
- Runs: `bash .github/scripts/copy-coverage-reports.sh`
- Copies all coverage from `frontend/coverage/` to `review-artifacts/`
- Fails if any required file is missing or incomplete

**Stage 3: Coverage Verification**
- Runs: `bash .github/scripts/verify-coverage-reports.sh`
- Verifies all five suites have complete, valid coverage files
- **Gate**: If verification fails, artifact is NOT uploaded
- Fails if any suite is missing or invalid

**Stage 4: Artifact Upload**
- Runs: `actions/upload-artifact@v4`
- **Condition**: Only if verification stage succeeds
- Uploads `review-artifacts/` directory as `review-packet` artifact
- Artifact retention: 90 days

### Fail-Fast Behavior

The pipeline implements **fail-fast** behavior:

- If any stage fails, subsequent stages are skipped
- If verification fails, artifact is NOT created
- Failed build prevents artifact upload
- Detailed error messages are logged for debugging

---

## Local Development

### Quick Start

```bash
# 1. Generate coverage locally
npm run test:ui:coverage

# 2. Verify coverage files exist
ls -la frontend/coverage/
for suite in ui-expense ui-stopwatch ui-temp ui-todo ui-quote; do
  echo "Checking $suite:"
  ls -l frontend/coverage/$suite/lcov.info
  ls -l frontend/coverage/$suite/index.html
done

# 3. Copy to review-artifacts
bash .github/scripts/copy-coverage-reports.sh

# 4. Verify all reports
bash .github/scripts/verify-coverage-reports.sh

# 5. Review reports in browser
open review-artifacts/index.html
```

### Viewing Coverage Reports Locally

After coverage generation:

```bash
# View HTML reports in browser
open frontend/coverage/ui-expense/index.html
open frontend/coverage/ui-stopwatch/index.html
# ... etc for all five suites

# Or use a simple HTTP server
cd frontend/coverage
python3 -m http.server 8000
# Then visit: http://localhost:8000/ui-expense/
```

---

## Troubleshooting

### Coverage Not Generated

**Problem**: `frontend/coverage/` directory is empty or missing

**Solutions**:
1. Check that tests are executing: `npm run test:ui:coverage`
2. Verify test files exist: `ls frontend/tests/ui-*.test.js`
3. Check vitest.config.js has coverage enabled
4. Ensure coverage reporter includes 'lcov' and 'html'

### Verification Fails

**Problem**: `bash .github/scripts/verify-coverage-reports.sh` exits with error

**Check**:
1. Does `review-artifacts/` directory exist?
2. Do all five suite directories exist? Check with: `ls review-artifacts/`
3. Are files above minimum size? 
   ```bash
   wc -c review-artifacts/ui-*/lcov.info
   wc -c review-artifacts/ui-*/index.html
   ```
4. Check verification script output for specific failures

### Low Coverage

**Problem**: Coverage is below 40% threshold

**Solutions**:
1. Add more test cases to improve coverage
2. Check which files are uncovered: view HTML reports
3. Focus on critical paths and business logic
4. Use coverage reports to identify gaps

### Artifact Upload Fails

**Problem**: GitHub Actions artifact upload fails

**Check**:
1. Did verification step succeed? Check workflow logs
2. Is `review-artifacts/` directory present?
3. Are all five suite directories included?
4. Check artifact size isn't exceeded (GitHub has limits)

---

## Best Practices

✅ **DO**:
- Run coverage locally before pushing to CI
- Review coverage reports to identify gaps
- Keep coverage above 40% minimum threshold
- Test critical user paths thoroughly
- Use the HTML reports to understand what's covered

❌ **DON'T**:
- Disable coverage collection without approval
- Ignore coverage reports or skip viewing them
- Manually modify coverage files
- Leave coverage below 40% threshold
- Assume coverage without running tests

---

## References

- **Specification**: `/specs/017-week-4-finisher/spec.md`
- **Tasks**: `/specs/017-week-4-finisher/tasks.md`
- **Quickstart**: `/specs/017-week-4-finisher/quickstart.md`
- **Frontend Vitest Config**: `frontend/vitest.config.js`
- **Copy Script**: `.github/scripts/copy-coverage-reports.sh`
- **Verify Script**: `.github/scripts/verify-coverage-reports.sh`
- **CI Workflow**: `.github/workflows/test.yml`

---

*Based on Constitutional Principle II (Test Coverage Mandate) & III (Reviewability)*
