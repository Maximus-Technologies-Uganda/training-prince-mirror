/**
 * GET /healthz Route Handler (T011)
 * 
 * Returns service health status, version, and current time.
 * Must pass contract test T001.
 * 
 * Acceptance Scenarios:
 * - Scenario 1: GET /healthz returns 200 with status, version, currentTime
 * - Scenario 2: Response indicates service is operational
 */

import { Request, Response } from 'express';
import type { HealthCheckResponse } from '../types/index.js';

/**
 * Dynamic package.json import to read version at runtime
 * Using import assertion for JSON loading
 */
let packageVersion = '1.0.0';

try {
  // Import package.json with assertion
  import('../../../package.json', { assert: { type: 'json' } })
    .then(pkg => {
      packageVersion = pkg.default.version || '1.0.0';
    })
    .catch(() => {
      // Fallback to default if import fails
      packageVersion = '1.0.0';
    });
} catch {
  // Fallback version if import fails
  packageVersion = '1.0.0';
}

/**
 * GET /healthz handler
 * Returns service health, version, and current time
 */
export const getHealthz = (_req: Request, res: Response<HealthCheckResponse>) => {
  const response: HealthCheckResponse = {
    status: 'ok',
    version: packageVersion,
    currentTime: new Date().toISOString()
  };

  res.status(200).json(response);
};

