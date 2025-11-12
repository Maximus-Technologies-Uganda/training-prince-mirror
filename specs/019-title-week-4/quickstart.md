# Phase 1 Quickstart: Default Branch Hygiene

## Quick Start Guide: Verify Default Branch Switch

This guide walks you through verifying that the repository's default branch has been successfully switched from `main` to `development`.

---

## Prerequisites

Before you start, ensure:
1. ✅ You have admin access to the `hello-world` repository on GitHub
2. ✅ The `development` branch contains current documentation (README.md with "How to review me" section)
3. ✅ You are ready to document the verification with a screenshot

---

## Verification Steps

### Step 1: Navigate to Repository Settings
1. Open your browser and go to the GitHub repository: `https://github.com/prnceb/hello-world`
2. Click the **Settings** tab (gear icon in the top-right area of the repository header)

**Expected**: You should be on the repository's Settings page

### Step 2: Locate Default Branch Setting
1. In the left sidebar of Settings, look for **"Repository"** or **"General"** section
2. Scroll down to find the **"Default branch"** setting
3. This is typically in the repository configuration area

**Expected**: You should see a dropdown showing the current default branch

### Step 3: Verify or Change Default Branch
**If already set to `development`**:
- You're done! Document current state with screenshot (see Step 5)

**If set to `main`** (action needed):
1. Click the dropdown next to "Default branch"
2. Select `development` from the list
3. Confirm the change when prompted
4. GitHub will show a confirmation message

**Expected**: Dropdown now shows `development` as the selected branch

### Step 4: Wait for Change to Apply
- GitHub typically applies the change immediately
- Refresh the page to confirm the change persists
- The "Default branch" field should still show `development`

**Expected**: No errors; setting remains as `development`

### Step 5: Take Verification Screenshot
Capture a screenshot showing:
1. ✅ Repository name (prnceb/hello-world)
2. ✅ Settings tab is active
3. ✅ Default branch section visible
4. ✅ `development` is selected in the dropdown
5. ✅ Timestamp or any visual confirmation

**Screenshot checklist**:
- [ ] Repository name visible
- [ ] Settings tab highlighted
- [ ] Default branch dropdown showing `development`
- [ ] No error messages
- [ ] Clear and readable

---

## Verification Scenarios

### Scenario 1: Default Branch is Already Set to Development
**Condition**: The setting already shows `development`

**Action**: 
- Document as-is with screenshot showing current correct state
- Note in PR description: "Default branch already set to development (verified)"

### Scenario 2: Default Branch is Set to Main (Needs Change)
**Condition**: The setting shows `main`

**Action**:
1. Click dropdown and select `development`
2. Confirm change
3. Take screenshot after change applies
4. Note in PR description: "Changed default branch from main to development (screenshot attached)"

### Scenario 3: Change Fails or Errors Occur
**Condition**: GitHub shows error or change doesn't persist

**Action**:
1. Check for branch protection rules that might block the change
2. Verify you have admin access
3. Retry the change
4. Document any errors in PR description
5. Note: This scenario should be rare; GitHub allows default branch changes unless explicitly restricted

---

## Success Criteria

✅ **Success**: Feature is complete when:
1. Default branch setting displays `development`
2. Screenshot is attached to PR description
3. PR passes review
4. Change is merged

---

## Test: Clone and Verify

**Optional**: Test that new clones use the new default branch:

```bash
# Clone the repository
git clone https://github.com/prnceb/hello-world.git test-clone

# Check which branch is checked out
cd test-clone
git branch -a

# Verify that development is the current branch
git status
```

**Expected Output**: Should show `development` as the current branch, confirming the default was changed.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't find Settings tab | Ensure you're on the main repository page (not a fork). Settings is in the top navigation. |
| Default branch dropdown is disabled | You may not have admin access. Contact repository owner. |
| Can't select `development` in dropdown | Verify `development` branch exists in the repository. Go to Code tab and check branches. |
| Change doesn't persist after page refresh | Retry the change; there may have been a temporary issue. Contact GitHub support if problem persists. |
| Screenshot looks blurry or unclear | Retake the screenshot ensuring good resolution and contrast. |

---

## Documentation in PR

When you're ready to create the PR, include this in the PR description:

```markdown
## Verification

Screenshot of default branch change:
[Attach screenshot here]

Current default branch: development
Previous default branch: main
Verification method: Manual GitHub UI verification
```

---

## Additional References

- [GitHub Documentation: Setting the default branch](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-branches-in-your-repository/changing-the-default-branch)
- [GitHub Documentation: Repository Settings](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features)

---
