import { DataSource } from 'typeorm';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
import { Order } from '../models/order.entity';
import { logger } from './logger';

const defaultOptions: SqliteConnectionOptions = {
  type: 'sqlite',
  entities: [Order],
  synchronize: true,
  database: process.env.NODE_ENV === 'test' ? ':memory:' : 'database.sqlite',
};

export const AppDataSource = new DataSource(defaultOptions);

let initializationPromise: Promise<DataSource> | null = null;

const verifyDatabaseStructure = async (queryRunner: any) => {
  if (!(await queryRunner.hasTable('order'))) {
    throw new Error('Order table was not created properly');
  }
};

export const initializeDatabase = async () => {
  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
      }

      await AppDataSource.initialize();

      if (process.env.NODE_ENV === 'test') {
        await AppDataSource.synchronize(true);
      }

      const queryRunner = AppDataSource.createQueryRunner();
      await verifyDatabaseStructure(queryRunner);
      await queryRunner.release();

      logger.info('Database initialized and verified successfully');
      return AppDataSource;
    } catch (error) {
      initializationPromise = null;
      logger.error('Database initialization failed:', error);
      throw error;
    }
  })();

  return initializationPromise;
};
