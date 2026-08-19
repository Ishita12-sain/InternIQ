import { Router } from 'express';
import companyController from '../controllers/company.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validateRequest';
import { updateCompanyProfileSchema } from '../validations/company.validation';
import { UserRole } from '../types/user.types';

const router = Router();

// ==========================================
// Company Profile Routes (Only COMPANY role)
// ==========================================
router.get(
  '/me',
  authenticate(),
  authorize(UserRole.COMPANY),
  (req, res, next) => companyController.getMe(req, res, next)
);

router.put(
  '/me',
  authenticate(),
  authorize(UserRole.COMPANY),
  validateBody(updateCompanyProfileSchema),
  (req, res, next) => companyController.updateMe(req, res, next)
);

export default router;
