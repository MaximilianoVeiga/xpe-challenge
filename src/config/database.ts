import { DataSource } from 'typeorm';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
import { Order } from '../models/order.entity';
import { logger } from './logger';

/**
 * Default SQLite database configuration options
 * @type {SqliteConnectionOptions}
 */
const defaultOptions: SqliteConnectionOptions = {
  type: 'sqlite',
  entities: [Order],
  synchronize: true,
  database: process.env.NODE_ENV === 'test' ? ':memory:' : 'database.sqlite',
};

/**
 * Main database connection source
 * @type {DataSource}
 */
export const AppDataSource = new DataSource(defaultOptions);

/**
 * Cached promise of database initialization
 * @type {Promise<DataSource> | null}
 */
let initializationPromise: Promise<DataSource> | null = null;

/**
 * Verifies the required database structure exists
 * @param {any} queryRunner - TypeORM query runner instance
 * @throws {Error} If required tables are missing
 */
const verifyDatabaseStructure = async (queryRunner: any) => {
  if (!(await queryRunner.hasTable('order'))) {
    throw new Error('Order table was not created properly');
  }
};

/**
 * Initializes the database connection and verifies the schema
 * @returns {Promise<DataSource>} Initialized database connection
 * @throws {Error} If initialization or verification fails
 */
export const initializeDatabase = async () => {
  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      logger.info('Starting database initialization');

      if (AppDataSource.isInitialized) {
        logger.info('Closing existing database connection');
        await AppDataSource.destroy();
      }

      await AppDataSource.initialize();

      if (process.env.NODE_ENV === 'test') {
        logger.info('Synchronizing test database');
        await AppDataSource.synchronize(true);
      }

      const queryRunner = AppDataSource.createQueryRunner();
      await verifyDatabaseStructure(queryRunner);
      await queryRunner.release();

      logger.info('Database initialization completed');
      return AppDataSource;
    } catch (error) {
      initializationPromise = null;
      logger.error('Database initialization failed');
      throw error;
    }
  })();

  return initializationPromise;
};
