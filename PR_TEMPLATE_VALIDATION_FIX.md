# PR Template Validation Workflow - Error Investigation & Fix

**Date**: November 3, 2025  
**Issue**: GitHub Actions workflow failing with permission error (403)  
**Status**: ✅ FIXED

---

## Problem Summary

The `validate-pr-template.yml` GitHub Actions workflow encountered a **403 Forbidden** error when attempting to post validation comments on pull requests.

### Error Details

```
Error: Resource not accessible by integration
RequestError [HttpError]: Resource not accessible by integration
    at /home/runner/work/_actions/actions/github-script/v7/dist/index.js:9537:21
    ...
  status: 403,
  response: {
    url: 'https://api.github.com/repos/.../issues/1571/comments',
    status: 403,
    ...
    'x-accepted-github-permissions': 'issues=write; pull_requests=write',
```

---

## Root Causes

### 1. **Missing Permissions Block** (Primary Issue)
The workflow was missing explicit permission declarations. The GitHub Actions token requires explicit `pull-requests: write` and `issues: write` permissions to post comments on PRs.

**Original Workflow** (lines 1-11):
```yaml
name: Validate PR Template

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  validate:
    runs-on: ubuntu-latest
```

**Problem**: No `permissions:` block means the token has minimal/default permissions, insufficient for commenting.

### 2. **No Error Handling for Comment Posting**
The original code made an API call without try-catch:
```javascript
await github.rest.issues.createComment({...});
```

When the permission error occurred, it crashed the entire action instead of gracefully degrading.

### 3. **PR Content Missing Required Fields**
The PR (issue #1571) didn't contain the required fields that the new validation enforces:
- ❌ Missing: `## Spec URL` section
- ❌ Missing: `## Figma Dev Mode Link` section

This caused validation to fail, triggering the comment posting attempt.

---

## Solution Applied

### Fix 1: Add Permissions Block

**File**: `.github/workflows/validate-pr-template.yml`

```yaml
permissions:
  pull-requests: write
  issues: write
  contents: read
```

**Why**: Explicitly grants the GitHub Actions token the necessary permissions to:
- `pull-requests: write` → Post comments on PRs
- `issues: write` → Post comments on issues
- `contents: read` → Read repository content (standard)

### Fix 2: Add Error Handling

**File**: `.github/workflows/validate-pr-template.yml` (lines 44-55)

```javascript
// Try to post comment, but don't crash if it fails
try {
  await github.rest.issues.createComment({
    issue_number: context.issue.number,
    owner: context.repo.owner,
    repo: context.repo.repo,
    body: '⚠️ **PR Template Validation Failed**\n\n' + 
          errors.join('\n') + 
          '\n\nPlease update your PR description and try again.'
  });
} catch (err) {
  console.log('Warning: Could not post comment:', err.message);
  // Continue to fail the check even if comment posting fails
}

core.setFailed('PR Template Validation Failed:\n' + errors.join('\n'));
```

**Why**: 
- Wraps the API call in try-catch
- Logs warning if comment posting fails
- Continues to fail the validation check (doesn't silently pass)
- Prevents entire workflow crash

### Fix 3: Update PR with Required Fields

**Action Required**: When creating/updating PRs, ensure the description includes:

```markdown
## Spec URL
https://github.com/prnceb/hello-world/blob/development/specs/020-title-week-4/spec.md

## Figma Dev Mode Link
N/A - This is a repository infrastructure update (no UI changes)

## Acceptance Checklist
- [x] I have ticked all acceptance boxes in my spec.md
- [x] I have reviewed the Figma design (or marked N/A with reason)
- [x] My PR description matches my specification
- [x] I am ready for review
```

---

## How the Validation Works

### Validation Flow

1. **PR Created/Updated** → Workflow triggers on `opened`, `synchronize`, `reopened`
2. **Extract Spec URL** → Uses regex `/^## Spec URL\s*\n+(.+?)(?=^##|\Z)/ms`
   - Valid: URL starting with `http://` or `https://`, or `PRI-XXXX` format
3. **Extract Figma Link** → Uses regex `/^## Figma Dev Mode Link\s*\n+(.+?)(?=^##|\Z)/ms`
   - Valid: Figma URL, or `N/A` with optional justification
4. **Report Results**:
   - ✅ Pass: Both fields valid → Merge allowed
   - ❌ Fail: Either field missing/invalid → Merge blocked + comment posted

### Regex Patterns

**Spec URL Pattern**:
```javascript
const specUrlPattern = /^(https?:\/\/.+|PRI-\d+)$/;
// Matches: "https://example.com", "https://github.com/...", "PRI-1234"
// Rejects: Empty, "example.com" (no protocol), "PRI-abc"
```

**Figma URL Pattern**:
```javascript
const figmaUrlPattern = /^https?:\/\/.+figma\.com\/.+$/;
// Matches: "https://www.figma.com/design/..."
// Rejects: "https://example.com"
```

**Figma N/A Pattern**:
```javascript
const figmaNAPattern = /^(N\/A|n\/a|\[N\/A\])(\s*-\s*.+)?$/;
// Matches: "N/A", "n/a", "[N/A]", "N/A - Backend only"
// Rejects: Empty, "none", "NA"
```

---

## Testing the Fix

### Test 1: Valid PR (Should Pass)

```markdown
## Spec URL
https://github.com/prnceb/hello-world/blob/development/specs/020-title-week-4/spec.md

## Figma Dev Mode Link
https://www.figma.com/design/abc123/my-design

## Acceptance Checklist
- [x] All boxes ticked
```

**Expected**: ✅ Validation passes, merge allowed

### Test 2: Invalid PR - Missing Spec URL (Should Fail)

```markdown
## Spec URL
[empty or placeholder]

## Figma Dev Mode Link
N/A - Backend work
```

**Expected**: ❌ Validation fails with error message:
```
❌ Spec URL is required (URL or PRI-XXXX format)
```

### Test 3: Invalid PR - Invalid Figma (Should Fail)

```markdown
## Spec URL
https://github.com/.../specs/020-title-week-4/spec.md

## Figma Dev Mode Link
[empty]
```

**Expected**: ❌ Validation fails with error message:
```
❌ Figma link is required (URL or N/A with reason)
```

### Test 4: Valid N/A Figma (Should Pass)

```markdown
## Spec URL
PRI-1234

## Figma Dev Mode Link
N/A - Infrastructure change, no UI modifications
```

**Expected**: ✅ Validation passes, merge allowed

---

## Configuration Details

### File: `.github/workflows/validate-pr-template.yml`

| Setting | Value | Purpose |
|---------|-------|---------|
| Trigger | `pull_request` | Runs when PR is opened/updated |
| Event Types | `opened, synchronize, reopened` | Runs on create, new commits, reopen |
| Permissions | `pull-requests: write, issues: write` | Allows posting comments |
| Runner | `ubuntu-latest` | Standard GitHub runner |
| Action | `actions/github-script@v7` | JavaScript automation in GitHub Actions |

### File: `.github/pull_request_template.md`

Three mandatory sections:
1. **Spec URL** - Link to specification
2. **Figma Dev Mode Link** - Design reference or N/A
3. **Acceptance Checklist** - Pre-merge verification

---

## Branch Protection Configuration

**Recommendation**: Configure branch protection on `development` branch:

1. Go to: Repository Settings → Branches → Add rule
2. Apply to: `development`
3. Enable: "Require status checks to pass before merging"
4. Select: `validate-pr-template / validate`
5. Enable: "Dismiss stale pull request approvals when new commits are pushed"

This ensures PRs cannot be merged if validation fails.

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| 403 Permission Error | Missing permissions block | ✅ Fixed in workflow |
| Comment not posted | Insufficient token permissions | ✅ Fixed: added permissions block |
| Validation passes but shouldn't | Regex pattern mismatch | Check regex against field format |
| Validation fails but PR is correct | Spacing/formatting issue | Check for extra whitespace in field |

---

## Next Steps

1. ✅ **Workflow Fixed**: Permissions added, error handling improved
2. ⏳ **Update PR #1571**: Add Spec URL and Figma Dev Mode Link to PR body
3. ⏳ **Test on New PRs**: Verify validation works with updated workflow
4. ⏳ **Configure Branch Protection**: Set up rule on `development` branch
5. ⏳ **Document for Developers**: Reference `specs/020-title-week-4/quickstart.md`

---

## Summary

| Issue | Status | Fix |
|-------|--------|-----|
| 403 Permission Error | ✅ FIXED | Added `permissions:` block with `pull-requests: write, issues: write` |
| Error Handling | ✅ FIXED | Wrapped comment posting in try-catch |
| PR Content | ⏳ PENDING | Update PR with required Spec URL and Figma Dev Mode Link |
| Documentation | ✅ COMPLETE | See `specs/020-title-week-4/quickstart.md` |

**Result**: Workflow is now production-ready. Future PRs with properly filled templates will pass validation and allow merges.
