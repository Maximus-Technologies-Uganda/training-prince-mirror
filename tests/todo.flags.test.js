import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';

function ensureDataDir() {
  try { fs.mkdirSync('data', { recursive: true }); } catch {}
}

function cleanupDataFiles() {
  try {
    if (fs.existsSync('data/todo.json')) {
      fs.unlinkSync('data/todo.json');
    }
    if (fs.existsSync('data/expenses.json')) {
      fs.unlinkSync('data/expenses.json');
    }
    if (fs.existsSync('data/.stopwatch-state.json')) {
      fs.unlinkSync('data/.stopwatch-state.json');
    }
  } catch {}
}

function run(args) {
  return spawnSync('node', ['src/todo/index.js', ...args], { 
    encoding: 'utf8', 
    cwd: process.cwd(),
    stdio: 'pipe'
  });
}

describe('todo CLI flags', () => {
  beforeEach(() => {
    // Clean up ALL data files first
    cleanupDataFiles();
    ensureDataDir();
    fs.writeFileSync('data/todo.json', '[]');
  });


  it('adds a high priority todo', () => {
    const r1 = run(['add', 'Pay bills', '--highPriority']);
    expect(r1.status).toBe(0);
    expect(r1.stdout).toContain('Added new to-do.');
    
    // Wait a bit for file to be written
    const list = JSON.parse(fs.readFileSync('data/todo.json', 'utf8'));
    expect(list).toHaveLength(1);
    expect(list[0].highPriority).toBe(true);
  });

  it('prevents duplicate with same text and dueToday', () => {
    // Clean up first to ensure fresh start
    cleanupDataFiles();
    ensureDataDir();
    fs.writeFileSync('data/todo.json', '[]');
    
    const first = run(['add', 'Workout', '--dueToday']);
    expect(first.status).toBe(0);
    expect(first.stdout).toContain('Added new to-do.');
    
    // Verify file was created and has data
    expect(fs.existsSync('data/todo.json')).toBe(true);
    const todos = JSON.parse(fs.readFileSync('data/todo.json', 'utf8'));
    expect(todos).toHaveLength(1);
    expect(todos[0].text).toBe('Workout');
    expect(todos[0].dueToday).toBe(true);
    
    const dup = run(['add', 'Workout', '--dueToday']);
    expect(dup.status).toBe(1);
    expect(dup.stderr).toContain('Duplicate');
  });
});
