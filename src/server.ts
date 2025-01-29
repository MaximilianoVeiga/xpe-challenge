import { initApp } from './app';
import { logger } from './config/logger';

const PORT = process.env.PORT ?? 3000;

/**
 * Initializes and starts the Express server with database connection
 */
const startServer = async () => {
  try {
    const app = await initApp();
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Error starting server: ' + error);
    process.exit(1);
  }
};

startServer();
