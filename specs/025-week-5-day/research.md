# Research & Technical Investigation: Week 5 Day-0

**Branch**: `025-week-5-day` | **Date**: November 6, 2025  
**Purpose**: Resolve technical unknowns and establish concrete implementation decisions

---

## R1: GitHub Projects API & Automation

### Research Question
How do we create, configure, and automate a GitHub Project with custom fields matching the Linear migration plan?

### Findings

**GitHub Projects (new format)**:
- GitHub launched "Projects" (beta/new) as successor to legacy "Project boards"
- New Projects are stored at repository level (`github.com/owner/repo/projects`)
- Configurable via REST API v1.1 (POST /repos/.../projects) or GraphQL API
- Custom fields are created post-launch and cannot be bulk-migrated

**Custom Fields Mapping** (Linear → GitHub Projects):
| Linear Field | GitHub Projects Equivalent | Type | Options |
|---|---|---|---|
| Status | Status | SingleSelect | "Backlog", "Todo", "In Progress", "In Review", "Done" |
| Priority | Priority | SingleSelect | "P0/Critical", "P1/High", "P2/Medium", "P3/Low" |
| Size | Size | SingleSelect | "XS", "S", "M", "L", "XL" |
| Module/Area | Spec URL | Text | (free text, links to spec files) |
| Sprint | Sprint/Week | SingleSelect | "Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 5 Day-0" |

**Automation Rules**:
- Auto-add Issues: Repository settings → Workflows → "Auto-add issues to project" (automatic)
- Auto-add PRs: Repository settings → Workflows → "Auto-add PRs to project" (automatic)
- Status on open: ProjectV2 GraphQL API mutation `updateProjectV2ItemFieldValue` triggered on `issues.opened` and `pull_request.opened` events
- Status on merge: GitHub Actions workflow listening to `pull_request.closed` event with `merged == true`

**Decision**: Use GitHub Settings UI for basic automation (auto-add) + GitHub Actions workflow for PR event handlers (status updates).

---

## R2: GitHub Branch Protection Rules

### Research Question
What are the exact configuration steps and status check names for main branch protection?

### Findings

**Current Status Checks** (from .github/workflows/):
1. `spec-check` → Validates specification format and completeness
2. `Test & Coverage - API` → API test suite (Vitest) + coverage reporting
3. `Playwright Smoke` → End-to-end smoke tests (Playwright)
4. `CodeQL` → Static security analysis (GitHub CodeQL action)
5. `Dependency Review` → Supply chain security scanning (GitHub native)

**Configuration via Settings UI**:
1. Navigate to repository Settings → Branches
2. Select branch `main` (or create rule if not exists)
3. Enable "Require status checks to pass before merging"
4. Search and select each of the 5 check names
5. Optionally enable "Require branches to be up to date before merging" (recommended)
6. Optionally enable "Require code reviews" (separate from status checks)

**Configuration via REST API**:
```bash
curl -X PUT \
  -H "Authorization: token $GITHUB_TOKEN" \
  "https://api.github.com/repos/owner/repo/branches/main/protection" \
  -d '{
    "required_status_checks": {
      "strict": true,
      "contexts": [
        "spec-check",
        "Test & Coverage - API",
        "Playwright Smoke",
        "CodeQL",
        "Dependency Review"
      ]
    },
    "required_pull_request_reviews": null,
    "enforce_admins": false,
    "allow_deletions": false,
    "allow_force_pushes": false,
    "required_linear_history": false
  }'
```

**Consideration**: Development branch should have NO protection rules to allow fast iteration and cleanup commits.

**Decision**: Configure via Settings UI for transparency (maintainers can verify visually); document API command for future automation.

---

## R3: Vitest Coverage Thresholds & Configuration

### Research Question
How do we enforce 60% coverage thresholds across 5 UI suites and verify the configuration?

### Findings

**Current Vitest Config** (vitest.config.js):
```javascript
export default {
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.spec.ts',
        '**/*.test.ts'
      ],
      lines: 60,      // 60% minimum
      functions: 60,
      branches: 60,
      statements: 60
    }
  }
}
```

**Multi-Suite Coverage** (5 UI suites):
- `ui-expense`: Source in frontend/src/components/Expense/
- `ui-stopwatch`: Source in frontend/src/components/Stopwatch/
- `ui-temp`: Source in frontend/src/components/Temperature/
- `ui-todo`: Source in frontend/src/components/Todo/
- `ui-quote`: Source in frontend/src/components/Quote/

**Configuration per-suite**:
```javascript
// vitest.config.js
coverage: {
  include: [
    'src/components/Expense/**',
    'src/components/Stopwatch/**',
    'src/components/Temperature/**',
    'src/components/Todo/**',
    'src/components/Quote/**'
  ],
  lines: 60,
  functions: 60,
  branches: 60,
  statements: 60
}
```

**Verification Steps**:
1. Run `npm run test:coverage` or `vitest run --coverage`
2. Check console output: "Coverage threshold met for lines (XX%)"
3. Review coverage/index.html for per-file breakdown
4. Verify all 5 suites listed with >= 60% across all metrics

**Decision**: Keep single global threshold (60% minimum) rather than per-suite thresholds; easier to enforce and understand. Document that all 5 UI suites are included in the coverage path.

---

## R4: Review Artifact Generation & Packaging

### Research Question
How do we generate a review-artifacts/index.html that links to coverage, reports, docs, and changelog?

### Findings

**Current Review Packet Structure**:
```
review-artifacts/
├── index.html                (main entry point)
├── coverage/
│   ├── index.html           (Vitest coverage report)
│   └── (coverage files)
├── playwright-report/
│   ├── index.html           (Playwright test results)
│   └── (trace, video files)
├── openapi.html             (OpenAPI specification docs)
└── CHANGELOG.md             (release notes - linked, not embedded)
```

**Generation Script** (pseudo-code):
```bash
#!/bin/bash
# 1. Run Vitest with coverage
npm run test:coverage

# 2. Run Playwright tests with HTML report
npm run test:e2e

# 3. Generate OpenAPI HTML (if applicable)
# [Depends on how OpenAPI spec is stored]

# 4. Create index.html with links
cat > review-artifacts/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
  <title>Week 5 Review Packet</title>
  <style>
    body { font-family: sans-serif; margin: 2rem; }
    a { color: #0066cc; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .section { margin: 2rem 0; padding: 1rem; border-left: 4px solid #ddd; }
  </style>
</head>
<body>
  <h1>Week 5 Review Packet</h1>
  
  <div class="section">
    <h2>Coverage Report</h2>
    <p><a href="./coverage/index.html" target="_blank">View Full Coverage Report</a></p>
    <p>Target: 60% minimum across statements, branches, functions, lines</p>
  </div>
  
  <div class="section">
    <h2>End-to-End Tests</h2>
    <p><a href="./playwright-report/index.html" target="_blank">View Playwright Test Results</a></p>
  </div>
  
  <div class="section">
    <h2>API Documentation</h2>
    <p><a href="./openapi.html" target="_blank">View OpenAPI Specification</a></p>
  </div>
  
  <div class="section">
    <h2>Release Notes</h2>
    <p><a href="./CHANGELOG.md" target="_blank">View CHANGELOG</a></p>
  </div>
</body>
</html>
EOF

# 5. Verify all linked files exist
test -f review-artifacts/coverage/index.html || exit 1
test -f review-artifacts/playwright-report/index.html || exit 1
test -f review-artifacts/openapi.html || exit 1
test -f review-artifacts/CHANGELOG.md || exit 1

echo "✓ Review packet generated successfully"
```

**Links Strategy**:
- Use relative paths (./coverage/, ./playwright-report/) for portability
- All links should be to index.html or static files (not API endpoints)
- CHANGELOG.md is linked as-is (GitHub will render it)
- No embedded external CDNs (must work offline)

**Integration with CI**:
- GitHub Actions workflow uploads review-artifacts/ as an artifact
- Link from PR or release notes for easy access by reviewers

**Decision**: Create review-artifacts/index.html as a simple HTML file with relative links. Update generation script to verify all files before finalizing.

---

## R5: GitHub Issue & PR Templates

### Research Question
How do we structure issue and PR templates for maximum clarity and contributor guidance?

### Findings

**GitHub Template Syntax**:
- Stored in `.github/ISSUE_TEMPLATE/` directory
- Markdown format with optional YAML frontmatter
- Frontmatter defines template name, about, title, labels, assignees
- Templates support multi-line text, checkboxes, dropdown selects (via markdown syntax tricks)

**Feature.md Template** (best practice structure):
```markdown
---
name: Feature Request
about: Suggest a new feature for this project
title: "[FEATURE] "
labels: feature
---

## Description
[Brief description of the feature]

## Problem Statement
[What problem does this solve?]

## Proposed Solution
[How would you implement this?]

## Acceptance Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

## Related Links
[Link to specification, issue, or discussion]

## Additional Context
[Screenshots, mockups, or relevant details]
```

**Bug.md Template** (best practice structure):
```markdown
---
name: Bug Report
about: Report a bug or issue
title: "[BUG] "
labels: bug
---

## Description
[Brief description of the bug]

## Reproduction Steps
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Environment
- Browser: [e.g., Chrome 120]
- OS: [e.g., macOS 13.5]
- App Version: [e.g., v1.0.0]

## Screenshots/Logs
[Attach images or error logs if applicable]

## Additional Context
[Any other relevant information]
```

**Pull Request Template** (best practice structure):
```markdown
## Spec URL
[Link to specification or Linear issue this PR addresses]

## Contract Tests
- [ ] Contract tests added/verified
- [ ] Tests cover happy path
- [ ] Tests cover error cases
- [ ] All tests passing

## Changes Made
[Brief description of implementation]

## Checks
- [ ] Local tests passing (npm run test)
- [ ] Coverage meets thresholds (60%)
- [ ] E2E tests passing (npm run test:e2e)
- [ ] CodeQL passing
- [ ] No console errors or warnings

## CHANGELOG Updated
- [ ] User-facing changes added to CHANGELOG.md
- [ ] Format matches existing entries

## Breaking Changes
- [ ] No breaking changes
- [ ] Or describe breaking changes here

## Related Issues
Closes #[issue number]
```

**Validation**:
- GitHub automatically parses templates when contributor selects them
- Template must be valid Markdown (no syntax errors)
- YAML frontmatter (if present) must be valid
- Template should fit on one screen (avoid excessive scrolling)

**Decision**: Create feature.md and bug.md with clear sections and checkboxes for guidance. Update PR template with mandatory sections for traceability.

---

## R6: Squash Merge & Git Tagging

### Research Question
How do we safely squash-merge development into main and create a release tag?

### Findings

**Squash Merge Process**:
```bash
# 1. Ensure development branch is current
git fetch origin
git checkout development
git pull origin development

# 2. Verify all tests pass
npm run test
npm run test:e2e
npm run test:coverage

# 3. Switch to main and ensure it's current
git checkout main
git pull origin main

# 4. Perform squash merge
git merge --squash development

# 5. Create clear commit message
git commit -m "Week 5 Day-0: Final hygiene and GitHub Projects migration

- Update README.md with Week 5 paths and review packet links
- Remove stray files from main branch
- Configure branch protection rules (5 required CI checks)
- Create GitHub Project with custom fields and automation
- Add issue and PR templates to .github/
- Verify Vitest coverage thresholds (60% minimum)
- Generate review-packet artifact with all links

Squash merge of development branch (commits squashed).
All tests passing, all D0 requirements met.
Ready for production deployment."

# 6. Create annotated tag
git tag -a week5-day0 -m "Week 5 Day-0 release - GitHub Projects migration complete"

# 7. Push to origin
git push origin main week5-day0
```

**Advantages of Squash Merge**:
- Keeps main branch history clean (one commit per feature)
- Easier to revert if needed (one commit to revert)
- Easier to review (one commit contains all changes)
- Clear story of what happened each week

**Tagging Strategy**:
- Use annotated tags (not lightweight) for releases
- Tag format: `week5-day0` (week and phase identifier)
- Allows easy reference for bug reports ("fixed in week5-day0")

**Considerations**:
- Squash merge loses individual commit history from development
- To preserve history, create a "backup" branch before squashing: `git branch backup/week5-dev development`
- Ensure main is always deployable after squash merge

**Decision**: Use squash merge strategy for weekly integrations; create backup branch before squashing; tag after merge.

---

## Summary of Decisions

| Decision | Rationale |
|----------|-----------|
| GitHub Projects (new format) with custom fields | More powerful automation, better integration with GitHub workflow |
| 60% coverage threshold (global, all suites) | Achievable, consistent, easy to understand |
| Branch protection via Settings UI (document API) | Transparent to maintainers; easier to troubleshoot issues |
| Relative links in review-artifacts/index.html | Portable across environments; works offline |
| Squash merge strategy | Clean main branch history; easier to track major milestones |
| Structured templates with checkboxes | Guides contributors; standardizes expectations |

---

## Resolved Clarifications

None. The specification was clear on all D0.1-1.3 requirements.

---

## Outstanding Questions

1. **API Coverage**: What exact format should "Test & Coverage - API" output? (JSON, HTML, both?)
2. **OpenAPI Docs**: Where is the OpenAPI specification stored? (As openapi.json? Generated on build?)
3. **CHANGELOG Format**: Should CHANGELOG follow a standard format (e.g., Keep a Changelog)?

These questions don't block D0 tasks but should be clarified in Phase 1 design docs or Quickstart validation.

---

*Research complete. Ready to proceed to Phase 1 (Design & Contracts).*


