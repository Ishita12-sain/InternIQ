import { Request, Response, NextFunction } from 'express';
import internshipService from '../services/internship.service';
import eligibilityService from '../services/eligibility.service';
import skillGapService from '../services/skillGap.service';
import matchingService from '../services/matching.service';
import { AppError } from '../utils/appError';

export class InternshipController {
  /**
   * POST /api/internships/:id/apply (STUDENT only)
   */
  async apply(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const application = await internshipService.applyToInternship(
        req.params.id,
        req.user
      );
      res.status(201).json({
        success: true,
        message: 'Application submitted successfully',
        application,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/internships
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const internship = await internshipService.createInternship(
        req.user.id,
        req.user.name,
        req.body
      );
      res.status(201).json({
        success: true,
        message: 'Internship created successfully',
        internship,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/internships
   */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, companyId, search } = req.query;
      const internships = await internshipService.getInternships({
        status: status as any,
        companyId: companyId as string,
        search: search as string,
      });
      res.status(200).json({
        success: true,
        internships,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/internships/:id
   */
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const internship = await internshipService.getInternshipById(req.params.id);
      res.status(200).json({
        success: true,
        internship,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/internships/:id
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const internship = await internshipService.updateInternship(
        req.params.id,
        req.user.id,
        req.body
      );
      res.status(200).json({
        success: true,
        message: 'Internship updated successfully',
        internship,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/internships/:id
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      await internshipService.deleteInternship(req.params.id, req.user.id);
      res.status(200).json({
        success: true,
        message: 'Internship deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/internships/:id/applicants
   */
  async getApplicants(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const applicants = await internshipService.getApplicants(req.params.id, req.user);
      res.status(200).json({
        success: true,
        applicants,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/internships/:id/applicants/:applicationId/status
   */
  async updateApplicationStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const application = await internshipService.updateApplicationStatus(
        req.params.id,
        req.params.applicationId,
        req.user.id,
        req.body.status,
        req.body.comment
      );
      res.status(200).json({
        success: true,
        message: `Application status updated to ${req.body.status}`,
        application,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/internships/:id/applicants/:applicationId/shortlist
   */
  async shortlist(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const application = await internshipService.updateApplicationStatus(
        req.params.id,
        req.params.applicationId,
        req.user.id,
        'SHORTLISTED',
        req.body.comment
      );
      res.status(200).json({
        success: true,
        message: 'Applicant shortlisted successfully',
        application,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/internships/:id/applicants/:applicationId/select
   */
  async select(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const application = await internshipService.updateApplicationStatus(
        req.params.id,
        req.params.applicationId,
        req.user.id,
        'SELECTED',
        req.body.comment
      );
      res.status(200).json({
        success: true,
        message: 'Applicant selected successfully',
        application,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/internships/:id/applicants/:applicationId/reject
   */
  async reject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const application = await internshipService.updateApplicationStatus(
        req.params.id,
        req.params.applicationId,
        req.user.id,
        'REJECTED',
        req.body.comment
      );
      res.status(200).json({
        success: true,
        message: 'Applicant rejected',
        application,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/internships/:id/evaluations
   */
  async createEvaluation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const evaluation = await internshipService.createEvaluation(
        req.params.id,
        req.user.id,
        req.body
      );
      res.status(201).json({
        success: true,
        message: 'Evaluation submitted successfully',
        evaluation,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/internships/:id/evaluations
   */
  async getEvaluations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const evaluations = await internshipService.getEvaluations(req.params.id, req.user);
      res.status(200).json({
        success: true,
        evaluations,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/internships/:id/eligibility/:studentId (COMPANY, TNP, ADMIN)
   */
  async checkStudentEligibility(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const result = await eligibilityService.checkEligibilityForStaffOrCompany(
        req.params.id,
        req.params.studentId,
        req.user
      );
      res.status(200).json({
        success: true,
        isEligible: result.isEligible,
        criteriaBreakdown: result.criteriaBreakdown,
        summary: result.summary,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/internships/:id/skill-gap/:studentId (COMPANY, TNP, ADMIN)
   */
  async getStudentSkillGap(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const result = await skillGapService.analyzeStudentForStaffOrCompany(
        req.params.id,
        req.params.studentId,
        req.user
      );
      res.status(200).json({
        success: true,
        skillMatchPercentage: result.skillMatchPercentage,
        matchedSkills: result.matchedSkills,
        missingSkills: result.missingSkills,
        totalRequiredSkills: result.totalRequiredSkills,
        matchedSkillCount: result.matchedSkillCount,
        remediationAdvice: result.remediationAdvice,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/internships/:id/match/:studentId (COMPANY, TNP, ADMIN)
   */
  async getStudentMatch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const match = await matchingService.calculateMatchForStaffOrCompany(
        req.params.id,
        req.params.studentId,
        req.user
      );
      res.status(200).json({
        success: true,
        match,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/internships/:id/candidate-matches (COMPANY, TNP, ADMIN)
   */
  async getCandidateMatches(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const candidates = await matchingService.rankCandidatesForInternship(
        req.params.id,
        req.user
      );
      res.status(200).json({
        success: true,
        internshipId: req.params.id,
        candidates,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const internshipController = new InternshipController();
export default internshipController;
