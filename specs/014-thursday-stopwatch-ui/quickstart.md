# Quickstart: Stopwatch UI Acceptance Tests

**Phase**: 1 (Design & Contracts)  
**Date**: October 24, 2025  
**Feature Branch**: `014-thursday-stopwatch-ui`  
**Test Framework**: Playwright (TypeScript)

---

## Overview

This document describes the acceptance test scenarios that validate the Stopwatch UI feature. Each scenario maps to a Playwright test case and exercises one or more functional requirements from the feature spec.

**Test Scope**: Smoke tests covering critical user workflows and edge cases  
**Coverage Target**: All 8 acceptance scenarios from spec.md  
**Platform**: Web browser (Chrome/Firefox/Webkit)

---

## Scenario 1: Start Timer

**Acceptance Criteria**: [AC-001]  
**Related Requirements**: FR-001, FR-004  
**Test File**: `e2e/stopwatch.spec.ts` → `test('Start timer')`

### Setup

- Open `stopwatch.html` in browser
- Timer is in reset state (display shows "00:00:00", Start button is visible)

### Test Steps

1. **When** user clicks the Start button
2. **Then** timer begins counting upward
3. **And** display updates every 100-500ms showing elapsed time incrementing (00:00:01, 00:00:02, ...)
4. **And** Start button changes state (disabled, hidden, or labeled "Stop")

### Assertions

```typescript
await page.click('button:has-text("Start")');
await page.waitForTimeout(1100);  // Wait 1.1 seconds
const display1 = await page.textContent('.timer-display');
expect(display1).toMatch(/00:00:0[1-2]/);  // Should show 00:00:01 or 00:00:02

await page.waitForTimeout(1000);
const display2 = await page.textContent('.timer-display');
const [h1, m1, s1] = display1.split(':').map(Number);
const [h2, m2, s2] = display2.split(':').map(Number);
const time1 = h1 * 3600 + m1 * 60 + s1;
const time2 = h2 * 3600 + m2 * 60 + s2;
expect(time2).toBeGreaterThan(time1);  // Second reading should be later
```

---

## Scenario 2: Record Lap While Running

**Acceptance Criteria**: [AC-002]  
**Related Requirements**: FR-005, FR-006, FR-007, FR-008  
**Test File**: `e2e/stopwatch.spec.ts` → `test('Record lap while running')`

### Setup

- Timer is running at some elapsed time (e.g., 00:01:30)
- Lap button is visible and enabled

### Test Steps

1. **When** timer shows 00:01:30
2. **And** user clicks the Lap button
3. **Then** current time (00:01:30) is recorded
4. **And** new lap appears in lap list below timer
5. **And** timer continues running (doesn't pause)

### Assertions

```typescript
await page.click('button:has-text("Start")');
await page.waitForTimeout(1500);  // Wait ~1.5 seconds

const timerBefore = await page.textContent('.timer-display');
await page.click('button:has-text("Lap")');

const lapList = await page.locator('.lap-list').textContent();
expect(lapList).toContain('Lap 1');
expect(lapList).toContain(timerBefore);  // Lap time matches timer display

// Timer should continue
await page.waitForTimeout(500);
const timerAfter = await page.textContent('.timer-display');
expect(timerAfter).not.toBe(timerBefore);  // Timer moved forward
```

---

## Scenario 3: Record Multiple Laps

**Acceptance Criteria**: [AC-003]  
**Related Requirements**: FR-005, FR-006, FR-008  
**Test File**: `e2e/stopwatch.spec.ts` → `test('Record multiple laps')`

### Setup

- Timer is running
- At least one lap already recorded

### Test Steps

1. **When** user clicks Lap at time T1 (e.g., 00:01:00)
2. **Then** Lap 1 recorded with time T1
3. **When** user clicks Lap again at time T2 (e.g., 00:02:30)
4. **Then** Lap 2 recorded with time T2
5. **And** lap list shows both laps
6. **And** Lap 2 displays duration = T2 - T1 = 00:01:30

### Assertions

```typescript
await page.click('button:has-text("Start")');
await page.waitForTimeout(1000);
await page.click('button:has-text("Lap")');

await page.waitForTimeout(1500);
const timerBeforeLap2 = await page.textContent('.timer-display');
await page.click('button:has-text("Lap")');

const lapList = await page.locator('.lap-list').textContent();
expect(lapList).toContain('Lap 1');
expect(lapList).toContain('Lap 2');

// Verify lap durations are shown
const lapItems = await page.locator('.lap-item').all();
expect(lapItems.length).toBe(2);

const lap2Text = await lapItems[1].textContent();
expect(lap2Text).toContain('Duration');  // Shows duration column
```

---

## Scenario 4: Stop Timer

**Acceptance Criteria**: [AC-004]  
**Related Requirements**: FR-002  
**Test File**: `e2e/stopwatch.spec.ts` → `test('Stop timer')`

### Setup

- Timer is running

### Test Steps

1. **When** user clicks the Stop button
2. **Then** timer pauses at current elapsed time
3. **And** display no longer updates
4. **And** Stop button changes state (becomes Start, or stop button disabled)

### Assertions

```typescript
await page.click('button:has-text("Start")');
await page.waitForTimeout(1500);

const timerAtStop = await page.textContent('.timer-display');
await page.click('button:has-text("Stop")');

// Wait and verify timer doesn't change
await page.waitForTimeout(500);
const timerAfterStop = await page.textContent('.timer-display');
expect(timerAfterStop).toBe(timerAtStop);  // Time frozen

// Stop button should now show "Start" or be re-enabled
const startBtn = page.locator('button:has-text("Start")');
await expect(startBtn).toBeVisible();
```

---

## Scenario 5: Reset Timer

**Acceptance Criteria**: [AC-005]  
**Related Requirements**: FR-003  
**Test File**: `e2e/stopwatch.spec.ts` → `test('Reset timer')`

### Setup

- Timer has been running and may have laps recorded

### Test Steps

1. **When** user clicks the Reset button
2. **Then** timer display returns to "00:00:00"
3. **And** all recorded laps are cleared from lap list
4. **And** UI returns to ready-to-start state

### Assertions

```typescript
await page.click('button:has-text("Start")');
await page.waitForTimeout(1500);
await page.click('button:has-text("Lap")');

const lapListBefore = await page.locator('.lap-list').textContent();
expect(lapListBefore).toContain('Lap 1');

await page.click('button:has-text("Reset")');

const display = await page.textContent('.timer-display');
expect(display).toBe('00:00:00');

const lapListAfter = await page.locator('.lap-list').textContent();
expect(lapListAfter).not.toContain('Lap 1');
expect(lapListAfter?.trim()).toBe('');  // Empty lap list
```

---

## Scenario 6: Export to CSV

**Acceptance Criteria**: [AC-006]  
**Related Requirements**: FR-012, FR-013, FR-014, FR-015  
**Test File**: `e2e/stopwatch.spec.ts` → `test('Export to CSV')`

### Setup

- Timer has stopped
- Multiple laps have been recorded

### Test Steps

1. **When** user clicks Export to CSV button
2. **Then** browser downloads a CSV file
3. **And** file is named `stopwatch_export_{timestamp}.csv`
4. **And** file contains headers: "Lap Number,Absolute Elapsed Time,Lap Duration"
5. **And** file contains rows: one per lap with lap number, absolute time, and lap duration

### Assertions

```typescript
// Start timer and record 2 laps
await page.click('button:has-text("Start")');
await page.waitForTimeout(1000);
await page.click('button:has-text("Lap")');
await page.waitForTimeout(500);
await page.click('button:has-text("Lap")');

await page.click('button:has-text("Stop")');

// Capture download
const downloadPromise = page.context().waitForEvent('download');
await page.click('button:has-text("Export")');
const download = await downloadPromise;

// Verify filename
expect(download.suggestedFilename()).toMatch(/^stopwatch_export_\d+\.csv$/);

// Read file content
const path = await download.path();
const fs = require('fs');
const csvContent = fs.readFileSync(path, 'utf8');

expect(csvContent).toContain('Lap Number,Absolute Elapsed Time,Lap Duration');
expect(csvContent).toContain('1,');  // Lap 1 row
expect(csvContent).toContain('2,');  // Lap 2 row
expect(csvContent.split('\n').length).toBeGreaterThan(2);  // Header + 2 rows minimum
```

---

## Scenario 7: Persistence Across Page Reload

**Acceptance Criteria**: [AC-007]  
**Related Requirements**: FR-009, FR-010, FR-011  
**Test File**: `e2e/stopwatch.spec.ts` → `test('Persist state across reload')`

### Setup

- Timer has been running for some time with laps recorded
- Page is about to be reloaded

### Test Steps

1. **When** timer is running at T (e.g., running for 30 seconds, 2 laps recorded)
2. **And** page is reloaded (without clearing localStorage)
3. **Then** timer resumes from approximately the same elapsed time
4. **And** all recorded laps are restored
5. **And** timer continues counting

### Assertions

```typescript
await page.click('button:has-text("Start")');
await page.waitForTimeout(1000);
await page.click('button:has-text("Lap")');

const timerBeforeReload = await page.textContent('.timer-display');
const lapListBefore = await page.locator('.lap-list').textContent();

// Reload page (preserves localStorage)
await page.reload();

// Wait for restore
await page.waitForTimeout(500);

const timerAfterReload = await page.textContent('.timer-display');
const lapListAfter = await page.locator('.lap-list').textContent();

// Timer should be approximately same or slightly advanced
const [hB, mB, sB] = timerBeforeReload.split(':').map(Number);
const [hA, mA, sA] = timerAfterReload.split(':').map(Number);
const diffSec = (hA * 3600 + mA * 60 + sA) - (hB * 3600 + mB * 60 + sB);
expect(diffSec).toBeGreaterThanOrEqual(0);
expect(diffSec).toBeLessThan(2);  // Should be 0-2 seconds difference (reload + restore latency)

// Laps should be restored
expect(lapListAfter).toContain('Lap 1');
```

---

## Scenario 8: Accessibility - Keyboard Navigation

**Acceptance Criteria**: [AC-008]  
**Related Requirements**: FR-016, FR-017, FR-018, FR-019  
**Test File**: `e2e/stopwatch.spec.ts` → `test('Accessibility: keyboard navigation')`

### Setup

- Stopwatch UI is open
- No element has focus initially

### Test Steps

1. **When** user presses Tab key repeatedly
2. **Then** focus moves through interactive elements in logical order:
   - Start → Stop (if visible) → Lap (if visible) → Reset → Export
3. **And** each button shows visible focus indicator (outline, border, or highlight)
4. **And** screen reader can announce button names (tested via accessibility tree)

### Assertions

```typescript
// Tab through buttons
const focusOrder = ['Start', 'Reset', 'Export'];  // Initially Stop/Lap hidden

for (const btnName of focusOrder) {
  await page.keyboard.press('Tab');
  const focused = await page.evaluate(() => document.activeElement?.textContent);
  expect(focused).toContain(btnName);
  
  // Check for focus indicator (CSS outline or computed style)
  const hasFocus = await page.evaluate(() => {
    const el = document.activeElement as HTMLElement;
    const style = window.getComputedStyle(el);
    return style.outline !== 'none' || style.boxShadow !== 'none';
  });
  expect(hasFocus).toBe(true);
}

// Verify accessibility tree has labels
const tree = await page.accessibility.snapshot();
const buttons = tree?.children?.filter(c => c.role === 'button') || [];
expect(buttons.length).toBeGreaterThanOrEqual(3);
expect(buttons.every(b => b.name)).toBe(true);  // All buttons have names
```

---

## Scenario 9: Debounce Rapid Lap Clicks

**Acceptance Criteria**: [AC-009] (edge case)  
**Related Requirements**: FR-008  
**Test File**: `e2e/stopwatch.spec.ts` → `test('Debounce rapid lap clicks')`

### Setup

- Timer is running

### Test Steps

1. **When** user clicks Lap button rapidly (e.g., 3 times within 200ms)
2. **Then** only 1 lap is recorded (first click)
3. **And** 2nd and 3rd clicks are debounced (ignored within 100ms window)

### Assertions

```typescript
await page.click('button:has-text("Start")');
await page.waitForTimeout(1000);

// Rapid clicks
await page.click('button:has-text("Lap")');
await page.click('button:has-text("Lap")');  // Within 100ms
await page.click('button:has-text("Lap")');  // Within 100ms

// Should only record 1 lap
const lapList = await page.locator('.lap-item').count();
expect(lapList).toBe(1);  // Not 3
```

---

## Manual Testing Checklist (Supplementary)

In addition to automated Playwright tests, the following should be manually verified:

- [ ] Text contrast ratio ≥4.5:1 (normal text) and ≥3:1 (large text) across all UI elements
- [ ] Focus indicator clearly visible when tabbing through buttons
- [ ] Screen reader (NVDA/JAWS/VoiceOver) announces button names and timer value
- [ ] Timer updates smoothly without jank or CPU spike
- [ ] localStorage unavailable mode (private browsing) shows "Session-only mode" message
- [ ] CSV file opens correctly in Excel/Google Sheets with proper column alignment
- [ ] No console errors or warnings when running test scenarios

---

## Test Execution

### Run All Smoke Tests

```bash
npm run test:e2e -- e2e/stopwatch.spec.ts
```

### Run Specific Scenario

```bash
npm run test:e2e -- e2e/stopwatch.spec.ts -g "Start timer"
```

### Generate Coverage Report

```bash
npm run test:coverage -- frontend/src/ui-stopwatch/
```

### Expected Outcome

✅ All 9 scenarios pass  
✅ No console errors or warnings  
✅ Coverage ≥40% for ui-stopwatch module  
✅ No accessibility violations (keyboard, labels, contrast)

---

*Next: Phase 1 continues with API Contracts*
