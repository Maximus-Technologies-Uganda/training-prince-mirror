# Command to Create Linear Sub-Issues for 023-title-week-5

## One-Line Command

```bash
export LINEAR_API_KEY="your-linear-api-key-here" && cd /Users/prnceb/Desktop/WORK/hello-world && node create-linear-sub-issues-023.mjs
```

## Or Run Step-by-Step

### Step 1: Get Your Linear API Key
1. Go to https://linear.app/settings/api
2. Create a new API key or copy existing one
3. Copy the key to clipboard

### Step 2: Set Environment Variable
```bash
export LINEAR_API_KEY="paste-your-key-here"
```

### Step 3: Run the Script
```bash
cd /Users/prnceb/Desktop/WORK/hello-world
node create-linear-sub-issues-023.mjs
```

---

## Expected Output

```
🚀 Creating 30 sub-issues for PRI-2501...

📝 Creating T001: Create contract test for POST /expenses [P]...
  ✅ Created: PRI-2501-1 - Create contract test for POST /expenses [P]

📝 Creating T002: Create contract test POST /expenses response schema [P]...
  ✅ Created: PRI-2501-2 - Create contract test POST /expenses response schema [P]

[... more issues ...]

============================================================
📊 Summary:
  ✅ Created: 30/30
  ❌ Failed: 0/30
============================================================

Created issues:
  - PRI-2501-1: Create contract test for POST /expenses [P]
  - PRI-2501-2: Create contract test POST /expenses response schema [P]
  - PRI-2501-3: Create contract test POST /expenses validation errors [P]
  - ... (27 more)
```

---

## What This Does

✅ Creates 30 sub-issues under parent issue **PRI-2501**  
✅ Each sub-issue maps to a task in `specs/023-title-week-5/tasks.md`  
✅ All marked as "In Progress" status  
✅ Full descriptions included for each task  
✅ Issues linked to parent automatically  

---

## Verify in Linear

After running:
1. Go to https://linear.app/
2. Search for **PRI-2501**
3. Open the issue
4. Scroll to "Sub-Issues" section
5. Should see all 30 issues listed with "In Progress" status

---

## If Something Goes Wrong

See troubleshooting guide: `GUIDE_CREATE_LINEAR_SUB_ISSUES_023.md`

---

## Files Involved

| File | Purpose |
|------|---------|
| `create-linear-sub-issues-023.mjs` | Main script (Node.js) |
| `specs/023-title-week-5/tasks.md` | Task definitions |
| `GUIDE_CREATE_LINEAR_SUB_ISSUES_023.md` | Full troubleshooting guide |

---

*Ready to execute: November 5, 2025*

