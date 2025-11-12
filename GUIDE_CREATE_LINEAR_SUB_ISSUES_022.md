# Guide: Create Linear Sub-Issues for 022-title-week-5

This guide provides the exact commands to run in your local terminal to create Linear sub-issues under parent issue **PRI-2472** for the Week 5 API Endpoints feature.

---

## Prerequisites

✅ You have a Linear API key  
✅ You have permission to create issues in Linear  
✅ Parent issue **PRI-2472** exists in Linear  
✅ You're in the repository root directory

---

## Step 1: Set Your Linear API Key

Run this command in your terminal to set the `LINEAR_API_KEY` environment variable:

```bash
export LINEAR_API_KEY="your-linear-api-key-here"
```

**Replace `your-linear-api-key-here`** with your actual Linear API key.

To get your API key:
1. Go to: https://linear.app/settings/api
2. Click "Create API Key"
3. Copy the key (it will look like: `lin_sk_...`)

Example:
```bash
export LINEAR_API_KEY="lin_sk_abc123def456ghi789jkl012"
```

---

## Step 2: Verify Your API Key

To verify your API key is set correctly, run:

```bash
echo $LINEAR_API_KEY
```

Expected output: Your API key should display (it's safe to echo for verification)

---

## Step 3: Make the Script Executable

Make the script executable (one time only):

```bash
chmod +x /Users/prnceb/Desktop/WORK/hello-world/create-linear-sub-issues-022.mjs
```

---

## Step 4: Run the Script to Create Sub-Issues

Run the script from the repository root:

```bash
node /Users/prnceb/Desktop/WORK/hello-world/create-linear-sub-issues-022.mjs
```

Or if you prefer to use the absolute path from anywhere:

```bash
cd /Users/prnceb/Desktop/WORK/hello-world && node create-linear-sub-issues-022.mjs
```

### Expected Output

The script will:
1. Validate your Linear API key
2. Look up the parent issue (PRI-2472)
3. Create 27 sub-issues, one for each task

Example output:
```
🚀 Creating Linear Sub-Issues for 022-title-week-5
   Parent Issue: PRI-2472
   Total Tasks: 27

📋 Looking up parent issue PRI-2472...
✅ Found team: d7c30c59-a6e3-4e3a-8f9e-8c8f8c8c8c8c

📝 Creating sub-issues...

✅ T001: Created PRI-2473 - Create contract test for GET /healthz [P]
✅ T002: Created PRI-2474 - Create contract test for POST /convert - success [P]
✅ T003: Created PRI-2475 - Create contract test for POST /convert - validation errors [P]
...
✅ T027: Created PRI-2500 - Verify review artifacts

✨ Summary:
   Created: 27/27

🎉 All sub-issues created successfully!
   View them at: https://linear.app/issue/PRI-2472
```

---

## All-in-One Command

Here's a one-liner you can copy and paste (replace with your actual API key):

```bash
export LINEAR_API_KEY="your-api-key-here" && cd /Users/prnceb/Desktop/WORK/hello-world && node create-linear-sub-issues-022.mjs
```

Or to make it even simpler, save this as a shell script:

```bash
#!/bin/bash
export LINEAR_API_KEY="lin_sk_abc123def456ghi789jkl012"
cd /Users/prnceb/Desktop/WORK/hello-world
node create-linear-sub-issues-022.mjs
```

Save it as `run-create-issues.sh`, then:
```bash
chmod +x run-create-issues.sh
./run-create-issues.sh
```

---

## Troubleshooting

### Error: "LINEAR_API_KEY environment variable not set"

**Solution**: Set your API key in the current terminal session:
```bash
export LINEAR_API_KEY="your-api-key"
node create-linear-sub-issues-022.mjs
```

### Error: "Could not find parent issue: PRI-2472"

**Possible causes**:
- Parent issue PRI-2472 doesn't exist in Linear
- Your API key doesn't have permission to access that issue
- You're in the wrong Linear workspace

**Solution**: 
1. Verify PRI-2472 exists in Linear
2. Verify your API key is correct
3. Try creating a test issue manually in Linear to verify your permissions

### Error: "GraphQL Error"

**Possible causes**:
- Linear API rate limiting (wait a few seconds and retry)
- Invalid team ID
- Malformed GraphQL request

**Solution**:
1. Wait a few seconds and retry
2. Check that your API key is valid
3. Verify the parent issue still exists

### Script runs but creates 0 sub-issues

This usually means the API returned an error. Check the error messages in the output carefully. Common issues:
- Team ID mismatch
- Missing team configuration
- Permission issues

---

## What Gets Created

The script creates **27 sub-issues** under PRI-2472:

- **T001-T003**: Contract tests (Specification-first, TDD)
- **T004-T006**: Type definitions and schemas
- **T007-T009**: OpenAPI specification updates
- **T010-T013**: Route implementation (healthz, convert, registration)
- **T014-T018**: Integration and unit tests
- **T019-T027**: Verification and validation

All sub-issues include:
- Descriptive title (with [P] tag for parallel tasks)
- Full description from tasks.md
- Parent-child relationship to PRI-2472
- Ready to be assigned and worked on

---

## Next Steps After Creating Sub-Issues

1. **View the issues**: https://linear.app/issue/PRI-2472
2. **Assign tasks**: Assign sub-issues to team members
3. **Start implementation**: Follow `specs/022-title-week-5/tasks.md` for execution order
4. **Update status**: Mark issues as "In Progress" → "Done" as you complete them

---

## Reference

- **Tasks file**: `specs/022-title-week-5/tasks.md`
- **Specification**: `specs/022-title-week-5/spec.md`
- **Data model**: `specs/022-title-week-5/data-model.md`
- **Quickstart**: `specs/022-title-week-5/quickstart.md`

---

## Questions?

If you run into issues:
1. Check the error message carefully - they often tell you exactly what's wrong
2. Verify your Linear API key is correct and has appropriate permissions
3. Make sure PRI-2472 exists and is the correct parent issue
4. Check the script output for specific errors

---

**Status**: ✅ Ready to run - follow the steps above!

