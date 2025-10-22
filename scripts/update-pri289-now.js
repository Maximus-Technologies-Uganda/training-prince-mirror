#!/usr/bin/env node

import https from 'https';
import { execSync } from 'child_process';

// Get API key from 1Password or ask user
let API_KEY = process.env.LINEAR_API_KEY;

if (!API_KEY) {
  console.log('Looking for LINEAR_API_KEY in 1Password...');
  try {
    API_KEY = execSync('op read "op://Prince Training/Linear API Key/credential" 2>/dev/null || echo ""').toString().trim();
  } catch (e) {
    // Silent fail
  }
}

if (!API_KEY) {
  console.error('❌ LINEAR_API_KEY not found in environment or 1Password');
  console.error('   Set it: export LINEAR_API_KEY="your_key"');
  process.exit(1);
}

async function graphqlRequest(query, variables) {
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
        } catch (err) {
          reject(err);
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
    console.log('🔍 Getting PRI-289 issue...');
    const issueData = await graphqlRequest(
      `query($identifier: String!) {
        issue(id: $identifier) {
          id identifier team { id name }
        }
      }`,
      { identifier: 'PRI-289' }
    );

    const issue = issueData.issue;
    console.log(`✅ Found: ${issue.identifier} (Team: ${issue.team.name})`);

    console.log('🔍 Getting team states...');
    const statesData = await graphqlRequest(
      `query($teamId: String!) {
        team(id: $teamId) {
          states(first: 100) {
            nodes { id name }
          }
        }
      }`,
      { teamId: issue.team.id }
    );

    const inProgressState = statesData.team.states.nodes.find(
      s => s.name.toLowerCase() === 'in progress'
    );

    if (!inProgressState) {
      throw new Error('In Progress state not found on team');
    }

    console.log('📝 Updating status to "In Progress"...');
    await graphqlRequest(
      `mutation($input: IssueUpdateInput!) {
        issueUpdate(id: $input) { success }
      }`,
      {
        input: {
          id: issue.id,
          stateId: inProgressState.id
        }
      }
    );

    console.log('\n✅ PRI-289 status updated to "In Progress"!\n');

  } catch (err) {
    console.error(`\n❌ Error: ${err.message}\n`);
    process.exit(1);
  }
}

main();
