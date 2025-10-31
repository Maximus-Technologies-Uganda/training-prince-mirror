# ⚡ Automatic Linear Sub-Issues Creation

**Workflow**: `create-linear-sub-issues-016.yml`  
**Status**: Ready to run  
**Parent Issue**: `PRI-1514`  
**Tasks**: 15 sub-issues

---

## 🚀 How to Run (2 Steps)

### Step 1: Ensure LINEAR_API_KEY is Set

The workflow needs your Linear API key in GitHub secrets:

1. Go to: https://github.com/Maximus-Technologies-Uganda/training-prince/settings/secrets/actions
2. Click "New repository secret"
3. Name: `LINEAR_API_KEY`
4. Value: Your Linear personal API key from https://linear.app/settings/api
5. Click "Add secret"

### Step 2: Trigger the Workflow

1. Go to: https://github.com/Maximus-Technologies-Uganda/training-prince/actions
2. Find: **"Create Linear Sub-Issues (016)"** workflow
3. Click on it
4. Click **"Run workflow ▼"**
5. Enter defaults (already filled):
   - Parent Issue ID: `PRI-1514`
   - Tasks File: `specs/016-week-4-finisher/tasks.md`
6. Click **"Run workflow"** button
7. Wait 1-2 minutes for completion

---

## ✅ What the Workflow Does

✅ Reads task list from `specs/016-week-4-finisher/tasks.md`  
✅ Creates 15 sub-issues under `PRI-1514` automatically  
✅ Sets dependencies between tasks  
✅ Sets priorities (High for setup & summary, Medium for others)  
✅ Adds full descriptions with acceptance criteria  
✅ Avoids rate limiting with 500ms delays  
✅ Prints summary of created issues  

---

## 📊 Expected Output

```
🚀 Creating Linear Sub-Issues

📌 Parent Issue: PRI-1514
📂 Tasks File: specs/016-week-4-finisher/tasks.md

📋 Creating 15 sub-issues...

✅ Created PRI-1514-1: T001: Establish Baseline Coverage Snapshot
✅ Created PRI-1514-2: T002: Create npm Script for Coverage with Thresholds
✅ Created PRI-1514-3: T003: Create Vitest Configuration Contract Test
✅ Created PRI-1514-4: T004: Create GitHub Actions CI Contract Test
✅ Created PRI-1514-5: T005: Create Review-Packet Integration Contract Test
✅ Created PRI-1514-6: T006: Configure Vitest Coverage Thresholds
✅ Created PRI-1514-7: T007: Update GitHub Actions Checks Workflow
✅ Created PRI-1514-8: T008: Update Review-Packet Workflow for Coverage
✅ Created PRI-1514-9: T009: Verify Exclusion Patterns Work Correctly
✅ Created PRI-1514-10: T010: Verify Threshold Enforcement (Pass Scenario)
✅ Created PRI-1514-11: T011: Document Coverage Policy & Requirements
✅ Created PRI-1514-12: T012: Validate Vitest Config Test Pass
✅ Created PRI-1514-13: T013: Validate CI Workflow Test Pass
✅ Created PRI-1514-14: T014: Validate Review-Packet Integration Test Pass
✅ Created PRI-1514-15: T015: Run Full Test Suite & Verify All Tests Pass

✨ Sub-issue creation complete!

📊 Summary:
   Created: 15/15
   Parent: PRI-1514

🔗 Linear Issues:
   T001 → PRI-1514-1
   T002 → PRI-1514-2
   ... (all 15 listed)
```

---

## 🔍 Verify in Linear

After workflow completes:

1. Go to Linear: https://linear.app
2. Open **PRI-1514** (parent issue)
3. Expand "Sub-issues" section
4. Verify all 15 sub-issues created ✅
5. Check dependencies are set correctly ⚙️
6. Confirm priorities assigned 🎯

---

## ⚙️ Troubleshooting

**❌ Error: "LINEAR_API_KEY not set in GitHub secrets"**
- Solution: Add the secret to GitHub settings (Step 1 above)

**❌ Workflow not showing in Actions list**
- Solution: Push this file: `.github/workflows/create-linear-sub-issues-016.yml`
  ```bash
  git add .github/workflows/create-linear-sub-issues-016.yml
  git commit -m "ci: add workflow to create linear sub-issues for 016"
  git push origin 016-week-4-finisher
  ```

**❌ Some issues failed to create**
- Solution: Check Linear API key is valid
- The workflow continues and reports which ones failed
- Run again to retry failed tasks

**❌ "parentId" error in Linear API**
- Solution: Make sure `PRI-1514` actually exists in your Linear workspace

---

## 🎯 Next Steps

1. ✅ Add `LINEAR_API_KEY` to GitHub secrets
2. ✅ Run the workflow (click "Run workflow")
3. ✅ Verify all 15 sub-issues created in Linear
4. ✅ Assign team members to tasks
5. ✅ Begin execution with T001

---

## 📝 Files

- **Workflow**: `.github/workflows/create-linear-sub-issues-016.yml`
- **Tasks**: `specs/016-week-4-finisher/tasks.md`
- **Manual Guide**: `MANUAL-CREATE-LINEAR-SUBISSUES.md` (if automation fails)

---

**🎉 Fully Automated - No Manual Data Entry Required!**
