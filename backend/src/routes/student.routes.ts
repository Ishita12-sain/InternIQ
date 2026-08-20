import { Router } from 'express';
import studentController from '../controllers/student.controller';
import lifecycleController from '../controllers/lifecycle.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validateBody, validateParams } from '../middleware/validateRequest';
import {
  updateProfileSchema,
  updateSkillsSchema,
  createProjectSchema,
  updateProjectSchema,
  createCertificationSchema,
  updateCertificationSchema,
} from '../validations/student.validation';
import { internshipIdParamSchema } from '../validations/intelligence.validation';
import { submitProgressSchema } from '../validations/lifecycle.validation';
import { UserRole } from '../types/user.types';

const router = Router();

// ==========================================
// Student Profile Routes (Only STUDENT role)
// ==========================================
router.get(
  '/me',
  authenticate(),
  authorize(UserRole.STUDENT),
  (req, res, next) => studentController.getMe(req, res, next)
);

router.put(
  '/me',
  authenticate(),
  authorize(UserRole.STUDENT),
  validateBody(updateProfileSchema),
  (req, res, next) => studentController.updateMe(req, res, next)
);

// ==========================================
// Student Skills Routes
// ==========================================
router.get(
  '/me/skills',
  authenticate(),
  authorize(UserRole.STUDENT),
  (req, res, next) => studentController.getSkills(req, res, next)
);

router.put(
  '/me/skills',
  authenticate(),
  authorize(UserRole.STUDENT),
  validateBody(updateSkillsSchema),
  (req, res, next) => studentController.updateSkills(req, res, next)
);

// ==========================================
// Student Projects Routes
// ==========================================
router.get(
  '/me/projects',
  authenticate(),
  authorize(UserRole.STUDENT),
  (req, res, next) => studentController.getProjects(req, res, next)
);

router.post(
  '/me/projects',
  authenticate(),
  authorize(UserRole.STUDENT),
  validateBody(createProjectSchema),
  (req, res, next) => studentController.addProject(req, res, next)
);

router.put(
  '/me/projects/:id',
  authenticate(),
  authorize(UserRole.STUDENT),
  validateBody(updateProjectSchema),
  (req, res, next) => studentController.updateProject(req, res, next)
);

router.delete(
  '/me/projects/:id',
  authenticate(),
  authorize(UserRole.STUDENT),
  (req, res, next) => studentController.deleteProject(req, res, next)
);

// ==========================================
// Student Certifications Routes
// ==========================================
router.get(
  '/me/certifications',
  authenticate(),
  authorize(UserRole.STUDENT),
  (req, res, next) => studentController.getCertifications(req, res, next)
);

router.post(
  '/me/certifications',
  authenticate(),
  authorize(UserRole.STUDENT),
  validateBody(createCertificationSchema),
  (req, res, next) => studentController.addCertification(req, res, next)
);

router.put(
  '/me/certifications/:id',
  authenticate(),
  authorize(UserRole.STUDENT),
  validateBody(updateCertificationSchema),
  (req, res, next) => studentController.updateCertification(req, res, next)
);

router.delete(
  '/me/certifications/:id',
  authenticate(),
  authorize(UserRole.STUDENT),
  (req, res, next) => studentController.deleteCertification(req, res, next)
);

// ==========================================
// Student Resume Route
// ==========================================
router.get(
  '/me/resume',
  authenticate(),
  authorize(UserRole.STUDENT),
  (req, res, next) => studentController.getResume(req, res, next)
);

// ==========================================
// Student Eligibility Check Route
// ==========================================
router.get(
  '/me/eligibility/:internshipId',
  authenticate(),
  authorize(UserRole.STUDENT),
  validateParams(internshipIdParamSchema),
  (req, res, next) => studentController.checkEligibility(req, res, next)
);

// ==========================================
// Student Skill Gap Analysis Route
// ==========================================
router.get(
  '/me/skill-gap/:internshipId',
  authenticate(),
  authorize(UserRole.STUDENT),
  validateParams(internshipIdParamSchema),
  (req, res, next) => studentController.getSkillGap(req, res, next)
);

// ==========================================
// Student Readiness Score Route
// ==========================================
router.get(
  '/me/readiness',
  authenticate(),
  authorize(UserRole.STUDENT),
  (req, res, next) => studentController.getReadiness(req, res, next)
);

// ==========================================
// Student ↔ Internship Match Route
// ==========================================
router.get(
  '/me/match/:internshipId',
  authenticate(),
  authorize(UserRole.STUDENT),
  validateParams(internshipIdParamSchema),
  (req, res, next) => studentController.getMatch(req, res, next)
);

// ==========================================
// Student Recommendations Route
// ==========================================
router.get(
  '/me/recommendations',
  authenticate(),
  authorize(UserRole.STUDENT),
  (req, res, next) => studentController.getRecommendations(req, res, next)
);

// ==========================================
// Phase 6: Student Lifecycle Routes
// ==========================================

// View own applications
router.get(
  '/me/applications',
  authenticate(),
  authorize(UserRole.STUDENT),
  (req, res, next) => lifecycleController.getStudentApplications(req, res, next)
);

// View own offers
router.get(
  '/me/offers',
  authenticate(),
  authorize(UserRole.STUDENT),
  (req, res, next) => lifecycleController.getStudentOffers(req, res, next)
);

// Accept offer
router.post(
  '/me/offers/:offerId/accept',
  authenticate(),
  authorize(UserRole.STUDENT),
  (req, res, next) => lifecycleController.acceptOffer(req, res, next)
);

// Reject offer
router.post(
  '/me/offers/:offerId/reject',
  authenticate(),
  authorize(UserRole.STUDENT),
  (req, res, next) => lifecycleController.rejectOffer(req, res, next)
);

// View assigned mentors
router.get(
  '/me/mentors',
  authenticate(),
  authorize(UserRole.STUDENT),
  (req, res, next) => lifecycleController.getStudentMentors(req, res, next)
);

// Submit milestone progress
router.post(
  '/me/progress',
  authenticate(),
  authorize(UserRole.STUDENT),
  validateBody(submitProgressSchema),
  (req, res, next) => lifecycleController.submitProgress(req, res, next)
);

// View progress for an internship
router.get(
  '/me/progress/:internshipId',
  authenticate(),
  authorize(UserRole.STUDENT),
  (req, res, next) => lifecycleController.getStudentProgress(req, res, next)
);

// View completed internships
router.get(
  '/me/completions',
  authenticate(),
  authorize(UserRole.STUDENT),
  (req, res, next) => lifecycleController.getStudentCompletions(req, res, next)
);

// ==========================================
// Student Inspection Route (TNP & ADMIN, or self)
// ==========================================
router.get(
  '/:id',
  authenticate(),
  authorize(UserRole.STUDENT, UserRole.TNP, UserRole.ADMIN),
  (req, res, next) => studentController.getStudentById(req, res, next)
);

export default router;
