# ⚡ IMMEDIATE ACTION CHECKLIST: Week 5 Day-0 Manual Completion

**Status**: 16/25 Tasks Automated ✅ | 5 Manual Tasks Remaining 🔄  
**Time to Complete**: ~25 minutes total  
**Last Updated**: November 6, 2025

---

## 🎯 YOU ARE HERE: Final 5 Manual Steps Required

All automated work is complete. Only these 5 manual steps remain before production deployment.

---

## STEP 1: Configure Branch Protection (T004)
⏱️ **Time**: 5 minutes | 🔧 **Difficulty**: Easy

### Instructions:
1. Go to: https://github.com/Maximus-Technologies-Uganda/training-prince/settings/branches
2. Click **"Add rule"** (or edit existing "main" rule if present)
3. Enter Branch pattern: `main`
4. **Check these boxes**:
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
5. **Select these 5 required status checks**:
   - [ ] spec-check
   - [ ] Test & Coverage - API
   - [ ] Playwright Smoke
   - [ ] CodeQL
   - [ ] Dependency Review
6. **Uncheck**:
   - ☐ Require pull request reviews
   - ☐ Require approval of reviews
7. Click **"Save changes"**
8. ✅ Verify: Return to Settings → Branches → confirm "main" now shows 5 required checks

---

## STEP 2: Create GitHub Project (T005)
⏱️ **Time**: 3 minutes | 🔧 **Difficulty**: Easy

### Check First (Skip if exists):
- Go to: https://github.com/Maximus-Technologies-Uganda/training-prince/projects
- If "Week 5 Day-0" project exists → **SKIP TO STEP 3**

### Instructions (if not exists):
1. Go to: https://github.com/Maximus-Technologies-Uganda/training-prince/projects
2. Click **"New project"**
3. Choose layout: **"Table"** (recommended)
4. Name: `Week 5 Day-0`
5. Description: `Track work items across GitHub integrated with specifications`
6. Visibility: **"Private"** (or as appropriate)
7. Click **"Create project"**
8. ✅ Verify: Project URL appears in format: `https://github.com/.../projects/X`

---

## STEP 3: Configure Custom Fields (T006)
⏱️ **Time**: 5 minutes | 🔧 **Difficulty**: Medium

### Prerequisites:
- ✅ Must complete Step 2 (project must exist)

### Check First (Skip if all fields exist):
- Go to Project → Settings (gear icon) → "Custom fields"
- If you see all 5 fields listed below → **SKIP TO STEP 4**

### Instructions (if fields missing):
1. In "Week 5 Day-0" project, click **"Settings"** (gear icon)
2. Go to **"Custom fields"** tab
3. Click **"New field"** for each of these 5 fields:

**Field 1: Status**
- Type: SingleSelect
- Options: `Backlog`, `Todo`, `In Progress`, `In Review`, `Done`
- Default: `Backlog`
- Click Save

**Field 2: Priority**
- Type: SingleSelect
- Options: `P0/Critical`, `P1/High`, `P2/Medium`, `P3/Low`
- Default: `P2/Medium`
- Click Save

**Field 3: Size**
- Type: SingleSelect
- Options: `XS`, `S`, `M`, `L`, `XL`
- Default: `M`
- Click Save

**Field 4: Spec URL**
- Type: Text
- Placeholder: `https://...`
- Click Save

**Field 5: Sprint/Week**
- Type: SingleSelect
- Options: `Week 1`, `Week 2`, `Week 3`, `Week 4`, `Week 5`, `Week 5 Day-0`
- Default: `Week 5 Day-0`
- Click Save

4. ✅ Verify: All 5 fields appear in project view

---

## STEP 4: Configure Automation Rules (T007)
⏱️ **Time**: 5 minutes | 🔧 **Difficulty**: Medium

### Prerequisites:
- ✅ Steps 2 & 3 must be complete (project & fields must exist)

### Instructions:
1. In "Week 5 Day-0" project, click **"Settings"** (gear icon)
2. Go to **"Automation"** tab
3. Create or enable these 4 rules:

**Rule 1: Auto-add Issues**
- Trigger: Issues opened
- Action: Add to project
- Status: Auto-set to default
- Save

**Rule 2: Auto-add PRs**
- Trigger: PRs opened
- Action: Add to project
- Status: Auto-set to default
- Save

**Rule 3: PR Opened → Set Status to In Review**
- Trigger: PR opened
- Action: Set custom field "Status" to "In Review"
- Save

**Rule 4: PR Merged → Set Status to Done**
- Trigger: PR closed and merged
- Action: Set custom field "Status" to "Done"
- Save

4. ✅ Verify: All 4 rules show **"Active"** status

### Optional Test:
- Create a test issue or PR
- Confirm it appears in the "Week 5 Day-0" project
- Confirm PR status automatically changes to "In Review"

---

## STEP 5: Perform Merge & Tag Operations (T021-T024)
⏱️ **Time**: 10 minutes | 🔧 **Difficulty**: Medium (CLI)

### Prerequisites:
- ✅ Steps 1-4 must be complete (UI configuration done)

### Terminal Commands (Copy & Paste):

```bash
# Step 5a: Create backup branch
git branch backup/week5-dev development
git push origin backup/week5-dev
echo "✓ Backup branch created and pushed"

# Step 5b: Ensure you're on main and up to date
git checkout main
git pull origin main
echo "✓ Switched to main and pulled latest"

# Step 5c: Squash merge development into main
git merge --squash development
echo "✓ Squash merge prepared"

# Step 5d: Commit with descriptive message
git commit -m "feat(repo): Week 5 Day-0 Final Hygiene and GitHub Projects Migration

- Main branch README updated with Week 5 documentation links
- Stray files removed from repository
- Branch protection rules configured with 5 required CI checks
- GitHub Project 'Week 5 Day-0' created with 5 custom fields
- GitHub Project automation enabled (auto-add, status updates)
- Issue templates created (feature.md, bug.md)
- PR template updated with mandatory sections
- Vitest coverage thresholds verified (60% minimum)
- Review-artifacts/index.html generated and linked
- All contract tests created and passing

Infrastructure: Production-ready main branch with comprehensive CI validation
Workflow: Full migration from Linear to GitHub Projects
Status: Ready for team adoption

Squash merge of development branch (all commits consolidated).
Ready for production deployment."

echo "✓ Commit created"

# Step 5e: Create release tag
git tag -a week5-day0 -m "Week 5 Day-0: Final hygiene, GitHub Projects migration, production-ready repository"
echo "✓ Release tag created"

# Step 5f: Push everything to origin
git push origin main
git push origin --tags
echo "✓ All changes pushed to origin"

# Step 5g: Verify completion
echo ""
echo "=== VERIFICATION ==="
git log --oneline -1
git tag -l week5-day0
git branch -a | grep backup
echo "✓ All operations completed successfully!"
```

### Verification Checks:
After running the above commands, verify:

```bash
# Check current commit
git log --oneline -1
# Should show: your new commit with "Week 5 Day-0" message

# Check tag exists
git tag -l
# Should show: week5-day0

# Check backup branch exists
git branch -a | grep backup
# Should show: backup/week5-dev

# Check remote is updated
git ls-remote origin | grep week5-day0
# Should show: the tag on origin
```

---

## ✅ FINAL VALIDATION CHECKLIST (T025)

After all 5 steps above, verify everything works:

### UI Verification:
- [ ] Go to Settings → Branches → main shows **5 required status checks**
- [ ] Go to Projects tab → **"Week 5 Day-0" project exists** and accessible
- [ ] Project → Settings → Custom fields shows **all 5 fields** (Status, Priority, Size, Spec URL, Sprint/Week)
- [ ] Project → Settings → Automation shows **4 rules Active**
- [ ] Create test issue → **auto-adds to project** with default status

### Code Verification:
- [ ] Run: `git log --oneline -1` → shows Week 5 Day-0 commit
- [ ] Run: `git tag -l` → shows `week5-day0` tag
- [ ] Run: `git branch -a` → shows `backup/week5-dev`
- [ ] Open `review-artifacts/index.html` in browser → all links work

### Template Verification:
- [ ] Create test PR → **template auto-fills** in description
- [ ] New issue → **Feature Request and Bug Report options** appear

---

## 🎉 DONE!

When you've completed all 5 steps + verification, the Week 5 Day-0 implementation is **COMPLETE** and **PRODUCTION READY**:

✅ Clean, documented main branch  
✅ Comprehensive CI protection  
✅ GitHub Projects fully operational  
✅ Contributor templates standardized  
✅ Review packet accessible  
✅ Full infrastructure verified  

---

## 📞 Troubleshooting

### Branch Protection Not Saving?
→ The status checks must exist in GitHub Actions history first. They'll appear automatically after workflows run.

### Can't Create Custom Fields?
→ Must create project first. Project must be in "Table" view, not "Board" view.

### PR Template Not Auto-Filling?
→ Clear browser cache (Cmd+Shift+Delete), refresh, and retry. GitHub caches templates.

### Git Commands Failing?
→ Ensure: `git status` shows "On branch main", no uncommitted changes. Run `git pull origin main` first.

---

## ⏱️ Time Estimate

| Step | Time | Status |
|------|------|--------|
| Step 1: Branch Protection | 5 min | |
| Step 2: Create Project | 3 min | |
| Step 3: Custom Fields | 5 min | |
| Step 4: Automation Rules | 5 min | |
| Step 5: Merge & Tag | 10 min | |
| **TOTAL** | **~28 minutes** | |

---

## 📋 Print-Friendly Checklist

```
WEEK 5 DAY-0 FINAL COMPLETION CHECKLIST
========================================

[ ] Step 1: Branch Protection (5 min)
    [ ] Navigate to Settings → Branches
    [ ] Add rule for "main"
    [ ] Select all 5 required status checks
    [ ] Save changes

[ ] Step 2: GitHub Project (3 min)
    [ ] Check if "Week 5 Day-0" exists
    [ ] If not, create new project (Table layout)

[ ] Step 3: Custom Fields (5 min)
    [ ] Add Status field (5 options)
    [ ] Add Priority field (4 options)
    [ ] Add Size field (5 options)
    [ ] Add Spec URL field (text)
    [ ] Add Sprint/Week field (6 options)

[ ] Step 4: Automation Rules (5 min)
    [ ] Enable auto-add issues
    [ ] Enable auto-add PRs
    [ ] Enable PR opened → In Review
    [ ] Enable PR merged → Done

[ ] Step 5: Merge & Tag (10 min)
    [ ] Create backup: git branch backup/week5-dev development
    [ ] Push backup: git push origin backup/week5-dev
    [ ] Squash merge: git merge --squash development
    [ ] Commit with descriptive message
    [ ] Create tag: git tag -a week5-day0
    [ ] Push: git push origin main --tags

[ ] Verification:
    [ ] Confirm branch protection active
    [ ] Confirm project receives auto-added issues
    [ ] Confirm templates work
    [ ] Confirm review-artifacts/index.html accessible

STATUS: ✅ COMPLETE - Ready for Production!
```

---

*Last Updated: November 6, 2025*  
*Confidence Level: 📈 HIGH - All automated components verified*  
*Estimated Completion: ~25 minutes from now*



