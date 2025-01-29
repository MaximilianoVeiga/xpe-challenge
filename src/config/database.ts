import { DataSource } from 'typeorm';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
import { Order } from '../models/order.entity';
import { logger } from './logger';

const defaultOptions: SqliteConnectionOptions = {
  type: 'sqlite',
  entities: [Order],
  synchronize: true,
  logging: false,
  dropSchema: true,
  database: process.env.NODE_ENV === 'test' ? ':memory:' : 'database.sqlite',
};

export const AppDataSource = new DataSource(defaultOptions);

export const initializeDatabase = async () => {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    await AppDataSource.initialize();

    // Ensure schema is created for in-memory database
    if (process.env.NODE_ENV === 'test') {
      await AppDataSource.synchronize(true);
    }
    return AppDataSource;
  } catch (error) {
    logger.error('Database initialization failed:', error);
    throw error;
  }
};
