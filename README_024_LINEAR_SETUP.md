# 🚀 Linear Sub-Issues Setup for 024-title-week-5

**Status**: ✅ Ready to create  
**Parent Issue**: PRI-2532 (Rate Limiter for POST Routes)  
**Total Sub-Issues**: 12  
**Feature Branch**: 024-title-week-5  

---

## 📋 What's Been Generated

Three files have been created to help you set up the Linear sub-issues:

1. **`specs/024-title-week-5/tasks.md`** (110 lines)
   - Complete task specification with 12 actionable tasks
   - Execution order and dependencies documented
   - Acceptance criteria and validation checklist

2. **`create-linear-sub-issues-024.mjs`** (284 lines)
   - Fixed Node.js script to create Linear sub-issues
   - Automatically fetches team ID from parent issue
   - Creates all 12 sub-issues with full descriptions
   - Proper error handling and reporting

3. **`QUICK_START_024_LINEAR_SETUP.txt`** (Reference guide)
   - Step-by-step instructions for running the script
   - Troubleshooting guide
   - Next steps after creation

---

## ⚡ TL;DR - Run This Command

```bash
export LINEAR_API_KEY="your-api-key-here" && \
cd /Users/prnceb/Desktop/WORK/hello-world && \
node create-linear-sub-issues-024.mjs
```

**Where to get your API key**: https://linear.app/settings/api

---

## 🔧 How the Fixed Script Works

The original script had an error: it tried to use `state: "backlog"` which Linear API doesn't accept.

**The fix** (applied in create-linear-sub-issues-024.mjs):
- ✅ Removed `state` parameter from issue creation
- ✅ Issues now created with default state
- ✅ Uses proper GraphQL mutation format matching Linear API v1
- ✅ Includes proper string escaping for special characters in descriptions
- ✅ Fetches team ID from parent issue (PRI-2532) automatically

---

## 📝 Sub-Issues Structure

The 12 sub-issues will be organized in 4 phases:

### Phase 4.1: Contract Tests (8 tasks marked [P] for parallel)
```
T001 - Create contract test file rate-limit.contract.test.ts [P]
T002 - Contract 1: POST /api/convert rate limit [P]
T003 - Contract 2: POST /api/expenses rate limit [P]
T004 - Contract 3: Independent quotas [P]
T005 - Contract 4: GET routes exempt [P]
T006 - Contract 5: Retry-After header [P]
T007 - Contract 6: Proxy trust config [P]
T008 - Contract 7: Logging [P]
```

### Phase 4.2: Implementation (2 sequential tasks)
```
T009 - Create rate-limit.ts middleware
T010 - Register rate limiter in Express app
```

### Phase 4.3-4.4: Validation (2 sequential tasks)
```
T011 - Run integration tests
T012 - Execute manual verification
```

---

## 🎯 Execution Flow

```
Phase 4.1 (Contract Tests)
    ↓ (write contracts first)
Phase 4.2 (Implementation)
    ↓ (implement to pass contracts)
Phase 4.3 (Integration Tests)
    ↓ (verify tests pass)
Phase 4.4 (Manual Verification)
    ↓ (validate in practice)
✅ Feature Complete
```

---

## ✨ Files Created Summary

| File | Purpose | Lines |
|------|---------|-------|
| `specs/024-title-week-5/tasks.md` | Task specification | ~110 |
| `create-linear-sub-issues-024.mjs` | Sub-issue creation script (fixed) | ~284 |
| `QUICK_START_024_LINEAR_SETUP.txt` | Quick reference guide | ~140 |
| `README_024_LINEAR_SETUP.md` | This file | - |
| `COMMAND_TO_CREATE_LINEAR_SUB_ISSUES_024.md` | Detailed instructions | ~150 |

---

## 🔐 Security Note

Your Linear API key is sensitive. When running the script:
- ✅ Use it directly in the command (it won't be logged)
- ✅ Store it in `.env` if you'll use it multiple times
- ❌ Don't commit it to git
- ❌ Don't share it with others

If you accidentally expose your key:
1. Go to https://linear.app/settings/api
2. Delete the exposed key immediately
3. Create a new one

---

## 🚦 Next Steps

1. **Get API Key** → https://linear.app/settings/api
2. **Copy the key** → Should start with `lin_pat_`
3. **Run the command** → See "TL;DR" section above
4. **Verify creation** → Check https://linear.app/issues/PRI-2532
5. **Start work** → Reference `specs/024-title-week-5/tasks.md` for details
6. **Follow execution order** → T001 → T002 → ... → T012

---

## 📖 Reference Documents

All design documents are complete and ready:

- **Spec**: `specs/024-title-week-5/spec.md` - Feature requirements
- **Plan**: `specs/024-title-week-5/plan.md` - Technical implementation plan
- **Design**: `specs/024-title-week-5/data-model.md` - Entity definitions
- **Research**: `specs/024-title-week-5/research.md` - Technology decisions
- **Quickstart**: `specs/024-title-week-5/quickstart.md` - Manual test procedures
- **Tasks**: `specs/024-title-week-5/tasks.md` - 12 actionable tasks ← START HERE

---

## ❓ Troubleshooting

**Q: "Authentication required, not authenticated"**  
A: Your API key is invalid or expired. Get a new one from https://linear.app/settings/api

**Q: "Failed to fetch parent issue"**  
A: Parent issue PRI-2532 doesn't exist. Make sure it was created and you're in the correct workspace.

**Q: "Could not find module..."**  
A: You're running Node.js. Make sure you have Node.js 14+ installed. Run `node --version` to check.

**Q: Some issues didn't create**  
A: Check the error message. Most common: API key expired or description contains quotes that need escaping.

---

## ✅ Success Criteria

When the script completes successfully, you'll see:

```
🚀 Creating Linear sub-issues for 024-title-week-5
📍 Parent issue: PRI-2532
📋 Total tasks: 12

🔍 Fetching team ID...
✅ Team ID: [team-id]

📝 Creating sub-issues...

✅ T001: PRI-2533 - Create contract test file rate-limit.contract.test.ts [P]
✅ T002: PRI-2534 - Contract 1: POST /api/convert 100 req/15 min limit [P]
... (10 more ✅)

════════════════════════════════════════════════════
📊 Summary: 12 created, 0 failed
════════════════════════════════════════════════════

✨ Sub-issues created under PRI-2532
🔗 View in Linear: https://linear.app/issues/PRI-2532
```

Then check Linear: https://linear.app/issues/PRI-2532 to see all 12 sub-issues!

---

**Created**: 2025-11-05  
**Feature**: Rate Limiter for POST Routes  
**Branch**: 024-title-week-5  
**Parent Issue**: PRI-2532


