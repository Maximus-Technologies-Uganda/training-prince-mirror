import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { run } from '../src/todo/index.js';
import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = 'data';
const TODO_FILE = path.join(DATA_DIR, 'todo.json');

describe('To-Do CLI Unit Tests', () => {
  let consoleSpy, consoleErrorSpy;

  beforeEach(() => {
    // Clean up ALL data files first
    if (fs.existsSync('data/expenses.json')) {
      fs.unlinkSync('data/expenses.json');
    }
    if (fs.existsSync('data/.stopwatch-state.json')) {
      fs.unlinkSync('data/.stopwatch-state.json');
    }
    if (fs.existsSync(TODO_FILE)) {
      fs.unlinkSync(TODO_FILE);
    }
    
    // Ensure data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    // Start with empty todos
    fs.writeFileSync(TODO_FILE, '[]');
    
    // Mock console
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Clean up
    if (fs.existsSync(TODO_FILE)) {
      fs.unlinkSync(TODO_FILE);
    }
    vi.restoreAllMocks();
  });

  describe('add command', () => {
    it('adds a basic todo', () => {
      run(['add', 'Buy groceries']);
      
      const todos = JSON.parse(fs.readFileSync(TODO_FILE, 'utf8'));
      expect(todos).toHaveLength(1);
      expect(todos[0]).toMatchObject({
        text: 'Buy groceries',
        completed: false,
        highPriority: false,
        dueToday: false
      });
      expect(consoleSpy).toHaveBeenCalledWith('Added new to-do.');
    });

    it('adds a high priority todo', () => {
      run(['add', 'Pay bills', '--highPriority']);
      
      const todos = JSON.parse(fs.readFileSync(TODO_FILE, 'utf8'));
      expect(todos[0]).toMatchObject({
        text: 'Pay bills',
        highPriority: true,
        dueToday: false
      });
    });

    it('adds a due today todo', () => {
      run(['add', 'Workout', '--dueToday']);
      
      const todos = JSON.parse(fs.readFileSync(TODO_FILE, 'utf8'));
      expect(todos[0]).toMatchObject({
        text: 'Workout',
        highPriority: false,
        dueToday: true
      });
    });

    it('adds a todo with both flags', () => {
      run(['add', 'Important task', '--highPriority', '--dueToday']);
      
      const todos = JSON.parse(fs.readFileSync(TODO_FILE, 'utf8'));
      expect(todos[0]).toMatchObject({
        text: 'Important task',
        highPriority: true,
        dueToday: true
      });
    });

    it('errors when no text provided', () => {
      run(['add']);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Please provide the to-do text.');
      expect(process.exitCode).toBe(1);
    });

    it('prevents duplicate with same text and dueToday', () => {
      // Add first todo
      run(['add', 'Workout', '--dueToday']);
      
      // Try to add duplicate
      run(['add', 'Workout', '--dueToday']);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Duplicate to-do with same text and due date.');
      expect(process.exitCode).toBe(1);
      
      // Verify only one todo exists
      const todos = JSON.parse(fs.readFileSync(TODO_FILE, 'utf8'));
      expect(todos).toHaveLength(1);
    });

    it('allows same text with different dueToday status', () => {
      run(['add', 'Workout']);
      run(['add', 'Workout', '--dueToday']);
      
      const todos = JSON.parse(fs.readFileSync(TODO_FILE, 'utf8'));
      expect(todos).toHaveLength(2);
    });
  });

  describe('list command', () => {
    beforeEach(() => {
      // Add some test todos
      fs.writeFileSync(TODO_FILE, JSON.stringify([
        { text: 'High priority task', completed: false, highPriority: true, dueToday: false },
        { text: 'Due today task', completed: false, highPriority: false, dueToday: true },
        { text: 'Regular task', completed: false, highPriority: false, dueToday: false },
        { text: 'Completed task', completed: true, highPriority: false, dueToday: false }
      ]));
    });

    it('lists all todos', () => {
      run(['list']);
      
      expect(consoleSpy).toHaveBeenCalledWith('--- To-Do List ---');
      expect(consoleSpy).toHaveBeenCalledWith('0. [ ] High priority task (!)');
      expect(consoleSpy).toHaveBeenCalledWith('1. [ ] Due today task (today)');
      expect(consoleSpy).toHaveBeenCalledWith('2. [ ] Regular task');
      expect(consoleSpy).toHaveBeenCalledWith('3. [x] Completed task');
    });

    it('filters by high priority', () => {
      run(['list', '--highPriority']);
      
      expect(consoleSpy).toHaveBeenCalledWith('--- To-Do List ---');
      expect(consoleSpy).toHaveBeenCalledWith('0. [ ] High priority task (!)');
    });

    it('filters by due today', () => {
      run(['list', '--dueToday']);
      
      expect(consoleSpy).toHaveBeenCalledWith('--- To-Do List ---');
      expect(consoleSpy).toHaveBeenCalledWith('0. [ ] Due today task (today)');
    });

    it('filters by both flags', () => {
      run(['list', '--highPriority', '--dueToday']);
      
      expect(consoleSpy).toHaveBeenCalledWith('--- To-Do List ---');
      expect(consoleSpy).toHaveBeenCalledWith('Your list is empty. Add a to-do with the "add" command!');
    });

    it('shows empty message when no todos', () => {
      fs.writeFileSync(TODO_FILE, '[]');
      run(['list']);
      
      expect(consoleSpy).toHaveBeenCalledWith('--- To-Do List ---');
      expect(consoleSpy).toHaveBeenCalledWith('Your list is empty. Add a to-do with the "add" command!');
    });
  });

  describe('toggle command', () => {
    beforeEach(() => {
      fs.writeFileSync(TODO_FILE, JSON.stringify([
        { text: 'Task 1', completed: false },
        { text: 'Task 2', completed: false }
      ]));
    });

    it('toggles a todo', () => {
      run(['toggle', '0']);
      
      const todos = JSON.parse(fs.readFileSync(TODO_FILE, 'utf8'));
      expect(todos[0].completed).toBe(true);
      expect(todos[1].completed).toBe(false);
    });

    it('errors for invalid index', () => {
      run(['toggle', '5']);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Please provide a valid index to toggle.');
      expect(process.exitCode).toBe(1);
    });

    it('errors for non-numeric index', () => {
      run(['toggle', 'abc']);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Please provide a valid index to toggle.');
      expect(process.exitCode).toBe(1);
    });
  });

  describe('remove command', () => {
    beforeEach(() => {
      fs.writeFileSync(TODO_FILE, JSON.stringify([
        { text: 'Task 1', completed: false },
        { text: 'Task 2', completed: false }
      ]));
    });

    it('removes a todo', () => {
      run(['remove', '0']);
      
      const todos = JSON.parse(fs.readFileSync(TODO_FILE, 'utf8'));
      expect(todos).toHaveLength(1);
      expect(todos[0].text).toBe('Task 2');
    });

    it('errors for invalid index', () => {
      run(['remove', '5']);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Please provide a valid index to remove.');
      expect(process.exitCode).toBe(1);
    });

    it('errors for non-numeric index', () => {
      run(['remove', 'abc']);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Please provide a valid index to remove.');
      expect(process.exitCode).toBe(1);
    });
  });

  describe('help and error cases', () => {
    it('shows help when no command provided', () => {
      run([]);
      
      expect(consoleSpy).toHaveBeenCalledWith('Usage: node src/todo/index.js <command> [options]');
      expect(consoleSpy).toHaveBeenCalledWith('Commands:');
    });

    it('shows error for unknown command', () => {
      run(['unknown']);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Command not recognized.');
      expect(process.exitCode).toBe(1);
    });
  });
});
