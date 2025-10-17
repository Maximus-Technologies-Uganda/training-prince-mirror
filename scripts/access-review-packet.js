/**
 * Review Packet Access Service
 * Provides access to generated review packets and their artifacts
 */

import { ReviewPacket } from '../src/models/review-packet.js';
import fs from 'fs/promises';
import path from 'path';

export class ReviewPacketAccessService {
  constructor(options = {}) {
    this.reviewArtifactsDir = options.reviewArtifactsDir || 'review-artifacts';
    this.packetMetadataFile = options.packetMetadataFile || 'packet-metadata.json';
  }

  /**
   * Access the latest review packet
   */
  async accessLatestReviewPacket() {
    console.log('📦 Accessing latest review packet...');
    
    try {
      const packetMetadata = await this.loadPacketMetadata();
      const packet = ReviewPacket.fromJSON(packetMetadata);
      
      // Validate packet
      const validation = packet.validate();
      if (!validation.isValid) {
        throw new Error(`Invalid review packet: ${validation.errors.join(', ')}`);
      }

      console.log(`✅ Loaded review packet: ${packet.id}`);
      return packet;
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error('No review packet found. Run generate-review-packet.js first.');
      }
      throw error;
    }
  }

  /**
   * Load packet metadata from file
   */
  async loadPacketMetadata() {
    const metadataPath = path.join(this.reviewArtifactsDir, this.packetMetadataFile);
    const content = await fs.readFile(metadataPath, 'utf8');
    return JSON.parse(content);
  }

  /**
   * Get review packet summary
   */
  async getReviewPacketSummary() {
    const packet = await this.accessLatestReviewPacket();
    const coverageSummary = packet.getCoverageSummary();
    
    return {
      packetId: packet.id,
      branch: packet.branch,
      commitHash: packet.commit_hash,
      generatedAt: packet.generated_at,
      coverageSummary: coverageSummary,
      artifactCount: packet.artifacts.length,
      backendReports: packet.coverage_reports.length,
      uiReports: packet.ui_coverage_reports.length
    };
  }

  /**
   * List all available artifacts
   */
  async listArtifacts() {
    const packet = await this.accessLatestReviewPacket();
    
    const artifacts = {
      coverageIndex: 'index.html',
      reviewMarkdown: 'review.md',
      packetMetadata: this.packetMetadataFile,
      backendCoverage: packet.coverage_reports.map(report => 
        `coverage-${report.application_name}/index.html`
      ),
      uiCoverage: packet.ui_coverage_reports.map(report => 
        `ui-coverage-${report.application_name}/index.html`
      )
    };

    return artifacts;
  }

  /**
   * Get artifact content
   */
  async getArtifactContent(artifactPath) {
    const fullPath = path.join(this.reviewArtifactsDir, artifactPath);
    
    try {
      const content = await fs.readFile(fullPath, 'utf8');
      return {
        path: artifactPath,
        content: content,
        size: content.length,
        exists: true
      };
    } catch (error) {
      if (error.code === 'ENOENT') {
        return {
          path: artifactPath,
          content: null,
          size: 0,
          exists: false,
          error: 'Artifact not found'
        };
      }
      throw error;
    }
  }

  /**
   * Get coverage report for specific application
   */
  async getCoverageReport(appName, type = 'backend') {
    const packet = await this.accessLatestReviewPacket();
    
    if (type === 'backend') {
      const report = packet.coverage_reports.find(r => r.application_name === appName);
      if (!report) {
        throw new Error(`Backend coverage report not found for ${appName}`);
      }
      return report;
    } else if (type === 'ui') {
      const report = packet.ui_coverage_reports.find(r => r.application_name === appName);
      if (!report) {
        throw new Error(`UI coverage report not found for ${appName}`);
      }
      return report;
    } else {
      throw new Error(`Invalid coverage type: ${type}. Must be 'backend' or 'ui'`);
    }
  }

  /**
   * Get all coverage reports
   */
  async getAllCoverageReports() {
    const packet = await this.accessLatestReviewPacket();
    
    return {
      backend: packet.coverage_reports,
      ui: packet.ui_coverage_reports,
      summary: packet.getCoverageSummary()
    };
  }

  /**
   * Get review metadata
   */
  async getReviewMetadata() {
    const packet = await this.accessLatestReviewPacket();
    
    if (!packet.review_metadata) {
      throw new Error('Review metadata not available');
    }
    
    return packet.review_metadata;
  }

  /**
   * Export review packet as archive
   */
  async exportReviewPacket(outputPath) {
    console.log('📦 Exporting review packet...');
    
    const packet = await this.accessLatestReviewPacket();
    
    // This would typically use a library like archiver to create a zip file
    // For now, we'll just list the files that would be included
    const filesToExport = [
      'index.html',
      'review.md',
      this.packetMetadataFile,
      ...packet.artifacts
    ];

    console.log(`📁 Files to export: ${filesToExport.length}`);
    console.log(`📄 Export path: ${outputPath}`);
    
    // In a real implementation, you would:
    // 1. Create a zip archive
    // 2. Add all files from review-artifacts directory
    // 3. Save to outputPath
    
    return {
      packetId: packet.id,
      filesCount: filesToExport.length,
      outputPath: outputPath,
      files: filesToExport
    };
  }

  /**
   * Validate review packet integrity
   */
  async validatePacketIntegrity() {
    console.log('🔍 Validating review packet integrity...');
    
    const validation = {
      packetValid: false,
      artifactsExist: [],
      artifactsMissing: [],
      errors: []
    };

    try {
      const packet = await this.accessLatestReviewPacket();
      
      // Validate packet structure
      const packetValidation = packet.validate();
      validation.packetValid = packetValidation.isValid;
      if (!packetValidation.isValid) {
        validation.errors.push(...packetValidation.errors);
      }

      // Check if artifacts exist
      for (const artifact of packet.artifacts) {
        const artifactPath = path.join(this.reviewArtifactsDir, artifact);
        try {
          await fs.access(artifactPath);
          validation.artifactsExist.push(artifact);
        } catch (error) {
          validation.artifactsMissing.push(artifact);
        }
      }

      console.log(`📊 Integrity validation:`);
      console.log(`  - Packet valid: ${validation.packetValid}`);
      console.log(`  - Artifacts exist: ${validation.artifactsExist.length}`);
      console.log(`  - Artifacts missing: ${validation.artifactsMissing.length}`);
      
      if (validation.errors.length > 0) {
        console.warn(`⚠️  Validation errors: ${validation.errors.length}`);
      }

    } catch (error) {
      validation.errors.push(`Failed to validate packet: ${error.message}`);
    }

    return validation;
  }

  /**
   * Get packet statistics
   */
  async getPacketStatistics() {
    const packet = await this.accessLatestReviewPacket();
    const coverageSummary = packet.getCoverageSummary();
    
    // Calculate artifact sizes
    let totalSize = 0;
    const artifactSizes = {};
    
    for (const artifact of packet.artifacts) {
      try {
        const artifactPath = path.join(this.reviewArtifactsDir, artifact);
        const stats = await fs.stat(artifactPath);
        artifactSizes[artifact] = stats.size;
        totalSize += stats.size;
      } catch (error) {
        artifactSizes[artifact] = 0;
      }
    }

    return {
      packetId: packet.id,
      generatedAt: packet.generated_at,
      branch: packet.branch,
      commitHash: packet.commit_hash,
      totalArtifacts: packet.artifacts.length,
      totalSizeBytes: totalSize,
      totalSizeMB: Math.round(totalSize / (1024 * 1024) * 100) / 100,
      coverageSummary: coverageSummary,
      artifactSizes: artifactSizes
    };
  }

  /**
   * Search within review packet
   */
  async searchInPacket(searchTerm) {
    console.log(`🔍 Searching for "${searchTerm}" in review packet...`);
    
    const results = {
      foundIn: [],
      matches: [],
      totalMatches: 0
    };

    try {
      const packet = await this.accessLatestReviewPacket();
      
      // Search in review.md
      const reviewContent = await this.getArtifactContent('review.md');
      if (reviewContent.exists) {
        const matches = reviewContent.content.match(new RegExp(searchTerm, 'gi'));
        if (matches) {
          results.foundIn.push('review.md');
          results.matches.push({
            file: 'review.md',
            matches: matches.length,
            content: reviewContent.content
          });
          results.totalMatches += matches.length;
        }
      }

      // Search in coverage reports
      for (const report of packet.coverage_reports) {
        if (report.application_name.toLowerCase().includes(searchTerm.toLowerCase())) {
          results.foundIn.push(`coverage-${report.application_name}`);
          results.matches.push({
            file: `coverage-${report.application_name}`,
            matches: 1,
            content: `Application: ${report.application_name}, Coverage: ${report.coverage_percentage}%`
          });
          results.totalMatches += 1;
        }
      }

      console.log(`📊 Search results:`);
      console.log(`  - Found in: ${results.foundIn.length} files`);
      console.log(`  - Total matches: ${results.totalMatches}`);

    } catch (error) {
      results.error = error.message;
    }

    return results;
  }
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const service = new ReviewPacketAccessService();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'summary':
      service.getReviewPacketSummary()
        .then(summary => {
          console.log('📊 Review Packet Summary:');
          console.log(JSON.stringify(summary, null, 2));
          process.exit(0);
        })
        .catch(error => {
          console.error('❌ Failed to get summary:', error.message);
          process.exit(1);
        });
      break;
      
    case 'list':
      service.listArtifacts()
        .then(artifacts => {
          console.log('📁 Available Artifacts:');
          console.log(JSON.stringify(artifacts, null, 2));
          process.exit(0);
        })
        .catch(error => {
          console.error('❌ Failed to list artifacts:', error.message);
          process.exit(1);
        });
      break;
      
    case 'validate':
      service.validatePacketIntegrity()
        .then(validation => {
          console.log('🔍 Validation Results:');
          console.log(JSON.stringify(validation, null, 2));
          process.exit(0);
        })
        .catch(error => {
          console.error('❌ Failed to validate:', error.message);
          process.exit(1);
        });
      break;
      
    case 'stats':
      service.getPacketStatistics()
        .then(stats => {
          console.log('📊 Packet Statistics:');
          console.log(JSON.stringify(stats, null, 2));
          process.exit(0);
        })
        .catch(error => {
          console.error('❌ Failed to get stats:', error.message);
          process.exit(1);
        });
      break;
      
    default:
      console.log('Usage: node access-review-packet.js [summary|list|validate|stats]');
      process.exit(1);
  }
}
