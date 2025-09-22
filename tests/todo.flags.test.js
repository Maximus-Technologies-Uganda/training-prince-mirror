import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';

function run(args) {
  return spawnSync('node', ['src/todo/index.js', ...args], { encoding: 'utf8' });
}

describe('todo CLI flags', () => {
  it('adds a high priority todo', () => {
    fs.writeFileSync('data/todo.json', '[]');
    const r1 = run(['add', 'Pay bills', '--highPriority']);
    expect(r1.status).toBe(0);
    const list = JSON.parse(fs.readFileSync('data/todo.json', 'utf8'));
    expect(list[0].highPriority).toBe(true);
  });

  it('prevents duplicate with same text and dueToday', () => {
    fs.writeFileSync('data/todo.json', '[]');
    expect(run(['add', 'Workout', '--dueToday']).status).toBe(0);
    const dup = run(['add', 'Workout', '--dueToday']);
    expect(dup.status).not.toBe(0);
    expect(dup.stderr).toContain('Duplicate');
  });
});
