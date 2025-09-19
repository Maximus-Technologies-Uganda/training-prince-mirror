import { describe, it, expect } from 'vitest';
// These functions don't exist yet, so this import will fail.
import { addExpense, calculateTotal } from '../src/expense/core.js';

describe('expense tracker core logic', () => {

  // Test Case #1: The simple total
  it('should add multiple expenses and calculate the correct total', () => {
    let expenses = [];
    expenses = addExpense(expenses, { description: 'Lunch', amount: 200, category: 'food' });
    expenses = addExpense(expenses, { description: 'Bus fare', amount: 50, category: 'transport' });
    
    const total = calculateTotal(expenses);
    expect(total).toBe(250);
  });

  // Test Case #2: The category total
  it('should calculate the correct total for a specific category', () => {
    const expenses = [
      { description: 'Lunch', amount: 200, category: 'food' },
      { description: 'Bus fare', amount: 50, category: 'transport' },
      { description: 'Groceries', amount: 100, category: 'food' }
    ];
    
    const foodTotal = calculateTotal(expenses, 'food');
    expect(foodTotal).toBe(300);
  });

});