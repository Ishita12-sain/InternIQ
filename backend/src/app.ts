import express, { Application } from 'express';
import cors from 'cors';
import config from './config/env';
import requestLogger from './middleware/requestLogger';
import notFoundHandler from './middleware/notFoundHandler';
import errorHandler from './middleware/errorHandler';
import apiRoutes from './routes';

export const createApp = (): Application => {
  const app = express();

  // Middleware: CORS
  app.use(
    cors({
      origin: config.corsOrigin === '*' ? '*' : config.corsOrigin.split(','),
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Middleware: Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Middleware: Request logging
  app.use(requestLogger);

  // Routes: Mount all API routes under /api
  app.use('/api', apiRoutes);

  // Middleware: 404 Not Found
  app.use(notFoundHandler);

  // Middleware: Centralized Error Handler
  app.use(errorHandler);

  return app;
};

export const app = createApp();
export default app;
