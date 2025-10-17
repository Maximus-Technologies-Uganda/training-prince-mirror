# Quickstart: UI Stopwatch

## Run tests
```
cd frontend
npm ci
npm run test -- --coverage
```

## Run e2e smoke
```
cd frontend
npx playwright install --with-deps
npm run test:e2e
```

## Files
- `frontend/src/ui-stopwatch/index.js`
- `frontend/src/ui-stopwatch/clock.js`
- `frontend/src/ui-stopwatch/stopwatch.test.js`
- `frontend/e2e/stopwatch.smoke.spec.ts`


