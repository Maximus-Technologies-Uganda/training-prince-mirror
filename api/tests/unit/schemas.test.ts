/**
 * Unit Tests: Validation Schemas (T018)
 * 
 * Purpose: Test Zod schemas in isolation using Vitest
 * Validates request/response schema validation and error handling
 */

import { describe, it, expect } from 'vitest';
import {
  ConversionRequestSchema,
  ConversionResponseSchema,
  HealthCheckResponseSchema
} from '../../src/schemas/index.js';

describe('Validation Schemas - Unit Tests (T018)', () => {
  describe('ConversionRequestSchema', () => {
    /**
     * Test: Accepts valid conversion request
     */
    it('accepts valid conversion request', () => {
      const result = ConversionRequestSchema.safeParse({
        value: 32,
        from: 'F',
        to: 'C'
      });
      expect(result.success).toBe(true);
    });

    /**
     * Test: Accepts decimal values
     */
    it('accepts decimal values', () => {
      const result = ConversionRequestSchema.safeParse({
        value: 98.6,
        from: 'F',
        to: 'C'
      });
      expect(result.success).toBe(true);
    });

    /**
     * Test: Accepts negative values
     */
    it('accepts negative values', () => {
      const result = ConversionRequestSchema.safeParse({
        value: -40,
        from: 'F',
        to: 'C'
      });
      expect(result.success).toBe(true);
    });

    /**
     * Test: Accepts identity conversion
     */
    it('accepts identity conversion (C→C)', () => {
      const result = ConversionRequestSchema.safeParse({
        value: 100,
        from: 'C',
        to: 'C'
      });
      expect(result.success).toBe(true);
    });

    /**
     * Test: Rejects missing value field
     */
    it('rejects missing value field', () => {
      const result = ConversionRequestSchema.safeParse({
        from: 'F',
        to: 'C'
      });
      expect(result.success).toBe(false);
    });

    /**
     * Test: Rejects missing from field
     */
    it('rejects missing from field', () => {
      const result = ConversionRequestSchema.safeParse({
        value: 32,
        to: 'C'
      });
      expect(result.success).toBe(false);
    });

    /**
     * Test: Rejects missing to field
     */
    it('rejects missing to field', () => {
      const result = ConversionRequestSchema.safeParse({
        value: 32,
        from: 'F'
      });
      expect(result.success).toBe(false);
    });

    /**
     * Test: Rejects non-numeric value
     */
    it('rejects non-numeric value', () => {
      const result = ConversionRequestSchema.safeParse({
        value: '32',
        from: 'F',
        to: 'C'
      });
      expect(result.success).toBe(false);
    });

    /**
     * Test: Rejects invalid from unit
     */
    it('rejects invalid from unit', () => {
      const result = ConversionRequestSchema.safeParse({
        value: 32,
        from: 'K',
        to: 'C'
      });
      expect(result.success).toBe(false);
    });

    /**
     * Test: Rejects invalid to unit
     */
    it('rejects invalid to unit', () => {
      const result = ConversionRequestSchema.safeParse({
        value: 32,
        from: 'F',
        to: 'K'
      });
      expect(result.success).toBe(false);
    });

    /**
     * Test: Rejects lowercase units (case-sensitive)
     */
    it('rejects lowercase units (case-sensitive)', () => {
      const result = ConversionRequestSchema.safeParse({
        value: 32,
        from: 'f',
        to: 'c'
      });
      expect(result.success).toBe(false);
    });
  });

  describe('ConversionResponseSchema', () => {
    /**
     * Test: Accepts valid conversion response
     */
    it('accepts valid conversion response', () => {
      const result = ConversionResponseSchema.safeParse({
        value: 0,
        unit: 'C'
      });
      expect(result.success).toBe(true);
    });

    /**
     * Test: Accepts decimal values
     */
    it('accepts decimal values', () => {
      const result = ConversionResponseSchema.safeParse({
        value: 37.777,
        unit: 'C'
      });
      expect(result.success).toBe(true);
    });

    /**
     * Test: Accepts negative values
     */
    it('accepts negative values', () => {
      const result = ConversionResponseSchema.safeParse({
        value: -40,
        unit: 'C'
      });
      expect(result.success).toBe(true);
    });

    /**
     * Test: Rejects missing value
     */
    it('rejects missing value', () => {
      const result = ConversionResponseSchema.safeParse({
        unit: 'C'
      });
      expect(result.success).toBe(false);
    });

    /**
     * Test: Rejects missing unit
     */
    it('rejects missing unit', () => {
      const result = ConversionResponseSchema.safeParse({
        value: 0
      });
      expect(result.success).toBe(false);
    });

    /**
     * Test: Rejects non-numeric value
     */
    it('rejects non-numeric value', () => {
      const result = ConversionResponseSchema.safeParse({
        value: '0',
        unit: 'C'
      });
      expect(result.success).toBe(false);
    });

    /**
     * Test: Rejects invalid unit
     */
    it('rejects invalid unit', () => {
      const result = ConversionResponseSchema.safeParse({
        value: 0,
        unit: 'K'
      });
      expect(result.success).toBe(false);
    });
  });

  describe('HealthCheckResponseSchema', () => {
    /**
     * Test: Accepts valid health check response
     */
    it('accepts valid health check response', () => {
      const result = HealthCheckResponseSchema.safeParse({
        status: 'ok',
        version: '1.0.0',
        currentTime: new Date().toISOString()
      });
      expect(result.success).toBe(true);
    });

    /**
     * Test: Accepts different status values
     */
    it('accepts different status values', () => {
      const result = HealthCheckResponseSchema.safeParse({
        status: 'healthy',
        version: '1.0.0',
        currentTime: new Date().toISOString()
      });
      expect(result.success).toBe(true);
    });

    /**
     * Test: Accepts various semantic versions
     */
    it('accepts various semantic versions', () => {
      const versions = ['0.0.1', '1.0.0', '2.5.10', '10.100.1000'];
      versions.forEach(version => {
        const result = HealthCheckResponseSchema.safeParse({
          status: 'ok',
          version: version,
          currentTime: new Date().toISOString()
        });
        expect(result.success).toBe(true);
      });
    });

    /**
     * Test: Accepts valid ISO 8601 timestamps
     */
    it('accepts valid ISO 8601 timestamps', () => {
      const timestamps = [
        new Date().toISOString(),
        '2025-01-27T12:00:00Z',
        '2025-01-27T12:00:00.000Z'
      ];
      timestamps.forEach(timestamp => {
        const result = HealthCheckResponseSchema.safeParse({
          status: 'ok',
          version: '1.0.0',
          currentTime: timestamp
        });
        expect(result.success).toBe(true);
      });
    });

    /**
     * Test: Rejects missing status
     */
    it('rejects missing status', () => {
      const result = HealthCheckResponseSchema.safeParse({
        version: '1.0.0',
        currentTime: new Date().toISOString()
      });
      expect(result.success).toBe(false);
    });

    /**
     * Test: Rejects empty status
     */
    it('rejects empty status', () => {
      const result = HealthCheckResponseSchema.safeParse({
        status: '',
        version: '1.0.0',
        currentTime: new Date().toISOString()
      });
      expect(result.success).toBe(false);
    });

    /**
     * Test: Rejects missing version
     */
    it('rejects missing version', () => {
      const result = HealthCheckResponseSchema.safeParse({
        status: 'ok',
        currentTime: new Date().toISOString()
      });
      expect(result.success).toBe(false);
    });

    /**
     * Test: Rejects invalid semantic version format
     */
    it('rejects invalid semantic version format', () => {
      const invalidVersions = ['1.0', '1', '1.0.0.0', 'v1.0.0', '1.0.beta'];
      invalidVersions.forEach(version => {
        const result = HealthCheckResponseSchema.safeParse({
          status: 'ok',
          version: version,
          currentTime: new Date().toISOString()
        });
        expect(result.success).toBe(false);
      });
    });

    /**
     * Test: Rejects missing currentTime
     */
    it('rejects missing currentTime', () => {
      const result = HealthCheckResponseSchema.safeParse({
        status: 'ok',
        version: '1.0.0'
      });
      expect(result.success).toBe(false);
    });

    /**
     * Test: Rejects invalid ISO 8601 timestamps
     */
    it('rejects invalid ISO 8601 timestamps', () => {
      const invalidTimestamps = [
        'not a date',
        '2025-01-27',
        '12:00:00',
        'Mon Jan 27 2025 12:00:00 GMT'
      ];
      invalidTimestamps.forEach(timestamp => {
        const result = HealthCheckResponseSchema.safeParse({
          status: 'ok',
          version: '1.0.0',
          currentTime: timestamp
        });
        expect(result.success).toBe(false);
      });
    });
  });
});

