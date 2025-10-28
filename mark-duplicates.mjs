import https from 'https';

const API_KEY = process.env.LINEAR_API_KEY;
const PARENT_ID = 'PRI-1447';

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

async function findDuplicates() {
  console.log('🔍 Finding duplicate issues...\n');
  
  // Get all sub-issues under PRI-1447
  const subIssuesQuery = `
    query {
      issue(id: "${PARENT_ID}") {
        id
        identifier
        children(first: 100) {
          nodes {
            id
            identifier
            title
          }
        }
      }
    }
  `;
  
  const result = await graphqlRequest(subIssuesQuery);
  const subIssues = result.issue.children.nodes;
  
  console.log(`✅ Found ${subIssues.length} sub-issues under ${PARENT_ID}\n`);
  console.log('Sub-issues that should be kept:');
  subIssues.forEach(issue => {
    console.log(`  ${issue.identifier}: ${issue.title}`);
  });
  
  console.log('\n📋 Task IDs to look for duplicates:');
  const taskIds = subIssues.map(issue => {
    const match = issue.title.match(/^(T\d+)/);
    return match ? match[1] : null;
  }).filter(Boolean);
  
  console.log(`Found task IDs: ${taskIds.join(', ')}\n`);
  
  // Search for duplicate issues (those NOT under PRI-1447)
  console.log('🔎 Searching for duplicate standalone issues...\n');
  
  const duplicates = [];
  
  for (const taskId of taskIds) {
    // Search for issues with this task ID
    const searchQuery = `
      query {
        issues(first: 50, filter: {
          title: { contains: "${taskId}:" }
        }) {
          nodes {
            id
            identifier
            title
            parent { id }
          }
        }
      }
    `;
    
    const searchResult = await graphqlRequest(searchQuery);
    const foundIssues = searchResult.issues.nodes;
    
    // Filter to find duplicates (not under PRI-1447, not the parent itself)
    const dupIssues = foundIssues.filter(issue => 
      issue.parent?.id !== PARENT_ID && 
      issue.identifier !== PARENT_ID &&
      !issue.parent // Standalone issues
    );
    
    if (dupIssues.length > 0) {
      dupIssues.forEach(dup => {
        duplicates.push({
          id: dup.id,
          identifier: dup.identifier,
          title: dup.title,
          taskId: taskId
        });
      });
    }
  }
  
  return { subIssues, duplicates };
}

async function markAsDuplicate(issueId, duplicateOfId) {
  const mutation = `
    mutation {
      issueUpdate(id: "${issueId}", input: {
        relationRelationId: "${duplicateOfId}"
      }) {
        issue {
          identifier
        }
      }
    }
  `;
  
  try {
    await graphqlRequest(mutation);
    return true;
  } catch (err) {
    console.error(`  ❌ Failed to mark duplicate: ${err.message}`);
    return false;
  }
}

async function main() {
  try {
    console.log('\n🚀 CLEANING UP DUPLICATE ISSUES\n');
    console.log('═'.repeat(70));
    
    const { subIssues, duplicates } = await findDuplicates();
    
    if (duplicates.length === 0) {
      console.log('\n✅ No duplicates found! All sub-issues are properly organized under PRI-1447\n');
      return;
    }
    
    console.log(`\n⚠️  Found ${duplicates.length} duplicate issues\n`);
    console.log('═'.repeat(70));
    console.log('\nDuplicate issues to mark:\n');
    
    duplicates.forEach(dup => {
      console.log(`  ${dup.identifier}: ${dup.title}`);
    });
    
    console.log('\n═'.repeat(70));
    console.log(`\n📌 Marking ${duplicates.length} issues as duplicates...\n`);
    
    let marked = 0;
    for (const dup of duplicates) {
      // Find the corresponding sub-issue to mark as duplicate of
      const masterIssue = subIssues.find(sub => 
        sub.title.includes(dup.taskId)
      );
      
      if (masterIssue) {
        console.log(`  Marking ${dup.identifier} as duplicate of ${masterIssue.identifier}`);
        const success = await markAsDuplicate(dup.id, masterIssue.id);
        if (success) marked++;
      }
    }
    
    console.log('\n' + '═'.repeat(70));
    console.log(`\n✅ Marked ${marked}/${duplicates.length} issues as duplicates\n`);
    console.log('📋 Next steps:');
    console.log(`  1. Go to Linear: https://linear.app/coding-mystery/issue/${PARENT_ID}`);
    console.log('  2. Verify all sub-issues are under parent');
    console.log('  3. Duplicates should now be marked and consolidated\n');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

main();
