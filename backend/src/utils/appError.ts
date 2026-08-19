export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errors?: unknown;

  constructor(message: string, statusCode: number = 500, errors?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.errors = errors;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string = 'Bad request', errors?: unknown): AppError {
    return new AppError(message, 400, errors);
  }

  static unauthorized(message: string = 'Unauthorized', errors?: unknown): AppError {
    return new AppError(message, 401, errors);
  }

  static forbidden(message: string = 'Forbidden access', errors?: unknown): AppError {
    return new AppError(message, 403, errors);
  }

  static notFound(message: string = 'Resource not found', errors?: unknown): AppError {
    return new AppError(message, 404, errors);
  }

  static conflict(message: string = 'Resource conflict', errors?: unknown): AppError {
    return new AppError(message, 409, errors);
  }

  static internal(message: string = 'Internal server error', errors?: unknown): AppError {
    return new AppError(message, 500, errors);
  }
}

export default AppError;
