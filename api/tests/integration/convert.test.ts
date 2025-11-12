/**
 * Integration Tests: POST /convert (T015-T016)
 * 
 * Purpose: Test the POST /convert endpoint with realistic HTTP calls via Supertest
 * Validates success scenarios, validation errors, and edge cases
 * 
 * Acceptance Scenarios:
 * - T015: Success cases (Supertest): F→C, C→F, identity
 * - T016: Validation error cases: missing field, invalid types, invalid enums
 */

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../src/server.js';

describe('POST /convert - Integration Tests (T015-T016)', () => {
  describe('Success Cases (T015)', () => {
    /**
     * Test: Convert 32°F to 0°C
     */
    it('converts 32°F to 0°C', async () => {
      const res = await request(app)
        .post('/convert')
        .send({ value: 32, from: 'F', to: 'C' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ value: 0, unit: 'C' });
    });

    /**
     * Test: Convert 0°C to 32°F
     */
    it('converts 0°C to 32°F', async () => {
      const res = await request(app)
        .post('/convert')
        .send({ value: 0, from: 'C', to: 'F' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ value: 32, unit: 'F' });
    });

    /**
     * Test: Identity conversion (100°C to 100°C)
     */
    it('handles identity conversion (C→C)', async () => {
      const res = await request(app)
        .post('/convert')
        .send({ value: 100, from: 'C', to: 'C' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ value: 100, unit: 'C' });
    });

    /**
     * Test: Decimal values
     */
    it('handles decimal temperature values', async () => {
      const res = await request(app)
        .post('/convert')
        .send({ value: 98.6, from: 'F', to: 'C' });

      expect(res.status).toBe(200);
      // 98.6°F ≈ 37°C
      expect(res.body.value).toBeCloseTo(37, 0);
      expect(res.body.unit).toBe('C');
    });

    /**
     * Test: Negative values
     */
    it('handles negative temperature values', async () => {
      const res = await request(app)
        .post('/convert')
        .send({ value: -40, from: 'F', to: 'C' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ value: -40, unit: 'C' });
    });

    /**
     * Test: Content-Type is application/json
     */
    it('returns application/json content type', async () => {
      const res = await request(app)
        .post('/convert')
        .send({ value: 32, from: 'F', to: 'C' });

      expect(res.type).toBe('application/json');
    });
  });

  describe('Validation Error Cases (T016)', () => {
    /**
     * Test: Missing value field
     */
    it('returns 400 for missing value field', async () => {
      const res = await request(app)
        .post('/convert')
        .send({ from: 'F', to: 'C' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
      expect(Array.isArray(res.body.details)).toBe(true);
    });

    /**
     * Test: Missing from field
     */
    it('returns 400 for missing from field', async () => {
      const res = await request(app)
        .post('/convert')
        .send({ value: 32, to: 'C' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
      expect(Array.isArray(res.body.details)).toBe(true);
    });

    /**
     * Test: Missing to field
     */
    it('returns 400 for missing to field', async () => {
      const res = await request(app)
        .post('/convert')
        .send({ value: 32, from: 'F' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
      expect(Array.isArray(res.body.details)).toBe(true);
    });

    /**
     * Test: Non-numeric value
     */
    it('returns 400 for non-numeric value', async () => {
      const res = await request(app)
        .post('/convert')
        .send({ value: '32', from: 'F', to: 'C' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
      expect(Array.isArray(res.body.details)).toBe(true);
    });

    /**
     * Test: Invalid from unit
     */
    it('returns 400 for invalid from unit', async () => {
      const res = await request(app)
        .post('/convert')
        .send({ value: 32, from: 'K', to: 'C' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
      expect(Array.isArray(res.body.details)).toBe(true);
    });

    /**
     * Test: Invalid to unit
     */
    it('returns 400 for invalid to unit', async () => {
      const res = await request(app)
        .post('/convert')
        .send({ value: 32, from: 'F', to: 'K' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
      expect(Array.isArray(res.body.details)).toBe(true);
    });

    /**
     * Test: Lowercase units (case-sensitive)
     */
    it('rejects lowercase unit values (case-sensitive)', async () => {
      const res = await request(app)
        .post('/convert')
        .send({ value: 32, from: 'f', to: 'c' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
    });

    /**
     * Test: All fields missing
     */
    it('returns 400 with details when all fields missing', async () => {
      const res = await request(app).post('/convert').send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
      expect(res.body.details.length).toBeGreaterThan(0);
      expect(res.body.details[0]).toHaveProperty('message');
    });

    /**
     * Test: Error response includes details array with messages
     */
    it('error response includes details array with messages', async () => {
      const res = await request(app)
        .post('/convert')
        .send({ from: 'F', to: 'C' });

      expect(res.body.details).toBeDefined();
      expect(Array.isArray(res.body.details)).toBe(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      res.body.details.forEach((detail: any) => {
        expect(detail.message).toBeDefined();
        expect(typeof detail.message).toBe('string');
      });
    });
  });

  describe('Idempotency & Performance (T015-T016)', () => {
    /**
     * Test: Multiple identical requests produce identical results
     */
    it('produces consistent results for identical requests', async () => {
      const res1 = await request(app)
        .post('/convert')
        .send({ value: 32, from: 'F', to: 'C' });

      const res2 = await request(app)
        .post('/convert')
        .send({ value: 32, from: 'F', to: 'C' });

      expect(res1.status).toBe(200);
      expect(res2.status).toBe(200);
      expect(res1.body.value).toBe(res2.body.value);
      expect(res1.body.unit).toBe(res2.body.unit);
    });

    /**
     * Test: Response time is under 100ms
     */
    it('responds quickly (< 100ms) for valid request', async () => {
      const start = Date.now();
      await request(app)
        .post('/convert')
        .send({ value: 32, from: 'F', to: 'C' });
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(100);
    });

    /**
     * Test: Response time is under 100ms for validation error
     */
    it('responds quickly (< 100ms) for validation error', async () => {
      const start = Date.now();
      await request(app).post('/convert').send({ from: 'F', to: 'C' });
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(100);
    });
  });
});

