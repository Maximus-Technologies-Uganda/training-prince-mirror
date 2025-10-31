#!/usr/bin/env node

/**
 * Capture Baseline Coverage Snapshot
 * 
 * Captures current coverage metrics before enforcement thresholds are configured.
 * This helps understand the baseline state and transition gap to 60/50/60/60 targets.
 * 
 * Usage:
 *   npm run test:coverage
 *   node scripts/capture-baseline-coverage.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const coverageFile = path.join(projectRoot, 'coverage', 'coverage-final.json');
const snapshotFile = path.join(__dirname, 'baseline-coverage-snapshot.json');

/**
 * Parse coverage data and extract key metrics
 */
function parseCoverageMetrics(coverageData) {
  let totalStatements = 0;
  let coveredStatements = 0;
  let totalBranches = 0;
  let coveredBranches = 0;
  let totalFunctions = 0;
  let coveredFunctions = 0;
  let totalLines = 0;
  let coveredLines = 0;
  let fileCount = 0;

  for (const [filePath, fileData] of Object.entries(coverageData)) {
    if (filePath === 'total') continue;

    fileCount++;

    // Statements
    if (fileData.s) {
      totalStatements += Object.keys(fileData.s).length;
      coveredStatements += Object.values(fileData.s).filter(count => count > 0).length;
    }

    // Branches
    if (fileData.b) {
      totalBranches += Object.keys(fileData.b).length;
      coveredBranches += Object.values(fileData.b).filter(counts => {
        return Array.isArray(counts) && counts.some(c => c > 0);
      }).length;
    }

    // Functions
    if (fileData.f) {
      totalFunctions += Object.keys(fileData.f).length;
      coveredFunctions += Object.values(fileData.f).filter(count => count > 0).length;
    }

    // Lines
    if (fileData.l) {
      totalLines += Object.keys(fileData.l).length;
      coveredLines += Object.values(fileData.l).filter(count => count > 0).length;
    }
  }

  const calculatePercent = (covered, total) => total === 0 ? 100 : Math.round((covered / total) * 100);

  return {
    fileCount,
    statements: {
      total: totalStatements,
      covered: coveredStatements,
      percentage: calculatePercent(coveredStatements, totalStatements),
    },
    branches: {
      total: totalBranches,
      covered: coveredBranches,
      percentage: calculatePercent(coveredBranches, totalBranches),
    },
    functions: {
      total: totalFunctions,
      covered: coveredFunctions,
      percentage: calculatePercent(coveredFunctions, totalFunctions),
    },
    lines: {
      total: totalLines,
      covered: coveredLines,
      percentage: calculatePercent(coveredLines, totalLines),
    },
  };
}

/**
 * Calculate gap to target thresholds
 */
function calculateThresholdGaps(metrics) {
  const targets = { statements: 60, branches: 50, functions: 60, lines: 60 };
  const gaps = {};

  for (const [key, target] of Object.entries(targets)) {
    const current = metrics[key].percentage;
    const gap = target - current;
    gaps[key] = {
      current,
      target,
      gap: gap > 0 ? gap : 0,
      status: current >= target ? '✅ PASS' : '❌ FAIL',
    };
  }

  return gaps;
}

/**
 * Main execution
 */
async function main() {
  console.log('\n🔍 Capturing Baseline Coverage Snapshot\n');
  console.log(`Project Root: ${projectRoot}\n`);

  // Check if coverage file exists
  if (!fs.existsSync(coverageFile)) {
    console.error(`\n❌ Error: Coverage file not found: ${coverageFile}`);
    console.error('Please run: npm run test:coverage\n');
    process.exit(1);
  }

  try {
    // Read coverage data
    const coverageData = JSON.parse(fs.readFileSync(coverageFile, 'utf8'));
    const metrics = parseCoverageMetrics(coverageData);
    const gaps = calculateThresholdGaps(metrics);

    // Create snapshot
    const snapshot = {
      timestamp: new Date().toISOString(),
      branch: 'baseline-before-enforcement',
      projectRoot,
      metrics,
      gaps,
    };

    // Write snapshot
    fs.writeFileSync(snapshotFile, JSON.stringify(snapshot, null, 2));

    // Display results
    console.log('📊 Current Coverage Metrics\n');
    console.log(`Files analyzed: ${metrics.fileCount}\n`);

    console.log('Statements:');
    console.log(`  Current: ${metrics.statements.percentage}% (${metrics.statements.covered}/${metrics.statements.total})`);
    console.log(`  Target:  60%`);
    console.log(`  Gap:     ${gaps.statements.gap}% ${gaps.statements.status}\n`);

    console.log('Branches:');
    console.log(`  Current: ${metrics.branches.percentage}% (${metrics.branches.covered}/${metrics.branches.total})`);
    console.log(`  Target:  50%`);
    console.log(`  Gap:     ${gaps.branches.gap}% ${gaps.branches.status}\n`);

    console.log('Functions:');
    console.log(`  Current: ${metrics.functions.percentage}% (${metrics.functions.covered}/${metrics.functions.total})`);
    console.log(`  Target:  60%`);
    console.log(`  Gap:     ${gaps.functions.gap}% ${gaps.functions.status}\n`);

    console.log('Lines:');
    console.log(`  Current: ${metrics.lines.percentage}% (${metrics.lines.covered}/${metrics.lines.total})`);
    console.log(`  Target:  60%`);
    console.log(`  Gap:     ${gaps.lines.gap}% ${gaps.lines.status}\n`);

    console.log(`✅ Snapshot saved: ${snapshotFile}\n`);

  } catch (error) {
    console.error(`\n❌ Error: ${error.message}\n`);
    process.exit(1);
  }
}

main();
