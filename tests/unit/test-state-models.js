import { describe, it, expect } from 'vitest';
import { StateFile } from '../../src/models/state-file.js';

describe('State File Models', () => {
  describe('StateFile', () => {
    it('should create a valid state file', () => {
      const stateFile = new StateFile({
        filename: 'expenses.json',
        application: 'expense',
        file_path: 'data/expenses.json',
        size_bytes: 1024,
        last_modified: '2024-01-15T10:30:00.000Z',
        backup_path: 'data/expenses.json.backup.1234567890',
        validation_status: 'valid'
      });

      expect(stateFile.filename).toBe('expenses.json');
      expect(stateFile.application).toBe('expense');
      expect(stateFile.file_path).toBe('data/expenses.json');
      expect(stateFile.size_bytes).toBe(1024);
      expect(stateFile.validation_status).toBe('valid');
    });

    it('should validate required fields', () => {
      const stateFile = new StateFile({
        filename: 'expenses.json',
        application: 'expense',
        file_path: 'data/expenses.json',
        size_bytes: 1024,
        last_modified: '2024-01-15T10:30:00.000Z',
        validation_status: 'valid'
      });

      const validation = stateFile.validate();
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should reject invalid filename patterns', () => {
      const stateFile = new StateFile({
        filename: 'invalid-file.txt',
        application: 'expense',
        file_path: 'data/invalid-file.txt',
        size_bytes: 1024,
        last_modified: '2024-01-15T10:30:00.000Z',
        validation_status: 'valid'
      });

      const validation = stateFile.validate();
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('filename must match pattern: {app}.json or {app}-state.json, got invalid-file.txt');
    });

    it('should reject invalid applications', () => {
      const stateFile = new StateFile({
        filename: 'expenses.json',
        application: 'invalid-app',
        file_path: 'data/expenses.json',
        size_bytes: 1024,
        last_modified: '2024-01-15T10:30:00.000Z',
        validation_status: 'valid'
      });

      const validation = stateFile.validate();
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Invalid application: invalid-app');
    });

    it('should reject file paths outside /data/ directory', () => {
      const stateFile = new StateFile({
        filename: 'expenses.json',
        application: 'expense',
        file_path: 'src/expense/expenses.json',
        size_bytes: 1024,
        last_modified: '2024-01-15T10:30:00.000Z',
        validation_status: 'valid'
      });

      const validation = stateFile.validate();
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('file_path must be within /data/ directory');
    });

    it('should reject negative file sizes', () => {
      const stateFile = new StateFile({
        filename: 'expenses.json',
        application: 'expense',
        file_path: 'data/expenses.json',
        size_bytes: -100,
        last_modified: '2024-01-15T10:30:00.000Z',
        validation_status: 'valid'
      });

      const validation = stateFile.validate();
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('size_bytes must be non-negative');
    });

    it('should reject invalid validation status', () => {
      const stateFile = new StateFile({
        filename: 'expenses.json',
        application: 'expense',
        file_path: 'data/expenses.json',
        size_bytes: 1024,
        last_modified: '2024-01-15T10:30:00.000Z',
        validation_status: 'invalid-status'
      });

      const validation = stateFile.validate();
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('validation_status must be one of: valid, invalid, corrupted, unknown');
    });

    it('should accept valid filename patterns', () => {
      const validFilenames = [
        'expenses.json',
        'todo.json',
        'stopwatch-state.json'
      ];

      validFilenames.forEach(filename => {
        const stateFile = new StateFile({
          filename,
          application: 'expense',
          file_path: `data/${filename}`,
          size_bytes: 1024,
          last_modified: '2024-01-15T10:30:00.000Z',
          validation_status: 'valid'
        });

        const validation = stateFile.validate();
        expect(validation.isValid).toBe(true);
      });
    });

    it('should accept valid applications', () => {
      const validApplications = ['expense', 'todo', 'stopwatch'];

      validApplications.forEach(application => {
        const stateFile = new StateFile({
          filename: `${application}.json`,
          application,
          file_path: `data/${application}.json`,
          size_bytes: 1024,
          last_modified: '2024-01-15T10:30:00.000Z',
          validation_status: 'valid'
        });

        const validation = stateFile.validate();
        expect(validation.isValid).toBe(true);
      });
    });

    it('should convert to JSON correctly', () => {
      const stateFile = new StateFile({
        filename: 'expenses.json',
        application: 'expense',
        file_path: 'data/expenses.json',
        size_bytes: 1024,
        last_modified: '2024-01-15T10:30:00.000Z',
        backup_path: 'data/expenses.json.backup.1234567890',
        validation_status: 'valid'
      });

      const json = stateFile.toJSON();
      expect(json.filename).toBe('expenses.json');
      expect(json.application).toBe('expense');
      expect(json.file_path).toBe('data/expenses.json');
      expect(json.size_bytes).toBe(1024);
      expect(json.validation_status).toBe('valid');
    });

    it('should create from JSON correctly', () => {
      const json = {
        filename: 'expenses.json',
        application: 'expense',
        file_path: 'data/expenses.json',
        size_bytes: 1024,
        last_modified: '2024-01-15T10:30:00.000Z',
        backup_path: 'data/expenses.json.backup.1234567890',
        validation_status: 'valid'
      };

      const stateFile = StateFile.fromJSON(json);
      expect(stateFile).toBeInstanceOf(StateFile);
      expect(stateFile.filename).toBe('expenses.json');
      expect(stateFile.application).toBe('expense');
    });

    it('should create from file system info', () => {
      const stateFile = StateFile.fromFileSystem('data/expenses.json', 'expense');
      
      expect(stateFile.filename).toBe('expenses.json');
      expect(stateFile.application).toBe('expense');
      expect(stateFile.file_path).toBe('data/expenses.json');
      expect(stateFile.validation_status).toBe('unknown');
    });

    it('should get file info summary', () => {
      const stateFile = new StateFile({
        filename: 'expenses.json',
        application: 'expense',
        file_path: 'data/expenses.json',
        size_bytes: 1024,
        last_modified: '2024-01-15T10:30:00.000Z',
        backup_path: 'data/expenses.json.backup.1234567890',
        validation_status: 'valid'
      });

      const info = stateFile.getFileInfo();
      expect(info.filename).toBe('expenses.json');
      expect(info.application).toBe('expense');
      expect(info.path).toBe('data/expenses.json');
      expect(info.size).toBe(1024);
      expect(info.hasBackup).toBe(true);
      expect(info.validationStatus).toBe('valid');
    });
  });
});
