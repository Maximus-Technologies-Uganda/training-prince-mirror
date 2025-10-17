# Research: UI Quote

- Decision: Reuse `src/quote/core.js` in frontend to avoid duplication.
- Rationale: Aligns with Constitution I (No Logic Duplication); reduces bugs.
- Alternatives considered: Re-implement filter/random in UI (rejected per policy).

- Decision: Seeded RNG in tests via `vi.spyOn(Math, 'random').mockReturnValue(...)`.
- Rationale: Deterministic unit tests; reproducible coverage.
- Alternatives: Inject RNG dependency (overkill for small scope).

- Decision: Live filtering on input events.
- Rationale: Better UX; matches spec clarification.
- Alternatives: Debounced search (unnecessary complexity for small dataset).

- Decision: Empty state text "No quotes found" replaces quote.
- Rationale: Clear feedback; matches spec.
- Alternatives: Hide blockquote (worse for layout and a11y).
