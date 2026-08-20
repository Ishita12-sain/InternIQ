import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { AppError } from '../utils/appError';

type RequestLocation = 'body' | 'query' | 'params';

export const validateRequest = (schema: AnyZodObject, location: RequestLocation = 'body') => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsedData = await schema.parseAsync(req[location]);
      req[location] = parsedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        next(new AppError('Validation failed', 400, formattedErrors));
      } else {
        next(error);
      }
    }
  };
};

export const validateBody = (schema: AnyZodObject) => validateRequest(schema, 'body');
export const validateQuery = (schema: AnyZodObject) => validateRequest(schema, 'query');
export const validateParams = (schema: AnyZodObject) => validateRequest(schema, 'params');

export default validateRequest;
