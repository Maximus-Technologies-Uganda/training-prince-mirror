import {
    addExpense,
    calculateTotal,
    loadExpenses,
    saveExpenses
  } from './core.js';
  
  function showHelp() {
    console.log('Usage: node src/expense/index.js <command> [options]');
    console.log('Commands:');
    console.log('  add --amount <number> --category <name> [--month <1-12>]');
    console.log('  list');
    console.log("  total [--category <name>] [--month <1-12>]");
  }
  
  function parseMonth(args, flag = '--month') {
    const idx = args.indexOf(flag);
    if (idx === -1) return null;
    const raw = args[idx + 1];
    const n = Number(raw);
    if (!Number.isInteger(n) || n < 1 || n > 12) {
      console.error('Error: --month must be an integer between 1 and 12.');
      process.exitCode = 1;
      return 'INVALID';
    }
    return n;
  }
  
  function run(argv = process.argv.slice(2)) {
    const command = argv[0]; // e.g., 'add', 'list', 'total'
    const args = argv.slice(1);
  
    if (!command) {
      showHelp();
      return;
    }
  
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
        const monthVal = parseMonth(args);
        if (monthVal === 'INVALID') return;
  
        expenses = addExpense(expenses, { amount, category, month: monthVal });
        saveExpenses(expenses);
        break;
  
      case 'list':
        console.log('All Expenses:');
        console.table(expenses);
        break;
  
      case 'total':
        const categoryFilterIndex = args.indexOf('--category');
        const categoryFilter = categoryFilterIndex !== -1 ? args[categoryFilterIndex + 1] : null;
        const monthFilter = parseMonth(args);
        if (monthFilter === 'INVALID') return;
  
        const total = calculateTotal(expenses, { category: categoryFilter, month: monthFilter });
        const parts = [];
        if (categoryFilter) parts.push(`category '${categoryFilter}'`);
        if (monthFilter) parts.push(`month '${String(monthFilter).padStart(2, '0')}'`);
        const filterText = parts.length ? ` for ${parts.join(' & ')}` : '';
        console.log(`Total Expenses${filterText}: ${total}`);
        break;
  
      default:
        console.error('Error: Command not recognized.');
        showHelp();
        process.exitCode = 1;
        break;
    }
  }
  
  // Only call run() if this file is executed directly
  if (import.meta.url === `file://${process.argv[1]}`) {
    run();
  }
  
  export { run };