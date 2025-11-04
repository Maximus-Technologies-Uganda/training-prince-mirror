# GitHub Actions Permissions Best Practices

**Related Issue**: PR Template Validation Workflow (403 Permission Error)  
**Fix Date**: November 3, 2025

---

## Quick Reference: Fixing 403 Errors in GitHub Actions

### Symptom
```
Error: Resource not accessible by integration
Status: 403 Forbidden
Message: "Resource not accessible by integration"
```

### Root Cause
Missing `permissions:` block in GitHub Actions workflow YAML.

### Solution
```yaml
name: My Workflow

on: [pull_request, push]

# ✅ ADD THIS BLOCK
permissions:
  pull-requests: write
  issues: write
  contents: read
  # Add other needed permissions...

jobs:
  my-job:
    runs-on: ubuntu-latest
    # ... rest of workflow
```

---

## Common GitHub Actions Permissions

| Permission | Use Case | Example API Call |
|-----------|----------|------------------|
| `pull-requests: write` | Post/edit PR comments | `github.rest.pulls.createReview()` |
| `issues: write` | Post/edit issue comments | `github.rest.issues.createComment()` |
| `contents: write` | Push commits, update files | `github.rest.repos.createOrUpdateFileContents()` |
| `contents: read` | Read file contents | `github.rest.repos.getContent()` |
| `workflows: write` | Trigger workflows | `github.rest.actions.createWorkflowDispatch()` |
| `statuses: write` | Set commit status | `github.rest.repos.createCommitStatus()` |
| `checks: write` | Create check runs | `github.rest.checks.create()` |

---

## Permission Declaration Levels

### Workflow-Level Permissions (Recommended)

```yaml
permissions:
  pull-requests: write
  issues: write
  contents: read
```

**Pros**:
- Explicit and clear
- Applies to all jobs
- Follows principle of least privilege

### Job-Level Permissions

```yaml
jobs:
  validate:
    permissions:
      pull-requests: write
      issues: write
      contents: read
    runs-on: ubuntu-latest
```

**Pros**:
- Fine-grained control per job
- More secure (limit permissions per job)

### Using Default Permissions

```yaml
permissions: read-all  # All read-only
permissions: write-all # All read-write (avoid!)
```

---

## Debugging Permission Errors

### Step 1: Check Response Headers

Look for this header in 403 responses:
```
'x-accepted-github-permissions': 'issues=write; pull_requests=write'
```

This tells you exactly which permissions the API call needs.

### Step 2: Update Workflow

Add missing permissions to the `permissions:` block:

```yaml
permissions:
  issues: write        # ← API needs this
  pull-requests: write # ← API needs this
  contents: read       # ← Already have this
```

### Step 3: Test & Verify

Create a test PR or commit to trigger the workflow and verify it now works.

---

## PR Validation Workflow: Before & After

### ❌ BEFORE (Broken - 403 Error)

```yaml
name: Validate PR Template

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/github-script@v7
        with:
          script: |
            // ... validation code ...
            
            // ❌ CRASHES with 403!
            await github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: 'Validation failed!'
            });
```

**Issues**:
- ❌ No `permissions:` block
- ❌ No error handling for API call
- ❌ 403 error crashes entire workflow

### ✅ AFTER (Fixed)

```yaml
name: Validate PR Template

on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  pull-requests: write
  issues: write
  contents: read

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/github-script@v7
        with:
          script: |
            // ... validation code ...
            
            // ✅ Gracefully handles errors
            try {
              await github.rest.issues.createComment({
                issue_number: context.issue.number,
                owner: context.repo.owner,
                repo: context.repo.repo,
                body: 'Validation failed!'
              });
            } catch (err) {
              console.log('Warning: Could not post comment:', err.message);
              // Continue to fail the check even if comment fails
            }
            
            core.setFailed('Validation failed!');
```

**Improvements**:
- ✅ Added `permissions:` block
- ✅ Added try-catch around API call
- ✅ Logs warning if comment fails but continues checking
- ✅ No 403 error!

---

## Complete Example: Secure GitHub Script Action

```yaml
name: Secure API Calls

on: [pull_request]

permissions:
  pull-requests: write
  issues: write
  contents: read

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/github-script@v7
        with:
          script: |
            // Step 1: Validate data
            const title = context.payload.pull_request.title;
            const errors = [];
            
            if (!title.includes('[FEAT]') && !title.includes('[FIX]')) {
              errors.push('Title must include [FEAT] or [FIX]');
            }
            
            // Step 2: Post result (with error handling)
            if (errors.length > 0) {
              try {
                await github.rest.issues.createComment({
                  issue_number: context.issue.number,
                  owner: context.repo.owner,
                  repo: context.repo.repo,
                  body: '❌ Validation Failed\n\n' + errors.join('\n')
                });
              } catch (err) {
                console.warn('Could not post comment:', err.message);
                // Workflow continues to fail below
              }
              
              // Step 3: Fail the check
              core.setFailed(errors.join('\n'));
            } else {
              core.info('✅ Validation Passed');
            }
```

---

## Minimal Permissions (Principle of Least Privilege)

Don't grant more permissions than needed:

```yaml
# ❌ AVOID - Too permissive
permissions: write-all

# ✅ DO - Only what you need
permissions:
  pull-requests: write
  issues: write
  contents: read
```

---

## Testing Your Fix

### Local Test (Without Actually Running)

```bash
# Validate YAML syntax
yamllint .github/workflows/validate-pr-template.yml

# Check for permission issues
grep -A 3 "permissions:" .github/workflows/validate-pr-template.yml
```

### Real Test (On GitHub)

1. **Create a test PR** on your branch
2. **Check workflow runs**: Go to Actions tab
3. **View logs**: Click on failed run
4. **Look for**: 
   - ✅ `✅ PR Template Validation Passed` (success)
   - ✅ `⚠️ **PR Template Validation Failed**` (comment posted)
   - ❌ `Resource not accessible by integration` (still broken)

---

## Reference

- **GitHub Docs**: [Workflow permissions](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#permissions)
- **API Reference**: [GitHub REST API](https://docs.github.com/en/rest)
- **Security**: [About OIDC token hardening](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)

---

## Key Takeaways

1. **Always include `permissions:` block** in workflows that call GitHub APIs
2. **Use principle of least privilege** - only grant needed permissions
3. **Add error handling** around API calls - don't let crashes silence validation
4. **Check response headers** for `x-accepted-github-permissions` when debugging 403s
5. **Test in a real PR** to verify the fix works end-to-end
