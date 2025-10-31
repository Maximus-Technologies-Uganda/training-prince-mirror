import https from 'https';

const API_KEY = process.env.LINEAR_API_KEY;
const OLD_PARENT = 'PRI-289';
const NEW_PARENT = 'PRI-1112';

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

async function getSubIssues() {
  console.log(`🔍 Fetching sub-issues from ${OLD_PARENT}...\n`);
  
  const query = `
    query {
      issue(id: "${OLD_PARENT}") {
        identifier
        children(first: 100) {
          nodes {
            id
            identifier
            title
            state {
              id
              name
            }
          }
        }
      }
    }
  `;
  
  const result = await graphqlRequest(query);
  return result.issue.children.nodes;
}

async function getTeamStates(teamId) {
  const query = `
    query {
      team(id: "${teamId}") {
        states(first: 100) {
          nodes {
            id
            name
          }
        }
      }
    }
  `;
  
  const result = await graphqlRequest(query);
  const doneState = result.team.states.nodes.find(s => s.name.toLowerCase() === 'done');
  return doneState;
}

async function getNewParentTeam() {
  console.log(`📋 Getting team info for ${NEW_PARENT}...\n`);
  
  const query = `
    query {
      issue(id: "${NEW_PARENT}") {
        id
        team {
          id
        }
      }
    }
  `;
  
  const result = await graphqlRequest(query);
  return result.issue.team.id;
}

async function updateSubIssue(issueId, issueIdentifier, newParentId, doneStateId) {
  const query = `
    mutation {
      issueUpdate(id: "${issueId}", input: {
        parentId: "${newParentId}",
        stateId: "${doneStateId}"
      }) {
        success
        issue {
          id
          identifier
          parent {
            identifier
          }
          state {
            name
          }
        }
      }
    }
  `;
  
  try {
    const result = await graphqlRequest(query);
    if (result.issueUpdate?.success) {
      console.log(`  ✅ ${issueIdentifier} → Parent: ${result.issueUpdate.issue.parent?.identifier || 'None'}, State: ${result.issueUpdate.issue.state.name}`);
      return true;
    } else {
      console.log(`  ⚠️  ${issueIdentifier} - update returned false`);
      return false;
    }
  } catch (err) {
    console.error(`  ❌ ${issueIdentifier} - ${err.message.substring(0, 80)}`);
    return false;
  }
}

async function main() {
  try {
    // Step 1: Get sub-issues from old parent
    const subIssues = await getSubIssues();
    console.log(`Found ${subIssues.length} sub-issues\n`);
    
    // Step 2: Get new parent's team
    const newParentTeamId = await getNewParentTeam();
    
    // Step 3: Get Done state for that team
    const doneState = await getTeamStates(newParentTeamId);
    
    if (!doneState) {
      console.error('❌ Could not find "Done" state on team');
      process.exit(1);
    }
    
    console.log(`Found Done state: ${doneState.name}\n`);
    console.log('═'.repeat(70));
    console.log('\n🚀 MIGRATING SUB-ISSUES:\n');
    
    // Step 4: Re-parent and update all sub-issues
    let successful = 0;
    for (const issue of subIssues) {
      const success = await updateSubIssue(issue.id, issue.identifier, NEW_PARENT, doneState.id);
      if (success) successful++;
    }
    
    console.log('\n' + '═'.repeat(70));
    console.log(`\n✅ MIGRATION COMPLETE!`);
    console.log(`   Successfully migrated: ${successful}/${subIssues.length}`);
    console.log(`   New parent: ${NEW_PARENT}`);
    console.log(`   Old parent: ${OLD_PARENT} (can now be deleted or archived)`);
    console.log('\n💡 Refresh Linear to see changes (may take 10-30 seconds)\n');
    
  } catch (err) {
    console.error('❌ Critical error:', err.message);
    process.exit(1);
  }
}

main();
