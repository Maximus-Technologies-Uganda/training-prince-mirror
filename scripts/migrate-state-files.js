/**
 * State File Migration Service
 * Migrates runtime state files to /data/ directory and updates .gitignore
 */

import { StateFile } from '../src/models/state-file.js';
import fs from 'fs/promises';
import path from 'path';

export class StateFileMigrationService {
  constructor(options = {}) {
    this.dataDir = options.dataDir || 'data';
    this.gitignorePath = options.gitignorePath || '.gitignore';
    this.stateFiles = [
      { filename: 'expenses.json', application: 'expense', currentPath: 'src/expense/expenses.json' },
      { filename: 'todo.json', application: 'todo', currentPath: 'src/todo/todo.json' },
      { filename: 'stopwatch-state.json', application: 'stopwatch', currentPath: 'src/stopwatch/stopwatch-state.json' }
    ];
  }

  /**
   * Migrate all state files to /data/ directory
   */
  async migrateStateFiles() {
    console.log('📁 Migrating state files to /data/ directory...');
    
    const results = {
      migrated: [],
      errors: [],
      backups: []
    };

    // Ensure /data/ directory exists
    await this.ensureDataDirectory();

    // Migrate each state file
    for (const fileInfo of this.stateFiles) {
      try {
        const result = await this.migrateStateFile(fileInfo);
        results.migrated.push(result);
        
        if (result.backupCreated) {
          results.backups.push(result.backupPath);
        }
      } catch (error) {
        console.error(`❌ Failed to migrate ${fileInfo.filename}:`, error.message);
        results.errors.push({ file: fileInfo.filename, error: error.message });
      }
    }

    // Update .gitignore
    await this.updateGitignore();

    console.log(`✅ Migrated ${results.migrated.length} state files`);
    console.log(`📦 Created ${results.backups.length} backups`);
    
    if (results.errors.length > 0) {
      console.warn(`⚠️  ${results.errors.length} errors occurred during migration`);
    }

    return results;
  }

  /**
   * Migrate a single state file
   */
  async migrateStateFile(fileInfo) {
    const sourcePath = fileInfo.currentPath;
    const targetPath = path.join(this.dataDir, fileInfo.filename);
    
    console.log(`📄 Migrating ${fileInfo.filename}...`);

    // Check if source file exists
    try {
      await fs.access(sourcePath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.warn(`⚠️  Source file ${sourcePath} does not exist, skipping`);
        return { filename: fileInfo.filename, status: 'skipped', reason: 'source_not_found' };
      }
      throw error;
    }

    // Create backup of existing target file if it exists
    let backupPath = null;
    try {
      await fs.access(targetPath);
      backupPath = `${targetPath}.backup.${Date.now()}`;
      await fs.copyFile(targetPath, backupPath);
      console.log(`💾 Created backup: ${backupPath}`);
    } catch (error) {
      // Target file doesn't exist, no backup needed
    }

    // Copy source to target
    await fs.copyFile(sourcePath, targetPath);

    // Validate the migrated file
    const stateFile = new StateFile({
      filename: fileInfo.filename,
      application: fileInfo.application,
      file_path: targetPath,
      size_bytes: (await fs.stat(targetPath)).size,
      last_modified: new Date().toISOString(),
      backup_path: backupPath,
      validation_status: 'unknown'
    });

    // Validate JSON content
    const validation = await stateFile.validateJSON();
    if (!validation.isValid) {
      throw new Error(`Invalid JSON in migrated file: ${validation.errors.join(', ')}`);
    }

    console.log(`✅ Migrated ${fileInfo.filename} to ${targetPath}`);

    return {
      filename: fileInfo.filename,
      application: fileInfo.application,
      sourcePath,
      targetPath,
      backupPath,
      backupCreated: !!backupPath,
      status: 'migrated',
      sizeBytes: stateFile.size_bytes
    };
  }

  /**
   * Ensure /data/ directory exists
   */
  async ensureDataDirectory() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
      console.log(`📁 Ensured ${this.dataDir} directory exists`);
    } catch (error) {
      throw new Error(`Failed to create ${this.dataDir} directory: ${error.message}`);
    }
  }

  /**
   * Update .gitignore to include /data/ directory
   */
  async updateGitignore() {
    console.log('📝 Updating .gitignore...');

    let gitignoreContent = '';
    try {
      gitignoreContent = await fs.readFile(this.gitignorePath, 'utf8');
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('📄 Creating new .gitignore file');
        gitignoreContent = '';
      } else {
        throw error;
      }
    }

    // Check if /data/ is already ignored
    const lines = gitignoreContent.split('\n');
    const dataIgnoreLine = lines.find(line => line.trim() === '/data/');
    
    if (!dataIgnoreLine) {
      // Add /data/ to .gitignore
      const newContent = gitignoreContent + (gitignoreContent ? '\n' : '') + '# Runtime state files\n/data/\n';
      await fs.writeFile(this.gitignorePath, newContent, 'utf8');
      console.log('✅ Added /data/ to .gitignore');
    } else {
      console.log('ℹ️  /data/ already in .gitignore');
    }
  }

  /**
   * Verify migration results
   */
  async verifyMigration() {
    console.log('🔍 Verifying migration results...');
    
    const verification = {
      dataDirExists: false,
      filesInDataDir: [],
      gitignoreUpdated: false,
      errors: []
    };

    // Check if /data/ directory exists
    try {
      await fs.access(this.dataDir);
      verification.dataDirExists = true;
      
      // List files in /data/ directory
      const files = await fs.readdir(this.dataDir);
      verification.filesInDataDir = files;
    } catch (error) {
      verification.errors.push(`Data directory check failed: ${error.message}`);
    }

    // Check if .gitignore was updated
    try {
      const gitignoreContent = await fs.readFile(this.gitignorePath, 'utf8');
      verification.gitignoreUpdated = gitignoreContent.includes('/data/');
    } catch (error) {
      verification.errors.push(`Gitignore check failed: ${error.message}`);
    }

    console.log(`📊 Verification results:`);
    console.log(`  - Data directory exists: ${verification.dataDirExists}`);
    console.log(`  - Files in data directory: ${verification.filesInDataDir.length}`);
    console.log(`  - Gitignore updated: ${verification.gitignoreUpdated}`);
    
    if (verification.errors.length > 0) {
      console.warn(`⚠️  Verification errors: ${verification.errors.length}`);
    }

    return verification;
  }

  /**
   * Rollback migration (restore from backups)
   */
  async rollbackMigration() {
    console.log('🔄 Rolling back migration...');
    
    const rollbackResults = {
      restored: [],
      errors: []
    };

    for (const fileInfo of this.stateFiles) {
      try {
        const targetPath = path.join(this.dataDir, fileInfo.filename);
        const backupPath = `${targetPath}.backup.${Date.now()}`;
        
        // Find the most recent backup
        const backupFiles = await this.findBackupFiles(targetPath);
        if (backupFiles.length > 0) {
          const latestBackup = backupFiles[backupFiles.length - 1];
          await fs.copyFile(latestBackup, targetPath);
          rollbackResults.restored.push({
            filename: fileInfo.filename,
            restoredFrom: latestBackup
          });
          console.log(`✅ Restored ${fileInfo.filename} from backup`);
        }
      } catch (error) {
        rollbackResults.errors.push({
          filename: fileInfo.filename,
          error: error.message
        });
      }
    }

    return rollbackResults;
  }

  /**
   * Find backup files for a given target path
   */
  async findBackupFiles(targetPath) {
    const dir = path.dirname(targetPath);
    const filename = path.basename(targetPath);
    
    try {
      const files = await fs.readdir(dir);
      return files
        .filter(file => file.startsWith(`${filename}.backup.`))
        .map(file => path.join(dir, file))
        .sort();
    } catch (error) {
      return [];
    }
  }
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const service = new StateFileMigrationService();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'migrate':
      service.migrateStateFiles()
        .then(async (results) => {
          console.log('✅ Migration completed');
          await service.verifyMigration();
          process.exit(0);
        })
        .catch(error => {
          console.error('❌ Migration failed:', error);
          process.exit(1);
        });
      break;
      
    case 'verify':
      service.verifyMigration()
        .then(() => {
          console.log('✅ Verification completed');
          process.exit(0);
        })
        .catch(error => {
          console.error('❌ Verification failed:', error);
          process.exit(1);
        });
      break;
      
    case 'rollback':
      service.rollbackMigration()
        .then(() => {
          console.log('✅ Rollback completed');
          process.exit(0);
        })
        .catch(error => {
          console.error('❌ Rollback failed:', error);
          process.exit(1);
        });
      break;
      
    default:
      console.log('Usage: node migrate-state-files.js [migrate|verify|rollback]');
      process.exit(1);
  }
}
