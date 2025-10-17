import { describe, it, expect } from 'vitest';
import { CoverageReport } from '../../src/models/coverage-report.js';
import { UICoverageReport } from '../../src/models/ui-coverage-report.js';

describe('Coverage Report Models', () => {
  describe('CoverageReport', () => {
    it('should create a valid coverage report', () => {
      const report = new CoverageReport({
        application_name: 'quote',
        coverage_percentage: 75.5,
        lines_covered: 45,
        lines_total: 60,
        branches_covered: 12,
        branches_total: 15,
        functions_covered: 8,
        functions_total: 10,
        generated_at: '2024-01-15T10:30:00.000Z',
        report_file_path: 'coverage/quote/index.html'
      });

      expect(report.application_name).toBe('quote');
      expect(report.coverage_percentage).toBe(75.5);
      expect(report.lines_covered).toBe(45);
      expect(report.lines_total).toBe(60);
    });

    it('should validate required fields', () => {
      const report = new CoverageReport({
        application_name: 'quote',
        coverage_percentage: 75.5,
        lines_covered: 45,
        lines_total: 60,
        branches_covered: 12,
        branches_total: 15,
        functions_covered: 8,
        functions_total: 10,
        generated_at: '2024-01-15T10:30:00.000Z',
        report_file_path: 'coverage/quote/index.html'
      });

      const validation = report.validate();
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should reject invalid application names', () => {
      const report = new CoverageReport({
        application_name: 'invalid-app',
        coverage_percentage: 75.5,
        lines_covered: 45,
        lines_total: 60,
        branches_covered: 12,
        branches_total: 15,
        functions_covered: 8,
        functions_total: 10,
        generated_at: '2024-01-15T10:30:00.000Z',
        report_file_path: 'coverage/quote/index.html'
      });

      const validation = report.validate();
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Invalid application name: invalid-app');
    });

    it('should reject invalid coverage percentages', () => {
      const report = new CoverageReport({
        application_name: 'quote',
        coverage_percentage: 150, // Invalid: > 100
        lines_covered: 45,
        lines_total: 60,
        branches_covered: 12,
        branches_total: 15,
        functions_covered: 8,
        functions_total: 10,
        generated_at: '2024-01-15T10:30:00.000Z',
        report_file_path: 'coverage/quote/index.html'
      });

      const validation = report.validate();
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('coverage_percentage must be between 0 and 100');
    });

    it('should reject negative values', () => {
      const report = new CoverageReport({
        application_name: 'quote',
        coverage_percentage: 75.5,
        lines_covered: -5, // Invalid: negative
        lines_total: 60,
        branches_covered: 12,
        branches_total: 15,
        functions_covered: 8,
        functions_total: 10,
        generated_at: '2024-01-15T10:30:00.000Z',
        report_file_path: 'coverage/quote/index.html'
      });

      const validation = report.validate();
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('lines_covered must be non-negative');
    });

    it('should reject invalid timestamps', () => {
      const report = new CoverageReport({
        application_name: 'quote',
        coverage_percentage: 75.5,
        lines_covered: 45,
        lines_total: 60,
        branches_covered: 12,
        branches_total: 15,
        functions_covered: 8,
        functions_total: 10,
        generated_at: 'invalid-timestamp',
        report_file_path: 'coverage/quote/index.html'
      });

      const validation = report.validate();
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('generated_at must be a valid ISO timestamp');
    });

    it('should convert to JSON correctly', () => {
      const report = new CoverageReport({
        application_name: 'quote',
        coverage_percentage: 75.5,
        lines_covered: 45,
        lines_total: 60,
        branches_covered: 12,
        branches_total: 15,
        functions_covered: 8,
        functions_total: 10,
        generated_at: '2024-01-15T10:30:00.000Z',
        report_file_path: 'coverage/quote/index.html'
      });

      const json = report.toJSON();
      expect(json.application_name).toBe('quote');
      expect(json.coverage_percentage).toBe(75.5);
      expect(json.lines_covered).toBe(45);
    });

    it('should create from JSON correctly', () => {
      const json = {
        application_name: 'quote',
        coverage_percentage: 75.5,
        lines_covered: 45,
        lines_total: 60,
        branches_covered: 12,
        branches_total: 15,
        functions_covered: 8,
        functions_total: 10,
        generated_at: '2024-01-15T10:30:00.000Z',
        report_file_path: 'coverage/quote/index.html'
      };

      const report = CoverageReport.fromJSON(json);
      expect(report).toBeInstanceOf(CoverageReport);
      expect(report.application_name).toBe('quote');
      expect(report.coverage_percentage).toBe(75.5);
    });
  });

  describe('UICoverageReport', () => {
    it('should create a valid UI coverage report', () => {
      const report = new UICoverageReport({
        application_name: 'quote',
        coverage_percentage: 60.0,
        lines_covered: 30,
        lines_total: 50,
        generated_at: '2024-01-15T10:30:00.000Z',
        report_file_path: 'frontend/coverage/lcov-report/index.html'
      });

      expect(report.application_name).toBe('quote');
      expect(report.coverage_percentage).toBe(60.0);
      expect(report.lines_covered).toBe(30);
      expect(report.lines_total).toBe(50);
    });

    it('should validate required fields', () => {
      const report = new UICoverageReport({
        application_name: 'quote',
        coverage_percentage: 60.0,
        lines_covered: 30,
        lines_total: 50,
        generated_at: '2024-01-15T10:30:00.000Z',
        report_file_path: 'frontend/coverage/lcov-report/index.html'
      });

      const validation = report.validate();
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should reject invalid application names', () => {
      const report = new UICoverageReport({
        application_name: 'invalid-app',
        coverage_percentage: 60.0,
        lines_covered: 30,
        lines_total: 50,
        generated_at: '2024-01-15T10:30:00.000Z',
        report_file_path: 'frontend/coverage/lcov-report/index.html'
      });

      const validation = report.validate();
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Invalid application name: invalid-app');
    });

    it('should reject invalid coverage percentages', () => {
      const report = new UICoverageReport({
        application_name: 'quote',
        coverage_percentage: -10, // Invalid: negative
        lines_covered: 30,
        lines_total: 50,
        generated_at: '2024-01-15T10:30:00.000Z',
        report_file_path: 'frontend/coverage/lcov-report/index.html'
      });

      const validation = report.validate();
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('coverage_percentage must be between 0 and 100');
    });

    it('should convert to JSON correctly', () => {
      const report = new UICoverageReport({
        application_name: 'quote',
        coverage_percentage: 60.0,
        lines_covered: 30,
        lines_total: 50,
        generated_at: '2024-01-15T10:30:00.000Z',
        report_file_path: 'frontend/coverage/lcov-report/index.html'
      });

      const json = report.toJSON();
      expect(json.application_name).toBe('quote');
      expect(json.coverage_percentage).toBe(60.0);
      expect(json.lines_covered).toBe(30);
    });

    it('should create from JSON correctly', () => {
      const json = {
        application_name: 'quote',
        coverage_percentage: 60.0,
        lines_covered: 30,
        lines_total: 50,
        generated_at: '2024-01-15T10:30:00.000Z',
        report_file_path: 'frontend/coverage/lcov-report/index.html'
      };

      const report = UICoverageReport.fromJSON(json);
      expect(report).toBeInstanceOf(UICoverageReport);
      expect(report.application_name).toBe('quote');
      expect(report.coverage_percentage).toBe(60.0);
    });
  });
});
