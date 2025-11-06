/**
 * Review Packet Entity Model
 * Represents consolidated artifact containing all project assessment information
 */

export class ReviewPacket {
  constructor(data) {
    this.id = data.id || this.generateId();
    this.branch = data.branch;
    this.commit_hash = data.commit_hash;
    this.generated_at = data.generated_at || new Date().toISOString();
    this.coverage_reports = data.coverage_reports || [];
    this.ui_coverage_reports = data.ui_coverage_reports || [];
    this.review_metadata = data.review_metadata || null;
    this.index_html = data.index_html || null;
    this.artifacts = data.artifacts || [];
  }

  /**
   * Generate unique packet ID
   */
  generateId() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `packet_${timestamp}`;
  }

  /**
   * Validate the review packet data
   */
  validate() {
    const errors = [];

    // Validate required fields
    if (!this.branch || typeof this.branch !== 'string') {
      errors.push('branch is required and must be a string');
    }

    if (!this.commit_hash || typeof this.commit_hash !== 'string') {
      errors.push('commit_hash is required and must be a string');
    }

    // Validate generated timestamp
    if (!this.generated_at || isNaN(Date.parse(this.generated_at))) {
      errors.push('generated_at must be a valid ISO timestamp');
    }

    // Check if timestamp is recent (<24 hours)
    const generatedTime = new Date(this.generated_at);
    const now = new Date();
    const hoursDiff = (now - generatedTime) / (1000 * 60 * 60);
    if (hoursDiff > 24) {
      errors.push('generated_at must be recent (<24 hours)');
    }

    // Validate coverage reports
    if (!Array.isArray(this.coverage_reports)) {
      errors.push('coverage_reports must be an array');
    }

    if (!Array.isArray(this.ui_coverage_reports)) {
      errors.push('ui_coverage_reports must be an array');
    }

    // Must contain at least one coverage report
    if (this.coverage_reports.length === 0 && this.ui_coverage_reports.length === 0) {
      errors.push('must contain at least one coverage report');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Add coverage report
   */
  addCoverageReport(report) {
    this.coverage_reports.push(report);
  }

  /**
   * Add UI coverage report
   */
  addUICoverageReport(report) {
    this.ui_coverage_reports.push(report);
  }

  /**
   * Add artifact
   */
  addArtifact(artifact) {
    this.artifacts.push(artifact);
  }

  /**
   * Get overall coverage summary
   */
  getCoverageSummary() {
    const backendCoverage = {};
    const uiCoverage = {};

    this.coverage_reports.forEach(report => {
      backendCoverage[report.application_name] = report.coverage_percentage;
    });

    this.ui_coverage_reports.forEach(report => {
      uiCoverage[report.application_name] = report.coverage_percentage;
    });

    const allCoverages = [...Object.values(backendCoverage), ...Object.values(uiCoverage)];
    const overallCoverage = allCoverages.length > 0 
      ? allCoverages.reduce((sum, coverage) => sum + coverage, 0) / allCoverages.length 
      : 0;

    return {
      backend_coverage: backendCoverage,
      ui_coverage: uiCoverage,
      overall_coverage: Math.round(overallCoverage * 100) / 100
    };
  }

  /**
   * Convert to JSON representation
   */
  toJSON() {
    return {
      id: this.id,
      branch: this.branch,
      commit_hash: this.commit_hash,
      generated_at: this.generated_at,
      coverage_reports: this.coverage_reports,
      ui_coverage_reports: this.ui_coverage_reports,
      review_metadata: this.review_metadata,
      index_html: this.index_html,
      artifacts: this.artifacts
    };
  }

  /**
   * Create from JSON data
   */
  static fromJSON(json) {
    return new ReviewPacket(json);
  }
}
