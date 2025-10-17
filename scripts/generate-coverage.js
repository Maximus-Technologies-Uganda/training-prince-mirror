#!/usr/bin/env node
/**
 * Coverage Generation Service
 * Generates unified coverage reports for all applications (backend and UI)
 * Creates CoverageReport and UICoverageReport entities
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { CoverageReport } from '../src/models/coverage-report.js';
import { UICoverageReport } from '../src/models/ui-coverage-report.js';

const APPLICATIONS = ['quote', 'expense', 'temp-converter', 'todo', 'stopwatch'];
const ROOT_DIR = process.cwd();
const ARTIFACTS_DIR = path.join(ROOT_DIR, 'review-artifacts');

class CoverageGenerator {
  constructor() {
    this.backendReports = [];
    this.uiReports = [];
    this.errors = [];
  }

  /**
   * Generate all coverage reports
   */
  async generateAll() {
    console.log('🚀 Starting coverage generation...');
    
    // Ensure artifacts directory exists
    this.ensureArtifactsDirectory();
    
    // Generate backend coverage reports
    await this.generateBackendCoverage();
    
    // Generate UI coverage reports
    await this.generateUICoverage();
    
    // Generate summary
    this.generateSummary();
    
    console.log('✅ Coverage generation completed');
    return {
      backendReports: this.backendReports,
      uiReports: this.uiReports,
      errors: this.errors
    };
  }

  /**
   * Ensure artifacts directory exists
   */
  ensureArtifactsDirectory() {
    if (!fs.existsSync(ARTIFACTS_DIR)) {
      fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
      console.log('📁 Created review-artifacts directory');
    }
  }

  /**
   * Generate backend coverage reports for all applications
   */
  async generateBackendCoverage() {
    console.log('🔧 Generating backend coverage reports...');
    
    for (const app of APPLICATIONS) {
      try {
        const report = await this.generateBackendReport(app);
        this.backendReports.push(report);
        console.log(`✅ Backend coverage for ${app}: ${report.coverage_percentage}%`);
      } catch (error) {
        console.error(`❌ Failed to generate backend coverage for ${app}:`, error.message);
        this.errors.push({
          application: app,
          type: 'backend',
          error: error.message
        });
        
        // Create error report
        const errorReport = new CoverageReport({
          application_name: app,
          coverage_percentage: 0,
          statement_coverage: 0,
          branch_coverage: 0,
          function_coverage: 0,
          line_coverage: 0,
          report_path: null,
          error_message: error.message
        });
        this.backendReports.push(errorReport);
      }
    }
  }

  /**
   * Generate backend coverage report for a specific application
   */
  async generateBackendReport(appName) {
    const appDir = path.join(ROOT_DIR, 'src', appName);
    
    if (!fs.existsSync(appDir)) {
      throw new Error(`Application directory not found: ${appDir}`);
    }

    // Run vitest with coverage for this specific app
    const coverageDir = path.join(ARTIFACTS_DIR, `coverage-${appName}`);
    const testPattern = `tests/${appName}*.test.js`;
    
    try {
      // Run tests with coverage
      execSync(`npx vitest run --coverage --reporter=json --coverage.reportsDirectory=${coverageDir} --coverage.include="src/${appName}/**/*.js" ${testPattern}`, {
        cwd: ROOT_DIR,
        stdio: 'inherit'
      });
      
      // Read coverage data
      const coverageData = this.readCoverageData(coverageDir);
      
      return new CoverageReport({
        application_name: appName,
        coverage_percentage: coverageData.total.coverage_percentage,
        statement_coverage: coverageData.total.statements,
        branch_coverage: coverageData.total.branches,
        function_coverage: coverageData.total.functions,
        line_coverage: coverageData.total.lines,
        report_path: path.join(coverageDir, 'lcov-report', 'index.html'),
        test_count: coverageData.total.tests || 0
      });
      
    } catch (error) {
      console.error(`❌ Backend coverage generation failed for ${appName}:`, error.message);
      
      // If tests fail, try to extract partial coverage
      if (fs.existsSync(path.join(coverageDir, 'coverage-final.json'))) {
        const coverageData = this.readCoverageData(coverageDir);
        return new CoverageReport({
          application_name: appName,
          coverage_percentage: coverageData.total.coverage_percentage,
          statement_coverage: coverageData.total.statements,
          branch_coverage: coverageData.total.branches,
          function_coverage: coverageData.total.functions,
          line_coverage: coverageData.total.lines,
          report_path: path.join(coverageDir, 'lcov-report', 'index.html'),
          test_count: coverageData.total.tests || 0,
          error_message: 'Tests failed but coverage data available'
        });
      }
      
      // Run the command again with stdio: 'inherit' to show the actual error
      console.log(`🔍 Running coverage command with visible output for debugging:`);
      try {
        execSync(`npx vitest run --coverage --reporter=json --coverage.reportsDirectory=${coverageDir} --coverage.include="src/${appName}/**/*.js" ${testPattern}`, {
          cwd: ROOT_DIR,
          stdio: 'inherit'
        });
      } catch (debugError) {
        console.error(`❌ Debug run also failed:`, debugError.message);
      }
      
      throw error;
    }
  }

  /**
   * Generate UI coverage reports for all applications
   */
  async generateUICoverage() {
    console.log('🎨 Generating UI coverage reports...');
    
    // Map backend app names to frontend UI names
    const uiAppMapping = {
      'quote': 'main', // Quote UI is in main.js
      'expense': 'expense',
      'temp-converter': 'temp',
      'todo': 'todo',
      'stopwatch': 'stopwatch'
    };
    
    for (const app of APPLICATIONS) {
      try {
        const uiAppName = uiAppMapping[app];
        const report = await this.generateUIReport(app, uiAppName);
        this.uiReports.push(report);
        console.log(`✅ UI coverage for ${app}: ${report.coverage_percentage}%`);
      } catch (error) {
        console.error(`❌ Failed to generate UI coverage for ${app}:`, error.message);
        this.errors.push({
          application: app,
          type: 'ui',
          error: error.message
        });
        
        // Create error report
        const errorReport = new UICoverageReport({
          application_name: app,
          coverage_percentage: 0,
          statement_coverage: 0,
          branch_coverage: 0,
          function_coverage: 0,
          line_coverage: 0,
          report_path: null,
          error_message: error.message
        });
        this.uiReports.push(errorReport);
      }
    }
  }

  /**
   * Generate UI coverage report for a specific application
   */
  async generateUIReport(appName, uiAppName) {
    const frontendDir = path.join(ROOT_DIR, 'frontend');
    
    if (!fs.existsSync(frontendDir)) {
      throw new Error(`Frontend directory not found: ${frontendDir}`);
    }

    // Special handling for quote UI which is in main.js
    if (uiAppName === 'main') {
      return await this.generateMainJSCoverage(appName, frontendDir);
    }

    // Check if UI components exist for this app
    const uiDir = path.join(frontendDir, 'src', `ui-${uiAppName}`);
    if (!fs.existsSync(uiDir)) {
      throw new Error(`UI directory not found: ${uiDir}`);
    }

    // Run vitest with coverage for UI components
    const coverageDir = path.join(ARTIFACTS_DIR, `ui-coverage-${uiAppName}`);
    
    // Ensure coverage directory exists
    if (!fs.existsSync(coverageDir)) {
      fs.mkdirSync(coverageDir, { recursive: true });
    }
    
    try {
      // Run tests with coverage and capture JSON output
      const output = execSync(`npx vitest run --coverage --reporter=json --coverage.reportsDirectory=${coverageDir} --coverage.include="src/ui-${uiAppName}/**/*.js"`, {
        cwd: frontendDir,
        stdio: 'pipe',
        encoding: 'utf8'
      });
      
      // Parse coverage data from JSON output
      const lines = output.trim().split('\n');
      const jsonLine = lines.find(line => line.startsWith('{') && line.includes('coverageMap'));
      if (!jsonLine) {
        throw new Error('No coverage data found in test output');
      }
      
      const testResult = JSON.parse(jsonLine);
      const coverageData = this.parseCoverageFromTestResult(testResult);
      
      return new UICoverageReport({
        application_name: appName,
        coverage_percentage: coverageData.total.coverage_percentage,
        statement_coverage: coverageData.total.statements,
        branch_coverage: coverageData.total.branches,
        function_coverage: coverageData.total.functions,
        line_coverage: coverageData.total.lines,
        report_path: path.join(coverageDir, 'lcov-report', 'index.html'),
        test_count: testResult.numTotalTests || 0,
        vitest_config: {
          include: `src/ui-${uiAppName}/**/*.js`,
          threshold: 40
        }
      });
      
    } catch (error) {
      console.error(`❌ UI coverage generation failed for ${appName}:`, error.message);
      
      // If tests fail, try to extract partial coverage
      if (fs.existsSync(path.join(coverageDir, 'lcov.info'))) {
        const coverageData = this.readCoverageFromLcov(coverageDir);
        return new UICoverageReport({
          application_name: appName,
          coverage_percentage: coverageData.total.coverage_percentage,
          statement_coverage: coverageData.total.statements,
          branch_coverage: coverageData.total.branches,
          function_coverage: coverageData.total.functions,
          line_coverage: coverageData.total.lines,
          report_path: path.join(coverageDir, 'lcov-report', 'index.html'),
          test_count: 0,
          error_message: 'Tests failed but coverage data available',
          vitest_config: {
            include: `src/ui-${uiAppName}/**/*.js`,
            threshold: 40
          }
        });
      }
      
      // Run the command again with stdio: 'inherit' to show the actual error
      console.log(`🔍 Running UI coverage command with visible output for debugging:`);
      try {
        execSync(`npx vitest run --coverage --reporter=json --coverage.reportsDirectory=${coverageDir} --coverage.include="src/ui-${uiAppName}/**/*.js"`, {
          cwd: frontendDir,
          stdio: 'inherit'
        });
      } catch (debugError) {
        console.error(`❌ Debug run also failed:`, debugError.message);
      }
      
      throw error;
    }
  }

  /**
   * Generate coverage report for quote UI in main.js
   */
  async generateMainJSCoverage(appName, frontendDir) {
    const coverageDir = path.join(ARTIFACTS_DIR, `ui-coverage-${appName}`);
    
    // Ensure coverage directory exists
    if (!fs.existsSync(coverageDir)) {
      fs.mkdirSync(coverageDir, { recursive: true });
    }
    
    try {
      // Run tests with coverage for main.js (quote UI)
      const output = execSync(`npx vitest run --coverage --reporter=json --coverage.reportsDirectory=${coverageDir} --coverage.include="src/main.js"`, {
        cwd: frontendDir,
        stdio: 'pipe',
        encoding: 'utf8'
      });
      
      // Parse coverage data from JSON output
      const lines = output.trim().split('\n');
      const jsonLine = lines.find(line => line.startsWith('{') && line.includes('coverageMap'));
      if (!jsonLine) {
        throw new Error('No coverage data found in test output');
      }
      
      const testResult = JSON.parse(jsonLine);
      const coverageData = this.parseCoverageFromTestResult(testResult);
      
      return new UICoverageReport({
        application_name: appName,
        coverage_percentage: coverageData.total.coverage_percentage,
        statement_coverage: coverageData.total.statements,
        branch_coverage: coverageData.total.branches,
        function_coverage: coverageData.total.functions,
        line_coverage: coverageData.total.lines,
        report_path: path.join(coverageDir, 'lcov-report', 'index.html'),
        test_count: testResult.numTotalTests || 0,
        vitest_config: {
          include: 'src/main.js',
          threshold: 40
        }
      });
      
    } catch (error) {
      console.error(`❌ Main.js coverage generation failed for ${appName}:`, error.message);
      
      // If tests fail, try to extract partial coverage
      if (fs.existsSync(path.join(coverageDir, 'coverage-final.json'))) {
        const coverageData = this.readCoverageData(coverageDir);
        return new UICoverageReport({
          application_name: appName,
          coverage_percentage: coverageData.total.coverage_percentage,
          statement_coverage: coverageData.total.statements,
          branch_coverage: coverageData.total.branches,
          function_coverage: coverageData.total.functions,
          line_coverage: coverageData.total.lines,
          report_path: path.join(coverageDir, 'lcov-report', 'index.html'),
          test_count: 0,
          error_message: 'Tests failed but coverage data available'
        });
      }
      
      // Run the command again with stdio: 'inherit' to show the actual error
      console.log(`🔍 Running main.js coverage command with visible output for debugging:`);
      try {
        execSync(`npx vitest run --coverage --reporter=json --coverage.reportsDirectory=${coverageDir} --coverage.include="src/main.js"`, {
          cwd: frontendDir,
          stdio: 'inherit'
        });
      } catch (debugError) {
        console.error(`❌ Debug run also failed:`, debugError.message);
      }
      
      throw error;
    }
  }

  /**
   * Parse coverage data from vitest test result JSON
   */
  parseCoverageFromTestResult(testResult) {
    const coverageMap = testResult.coverageMap || {};
    const files = Object.values(coverageMap);
    
    const total = {
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0,
      statementsCovered: 0,
      branchesCovered: 0,
      functionsCovered: 0,
      linesCovered: 0
    };
    
    files.forEach(file => {
      if (file.s) total.statements += Object.keys(file.s).length;
      if (file.b) total.branches += Object.keys(file.b).length;
      if (file.f) total.functions += Object.keys(file.f).length;
      if (file.l) total.lines += Object.keys(file.l).length;
      
      if (file.s) total.statementsCovered += Object.values(file.s).filter(count => count > 0).length;
      if (file.b) total.branchesCovered += Object.values(file.b).filter(count => count > 0).length;
      if (file.f) total.functionsCovered += Object.values(file.f).filter(count => count > 0).length;
      if (file.l) total.linesCovered += Object.values(file.l).filter(count => count > 0).length;
    });
    
    // Calculate percentages
    const coverage_percentage = total.statements > 0 
      ? Math.round((total.statementsCovered / total.statements) * 100 * 100) / 100
      : 0;
    
    return {
      total: {
        coverage_percentage,
        statements: total.statements > 0 ? Math.round((total.statementsCovered / total.statements) * 100 * 100) / 100 : 0,
        branches: total.branches > 0 ? Math.round((total.branchesCovered / total.branches) * 100 * 100) / 100 : 0,
        functions: total.functions > 0 ? Math.round((total.functionsCovered / total.functions) * 100 * 100) / 100 : 0,
        lines: total.lines > 0 ? Math.round((total.linesCovered / total.lines) * 100 * 100) / 100 : 0,
        tests: 0 // Would need to parse test results
      }
    };
  }

  /**
   * Read coverage data from vitest output
   */
  readCoverageData(coverageDir) {
    const coverageFile = path.join(coverageDir, 'coverage-final.json');
    
    if (!fs.existsSync(coverageFile)) {
      throw new Error(`Coverage file not found: ${coverageFile}`);
    }
    
    const coverageData = JSON.parse(fs.readFileSync(coverageFile, 'utf8'));
    
    // Calculate totals
    const files = Object.values(coverageData);
    const total = {
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0,
      statementsCovered: 0,
      branchesCovered: 0,
      functionsCovered: 0,
      linesCovered: 0
    };
    
    files.forEach(file => {
      if (file.s) total.statements += Object.keys(file.s).length;
      if (file.b) total.branches += Object.keys(file.b).length;
      if (file.f) total.functions += Object.keys(file.f).length;
      if (file.l) total.lines += Object.keys(file.l).length;
      
      if (file.s) total.statementsCovered += Object.values(file.s).filter(count => count > 0).length;
      if (file.b) total.branchesCovered += Object.values(file.b).filter(count => count > 0).length;
      if (file.f) total.functionsCovered += Object.values(file.f).filter(count => count > 0).length;
      if (file.l) total.linesCovered += Object.values(file.l).filter(count => count > 0).length;
    });
    
    // Calculate percentages
    const coverage_percentage = total.statements > 0 
      ? Math.round((total.statementsCovered / total.statements) * 100 * 100) / 100
      : 0;
    
    return {
      total: {
        coverage_percentage,
        statements: total.statements > 0 ? Math.round((total.statementsCovered / total.statements) * 100 * 100) / 100 : 0,
        branches: total.branches > 0 ? Math.round((total.branchesCovered / total.branches) * 100 * 100) / 100 : 0,
        functions: total.functions > 0 ? Math.round((total.functionsCovered / total.functions) * 100 * 100) / 100 : 0,
        lines: total.lines > 0 ? Math.round((total.linesCovered / total.lines) * 100 * 100) / 100 : 0,
        tests: 0 // Would need to parse test results
      }
    };
  }

  /**
   * Read coverage data from LCOV file
   */
  readCoverageFromLcov(coverageDir) {
    const lcovFile = path.join(coverageDir, 'lcov.info');
    
    if (!fs.existsSync(lcovFile)) {
      throw new Error(`LCOV file not found: ${lcovFile}`);
    }
    
    // Simple LCOV parsing - in a real implementation, you'd want a proper LCOV parser
    const lcovContent = fs.readFileSync(lcovFile, 'utf8');
    const lines = lcovContent.split('\n');
    
    let totalLines = 0;
    let coveredLines = 0;
    
    lines.forEach(line => {
      if (line.startsWith('LF:')) {
        totalLines += parseInt(line.split(':')[1]) || 0;
      } else if (line.startsWith('LH:')) {
        coveredLines += parseInt(line.split(':')[1]) || 0;
      }
    });
    
    const coverage_percentage = totalLines > 0 ? Math.round((coveredLines / totalLines) * 100 * 100) / 100 : 0;
    
    return {
      total: {
        coverage_percentage,
        statements: coverage_percentage,
        branches: coverage_percentage,
        functions: coverage_percentage,
        lines: coverage_percentage,
        tests: 0
      }
    };
  }

  /**
   * Generate coverage summary
   */
  generateSummary() {
    const summary = {
      backend: this.backendReports.map(report => report.getSummary()),
      ui: this.uiReports.map(report => report.getSummary()),
      errors: this.errors,
      generated_at: new Date().toISOString()
    };
    
    const summaryFile = path.join(ARTIFACTS_DIR, 'coverage-summary.json');
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
    console.log('📊 Coverage summary saved to coverage-summary.json');
    
    // Print summary to console
    console.log('\n📈 Coverage Summary:');
    console.log('Backend Coverage:');
    this.backendReports.forEach(report => {
      const summary = report.getSummary();
      console.log(`  ${summary.application}: ${summary.statement}% statements, ${summary.tests} tests`);
    });
    
    console.log('UI Coverage:');
    this.uiReports.forEach(report => {
      const summary = report.getSummary();
      console.log(`  ${summary.application}: ${summary.statement}% statements, ${summary.tests} tests`);
    });
    
    if (this.errors.length > 0) {
      console.log('Errors:');
      this.errors.forEach(error => {
        console.log(`  ${error.application} (${error.type}): ${error.error}`);
      });
    }
  }
}

// CLI interface
async function main() {
  const generator = new CoverageGenerator();
  
  try {
    const results = await generator.generateAll();
    
    // Exit with error code if there are critical errors
    const criticalErrors = results.errors.filter(error => 
      !error.error.includes('Tests failed but coverage data available')
    );
    
    if (criticalErrors.length > 0) {
      console.error(`\n❌ ${criticalErrors.length} critical errors occurred`);
      process.exit(1);
    }
    
    console.log('\n✅ All coverage reports generated successfully');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Coverage generation failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { CoverageGenerator };