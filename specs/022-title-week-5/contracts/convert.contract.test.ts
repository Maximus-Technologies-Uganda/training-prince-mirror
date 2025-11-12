/**
 * Contract Test: POST /convert
 * 
 * Purpose: Validate that the POST /convert endpoint conforms to the OpenAPI contract
 * Status: Failing by design (will pass after implementation)
 * 
 * Contract Specification (from spec.md):
 * - Endpoint: POST /convert
 * - Request Body: { value: number, from: "C"|"F", to: "C"|"F" }
 * - Success Response: HTTP 200 OK → { value: number, unit: "C"|"F" }
 * - Error Response: HTTP 400 Bad Request → { error: "Validation failed", details: [...] }
 * 
 * Acceptance Scenarios Covered:
 * - Scenario 3: POST /convert F→C (32°F → 0°C) returns 200 with correct value
 * - Scenario 4: POST /convert C→F (0°C → 32°F) returns 200 with correct value
 * - Scenario 5: POST /convert C→C (100°C → 100°C) returns 200 with same value
 * - Scenario 6: POST /convert missing field returns 400 with error
 * - Scenario 7: POST /convert invalid from unit returns 400 with error
 * - Scenario 8: POST /convert invalid to unit returns 400 with error
 * - Scenario 9: POST /convert non-numeric value returns 400 with error
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { z } from 'zod';

// Mock Express app for testing
// In real implementation, this imports the actual server
let app: any;

/**
 * Define schemas from OpenAPI contract
 */
const ConversionRequestSchema = z.object({
  value: z.number(),
  from: z.enum(['C', 'F']),
  to: z.enum(['C', 'F'])
});

const ConversionResponseSchema = z.object({
  value: z.number(),
  unit: z.enum(['C', 'F'])
});

const ValidationErrorResponseSchema = z.object({
  error: z.literal('Validation failed'),
  details: z.array(z.object({
    code: z.string().optional(),
    path: z.array(z.union([z.string(), z.number()])).optional(),
    message: z.string()
  }))
});

type ConversionResponse = z.infer<typeof ConversionResponseSchema>;
type ValidationErrorResponse = z.infer<typeof ValidationErrorResponseSchema>;

describe('POST /convert - Contract Tests', () => {
  /**
   * Setup: Start Express server before all tests
   */
  beforeAll(() => {
    // Server setup will happen during implementation
    // app = createApp();
  });

  /**
   * Teardown: Stop server after all tests
   */
  afterAll(async () => {
    // Cleanup code
  });

  describe('Success Cases - Response Schema', () => {
    /**
     * Test 1: POST /convert with valid F→C conversion
     * 
     * Acceptance: Scenario 3
     */
    it('should convert 32°F to 0°C and return 200 with correct schema', async () => {
      const request_body = { value: 32, from: 'F' as const, to: 'C' as const };
      
      const response = await request(app)
        .post('/convert')
        .send(request_body)
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBe(200);
      
      // Validate response schema
      const parseResult = ConversionResponseSchema.safeParse(response.body);
      expect(parseResult.success).toBe(true);
      
      if (parseResult.success) {
        const data: ConversionResponse = parseResult.data;
        expect(data.value).toBe(0); // 32°F = 0°C
        expect(data.unit).toBe('C');
      }
    });

    /**
     * Test 2: POST /convert with valid C→F conversion
     * 
     * Acceptance: Scenario 4
     */
    it('should convert 0°C to 32°F and return 200 with correct schema', async () => {
      const request_body = { value: 0, from: 'C' as const, to: 'F' as const };
      
      const response = await request(app)
        .post('/convert')
        .send(request_body)
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBe(200);
      
      // Validate response schema
      const parseResult = ConversionResponseSchema.safeParse(response.body);
      expect(parseResult.success).toBe(true);
      
      if (parseResult.success) {
        const data: ConversionResponse = parseResult.data;
        expect(data.value).toBe(32); // 0°C = 32°F
        expect(data.unit).toBe('F');
      }
    });

    /**
     * Test 3: POST /convert with identity conversion (C→C)
     * 
     * Acceptance: Scenario 5
     */
    it('should handle identity conversion (C→C) and return same value with 200', async () => {
      const request_body = { value: 100, from: 'C' as const, to: 'C' as const };
      
      const response = await request(app)
        .post('/convert')
        .send(request_body)
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBe(200);
      
      // Validate response schema
      const parseResult = ConversionResponseSchema.safeParse(response.body);
      expect(parseResult.success).toBe(true);
      
      if (parseResult.success) {
        const data: ConversionResponse = parseResult.data;
        expect(data.value).toBe(100); // No conversion needed
        expect(data.unit).toBe('C');
      }
    });

    /**
     * Test 4: Response includes Content-Type header
     */
    it('should return application/json content type', async () => {
      const request_body = { value: 32, from: 'F' as const, to: 'C' as const };
      
      const response = await request(app)
        .post('/convert')
        .send(request_body)
        .set('Content-Type', 'application/json');
      
      expect(response.type).toBe('application/json');
    });

    /**
     * Test 5: Decimal values are preserved
     */
    it('should handle decimal temperature values', async () => {
      const request_body = { value: 98.6, from: 'F' as const, to: 'C' as const };
      
      const response = await request(app)
        .post('/convert')
        .send(request_body)
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBe(200);
      
      const parseResult = ConversionResponseSchema.safeParse(response.body);
      expect(parseResult.success).toBe(true);
      
      if (parseResult.success) {
        const data: ConversionResponse = parseResult.data;
        // 98.6°F ≈ 37°C
        expect(data.value).toBeCloseTo(37, 0);
        expect(data.unit).toBe('C');
      }
    });

    /**
     * Test 6: Negative temperature values work correctly
     */
    it('should handle negative temperature values', async () => {
      const request_body = { value: -40, from: 'F' as const, to: 'C' as const };
      
      const response = await request(app)
        .post('/convert')
        .send(request_body)
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBe(200);
      
      const parseResult = ConversionResponseSchema.safeParse(response.body);
      expect(parseResult.success).toBe(true);
      
      if (parseResult.success) {
        const data: ConversionResponse = parseResult.data;
        // -40°F = -40°C (special point)
        expect(data.value).toBe(-40);
        expect(data.unit).toBe('C');
      }
    });
  });

  describe('Validation Error Cases - Error Schema', () => {
    /**
     * Test 7: Missing required field (value)
     * 
     * Acceptance: Scenario 6
     */
    it('should return 400 with error schema when value field is missing', async () => {
      const request_body = { from: 'F', to: 'C' } as any; // Missing value
      
      const response = await request(app)
        .post('/convert')
        .send(request_body)
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBe(400);
      
      // Validate error response schema
      const parseResult = ValidationErrorResponseSchema.safeParse(response.body);
      expect(parseResult.success).toBe(true);
      
      if (parseResult.success) {
        const data: ValidationErrorResponse = parseResult.data;
        expect(data.error).toBe('Validation failed');
        expect(Array.isArray(data.details)).toBe(true);
        expect(data.details.length).toBeGreaterThan(0);
        
        // Should mention 'value' field
        const hasValueError = data.details.some(d => 
          (d.path?.includes('value') || d.message.toLowerCase().includes('value'))
        );
        expect(hasValueError).toBe(true);
      }
    });

    /**
     * Test 8: Invalid from unit
     * 
     * Acceptance: Scenario 7
     */
    it('should return 400 with error schema when from unit is invalid', async () => {
      const request_body = { value: 32, from: 'K', to: 'C' } as any; // K is not valid
      
      const response = await request(app)
        .post('/convert')
        .send(request_body)
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBe(400);
      
      // Validate error response schema
      const parseResult = ValidationErrorResponseSchema.safeParse(response.body);
      expect(parseResult.success).toBe(true);
      
      if (parseResult.success) {
        const data: ValidationErrorResponse = parseResult.data;
        expect(data.error).toBe('Validation failed');
        expect(Array.isArray(data.details)).toBe(true);
        
        // Should mention 'from' field
        const hasFromError = data.details.some(d => 
          (d.path?.includes('from') || d.message.toLowerCase().includes('from'))
        );
        expect(hasFromError).toBe(true);
      }
    });

    /**
     * Test 9: Invalid to unit
     * 
     * Acceptance: Scenario 8
     */
    it('should return 400 with error schema when to unit is invalid', async () => {
      const request_body = { value: 32, from: 'F', to: 'K' } as any; // K is not valid
      
      const response = await request(app)
        .post('/convert')
        .send(request_body)
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBe(400);
      
      // Validate error response schema
      const parseResult = ValidationErrorResponseSchema.safeParse(response.body);
      expect(parseResult.success).toBe(true);
      
      if (parseResult.success) {
        const data: ValidationErrorResponse = parseResult.data;
        expect(data.error).toBe('Validation failed');
        
        // Should mention 'to' field
        const hasToError = data.details.some(d => 
          (d.path?.includes('to') || d.message.toLowerCase().includes('to'))
        );
        expect(hasToError).toBe(true);
      }
    });

    /**
     * Test 10: Non-numeric value
     * 
     * Acceptance: Scenario 9
     */
    it('should return 400 with error schema when value is not a number', async () => {
      const request_body = { value: '32', from: 'F', to: 'C' }; // String instead of number
      
      const response = await request(app)
        .post('/convert')
        .send(request_body)
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBe(400);
      
      // Validate error response schema
      const parseResult = ValidationErrorResponseSchema.safeParse(response.body);
      expect(parseResult.success).toBe(true);
      
      if (parseResult.success) {
        const data: ValidationErrorResponse = parseResult.data;
        expect(data.error).toBe('Validation failed');
        
        // Should mention 'value' field
        const hasValueError = data.details.some(d => 
          (d.path?.includes('value') || d.message.toLowerCase().includes('value') || d.message.toLowerCase().includes('number'))
        );
        expect(hasValueError).toBe(true);
      }
    });

    /**
     * Test 11: Error response includes details array
     */
    it('should include details array in error response', async () => {
      const request_body = {} as any; // All fields missing
      
      const response = await request(app)
        .post('/convert')
        .send(request_body)
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('details');
      expect(Array.isArray(response.body.details)).toBe(true);
      expect(response.body.details.length).toBeGreaterThan(0);
      
      // Each detail should have a message
      response.body.details.forEach((detail: any) => {
        expect(detail).toHaveProperty('message');
        expect(typeof detail.message).toBe('string');
      });
    });

    /**
     * Test 12: Case-sensitive unit validation
     * 
     * Lowercase units should be rejected
     */
    it('should reject lowercase unit values (case-sensitive)', async () => {
      const request_body = { value: 32, from: 'f', to: 'c' } as any; // Lowercase
      
      const response = await request(app)
        .post('/convert')
        .send(request_body)
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBe(400);
      
      const parseResult = ValidationErrorResponseSchema.safeParse(response.body);
      expect(parseResult.success).toBe(true);
    });
  });

  describe('Response Time', () => {
    /**
     * Test 13: Response time is acceptable
     * 
     * Acceptance: Performance requirement - sub-100ms response
     */
    it('should respond quickly for valid request (< 100ms)', async () => {
      const request_body = { value: 32, from: 'F' as const, to: 'C' as const };
      
      const start = Date.now();
      const response = await request(app)
        .post('/convert')
        .send(request_body)
        .set('Content-Type', 'application/json');
      const duration = Date.now() - start;
      
      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(100);
    });
  });

  describe('Idempotency', () => {
    /**
     * Test 14: Multiple identical requests produce identical results
     */
    it('should produce consistent results for identical requests', async () => {
      const request_body = { value: 32, from: 'F' as const, to: 'C' as const };
      
      const response1 = await request(app)
        .post('/convert')
        .send(request_body)
        .set('Content-Type', 'application/json');
      
      const response2 = await request(app)
        .post('/convert')
        .send(request_body)
        .set('Content-Type', 'application/json');
      
      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
      expect(response1.body.value).toBe(response2.body.value);
      expect(response1.body.unit).toBe(response2.body.unit);
    });
  });
});

