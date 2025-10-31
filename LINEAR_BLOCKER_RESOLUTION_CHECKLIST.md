# ✅ Linear Triage Blocker Resolution Checklist

**Blocker**: 500 stale Triage issues blocking all new work  
**Root Cause**: create-sub-issues ran ✅ but sync-status script failed ❌  
**Solution**: Run local status sync scripts to move Triage → Done

---

## 📋 The Stale Issues Breakdown

| Feature | Parent ID | Location | Estimated Count | Status |
|---------|-----------|----------|-----------------|--------|
| **Day 0** | PRI-258 | specs/011-title-day-0 | ~200 | 🔴 Triage |
| **Tuesday** | PRI-1112 | specs/012-title-tuesday-spec | ~200 | 🔴 Triage |
| **Wednesday** | PRI-289 | specs/013-title-wednesday-spec | ~100 | ✅ Already done |
| **Thursday** | PRI-1412 | specs/014-thursday-stopwatch-ui | NEW | N/A |
| **TOTAL** | - | - | **~500** | **🔴 BLOCKED** |

---

## 🎯 YOUR ACTION PLAN (Steps 1-11)

### STEP 1: Download Day 0 Artifacts ⬇️
```
Go to: https://github.com/Maximus-Technologies-Uganda/training-prince/actions
├─ Find PR with title: "chore(ci): review-packet parity..." (Day 0)
├─ Or search for commit mentioning "PRI-258"
├─ Find job: "create-linear-sub-issues"
├─ Download artifact: "linear-map.json"
└─ Save to: specs/011-title-day-0/linear-map.json

Expected: File should be ~5-20 KB JSON with list of tasks and Linear IDs
```

**Verify it worked:**
```bash
ls -lah specs/011-title-day-0/linear-map.json
cat specs/011-title-day-0/linear-map.json | head -5
```

### STEP 2: Download Tuesday Artifacts ⬇️
```
Same GitHub Actions page:
├─ Find PR with title: "feat(ui-quote, ui-temp): polish UX..."  (Tuesday)
├─ Or search for commit mentioning "PRI-1112"
├─ Find job: "create-linear-sub-issues"
├─ Download artifact: "linear-map.json"
└─ Save to: specs/012-title-tuesday-spec/linear-map.json
```

**Verify it worked:**
```bash
ls -lah specs/012-title-tuesday-spec/linear-map.json
cat specs/012-title-tuesday-spec/linear-map.json | head -5
```

### STEP 3: Verify Both Mapping Files 📄
```bash
cd /Users/prnceb/Desktop/WORK/hello-world

# Check files exist
[ -f specs/011-title-day-0/linear-map.json ] && echo "✅ Day 0 map exists" || echo "❌ Missing"
[ -f specs/012-title-tuesday-spec/linear-map.json ] && echo "✅ Tuesday map exists" || echo "❌ Missing"

# Verify they're valid JSON
jq '.parent' specs/011-title-day-0/linear-map.json  # Should output: "PRI-258"
jq '.parent' specs/012-title-tuesday-spec/linear-map.json  # Should output: "PRI-1112"

# Check task count
jq '.tasks | length' specs/011-title-day-0/linear-map.json  # ~100-200 tasks
jq '.tasks | length' specs/012-title-tuesday-spec/linear-map.json  # ~100-200 tasks
```

### STEP 4: Sync Day 0 Tasks 🔄
```bash
cd /Users/prnceb/Desktop/WORK/hello-world

# Verify API key is set
echo $LINEAR_API_KEY | head -c 10
# Should output something like: lin_xxx...

# Run the sync script
LINEAR_API_KEY=$LINEAR_API_KEY node scripts/sync-day0-task-status.js
```

**Expected Output:**
```
🚀 Syncing Day 0 (PRI-258) Tasks to Linear

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Reading tasks.md...
✅ Found 27 tasks

📖 Reading mapping file...
✅ Parent Issue: PRI-258

📊 Found 27 completed task(s)

🔄 Syncing to Linear...

  ✅ Synced to Done: PRI-258-1
  ✅ Synced to Done: PRI-258-2
  ... [more items] ...

✨ Done! Synced 27/27 tasks
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### STEP 5: Check Linear - Day 0 ✓
```
1. Go to: https://linear.app/training-prince/issues
2. Click filter icon
3. Filter: Column = "Triage"
4. Refresh page (Cmd+R or Ctrl+R)
5. Look for PRI-258-* issues
6. They should be GONE from Triage ✅
7. Check "Done" column - PRI-258-* should be there now
```

### STEP 6: Sync Tuesday Tasks 🔄
```bash
cd /Users/prnceb/Desktop/WORK/hello-world

LINEAR_API_KEY=$LINEAR_API_KEY node scripts/sync-tuesday-task-status.js
```

**Expected Output:** Same format as Day 0, but for PRI-1112-*

### STEP 7: Check Linear - Tuesday ✓
```
1. Go to: https://linear.app/training-prince/issues
2. Filter: Column = "Triage"
3. Refresh page
4. Look for PRI-1112-* issues
5. They should be GONE from Triage ✅
6. Check "Done" column - PRI-1112-* should be there
```

### STEP 8: Verify Triage Column is Clean 🎉
```
1. Go to Linear board
2. Click Triage column
3. Should show: "0 items" or be empty
4. Scroll through board - no red "500" badge
5. Take screenshot for your boss!
```

### STEP 9: Mark Completed in Your Task List ✅
```
Update RESOLVE_TRIAGE_BLOCKER.md:
- [x] Downloaded Day 0 linear-map.json
- [x] Downloaded Tuesday linear-map.json  
- [x] Verified both files exist
- [x] Ran Day 0 sync script
- [x] Checked Linear - Day 0 resolved
- [x] Ran Tuesday sync script
- [x] Checked Linear - Tuesday resolved
- [x] Verified Triage column is clean
```

### STEP 10: Test That New Work Can Proceed 🚀
```bash
# Verify no blockers remain
Linear board Triage column should be EMPTY

# Proceed to T010 implementation
cd /Users/prnceb/Desktop/WORK/hello-world
git status  # Should be clean
npm test    # All tests passing

# Ready to implement T010!
```

### STEP 11: Commit & Document 📝
```bash
git add scripts/sync-day0-task-status.js
git add scripts/sync-tuesday-task-status.js
git commit -m "chore: add sync scripts for Day 0 and Tuesday task status

- Added sync-day0-task-status.js to resolve PRI-258 tasks
- Added sync-tuesday-task-status.js to resolve PRI-1112 tasks
- Resolves 500 stale Triage issues blocking development"

# Optional: Push if ready
# git push origin 014-thursday-stopwatch-ui
```

---

## ⚠️ TROUBLESHOOTING

### Problem: "LINEAR_API_KEY not set"
**Solution:**
```bash
# Make sure it's exported
export LINEAR_API_KEY="your-linear-api-key"

# Or pass it directly
LINEAR_API_KEY="lin_xyz..." node scripts/sync-day0-task-status.js
```

### Problem: "linear-map.json not found"
**Solution:**
- [ ] Go to GitHub Actions and download the artifact again
- [ ] Verify correct file name and path
- [ ] Make sure you saved it to the right spec directory

### Problem: "Tasks file not found: specs/011-title-day-0/tasks.md"
**Solution:**
```bash
# Verify tasks.md exists
ls -la specs/011-title-day-0/tasks.md
ls -la specs/012-title-tuesday-spec/tasks.md

# If missing, something is wrong with the repo setup
```

### Problem: "No completed tasks to sync"
**Solution:**
- [ ] Check if tasks.md has items marked with `[x]` (completed)
- [ ] Search for `- [x]` in the tasks file
- [ ] If all are `[ ]` (pending), that's why nothing syncs
- [ ] You might need to mark them completed first

### Problem: "Update failed for PRI-258-*"
**Solution:**
- [ ] Check that LINEAR_API_KEY is valid
- [ ] Check that team has a "Done" state in Linear
- [ ] Check that your Linear permissions allow updates
- [ ] Try again - might be temporary API issue

---

## 📊 SUCCESS METRICS

After completing all steps:

```
BEFORE:
  Triage: 500 issues ❌ (BLOCKER)
  In Progress: X issues
  Done: Y issues

AFTER:
  Triage: 0 issues ✅ (CLEAR)
  In Progress: X issues
  Done: Y + 500 issues ✅

Result: ✅ BLOCKER CLEARED - Ready to proceed with T010+
```

---

## 🎯 NEXT STEPS (After Blocker Cleared)

1. ✅ Triage issues resolved
2. ✅ Board clean and ready
3. ✅ Your boss unblocked
4. → Implement **T010**: formatTime() utility
5. → Continue with T011-T016: Core timer logic
6. → Implement T017-T022: UI and styling
7. → Finalize with T023-T034: Testing and polish

---

## 📞 QUICK REFERENCE

**Sync Scripts Location:**
- `scripts/sync-day0-task-status.js` - For PRI-258 (Day 0)
- `scripts/sync-tuesday-task-status.js` - For PRI-1112 (Tuesday)
- `scripts/sync-wednesday-task-status.js` - For PRI-289 (Wednesday - already done)

**Mapping Files Expected:**
- `specs/011-title-day-0/linear-map.json`
- `specs/012-title-tuesday-spec/linear-map.json`
- `specs/013-title-wednesday-spec/linear-map.json` ✅ (already present)

**Linear Board:**
- https://linear.app/training-prince/issues

---

*This should take 10-15 minutes total and clear your 500-issue blocker immediately!*
