import {
    addTodo,
    toggleTodo,
    removeTodo,
    loadTodos,
    saveTodos
  } from './core.js';
  
  function showHelp() {
    console.log('Usage: node src/todo/index.js <command> [options]');
    console.log('Commands:');
    console.log('  add <text> [--highPriority] [--dueToday]');
    console.log('  list [--dueToday] [--highPriority]');
    console.log('  toggle <index>');
    console.log('  remove <index>');
  }
  
  function isToday(date = new Date()) {
    const now = new Date();
    return date.getFullYear() === now.getFullYear()
      && date.getMonth() === now.getMonth()
      && date.getDate() === now.getDate();
  }
  
  function run() {
    const command = process.argv[2]; // e.g., 'add', 'list'
    const argument = process.argv[3]; // e.g., the text for a new todo or an index
    const args = process.argv.slice(3);
  
    if (!command) {
      showHelp();
      return;
    }
  
    // Always start by loading the latest to-do list from the file
    let todos = loadTodos();
  
    switch (command) {
      case 'add':
        if (!argument) {
          console.error('Error: Please provide the to-do text.');
          process.exitCode = 1;
          return;
        }
        const high = args.includes('--highPriority');
        const dueToday = args.includes('--dueToday');
        // Duplicate guard: same text + same "dueToday" flag
        const duplicate = todos.some(t => t.text === argument && Boolean(t.dueToday) === dueToday);
        if (duplicate) {
          console.error('Error: Duplicate to-do with same text and due date.');
          process.exitCode = 1;
          return;
        }
        todos = addTodo(todos, argument).map((t, idx, arr) => {
          if (idx === arr.length - 1) {
            return { ...t, highPriority: high, dueToday };
          }
          return t;
        });
        saveTodos(todos);
        console.log('Added new to-do.');
        break;
  
      case 'list':
        const filterHigh = args.includes('--highPriority');
        const filterDue = args.includes('--dueToday');
        console.log('--- To-Do List ---');
        let list = todos;
        if (filterHigh) list = list.filter(t => t.highPriority);
        if (filterDue) list = list.filter(t => t.dueToday || (t.dueDate && isToday(new Date(t.dueDate))));
        if (list.length === 0) {
          console.log('Your list is empty. Add a to-do with the "add" command!');
        } else {
          list.forEach((todo, index) => {
            const status = todo.completed ? '[x]' : '[ ]';
            const flags = [todo.highPriority ? '(!)' : '', todo.dueToday ? '(today)' : ''].filter(Boolean).join(' ');
            console.log(`${index}. ${status} ${todo.text} ${flags}`.trim());
          });
        }
        break;
  
      case 'toggle':
        const indexToToggle = parseInt(argument);
        if (isNaN(indexToToggle) || indexToToggle >= todos.length) {
          console.error('Error: Please provide a valid index to toggle.');
          process.exitCode = 1;
          return;
        }
        todos = toggleTodo(todos, indexToToggle);
        saveTodos(todos);
        break;
  
      case 'remove':
        const indexToRemove = parseInt(argument);
        if (isNaN(indexToRemove) || indexToRemove >= todos.length) {
          console.error('Error: Please provide a valid index to remove.');
          process.exitCode = 1;
          return;
        }
        todos = removeTodo(todos, indexToRemove);
        saveTodos(todos);
        break;
  
      default:
        console.error('Error: Command not recognized.');
        showHelp();
        process.exitCode = 1;
        break;
    }
  }
  
  run();