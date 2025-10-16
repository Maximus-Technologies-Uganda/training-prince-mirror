import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Repository Hygiene Integration', () => {
  it('should migrate state files to /data/ directory', async () => {
    const stateFiles = [
      "src/expense/expenses.json",
      "src/todo/todo.json", 
      "src/stopwatch/stopwatch-state.json"
    ];
    
    // Test migration process
    const migrationResult = await migrateStateFiles({
      source_files: stateFiles,
      target_directory: "data",
      backup_existing: true,
      validate_json: true
    });
    
    expect(migrationResult.status).toBe('success');
    expect(migrationResult.migrated_files.length).toBe(3);
    
    // Verify files exist in /data/ directory
    for (const file of migrationResult.migrated_files) {
      expect(fs.existsSync(file.target)).toBe(true);
      expect(file.validation_status).toBe('valid');
    }
  });

  it('should handle migration conflicts appropriately', async () => {
    // Create conflicting file in /data/ directory
    const conflictFile = "data/todo.json";
    fs.writeFileSync(conflictFile, '{"conflict": true}');
    
    const migrationResult = await migrateStateFiles({
      source_files: ["src/todo/todo.json"],
      target_directory: "data",
      backup_existing: false,
      validate_json: true
    });
    
    expect(migrationResult.status).toBe('conflict');
    expect(migrationResult.conflicts.length).toBeGreaterThan(0);
    expect(migrationResult.conflicts[0].requires_manual_resolution).toBe(true);
    
    // Clean up
    fs.unlinkSync(conflictFile);
  });

  it('should update .gitignore to exclude /data/ directory', async () => {
    const gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
    expect(gitignoreContent).toContain('data/');
    
    // Test that files in /data/ are ignored
    const gitStatus = await runGitCommand('status --ignored');
    expect(gitStatus).toContain('data/');
  });

  it('should clean up stray and temporary files', async () => {
    const cleanupResult = await cleanupRepository({
      remove_temp_files: true,
      remove_stray_files: true,
      dry_run: false
    });
    
    expect(cleanupResult.removed_files.length).toBeGreaterThanOrEqual(0);
    expect(cleanupResult.errors.length).toBe(0);
  });

  it('should update README.md with review instructions', async () => {
    const readmeContent = fs.readFileSync('README.md', 'utf8');
    expect(readmeContent).toContain('How to review me');
    expect(readmeContent).toContain('prerequisites');
    expect(readmeContent).toContain('access methods');
    expect(readmeContent).toContain('artifact interpretation');
  });
});
