import { describe, it, expect } from 'vitest';

describe('State File Migration API', () => {
  it('should migrate state files successfully', async () => {
    const request = {
      source_files: [
        "src/expense/expenses.json",
        "src/todo/todo.json",
        "src/stopwatch/stopwatch-state.json"
      ],
      target_directory: "data",
      backup_existing: true,
      validate_json: true
    };

    // This will fail initially - we need to implement the API
    const response = await fetch('/repository/migrate-state-files', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    
    // Schema validation
    expect(data).toHaveProperty('status');
    expect(data).toHaveProperty('migrated_files');
    expect(data).toHaveProperty('conflicts');
    expect(data).toHaveProperty('errors');
    expect(data).toHaveProperty('migration_summary');

    // Status validation
    expect(['success', 'conflict', 'failed']).toContain(data.status);

    // Migration summary validation
    expect(data.migration_summary).toHaveProperty('total_files');
    expect(data.migration_summary).toHaveProperty('successful_migrations');
    expect(data.migration_summary).toHaveProperty('conflicts');
    expect(data.migration_summary).toHaveProperty('errors');

    // Migrated files validation
    data.migrated_files.forEach(file => {
      expect(file).toHaveProperty('source');
      expect(file).toHaveProperty('target');
      expect(file).toHaveProperty('size_bytes');
      expect(file).toHaveProperty('validation_status');
      
      expect(file.validation_status).toBe('valid');
      expect(file.size_bytes).toBeGreaterThan(0);
    });

    // Conflicts validation
    data.conflicts.forEach(conflict => {
      expect(conflict).toHaveProperty('file');
      expect(conflict).toHaveProperty('conflict_type');
      expect(conflict).toHaveProperty('requires_manual_resolution');
    });
  });

  it('should handle conflicts appropriately', async () => {
    // Test with conflicting files
    const request = {
      source_files: ["src/todo/todo.json"],
      target_directory: "data",
      backup_existing: false,
      validate_json: true
    };

    const response = await fetch('/repository/migrate-state-files', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });

    const data = await response.json();
    
    if (data.status === 'conflict') {
      expect(data.conflicts.length).toBeGreaterThan(0);
      expect(data.conflicts[0].requires_manual_resolution).toBe(true);
    }
  });
});
