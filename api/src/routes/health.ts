import { Request, Response } from 'express';
import type { HealthResponse } from '../types/index.js';

/**
 * GET /health route handler
 * 
 * Returns API health status and current timestamp matching OpenAPI specification.
 */
export const getHealth = (_req: Request, res: Response<HealthResponse>) => {
  const response: HealthResponse = {
    status: 'ok',
    timestamp: new Date().toISOString()
  };
  
  res.status(200).json(response);
};
