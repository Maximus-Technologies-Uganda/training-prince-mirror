# Quickstart — UI Temperature Converter

1) Install dependencies
```bash
npm ci
```

2) Run unit tests
```bash
npm run test
```

3) Run Playwright smoke test
```bash
npm run test:e2e
```

4) Open Coverage Index (after CI run)
- Download `review-packet` from your PR run
- Open `review-artifacts/index.html`
- Verify UI coverage entry for `ui-coverage-temp` once implemented

Notes
- Base URL for Playwright: set `BASE_URL` or `PLAYWRIGHT_BASE_URL` (defaults to `http://localhost:5173`).
- UI reuses conversion logic from `src/temp-converter` (no duplication).
- Rounding: 2 dp; display trims trailing zeros; errors announced via aria-live="assertive".
