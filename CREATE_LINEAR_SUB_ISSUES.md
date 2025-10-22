# Creating Linear Sub-Issues for PRI-289

**Goal**: Create 24 sub-issues in Linear under parent issue **PRI-289** ("Wednesday: Polished UI Filters & Empty States for Expense & To-Do")

---

## ⚙️ Option 1: Use GitHub Actions Workflow (Recommended)

### Step 1: Go to GitHub Actions

Navigate to your repository's workflow page:
```
https://github.com/Maximus-Technologies-Uganda/training-prince/actions/workflows/create-linear-sub-issues.yml
```

### Step 2: Trigger the Workflow

1. Click **"Run workflow"** button (top right)
2. Select branch: **`feature/PRI-258-tuesday-ui-polishing`** (or your current branch)
3. In the **"Parent Linear Issue ID"** field, enter: **`PRI-289`**
4. Click **"Run workflow"**

### Step 3: Wait for Completion

- The workflow will run and create all 24 sub-issues automatically
- Check the workflow logs: https://github.com/Maximus-Technologies-Uganda/training-prince/actions
- Once complete, all sub-issues will appear in Linear under PRI-289

**Expected output**: 24 new sub-issues created under PRI-289 ✅

---

## 📋 Option 2: Trigger via Command Line (if you have GitHub CLI)

```bash
# Install GitHub CLI if not already installed
# https://cli.github.com/

# Authenticate with GitHub
gh auth login

# Trigger the workflow
gh workflow run create-linear-sub-issues.yml \
  --repo Maximus-Technologies-Uganda/training-prince \
  -f parent_id=PRI-289
```

---

## 📱 Option 3: Manual API Trigger

Use the provided script:

```bash
# First, create a GitHub personal access token:
# 1. Go to: https://github.com/settings/tokens
# 2. Click "Generate new token (classic)"
# 3. Select scope: "actions"
# 4. Copy the token

# Then run:
export GITHUB_TOKEN="your_token_here"
bash scripts/trigger-linear-sync-Wednesday.sh
```

---

## ✅ What Gets Created

Once the workflow completes, you'll see 24 sub-issues in Linear:

```
PRI-289 (Parent)
├── PRI-290: Create filterUtils.js module with filter function stubs
├── PRI-291: Write Vitest unit tests for expense filtering logic
├── PRI-292: Write Vitest unit tests for to-do filtering logic
├── PRI-293: Write Playwright E2E smoke test for expense filtering
├── PRI-294: Write Playwright E2E smoke test for to-do filtering
├── PRI-295: Implement filterExpensesByCategory() to make tests pass
├── PRI-296: Implement filterExpensesByMonth() to make tests pass
├── PRI-297: Implement filterExpensesByBoth() with AND logic
├── PRI-298: Implement filterTodosByStatus() to make tests pass
├── PRI-299: Implement filterTodosByPriority() to make tests pass
├── PRI-300: Implement filterTodosByBoth() with AND logic
├── PRI-301: Implement detectEmptyState() helper function
├── PRI-302: Create ExpenseFilter React component with category & month dropdowns
├── PRI-303: Create ExpenseEmptyState component with icon & CTA button
├── PRI-304: Create TodoFilter component with status tabs & priority dropdown
├── PRI-305: Create TodoEmptyState component with icon & CTA button
├── PRI-306: Integrate ExpenseFilter component into expense page UI
├── PRI-307: Add filtering logic to ExpenseList component
├── PRI-308: Integrate TodoFilter component into to-do page UI
├── PRI-309: Add filtering logic to TodoList component
├── PRI-310: Run Vitest unit tests and verify ≥50% coverage for UI modules
├── PRI-311: Run Playwright E2E smoke tests for filter functionality
├── PRI-312: Manually validate all quickstart test scenarios (12 scenarios)
└── PRI-313: Generate coverage reports and prepare PR documentation
```

---

## 🔍 Troubleshooting

### Issue: "❌ Error: LINEAR_API_KEY not set"
- **Cause**: GitHub secret not configured
- **Fix**: Ask your workspace admin to set `LINEAR_API_KEY` in GitHub Secrets

### Issue: "❌ Error: Tasks file not found"
- **Cause**: Wrong tasks file path
- **Fix**: Ensure `specs/013-title-wednesday-spec/tasks.md` exists

### Issue: Workflow doesn't trigger
- **Cause**: May need different branch or permissions
- **Fix**: Check GitHub workflow permissions in repo settings

---

## 📊 View Results

Once complete, go to Linear to see all sub-issues:
```
https://linear.app/prince-training/issue/PRI-289
```

---

*Created: October 22, 2025*
*Feature: Wednesday UI Polishing - Expense & To-Do Filtering*
