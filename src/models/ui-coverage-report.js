/**
 * UI Coverage Report Entity Model
 * Represents test coverage data for individual frontend applications
 */

export class UICoverageReport {
  constructor(data) {
    this.application_name = data.application_name;
    this.coverage_percentage = data.coverage_percentage;
    this.statement_coverage = data.statement_coverage;
    this.branch_coverage = data.branch_coverage;
    this.function_coverage = data.function_coverage;
    this.line_coverage = data.line_coverage;
    this.report_path = data.report_path;
    this.generated_at = data.generated_at || new Date().toISOString();
    this.test_count = data.test_count || 0;
    this.error_message = data.error_message || null;
    this.vitest_config = data.vitest_config || {};
  }

  /**
   * Validate the UI coverage report data
   */
  validate() {
    const errors = [];

    // Validate application name
    const validApps = ['quote', 'expense', 'temp', 'todo', 'stopwatch'];
    if (!validApps.includes(this.application_name)) {
      errors.push(`Invalid application name: ${this.application_name}`);
    }

    // Validate coverage percentages
    const coverageFields = [
      'coverage_percentage',
      'statement_coverage', 
      'branch_coverage',
      'function_coverage',
      'line_coverage'
    ];

    coverageFields.forEach(field => {
      const value = this[field];
      if (value < 0 || value > 100) {
        errors.push(`${field} must be between 0 and 100, got ${value}`);
      }
    });

    // Validate minimum UI coverage threshold (40%)
    if (this.statement_coverage < 40) {
      errors.push(`UI statement coverage must be ≥40%, got ${this.statement_coverage}%`);
    }

    // Validate report path
    if (!this.report_path || typeof this.report_path !== 'string') {
      errors.push('report_path is required and must be a string');
    }

    // Validate generated timestamp
    if (!this.generated_at || isNaN(Date.parse(this.generated_at))) {
      errors.push('generated_at must be a valid ISO timestamp');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Convert to JSON representation
   */
  toJSON() {
    return {
      application_name: this.application_name,
      coverage_percentage: this.coverage_percentage,
      statement_coverage: this.statement_coverage,
      branch_coverage: this.branch_coverage,
      function_coverage: this.function_coverage,
      line_coverage: this.line_coverage,
      report_path: this.report_path,
      generated_at: this.generated_at,
      test_count: this.test_count,
      error_message: this.error_message,
      vitest_config: this.vitest_config
    };
  }

  /**
   * Create from JSON data
   */
  static fromJSON(json) {
    return new UICoverageReport(json);
  }

  /**
   * Check if coverage meets minimum UI threshold (40%)
   */
  meetsThreshold(threshold = 40) {
    return this.statement_coverage >= threshold;
  }

  /**
   * Get UI coverage summary
   */
  getSummary() {
    return {
      application: this.application_name,
      overall: this.coverage_percentage,
      statement: this.statement_coverage,
      branch: this.branch_coverage,
      function: this.function_coverage,
      line: this.line_coverage,
      tests: this.test_count,
      hasErrors: !!this.error_message,
      meetsMinimumThreshold: this.meetsThreshold()
    };
  }

  /**
   * Get Vitest configuration used
   */
  getVitestConfig() {
    return this.vitest_config;
  }
}
