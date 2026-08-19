import internshipRepository from '../repositories/internship.repository';
import applicationRepository from '../repositories/application.repository';
import evaluationRepository from '../repositories/evaluation.repository';
import studentRepository from '../repositories/student.repository';
import lifecycleRepository from '../repositories/lifecycle.repository';
import { AppError } from '../utils/appError';
import { AuthUser, UserRole } from '../types/user.types';
import { IApplication } from '../types/company.types';
import {
  IOfferLetter,
  IMentorAssignment,
  IInternshipProgress,
  IInternshipCompletion,
  IPpoDecision,
  OfferStatus,
  PpoStatus,
} from '../types/lifecycle.types';
import {
  CreateOfferInput,
  AssignMentorInput,
  SubmitProgressInput,
  ReviewProgressInput,
  CompleteInternshipInput,
  UpdatePpoDecisionInput,
} from '../validations/lifecycle.validation';

export class LifecycleService {
  // ==========================================
  // 1. Student Applications View
  // ==========================================

  async getStudentApplications(studentUserId: string): Promise<IApplication[]> {
    return applicationRepository.findByStudentId(studentUserId);
  }

  // ==========================================
  // 2. Offer Letter Workflow
  // ==========================================

  async createOffer(
    internshipId: string,
    companyUserId: string,
    data: CreateOfferInput
  ): Promise<IOfferLetter> {
    const internship = await internshipRepository.findById(internshipId);
    if (!internship || internship.companyId !== companyUserId) {
      throw AppError.notFound(`Internship with ID '${internshipId}' not found`);
    }

    const application = await applicationRepository.findById(data.applicationId);
    if (!application || application.internshipId !== internshipId) {
      throw AppError.notFound(`Application with ID '${data.applicationId}' not found`);
    }

    if (application.status !== 'SELECTED') {
      throw AppError.badRequest(
        `Offer letters can only be created for SELECTED candidates. Current application status is '${application.status}'`
      );
    }

    const existingOffer = await lifecycleRepository.findOfferByApplicationId(data.applicationId);
    if (existingOffer) {
      throw AppError.conflict('An offer letter has already been issued for this application');
    }

    return lifecycleRepository.createOffer({
      internshipId,
      applicationId: data.applicationId,
      companyId: internship.companyId,
      studentId: application.studentId,
      companyName: internship.companyName,
      internshipTitle: internship.title,
      studentName: application.studentName,
      studentEmail: application.studentEmail,
      startDate: data.startDate,
      duration: data.duration,
      stipend: data.stipend,
      currency: data.currency || internship.currency || 'INR',
      terms: data.terms,
    });
  }

  async getInternshipOffers(
    internshipId: string,
    requestingUser: AuthUser
  ): Promise<IOfferLetter[]> {
    const internship = await internshipRepository.findById(internshipId);
    if (!internship) {
      throw AppError.notFound(`Internship with ID '${internshipId}' not found`);
    }

    if (requestingUser.role === UserRole.COMPANY && internship.companyId !== requestingUser.id) {
      throw AppError.notFound(`Internship with ID '${internshipId}' not found`);
    }

    return lifecycleRepository.findOffersByInternshipId(internshipId);
  }

  async getStudentOffers(studentUserId: string): Promise<IOfferLetter[]> {
    return lifecycleRepository.findOffersByStudentId(studentUserId);
  }

  async respondToOffer(
    offerId: string,
    studentUserId: string,
    action: 'ACCEPT' | 'REJECT'
  ): Promise<IOfferLetter> {
    const offer = await lifecycleRepository.findOfferById(offerId);
    if (!offer || offer.studentId !== studentUserId) {
      throw AppError.notFound(`Offer letter with ID '${offerId}' not found`);
    }

    if (offer.status !== 'OFFERED') {
      throw AppError.badRequest(
        `Cannot respond to offer in '${offer.status}' status. Only 'OFFERED' status can be updated.`
      );
    }

    const newStatus: OfferStatus = action === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED';
    const updated = await lifecycleRepository.updateOfferStatus(offerId, newStatus);
    if (!updated) {
      throw AppError.notFound(`Offer letter with ID '${offerId}' not found`);
    }

    return updated;
  }

  // ==========================================
  // 3. Mentor Assignment Workflow
  // ==========================================

  async assignMentor(
    internshipId: string,
    requestingUser: AuthUser,
    data: AssignMentorInput
  ): Promise<IMentorAssignment> {
    const internship = await internshipRepository.findById(internshipId);
    if (!internship) {
      throw AppError.notFound(`Internship with ID '${internshipId}' not found`);
    }

    if (requestingUser.role === UserRole.COMPANY && internship.companyId !== requestingUser.id) {
      throw AppError.notFound(`Internship with ID '${internshipId}' not found`);
    }

    // Verify candidate application is selected
    const application = await applicationRepository.findByStudentAndInternship(
      data.studentId,
      internshipId
    );
    if (!application || application.status !== 'SELECTED') {
      throw AppError.badRequest('Mentors can only be assigned to SELECTED students');
    }

    return lifecycleRepository.createMentorAssignment({
      internshipId,
      studentId: data.studentId,
      companyId: internship.companyId,
      mentorName: data.mentorName,
      mentorEmail: data.mentorEmail,
      mentorDesignation: data.mentorDesignation,
      mentorDepartment: data.mentorDepartment,
      assignedBy: requestingUser.name || requestingUser.id,
    });
  }

  async getInternshipMentors(
    internshipId: string,
    requestingUser: AuthUser
  ): Promise<IMentorAssignment[]> {
    const internship = await internshipRepository.findById(internshipId);
    if (!internship) {
      throw AppError.notFound(`Internship with ID '${internshipId}' not found`);
    }

    if (requestingUser.role === UserRole.COMPANY && internship.companyId !== requestingUser.id) {
      throw AppError.notFound(`Internship with ID '${internshipId}' not found`);
    }

    return lifecycleRepository.findMentorsByInternshipId(internshipId);
  }

  async getStudentMentors(studentUserId: string): Promise<IMentorAssignment[]> {
    return lifecycleRepository.findMentorsByStudentId(studentUserId);
  }

  // ==========================================
  // 4. Milestone Progress Workflow
  // ==========================================

  async submitProgress(
    studentUserId: string,
    data: SubmitProgressInput
  ): Promise<IInternshipProgress> {
    const internship = await internshipRepository.findById(data.internshipId);
    if (!internship) {
      throw AppError.notFound(`Internship with ID '${data.internshipId}' not found`);
    }

    const application = await applicationRepository.findByStudentAndInternship(
      studentUserId,
      data.internshipId
    );
    if (!application || application.status !== 'SELECTED') {
      throw AppError.badRequest('Only SELECTED students can submit internship progress updates');
    }

    // Check if internship is already completed
    const completion = await lifecycleRepository.findCompletionByInternshipAndStudent(
      data.internshipId,
      studentUserId
    );
    if (completion) {
      throw AppError.badRequest('Cannot submit progress for an already completed internship');
    }

    return lifecycleRepository.createProgress({
      internshipId: data.internshipId,
      studentId: studentUserId,
      milestoneTitle: data.milestoneTitle,
      tasksCompleted: data.tasksCompleted,
      learnings: data.learnings,
      blockers: data.blockers,
    });
  }

  async getStudentProgress(
    studentUserId: string,
    internshipId: string
  ): Promise<IInternshipProgress[]> {
    return lifecycleRepository.findProgressByInternshipAndStudent(internshipId, studentUserId);
  }

  async getInternshipStudentProgress(
    internshipId: string,
    studentId: string,
    requestingUser: AuthUser
  ): Promise<IInternshipProgress[]> {
    const internship = await internshipRepository.findById(internshipId);
    if (!internship) {
      throw AppError.notFound(`Internship with ID '${internshipId}' not found`);
    }

    if (requestingUser.role === UserRole.COMPANY && internship.companyId !== requestingUser.id) {
      throw AppError.notFound(`Internship with ID '${internshipId}' not found`);
    }

    return lifecycleRepository.findProgressByInternshipAndStudent(internshipId, studentId);
  }

  async reviewProgress(
    internshipId: string,
    progressId: string,
    reviewerUser: AuthUser,
    data: ReviewProgressInput
  ): Promise<IInternshipProgress> {
    const internship = await internshipRepository.findById(internshipId);
    if (!internship) {
      throw AppError.notFound(`Internship with ID '${internshipId}' not found`);
    }

    if (reviewerUser.role === UserRole.COMPANY && internship.companyId !== reviewerUser.id) {
      throw AppError.notFound(`Internship with ID '${internshipId}' not found`);
    }

    const progress = await lifecycleRepository.findProgressById(progressId);
    if (!progress || progress.internshipId !== internshipId) {
      throw AppError.notFound(`Progress record with ID '${progressId}' not found`);
    }

    const updated = await lifecycleRepository.updateProgressReview(
      progressId,
      data.status,
      reviewerUser.name || reviewerUser.id,
      data.reviewerComments
    );

    if (!updated) {
      throw AppError.notFound(`Progress record with ID '${progressId}' not found`);
    }

    return updated;
  }

  // ==========================================
  // 5. Internship Completion Workflow
  // ==========================================

  async completeInternship(
    internshipId: string,
    companyUserId: string,
    data: CompleteInternshipInput
  ): Promise<IInternshipCompletion> {
    const internship = await internshipRepository.findById(internshipId);
    if (!internship || internship.companyId !== companyUserId) {
      throw AppError.notFound(`Internship with ID '${internshipId}' not found`);
    }

    const application = await applicationRepository.findByStudentAndInternship(
      data.studentId,
      internshipId
    );
    if (!application || application.status !== 'SELECTED') {
      throw AppError.badRequest('Only SELECTED students can complete their internship');
    }

    const existingCompletion = await lifecycleRepository.findCompletionByInternshipAndStudent(
      internshipId,
      data.studentId
    );
    if (existingCompletion) {
      throw AppError.conflict('Internship has already been marked as completed for this student');
    }

    return lifecycleRepository.createCompletion({
      internshipId,
      studentId: data.studentId,
      companyId: internship.companyId,
      companyName: internship.companyName,
      internshipTitle: internship.title,
      studentName: application.studentName,
      startDate: data.startDate,
      completionDate: data.completionDate,
      finalRemarks: data.finalRemarks,
      certificateUrl: data.certificateUrl,
    });
  }

  async getInternshipCompletions(
    internshipId: string,
    requestingUser: AuthUser
  ): Promise<IInternshipCompletion[]> {
    const internship = await internshipRepository.findById(internshipId);
    if (!internship) {
      throw AppError.notFound(`Internship with ID '${internshipId}' not found`);
    }

    if (requestingUser.role === UserRole.COMPANY && internship.companyId !== requestingUser.id) {
      throw AppError.notFound(`Internship with ID '${internshipId}' not found`);
    }

    return lifecycleRepository.findCompletionsByInternshipId(internshipId);
  }

  async getStudentCompletions(studentUserId: string): Promise<IInternshipCompletion[]> {
    return lifecycleRepository.findCompletionsByStudentId(studentUserId);
  }

  // ==========================================
  // 6. PPO Decision Workflow
  // ==========================================

  async updatePpoDecision(
    internshipId: string,
    requestingUser: AuthUser,
    data: UpdatePpoDecisionInput
  ): Promise<IPpoDecision> {
    const internship = await internshipRepository.findById(internshipId);
    if (!internship) {
      throw AppError.notFound(`Internship with ID '${internshipId}' not found`);
    }

    if (requestingUser.role === UserRole.COMPANY && internship.companyId !== requestingUser.id) {
      throw AppError.notFound(`Internship with ID '${internshipId}' not found`);
    }

    const application = await applicationRepository.findByStudentAndInternship(
      data.studentId,
      internshipId
    );
    if (!application || application.status !== 'SELECTED') {
      throw AppError.badRequest('PPO decisions can only be managed for SELECTED students');
    }

    // Validate PPO state transitions if a record already exists
    const existingPpo = await lifecycleRepository.findPpoByInternshipAndStudent(
      internshipId,
      data.studentId
    );

    if (existingPpo) {
      const current = existingPpo.status;
      const validPpoTransitions: Record<PpoStatus, PpoStatus[]> = {
        UNDER_REVIEW: ['RECOMMENDED', 'OFFERED', 'DECLINED'],
        RECOMMENDED: ['OFFERED', 'DECLINED'],
        OFFERED: ['ACCEPTED', 'DECLINED'],
        ACCEPTED: [],
        DECLINED: [],
      };

      const allowed = validPpoTransitions[current] || [];
      if (!allowed.includes(data.status)) {
        throw AppError.badRequest(
          `Invalid PPO state transition from '${current}' to '${data.status}'. Allowed transitions are: [${allowed.join(', ')}]`
        );
      }
    }

    return lifecycleRepository.upsertPpo({
      internshipId,
      studentId: data.studentId,
      companyId: internship.companyId,
      status: data.status,
      packageLpa: data.packageLpa,
      designation: data.designation,
      joiningDate: data.joiningDate,
      remarks: data.remarks,
      updatedBy: requestingUser.name || requestingUser.id,
    });
  }

  async getInternshipPpos(
    internshipId: string,
    requestingUser: AuthUser
  ): Promise<IPpoDecision[]> {
    const internship = await internshipRepository.findById(internshipId);
    if (!internship) {
      throw AppError.notFound(`Internship with ID '${internshipId}' not found`);
    }

    if (requestingUser.role === UserRole.COMPANY && internship.companyId !== requestingUser.id) {
      throw AppError.notFound(`Internship with ID '${internshipId}' not found`);
    }

    return lifecycleRepository.findPposByInternshipId(internshipId);
  }
}

export const lifecycleService = new LifecycleService();
export default lifecycleService;
