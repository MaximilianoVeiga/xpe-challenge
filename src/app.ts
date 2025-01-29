import express, { NextFunction, Request, Response } from 'express';
import { initializeDatabase } from './config/database';
import orderRoutes from './routes/order.routes';
import { logger } from './config/logger';

/** Express application instance */
const app = express();

app.use(express.json());
app.use('/orders', orderRoutes);

/**
 * Global error handler middleware
 * @param {Error} err - Error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

/**
 * Initializes the Express application with database connection
 * @returns {Promise<express.Application>} Initialized Express application
 * @throws {Error} If database initialization fails
 */
export const initApp = async () => {
  try {
    const dataSource = await initializeDatabase();
    app.set('typeorm', dataSource);
    return app;
  } catch (error) {
    logger.error('Failed to initialize application:', error);
    throw error;
  }
};

if (process.env.NODE_ENV !== 'test') {
  initApp().catch((error) => {
    logger.error('Application failed to start:', error);
    process.exit(1);
  });
}

export default app;
