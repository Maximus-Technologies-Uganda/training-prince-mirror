# Final Steps: GitHub UI Configuration & Validation
## Week 5 Day-0 Implementation - Remaining Manual Tasks

**Date**: November 6, 2025  
**Tasks Remaining**: 4 GitHub UI + 1 DoD Validation  
**Estimated Time**: ~40 minutes total

---

## ✅ COMPLETED AUTOMATED TASKS

### T012: Coverage Reports ✅ COMPLETE
```
✅ Command executed: npm run test:coverage
✅ Status: Coverage reports generated and indexed
✅ Coverage directories active: review-artifacts/coverage-*
```

### T020: Test Execution ✅ COMPLETE
```
✅ Command executed: npm run test
✅ Results: 422/422 tests PASSED (100%)
✅ Test files: 38 passed
✅ Coverage: All UI suites tested (expense, stopwatch, temp, todo, quote)
✅ Contract tests: 6 infrastructure tests verified
```

---

## 🎯 MANUAL GITHUB UI TASKS (4 tasks - 40 minutes)

### Task T004: Configure Branch Protection Rule ⏱️ ~15 minutes

**Goal**: Enforce all 5 required status checks on main branch

#### Step 1: Open Repository Settings
1. Go to your GitHub repository
2. Click **Settings** (at the top right)
3. On the left menu, click **Branches**

#### Step 2: Add/Edit Branch Protection Rule for `main`
1. If a rule for `main` exists, click **Edit**
2. If not, click **Add rule**
3. Enter branch name pattern: `main`

#### Step 3: Configure Required Status Checks
1. Check ✓ **"Require status checks to pass before merging"**
2. Check ✓ **"Require branches to be up to date before merging"**
3. Search and select these 5 status checks (in this order):
   - [ ] `spec-check`
   - [ ] `Test & Coverage - API`
   - [ ] `Playwright Smoke`
   - [ ] `CodeQL`
   - [ ] `Dependency Review`

#### Step 4: Additional Settings (Recommended)
1. ✓ Check **"Dismiss stale pull request approvals when new commits are pushed"**
2. Uncheck **"Allow force pushes"**
3. Uncheck **"Allow deletions"**

#### Step 5: Save
1. Scroll to bottom
2. Click **Save changes**

#### ✅ Verification
- Go to **Settings → Branches**
- Verify `main` shows "5 required status checks"
- Create a test PR to confirm branch protection works

---

### Task T005: Create GitHub Project ⏱️ ~10 minutes

**Goal**: Create "Week 5 Day-0" GitHub Project for work tracking

#### Step 1: Navigate to Projects
1. From your repository home, click **Projects** tab (at top)
2. If first time: Click **"New project"** button
3. If existing: Look for "New project" button on right side

#### Step 2: Create Project
1. Click **"New project"**
2. Select layout: **Table** (recommended for custom fields)
3. Project name: `Week 5 Day-0`
4. Description: `Track work items across GitHub integrated with specifications`
5. Visibility: **Private** (or as appropriate for your repository)
6. Click **"Create project"**

#### Step 3: Note Project URL
- The project URL will be something like: `https://github.com/owner/repo/projects/N`
- Save this for reference

#### ✅ Verification
- Project appears in Projects tab
- Can access project settings
- Ready for custom fields configuration (next task)

---

### Task T006: Configure GitHub Project Custom Fields ⏱️ ~10 minutes

**Goal**: Add 5 custom fields to track work item metadata

#### Step 1: Open Project Settings
1. Inside your "Week 5 Day-0" project
2. Click **⚙️ Settings** (gear icon in top right)

#### Step 2: Navigate to Custom Fields
1. In Settings sidebar, click **"Custom fields"**
2. You should see a section to add new fields

#### Step 3: Add Field 1 - Status

**Type**: Single select  
**Name**: `Status`  
**Options** (add in this order):
- Backlog
- Todo
- In Progress
- In Review
- Done

**Default**: Backlog  
**Description**: Workflow state of the work item

Click **Save**

#### Step 4: Add Field 2 - Priority

**Type**: Single select  
**Name**: `Priority`  
**Options**:
- P0/Critical
- P1/High
- P2/Medium
- P3/Low

**Default**: P2/Medium  
**Description**: Issue importance and urgency

Click **Save**

#### Step 5: Add Field 3 - Size

**Type**: Single select  
**Name**: `Size`  
**Options**:
- XS
- S
- M
- L
- XL

**Default**: M  
**Description**: Story points or effort estimate

Click **Save**

#### Step 6: Add Field 4 - Spec URL

**Type**: Text  
**Name**: `Spec URL`  
**Placeholder**: `https://...`  
**Description**: Link to feature specification

Click **Save**

#### Step 7: Add Field 5 - Sprint/Week

**Type**: Single select  
**Name**: `Sprint/Week`  
**Options**:
- Week 1
- Week 2
- Week 3
- Week 4
- Week 5
- Week 5 Day-0

**Default**: Week 5 Day-0  
**Description**: Release cycle or sprint assignment

Click **Save**

#### ✅ Verification
- All 5 fields appear in project table view
- Fields are sortable and filterable
- Can edit field values on items

---

### Task T007: Configure GitHub Project Automation Rules ⏱️ ~5 minutes

**Goal**: Set up automatic workflow for issue/PR management

#### Step 1: Access Automation Settings
1. In project, click **⚙️ Settings** (gear icon)
2. In Settings sidebar, click **"Automation"**

#### Step 2: Create Rule 1 - Auto-add Issues

**If "Automation" section exists:**
1. Look for "Auto-add Issues" or similar option
2. If available, toggle ON
3. If not available in UI, skip to Step 3

**If using GitHub Actions (alternative):**
This may already be configured via repository settings

#### Step 3: Create Rule 2 - Auto-add Pull Requests

**If automation UI available:**
1. Toggle "Auto-add pull requests" ON
2. This automatically adds all PRs to the project

#### Step 4: Create Rule 3 - PR Opened → Set Status to "In Review"

**Option A: Via Native Automation (if available)**
- Trigger: Pull request opened
- Action: Set "Status" field to "In Review"
- Save

**Option B: Via GitHub Actions (alternative)**
The workflow may need to be created separately (see alternative section below)

#### Step 5: Create Rule 4 - PR Merged → Set Status to "Done"

**Option A: Via Native Automation (if available)**
- Trigger: Pull request merged (closed with merged=true)
- Action: Set "Status" field to "Done"
- Save

**Option B: Via GitHub Actions (alternative)**
- Status updates on PR merge may require GitHub Actions workflow

#### ✅ Verification
Steps to test automation:
1. Create a test issue → Should automatically appear in project
2. Create a test PR → Should automatically appear in project
3. Open a test PR → Status should auto-set to "In Review" (if automation configured)
4. Close/merge a test PR → Status should auto-set to "Done" (if automation configured)

#### 📝 Note on GitHub Actions Alternative
If native automation is not available in your GitHub Project UI, you can create a workflow file at `.github/workflows/project-automation.yml` to handle status updates via GraphQL API on PR events. This is already partially supported by the infrastructure created.

---

## ✅ DEFINITION OF DONE VALIDATION (T025) ⏱️ ~20 minutes

**Goal**: Verify all 13 Definition of Done items are satisfied

### Validation Checklist

Go through each item and verify completion:

#### Repository Hygiene
- [ ] **Main branch README.md updated** with Week 5 paths and review-packet link
  - **Check**: Open README.md, search for "Week 5 Day-0" section
  - **Status**: ✅ Complete (T001)

- [ ] **Stray files removed from main branch**
  - **Check**: Run `git ls-files | grep -E "\\.tmp|debug\\.log|hello.js..js"` (should be empty)
  - **Status**: ✅ Complete (via squash merge in T002)

- [ ] **Development branch merged to main via squash commit**
  - **Check**: Run `git log --oneline main | head -5` (should show squash commit)
  - **Commit**: `f755a65 Week 5 Day-0: Final hygiene and GitHub Projects migration`
  - **Status**: ✅ Complete (T022)

- [ ] **`week5-day0` tag created on main branch**
  - **Check**: Run `git tag -l week5-day0` (should show the tag)
  - **Alternative**: GitHub UI → Releases → Should see week5-day0 tag
  - **Status**: ✅ Complete (T023)

#### Branch Protection & CI
- [ ] **Branch protection rules on main configured**
  - **Check**: Settings → Branches → main should show 5 required checks
  - **Status**: ⏳ Pending (T004 - being done now)

- [ ] **5 required status checks configured and enforced**
  - Required checks: spec-check, Test & Coverage - API, Playwright Smoke, CodeQL, Dependency Review
  - **Check**: Try creating a PR against main with failing test → merge should be blocked
  - **Status**: ⏳ Pending (T004)

- [ ] **Development branch does not have these restrictions**
  - **Check**: Settings → Branches (should not have rule for development)
  - **Status**: ✅ Complete (intentionally not restricted)

#### Vitest & Coverage
- [ ] **Vitest config enforces 60% thresholds**
  - **Check**: Open vitest.config.js, search for "coverage: { ... lines: 60"
  - **Status**: ✅ Complete (T011)

- [ ] **Correct include/exclude paths for all 5 UI suites**
  - **Check**: vitest.config.js should include: Expense, Stopwatch, Temperature, Todo, Quote
  - **Status**: ✅ Complete (T011)

- [ ] **review-artifacts/index.html includes coverage table, Playwright link, OpenAPI link, changelog link**
  - **Check**: Open review-artifacts/index.html in browser
  - **Verify links**:
    - [ ] Coverage table present
    - [ ] Link to playwright-report/index.html
    - [ ] Link to openapi.html
    - [ ] Link to CHANGELOG.md
  - **Status**: ✅ Complete (T013)

#### GitHub Projects & Automation
- [ ] **GitHub Project created with all 5 custom fields**
  - **Check**: Projects tab → "Week 5 Day-0" project visible
  - **Fields**: Status, Priority, Size, Spec URL, Sprint/Week
  - **Status**: ⏳ Pending (T005-T006 - being done now)

- [ ] **GitHub Project automation configured**
  - **Check**: Automation settings show active rules
  - **Rules**: Auto-add issues/PRs, Status updates on PR open/merge
  - **Status**: ⏳ Pending (T007 - being done now)

#### Templates
- [ ] **`.github/ISSUE_TEMPLATE/feature.md` created and validates**
  - **Check**: File exists and has proper YAML frontmatter
  - **Verify**: Create test issue → Feature Request template appears
  - **Status**: ✅ Complete (T008)

- [ ] **`.github/ISSUE_TEMPLATE/bug.md` created and validates**
  - **Check**: File exists and has proper YAML frontmatter
  - **Verify**: Create test issue → Bug Report template appears
  - **Status**: ✅ Complete (T009)

- [ ] **`.github/pull_request_template.md` created with all required sections**
  - **Check**: File exists with sections: Spec URL, Contract Tests, Checks, CHANGELOG Updated, Breaking Changes
  - **Verify**: Create test PR → Template auto-fills
  - **Status**: ✅ Complete (T010)

#### Team & Operations
- [ ] **All team members notified that Linear has been decommissioned**
  - **Action**: Send Slack/email message: "Linear service discontinued. All work tracking now in GitHub Projects"
  - **Status**: ⏳ Pending (manual notification)

- [ ] **Development workflow is fully operational on GitHub platform**
  - **Check**: Can create issues, PRs, and manage via GitHub Projects
  - **Status**: ⏳ Pending (after GitHub UI setup)

- [ ] **Main branch is the target for all incoming PRs**
  - **Check**: Branch rules show main is primary
  - **Verify**: New PRs default to main as base branch
  - **Status**: ✅ Complete (development merged to main)

---

## 📋 QUICK REFERENCE - All Remaining Items

### Automated (Done ✅)
- [x] T012: Coverage reports generated
- [x] T020: All 422 tests passing

### Manual GitHub UI (In Progress ⏳)
- [ ] T004: Branch protection - **DO NOW** (15 min)
- [ ] T005: Create GitHub Project - **DO NOW** (10 min)
- [ ] T006: Configure custom fields - **DO NOW** (10 min)
- [ ] T007: Configure automation - **DO NOW** (5 min)

### Validation (Ready ✅)
- [ ] T025: Definition of Done - **DO AFTER UI SETUP** (20 min)

### Post-Implementation (After all above)
- [ ] Send team notification about Linear decommission
- [ ] Test by creating sample issue/PR in GitHub Projects

---

## ⏱️ ESTIMATED TIMELINE

```
Current time: ~5 min
├─ T004: Branch Protection (15 min)  →  Complete by: +20 min
├─ T005: Create Project (10 min)     →  Complete by: +30 min
├─ T006: Custom Fields (10 min)      →  Complete by: +40 min
├─ T007: Automation (5 min)          →  Complete by: +45 min
└─ T025: DoD Validation (20 min)     →  Complete by: +65 min

TOTAL: ~65 minutes
```

---

## 🎯 SUCCESS CRITERIA

After completing all steps, you should be able to:

✅ Create a test issue → Auto-adds to GitHub Project  
✅ Create a test PR → Auto-adds to GitHub Project, Status = "In Review"  
✅ Merge test PR → Status auto-updates to "Done"  
✅ Try to merge non-passing PR → Blocked by 5 required status checks  
✅ All templates visible when creating issues/PRs  
✅ Coverage reports accessible via review-artifacts/index.html  
✅ Week 5 section visible in README.md  
✅ week5-day0 tag exists on main  

---

## 🆘 TROUBLESHOOTING

### GitHub Project Not Showing Custom Fields
- **Solution**: Refresh browser (Ctrl+F5 or Cmd+Shift+R)
- **Check**: You're in "Table" view (not "Board" view)
- **Verify**: Project not archived

### Status Checks Not Enforcing
- **Check**: Workflow has run at least once (triggers generate check names)
- **Solution**: Run workflow manually from Actions tab
- **Verify**: Check names exactly match what you entered in branch protection

### Templates Not Auto-Filling
- **Solution**: Clear browser cache
- **Check**: File paths are exact: `.github/pull_request_template.md` and `.github/ISSUE_TEMPLATE/*.md`
- **Verify**: Files have proper YAML frontmatter

### Automation Rules Not Triggering
- **Check**: Rules are enabled (toggle should be ON)
- **Verify**: Create new issue/PR to trigger automation
- **Note**: May take a few seconds to appear in project

---

## 📞 NEXT STEPS

1. **Start with T004**: Follow the 5 steps above to configure branch protection
2. **Then T005**: Create the GitHub Project
3. **Then T006**: Add the 5 custom fields
4. **Then T007**: Configure automation rules
5. **Finally T025**: Go through the 13-point DoD checklist
6. **Post-completion**: Send team notification

---

**Estimated Total Time**: ~65 minutes  
**Difficulty**: Low to Medium  
**Automation Level**: 100% UI-based (no CLI commands needed)

Good luck! 🚀

