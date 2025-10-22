import { describe, it, expect } from 'vitest';
import {
  filterTodosByStatus,
  filterTodosByPriority,
  filterTodosByBoth,
  detectEmptyState
} from '../src/utils/filterUtils.js';

describe('To-Do Filtering', () => {
  
  // Sample test data
  const sampleTodos = [
    { id: 1, title: 'Buy groceries', completed: false, priority: 'High' },
    { id: 2, title: 'Write report', completed: true, priority: 'High' },
    { id: 3, title: 'Call mom', completed: false, priority: 'Medium' },
    { id: 4, title: 'Fix bug', completed: false, priority: 'High' },
    { id: 5, title: 'Organize desk', completed: true, priority: 'Low' },
    { id: 6, title: 'Review PR', completed: true, priority: 'Medium' },
    { id: 7, title: 'Plan vacation', completed: false, priority: 'Low' }
  ];

  describe('filterTodosByStatus', () => {

    it('returns pending tasks when status is pending', () => {
      const result = filterTodosByStatus(sampleTodos, 'pending');
      
      expect(result).toHaveLength(3);
      expect(result.every(t => !t.completed)).toBe(true);
    });

    it('returns completed tasks when status is completed', () => {
      const result = filterTodosByStatus(sampleTodos, 'completed');
      
      expect(result).toHaveLength(4);
      expect(result.every(t => t.completed)).toBe(true);
    });

    it('returns all items when status is all', () => {
      const result = filterTodosByStatus(sampleTodos, 'all');
      
      expect(result).toHaveLength(7);
      expect(result).toEqual(sampleTodos);
    });

    it('returns all items when status is null', () => {
      const result = filterTodosByStatus(sampleTodos, null);
      
      expect(result).toHaveLength(7);
      expect(result).toEqual(sampleTodos);
    });

  });

  describe('filterTodosByPriority', () => {

    it('returns tasks matching High priority', () => {
      const result = filterTodosByPriority(sampleTodos, 'High');
      
      expect(result).toHaveLength(3);
      expect(result.every(t => t.priority === 'High')).toBe(true);
    });

    it('returns tasks matching Medium priority', () => {
      const result = filterTodosByPriority(sampleTodos, 'Medium');
      
      expect(result).toHaveLength(2);
      expect(result.every(t => t.priority === 'Medium')).toBe(true);
    });

    it('returns tasks matching Low priority', () => {
      const result = filterTodosByPriority(sampleTodos, 'Low');
      
      expect(result).toHaveLength(2);
      expect(result.every(t => t.priority === 'Low')).toBe(true);
    });

    it('returns all items when priority is null', () => {
      const result = filterTodosByPriority(sampleTodos, null);
      
      expect(result).toHaveLength(7);
      expect(result).toEqual(sampleTodos);
    });

  });

  describe('filterTodosByBoth', () => {

    it('applies AND logic correctly for status and priority', () => {
      const filters = { status: 'pending', priority: 'High' };
      const result = filterTodosByBoth(sampleTodos, filters);
      
      expect(result).toHaveLength(2);
      expect(result.every(t => 
        !t.completed && t.priority === 'High'
      )).toBe(true);
    });

    it('handles all status with specific priority', () => {
      const filters = { status: 'all', priority: 'Medium' };
      const result = filterTodosByBoth(sampleTodos, filters);
      
      expect(result).toHaveLength(2);
      expect(result.every(t => t.priority === 'Medium')).toBe(true);
    });

    it('handles specific status with null priority', () => {
      const filters = { status: 'completed', priority: null };
      const result = filterTodosByBoth(sampleTodos, filters);
      
      expect(result).toHaveLength(4);
      expect(result.every(t => t.completed)).toBe(true);
    });

    it('returns all items when both filters are null/all', () => {
      const filters = { status: 'all', priority: null };
      const result = filterTodosByBoth(sampleTodos, filters);
      
      expect(result).toHaveLength(7);
      expect(result).toEqual(sampleTodos);
    });

    it('returns empty array when no todos match both filters', () => {
      const filters = { status: 'pending', priority: 'Low' };
      const result = filterTodosByBoth(sampleTodos, filters);
      
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Plan vacation');
    });

  });

  describe('detectEmptyState', () => {

    it('returns true when filtered list is empty', () => {
      const emptyList = [];
      const result = detectEmptyState(emptyList, {});
      
      expect(result).toBe(true);
    });

    it('returns false when filtered list has items', () => {
      const result = detectEmptyState(sampleTodos, {});
      
      expect(result).toBe(false);
    });

  });

});
