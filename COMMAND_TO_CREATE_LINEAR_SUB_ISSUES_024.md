# Creating Linear Sub-Issues for 024-title-week-5

**Parent Issue**: PRI-2532 (Rate Limiter for POST Routes)  
**Feature**: Week 5 Stretch Goal - Rate Limiter Implementation  
**Total Sub-Issues**: 12 tasks  
**Branch**: 024-title-week-5

---

## Quick Start

Run this command in your terminal:

```bash
export LINEAR_API_KEY="your-linear-api-key" && \
cd /Users/prnceb/Desktop/WORK/hello-world && \
node create-linear-sub-issues-024.mjs
```

---

## Step-by-Step Instructions

### Step 1: Get Your Linear API Key

1. Go to: https://linear.app/settings/api
2. Create a new API key (if you don't have one)
3. Copy the API key to your clipboard

### Step 2: Set the Environment Variable

```bash
export LINEAR_API_KEY="lin_pat_xxxxxxxxxxxxxxxxxxxxx"
```

Replace `lin_pat_xxxxxxxxxxxxxxxxxxxxx` with your actual API key.

### Step 3: Run the Script

```bash
cd /Users/prnceb/Desktop/WORK/hello-world && node create-linear-sub-issues-024.mjs
```

### Step 4: Verify Creation

You should see output like:

```
🚀 Creating Linear sub-issues for 024-title-week-5
📍 Parent issue: PRI-2532
📋 Total tasks: 12

🔍 Fetching team ID...
✅ Team ID: [team-id]

📝 Creating sub-issues...

✅ T001: PRI-2533 - Create contract test file rate-limit.contract.test.ts [P]
✅ T002: PRI-2534 - Contract 1: POST /api/convert 100 req/15 min limit [P]
... (10 more sub-issues)

📊 Summary: 12 created, 0 failed
```

---

## One-Liner Command (Copy & Paste)

If you prefer a single command, run this (replacing the API key):

```bash
export LINEAR_API_KEY="your-api-key-here" && cd /Users/prnceb/Desktop/WORK/hello-world && node create-linear-sub-issues-024.mjs
```

---

## Sub-Issues Being Created

The script will create these 12 sub-issues under PRI-2532:

### Phase 4.1: Contract Tests (8 tasks marked [P] for parallel)
1. **T001** - Create contract test file setup
2. **T002** - Contract 1: POST /api/convert rate limit
3. **T003** - Contract 2: POST /api/expenses rate limit
4. **T004** - Contract 3: Independent quota per endpoint
5. **T005** - Contract 4: GET routes exempt
6. **T006** - Contract 5: Retry-After header accuracy
7. **T007** - Contract 6: Proxy trust configuration
8. **T008** - Contract 7: Logging on rate limit rejection

### Phase 4.2: Middleware Implementation (2 sequential tasks)
9. **T009** - Create rate-limit.ts middleware
10. **T010** - Register rate limiter in api/src/index.ts

### Phase 4.3 & 4.4: Validation & Manual Verification (2 sequential tasks)
11. **T011** - Run integration tests and verify
12. **T012** - Execute manual verification from quickstart.md

---

## What Was Generated

In addition to the sub-issues script, two files were created:

1. **`specs/024-title-week-5/tasks.md`** - Detailed task specification with:
   - All 12 tasks with descriptions and acceptance criteria
   - Execution order and dependencies
   - File structure and implementation notes
   - Deployment checklist

2. **`create-linear-sub-issues-024.mjs`** - Node.js script that:
   - Fetches your Linear team ID from the parent issue
   - Creates 12 sub-issues with full descriptions
   - Maps each task to specifications in tasks.md
   - Reports creation status

---

## Troubleshooting

### Error: "LINEAR_API_KEY environment variable not set"

**Solution**: Make sure you've exported the API key:
```bash
export LINEAR_API_KEY="your-api-key"
```

### Error: "Failed to fetch parent issue"

**Possible causes**:
- Parent issue PRI-2532 doesn't exist
- API key is invalid or expired
- Wrong Linear workspace

**Solution**: Verify PRI-2532 exists in your Linear workspace and your API key is valid.

### Error: "Failed to create sub-issue"

**Possible causes**:
- Team doesn't have permission to create issues
- Issue limit reached
- API rate limit exceeded

**Solution**: 
1. Check your Linear workspace permissions
2. Wait a few minutes and try again
3. Check the full error message for details

---

## After Creation

Once the sub-issues are created:

1. ✅ View the issues in Linear: https://linear.app/issues/PRI-2532
2. ✅ Review the task descriptions in specs/024-title-week-5/tasks.md
3. ✅ Start with T001 (contract test setup)
4. ✅ Follow dependency order: T001-T008 → T009-T010 → T011 → T012

---

## Reference

- **Specification**: `/Users/prnceb/Desktop/WORK/hello-world/specs/024-title-week-5/spec.md`
- **Plan Document**: `/Users/prnceb/Desktop/WORK/hello-world/specs/024-title-week-5/plan.md`
- **Tasks**: `/Users/prnceb/Desktop/WORK/hello-world/specs/024-title-week-5/tasks.md`
- **Script**: `/Users/prnceb/Desktop/WORK/hello-world/create-linear-sub-issues-024.mjs`

---

**Created**: 2025-11-05  
**Feature Branch**: 024-title-week-5  
**Parent Issue**: PRI-2532

