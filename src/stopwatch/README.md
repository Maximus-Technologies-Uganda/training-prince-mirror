# Stopwatch CLI

A simple command-line stopwatch that persists state between commands, allowing you to start, lap, and reset timing sessions.

## Usage

### Start the Stopwatch
```bash
node src/stopwatch/index.js start
```

### Record a Lap
```bash
node src/stopwatch/index.js lap
```

### Reset the Stopwatch
```bash
node src/stopwatch/index.js reset
```

## Examples

```bash
# Start a new timing session
$ node src/stopwatch/index.js start
Stopwatch started.

# Record laps
$ node src/stopwatch/index.js lap
Lap 1: 00:01.250

$ node src/stopwatch/index.js lap
Lap 2: 00:00.750

$ node src/stopwatch/index.js lap
Lap 3: 00:02.100

# Reset for a new session
$ node src/stopwatch/index.js reset
Stopwatch reset.

# Start again
$ node src/stopwatch/index.js start
Stopwatch started.

$ node src/stopwatch/index.js lap
Lap 1: 00:00.500
```

## Features

- **Persistent State**: State is saved to `.stopwatch-state.json` so you can run commands separately
- **Lap Timing**: Each lap measures time since the last lap (or start)
- **Reset Functionality**: Clear all timing data and start fresh
- **Error Handling**: Clear error messages for invalid operations

## Error Cases

```bash
# Try to lap without starting
$ node src/stopwatch/index.js lap
Error: Stopwatch has not been started.

# Try to lap after reset
$ node src/stopwatch/index.js start
Stopwatch started.

$ node src/stopwatch/index.js reset
Stopwatch reset.

$ node src/stopwatch/index.js lap
Error: Stopwatch has not been started.

# Unknown command
$ node src/stopwatch/index.js unknown
--- Stopwatch CLI ---
Usage:
  node src/stopwatch/index.js start
  node src/stopwatch/index.js lap
Notes: This is a simple in-memory stopwatch by core design, but the CLI persists state to a file so commands can be run separately.
```

## Data Storage

Stopwatch state is stored in `.stopwatch-state.json` and persists between CLI invocations. The file contains:
- `startTime`: Timestamp when stopwatch was started
- `laps`: Array of lap times in milliseconds

## Time Format

Times are displayed in `mm:ss.mmm` format:
- `mm`: Minutes (zero-padded)
- `ss`: Seconds (zero-padded) 
- `mmm`: Milliseconds (zero-padded to 3 digits)
