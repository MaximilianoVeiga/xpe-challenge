import express from 'express';
import { AppDataSource, initializeDatabase } from './config/database';
import orderRoutes from './routes/order.routes';
import { logger } from './config/logger';

const app = express();

app.use(express.json());
app.use('/orders', orderRoutes);
app.set('typeorm', AppDataSource);

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

if (process.env.NODE_ENV !== 'test') {
  initApp();
}

export default app;
