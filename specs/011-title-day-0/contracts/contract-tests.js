# Contract Tests: CI/CD Pipeline APIs

## Coverage Report Generation Contract Tests

### test-coverage-generation.js
```javascript
import { describe, it, expect } from 'vitest';

describe('Coverage Report Generation API', () => {
  it('should generate coverage reports for all applications', async () => {
    const request = {
      applications: ["quote", "expense", "temp", "todo", "stopwatch"],
      report_types: ["backend", "ui"],
      output_directory: "review-artifacts",
      include_metadata: true
    };

    const response = await fetch('/ci/coverage/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    
    // Schema validation
    expect(data).toHaveProperty('status');
    expect(data).toHaveProperty('generated_reports');
    expect(data).toHaveProperty('failed_reports');
    expect(data).toHaveProperty('overall_status');
    expect(data).toHaveProperty('total_applications');
    expect(data).toHaveProperty('successful_reports');
    expect(data).toHaveProperty('failed_reports');

    // Status validation
    expect(['success', 'partial', 'failed']).toContain(data.status);
    expect(data.total_applications).toBe(5);
    expect(data.successful_reports + data.failed_reports).toBe(5);

    // Report structure validation
    data.generated_reports.forEach(report => {
      expect(report).toHaveProperty('application');
      expect(report).toHaveProperty('type');
      expect(report).toHaveProperty('coverage_percentage');
      expect(report).toHaveProperty('report_path');
      expect(report).toHaveProperty('generated_at');
      
      expect(['quote', 'expense', 'temp', 'todo', 'stopwatch']).toContain(report.application);
      expect(['backend', 'ui']).toContain(report.type);
      expect(report.coverage_percentage).toBeGreaterThanOrEqual(0);
      expect(report.coverage_percentage).toBeLessThanOrEqual(100);
    });
  });

  it('should handle partial failures gracefully', async () => {
    // Test with intentionally failing configuration
    const request = {
      applications: ["quote", "expense"],
      report_types: ["backend", "ui"],
      output_directory: "review-artifacts",
      include_metadata: true
    };

    const response = await fetch('/ci/coverage/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });

    const data = await response.json();
    
    if (data.status === 'partial') {
      expect(data.failed_reports).toBeDefined();
      expect(data.failed_reports.length).toBeGreaterThan(0);
      
      data.failed_reports.forEach(failed => {
        expect(failed).toHaveProperty('application');
        expect(failed).toHaveProperty('type');
        expect(failed).toHaveProperty('error_message');
        expect(failed).toHaveProperty('failed_at');
      });
    }
  });
});
```

## Review Packet Generation Contract Tests

### test-review-packet-generation.js
```javascript
import { describe, it, expect } from 'vitest';

describe('Review Packet Generation API', () => {
  it('should create consolidated review packet', async () => {
    const request = {
      branch: "development",
      commit_hash: "abc123def456",
      include_coverage: true,
      include_metadata: true,
      include_smoke_tests: true
    };

    const response = await fetch('/ci/review-packet/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    
    // Schema validation
    expect(data).toHaveProperty('status');
    expect(data).toHaveProperty('packet_id');
    expect(data).toHaveProperty('artifacts');
    expect(data).toHaveProperty('metadata');
    expect(data).toHaveProperty('generated_at');

    // Status validation
    expect(['success', 'failed']).toContain(data.status);
    
    if (data.status === 'success') {
      // Artifacts validation
      expect(data.artifacts).toHaveProperty('index_html');
      expect(data.artifacts).toHaveProperty('review_md');
      expect(data.artifacts).toHaveProperty('coverage_reports');
      expect(data.artifacts).toHaveProperty('smoke_test_artifacts');

      // Metadata validation
      expect(data.metadata).toHaveProperty('environment');
      expect(data.metadata).toHaveProperty('coverage_summary');
      
      expect(data.metadata.environment).toHaveProperty('node_version');
      expect(data.metadata.environment).toHaveProperty('npm_version');
      expect(data.metadata.environment).toHaveProperty('os');
      expect(data.metadata.environment).toHaveProperty('ci_platform');

      // Coverage summary validation
      expect(data.metadata.coverage_summary).toHaveProperty('backend_coverage');
      expect(data.metadata.coverage_summary).toHaveProperty('ui_coverage');
      expect(data.metadata.coverage_summary).toHaveProperty('overall_coverage');
      
      expect(data.metadata.coverage_summary.overall_coverage).toBeGreaterThanOrEqual(0);
      expect(data.metadata.coverage_summary.overall_coverage).toBeLessThanOrEqual(100);
    }
  });
});
```

## State File Migration Contract Tests

### test-state-file-migration.js
```javascript
import { describe, it, expect } from 'vitest';

describe('State File Migration API', () => {
  it('should migrate state files successfully', async () => {
    const request = {
      source_files: [
        "src/expense/expenses.json",
        "src/todo/todo.json",
        "src/stopwatch/stopwatch-state.json"
      ],
      target_directory: "data",
      backup_existing: true,
      validate_json: true
    };

    const response = await fetch('/repository/migrate-state-files', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    
    // Schema validation
    expect(data).toHaveProperty('status');
    expect(data).toHaveProperty('migrated_files');
    expect(data).toHaveProperty('conflicts');
    expect(data).toHaveProperty('errors');
    expect(data).toHaveProperty('migration_summary');

    // Status validation
    expect(['success', 'conflict', 'failed']).toContain(data.status);

    // Migration summary validation
    expect(data.migration_summary).toHaveProperty('total_files');
    expect(data.migration_summary).toHaveProperty('successful_migrations');
    expect(data.migration_summary).toHaveProperty('conflicts');
    expect(data.migration_summary).toHaveProperty('errors');

    // Migrated files validation
    data.migrated_files.forEach(file => {
      expect(file).toHaveProperty('source');
      expect(file).toHaveProperty('target');
      expect(file).toHaveProperty('size_bytes');
      expect(file).toHaveProperty('validation_status');
      
      expect(file.validation_status).toBe('valid');
      expect(file.size_bytes).toBeGreaterThan(0);
    });

    // Conflicts validation
    data.conflicts.forEach(conflict => {
      expect(conflict).toHaveProperty('file');
      expect(conflict).toHaveProperty('conflict_type');
      expect(conflict).toHaveProperty('requires_manual_resolution');
    });
  });

  it('should handle conflicts appropriately', async () => {
    // Test with conflicting files
    const request = {
      source_files: ["src/todo/todo.json"],
      target_directory: "data",
      backup_existing: false,
      validate_json: true
    };

    const response = await fetch('/repository/migrate-state-files', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });

    const data = await response.json();
    
    if (data.status === 'conflict') {
      expect(data.conflicts.length).toBeGreaterThan(0);
      expect(data.conflicts[0].requires_manual_resolution).toBe(true);
    }
  });
});
```

## Smoke Test Execution Contract Tests

### test-smoke-test-execution.js
```javascript
import { describe, it, expect } from 'vitest';

describe('Smoke Test Execution API', () => {
  it('should execute smoke tests for all applications', async () => {
    const request = {
      applications: ["quote", "expense", "temp", "todo", "stopwatch"],
      capture_artifacts: true,
      upload_on_failure: true,
      timeout_ms: 30000
    };

    const response = await fetch('/ci/smoke-tests/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    
    // Schema validation
    expect(data).toHaveProperty('status');
    expect(data).toHaveProperty('test_results');
    expect(data).toHaveProperty('overall_status');
    expect(data).toHaveProperty('total_tests');
    expect(data).toHaveProperty('passed_tests');
    expect(data).toHaveProperty('failed_tests');
    expect(data).toHaveProperty('artifact_upload_status');
    expect(data).toHaveProperty('execution_summary');

    // Status validation
    expect(['success', 'failed']).toContain(data.status);
    expect(data.total_tests).toBe(5);
    expect(data.passed_tests + data.failed_tests).toBe(5);

    // Test results validation
    data.test_results.forEach(result => {
      expect(result).toHaveProperty('application');
      expect(result).toHaveProperty('test_name');
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('execution_time_ms');
      expect(result).toHaveProperty('artifacts');
      
      expect(['quote', 'expense', 'temp', 'todo', 'stopwatch']).toContain(result.application);
      expect(['passed', 'failed', 'skipped']).toContain(result.status);
      expect(result.execution_time_ms).toBeGreaterThan(0);
      
      if (result.status === 'failed') {
        expect(result).toHaveProperty('error_message');
        expect(result.error_message).toBeTruthy();
      }
    });

    // Execution summary validation
    expect(data.execution_summary).toHaveProperty('total_time_ms');
    expect(data.execution_summary).toHaveProperty('average_time_ms');
    expect(data.execution_summary).toHaveProperty('slowest_test');
    expect(data.execution_summary).toHaveProperty('fastest_test');
  });
});
```

## Review Packet Access Contract Tests

### test-review-packet-access.js
```javascript
import { describe, it, expect } from 'vitest';

describe('Review Packet Access API', () => {
  it('should retrieve review packet by ID', async () => {
    const packetId = 'packet_20250127_103000';
    
    const response = await fetch(`/review-packet/${packetId}`);
    
    expect(response.status).toBe(200);
    const data = await response.json();
    
    // Schema validation
    expect(data).toHaveProperty('packet_id');
    expect(data).toHaveProperty('branch');
    expect(data).toHaveProperty('commit_hash');
    expect(data).toHaveProperty('generated_at');
    expect(data).toHaveProperty('access_urls');
    expect(data).toHaveProperty('metadata');
    expect(data).toHaveProperty('status');

    // Status validation
    expect(['available', 'expired', 'not_found']).toContain(data.status);
    
    if (data.status === 'available') {
      // Access URLs validation
      expect(data.access_urls).toHaveProperty('index_html');
      expect(data.access_urls).toHaveProperty('review_md');
      expect(data.access_urls).toHaveProperty('coverage_reports');
      
      expect(Array.isArray(data.access_urls.coverage_reports)).toBe(true);
      
      // Metadata validation
      expect(data.metadata).toHaveProperty('environment');
      expect(data.metadata).toHaveProperty('coverage_summary');
      
      expect(data.metadata.coverage_summary).toHaveProperty('overall_coverage');
      expect(data.metadata.coverage_summary).toHaveProperty('ui_coverage_threshold_met');
    }
  });

  it('should handle non-existent packet ID', async () => {
    const packetId = 'non-existent-packet';
    
    const response = await fetch(`/review-packet/${packetId}`);
    
    expect(response.status).toBe(404);
    const data = await response.json();
    
    expect(data.status).toBe('not_found');
  });
});
```
