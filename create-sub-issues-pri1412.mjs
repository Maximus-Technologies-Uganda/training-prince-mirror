import https from 'https';
import fs from 'fs';

const API_KEY = process.env.LINEAR_API_KEY;
const PARENT_ID = process.env.PARENT_ID || 'PRI-1412';
const TASKS_FILE = process.env.TASKS_FILE || 'specs/014-thursday-stopwatch-ui/tasks.md';

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

// Parse tasks.md dynamically to extract task titles
function getSubIssues(tasksFile) {
  if (!fs.existsSync(tasksFile)) {
    console.error(`❌ Tasks file not found: ${tasksFile}`);
    process.exit(1);
  }
  
  const content = fs.readFileSync(tasksFile, 'utf8');
  const tasks = [];
  
  // Match task lines: - [ ] **T001** ... or - [x] **T001** ...
  const taskRegex = /- \[.\] \*\*([T\d]+)\*\*\s+(.+?)(?:\n|$)/g;
  let match;
  
  while ((match = taskRegex.exec(content)) !== null) {
    const [, taskId, description] = match;
    tasks.push(`${taskId}: ${description.trim()}`);
  }
  
  return tasks;
}

const SUB_ISSUES = getSubIssues(TASKS_FILE);

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
    console.log('\n🚀 CREATING SUB-ISSUES UNDER ' + PARENT_ID + '\n');
    console.log('═'.repeat(80));
    console.log('   Final Polish and Documentation Export');
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
    console.log('   1. Go to Linear: https://linear.app/coding-mystery/issue/' + PARENT_ID);
    console.log('   2. Begin implementation following the dependency order');
    console.log('   3. Update Linear status as you complete tasks\n');
    
  } catch (err) {
    console.error('❌ Critical error:', err.message);
    process.exit(1);
  }
}

main();
