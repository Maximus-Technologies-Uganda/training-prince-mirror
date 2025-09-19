import {
    addExpense,
    calculateTotal,
    loadExpenses,
    saveExpenses
  } from './core.js';
  
  function run() {
    const command = process.argv[2]; // e.g., 'add', 'list', 'total'
    const args = process.argv.slice(3);
  
    // Always start by loading the latest expenses from the file
    let expenses = loadExpenses();
  
    switch (command) {
      case 'add':
        const amountIndex = args.indexOf('--amount');
        const categoryIndex = args.indexOf('--category');
  
        if (amountIndex === -1 || categoryIndex === -1) {
          console.error('Error: --amount and --category are required for the add command.');
          process.exitCode = 1;
          return;
        }
  
        const amountRaw = args[amountIndex + 1];
        const amount = parseFloat(amountRaw);
        if (Number.isNaN(amount)) {
          console.error('Error: --amount must be a number.');
          process.exitCode = 1;
          return;
        }
        const category = args[categoryIndex + 1];
  
        expenses = addExpense(expenses, { amount, category });
        saveExpenses(expenses);
        break;
  
      case 'list':
        console.log('All Expenses:');
        console.table(expenses);
        break;
  
      case 'total':
        const categoryFilterIndex = args.indexOf('--category');
        const categoryFilter = categoryFilterIndex !== -1 ? args[categoryFilterIndex + 1] : null;
  
        const total = calculateTotal(expenses, categoryFilter);
        const filterText = categoryFilter ? ` for category '${categoryFilter}'` : '';
        console.log(`Total Expenses${filterText}: ${total}`);
        break;
  
      default:
        console.log('Command not recognized. Available commands: add, list, total');
        break;
    }
  }
  
  run();