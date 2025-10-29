#!/usr/bin/env node

/**
 * Create Linear Sub-Issues from tasks.md
 * Feature: 016-week-4-finisher - Configure and Enforce Coverage Thresholds
 * Parent Issue: PRI-1514
 * 
 * Usage: node create-sub-issues-016.mjs
 */

import fs from 'fs';
import path from 'path';

const PARENT_ISSUE = 'PRI-1514';
const TASKS_FILE = './specs/016-week-4-finisher/tasks.md';
const FEATURE = '016-week-4-finisher';

// Task definitions extracted from tasks.md
const TASKS = [
  {
    id: 'T001',
    title: 'Establish Baseline Coverage Snapshot',
    description: 'Capture current coverage before enforcement to understand what code needs more tests and to document the baseline state for transition.',
    file: 'scripts/capture-baseline-coverage.js',
    type: 'setup',
    parallel: false,
    dependencies: [],
  },
  {
    id: 'T002',
    title: 'Create npm Script for Coverage with Thresholds',
    description: 'Ensure `npm run test:coverage` command exists and is configured to enforce thresholds. This script will be used by both local developers and CI.',
    file: 'package.json',
    type: 'setup',
    parallel: false,
    dependencies: ['T001'],
  },
  {
    id: 'T003',
    title: 'Create Vitest Configuration Contract Test',
    description: 'Test that vitest.config.js will be properly structured with thresholds and excludes per contract specification.',
    file: 'tests/contract/vitest-config.test.js',
    type: 'test',
    parallel: true,
    dependencies: ['T002'],
  },
  {
    id: 'T004',
    title: 'Create GitHub Actions CI Contract Test',
    description: 'Test that CI workflow will properly enforce coverage checks and block merges on failure.',
    file: 'tests/contract/github-actions-ci.test.js',
    type: 'test',
    parallel: true,
    dependencies: ['T002'],
  },
  {
    id: 'T005',
    title: 'Create Review-Packet Integration Contract Test',
    description: 'Test that review-packet workflow will integrate coverage artifacts into review-artifacts/.',
    file: 'tests/contract/review-packet.test.js',
    type: 'test',
    parallel: true,
    dependencies: ['T002'],
  },
  {
    id: 'T006',
    title: 'Configure Vitest Coverage Thresholds',
    description: 'Add coverage configuration to vitest.config.js with thresholds (60/50/60/60) and exclusion patterns.',
    file: 'vitest.config.js',
    type: 'config',
    parallel: true,
    dependencies: ['T003'],
  },
  {
    id: 'T007',
    title: 'Update GitHub Actions Checks Workflow',
    description: 'Add or update the coverage check step in CI workflow to enforce thresholds and block merges on failure.',
    file: '.github/workflows/checks.yml',
    type: 'config',
    parallel: true,
    dependencies: ['T004'],
  },
  {
    id: 'T008',
    title: 'Update Review-Packet Workflow for Coverage',
    description: 'Extend review-packet workflow to copy coverage artifacts and integrate into review-artifacts/.',
    file: '.github/workflows/review-packet.yml',
    type: 'config',
    parallel: true,
    dependencies: ['T005'],
  },
  {
    id: 'T009',
    title: 'Verify Exclusion Patterns Work Correctly',
    description: 'Integration test to verify that excluded files (test files, build artifacts, etc.) are NOT counted in coverage metrics.',
    file: 'tests/integration/coverage-exclusions.test.js',
    type: 'integration',
    parallel: false,
    dependencies: ['T006', 'T007', 'T008'],
  },
  {
    id: 'T010',
    title: 'Verify Threshold Enforcement (Pass Scenario)',
    description: 'Integration test verifying that code meeting coverage thresholds allows merge (exit code 0).',
    file: 'tests/integration/coverage-thresholds-pass.test.js',
    type: 'integration',
    parallel: false,
    dependencies: ['T006', 'T007', 'T008'],
  },
  {
    id: 'T011',
    title: 'Document Coverage Policy & Requirements',
    description: 'Update project documentation with coverage threshold requirements and developer workflow.',
    file: 'CONTRIBUTING.md + README.md',
    type: 'docs',
    parallel: false,
    dependencies: ['T009', 'T010'],
  },
  {
    id: 'T012',
    title: 'Validate Vitest Config Test Pass',
    description: 'Run T003 contract test to verify vitest config now passes all validations.',
    file: 'tests/contract/vitest-config.test.js',
    type: 'validation',
    parallel: true,
    dependencies: ['T006'],
  },
  {
    id: 'T013',
    title: 'Validate CI Workflow Test Pass',
    description: 'Run T004 contract test to verify CI workflow properly configured.',
    file: 'tests/contract/github-actions-ci.test.js',
    type: 'validation',
    parallel: true,
    dependencies: ['T007'],
  },
  {
    id: 'T014',
    title: 'Validate Review-Packet Integration Test Pass',
    description: 'Run T005 contract test to verify review-packet workflow integrates coverage.',
    file: 'tests/contract/review-packet.test.js',
    type: 'validation',
    parallel: true,
    dependencies: ['T008'],
  },
  {
    id: 'T015',
    title: 'Run Full Test Suite & Verify All Tests Pass',
    description: 'Execute complete test suite to ensure all contract, integration, and existing tests pass with new coverage configuration.',
    file: 'test runner',
    type: 'summary',
    parallel: false,
    dependencies: ['T012', 'T013', 'T014'],
  },
];

/**
 * Generate Linear sub-issue GraphQL mutation for a task
 */
function generateMutation(task, index) {
  const dependencies = task.dependencies
    .map(dep => `  - ${dep}`)
    .join('\n');

  const description = `
**Feature**: 016-week-4-finisher - Configure and Enforce Coverage Thresholds
**Parent**: ${PARENT_ISSUE}
**Type**: ${task.type}
**File**: ${task.file}
${task.parallel ? '**Parallel**: Yes - can run alongside other [P] tasks\n' : ''}
**Dependencies**: ${task.dependencies.length > 0 ? '\n' + dependencies : 'None'}

${task.description}

## Acceptance Criteria
- ✅ Task completed successfully
- ✅ All acceptance criteria from tasks.md met
- ✅ Code changes committed and pushed
- ✅ Tests passing (if applicable)
- ✅ Documentation updated (if applicable)
`;

  return {
    task: task.id,
    title: `${task.id}: ${task.title}`,
    description: description.trim(),
    priority: task.type === 'setup' ? 1 : task.type === 'validation' ? 2 : 0,
    parentId: PARENT_ISSUE,
    dependencies: task.dependencies,
    parallel: task.parallel,
  };
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Generating Linear Sub-Issues\n');
  console.log(`📌 Parent Issue: ${PARENT_ISSUE}`);
  console.log(`📋 Feature Branch: ${FEATURE}`);
  console.log(`📂 Tasks File: ${TASKS_FILE}`);
  console.log(`📊 Total Tasks: ${TASKS.length}\n`);

  // Verify tasks.md exists
  if (!fs.existsSync(TASKS_FILE)) {
    console.error(`❌ Error: tasks.md not found at ${TASKS_FILE}`);
    process.exit(1);
  }

  console.log('✅ tasks.md found\n');

  // Generate mutations
  const mutations = TASKS.map((task, index) => generateMutation(task, index));

  // Generate summary
  console.log('📋 Sub-Issues to Create:\n');
  mutations.forEach((m, i) => {
    const icon = m.parallel ? '⚡' : '🔗';
    const deps = m.dependencies.length > 0 ? ` (depends: ${m.dependencies.join(', ')})` : '';
    console.log(`${i + 1}. ${icon} ${m.task}: ${m.title}${deps}`);
  });

  console.log('\n');
  console.log('📌 To create these sub-issues in Linear:');
  console.log('');
  console.log('1. Go to: https://github.com/Maximus-Technologies-Uganda/training-prince/actions');
  console.log('2. Find: "Create Linear Sub-Issues (Generic)"');
  console.log('3. Click: "Run workflow"');
  console.log(`4. Enter Parent Issue ID: ${PARENT_ISSUE}`);
  console.log(`5. Enter Tasks File: ${TASKS_FILE}`);
  console.log('6. Click: "Run workflow"');
  console.log('7. Wait ~1 minute for completion\n');

  // Generate markdown output for reference
  const outputFile = `./create-sub-issues-${FEATURE}-output.md`;
  let output = `# Linear Sub-Issues for ${FEATURE}\n\n`;
  output += `**Parent Issue**: ${PARENT_ISSUE}\n`;
  output += `**Created**: ${new Date().toISOString()}\n`;
  output += `**Total Tasks**: ${mutations.length}\n\n`;

  output += '## Task List\n\n';
  mutations.forEach((m, i) => {
    output += `### ${i + 1}. ${m.task}: ${m.title}\n\n`;
    output += `**Type**: ${m.parallel ? 'Parallel' : 'Sequential'}\n`;
    if (m.dependencies.length > 0) {
      output += `**Dependencies**: ${m.dependencies.join(', ')}\n`;
    }
    output += `\n${m.description}\n\n`;
    output += '---\n\n';
  });

  fs.writeFileSync(outputFile, output);
  console.log(`✅ Output saved to: ${outputFile}\n`);

  // Print execution plan
  console.log('📊 Execution Plan:\n');
  console.log('Phase 1 (Setup): T001 → T002');
  console.log('Phase 2 (Tests) [Parallel]: T003 | T004 | T005');
  console.log('Phase 3 (Config) [Parallel]: T006 | T007 | T008');
  console.log('Phase 4 (Integration): T009 → T010 → T011');
  console.log('Phase 5 (Validation) [Parallel]: T012 | T013 | T014');
  console.log('Phase 6 (Summary): T015');
  console.log('\n');

  console.log('✨ Ready to create sub-issues in Linear!\n');
}

main().catch(console.error);
