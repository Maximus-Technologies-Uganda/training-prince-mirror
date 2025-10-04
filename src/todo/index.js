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
    console.log('  add <text> [--due YYYY-MM-DD] [--priority <low|med|high>]');
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
  
  function run(argv = process.argv.slice(2)) {
    const command = argv[0]; // e.g., 'add', 'list'
    const argument = argv[1]; // e.g., the text for a new todo or an index
    const args = argv.slice(1);
  
    if (!command) {
      showHelp();
      return;
    }
  
    // Always start by loading the latest to-do list from the file
    let todos = loadTodos();
  
    const getFlagValue = (flag) => {
      const idx = args.indexOf(flag);
      if (idx === -1) return null;
      return args[idx + 1] ?? null;
    };

    const validateUnknownFlags = (allowedFlags) => {
      const unknown = args.filter(a => a.startsWith('--') && !allowedFlags.includes(a));
      if (unknown.length > 0) {
        console.error(`Error: Unknown flag(s): ${unknown.join(', ')}`);
        showHelp();
        process.exitCode = 1;
        return false;
      }
      return true;
    };

    switch (command) {
      case 'add':
        if (!validateUnknownFlags(['--highPriority','--dueToday','--due','--priority'])) return;
        if (!argument) {
          console.error('Error: Please provide the to-do text.');
          process.exitCode = 1;
          return;
        }
        // Backward-compatible flags
        let high = args.includes('--highPriority');
        let dueToday = args.includes('--dueToday');

        // Spec flags
        const priorityRaw = getFlagValue('--priority');
        if (priorityRaw) {
          const p = String(priorityRaw).toLowerCase();
          const allowed = ['low','med','high'];
          if (!allowed.includes(p)) {
            console.error('Error: --priority must be one of low|med|high.');
            process.exitCode = 1;
            return;
          }
          high = p === 'high' || high; // keep backward compat flag too
        }

        const dueRaw = getFlagValue('--due');
        let dueDate = null;
        if (dueRaw) {
          const isoRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (!isoRegex.test(dueRaw)) {
            console.error('Error: Invalid date for --due; expected YYYY-MM-DD.');
            process.exitCode = 1;
            return;
          }
          const d = new Date(dueRaw + 'T00:00:00');
          if (Number.isNaN(d.getTime())) {
            console.error('Error: Invalid date for --due; expected YYYY-MM-DD.');
            process.exitCode = 1;
            return;
          }
          dueDate = dueRaw;
          // Also mark dueToday if matches today
          const today = new Date();
          const yyyy = String(today.getFullYear());
          const mm = String(today.getMonth()+1).padStart(2,'0');
          const dd = String(today.getDate()).padStart(2,'0');
          if (`${yyyy}-${mm}-${dd}` === dueDate) {
            dueToday = true;
          }
        }
        // Duplicate guard: same text + same "dueToday" flag
        const duplicate = todos.some(t => t.text === argument && Boolean(t.dueToday) === dueToday && (t.dueDate || null) === (dueDate || null));
        if (duplicate) {
          console.error('Error: Duplicate to-do with same text and due date.');
          process.exitCode = 1;
          return;
        }
        todos = addTodo(todos, argument).map((t, idx, arr) => {
          if (idx === arr.length - 1) {
            return { ...t, highPriority: high, dueToday, dueDate, priority: priorityRaw ? String(priorityRaw).toLowerCase() : (high ? 'high' : undefined) };
          }
          return t;
        });
        saveTodos(todos);
        console.log('Added new to-do.');
        break;
  
      case 'list':
        // Support both spec and legacy filters for now
        const filterHigh = args.includes('--highPriority');
        const filterDue = args.includes('--dueToday');
        console.log('--- To-Do List ---');
        let list = todos;
        if (filterHigh) list = list.filter(t => t.highPriority || (t.priority === 'high'));
        if (filterDue) list = list.filter(t => t.dueToday || (t.dueDate && isToday(new Date(t.dueDate))));
        if (list.length === 0) {
          console.log('Your list is empty. Add a to-do with the "add" command!');
        } else {
          list.forEach((todo, index) => {
            const status = todo.completed ? '[x]' : '[ ]';
            const flags = [(todo.highPriority || todo.priority === 'high') ? '(!)' : '', (todo.dueToday || (todo.dueDate && isToday(new Date(todo.dueDate)))) ? '(today)' : ''].filter(Boolean).join(' ');
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
  
  // Only call run() if this file is executed directly
  if (import.meta.url === `file://${process.argv[1]}`) {
    run();
  }
  
  export { run };