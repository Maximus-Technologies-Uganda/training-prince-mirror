# Data Model: CI/CD Pipeline and Repository Hygiene

## Core Entities

### Review Packet
**Purpose**: Consolidated artifact containing all project assessment information for reviewers

**Fields**:
- `id`: Unique identifier (timestamp-based)
- `branch`: Git branch name (e.g., "development")
- `commit_hash`: Git commit SHA
- `generated_at`: ISO timestamp
- `coverage_reports`: Array of coverage report references
- `ui_coverage_reports`: Array of UI coverage report references
- `review_metadata`: Enriched review.md content
- `index_html`: Central navigation file
- `artifacts`: Array of additional artifacts (screenshots, traces)

**Relationships**:
- Contains multiple Coverage Reports (1:N)
- Contains multiple UI Coverage Reports (1:N)
- Contains single Review Metadata (1:1)

**Validation Rules**:
- Must contain at least one coverage report
- Index HTML must be valid HTML5
- Generated timestamp must be recent (<24 hours)

### Coverage Report
**Purpose**: Test coverage data for individual backend applications

**Fields**:
- `application_name`: String (quote, expense, temp, todo, stopwatch)
- `coverage_percentage`: Number (0-100)
- `statement_coverage`: Number (0-100)
- `branch_coverage`: Number (0-100)
- `function_coverage`: Number (0-100)
- `line_coverage`: Number (0-100)
- `report_path`: String (relative path to HTML report)
- `generated_at`: ISO timestamp
- `test_count`: Number of tests executed
- `error_message`: String (if generation failed)

**Relationships**:
- Belongs to Review Packet (N:1)
- References Application (N:1)

**Validation Rules**:
- Application name must be one of: quote, expense, temp, todo, stopwatch
- Coverage percentages must be 0-100
- Report path must be valid relative path

### UI Coverage Report
**Purpose**: Test coverage data for individual frontend applications

**Fields**:
- `application_name`: String (quote, expense, temp, todo, stopwatch)
- `coverage_percentage`: Number (0-100)
- `statement_coverage`: Number (0-100)
- `branch_coverage`: Number (0-100)
- `function_coverage`: Number (0-100)
- `line_coverage`: Number (0-100)
- `report_path`: String (relative path to HTML report)
- `generated_at`: ISO timestamp
- `test_count`: Number of tests executed
- `error_message`: String (if generation failed)
- `vitest_config`: Object (Vitest configuration used)

**Relationships**:
- Belongs to Review Packet (N:1)
- References Application (N:1)

**Validation Rules**:
- Application name must be one of: quote, expense, temp, todo, stopwatch
- Coverage percentages must be 0-100
- Must meet minimum 40% statement coverage threshold

### State File
**Purpose**: Runtime data files that maintain application state

**Fields**:
- `filename`: String (expenses.json, todo.json, stopwatch-state.json)
- `application`: String (expense, todo, stopwatch)
- `file_path`: String (absolute path in /data/ directory)
- `size_bytes`: Number
- `last_modified`: ISO timestamp
- `backup_path`: String (if migrated from original location)
- `validation_status`: String (valid, invalid, corrupted)

**Relationships**:
- Belongs to Application (N:1)

**Validation Rules**:
- Filename must match pattern: `{app}.json` or `{app}-state.json`
- File path must be within /data/ directory
- Must be valid JSON format

### Smoke Test
**Purpose**: Foundational E2E test verifying key functionality of each UI application

**Fields**:
- `application_name`: String (quote, expense, temp, todo, stopwatch)
- `test_name`: String (descriptive test name)
- `workflow_description`: String (primary user workflow being tested)
- `test_file_path`: String (path to Playwright test file)
- `last_run_at`: ISO timestamp
- `status`: String (passed, failed, skipped)
- `execution_time_ms`: Number
- `artifacts`: Array of artifact references (screenshots, traces)
- `error_message`: String (if test failed)

**Relationships**:
- References Application (N:1)
- Generates Test Artifacts (1:N)

**Validation Rules**:
- Application name must be one of: quote, expense, temp, todo, stopwatch
- Test file must exist and be valid Playwright test
- Must test one primary user workflow per application

### Review Metadata
**Purpose**: Enriched review.md content with environment and repository information

**Fields**:
- `environment_details`: Object
  - `node_version`: String
  - `npm_version`: String
  - `os`: String
  - `ci_platform`: String
- `commit_log`: Array of commit objects
  - `hash`: String
  - `message`: String
  - `author`: String
  - `date`: ISO timestamp
- `repository_map`: Object
  - `two_level_structure`: Object (directory tree)
  - `file_count`: Number
  - `total_size_mb`: Number
- `coverage_summary`: Object
  - `backend_coverage`: Object (per-app percentages)
  - `ui_coverage`: Object (per-app percentages)
  - `overall_coverage`: Number
- `generated_at`: ISO timestamp

**Relationships**:
- Belongs to Review Packet (1:1)

**Validation Rules**:
- Must include last 20 commits
- Repository map must be two levels deep
- Coverage summary must include all 5 applications

## State Transitions

### Coverage Report Generation
1. **Initiated**: CI pipeline starts coverage generation
2. **In Progress**: Coverage tools executing
3. **Completed**: Report generated successfully
4. **Failed**: Generation failed with error message
5. **Partial**: Some applications succeeded, others failed

### Review Packet Lifecycle
1. **Created**: CI pipeline initiates packet creation
2. **Collecting**: Gathering coverage reports and metadata
3. **Generating**: Creating index.html and review.md
4. **Uploading**: Uploading to CI artifact storage
5. **Available**: Packet ready for reviewer access
6. **Failed**: Upload failed, CI pipeline fails

### State File Migration
1. **Detected**: Existing state files found in original locations
2. **Validating**: Checking for conflicts in /data/ directory
3. **Backing Up**: Creating backup of existing files
4. **Migrating**: Moving files to /data/ directory
5. **Completed**: Migration successful
6. **Conflict**: Manual resolution required

## Data Integrity Rules

1. **Coverage Thresholds**: UI applications must maintain ≥40% statement coverage
2. **File Consistency**: State files must be valid JSON and properly formatted
3. **Path Validation**: All file paths must be relative and within expected directories
4. **Timestamp Ordering**: Generated timestamps must be chronologically consistent
5. **Application Completeness**: All 5 applications (quote, expense, temp, todo, stopwatch) must be represented in coverage reports
