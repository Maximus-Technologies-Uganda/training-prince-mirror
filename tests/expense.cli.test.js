import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = 'data';
const EXPENSE_FILE = path.join(DATA_DIR, 'expenses.json');

describe('Expense CLI', () => {
  beforeEach(() => {
    // Clean up ALL data files first
    if (fs.existsSync('data/todo.json')) {
      fs.unlinkSync('data/todo.json');
    }
    if (fs.existsSync('data/.stopwatch-state.json')) {
      fs.unlinkSync('data/.stopwatch-state.json');
    }
    if (fs.existsSync(EXPENSE_FILE)) {
      fs.unlinkSync(EXPENSE_FILE);
    }
    
    // Ensure data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    // Start with empty expenses
    fs.writeFileSync(EXPENSE_FILE, '[]');
  });

  afterEach(() => {
    // Clean up only the expense file, not other data files
    if (fs.existsSync(EXPENSE_FILE)) {
      fs.unlinkSync(EXPENSE_FILE);
    }
  });

  describe('add command', () => {
    it('adds an expense successfully', () => {
      const result = spawnSync('node', [
        'src/expense/index.js', 
        'add', 
        '--amount', '100', 
        '--category', 'food'
      ], { encoding: 'utf8' });
      
      expect(result.status).toBe(0);
      
      // Verify expense was added
      const expenses = JSON.parse(fs.readFileSync(EXPENSE_FILE, 'utf8'));
      expect(expenses).toHaveLength(1);
      expect(expenses[0]).toMatchObject({
        amount: 100,
        category: 'food'
      });
    });

    it('adds expense with month', () => {
      const result = spawnSync('node', [
        'src/expense/index.js', 
        'add', 
        '--amount', '50', 
        '--category', 'transport',
        '--month', '3'
      ], { encoding: 'utf8' });
      
      expect(result.status).toBe(0);
      
      const expenses = JSON.parse(fs.readFileSync(EXPENSE_FILE, 'utf8'));
      expect(expenses[0]).toMatchObject({
        amount: 50,
        category: 'transport',
        month: 3
      });
    });

    it('errors when --amount is missing', () => {
      const result = spawnSync('node', [
        'src/expense/index.js', 
        'add', 
        '--category', 'food'
      ], { encoding: 'utf8' });
      
      expect(result.status).not.toBe(0);
      expect(result.stderr).toContain('--amount and --category are required');
    });

    it('errors when --category is missing', () => {
      const result = spawnSync('node', [
        'src/expense/index.js', 
        'add', 
        '--amount', '100'
      ], { encoding: 'utf8' });
      
      expect(result.status).not.toBe(0);
      expect(result.stderr).toContain('--amount and --category are required');
    });

    it('errors when --amount is non-numeric', () => {
      const result = spawnSync('node', [
        'src/expense/index.js', 
        'add', 
        '--amount', 'abc', 
        '--category', 'food'
      ], { encoding: 'utf8' });
      
      expect(result.status).not.toBe(0);
      expect(result.stderr).toContain('--amount must be a number');
    });

    it('errors when --month is out of range', () => {
      const result = spawnSync('node', [
        'src/expense/index.js', 
        'add', 
        '--amount', '100', 
        '--category', 'food',
        '--month', '13'
      ], { encoding: 'utf8' });
      
      expect(result.status).not.toBe(0);
      expect(result.stderr).toContain('--month must be an integer between 1 and 12');
    });
  });

  describe('list command', () => {
    it('lists empty expenses', () => {
      const result = spawnSync('node', [
        'src/expense/index.js', 
        'list'
      ], { encoding: 'utf8' });
      
      expect(result.status).toBe(0);
      expect(result.stdout).toContain('All Expenses:');
    });

    it('lists existing expenses', () => {
      // Add an expense first
      fs.writeFileSync(EXPENSE_FILE, JSON.stringify([
        { amount: 100, category: 'food', month: 1 }
      ]));
      
      const result = spawnSync('node', [
        'src/expense/index.js', 
        'list'
      ], { encoding: 'utf8' });
      
      expect(result.status).toBe(0);
      expect(result.stdout).toContain('All Expenses:');
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
      // Ensure test data exists before running total command
      fs.writeFileSync(EXPENSE_FILE, JSON.stringify([
        { amount: 100, category: 'food', month: 1 },
        { amount: 50, category: 'transport', month: 1 },
        { amount: 75, category: 'food', month: 2 }
      ]));
      
      const result = spawnSync('node', [
        'src/expense/index.js', 
        'total'
      ], { encoding: 'utf8' });
      
      expect(result.status).toBe(0);
      expect(result.stdout).toContain('Total Expenses: 225');
    });

    it('calculates total with category filter', () => {
      const result = spawnSync('node', [
        'src/expense/index.js', 
        'total',
        '--category', 'food'
      ], { encoding: 'utf8' });
      
      expect(result.status).toBe(0);
      expect(result.stdout).toContain("Total Expenses for category 'food': 175");
    });

    it('calculates total with month filter', () => {
      const result = spawnSync('node', [
        'src/expense/index.js', 
        'total',
        '--month', '1'
      ], { encoding: 'utf8' });
      
      expect(result.status).toBe(0);
      expect(result.stdout).toContain("Total Expenses for month '01': 150");
    });

    it('calculates total with both filters', () => {
      const result = spawnSync('node', [
        'src/expense/index.js', 
        'total',
        '--category', 'food',
        '--month', '1'
      ], { encoding: 'utf8' });
      
      expect(result.status).toBe(0);
      expect(result.stdout).toContain("Total Expenses for category 'food' & month '01': 100");
    });

    it('errors when --month is out of range', () => {
      const result = spawnSync('node', [
        'src/expense/index.js', 
        'total',
        '--month', '13'
      ], { encoding: 'utf8' });
      
      expect(result.status).not.toBe(0);
      expect(result.stderr).toContain('--month must be an integer between 1 and 12');
    });
  });

  describe('help and error cases', () => {
    it('shows help when no command provided', () => {
      const result = spawnSync('node', [
        'src/expense/index.js'
      ], { encoding: 'utf8' });
      
      expect(result.status).toBe(0);
      expect(result.stdout).toContain('Usage:');
      expect(result.stdout).toContain('Commands:');
    });

    it('shows error for unknown command', () => {
      const result = spawnSync('node', [
        'src/expense/index.js', 
        'unknown'
      ], { encoding: 'utf8' });
      
      expect(result.status).not.toBe(0);
      expect(result.stderr).toContain('Command not recognized');
    });
  });
});
