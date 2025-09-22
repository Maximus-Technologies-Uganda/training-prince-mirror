import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { run } from '../src/expense/index.js';
import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = 'data';
const EXPENSE_FILE = path.join(DATA_DIR, 'expenses.json');

describe('Expense CLI Unit Tests', () => {
  let consoleSpy, consoleErrorSpy;

  beforeEach(() => {
    // Ensure data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    // Start with empty expenses
    fs.writeFileSync(EXPENSE_FILE, '[]');
    
    // Mock console
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Clean up
    if (fs.existsSync(EXPENSE_FILE)) {
      fs.unlinkSync(EXPENSE_FILE);
    }
    vi.restoreAllMocks();
  });

  describe('add command', () => {
    it('adds an expense successfully', () => {
      run(['add', '--amount', '100', '--category', 'food']);
      
      const expenses = JSON.parse(fs.readFileSync(EXPENSE_FILE, 'utf8'));
      expect(expenses).toHaveLength(1);
      expect(expenses[0]).toMatchObject({
        amount: 100,
        category: 'food'
      });
    });

    it('adds expense with month', () => {
      run(['add', '--amount', '50', '--category', 'transport', '--month', '3']);
      
      const expenses = JSON.parse(fs.readFileSync(EXPENSE_FILE, 'utf8'));
      expect(expenses[0]).toMatchObject({
        amount: 50,
        category: 'transport',
        month: 3
      });
    });

    it('errors when --amount is missing', () => {
      run(['add', '--category', 'food']);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: --amount and --category are required for the add command.');
      expect(process.exitCode).toBe(1);
    });

    it('errors when --category is missing', () => {
      run(['add', '--amount', '100']);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: --amount and --category are required for the add command.');
      expect(process.exitCode).toBe(1);
    });

    it('errors when --amount is non-numeric', () => {
      run(['add', '--amount', 'abc', '--category', 'food']);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: --amount must be a number.');
      expect(process.exitCode).toBe(1);
    });

    it('errors when --month is out of range', () => {
      run(['add', '--amount', '100', '--category', 'food', '--month', '13']);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: --month must be an integer between 1 and 12.');
      expect(process.exitCode).toBe(1);
    });
  });

  describe('list command', () => {
    it('lists empty expenses', () => {
      run(['list']);
      
      expect(consoleSpy).toHaveBeenCalledWith('All Expenses:');
    });

    it('lists existing expenses', () => {
      // Add an expense first
      fs.writeFileSync(EXPENSE_FILE, JSON.stringify([
        { amount: 100, category: 'food', month: 1 }
      ]));
      
      run(['list']);
      
      expect(consoleSpy).toHaveBeenCalledWith('All Expenses:');
    });
  });

  describe('total command', () => {
    beforeEach(() => {
      // Add some test expenses
      fs.writeFileSync(EXPENSE_FILE, JSON.stringify([
        { amount: 100, category: 'food', month: 1 },
        { amount: 50, category: 'transport', month: 1 },
        { amount: 75, category: 'food', month: 2 }
      ]));
    });

    it('calculates total without filters', () => {
      run(['total']);
      
      expect(consoleSpy).toHaveBeenCalledWith('Total Expenses: 225');
    });

    it('calculates total with category filter', () => {
      run(['total', '--category', 'food']);
      
      expect(consoleSpy).toHaveBeenCalledWith("Total Expenses for category 'food': 175");
    });

    it('calculates total with month filter', () => {
      run(['total', '--month', '1']);
      
      expect(consoleSpy).toHaveBeenCalledWith("Total Expenses for month '01': 150");
    });

    it('calculates total with both filters', () => {
      run(['total', '--category', 'food', '--month', '1']);
      
      expect(consoleSpy).toHaveBeenCalledWith("Total Expenses for category 'food' & month '01': 100");
    });

    it('errors when --month is out of range', () => {
      run(['total', '--month', '13']);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: --month must be an integer between 1 and 12.');
      expect(process.exitCode).toBe(1);
    });
  });

  describe('help and error cases', () => {
    it('shows help when no command provided', () => {
      run([]);
      
      expect(consoleSpy).toHaveBeenCalledWith('Usage: node src/expense/index.js <command> [options]');
      expect(consoleSpy).toHaveBeenCalledWith('Commands:');
    });

    it('shows error for unknown command', () => {
      run(['unknown']);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Command not recognized.');
      expect(process.exitCode).toBe(1);
    });
  });
});
