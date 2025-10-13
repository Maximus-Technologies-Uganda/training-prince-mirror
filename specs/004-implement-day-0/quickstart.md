# Quickstart: Day 0 Blockers Review

## Generate the Review Packet (locally)
```bash
npm ci
npm test -- --coverage
# optional UI (from frontend)
cd frontend && npm ci && npm run test -- --coverage && cd ..
```

## Open the Coverage Index
- Download `review-packet` artifact from GitHub Actions (development or PR runs)
- Open `review-artifacts/index.html`
- Backend: links under coverage-<app>/lcov-report/
- UI: links under ui-coverage-<app>/lcov-report/

## Runtime Data
- Files are created under `/data` at runtime
- `/data` is git-ignored
