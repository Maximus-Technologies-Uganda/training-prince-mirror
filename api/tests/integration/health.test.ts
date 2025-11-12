/**
 * Integration Tests: GET /healthz (T014)
 * 
 * Purpose: Test the GET /healthz endpoint with realistic HTTP calls via Supertest
 * Validates all acceptance scenarios and response correctness
 * 
 * Acceptance Scenarios:
 * - All scenarios from T001 contract tests
 */

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../src/server.js';

describe('GET /healthz - Integration Tests (T014)', () => {
  describe('Successful Responses', () => {
    /**
     * Test: Returns 200 with correct schema
     */
    it('returns 200 with correct schema', async () => {
      const res = await request(app).get('/healthz');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status');
      expect(res.body).toHaveProperty('version');
      expect(res.body).toHaveProperty('currentTime');
    });

    /**
     * Test: Response includes all required fields
     */
    it('includes all required fields', async () => {
      const res = await request(app).get('/healthz');
      expect(res.body.status).toBeDefined();
      expect(res.body.version).toBeDefined();
      expect(res.body.currentTime).toBeDefined();
    });

    /**
     * Test: currentTime is valid ISO 8601 format
     */
    it('currentTime is valid ISO 8601 format', async () => {
      const res = await request(app).get('/healthz');
      const date = new Date(res.body.currentTime);
      expect(isNaN(date.getTime())).toBe(false);
      expect(res.body.currentTime).toMatch(/Z$/);
    });

    /**
     * Test: Status field indicates operational service
     */
    it('status field indicates operational service', async () => {
      const res = await request(app).get('/healthz');
      expect(res.body.status).toBe('ok');
    });

    /**
     * Test: Version is semantic versioning
     */
    it('version is semantic versioning format', async () => {
      const res = await request(app).get('/healthz');
      expect(res.body.version).toMatch(/^\d+\.\d+\.\d+$/);
    });

    /**
     * Test: Response time is under 100ms
     */
    it('response time is under 100ms', async () => {
      const start = Date.now();
      await request(app).get('/healthz');
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(100);
    });

    /**
     * Test: Content-Type is application/json
     */
    it('Content-Type is application/json', async () => {
      const res = await request(app).get('/healthz');
      expect(res.type).toBe('application/json');
    });
  });

  describe('Idempotency & Consistency', () => {
    /**
     * Test: Multiple requests return consistent status
     */
    it('multiple requests return consistent status', async () => {
      const res1 = await request(app).get('/healthz');
      const res2 = await request(app).get('/healthz');

      expect(res1.body.status).toBe(res2.body.status);
      expect(res1.body.status).toBe('ok');
    });

    /**
     * Test: Multiple requests return consistent version
     */
    it('multiple requests return consistent version', async () => {
      const res1 = await request(app).get('/healthz');
      const res2 = await request(app).get('/healthz');

      expect(res1.body.version).toBe(res2.body.version);
    });
  });
});

