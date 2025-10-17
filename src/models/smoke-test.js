/**
 * Smoke Test Entity Model
 * Represents foundational E2E test verifying key functionality of each UI application
 */

export class SmokeTest {
  constructor(data) {
    this.application_name = data.application_name;
    this.test_name = data.test_name;
    this.workflow_description = data.workflow_description;
    this.test_file_path = data.test_file_path;
    this.last_run_at = data.last_run_at || null;
    this.status = data.status || 'pending';
    this.execution_time_ms = data.execution_time_ms || 0;
    this.artifacts = data.artifacts || [];
    this.error_message = data.error_message || null;
  }

  /**
   * Validate the smoke test data
   */
  validate() {
    const errors = [];

    // Validate application name
    const validApps = ['quote', 'expense', 'temp', 'todo', 'stopwatch'];
    if (!validApps.includes(this.application_name)) {
      errors.push(`Invalid application name: ${this.application_name}`);
    }

    // Validate test name
    if (!this.test_name || typeof this.test_name !== 'string') {
      errors.push('test_name is required and must be a string');
    }

    // Validate workflow description
    if (!this.workflow_description || typeof this.workflow_description !== 'string') {
      errors.push('workflow_description is required and must be a string');
    }

    // Validate test file path
    if (!this.test_file_path || typeof this.test_file_path !== 'string') {
      errors.push('test_file_path is required and must be a string');
    }

    // Validate status
    const validStatuses = ['pending', 'passed', 'failed', 'skipped'];
    if (!validStatuses.includes(this.status)) {
      errors.push(`status must be one of: ${validStatuses.join(', ')}`);
    }

    // Validate execution time
    if (this.execution_time_ms < 0) {
      errors.push('execution_time_ms must be non-negative');
    }

    // Validate artifacts array
    if (!Array.isArray(this.artifacts)) {
      errors.push('artifacts must be an array');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Mark test as started
   */
  start() {
    this.status = 'running';
    this.last_run_at = new Date().toISOString();
    this.execution_time_ms = 0;
    this.error_message = null;
  }

  /**
   * Mark test as passed
   */
  pass(executionTimeMs) {
    this.status = 'passed';
    this.execution_time_ms = executionTimeMs;
    this.error_message = null;
  }

  /**
   * Mark test as failed
   */
  fail(executionTimeMs, errorMessage, artifacts = []) {
    this.status = 'failed';
    this.execution_time_ms = executionTimeMs;
    this.error_message = errorMessage;
    this.artifacts = artifacts;
  }

  /**
   * Add artifact
   */
  addArtifact(artifact) {
    this.artifacts.push(artifact);
  }

  /**
   * Get test summary
   */
  getSummary() {
    return {
      application: this.application_name,
      testName: this.test_name,
      workflow: this.workflow_description,
      status: this.status,
      executionTime: this.execution_time_ms,
      lastRun: this.last_run_at,
      hasErrors: !!this.error_message,
      artifactCount: this.artifacts.length
    };
  }

  /**
   * Check if test is completed
   */
  isCompleted() {
    return ['passed', 'failed', 'skipped'].includes(this.status);
  }

  /**
   * Check if test passed
   */
  isPassed() {
    return this.status === 'passed';
  }

  /**
   * Check if test failed
   */
  isFailed() {
    return this.status === 'failed';
  }

  /**
   * Convert to JSON representation
   */
  toJSON() {
    return {
      application_name: this.application_name,
      test_name: this.test_name,
      workflow_description: this.workflow_description,
      test_file_path: this.test_file_path,
      last_run_at: this.last_run_at,
      status: this.status,
      execution_time_ms: this.execution_time_ms,
      artifacts: this.artifacts,
      error_message: this.error_message
    };
  }

  /**
   * Create from JSON data
   */
  static fromJSON(json) {
    return new SmokeTest(json);
  }
}
