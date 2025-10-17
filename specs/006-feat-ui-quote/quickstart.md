# Quickstart: UI Quote

## Run locally
1. cd /Users/prnceb/Desktop/WORK/hello-world/frontend
2. npm ci
3. npm run dev
4. Open http://localhost:5173

## Manual validation
- Page shows a random quote on load
- Type "jobs" in Author input; quote updates to a Steve Jobs quote
- Type "zzzz"; quote area shows "No quotes found" and shuffle disabled

## Tests
- Unit: npm test (Vitest)
- E2E: npm run test:e2e (Playwright)

## Coverage
- Unit coverage report: frontend/coverage/lcov-report/index.html
- CI review-packet includes ui-coverage-quote entry
