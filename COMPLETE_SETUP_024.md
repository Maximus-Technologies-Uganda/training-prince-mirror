# 🎯 Complete Setup for 024-title-week-5 Linear Sub-Issues

**Feature**: Rate Limiter for POST Routes  
**Parent Issue**: PRI-2532  
**Total Sub-Issues**: 12  
**Status**: ✅ All scripts ready

---

## 📋 Two-Step Process

### Step 1️⃣: Create Sub-Issues (If Not Done Yet)

```bash
export LINEAR_API_KEY="your-api-key" && \
cd /Users/prnceb/Desktop/WORK/hello-world && \
node create-linear-sub-issues-024.mjs
```

**What this does**:
- Creates 12 new sub-issues under PRI-2532
- Assigns correct titles and descriptions
- Organizes by phases (4.1, 4.2, 4.3, 4.4)
- Reports success for each

**When to run**: If sub-issues don't exist yet in Linear

---

### Step 2️⃣: Update Status to "In Progress" ✅

```bash
export LINEAR_API_KEY="your-api-key" && \
cd /Users/prnceb/Desktop/WORK/hello-world && \
node update-linear-status-024.mjs
```

**What this does**:
- Changes status of all 12 sub-issues from "Triage" → "In Progress"
- Fetches parent issue and team automatically
- Updates each sub-issue
- Reports success for each

**When to run**: After creating sub-issues (or anytime you want to update status)

---

## 🔑 Get Your API Key

**First time only**:
1. Go to: https://linear.app/settings/api
2. Click "Create new" to generate a new API key
3. Copy the entire key (starts with `lin_pat_`)
4. Use in both commands above

**Existing key**:
- Just use your existing key from Linear settings

---

## 📊 Script Summary

| Script | Purpose | Status |
|--------|---------|--------|
| `create-linear-sub-issues-024.mjs` | Create 12 sub-issues | ✅ Ready |
| `update-linear-status-024.mjs` | Change status → "In Progress" | ✅ Ready |

---

## 🚀 Full Workflow

```
1. Get API Key (https://linear.app/settings/api)
   ↓
2. Run create script (creates 12 sub-issues)
   ↓
3. Run update script (changes status to "In Progress")
   ↓
4. Verify in Linear (https://linear.app/issues/PRI-2532)
   ↓
5. Start working on tasks (reference specs/024-title-week-5/tasks.md)
```

---

## 📝 Sub-Issues Structure

**Phase 4.1: Contract Tests** (8 parallel tasks)
```
T001 - Create contract test file [P]
T002 - Contract 1: POST /convert rate limit [P]
T003 - Contract 2: POST /expenses rate limit [P]
T004 - Contract 3: Independent quotas [P]
T005 - Contract 4: GET routes exempt [P]
T006 - Contract 5: Retry-After header [P]
T007 - Contract 6: Proxy trust config [P]
T008 - Contract 7: Logging [P]
```

**Phase 4.2: Implementation** (2 sequential)
```
T009 - Create rate-limit.ts middleware
T010 - Register rate limiter in Express app
```

**Phase 4.3-4.4: Validation** (2 sequential)
```
T011 - Run integration tests
T012 - Execute manual verification
```

---

## ✨ All Generated Files

| File | Type | Purpose |
|------|------|---------|
| `create-linear-sub-issues-024.mjs` | Script | Create 12 sub-issues |
| `update-linear-status-024.mjs` | Script | Update status → In Progress |
| `COMMAND_UPDATE_STATUS_024.md` | Guide | Instructions for update script |
| `STATUS_UPDATE_READY_024.txt` | Guide | Quick reference for status update |
| `specs/024-title-week-5/tasks.md` | Spec | 12 task specifications |
| `COMPLETE_SETUP_024.md` | Guide | This file - complete overview |

---

## 🎯 Quick Reference

**Create sub-issues**:
```bash
export LINEAR_API_KEY="your-key" && cd /Users/prnceb/Desktop/WORK/hello-world && node create-linear-sub-issues-024.mjs
```

**Update status**:
```bash
export LINEAR_API_KEY="your-key" && cd /Users/prnceb/Desktop/WORK/hello-world && node update-linear-status-024.mjs
```

**View in Linear**:
https://linear.app/issues/PRI-2532

**View tasks**:
`specs/024-title-week-5/tasks.md`

---

## ✅ Verification Checklist

After running both scripts:

- [ ] Script 1: "Summary: 12 created, 0 failed"
- [ ] Script 2: "Summary: Updated: 12, Failed: 0"
- [ ] Linear shows 12 sub-issues under PRI-2532
- [ ] All sub-issues status is "In Progress"
- [ ] Each has correct title (T001-T012)
- [ ] Each has full description from spec
- [ ] Ready to start work on T001

---

## 🔧 How They Work

### create-linear-sub-issues-024.mjs

```
Input:
  - LINEAR_API_KEY (env var)
  - PARENT_ISSUE = "PRI-2532"
  - TASKS array (12 tasks)

Process:
  1. Validate API key
  2. Fetch team ID from PRI-2532
  3. Get parent issue UUID
  4. For each task:
     - Create GraphQL mutation
     - Send to Linear API
     - Report result

Output:
  - 12 new sub-issues (PRI-2533 through PRI-2544)
  - Each with title and description
  - In Triage or default state
```

### update-linear-status-024.mjs

```
Input:
  - LINEAR_API_KEY (env var)
  - PARENT_ISSUE = "PRI-2532"

Process:
  1. Validate API key
  2. Fetch team ID
  3. Fetch "In Progress" state ID
  4. Fetch all 12 child issues
  5. For each issue:
     - Check current status
     - If not "In Progress": update
     - Report status change

Output:
  - All 12 sub-issues with "In Progress" status
  - Summary of updates
```

---

## 🚨 Troubleshooting

| Error | Cause | Solution |
|-------|-------|----------|
| "Authentication required" | Invalid API key | Get new key from Linear settings |
| "Failed to fetch parent issue" | PRI-2532 doesn't exist | Create parent issue first |
| "Found 0 sub-issues" | Sub-issues not created yet | Run create script first |
| "Could not find 'In Progress' state" | Workflow doesn't have state | Check Linear team workflow config |

---

## 📚 Documentation Files

**For quick start**:
- `STATUS_UPDATE_READY_024.txt` - Quick reference

**For detailed instructions**:
- `COMMAND_UPDATE_STATUS_024.md` - Full guide with steps

**For task specifications**:
- `specs/024-title-week-5/tasks.md` - All 12 task details

**For complete overview**:
- `COMPLETE_SETUP_024.md` - This file

---

## 🎉 You're All Set!

Both scripts are ready to use. Just:
1. Get your API key
2. Run create script (if needed)
3. Run update script
4. Verify in Linear
5. Start working!

---

**Created**: 2025-11-05  
**Feature**: 024-title-week-5 - Rate Limiter for POST Routes  
**Parent Issue**: PRI-2532  
**Status**: ✅ COMPLETE & READY

