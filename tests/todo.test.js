import { describe, it, expect } from 'vitest'; // This was the missing line
import { addTodo, toggleTodo, removeTodo } from '../src/todo/core.js';

describe('todo core logic', () => {

  it('should add a new todo to the list', () => {
    const todos = [];
    const newTodoText = 'Write a test';
    const updatedTodos = addTodo(todos, newTodoText);

    expect(updatedTodos.length).toBe(1);
    expect(updatedTodos[0].text).toBe(newTodoText);
    expect(updatedTodos[0].completed).toBe(false);
  });

  it('should toggle the completed status of a todo', () => {
    let todos = [];
    todos = addTodo(todos, 'Write a test');

    let updatedTodos = toggleTodo(todos, 0);
    expect(updatedTodos[0].completed).toBe(true);

    updatedTodos = toggleTodo(updatedTodos, 0);
    expect(updatedTodos[0].completed).toBe(false);
  });

  it('should remove a todo from the list by its index', () => {
    let todos = [];
    todos = addTodo(todos, 'Write a test');
    todos = addTodo(todos, 'Make it pass');

    const updatedTodos = removeTodo(todos, 0); 

    expect(updatedTodos.length).toBe(1);
    expect(updatedTodos[0].text).toBe('Make it pass');
  });

});