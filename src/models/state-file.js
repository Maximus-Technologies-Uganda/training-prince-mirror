/**
 * State File Entity Model
 * Represents runtime data files that maintain application state
 */

export class StateFile {
  constructor(data) {
    this.filename = data.filename;
    this.application = data.application;
    this.file_path = data.file_path;
    this.size_bytes = data.size_bytes || 0;
    this.last_modified = data.last_modified || new Date().toISOString();
    this.backup_path = data.backup_path || null;
    this.validation_status = data.validation_status || 'unknown';
  }

  /**
   * Validate the state file data
   */
  validate() {
    const errors = [];

    // Validate filename pattern
    const validPattern = /^(expenses|todo|stopwatch)(-state)?\.json$/;
    if (!validPattern.test(this.filename)) {
      errors.push(`filename must match pattern: {app}.json or {app}-state.json, got ${this.filename}`);
    }

    // Validate application
    const validApps = ['expense', 'todo', 'stopwatch'];
    if (!validApps.includes(this.application)) {
      errors.push(`Invalid application: ${this.application}`);
    }

    // Validate file path is within /data/ directory
    if (!this.file_path || !this.file_path.startsWith('data/')) {
      errors.push('file_path must be within /data/ directory');
    }

    // Validate size
    if (this.size_bytes < 0) {
      errors.push('size_bytes must be non-negative');
    }

    // Validate last modified timestamp
    if (!this.last_modified || isNaN(Date.parse(this.last_modified))) {
      errors.push('last_modified must be a valid ISO timestamp');
    }

    // Validate validation status
    const validStatuses = ['valid', 'invalid', 'corrupted', 'unknown'];
    if (!validStatuses.includes(this.validation_status)) {
      errors.push(`validation_status must be one of: ${validStatuses.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if file is valid JSON
   */
  async validateJSON() {
    try {
      if (typeof window !== 'undefined') {
        // Browser environment - would need file reading API
        return { isValid: true, errors: [] };
      } else {
        // Node.js environment
        const fs = await import('fs');
        const content = fs.readFileSync(this.file_path, 'utf8');
        JSON.parse(content);
        this.validation_status = 'valid';
        return { isValid: true, errors: [] };
      }
    } catch (error) {
      this.validation_status = 'invalid';
      return { 
        isValid: false, 
        errors: [`Invalid JSON: ${error.message}`] 
      };
    }
  }

  /**
   * Get file info summary
   */
  getFileInfo() {
    return {
      filename: this.filename,
      application: this.application,
      path: this.file_path,
      size: this.size_bytes,
      lastModified: this.last_modified,
      hasBackup: !!this.backup_path,
      validationStatus: this.validation_status
    };
  }

  /**
   * Convert to JSON representation
   */
  toJSON() {
    return {
      filename: this.filename,
      application: this.application,
      file_path: this.file_path,
      size_bytes: this.size_bytes,
      last_modified: this.last_modified,
      backup_path: this.backup_path,
      validation_status: this.validation_status
    };
  }

  /**
   * Create from JSON data
   */
  static fromJSON(json) {
    return new StateFile(json);
  }

  /**
   * Create from file system info
   */
  static fromFileSystem(filePath, application) {
    const filename = filePath.split('/').pop();
    return new StateFile({
      filename,
      application,
      file_path: filePath,
      size_bytes: 0, // Would be set from fs.stat
      last_modified: new Date().toISOString(),
      validation_status: 'unknown'
    });
  }
}
