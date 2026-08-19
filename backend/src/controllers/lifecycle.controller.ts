import { Request, Response, NextFunction } from 'express';
import lifecycleService from '../services/lifecycle.service';
import { AppError } from '../utils/appError';

export class LifecycleController {
  // ==========================================
  // Applications
  // ==========================================

  async getStudentApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const applications = await lifecycleService.getStudentApplications(req.user.id);
      res.status(200).json({
        success: true,
        count: applications.length,
        applications,
      });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================
  // Offers
  // ==========================================

  async createOffer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const offer = await lifecycleService.createOffer(req.params.id, req.user.id, req.body);
      res.status(201).json({
        success: true,
        message: 'Offer letter created successfully',
        offer,
      });
    } catch (error) {
      next(error);
    }
  }

  async getInternshipOffers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const offers = await lifecycleService.getInternshipOffers(req.params.id, req.user);
      res.status(200).json({
        success: true,
        count: offers.length,
        offers,
      });
    } catch (error) {
      next(error);
    }
  }

  async getStudentOffers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const offers = await lifecycleService.getStudentOffers(req.user.id);
      res.status(200).json({
        success: true,
        count: offers.length,
        offers,
      });
    } catch (error) {
      next(error);
    }
  }

  async acceptOffer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const offer = await lifecycleService.respondToOffer(req.params.offerId, req.user.id, 'ACCEPT');
      res.status(200).json({
        success: true,
        message: 'Offer accepted successfully',
        offer,
      });
    } catch (error) {
      next(error);
    }
  }

  async rejectOffer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const offer = await lifecycleService.respondToOffer(req.params.offerId, req.user.id, 'REJECT');
      res.status(200).json({
        success: true,
        message: 'Offer rejected',
        offer,
      });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================
  // Mentors
  // ==========================================

  async assignMentor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const mentor = await lifecycleService.assignMentor(req.params.id, req.user, req.body);
      res.status(201).json({
        success: true,
        message: 'Mentor assigned successfully',
        mentor,
      });
    } catch (error) {
      next(error);
    }
  }

  async getInternshipMentors(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const mentors = await lifecycleService.getInternshipMentors(req.params.id, req.user);
      res.status(200).json({
        success: true,
        count: mentors.length,
        mentors,
      });
    } catch (error) {
      next(error);
    }
  }

  async getStudentMentors(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const mentors = await lifecycleService.getStudentMentors(req.user.id);
      res.status(200).json({
        success: true,
        count: mentors.length,
        mentors,
      });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================
  // Progress
  // ==========================================

  async submitProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const progress = await lifecycleService.submitProgress(req.user.id, req.body);
      res.status(201).json({
        success: true,
        message: 'Progress update submitted successfully',
        progress,
      });
    } catch (error) {
      next(error);
    }
  }

  async getStudentProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const progress = await lifecycleService.getStudentProgress(req.user.id, req.params.internshipId);
      res.status(200).json({
        success: true,
        count: progress.length,
        progress,
      });
    } catch (error) {
      next(error);
    }
  }

  async getInternshipStudentProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const progress = await lifecycleService.getInternshipStudentProgress(
        req.params.id,
        req.params.studentId,
        req.user
      );
      res.status(200).json({
        success: true,
        count: progress.length,
        progress,
      });
    } catch (error) {
      next(error);
    }
  }

  async reviewProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const progress = await lifecycleService.reviewProgress(
        req.params.id,
        req.params.progressId,
        req.user,
        req.body
      );
      res.status(200).json({
        success: true,
        message: 'Progress review updated',
        progress,
      });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================
  // Completion
  // ==========================================

  async completeInternship(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const completion = await lifecycleService.completeInternship(
        req.params.id,
        req.user.id,
        req.body
      );
      res.status(201).json({
        success: true,
        message: 'Internship marked as completed successfully',
        completion,
      });
    } catch (error) {
      next(error);
    }
  }

  async getInternshipCompletions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const completions = await lifecycleService.getInternshipCompletions(req.params.id, req.user);
      res.status(200).json({
        success: true,
        count: completions.length,
        completions,
      });
    } catch (error) {
      next(error);
    }
  }

  async getStudentCompletions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const completions = await lifecycleService.getStudentCompletions(req.user.id);
      res.status(200).json({
        success: true,
        count: completions.length,
        completions,
      });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================
  // PPO
  // ==========================================

  async updatePpoDecision(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const ppo = await lifecycleService.updatePpoDecision(req.params.id, req.user, req.body);
      res.status(200).json({
        success: true,
        message: 'PPO decision updated successfully',
        ppo,
      });
    } catch (error) {
      next(error);
    }
  }

  async getInternshipPpos(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const ppos = await lifecycleService.getInternshipPpos(req.params.id, req.user);
      res.status(200).json({
        success: true,
        count: ppos.length,
        ppos,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const lifecycleController = new LifecycleController();
export default lifecycleController;
