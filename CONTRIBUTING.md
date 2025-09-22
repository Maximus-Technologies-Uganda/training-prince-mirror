# Contributing Guide

## Branch & PR Conventions (Linear-linked)
- Branch: `feature/LIN-####-short-scope`
- PR title: `feat(scope): short description (LIN-####)`
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
