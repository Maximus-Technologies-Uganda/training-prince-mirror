/**
 * Integration Tests for Expense Endpoints (T018-T023)
 * 
 * Full HTTP endpoint testing using Supertest.
 * Tests POST /expenses and GET /expenses/summary with various request/response scenarios.
 * 
 * Coverage Target: ≥70% overall integration tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { app } from '../../src/server.js';
import { expenseStore } from '../../src/services/expenses.js';

describe('Expense API Integration Tests', () => {
  // Clear expenses before each test to ensure isolated test state
  beforeEach(() => {
    expenseStore.clear();
  });

  afterEach(() => {
    expenseStore.clear();
  });

  /**
   * T018: POST /expenses Success Cases
   * Validates successful expense creation with valid payloads
   */
  describe('T018: POST /expenses - Success Cases', () => {
    it('should create expense with valid payload (amount: 25.50, category: food, date: 2025-11-05)', async () => {
      const response = await request(app)
        .post('/expenses')
        .send({
          amount: 25.50,
          category: 'food',
          date: '2025-11-05'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
      expect(response.body.amount).toBe(25.50);
      expect(response.body.category).toBe('food');
      expect(response.body.date).toBe('2025-11-05');
    });

    it('should create expense with different valid payload (amount: 100, category: transport, date: 2025-11-01)', async () => {
      const response = await request(app)
        .post('/expenses')
        .send({
          amount: 100,
          category: 'transport',
          date: '2025-11-01'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.amount).toBe(100);
      expect(response.body.category).toBe('transport');
      expect(response.body.date).toBe('2025-11-01');
    });

    it('should return id field as valid UUID v4 format', async () => {
      const response = await request(app)
        .post('/expenses')
        .send({
          amount: 50.00,
          category: 'utilities',
          date: '2025-11-05'
        });

      expect(response.status).toBe(201);
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(response.body.id).toMatch(uuidRegex);
    });

    it('should create multiple expenses with different IDs', async () => {
      const response1 = await request(app)
        .post('/expenses')
        .send({
          amount: 25.50,
          category: 'food',
          date: '2025-11-05'
        });

      const response2 = await request(app)
        .post('/expenses')
        .send({
          amount: 100,
          category: 'transport',
          date: '2025-11-01'
        });

      expect(response1.status).toBe(201);
      expect(response2.status).toBe(201);
      expect(response1.body.id).not.toBe(response2.body.id);
    });

    it('should accept small decimal amounts', async () => {
      const response = await request(app)
        .post('/expenses')
        .send({
          amount: 0.01,
          category: 'misc',
          date: '2025-11-05'
        });

      expect(response.status).toBe(201);
      expect(response.body.amount).toBe(0.01);
    });

    it('should accept large amounts', async () => {
      const response = await request(app)
        .post('/expenses')
        .send({
          amount: 999.99,
          category: 'business',
          date: '2025-11-05'
        });

      expect(response.status).toBe(201);
      expect(response.body.amount).toBe(999.99);
    });
  });

  /**
   * T019: POST /expenses Validation Error Cases
   * Validates error handling for invalid/missing fields
   */
  describe('T019: POST /expenses - Validation Errors', () => {
    it('should return 400 when amount is missing', async () => {
      const response = await request(app)
        .post('/expenses')
        .send({
          category: 'food',
          date: '2025-11-05'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('code', 'VALIDATION_ERROR');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('details');
      expect(response.body.details).toContainEqual(
        expect.objectContaining({
          field: 'amount',
          message: expect.any(String)
        })
      );
    });

    it('should return 400 when category is missing', async () => {
      const response = await request(app)
        .post('/expenses')
        .send({
          amount: 25.50,
          date: '2025-11-05'
        });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe('VALIDATION_ERROR');
      expect(response.body.details).toContainEqual(
        expect.objectContaining({
          field: 'category'
        })
      );
    });

    it('should return 400 when date is missing', async () => {
      const response = await request(app)
        .post('/expenses')
        .send({
          amount: 25.50,
          category: 'food'
        });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe('VALIDATION_ERROR');
      expect(response.body.details).toContainEqual(
        expect.objectContaining({
          field: 'date'
        })
      );
    });

    it('should return 400 with message when amount is negative', async () => {
      const response = await request(app)
        .post('/expenses')
        .send({
          amount: -10,
          category: 'food',
          date: '2025-11-05'
        });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe('VALIDATION_ERROR');
      expect(response.body.details).toContainEqual(
        expect.objectContaining({
          field: 'amount',
          message: expect.stringContaining('greater than 0'),
          value: -10
        })
      );
    });

    it('should return 400 when amount is zero', async () => {
      const response = await request(app)
        .post('/expenses')
        .send({
          amount: 0,
          category: 'food',
          date: '2025-11-05'
        });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe('VALIDATION_ERROR');
      expect(response.body.details).toContainEqual(
        expect.objectContaining({
          field: 'amount',
          message: expect.stringContaining('greater than 0'),
          value: 0
        })
      );
    });

    it('should return 400 when amount is not a number', async () => {
      const response = await request(app)
        .post('/expenses')
        .send({
          amount: 'twenty-five',
          category: 'food',
          date: '2025-11-05'
        });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe('VALIDATION_ERROR');
      expect(Array.isArray(response.body.details)).toBe(true);
      expect(response.body.details.length).toBeGreaterThan(0);
    });

    it('should return 400 when category is empty string', async () => {
      const response = await request(app)
        .post('/expenses')
        .send({
          amount: 25.50,
          category: '',
          date: '2025-11-05'
        });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe('VALIDATION_ERROR');
      expect(response.body.details).toContainEqual(
        expect.objectContaining({
          field: 'category',
          value: ''
        })
      );
    });

    it('should return 400 when category is whitespace only', async () => {
      const response = await request(app)
        .post('/expenses')
        .send({
          amount: 25.50,
          category: '   ',
          date: '2025-11-05'
        });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe('VALIDATION_ERROR');
      expect(response.body.details).toContainEqual(
        expect.objectContaining({
          field: 'category',
          value: '   '
        })
      );
    });

    it('should return 400 with message for invalid date format', async () => {
      const response = await request(app)
        .post('/expenses')
        .send({
          amount: 25.50,
          category: 'food',
          date: '11/05/2025'
        });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe('VALIDATION_ERROR');
      expect(response.body.details).toContainEqual(
        expect.objectContaining({
          field: 'date',
          message: expect.stringContaining('YYYY-MM-DD'),
          value: '11/05/2025'
        })
      );
    });

    it('should return 400 with received value in error message', async () => {
      const response = await request(app)
        .post('/expenses')
        .send({
          amount: 25.50,
          category: 'food',
          date: '11/05/2025'
        });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe('VALIDATION_ERROR');
      expect(response.body.details[0].message).toContain('received:');
      expect(response.body.details[0]).toHaveProperty('value', '11/05/2025');
    });

    it('should return 400 for invalid calendar date (2025-13-01)', async () => {
      const response = await request(app)
        .post('/expenses')
        .send({
          amount: 25.50,
          category: 'food',
          date: '2025-13-01'
        });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe('VALIDATION_ERROR');
      expect(response.body.details).toContainEqual(
        expect.objectContaining({
          field: 'date',
          value: '2025-13-01'
        })
      );
    });
  });

  /**
   * T020: GET /expenses/summary - No Filters
   * Validates aggregation of all expenses
   */
  describe('T020: GET /expenses/summary - No Filters', () => {
    it('should return aggregated total of all expenses', async () => {
      // Create test expenses
      await request(app).post('/expenses').send({
        amount: 20,
        category: 'food',
        date: '2025-11-01'
      });

      await request(app).post('/expenses').send({
        amount: 30,
        category: 'transport',
        date: '2025-11-02'
      });

      await request(app).post('/expenses').send({
        amount: 15,
        category: 'food',
        date: '2025-11-03'
      });

      // Get summary
      const response = await request(app).get('/expenses/summary');

      expect(response.status).toBe(200);
      expect(response.body.total).toBe(65);
      expect(response.body.count).toBe(3);
      expect(response.body.filters).toEqual({});
    });

    it('should return empty summary when no expenses exist', async () => {
      const response = await request(app).get('/expenses/summary');

      expect(response.status).toBe(200);
      expect(response.body.total).toBe(0);
      expect(response.body.count).toBe(0);
      expect(response.body.filters).toEqual({});
    });

    it('should return response structure with required fields', async () => {
      const response = await request(app).get('/expenses/summary');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('count');
      expect(response.body).toHaveProperty('filters');
      expect(typeof response.body.total).toBe('number');
      expect(typeof response.body.count).toBe('number');
      expect(typeof response.body.filters).toBe('object');
    });
  });

  /**
   * T021: GET /expenses/summary - Category Filter
   * Validates filtering by category
   */
  describe('T021: GET /expenses/summary - Category Filter', () => {
    beforeEach(async () => {
      // Setup test data
      await request(app).post('/expenses').send({
        amount: 20,
        category: 'food',
        date: '2025-11-01'
      });

      await request(app).post('/expenses').send({
        amount: 30,
        category: 'transport',
        date: '2025-11-02'
      });

      await request(app).post('/expenses').send({
        amount: 15,
        category: 'food',
        date: '2025-11-03'
      });
    });

    it('should filter expenses by category and return sum', async () => {
      const response = await request(app)
        .get('/expenses/summary')
        .query({ category: 'food' });

      expect(response.status).toBe(200);
      expect(response.body.total).toBe(35);
      expect(response.body.count).toBe(2);
      expect(response.body.filters).toEqual({ category: 'food' });
    });

    it('should filter by transport category', async () => {
      const response = await request(app)
        .get('/expenses/summary')
        .query({ category: 'transport' });

      expect(response.status).toBe(200);
      expect(response.body.total).toBe(30);
      expect(response.body.count).toBe(1);
      expect(response.body.filters).toEqual({ category: 'transport' });
    });

    it('should return empty result for non-existent category', async () => {
      const response = await request(app)
        .get('/expenses/summary')
        .query({ category: 'nonexistent' });

      expect(response.status).toBe(200);
      expect(response.body.total).toBe(0);
      expect(response.body.count).toBe(0);
      expect(response.body.filters).toEqual({ category: 'nonexistent' });
    });
  });

  /**
   * T022: GET /expenses/summary - Month Filter
   * Validates filtering by month (YYYY-MM format)
   */
  describe('T022: GET /expenses/summary - Month Filter', () => {
    beforeEach(async () => {
      // Setup test data across months
      await request(app).post('/expenses').send({
        amount: 100,
        category: 'transport',
        date: '2025-10-15'
      });

      await request(app).post('/expenses').send({
        amount: 20,
        category: 'food',
        date: '2025-11-01'
      });

      await request(app).post('/expenses').send({
        amount: 45,
        category: 'transport',
        date: '2025-11-15'
      });
    });

    it('should filter expenses by month 2025-11', async () => {
      const response = await request(app)
        .get('/expenses/summary')
        .query({ month: '2025-11' });

      expect(response.status).toBe(200);
      expect(response.body.total).toBe(65);
      expect(response.body.count).toBe(2);
      expect(response.body.filters).toEqual({ month: '2025-11' });
    });

    it('should filter expenses by month 2025-10', async () => {
      const response = await request(app)
        .get('/expenses/summary')
        .query({ month: '2025-10' });

      expect(response.status).toBe(200);
      expect(response.body.total).toBe(100);
      expect(response.body.count).toBe(1);
      expect(response.body.filters).toEqual({ month: '2025-10' });
    });

    it('should return empty result for non-existent month', async () => {
      const response = await request(app)
        .get('/expenses/summary')
        .query({ month: '2025-12' });

      expect(response.status).toBe(200);
      expect(response.body.total).toBe(0);
      expect(response.body.count).toBe(0);
      expect(response.body.filters).toEqual({ month: '2025-12' });
    });
  });

  /**
   * T023: GET /expenses/summary - Both Filters
   * Validates filtering by category AND month
   */
  describe('T023: GET /expenses/summary - Both Filters', () => {
    beforeEach(async () => {
      // Setup test data
      await request(app).post('/expenses').send({
        amount: 20,
        category: 'food',
        date: '2025-11-01'
      });

      await request(app).post('/expenses').send({
        amount: 15,
        category: 'food',
        date: '2025-11-15'
      });

      await request(app).post('/expenses').send({
        amount: 30,
        category: 'transport',
        date: '2025-11-05'
      });

      await request(app).post('/expenses').send({
        amount: 10,
        category: 'food',
        date: '2025-10-15'
      });
    });

    it('should apply both filters with AND logic', async () => {
      const response = await request(app)
        .get('/expenses/summary')
        .query({ category: 'food', month: '2025-11' });

      expect(response.status).toBe(200);
      expect(response.body.total).toBe(35);
      expect(response.body.count).toBe(2);
      expect(response.body.filters).toEqual({
        category: 'food',
        month: '2025-11'
      });
    });

    it('should filter by different category and month combination', async () => {
      const response = await request(app)
        .get('/expenses/summary')
        .query({ category: 'transport', month: '2025-11' });

      expect(response.status).toBe(200);
      expect(response.body.total).toBe(30);
      expect(response.body.count).toBe(1);
      expect(response.body.filters).toEqual({
        category: 'transport',
        month: '2025-11'
      });
    });

    it('should return empty result when both filters match nothing', async () => {
      const response = await request(app)
        .get('/expenses/summary')
        .query({ category: 'food', month: '2025-12' });

      expect(response.status).toBe(200);
      expect(response.body.total).toBe(0);
      expect(response.body.count).toBe(0);
      expect(response.body.filters).toEqual({
        category: 'food',
        month: '2025-12'
      });
    });

    it('should include both filters in response', async () => {
      const response = await request(app)
        .get('/expenses/summary')
        .query({ category: 'food', month: '2025-11' });

      expect(response.status).toBe(200);
      expect(Object.keys(response.body.filters)).toContain('category');
      expect(Object.keys(response.body.filters)).toContain('month');
    });
  });
});

