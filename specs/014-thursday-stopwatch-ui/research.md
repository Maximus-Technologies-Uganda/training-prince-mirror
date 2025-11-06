# Research: Stopwatch UI Implementation & Accessibility Polish

**Phase**: 0 (Research & Investigation)  
**Date**: October 24, 2025  
**Feature Branch**: `014-thursday-stopwatch-ui`

---

## Research Tasks & Decisions

### Task R1: CSV Export Patterns in Vanilla JavaScript

**Question**: How to implement CSV file download in vanilla JavaScript without external dependencies?

**Research Findings**:
- Native Blob API available in all modern browsers (ES6+ standard)
- Standard pattern: `Blob` + `URL.createObjectURL()` + anchor element download
- Alternative libraries: `csv-stringify` (npm package), `Papa Parse` (larger, unnecessary)

**Decision**: Use native Blob API approach
- **Rationale**: 
  - Minimal code (~10-15 lines)
  - No new npm dependency (aligns with Simplicity principle)
  - Fully supported in project's target browsers (modern ES6+)
  - No licensing or maintenance overhead
- **Implementation**: 
  ```javascript
  const csv = generateCSVString(laps); // "Lap Number,Absolute Time,Lap Duration\n1,00:01:30,00:01:30\n..."
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `stopwatch_export_${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  ```
- **Alternatives Considered**: 
  - csv-stringify: adds dependency, more than needed (rejected)
  - Server-side generation: adds backend call latency (rejected; use case is client-side)

**Test Coverage**: CSV string formatting tested in unit tests; download trigger tested in Playwright

---

### Task R2: WCAG AA Audit Scope & Tools for Existing 5 UIs

**Question**: How to identify and prioritize contrast, focus, and label issues across 5 existing UIs?

**Research Findings**:
- WebAIM Contrast Checker: Browser extension for checking text/background contrast ratios
- WAVE (Web Accessibility Evaluation Tool): Identifies missing labels, low contrast, keyboard issues
- Manual keyboard navigation: Tab through all UIs to verify focus order
- NVDA/JAWS screen reader simulators: Test label announcements (browser DevTools Accessibility Inspector as fallback)

**Decision**: Multi-tool audit with prioritization
- **Rationale**:
  - Combines automated detection (WAVE, WebAIM) + manual validation (keyboard, screen reader)
  - Covers all three a11y requirement areas: contrast (FR-016), focus/navigation (FR-017), labels (FR-018)
  - Prioritize by impact: fixes high-contrast errors first (affects all users), then focus/labels (keyboard + screen reader users)
- **Audit Process**:
  1. Run WAVE on each UI (Quote, Temp, Expense, Todo, Stopwatch)
  2. Check contrast ratios for all text (WebAIM Contrast Checker)
  3. Keyboard-only navigation test (Tab through all buttons/inputs)
  4. Screen reader label check (NVDA/Accessibility Inspector)
  5. Document baseline (which UIs need fixes, severity)
- **Alternatives Considered**:
  - Lighthouse CI: good but slower, requires build integration (defer to PR review)
  - Manual audit only: time-consuming, less precise (rejected; use tools)
  - Skip a11y fixes: violates FR-015-019 requirements (rejected)

**Coverage**: a11y audit results documented; fixes tracked in separate PR3

---

### Task R3: Existing Stopwatch Core API Validation

**Question**: How does `src/stopwatch/core.js` export timer logic, and can it be safely reused in the UI?

**Research Findings**:
- Stopwatch core exists in `src/stopwatch/core.js` (CLI implementation already available)
- Core exports: timer start/stop/reset functions, state management, elapsed time calculation
- Performance: JavaScript-based timer using `Date.now()` (sufficient for UI updates)
- Accuracy: Timestamp-based calculation (not setInterval-prone drift)

**Decision**: Import and wrap core logic in UI layer
- **Rationale**:
  - Aligns with Constitution Principle I (No Logic Duplication)
  - Core already tested in CLI; UI tests focus on UI-specific concerns (DOM, persistence, export)
  - Clear separation: Backend provides `startTime`, UI handles display refresh + persistence
- **Integration Points**:
  1. UI imports `src/stopwatch/core.js` exports (start, stop, reset functions)
  2. UI maintains TimerState object in memory (startTime, isRunning, laps)
  3. UI calls `Date.now() - startTime` to display elapsed time on each frame
  4. UI syncs TimerState to localStorage (core doesn't need to know about storage)
- **Validation Tests**:
  - Unit test: Import core, verify exports exist
  - Integration test: Core start/stop/reset work correctly in UI context
  - Accuracy test: Timer continues correctly after page reload (timestamp calculation)
- **Alternatives Considered**:
  - Reimplement timer in UI: violates No Logic Duplication (rejected)
  - Use Web Worker for timer: unnecessary complexity (rejected; single-threaded UI sufficient)

**Status**: Ready to import; no breaking changes anticipated

---

### Task R4: localStorage Failure Modes & Graceful Degradation

**Question**: How to handle cases where localStorage is unavailable (private browsing, quota exceeded, policy blocked)?

**Research Findings**:
- localStorage availability issues:
  - Private/Incognito mode: localStorage access throws SecurityError
  - Quota exceeded: Throws QuotaExceededError (rare for stopwatch, but possible)
  - Security policies: Some corporate environments block localStorage
- Standard pattern: Try-catch wrapping localStorage calls
- Fallback strategies: Session-only mode (in-memory state, no persistence) with user notification

**Decision**: Try-catch wrapper with session-only mode fallback
- **Rationale**:
  - Graceful degradation: timer continues working without persistence
  - User transparency: "Session-only mode" message if localStorage unavailable
  - Minimal overhead: one try-catch block per persistence operation
  - Aligns with quality principle: don't crash on environmental constraints
- **Implementation**:
  ```javascript
  function persistState(state) {
    try {
      localStorage.setItem('stopwatchState', JSON.stringify(state));
      showPersistenceStatus('Saved'); // hidden by default
    } catch (e) {
      if (e.name === 'SecurityError' || e.name === 'QuotaExceededError') {
        showPersistenceStatus('Session-only mode (localStorage unavailable)');
        // Continue without persistence; next page reload loses state
      }
    }
  }
  
  function restoreState() {
    try {
      const saved = localStorage.getItem('stopwatchState');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.warn('Could not restore state:', e);
      return null; // Default to fresh state
    }
  }
  ```
- **Testing**:
  - Unit test: Mock localStorage to throw SecurityError; verify fallback works
  - Acceptance: Manual test in private browsing mode; verify timer still functions, no crash
- **Alternatives Considered**:
  - IndexedDB fallback: unnecessary complexity (rejected)
  - Server-side session storage: adds backend dependency (rejected; client-side only scope)
  - Fail silently: poor UX (user doesn't know state isn't saved) (rejected)

**Status**: Documented; ready for implementation in Phase 2

---

## Summary

| Task | Decision | Confidence | Impact |
|------|----------|-----------|--------|
| **R1 - CSV Export** | Native Blob API (no dependency) | ✅ High | Simplifies code; reduces dependencies |
| **R2 - a11y Audit** | Multi-tool (WAVE + WebAIM + keyboard + screen reader) | ✅ High | Comprehensive coverage of contrast/focus/labels |
| **R3 - Core Integration** | Import `src/stopwatch/core.js`; wrap in UI layer | ✅ High | Adheres to No Logic Duplication principle |
| **R4 - localStorage Fallback** | Try-catch + session-only mode with UI indicator | ✅ High | Handles edge cases gracefully; improves robustness |

---

## Phase 0 Completion

✅ **All 4 research tasks completed**  
✅ **No unresolved NEEDS CLARIFICATION remaining**  
✅ **Ready for Phase 1 Design & Contracts**

---
