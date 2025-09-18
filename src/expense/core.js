import fs from 'fs';
const DB_FILE = 'expenses.json';
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
   * If a category is provided, it totals only the expenses in that category.
   * @param {Array} expenses - The list of expenses.
   * @param {string|null} category - The optional category to filter by.
   * @returns {number} The total amount.
   */
  export function calculateTotal(expenses, category = null) {
    let expensesToTotal = expenses;
  
    // If a category is provided, filter the list first
    if (category) {
      expensesToTotal = expenses.filter(expense => expense.category === category);
    }
  
    // Then, calculate the total of the (potentially filtered) list
    return expensesToTotal.reduce((total, expense) => total + expense.amount, 0);
  }
  // A function to load expenses from the JSON file
export function loadExpenses() {
    try {
      // Read the file's contents
      const data = fs.readFileSync(DB_FILE, 'utf8');
      // Parse the JSON string back into an array
      return JSON.parse(data);
    } catch (error) {
      // If the file doesn't exist yet, return an empty array
      return [];
    }
  }
  
  // A function to save the expenses array to the JSON file
  export function saveExpenses(expenses) {
    // Convert the expenses array into a JSON string with nice formatting
    const data = JSON.stringify(expenses, null, 2);
    // Write the string to the file
    fs.writeFileSync(DB_FILE, data);
    console.log('Expenses saved successfully.');
  }