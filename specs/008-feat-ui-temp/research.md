# Research — UI Temperature Converter

## Decisions
- Conversion trigger: Auto-convert on any input or unit change.
- Error presentation: Inline message announced via aria-live="assertive"; result cleared during errors.
- Rounding/display: Round to 2 decimal places; trim trailing zeros when displayed.
- Default units: From Celsius → To Fahrenheit.
- Inputs cleared: Clear result and errors; neutral state.

## Rationale
- Auto-convert reduces friction and matches calculator-style UX; avoids extra clicks.
- Inline, assertive errors improve accessibility and ensure screen readers announce state changes; clearing result prevents stale values.
- 2 dp rounding is precise enough for temperature conversions; trimming zeros improves readability without losing precision.
- Defaulting C→F is a common first-use flow and aligns with examples.
- Clearing inputs should reset UI to a neutral state to avoid confusion.

## Alternatives considered
- Convert on button click: rejected for extra step and slower feedback.
- Banner-only errors: rejected; poor proximity and weaker accessibility signaling.
- Fixed 1 or 2 dp without trimming: rejected to avoid visual noise (e.g., trailing zeros).
- Remember last-unit selection: deferred; not required in current scope.
- Keep last valid result when inputs cleared: rejected; can mislead users.

