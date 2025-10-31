# Phase 1: Data Model

**Feature**: Configure and Enforce Coverage Thresholds  
**Date**: 2025-10-29  
**Status**: Complete

---

## Entity 1: Coverage Threshold Configuration

**Purpose**: Defines the minimum acceptable code coverage metrics that all source code must meet.

**Attributes**:
| Attribute | Type | Value | Description |
|-----------|------|-------|-------------|
| `statements` | Integer | 60 | Minimum percentage of executable statements that must be covered by tests |
| `branches` | Integer | 50 | Minimum percentage of code branches (if/else paths) that must be covered |
| `functions` | Integer | 60 | Minimum percentage of functions that must be called by tests |
| `lines` | Integer | 60 | Minimum percentage of lines of code that must be executed by tests |
| `scope` | String | "global" | Thresholds apply uniformly to all application code (no per-module variations) |
| `enforcement_type` | String | "hard_block" | Merge prevention when thresholds not met (no override mechanism) |
| `enforced_in` | String | "CI + local" | Configuration applies in both CI workflows and local development environments |

**Relationships**:
- **Referenced by**: CI Workflow (checks.yml) - used to determine PR merge eligibility
- **Stored in**: Vitest configuration file (vitest.config.js)
- **Overridden by**: None (fixed per specification FR-011)

**State Transitions**:
- Initial: Not configured
- Transition: Baseline measured before enforcement
- Active: Thresholds enforced globally
- Locked: Cannot change without specification amendment + team consensus

**Validation Rules**:
- All threshold values must be percentages (0-100)
- All thresholds must be positive integers
- `scope` must equal "global" (no per-module variations)
- `enforcement_type` must equal "hard_block"

---

## Entity 2: Exclusion Pattern

**Purpose**: Specifies files and directories that should NOT be included in coverage calculations.

**Attributes**:
| Attribute | Type | Value(s) | Description |
|-----------|------|---------|-------------|
| `pattern` | String (glob) | See below | Minimatch glob pattern to match excluded files |
| `category` | String | Infrastructure / Build / Test | Classification of excluded code |
| `rationale` | String | See below | Why this file type is excluded |

**Exclusion Patterns Defined**:
| Pattern | Category | Rationale |
|---------|----------|-----------|
| `**/node_modules/**` | Infrastructure | Third-party dependencies; coverage not our responsibility |
| `**/dist/**` | Build | Compiled/bundled output; generated from source |
| `**/build/**` | Build | Build artifacts; generated from source |
| `**/review-artifacts/**` | Infrastructure | Review metadata and reports; not application code |
| `**/*.test.js` | Test | Test infrastructure; tests themselves not subject to coverage |
| `**/*.spec.js` | Test | Test infrastructure; tests themselves not subject to coverage |
| `**/*.spec.ts` | Test | Test infrastructure; tests themselves not subject to coverage |
| `**/coverage/**` | Infrastructure | Coverage reports; avoid circular coverage measurement |
| `**/.git/**` | Infrastructure | Git metadata; not application code |

**Relationships**:
- **Applied by**: Vitest coverage configuration
- **Evaluated by**: Vitest during `npm run test:coverage` execution
- **Pattern Matching**: Minimatch logic (any file matching ANY pattern is excluded)
- **Inverse Match**: UI files NOT matching exclusions ARE included (e.g., `frontend/src/ui-*.js`)

**Validation Rules**:
- Glob patterns must be valid minimatch syntax
- At least one pattern must match each non-application file
- No pattern should match application source code
- Patterns are case-sensitive

---

## Entity 3: Coverage Report

**Purpose**: Machine-readable and human-readable output of test execution showing which code is covered by tests.

**Attributes**:
| Attribute | Type | Description |
|-----------|------|-------------|
| `generated_at` | ISO-8601 Timestamp | When coverage was measured (from Vitest execution) |
| `total_statements` | Integer | Total executable statements in included files |
| `covered_statements` | Integer | Statements executed by tests |
| `coverage_statements_pct` | Float (0-100) | Percentage of statements covered |
| `total_branches` | Integer | Total code branches in included files |
| `covered_branches` | Integer | Branches executed by tests |
| `coverage_branches_pct` | Float (0-100) | Percentage of branches covered |
| `total_functions` | Integer | Total functions in included files |
| `covered_functions` | Integer | Functions called by tests |
| `coverage_functions_pct` | Float (0-100) | Percentage of functions covered |
| `total_lines` | Integer | Total lines of code in included files |
| `covered_lines` | Integer | Lines executed by tests |
| `coverage_lines_pct` | Float (0-100) | Percentage of lines covered |
| `threshold_met` | Boolean | Whether all metrics meet minimum thresholds |
| `threshold_violations` | Array | List of metrics that failed (empty if all pass) |

**Output Formats**:
| Format | Location | Purpose | Audience |
|--------|----------|---------|----------|
| **JSON** | `coverage/coverage-final.json` | Machine-readable; for CI parsing and metrics extraction | Automated systems, CI |
| **HTML** | `coverage/index.html` | Human-readable; detailed per-file coverage breakdown | Developers, reviewers |
| **Summary** | `review-artifacts/index.html` | High-level metrics in review-packet index | PR reviewers |

**Relationships**:
- **Generated by**: Vitest during `npm run test:coverage` execution
- **Stored in**: `coverage/` directory (local) and `review-artifacts/coverage/` (CI artifact)
- **Evaluated by**: CI workflow (checks.yml) - determines PR merge eligibility
- **Validated against**: Coverage Threshold Configuration entity

**Validation Rules**:
- All metrics must be 0-100 percentage values
- `covered_X` must be ≤ `total_X` for all metrics
- `threshold_met = true` IFF all percentages meet thresholds:
  - `coverage_statements_pct >= 60`
  - `coverage_branches_pct >= 50`
  - `coverage_functions_pct >= 60`
  - `coverage_lines_pct >= 60`
- `threshold_violations` populated with any metrics failing above checks

---

## Entity 4: CI Workflow (GitHub Actions)

**Purpose**: Automated pipeline that runs tests with coverage and enforces thresholds.

**Attributes**:
| Attribute | Type | Description |
|-----------|------|-------------|
| `trigger_event` | String | GitHub event that initiates workflow (e.g., "pull_request", "push") |
| `execution_context` | String | PR branch or main branch |
| `coverage_check_status` | String | "PASS" if thresholds met; "FAIL" if not |
| `merge_blocked` | Boolean | true if coverage check failed (prevents merge) |
| `artifacts_preserved` | Boolean | Coverage reports saved even on failure |

**Relationships**:
- **Uses**: Coverage Threshold Configuration (to validate results)
- **Generates**: Coverage Report (via Vitest execution)
- **Blocks**: PR merge (if coverage fails)
- **Stores**: Coverage artifacts in review-packet

**State Transitions**:
1. PR opened → Coverage check enqueued
2. `npm run test:coverage` executed
3. Vitest compares metrics to thresholds
4. If all metrics ≥ threshold: ✅ CI step passes (exit code 0)
5. If any metric < threshold: ❌ CI step fails (exit code 1) → PR check fails
6. Merge blocked until coverage restored OR specification amended

**Validation Rules**:
- Coverage check must run on every PR
- Failure must prevent merge (no workaround)
- Reports must be preserved regardless of pass/fail
- Hard block enforcement with no override mechanism

---

## Entity 5: Threshold Governance Record

**Purpose**: Tracks the specification version and governance model for threshold changes.

**Attributes**:
| Attribute | Type | Description |
|-----------|------|-------------|
| `current_version` | String | Specification version (e.g., "1.0.0") |
| `last_amendment_date` | ISO-8601 Date | When thresholds were last changed |
| `amendment_requires` | String | "specification_amendment + team_consensus" |
| `current_values` | Object | Current threshold values (60/50/60/60) |
| `immutable` | Boolean | true (thresholds locked; cannot change without formal process) |

**Relationships**:
- **Defined by**: Feature specification (spec.md) - only source of truth
- **Changes require**: PR + team approval (per constitution governance section)
- **Applies to**: All code in the repository (global scope)

**Validation Rules**:
- Amendment can only occur via:
  1. Update to specification document
  2. PR description referencing spec change
  3. Team consensus (code review approval)
- No programmatic overrides allowed
- Changes to thresholds require new feature specification

---

## Data Model Relationships Diagram

```
┌─────────────────────────────┐
│ Coverage Threshold Config    │
│ (60/50/60/60, global)       │
└──────────┬──────────────────┘
           │ used by
           ▼
┌─────────────────────────────┐
│ CI Workflow (checks.yml)    │
│ (runs npm run test:coverage)│
└──────────┬──────────────────┘
           │ generates
           ▼
┌─────────────────────────────┐
│ Coverage Report             │
│ (JSON + HTML)               │
└──────────┬──────────────────┘
           │ validated by
           ▼
┌─────────────────────────────┐
│ Coverage Threshold Config   │
│ (threshold_met check)       │
└──────────┬──────────────────┘
           │ if FAIL:
           ▼
    Merge Blocked ❌
           │ if PASS:
           ▼
    Merge Allowed ✅

┌─────────────────────────────┐
│ Exclusion Patterns          │
│ (glob list)                 │
└──────────┬──────────────────┘
           │ applied to
           ▼
┌─────────────────────────────┐
│ Coverage Report             │
│ (only app code measured)    │
└─────────────────────────────┘
```

---

## Summary

- **5 Core Entities**: Coverage Thresholds, Exclusion Patterns, Coverage Report, CI Workflow, Threshold Governance
- **Global Scope**: All thresholds apply uniformly across the entire codebase
- **Hard Enforcement**: Coverage failures prevent merges; no override mechanism
- **Immutable Configuration**: Changes require formal specification amendment
- **Integration Points**: Vitest + GitHub Actions + review-packet artifact

---
