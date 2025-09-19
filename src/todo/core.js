import fs from 'fs';
const DB_FILE = 'data/todo.json';
/**
 * Adds a new todo object to a list of todos.
 * @param {Array} todos - The current list of todos.
 * @param {string} text - The text of the new todo.
 * @returns {Array} A new array with the added todo.
 */
export function addTodo(todos, text) {
    const newTodo = {
      text: text,
      completed: false,
    };
    // Return a new array with the new todo item
    return [...todos, newTodo];
  } 
/**
 * Toggles the 'completed' status of a todo at a specific index.
 * @param {Array} todos - The current list of todos.
 * @param {number} indexToToggle - The index of the todo to toggle.
 * @returns {Array} A new array with the toggled todo.
 */
export function toggleTodo(todos, indexToToggle) {
    // Create a new array using map to avoid changing the original
    return todos.map((todo, index) => {
      if (index === indexToToggle) {
        // If it's the right one, return a new object with the completed status flipped
        return { ...todo, completed: !todo.completed };
      }
      // Otherwise, return the todo as is
      return todo;
    });
  } 
  /**
 * Removes a todo from a list by its index.
 * @param {Array} todos - The current list of todos.
 * @param {number} indexToRemove - The index of the todo to remove.
 * @returns {Array} A new array without the removed todo.
 */
export function removeTodo(todos, indexToRemove) {
    // Use the filter method to create a new array that excludes the item
    // at the specified index.
    return todos.filter((todo, index) => index !== indexToRemove);
  }
  export function loadTodos() {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return []; // If file doesn't exist, start with an empty list
    }
  }
  
  export function saveTodos(todos) {
    // Ensure data directory exists
    try { fs.mkdirSync('data', { recursive: true }); } catch (_) {}
    const data = JSON.stringify(todos, null, 2);
    fs.writeFileSync(DB_FILE, data);
    console.log('To-do list saved.');
  }