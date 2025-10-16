import { describe, it, expect } from 'vitest';

describe('Unified Coverage Reporting Integration', () => {
  it('should generate unified coverage reports for all applications', async () => {
    // This integration test will verify the complete coverage reporting flow
    const applications = ["quote", "expense", "temp", "todo", "stopwatch"];
    
    // Test that all applications have coverage reports
    for (const app of applications) {
      // Check backend coverage
      const backendCoverage = await import(`../coverage/${app}/index.html`);
      expect(backendCoverage).toBeDefined();
      
      // Check UI coverage
      const uiCoverage = await import(`../frontend/coverage/${app}/index.html`);
      expect(uiCoverage).toBeDefined();
    }
    
    // Test unified index generation
    const indexExists = await import('../review-artifacts/index.html');
    expect(indexExists).toBeDefined();
    
    // Test review.md enrichment
    const reviewMd = await import('../review-artifacts/review.md');
    expect(reviewMd).toBeDefined();
  });

  it('should handle partial coverage failures gracefully', async () => {
    // Test scenario where some applications fail coverage generation
    const mockFailedApps = ["expense", "temp"];
    
    // Simulate partial failure scenario
    const result = await generateCoverageReports({
      applications: ["quote", "expense", "temp", "todo", "stopwatch"],
      allowPartial: true
    });
    
    expect(result.status).toBe('partial');
    expect(result.successful_reports).toBeGreaterThan(0);
    expect(result.failed_reports).toBeGreaterThan(0);
    expect(result.error_indicators).toBeDefined();
  });

  it('should generate review packet with all required artifacts', async () => {
    const reviewPacket = await generateReviewPacket({
      branch: "development",
      commit_hash: "test123",
      include_coverage: true,
      include_metadata: true
    });
    
    expect(reviewPacket).toHaveProperty('index_html');
    expect(reviewPacket).toHaveProperty('review_md');
    expect(reviewPacket).toHaveProperty('coverage_reports');
    expect(reviewPacket).toHaveProperty('metadata');
    
    // Verify metadata content
    expect(reviewPacket.metadata).toHaveProperty('environment');
    expect(reviewPacket.metadata).toHaveProperty('commit_log');
    expect(reviewPacket.metadata).toHaveProperty('repository_map');
    expect(reviewPacket.metadata).toHaveProperty('coverage_summary');
  });
});
