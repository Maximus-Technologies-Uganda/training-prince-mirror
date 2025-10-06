# Quickstart: UI To‑Do Management

## Prerequisites
- Node.js and npm installed

## Setup
```bash
# from repo root
npm install
```

## Run Dev
```bash
# Vite dev server
cd frontend
npm run dev
```

## Run Unit Tests with Coverage
```bash
cd frontend
npm run test -- --coverage
# Expect ui-todo to achieve ≥40% statements
```

## Run Playwright Smoke
```bash
cd frontend
npm run test:e2e
# Smoke: add a new item, then toggle it
```

## Build for GitHub Pages
```bash
cd frontend
npm run build
# Output: frontend/dist (deployable)
```

## Review Packet
- Ensure CI job `review-packet` includes `ui-coverage-todo` in artifact
  - CI workflow: `.github/workflows/review-packet.yml`
  - UI coverage path inside artifact: `review-artifacts/ui-coverage-todo/`
  - Open `review-artifacts/index.html` → link `ui-todo`

## Run UI locally

```bash
cd frontend
npm ci
npm run dev
```

## Unit tests (UI)

```bash
cd frontend
npm run test
```

## E2E smoke (Playwright)

```bash
cd frontend
npm run test:e2e
```
- Open `review-artifacts/index.html` for coverage index
