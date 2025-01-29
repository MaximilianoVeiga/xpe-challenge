import app from './app';
import { AppDataSource } from './config/database';
import { logger } from './config/logger';

const PORT = process.env.PORT ?? 3000;

/**
 * Initializes and starts the Express server with database connection
 */
const startServer = async () => {
  try {
    await AppDataSource.initialize();
    logger.info('Database connected successfully!');
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Error connecting to database: ' + error);
    process.exit(1);
  }
};

startServer();
