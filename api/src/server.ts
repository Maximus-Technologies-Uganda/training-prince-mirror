import express from 'express';
import { rateLimiter } from './middleware/rate-limit.js';
import { errorHandler } from './middleware/error-handler.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes (T013, T017)
import { getHealth } from './routes/health.js';
import { getHealthz } from './routes/healthz.js';
import convertRoutes from './routes/convert.js';
import expenseRoutes from './routes/expenses.js';

// Register legacy health endpoint
app.get('/health', getHealth);

// Register new endpoints for Week 5 MVP
app.get('/healthz', getHealthz);

// Register rate limiter for POST routes (T010)
// Applies to all POST requests, GET requests are skipped automatically
app.use(rateLimiter);

// Register routes
app.use(convertRoutes);
app.use(expenseRoutes);

// Register error middleware AFTER all routes (Express error middleware pattern)
app.use(errorHandler);

// Start server (only if not in test environment)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export app for testing
export { app };
