// Unit Tests: CSV Export
// Tests the StopwatchUI CSV export functionality

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { StopwatchUI } from '../frontend/src/ui-stopwatch/stopwatch-ui.js';

// Mock the backend modules
const mockCSVExporter = vi.fn();

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
  exportLapsAsTable: mockCSVExporter
}));

describe('StopwatchUI CSV Export Unit Tests', () => {
  let stopwatchUI;
  let mockContainer;
  let mockElements;
  let mockCSVExporter;

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

  describe('CSV Content Generation', () => {
    it('should generate CSV with laps using backend exporter', () => {
      const mockLaps = [
        { lapNumber: 1, elapsedTime: 1000, timestamp: 1000000 },
        { lapNumber: 2, elapsedTime: 2500, timestamp: 1001000 }
      ];
      
      const mockTableContent = 'Lap\tTime\n1\t00:01.000\n2\t00:02.500\n';
      const expectedCSVContent = 'Lap,Time\n1,00:01.000\n2,00:02.500\n';
      mockCSVExporter.mockReturnValue(mockTableContent);
      
      stopwatchUI.state.laps = mockLaps;
      
      const result = stopwatchUI.generateCSVContent();
      
      expect(mockCSVExporter).toHaveBeenCalledWith([
        { time: 1000 },
        { time: 2500 }
      ]);
      expect(result).toBe(expectedCSVContent);
    });

    it('should handle empty laps', () => {
      const mockTableContent = 'Lap\tTime\n';
      const expectedCSVContent = 'Lap,Time\n';
      mockCSVExporter.mockReturnValue(mockTableContent);
      
      stopwatchUI.state.laps = [];
      
      const result = stopwatchUI.generateCSVContent();
      
      expect(mockCSVExporter).toHaveBeenCalledWith([]);
      expect(result).toBe(expectedCSVContent);
    });

    it('should handle single lap', () => {
      const mockLaps = [
        { lapNumber: 1, elapsedTime: 5000, timestamp: 1000000 }
      ];
      
      const mockCSVContent = 'Lap Number,Elapsed Time\n1,00:05.00\n';
      mockCSVExporter.exportLaps.mockReturnValue(mockCSVContent);
      
      stopwatchUI.state.laps = mockLaps;
      
      const result = stopwatchUI.generateCSVContent();
      
      expect(mockCSVExporter.exportLaps).toHaveBeenCalledWith(mockLaps);
      expect(result).toBe(mockCSVContent);
    });
  });

  describe('CSV Download', () => {
    it('should trigger download with correct filename', () => {
      const mockCSVContent = 'Lap Number,Elapsed Time\n1,00:01.00\n';
      mockCSVExporter.exportLaps.mockReturnValue(mockCSVContent);
      
      stopwatchUI.state.laps = [
        { lapNumber: 1, elapsedTime: 1000, timestamp: 1000000 }
      ];
      
      stopwatchUI.exportCSV();
      
      // Verify Blob creation
      expect(global.Blob).toHaveBeenCalledWith([mockCSVContent], { type: 'text/csv' });
      
      // Verify anchor creation and configuration
      expect(global.document.createElement).toHaveBeenCalledWith('a');
      const anchor = global.document.createElement.mock.results[0].value;
      expect(anchor.download).toBe('stopwatch-laps.csv');
      expect(anchor.click).toHaveBeenCalled();
      
      // Verify cleanup
      expect(global.document.body.appendChild).toHaveBeenCalledWith(anchor);
      expect(global.document.body.removeChild).toHaveBeenCalledWith(anchor);
      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });

    it('should dispatch csv:exported event', () => {
      const mockCSVContent = 'Lap Number,Elapsed Time\n';
      mockCSVExporter.exportLaps.mockReturnValue(mockCSVContent);
      
      stopwatchUI.exportCSV();
      
      expect(mockContainer.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'csv:exported' })
      );
    });

    it('should handle download errors gracefully', () => {
      // Mock Blob constructor to throw error
      global.Blob.mockImplementation(() => {
        throw new Error('Blob creation failed');
      });
      
      // Mock alert
      global.alert = vi.fn();
      
      stopwatchUI.exportCSV();
      
      expect(global.alert).toHaveBeenCalledWith('Failed to export CSV file. Please try again.');
    });

    it('should handle URL creation errors', () => {
      global.URL.createObjectURL.mockImplementation(() => {
        throw new Error('URL creation failed');
      });
      
      global.alert = vi.fn();
      
      stopwatchUI.exportCSV();
      
      expect(global.alert).toHaveBeenCalledWith('Failed to export CSV file. Please try again.');
    });
  });

  describe('CSV Export with Different Lap Scenarios', () => {
    it('should export CSV with multiple laps', () => {
      const mockLaps = [
        { lapNumber: 1, elapsedTime: 1000, timestamp: 1000000 },
        { lapNumber: 2, elapsedTime: 2500, timestamp: 1001000 },
        { lapNumber: 3, elapsedTime: 4000, timestamp: 1002000 }
      ];
      
      const mockCSVContent = 'Lap Number,Elapsed Time\n1,00:01.00\n2,00:02.50\n3,00:04.00\n';
      mockCSVExporter.exportLaps.mockReturnValue(mockCSVContent);
      
      stopwatchUI.state.laps = mockLaps;
      
      const result = stopwatchUI.generateCSVContent();
      
      expect(mockCSVExporter.exportLaps).toHaveBeenCalledWith(mockLaps);
      expect(result).toBe(mockCSVContent);
    });

    it('should export CSV after reset (empty laps)', () => {
      // First record some laps
      stopwatchUI.state.laps = [
        { lapNumber: 1, elapsedTime: 1000, timestamp: 1000000 }
      ];
      
      // Then reset
      stopwatchUI.reset();
      
      const mockCSVContent = 'Lap Number,Elapsed Time\n';
      mockCSVExporter.exportLaps.mockReturnValue(mockCSVContent);
      
      const result = stopwatchUI.generateCSVContent();
      
      expect(mockCSVExporter.exportLaps).toHaveBeenCalledWith([]);
      expect(result).toBe(mockCSVContent);
    });
  });

  describe('Backend Integration', () => {
    it('should use backend CSVExporter for all exports', () => {
      const mockLaps = [
        { lapNumber: 1, elapsedTime: 1000, timestamp: 1000000 }
      ];
      
      stopwatchUI.state.laps = mockLaps;
      
      // Call both methods that use CSVExporter
      stopwatchUI.generateCSVContent();
      stopwatchUI.exportCSV();
      
      // Should be called twice (once for each method)
      expect(mockCSVExporter.exportLaps).toHaveBeenCalledTimes(2);
      expect(mockCSVExporter.exportLaps).toHaveBeenCalledWith(mockLaps);
    });

    it('should handle backend exporter errors', () => {
      mockCSVExporter.exportLaps.mockImplementation(() => {
        throw new Error('Backend export failed');
      });
      
      global.alert = vi.fn();
      
      stopwatchUI.exportCSV();
      
      expect(global.alert).toHaveBeenCalledWith('Failed to export CSV file. Please try again.');
    });
  });
});
