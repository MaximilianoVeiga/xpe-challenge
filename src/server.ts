import { initApp } from './app';
import { logger } from './config/logger';
import { AppDataSource } from './config/database';

const PORT = process.env.PORT ?? 3000;

const gracefulShutdown = (server: any) => {
  return async () => {
    logger.info('Received shutdown signal. Closing server...');
    server.close(async () => {
      logger.info('Server closed. Closing database connection...');
      await AppDataSource.destroy();
      logger.info('Database connection closed. Exiting...');
      process.exit(0);
    });
  };
};

const startServer = async () => {
  try {
    const app = await initApp();
    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });

    process.on('SIGTERM', gracefulShutdown(server));
    process.on('SIGINT', gracefulShutdown(server));

    return server;
  } catch (error) {
    logger.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
