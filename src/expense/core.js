import fs from 'fs';
const DB_FILE = 'data/expenses.json'; 

/**
 * Adds a new expense to a list of expenses.
 * @param {Array} expenses - The current list of expenses.
 * @param {Object} expense - The new expense to add.
 * @returns {Array} A new array with the added expense.
 */
export function addExpense(expenses, expense) {
    // We return a new array instead of modifying the old one (immutability).
    return [...expenses, expense];
  }
  
  /**
   * Calculates the total amount from a list of expenses.
   * If a category and/or month is provided, it totals only matching expenses.
   * Backwards compatible signature:
   * calculateTotal(expenses, category)
   * New signature:
   * calculateTotal(expenses, { category, month })
   * @param {Array} expenses - The list of expenses.
   * @param {string|object|null} filter - Category string or an options object.
   * @returns {number} The total amount.
   */
  export function calculateTotal(expenses, filter = null) {
    let category = null;
    let month = null; // "01".."12" or number 1..12

    if (filter && typeof filter === 'object') {
      category = filter.category || null;
      month = filter.month || null;
    } else if (typeof filter === 'string') {
      category = filter;
    }

    let expensesToTotal = expenses;
  
    if (category) {
      expensesToTotal = expensesToTotal.filter(expense => expense.category === category);
    }

    if (month) {
      const norm = String(month).padStart(2, '0');
      expensesToTotal = expensesToTotal.filter(expense => (expense.month ? String(expense.month).padStart(2, '0') : '') === norm);
    }
  
    return expensesToTotal.reduce((total, expense) => total + expense.amount, 0);
  }
  
// A function to load expenses from the JSON file
export function loadExpenses() {
    try {
      // Read the file's contents
      const data = fs.readFileSync(DB_FILE, 'utf8');
      // Parse the JSON string back into an array
      return JSON.parse(data);
    } catch {
      // If the file doesn't exist yet, return an empty array
      return [];
    }
  }
  
  // A function to save the expenses array to the JSON file
  export function saveExpenses(expenses) {
    // Ensure data directory exists
    if (!fs.existsSync('data')) {
      fs.mkdirSync('data', { recursive: true });
    }
    // Convert the expenses array into a JSON string with nice formatting
    const data = JSON.stringify(expenses, null, 2);
    // Write the string to the file
    fs.writeFileSync(DB_FILE, data);
    console.log('Expenses saved successfully.');
  }