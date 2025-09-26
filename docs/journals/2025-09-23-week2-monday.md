## PRs & CI
- PR: <paste PR URL here>
- CI: <paste Actions run URL here>
- Artifact: review-packet (paste run link → artifact list)

## Bugs & Fixes
- Invalid workflow due to duplicate YAML keys (multiple `name`/`on`/`jobs`).
- Fix: replaced with a single valid `review-packet.yml` producing one artifact.
- Result: CI green; artifact `review-packet` contains `review.md`, Coverage Index, and per-app HTML coverage.

## Evidence
- Commit SHA(s): 7fe8e7f
- Screenshot: attach Coverage Index (review-artifacts/index.html) after download.

## Notes
- Public mirror also produces the `review-packet` artifact; verified links open.
- README updated with usage and error examples; Coverage Index refreshed.

