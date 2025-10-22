import https from 'https';

const API_KEY = process.env.LINEAR_API_KEY;
const ISSUE_ID = 'PRI-289';

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
          console.error('Response:', data);
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  try {
    console.log('🔍 Getting PRI-289...');
    const issueQuery = `
      query GetIssue($id: String!) {
        issue(id: $id) {
          id
          identifier
          title
          team {
            id
          }
          state {
            id
            name
          }
        }
      }
    `;
    
    const issueResult = await graphqlRequest(issueQuery, { id: ISSUE_ID });
    const issue = issueResult.issue;
    
    if (!issue) {
      throw new Error(`Issue ${ISSUE_ID} not found`);
    }
    
    console.log(`✅ Found: ${issue.identifier} - ${issue.title}`);
    console.log(`   Current state: ${issue.state.name}`);
    
    if (issue.state.name === 'In Progress') {
      console.log('✅ Already in "In Progress" state');
      return;
    }
    
    console.log('🔍 Getting team states...');
    const statesQuery = `
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
    
    const statesResult = await graphqlRequest(statesQuery, { teamId: issue.team.id });
    const inProgressState = statesResult.team.states.nodes.find(
      s => s.name.toLowerCase() === 'in progress'
    );
    
    if (!inProgressState) {
      throw new Error('In Progress state not found on team');
    }
    
    console.log(`✅ Found "In Progress" state: ${inProgressState.id}`);
    
    console.log('📝 Updating issue state...');
    const updateQuery = `
      mutation UpdateIssue($id: String!, $input: IssueUpdateInput!) {
        issueUpdate(id: $id, input: $input) {
          success
          issue {
            id
            identifier
            state {
              id
              name
            }
          }
        }
      }
    `;
    
    const updateResult = await graphqlRequest(updateQuery, {
      id: issue.id,
      input: {
        stateId: inProgressState.id
      }
    });
    
    if (updateResult.issueUpdate.success) {
      console.log('✅ Successfully updated!');
      console.log(`   ${updateResult.issueUpdate.issue.identifier} → ${updateResult.issueUpdate.issue.state.name}`);
    } else {
      throw new Error('Update returned success: false');
    }
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

main();
