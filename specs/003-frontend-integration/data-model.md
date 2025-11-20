# Data Model: Chapter 6 Day 1 – Frontend Integration

**Branch**: `003-frontend-integration` | **Date**: 19 November 2025  
**Status**: Phase 1 – Draft | **Next**: Contracts, Quickstart, Agent Context Update

---

## Entity Definitions

### 1. Expense (Read Model)

**Purpose**: Canonical row rendered inside the expenses list; mirrors the Chapter 5 `Expense` schema while adding UI-only presentation helpers.

| Field | Type | Required | Validation Rules | Notes |
|-------|------|----------|------------------|-------|
| `id` | UUID | Yes | Must be a valid UUID v4 returned by API | Displayed for troubleshooting; included in copy decks |
| `amount` | Number | Yes | `> 0`, currency formatted per signed-in locale | Drives list column + summary totals |
| `category` | String | Yes | Non-empty; matches API enum (e.g., food, travel) | Also used for filter chips |
| `date` | ISO Date (YYYY-MM-DD) | Yes | Matches regex `^\d{4}-\d{2}-\d{2}$` | Localized in UI (e.g., Nov 19, 2025) |
| `formattedAmount` | String | Derived | `Intl.NumberFormat` with USD default | Prevents duplication across list + summary |
| `isVirtualizedVisible` | Boolean | Derived | True when row index is inside current `react-window` viewport | Controls skeleton/screen reader announcements |

**State Transitions**:
```
API Payload → Normalized Expense → Virtualized Row → Focused Row (keyboard) → Mutated (after POST) → Refreshed
```

**Relationships**:
- Belongs to exactly one `PaginatedExpenseResponse`
- May belong to zero or one client-side `ExpenseFilters` snapshot
- Emits telemetry when part of refresh metrics (`frontend.expenses.refresh_ms` context)

**Validation**:
- Reject records missing required fields before rendering
- Derived `formattedAmount` recalculated whenever locale changes
- Focus outline must follow WCAG AA and return to trigger after drawer closes

**Example**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "amount": 125.75,
  "category": "travel",
  "date": "2025-11-18",
  "formattedAmount": "$125.75",
  "isVirtualizedVisible": true
}
```

---

### 2. PaginatedExpenseResponse

**Purpose**: Wraps the expenses array plus pagination metadata so the UI can render skeletons, footers, and "Showing X–Y of Z" copy.

| Field | Type | Required | Validation Rules | Notes |
|-------|------|----------|------------------|-------|
| `data` | Array<`Expense`> | Yes | Length `<= pageSize`; if empty, triggers Empty state | Feeds virtualization window |
| `pagination.totalItems` | Integer | Yes | `>= 0` | Used for totals + empty copy |
| `pagination.currentPage` | Integer | Yes | `>= 1` | Binds to pagination control |
| `pagination.pageSize` | Integer | Yes | `1–100` | UI warns when request exceeds 100 |
| `pagination.totalPages` | Integer | Yes | `>= 0` | Enables/Disables Next/Prev buttons |
| `requestId` | String | Optional | Provided when backend surfaces error context | Rendered inside Error state copy |

**State Transitions**:
```
Loading → Success (data length > 0) → Empty (data length = 0) → Error (HTTP 4xx/5xx) → Success (after retry)
```

**Relationships**:
- Consumes shared `ExpenseFilters`
- Drives the `UIStateEvidence` screenshots for Loading/Empty/Error/Success

**Validation**:
- When `pageSize > 100`, show inline notice per edge-case requirement
- Persist `requestId` even after retry for audit logs

**Example**:
```json
{
  "data": [ { "id": "550e...", "amount": 25.5, "category": "food", "date": "2025-11-05" } ],
  "pagination": {
    "totalItems": 250,
    "currentPage": 1,
    "pageSize": 20,
    "totalPages": 13
  },
  "requestId": "req_01hf93q9"
}
```

---

### 3. ExpenseSummary

**Purpose**: Aggregated totals rendered as tiles; shares filters with the list and exposes chips that echo applied criteria.

| Field | Type | Required | Validation Rules | Notes |
|-------|------|----------|------------------|-------|
| `total` | Number | Yes | `>= 0`; formatted using same currency rules as list | Drives top-line tile |
| `count` | Integer | Yes | `>= 0` | Displayed as "X expenses" |
| `filters.category` | String | No | Non-empty when present; matches filter dropdown option | Summaries restate applied filter |
| `filters.month` | String (YYYY-MM) | No | Regex `^\d{4}-\d{2}$` | Drives month chip + summary body copy |
| `generatedAt` | ISO Datetime | Derived | Timestamp captured when fetch resolves | Used in stale banner copy |

**State Transitions**:
```
Loading → Success (count > 0) → Empty (count = 0) → Error → Success (after retry)
```

**Relationships**:
- Backed by GET /expenses/summary
- Shares the `ExpenseFilters` controller and telemetry events with the list pane

**Validation**:
- Chips reflect each filter value and provide clearable buttons with aria labels
- Retry button refreshes summary pane only, unless triggered via global "Refresh now"

**Example**:
```json
{
  "total": 984.11,
  "count": 42,
  "filters": {
    "category": "travel",
    "month": "2025-11"
  },
  "generatedAt": "2025-11-19T15:04:12Z"
}
```

---

### 4. ExpenseFilters

**Purpose**: Single source of truth for category/month selections; synchronizes query params, shared chips, and TanStack Query keys.

| Field | Type | Required | Validation Rules | Notes |
|-------|------|----------|------------------|-------|
| `category` | String | No | Maps to allowed categories; default `null` | Bound to select input |
| `month` | String (YYYY-MM) | No | Regex `^\d{4}-\d{2}$`; default current month | Bound to month picker |
| `queryKey` | Tuple | Yes | `['expenses', category, month]` | Ensures GET endpoints share cache key pieces |
| `urlSearchParams` | String | Yes | Encodes filters for bookmarking & QA repro | Example: `?category=food&month=2025-11` |
| `lastChangedAt` | ISO Datetime | Derived | Updated on every filter mutation | Feeds telemetry + stale banner logic |

**State Transitions**:
```
Default (no filters) → Category applied → Month applied → Both applied → Cleared
```

**Relationships**:
- Injected into TanStack Query hooks for GET /expenses and GET /expenses/summary
- Controls CTA target ("Add expense" opens drawer pre-filtered by category if set)

**Validation**:
- Filter chips must always mirror the controller state
- When filters change, both GET endpoints refetch in parallel without dropping focus

**Example**:
```json
{
  "category": "food",
  "month": "2025-11",
  "queryKey": ["expenses", "food", "2025-11"],
  "urlSearchParams": "?category=food&month=2025-11",
  "lastChangedAt": "2025-11-19T14:58:00Z"
}
```

---

### 5. UIStateEvidence Artifact

**Purpose**: Tracks the four mandatory screenshots + copy references that must exist before `/speckit.plan` completes.

| Field | Type | Required | Validation Rules | Notes |
|-------|------|----------|------------------|-------|
| `state` | Enum | Yes | `loading`, `empty`, `error`, `success` | Matches FR-005 naming (`state-{state}.png`) |
| `scenarioId` | String | Yes | Maps to Acceptance Scenario IDs | Example: `US1-S1` |
| `copyDeckRef` | String | Yes | Points to figma/markdown copy doc | Ensures textual consistency |
| `screenshotPath` | String | Yes | Stored under `specs/003-frontend-integration/state-{state}.png` | Reviewed in packet |
| `ariaNotes` | String | Yes | Summarizes accessibility expectations per state | QA uses for assistive tech testing |
| `frReference` | String | Yes | FR identifier (e.g., FR-004) | Links artifact to requirement |

**State Transitions**:
```
Draft placeholder → Screenshot captured → Reviewed → Packaged in Review Packet
```

**Relationships**:
- Each state evidence maps back to either `PaginatedExpenseResponse` or `ExpenseSummary` states
- QA checklist references this entity before sign-off

**Validation**:
- Filenames must match `state-{state}.png`
- Captions include filters used + timestamp for reproducibility

**Example**:
```json
{
  "state": "loading",
  "scenarioId": "US1-S1",
  "copyDeckRef": "figma://expenses/loading-copy",
  "screenshotPath": "specs/003-frontend-integration/state-loading.png",
  "ariaNotes": "List container aria-busy=true; summary tiles aria-live=polite",
  "frReference": "FR-005"
}
```
