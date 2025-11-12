/**
 * Contract Test: GET /health
 * 
 * This test validates that the GET /health endpoint implementation
 * matches the OpenAPI specification in /api/spec/openapi.yaml
 * 
 * IMPORTANT: This test must FAIL initially (no implementation exists yet).
 * Once the endpoint is implemented, this test should PASS.
 * 
 * Feature: Week 5 Day-0: API Scaffolding and Spec-First Setup
 */

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../api/src/server'; // Will be created during implementation

describe('GET /health - Contract Test', () => {
  it('should return 200 status code', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);
    
    expect(response.status).toBe(200);
  });

  it('should return JSON response with status field', async () => {
    const response = await request(app)
      .get('/health')
      .expect('Content-Type', /json/);
    
    expect(response.body).toHaveProperty('status');
    expect(typeof response.body.status).toBe('string');
  });

  it('should return status "ok"', async () => {
    const response = await request(app)
      .get('/health');
    
    expect(response.body.status).toBe('ok');
  });

  it('should return timestamp field', async () => {
    const response = await request(app)
      .get('/health');
    
    expect(response.body).toHaveProperty('timestamp');
    expect(typeof response.body.timestamp).toBe('string');
    // Validate ISO 8601 format
    expect(response.body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  it('should match OpenAPI specification schema', async () => {
    const response = await request(app)
      .get('/health');
    
    // Response must match OpenAPI schema:
    // {
    //   type: "object",
    //   properties: {
    //     status: { type: "string", example: "ok" },
    //     timestamp: { type: "string", format: "date-time" }
    //   },
    //   required: ["status", "timestamp"]
    // }
    
    expect(response.body).toHaveProperty('status');
    expect(response.body).toHaveProperty('timestamp');
    expect(Object.keys(response.body).length).toBe(2); // Only status and timestamp
  });
});

