# Guide: Create Linear Sub-Issues for 023-title-week-5

## Overview

This guide explains how to create 30 Linear sub-issues under the parent issue **PRI-2501** for the Week 5: Implement MVP API Endpoints (Expenses) specification.

All sub-issues will be automatically marked as **"In Progress"** upon creation.

---

## Prerequisites

1. **Linear API Key**: Get from https://linear.app/settings/api
2. **Node.js**: Version 14+ installed
3. **Script Location**: `/Users/prnceb/Desktop/WORK/hello-world/create-linear-sub-issues-023.mjs`

---

## Quick Start

### Step 1: Set Environment Variable

```bash
export LINEAR_API_KEY="your-api-key-here"
```

Replace `your-api-key-here` with your actual Linear API key.

### Step 2: Run the Script

```bash
cd /Users/prnceb/Desktop/WORK/hello-world

node create-linear-sub-issues-023.mjs
```

### Step 3: Verify Creation

The script will output progress like:

```
🚀 Creating 30 sub-issues for PRI-2501...

📝 Creating T001: Create contract test for POST /expenses [P]...
  ✅ Created: PRI-2501-1 - Create contract test for POST /expenses [P]

📝 Creating T002: Create contract test POST /expenses response schema [P]...
  ✅ Created: PRI-2501-2 - Create contract test POST /expenses response schema [P]

... (more sub-issues)

============================================================
📊 Summary:
  ✅ Created: 30/30
  ❌ Failed: 0/30
============================================================
```

---

## What Gets Created

### Task Mapping

Each task in `specs/023-title-week-5/tasks.md` becomes a Linear sub-issue:

| Task ID | Sub-Issue | Title |
|---------|-----------|-------|
| T001-T005 | PRI-2501-1 to PRI-2501-5 | Contract Tests (TDD Foundation) |
| T006-T008 | PRI-2501-6 to PRI-2501-8 | Types & Validation Schemas |
| T009-T011 | PRI-2501-9 to PRI-2501-11 | OpenAPI Specification |
| T012-T014 | PRI-2501-12 to PRI-2501-14 | Service Layer (ExpenseStore) |
| T015-T017 | PRI-2501-15 to PRI-2501-17 | Route Implementation |
| T018-T023 | PRI-2501-18 to PRI-2501-23 | Integration Tests |
| T024-T026 | PRI-2501-24 to PRI-2501-26 | Unit Tests |
| T027 | PRI-2501-27 | Coverage Verification |
| T028-T030 | PRI-2501-28 to PRI-2501-30 | Documentation & Testing |

### Issue Properties

- **Parent**: PRI-2501
- **Status**: In Progress
- **Description**: Full task details from tasks.md
- **Labels**: Implicit from task type (contract tests, unit tests, etc.)

---

## Troubleshooting

### Error: LINEAR_API_KEY environment variable not set

**Solution**: Set your API key first:
```bash
export LINEAR_API_KEY="your-api-key"
node create-linear-sub-issues-023.mjs
```

### Error: "Failed to parse response"

**Possible Causes**:
1. Invalid API key - verify at https://linear.app/settings/api
2. Network issue - check internet connection
3. Linear API is down - try again later

**Solution**: 
```bash
# Test API key validity
curl -H "Authorization: your-api-key" \
  -X POST https://api.linear.app/graphql \
  -d '{"query":"{ me { id name } }"}'
```

### Error: "Issue creation failed"

**Possible Causes**:
1. Parent issue PRI-2501 doesn't exist
2. You don't have permission to create sub-issues
3. State ID "In Progress" is incorrect for your workspace

**Solution**:
1. Verify PRI-2501 exists in Linear
2. Check permissions: https://linear.app/settings/workspace-members
3. Check your workspace state IDs at: https://api.linear.app (GraphQL explorer)

### Script Created Some But Not All Issues

**Cause**: Likely a network timeout mid-run

**Solution**: 
1. Check which issues were created in Linear
2. Manually create remaining ones OR
3. Run the script again (it creates duplicates, so delete duplicates in Linear first)

---

## Manual Verification

After running the script, verify in Linear:

1. Go to https://linear.app/
2. Open parent issue **PRI-2501**
3. Scroll to "Sub-Issues" section
4. Should see all 30 sub-issues listed
5. Verify each has status "In Progress"

---

## Advanced: Modify Issue State

If you need to change all sub-issues to a different state (e.g., "Backlog"):

1. Find the state ID in Linear: https://api.linear.app (GraphQL explorer)
2. Run this query to get state IDs:
   ```graphql
   query {
     workflows {
       states {
         id
         name
       }
     }
   }
   ```
3. Update the state IDs in the script under `updateIssueStateQuery`

---

## Advanced: Bulk Update

To mark all created sub-issues as a different status:

```bash
# First, get all sub-issue IDs from the Linear UI
# Then use the linear-script bulk update feature (if available)

# Or manually via curl:
for id in $(seq 1 30); do
  curl -H "Authorization: $LINEAR_API_KEY" \
    -X POST https://api.linear.app/graphql \
    -d "{\"query\":\"mutation { issueUpdate(id: \\\"PRI-2501-$id\\\", input: { state: \\\"new-state-id\\\" }) { success } }\"}"
done
```

---

## Success Criteria

✅ All 30 sub-issues created under PRI-2501  
✅ Each sub-issue has full description from tasks.md  
✅ All marked as "In Progress" status  
✅ Issues correctly linked to parent PRI-2501  
✅ No duplicate issues created

---

## Next Steps

After creating sub-issues:

1. **Share with team**: Post link to PRI-2501 in Slack/Discord
2. **Start implementation**: Begin with Phase 4.1 (Contract tests)
3. **Track progress**: Update issue status in Linear as tasks complete
4. **Link commits**: Reference issue ID in commit messages (e.g., "PRI-2501-1: Create contract tests")

---

## Script Source Code

The script uses Linear's GraphQL API:

- **Endpoint**: `https://api.linear.app/graphql`
- **Mutations**: `issueCreate`, `issueUpdate`
- **Auth**: Linear API key in `Authorization` header

See `create-linear-sub-issues-023.mjs` for full implementation.

---

## Support

For questions or issues:
1. Check this guide's troubleshooting section
2. Review Linear API docs: https://developers.linear.app/
3. Contact Linear support: https://linear.app/support

---

*Generated for spec 023-title-week-5 | Last Updated: November 5, 2025*

