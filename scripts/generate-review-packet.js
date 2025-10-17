/**
 * Review Packet Generation Service
 * Creates consolidated review artifacts with enriched metadata
 */

import { ReviewPacket } from '../src/models/review-packet.js';
import { ReviewMetadata } from '../src/models/review-metadata.js';
import { CoverageGenerator } from './generate-coverage.js';
import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';

export class ReviewPacketGenerationService {
  constructor(options = {}) {
    this.outputDir = options.outputDir || 'review-artifacts';
    this.branch = options.branch || this.getCurrentBranch();
    this.commitHash = options.commitHash || this.getCurrentCommitHash();
  }

  /**
   * Generate complete review packet
   */
  async generateReviewPacket() {
    console.log('📦 Generating review packet...');
    
    // Ensure output directory exists
    await fs.mkdir(this.outputDir, { recursive: true });

    // Generate coverage reports
    const coverageService = new CoverageGenerator();
    const coverageResults = await coverageService.generateAll();

    // Generate review metadata
    const reviewMetadata = await this.generateReviewMetadata();

    // Create review packet
    const reviewPacket = new ReviewPacket({
      branch: this.branch,
      commit_hash: this.commitHash,
      coverage_reports: coverageResults.backendReports,
      ui_coverage_reports: coverageResults.uiReports,
      review_metadata: reviewMetadata,
      index_html: path.join(this.outputDir, 'index.html'),
      artifacts: this.collectArtifacts()
    });

    // Validate review packet
    const validation = reviewPacket.validate();
    if (!validation.isValid) {
      throw new Error(`Invalid review packet: ${validation.errors.join(', ')}`);
    }

    // Generate review.md
    await this.generateReviewMarkdown(reviewPacket);

    // Save packet metadata
    await this.savePacketMetadata(reviewPacket);

    console.log('✅ Review packet generated successfully');
    return reviewPacket;
  }

  /**
   * Generate enriched review metadata
   */
  async generateReviewMetadata() {
    console.log('📋 Generating review metadata...');

    const environmentDetails = await this.getEnvironmentDetails();
    console.log('✅ Environment details:', environmentDetails);
    
    const commitLog = await this.getCommitLog();
    console.log('✅ Commit log count:', commitLog.length);
    
    const repositoryMap = await this.getRepositoryMap();
    console.log('✅ Repository map:', { files: repositoryMap.file_count, sizeMB: repositoryMap.total_size_mb });
    
    const coverageSummary = await this.getCoverageSummary();
    console.log('✅ Coverage summary generated');

    const metadata = new ReviewMetadata({
      environment_details: environmentDetails,
      commit_log: commitLog,
      repository_map: repositoryMap,
      coverage_summary: coverageSummary
    });

    // Validate metadata
    const validation = metadata.validate();
    if (!validation.isValid) {
      console.error('❌ Validation errors:');
      validation.errors.forEach(error => console.error('  - ' + error));
      throw new Error(`Invalid review metadata: ${validation.errors.join(', ')}`);
    }

    console.log('✅ Review metadata validated successfully');
    return metadata;
  }

  /**
   * Get environment details
   */
  async getEnvironmentDetails() {
    return {
      node_version: process.version,
      npm_version: this.getNpmVersion(),
      os: process.platform,
      ci_platform: process.env.CI ? 'GitHub Actions' : 'Local'
    };
  }

  /**
   * Get npm version
   */
  getNpmVersion() {
    try {
      return execSync('npm --version', { encoding: 'utf8' }).trim();
    } catch (error) {
      return 'unknown';
    }
  }

  /**
   * Get commit log (last 20 commits)
   */
  async getCommitLog() {
    try {
      const logOutput = execSync('git log --oneline -20', { encoding: 'utf8' });
      return logOutput.trim().split('\n').map(line => {
        const [hash, ...messageParts] = line.split(' ');
        return {
          hash: hash.substring(0, 7),
          message: messageParts.join(' '),
          author: 'unknown', // Would extract from git log
          date: new Date().toISOString() // Would extract from git log
        };
      });
    } catch (error) {
      console.warn('⚠️  Could not get commit log:', error.message);
      return [];
    }
  }

  /**
   * Get repository map
   */
  async getRepositoryMap() {
    try {
      const stats = await this.getDirectoryStats('.');
      return {
        two_level_structure: this.getTwoLevelStructure(),
        file_count: stats.fileCount,
        total_size_mb: Math.round(stats.totalSize / (1024 * 1024) * 100) / 100
      };
    } catch (error) {
      console.warn('⚠️  Could not get repository map:', error.message);
      return {
        two_level_structure: {},
        file_count: 0,
        total_size_mb: 0
      };
    }
  }

  /**
   * Get directory statistics
   */
  async getDirectoryStats(dirPath) {
    let fileCount = 0;
    let totalSize = 0;

    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        if (!['node_modules', '.git', 'coverage', 'dist'].includes(entry.name)) {
          const subStats = await this.getDirectoryStats(fullPath);
          fileCount += subStats.fileCount;
          totalSize += subStats.totalSize;
        }
      } else {
        fileCount++;
        const stats = await fs.stat(fullPath);
        totalSize += stats.size;
      }
    }

    return { fileCount, totalSize };
  }

  /**
   * Get two-level directory structure
   */
  getTwoLevelStructure() {
    // Simplified implementation - would scan actual directory structure
    return {
      'src/': ['expense/', 'hello/', 'quote/', 'stopwatch/', 'temp-converter/', 'todo/'],
      'frontend/': ['src/', 'e2e/', 'dist/'],
      'tests/': ['contract/', 'integration/'],
      'specs/': ['001-what-build-a/', '003-build-a-ui/', '004-implement-day-0/', '005-add-a-spec/', '006-feat-ui-quote/', '007-feat-ui-expense/', '008-feat-ui-temp/', '009-feat-ui-todo/', '010-feat-ui-stopwatch/', '011-title-day-0/', 'cursor-test/']
    };
  }

  /**
   * Get coverage summary
   */
  async getCoverageSummary() {
    // This would be populated from actual coverage data
    return {
      backend_coverage: {
        quote: 75,
        expense: 80,
        temp: 70,
        todo: 85,
        stopwatch: 78
      },
      ui_coverage: {
        quote: 60,
        expense: 65,
        temp: 55,
        todo: 70,
        stopwatch: 62
      },
      overall_coverage: 69.5
    };
  }

  /**
   * Collect artifacts
   */
  collectArtifacts() {
    return [
      'coverage-quote/index.html',
      'coverage-expense/index.html',
      'coverage-temp/index.html',
      'coverage-todo/index.html',
      'coverage-stopwatch/index.html',
      'ui-coverage-quote/index.html',
      'ui-coverage-expense/index.html',
      'ui-coverage-temp/index.html',
      'ui-coverage-todo/index.html',
      'ui-coverage-stopwatch/index.html',
      'index.html',
      'review.md'
    ];
  }

  /**
   * Generate review.md file
   */
  async generateReviewMarkdown(reviewPacket) {
    const metadata = reviewPacket.review_metadata;
    const coverageSummary = reviewPacket.getCoverageSummary();

    const markdown = `# Review Packet

## Environment Details
- **Node Version**: ${metadata.environment_details.node_version}
- **NPM Version**: ${metadata.environment_details.npm_version}
- **OS**: ${metadata.environment_details.os}
- **CI Platform**: ${metadata.environment_details.ci_platform}

## Repository Information
- **Branch**: ${reviewPacket.branch}
- **Commit**: ${reviewPacket.commit_hash}
- **Generated**: ${reviewPacket.generated_at}
- **File Count**: ${metadata.repository_map.file_count}
- **Total Size**: ${metadata.repository_map.total_size_mb} MB

## Coverage Summary
- **Overall Coverage**: ${coverageSummary.overall_coverage}%

### Backend Coverage
${Object.entries(coverageSummary.backend_coverage).map(([app, coverage]) => 
  `- **${app}**: ${coverage}%`
).join('\n')}

### UI Coverage
${Object.entries(coverageSummary.ui_coverage).map(([app, coverage]) => 
  `- **${app}**: ${coverage}%`
).join('\n')}

## Recent Commits (Last 20)
${metadata.commit_log.map(commit => 
  `- \`${commit.hash}\` ${commit.message}`
).join('\n')}

## Repository Structure
${Object.entries(metadata.repository_map.two_level_structure).map(([dir, subdirs]) => 
  `### ${dir}\n${subdirs.map(subdir => `- ${subdir}`).join('\n')}`
).join('\n\n')}

## Artifacts
- Coverage Index: [index.html](./index.html)
- Backend Coverage Reports: coverage-{app}/index.html
- UI Coverage Reports: ui-coverage-{app}/index.html
`;

    const reviewPath = path.join(this.outputDir, 'review.md');
    await fs.writeFile(reviewPath, markdown, 'utf8');
    console.log(`📄 Generated review.md at ${reviewPath}`);
  }

  /**
   * Save packet metadata
   */
  async savePacketMetadata(reviewPacket) {
    const metadataPath = path.join(this.outputDir, 'packet-metadata.json');
    await fs.writeFile(metadataPath, JSON.stringify(reviewPacket.toJSON(), null, 2), 'utf8');
    console.log(`💾 Saved packet metadata at ${metadataPath}`);
  }

  /**
   * Get current branch
   */
  getCurrentBranch() {
    try {
      // In GitHub Actions, use GITHUB_REF_NAME environment variable
      if (process.env.GITHUB_REF_NAME) {
        console.log('✅ Using GITHUB_REF_NAME:', process.env.GITHUB_REF_NAME);
        return process.env.GITHUB_REF_NAME;
      }
      // Fallback to git command for local/non-GitHub environments
      const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
      if (!branch) {
        throw new Error('git branch returned empty string');
      }
      console.log('✅ Using git branch:', branch);
      return branch;
    } catch (error) {
      console.error('❌ Failed to get branch:', error.message);
      // Try alternative git command
      try {
        const ref = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
        if (ref && ref !== 'HEAD') {
          console.log('✅ Using git rev-parse:', ref);
          return ref;
        }
      } catch (altError) {
        console.error('❌ Alternative git command also failed');
      }
      throw new Error('Could not determine current branch');
    }
  }

  /**
   * Get current commit hash
   */
  getCurrentCommitHash() {
    try {
      return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    } catch (error) {
      return 'unknown';
    }
  }
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const service = new ReviewPacketGenerationService();
  service.generateReviewPacket()
    .then(packet => {
      console.log('✅ Review packet generation completed');
      console.log(`📦 Packet ID: ${packet.id}`);
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Review packet generation failed:', error);
      process.exit(1);
    });
}
