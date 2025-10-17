import { describe, it, expect } from 'vitest';

describe('Smoke Test Execution API', () => {
  it('should execute smoke tests for all applications', async () => {
    const request = {
      applications: ["quote", "expense", "temp", "todo", "stopwatch"],
      capture_artifacts: true,
      upload_on_failure: true,
      timeout_ms: 30000
    };

    // This will fail initially - we need to implement the API
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
