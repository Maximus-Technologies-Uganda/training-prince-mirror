import https from 'https';

const API_KEY = process.env.LINEAR_API_KEY;

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
            const errorMsg = json.errors.map(e => {
              if (e.message) return e.message;
              return JSON.stringify(e);
            }).join('; ');
            console.error('GraphQL Errors:', errorMsg);
            reject(new Error(errorMsg));
          } else {
            resolve(json.data);
          }
        } catch (e) {
          console.error('Parse error:', e.message);
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function updateTaskStatus(issueId, isDone = true) {
  const stateQuery = `
    query GetTeamStates($teamId: String!) {
      team(id: $teamId) {
        states(first: 100) {
          nodes {
            id
            name
          }
        }
      }
    }
  `;

  // First get the issue to find its team
  const issueQuery = `
    query GetIssue($id: String!) {
      issue(id: $id) {
        id
        identifier
        team {
          id
        }
        state {
          name
        }
      }
    }
  `;

  const issueResult = await graphqlRequest(issueQuery, { id: issueId });
  const issue = issueResult.issue;

  if (!issue) {
    console.log(`⚠️  Issue ${issueId} not found`);
    return false;
  }

  // Get states for the team
  const statesResult = await graphqlRequest(stateQuery, { teamId: issue.team.id });
  const targetState = isDone
    ? statesResult.team.states.nodes.find(s => s.name.toLowerCase() === 'done')
    : statesResult.team.states.nodes.find(s => s.name.toLowerCase() === 'in progress');

  if (!targetState) {
    console.log(`⚠️  Target state not found for ${issue.identifier}`);
    return false;
  }

  if (issue.state.name.toLowerCase() === targetState.name.toLowerCase()) {
    console.log(`✅ ${issue.identifier} already in "${targetState.name}" state`);
    return true;
  }

  // Update the issue
  const updateQuery = `
    mutation UpdateIssue($id: String!, $input: IssueUpdateInput!) {
      issueUpdate(id: $id, input: $input) {
        success
        issue {
          id
          identifier
          state {
            name
          }
        }
      }
    }
  `;

  const updateResult = await graphqlRequest(updateQuery, {
    id: issue.id,
    input: { stateId: targetState.id }
  });

  if (updateResult.issueUpdate.success) {
    console.log(`✅ ${issue.identifier} → ${updateResult.issueUpdate.issue.state.name}`);
    return true;
  } else {
    console.log(`❌ Failed to update ${issue.identifier}`);
    return false;
  }
}

async function main() {
  try {
    console.log('📝 Updating Linear task statuses...\n');

    // Tasks completed:
    // Phase 1 (Tasks 1-5): All complete - mark as DONE
    // Phase 2 (Tasks 6-12): All complete - mark as DONE
    // Phase 3 (Tasks 13-16): All complete - mark as DONE

    const tasksToMark = [
      'PRI-289', // Parent issue - mark as In Progress
    ];

    for (const taskId of tasksToMark) {
      try {
        await updateTaskStatus(taskId, false); // Mark as In Progress (or Done later)
      } catch (err) {
        console.error(`Error updating ${taskId}:`, err.message);
      }
    }

    console.log('\n✅ Linear status update complete!');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

main();
