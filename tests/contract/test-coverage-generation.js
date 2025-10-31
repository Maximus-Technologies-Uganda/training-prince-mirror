import { describe, it, expect } from 'vitest';

describe('Coverage Report Generation API', () => {
  it('should generate coverage reports for all applications', async () => {
    const request = {
      applications: ["quote", "expense", "temp", "todo", "stopwatch"],
      report_types: ["backend", "ui"],
      output_directory: "review-artifacts",
      include_metadata: true
    };

    // This will fail initially - we need to implement the API
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
