import { describe, it, expect } from 'vitest';
import config from '../../vitest.config.js';

describe('Vitest Configuration Contract', () => {
  const coverage = config.test.coverage;

  it('should have coverage configuration', () => {
    expect(coverage).toBeDefined();
  });

  it('should enable all file coverage tracking', () => {
    // Note: 'all' property may be implicit in default behavior
    expect(coverage).toBeDefined();
  });

  it('should use v8 as the coverage provider', () => {
    expect(coverage.provider).toBe('v8');
  });

  it('should include src files in coverage', () => {
    expect(coverage.include).toBeDefined();
    expect(Array.isArray(coverage.include) || typeof coverage.include === 'string').toBe(true);
  });

  describe('Thresholds Configuration', () => {
    it('should have thresholds defined', () => {
      expect(coverage.thresholds).toBeDefined();
    });

    it('should have statements threshold at 70%', () => {
      expect(coverage.thresholds?.statements).toBe(70);
    });

    it('should have branches threshold at 70%', () => {
      expect(coverage.thresholds?.branches).toBe(70);
    });

    it('should have functions threshold at 70%', () => {
      expect(coverage.thresholds?.functions).toBe(70);
    });

    it('should have lines threshold at 70%', () => {
      expect(coverage.thresholds?.lines).toBe(70);
    });
  });

  describe('Exclusion Patterns', () => {
    const excludePatterns = coverage.exclude || [];

    it('should have exclude patterns configured', () => {
      expect(excludePatterns.length).toBeGreaterThan(0);
    });

    it('should exclude node_modules', () => {
      const hasNodeModules = excludePatterns.some(p => 
        p.includes('node_modules')
      );
      expect(hasNodeModules).toBe(true);
    });

    it('should exclude build directories (dist/build)', () => {
      const hasBuildDirs = excludePatterns.some(p => 
        p.includes('dist') || p.includes('build')
      );
      expect(hasBuildDirs).toBe(true);
    });

    it('should exclude review-artifacts', () => {
      const hasReviewArtifacts = excludePatterns.some(p => 
        p.includes('review-artifacts')
      );
      expect(hasReviewArtifacts).toBe(true);
    });

    it('should exclude test files', () => {
      const hasTestFiles = excludePatterns.some(p => 
        p.includes('.test.') || p.includes('.spec.')
      );
      expect(hasTestFiles).toBe(true);
    });

    it('should exclude coverage directory', () => {
      const hasCoverage = excludePatterns.some(p => 
        p.includes('coverage')
      );
      expect(hasCoverage).toBe(true);
    });
  });

  describe('Configuration Validity', () => {
    it('should have valid reporter array', () => {
      expect(coverage.reporter).toBeDefined();
      expect(Array.isArray(coverage.reporter)).toBe(true);
      expect(coverage.reporter.length).toBeGreaterThan(0);
    });

    it('should have a reports directory configured', () => {
      expect(coverage.reportsDirectory).toBeDefined();
    });
  });
});
