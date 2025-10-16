# Quickstart: CI/CD Pipeline Enhancement and Repository Hygiene

## Overview
This quickstart validates the implementation of unified coverage reporting, repository hygiene improvements, and foundational E2E smoke testing for the hello-world project.

## Prerequisites
- Node.js 18+ installed
- Git repository with development branch
- CI/CD pipeline access (GitHub Actions)
- Playwright installed for E2E testing

## Validation Steps

### 1. Verify Unified Coverage Reporting
**Objective**: Confirm CI generates consolidated coverage reports for all applications

**Steps**:
1. Trigger CI pipeline on development branch
2. Wait for pipeline completion (<10 minutes target)
3. Download review-packet artifact
4. Verify artifact contains:
   - `review-artifacts/index.html` (central entry point)
   - `review-artifacts/coverage-<app>/` directories for each application
   - `review-artifacts/ui-coverage-<app>/` directories for each UI
   - `review-artifacts/review.md` (enriched metadata)

**Expected Results**:
- Single review-packet artifact generated
- All 5 applications (quote, expense, temp, todo, stopwatch) have coverage reports
- Index HTML provides navigation to all reports
- Review.md contains environment details, commit log, and coverage statistics

**Validation Commands**:
```bash
# Check artifact structure
ls -la review-artifacts/
ls -la review-artifacts/coverage-*/
ls -la review-artifacts/ui-coverage-*/

# Verify index.html exists and is valid
file review-artifacts/index.html

# Check review.md content
head -20 review-artifacts/review.md
```

### 2. Validate Repository Hygiene
**Objective**: Confirm state files migrated to /data/ directory and properly ignored

**Steps**:
1. Check for existing state files in original locations
2. Verify /data/ directory exists
3. Confirm .gitignore includes /data/ directory
4. Validate state files are not tracked by Git

**Expected Results**:
- `/data/` directory exists
- State files (expenses.json, todo.json, stopwatch-state.json) in /data/
- .gitignore contains `/data/` entry
- Git status shows no untracked files in /data/

**Validation Commands**:
```bash
# Check data directory
ls -la data/

# Verify gitignore
grep -n "data/" .gitignore

# Check git status
git status --ignored

# Verify state files not tracked
git ls-files | grep -E "(expenses|todo|stopwatch).*\.json"
```

### 3. Test Smoke Test Execution
**Objective**: Verify Playwright smoke tests run and capture failure artifacts

**Steps**:
1. Run smoke tests locally
2. Verify all 5 applications have smoke tests
3. Test failure artifact capture
4. Confirm CI integration

**Expected Results**:
- 5 smoke test files exist in frontend/e2e/
- Each test validates one primary user workflow
- Tests complete within 30 seconds
- Failure artifacts captured when tests fail

**Validation Commands**:
```bash
# List smoke test files
ls -la frontend/e2e/*.spec.*

# Run smoke tests
cd frontend
npm run test:e2e

# Check test results
ls -la test-results/
```

### 4. Verify README Documentation
**Objective**: Confirm README.md contains comprehensive review instructions

**Steps**:
1. Check README.md for "How to review me" section
2. Verify instructions include prerequisites
3. Confirm access methods are documented
4. Validate artifact interpretation guidance

**Expected Results**:
- README.md contains detailed "How to review me" section
- Instructions cover prerequisites, access methods, and interpretation
- Clear guidance for external reviewers
- Links to development branch CI artifacts

**Validation Commands**:
```bash
# Check README content
grep -A 20 "How to review me" README.md

# Verify section exists
grep -n "How to review me" README.md
```

### 5. Test Error Handling Scenarios
**Objective**: Validate graceful degradation and failure handling

**Steps**:
1. Test partial coverage failure scenario
2. Verify artifact upload failure handling
3. Test data migration conflict resolution
4. Confirm error indicators in review packet

**Expected Results**:
- Partial coverage failures continue with error indicators
- Artifact upload failures cause complete CI failure
- Data migration conflicts require manual resolution
- Error messages clearly indicate issues

**Validation Commands**:
```bash
# Simulate partial failure (if possible)
# Check CI logs for error handling
# Verify error indicators in review.md
grep -i "error\|failed" review-artifacts/review.md
```

## Success Criteria

### Coverage Reporting
- ✅ All 5 applications have coverage reports
- ✅ UI coverage meets ≥40% threshold
- ✅ Review packet contains unified index
- ✅ Enriched review.md with metadata

### Repository Hygiene
- ✅ State files in /data/ directory
- ✅ /data/ directory in .gitignore
- ✅ No stray/temporary files
- ✅ Clean repository state

### Smoke Testing
- ✅ 5 smoke tests (one per application)
- ✅ Each tests primary user workflow
- ✅ Failure artifacts captured
- ✅ CI integration working

### Documentation
- ✅ README.md has "How to review me" section
- ✅ Detailed step-by-step instructions
- ✅ Prerequisites and access methods documented
- ✅ Artifact interpretation guidance provided

## Troubleshooting

### Coverage Reports Missing
- Check CI pipeline logs for generation errors
- Verify test configuration files exist
- Confirm coverage tools are properly installed

### Smoke Tests Failing
- Check Playwright installation
- Verify test files are valid
- Review browser compatibility settings

### State File Migration Issues
- Check for file conflicts in /data/ directory
- Verify JSON file validity
- Confirm backup procedures

### Artifact Upload Failures
- Check CI platform storage limits
- Verify network connectivity
- Review upload timeout settings

## Next Steps
After successful validation:
1. Document any issues found
2. Update CI pipeline configuration if needed
3. Prepare for Week 4 scope implementation
4. Update project documentation
