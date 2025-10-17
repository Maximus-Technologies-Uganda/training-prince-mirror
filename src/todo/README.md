# To-Do List CLI

A simple command-line to-do list manager with priority levels and due date tracking.

## Usage

### Add a To-Do
```bash
# Basic todo
node src/todo/index.js add "Buy groceries"

# High priority todo
node src/todo/index.js add "Pay bills" --highPriority

# Due today todo
node src/todo/index.js add "Workout" --dueToday

# Both flags
node src/todo/index.js add "Important task" --highPriority --dueToday
```

### List To-Dos
```bash
# List all todos
node src/todo/index.js list

# Filter by high priority
node src/todo/index.js list --highPriority

# Filter by due today
node src/todo/index.js list --dueToday

# Multiple filters
node src/todo/index.js list --highPriority --dueToday
```

### Toggle Completion
```bash
node src/todo/index.js toggle 0
```

### Remove a To-Do
```bash
node src/todo/index.js remove 0
```

## Examples

```bash
# Add some todos
$ node src/todo/index.js add "Buy groceries"
Added new to-do.

$ node src/todo/index.js add "Pay bills" --highPriority
Added new to-do.

$ node src/todo/index.js add "Workout" --dueToday
Added new to-do.

# List all todos
$ node src/todo/index.js list
--- To-Do List ---
0. [ ] Buy groceries
1. [ ] Pay bills (!)
2. [ ] Workout (today)

# Filter by high priority
$ node src/todo/index.js list --highPriority
--- To-Do List ---
0. [ ] Pay bills (!)

# Toggle completion
$ node src/todo/index.js toggle 0
$ node src/todo/index.js list
--- To-Do List ---
0. [x] Buy groceries
1. [ ] Pay bills (!)
2. [ ] Workout (today)

# Remove a todo
$ node src/todo/index.js remove 0
$ node src/todo/index.js list
--- To-Do List ---
0. [ ] Pay bills (!)
1. [ ] Workout (today)
```

## Features

- **Priority Levels**: Use `--highPriority` to mark important tasks (shown with `(!)`)
- **Due Dates**: Use `--dueToday` to mark tasks due today (shown with `(today)`)
- **Duplicate Prevention**: Prevents adding duplicate todos with same text and due date
- **Filtering**: List todos by priority or due date
- **Completion Tracking**: Toggle tasks between completed `[x]` and pending `[ ]`

## Error Cases

```bash
# Missing text
$ node src/todo/index.js add
Error: Please provide the to-do text.

# Duplicate todo
$ node src/todo/index.js add "Workout" --dueToday
$ node src/todo/index.js add "Workout" --dueToday
Error: Duplicate to-do with same text and due date.

# Invalid index
$ node src/todo/index.js toggle 5
Error: Please provide a valid index to toggle.

# Unknown command
$ node src/todo/index.js unknown
Error: Command not recognized.
Usage: node src/todo/index.js <command> [options]
Commands:
  add <text> [--highPriority] [--dueToday]
  list [--dueToday] [--highPriority]
  toggle <index>
  remove <index>
```

## Data Storage

To-dos are stored in `data/todo.json` and persist between CLI invocations.
