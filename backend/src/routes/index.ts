import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import studentRoutes from './student.routes';
import companyRoutes from './company.routes';
import internshipRoutes from './internship.routes';

const router = Router();

// Mount health routes at /health -> full path /api/health
router.use('/health', healthRoutes);

// Mount auth routes at /auth -> full path /api/auth
router.use('/auth', authRoutes);

// Mount student routes at /students -> full path /api/students
router.use('/students', studentRoutes);

// Mount company routes at /companies -> full path /api/companies
router.use('/companies', companyRoutes);

// Mount internship routes at /internships -> full path /api/internships
router.use('/internships', internshipRoutes);

export default router;
