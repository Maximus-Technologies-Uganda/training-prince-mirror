/**
 * POST /convert Route Handler (T012)
 * 
 * Handles temperature conversion requests with Zod validation.
 * Must pass contract tests T002 (success case) and validation error handling.
 * 
 * Acceptance Scenarios:
 * - Scenario 3: POST /convert F→C (32°F → 0°C) returns 200
 * - Scenario 4: POST /convert C→F (0°C → 32°F) returns 200
 * - Scenario 5: POST /convert C→C (100°C → 100°C) returns 200 with same value
 * - Scenario 6-9: Validation error scenarios return 400 with error details
 */

import { Router, Request, Response } from 'express';
import type { ConversionRequest, ConversionResponse } from '../types/index.js';
import { validateBody } from '../middleware/validation.js';
import { ConversionRequestSchema } from '../schemas/index.js';
import { convertTemperature } from '../services/converter.js';

const router = Router();

/**
 * POST /convert handler (T012)
 * Validates request body, performs conversion, returns result
 */
router.post(
  '/convert',
  validateBody(ConversionRequestSchema),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (_req: Request<any, any, ConversionRequest>, res: Response<ConversionResponse>) => {
    try {
      // Request body is already validated and typed by middleware
      const { value, from, to } = _req.body;

      // Perform temperature conversion
      const converted = convertTemperature(value, from, to);

      // Return response matching ConversionResponse schema
      const response: ConversionResponse = {
        value: converted,
        unit: to
      };

      res.status(200).json(response);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // This should rarely happen due to middleware validation,
      // but handle gracefully if it does
      res.status(500).json({
        error: 'Conversion error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

export default router;

