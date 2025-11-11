/**
 * Expense Validator Module
 * Provides validation functions for expense data fields
 */

/**
 * Validates if a date string is in valid ISO 8601 YYYY-MM-DD format
 * @param {string} dateStr - Date string to validate
 * @returns {boolean} True if valid, false otherwise
 * @throws {Error} If date string is invalid format
 */
export function validateDateFormat(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') {
    throw new Error('Date is required');
  }

  // Check YYYY-MM-DD format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) {
    throw new Error('Invalid date format. Expected YYYY-MM-DD');
  }

  // Verify it's a valid date by parsing and checking if the date components match
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  // Check if the date is valid by verifying that the constructed date
  // has the same year, month, and day (this catches invalid dates like Feb 31)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    throw new Error('Invalid date format. Expected YYYY-MM-DD');
  }

  return true;
}

/**
 * Validates that category is a non-empty string
 * @param {any} category - Category value to validate
 * @returns {boolean} True if valid, false otherwise
 * @throws {Error} If category is invalid
 */
export function validateCategory(category) {
  if (category === undefined) {
    throw new Error('Category is required');
  }

  if (typeof category !== 'string') {
    throw new Error('Category must be a string');
  }

  if (!category || category.trim() === '') {
    throw new Error('Category cannot be empty');
  }

  return true;
}

/**
 * Validates that amount is a positive number
 * @param {any} amount - Amount value to validate
 * @returns {boolean} True if valid, false otherwise
 * @throws {Error} If amount is invalid
 */
export function validateAmount(amount) {
  if (amount === undefined) {
    throw new Error('Amount is required');
  }

  if (typeof amount !== 'number' || Number.isNaN(amount)) {
    throw new Error('Amount must be a number');
  }

  if (amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }

  return true;
}

/**
 * Validates query parameter month (1-12)
 * @param {any} month - Month value to validate
 * @returns {boolean} True if valid, false otherwise
 * @throws {Error} If month is invalid
 */
export function validateMonth(month) {
  if (month === undefined || month === null) {
    return true; // Month is optional
  }

  const monthNum = Number(month);
  if (Number.isNaN(monthNum)) {
    throw new Error('Month must be a number');
  }

  if (!Number.isInteger(monthNum) || monthNum < 1 || monthNum > 12) {
    throw new Error('Invalid month. Must be between 1 and 12');
  }

  return true;
}

/**
 * Validates complete expense object
 * @param {Object} expense - Expense object to validate
 * @returns {boolean} True if valid
 * @throws {Error} If any field is invalid
 */
export function validateExpense(expense) {
  if (!expense || typeof expense !== 'object') {
    throw new Error('Invalid expense object');
  }

  validateDateFormat(expense.date);
  validateCategory(expense.category);
  validateAmount(expense.amount);

  return true;
}
