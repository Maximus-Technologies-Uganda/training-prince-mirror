# Data Model: Week 4 Finisher - Review-Packet Coverage Reports

**Feature**: Fix review-packet packaging for CI workflow  
**Date**: October 31, 2025

---

## Entities & Definitions

### 1. UI Coverage Report

**Entity Name**: `UICoverageReport`

**Description**: A coverage report containing lcov.info and HTML files generated from a UI test suite run

**Fields**:
```
{
  suiteName: string                    // One of: ui-expense, ui-stopwatch, ui-temp, ui-todo, ui-quote
  lcovInfoPath: string                 // Absolute path to lcov.info file
  htmlReportPath: string               // Absolute path to coverage index.html
  coveragePercentage: number            // Overall statement coverage (0-100)
  linesCovered: number                 // Count of lines with coverage
  linesTotalLines: number              // Total lines to measure
  generatedAt: ISO8601 timestamp       // When coverage was generated
  status: "generated" | "verified" | "copied" | "failed"
}
```

**Validation Rules**:
- `suiteName` MUST be one of the five allowed values (exact enum)
- `lcovInfoPath` MUST be a valid file path containing lcov.info content
- `htmlReportPath` MUST point to a valid HTML file
- `coveragePercentage` MUST be >= 40 (per Constitution Principle II threshold)
- `generatedAt` MUST be ISO8601 format
- Status transitions: generated → verified → copied (→ failed at any point)

**Relationships**:
- Contains: lcov.info file (sibling directory structure)
- Contains: HTML report files (index.html, source code files with annotations)
- Referenced by: ReviewIndex entity

---

### 2. Review Index

**Entity Name**: `ReviewIndex`

**Description**: The index.html file that serves as entry point to all five coverage reports

**Fields**:
```
{
  filePath: string                     // review-artifacts/index.html
  title: string                        // "Review Packet - Coverage Reports"
  generatedAt: ISO8601 timestamp
  suiteLinks: {
    [suiteName]: {
      lcovInfoLink: string            // Relative URL to lcov.info
      htmlReportLink: string           // Relative URL to coverage/index.html
      linkValid: boolean               // File exists at link destination
    }
  }[]
  allLinksValid: boolean              // True if all 5 coverage links point to valid files
}
```

**Validation Rules**:
- `filePath` MUST be `review-artifacts/index.html`
- `suiteLinks` MUST contain exactly 5 entries (ui-expense, ui-stopwatch, ui-temp, ui-todo, ui-quote)
- Each link MUST be relative (e.g., `./ui-expense/lcov.info`)
- `allLinksValid` MUST be true before artifact packaging (fail-fast requirement)

**Relationships**:
- References: All five UICoverageReport entities
- Contains: Links to lcov.info and HTML reports in review-artifacts/

---

### 3. Review Packet Artifact

**Entity Name**: `ReviewPacketArtifact`

**Description**: The final packaged collection of all coverage reports and index

**Fields**:
```
{
  artifactName: string                // "review-packet" or "review-artifacts"
  artifactPath: string                // review-artifacts/ directory (source)
  artifactSize: number                // Total size in bytes (no limit per spec)
  uploadedAt: ISO8601 timestamp
  gitHubUrl: string                   // URL to GitHub Actions artifact
  suiteReportsIncluded: {
    [suiteName]: {
      lcovInfoPresent: boolean        // lcov.info file exists
      htmlReportPresent: boolean      // coverage/index.html exists
      filesComplete: boolean          // Both files present
    }
  }[]
  verificationPassed: boolean         // All five suites have complete coverage files
  status: "pending" | "verified" | "uploaded" | "failed"
}
```

**Validation Rules**:
- `artifactPath` MUST be `review-artifacts/`
- `suiteReportsIncluded` MUST have all 5 suites with filesComplete = true
- `verificationPassed` MUST be true before upload (fail-fast gate)
- Status transitions: pending → verified → uploaded (→ failed at any point)
- If verification fails: DO NOT upload artifact, fail the CI build

**Relationships**:
- Contains: ReviewIndex entity
- Contains: Five UICoverageReport entities (copied into review-artifacts/)
- Uploaded to: GitHub Actions Artifacts (via actions/upload-artifact)

---

### 4. CI Workflow Configuration

**Entity Name**: `CIWorkflowConfig`

**Description**: Configuration settings for the CI pipeline that generates and verifies coverage

**Fields**:
```
{
  workflowFile: string                // .github/workflows/test.yml
  vitestConfigFile: string            // vitest.config.js
  testSuites: {
    [suiteName]: {
      testPath: string                // Path to test file (e.g., frontend/tests/ui-expense.test.js)
      coverageEnabled: boolean        // Must be true
      coverageReporters: string[]     // Must include: ["lcov", "html"]
      coverageOutputDir: string       // Default: coverage/
      coverageThreshold: number       // Minimum 40% statement coverage
    }
  }[]
  verificationScript: string          // Script to verify all five coverage reports exist
  failFastEnabled: boolean            // MUST be true (per spec)
  artifactUploadStep: {
    enabled: boolean
    artifactName: string
    artifactPath: string
    requiresVerification: boolean     // MUST be true
  }
}
```

**Validation Rules**:
- All five test suites MUST have coverageEnabled = true
- All five must have reporters: ["lcov", "html"]
- `failFastEnabled` MUST be true
- `requiresVerification` MUST be true (no upload without passing verification)

**Relationships**:
- Configures: Vitest test execution
- Configures: GitHub Actions workflow steps
- Defines: Failure behavior for incomplete coverage

---

## Entity Relationships Diagram

```
ReviewPacketArtifact
├── ReviewIndex (1:1)
│   ├── links to: UICoverageReport[ui-expense] (1:1)
│   ├── links to: UICoverageReport[ui-stopwatch] (1:1)
│   ├── links to: UICoverageReport[ui-temp] (1:1)
│   ├── links to: UICoverageReport[ui-todo] (1:1)
│   └── links to: UICoverageReport[ui-quote] (1:1)
│
└── CIWorkflowConfig (1:1)
    ├── defines: UICoverageReport[ui-expense] generation
    ├── defines: UICoverageReport[ui-stopwatch] generation
    ├── defines: UICoverageReport[ui-temp] generation
    ├── defines: UICoverageReport[ui-todo] generation
    └── defines: UICoverageReport[ui-quote] generation
```

---

## State Transitions

### Coverage Report Lifecycle
```
NOT_GENERATED
    ↓
GENERATED (Vitest runs, produces lcov.info + HTML)
    ↓ (verification checks exist)
VERIFIED (All files present and readable)
    ↓ (copy to review-artifacts/)
COPIED (Files moved from coverage/ to review-artifacts/)
    ↓ (part of artifact package)
PACKAGED (Included in final artifact upload)
    ↓
PUBLISHED (GitHub Actions Artifact accessible)

Or at any point:
    → FAILED (if file missing, generation failed, copy failed, etc.)
```

### Artifact Packaging Lifecycle
```
PENDING
    ↓ (all suites generate coverage)
COVERAGE_GENERATED
    ↓ (copy all reports to review-artifacts/)
REPORTS_COPIED
    ↓ (verify all 5 suites complete)
VERIFIED
    ↓ (success - upload to GitHub)
UPLOADED
    ↓
PUBLISHED

Or at any verification step:
    → FAILED (build fails, artifact NOT created)
```

---

## Key Constraints

1. **All-or-Nothing Packaging**: If ANY of the five coverage reports is missing or incomplete, the entire artifact upload MUST fail (fail-fast behavior)

2. **Minimum Coverage Threshold**: Each UI test suite MUST maintain ≥40% statement coverage (per Constitution Principle II)

3. **Complete Artifact**: The final review-packet MUST contain:
   - review-artifacts/index.html (with valid links to all five suites)
   - 5 × coverage report directories (ui-expense, ui-stopwatch, ui-temp, ui-todo, ui-quote)
   - 5 × lcov.info files (one per suite)
   - 5 × HTML coverage reports (one per suite)

4. **No Broken Links**: review-artifacts/index.html MUST contain ONLY valid, non-broken links to included coverage reports

5. **File Size**: No constraint on total artifact size; all coverage reports MUST be included uncompressed (per NFR-001)

---

## Validation Rules Summary

| Entity | Rule | Enforcement |
|--------|------|-----------|
| UICoverageReport | Coverage ≥ 40% | Threshold check before inclusion |
| ReviewIndex | 5 valid links | Validation before packaging |
| ReviewPacketArtifact | All 5 suites complete | Verification gate (fail-fast) |
| ReviewPacketArtifact | allLinksValid = true | Link validation script |
| CIWorkflowConfig | All 5 suites enabled | Config audit + CI enforcement |

---

*Based on FR-001 through FR-008, NFR-001 through NFR-003, and Constitutional Principle II (Test Coverage Mandate) & III (Reviewability)*
