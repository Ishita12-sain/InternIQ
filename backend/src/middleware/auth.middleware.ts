import { Request, Response, NextFunction } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { verifyToken } from '../utils/jwt.util';
import userRepository from '../repositories/user.repository';
import { AppError } from '../utils/appError';
import { UserRole } from '../types/user.types';

/**
 * Authentication middleware that verifies JWT in the Authorization header
 * and attaches the authenticated user to `req.user`.
 */
export const authenticate = () => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(AppError.unauthorized('Authentication token is required'));
      }

      const token = authHeader.split(' ')[1];
      if (!token || token.trim() === '') {
        return next(AppError.unauthorized('Authentication token is required'));
      }

      let payload;
      try {
        payload = verifyToken(token);
      } catch (err) {
        if (err instanceof TokenExpiredError) {
          return next(AppError.unauthorized('Authentication token has expired'));
        }
        if (err instanceof JsonWebTokenError) {
          return next(AppError.unauthorized('Invalid authentication token'));
        }
        return next(AppError.unauthorized('Failed to authenticate token'));
      }

      const user = await userRepository.findById(payload.id);
      if (!user) {
        return next(AppError.unauthorized('User associated with this token no longer exists'));
      }

      req.user = userRepository.sanitizeUser(user);
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Role-based authorization middleware.
 * Restricts access to users having one of the specified roles.
 */
export const authorize = (...roles: (UserRole | string)[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(AppError.unauthorized('Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        AppError.forbidden(`Access forbidden: Insufficient permissions for role '${req.user.role}'`)
      );
    }

    next();
  };
};

export default {
  authenticate,
  authorize,
};
