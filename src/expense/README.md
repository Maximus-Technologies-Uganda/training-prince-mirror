# Expense Tracker CLI

A simple command-line expense tracker that allows you to add, list, and calculate totals for your expenses.

## Usage

### Add an Expense
```bash
# Basic expense
node src/expense/index.js add --amount 100 --category food

# With month (1-12)
node src/expense/index.js add --amount 50 --category transport --month 3
```

### List All Expenses
```bash
node src/expense/index.js list
```

### Calculate Totals
```bash
# Total of all expenses
node src/expense/index.js total

# Total by category
node src/expense/index.js total --category food

# Total by month
node src/expense/index.js total --month 1

# Total by category and month
node src/expense/index.js total --category food --month 1
```

## Examples

```bash
# Add some expenses
$ node src/expense/index.js add --amount 200 --category food --month 1
$ node src/expense/index.js add --amount 50 --category transport --month 1
$ node src/expense/index.js add --amount 150 --category food --month 2

# List all expenses
$ node src/expense/index.js list
All Expenses:
┌─────────┬─────────┬──────────┬───────┐
│ (index) │ amount  │ category │ month │
├─────────┼─────────┼──────────┼───────┤
│    0    │   200   │  'food'  │   1   │
│    1    │   50    │'transport'│   1   │
│    2    │   150   │  'food'  │   2   │
└─────────┴─────────┴──────────┴───────┘

# Calculate totals
$ node src/expense/index.js total
Total Expenses: 400

$ node src/expense/index.js total --category food
Total Expenses for category 'food': 350

$ node src/expense/index.js total --month 1
Total Expenses for month '01': 250

$ node src/expense/index.js total --category food --month 1
Total Expenses for category 'food' & month '01': 200
```

## Error Cases

```bash
# Missing required arguments
$ node src/expense/index.js add --amount 100
Error: --amount and --category are required for the add command.

# Invalid amount
$ node src/expense/index.js add --amount abc --category food
Error: --amount must be a number.

# Invalid month
$ node src/expense/index.js add --amount 100 --category food --month 13
Error: --month must be an integer between 1 and 12.

# Unknown command
$ node src/expense/index.js unknown
Error: Command not recognized.
Usage: node src/expense/index.js <command> [options]
Commands:
  add --amount <number> --category <name> [--month <1-12>]
  list
  total [--category <name>] [--month <1-12>]
```

## Data Storage

Expenses are stored in `data/expenses.json` and persist between CLI invocations.
