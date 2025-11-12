# Creating GitHub Sub-Issues for Coverage Hardening Feature

This guide explains how to create GitHub sub-issues from the tasks.md file for the Week 5 Day 4 Coverage Lift feature.

## Overview

The feature includes 60 implementation tasks organized into 7 phases across 3 user stories. The script `create-coverage-sub-issues.mjs` will:

1. Create or find the parent issue: "feat(api): Day 4 - Coverage Lift & Edge Cases"
2. Create individual GitHub issues for each of the 60 tasks
3. Label all issues with `029-coverage-hardening` for easy filtering
4. Tag issues as parallelizable and by user story

## Prerequisites

### 1. GitHub Token

You need a GitHub personal access token with `repo` scope:

1. Go to: https://github.com/settings/tokens/new
2. Create new token (classic)
3. Select scopes: `repo` (full control of private repositories)
4. Copy the token

### 2. Set Environment Variable

```bash
export GITHUB_TOKEN=your_token_here
```

Verify it's set:
```bash
echo $GITHUB_TOKEN
```

## Running the Script

### Basic Usage

```bash
cd /Users/prnceb/Desktop/WORK/training-prince
node create-coverage-sub-issues.mjs
```

### What the Script Does

1. **Validates GitHub Token**: Checks that `GITHUB_TOKEN` is set
2. **Finds or Creates Parent Issue**: Searches for existing "feat(api): Day 4 - Coverage Lift & Edge Cases" issue, or creates it if not found
3. **Parses tasks.md**: Extracts all 60 tasks with their IDs, user story labels, and descriptions
4. **Creates Issues**: For each task, creates a GitHub issue with:
   - Title: `T### [US#]: Description`
   - Body: Full description, user story, parent issue link
   - Labels: `029-coverage-hardening`, `parallelizable` (if applicable), user story tags

### Output Example

```
🚀 Creating GitHub sub-issues for coverage-hardening feature...

📝 Creating parent issue...
✓ Parent issue: #123

📋 Found 60 tasks

  [1/60] Creating T001... ✓ #456
  [2/60] Creating T002... ✓ #457
  [3/60] Creating T003... ✓ #458
  ...
  [60/60] Creating T060... ✓ #515

✅ Completed!
   Created: 60 issues
   Failed: 0 issues

📊 Summary:
   Parent Issue: #123
   Sub-issues: 60 created

📖 View all issues:
   https://github.com/Maximus-Technologies-Uganda/training-prince/issues?labels=029-coverage-hardening
```

## Viewing Created Issues

### Via GitHub Web

1. Go to: https://github.com/Maximus-Technologies-Uganda/training-prince/issues
2. Filter by label: `029-coverage-hardening`
3. Sort by creation date (newest first)

### Via Command Line (if GitHub CLI is authenticated)

```bash
gh issue list --label "029-coverage-hardening" --repo "Maximus-Technologies-Uganda/training-prince"
```

### View Parent Issue

Search for: "feat(api): Day 4 - Coverage Lift & Edge Cases"

Or get the issue number from script output and view:
https://github.com/Maximus-Technologies-Uganda/training-prince/issues/[ISSUE_NUMBER]

## Task Organization in GitHub

All 60 tasks will be created with labels:

| Label | Purpose | Count |
|-------|---------|-------|
| `029-coverage-hardening` | All tasks for this feature | 60 |
| `parallelizable` | Can run in parallel (no dependencies) | ~30 |
| `US1` | Negative Path Testing story | ~12 |
| `US2` | Coverage Gap Closure story | ~15 |
| `US3` | Security CI Validation story | ~12 |

## Tasks by Phase

### Phase 1: Setup (4 tasks)
- T001-T004: Infrastructure verification

### Phase 2: Foundational (5 tasks)
- T005-T009: Coverage threshold update, test file structures

### Phase 3: User Story 1 - Negative Path Testing (11 tasks)
- T010-T020: Integration tests for invalid inputs

### Phase 4: User Story 2 - Coverage Gap Closure (14 tasks)
- T021-T034: Coverage analysis and gap closure

### Phase 5: User Story 3 - Security CI Validation (12 tasks)
- T035-T046: Security CI job verification

### Phase 6: Integration & Validation (6 tasks)
- T047-T052: Cross-story validation

### Phase 7: Polish & Final Validation (8 tasks)
- T053-T060: Code quality and merge readiness

## Implementation Workflow

### MVP Scope (Recommended for First Iteration)

Start with Phases 1-3:
1. Complete Phase 1 (Setup) - 4 tasks
2. Complete Phase 2 (Foundational) - 5 tasks
3. Complete Phase 3 (User Story 1 - Negative Path Testing) - 11 tasks

**Effort**: ~2-3 hours  
**Value**: Hardened API with negative path validation

### Full Implementation

After MVP, add:
4. Phase 4 (User Story 2 - Coverage Gap Closure) - 14 tasks
5. Phase 5 (User Story 3 - Security CI Validation) - 12 tasks
6. Phase 6 (Integration & Validation) - 6 tasks
7. Phase 7 (Polish & Final Validation) - 8 tasks

## Parallel Execution

Once Phase 2 is complete, work in parallel:

- Developer A: Phase 3 (US1 - Negative path tests)
- Developer B: Phase 4 (US2 - Coverage gaps)
- Developer C: Phase 5 (US3 - Security CI)

All three can work simultaneously on their respective user stories.

## Troubleshooting

### Issue: "GITHUB_TOKEN environment variable not set"

**Solution**: Set the token first:
```bash
export GITHUB_TOKEN=your_token_here
node create-coverage-sub-issues.mjs
```

### Issue: "GitHub API error: 401 Unauthorized"

**Solution**: Token is invalid or expired. Create a new one:
1. Go to https://github.com/settings/tokens/new
2. Create new token (classic)
3. Copy and set: `export GITHUB_TOKEN=new_token`

### Issue: Script hangs or is slow

**Solution**: Script includes 100ms delay between requests to avoid rate limiting. Expected runtime for 60 issues: ~7-10 seconds.

### Issue: Some issues failed to create

**Solution**: Check GitHub API rate limit:
```bash
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/rate_limit
```

Wait if rate limit exceeded, then re-run script.

## After Creating Issues

### 1. Link Issues to PR

Create PR from branch `029-coverage-hardening` and link all 60 issues in the PR description:

```markdown
## Closes
- Closes #456
- Closes #457
- Closes #458
... (all 60 task issues)
```

Or use GitHub's "Link Issues" UI to select the parent issue.

### 2. Track Progress

Use GitHub Projects to track:
- Filter by label: `029-coverage-hardening`
- Group by: User Story (US1, US2, US3)
- Track completion: Move issues through columns (To Do → In Progress → Done)

### 3. Assign Tasks

Assign each issue to team members:
- US1 tasks → QA/Testing lead
- US2 tasks → Backend developer (coverage focus)
- US3 tasks → DevOps/Security engineer

## Related Documentation

- **Tasks Details**: `specs/029-coverage-hardening/tasks.md`
- **Feature Specification**: `specs/029-coverage-hardening/spec.md`
- **Implementation Plan**: `specs/029-coverage-hardening/plan.md`
- **Quick Start Guide**: `specs/029-coverage-hardening/quickstart.md`

## Support

For issues with the script:
1. Check that `tasks.md` exists and is valid
2. Verify `GITHUB_TOKEN` is set correctly
3. Check GitHub API status: https://www.githubstatus.com/
4. Check GitHub rate limit: `curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/rate_limit`
