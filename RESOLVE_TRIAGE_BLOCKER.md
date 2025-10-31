# 🚨 CRITICAL BLOCKER: Resolve 500 Stale Triage Issues

**Status**: BLOCKED - 500 issues in Triage from Days 0, Tuesday, Wednesday  
**Cause**: create-sub-issues ran ✅ but sync-status failed ❌  
**Solution**: Run local sync scripts to move from Triage → Done

---

## 📋 Overview of Stale Issues

Your Linear board has issues stuck in Triage from these completed features:

| Day | Feature | Parent ID | Spec Dir | Issues Count | Status |
|-----|---------|-----------|----------|--------------|--------|
| Day 0 | Implementation Day 0 | PRI-258 | `specs/011-title-day-0` | ~200? | 🟡 Triage |
| Tuesday | Quote UI + Temp Converter | PRI-1112 | `specs/012-title-tuesday-spec` | ~200? | 🟡 Triage |
| Wednesday | Expense/Todo Filtering | PRI-289 | `specs/013-title-wednesday-spec` | ~100 | ✅ Synced |

**Wednesday (PRI-289) is DONE** - you already have linear-map.json and tests show it's synced.  
**Need to handle**: Day 0 (PRI-258) and Tuesday (PRI-1112)

---

## ✅ SOLUTION: Run Status Sync Locally

You already have the mechanism in place. Here's the exact workflow:

### Step 1: Locate GitHub Actions Artifacts

**For Day 0 (PRI-258):**
```
1. Go to: https://github.com/Maximus-Technologies-Uganda/training-prince/actions
2. Search for PR: "chore(ci): review-packet parity..." or look for Day 0 commit
3. Find the "create-linear-sub-issues" job that ran
4. Download artifact: linear-map.json
5. Save to: specs/011-title-day-0/linear-map.json
```

**For Tuesday (PRI-1112):**
```
1. Same GitHub Actions page
2. Search for PR: "feat(ui-quote, ui-temp): polish UX..." or Tuesday commit
3. Find the "create-linear-sub-issues" job
4. Download artifact: linear-map.json
5. Save to: specs/012-title-tuesday-spec/linear-map.json
```

---

### Step 2: Verify Mapping Files are in Place

After downloading, verify:

```bash
# Should exist and be valid JSON
ls -la specs/011-title-day-0/linear-map.json
ls -la specs/012-title-tuesday-spec/linear-map.json

# Verify format
cat specs/011-title-day-0/linear-map.json | jq '.parent'
cat specs/012-title-tuesday-spec/linear-map.json | jq '.parent'
```

Expected output:
```
"PRI-258"
"PRI-1112"
```

---

### Step 3: Create Local Sync Scripts (If Needed)

If sync scripts don't exist for Day 0 and Tuesday, we need to create them.

**Option A: Use Generic Sync Script** (if available)
```bash
node scripts/linear-sync.js --spec "011-title-day-0"
node scripts/linear-sync.js --spec "012-title-tuesday-spec"
```

**Option B: Create Custom Sync Scripts**
Create `scripts/sync-day0-task-status.js` and `scripts/sync-tuesday-task-status.js` 
(following the Wednesday pattern in sync-wednesday-task-status.js)

---

### Step 4: Run Status Sync Commands (Locally)

**From project root**, run these commands one at a time:

```bash
# Sync Day 0 tasks (PRI-258) from Triage → Done
cd /Users/prnceb/Desktop/WORK/hello-world
LINEAR_API_KEY=$LINEAR_API_KEY node scripts/sync-day0-task-status.js

# Sync Tuesday tasks (PRI-1112) from Triage → Done
LINEAR_API_KEY=$LINEAR_API_KEY node scripts/sync-tuesday-task-status.js
```

Or if using generic sync:
```bash
LINEAR_API_KEY=$LINEAR_API_KEY node scripts/linear-sync.js --spec "011-title-day-0"
LINEAR_API_KEY=$LINEAR_API_KEY node scripts/linear-sync.js --spec "012-title-tuesday-spec"
```

**Expected Output:**
```
✅ Syncing PRI-258 tasks...
  📋 Reading: specs/011-title-day-0/tasks.md
  🔍 Found X completed tasks [marked with [x]]
  📡 Updating Linear status...
  ✅ Successfully updated X issues to "Done"
  
✅ Syncing PRI-1112 tasks...
  📋 Reading: specs/012-title-tuesday-spec/tasks.md
  🔍 Found Y completed tasks [marked with [x]]
  📡 Updating Linear status...
  ✅ Successfully updated Y issues to "Done"
```

---

### Step 5: Verify in Linear

After each command:

```
1. Go to Linear: https://linear.app/training-prince/issues
2. Filter: Column = "Triage"
3. Check that PRI-258-* issues moved to "Done"
4. Check that PRI-1112-* issues moved to "Done"
5. Repeat filter - should show fewer and fewer Triage items
```

---

## 🚀 QUICK ACTION ITEMS

```
[ ] 1. Go to GitHub Actions → Find Day 0 PR → Download linear-map.json
[ ] 2. Save to: specs/011-title-day-0/linear-map.json
[ ] 3. Go to GitHub Actions → Find Tuesday PR → Download linear-map.json
[ ] 4. Save to: specs/012-title-tuesday-spec/linear-map.json
[ ] 5. Verify both files exist and are valid JSON
[ ] 6. Run: LINEAR_API_KEY=$LINEAR_API_KEY node scripts/sync-day0-task-status.js
[ ] 7. Wait for completion → Check Linear "Triage" column
[ ] 8. Run: LINEAR_API_KEY=$LINEAR_API_KEY node scripts/sync-tuesday-task-status.js
[ ] 9. Wait for completion → Check Linear "Triage" column
[ ] 10. Verify all 500 issues moved to appropriate status
[ ] 11. Refresh Linear board - should be clean now!
```

---

## 📞 If Issues Arise

**Problem**: linear-map.json not found  
**Solution**: Check GitHub Actions artifacts were downloaded correctly

**Problem**: Script says "no tasks to sync"  
**Solution**: Verify tasks.md has items marked with `[x]` for completed work

**Problem**: API key error  
**Solution**: Ensure `LINEAR_API_KEY` env var is set: `echo $LINEAR_API_KEY`

**Problem**: Issues still in Triage after sync  
**Solution**: Check Linear workflow - status might need manual review or have dependencies

---

## 📊 Expected Result

**Before:**
```
Triage: 500 issues
In Progress: X issues
Done: Y issues
```

**After:**
```
Triage: 0 issues ✅
In Progress: X issues
Done: Y + 500 issues ✅
```

---

*This will take ~5-10 minutes to complete and clear your blocker immediately.*
