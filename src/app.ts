import express, { NextFunction, Request, Response } from 'express';
import { initializeDatabase } from './config/database';
import orderRoutes from './routes/order.routes';
import { logger } from './config/logger';

const app = express();

app.use(express.json());
app.use('/orders', orderRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export const initApp = async () => {
  try {
    const dataSource = await initializeDatabase();
    app.set('typeorm', dataSource);
    logger.info('Application initialized successfully');
    return app;
  } catch (error) {
    logger.error('Failed to initialize application:', error);
    throw error;
  }
};

// Only initialize if not in test mode
if (process.env.NODE_ENV !== 'test') {
  initApp().catch((error) => {
    logger.error('Application failed to start:', error);
    process.exit(1);
  });
}

export default app;
