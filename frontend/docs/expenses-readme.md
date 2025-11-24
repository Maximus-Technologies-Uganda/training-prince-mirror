# `/expenses` Route — Runbook & Troubleshooting

**Feature**: Chapter 6 Day 2 — Scaffold & Read-Only Integration  
**Spec**: `/specs/001-scaffold-expenses-ui/spec.md`  
**Last Updated**: 2025-11-24

---

## Overview

The `/expenses` route is a read-only expense ledger that displays transactions fetched from the Chapter 5 API through a secured Next.js server route proxy. It implements four primary UI states (loading, empty, error, success) with virtualization for ≥1,000 rows, and includes an "Add Expense" drawer placeholder for future write operations.

### Key Technologies

- **Next.js 15 App Router** (React 18)
- **TanStack Query 5** (data fetching + caching + retries)
- **react-window** (virtualized list rendering)
- **Vitest** (unit + component tests, ≥55% coverage)
- **Playwright** (E2E smoke + screenshot harness)
- **@axe-core/playwright** (accessibility scanning)

---

## Architecture

### Request Flow

```
Browser → GET /expenses (page.tsx)
         ↓
      ExpensesPageClient (client component)
         ↓
      useExpensesQuery() [TanStack Query hook]
         ↓
      GET /api/expenses (Next.js server route)
         ↓
      requestChapter5() [http.ts with service token]
         ↓
      Chapter 5 API → GET /expenses
```

### File Structure

```
frontend/
├── app/
│   ├── expenses/
│   │   ├── page.tsx                      # Server component entry
│   │   ├── ExpensesPageClient.tsx        # Client-side state machine
│   │   ├── styles.css                    # Ledger + component styles
│   │   ├── components/
│   │   │   ├── ExpensesHeader.tsx        # Title + aggregates bar
│   │   │   ├── ExpensesVirtualList.tsx   # react-window wrapper
│   │   │   ├── ExpensesRow.tsx           # Single expense item
│   │   │   ├── ExpensesSkeleton.tsx      # Loading shimmer state
│   │   │   ├── ExpensesEmptyState.tsx    # Zero-expense illustration
│   │   │   └── LoadError.tsx             # Error banner + retry CTA
│   │   └── drawer/
│   │       └── AddExpenseDrawer.tsx      # Placeholder (focus trap + aria)
│   └── api/
│       └── expenses/
│           └── route.ts                  # Secured proxy handler
├── lib/
│   ├── api/
│   │   ├── http.ts                       # requestChapter5() helper
│   │   └── expenses.ts                   # useExpensesQuery() + types
│   └── observability/
│       └── expenses-telemetry.ts         # Correlation ID + status logs
├── config/
│   └── env.ts                            # Runtime env validation
└── tests/
    ├── unit/api/
    │   └── expenses-route.spec.ts        # Proxy success/error paths
    ├── component/
    │   ├── ExpensesVirtualList.spec.tsx  # Virtualization + sorting
    │   ├── EmptyLedger.spec.tsx          # Empty state + CTA
    │   ├── ExpensesSkeleton.spec.tsx     # Loading transitions
    │   └── LoadError.spec.tsx            # Error banner + retry
    └── e2e/
        ├── expenses-empty.spec.ts        # Empty state screenshot
        └── expenses-error-loading.spec.ts # Error + loading screenshots
```

---

## Environment Configuration

### Required Variables

| Variable | Scope | Purpose | Validation |
|----------|-------|---------|------------|
| `NEXT_PUBLIC_API_URL` | Build-time + Runtime | Base URL for Chapter 5 API (e.g., `https://chapter5-api.example.com`) | Enforced by `config/env.ts`; build fails if absent |
| `NEXT_SERVICE_TOKEN` | Server-side only | Bearer token injected in proxy route headers | Checked at runtime in `route.ts`; 502 if missing |

### Setup

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local`:
   ```bash
   NEXT_PUBLIC_API_URL=https://chapter5-api.example.com
   NEXT_SERVICE_TOKEN=your-service-token-here
   ```

3. Verify configuration:
   ```bash
   npm run dev
   ```
   - Visit `http://localhost:3000/expenses`
   - If env vars are missing, you'll see a configuration error banner

---

## UI States & Data Flow

### 1. Loading State

**Trigger**: Query status is `"pending"` and fetch is in progress  
**Component**: `ExpensesSkeleton.tsx`  
**Behavior**:
- Displays animated shimmer rows (5 placeholders)
- Screen reader announces "Loading expenses..."
- Telemetry logs: `recordStatus("loading")`

**Troubleshooting**:
- If loading hangs >30s, check `http.ts` timeout (default 30s)
- Verify Chapter 5 API is reachable from server environment
- Check CI logs for `NEXT_PUBLIC_API_URL` misconfiguration

---

### 2. Empty State

**Trigger**: API returns `[]` or 204 No Content  
**Component**: `ExpensesEmptyState.tsx`  
**Behavior**:
- Shows illustration + copy: "No expenses found"
- "Add Expense" CTA opens `AddExpenseDrawer` (placeholder)
- Telemetry logs: `recordStatus("empty", { count: 0 })`

**Troubleshooting**:
- Verify Chapter 5 API has seed data: `GET /expenses` should return non-empty array
- Check proxy route logs for 204 response
- Confirm empty state test passes: `npm run test:ui -- ExpensesEmptyState`

---

### 3. Error State

**Trigger**: Proxy route returns 502, network timeout, or upstream failure  
**Component**: `LoadError.tsx`  
**Behavior**:
- Displays error banner with message + support correlation ID
- "Retry" button invalidates TanStack Query cache and refetches
- Retry count increments telemetry: `recordRetry(attempt)`
- Telemetry logs: `recordError(error)`

**Error Response Format** (from proxy):
```json
{
  "message": "Upstream API request timed out after 30000ms"
}
```

**Troubleshooting**:
- **502 Bad Gateway**: Chapter 5 API is down or unreachable
  - Verify `NEXT_PUBLIC_API_URL` points to correct host
  - Check service token validity: `NEXT_SERVICE_TOKEN`
  - Test upstream manually: `curl -H "Authorization: Bearer $NEXT_SERVICE_TOKEN" $NEXT_PUBLIC_API_URL/expenses`

- **Timeout (30s)**:
  - Increase timeout in `lib/api/http.ts` if upstream is slow
  - Check network latency between Next.js server and Chapter 5 API
  - Review Chapter 5 API logs for slow queries

- **CORS Errors** (should not happen — proxy route avoids this):
  - Ensure browser requests go to `/api/expenses` (same-origin)
  - Never call Chapter 5 API directly from client code

---

### 4. Success State

**Trigger**: API returns `200` with valid expense array  
**Component**: `ExpensesVirtualList.tsx` + `ExpensesRow.tsx`  
**Behavior**:
- Renders virtualized list via `react-window` (rows 30px tall)
- Displays expenses sorted by `purchaseDate` descending
- Shows merchant, category, date, status badge, and formatted amount
- Aggregates bar displays total count + sum (via `ExpensesHeader.tsx`)
- Telemetry logs: `recordStatus("success", { count, fetchedAt })`

**Data Contract** (from Chapter 5 API):
```typescript
interface ExpenseDto {
  id: string;              // UUID
  merchant: string;
  category?: string;       // Optional; taxonomy from Chapter 5
  purchaseDate: string;    // ISO 8601 datetime
  status: "PENDING" | "APPROVED" | "FLAGGED" | "REJECTED";
  amount: {
    currency: string;      // ISO 4217 (e.g., "USD")
    value: number;         // Minor units (cents)
  };
  memo?: string;
  attachments?: string[];  // URIs
}
```

**Troubleshooting**:
- **Incorrect sorting**: Verify `purchaseDate` is valid ISO 8601 in API response
- **Missing fields**: Check expense schema in `lib/api/expenses.ts` matches upstream contract
- **Amount formatting issues**: Confirm `currency` and `value` follow minor units (cents) convention
- **Virtualization glitches**: If rows flicker or overlap, verify:
  - List height calculation in `ExpensesVirtualList.tsx`
  - Row height is consistently 30px in `styles.css`
- **Performance degradation** (>1k rows):
  - Profile with React DevTools
  - Confirm `react-window` is rendering only visible rows
  - Check for unnecessary re-renders in `ExpensesRow.tsx`

---

## Add Expense Drawer (Placeholder)

**Component**: `AddExpenseDrawer.tsx`  
**Status**: Scaffold only (no submission logic)  
**Behavior**:
- Opens via "Add Expense" CTA in empty state or header
- Implements focus trap (prevents tab escape)
- ARIA labeling: `role="dialog"`, `aria-labelledby`, `aria-modal="true"`
- Close via ESC key or "Cancel" button

**Future Work** (not in Day 2 scope):
- Form fields for merchant, category, amount, date
- POST `/api/expenses` mutation via TanStack Query
- Optimistic updates + cache invalidation
- Attachment upload flow

---

## Caching & Retries

### TanStack Query Configuration

**Query Key**: `["expenses"]`  
**Stale Time**: 0 (always refetch on mount)  
**Cache Time**: 5 minutes (keeps data in memory for 5m after unmount)  
**Retry Logic**: 3 attempts with exponential backoff (1s, 2s, 4s)  
**Refetch on Window Focus**: Enabled (refreshes data when user returns to tab)

### Manual Cache Invalidation

```typescript
// In component:
const queryClient = useQueryClient();
await queryClient.invalidateQueries({ queryKey: ["expenses"] });
```

**Use Cases**:
- After successful expense creation (when POST implemented)
- On "Retry" button click in error state
- When user manually refreshes via browser

---

## Testing

### Unit Tests (Vitest)

**Coverage Target**: ≥55% statements  
**Run Command**: `npm run test:ui -- --coverage.enabled true`

**Test Files**:
- `tests/unit/api/expenses-route.spec.ts` — Proxy route success/error paths
- `tests/component/ExpensesVirtualList.spec.tsx` — Virtualization + sorting
- `tests/component/EmptyLedger.spec.tsx` — Empty state + CTA focus trap
- `tests/component/ExpensesSkeleton.spec.tsx` — Loading shimmer rendering
- `tests/component/LoadError.spec.tsx` — Error banner + retry mechanism

**Mock Strategy**:
- Use Vitest `vi.mock()` to stub `requestChapter5()` responses
- Mock TanStack Query provider for component isolation
- Intercept telemetry calls to verify logging

**Example**:
```typescript
vi.mock("@/lib/api/http", () => ({
  requestChapter5: vi.fn().mockResolvedValue([/* mock expenses */]),
}));
```

---

### E2E Tests (Playwright)

**Run Command**: `npm run test:e2e`  
**Screenshot Output**: `review-artifacts/ui-states/`

**Test Files**:
- `tests/e2e/expenses-empty.spec.ts` — Empty state illustration + CTA
- `tests/e2e/expenses-error-loading.spec.ts` — Error banner + loading shimmer

**Intercept Strategy**:
```typescript
// Force empty state:
await page.route("**/api/expenses", (route) => route.fulfill({ status: 204 }));

// Force error state:
await page.route("**/api/expenses", (route) => 
  route.fulfill({ status: 502, body: JSON.stringify({ message: "Upstream timeout" }) })
);

// Force loading state (delay response):
await page.route("**/api/expenses", (route) => 
  route.fulfill({ status: 200, body: JSON.stringify([]), delay: 5000 })
);
```

**Screenshots** (required for review packet):
1. `expenses-loading.png` — Skeleton shimmer state
2. `expenses-empty.png` — Empty state illustration + CTA
3. `expenses-error.png` — Error banner with retry button
4. `expenses-success.png` — Populated ledger with ≥5 rows

---

### Accessibility Testing

**Run Command**: `npm run test:ally`  
**Tool**: `@axe-core/playwright`

**Validations**:
- No WCAG violations on `/expenses` page
- Keyboard navigation: Tab through ledger rows, drawer, retry button
- Screen reader announcements: Loading, empty, error states
- Focus trap in `AddExpenseDrawer` (cannot tab outside modal)
- Color contrast ratios meet WCAG AA standards

**CI Gate**: Build fails if any axe violations detected

---

## Common Issues & Solutions

### Issue: "Configuration Error" banner on `/expenses`

**Cause**: Missing or invalid `NEXT_PUBLIC_API_URL`

**Solution**:
1. Check `.env.local` exists and contains `NEXT_PUBLIC_API_URL`
2. Restart dev server: `npm run dev`
3. Verify build-time env: `npm run build` should fail fast if missing

---

### Issue: 502 Bad Gateway on every load

**Cause**: Chapter 5 API unreachable or `NEXT_SERVICE_TOKEN` invalid

**Solution**:
1. Test upstream API manually:
   ```bash
   curl -H "Authorization: Bearer $NEXT_SERVICE_TOKEN" \
        "$NEXT_PUBLIC_API_URL/expenses"
   ```
2. Verify token has `read:expenses` scope
3. Check firewall rules allow Next.js server → Chapter 5 API traffic
4. Review `app/api/expenses/route.ts` logs for detailed error messages

---

### Issue: Empty state shows when expenses exist

**Cause**: Proxy route returning 204 instead of 200 with data

**Solution**:
1. Check proxy route logic in `route.ts`: ensure `expenses.length > 0` condition is correct
2. Inspect Chapter 5 API response: `GET /expenses` should return `[{...}]`, not `{data: [...]}`
3. Verify `ExpenseDto` schema matches upstream contract (see `lib/api/expenses.ts`)

---

### Issue: Virtualized list renders blank rows

**Cause**: Row height mismatch or missing data mapping

**Solution**:
1. Verify `ExpensesRow.tsx` has fixed height: `height: 30px` in styles
2. Check `ExpensesVirtualList.tsx` itemSize prop: `itemSize={30}`
3. Ensure expense data has valid `id` field for keying rows
4. Test with smaller dataset first (<100 rows) to isolate issue

---

### Issue: Tests pass locally but fail in CI

**Cause**: Environment variable differences or timing issues

**Solution**:
1. Confirm CI workflow sets `NEXT_PUBLIC_API_URL` and `NEXT_SERVICE_TOKEN`:
   ```yaml
   env:
     NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}
     NEXT_SERVICE_TOKEN: ${{ secrets.NEXT_SERVICE_TOKEN }}
   ```
2. Check Playwright test timeouts: increase if CI is slower than local
3. Verify coverage threshold: ≥55% statements enforced in CI
4. Review screenshot diffs in `review-artifacts/` for visual regressions

---

### Issue: Retry button doesn't refetch data

**Cause**: Query invalidation not triggering refetch

**Solution**:
1. Check `LoadError.tsx` calls `queryClient.invalidateQueries({ queryKey: ["expenses"] })`
2. Verify query is not in "paused" state (network offline)
3. Inspect TanStack Query DevTools (install browser extension) for cache state
4. Ensure `onRetry` handler increments telemetry retry count

---

## Performance Optimization

### Virtualization Tuning

**Current Config**:
- Row height: 30px
- Overscan: 5 rows (renders 5 extra rows above/below viewport)
- List height: `calc(100vh - 200px)` (accounts for header + footer)

**If performance degrades**:
1. Reduce overscan to 2-3 rows
2. Memoize row components: `React.memo(ExpensesRow)`
3. Use `useMemo()` for expensive aggregates calculation
4. Profile with React DevTools Profiler

---

### Network Optimization

**Current Setup**:
- Proxy route disables caching: `Cache-Control: no-store`
- TanStack Query refetches on window focus

**For production**:
1. Enable HTTP caching headers: `Cache-Control: public, max-age=60`
2. Implement stale-while-revalidate pattern
3. Add pagination if expense count exceeds 10k rows
4. Consider server-side filtering/sorting for very large datasets

---

## Telemetry & Debugging

### Correlation IDs

Every page load generates a unique correlation ID via `expenses-telemetry.ts`:
```typescript
const telemetry = createExpensesTelemetry();
const correlationId = telemetry.getCorrelationId(); // e.g., "exp-1732464892341-abc123"
```

**Where it appears**:
- Error banner: "Support code: exp-1732464892341-abc123"
- Console logs: `[exp-1732464892341-abc123] recordStatus("success")`
- Sentry/APM tags (when integrated)

**Use for debugging**:
1. User reports error → copy correlation ID from banner
2. Search server logs for that ID
3. Trace full request lifecycle: page load → query → proxy → upstream

---

### Console Logs

**Development Mode**:
```
[exp-1732464892341-abc123] recordStatus("loading")
[exp-1732464892341-abc123] recordStatus("success", { count: 42, fetchedAt: 1732464892500 })
```

**Production Mode**: Logs redacted; only errors sent to APM

---

## CI/CD Integration

### GitHub Actions Workflows

**`test-ui.yml`**:
```yaml
- name: Run UI tests with coverage
  run: npm run test:ui -- --coverage.enabled true
  working-directory: ./frontend
- name: Check coverage threshold
  run: |
    coverage=$(jq '.total.statements.pct' coverage/coverage-summary.json)
    if (( $(echo "$coverage < 55" | bc -l) )); then
      echo "Coverage $coverage% is below 55% threshold"
      exit 1
    fi
```

**`playwright-smoke.yml`**:
```yaml
- name: Run E2E tests
  run: npm run test:e2e
  working-directory: ./frontend
- name: Upload screenshots
  uses: actions/upload-artifact@v3
  with:
    name: playwright-screenshots
    path: frontend/review-artifacts/ui-states/
```

**`ally-check.yml`**:
```yaml
- name: Run accessibility tests
  run: npm run test:ally
  working-directory: ./frontend
```

**`build-frontend.yml`**:
```yaml
- name: Build Next.js app
  run: npm run build
  working-directory: ./frontend
  env:
    NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}
    NEXT_SERVICE_TOKEN: ${{ secrets.NEXT_SERVICE_TOKEN }}
```

---

## Review Packet Assembly

**Purpose**: Attach coverage + screenshots to PR per constitution Principle III

**Command**: `npm run review-artifacts`

**Output**:
```
review-artifacts/
├── index.html              # Landing page with links to all artifacts
├── coverage/
│   └── index.html          # Vitest coverage report
└── ui-states/
    ├── expenses-loading.png
    ├── expenses-empty.png
    ├── expenses-error.png
    └── expenses-success.png
```

**Manual Steps**:
1. Run tests: `npm run test:ui -- --coverage.enabled true && npm run test:e2e`
2. Generate artifacts: `npm run build && npm run review-artifacts`
3. Commit `review-artifacts/` to feature branch
4. Link in PR description: "📦 Review packet: [artifacts](./review-artifacts/index.html)"

---

## Future Enhancements (Out of Scope for Day 2)

- **Write operations**: POST `/api/expenses` with optimistic updates
- **Filters**: Category, status, date range dropdowns
- **Sorting**: User-controlled sort by merchant, amount, date
- **Pagination**: Virtual scrolling with infinite query
- **Bulk actions**: Multi-select + approve/reject/delete
- **Real-time updates**: WebSocket push for new expenses
- **Offline support**: Service worker + IndexedDB cache
- **Export**: CSV/PDF download of ledger

---

## Contact & Support

**Feature Owner**: Chapter 6 Day 2 Team  
**Spec Location**: `/specs/001-scaffold-expenses-ui/spec.md`  
**Task Breakdown**: `/specs/001-scaffold-expenses-ui/tasks.md`  
**API Contract**: `/specs/001-scaffold-expenses-ui/contracts/expenses-openapi.yaml`

For issues or questions:
1. Check this runbook first
2. Review test failures in CI logs
3. Search codebase for error messages
4. Escalate to team with correlation ID + reproduction steps
