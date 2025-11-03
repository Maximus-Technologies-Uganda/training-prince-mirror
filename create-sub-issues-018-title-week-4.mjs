#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const LINEAR_API_URL = 'https://api.linear.app/graphql';
const PARENT_ISSUE_ID = 'PRI-2376'; // Parent issue
const TASKS_FILE = path.join(__dirname, 'specs/018-title-week-4/tasks.md');

// Get API key from environment
const LINEAR_API_KEY = process.env.LINEAR_API_KEY;

if (!LINEAR_API_KEY) {
  console.error('❌ ERROR: LINEAR_API_KEY environment variable not set');
  console.error('Usage: LINEAR_API_KEY=your_key_here node create-sub-issues-018-title-week-4.mjs');
  process.exit(1);
}

// Parse tasks from tasks.md
function parseTasks(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const tasks = [];
  
  // Regex to match task lines: - [ ] **T###** Description
  const taskRegex = /- \[ \] \*\*T(\d+)\*\* (.+?)(?=\n  - \*\*File Impact\*\*:|$)/gs;
  let match;
  
  while ((match = taskRegex.exec(content)) !== null) {
    const taskNum = match[1];
    const description = match[2].trim();
    
    // Extract file impact and dependencies
    const fullTaskSection = match[0];
    const fileImpactMatch = fullTaskSection.match(/- \*\*File Impact\*\*: (.+?)(?:\n|$)/);
    const dependencyMatch = fullTaskSection.match(/- \*\*Dependency\*\*: (.+?)(?:\n|$)/);
    const parallelMatch = fullTaskSection.match(/- \*\*Parallel\*\*: (.+?)(?:\n|$)/);
    
    const fileImpact = fileImpactMatch ? fileImpactMatch[1] : '';
    const dependency = dependencyMatch ? dependencyMatch[1] : '';
    const parallel = parallelMatch ? parallelMatch[1] : '';
    
    tasks.push({
      taskNum,
      title: `T${taskNum}: ${description.split('\n')[0]}`,
      description: description,
      fileImpact,
      dependency,
      parallel,
      isParallel: description.includes('[P]')
    });
  }
  
  return tasks;
}

// Create Linear issue via GraphQL mutation
async function createLinearIssue(taskTitle, taskDescription, parentTeamId, parentIssueId) {
  const mutation = `
    mutation CreateIssue($input: IssueCreateInput!) {
      issueCreate(input: $input) {
        success
        issue {
          id
          identifier
          title
          description
        }
      }
    }
  `;
  
  const variables = {
    input: {
      title: taskTitle,
      description: taskDescription,
      teamId: parentTeamId,
      parentId: parentIssueId
    }
  };
  
  try {
    const response = await fetch(LINEAR_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${LINEAR_API_KEY}`
      },
      body: JSON.stringify({
        query: mutation,
        variables
      })
    });
    
    const result = await response.json();
    
    if (result.errors) {
      console.error('GraphQL Error:', result.errors);
      return null;
    }
    
    return result.data?.issueCreate?.issue;
  } catch (error) {
    console.error('API Error:', error.message);
    return null;
  }
}

// Get parent issue details and team ID
async function getParentIssueDetails() {
  const query = `
    query GetIssue($id: String!) {
      issue(id: $id) {
        id
        identifier
        title
        team {
          id
          name
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
        variables: { id: PARENT_ISSUE_ID }
      })
    });
    
    const result = await response.json();
    
    if (result.errors) {
      console.error('GraphQL Error:', result.errors);
      return null;
    }
    
    return result.data?.issue;
  } catch (error) {
    console.error('API Error:', error.message);
    return null;
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting Linear sub-issue creation...\n');
  
  // Step 1: Get parent issue details
  console.log(`📋 Fetching parent issue details: ${PARENT_ISSUE_ID}...`);
  const parentIssue = await getParentIssueDetails();
  
  if (!parentIssue) {
    console.error(`❌ Failed to fetch parent issue ${PARENT_ISSUE_ID}`);
    process.exit(1);
  }
  
  console.log(`✅ Parent Issue: ${parentIssue.identifier} - ${parentIssue.title}`);
  console.log(`   Team: ${parentIssue.team.name}\n`);
  
  // Step 2: Parse tasks from tasks.md
  console.log('📄 Parsing tasks from specs/018-title-week-4/tasks.md...');
  const tasks = parseTasks(TASKS_FILE);
  console.log(`✅ Found ${tasks.length} tasks\n`);
  
  // Step 3: Create sub-issues for each task
  console.log('🔄 Creating sub-issues in Linear...\n');
  let successCount = 0;
  let failureCount = 0;
  const createdIssues = [];
  
  for (const task of tasks) {
    const taskDescription = `
**Task**: ${task.title}

**Description**:
${task.description}

**File Impact**:
${task.fileImpact || 'None'}

**Dependency**:
${task.dependency || 'None'}

${task.parallel ? `**Parallelizable with**: ${task.parallel}` : ''}

**Priority**: Feature Implementation (018-title-week-4)

---
*Auto-generated from specs/018-title-week-4/tasks.md*
    `.trim();
    
    console.log(`  Creating: T${task.taskNum}...`);
    const issue = await createLinearIssue(task.title, taskDescription, parentIssue.team.id, parentIssue.id);
    
    if (issue) {
      console.log(`    ✅ Created: ${issue.identifier}`);
      createdIssues.push({
        taskNum: task.taskNum,
        linearId: issue.identifier,
        title: issue.title
      });
      successCount++;
    } else {
      console.log(`    ❌ Failed to create`);
      failureCount++;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary');
  console.log('='.repeat(60));
  console.log(`✅ Successfully created: ${successCount} issues`);
  console.log(`❌ Failed: ${failureCount} issues`);
  
  if (createdIssues.length > 0) {
    console.log('\n📝 Created Issues:');
    createdIssues.forEach(issue => {
      console.log(`   ${issue.linearId}: ${issue.title}`);
    });
  }
  
  console.log('\n⚠️  Note: You may need to manually set parent-child relationships');
  console.log(`    in Linear if the API does not support parent issue linking.\n`);
  
  process.exit(failureCount > 0 ? 1 : 0);
}

main();
