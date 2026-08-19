import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import { sendError } from '../utils/apiResponse';
import logger from '../utils/logger';
import config from '../config/env';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    logger.warn(`Operational Error: ${err.message} [Status: ${err.statusCode}] - Path: ${req.originalUrl}`);
    sendError(res, {
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors,
    });
    return;
  }

  // Handle JSON parse error (SyntaxError from express.json)
  if (err instanceof SyntaxError && 'body' in err) {
    logger.warn(`Invalid JSON syntax in request body: ${req.originalUrl}`);
    sendError(res, {
      statusCode: 400,
      message: 'Invalid JSON payload received',
    });
    return;
  }

  // Unhandled / unexpected errors
  logger.error(`Unhandled Error on ${req.method} ${req.originalUrl}:`, {
    message: err.message,
    stack: config.isDevelopment ? err.stack : undefined,
  });

  const statusCode = 500;
  const message = config.isProduction ? 'Internal server error' : err.message;
  const errors = config.isDevelopment ? { stack: err.stack } : undefined;

  sendError(res, {
    statusCode,
    message,
    errors,
  });
};

export default errorHandler;
