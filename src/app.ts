import express from 'express';
import { AppDataSource, initializeDatabase } from './config/database';
import orderRoutes from './routes/order.routes';
import { logger } from './config/logger';

const app = express();

app.use(express.json());

app.set('typeorm', AppDataSource);

const init = async () => {
  try {
    const dataSource = await initializeDatabase();
    app.set('typeorm', dataSource);
    app.use('/orders', orderRoutes);
    logger.info('Application initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize application:', error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  init();
}

export default app;
