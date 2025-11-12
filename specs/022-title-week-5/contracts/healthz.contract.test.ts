/**
 * Contract Test: GET /healthz
 * 
 * Purpose: Validate that the GET /healthz endpoint conforms to the OpenAPI contract
 * Status: Failing by design (will pass after implementation)
 * 
 * Contract Specification (from spec.md):
 * - Endpoint: GET /healthz
 * - Response: HTTP 200 OK
 * - Schema: { status: string, version: string, currentTime: string (ISO 8601) }
 * 
 * Acceptance Scenarios Covered:
 * - Scenario 1: API server running → GET /healthz → 200 with status, version, currentTime
 * - Scenario 2: API server running → Check /healthz → response indicates service operational
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { z } from 'zod';

// Mock Express app for testing
// In real implementation, this imports the actual server
let app: any;

/**
 * Define the health check response schema from the OpenAPI contract
 */
const HealthCheckResponseSchema = z.object({
  status: z.string().min(1),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  currentTime: z.string().datetime({ offset: true }).or(z.string().regex(/Z$/))
});

type HealthCheckResponse = z.infer<typeof HealthCheckResponseSchema>;

describe('GET /healthz - Contract Tests', () => {
  /**
   * Setup: Start Express server before all tests
   * In real implementation, this creates/starts the app
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

  describe('Response Schema Compliance', () => {
    /**
     * Test 1: Response has correct HTTP status
     * 
     * Acceptance: Scenario 1 - GET /healthz returns 200
     */
    it('should return HTTP 200 status', async () => {
      const response = await request(app).get('/healthz');
      
      expect(response.status).toBe(200);
    });

    /**
     * Test 2: Response includes required fields
     * 
     * Acceptance: Scenario 1 - Response includes status, version, currentTime
     */
    it('should return response with required fields', async () => {
      const response = await request(app).get('/healthz');
      
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('currentTime');
    });

    /**
     * Test 3: Response fields match types from schema
     * 
     * Acceptance: Scenario 1 - All fields present with correct types
     */
    it('should return fields with correct types', async () => {
      const response = await request(app).get('/healthz');
      
      expect(typeof response.body.status).toBe('string');
      expect(typeof response.body.version).toBe('string');
      expect(typeof response.body.currentTime).toBe('string');
    });

    /**
     * Test 4: Response schema validates against Zod contract
     * 
     * Acceptance: Scenario 1 - Full schema validation passes
     */
    it('should match HealthCheckResponseSchema contract', async () => {
      const response = await request(app).get('/healthz');
      
      const result = HealthCheckResponseSchema.safeParse(response.body);
      expect(result.success).toBe(true);
      
      if (result.success) {
        const data: HealthCheckResponse = result.data;
        
        // Verify specific contract requirements
        expect(data.status).toBeTruthy(); // Non-empty string
        expect(data.version).toMatch(/^\d+\.\d+\.\d+$/); // Semantic version
        expect(data.currentTime).toMatch(/Z$/); // ISO 8601 UTC
      }
    });

    /**
     * Test 5: Status field indicates service is healthy
     * 
     * Acceptance: Scenario 2 - Response indicates service operational
     */
    it('should indicate service is operational via status field', async () => {
      const response = await request(app).get('/healthz');
      
      // Expected values: "ok", "healthy", "running", etc.
      // Contract specifies "ok" as standard value
      expect(['ok', 'healthy', 'running'].includes(response.body.status)).toBe(true);
    });

    /**
     * Test 6: Version field is valid semantic version
     * 
     * Acceptance: Scenario 2 - Version information provided
     */
    it('should provide valid semantic version', async () => {
      const response = await request(app).get('/healthz');
      
      const versionRegex = /^\d+\.\d+\.\d+$/;
      expect(response.body.version).toMatch(versionRegex);
      
      // Should match package.json version
      const packageVersion = require('../../../api/package.json').version;
      expect(response.body.version).toBe(packageVersion);
    });

    /**
     * Test 7: Current time is valid ISO 8601 format
     * 
     * Acceptance: Scenario 2 - Current time provided
     */
    it('should provide valid ISO 8601 timestamp', async () => {
      const response = await request(app).get('/healthz');
      
      // Parse to verify it's valid ISO 8601
      const date = new Date(response.body.currentTime);
      expect(isNaN(date.getTime())).toBe(false);
      
      // Should include Z for UTC
      expect(response.body.currentTime).toMatch(/Z$/);
    });

    /**
     * Test 8: Response time is acceptable
     * 
     * Acceptance: Performance requirement - sub-100ms response
     */
    it('should respond quickly (< 100ms)', async () => {
      const start = Date.now();
      const response = await request(app).get('/healthz');
      const duration = Date.now() - start;
      
      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(100);
    });
  });

  describe('Content-Type Header', () => {
    /**
     * Test 9: Response includes Content-Type header
     * 
     * Contract: application/json header required
     */
    it('should return application/json content type', async () => {
      const response = await request(app).get('/healthz');
      
      expect(response.type).toBe('application/json');
    });
  });

  describe('Edge Cases', () => {
    /**
     * Test 10: Multiple consecutive requests work correctly
     * 
     * Ensures endpoint is idempotent
     */
    it('should handle multiple requests correctly', async () => {
      const response1 = await request(app).get('/healthz');
      const response2 = await request(app).get('/healthz');
      
      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
      
      // Both should be valid
      expect(HealthCheckResponseSchema.safeParse(response1.body).success).toBe(true);
      expect(HealthCheckResponseSchema.safeParse(response2.body).success).toBe(true);
      
      // Current time should be different (or very close)
      expect(response1.body.currentTime).toBeDefined();
      expect(response2.body.currentTime).toBeDefined();
    });

    /**
     * Test 11: Status field remains consistent
     * 
     * Ensures status doesn't change between requests
     */
    it('should return consistent status value', async () => {
      const response1 = await request(app).get('/healthz');
      const response2 = await request(app).get('/healthz');
      
      expect(response1.body.status).toBe(response2.body.status);
    });

    /**
     * Test 12: Version field remains consistent
     * 
     * Ensures version matches package.json throughout session
     */
    it('should return consistent version value', async () => {
      const response1 = await request(app).get('/healthz');
      const response2 = await request(app).get('/healthz');
      
      expect(response1.body.version).toBe(response2.body.version);
    });
  });
});

