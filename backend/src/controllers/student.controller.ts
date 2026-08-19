import { Request, Response, NextFunction } from 'express';
import studentService from '../services/student.service';
import eligibilityService from '../services/eligibility.service';
import skillGapService from '../services/skillGap.service';
import readinessService from '../services/readiness.service';
import matchingService from '../services/matching.service';
import recommendationService from '../services/recommendation.service';
import { AppError } from '../utils/appError';

export class StudentController {
  /**
   * GET /api/students/me
   */
  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const student = await studentService.getStudentProfile(
        req.user.id,
        req.user.name,
        req.user.email
      );
      res.status(200).json({
        success: true,
        student,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/students/me
   */
  async updateMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const student = await studentService.updateStudentProfile(
        req.user.id,
        req.body,
        req.user.name,
        req.user.email
      );
      res.status(200).json({
        success: true,
        message: 'Student profile updated successfully',
        student,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/students/me/skills
   */
  async getSkills(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const skills = await studentService.getSkills(req.user.id);
      res.status(200).json({
        success: true,
        skills,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/students/me/skills
   */
  async updateSkills(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const skills = await studentService.updateSkills(req.user.id, req.body.skills);
      res.status(200).json({
        success: true,
        message: 'Skills updated successfully',
        skills,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/students/me/projects
   */
  async getProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const projects = await studentService.getProjects(req.user.id);
      res.status(200).json({
        success: true,
        projects,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/students/me/projects
   */
  async addProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const project = await studentService.addProject(req.user.id, req.body);
      res.status(201).json({
        success: true,
        message: 'Project added successfully',
        project,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/students/me/projects/:id
   */
  async updateProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const project = await studentService.updateProject(req.user.id, req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Project updated successfully',
        project,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/students/me/projects/:id
   */
  async deleteProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      await studentService.deleteProject(req.user.id, req.params.id);
      res.status(200).json({
        success: true,
        message: 'Project deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/students/me/certifications
   */
  async getCertifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const certifications = await studentService.getCertifications(req.user.id);
      res.status(200).json({
        success: true,
        certifications,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/students/me/certifications
   */
  async addCertification(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const certification = await studentService.addCertification(req.user.id, req.body);
      res.status(201).json({
        success: true,
        message: 'Certification added successfully',
        certification,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/students/me/certifications/:id
   */
  async updateCertification(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const certification = await studentService.updateCertification(
        req.user.id,
        req.params.id,
        req.body
      );
      res.status(200).json({
        success: true,
        message: 'Certification updated successfully',
        certification,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/students/me/certifications/:id
   */
  async deleteCertification(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      await studentService.deleteCertification(req.user.id, req.params.id);
      res.status(200).json({
        success: true,
        message: 'Certification deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/students/me/resume
   */
  async getResume(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const resume = await studentService.getResume(req.user.id);
      res.status(200).json({
        success: true,
        resume,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/students/:id (Accessible by TNP, ADMIN, or student themselves)
   */
  async getStudentById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const student = await studentService.getStudentById(req.params.id, req.user);
      res.status(200).json({
        success: true,
        student,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/students/me/eligibility/:internshipId
   */
  async checkEligibility(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const result = await eligibilityService.checkEligibility(
        req.user.id,
        req.params.internshipId
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
   * GET /api/students/me/skill-gap/:internshipId
   */
  async getSkillGap(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const result = await skillGapService.analyzeStudentForInternship(
        req.user.id,
        req.params.internshipId
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
   * GET /api/students/me/readiness
   */
  async getReadiness(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const readiness = await readinessService.calculateStudentReadiness(req.user.id);
      res.status(200).json({
        success: true,
        readiness,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/students/me/match/:internshipId
   */
  async getMatch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const match = await matchingService.calculateMatch(
        req.user.id,
        req.params.internshipId
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
   * GET /api/students/me/recommendations
   */
  async getRecommendations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const recommendations = await recommendationService.getRecommendationsForStudent(
        req.user.id
      );
      res.status(200).json({
        success: true,
        count: recommendations.length,
        recommendations,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const studentController = new StudentController();
export default studentController;
