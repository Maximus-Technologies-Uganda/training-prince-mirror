# Clock Contract

## Purpose
Provide deterministic "today" boundaries for filtering with a fixed timezone.

## API
- now(): DateTime — current instant in Africa/Kampala (UTC+3)
- today(): { startOfDay: DateTime, endOfDay: DateTime } — boundaries in Africa/Kampala

## Requirements
- Consumers MUST use today() for due‑today calculations
- Implementation MUST be injectable/mocked in tests
- No direct use of Date.now() in filter logic
