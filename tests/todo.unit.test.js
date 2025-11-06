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
      
      expect(consoleSpy).toHaveBeenCalledWith('To-do list saved.');
      expect(consoleSpy).toHaveBeenCalledWith('Added new to-do.');
      
      // Verify todo was added to file
      const todos = JSON.parse(fs.readFileSync(TODO_FILE, 'utf8'));
      expect(todos).toHaveLength(1);
      expect(todos[0]).toMatchObject({
        text: 'Buy groceries',
        completed: false,
        highPriority: false,
        dueToday: false
      });
    });

    it('adds a high priority todo', () => {
      run(['add', 'Pay bills', '--highPriority']);
      
      expect(consoleSpy).toHaveBeenCalledWith('To-do list saved.');
      expect(consoleSpy).toHaveBeenCalledWith('Added new to-do.');
      
      const todos = JSON.parse(fs.readFileSync(TODO_FILE, 'utf8'));
      expect(todos).toHaveLength(1);
      expect(todos[0]).toMatchObject({
        text: 'Pay bills',
        completed: false,
        highPriority: true,
        dueToday: false
      });
    });

    it('adds a due today todo (legacy flag)', () => {
      run(['add', 'Call mom', '--dueToday']);
      
      expect(consoleSpy).toHaveBeenCalledWith('To-do list saved.');
      expect(consoleSpy).toHaveBeenCalledWith('Added new to-do.');
      
      const todos = JSON.parse(fs.readFileSync(TODO_FILE, 'utf8'));
      expect(todos).toHaveLength(1);
      expect(todos[0]).toMatchObject({
        text: 'Call mom',
        completed: false,
        highPriority: false,
        dueToday: true
      });
    });

    it('adds a todo with --due YYYY-MM-DD and derives dueToday when today', () => {
      const today = new Date();
      const yyyy = String(today.getFullYear());
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const iso = `${yyyy}-${mm}-${dd}`;

      run(['add', 'Submit report', '--due', iso]);

      expect(consoleSpy).toHaveBeenCalledWith('To-do list saved.');
      expect(consoleSpy).toHaveBeenCalledWith('Added new to-do.');

      const todos = JSON.parse(fs.readFileSync(TODO_FILE, 'utf8'));
      expect(todos).toHaveLength(1);
      expect(todos[0].dueDate).toBe(iso);
      expect(todos[0].dueToday).toBe(true);
    });

    it('validates --priority and maps to highPriority when high', () => {
      run(['add', 'Urgent thing', '--priority', 'high']);
      const todos = JSON.parse(fs.readFileSync(TODO_FILE, 'utf8'));
      expect(todos[0].priority).toBe('high');
      expect(todos[0].highPriority).toBe(true);
    });

    it('errors on invalid --priority value', () => {
      run(['add', 'X', '--priority', 'urgent']);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: --priority must be one of low|med|high.');
      expect(process.exitCode).toBe(1);
    });

    it('errors on invalid --due date format', () => {
      run(['add', 'Y', '--due', '2025/09/23']);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Invalid date for --due; expected YYYY-MM-DD.');
      expect(process.exitCode).toBe(1);
    });

    it('adds a todo with both flags', () => {
      run(['add', 'Urgent meeting', '--highPriority', '--dueToday']);
      
      expect(consoleSpy).toHaveBeenCalledWith('To-do list saved.');
      expect(consoleSpy).toHaveBeenCalledWith('Added new to-do.');
      
      const todos = JSON.parse(fs.readFileSync(TODO_FILE, 'utf8'));
      expect(todos).toHaveLength(1);
      expect(todos[0]).toMatchObject({
        text: 'Urgent meeting',
        completed: false,
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
      expect(consoleSpy).toHaveBeenCalledWith('To-do list saved.');
      expect(consoleSpy).toHaveBeenCalledWith('Added new to-do.');
      
      // Try to add duplicate
      run(['add', 'Workout', '--dueToday']);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Duplicate to-do with same text and due date.');
      expect(process.exitCode).toBe(1);
    });

    it('allows same text with different dueToday status', () => {
      // Add first todo
      run(['add', 'Workout']);
      expect(consoleSpy).toHaveBeenCalledWith('To-do list saved.');
      expect(consoleSpy).toHaveBeenCalledWith('Added new to-do.');
      
      // Add same text but with --dueToday
      run(['add', 'Workout', '--dueToday']);
      
      expect(consoleSpy).toHaveBeenCalledWith('To-do list saved.');
      expect(consoleSpy).toHaveBeenCalledWith('Added new to-do.');
      
      // Verify file was written
      expect(fs.existsSync(TODO_FILE)).toBe(true);
      const todos = JSON.parse(fs.readFileSync(TODO_FILE, 'utf8'));
      expect(todos).toHaveLength(2);
    });
  });

  describe('list command', () => {
    it('lists all todos', () => {
      // Pre-populate with test data
      const testTodos = [
        { text: 'Buy groceries', completed: false, highPriority: false, dueToday: false },
        { text: 'Pay bills', completed: true, highPriority: true, dueToday: false }
      ];
      fs.writeFileSync(TODO_FILE, JSON.stringify(testTodos));
      
      run(['list']);
      
      expect(consoleSpy).toHaveBeenCalledWith('--- To-Do List ---');
      expect(consoleSpy).toHaveBeenCalledWith('0. [ ] Buy groceries');
      expect(consoleSpy).toHaveBeenCalledWith('1. [x] Pay bills (!)');
    });

    it('filters by high priority', () => {
      const testTodos = [
        { text: 'Buy groceries', completed: false, highPriority: false, dueToday: false },
        { text: 'Pay bills', completed: true, highPriority: true, dueToday: false }
      ];
      fs.writeFileSync(TODO_FILE, JSON.stringify(testTodos));
      
      run(['list', '--highPriority']);
      
      expect(consoleSpy).toHaveBeenCalledWith('--- To-Do List ---');
      expect(consoleSpy).toHaveBeenCalledWith('0. [x] Pay bills (!)');
    });

    it('filters by due today', () => {
      const testTodos = [
        { text: 'Buy groceries', completed: false, highPriority: false, dueToday: false },
        { text: 'Call mom', completed: false, highPriority: false, dueToday: true }
      ];
      fs.writeFileSync(TODO_FILE, JSON.stringify(testTodos));
      
      run(['list', '--dueToday']);
      
      expect(consoleSpy).toHaveBeenCalledWith('--- To-Do List ---');
      expect(consoleSpy).toHaveBeenCalledWith('0. [ ] Call mom (today)');
    });

    it('filters by both flags', () => {
      const testTodos = [
        { text: 'Buy groceries', completed: false, highPriority: false, dueToday: false },
        { text: 'Urgent meeting', completed: false, highPriority: true, dueToday: true }
      ];
      fs.writeFileSync(TODO_FILE, JSON.stringify(testTodos));
      
      run(['list', '--highPriority', '--dueToday']);
      
      expect(consoleSpy).toHaveBeenCalledWith('--- To-Do List ---');
      expect(consoleSpy).toHaveBeenCalledWith('0. [ ] Urgent meeting (!) (today)');
    });

    it('shows empty message when no todos', () => {
      run(['list']);
      
      expect(consoleSpy).toHaveBeenCalledWith('--- To-Do List ---');
      expect(consoleSpy).toHaveBeenCalledWith('Your list is empty. Add a to-do with the "add" command!');
    });
  });

  describe('toggle command', () => {
    it('toggles a todo', () => {
      const testTodos = [
        { text: 'Buy groceries', completed: false, highPriority: false, dueToday: false }
      ];
      fs.writeFileSync(TODO_FILE, JSON.stringify(testTodos));
      
      run(['toggle', '0']);
      
      expect(consoleSpy).toHaveBeenCalledWith('To-do list saved.');
      
      const todos = JSON.parse(fs.readFileSync(TODO_FILE, 'utf8'));
      expect(todos[0].completed).toBe(true);
    });

    it('errors for invalid index', () => {
      run(['toggle', '0']);
      
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
    it('removes a todo', () => {
      const testTodos = [
        { text: 'Buy groceries', completed: false, highPriority: false, dueToday: false },
        { text: 'Pay bills', completed: true, highPriority: true, dueToday: false }
      ];
      fs.writeFileSync(TODO_FILE, JSON.stringify(testTodos));
      
      run(['remove', '0']);
      
      expect(consoleSpy).toHaveBeenCalledWith('To-do list saved.');
      
      const todos = JSON.parse(fs.readFileSync(TODO_FILE, 'utf8'));
      expect(todos).toHaveLength(1);
      expect(todos[0].text).toBe('Pay bills');
    });

    it('errors for invalid index', () => {
      run(['remove', '0']);
      
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
      expect(consoleSpy).toHaveBeenCalledWith('  add <text> [--due YYYY-MM-DD] [--priority <low|med|high>]');
      expect(consoleSpy).toHaveBeenCalledWith('  list [--dueToday] [--highPriority]');
      expect(consoleSpy).toHaveBeenCalledWith('  toggle <index>');
      expect(consoleSpy).toHaveBeenCalledWith('  remove <index>');
    });

    it('shows error for unknown command', () => {
      run(['unknown']);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Command not recognized.');
      expect(consoleSpy).toHaveBeenCalledWith('Usage: node src/todo/index.js <command> [options]');
      expect(process.exitCode).toBe(1);
    });
  });
});