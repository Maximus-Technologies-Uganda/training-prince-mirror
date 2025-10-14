# Stopwatch UI API Contracts

**Feature**: Stopwatch UI Implementation  
**Date**: 2025-01-27  
**Phase**: 1 - Design & Contracts

## UI Component Contracts

### StopwatchUI Class
**Purpose**: Main UI controller for stopwatch functionality

**Constructor**:
```javascript
constructor(containerElement: HTMLElement)
```

**Methods**:
```javascript
// Timer control methods
start(): void
stop(): void  
reset(): void

// Display methods
updateDisplay(): void
formatTime(milliseconds: number): string

// Export methods
exportCSV(): void
generateCSVContent(): string

// State methods
loadState(): void
saveState(): void
```

**Events**:
- `timer:start` - Fired when timer starts
- `timer:stop` - Fired when timer stops  
- `timer:reset` - Fired when timer resets
- `lap:recorded` - Fired when lap is recorded
- `csv:exported` - Fired when CSV is downloaded

### Timer State Contract
**Purpose**: Defines the timer state structure

```javascript
interface TimerState {
  running: boolean;
  startTime: number;
  elapsedTime: number;
  laps: LapData[];
}
```

### LapData Contract
**Purpose**: Defines lap data structure

```javascript
interface LapData {
  lapNumber: number;
  elapsedTime: number;
  timestamp: number;
}
```

### CSV Export Contract
**Purpose**: Defines CSV export structure

```javascript
interface CSVExport {
  filename: string;        // "stopwatch-laps.csv"
  headers: string[];       // ["Lap Number", "Elapsed Time"]
  rows: string[][];       // [["1", "01:23.45"], ["2", "02:46.90"]]
  content: string;         // Complete CSV with normalized EOL
}
```

## Backend Integration Contracts

### Stopwatch Core Module
**Purpose**: Import contract for backend timer logic

```javascript
// From src/stopwatch/core.js
export class Stopwatch {
  constructor();
  start(): void;
  stop(): void;
  reset(): void;
  getElapsedTime(): number;
  isRunning(): boolean;
}
```

### CSV Exporter Module  
**Purpose**: Import contract for backend CSV export logic

```javascript
// From src/stopwatch/exporter.js
export class CSVExporter {
  static exportLaps(laps: LapData[]): string;
  static normalizeEOL(content: string): string;
}
```

## UI Element Contracts

### HTML Structure
```html
<div class="stopwatch-container">
  <div class="timer-display">00:00.00</div>
  <div class="controls">
    <button class="start-btn">Start</button>
    <button class="stop-btn" disabled>Stop</button>
    <button class="reset-btn">Reset</button>
    <button class="export-btn">Export CSV</button>
  </div>
  <div class="laps-display">
    <!-- Dynamic lap list -->
  </div>
</div>
```

### CSS Classes
- `.stopwatch-container` - Main container
- `.timer-display` - Time display element
- `.controls` - Button container
- `.start-btn`, `.stop-btn`, `.reset-btn`, `.export-btn` - Control buttons
- `.laps-display` - Lap list container
- `.lap-item` - Individual lap display
- `.disabled` - Disabled button state

## Validation Contracts

### Input Validation
- Timer state must be valid object with required fields
- Lap data must have positive lap numbers and non-negative elapsed times
- CSV content must have normalized line endings

### Error Handling
- Invalid timer state → Reset to default state
- Export errors → Show user-friendly error message
- Storage errors → Continue without persistence

---
*Contracts complete - Ready for test generation*
