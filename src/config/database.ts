import { DataSource } from 'typeorm';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
import { Order } from '../models/order.entity';
import { logger } from './logger';

const defaultOptions: SqliteConnectionOptions = {
  type: 'sqlite',
  entities: [Order],
  synchronize: true,
  logging: false,
  database: process.env.NODE_ENV === 'test' ? ':memory:' : 'database.sqlite',
};

export const AppDataSource = new DataSource(defaultOptions);

export const initializeDatabase = async () => {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    await AppDataSource.initialize();
    await AppDataSource.synchronize();

    logger.info('Database initialized and synchronized successfully');
    return AppDataSource;
  } catch (error) {
    logger.error('Database initialization failed:', error);
    throw error;
  }
};
