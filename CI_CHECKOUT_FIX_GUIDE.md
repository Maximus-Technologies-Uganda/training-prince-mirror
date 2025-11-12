# GitHub Actions Checkout Failure - Diagnostic & Fix Guide

## Error Summary
GitHub Actions is failing with: `Repository not found` during the checkout step for the Dependency Review job and other security jobs.

## Root Cause Analysis

The error `fatal: repository 'https://github.com/Maximus-Technologies-Uganda/training-prince/' not found` typically indicates one of:

1. **Repository is Private**: The repository may be private, and the default `GITHUB_TOKEN` doesn't have sufficient permissions
2. **Token Permissions**: The token may not have the `contents: read` permission
3. **Branch Protection Rules**: May require specific token scopes
4. **Organization Settings**: May require additional authentication

## Verification Steps

### Check 1: Verify Repository Visibility
1. Go to: `https://github.com/Maximus-Technologies-Uganda/training-prince`
2. Click **Settings** tab
3. Check under **Access** → **Visibility**
4. Note if the repository is:
   - 🔓 **Public** - Anyone can see and clone
   - 🔒 **Private** - Only authorized users can access

### Check 2: Verify GitHub Actions Token Permissions
1. Go to Settings → Actions → **General**
2. Under "Workflow permissions" section, verify:
   - ✅ "Read and write permissions" should be ENABLED for workflow to succeed
   - If only "Read repository contents permission" is available, that's OK too

### Check 3: Review Branch Protection Rules
1. Go to Settings → **Branches**
2. Check if `development` or `main` branch has protection rules
3. Look for "Require status checks to pass" settings
4. Ensure all required checks are configured correctly

## Solutions

### Solution 1: For Private Repository (Recommended)
If the repository is private, add explicit token configuration to workflows:

```yaml
permissions:
  contents: read
  security-events: write
  pull-requests: read

env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Solution 2: Verify Actions Permissions
1. Go to **Settings** → **Actions** → **General**
2. Under "Workflow permissions", select **"Read and write permissions"**
3. Ensure **"Allow GitHub Actions to create and approve pull requests"** is checked if needed

### Solution 3: Update Checkout with Explicit Token

Change checkout steps from:
```yaml
- uses: actions/checkout@v4
  with:
    fetch-depth: 0
```

To:
```yaml
- uses: actions/checkout@v4
  with:
    fetch-depth: 0
    token: ${{ secrets.GITHUB_TOKEN }}
```

### Solution 4: Skip/Disable Dependency Review (Temporary Workaround)
If repository is private and you can't grant sufficient permissions, temporarily disable:

```yaml
jobs:
  dependency-review:
    if: 'false'  # Temporarily disable
```

## Recent Changes Made

✅ Updated `.github/workflows/security.yml`:
- Added explicit `GH_TOKEN` environment variable
- Simplified Dependency Review checkout configuration
- Added proper permission scopes

✅ Fixed test configuration:
- Updated `vitest.config.js` for proper environment handling
- Updated test expectations for 70% coverage threshold
- Added proper timeouts for smoke tests

✅ Fixed spec validation:
- Added Review & Acceptance Checklist to `spec.md`
- Spec now passes `npm run spec:lint` validation

## Expected Status After Fixes

Once you verify repository settings:
- ✅ **CodeQL Analysis** should pass
- ✅ **Dependency Review** should pass (if permissions allow)
- ✅ **Test & Coverage** should pass (all 542 tests)
- ✅ **Playwright E2E** should pass
- ✅ **PR Validation** should pass

## Next Steps

1. **Verify repository visibility** (public vs private)
2. **Check Actions token permissions** in repository settings
3. **Trigger a new workflow run** (e.g., push a commit)
4. **Monitor logs** for updated error messages if still failing

## Contact & Support

If issues persist:
- Check GitHub Actions logs for specific error details
- Verify that branch protection rules aren't blocking merges
- Ensure repository owner has authorized third-party access

---

**Last Updated**: 2025-11-11  
**Related Files**: `.github/workflows/security.yml`, `.github/workflows/test.yml`, `vitest.config.js`, `specs/029-coverage-hardening/spec.md`
