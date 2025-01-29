import { initApp } from './app';
import { logger } from './config/logger';
import { AppDataSource } from './config/database';

const PORT = process.env.PORT ?? 3000;

const gracefulShutdown = (server: any) => {
  return async () => {
    logger.info('Server shutdown initiated');
    server.close(async () => {
      logger.info('HTTP server closed');
      await AppDataSource.destroy();
      logger.info('Cleanup completed successfully');
      process.exit(0);
    });
  };
};

const startServer = async () => {
  try {
    logger.info('Starting server initialization');
    const app = await initApp();
    const server = app.listen(PORT, () => {
      logger.info('Server started successfully');
    });

    process.on('SIGTERM', gracefulShutdown(server));
    process.on('SIGINT', gracefulShutdown(server));

    return server;
  } catch (error) {
    logger.error('Fatal error during server startup');
    process.exit(1);
  }
};

startServer();
