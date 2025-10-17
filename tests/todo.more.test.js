import { describe, it, expect } from 'vitest';
import { addTodo, toggleTodo, removeTodo } from '../src/todo/core.js';

describe('todo additional cases', () => {
  it('removeTodo with out-of-range index returns same list', () => {
    const todos = [
      { text: 'a', completed: false },
      { text: 'b', completed: true },
    ];
    const updated = removeTodo(todos, 5);
    expect(updated).toEqual(todos);
  });

  it('toggleTodo toggles only the targeted index', () => {
    let todos = [];
    todos = addTodo(todos, 'a');
    todos = addTodo(todos, 'b');
    const t1 = toggleTodo(todos, 1);
    expect(t1[0].completed).toBe(false);
    expect(t1[1].completed).toBe(true);
  });
});
