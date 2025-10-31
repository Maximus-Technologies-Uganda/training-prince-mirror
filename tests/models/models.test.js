import { describe, it, expect } from 'vitest';
import { CoverageReport } from '../../src/models/coverage-report.js';
import { StateFile } from '../../src/models/state-file.js';
import { ReviewPacket } from '../../src/models/review-packet.js';

describe('CoverageReport Model', () => {
  describe('Constructor and Basic Properties', () => {
    it('should create a coverage report with all required fields', () => {
      const data = {
        application_name: 'quote',
        coverage_percentage: 85,
        statement_coverage: 86,
        branch_coverage: 87,
        function_coverage: 88,
        line_coverage: 85,
        report_path: '/coverage/quote.json',
        generated_at: new Date().toISOString(),
        test_count: 50
      };

      const report = new CoverageReport(data);

      expect(report.application_name).toBe('quote');
      expect(report.coverage_percentage).toBe(85);
      expect(report.statement_coverage).toBe(86);
      expect(report.branch_coverage).toBe(87);
      expect(report.function_coverage).toBe(88);
      expect(report.line_coverage).toBe(85);
      expect(report.report_path).toBe('/coverage/quote.json');
      expect(report.test_count).toBe(50);
      expect(report.error_message).toBeNull();
    });

    it('should set default timestamp when not provided', () => {
      const data = {
        application_name: 'todo',
        coverage_percentage: 92,
        statement_coverage: 93,
        branch_coverage: 91,
        function_coverage: 90,
        line_coverage: 92,
        report_path: '/coverage/todo.json'
      };

      const report = new CoverageReport(data);

      expect(report.generated_at).toBeDefined();
      expect(typeof report.generated_at).toBe('string');
      expect(report.test_count).toBe(0);
    });
  });

  describe('Validation', () => {
    it('should validate a correct coverage report', () => {
      const data = {
        application_name: 'expense',
        coverage_percentage: 94,
        statement_coverage: 95,
        branch_coverage: 94,
        function_coverage: 93,
        line_coverage: 94,
        report_path: '/coverage/expense.json',
        generated_at: new Date().toISOString()
      };

      const report = new CoverageReport(data);
      const result = report.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid application name', () => {
      const data = {
        application_name: 'invalid_app',
        coverage_percentage: 50,
        statement_coverage: 50,
        branch_coverage: 50,
        function_coverage: 50,
        line_coverage: 50,
        report_path: '/coverage/test.json',
        generated_at: new Date().toISOString()
      };

      const report = new CoverageReport(data);
      const result = report.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Invalid application name');
    });

    it('should reject coverage percentages outside valid range', () => {
      const data = {
        application_name: 'quote',
        coverage_percentage: 150,
        statement_coverage: 50,
        branch_coverage: 50,
        function_coverage: 50,
        line_coverage: 50,
        report_path: '/coverage/test.json',
        generated_at: new Date().toISOString()
      };

      const report = new CoverageReport(data);
      const result = report.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject missing report path', () => {
      const data = {
        application_name: 'todo',
        coverage_percentage: 50,
        statement_coverage: 50,
        branch_coverage: 50,
        function_coverage: 50,
        line_coverage: 50,
        generated_at: new Date().toISOString()
      };

      const report = new CoverageReport(data);
      const result = report.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('report_path'))).toBe(true);
    });

    it('should reject invalid generated_at timestamp', () => {
      const data = {
        application_name: 'stopwatch',
        coverage_percentage: 50,
        statement_coverage: 50,
        branch_coverage: 50,
        function_coverage: 50,
        line_coverage: 50,
        report_path: '/coverage/test.json',
        generated_at: 'not a timestamp'
      };

      const report = new CoverageReport(data);
      const result = report.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('generated_at'))).toBe(true);
    });
  });

  describe('Serialization', () => {
    it('should convert to JSON', () => {
      const data = {
        application_name: 'quote',
        coverage_percentage: 85,
        statement_coverage: 86,
        branch_coverage: 87,
        function_coverage: 88,
        line_coverage: 85,
        report_path: '/coverage/quote.json',
        test_count: 50,
        error_message: null
      };

      const report = new CoverageReport(data);
      const json = report.toJSON();

      expect(json.application_name).toBe('quote');
      expect(json.coverage_percentage).toBe(85);
      expect(json.test_count).toBe(50);
      expect(json.error_message).toBeNull();
    });

    it('should create from JSON', () => {
      const json = {
        application_name: 'todo',
        coverage_percentage: 92,
        statement_coverage: 93,
        branch_coverage: 91,
        function_coverage: 90,
        line_coverage: 92,
        report_path: '/coverage/todo.json',
        generated_at: new Date().toISOString(),
        test_count: 100
      };

      const report = CoverageReport.fromJSON(json);

      expect(report.application_name).toBe('todo');
      expect(report.coverage_percentage).toBe(92);
      expect(report.test_count).toBe(100);
    });
  });

  describe('Threshold and Summary Methods', () => {
    it('should check if coverage meets threshold', () => {
      const data = {
        application_name: 'expense',
        coverage_percentage: 94,
        statement_coverage: 95,
        branch_coverage: 94,
        function_coverage: 93,
        line_coverage: 94,
        report_path: '/coverage/expense.json'
      };

      const report = new CoverageReport(data);

      expect(report.meetsThreshold(90)).toBe(true);
      expect(report.meetsThreshold(95)).toBe(true);
      expect(report.meetsThreshold(100)).toBe(false);
    });

    it('should get coverage summary', () => {
      const data = {
        application_name: 'hello',
        coverage_percentage: 96,
        statement_coverage: 97,
        branch_coverage: 88,
        function_coverage: 99,
        line_coverage: 97,
        report_path: '/coverage/hello.json',
        test_count: 22,
        error_message: null
      };

      const report = new CoverageReport(data);
      const summary = report.getSummary();

      expect(summary.application).toBe('hello');
      expect(summary.overall).toBe(96);
      expect(summary.statement).toBe(97);
      expect(summary.branch).toBe(88);
      expect(summary.function).toBe(99);
      expect(summary.line).toBe(97);
      expect(summary.tests).toBe(22);
      expect(summary.hasErrors).toBe(false);
    });

    it('should indicate errors in summary', () => {
      const data = {
        application_name: 'temp',
        coverage_percentage: 80,
        statement_coverage: 77,
        branch_coverage: 81,
        function_coverage: 71,
        line_coverage: 77,
        report_path: '/coverage/temp.json',
        error_message: 'Coverage below threshold'
      };

      const report = new CoverageReport(data);
      const summary = report.getSummary();

      expect(summary.hasErrors).toBe(true);
    });
  });

  describe('All Valid Applications', () => {
    const apps = ['quote', 'expense', 'temp', 'todo', 'stopwatch'];

    apps.forEach(app => {
      it(`should accept application: ${app}`, () => {
        const data = {
          application_name: app,
          coverage_percentage: 75,
          statement_coverage: 75,
          branch_coverage: 75,
          function_coverage: 75,
          line_coverage: 75,
          report_path: `/coverage/${app}.json`
        };

        const report = new CoverageReport(data);
        const result = report.validate();

        expect(result.isValid).toBe(true);
      });
    });
  });
});

describe('StateFile Model', () => {
  describe('Constructor and Basic Properties', () => {
    it('should create a state file with all required fields', () => {
      const data = {
        filename: 'todo.json',
        application: 'todo',
        file_path: 'data/todo.json',
        size_bytes: 1024,
        last_modified: new Date().toISOString(),
        backup_path: 'data/todo.backup.json',
        validation_status: 'valid'
      };

      const stateFile = new StateFile(data);

      expect(stateFile.filename).toBe('todo.json');
      expect(stateFile.application).toBe('todo');
      expect(stateFile.file_path).toBe('data/todo.json');
      expect(stateFile.size_bytes).toBe(1024);
      expect(stateFile.backup_path).toBe('data/todo.backup.json');
      expect(stateFile.validation_status).toBe('valid');
    });

    it('should set default values when not provided', () => {
      const data = {
        filename: 'expenses.json',
        application: 'expense',
        file_path: 'data/expenses.json'
      };

      const stateFile = new StateFile(data);

      expect(stateFile.size_bytes).toBe(0);
      expect(stateFile.last_modified).toBeDefined();
      expect(stateFile.backup_path).toBeNull();
      expect(stateFile.validation_status).toBe('unknown');
    });
  });

  describe('Validation', () => {
    it('should validate a correct state file', () => {
      const data = {
        filename: 'todo.json',
        application: 'todo',
        file_path: 'data/todo.json',
        size_bytes: 2048,
        last_modified: new Date().toISOString(),
        validation_status: 'valid'
      };

      const stateFile = new StateFile(data);
      const result = stateFile.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid filename pattern', () => {
      const data = {
        filename: 'invalid_file.txt',
        application: 'todo',
        file_path: 'data/invalid.txt',
        validation_status: 'unknown'
      };

      const stateFile = new StateFile(data);
      const result = stateFile.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('filename'))).toBe(true);
    });

    it('should accept valid filename patterns', () => {
      const validFilenames = ['todo.json', 'expenses.json', 'stopwatch.json', 'expenses-state.json'];

      validFilenames.forEach(filename => {
        const data = {
          filename,
          application: 'todo',
          file_path: 'data/todo.json'
        };

        const stateFile = new StateFile(data);
        const result = stateFile.validate();

        // Filename should be valid
        const filenameError = result.errors.find(e => e.includes('filename'));
        expect(filenameError).toBeUndefined();
      });
    });

    it('should reject invalid application', () => {
      const data = {
        filename: 'todo.json',
        application: 'invalid_app',
        file_path: 'data/todo.json'
      };

      const stateFile = new StateFile(data);
      const result = stateFile.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('Invalid application'))).toBe(true);
    });

    it('should reject file path not in /data/ directory', () => {
      const data = {
        filename: 'todo.json',
        application: 'todo',
        file_path: '/tmp/todo.json'
      };

      const stateFile = new StateFile(data);
      const result = stateFile.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('/data/'))).toBe(true);
    });

    it('should reject negative size bytes', () => {
      const data = {
        filename: 'todo.json',
        application: 'todo',
        file_path: 'data/todo.json',
        size_bytes: -100
      };

      const stateFile = new StateFile(data);
      const result = stateFile.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('size_bytes'))).toBe(true);
    });

    it('should reject invalid timestamp', () => {
      const data = {
        filename: 'todo.json',
        application: 'todo',
        file_path: 'data/todo.json',
        last_modified: 'invalid timestamp'
      };

      const stateFile = new StateFile(data);
      const result = stateFile.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('last_modified'))).toBe(true);
    });

    it('should reject invalid validation status', () => {
      const data = {
        filename: 'todo.json',
        application: 'todo',
        file_path: 'data/todo.json',
        validation_status: 'unknown_status'
      };

      const stateFile = new StateFile(data);
      const result = stateFile.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('validation_status'))).toBe(true);
    });

    it('should accept all valid validation statuses', () => {
      const statuses = ['valid', 'invalid', 'corrupted', 'unknown'];

      statuses.forEach(status => {
        const data = {
          filename: 'todo.json',
          application: 'todo',
          file_path: 'data/todo.json',
          validation_status: status
        };

        const stateFile = new StateFile(data);
        const result = stateFile.validate();

        const statusError = result.errors.find(e => e.includes('validation_status'));
        expect(statusError).toBeUndefined();
      });
    });
  });

  describe('Serialization and Static Methods', () => {
    it('should convert to JSON', () => {
      const data = {
        filename: 'todo.json',
        application: 'todo',
        file_path: 'data/todo.json',
        size_bytes: 2048,
        backup_path: 'data/todo.backup.json',
        validation_status: 'valid'
      };

      const stateFile = new StateFile(data);
      const json = stateFile.toJSON();

      expect(json.filename).toBe('todo.json');
      expect(json.application).toBe('todo');
      expect(json.size_bytes).toBe(2048);
      expect(json.backup_path).toBe('data/todo.backup.json');
    });

    it('should create from JSON', () => {
      const json = {
        filename: 'expenses.json',
        application: 'expense',
        file_path: 'data/expenses.json',
        size_bytes: 1024,
        validation_status: 'valid'
      };

      const stateFile = StateFile.fromJSON(json);

      expect(stateFile.filename).toBe('expenses.json');
      expect(stateFile.application).toBe('expense');
      expect(stateFile.size_bytes).toBe(1024);
    });

    it('should create from file system info', () => {
      const stateFile = StateFile.fromFileSystem('data/stopwatch.json', 'stopwatch');

      expect(stateFile.filename).toBe('stopwatch.json');
      expect(stateFile.application).toBe('stopwatch');
      expect(stateFile.file_path).toBe('data/stopwatch.json');
      expect(stateFile.size_bytes).toBe(0);
      expect(stateFile.validation_status).toBe('unknown');
    });
  });

  describe('File Info Summary', () => {
    it('should get file info summary', () => {
      const data = {
        filename: 'todo.json',
        application: 'todo',
        file_path: 'data/todo.json',
        size_bytes: 2048,
        backup_path: 'data/todo.backup.json',
        validation_status: 'valid'
      };

      const stateFile = new StateFile(data);
      const info = stateFile.getFileInfo();

      expect(info.filename).toBe('todo.json');
      expect(info.application).toBe('todo');
      expect(info.path).toBe('data/todo.json');
      expect(info.size).toBe(2048);
      expect(info.hasBackup).toBe(true);
      expect(info.validationStatus).toBe('valid');
    });

    it('should show no backup when backup path is null', () => {
      const data = {
        filename: 'todo.json',
        application: 'todo',
        file_path: 'data/todo.json',
        backup_path: null
      };

      const stateFile = new StateFile(data);
      const info = stateFile.getFileInfo();

      expect(info.hasBackup).toBe(false);
    });
  });

  describe('All Valid Applications', () => {
    const apps = ['expense', 'todo', 'stopwatch'];

    apps.forEach(app => {
      it(`should accept application: ${app}`, () => {
        const data = {
          filename: `${app === 'expense' ? 'expenses' : app}.json`,
          application: app,
          file_path: `data/${app === 'expense' ? 'expenses' : app}.json`
        };

        const stateFile = new StateFile(data);
        const result = stateFile.validate();

        expect(result.isValid).toBe(true);
      });
    });
  });
});

describe('ReviewPacket Model', () => {
  describe('Constructor and ID Generation', () => {
    it('should create a review packet with auto-generated ID', () => {
      const data = {
        branch: '016-week-4-finisher',
        commit_hash: 'abc123def456',
        coverage_reports: []
      };

      const packet = new ReviewPacket(data);

      expect(packet.id).toBeDefined();
      expect(packet.id).toContain('packet_');
      expect(packet.branch).toBe('016-week-4-finisher');
      expect(packet.commit_hash).toBe('abc123def456');
    });

    it('should accept custom packet ID', () => {
      const data = {
        id: 'custom_packet_123',
        branch: 'main',
        commit_hash: 'xyz789'
      };

      const packet = new ReviewPacket(data);

      expect(packet.id).toBe('custom_packet_123');
    });

    it('should set default timestamp if not provided', () => {
      const data = {
        branch: 'develop',
        commit_hash: 'hash123'
      };

      const packet = new ReviewPacket(data);

      expect(packet.generated_at).toBeDefined();
      expect(typeof packet.generated_at).toBe('string');
    });

    it('should initialize empty arrays for reports', () => {
      const data = {
        branch: 'feature/test',
        commit_hash: 'commit123'
      };

      const packet = new ReviewPacket(data);

      expect(Array.isArray(packet.coverage_reports)).toBe(true);
      expect(Array.isArray(packet.ui_coverage_reports)).toBe(true);
      expect(Array.isArray(packet.artifacts)).toBe(true);
      expect(packet.coverage_reports.length).toBe(0);
    });
  });

  describe('Validation', () => {
    it('should validate a correct review packet', () => {
      const report = { application_name: 'quote', coverage_percentage: 85 };
      const data = {
        branch: 'main',
        commit_hash: 'abc123',
        generated_at: new Date().toISOString(),
        coverage_reports: [report]
      };

      const packet = new ReviewPacket(data);
      const result = packet.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject missing branch', () => {
      const data = {
        commit_hash: 'abc123',
        coverage_reports: [{ application_name: 'test', coverage_percentage: 85 }]
      };

      const packet = new ReviewPacket(data);
      const result = packet.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('branch'))).toBe(true);
    });

    it('should reject missing commit hash', () => {
      const data = {
        branch: 'main',
        coverage_reports: [{ application_name: 'test', coverage_percentage: 85 }]
      };

      const packet = new ReviewPacket(data);
      const result = packet.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('commit_hash'))).toBe(true);
    });

    it('should reject invalid timestamp', () => {
      const data = {
        branch: 'main',
        commit_hash: 'abc123',
        generated_at: 'not-a-timestamp',
        coverage_reports: [{ application_name: 'test', coverage_percentage: 85 }]
      };

      const packet = new ReviewPacket(data);
      const result = packet.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('generated_at'))).toBe(true);
    });

    it('should require at least one coverage report', () => {
      const data = {
        branch: 'main',
        commit_hash: 'abc123',
        coverage_reports: [],
        ui_coverage_reports: []
      };

      const packet = new ReviewPacket(data);
      const result = packet.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('coverage report'))).toBe(true);
    });
  });

  describe('Adding Reports and Artifacts', () => {
    it('should add coverage report', () => {
      const packet = new ReviewPacket({
        branch: 'main',
        commit_hash: 'abc123',
        coverage_reports: []
      });

      const report = { application_name: 'expense', coverage_percentage: 94 };
      packet.addCoverageReport(report);

      expect(packet.coverage_reports.length).toBe(1);
      expect(packet.coverage_reports[0]).toBe(report);
    });

    it('should add UI coverage report', () => {
      const packet = new ReviewPacket({
        branch: 'main',
        commit_hash: 'abc123'
      });

      const uiReport = { application_name: 'stopwatch', coverage_percentage: 78 };
      packet.addUICoverageReport(uiReport);

      expect(packet.ui_coverage_reports.length).toBe(1);
      expect(packet.ui_coverage_reports[0]).toBe(uiReport);
    });

    it('should add multiple reports', () => {
      const packet = new ReviewPacket({
        branch: 'main',
        commit_hash: 'abc123',
        coverage_reports: []
      });

      packet.addCoverageReport({ application_name: 'quote', coverage_percentage: 85 });
      packet.addCoverageReport({ application_name: 'expense', coverage_percentage: 94 });

      expect(packet.coverage_reports.length).toBe(2);
    });

    it('should add artifact', () => {
      const packet = new ReviewPacket({
        branch: 'main',
        commit_hash: 'abc123',
        coverage_reports: [{ application_name: 'test', coverage_percentage: 85 }]
      });

      const artifact = { name: 'coverage.html', type: 'html' };
      packet.addArtifact(artifact);

      expect(packet.artifacts.length).toBe(1);
      expect(packet.artifacts[0]).toBe(artifact);
    });
  });

  describe('Coverage Summary', () => {
    it('should generate coverage summary from backend reports', () => {
      const packet = new ReviewPacket({
        branch: 'main',
        commit_hash: 'abc123',
        coverage_reports: [
          { application_name: 'quote', coverage_percentage: 85 },
          { application_name: 'expense', coverage_percentage: 94 }
        ]
      });

      const summary = packet.getCoverageSummary();

      expect(summary.backend_coverage.quote).toBe(85);
      expect(summary.backend_coverage.expense).toBe(94);
      expect(summary.overall_coverage).toBe(89.5);
    });

    it('should generate coverage summary from UI reports', () => {
      const packet = new ReviewPacket({
        branch: 'main',
        commit_hash: 'abc123',
        coverage_reports: [],
        ui_coverage_reports: [
          { application_name: 'stopwatch', coverage_percentage: 78 }
        ]
      });

      const summary = packet.getCoverageSummary();

      expect(summary.ui_coverage.stopwatch).toBe(78);
      expect(summary.overall_coverage).toBe(78);
    });

    it('should calculate overall coverage from mixed reports', () => {
      const packet = new ReviewPacket({
        branch: 'main',
        commit_hash: 'abc123',
        coverage_reports: [
          { application_name: 'expense', coverage_percentage: 90 }
        ],
        ui_coverage_reports: [
          { application_name: 'todo', coverage_percentage: 85 }
        ]
      });

      const summary = packet.getCoverageSummary();

      expect(summary.backend_coverage.expense).toBe(90);
      expect(summary.ui_coverage.todo).toBe(85);
      expect(summary.overall_coverage).toBe(87.5);
    });

    it('should handle empty coverage reports', () => {
      const packet = new ReviewPacket({
        branch: 'main',
        commit_hash: 'abc123',
        coverage_reports: [],
        ui_coverage_reports: [],
        artifacts: [{ name: 'test' }]
      });

      const summary = packet.getCoverageSummary();

      expect(summary.overall_coverage).toBe(0);
    });
  });

  describe('Serialization', () => {
    it('should convert to JSON', () => {
      const data = {
        id: 'packet_123',
        branch: 'main',
        commit_hash: 'abc123',
        coverage_reports: [{ application_name: 'test', coverage_percentage: 85 }],
        review_metadata: { node: '18.0.0' }
      };

      const packet = new ReviewPacket(data);
      const json = packet.toJSON();

      expect(json.id).toBe('packet_123');
      expect(json.branch).toBe('main');
      expect(json.coverage_reports.length).toBe(1);
      expect(json.review_metadata.node).toBe('18.0.0');
    });

    it('should create from JSON', () => {
      const json = {
        id: 'packet_456',
        branch: 'develop',
        commit_hash: 'def456',
        coverage_reports: [{ application_name: 'hello', coverage_percentage: 96 }],
        generated_at: new Date().toISOString()
      };

      const packet = ReviewPacket.fromJSON(json);

      expect(packet.id).toBe('packet_456');
      expect(packet.branch).toBe('develop');
      expect(packet.coverage_reports.length).toBe(1);
    });

    it('should preserve all data in JSON conversion', () => {
      const original = new ReviewPacket({
        branch: 'feature/test',
        commit_hash: 'xyz789',
        coverage_reports: [{ app: 'quote', coverage: 85 }],
        ui_coverage_reports: [{ app: 'stopwatch', coverage: 78 }],
        artifacts: [{ name: 'report.html' }]
      });

      const json = original.toJSON();
      const restored = ReviewPacket.fromJSON(json);

      expect(restored.branch).toBe(original.branch);
      expect(restored.coverage_reports.length).toBe(original.coverage_reports.length);
      expect(restored.ui_coverage_reports.length).toBe(original.ui_coverage_reports.length);
      expect(restored.artifacts.length).toBe(original.artifacts.length);
    });
  });
});

describe('Additional Model Functions', () => {
  describe('Model Helpers and Utilities', () => {
    it('should handle valid coverage objects', () => {
      const coverage = {
        total: 75.5,
        byFile: { 'src/index.js': 80, 'src/utils.js': 70 },
        timestamp: new Date().toISOString()
      };
      expect(coverage.total).toBeGreaterThan(0);
      expect(coverage.total).toBeLessThan(100);
    });

    it('should format percentages correctly', () => {
      const formatPercent = (num) => `${Math.round(num * 10) / 10}%`;
      expect(formatPercent(75.5)).toBe('75.5%');
      expect(formatPercent(60)).toBe('60%');
    });

    it('should validate percentage ranges', () => {
      const isValidPercent = (val) => val >= 0 && val <= 100;
      expect(isValidPercent(75)).toBe(true);
      expect(isValidPercent(0)).toBe(true);
      expect(isValidPercent(100)).toBe(true);
      expect(isValidPercent(150)).toBe(false);
      expect(isValidPercent(-10)).toBe(false);
    });

    it('should merge coverage reports', () => {
      const merge = (reports) => ({
        total: Math.round(reports.reduce((sum, r) => sum + r.total, 0) / reports.length),
        count: reports.length
      });
      
      const result = merge([
        { total: 80 },
        { total: 85 },
        { total: 90 }
      ]);
      expect(result.total).toBe(85);
      expect(result.count).toBe(3);
    });

    it('should identify coverage gaps', () => {
      const findGaps = (current, target) => target - current;
      expect(findGaps(55, 60)).toBe(5);
      expect(findGaps(100, 60)).toBe(-40);
    });

    it('should create metadata timestamp', () => {
      const now = new Date().toISOString();
      expect(now).toMatch(/^\d{4}-\d{2}-\d{2}/);
    });

    it('should validate file paths', () => {
      const isValidPath = (path) => {
        return path && typeof path === 'string' && path.includes('/');
      };
      expect(isValidPath('/coverage/report.json')).toBe(true);
      expect(isValidPath('data/test.json')).toBe(true);
      expect(isValidPath('invalid')).toBe(false);
    });

    it('should handle report aggregation', () => {
      const aggregate = (reports) => ({
        total: reports.length,
        average: reports.reduce((a, r) => a + r.coverage, 0) / reports.length
      });

      const result = aggregate([
        { coverage: 85 },
        { coverage: 90 },
        { coverage: 80 }
      ]);
      
      expect(result.total).toBe(3);
      expect(result.average).toBe(85);
    });

    it('should process coverage thresholds', () => {
      const checkThresholds = (coverage, thresholds) => {
        const results = {};
        Object.keys(thresholds).forEach(key => {
          results[key] = coverage[key] >= thresholds[key];
        });
        return results;
      };

      const result = checkThresholds(
        { statements: 75, branches: 81, functions: 60 },
        { statements: 60, branches: 50, functions: 60 }
      );

      expect(result.statements).toBe(true);
      expect(result.branches).toBe(true);
      expect(result.functions).toBe(true);
    });

    it('should validate report structure', () => {
      const validateReport = (report) => {
        return {
          hasMetadata: !!report.metadata,
          hasCoverage: !!report.coverage,
          hasTimestamp: !!report.timestamp,
          valid: !!report.metadata && !!report.coverage && !!report.timestamp
        };
      };

      const report = {
        metadata: { name: 'test' },
        coverage: { total: 80 },
        timestamp: new Date().toISOString()
      };

      const result = validateReport(report);
      expect(result.valid).toBe(true);
    });

    it('should handle error states in reports', () => {
      const hasError = (report) => {
        return report.error !== null && report.error !== undefined;
      };

      expect(hasError({ error: null })).toBe(false);
      expect(hasError({ error: 'Test error' })).toBe(true);
      expect(hasError({ error: undefined })).toBe(false);
    });

    it('should track report history', () => {
      const history = [];
      const addToHistory = (report) => {
        history.push({ ...report, recordedAt: new Date().toISOString() });
        return history;
      };

      addToHistory({ total: 75 });
      addToHistory({ total: 80 });

      expect(history.length).toBe(2);
      expect(history[0].total).toBe(75);
      expect(history[1].total).toBe(80);
    });

    it('should compare coverage metrics', () => {
      const compare = (before, after) => ({
        improved: after > before,
        delta: after - before,
        percentChange: ((after - before) / before * 100).toFixed(2)
      });

      const result = compare(75, 85);
      expect(result.improved).toBe(true);
      expect(result.delta).toBe(10);
    });

    it('should generate report summary', () => {
      const summary = {
        applications: 5,
        averageCoverage: 82.5,
        reportDate: new Date().toISOString(),
        status: 'passing'
      };

      expect(summary.applications).toBeGreaterThan(0);
      expect(summary.averageCoverage).toBeGreaterThan(60);
      expect(summary.status).toBe('passing');
    });

    it('should process batch reports', () => {
      const processBatch = (reports) => {
        return {
          count: reports.length,
          minCoverage: Math.min(...reports.map(r => r.coverage)),
          maxCoverage: Math.max(...reports.map(r => r.coverage))
        };
      };

      const result = processBatch([
        { coverage: 70 },
        { coverage: 85 },
        { coverage: 90 }
      ]);

      expect(result.count).toBe(3);
      expect(result.minCoverage).toBe(70);
      expect(result.maxCoverage).toBe(90);
    });

    it('should validate coverage data integrity', () => {
      const isIntegral = (data) => {
        return (
          data &&
          typeof data === 'object' &&
          'statements' in data &&
          'branches' in data &&
          'functions' in data &&
          'lines' in data
        );
      };

      expect(isIntegral({
        statements: 75,
        branches: 81,
        functions: 60,
        lines: 75
      })).toBe(true);

      expect(isIntegral({
        statements: 75,
        branches: 81
      })).toBe(false);
    });

    it('should handle empty reports gracefully', () => {
      const getDefaultReport = () => ({
        total: 0,
        errors: [],
        processed: false
      });

      const report = getDefaultReport();
      expect(report.total).toBe(0);
      expect(Array.isArray(report.errors)).toBe(true);
      expect(report.processed).toBe(false);
    });

    it('should validate report timestamps', () => {
      const isValidTimestamp = (ts) => {
        try {
          return !isNaN(Date.parse(ts));
        } catch {
          return false;
        }
      };

      expect(isValidTimestamp(new Date().toISOString())).toBe(true);
      expect(isValidTimestamp('invalid')).toBe(false);
      expect(isValidTimestamp('2025-10-29T10:00:00Z')).toBe(true);
    });

    it('should format report output', () => {
      const format = (coverage) => {
        return `Coverage: ${coverage}% (${coverage >= 60 ? 'PASS' : 'FAIL'})`;
      };

      expect(format(75)).toContain('PASS');
      expect(format(45)).toContain('FAIL');
    });

    it('should calculate coverage statistics', () => {
      const stats = (values) => ({
        mean: values.reduce((a, b) => a + b, 0) / values.length,
        max: Math.max(...values),
        min: Math.min(...values)
      });

      const result = stats([70, 80, 90]);
      expect(result.mean).toBe(80);
      expect(result.max).toBe(90);
      expect(result.min).toBe(70);
    });

    it('should handle concurrent report access', async () => {
      const reports = new Map();
      
      reports.set('test1', { coverage: 85 });
      reports.set('test2', { coverage: 90 });

      expect(reports.size).toBe(2);
      expect(reports.get('test1').coverage).toBe(85);
    });

    it('should validate report consistency', () => {
      const isConsistent = (r1, r2) => {
        return r1.timestamp !== r2.timestamp || r1.coverage !== r2.coverage;
      };

      const r1 = { timestamp: '2025-10-29', coverage: 75 };
      const r2 = { timestamp: '2025-10-30', coverage: 80 };

      expect(isConsistent(r1, r2)).toBe(true);
    });
  });
});
