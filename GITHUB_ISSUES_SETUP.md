# Creating Individual GitHub Issues from Tasks

This document explains how to convert your task list into individual GitHub issues that can be tracked in GitHub Projects.

## Why Convert?

The original issue description had static checkboxes that couldn't be checked off. By converting to individual GitHub issues:
- ✅ Each task gets its own issue you can check off
- ✅ They integrate with GitHub Projects perfectly
- ✅ You can assign them to team members
- ✅ You can track progress in real-time
- ✅ Each issue has its own discussion/comments

## Step-by-Step Guide

### Step 1: Find Your Parent Issue Number

1. Go to your GitHub issue: "feat(api): Day 3 - Docs, ReviewPacket, and Playwright Smoke"
2. Look at the URL: `https://github.com/Maximus-Technologies-Uganda/training-prince/issues/XXXX`
3. The number at the end is your **parent issue number** (e.g., `1709`)

### Step 2: Set Up Your GitHub Token

If you haven't already, create a GitHub Personal Access Token:

**Create Token:**
1. Go to [GitHub Settings → Developer Settings → Personal Access Tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a name: `Training Prince Issues`
4. Select scopes: `repo` (all repository permissions)
5. Copy the token

**Set Environment Variable:**
```bash
export GITHUB_TOKEN=ghp_your_token_here
```

Or add to your `.zshrc` to make it permanent:
```bash
echo 'export GITHUB_TOKEN=your_token_here' >> ~/.zshrc
source ~/.zshrc
```

### Step 3: Run the Script

From the repo root:

```bash
./scripts/create-issues.sh <parent-issue-number>
```

**Example:**
```bash
./scripts/create-issues.sh 1709
```

Or if you prefer to pass the token:
```bash
./scripts/create-issues.sh 1709 ghp_your_token_here
```

### Step 4: Monitor Progress

The script will:
- Parse all 39 tasks from `specs/028-week-5-day/tasks.md`
- Create one GitHub issue per task
- Label each with `028-week-5-day` and the user story (US1, US2, US3, CORE)
- Link each to the parent issue
- Save a report to `.github-issues-report.json`

Expected output:
```
🚀 Starting GitHub Issues Creation...

📋 Configuration:
   Owner: Maximus-Technologies-Uganda
   Repo: training-prince
   Parent Issue: #1709
   Token: ghp_xxxxx...xxxx

📊 Found 39 tasks to create

Creating issues:

✅ [1/39] Created #1710 - T001
✅ [2/39] Created #1711 - T002
✅ [3/39] Created #1712 - T003
...
✅ [39/39] Created #1748 - T039

============================================================
✅ Created 39 issues successfully
============================================================

📝 Report saved to: .github-issues-report.json
```

### Step 5: Check the Report

Open `.github-issues-report.json` to see all created issue numbers:

```json
{
  "timestamp": "2025-11-11T11:45:30.000Z",
  "parentIssue": 1709,
  "totalTasks": 39,
  "successCount": 39,
  "errorCount": 0,
  "issues": [
    {
      "taskId": "T001",
      "issueNumber": 1710,
      "url": "https://github.com/Maximus-Technologies-Uganda/training-prince/issues/1710"
    },
    ...
  ]
}
```

### Step 6: Delete the Original Issue (Optional)

If you want to clean up:
1. Go to your original issue #1709
2. Click "Delete issue" at the bottom
3. Confirm

Now you only have the 39 individual task issues!

### Step 7: Add to GitHub Projects

1. Go to **GitHub Projects → training-prince** board
2. For each issue number in the report, click "Add item"
3. Search by issue number (e.g., `#1710`)
4. Add it to the project
5. Organize by:
   - **Phase** (column or label)
   - **Assignee** (who's working on it)
   - **Status** (To Do, In Progress, Done)

## Troubleshooting

### Token Issues

**Error: "GitHub API error: Requires authentication"**
- Your token is invalid or expired
- Generate a new token at https://github.com/settings/tokens
- Make sure the token has `repo` scope

**Error: "Token not found"**
- Set the environment variable: `export GITHUB_TOKEN=your_token`
- Or pass it as an argument: `./scripts/create-issues.sh 1709 token_here`

### Issue Creation Failures

**Error: "GitHub API error: Validation Failed"**
- Check that the parent issue number is correct
- Verify `specs/028-week-5-day/tasks.md` exists

**Script hangs or times out**
- GitHub has rate limits (5,000 requests/hour)
- The script adds delays between requests
- If it fails, you can run it again—it creates new issues if they don't exist

### Tasks Not Parsing

**No issues created**
- Verify `tasks.md` exists in the correct location
- Make sure it has the correct format: `- [ ] T001 [flags] Description`
- Run from the repo root directory

## Manual Alternative

If the script doesn't work, you can create issues manually:

1. Go to GitHub Issues → New Issue
2. Title: `T001 - Verify Node.js installation`
3. Body: Copy from `tasks.md`
4. Label: `028-week-5-day`, `CORE` (or `US1`, `US2`, `US3`)
5. Repeat for all 39 tasks

But the script saves a lot of time!

## What Gets Created

Each issue includes:
- **Title**: `T001 - Task description`
- **Body**: Full task description
- **Labels**: `028-week-5-day` + user story (US1/US2/US3/CORE)
- **Link to parent**: Reference to parent issue #1709
- **Links to docs**: Links to spec, plan, quickstart, tasks.md

Example issue:
```markdown
# T001 - Verify Node.js installation

## Task: Verify Node.js installation: `node --version` should output v18+ in terminal

### Details
- **Task ID**: T001
- **User Story**: CORE
- **Parallelizable**: No
- **Parent Issue**: #1709

### Execution
See parent issue #1709 and [tasks.md](specs/028-week-5-day/tasks.md) for full context.

### Related Documentation
- [Implementation Tasks](specs/028-week-5-day/tasks.md)
- [Quickstart Guide](specs/028-week-5-day/quickstart.md)
- [Specification](specs/028-week-5-day/spec.md)
```

## Summary

| Step | Time | Command |
|------|------|---------|
| 1. Find parent issue # | 1 min | Look at GitHub URL |
| 2. Create GitHub token | 3 min | GitHub Settings → Personal Access Tokens |
| 3. Set token as env var | 1 min | `export GITHUB_TOKEN=...` |
| 4. Run script | <1 min | `./scripts/create-issues.sh 1709` |
| 5. Check report | 1 min | View `.github-issues-report.json` |
| 6. Add to Projects | 5-10 min | Add issues to GitHub Projects board |

**Total**: ~15 minutes to go from 1 issue → 39 trackable issues!

---

## Questions?

Refer to:
- [tasks.md](../specs/028-week-5-day/tasks.md) - Full task list
- [GitHub Projects Help](https://docs.github.com/en/issues/planning-and-tracking-with-projects)
- [GitHub Issues Help](https://docs.github.com/en/issues)
