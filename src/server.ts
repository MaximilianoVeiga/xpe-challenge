import { initApp } from './app';
import { logger } from './config/logger';
import { AppDataSource } from './config/database';
import { Server } from 'http';

/**
 * Default port for the server to listen on
 * @constant {number}
 */
const PORT = process.env.PORT ?? 3000;

/**
 * Handles graceful shutdown of the server and database connection
 * @param {Server} server - The HTTP server instance to shut down
 * @returns {Function} Shutdown handler function
 */
const gracefulShutdown = (server: Server) => {
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

/**
 * Initializes and starts the Express application server
 * @returns {Promise<Server>} The HTTP server instance
 * @throws {Error} If server initialization fails
 */
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
