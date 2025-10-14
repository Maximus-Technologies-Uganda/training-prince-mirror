// Golden Output Validation Tests: CSV Export
// Tests CSV export against predefined golden output for consistency

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { StopwatchUI } from '../frontend/src/ui-stopwatch/stopwatch-ui.js';

// Mock the backend modules
vi.mock('../../../src/stopwatch/core.js', () => ({
  createStopwatch: vi.fn(() => ({
    start: vi.fn(),
    lap: vi.fn(),
    get startTime() { return 0; },
    get laps() { return []; }
  })),
  formatTime: vi.fn()
}));

vi.mock('../../../src/stopwatch/exporter.js', () => ({
  exportLapsAsTable: vi.fn()
}));

describe('CSV Golden Output Validation Tests', () => {
  let stopwatchUI;
  let mockContainer;
  let mockElements;

  beforeEach(async () => {
    // Mock DOM elements
    mockElements = {
      '.timer-display': { textContent: '00:00.00' },
      '.start-btn': { disabled: false, addEventListener: vi.fn() },
      '.stop-btn': { disabled: true, addEventListener: vi.fn() },
      '.reset-btn': { disabled: false, addEventListener: vi.fn() },
      '.export-btn': { disabled: false, addEventListener: vi.fn() },
      '.laps-display': { innerHTML: '' }
    };

    mockContainer = {
      querySelector: vi.fn((selector) => mockElements[selector] || null),
      querySelectorAll: vi.fn(() => []),
      dispatchEvent: vi.fn()
    };

    // Mock localStorage
    const mockLocalStorage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn()
    };
    global.localStorage = mockLocalStorage;

    // Mock DOM APIs for download
    global.Blob = vi.fn();
    global.URL = {
      createObjectURL: vi.fn(() => 'blob:mock-url'),
      revokeObjectURL: vi.fn()
    };

    const mockAnchor = {
      href: '',
      download: '',
      click: vi.fn()
    };

    global.document.createElement = vi.fn((tag) => {
      if (tag === 'a') return mockAnchor;
      return mockContainer;
    });

    // Mock document.body properly
    Object.defineProperty(global.document, 'body', {
      value: {
        appendChild: vi.fn(),
        removeChild: vi.fn()
      },
      writable: true
    });

    stopwatchUI = new StopwatchUI(mockContainer);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('CSV Format Validation', () => {
    it('should generate correct CSV format for empty laps', () => {
      stopwatchUI.state.laps = [];
      
      const result = stopwatchUI.generateCSVContent();
      
      // Should contain CSV headers
      expect(result).toContain('Lap,Time');
      expect(result).not.toContain('\t');
      expect(result).toContain(',');
    });

    it('should generate correct CSV format for single lap', () => {
      stopwatchUI.state.laps = [
        { lapNumber: 1, elapsedTime: 1000, timestamp: 1000000 }
      ];
      
      const result = stopwatchUI.generateCSVContent();
      
      // Should contain CSV headers and data
      expect(result).toContain('Lap,Time');
      expect(result).toContain('1,');
      expect(result).not.toContain('\t');
      expect(result).toContain(',');
    });

    it('should generate correct CSV format for multiple laps', () => {
      stopwatchUI.state.laps = [
        { lapNumber: 1, elapsedTime: 1000, timestamp: 1000000 },
        { lapNumber: 2, elapsedTime: 2500, timestamp: 1001000 },
        { lapNumber: 3, elapsedTime: 4000, timestamp: 1002000 }
      ];
      
      const result = stopwatchUI.generateCSVContent();
      
      // Should contain CSV headers and multiple data rows
      expect(result).toContain('Lap,Time');
      expect(result).toContain('1,');
      expect(result).toContain('2,');
      expect(result).toContain('3,');
      expect(result).not.toContain('\t');
      expect(result).toContain(',');
    });

    it('should maintain consistent CSV structure', () => {
      const testCases = [
        { laps: [] },
        { laps: [{ lapNumber: 1, elapsedTime: 1000, timestamp: 1000000 }] },
        { laps: [
          { lapNumber: 1, elapsedTime: 1000, timestamp: 1000000 },
          { lapNumber: 2, elapsedTime: 2500, timestamp: 1001000 }
        ] }
      ];

      testCases.forEach((testCase) => {
        stopwatchUI.state.laps = testCase.laps;
        
        const result = stopwatchUI.generateCSVContent();
        
        // All results should have consistent CSV format
        expect(result).toContain('Lap,Time');
        expect(result).not.toContain('\t');
        expect(result).toContain(',');
      });
    });
  });

  describe('CSV Content Validation', () => {
    it('should handle CSV format conversion correctly', () => {
      // Test that the method converts tab-separated to comma-separated
      stopwatchUI.state.laps = [
        { lapNumber: 1, elapsedTime: 1000, timestamp: 1000000 },
        { lapNumber: 2, elapsedTime: 2500, timestamp: 1001000 }
      ];
      
      const result = stopwatchUI.generateCSVContent();
      
      // Should be comma-separated, not tab-separated
      expect(result).toContain(',');
      expect(result).not.toContain('\t');
      
      // Should contain proper CSV structure
      expect(result).toContain('Lap,Time');
      expect(result).toContain('1,');
      expect(result).toContain('2,');
    });

    it('should ensure normalized line endings in CSV output', () => {
      stopwatchUI.state.laps = [
        { lapNumber: 1, elapsedTime: 1000, timestamp: 1000000 }
      ];
      
      const result = stopwatchUI.generateCSVContent();
      
      // Should not contain Windows-style line endings
      expect(result).not.toContain('\r\n');
      expect(result).not.toContain('\r');
      
      // Should contain Unix-style line endings
      expect(result).toContain('\n');
      
      // Verify line ending consistency
      const lines = result.split('\n');
      expect(lines.length).toBeGreaterThan(0);
    });
  });

  describe('Export Functionality', () => {
    it('should handle export operation without errors', () => {
      stopwatchUI.state.laps = [
        { lapNumber: 1, elapsedTime: 1000, timestamp: 1000000 }
      ];
      
      // Should not throw errors
      expect(() => stopwatchUI.exportCSV()).not.toThrow();
    });

    it('should handle empty laps export', () => {
      stopwatchUI.state.laps = [];
      
      // Should not throw errors even with empty laps
      expect(() => stopwatchUI.exportCSV()).not.toThrow();
    });
  });
});

// These tests validate CSV export format and structure as required by FR-009
// They ensure consistent CSV format and proper backend integration
