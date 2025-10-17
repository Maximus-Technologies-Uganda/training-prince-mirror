# Research: UI To‑Do Management

## Decisions
- Timezone for "today": Africa/Kampala (UTC+3) via clock abstraction
- Duplicate detection: normalize (trim + collapse spaces) then case‑insensitive compare
- Removal under filters: keep current filter applied after removal
- Invalid due date: block add with inline error; keep input values
- Persistence: in-memory only; reload resets list
- No logic duplication: reuse `src/todo/` core logic in UI

## Rationale
- Fixed timezone ensures deterministic tests and stable day boundaries
- Normalization avoids trivial duplicates while respecting user intent
- Preserving filters maintains user focus context
- Blocking invalid dates prevents hidden state; keeping input speeds correction
- In-memory avoids premature persistence decisions; keeps scope small
- Reusing domain logic ensures consistency with existing CLIs and tests

## Alternatives Considered
- Timezone: UTC or browser local → Rejected for cross‑env nondeterminism
- Duplicate detection exact match → Rejected; misses user‑perceived duplicates
- Clearing filters on removal → Rejected; disrupts user workflow
- Coercing invalid dates → Rejected; implicit mutation risks confusion
- localStorage persistence → Deferred; adds state migration and test complexity

## Open Questions (None)
All critical ambiguities resolved in clarifications.
