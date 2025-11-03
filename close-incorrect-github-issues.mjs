#!/usr/bin/env node

/**
 * Close All Incorrectly Created GitHub Issues (Bad Batches Only)
 * KEEPS: Issues from PRI-2338 to PRI-2375 (good Week 4 Finisher tasks)
 * CLOSES: Issues from PRI-1546 to PRI-2337 (bad auto-created batches)
 * 
 * Usage:
 *   GITHUB_TOKEN=your_token node close-incorrect-github-issues.mjs
 */

import https from 'https';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'Maximus-Technologies-Uganda';
const REPO_NAME = 'training-prince';

// Good Linear issues to KEEP
const GOOD_LINEAR_RANGE = { min: 2338, max: 2375 };

if (!GITHUB_TOKEN) {
  console.error('❌ Error: GITHUB_TOKEN environment variable not set');
  console.error('Usage: GITHUB_TOKEN=your_token node close-incorrect-github-issues.mjs');
  process.exit(1);
}

/**
 * Make HTTP request to GitHub API
 */
function githubRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path,
      method,
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Node.js',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

/**
 * Check if an issue is from the good Linear range by parsing the body
 */
function isGoodLinearIssue(issue) {
  if (!issue.body) return false;
  
  // Look for Linear issue reference in body (e.g., "PRI-2345")
  const linearMatch = issue.body.match(/PRI-(\d+)/);
  if (linearMatch) {
    const linearNum = parseInt(linearMatch[1]);
    return linearNum >= GOOD_LINEAR_RANGE.min && linearNum <= GOOD_LINEAR_RANGE.max;
  }
  
  return false;
}

/**
 * Get all open issues created today (all pages)
 */
async function getIncorrectIssues() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];
  
  let allIssues = [];
  let page = 1;
  let hasMore = true;

  console.log(`🔍 Searching for issues created on ${todayStr}...\n`);

  while (hasMore) {
    const path = `/repos/${REPO_OWNER}/${REPO_NAME}/issues?state=open&created>=${todayStr}&sort=created&direction=desc&per_page=100&page=${page}`;

    try {
      const response = await githubRequest('GET', path);
      if (response.status === 200 && Array.isArray(response.data)) {
        const issues = response.data.filter(issue => !issue.pull_request);
        
        if (issues.length === 0) {
          hasMore = false;
        } else {
          allIssues = allIssues.concat(issues);
          page++;
          console.log(`   Found ${issues.length} issues on page ${page - 1}...`);
        }
      } else {
        hasMore = false;
      }
    } catch (error) {
      console.error('Error fetching issues:', error.message);
      hasMore = false;
    }

    // Rate limit between requests
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  return allIssues;
}

/**
 * Close an issue
 */
async function closeIssue(issueNumber) {
  const path = `/repos/${REPO_OWNER}/${REPO_NAME}/issues/${issueNumber}`;
  const body = { state: 'closed' };

  try {
    const response = await githubRequest('PATCH', path, body);
    if (response.status === 200) {
      console.log(`✅ Closed #${issueNumber}`);
      return true;
    } else {
      console.log(`⚠️  Could not close #${issueNumber}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error closing #${issueNumber}:`, error.message);
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  const allIssues = await getIncorrectIssues();

  if (allIssues.length === 0) {
    console.log('\n✨ No issues found to process!\n');
    return;
  }

  // Filter to only bad ones
  const badIssues = allIssues.filter(issue => !isGoodLinearIssue(issue));
  const goodIssues = allIssues.filter(issue => isGoodLinearIssue(issue));

  console.log(`\n📊 Found ${allIssues.length} total issues created today`);
  console.log(`✅ Good issues (to KEEP): ${goodIssues.length}`);
  console.log(`❌ Bad issues (to CLOSE): ${badIssues.length}\n`);

  if (badIssues.length === 0) {
    console.log('✨ No bad issues to close!\n');
    return;
  }

  console.log(`🗑️  Closing ${badIssues.length} incorrect issues...\n`);

  let closedCount = 0;

  for (let i = 0; i < badIssues.length; i++) {
    process.stdout.write(`\r[${i + 1}/${badIssues.length}] Closing...`);
    const closed = await closeIssue(badIssues[i].number);
    if (closed) closedCount++;
    // Rate limit
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n\n✨ Complete!`);
  console.log(`📊 Successfully closed: ${closedCount}/${badIssues.length}`);
  console.log(`✅ Kept: ${goodIssues.length} good issues from PRI-2338 to PRI-2375\n`);
}

main().catch(error => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});
