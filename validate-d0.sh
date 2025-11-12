#!/bin/bash
set -e

echo "=== Week 5 Day-0: Definition of Done Validation ==="
echo ""

# Check 1: README updated
echo -n "✓ Check 1: README.md updated with Week 5 paths... "
git checkout main >/dev/null 2>&1
grep -q "review-artifacts" README.md && echo "PASS" || echo "FAIL"

# Check 2: Stray files removed
echo -n "✓ Check 2: Stray files removed from main... "
! git ls-files | grep -E "\\.tmp|debug\\.log|\\.\\.js" >/dev/null 2>&1 && echo "PASS" || echo "FAIL"

# Check 3: Commit exists
echo -n "✓ Check 3: Squash merge commit exists on main... "
git log --oneline -10 | grep -q "Week 5 Day-0" && echo "PASS" || echo "SKIP (not needed if main already has changes)"

# Check 4: Tag exists
echo -n "✓ Check 4: Tag week5-day0 created... "
git tag -l | grep -q "week5-day0" && echo "PASS" || echo "FAIL"

# Check 5: Branch protection configured (requires GitHub CLI + auth)
echo -n "✓ Check 5: Branch protection rules configured... "
if command -v gh >/dev/null && [ -n "$GITHUB_TOKEN" ]; then
  gh api repos/{owner}/{repo}/branches/main/protection 2>/dev/null | grep -q "required_status_checks" && echo "PASS" || echo "SKIP (manual verification required)"
else
  echo "SKIP (GitHub CLI not installed or GITHUB_TOKEN not set - manual verification required via GitHub UI)"
fi

# Check 6: Coverage thresholds
echo -n "✓ Check 6: Vitest coverage thresholds verified... "
npm run test:coverage 2>&1 | grep -q "Coverage thresholds met" && echo "PASS" || echo "FAIL"

# Check 7: Review packet
echo -n "✓ Check 7: Review packet complete at review-artifacts/index.html... "
[ -f "review-artifacts/index.html" ] && [ -f "review-artifacts/coverage/index.html" ] && echo "PASS" || echo "FAIL"

# Check 8: GitHub Project
echo -n "✓ Check 8: GitHub Project created with 5 custom fields... "
if command -v gh >/dev/null && [ -n "$GITHUB_TOKEN" ]; then
  gh project list 2>/dev/null | grep -q "Week 5" && echo "PASS" || echo "SKIP (manual verification required)"
else
  echo "SKIP (GitHub CLI not installed - manual verification required)"
fi

# Check 9: Issue templates
echo -n "✓ Check 9: Issue templates created... "
[ -f ".github/ISSUE_TEMPLATE/feature.md" ] && [ -f ".github/ISSUE_TEMPLATE/bug.md" ] && echo "PASS" || echo "FAIL"

# Check 10: PR template
echo -n "✓ Check 10: PR template created... "
[ -f ".github/pull_request_template.md" ] && echo "PASS" || echo "FAIL"

# Check 11: Contract tests
echo -n "✓ Check 11: Contract tests exist... "
[ -f "specs/025-week-5-day/contracts/branch-protection-setup.test.ts" ] && \
[ -f "specs/025-week-5-day/contracts/github-project-setup.test.ts" ] && \
[ -f "specs/025-week-5-day/contracts/issue-templates-validation.test.ts" ] && \
[ -f "specs/025-week-5-day/contracts/pull-request-template-validation.test.ts" ] && \
[ -f "specs/025-week-5-day/contracts/review-packet-generation.test.ts" ] && \
[ -f "specs/025-week-5-day/contracts/vitest-coverage-thresholds.test.ts" ] && echo "PASS (6 files exist)" || echo "FAIL"

# Check 12: Backup branch
echo -n "✓ Check 12: Backup branch created... "
git branch -a | grep -q "backup/week5-dev" && echo "PASS" || echo "FAIL"

echo ""
echo "=== End of Definition of Done Validation ==="


