import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { run } from '../src/temp-converter/index.js';

describe('Temp-converter CLI Unit Tests', () => {
  let consoleSpy, consoleErrorSpy;

  beforeEach(() => {
    // Mock console
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('successful conversions', () => {
    it('converts Celsius to Fahrenheit', () => {
      run(['100', '--from', 'C', '--to', 'F']);
      
      expect(consoleSpy).toHaveBeenCalledWith('100°C is 212.00°F');
      expect(process.exitCode).toBe(0);
    });

    it('converts Fahrenheit to Celsius', () => {
      run(['32', '--from', 'F', '--to', 'C']);
      
      expect(consoleSpy).toHaveBeenCalledWith('32°F is 0.00°C');
      expect(process.exitCode).toBe(0);
    });

    it('handles decimal temperatures', () => {
      run(['36.5', '--from', 'C', '--to', 'F']);
      
      expect(consoleSpy).toHaveBeenCalledWith('36.5°C is 97.70°F');
      expect(process.exitCode).toBe(0);
    });

    it('handles negative temperatures', () => {
      run(['-40', '--from', 'C', '--to', 'F']);
      
      expect(consoleSpy).toHaveBeenCalledWith('-40°C is -40.00°F');
      expect(process.exitCode).toBe(0);
    });

    it('handles lowercase unit flags', () => {
      run(['0', '--from', 'c', '--to', 'f']);
      
      expect(consoleSpy).toHaveBeenCalledWith('0°C is 32.00°F');
      expect(process.exitCode).toBe(0);
    });
  });

  describe('error cases', () => {
    it('shows usage when no arguments provided', () => {
      run([]);
      
      expect(consoleSpy).toHaveBeenCalledWith('--- Temperature Converter ---');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Usage: node src/temp-converter/index.js <temperature> --from <C|F> --to <C|F>');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Example: node src/temp-converter/index.js 100 --from C --to F');
      expect(process.exitCode).toBe(1);
    });

    it('shows usage when temperature is missing', () => {
      run(['--from', 'C', '--to', 'F']);
      
      expect(consoleSpy).toHaveBeenCalledWith('--- Temperature Converter ---');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Usage: node src/temp-converter/index.js <temperature> --from <C|F> --to <C|F>');
      expect(process.exitCode).toBe(1);
    });

    it('shows usage when --from is missing', () => {
      run(['100', '--to', 'F']);
      
      expect(consoleSpy).toHaveBeenCalledWith('--- Temperature Converter ---');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Usage: node src/temp-converter/index.js <temperature> --from <C|F> --to <C|F>');
      expect(process.exitCode).toBe(1);
    });

    it('shows usage when --to is missing', () => {
      run(['100', '--from', 'C']);
      
      expect(consoleSpy).toHaveBeenCalledWith('--- Temperature Converter ---');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Usage: node src/temp-converter/index.js <temperature> --from <C|F> --to <C|F>');
      expect(process.exitCode).toBe(1);
    });

    it('shows usage when temperature is not a number', () => {
      run(['abc', '--from', 'C', '--to', 'F']);
      
      expect(consoleSpy).toHaveBeenCalledWith('--- Temperature Converter ---');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Usage: node src/temp-converter/index.js <temperature> --from <C|F> --to <C|F>');
      expect(process.exitCode).toBe(1);
    });

    it('shows usage when temperature is empty string', () => {
      run(['', '--from', 'C', '--to', 'F']);
      
      expect(consoleSpy).toHaveBeenCalledWith('--- Temperature Converter ---');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Usage: node src/temp-converter/index.js <temperature> --from <C|F> --to <C|F>');
      expect(process.exitCode).toBe(1);
    });

    it('shows usage when temperature is NaN', () => {
      run(['NaN', '--from', 'C', '--to', 'F']);
      
      expect(consoleSpy).toHaveBeenCalledWith('--- Temperature Converter ---');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Usage: node src/temp-converter/index.js <temperature> --from <C|F> --to <C|F>');
      expect(process.exitCode).toBe(1);
    });

    it('shows usage when temperature is Infinity', () => {
      run(['Infinity', '--from', 'C', '--to', 'F']);
      
      expect(consoleSpy).toHaveBeenCalledWith('--- Temperature Converter ---');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Usage: node src/temp-converter/index.js <temperature> --from <C|F> --to <C|F>');
      expect(process.exitCode).toBe(1);
    });

    it('handles identical units error', () => {
      run(['100', '--from', 'C', '--to', 'C']);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Invalid units provided for conversion.');
      expect(process.exitCode).toBe(1);
    });

    it('handles invalid units error', () => {
      run(['100', '--from', 'K', '--to', 'F']);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Invalid units provided for conversion.');
      expect(process.exitCode).toBe(1);
    });
  });

  describe('edge cases', () => {
    it('handles zero temperature', () => {
      run(['0', '--from', 'C', '--to', 'F']);
      
      expect(consoleSpy).toHaveBeenCalledWith('0°C is 32.00°F');
      expect(process.exitCode).toBe(0);
    });

    it('handles very small decimal numbers', () => {
      run(['0.01', '--from', 'C', '--to', 'F']);
      
      expect(consoleSpy).toHaveBeenCalledWith('0.01°C is 32.02°F');
      expect(process.exitCode).toBe(0);
    });

    it('handles whitespace in temperature', () => {
      run(['  100  ', '--from', 'C', '--to', 'F']);
      
      expect(consoleSpy).toHaveBeenCalledWith('100°C is 212.00°F');
      expect(process.exitCode).toBe(0);
    });

    it('handles whitespace in unit flags', () => {
      run(['100', '--from', '  C  ', '--to', '  F  ']);
      
      expect(consoleSpy).toHaveBeenCalledWith('100°C is 212.00°F');
      expect(process.exitCode).toBe(0);
    });
  });
});
