import app from './app';
import config from './config/env';
import logger from './utils/logger';

const server = app.listen(config.port, () => {
  logger.info(`🚀 InternIQ Server running in [${config.nodeEnv}] mode on port ${config.port}`);
  logger.info(`👉 Health check URL: http://localhost:${config.port}/api/health`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown) => {
  logger.error('UNHANDLED REJECTION! Shutting down gracefully...', reason);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down immediately...', error);
  process.exit(1);
});

// Handle termination signals
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated.');
  });
});

export default server;
