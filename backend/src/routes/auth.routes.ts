import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { validateBody } from '../middleware/validateRequest';
import { registerSchema, loginSchema } from '../validations/auth.validation';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../types/user.types';

const router = Router();

// Public routes
router.post('/register', validateBody(registerSchema), (req, res, next) =>
  authController.register(req, res, next)
);

router.post('/login', validateBody(loginSchema), (req, res, next) =>
  authController.login(req, res, next)
);

// Protected routes
router.get('/me', authenticate(), (req, res, next) =>
  authController.getMe(req, res, next)
);

// Role-protected test route for authorization verification
router.get(
  '/test-role',
  authenticate(),
  authorize(UserRole.ADMIN),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Access granted to admin resource',
      user: req.user,
    });
  }
);

export default router;
