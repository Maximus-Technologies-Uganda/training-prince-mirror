# Data Model: Stopwatch UI

**Feature**: Stopwatch UI Implementation  
**Date**: 2025-01-27  
**Phase**: 1 - Design & Contracts

## Entities

### Timer
**Purpose**: Represents the stopwatch state and timing data

**Fields**:
- `running: boolean` - Whether timer is currently counting
- `startTime: number` - Timestamp when timer was started (milliseconds)
- `elapsedTime: number` - Total elapsed time since start (milliseconds)
- `laps: LapData[]` - Array of recorded lap times

**State Transitions**:
- `STOPPED` → `RUNNING`: User clicks start button
- `RUNNING` → `STOPPED`: User clicks stop button (creates lap)
- `STOPPED` → `STOPPED`: User clicks reset button (clears laps)

**Validation Rules**:
- `startTime` must be valid timestamp when `running` is true
- `elapsedTime` must be non-negative
- `laps` array must contain valid LapData objects

### LapData
**Purpose**: Represents a single recorded lap time

**Fields**:
- `lapNumber: number` - Sequential lap number (1-based)
- `elapsedTime: number` - Elapsed time when lap was recorded (milliseconds)
- `timestamp: number` - When lap was recorded (milliseconds)

**Validation Rules**:
- `lapNumber` must be positive integer
- `elapsedTime` must be non-negative
- `timestamp` must be valid timestamp

### CSVExport
**Purpose**: Represents the downloadable CSV file structure

**Fields**:
- `filename: string` - Fixed filename "stopwatch-laps.csv"
- `headers: string[]` - Column headers ["Lap Number", "Elapsed Time"]
- `rows: string[][]` - Data rows with lap number and formatted time
- `content: string` - Complete CSV content with normalized EOL

**Validation Rules**:
- `filename` must be "stopwatch-laps.csv"
- `headers` must match specification
- `content` must have normalized line endings
- `rows` must contain valid lap data

## Data Flow

### Timer Operations
1. **Start**: Set `running = true`, `startTime = Date.now()`
2. **Stop**: Set `running = false`, create new LapData, add to `laps` array
3. **Reset**: Set `running = false`, clear `laps` array, reset `elapsedTime = 0`

### Lap Recording
1. User clicks stop → Timer stops
2. Calculate elapsed time from `startTime` to current time
3. Create LapData with next lap number and elapsed time
4. Add to `laps` array

### CSV Export
1. Generate headers: "Lap Number", "Elapsed Time"
2. For each lap: format lap number and elapsed time (MM:SS.hh)
3. Combine headers and rows into CSV content
4. Apply normalized EOL formatting
5. Create Blob and trigger download

## State Persistence
- Timer state stored in browser localStorage
- Key: `stopwatch-ui-state`
- Persists: `laps` array, current `elapsedTime`
- Does not persist: `running` state (always starts stopped)

---
*Data model complete - Ready for contract generation*
