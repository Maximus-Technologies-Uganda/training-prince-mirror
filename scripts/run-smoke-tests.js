/**
 * Smoke Test Execution Service
 * Executes foundational E2E tests for all UI applications using Playwright
 */

import { SmokeTest } from '../src/models/smoke-test.js';
import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';

export class SmokeTestExecutionService {
  constructor(options = {}) {
    this.playwrightConfig = options.playwrightConfig || 'frontend/playwright.config.ts';
    this.testDir = options.testDir || 'frontend/e2e';
    this.outputDir = options.outputDir || 'test-results';
    this.applications = options.applications || ['quote', 'expense', 'temp', 'todo', 'stopwatch'];
    this.baseUrl = options.baseUrl || 'http://localhost:5173';
  }

  /**
   * Execute all smoke tests
   */
  async executeSmokeTests() {
    console.log('🧪 Executing smoke tests for all applications...');
    
    const results = {
      tests: [],
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        skipped: 0
      },
      artifacts: [],
      errors: []
    };

    // Ensure output directory exists
    await this.ensureOutputDirectory();

    // Execute smoke test for each application
    for (const app of this.applications) {
      try {
        const testResult = await this.executeSmokeTest(app);
        results.tests.push(testResult);
        results.summary.total++;
        
        if (testResult.status === 'passed') {
          results.summary.passed++;
        } else if (testResult.status === 'failed') {
          results.summary.failed++;
        } else {
          results.summary.skipped++;
        }

        // Collect artifacts if test failed
        if (testResult.status === 'failed' && testResult.artifacts) {
          results.artifacts.push(...testResult.artifacts);
        }
      } catch (error) {
        console.error(`❌ Failed to execute smoke test for ${app}:`, error.message);
        results.errors.push({ app, error: error.message });
        results.summary.total++;
        results.summary.failed++;
      }
    }

    // Generate test report
    await this.generateTestReport(results);

    console.log(`✅ Smoke tests completed: ${results.summary.passed}/${results.summary.total} passed`);
    
    if (results.summary.failed > 0) {
      console.warn(`⚠️  ${results.summary.failed} tests failed`);
    }

    return results;
  }

  /**
   * Execute smoke test for a specific application
   */
  async executeSmokeTest(appName) {
    console.log(`🧪 Executing smoke test for ${appName}...`);

    const smokeTest = new SmokeTest({
      application_name: appName,
      test_name: `${appName}.smoke.spec.ts`,
      workflow_description: this.getWorkflowDescription(appName),
      test_file_path: path.join(this.testDir, `${appName}.smoke.spec.ts`)
    });

    // Validate smoke test
    const validation = smokeTest.validate();
    if (!validation.isValid) {
      throw new Error(`Invalid smoke test: ${validation.errors.join(', ')}`);
    }

    // Start test execution
    smokeTest.start();
    const startTime = Date.now();

    try {
      // Execute the test using Playwright
      const testResult = await this.runPlaywrightTest(smokeTest);
      const executionTime = Date.now() - startTime;

      if (testResult.success) {
        smokeTest.pass(executionTime);
        console.log(`✅ ${appName} smoke test passed (${executionTime}ms)`);
      } else {
        smokeTest.fail(executionTime, testResult.error, testResult.artifacts);
        console.log(`❌ ${appName} smoke test failed: ${testResult.error}`);
      }

      return smokeTest;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      smokeTest.fail(executionTime, error.message);
      console.log(`❌ ${appName} smoke test error: ${error.message}`);
      return smokeTest;
    }
  }

  /**
   * Run Playwright test for a specific application
   */
  async runPlaywrightTest(smokeTest) {
    const testFile = smokeTest.test_file_path;
    
    try {
      // Check if test file exists
      await fs.access(testFile);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return {
          success: false,
          error: `Test file not found: ${testFile}`,
          artifacts: []
        };
      }
      throw error;
    }

    try {
      // Run Playwright test
      const command = `npx playwright test ${testFile} --config=${this.playwrightConfig}`;
      const output = execSync(command, { 
        encoding: 'utf8', 
        cwd: process.cwd(),
        timeout: 60000 // 60 second timeout
      });

      return {
        success: true,
        output: output,
        artifacts: []
      };
    } catch (error) {
      // Test failed - collect artifacts
      const artifacts = await this.collectTestArtifacts(smokeTest.application_name);
      
      return {
        success: false,
        error: error.message,
        artifacts: artifacts
      };
    }
  }

  /**
   * Get workflow description for each application
   */
  getWorkflowDescription(appName) {
    const workflows = {
      quote: 'Navigate to quote app, verify random quote generation, test filtering functionality',
      expense: 'Navigate to expense app, add new expense, verify calculation and display',
      temp: 'Navigate to temp converter, test temperature conversion between Celsius and Fahrenheit',
      todo: 'Navigate to todo app, add new task, mark as complete, verify persistence',
      stopwatch: 'Navigate to stopwatch, start timer, verify time display, test pause/resume functionality'
    };
    
    return workflows[appName] || `Basic smoke test for ${appName} application`;
  }

  /**
   * Collect test artifacts (screenshots, traces, videos)
   */
  async collectTestArtifacts(appName) {
    const artifacts = [];
    const artifactDir = path.join(this.outputDir, appName);

    try {
      const files = await fs.readdir(artifactDir);
      
      for (const file of files) {
        const filePath = path.join(artifactDir, file);
        const stats = await fs.stat(filePath);
        
        if (stats.isFile()) {
          artifacts.push({
            type: this.getArtifactType(file),
            filename: file,
            path: filePath,
            size: stats.size,
            created: stats.mtime.toISOString()
          });
        }
      }
    } catch (error) {
      console.warn(`⚠️  Could not collect artifacts for ${appName}:`, error.message);
    }

    return artifacts;
  }

  /**
   * Determine artifact type from filename
   */
  getArtifactType(filename) {
    if (filename.endsWith('.png')) return 'screenshot';
    if (filename.endsWith('.zip')) return 'trace';
    if (filename.endsWith('.webm')) return 'video';
    return 'other';
  }

  /**
   * Ensure output directory exists
   */
  async ensureOutputDirectory() {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
      console.log(`📁 Ensured ${this.outputDir} directory exists`);
    } catch (error) {
      throw new Error(`Failed to create ${this.outputDir} directory: ${error.message}`);
    }
  }

  /**
   * Generate comprehensive test report
   */
  async generateTestReport(results) {
    const reportPath = path.join(this.outputDir, 'smoke-test-report.html');
    
    const reportContent = this.generateReportHTML(results);
    await fs.writeFile(reportPath, reportContent, 'utf8');
    
    console.log(`📄 Generated test report at ${reportPath}`);
  }

  /**
   * Generate HTML test report
   */
  generateReportHTML(results) {
    const testRows = results.tests.map(test => {
      const statusIcon = test.status === 'passed' ? '✅' : test.status === 'failed' ? '❌' : '⏭️';
      const artifactsList = test.artifacts.length > 0 
        ? test.artifacts.map(artifact => `<li>${artifact.filename} (${artifact.type})</li>`).join('')
        : '<li>No artifacts</li>';
      
      return `<tr>
        <td>${test.application_name}</td>
        <td>${statusIcon} ${test.status}</td>
        <td>${test.execution_time_ms}ms</td>
        <td>${test.workflow_description}</td>
        <td><ul>${artifactsList}</ul></td>
      </tr>`;
    }).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smoke Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .summary { background-color: #f9f9f9; padding: 20px; margin: 20px 0; }
        .passed { color: green; }
        .failed { color: red; }
        .skipped { color: orange; }
    </style>
</head>
<body>
    <h1>🧪 Smoke Test Report</h1>
    
    <div class="summary">
        <h2>Summary</h2>
        <p><strong>Total Tests:</strong> ${results.summary.total}</p>
        <p><strong class="passed">Passed:</strong> ${results.summary.passed}</p>
        <p><strong class="failed">Failed:</strong> ${results.summary.failed}</p>
        <p><strong class="skipped">Skipped:</strong> ${results.summary.skipped}</p>
        <p><strong>Success Rate:</strong> ${results.summary.total > 0 ? Math.round((results.summary.passed / results.summary.total) * 100) : 0}%</p>
    </div>
    
    <h2>Test Results</h2>
    <table>
        <thead>
            <tr>
                <th>Application</th>
                <th>Status</th>
                <th>Execution Time</th>
                <th>Workflow</th>
                <th>Artifacts</th>
            </tr>
        </thead>
        <tbody>
            ${testRows}
        </tbody>
    </table>
    
    ${results.errors.length > 0 ? `
    <h2>Errors</h2>
    <ul>
        ${results.errors.map(error => `<li><strong>${error.app}:</strong> ${error.error}</li>`).join('')}
    </ul>
    ` : ''}
    
    <p><em>Generated at: ${new Date().toISOString()}</em></p>
</body>
</html>`;
  }

  /**
   * Verify test environment
   */
  async verifyTestEnvironment() {
    console.log('🔍 Verifying test environment...');
    
    const verification = {
      playwrightInstalled: false,
      testFilesExist: [],
      configExists: false,
      errors: []
    };

    // Check if Playwright is installed
    try {
      execSync('npx playwright --version', { encoding: 'utf8' });
      verification.playwrightInstalled = true;
    } catch (error) {
      verification.errors.push('Playwright not installed');
    }

    // Check if config file exists
    try {
      await fs.access(this.playwrightConfig);
      verification.configExists = true;
    } catch (error) {
      verification.errors.push(`Playwright config not found: ${this.playwrightConfig}`);
    }

    // Check if test files exist
    for (const app of this.applications) {
      const testFile = path.join(this.testDir, `${app}.smoke.spec.ts`);
      try {
        await fs.access(testFile);
        verification.testFilesExist.push(app);
      } catch (error) {
        verification.errors.push(`Test file not found: ${testFile}`);
      }
    }

    console.log(`📊 Environment verification:`);
    console.log(`  - Playwright installed: ${verification.playwrightInstalled}`);
    console.log(`  - Config exists: ${verification.configExists}`);
    console.log(`  - Test files found: ${verification.testFilesExist.length}/${this.applications.length}`);
    
    if (verification.errors.length > 0) {
      console.warn(`⚠️  Environment issues: ${verification.errors.length}`);
    }

    return verification;
  }
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const service = new SmokeTestExecutionService();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'run':
      service.executeSmokeTests()
        .then(() => {
          console.log('✅ Smoke tests completed');
          process.exit(0);
        })
        .catch(error => {
          console.error('❌ Smoke tests failed:', error);
          process.exit(1);
        });
      break;
      
    case 'verify':
      service.verifyTestEnvironment()
        .then(() => {
          console.log('✅ Environment verification completed');
          process.exit(0);
        })
        .catch(error => {
          console.error('❌ Environment verification failed:', error);
          process.exit(1);
        });
      break;
      
    default:
      console.log('Usage: node run-smoke-tests.js [run|verify]');
      process.exit(1);
  }
}
