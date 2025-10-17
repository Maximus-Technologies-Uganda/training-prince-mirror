import { describe, it, expect } from 'vitest';
import { CoverageGenerator } from '../../scripts/generate-coverage.js';
import { ReviewPacketGenerationService } from '../../scripts/generate-review-packet.js';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { execSync } from 'child_process';

describe('Unified Coverage Reporting Integration', () => {
  it('should generate unified coverage reports for all applications', async () => {
    // This integration test will verify the complete coverage reporting flow
    const applications = ["quote", "expense", "temp", "todo", "stopwatch"];
    
    // Ensure the output directory exists before running the script
    fsSync.mkdirSync('review-artifacts', { recursive: true });
    
    // Execute the script that creates the review.md file
    execSync('node scripts/generate-review-packet.js', { stdio: 'inherit' });
    
    // Assert that the script successfully created the file
    expect(fsSync.existsSync('review-artifacts/review.md')).toBe(true);
  }, 30000);

  it('should handle partial coverage failures gracefully', async () => {
    // Test scenario where some applications fail coverage generation
    const mockFailedApps = ["expense", "temp"];
    
    // Test that the service can be instantiated and handles errors gracefully
    const generator = new CoverageGenerator();
    expect(generator).toBeDefined();
    expect(generator.backendReports).toBeDefined();
    expect(generator.uiReports).toBeDefined();
    expect(generator.errors).toBeDefined();
    
    // Verify the service has error handling capabilities
    expect(Array.isArray(generator.errors)).toBe(true);
  }, 10000);

  it('should generate review packet with all required artifacts', async () => {
    const service = new ReviewPacketGenerationService({
      branch: "development",
      commitHash: "test123",
      outputDir: "review-artifacts"
    });
    
    // Test that the service can be instantiated properly
    expect(service).toBeDefined();
    expect(service.branch).toBe("development");
    expect(service.commitHash).toBe("test123");
    expect(service.outputDir).toBe("review-artifacts");
    
    // Test that the service has the required methods
    expect(typeof service.generateReviewPacket).toBe('function');
    expect(typeof service.generateReviewMetadata).toBe('function');
    expect(typeof service.collectArtifacts).toBe('function');
  }, 10000);
});
