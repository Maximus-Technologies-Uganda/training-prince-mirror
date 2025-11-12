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

if (!GITHUB_TOKEN) {
  console.error('❌ Error: GITHUB_TOKEN environment variable not set');
  console.error('Set it with: export GITHUB_TOKEN=your_token_here');
  process.exit(1);
}

// Helper to make GitHub API requests
async function githubRequest(endpoint, options = {}) {
  const url = `https://api.github.com${endpoint}`;
  const headers = {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json'
  };

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

// Find or create parent issue
async function findOrCreateParentIssue() {
  try {
    // Search for existing issue
    const searchResult = await githubRequest(
      `/search/issues?q=repo:${OWNER}/${REPO}+type:issue+state:open+title:"feat(api): Day 4 - Coverage Lift & Edge Cases"`
    );

    if (searchResult.items && searchResult.items.length > 0) {
      return searchResult.items[0].number;
    }

    // Create new parent issue if not found
    console.log('📝 Creating parent issue...');
    const newIssue = await githubRequest(
      `/repos/${OWNER}/${REPO}/issues`,
      {
        method: 'POST',
        body: {
          title: 'feat(api): Day 4 - Coverage Lift & Edge Cases',
          body: `# Week 5 Day 4: Coverage Lift, Edge Cases & Security Hardening

## Overview
This is the parent issue for the coverage lift and edge cases feature.

## Sub-issues
See linked pull request #029-coverage-hardening for detailed tasks.

## User Stories
- US1: Negative Path Testing for Expense Endpoints (P1)
- US2: Coverage Gap Analysis and Closure (P1)
- US3: Security CI Pipeline Validation (P1)

## Success Criteria
- [ ] All integration tests pass (negative paths)
- [ ] Coverage reaches ≥70% for all metrics
- [ ] Security CI checks pass (CodeQL, Dependency Review)`,
          labels: ['029-coverage-hardening', 'coverage', 'testing']
        }
      }
    );
    return newIssue.number;
  } catch (error) {
    console.error('❌ Error finding/creating parent issue:', error.message);
    process.exit(1);
  }
}

// Parse tasks from tasks.md
function parseTasksFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const tasks = [];
  
  // Regex to match task lines: - [ ] T### [flags] Description
  const taskRegex = /- \[ \] (T\d{3})\s+(.+?)(?:\n|$)/g;
  
  let match;
  while ((match = taskRegex.exec(content)) !== null) {
    const taskId = match[1];
    let rest = match[2].trim();
    
    // Extract [P] marker
    const isParallel = rest.includes('[P]');
    if (isParallel) {
      rest = rest.replace(/\[P\]\s*/, '');
    }
    
    // Extract user story [US1], [US2], [US3]
    let userStory = '';
    const storyMatch = rest.match(/\[(US\d)\]/);
    if (storyMatch) {
      userStory = storyMatch[1];
      rest = rest.replace(/\[US\d\]\s*/, '');
    }
    
    const description = rest.trim();
    
    tasks.push({
      id: taskId,
      title: `${taskId}${userStory ? ` [${userStory}]` : ''}: ${description}`,
      description: description,
      isParallel,
      userStory,
      fullLine: match[0]
    });
  }
  
  return tasks;
}

// Create GitHub issue for a task
async function createTaskIssue(task, parentIssueNumber) {
  try {
    const labels = ['029-coverage-hardening'];
    if (task.isParallel) labels.push('parallelizable');
    if (task.userStory) labels.push(task.userStory);

    const body = `## Task: ${task.id}

${task.description}

## Details
- **User Story**: ${task.userStory || 'Setup/Foundational'}
- **Parallelizable**: ${task.isParallel ? 'Yes' : 'No'}
- **Parent Issue**: #${parentIssueNumber}

## Checklist
- [ ] Implementation complete
- [ ] Tests passing
- [ ] Code reviewed`;

    const issue = await githubRequest(
      `/repos/${OWNER}/${REPO}/issues`,
      {
        method: 'POST',
        body: {
          title: task.title,
          body: body,
          labels: labels
        }
      }
    );

    return issue.number;
  } catch (error) {
    console.error(`❌ Error creating issue for ${task.id}:`, error.message);
    return null;
  }
}

// Main function
async function main() {
  try {
    console.log('🚀 Creating GitHub sub-issues for coverage-hardening feature...\n');

    // Find or create parent issue
    const parentIssueNumber = await findOrCreateParentIssue();
    console.log(`✓ Parent issue: #${parentIssueNumber}\n`);

    // Parse tasks
    const tasksFile = path.join(__dirname, 'specs', '029-coverage-hardening', 'tasks.md');
    if (!fs.existsSync(tasksFile)) {
      console.error(`❌ Error: tasks.md not found at ${tasksFile}`);
      process.exit(1);
    }

    const tasks = parseTasksFromFile(tasksFile);
    console.log(`📋 Found ${tasks.length} tasks\n`);

    // Create issues for each task
    const createdIssues = [];
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      process.stdout.write(`  [${i + 1}/${tasks.length}] Creating ${task.id}... `);

      const issueNumber = await createTaskIssue(task, parentIssueNumber);
      
      if (issueNumber) {
        console.log(`✓ #${issueNumber}`);
        createdIssues.push({
          taskId: task.id,
          issueNumber: issueNumber,
          title: task.title
        });
        successCount++;
      } else {
        console.log('⚠️ Failed');
        failCount++;
      }

      // Rate limit: GitHub allows 5000 requests per hour
      // Sleep 100ms between requests to avoid rate limiting
      if (i < tasks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log(`\n✅ Completed!`);
    console.log(`   Created: ${successCount} issues`);
    if (failCount > 0) {
      console.log(`   Failed: ${failCount} issues`);
    }
    console.log(`\n📊 Summary:`);
    console.log(`   Parent Issue: #${parentIssueNumber}`);
    console.log(`   Sub-issues: ${successCount} created`);
    console.log(`\n📖 View all issues:`);
    console.log(`   https://github.com/${OWNER}/${REPO}/issues?labels=029-coverage-hardening`);

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

main();
