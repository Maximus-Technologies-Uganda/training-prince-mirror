# CI/CD Pipeline API Contracts

## Coverage Report Generation API

### POST /ci/coverage/generate
**Purpose**: Generate coverage reports for all applications

**Request**:
```json
{
  "applications": ["quote", "expense", "temp", "todo", "stopwatch"],
  "report_types": ["backend", "ui"],
  "output_directory": "review-artifacts",
  "include_metadata": true
}
```

**Response**:
```json
{
  "status": "success|partial|failed",
  "generated_reports": [
    {
      "application": "quote",
      "type": "backend",
      "coverage_percentage": 85.5,
      "report_path": "review-artifacts/coverage-quote/index.html",
      "generated_at": "2025-01-27T10:30:00Z"
    }
  ],
  "failed_reports": [
    {
      "application": "expense",
      "type": "ui",
      "error_message": "Vitest configuration not found",
      "failed_at": "2025-01-27T10:31:00Z"
    }
  ],
  "overall_status": "partial",
  "total_applications": 5,
  "successful_reports": 4,
  "failed_reports": 1
}
```

## Review Packet Generation API

### POST /ci/review-packet/generate
**Purpose**: Create consolidated review packet with all artifacts

**Request**:
```json
{
  "branch": "development",
  "commit_hash": "abc123def456",
  "include_coverage": true,
  "include_metadata": true,
  "include_smoke_tests": true
}
```

**Response**:
```json
{
  "status": "success|failed",
  "packet_id": "packet_20250127_103000",
  "artifacts": {
    "index_html": "review-artifacts/index.html",
    "review_md": "review-artifacts/review.md",
    "coverage_reports": [
      "review-artifacts/coverage-quote/",
      "review-artifacts/coverage-expense/",
      "review-artifacts/ui-coverage-quote/",
      "review-artifacts/ui-coverage-expense/"
    ],
    "smoke_test_artifacts": [
      "review-artifacts/screenshots/",
      "review-artifacts/traces/"
    ]
  },
  "metadata": {
    "environment": {
      "node_version": "18.17.0",
      "npm_version": "9.6.7",
      "os": "linux",
      "ci_platform": "github-actions"
    },
    "coverage_summary": {
      "backend_coverage": {
        "quote": 85.5,
        "expense": 78.2,
        "temp": 92.1,
        "todo": 88.7,
        "stopwatch": 81.3
      },
      "ui_coverage": {
        "quote": 45.2,
        "expense": 42.8,
        "temp": 48.9,
        "todo": 44.1,
        "stopwatch": 46.7
      },
      "overall_coverage": 67.8
    }
  },
  "generated_at": "2025-01-27T10:35:00Z"
}
```

## State File Migration API

### POST /repository/migrate-state-files
**Purpose**: Migrate state files to /data/ directory

**Request**:
```json
{
  "source_files": [
    "src/expense/expenses.json",
    "src/todo/todo.json",
    "src/stopwatch/stopwatch-state.json"
  ],
  "target_directory": "data",
  "backup_existing": true,
  "validate_json": true
}
```

**Response**:
```json
{
  "status": "success|conflict|failed",
  "migrated_files": [
    {
      "source": "src/expense/expenses.json",
      "target": "data/expenses.json",
      "size_bytes": 1024,
      "backup_path": "data/backup/expenses.json.20250127",
      "validation_status": "valid"
    }
  ],
  "conflicts": [
    {
      "file": "data/todo.json",
      "conflict_type": "file_exists",
      "existing_size": 2048,
      "new_size": 1024,
      "requires_manual_resolution": true
    }
  ],
  "errors": [],
  "migration_summary": {
    "total_files": 3,
    "successful_migrations": 2,
    "conflicts": 1,
    "errors": 0
  }
}
```

## Smoke Test Execution API

### POST /ci/smoke-tests/run
**Purpose**: Execute Playwright smoke tests for all UIs

**Request**:
```json
{
  "applications": ["quote", "expense", "temp", "todo", "stopwatch"],
  "capture_artifacts": true,
  "upload_on_failure": true,
  "timeout_ms": 30000
}
```

**Response**:
```json
{
  "status": "success|failed",
  "test_results": [
    {
      "application": "quote",
      "test_name": "quote-filtering-workflow",
      "status": "passed",
      "execution_time_ms": 2500,
      "artifacts": []
    },
    {
      "application": "expense",
      "test_name": "expense-calculation-workflow",
      "status": "failed",
      "execution_time_ms": 5000,
      "artifacts": [
        "screenshots/expense-failure.png",
        "traces/expense-trace.zip"
      ],
      "error_message": "Element not found: .calculate-button"
    }
  ],
  "overall_status": "failed",
  "total_tests": 5,
  "passed_tests": 4,
  "failed_tests": 1,
  "artifact_upload_status": "success|failed",
  "execution_summary": {
    "total_time_ms": 15000,
    "average_time_ms": 3000,
    "slowest_test": "stopwatch-timing-workflow",
    "fastest_test": "quote-filtering-workflow"
  }
}
```

## Review Packet Access API

### GET /review-packet/{packet_id}
**Purpose**: Retrieve review packet for reviewer access

**Request**: Path parameter `packet_id`

**Response**:
```json
{
  "packet_id": "packet_20250127_103000",
  "branch": "development",
  "commit_hash": "abc123def456",
  "generated_at": "2025-01-27T10:35:00Z",
  "access_urls": {
    "index_html": "https://ci-artifacts.example.com/review-artifacts/index.html",
    "review_md": "https://ci-artifacts.example.com/review-artifacts/review.md",
    "coverage_reports": [
      "https://ci-artifacts.example.com/review-artifacts/coverage-quote/",
      "https://ci-artifacts.example.com/review-artifacts/ui-coverage-quote/"
    ]
  },
  "metadata": {
    "environment": {
      "node_version": "18.17.0",
      "npm_version": "9.6.7"
    },
    "coverage_summary": {
      "overall_coverage": 67.8,
      "ui_coverage_threshold_met": true
    }
  },
  "status": "available|expired|not_found"
}
```

## Error Response Format

All APIs return consistent error responses:

```json
{
  "status": "error",
  "error_code": "COVERAGE_GENERATION_FAILED|ARTIFACT_UPLOAD_FAILED|MIGRATION_CONFLICT",
  "error_message": "Human-readable error description",
  "details": {
    "failed_operation": "coverage generation for expense app",
    "retry_possible": true,
    "manual_intervention_required": false
  },
  "timestamp": "2025-01-27T10:35:00Z"
}
```
