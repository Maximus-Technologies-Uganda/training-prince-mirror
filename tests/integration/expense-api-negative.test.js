import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import http from 'http';
import { createExpense, getExpenseSummary, getExpenseById } from '../../src/expense/handlers.js';

/**
 * Integration test file for negative path testing of expense API endpoints.
 * Tests all invalid inputs and error conditions for:
 * - POST /expenses (invalid date, empty category, zero/negative amount)
 * - GET /expenses/summary (invalid month parameter)
 * - GET /expenses/{id} (non-existent ID, invalid format)
 *
 * These tests ensure the API properly validates inputs and returns
 * appropriate HTTP status codes and error messages.
 */

// Create a minimal test server
function createTestServer() {
  const server = http.createServer((req, res) => {
    // Set default CORS and content-type headers
    res.setHeader('Content-Type', 'application/json');

    // Add JSON parsing middleware
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        if (body) {
          try {
            req.body = JSON.parse(body);
          } catch (e) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: { code: 'PARSE_ERROR', message: 'Invalid JSON' } }));
            return;
          }
        }

        // Route requests
        if (req.method === 'POST' && req.url === '/expenses') {
          await createExpense(req, res);
        } else if (req.method === 'GET' && req.url.startsWith('/expenses/summary')) {
          // Parse query parameters
          const url = new URL(`http://localhost${req.url}`);
          req.query = Object.fromEntries(url.searchParams);
          await getExpenseSummary(req, res);
        } else if (req.method === 'GET' && req.url.match(/^\/expenses\/[^/]+$/)) {
          const idMatch = req.url.match(/\/expenses\/([^/]+)$/);
          req.params = { id: idMatch ? idMatch[1] : null };
          await getExpenseById(req, res);
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Not found' }));
        }
      } catch (error) {
        if (!res.headersSent) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
        }
        res.end(JSON.stringify({ error: { code: 'INTERNAL_ERROR', message: error.message } }));
      }
    });
  });

  return server;
}

describe('Expense API - Negative Path Tests', () => {
  let app;

  beforeAll(async () => {
    const server = createTestServer();
    await new Promise((resolve) => {
      server.listen(0, () => {
        app = request(server);
        resolve();
      });
    });
  });

  describe('POST /expenses - Input Validation', () => {
    it('should return 400 for invalid date format (YYYY/MM/DD)', async () => {
      const response = await app.post('/expenses')
        .send({
          date: '2024/11/11',
          category: 'Groceries',
          amount: 45.99
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(response.body.error.message).toContain('Invalid date format');
      expect(response.body.error.details.date).toBeDefined();
    });

    it('should return 400 for malformed date format', async () => {
      const response = await app.post('/expenses')
        .send({
          date: '2024-13-45',
          category: 'Groceries',
          amount: 45.99
        });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(response.body.error.message).toContain('Invalid date format');
    });

    it('should return 400 for empty category', async () => {
      const response = await app.post('/expenses')
        .send({
          date: '2024-11-11',
          category: '',
          amount: 45.99
        });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(response.body.error.message).toContain('Category cannot be empty');
      expect(response.body.error.details.category).toBeDefined();
    });

    it('should return 400 for whitespace-only category', async () => {
      const response = await app.post('/expenses')
        .send({
          date: '2024-11-11',
          category: '   ',
          amount: 45.99
        });

      expect(response.status).toBe(400);
      expect(response.body.error.message).toContain('Category cannot be empty');
    });

    it('should return 400 for zero amount', async () => {
      const response = await app.post('/expenses')
        .send({
          date: '2024-11-11',
          category: 'Groceries',
          amount: 0
        });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(response.body.error.message).toContain('Amount must be greater than 0');
      expect(response.body.error.details.amount).toBeDefined();
    });

    it('should return 400 for negative amount', async () => {
      const response = await app.post('/expenses')
        .send({
          date: '2024-11-11',
          category: 'Groceries',
          amount: -50
        });

      expect(response.status).toBe(400);
      expect(response.body.error.message).toContain('Amount must be greater than 0');
    });

    it('should return 400 for string amount instead of number', async () => {
      const response = await app.post('/expenses')
        .send({
          date: '2024-11-11',
          category: 'Groceries',
          amount: 'fifty'
        });

      expect(response.status).toBe(400);
      expect(response.body.error.message).toContain('Amount must be a number');
    });

    it('should return 400 for type mismatch (object as category)', async () => {
      const response = await app.post('/expenses')
        .send({
          date: '2024-11-11',
          category: { name: 'Groceries' },
          amount: 45.99
        });

      expect(response.status).toBe(400);
      expect(response.body.error.message).toContain('Category must be a string');
    });

    it('should return 400 for missing date field', async () => {
      const response = await app.post('/expenses')
        .send({
          category: 'Groceries',
          amount: 45.99
        });

      expect(response.status).toBe(400);
      expect(response.body.error.message).toContain('Date is required');
    });

    it('should return 400 for missing category field', async () => {
      const response = await app.post('/expenses')
        .send({
          date: '2024-11-11',
          amount: 45.99
        });

      expect(response.status).toBe(400);
      expect(response.body.error.message).toContain('Category is required');
    });

    it('should return 400 for missing amount field', async () => {
      const response = await app.post('/expenses')
        .send({
          date: '2024-11-11',
          category: 'Groceries'
        });

      expect(response.status).toBe(400);
      expect(response.body.error.message).toContain('Amount is required');
    });
  });

  describe('GET /expenses/summary - Query Parameter Validation', () => {
    it('should return 400 for invalid month (0)', async () => {
      const response = await app.get('/expenses/summary?month=0');

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(response.body.error.message).toContain('Invalid month');
      expect(response.body.error.details.month).toBeDefined();
    });

    it('should return 400 for invalid month (13)', async () => {
      const response = await app.get('/expenses/summary?month=13');

      expect(response.status).toBe(400);
      expect(response.body.error.message).toContain('Invalid month');
    });

    it('should return 400 for invalid month (14)', async () => {
      const response = await app.get('/expenses/summary?month=14');

      expect(response.status).toBe(400);
      expect(response.body.error.message).toContain('Invalid month');
    });

    it('should return 400 for non-numeric month', async () => {
      const response = await app.get('/expenses/summary?month=abc');

      expect(response.status).toBe(400);
      expect(response.body.error.message).toContain('Month must be a number');
    });

    it('should return 400 for negative month', async () => {
      const response = await app.get('/expenses/summary?month=-1');

      expect(response.status).toBe(400);
      expect(response.body.error.message).toContain('Invalid month');
    });

    it('should return 400 for decimal month', async () => {
      const response = await app.get('/expenses/summary?month=6.5');

      expect(response.status).toBe(400);
      expect(response.body.error.message).toContain('Invalid month');
    });

    it('should accept valid month parameter', async () => {
      const response = await app.get('/expenses/summary?month=11');

      expect(response.status).toBe(200);
      expect(response.body.filters.month).toBe(11);
    });

    it('should accept summary request without month', async () => {
      const response = await app.get('/expenses/summary');

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });
  });

  describe('GET /expenses/{id} - Path Parameter Validation', () => {
    it('should return 404 for non-existent expense ID', async () => {
      const response = await app.get('/expenses/nonexistent-id-12345');

      expect(response.status).toBe(404);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe('NOT_FOUND');
      expect(response.body.error.message).toContain('Expense not found');
    });

    it('should return 404 for numeric ID that does not exist', async () => {
      const response = await app.get('/expenses/999999999');

      expect(response.status).toBe(404);
      expect(response.body.error.message).toContain('Expense not found');
    });

    it('should return 404 for UUID-like ID that does not exist', async () => {
      const response = await app.get('/expenses/550e8400-e29b-41d4-a716-446655440000');

      expect(response.status).toBe(404);
      expect(response.body.error.message).toContain('Expense not found');
    });
  });

  describe('Error Response Structure', () => {
    it('should return error response with standard structure for validation error', async () => {
      const response = await app.post('/expenses')
        .send({
          date: 'invalid-date',
          category: 'Groceries',
          amount: 45.99
        });

      // Verify error response structure matches contract
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBeDefined();
      expect(response.body.error.message).toBeDefined();
      expect(response.body.error.details).toBeDefined();
      expect(typeof response.body.error.code).toBe('string');
      expect(typeof response.body.error.message).toBe('string');
      expect(typeof response.body.error.details).toBe('object');
    });

    it('should return error response with standard structure for not found error', async () => {
      const response = await app.get('/expenses/invalid-id');

      // Verify not found error response structure
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe('NOT_FOUND');
      expect(response.body.error.message).toBeDefined();
      expect(response.body.error.details).toBeDefined();
    });

    it('should include field-specific details in validation error', async () => {
      const response = await app.post('/expenses')
        .send({
          date: '2024-11-11',
          category: '',
          amount: 45.99
        });

      // Verify field-specific details
      expect(response.body.error.details).toHaveProperty('category');
      expect(typeof response.body.error.details.category).toBe('string');
    });
  });
});
