# Contracts: Week 4 Finisher - Review-Packet Coverage Workflow

**Feature**: Fix review-packet packaging for CI workflow  
**Date**: October 31, 2025

## Contract Files

This directory contains interface contracts for the CI workflow that generates, verifies, and packages coverage reports.

### 1. `coverage-generation.contract.md`
**Scope**: Vitest coverage generation for five UI test suites  
**Input**: Test suite execution via `npm run test:coverage` or CI workflow  
**Output**: Five directories with lcov.info and HTML reports  
**Responsibility**: Vitest configuration and test execution

### 2. `coverage-copying.contract.md`
**Scope**: Copying all five coverage reports into review-artifacts/  
**Input**: Generated coverage files from `coverage/` directory  
**Output**: Copied files in `review-artifacts/` directory  
**Responsibility**: CI workflow bash script or GitHub Actions step

### 3. `coverage-verification.contract.md`
**Scope**: Verifying all five coverage reports exist before packaging  
**Input**: review-artifacts/ directory with coverage subdirectories  
**Output**: Pass/Fail verification result  
**Responsibility**: Verification script (bash or Node.js)

### 4. `artifact-upload.contract.md`
**Scope**: Uploading final review-packet artifact to GitHub Actions  
**Input**: Verified review-artifacts/ directory  
**Output**: GitHub Actions Artifact (accessible from workflow run)  
**Responsibility**: GitHub Actions `upload-artifact` action

---

## Summary

The contracts define the interface boundaries between:
- **Vitest** → generates coverage reports per suite
- **CI Workflow** → copies reports and orchestrates verification
- **Verification Script** → validates all five suites complete
- **GitHub Actions** → uploads the final artifact

Each contract specifies:
- **INPUT**: What data/files must be provided
- **OUTPUT**: What data/files will be produced
- **VALIDATION**: What checks must pass
- **FAILURE**: How failures are handled (fail-fast → build fails)

---

*Based on FR-001 through FR-013, all contracts support fail-fast behavior (FR-009, FR-010, FR-011)*
