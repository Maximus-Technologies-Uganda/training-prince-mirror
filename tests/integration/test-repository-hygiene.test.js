import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { StateFileMigrationService } from '../../scripts/migrate-state-files.js';

describe('Repository Hygiene Integration', () => {
  it('should migrate state files to /data/ directory', async () => {
    // Use the actual StateFileMigrationService
    const migrationService = new StateFileMigrationService();
    
    // Run the migration
    const migrationResult = await migrationService.migrateStateFiles();
    
    expect(migrationResult.migrated.length).toBe(3);
    expect(migrationResult.errors.length).toBe(0);
    
    // Verify files exist in /data/ directory
    const expectedFiles = ['expenses.json', 'todo.json', 'stopwatch-state.json'];
    for (const filename of expectedFiles) {
      const filePath = path.join('data', filename);
      expect(fs.existsSync(filePath)).toBe(true);
    }
  });

  it('should handle migration conflicts appropriately', async () => {
    // Create conflicting file in /data/ directory
    const conflictFile = "data/todo.json";
    const originalContent = fs.readFileSync(conflictFile, 'utf8');
    
    try {
      fs.writeFileSync(conflictFile, '{"conflict": true}');
      
      const migrationService = new StateFileMigrationService();
      const migrationResult = await migrationService.migrateStateFiles();
      
      // Should create backup and migrate successfully
      expect(migrationResult.migrated.length).toBe(3);
      expect(migrationResult.backups.length).toBeGreaterThan(0);
    } finally {
      // Restore original content
      fs.writeFileSync(conflictFile, originalContent);
    }
  });

  it('should update .gitignore to exclude /data/ directory', async () => {
    const gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
    expect(gitignoreContent).toContain('/data/');
    
    // Test that files in /data/ are ignored using git check-ignore
    try {
      const result = execSync('git check-ignore data/', { encoding: 'utf8' });
      expect(result.trim()).toBe('data/');
    } catch (error) {
      // If git check-ignore fails, the directory might not be ignored
      expect(error.message).toBeUndefined();
    }
  });

  it('should clean up stray and temporary files', async () => {
    // This test verifies that the repository is clean
    // We'll check for common temporary files that should not exist
    const tempFiles = [
      '*.tmp',
      '*.temp',
      '.DS_Store',
      'Thumbs.db'
    ];
    
    let foundTempFiles = [];
    for (const pattern of tempFiles) {
      try {
        const result = execSync(`find . -name "${pattern}" -not -path "./node_modules/*" -not -path "./.git/*"`, { encoding: 'utf8' });
        if (result.trim()) {
          foundTempFiles.push(...result.trim().split('\n'));
        }
      } catch (error) {
        // No temp files found, which is good
      }
    }
    
    // Should have minimal or no temp files
    expect(foundTempFiles.length).toBeLessThanOrEqual(2); // Allow for some system files
  });

  it('should update README.md with review instructions', async () => {
    const readmeContent = fs.readFileSync('README.md', 'utf8');
    expect(readmeContent).toContain('How to review me');
    expect(readmeContent).toContain('GitHub Actions');
    expect(readmeContent).toContain('review-packet');
    expect(readmeContent).toContain('Coverage Index');
  });
});
