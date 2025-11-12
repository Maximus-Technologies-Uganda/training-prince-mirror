# Update Linear Sub-Issues Status for 024-title-week-5

**Purpose**: Change all 12 sub-issues under PRI-2532 from "Triage" to "In Progress"

---

## ⚡ Quick Command (Copy & Paste)

```bash
export LINEAR_API_KEY="your-api-key" && \
cd /Users/prnceb/Desktop/WORK/hello-world && \
node update-linear-status-024.mjs
```

**Where to get API key**: https://linear.app/settings/api

---

## 📋 Step-by-Step

### Step 1: Get Your Linear API Key

1. Go to: https://linear.app/settings/api
2. Click "Create new" (or use existing key)
3. Copy the entire API key (starts with `lin_pat_`)

### Step 2: Run the Update Command

Replace `your-api-key` with your actual key:

```bash
export LINEAR_API_KEY="lin_pat_xxxxxxxxxxxxxxxxxxxxx" && \
cd /Users/prnceb/Desktop/WORK/hello-world && \
node update-linear-status-024.mjs
```

### Step 3: Verify Success

You'll see output like:

```
🚀 Updating Linear sub-issues status for 024-title-week-5
📍 Parent issue: PRI-2532

🔍 Fetching parent issue...
✅ Parent ID: [uuid]

🔍 Fetching team ID...
✅ Team ID: [uuid]

🔍 Fetching "In Progress" state ID...
✅ In Progress State ID: [uuid]

🔍 Fetching child issues...
✅ Found 12 sub-issues

📝 Updating states...

✅ PRI-2533: Triage → In Progress
✅ PRI-2534: Triage → In Progress
✅ PRI-2535: Triage → In Progress
... (9 more) ...

═════════════════════════════════════════════════════
📊 Summary:
   ✅ Updated: 12
   ⏭️  Already In Progress: 0
   ❌ Failed: 0
═════════════════════════════════════════════════════

✨ All sub-issues under PRI-2532 status updated
🔗 View in Linear: https://linear.app/issues/PRI-2532
```

---

## 🎯 What This Script Does

1. **Fetches parent issue** PRI-2532 and gets its UUID
2. **Gets team ID** from the parent issue
3. **Fetches "In Progress" state** from the team's workflow
4. **Retrieves all 12 child issues** under PRI-2532
5. **Updates each issue's state** from current status to "In Progress"
6. **Reports** success/failure for each sub-issue

---

## ✅ Expected Results

All 12 sub-issues will move from "Triage" (or backlog) to "In Progress":

```
PRI-2533 → In Progress
PRI-2534 → In Progress
PRI-2535 → In Progress
PRI-2536 → In Progress
PRI-2537 → In Progress
PRI-2538 → In Progress
PRI-2539 → In Progress
PRI-2540 → In Progress
PRI-2541 → In Progress
PRI-2542 → In Progress
PRI-2543 → In Progress
PRI-2544 → In Progress
```

Check in Linear: https://linear.app/issues/PRI-2532

---

## ⚠️ Troubleshooting

**"Authentication required, not authenticated"**
- API key is invalid or expired
- Get a new key from: https://linear.app/settings/api

**"Failed to fetch parent issue"**
- PRI-2532 doesn't exist
- Check the issue exists in your Linear workspace

**"Could not find 'In Progress' state"**
- Your team's workflow doesn't have "In Progress" state
- Contact your Linear workspace admin

**"Found 0 sub-issues"**
- The sub-issues weren't created yet
- Run create-linear-sub-issues-024.mjs first

---

## 📝 Files Generated

- **create-linear-sub-issues-024.mjs** - Creates the 12 sub-issues
- **update-linear-status-024.mjs** - Updates their status (this script)

---

## 🔗 Related Commands

**Create sub-issues first** (if not done yet):
```bash
export LINEAR_API_KEY="your-key" && \
cd /Users/prnceb/Desktop/WORK/hello-world && \
node create-linear-sub-issues-024.mjs
```

**Update status** (this command):
```bash
export LINEAR_API_KEY="your-key" && \
cd /Users/prnceb/Desktop/WORK/hello-world && \
node update-linear-status-024.mjs
```

---

**Created**: 2025-11-05  
**Feature**: 024-title-week-5 - Rate Limiter for POST Routes  
**Parent Issue**: PRI-2532

