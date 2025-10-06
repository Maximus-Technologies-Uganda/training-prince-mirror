# Data Model: UI To‑Do Management

## Entities
### ToDoItem
- id: stable identifier (index or generated id)
- text: string (normalized for duplicate checks: trim, collapse spaces, lowercased copy for compare)
- completed: boolean
- dueDate: date | null (interpreted in Africa/Kampala, UTC+3)
- priority: enum { high, normal }

### Filters
- mode: enum { all, due‑today, high‑priority }
- computed using clock abstraction (for due‑today) and item priority

## Normalization Rules
- duplicateKey = lowerCase(collapseSpaces(trim(text)))
- duplicates prevented when duplicateKey matches an existing item

## State Transitions
- add(text, dueDate?, priority?): creates ToDoItem if text non‑empty and not duplicate; else error
- toggle(id): completed ⇄ !completed; invalid id → error, no state change
- remove(id): deletes item; view preserves current filter mode

## Invariants
- No two items share the same duplicateKey
- due‑today computed using fixed TZ Africa/Kampala via injected clock

## Clock Abstraction
- now(): returns current instant in Africa/Kampala
- today(): returns [startOfDay, endOfDay] in Africa/Kampala for filtering
