#!/usr/bin/env node

/**
 * Delete Linear Issues Script
 * 
 * Usage:
 *   LINEAR_API_KEY=your_key node delete-linear-issues.mjs
 */

import https from 'https';

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;

// Issues to delete (PRI-1530 through PRI-1544)
const ISSUES_TO_DELETE = [
  'PRI-1530', 'PRI-1531', 'PRI-1532', 'PRI-1533', 'PRI-1534',
  'PRI-1535', 'PRI-1536', 'PRI-1537', 'PRI-1538', 'PRI-1539',
  'PRI-1540', 'PRI-1541', 'PRI-1542', 'PRI-1543', 'PRI-1544'
];

if (!LINEAR_API_KEY) {
  console.error('❌ Error: LINEAR_API_KEY environment variable not set');
  process.exit(1);
}

/**
 * Make HTTP request to Linear GraphQL API
 */
function linearRequest(query) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query });

    const options = {
      hostname: 'api.linear.app',
      path: '/graphql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': LINEAR_API_KEY,
        'Content-Length': Buffer.byteLength(data),
      },
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          if (parsed.errors) {
            reject(new Error(parsed.errors.map(e => e.message).join(', ')));
          } else {
            resolve(parsed.data);
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

/**
 * Delete an issue
 */
async function deleteIssue(issueId) {
  const query = `
    mutation DeleteIssue {
      issueDelete(id: "${issueId}") {
        success
      }
    }
  `;

  try {
    const result = await linearRequest(query);
    if (result.issueDelete?.success) {
      console.log(`✅ Deleted ${issueId}`);
      return true;
    } else {
      console.log(`⚠️  Could not delete ${issueId} (may not exist)`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error deleting ${issueId}:`, error.message);
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🗑️  Deleting duplicate Linear issues\n');
  console.log(`📊 Issues to delete: ${ISSUES_TO_DELETE.length}\n`);

  let deletedCount = 0;

  for (const issueId of ISSUES_TO_DELETE) {
    const deleted = await deleteIssue(issueId);
    if (deleted) deletedCount++;
    // Rate limit
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log(`\n✨ Deletion complete!`);
  console.log(`📊 Deleted: ${deletedCount}/${ISSUES_TO_DELETE.length}\n`);
  console.log('Now run the creation script again with proper sub-issue linking.\n');
}

main().catch(error => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});
