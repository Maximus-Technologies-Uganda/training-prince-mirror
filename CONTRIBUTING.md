# Contributing Guide

## Branch & PR Conventions (Linear-linked)
- Branch: `feature/PRI-####-short-scope` (example: `feature/PRI-123-add-flag`)
- PR title must start with the Linear key: `PRI-123: Short description`
- Keep scope small and focused. No direct commits to `development`.

## PR Description Checklist
- [ ] Tests green in CI
- [ ] Review Packet artifact attached (Actions → review-packet)
- [ ] Coverage Summary checked (job Summary)
  
  | Metric | % |
  |---|---:|
  | Statements | <paste> |
  | Branches   | <paste> |
  | Functions  | <paste> |
  | Lines      | <paste> |
- [ ] CLI snippets included (copy-paste real outputs)
- [ ] Links: PR URL(s), CI run URL(s)
- [ ] Spec: paste Linear issue/doc URL (e.g., `Spec: https://linear.app/.../PRI-123/...`)

### Linear & Spec
- Linear: `<KEY>-<num>` (example: `PRI-123`)
- Spec: `<paste link>` (Linear doc or external spec)

## Review Steps
1. Open a feature branch from `development`.
2. Implement changes with tests; run `npm test` locally.
3. Push and open a PR; ensure CI is green.
4. Attach artifact link and Coverage Summary table.
5. Reviewer merges into `development` when checks pass.

## Merge Policy
- No direct commits to `development`.
- Rebase/merge only after green CI and reviewer approval.
- If a PR doesn’t auto-link to Linear (missing key), it won’t be reviewed.

## Linear Integration Setup
1. Create an issue in Linear and note its key (e.g., `PRI-123`).
2. Generate a Linear Personal API Key and add it to repository Secrets as `LINEAR_API_KEY` (do this in both private and mirror repos if both run CI).
3. PR titles must start with the key (examples):
   - `PRI-123: Add --priority flag to todo`
   - `PRI-456 fix: trim hello name`
   The CI job `pr-title-lint` enforces this format: `^PRI-\d+` at the start (case-insensitive).
4. Branch naming suggestion: `feature/PRI-123-short-scope`.
5. The `linear-sync` workflow will:
   - On PR open/edit: move the issue to "In Review" (or fallback to "PR Opened" if your team uses that state) and post the PR URL as a comment.
   - On merge: move the issue to "Done" and comment "PR merged: <url>".
   - It discovers your team’s exact state IDs via the Linear GraphQL API; no hardcoding required.
6. Troubleshooting:
   - "No PRI key in PR title" → rename the PR to start with the key, e.g., `PRI-123: ...`.
   - "Missing LINEAR_API_KEY secret" → add the key under Settings → Secrets and variables → Actions.
   - State didn’t change for an already‑merged PR → update the issue manually; new PRs will sync automatically.

## Code Coverage Requirements

This project enforces minimum code coverage thresholds to maintain code quality and test reliability. **All PRs must meet or exceed these thresholds; code that falls below them will be automatically rejected by CI.**

### Coverage Thresholds
- **Statements**: 60% minimum
- **Branches**: 50% minimum
- **Functions**: 60% minimum
- **Lines**: 60% minimum

These thresholds are **globally enforced** and apply to the entire codebase. There are no per-module overrides or exceptions.

### Running Coverage Locally

Before pushing, verify your changes meet coverage requirements:

```bash
# Run tests with coverage
npm run test:coverage

# View the HTML coverage report
open coverage/index.html
```

The coverage report will display metrics for each file and highlight which files fall below thresholds.

### Coverage Enforcement in CI

The CI pipeline (`.github/workflows/checks.yml`) automatically runs `npm run test:coverage` and fails the build if any threshold is not met. This is a **hard block**—PRs cannot be merged without passing coverage checks.

**Note**: If coverage thresholds fail in CI but pass locally, ensure you're running the same Node version. Run:
```bash
npm run test:coverage -- --run
```

### Coverage Policy

- **No Overrides**: There is no mechanism to bypass coverage thresholds. The only way to merge is to increase test coverage to meet the targets.
- **All Files Included**: Coverage is calculated globally across all application source files (`src/` and `frontend/src/`).
- **Exclusions**: Test files, build artifacts, dependencies, and config files are excluded from coverage calculations.
- **CI & Local Parity**: Thresholds are identical in local development and CI to ensure consistent behavior.

### Excluded from Coverage

The following are **not** counted toward coverage metrics:
- Test files (`*.test.js`, `*.spec.js`, `*.spec.ts`)
- Build directories (`dist/`, `build/`)
- Dependencies (`node_modules/`)
- Configuration and metadata (`review-artifacts/`, `.git/`)
- Coverage reports (`coverage/`)

### Review Artifacts

Coverage reports are integrated into the **Review Packet** artifact for historical tracking. View coverage data for any PR via the **review-packet** artifact in GitHub Actions.

---
