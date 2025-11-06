# Research: Stopwatch UI Implementation

**Feature**: Stopwatch UI Implementation  
**Date**: 2025-01-27  
**Phase**: 0 - Outline & Research

## Research Tasks Completed

### 1. Existing Backend Module Analysis
**Task**: Analyze existing `src/stopwatch/` module structure and capabilities

**Decision**: Reuse existing core.js and exporter.js modules  
**Rationale**: 
- `core.js` contains timer logic with start/stop/reset functionality
- `exporter.js` contains CSV export logic with normalized EOL handling
- Constitution mandates no logic duplication
- Existing modules already handle MM:SS.hh format and lap recording

**Alternatives considered**: 
- Rewriting timer logic in frontend (rejected - violates constitution)
- Creating new export logic (rejected - existing exporter handles EOL normalization)

### 2. Frontend Integration Patterns
**Task**: Research how to integrate backend modules with Vite frontend

**Decision**: Use ES6 module imports from `src/stopwatch/`  
**Rationale**:
- Vite supports ES6 modules natively
- Existing backend modules are already ES6 compatible
- Simple import path: `import { Stopwatch } from '../../src/stopwatch/index.js'`
- No build configuration changes needed

**Alternatives considered**:
- Webpack bundling (rejected - Vite is project standard)
- CDN imports (rejected - violates local development workflow)

### 3. UI State Management
**Task**: Research state management for timer UI without external libraries

**Decision**: Use simple JavaScript state object with reactive updates  
**Rationale**:
- Single user, local scope - no complex state needed
- Vanilla JavaScript approach aligns with constitution
- Simple state: `{ running: boolean, startTime: number, laps: array }`
- Direct DOM updates for UI reactivity

**Alternatives considered**:
- React/Vue state management (rejected - violates simplicity principle)
- Redux/state libraries (rejected - overkill for single component)

### 4. CSV Download Implementation
**Task**: Research browser CSV download patterns

**Decision**: Use Blob API with programmatic download trigger  
**Rationale**:
- Native browser API, no external dependencies
- Works with normalized EOL from backend exporter
- Supports custom filename (stopwatch-laps.csv)
- Compatible with all modern browsers

**Alternatives considered**:
- FileSaver.js library (rejected - unnecessary dependency)
- Server-side download (rejected - violates offline capability)

### 5. Timer Display Formatting
**Task**: Research MM:SS.hh formatting implementation

**Decision**: Use existing backend formatting with frontend display wrapper  
**Rationale**:
- Backend core.js already handles MM:SS.hh format
- Frontend only needs to format milliseconds to display string
- Consistent with backend timer logic
- Simple formatting function: `formatTime(milliseconds)`

**Alternatives considered**:
- Moment.js/date libraries (rejected - overkill for simple formatting)
- Custom formatting in frontend (rejected - duplicates backend logic)

## Technical Decisions Summary

| Component | Decision | Rationale |
|-----------|----------|-----------|
| Timer Logic | Import from `src/stopwatch/core.js` | Reuse existing, tested logic |
| CSV Export | Import from `src/stopwatch/exporter.js` | Reuse EOL normalization |
| State Management | Vanilla JS state object | Simple, no dependencies |
| CSV Download | Blob API + programmatic download | Native browser capability |
| Time Formatting | Backend formatting + frontend display | Consistent with core logic |

## Dependencies Confirmed
- ✅ Vite build system (existing)
- ✅ ES6 modules (existing)
- ✅ Backend stopwatch modules (existing)
- ✅ Vitest testing (existing)
- ✅ Playwright E2E (existing)

## No Additional Dependencies Required
All required functionality can be implemented using existing project infrastructure and backend modules.

---
*Research complete - Ready for Phase 1 Design*
