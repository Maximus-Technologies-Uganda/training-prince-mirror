# Quickstart — UI To-Do

1. **Install dependencies**
```
npm ci
```

2. **Run unit tests (To-Do UI)**
```
npm run test -- frontend/src/ui-todo
```

3. **Run Playwright smoke test**
```
npm run test:e2e -- frontend/e2e/todo.smoke.spec.ts
```

4. **Verify coverage locally (optional)**
```
VITEST_COVERAGE_DIR=ui-coverage-todo npm run test -- frontend/src/ui-todo --coverage
```

5. **Open the app (Vite dev server)**
```
npm run dev
```
Visit `http://localhost:5173` and use the To-Do section (tasks list, filters, inline errors).

## Checklist before PR
- [ ] `spec:lint` passes (`npm run spec:lint`).
- [ ] Vitest coverage for To-Do UI ≥40% statements (check coverage report or CI artifact `ui-coverage-todo`).
- [ ] Playwright smoke test captures add + toggle flow.
- [ ] `review-packet` artifact includes backend + `ui-coverage-todo` entries; index links verified via `scripts/generate-coverage-index.js` output.
- [ ] `tasks.md` synced via Linear workflow (`scripts/linear-sync.js`) for parent `PRI-???`.
