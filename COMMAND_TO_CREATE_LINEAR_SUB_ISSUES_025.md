# Command to Create Linear Sub-Issues for 025-week-5-day

## Parent Issue
- **ID**: PRI-2545
- **Title**: Week 5 Day-0: Final Hygiene & Migration to GitHub Projects

## What This Does
Creates 25 sub-issues (T001-T025) under the parent issue, organized into 4 phases:
- **Phase A** (T001-T003): Preparation & Branch Cleanup
- **Phase B** (T004-T010): Configuration (mostly parallel)
- **Phase C** (T011-T020): Verification & Validation
- **Phase D** (T021-T025): Finalization & Release

## Prerequisites
1. Get your Linear API key from: https://linear.app/settings/api
2. You should have access to create issues in the ENG team

## Command to Run

```bash
export LINEAR_API_KEY="<your-api-key-here>"
node /Users/prnceb/Desktop/WORK/hello-world/create-linear-sub-issues-025.mjs
```

Replace `<your-api-key-here>` with your actual Linear API key (without any quotes or Bearer prefix).

## Example
```bash
export LINEAR_API_KEY="lin_api_1234567890abcdefghijklmnop"
node /Users/prnceb/Desktop/WORK/hello-world/create-linear-sub-issues-025.mjs
```

## Expected Output
```
🚀 Creating 25 Linear sub-issues

Parent Issue: PRI-2545
Title: Week 5 Day-0: Final Hygiene & Migration to GitHub Projects
Spec: 025-week-5-day
Tasks: T001-T025 (4 phases)

📋 Phase A: Preparation & Branch Cleanup (T001-T003)
  ✅ PRI-2546: T001 - Update main branch README with Week 5 paths
  ✅ PRI-2547: T002 - Identify and remove stray files from main branch
  ✅ PRI-2548: T003 - Document exact CI status check names from existing workflows

⚙️  Phase B: Configuration (T004-T010)
  ✅ PRI-2549: T004 - Configure branch protection rule for main branch
  ✅ PRI-2550: T005 - [P] Create GitHub Project with custom fields
  ... (and so on)

📊 Summary: Successfully created 25/25 sub-issues

✨ All 25 sub-issues created under PRI-2545
```

## Files Generated

- `create-linear-sub-issues-025.mjs` - The script that creates the issues
- `create-sub-issues-025-output.md` - Summary of created issues (generated after running)

## Script Details

The script will:
1. Connect to Linear GraphQL API
2. Create 25 issues under parent PRI-2545
3. Organize them by phase (A, B, C, D)
4. Add proper descriptions for each task
5. Display progress with ✅/❌ indicators

## Troubleshooting

### "LINEAR_API_KEY environment variable not set"
- Make sure to run the `export` command first
- Verify the API key is correct (from https://linear.app/settings/api)

### "Bearer prefix" error (now fixed!)
- The script has been updated to use the raw API key
- No need to add "Bearer " prefix

### Rate limiting
- The script has built-in delays (300ms between requests)
- If you hit rate limits, wait 60 seconds and try again

## Manual Alternative

If you prefer to create issues manually in Linear:
1. Go to PRI-2545 (parent issue)
2. Create 25 sub-issues with the titles and descriptions from `specs/025-week-5-day/tasks.md`
3. Tag them with phase: A, B, C, or D

---

**Ready to create all 25 sub-issues!** Just copy and run the command above with your actual API key. 🚀


