import { Response } from 'express';

interface SuccessResponseOptions<T> {
  statusCode?: number;
  message?: string;
  data?: T;
}

interface ErrorResponseOptions {
  statusCode?: number;
  message?: string;
  errors?: unknown;
}

export const sendSuccess = <T>(
  res: Response,
  options: SuccessResponseOptions<T> = {}
): Response => {
  const { statusCode = 200, message, data } = options;

  const responseBody: Record<string, unknown> = {
    success: true,
  };

  if (message !== undefined) {
    responseBody.message = message;
  }

  if (data !== undefined) {
    responseBody.data = data;
  }

  return res.status(statusCode).json(responseBody);
};

export const sendError = (
  res: Response,
  options: ErrorResponseOptions = {}
): Response => {
  const { statusCode = 500, message = 'An error occurred', errors } = options;

  const responseBody: Record<string, unknown> = {
    success: false,
    message,
  };

  if (errors !== undefined) {
    responseBody.errors = errors;
  }

  return res.status(statusCode).json(responseBody);
};
