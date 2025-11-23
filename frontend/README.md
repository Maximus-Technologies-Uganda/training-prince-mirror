# Frontend Workspace – Chapter 6 Day 2 Scaffold & Read-Only Integration

This directory contains the Next.js 15 App Router project that delivers the `/expenses` experience for Chapter 6 Day 2. All work for the feature spec at `specs/001-scaffold-expenses-ui/` lives here.

## Prerequisites

- Node.js 20.x (matches CI runners)
- npm 10+
- Access to the Chapter 5 API (or the provided mock) and a service token for proxying requests

## Setup

```bash
cd frontend
npm install
```

Configure environment variables by editing `.env.local` (a template is committed for reference):

```
NEXT_PUBLIC_API_URL=https://chapter5-api.example.com
NEXT_SERVICE_TOKEN=local-dev-token
```

## Local Development

```bash
npm run dev
```

- Visit http://localhost:3000/expenses
- The dev server fails fast if `NEXT_PUBLIC_API_URL` or `NEXT_SERVICE_TOKEN` are missing, keeping the proxy route secure.

## Testing & Coverage

```bash
npm run lint
npm run test:ui -- --coverage.enabled true
```

- Vitest runs in jsdom, emits coverage to `frontend/coverage/`, and must meet the ≥55% UI threshold.
- ESLint/Prettier rules follow the project constitution.

## Playwright Smoke & Screenshots

```bash
npm run test:e2e
```

- Specs intercept `/api/expenses` to force loading/empty/error/success states.
- Screenshots are written to `review-artifacts/ui-states/` and uploaded by CI.

## Accessibility Checks

```bash
npm run test:ally
```

- Uses `@axe-core/playwright` to scan `/expenses` headlessly; CI fails on any violation.

## Review Packet Assembly

1. `npm run test:ui -- --coverage.enabled true`
2. `npm run test:e2e`
3. `npm run build && npm run review-artifacts`

The `review-artifacts` script copies the latest coverage report and Playwright screenshots into `review-artifacts/index.html` for PR attachments.

## CI Jobs

- `test-ui`: `npm run test:ui -- --coverage.enabled true`
- `playwright-smoke`: `npm run test:e2e`
- `ally-check`: `npm run test:ally`
- `build-frontend`: `npm run build`

All jobs must remain green (including coverage threshold enforcement) before merging the feature branch.
