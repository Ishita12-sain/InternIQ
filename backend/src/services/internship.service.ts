import internshipRepository from '../repositories/internship.repository';
import applicationRepository from '../repositories/application.repository';
import evaluationRepository from '../repositories/evaluation.repository';
import studentRepository from '../repositories/student.repository';
import eligibilityService from './eligibility.service';
import { AppError } from '../utils/appError';
import {
  IInternship,
  IApplication,
  IEvaluation,
  ApplicationStatus,
} from '../types/company.types';
import { AuthUser, UserRole } from '../types/user.types';
import {
  CreateInternshipInput,
  UpdateInternshipInput,
  CreateEvaluationInput,
} from '../validations/company.validation';

export class InternshipService {
  /**
   * Apply to an internship (STUDENT only)
   */
  async applyToInternship(
    internshipId: string,
    studentUser: AuthUser
  ): Promise<IApplication> {
    const internship = await internshipRepository.findById(internshipId);
    if (!internship) {
      throw AppError.notFound(`Internship with ID '${internshipId}' not found`);
    }

    if (internship.status !== 'OPEN') {
      throw AppError.badRequest('This internship is no longer accepting applications');
    }

    if (internship.applicationDeadline) {
      const deadlineTime = new Date(internship.applicationDeadline).getTime();
      if (!isNaN(deadlineTime) && deadlineTime < Date.now()) {
        throw AppError.badRequest('Application deadline has passed');
      }
    }

    const existingApp = await applicationRepository.findByStudentAndInternship(
      studentUser.id,
      internshipId
    );
    if (existingApp) {
      throw AppError.conflict('You have already applied to this internship');
    }

    let studentData = await studentRepository.findByUserId(studentUser.id);
    if (!studentData) {
      studentData = await studentRepository.getOrCreate(
        studentUser.id,
        studentUser.name,
        studentUser.email
      );
    }

    // Validate eligibility before application
    const eligibilityResult = eligibilityService.evaluateCriteria(
      studentData,
      internship
    );
    if (!eligibilityResult.isEligible) {
      throw AppError.badRequest(
        `You do not meet the eligibility requirements for this internship: ${eligibilityResult.summary}`
      );
    }

    return applicationRepository.create({
      internshipId,
      companyId: internship.companyId,
      studentId: studentUser.id,
      studentName: studentUser.name,
      studentEmail: studentUser.email,
      studentRollNumber: studentData?.profile?.rollNumber,
      studentDepartment: studentData?.profile?.department,
      studentCgpa: studentData?.profile?.cgpa,
      studentSkills: studentData?.skills?.map((s) => s.name) || [],
      studentResumeUrl: studentData?.profile?.resumeUrl,
      status: 'APPLIED',
    });
  }
  /**
   * Create a new internship posting
   */
  async createInternship(
    companyUserId: string,
    companyName: string,
    data: CreateInternshipInput
  ): Promise<IInternship> {
    return internshipRepository.create({
      ...data,
      companyId: companyUserId,
      companyName,
      currency: data.currency || 'INR',
      status: data.status || 'OPEN',
    });
  }

  /**
   * List all published internships
   */
  async getInternships(filter?: {
    status?: IInternship['status'];
    companyId?: string;
    search?: string;
  }): Promise<IInternship[]> {
    return internshipRepository.findAll(filter);
  }

  /**
   * Get single internship by ID
   */
  async getInternshipById(id: string): Promise<IInternship> {
    const internship = await internshipRepository.findById(id);
    if (!internship) {
      throw AppError.notFound(`Internship with ID '${id}' not found`);
    }
    return internship;
  }

  /**
   * Update own internship posting
   */
  async updateInternship(
    id: string,
    companyUserId: string,
    data: UpdateInternshipInput
  ): Promise<IInternship> {
    const existing = await internshipRepository.findById(id);
    if (!existing || existing.companyId !== companyUserId) {
      throw AppError.notFound(`Internship with ID '${id}' not found`);
    }

    const updated = await internshipRepository.update(id, companyUserId, data);
    if (!updated) {
      throw AppError.notFound(`Internship with ID '${id}' not found`);
    }
    return updated;
  }

  /**
   * Delete own internship posting
   */
  async deleteInternship(id: string, companyUserId: string): Promise<void> {
    const existing = await internshipRepository.findById(id);
    if (!existing || existing.companyId !== companyUserId) {
      throw AppError.notFound(`Internship with ID '${id}' not found`);
    }

    const deleted = await internshipRepository.delete(id, companyUserId);
    if (!deleted) {
      throw AppError.notFound(`Internship with ID '${id}' not found`);
    }
  }

  /**
   * Get applicants for an internship (Only owner company or TNP/Admin)
   */
  async getApplicants(internshipId: string, requestingUser: AuthUser): Promise<IApplication[]> {
    const internship = await internshipRepository.findById(internshipId);
    if (!internship) {
      throw AppError.notFound(`Internship with ID '${internshipId}' not found`);
    }

    if (requestingUser.role === UserRole.COMPANY && internship.companyId !== requestingUser.id) {
      throw AppError.notFound(`Internship with ID '${internshipId}' not found`);
    }

    if (requestingUser.role === UserRole.STUDENT) {
      throw AppError.forbidden('Students cannot access the applicant list');
    }

    return applicationRepository.findByInternshipId(internshipId);
  }

  /**
   * Controlled status transition for applications
   */
  async updateApplicationStatus(
    internshipId: string,
    applicationId: string,
    companyUserId: string,
    newStatus: ApplicationStatus,
    comment?: string
  ): Promise<IApplication> {
    const internship = await internshipRepository.findById(internshipId);
    if (!internship || internship.companyId !== companyUserId) {
      throw AppError.notFound(`Internship with ID '${internshipId}' not found`);
    }

    const application = await applicationRepository.findById(applicationId);
    if (!application || application.internshipId !== internshipId) {
      throw AppError.notFound(`Application with ID '${applicationId}' not found`);
    }

    // Validate state machine transitions
    const currentStatus = application.status;

    const validTransitions: Record<ApplicationStatus, ApplicationStatus[]> = {
      APPLIED: ['SHORTLISTED', 'REJECTED'],
      SHORTLISTED: ['SELECTED', 'REJECTED'],
      SELECTED: [],
      REJECTED: [],
    };

    const allowed = validTransitions[currentStatus] || [];
    if (!allowed.includes(newStatus)) {
      throw AppError.badRequest(
        `Invalid status transition from '${currentStatus}' to '${newStatus}'. Allowed transitions are: [${allowed.join(', ')}]`
      );
    }

    const updated = await applicationRepository.updateStatus(
      applicationId,
      newStatus,
      internship.companyName,
      comment
    );

    if (!updated) {
      throw AppError.notFound(`Application with ID '${applicationId}' not found`);
    }

    return updated;
  }

  /**
   * Evaluate a student
   */
  async createEvaluation(
    internshipId: string,
    companyUserId: string,
    data: CreateEvaluationInput
  ): Promise<IEvaluation> {
    const internship = await internshipRepository.findById(internshipId);
    if (!internship || internship.companyId !== companyUserId) {
      throw AppError.notFound(`Internship with ID '${internshipId}' not found`);
    }

    // Verify application exists for this student in this internship
    const application = await applicationRepository.findByStudentAndInternship(
      data.studentId,
      internshipId
    );

    if (!application) {
      throw AppError.badRequest('Student has not applied to this internship');
    }

    if (application.status !== 'SELECTED') {
      throw AppError.badRequest(
        `Only selected students can be evaluated. Current student status is '${application.status}'`
      );
    }

    // Check if already evaluated
    const existingEval = await evaluationRepository.findByInternshipAndStudent(
      internshipId,
      data.studentId
    );
    if (existingEval) {
      throw AppError.conflict('Student has already been evaluated for this internship');
    }

    return evaluationRepository.create({
      ...data,
      internshipId,
      companyId: companyUserId,
      applicationId: application.id,
      studentName: application.studentName,
    });
  }

  /**
   * Get evaluations for an internship
   */
  async getEvaluations(internshipId: string, requestingUser: AuthUser): Promise<IEvaluation[]> {
    const internship = await internshipRepository.findById(internshipId);
    if (!internship) {
      throw AppError.notFound(`Internship with ID '${internshipId}' not found`);
    }

    if (requestingUser.role === UserRole.COMPANY && internship.companyId !== requestingUser.id) {
      throw AppError.notFound(`Internship with ID '${internshipId}' not found`);
    }

    return evaluationRepository.findByInternshipId(internshipId);
  }
}

export const internshipService = new InternshipService();
export default internshipService;
