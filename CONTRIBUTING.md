# Contributing Guide

## Branch & PR Conventions (Linear‑linked)
- Branch: `feature/<KEY>-<num>-short-scope` (example: `feature/DEV-123-add-flag`)
- PR title MUST start with the Linear key (enforced by CI): `DEV-123: Short description`
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

### Linear & Spec
- Linear: `<KEY>-<num>` (example: `DEV-123`)
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
1. Create an issue in Linear and note its key (e.g., `DEV-123`).
2. Generate a Linear Personal API Key and add it to repository Secrets as `LINEAR_API_KEY` (do this in both private and mirror repos if both run CI).
3. PR titles must start with the key (examples):
   - `DEV-123: Add --priority flag to todo`
   - `DEV-456 fix: trim hello name`
   The CI job `pr-title-lint` enforces this format: `^[A-Za-z]{2,}-\d+` at the start.
4. Branch naming suggestion: `feature/DEV-123-short-scope`.
5. The `linear-sync` workflow will:
   - On PR open/edit: move the issue to "In Review" (or fallback to "PR Opened" if your team uses that state) and post the PR URL as a comment.
   - On merge: move the issue to "Done" and comment "PR merged: <url>".
   - It discovers your team’s exact state IDs via the Linear GraphQL API; no hardcoding required.
6. Troubleshooting:
   - "No Linear key in PR title" → rename the PR to start with the key, e.g., `DEV-123: ...`.
   - "Missing LINEAR_API_KEY secret" → add the key under Settings → Secrets and variables → Actions.
   - State didn’t change for an already‑merged PR → update the issue manually; new PRs will sync automatically.
