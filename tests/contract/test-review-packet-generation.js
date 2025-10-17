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

    // This will fail initially - we need to implement the API
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
