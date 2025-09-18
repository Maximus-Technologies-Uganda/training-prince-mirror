import {
    addTodo,
    toggleTodo,
    removeTodo,
    loadTodos,
    saveTodos
  } from './core.js';
  
  function run() {
    const command = process.argv[2]; // e.g., 'add', 'list'
    const argument = process.argv[3]; // e.g., the text for a new todo or an index
  
    // Always start by loading the latest to-do list from the file
    let todos = loadTodos();
  
    switch (command) {
      case 'add':
        if (!argument) {
          console.error('Error: Please provide the to-do text.');
          return;
        }
        todos = addTodo(todos, argument);
        saveTodos(todos);
        console.log('Added new to-do.');
        break;
  
      case 'list':
        console.log('--- To-Do List ---');
        if (todos.length === 0) {
          console.log('Your list is empty. Add a to-do with the "add" command!');
        } else {
          todos.forEach((todo, index) => {
            const status = todo.completed ? '[x]' : '[ ]';
            console.log(`${index}. ${status} ${todo.text}`);
          });
        }
        break;
  
      case 'toggle':
        const indexToToggle = parseInt(argument);
        if (isNaN(indexToToggle) || indexToToggle >= todos.length) {
          console.error('Error: Please provide a valid index to toggle.');
          return;
        }
        todos = toggleTodo(todos, indexToToggle);
        saveTodos(todos);
        break;
  
      case 'remove':
        const indexToRemove = parseInt(argument);
        if (isNaN(indexToRemove) || indexToRemove >= todos.length) {
          console.error('Error: Please provide a valid index to remove.');
          return;
        }
        todos = removeTodo(todos, indexToRemove);
        saveTodos(todos);
        break;
  
      default:
        console.log('Command not recognized. Use: add, list, toggle, remove');
        break;
    }
  }
  
  run();