import https from 'https';

const API_KEY = process.env.LINEAR_API_KEY;
const PARENT_ID = 'PRI-1412';

if (!API_KEY) {
  console.error('❌ LINEAR_API_KEY not set');
  process.exit(1);
}

async function graphqlRequest(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query, variables });
    const req = https.request({
      method: 'POST',
      hostname: 'api.linear.app',
      path: '/graphql',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'Authorization': API_KEY
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.errors) {
            reject(new Error(json.errors.map(e => e.message).join('; ')));
          } else {
            resolve(json.data);
          }
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

const SUB_ISSUES = [
  // Phase 3.1: Setup
  'T001: Create Stopwatch UI module structure in frontend/src/ui-stopwatch/',
  
  // Phase 3.2: Contract Tests [P]
  'T002 [P]: Contract test startTimer() - verify {success, newState}, isRunning=true, localStorage persist',
  'T003 [P]: Contract test stopTimer() - verify {success, newState}, isRunning=false, startTime unchanged',
  'T004 [P]: Contract test resetTimer() - verify reset to {startTime: null, isRunning: false, laps: []}',
  'T005 [P]: Contract test recordLap() - verify lap appended, 100ms debounce, error if not running',
  'T006 [P]: Contract test exportToCSV() - verify filename pattern, headers, 3 columns, HH:MM:SS format',
  'T007 [P]: Contract test restoreState() - verify localStorage read, resumed flag, graceful error handling',
  
  // Phase 3.3: Data Models [P]
  'T008 [P]: Implement TimerState model & validation in frontend/src/ui-stopwatch/models.js',
  'T009 [P]: Implement LapRecord derivation function in frontend/src/ui-stopwatch/models.js',
  'T010 [P]: Implement formatTime(ms) utility in frontend/src/ui-stopwatch/utils.js',
  
  // Phase 3.4: Core Implementation
  'T011: Implement startTimer() in frontend/src/ui-stopwatch/index.js',
  'T012: Implement stopTimer() in frontend/src/ui-stopwatch/index.js',
  'T013: Implement resetTimer() in frontend/src/ui-stopwatch/index.js',
  'T014: Implement recordLap() with 100ms debounce in frontend/src/ui-stopwatch/index.js',
  'T015: Implement exportToCSV() in frontend/src/ui-stopwatch/exporter.js',
  'T016: Implement restoreState() in frontend/src/ui-stopwatch/persistence.js',
  
  // Phase 3.5: Persistence & DOM
  'T017: Implement persistState(state) helper in frontend/src/ui-stopwatch/persistence.js',
  'T018: Create stopwatch.html page in frontend/stopwatch.html',
  
  // Phase 3.6: UI Components [P]
  'T019 [P]: Implement timer display animation in frontend/src/ui-stopwatch/index.js',
  'T020 [P]: Implement lap list rendering in frontend/src/ui-stopwatch/index.js',
  'T021 [P]: Implement button event handlers in frontend/src/ui-stopwatch/index.js',
  'T022 [P]: Style Stopwatch UI with WCAG AA compliance in frontend/src/ui-stopwatch/index.css',
  
  // Phase 3.7: Testing & Integration
  'T023: Write Playwright smoke test in frontend/e2e/stopwatch.spec.ts',
  'T024: Verify unit test coverage ≥40% for ui-stopwatch module',
  'T025: Verify all Vitest unit tests pass in frontend/tests/ui-stopwatch.test.js',
  'T026: Verify Playwright smoke test passes in frontend/e2e/stopwatch.spec.ts',
  
  // Phase 3.8: Accessibility Audit [P]
  'T027 [P]: Audit contrast ratios across all 5 UIs - document in ACCESSIBILITY_AUDIT.md',
  'T028 [P]: Audit keyboard navigation & focus indicators across all 5 UIs',
  'T029 [P]: Audit screen reader labels across all 5 UIs',
  'T030 [P]: Fix contrast issues in CSS to meet WCAG AA standards',
  
  // Phase 3.9: Polish & Validation
  'T031: Fix focus & label issues across all 5 UIs',
  'T032: Verify localStorage edge case handling in private browsing mode',
  'T033: Test CSV export format in Excel/Google Sheets',
  'T034: Generate & update coverage reports for ui-stopwatch module'
];

async function getTeamAndStates() {
  console.log('📋 Getting team info...\n');
  
  const query = `
    query {
      issue(id: "${PARENT_ID}") {
        id
        team {
          id
        }
      }
    }
  `;
  
  const result = await graphqlRequest(query);
  const issue = result.issue;
  
  return { teamId: issue.team.id, parentUUID: issue.id };
}

async function createSubIssue(title, teamId, parentId, inProgressStateId) {
  const mutation = `
    mutation createIssue($title: String!, $teamId: String!, $parentId: String!, $stateId: String) {
      issueCreate(input: {
        title: $title
        teamId: $teamId
        parentId: $parentId
        stateId: $stateId
      }) {
        success
        issue {
          id
          identifier
          title
          state {
            name
          }
        }
      }
    }
  `;
  
  const variables = {
    title,
    teamId,
    parentId,
    stateId: inProgressStateId
  };
  
  try {
    const result = await graphqlRequest(mutation, variables);
    if (result.issueCreate?.success) {
      console.log(`  ✅ ${result.issueCreate.issue.identifier} - ${result.issueCreate.issue.title} [${result.issueCreate.issue.state.name}]`);
      return { success: true, identifier: result.issueCreate.issue.identifier };
    } else {
      console.log(`  ⚠️  ${title} - creation returned false`);
      return { success: false };
    }
  } catch (err) {
    console.error(`  ❌ ${title} - ${err.message.substring(0, 80)}`);
    return { success: false };
  }
}

async function main() {
  try {
    console.log('\n🚀 CREATING SUB-ISSUES UNDER PRI-1412\n');
    console.log('═'.repeat(80));
    console.log('   Thursday - Stopwatch UI Implementation & Accessibility Polish');
    console.log('═'.repeat(80));
    
    // Get team and parent UUID
    const { teamId, parentUUID } = await getTeamAndStates();
    
    // Get In Progress state ID
    console.log('📍 Getting "In Progress" state...');
    const statesQuery = `
      query GetStates($teamId: String!) {
        team(id: $teamId) {
          states(first: 100) {
            nodes { id name }
          }
        }
      }
    `;
    const statesResult = await graphqlRequest(statesQuery, { teamId });
    const inProgressState = statesResult.team?.states?.nodes?.find(s => 
      s.name.toLowerCase() === 'in progress' || s.name.toLowerCase() === 'in-progress'
    );
    const inProgressStateId = inProgressState?.id;
    
    if (inProgressStateId) {
      console.log(`✅ Found In Progress state: ${inProgressState.name}\n`);
    } else {
      console.log('⚠️  In Progress state not found, issues will use team default\n');
    }
    
    console.log(`\n📊 Creating ${SUB_ISSUES.length} sub-issues...\n`);
    
    let successful = 0;
    const results = [];
    
    for (const title of SUB_ISSUES) {
      const result = await createSubIssue(title, teamId, parentUUID, inProgressStateId);
      if (result.success) {
        successful++;
        results.push({ taskId: title.split(':')[0], linearId: result.identifier });
      }
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    console.log('\n' + '═'.repeat(80));
    console.log(`\n✅ CREATION COMPLETE!\n`);
    console.log(`   Successfully created: ${successful}/${SUB_ISSUES.length}`);
    console.log(`   Parent issue: ${PARENT_ID}`);
    console.log(`   Default status: In Progress`);
    console.log('\n📋 Task → Linear Issue Mapping:\n');
    
    results.forEach(r => {
      console.log(`   ${r.taskId} → ${r.linearId}`);
    });
    
    console.log('\n💡 Refresh Linear to see the new sub-issues (may take 10-30 seconds)\n');
    console.log('═'.repeat(80));
    console.log('\n🎯 Next Steps:');
    console.log('   1. Begin with Phase 3.2 contract tests (T002-T007) - these must FAIL first');
    console.log('   2. Run tests in parallel: npm run test:vitest');
    console.log('   3. Implement core functions (T011-T016) to make tests pass');
    console.log('   4. Follow dependency order in tasks.md\n');
    
  } catch (err) {
    console.error('❌ Critical error:', err.message);
    process.exit(1);
  }
}

main();
