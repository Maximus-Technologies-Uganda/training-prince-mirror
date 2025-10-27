# 🚀 Generic Linear Sub-Issues Workflow Guide

## 📌 Quick Reference Card

**When?** Whenever you create a `tasks.md` file and want to sync it to Linear  
**Where?** GitHub Actions → "Create Linear Sub-Issues (Generic)"  
**What?** Automatically create sub-issues under ANY parent issue ID  
**Time?** ~1 minute for 30-50 tasks

### One-Minute Setup
```bash
1. Go to: https://github.com/Maximus-Technologies-Uganda/training-prince/actions
2. Find: "Create Linear Sub-Issues (Generic)"
3. Click: "Run workflow"
4. Enter: PRI-XXXX (parent ID) + path to tasks.md
5. Click: "Run workflow"
6. ✅ Done! Check Linear for new sub-issues
```

---

## What This Workflow Does

The **Generic Linear Sub-Issues Workflow** automatically creates Linear sub-issues under any parent issue ID from a `tasks.md` file in your repository.

### Workflow Location
```
.github/workflows/create-sub-issues-pri1412.yml
```

### Key Features
- ✅ **Reusable for ANY parent issue ID** (not just PRI-1412)
- ✅ **Accepts dynamic inputs** via GitHub Actions UI
- ✅ **Validates all prerequisites** before running
- ✅ **Accesses LINEAR_API_KEY securely** from GitHub secrets
- ✅ **Generates sub-issues with full descriptions** from tasks.md
- ✅ **Provides direct Linear links** in workflow output

---

## How to Use It (For Your Next Agent)

### Scenario: You Have a New Feature Branch with tasks.md

**Steps:**

1. **Ensure your tasks.md exists**
   ```
   specs/your-feature-branch/tasks.md
   ```

2. **Merge the branch to `development`** (workflow must exist on main branch)

3. **Go to GitHub Actions:**
   - URL: `https://github.com/YOUR_REPO/actions`
   - Find: **"Create Linear Sub-Issues (Generic)"**
   - Click on it

4. **Click "Run workflow ▼"** button (top right)

5. **Fill in the inputs:**
   - **Parent Issue ID**: `PRI-XXXX` (the Linear issue you want sub-issues under)
   - **Tasks File** (optional): Path to your `tasks.md` file
     - Default: `specs/014-thursday-stopwatch-ui/tasks.md`
     - Example: `specs/my-new-feature/tasks.md`

6. **Click "Run workflow"** (green button)

7. **Wait** (~30 seconds to 1 minute)

8. **Check Linear:**
   - All sub-issues created under your parent issue
   - Each task becomes a sub-issue with full description, file path, and status

---

## Prompt for Your Next Agent

Use this prompt when requesting to create Linear sub-issues:

```
I have a feature branch with a tasks.md file at [SPEC_DIR]/tasks.md 
and I want to create Linear sub-issues under parent issue [PARENT_ID].

Use the generic workflow at .github/workflows/create-sub-issues-pri1412.yml:

1. Verify the branch is merged to development
2. Go to: https://github.com/Maximus-Technologies-Uganda/training-prince/actions
3. Find "Create Linear Sub-Issues (Generic)"
4. Click "Run workflow"
5. Enter:
   - Parent Issue ID: [PARENT_ID]
   - Tasks File: [SPEC_DIR]/tasks.md
6. Click "Run workflow"
7. Confirm all sub-issues created in Linear
```

**Example:**
```
Create Linear sub-issues for my Friday feature (specs/015-friday-feature/tasks.md)
under parent issue PRI-2000 using the generic workflow.
```

---

## What The Workflow Validates

Before creating sub-issues, it checks:

✅ `create-sub-issues-pri1412.mjs` exists  
✅ `tasks.md` file exists at the specified path  
✅ `LINEAR_API_KEY` is set in GitHub secrets  
✅ All environment variables are available  

If any check fails, it stops with a clear error message.

---

## Output Example

```
🚀 Creating Linear sub-issues
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 Parent Issue ID: PRI-2000
📋 Tasks File: specs/015-friday-feature/tasks.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ All prerequisites met

Running sub-issue creation...
════════════════════════════════════════════════════════════════

✅ Created: T001 - Setup [PRI-2000]
✅ Created: T002 - Contract Tests [P] [PRI-2000]
✅ Created: T003 - Data Models [P] [PRI-2000]
... (continues for all tasks)

════════════════════════════════════════════════════════════════
✅ Sub-issue creation completed!

📋 Next steps:
   1. Go to Linear: https://linear.app/coding-mystery/issue/PRI-2000
   2. Refresh to see the new sub-issues
   3. Begin implementation following the dependency order
```

---

## Workflow Parameters Reference

| Parameter | Required | Default | Purpose |
|-----------|----------|---------|---------|
| `parent_id` | YES | None | Linear issue ID to create sub-issues under |
| `tasks_file` | NO | `specs/014-thursday-stopwatch-ui/tasks.md` | Path to tasks.md file |

---

## Future Enhancements

Potential improvements for future versions:

- ✨ Auto-detect tasks.md from current branch
- ✨ Accept custom sub-issue title prefix
- ✨ Set assignee automatically based on team
- ✨ Add labels/priority from specification
- ✨ Create GitHub Issue → Linear sync link
- ✨ Bulk update status when tasks are completed

---

## Troubleshooting

### Workflow Not Found
- ✅ Make sure branch is merged to `development`
- ✅ Workflow files on feature branches don't appear in Actions UI

### LINEAR_API_KEY Error
- ✅ Check GitHub Settings → Secrets and variables → Actions
- ✅ Verify `LINEAR_API_KEY` is set

### Tasks File Not Found
- ✅ Double-check the path in the input
- ✅ Use relative path from repo root
- ✅ File must be named exactly `tasks.md`

---

## Integration with Your Workflow

This workflow is designed to fit into your standard feature delivery:

1. **Create spec** → `/specify` command
2. **Generate plan** → `/plan` command
3. **Create tasks** → `/tasks` command with `tasks.md` output
4. **Create sub-issues** → Use this workflow (automated)
5. **Implement tasks** → Follow dependency order
6. **Mark tasks done** → Check off items in Linear
7. **Merge & close** → PR merge triggers Linear sync

---

## Questions?

For questions or enhancements, check:
- Workflow file: `.github/workflows/create-sub-issues-pri1412.yml`
- Script: `create-sub-issues-pri1412.mjs`
- This guide: `CREATE_LINEAR_SUB_ISSUES.md`
