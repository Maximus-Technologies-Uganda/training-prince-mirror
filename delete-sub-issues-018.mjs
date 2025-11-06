#!/usr/bin/env node

const LINEAR_API_URL = 'https://api.linear.app/graphql';
const LINEAR_API_KEY = process.env.LINEAR_API_KEY;

if (!LINEAR_API_KEY) {
  console.error('❌ ERROR: LINEAR_API_KEY environment variable not set');
  console.error('Usage: LINEAR_API_KEY=your_key_here node delete-sub-issues-018.mjs');
  process.exit(1);
}

// Issues to delete: PRI-2377 to PRI-2401 (25 issues)
const issueIds = Array.from({ length: 25 }, (_, i) => `PRI-${2377 + i}`);

async function deleteIssue(issueId) {
  const mutation = `
    mutation DeleteIssue($id: String!) {
      issueDelete(id: $id) {
        success
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
        variables: { id: issueId }
      })
    });

    const result = await response.json();

    if (result.errors) {
      console.error(`❌ ${issueId}: ${result.errors[0]?.message}`);
      return false;
    }

    if (result.data?.issueDelete?.success) {
      console.log(`✅ Deleted: ${issueId}`);
      return true;
    } else {
      console.error(`❌ ${issueId}: Failed to delete`);
      return false;
    }
  } catch (error) {
    console.error(`❌ ${issueId}: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🗑️  Starting deletion of mistakenly created issues...\n');
  console.log(`Issues to delete: ${issueIds.join(', ')}\n`);

  let successCount = 0;
  let failureCount = 0;

  for (const issueId of issueIds) {
    const deleted = await deleteIssue(issueId);
    if (deleted) successCount++;
    else failureCount++;
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary');
  console.log('='.repeat(60));
  console.log(`✅ Successfully deleted: ${successCount} issues`);
  console.log(`❌ Failed: ${failureCount} issues\n`);

  process.exit(failureCount > 0 ? 1 : 0);
}

main();
