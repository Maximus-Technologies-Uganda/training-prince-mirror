import https from 'https';

const API_KEY = process.env.LINEAR_API_KEY;
const PARENT_ID = 'PRI-1112';

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
  'Create filterUtils.js module with filter function stubs',
  'Write Vitest unit tests for expense filtering logic',
  'Write Vitest unit tests for to-do filtering logic',
  'Write Playwright E2E smoke test for expense filtering',
  'Write Playwright E2E smoke test for to-do filtering',
  'Implement filterExpensesByCategory() to make tests pass',
  'Implement filterExpensesByMonth() to make tests pass',
  'Implement filterExpensesByBoth() with AND logic',
  'Implement filterTodosByStatus() to make tests pass',
  'Implement filterTodosByPriority() to make tests pass',
  'Implement filterTodosByBoth() with AND logic',
  'Implement detectEmptyState() helper function',
  'Create ExpenseFilter React component with category & month dropdowns',
  'Create ExpenseEmptyState component with icon & CTA button',
  'Create TodoFilter component with status tabs & priority dropdown',
  'Create TodoEmptyState component with icon & CTA button',
  'Integrate ExpenseFilter component into expense page UI',
  'Add filtering logic to ExpenseList component',
  'Integrate TodoFilter component into to-do page UI',
  'Add filtering logic to TodoList component',
  'Run Vitest unit tests and verify ≥50% coverage for UI modules',
  'Run Playwright E2E smoke tests for filter functionality',
  'Manually validate all quickstart test scenarios (12 scenarios)',
  'Generate coverage reports and prepare PR documentation'
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

async function createSubIssue(title, teamId, parentId) {
  const mutation = `
    mutation createIssue($title: String!, $teamId: String!, $parentId: String!) {
      issueCreate(input: {
        title: $title
        teamId: $teamId
        parentId: $parentId
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
    parentId
  };
  
  try {
    const result = await graphqlRequest(mutation, variables);
    if (result.issueCreate?.success) {
      console.log(`  ✅ ${result.issueCreate.issue.identifier} - ${result.issueCreate.issue.title}`);
      return true;
    } else {
      console.log(`  ⚠️  ${title} - creation returned false`);
      return false;
    }
  } catch (err) {
    console.error(`  ❌ ${title} - ${err.message.substring(0, 80)}`);
    return false;
  }
}

async function main() {
  try {
    console.log('\n🚀 CREATING SUB-ISSUES UNDER PRI-1112\n');
    console.log('═'.repeat(70));
    
    // Get team and done state
    const { teamId, parentUUID } = await getTeamAndStates();
    
    console.log(`\n📊 Creating ${SUB_ISSUES.length} sub-issues...\n`);
    
    let successful = 0;
    for (const title of SUB_ISSUES) {
      const success = await createSubIssue(title, teamId, parentUUID);
      if (success) successful++;
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log('\n' + '═'.repeat(70));
    console.log(`\n✅ CREATION COMPLETE!`);
    console.log(`   Successfully created: ${successful}/${SUB_ISSUES.length}`);
    console.log(`   Parent: ${PARENT_ID}`);
    console.log(`   Status: Default (Backlog)`);
    console.log('\n💡 Refresh Linear to see the new sub-issues (may take 10-30 seconds)\n');
    
  } catch (err) {
    console.error('❌ Critical error:', err.message);
    process.exit(1);
  }
}

main();
