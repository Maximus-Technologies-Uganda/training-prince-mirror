#!/usr/bin/env node

/**
 * Delete Incorrectly Created Linear Issues (Bad Batches Only)
 * KEEPS: PRI-2338 to PRI-2375 (the good Week 4 Finisher tasks)
 * DELETES: PRI-1546 to PRI-2337 (bad auto-created batches)
 * 
 * Usage:
 *   LINEAR_API_KEY=your_key node delete-incorrect-issues.mjs
 */

import https from 'https';

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;

// Only delete the bad batches, skip the good ones (PRI-2338 to PRI-2375)
const BATCH_1 = Array.from({ length: 396 }, (_, i) => `PRI-${1546 + i}`);  // PRI-1546 to PRI-1941
const BATCH_2 = Array.from({ length: 397 }, (_, i) => `PRI-${1942 + i}`);  // PRI-1942 to PRI-2338 (EXCLUDE PRI-2338!)
const ISSUES_TO_DELETE = [...BATCH_1, ...BATCH_2.slice(0, -1)];  // Remove the last one (PRI-2338)

if (!LINEAR_API_KEY) {
  console.error('❌ Error: LINEAR_API_KEY environment variable not set');
  console.error('Usage: LINEAR_API_KEY=your_key node delete-incorrect-issues.mjs');
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
      console.log(`⚠️  Could not delete ${issueId}`);
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
  console.log('🗑️  Deleting incorrectly created Linear issues\n');
  console.log(`📊 Issues to DELETE (bad batches):`);
  console.log(`   - Batch 1: PRI-1546 to PRI-1941 (396 issues)`);
  console.log(`   - Batch 2: PRI-1942 to PRI-2337 (396 issues)`);
  console.log(`   - Total: ${ISSUES_TO_DELETE.length} issues\n`);
  console.log(`✅ Issues to KEEP (good ones):`);
  console.log(`   - PRI-2338 to PRI-2375 (37 Week 4 Finisher tasks)\n`);

  let deletedCount = 0;
  let index = 0;

  for (const issueId of ISSUES_TO_DELETE) {
    index++;
    process.stdout.write(`\r[${index}/${ISSUES_TO_DELETE.length}] Processing...`);
    const deleted = await deleteIssue(issueId);
    if (deleted) deletedCount++;
    // Rate limit to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n\n✨ Deletion complete!`);
  console.log(`📊 Successfully deleted: ${deletedCount}/${ISSUES_TO_DELETE.length}`);
  console.log(`✅ Kept: PRI-2338 to PRI-2375 (37 good issues)\n`);
}

main().catch(error => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});
