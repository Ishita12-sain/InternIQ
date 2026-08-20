import { Request, Response, NextFunction } from 'express';
import companyService from '../services/company.service';
import { AppError } from '../utils/appError';

export class CompanyController {
  /**
   * GET /api/companies/me
   */
  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const company = await companyService.getProfile(
        req.user.id,
        req.user.name,
        req.user.email
      );
      res.status(200).json({
        success: true,
        company,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/companies/me
   */
  async updateMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return next(AppError.unauthorized('Authentication required'));
      const company = await companyService.updateProfile(
        req.user.id,
        req.body,
        req.user.name,
        req.user.email
      );
      res.status(200).json({
        success: true,
        message: 'Company profile updated successfully',
        company,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const companyController = new CompanyController();
export default companyController;
