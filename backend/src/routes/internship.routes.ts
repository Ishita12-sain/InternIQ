import { Router } from 'express';
import internshipController from '../controllers/internship.controller';
import lifecycleController from '../controllers/lifecycle.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validateBody, validateParams } from '../middleware/validateRequest';
import {
  createInternshipSchema,
  updateInternshipSchema,
  updateApplicationStatusSchema,
  createEvaluationSchema,
} from '../validations/company.validation';
import {
  createOfferSchema,
  assignMentorSchema,
  reviewProgressSchema,
  completeInternshipSchema,
  updatePpoDecisionSchema,
} from '../validations/lifecycle.validation';
import {
  idParamSchema,
  internshipStudentParamsSchema,
} from '../validations/intelligence.validation';
import { UserRole } from '../types/user.types';

const router = Router();

// ==========================================
// Internship Creation & Listing Routes
// ==========================================

// Create internship (COMPANY only)
router.post(
  '/',
  authenticate(),
  authorize(UserRole.COMPANY),
  validateBody(createInternshipSchema),
  (req, res, next) => internshipController.create(req, res, next)
);

// List internships (Public / Authenticated)
router.get('/', (req, res, next) => internshipController.getAll(req, res, next));

// Apply to internship (STUDENT only)
router.post(
  '/:id/apply',
  authenticate(),
  authorize(UserRole.STUDENT),
  (req, res, next) => internshipController.apply(req, res, next)
);

// Get single internship by ID
router.get('/:id', (req, res, next) => internshipController.getById(req, res, next));

// Update internship (Owner COMPANY only)
router.put(
  '/:id',
  authenticate(),
  authorize(UserRole.COMPANY),
  validateBody(updateInternshipSchema),
  (req, res, next) => internshipController.update(req, res, next)
);

// Delete internship (Owner COMPANY only)
router.delete(
  '/:id',
  authenticate(),
  authorize(UserRole.COMPANY),
  (req, res, next) => internshipController.delete(req, res, next)
);

// ==========================================
// Applicants Routes (Owner COMPANY, TNP, ADMIN)
// ==========================================
router.get(
  '/:id/applicants',
  authenticate(),
  authorize(UserRole.COMPANY, UserRole.TNP, UserRole.ADMIN),
  (req, res, next) => internshipController.getApplicants(req, res, next)
);

// ==========================================
// Candidate Eligibility Route (Owner COMPANY, TNP, ADMIN)
// ==========================================
router.get(
  '/:id/eligibility/:studentId',
  authenticate(),
  authorize(UserRole.COMPANY, UserRole.TNP, UserRole.ADMIN),
  validateParams(internshipStudentParamsSchema),
  (req, res, next) => internshipController.checkStudentEligibility(req, res, next)
);

// ==========================================
// Candidate Skill Gap Route (Owner COMPANY, TNP, ADMIN)
// ==========================================
router.get(
  '/:id/skill-gap/:studentId',
  authenticate(),
  authorize(UserRole.COMPANY, UserRole.TNP, UserRole.ADMIN),
  validateParams(internshipStudentParamsSchema),
  (req, res, next) => internshipController.getStudentSkillGap(req, res, next)
);

// ==========================================
// Candidate Match Route (Owner COMPANY, TNP, ADMIN)
// ==========================================
router.get(
  '/:id/match/:studentId',
  authenticate(),
  authorize(UserRole.COMPANY, UserRole.TNP, UserRole.ADMIN),
  validateParams(internshipStudentParamsSchema),
  (req, res, next) => internshipController.getStudentMatch(req, res, next)
);

// ==========================================
// Candidate Ranking Route (Owner COMPANY, TNP, ADMIN)
// ==========================================
router.get(
  '/:id/candidate-matches',
  authenticate(),
  authorize(UserRole.COMPANY, UserRole.TNP, UserRole.ADMIN),
  validateParams(idParamSchema),
  (req, res, next) => internshipController.getCandidateMatches(req, res, next)
);

// ==========================================
// Status Transition Routes (Owner COMPANY only)
// ==========================================
router.patch(
  '/:id/applicants/:applicationId/status',
  authenticate(),
  authorize(UserRole.COMPANY),
  validateBody(updateApplicationStatusSchema),
  (req, res, next) => internshipController.updateApplicationStatus(req, res, next)
);

router.post(
  '/:id/applicants/:applicationId/shortlist',
  authenticate(),
  authorize(UserRole.COMPANY),
  (req, res, next) => internshipController.shortlist(req, res, next)
);

router.post(
  '/:id/applicants/:applicationId/select',
  authenticate(),
  authorize(UserRole.COMPANY),
  (req, res, next) => internshipController.select(req, res, next)
);

router.post(
  '/:id/applicants/:applicationId/reject',
  authenticate(),
  authorize(UserRole.COMPANY),
  (req, res, next) => internshipController.reject(req, res, next)
);

// ==========================================
// Evaluation Routes (Owner COMPANY only)
// ==========================================
router.post(
  '/:id/evaluations',
  authenticate(),
  authorize(UserRole.COMPANY),
  validateBody(createEvaluationSchema),
  (req, res, next) => internshipController.createEvaluation(req, res, next)
);

router.get(
  '/:id/evaluations',
  authenticate(),
  authorize(UserRole.COMPANY, UserRole.TNP, UserRole.ADMIN),
  (req, res, next) => internshipController.getEvaluations(req, res, next)
);

// ==========================================
// Phase 6: Offer Letter Routes
// ==========================================

// Create offer letter for selected candidate (Owner COMPANY)
router.post(
  '/:id/offers',
  authenticate(),
  authorize(UserRole.COMPANY),
  validateBody(createOfferSchema),
  (req, res, next) => lifecycleController.createOffer(req, res, next)
);

// Get offers for internship (Owner COMPANY, TNP, ADMIN)
router.get(
  '/:id/offers',
  authenticate(),
  authorize(UserRole.COMPANY, UserRole.TNP, UserRole.ADMIN),
  (req, res, next) => lifecycleController.getInternshipOffers(req, res, next)
);

// ==========================================
// Phase 6: Mentor Assignment Routes
// ==========================================

// Assign mentor (Owner COMPANY, TNP, ADMIN)
router.post(
  '/:id/mentors',
  authenticate(),
  authorize(UserRole.COMPANY, UserRole.TNP, UserRole.ADMIN),
  validateBody(assignMentorSchema),
  (req, res, next) => lifecycleController.assignMentor(req, res, next)
);

// Get mentors for internship (Owner COMPANY, TNP, ADMIN)
router.get(
  '/:id/mentors',
  authenticate(),
  authorize(UserRole.COMPANY, UserRole.TNP, UserRole.ADMIN),
  (req, res, next) => lifecycleController.getInternshipMentors(req, res, next)
);

// ==========================================
// Phase 6: Milestone Progress Routes
// ==========================================

// View student progress for internship (Owner COMPANY, TNP, ADMIN)
router.get(
  '/:id/progress/:studentId',
  authenticate(),
  authorize(UserRole.COMPANY, UserRole.TNP, UserRole.ADMIN),
  (req, res, next) => lifecycleController.getInternshipStudentProgress(req, res, next)
);

// Review student progress update (Owner COMPANY, TNP, ADMIN)
router.patch(
  '/:id/progress/:progressId/review',
  authenticate(),
  authorize(UserRole.COMPANY, UserRole.TNP, UserRole.ADMIN),
  validateBody(reviewProgressSchema),
  (req, res, next) => lifecycleController.reviewProgress(req, res, next)
);

// ==========================================
// Phase 6: Completion Routes
// ==========================================

// Complete internship (Owner COMPANY)
router.post(
  '/:id/complete',
  authenticate(),
  authorize(UserRole.COMPANY),
  validateBody(completeInternshipSchema),
  (req, res, next) => lifecycleController.completeInternship(req, res, next)
);

// View completions for internship (Owner COMPANY, TNP, ADMIN)
router.get(
  '/:id/completions',
  authenticate(),
  authorize(UserRole.COMPANY, UserRole.TNP, UserRole.ADMIN),
  (req, res, next) => lifecycleController.getInternshipCompletions(req, res, next)
);

// ==========================================
// Phase 6: PPO Decision Routes
// ==========================================

// Update PPO decision (Owner COMPANY, TNP, ADMIN)
router.post(
  '/:id/ppo',
  authenticate(),
  authorize(UserRole.COMPANY, UserRole.TNP, UserRole.ADMIN),
  validateBody(updatePpoDecisionSchema),
  (req, res, next) => lifecycleController.updatePpoDecision(req, res, next)
);

// View PPO decisions for internship (Owner COMPANY, TNP, ADMIN)
router.get(
  '/:id/ppo',
  authenticate(),
  authorize(UserRole.COMPANY, UserRole.TNP, UserRole.ADMIN),
  (req, res, next) => lifecycleController.getInternshipPpos(req, res, next)
);

export default router;
