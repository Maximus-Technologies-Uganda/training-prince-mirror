#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const OWNER = 'Maximus-Technologies-Uganda';
const REPO = 'training-prince';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const PARENT_ISSUE_NUMBER = process.argv[2]; // Pass parent issue number as argument

if (!GITHUB_TOKEN) {
  console.error('❌ Error: GITHUB_TOKEN environment variable not set');
  console.error('Set it with: export GITHUB_TOKEN=your_token_here');
  process.exit(1);
}

if (!PARENT_ISSUE_NUMBER) {
  console.error('❌ Error: Parent issue number required');
  console.error('Usage: node create-github-issues.mjs <parent_issue_number>');
  process.exit(1);
}

// Parse tasks from tasks.md
function parseTasksFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const tasks = [];
  
  // Regex to match task lines: - [ ] T### [flags] Description
  const taskRegex = /- \[ \] (T\d{3})\s+(?:\[([^\]]+)\])?\s+(?:\[([^\]]+)\])?\s+(.+?)(?:\n|$)/g;
  
  let match;
  while ((match = taskRegex.exec(content)) !== null) {
    const taskId = match[1];
    const flag1 = match[2] || '';
    const flag2 = match[3] || '';
    const description = match[4].trim();
    
    // Determine if parallelizable and which user story
    const isParallel = flag1.includes('P') || flag2.includes('P');
    const userStory = flag1.includes('US') ? flag1 : (flag2.includes('US') ? flag2 : 'CORE');
    
    tasks.push({
      id: taskId,
      title: `${taskId} - ${description}`,
      description: description,
      isParallel,
      userStory,
      fullLine: match[0]
    });
  }
  
  return tasks;
}

// Create GitHub issue
async function createGitHubIssue(issue) {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/issues`;
  
  const body = `## Task: ${issue.description}

### Details
- **Task ID**: ${issue.id}
- **User Story**: ${issue.userStory}
- **Parallelizable**: ${issue.isParallel ? 'Yes ✅' : 'No'}
- **Parent Issue**: #${PARENT_ISSUE_NUMBER}

### Execution
See parent issue #${PARENT_ISSUE_NUMBER} and [tasks.md](specs/028-week-5-day/tasks.md) for full context.

### Related Documentation
- [Implementation Tasks](specs/028-week-5-day/tasks.md)
- [Quickstart Guide](specs/028-week-5-day/quickstart.md)
- [Specification](specs/028-week-5-day/spec.md)

---
*This issue was auto-generated from tasks.md*`;

  const requestBody = {
    title: issue.title,
    body: body,
    labels: ['028-week-5-day', issue.userStory].filter(Boolean),
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`GitHub API error: ${error.message || response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`❌ Failed to create issue for ${issue.id}:`, error.message);
    throw error;
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting GitHub Issues Creation...\n');
  console.log(`📋 Configuration:`);
  console.log(`   Owner: ${OWNER}`);
  console.log(`   Repo: ${REPO}`);
  console.log(`   Parent Issue: #${PARENT_ISSUE_NUMBER}`);
  console.log(`   Token: ${GITHUB_TOKEN.substring(0, 10)}...${GITHUB_TOKEN.substring(-4)}\n`);

  // Parse tasks
  const tasksFile = path.join(__dirname, 'specs/028-week-5-day/tasks.md');
  const tasks = parseTasksFromFile(tasksFile);
  
  console.log(`📊 Found ${tasks.length} tasks to create\n`);
  console.log('Creating issues:\n');

  // Create issues with rate limiting
  const createdIssues = [];
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    
    try {
      const issue = await createGitHubIssue(task);
      createdIssues.push({
        taskId: task.id,
        issueNumber: issue.number,
        url: issue.html_url
      });
      
      console.log(`✅ [${i + 1}/${tasks.length}] Created #${issue.number} - ${task.id}`);
      successCount++;
      
      // Rate limiting: GitHub allows 5,000 requests/hour
      // Add small delay between requests to be safe
      if (i < tasks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error(`❌ [${i + 1}/${tasks.length}] Failed - ${task.id}`);
      errorCount++;
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`✅ Created ${successCount} issues successfully`);
  if (errorCount > 0) {
    console.log(`❌ Failed to create ${errorCount} issues`);
  }
  console.log(`${'='.repeat(60)}\n`);

  // Save report
  const report = {
    timestamp: new Date().toISOString(),
    parentIssue: PARENT_ISSUE_NUMBER,
    totalTasks: tasks.length,
    successCount,
    errorCount,
    issues: createdIssues
  };

  const reportFile = path.join(__dirname, '.github-issues-report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  console.log(`📝 Report saved to: ${reportFile}\n`);

  console.log('🎉 Next steps:');
  console.log('   1. Go to GitHub Projects → training-prince');
  console.log('   2. Click "Add item"');
  console.log('   3. Search for each issue number from the report');
  console.log('   4. Organize by phase and assignee');
  console.log('   5. Start implementation!');
  console.log('');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
