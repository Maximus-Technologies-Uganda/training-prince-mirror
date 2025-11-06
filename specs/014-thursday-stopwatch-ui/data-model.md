# Data Model: Stopwatch UI

**Phase**: 1 (Design & Contracts)  
**Date**: October 24, 2025  
**Feature Branch**: `014-thursday-stopwatch-ui`

---

## Domain Model Overview

The Stopwatch UI manages three key entities:
1. **TimerState** - Core timer session data (persisted to localStorage)
2. **LapRecord** - Individual lap entry (derived from TimerState)
3. **ExportedCSV** - CSV file format for download

---

## Entity Definitions

### 1. TimerState (Persisted)

**Purpose**: Represents a single stopwatch session. Contains only minimal essential data for recovery after page reload.

**Attributes**:

| Attribute | Type | Nullable | Description | Validation |
|-----------|------|----------|-------------|-----------|
| `startTime` | Unix timestamp (number) | Yes | Milliseconds when timer began (from `Date.now()`) | Must be in past or null; if isRunning=true, must not be null |
| `isRunning` | Boolean | No | Whether timer is currently active | Must be boolean |
| `laps` | Array<number> | No | List of lap timestamps (Unix ms) in ascending order | Must be array; all elements Unix timestamps; sorted ascending |

**State Transitions**:

```
[Reset State] 
  {startTime: null, isRunning: false, laps: []}
         ↓ (Start clicked)
[Running]
  {startTime: <now>, isRunning: true, laps: []}
         ↓ (Lap clicked)
[Running with Laps]
  {startTime: <now>, isRunning: true, laps: [<lap1>, <lap2>, ...]}
         ↓ (Stop clicked)
[Stopped]
  {startTime: <now>, isRunning: false, laps: [<lap1>, <lap2>, ...]}
         ↓ (Reset clicked)
[Reset State] ← (returns to initial state)

Persistence Flow:
  After any state change → serialize to JSON → localStorage.setItem('stopwatchState', JSON.stringify(state))
  On page load → restore from localStorage → resume if isRunning=true
```

**Derived Field** (calculated, not stored):

| Field | Type | Description | Formula |
|-------|------|-------------|---------|
| `elapsedTime` | number (ms) | Milliseconds elapsed since startTime | `Date.now() - startTime` (only if isRunning=true) |

**Example**:

```javascript
// Initial state (Reset)
{
  startTime: null,
  isRunning: false,
  laps: []
}

// After user starts timer
{
  startTime: 1729792800000,  // Unix ms when clicked Start
  isRunning: true,
  laps: []
}

// After user records 2 laps (at 1:00 and 2:30)
{
  startTime: 1729792800000,
  isRunning: true,
  laps: [
    1729792860000,  // Lap 1 at +60 seconds
    1729792950000   // Lap 2 at +150 seconds
  ]
}

// After user stops timer (timer persisted, page reloaded)
{
  startTime: 1729792800000,
  isRunning: true,  // Still marked as running from before reload
  laps: [1729792860000, 1729792950000]
}
// On page load: calculate elapsedTime = Date.now() - 1729792800000 → resume from correct time
```

---

### 2. LapRecord (Derived, In-Memory)

**Purpose**: Represents a single lap entry for display and CSV export. Derived from TimerState.

**Attributes**:

| Attribute | Type | Description | Source |
|-----------|------|-------------|--------|
| `lapNumber` | number | Ordinal position in laps list (1-indexed) | `index + 1` |
| `recordedAtTimestamp` | Unix timestamp | When lap was recorded | `laps[index]` |
| `absoluteElapsedTime` | number (ms) | Total time from session start to this lap | `laps[index] - startTime` |
| `lapDuration` | number (ms) | Time delta from previous lap (null for first) | `laps[index] - laps[index-1]` or null |

**Display Formats** (for UI rendering):

| Field | Format | Example |
|-------|--------|---------|
| `absoluteElapsedTimeDisplay` | HH:MM:SS | "00:01:30" |
| `lapDurationDisplay` | HH:MM:SS | "00:01:30" (first lap) or "00:00:45" (subsequent) |

**Derived Logic**:

```javascript
function deriveLapRecords(timerState) {
  return timerState.laps.map((lapTimestamp, index) => {
    const absoluteMs = lapTimestamp - timerState.startTime;
    const lapDurationMs = index === 0 ? absoluteMs : lapTimestamp - timerState.laps[index - 1];
    
    return {
      lapNumber: index + 1,
      recordedAtTimestamp: lapTimestamp,
      absoluteElapsedTime: absoluteMs,
      lapDuration: index === 0 ? null : lapDurationMs,
      absoluteElapsedTimeDisplay: formatTime(absoluteMs),
      lapDurationDisplay: formatTime(index === 0 ? absoluteMs : lapDurationMs)
    };
  });
}
```

**Example**:

```javascript
// timerState: {startTime: 1729792800000, isRunning: false, laps: [1729792860000, 1729792950000]}

// Derived LapRecords:
[
  {
    lapNumber: 1,
    recordedAtTimestamp: 1729792860000,
    absoluteElapsedTime: 60000,
    lapDuration: null,
    absoluteElapsedTimeDisplay: "00:01:00",
    lapDurationDisplay: "00:01:00"
  },
  {
    lapNumber: 2,
    recordedAtTimestamp: 1729792950000,
    absoluteElapsedTime: 150000,
    lapDuration: 90000,
    absoluteElapsedTimeDisplay: "00:02:30",
    lapDurationDisplay: "00:01:30"
  }
]
```

---

### 3. ExportedCSV (File Format)

**Purpose**: Represents the CSV file generated and downloaded by the user.

**Structure**:

| Header | Type | Description |
|--------|------|-------------|
| Lap Number | number | Sequential lap index (1, 2, 3, ...) |
| Absolute Elapsed Time | string (HH:MM:SS) | Total time from session start |
| Lap Duration | string (HH:MM:SS) | Time since previous lap (or session start for first lap) |

**MIME Type**: `text/csv; charset=utf-8`

**Filename Pattern**: `stopwatch_export_{unix_timestamp}.csv`  
Example: `stopwatch_export_1729792950000.csv`

**Content Format**:

```csv
Lap Number,Absolute Elapsed Time,Lap Duration
1,00:01:00,00:01:00
2,00:02:30,00:01:30
3,00:05:15,00:02:45
```

**Generation Logic**:

```javascript
function generateCSV(lapRecords) {
  const header = 'Lap Number,Absolute Elapsed Time,Lap Duration';
  const rows = lapRecords.map(lap =>
    `${lap.lapNumber},${lap.absoluteElapsedTimeDisplay},${lap.lapDurationDisplay || lap.absoluteElapsedTimeDisplay}`
  );
  return [header, ...rows].join('\n');
}
```

---

## Relationships

```
TimerState (1)
    ├── persists to → localStorage (JSON string)
    ├── derives → LapRecords (1 to many)
    └── exports to → ExportedCSV (1 to many)
```

**Cardinality**:
- One TimerState instance per session
- Multiple LapRecords per TimerState (0 to N laps)
- One CSV file per export (ephemeral; not stored)

---

## Validation Rules

### TimerState Validation

| Rule | Condition | Action |
|------|-----------|--------|
| startTime consistency | If `isRunning=true`, `startTime` must not be null | Reject invalid transition |
| startTime in past | `startTime` must be ≤ `Date.now()` | Warn if future (clock skew) |
| laps sorted | `laps` array must be in ascending order by timestamp | Enforce on recordLap() |
| laps non-duplicate | No two laps within 100ms of each other | Debounce recordLap() (FR-008) |

### LapRecord Validation

| Rule | Condition | Action |
|------|-----------|--------|
| lapNumber > 0 | Must be 1-indexed | Enforce in derivation |
| absoluteElapsedTime > 0 | Must be positive (session start to now) | Warn if violated |
| lapDuration consistent | `lapDuration` must be ≤ `absoluteElapsedTime` | Warn if violated |
| first lap duration | First lap (`index=0`): `lapDuration = null` | Enforce in derivation |

---

## Storage & Serialization

### localStorage Format

**Key**: `stopwatchState`  
**Value**: JSON string  
**Size**: ~100-200 bytes per session (1000 laps = ~4KB max)

```json
{
  "startTime": 1729792800000,
  "isRunning": true,
  "laps": [
    1729792860000,
    1729792950000
  ]
}
```

**Serialization** (from object):

```javascript
JSON.stringify({startTime, isRunning, laps})
```

**Deserialization** (to object):

```javascript
JSON.parse(localStorage.getItem('stopwatchState')) || {startTime: null, isRunning: false, laps: []}
```

**Clearing**:

```javascript
localStorage.removeItem('stopwatchState')  // On Reset
```

---

## Time Formatting Utilities

### Format Function: `formatTime(milliseconds) → string`

**Purpose**: Convert milliseconds to HH:MM:SS display format  
**Input**: Number (milliseconds)  
**Output**: String in format "HH:MM:SS"

**Algorithm**:

```javascript
function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return [hours, minutes, seconds]
    .map(n => String(n).padStart(2, '0'))
    .join(':');
}
```

**Test Cases**:
- `formatTime(0)` → `"00:00:00"`
- `formatTime(1000)` → `"00:00:01"`
- `formatTime(60000)` → `"00:01:00"`
- `formatTime(3661000)` → `"01:01:01"`
- `formatTime(359999000)` → `"99:59:59"`

---

## Summary

| Entity | Purpose | Persistence | Lifecycle |
|--------|---------|-------------|-----------|
| **TimerState** | Session management | localStorage (JSON) | Persists across page reloads; cleared on Reset |
| **LapRecord** | UI display + export | In-memory (derived) | Calculated on-demand from TimerState; not stored |
| **ExportedCSV** | File download | Ephemeral (Blob) | Generated on export; discarded after download |

---

*Next: Phase 1 continues with API Contracts (contracts/stopwatch-ui.contract.js)*
