/**
 * Review Metadata Entity Model
 * Represents enriched review.md content with environment and repository information
 */

export class ReviewMetadata {
  constructor(data) {
    this.environment_details = data.environment_details || {};
    this.commit_log = data.commit_log || [];
    this.repository_map = data.repository_map || {};
    this.coverage_summary = data.coverage_summary || {};
    this.generated_at = data.generated_at || new Date().toISOString();
  }

  /**
   * Validate the review metadata
   */
  validate() {
    const errors = [];

    // Validate environment details
    if (!this.environment_details || typeof this.environment_details !== 'object') {
      errors.push('environment_details must be an object');
    } else {
      const requiredEnvFields = ['node_version', 'npm_version', 'os', 'ci_platform'];
      requiredEnvFields.forEach(field => {
        if (!this.environment_details[field]) {
          errors.push(`environment_details.${field} is required`);
        }
      });
    }

    // Validate commit log
    if (!Array.isArray(this.commit_log)) {
      errors.push('commit_log must be an array');
    } else if (this.commit_log.length < 1) {
      errors.push('commit_log must contain at least 1 commit');
    } else {
      this.commit_log.forEach((commit, index) => {
        if (!commit.hash || !commit.message || !commit.author || !commit.date) {
          errors.push(`commit_log[${index}] missing required fields`);
        }
      });
    }

    // Validate repository map
    if (!this.repository_map || typeof this.repository_map !== 'object') {
      errors.push('repository_map must be an object');
    } else {
      if (!this.repository_map.two_level_structure) {
        errors.push('repository_map.two_level_structure is required');
      }
      if (typeof this.repository_map.file_count !== 'number') {
        errors.push('repository_map.file_count must be a number');
      }
      if (typeof this.repository_map.total_size_mb !== 'number') {
        errors.push('repository_map.total_size_mb must be a number');
      }
    }

    // Validate coverage summary
    if (!this.coverage_summary || typeof this.coverage_summary !== 'object') {
      errors.push('coverage_summary must be an object');
    } else {
      if (!this.coverage_summary.backend_coverage) {
        errors.push('coverage_summary.backend_coverage is required');
      }
      if (!this.coverage_summary.ui_coverage) {
        errors.push('coverage_summary.ui_coverage is required');
      }
      if (typeof this.coverage_summary.overall_coverage !== 'number') {
        errors.push('coverage_summary.overall_coverage must be a number');
      }
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
   * Add commit to log
   */
  addCommit(commit) {
    this.commit_log.unshift(commit);
    // Keep only last 20 commits
    if (this.commit_log.length > 20) {
      this.commit_log = this.commit_log.slice(0, 20);
    }
  }

  /**
   * Update coverage summary
   */
  updateCoverageSummary(backendCoverage, uiCoverage) {
    this.coverage_summary = {
      backend_coverage: backendCoverage,
      ui_coverage: uiCoverage,
      overall_coverage: this.calculateOverallCoverage(backendCoverage, uiCoverage)
    };
  }

  /**
   * Calculate overall coverage
   */
  calculateOverallCoverage(backendCoverage, uiCoverage) {
    const allCoverages = [
      ...Object.values(backendCoverage),
      ...Object.values(uiCoverage)
    ];
    
    if (allCoverages.length === 0) return 0;
    
    const sum = allCoverages.reduce((total, coverage) => total + coverage, 0);
    return Math.round((sum / allCoverages.length) * 100) / 100;
  }

  /**
   * Get environment summary
   */
  getEnvironmentSummary() {
    return {
      node: this.environment_details.node_version,
      npm: this.environment_details.npm_version,
      os: this.environment_details.os,
      platform: this.environment_details.ci_platform
    };
  }

  /**
   * Get repository summary
   */
  getRepositorySummary() {
    return {
      fileCount: this.repository_map.file_count,
      totalSizeMB: this.repository_map.total_size_mb,
      structure: this.repository_map.two_level_structure
    };
  }

  /**
   * Convert to JSON representation
   */
  toJSON() {
    return {
      environment_details: this.environment_details,
      commit_log: this.commit_log,
      repository_map: this.repository_map,
      coverage_summary: this.coverage_summary,
      generated_at: this.generated_at
    };
  }

  /**
   * Create from JSON data
   */
  static fromJSON(json) {
    return new ReviewMetadata(json);
  }

  /**
   * Create from system information
   */
  static fromSystemInfo(systemInfo) {
    return new ReviewMetadata({
      environment_details: {
        node_version: systemInfo.nodeVersion,
        npm_version: systemInfo.npmVersion,
        os: systemInfo.os,
        ci_platform: systemInfo.ciPlatform
      },
      commit_log: systemInfo.commits || [],
      repository_map: systemInfo.repositoryMap || {},
      coverage_summary: systemInfo.coverageSummary || {}
    });
  }
}
