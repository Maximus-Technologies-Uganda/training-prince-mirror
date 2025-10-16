import { describe, it, expect } from 'vitest';
import { ReviewPacket } from '../../src/models/review-packet.js';
import { ReviewMetadata } from '../../src/models/review-metadata.js';
import { SmokeTest } from '../../src/models/smoke-test.js';

describe('Review Packet Models', () => {
  describe('ReviewPacket', () => {
    it('should create a valid review packet', () => {
      const packet = new ReviewPacket({
        branch: 'feature/day-0-ci-maturity',
        commit_hash: 'abc123def456',
        coverage_reports: [],
        ui_coverage_reports: [],
        review_metadata: null,
        index_html: 'review-artifacts/index.html',
        artifacts: []
      });

      expect(packet.branch).toBe('feature/day-0-ci-maturity');
      expect(packet.commit_hash).toBe('abc123def456');
      expect(packet.coverage_reports).toEqual([]);
      expect(packet.ui_coverage_reports).toEqual([]);
      expect(packet.artifacts).toEqual([]);
    });

    it('should generate unique packet ID', () => {
      const packet1 = new ReviewPacket({
        branch: 'feature/day-0-ci-maturity',
        commit_hash: 'abc123def456'
      });

      const packet2 = new ReviewPacket({
        branch: 'feature/day-0-ci-maturity',
        commit_hash: 'abc123def456'
      });

      expect(packet1.id).toBeDefined();
      expect(packet2.id).toBeDefined();
      expect(packet1.id).not.toBe(packet2.id);
    });

    it('should validate required fields', () => {
      const packet = new ReviewPacket({
        branch: 'feature/day-0-ci-maturity',
        commit_hash: 'abc123def456',
        coverage_reports: [],
        ui_coverage_reports: [],
        review_metadata: null,
        index_html: 'review-artifacts/index.html',
        artifacts: []
      });

      const validation = packet.validate();
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should reject missing branch', () => {
      const packet = new ReviewPacket({
        commit_hash: 'abc123def456',
        coverage_reports: [],
        ui_coverage_reports: [],
        review_metadata: null,
        index_html: 'review-artifacts/index.html',
        artifacts: []
      });

      const validation = packet.validate();
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('branch is required and must be a string');
    });

    it('should reject missing commit hash', () => {
      const packet = new ReviewPacket({
        branch: 'feature/day-0-ci-maturity',
        coverage_reports: [],
        ui_coverage_reports: [],
        review_metadata: null,
        index_html: 'review-artifacts/index.html',
        artifacts: []
      });

      const validation = packet.validate();
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('commit_hash is required and must be a string');
    });

    it('should reject old timestamps', () => {
      const oldDate = new Date();
      oldDate.setHours(oldDate.getHours() - 25); // 25 hours ago

      const packet = new ReviewPacket({
        branch: 'feature/day-0-ci-maturity',
        commit_hash: 'abc123def456',
        generated_at: oldDate.toISOString(),
        coverage_reports: [],
        ui_coverage_reports: [],
        review_metadata: null,
        index_html: 'review-artifacts/index.html',
        artifacts: []
      });

      const validation = packet.validate();
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('generated_at must be recent (<24 hours)');
    });

    it('should require at least one coverage report', () => {
      const packet = new ReviewPacket({
        branch: 'feature/day-0-ci-maturity',
        commit_hash: 'abc123def456',
        coverage_reports: [],
        ui_coverage_reports: [],
        review_metadata: null,
        index_html: 'review-artifacts/index.html',
        artifacts: []
      });

      const validation = packet.validate();
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('must contain at least one coverage report');
    });

    it('should add coverage reports', () => {
      const packet = new ReviewPacket({
        branch: 'feature/day-0-ci-maturity',
        commit_hash: 'abc123def456',
        coverage_reports: [],
        ui_coverage_reports: [],
        review_metadata: null,
        index_html: 'review-artifacts/index.html',
        artifacts: []
      });

      const mockReport = {
        application_name: 'quote',
        coverage_percentage: 75,
        lines_covered: 45,
        lines_total: 60
      };

      packet.addCoverageReport(mockReport);
      expect(packet.coverage_reports).toHaveLength(1);
      expect(packet.coverage_reports[0]).toEqual(mockReport);
    });

    it('should add UI coverage reports', () => {
      const packet = new ReviewPacket({
        branch: 'feature/day-0-ci-maturity',
        commit_hash: 'abc123def456',
        coverage_reports: [],
        ui_coverage_reports: [],
        review_metadata: null,
        index_html: 'review-artifacts/index.html',
        artifacts: []
      });

      const mockReport = {
        application_name: 'quote',
        coverage_percentage: 60,
        lines_covered: 30,
        lines_total: 50
      };

      packet.addUICoverageReport(mockReport);
      expect(packet.ui_coverage_reports).toHaveLength(1);
      expect(packet.ui_coverage_reports[0]).toEqual(mockReport);
    });

    it('should add artifacts', () => {
      const packet = new ReviewPacket({
        branch: 'feature/day-0-ci-maturity',
        commit_hash: 'abc123def456',
        coverage_reports: [],
        ui_coverage_reports: [],
        review_metadata: null,
        index_html: 'review-artifacts/index.html',
        artifacts: []
      });

      packet.addArtifact('coverage-quote/index.html');
      expect(packet.artifacts).toHaveLength(1);
      expect(packet.artifacts[0]).toBe('coverage-quote/index.html');
    });

    it('should calculate coverage summary', () => {
      const packet = new ReviewPacket({
        branch: 'feature/day-0-ci-maturity',
        commit_hash: 'abc123def456',
        coverage_reports: [
          { application_name: 'quote', coverage_percentage: 75 },
          { application_name: 'expense', coverage_percentage: 80 }
        ],
        ui_coverage_reports: [
          { application_name: 'quote', coverage_percentage: 60 },
          { application_name: 'expense', coverage_percentage: 65 }
        ],
        review_metadata: null,
        index_html: 'review-artifacts/index.html',
        artifacts: []
      });

      const summary = packet.getCoverageSummary();
      expect(summary.backend_coverage.quote).toBe(75);
      expect(summary.backend_coverage.expense).toBe(80);
      expect(summary.ui_coverage.quote).toBe(60);
      expect(summary.ui_coverage.expense).toBe(65);
      expect(summary.overall_coverage).toBe(70); // (75 + 80 + 60 + 65) / 4
    });

    it('should convert to JSON correctly', () => {
      const packet = new ReviewPacket({
        branch: 'feature/day-0-ci-maturity',
        commit_hash: 'abc123def456',
        coverage_reports: [],
        ui_coverage_reports: [],
        review_metadata: null,
        index_html: 'review-artifacts/index.html',
        artifacts: []
      });

      const json = packet.toJSON();
      expect(json.branch).toBe('feature/day-0-ci-maturity');
      expect(json.commit_hash).toBe('abc123def456');
      expect(json.coverage_reports).toEqual([]);
    });

    it('should create from JSON correctly', () => {
      const json = {
        branch: 'feature/day-0-ci-maturity',
        commit_hash: 'abc123def456',
        coverage_reports: [],
        ui_coverage_reports: [],
        review_metadata: null,
        index_html: 'review-artifacts/index.html',
        artifacts: []
      };

      const packet = ReviewPacket.fromJSON(json);
      expect(packet).toBeInstanceOf(ReviewPacket);
      expect(packet.branch).toBe('feature/day-0-ci-maturity');
      expect(packet.commit_hash).toBe('abc123def456');
    });
  });

  describe('ReviewMetadata', () => {
    it('should create valid review metadata', () => {
      const metadata = new ReviewMetadata({
        environment_details: {
          node_version: 'v18.17.0',
          npm_version: '9.6.7',
          os: 'Linux',
          ci_platform: 'GitHub Actions'
        },
        commit_log: [
          { hash: 'abc123', message: 'Test commit', author: 'Test User', date: '2024-01-15T10:30:00.000Z' }
        ],
        repository_map: {
          two_level_structure: { 'src/': ['expense/', 'quote/'] },
          file_count: 100,
          total_size_mb: 15.2
        },
        coverage_summary: {
          backend_coverage: { quote: 75 },
          ui_coverage: { quote: 60 },
          overall_coverage: 67.5
        }
      });

      expect(metadata.environment_details.node_version).toBe('v18.17.0');
      expect(metadata.commit_log).toHaveLength(1);
      expect(metadata.repository_map.file_count).toBe(100);
    });

    it('should validate required fields', () => {
      const metadata = new ReviewMetadata({
        environment_details: {
          node_version: 'v18.17.0',
          npm_version: '9.6.7',
          os: 'Linux',
          ci_platform: 'GitHub Actions'
        },
        commit_log: [
          { hash: 'abc123', message: 'Test commit', author: 'Test User', date: '2024-01-15T10:30:00.000Z' }
        ],
        repository_map: {
          two_level_structure: { 'src/': ['expense/', 'quote/'] },
          file_count: 100,
          total_size_mb: 15.2
        },
        coverage_summary: {
          backend_coverage: { quote: 75 },
          ui_coverage: { quote: 60 },
          overall_coverage: 67.5
        }
      });

      const validation = metadata.validate();
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should reject missing environment details', () => {
      const metadata = new ReviewMetadata({
        environment_details: {},
        commit_log: [],
        repository_map: {},
        coverage_summary: {}
      });

      const validation = metadata.validate();
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('environment_details.node_version is required');
    });

    it('should reject invalid commit log length', () => {
      const metadata = new ReviewMetadata({
        environment_details: {
          node_version: 'v18.17.0',
          npm_version: '9.6.7',
          os: 'Linux',
          ci_platform: 'GitHub Actions'
        },
        commit_log: [], // Empty - should be 20
        repository_map: {
          two_level_structure: { 'src/': ['expense/', 'quote/'] },
          file_count: 100,
          total_size_mb: 15.2
        },
        coverage_summary: {
          backend_coverage: { quote: 75 },
          ui_coverage: { quote: 60 },
          overall_coverage: 67.5
        }
      });

      const validation = metadata.validate();
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('commit_log must contain exactly 20 commits');
    });

    it('should add commits to log', () => {
      const metadata = new ReviewMetadata({
        environment_details: {
          node_version: 'v18.17.0',
          npm_version: '9.6.7',
          os: 'Linux',
          ci_platform: 'GitHub Actions'
        },
        commit_log: [],
        repository_map: {
          two_level_structure: { 'src/': ['expense/', 'quote/'] },
          file_count: 100,
          total_size_mb: 15.2
        },
        coverage_summary: {
          backend_coverage: { quote: 75 },
          ui_coverage: { quote: 60 },
          overall_coverage: 67.5
        }
      });

      const commit = {
        hash: 'abc123',
        message: 'Test commit',
        author: 'Test User',
        date: '2024-01-15T10:30:00.000Z'
      };

      metadata.addCommit(commit);
      expect(metadata.commit_log).toHaveLength(1);
      expect(metadata.commit_log[0]).toEqual(commit);
    });

    it('should limit commit log to 20 entries', () => {
      const metadata = new ReviewMetadata({
        environment_details: {
          node_version: 'v18.17.0',
          npm_version: '9.6.7',
          os: 'Linux',
          ci_platform: 'GitHub Actions'
        },
        commit_log: [],
        repository_map: {
          two_level_structure: { 'src/': ['expense/', 'quote/'] },
          file_count: 100,
          total_size_mb: 15.2
        },
        coverage_summary: {
          backend_coverage: { quote: 75 },
          ui_coverage: { quote: 60 },
          overall_coverage: 67.5
        }
      });

      // Add 25 commits
      for (let i = 0; i < 25; i++) {
        metadata.addCommit({
          hash: `abc${i}`,
          message: `Test commit ${i}`,
          author: 'Test User',
          date: '2024-01-15T10:30:00.000Z'
        });
      }

      expect(metadata.commit_log).toHaveLength(20);
    });

    it('should calculate overall coverage', () => {
      const metadata = new ReviewMetadata({
        environment_details: {
          node_version: 'v18.17.0',
          npm_version: '9.6.7',
          os: 'Linux',
          ci_platform: 'GitHub Actions'
        },
        commit_log: [],
        repository_map: {
          two_level_structure: { 'src/': ['expense/', 'quote/'] },
          file_count: 100,
          total_size_mb: 15.2
        },
        coverage_summary: {
          backend_coverage: { quote: 75 },
          ui_coverage: { quote: 60 },
          overall_coverage: 0
        }
      });

      const backendCoverage = { quote: 75, expense: 80 };
      const uiCoverage = { quote: 60, expense: 65 };

      metadata.updateCoverageSummary(backendCoverage, uiCoverage);
      
      expect(metadata.coverage_summary.backend_coverage).toEqual(backendCoverage);
      expect(metadata.coverage_summary.ui_coverage).toEqual(uiCoverage);
      expect(metadata.coverage_summary.overall_coverage).toBe(70); // (75 + 80 + 60 + 65) / 4
    });

    it('should convert to JSON correctly', () => {
      const metadata = new ReviewMetadata({
        environment_details: {
          node_version: 'v18.17.0',
          npm_version: '9.6.7',
          os: 'Linux',
          ci_platform: 'GitHub Actions'
        },
        commit_log: [],
        repository_map: {
          two_level_structure: { 'src/': ['expense/', 'quote/'] },
          file_count: 100,
          total_size_mb: 15.2
        },
        coverage_summary: {
          backend_coverage: { quote: 75 },
          ui_coverage: { quote: 60 },
          overall_coverage: 67.5
        }
      });

      const json = metadata.toJSON();
      expect(json.environment_details.node_version).toBe('v18.17.0');
      expect(json.repository_map.file_count).toBe(100);
    });

    it('should create from JSON correctly', () => {
      const json = {
        environment_details: {
          node_version: 'v18.17.0',
          npm_version: '9.6.7',
          os: 'Linux',
          ci_platform: 'GitHub Actions'
        },
        commit_log: [],
        repository_map: {
          two_level_structure: { 'src/': ['expense/', 'quote/'] },
          file_count: 100,
          total_size_mb: 15.2
        },
        coverage_summary: {
          backend_coverage: { quote: 75 },
          ui_coverage: { quote: 60 },
          overall_coverage: 67.5
        }
      };

      const metadata = ReviewMetadata.fromJSON(json);
      expect(metadata).toBeInstanceOf(ReviewMetadata);
      expect(metadata.environment_details.node_version).toBe('v18.17.0');
    });
  });

  describe('SmokeTest', () => {
    it('should create a valid smoke test', () => {
      const smokeTest = new SmokeTest({
        application_name: 'quote',
        test_name: 'quote.smoke.spec.ts',
        workflow_description: 'Test quote filtering functionality',
        test_file_path: 'frontend/e2e/quote.smoke.spec.ts',
        status: 'pending'
      });

      expect(smokeTest.application_name).toBe('quote');
      expect(smokeTest.test_name).toBe('quote.smoke.spec.ts');
      expect(smokeTest.workflow_description).toBe('Test quote filtering functionality');
      expect(smokeTest.status).toBe('pending');
    });

    it('should validate required fields', () => {
      const smokeTest = new SmokeTest({
        application_name: 'quote',
        test_name: 'quote.smoke.spec.ts',
        workflow_description: 'Test quote filtering functionality',
        test_file_path: 'frontend/e2e/quote.smoke.spec.ts',
        status: 'pending'
      });

      const validation = smokeTest.validate();
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should reject invalid application names', () => {
      const smokeTest = new SmokeTest({
        application_name: 'invalid-app',
        test_name: 'quote.smoke.spec.ts',
        workflow_description: 'Test quote filtering functionality',
        test_file_path: 'frontend/e2e/quote.smoke.spec.ts',
        status: 'pending'
      });

      const validation = smokeTest.validate();
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Invalid application name: invalid-app');
    });

    it('should reject invalid status', () => {
      const smokeTest = new SmokeTest({
        application_name: 'quote',
        test_name: 'quote.smoke.spec.ts',
        workflow_description: 'Test quote filtering functionality',
        test_file_path: 'frontend/e2e/quote.smoke.spec.ts',
        status: 'invalid-status'
      });

      const validation = smokeTest.validate();
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('status must be one of: pending, passed, failed, skipped');
    });

    it('should start test execution', () => {
      const smokeTest = new SmokeTest({
        application_name: 'quote',
        test_name: 'quote.smoke.spec.ts',
        workflow_description: 'Test quote filtering functionality',
        test_file_path: 'frontend/e2e/quote.smoke.spec.ts',
        status: 'pending'
      });

      smokeTest.start();
      
      expect(smokeTest.status).toBe('running');
      expect(smokeTest.last_run_at).toBeDefined();
      expect(smokeTest.execution_time_ms).toBe(0);
      expect(smokeTest.error_message).toBeNull();
    });

    it('should mark test as passed', () => {
      const smokeTest = new SmokeTest({
        application_name: 'quote',
        test_name: 'quote.smoke.spec.ts',
        workflow_description: 'Test quote filtering functionality',
        test_file_path: 'frontend/e2e/quote.smoke.spec.ts',
        status: 'running'
      });

      smokeTest.pass(2500);
      
      expect(smokeTest.status).toBe('passed');
      expect(smokeTest.execution_time_ms).toBe(2500);
      expect(smokeTest.error_message).toBeNull();
    });

    it('should mark test as failed', () => {
      const smokeTest = new SmokeTest({
        application_name: 'quote',
        test_name: 'quote.smoke.spec.ts',
        workflow_description: 'Test quote filtering functionality',
        test_file_path: 'frontend/e2e/quote.smoke.spec.ts',
        status: 'running'
      });

      const artifacts = [
        { type: 'screenshot', filename: 'error.png' },
        { type: 'trace', filename: 'trace.zip' }
      ];

      smokeTest.fail(3000, 'Test failed due to timeout', artifacts);
      
      expect(smokeTest.status).toBe('failed');
      expect(smokeTest.execution_time_ms).toBe(3000);
      expect(smokeTest.error_message).toBe('Test failed due to timeout');
      expect(smokeTest.artifacts).toEqual(artifacts);
    });

    it('should add artifacts', () => {
      const smokeTest = new SmokeTest({
        application_name: 'quote',
        test_name: 'quote.smoke.spec.ts',
        workflow_description: 'Test quote filtering functionality',
        test_file_path: 'frontend/e2e/quote.smoke.spec.ts',
        status: 'failed',
        artifacts: []
      });

      const artifact = { type: 'screenshot', filename: 'error.png' };
      smokeTest.addArtifact(artifact);
      
      expect(smokeTest.artifacts).toHaveLength(1);
      expect(smokeTest.artifacts[0]).toEqual(artifact);
    });

    it('should check if test is completed', () => {
      const smokeTest = new SmokeTest({
        application_name: 'quote',
        test_name: 'quote.smoke.spec.ts',
        workflow_description: 'Test quote filtering functionality',
        test_file_path: 'frontend/e2e/quote.smoke.spec.ts',
        status: 'passed'
      });

      expect(smokeTest.isCompleted()).toBe(true);
      expect(smokeTest.isPassed()).toBe(true);
      expect(smokeTest.isFailed()).toBe(false);
    });

    it('should get test summary', () => {
      const smokeTest = new SmokeTest({
        application_name: 'quote',
        test_name: 'quote.smoke.spec.ts',
        workflow_description: 'Test quote filtering functionality',
        test_file_path: 'frontend/e2e/quote.smoke.spec.ts',
        status: 'passed',
        execution_time_ms: 2500,
        last_run_at: '2024-01-15T10:30:00.000Z',
        artifacts: []
      });

      const summary = smokeTest.getSummary();
      expect(summary.application).toBe('quote');
      expect(summary.testName).toBe('quote.smoke.spec.ts');
      expect(summary.status).toBe('passed');
      expect(summary.executionTime).toBe(2500);
      expect(summary.hasErrors).toBe(false);
      expect(summary.artifactCount).toBe(0);
    });

    it('should convert to JSON correctly', () => {
      const smokeTest = new SmokeTest({
        application_name: 'quote',
        test_name: 'quote.smoke.spec.ts',
        workflow_description: 'Test quote filtering functionality',
        test_file_path: 'frontend/e2e/quote.smoke.spec.ts',
        status: 'passed',
        execution_time_ms: 2500,
        last_run_at: '2024-01-15T10:30:00.000Z',
        artifacts: []
      });

      const json = smokeTest.toJSON();
      expect(json.application_name).toBe('quote');
      expect(json.test_name).toBe('quote.smoke.spec.ts');
      expect(json.status).toBe('passed');
    });

    it('should create from JSON correctly', () => {
      const json = {
        application_name: 'quote',
        test_name: 'quote.smoke.spec.ts',
        workflow_description: 'Test quote filtering functionality',
        test_file_path: 'frontend/e2e/quote.smoke.spec.ts',
        status: 'passed',
        execution_time_ms: 2500,
        last_run_at: '2024-01-15T10:30:00.000Z',
        artifacts: []
      };

      const smokeTest = SmokeTest.fromJSON(json);
      expect(smokeTest).toBeInstanceOf(SmokeTest);
      expect(smokeTest.application_name).toBe('quote');
      expect(smokeTest.status).toBe('passed');
    });
  });
});
