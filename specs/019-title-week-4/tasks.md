# Tasks: Week 4 Finisher - Default Branch Hygiene

**Input**: Design documents from `specs/019-title-week-4/`  
**Feature**: Week 4 Finisher - Default Branch Hygiene  
**Branch**: `019-title-week-4`  
**Status**: Ready for execution

---

## Execution Flow

```
1. Load plan.md from feature directory ✓
   → Extracted: Configuration-only task, no code changes
2. Load design documents ✓
   → research.md: GitHub UI approach confirmed
   → data-model.md: Repository state model defined
   → quickstart.md: Verification steps documented
   → contracts/: GitHub API reference available
3. Generate tasks by category:
   → Verification (Precondition): T001
   → Configuration: T002
   → Verification (Postcondition): T003
   → Documentation: T004-T005
4. Apply task rules:
   → Sequential: No parallel tasks (single configuration sequence)
   → Manual verification: No automation
5. Number tasks sequentially ✓
6. Validate task completeness:
   → All steps covered: Pre-check → Change → Verify → Document ✓
9. Return: SUCCESS (tasks ready for execution)
```

---

## Overview

This feature consists of **5 sequential tasks** to switch the repository's default branch from `main` to `development`. All tasks involve manual GitHub UI operations with no code changes.

**Approach**: Manual configuration via GitHub web UI with screenshot verification  
**Prerequisite**: Admin access to repository  
**Timeline**: ~15 minutes total

---

## Phase 3.1: Verification & Preconditions

### T001: Verify Development Branch is Current

**Description**: Verify that the `development` branch contains the latest documentation and is ready to become the default branch.

**Prerequisites**:
- Access to the repository on GitHub
- Can view branch contents

**Steps**:
1. Navigate to https://github.com/prnceb/hello-world
2. Click the "Code" tab
3. Verify `development` branch exists in the branch dropdown
4. Click into `development` branch
5. Check that README.md exists and contains the "How to review me" section
6. Verify that `frontend/` and `src/` directories are current (latest commits recent)
7. Document findings (screenshot or notes)

**Expected Output**:
- ✅ `development` branch verified as current
- ✅ README.md confirmed to have "How to review me" section
- ✅ No legacy state files (todo.json, expenses.json) visible
- ✅ Ready to proceed to T002

**Acceptance Criteria**:
- Development branch exists and is accessible
- README.md contains required documentation
- No blockers identified for default branch switch

---

### T002: Change Default Branch in GitHub Settings

**Description**: Change the repository's default branch setting from `main` to `development` using GitHub's web interface.

**Prerequisites**:
- T001 complete (development branch verified)
- Admin access to the repository on GitHub

**Steps**:
1. Navigate to https://github.com/prnceb/hello-world
2. Click the "Settings" tab (gear icon)
3. In the left sidebar, locate "Repository" or "General" section
4. Scroll to find "Default branch" setting
5. Click the dropdown menu next to "Default branch"
6. Select `development` from the list
7. Confirm the change if prompted
8. Wait for confirmation message from GitHub
9. Refresh the page to verify the change persists
10. Note: The change is applied immediately

**Expected Output**:
- ✅ GitHub Settings shows `development` as the selected default branch
- ✅ No error messages
- ✅ Setting persists after page refresh
- ✅ Ready to proceed to T003

**Acceptance Criteria**:
- Default branch dropdown shows `development`
- Change persists across page refresh
- No errors or warnings displayed

**Notes**:
- This operation is immediate and reversible
- `main` branch remains unchanged in the repository
- Existing clones continue to use their current branch until explicitly updated

---

## Phase 3.2: Verification & Documentation

### T003: Verify Default Branch Change Applied

**Description**: Confirm that the default branch change was successfully applied by taking a screenshot of GitHub Settings showing the new default.

**Prerequisites**:
- T002 complete (default branch changed to development)

**Steps**:
1. Remain on GitHub Settings page (or navigate back to it)
2. Locate the "Default branch" section
3. Confirm the dropdown displays `development`
4. Take a screenshot showing:
   - Repository name (prnceb/hello-world)
   - Settings tab is active
   - Default branch section clearly visible
   - Dropdown value showing `development`
   - Timestamp or other confirmation indicator (if visible)
5. Crop/edit screenshot if needed for clarity
6. Save screenshot locally with descriptive name (e.g., `default-branch-change-verification.png`)

**Expected Output**:
- ✅ Screenshot showing `development` as default branch
- ✅ Clear, readable image suitable for PR documentation
- ✅ Screenshot saved and ready for inclusion in PR

**Acceptance Criteria**:
- Screenshot clearly shows default branch set to `development`
- Repository name is visible
- Settings page is clearly identifiable
- Image quality is sufficient for review

**Notes**:
- This screenshot serves as proof of the configuration change
- Will be included in PR description for audit trail
- Required by Week 4 sign-off process

---

### T004: Document Change in PR Description

**Description**: Prepare the PR description with verification screenshot and change documentation.

**Prerequisites**:
- T003 complete (screenshot taken)

**Steps**:
1. Create a new file or prepare text for PR description
2. Include the following sections:

```markdown
## Week 4 Finisher: Default Branch Hygiene

### Change Summary
- **Action**: Changed repository default branch from `main` to `development`
- **Reason**: Ensure reviewers see current project documentation as first impression
- **Verification**: Manual GitHub UI change with screenshot

### Verification
Screenshot of default branch change:
[Attach screenshot from T003 here]

**Details**:
- Current default branch: `development`
- Previous default branch: `main`
- Verification method: Manual GitHub Settings UI verification
- Change applied at: [timestamp - see screenshot]

### Impact
- New clones will receive `development` branch as default
- `main` branch remains unchanged (legacy default)
- No code changes; configuration only
- Complies with Week 4 Finisher requirements
```

3. Prepare screenshot attachment ready for PR
4. Document any additional notes from verification process

**Expected Output**:
- ✅ PR description prepared with screenshot
- ✅ All required information included
- ✅ Ready for PR creation in T005

**Acceptance Criteria**:
- PR description includes all required sections
- Screenshot is attached and visible
- Documentation is clear for reviewers
- Spec link included: `Spec: specs/019-title-week-4/spec.md`

---

### T005: Create and Merge PR

**Description**: Create a Pull Request with the default branch change documentation, obtain review approval, and merge.

**Prerequisites**:
- T004 complete (PR description prepared)
- Branch: `019-title-week-4` with current commits

**Steps**:
1. Navigate to https://github.com/prnceb/hello-world/pulls
2. Click "New Pull Request"
3. Select:
   - **Base branch**: `development` (target)
   - **Compare branch**: `019-title-week-4` (source)
4. Click "Create Pull Request"
5. In the PR form:
   - **Title**: "Week 4 Finisher: Default Branch Hygiene - Switch default to development"
   - **Description**: Paste the content from T004 (includes screenshot)
   - **Add label**: "week-4-finisher" or "devops"
6. Link the specification:
   - Add comment or PR body: `Spec: specs/019-title-week-4/spec.md`
7. Submit PR for review
8. Monitor for review feedback
9. Address any review comments (unlikely for config change)
10. Once approved, click "Merge pull request"
11. Confirm merge and delete the feature branch

**Expected Output**:
- ✅ PR created and visible on GitHub
- ✅ PR includes screenshot verification
- ✅ PR passes all checks (if any CI configured)
- ✅ PR merged to development branch
- ✅ Feature branch deleted
- ✅ Week 4 sign-off requirements met

**Acceptance Criteria**:
- PR created with complete documentation
- Screenshot visible in PR description
- PR approved and merged
- Default branch change is now live
- Feature branch cleaned up
- Merge commit visible in development history

**Notes**:
- Configuration change is immediately visible in repository settings
- No CI/CD gates needed (configuration-only)
- Manual review recommended for audit trail
- Completion signals Week 4 Finisher requirement

---

## Dependencies

- **T001** → T002 (precondition check before change)
- **T002** → T003 (change must be applied before verification)
- **T003** → T004 (screenshot needed for documentation)
- **T004** → T005 (documentation prepared before PR)
- **Sequential**: No parallel tasks (single configuration sequence)

---

## Parallel Execution
**Not applicable** - All tasks are sequential and dependent on previous task completion.

---

## Task Execution Guide

### Time Estimates
- T001 (Verify): ~3 minutes
- T002 (Change): ~2 minutes
- T003 (Verify): ~3 minutes
- T004 (Document): ~5 minutes
- T005 (PR & Merge): ~10 minutes
- **Total**: ~23 minutes

### Execution Command
```bash
# Verify prerequisites
git checkout 019-title-week-4
git status

# Tasks are manual GitHub UI operations:
# 1. Navigate to GitHub and perform T001-T003 steps
# 2. Prepare PR description (T004)
# 3. Create and merge PR (T005)
```

### Validation Checklist
- [ ] T001: Development branch verified as current
- [ ] T002: Default branch changed to development in GitHub Settings
- [ ] T003: Screenshot taken showing new default branch
- [ ] T004: PR description prepared with documentation
- [ ] T005: PR created, approved, and merged
- [ ] Feature branch `019-title-week-4` deleted
- [ ] Repository default branch now shows `development`

---

## Success Criteria

✅ **All criteria met when**:
1. GitHub repository default branch is set to `development`
2. Configuration change is documented in PR with screenshot
3. PR is merged to development branch
4. Verification screenshot is available in merge commit
5. Week 4 "Default branch story is cleaned up" requirement is fulfilled

---

## Notes

- **No Code Changes**: This feature requires no source code modifications
- **Manual Only**: All operations use GitHub web UI; no scripts required
- **Configuration Change**: Immediately visible in repository settings
- **Reversible**: Default branch can be changed back if needed
- **Audit Trail**: Screenshot and PR provide documentation of change
- **Week 4 Sign-Off**: Completion of this feature fulfills the "Default branch hygiene" requirement

---

*Generated by /tasks command | Based on specs/019-title-week-4/ | Version 1.0*
