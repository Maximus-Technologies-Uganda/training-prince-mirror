/**
 * HTTP Contract Tests for Expense Endpoints
 * 
 * These tests validate the API contract matches the OpenAPI specification.
 * Tests use supertest to make actual HTTP requests and validate responses.
 * 
 * **CRITICAL**: These tests MUST FAIL initially because endpoints don't exist yet.
 * This confirms the spec-first approach (tests written before implementation).
 */

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../src/server.js';

describe('GET /expenses', () => {
  it('should return 200 OK with paginated expense response', async () => {
    const response = await request(app)
      .get('/expenses')
      .set('request-id', 'test-request-id-001')
      .expect(200);
    
    // Validate response structure matches PaginatedExpenseResponse
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('pagination');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.pagination).toHaveProperty('totalItems');
    expect(response.body.pagination).toHaveProperty('currentPage');
    expect(response.body.pagination).toHaveProperty('pageSize');
    expect(response.body.pagination).toHaveProperty('totalPages');
  });

  it('should validate pagination parameters', async () => {
    // Test page parameter
    const responsePage = await request(app)
      .get('/expenses?page=1')
      .set('request-id', 'test-request-id-002')
      .expect(200);
    
    expect(responsePage.body.pagination.currentPage).toBe(1);
    
    // Test pageSize parameter
    const responsePageSize = await request(app)
      .get('/expenses?pageSize=10')
      .set('request-id', 'test-request-id-003')
      .expect(200);
    
    expect(responsePageSize.body.pagination.pageSize).toBe(10);
    
    // Test both parameters
    const responseBoth = await request(app)
      .get('/expenses?page=2&pageSize=10')
      .set('request-id', 'test-request-id-004')
      .expect(200);
    
    expect(responseBoth.body.pagination.currentPage).toBe(2);
    expect(responseBoth.body.pagination.pageSize).toBe(10);
  });

  it('should validate response structure matches OpenAPI spec', async () => {
    const response = await request(app)
      .get('/expenses')
      .set('request-id', 'test-request-id-005')
      .expect(200);
    
    // Validate wrapped response structure
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('pagination');
    
    // Validate pagination metadata
    expect(typeof response.body.pagination.totalItems).toBe('number');
    expect(typeof response.body.pagination.currentPage).toBe('number');
    expect(typeof response.body.pagination.pageSize).toBe('number');
    expect(typeof response.body.pagination.totalPages).toBe('number');
    
    // Validate expense objects in data array
    if (response.body.data.length > 0) {
      const expense = response.body.data[0];
      expect(expense).toHaveProperty('id');
      expect(expense).toHaveProperty('amount');
      expect(expense).toHaveProperty('category');
      expect(expense).toHaveProperty('date');
    }
  });

  it('should return error responses matching ErrorEnvelope schema', async () => {
    // Test invalid pagination parameters (should return 400)
    const responseInvalidPage = await request(app)
      .get('/expenses?page=0')
      .set('request-id', 'test-request-id-006')
      .expect(400);
    
    expect(responseInvalidPage.body).toHaveProperty('code', 'VALIDATION_ERROR');
    expect(responseInvalidPage.body).toHaveProperty('message');
    expect(responseInvalidPage.body).toHaveProperty('details');
    expect(responseInvalidPage.body).toHaveProperty('requestId', 'test-request-id-006');
    
    const responseInvalidPageSize = await request(app)
      .get('/expenses?pageSize=200')
      .set('request-id', 'test-request-id-007')
      .expect(400);
    
    expect(responseInvalidPageSize.body).toHaveProperty('code', 'VALIDATION_ERROR');
    expect(responseInvalidPageSize.body).toHaveProperty('requestId', 'test-request-id-007');
  });

  it('should handle request-id header and echo it in error responses', async () => {
    const requestId = '550e8400-e29b-41d4-a716-446655440000';
    const response = await request(app)
      .get('/expenses?page=0')
      .set('request-id', requestId)
      .expect(400);
    
    expect(response.body).toHaveProperty('requestId', requestId);
  });
});

describe('POST /expenses', () => {
  it('should return 201 Created with created expense', async () => {
    const response = await request(app)
      .post('/expenses')
      .set('request-id', 'test-request-id-008')
      .send({
        amount: 25.50,
        category: 'food',
        date: '2025-11-05'
      })
      .expect(201);
    
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('amount', 25.50);
    expect(response.body).toHaveProperty('category', 'food');
    expect(response.body).toHaveProperty('date', '2025-11-05');
  });

  it('should validate valid request body (amount, category, date)', async () => {
    const response = await request(app)
      .post('/expenses')
      .set('request-id', 'test-request-id-009')
      .set('Content-Type', 'application/json')
      .send({
        amount: 25.50,
        category: 'food',
        date: '2025-11-05'
      })
      .expect(201);
    
    expect(response.body).toHaveProperty('id');
    expect(typeof response.body.id).toBe('string');
    expect(response.body.id.length).toBe(36); // UUID format
  });

  it('should validate 201 Created response matches Expense schema', async () => {
    const response = await request(app)
      .post('/expenses')
      .set('request-id', 'test-request-id-010')
      .send({
        amount: 100.00,
        category: 'transport',
        date: '2025-11-01'
      })
      .expect(201);
    
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('amount', 100.00);
    expect(response.body).toHaveProperty('category', 'transport');
    expect(response.body).toHaveProperty('date', '2025-11-01');
    expect(Object.keys(response.body)).toHaveLength(4);
  });

  it('should return validation errors (400) matching ErrorEnvelope schema', async () => {
    // Test negative amount
    const responseNegative = await request(app)
      .post('/expenses')
      .set('request-id', 'test-request-id-011')
      .send({
        amount: -10,
        category: 'food',
        date: '2025-11-05'
      })
      .expect(400);
    
    expect(responseNegative.body).toHaveProperty('code', 'VALIDATION_ERROR');
    expect(responseNegative.body).toHaveProperty('message');
    expect(responseNegative.body).toHaveProperty('details');
    expect(Array.isArray(responseNegative.body.details)).toBe(true);
    expect(responseNegative.body.details[0]).toHaveProperty('field');
    expect(responseNegative.body.details[0]).toHaveProperty('message');
    expect(responseNegative.body.details[0]).toHaveProperty('value', -10);
    
    // Test missing required field
    const responseMissing = await request(app)
      .post('/expenses')
      .set('request-id', 'test-request-id-012')
      .send({
        amount: 25.50
        // Missing category and date
      })
      .expect(400);
    
    expect(responseMissing.body.code).toBe('VALIDATION_ERROR');
    expect(responseMissing.body.details.length).toBeGreaterThan(0);
    
    // Test invalid date format
    const responseInvalidDate = await request(app)
      .post('/expenses')
      .set('request-id', 'test-request-id-013')
      .send({
        amount: 25.50,
        category: 'food',
        date: '11/05/2025' // Invalid format
      })
      .expect(400);
    
    expect(responseInvalidDate.body.code).toBe('VALIDATION_ERROR');
    expect(responseInvalidDate.body.details.some((d: any) => d.field === 'date')).toBe(true);
  });

  it('should handle request-id header and echo it in error responses', async () => {
    const requestId = '550e8400-e29b-41d4-a716-446655440000';
    const response = await request(app)
      .post('/expenses')
      .set('request-id', requestId)
      .send({
        amount: -10, // Invalid amount to trigger error
        category: 'food',
        date: '2025-11-05'
      })
      .expect(400);
    
    expect(response.body).toHaveProperty('requestId', requestId);
  });
});

describe('GET /expenses/summary', () => {
  it('should return 200 OK with expense summary', async () => {
    const response = await request(app)
      .get('/expenses/summary')
      .set('request-id', 'test-request-id-014')
      .expect(200);
    
    expect(response.body).toHaveProperty('total');
    expect(response.body).toHaveProperty('count');
    expect(response.body).toHaveProperty('filters');
  });

  it('should validate query parameters (category, month)', async () => {
    // Test category filter
    const responseCategory = await request(app)
      .get('/expenses/summary?category=food')
      .set('request-id', 'test-request-id-015')
      .expect(200);
    
    expect(responseCategory.body.filters).toHaveProperty('category', 'food');
    
    // Test month filter
    const responseMonth = await request(app)
      .get('/expenses/summary?month=2025-11')
      .set('request-id', 'test-request-id-016')
      .expect(200);
    
    expect(responseMonth.body.filters).toHaveProperty('month', '2025-11');
    
    // Test both filters
    const responseBoth = await request(app)
      .get('/expenses/summary?category=food&month=2025-11')
      .set('request-id', 'test-request-id-017')
      .expect(200);
    
    expect(responseBoth.body.filters).toHaveProperty('category', 'food');
    expect(responseBoth.body.filters).toHaveProperty('month', '2025-11');
    
    // Test no filters
    const responseNoFilters = await request(app)
      .get('/expenses/summary')
      .set('request-id', 'test-request-id-018')
      .expect(200);
    
    expect(responseNoFilters.body.filters).toEqual({});
  });

  it('should validate response structure matches ExpenseSummary schema', async () => {
    const response = await request(app)
      .get('/expenses/summary')
      .set('request-id', 'test-request-id-019')
      .expect(200);
    
    expect(typeof response.body.total).toBe('number');
    expect(response.body.total).toBeGreaterThanOrEqual(0);
    expect(typeof response.body.count).toBe('number');
    expect(response.body.count).toBeGreaterThanOrEqual(0);
    expect(typeof response.body.filters).toBe('object');
  });

  it('should return error responses matching ErrorEnvelope schema', async () => {
    // Test invalid month format (should return 400)
    const responseInvalidMonth = await request(app)
      .get('/expenses/summary?month=2025-11-05')
      .set('request-id', 'test-request-id-020')
      .expect(400);
    
    expect(responseInvalidMonth.body).toHaveProperty('code', 'VALIDATION_ERROR');
    expect(responseInvalidMonth.body).toHaveProperty('message');
    expect(responseInvalidMonth.body).toHaveProperty('details');
    expect(responseInvalidMonth.body).toHaveProperty('requestId', 'test-request-id-020');
  });

  it('should handle request-id header and echo it in error responses', async () => {
    const requestId = '550e8400-e29b-41d4-a716-446655440000';
    const response = await request(app)
      .get('/expenses/summary?month=invalid')
      .set('request-id', requestId)
      .expect(400);
    
    expect(response.body).toHaveProperty('requestId', requestId);
  });
});
