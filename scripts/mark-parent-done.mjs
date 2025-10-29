#!/usr/bin/env node

import https from 'https';

const API_KEY = process.env.LINEAR_API_KEY;
const PARENT_ID = process.argv[2] || 'PRI-1447';

if (!API_KEY) {
  console.error('❌ Error: LINEAR_API_KEY environment variable not set');
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

async function fetchSubIssues(parentId) {
  const query = `
    query {
      issue(id: "${parentId}") {
        id
        identifier
        title
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
  if (!result.issue) {
    throw new Error(`Parent issue ${parentId} not found`);
  }
  return result.issue;
}

async function getDoneState() {
  const query = `
    query {
      workflowStates(first: 50, filter: { name: { eq: "Done" } }) {
        nodes {
          id
          name
        }
      }
    }
  `;
  
  const result = await graphqlRequest(query);
  const doneState = result.workflowStates?.nodes?.[0];
  if (!doneState) {
    throw new Error('Could not find "Done" state in workflow');
  }
  return doneState;
}

async function markIssueDone(issueId, stateId) {
  const mutation = `
    mutation UpdateIssue($issueId: String!, $stateId: String!) {
      issueUpdate(id: $issueId, input: { stateId: $stateId }) {
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
  
  const result = await graphqlRequest(mutation, { issueId, stateId });
  return result.issueUpdate?.issue || null;
}

async function main() {
  try {
    console.log('\n✅ MARKING ALL SUB-ISSUES AS DONE\n');
    console.log(`📋 Parent Issue: ${PARENT_ID}\n`);
    
    console.log('⏳ Fetching sub-issues...');
    const parent = await fetchSubIssues(PARENT_ID);
    const subIssues = parent.children.nodes;
    
    console.log(`✅ Found ${subIssues.length} sub-issues\n`);
    
    console.log('🔍 Getting Done state...');
    const doneState = await getDoneState();
    console.log(`✅ Found state: ${doneState.name}\n`);
    
    // Filter issues that are not already done
    const issuesToMark = subIssues.filter(issue => issue.state.name !== 'Done');
    
    if (issuesToMark.length === 0) {
      console.log('✨ All issues are already marked as Done!\n');
      return;
    }
    
    console.log(`📌 Marking ${issuesToMark.length} issues as Done...\n`);
    
    let marked = 0;
    for (const issue of issuesToMark) {
      try {
        const updated = await markIssueDone(issue.id, doneState.id);
        if (updated) {
          console.log(`  ✅ ${issue.identifier}: ${issue.title.substring(0, 50)}`);
          marked++;
        }
      } catch (err) {
        console.log(`  ❌ ${issue.identifier}: ${err.message}`);
      }
    }
    
    console.log('\n' + '═'.repeat(70));
    console.log(`\n✅ Marked ${marked}/${issuesToMark.length} issues as Done\n`);
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

main();
