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
  return spawnSync('node', ['src/todo/index.js', ...args], { encoding: 'utf8' });
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
    const list = JSON.parse(fs.readFileSync('data/todo.json', 'utf8'));
    expect(list[0].highPriority).toBe(true);
  });

  it('prevents duplicate with same text and dueToday', () => {
    // Clean up first to ensure fresh start
    cleanupDataFiles();
    ensureDataDir();
    fs.writeFileSync('data/todo.json', '[]');
    
    expect(run(['add', 'Workout', '--dueToday']).status).toBe(0);
    const dup = run(['add', 'Workout', '--dueToday']);
    expect(dup.status).not.toBe(0);
    expect(dup.stderr).toContain('Duplicate');
  });
});
