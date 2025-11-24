# 📑 Index: 024-title-week-5 Scripts & Guides

**Date**: 2025-11-05  
**Feature**: Rate Limiter for POST Routes  
**Parent Issue**: PRI-2532  
**Status**: ✅ Complete & Ready

---

## 🚀 Quick Links

| Action | Script/File | Command |
|--------|------------|---------|
| **Create sub-issues** | `create-linear-sub-issues-024.mjs` | `export LINEAR_API_KEY="key" && cd hello-world && node create-linear-sub-issues-024.mjs` |
| **Update status** | `update-linear-status-024.mjs` | `export LINEAR_API_KEY="key" && cd hello-world && node update-linear-status-024.mjs` |
| **View in Linear** | - | https://linear.app/issues/PRI-2532 |
| **Task specs** | `specs/024-title-week-5/tasks.md` | Reference for all 12 tasks |

---

## 📝 All Files Created

### 🔧 Scripts (2 files)

**1. create-linear-sub-issues-024.mjs** (9.2 KB)
- Creates 12 sub-issues under PRI-2532
- Fetches team ID from parent issue
- Gets parent issue UUID (not identifier)
- Creates each sub-issue with GraphQL
- Reports success/failure for each
- **Status**: ✅ FIXED & READY

**2. update-linear-status-024.mjs** (7.2 KB, NEW)
- Updates status of all 12 sub-issues
- Changes from "Triage" → "In Progress"
- Fetches team and workflow state
- Updates each sub-issue
- Reports changes for each
- **Status**: ✅ NEW & READY

---

### 📖 Documentation Guides (5 files)

**3. COMPLETE_SETUP_024.md**
- Complete overview of both scripts
- Full workflow explanation
- Two-step process guide
- Troubleshooting
- Verification checklist
- **Best for**: Understanding the complete process

**4. STATUS_UPDATE_READY_024.txt**
- Quick reference for status update
- Expected output
- Status changes visualization
- Troubleshooting
- **Best for**: Quick reference before running

**5. COMMAND_UPDATE_STATUS_024.md**
- Step-by-step instructions
- Detailed explanation of what script does
- Troubleshooting FAQ
- Before/after status table
- **Best for**: Detailed walk-through

**6. COMMAND_TO_CREATE_LINEAR_SUB_ISSUES_024.md**
- Instructions for creation script
- Sub-issues list
- Step-by-step guide
- Troubleshooting
- **Best for**: Creating sub-issues (if needed)

**7. QUICK_START_024_LINEAR_SETUP.txt**
- Fast startup guide
- Quick steps
- Expected output
- Next steps
- **Best for**: Fast path to running

---

### 📋 Task Specification (1 file)

**8. specs/024-title-week-5/tasks.md**
- 12 task specifications
- Detailed descriptions for each task
- Execution order and dependencies
- Acceptance criteria
- **Best for**: Executing the actual work

---

## 🎯 Which File to Read First?

**If you want to...**

| Goal | File | Time |
|------|------|------|
| Get started immediately | `STATUS_UPDATE_READY_024.txt` | 2 min |
| Understand the full process | `COMPLETE_SETUP_024.md` | 5 min |
| See detailed step-by-step | `COMMAND_UPDATE_STATUS_024.md` | 5 min |
| Start working on tasks | `specs/024-title-week-5/tasks.md` | 10 min |
| Troubleshoot an issue | `COMPLETE_SETUP_024.md` → Troubleshooting | varies |

---

## 🚀 Two-Command Setup

### Command 1: Create Sub-Issues (if needed)

```bash
export LINEAR_API_KEY="your-api-key" && \
cd /Users/prnceb/Desktop/WORK/hello-world && \
node create-linear-sub-issues-024.mjs
```

### Command 2: Update Status ← YOU ARE HERE

```bash
export LINEAR_API_KEY="your-api-key" && \
cd /Users/prnceb/Desktop/WORK/hello-world && \
node update-linear-status-024.mjs
```

---

## ✅ What Each Script Does

### create-linear-sub-issues-024.mjs

**Input**:
- LINEAR_API_KEY environment variable
- 12 task definitions

**Process**:
1. Validate API key
2. Fetch team and parent ID from PRI-2532
3. For each of 12 tasks:
   - Create GraphQL issue mutation
   - Send to Linear API
   - Report result

**Output**:
- 12 new sub-issues (PRI-2533 through PRI-2544)
- Each with title and description
- Status: "Triage" or default

**Run when**: Sub-issues don't exist yet

---

### update-linear-status-024.mjs

**Input**:
- LINEAR_API_KEY environment variable
- Parent issue: PRI-2532

**Process**:
1. Validate API key
2. Fetch parent issue UUID
3. Fetch team ID
4. Fetch "In Progress" state ID
5. Fetch all 12 child issues
6. For each issue:
   - Check current state
   - Update to "In Progress" if not already
   - Report change

**Output**:
- All 12 sub-issues with status "In Progress"
- Summary: number updated, already in progress, failed

**Run when**: After creating sub-issues (or anytime to update)

---

## 🔐 API Key

**Get your API key**:
1. Go to: https://linear.app/settings/api
2. Click "Create new" or use existing key
3. Copy the full key (starts with `lin_pat_`)
4. Use in both commands above

**Security**:
- ✅ OK: Use directly in command (not logged)
- ✅ OK: Store in `.env` for repeated use
- ❌ NOT OK: Commit to git
- ❌ NOT OK: Share with others

If you expose your key:
1. Delete it from: https://linear.app/settings/api
2. Create a new one
3. Use the new key

---

## 📊 File Structure Overview

```
hello-world/
├── Scripts/
│   ├── create-linear-sub-issues-024.mjs      ← Creates 12 issues
│   └── update-linear-status-024.mjs          ← Updates status [NEW]
│
├── Documentation/
│   ├── COMPLETE_SETUP_024.md                 ← Full overview
│   ├── STATUS_UPDATE_READY_024.txt           ← Quick reference
│   ├── COMMAND_UPDATE_STATUS_024.md          ← Step-by-step
│   ├── COMMAND_TO_CREATE_LINEAR_SUB_ISSUES_024.md
│   ├── QUICK_START_024_LINEAR_SETUP.txt
│   ├── 024_SCRIPTS_AND_GUIDES_INDEX.md       ← This file
│   └── others...
│
└── Specifications/
    └── specs/024-title-week-5/
        ├── spec.md                           ← Requirements
        ├── plan.md                           ← Implementation plan
        ├── data-model.md                     ← Data model
        ├── research.md                       ← Tech decisions
        ├── quickstart.md                     ← Manual testing
        └── tasks.md                          ← 12 tasks ← START HERE after scripts
```

---

## 🎯 Full Workflow

```
STEP 1: Get API Key
        https://linear.app/settings/api
        
        ↓
        
STEP 2: Create Sub-Issues (if needed)
        create-linear-sub-issues-024.mjs
        Outputs: PRI-2533 through PRI-2544
        
        ↓
        
STEP 3: Update Status to "In Progress" ← YOU ARE HERE
        update-linear-status-024.mjs
        Changes all 12 to "In Progress"
        
        ↓
        
STEP 4: Verify in Linear
        https://linear.app/issues/PRI-2532
        Should show 12 sub-issues, all "In Progress"
        
        ↓
        
STEP 5: Start Working
        Reference: specs/024-title-week-5/tasks.md
        Begin with: T001 (create contract tests)
```

---

## ✨ What You Get

After running both scripts:

```
Linear (https://linear.app/issues/PRI-2532)
├── PRI-2533 - Create contract test file [In Progress] ← T001
├── PRI-2534 - Contract 1: POST /convert limit [In Progress] ← T002
├── PRI-2535 - Contract 2: POST /expenses limit [In Progress] ← T003
├── PRI-2536 - Contract 3: Independent quotas [In Progress] ← T004
├── PRI-2537 - Contract 4: GET routes exempt [In Progress] ← T005
├── PRI-2538 - Contract 5: Retry-After header [In Progress] ← T006
├── PRI-2539 - Contract 6: Proxy trust config [In Progress] ← T007
├── PRI-2540 - Contract 7: Logging [In Progress] ← T008
├── PRI-2541 - Create rate-limit.ts middleware [In Progress] ← T009
├── PRI-2542 - Register rate limiter [In Progress] ← T010
├── PRI-2543 - Run integration tests [In Progress] ← T011
└── PRI-2544 - Execute manual verification [In Progress] ← T012
```

All marked as "In Progress" ✅

---

## 🚨 Troubleshooting

| Problem | File to Check |
|---------|---------------|
| "Authentication required" | COMPLETE_SETUP_024.md (Troubleshooting) |
| "Failed to fetch parent issue" | STATUS_UPDATE_READY_024.txt (Troubleshooting) |
| "Found 0 sub-issues" | COMMAND_UPDATE_STATUS_024.md (Troubleshooting) |
| Script not found | Verify you're in `/Users/prnceb/Desktop/WORK/hello-world` |
| Need help understanding | COMPLETE_SETUP_024.md (Full overview) |

---

## 📞 Quick Help

**"How do I create the sub-issues?"**
→ Run `create-linear-sub-issues-024.mjs` (see COMMAND_TO_CREATE_LINEAR_SUB_ISSUES_024.md)

**"How do I update the status?"**
→ Run `update-linear-status-024.mjs` (see STATUS_UPDATE_READY_024.txt)

**"What are the 12 tasks?"**
→ See `specs/024-title-week-5/tasks.md`

**"How do I start working?"**
→ Read `specs/024-title-week-5/tasks.md` and start with T001

**"What if something fails?"**
→ Check COMPLETE_SETUP_024.md (Troubleshooting section)

---

## ✅ Ready to Go!

Everything is prepared. Just:
1. Get your API key
2. Run the update script
3. Verify in Linear
4. Start working!

---

**Created**: 2025-11-05  
**Feature**: 024-title-week-5 - Rate Limiter for POST Routes  
**Parent Issue**: PRI-2532  
**Status**: ✅ ALL COMPLETE & READY


