#!/usr/bin/env node

const LINEAR_API_URL = 'https://api.linear.app/graphql';
const LINEAR_API_KEY = process.env.LINEAR_API_KEY;

if (!LINEAR_API_KEY) {
  console.error('❌ ERROR: LINEAR_API_KEY environment variable not set');
  console.error('Usage: LINEAR_API_KEY=your_key_here node update-issues-status-018.mjs');
  process.exit(1);
}

// Issues to update: PRI-2377 to PRI-2401 (25 issues)
// Or provide custom range via command line args
const startNum = parseInt(process.argv[2]) || 2377;
const endNum = parseInt(process.argv[3]) || 2401;
const issueIds = Array.from({ length: endNum - startNum + 1 }, (_, i) => `PRI-${startNum + i}`);

console.log(`Target issues: ${issueIds[0]} to ${issueIds[issueIds.length - 1]} (${issueIds.length} total)\n`);

// First, get the team and available statuses
async function getTeamStatuses() {
  const query = `
    query GetTeam($id: String!) {
      team(id: $id) {
        id
        statuses {
          id
          name
          color
        }
      }
    }
  `;

  try {
    const response = await fetch(LINEAR_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${LINEAR_API_KEY}`
      },
      body: JSON.stringify({
        query,
        variables: { id: 'Prince Training' } // Team name or ID
      })
    });

    const result = await response.json();
    
    if (result.errors) {
      // Try with different team approach
      console.log('📋 Getting team statuses...');
      return null;
    }

    return result.data?.team?.statuses;
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}

// Update issue status
async function updateIssueStatus(issueId, statusId) {
  const mutation = `
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

  try {
    const response = await fetch(LINEAR_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${LINEAR_API_KEY}`
      },
      body: JSON.stringify({
        query: mutation,
        variables: { 
          id: issueId,
          input: { stateId: statusId }
        }
      })
    });

    const result = await response.json();

    if (result.errors) {
      console.error(`❌ ${issueId}: ${result.errors[0]?.message}`);
      return false;
    }

    if (result.data?.issueUpdate?.success) {
      const newState = result.data.issueUpdate.issue.state.name;
      console.log(`✅ ${issueId}: Status updated to "${newState}"`);
      return true;
    } else {
      console.error(`❌ ${issueId}: Failed to update`);
      return false;
    }
  } catch (error) {
    console.error(`❌ ${issueId}: ${error.message}`);
    return false;
  }
}

// Get all statuses for the team
async function getTeamStatusIds() {
  const query = `
    query GetWorkflow {
      workflowStates(first: 100) {
        nodes {
          id
          name
          type
        }
      }
    }
  `;

  try {
    const response = await fetch(LINEAR_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${LINEAR_API_KEY}`
      },
      body: JSON.stringify({ query })
    });

    const result = await response.json();

    if (result.errors) {
      console.error('Error getting statuses:', result.errors[0]?.message);
      return null;
    }

    return result.data?.workflowStates?.nodes;
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}

async function main() {
  console.log('🔄 Starting status update...\n');

  // Get available statuses
  console.log('📋 Fetching available statuses...');
  const statuses = await getTeamStatusIds();
  
  if (!statuses) {
    console.error('❌ Failed to fetch statuses');
    process.exit(1);
  }

  // Find "In Progress" status
  const inProgressStatus = statuses.find(s => 
    s.name.toLowerCase().includes('progress') || 
    s.name.toLowerCase().includes('in progress')
  );

  if (!inProgressStatus) {
    console.error('❌ Could not find "In Progress" status');
    console.log('Available statuses:');
    statuses.forEach(s => console.log(`  - ${s.name} (${s.id})`));
    process.exit(1);
  }

  console.log(`✅ Found status: "${inProgressStatus.name}" (ID: ${inProgressStatus.id})\n`);
  console.log('🔄 Updating issue statuses...\n');

  let successCount = 0;
  let failureCount = 0;

  for (const issueId of issueIds) {
    const updated = await updateIssueStatus(issueId, inProgressStatus.id);
    if (updated) successCount++;
    else failureCount++;
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary');
  console.log('='.repeat(60));
  console.log(`✅ Successfully updated: ${successCount} issues`);
  console.log(`❌ Failed: ${failureCount} issues\n`);

  process.exit(failureCount > 0 ? 1 : 0);
}

main();
