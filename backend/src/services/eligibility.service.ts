import studentRepository from '../repositories/student.repository';
import internshipRepository from '../repositories/internship.repository';
import { AppError } from '../utils/appError';
import {
  ICriterionResult,
  IEligibilityResult,
} from '../types/intelligence.types';
import { IStudent } from '../types/student.types';
import { IInternship } from '../types/company.types';
import { AuthUser, UserRole } from '../types/user.types';

// ==========================================
// Isolated Rules & Helper Functions
// ==========================================

export const MAX_ALLOWED_BACKLOGS = 0;

export const isBacklogEligible = (backlogs: number): boolean => {
  return backlogs <= MAX_ALLOWED_BACKLOGS;
};

export const normalizeSkill = (skill: string): string => {
  return skill.trim().toLowerCase();
};

export const normalizeBranch = (branch: string): string => {
  return branch.trim().toLowerCase();
};

export class EligibilityService {
  /**
   * Evaluates all 6 eligibility criteria for a given student and internship.
   * Does NOT short-circuit on failure to ensure full explainability.
   */
  evaluateCriteria(student: IStudent, internship: IInternship): IEligibilityResult {
    const criteriaBreakdown: ICriterionResult[] = [];

    // 1. Internship Status
    const isStatusOpen = internship.status === 'OPEN';
    criteriaBreakdown.push({
      criterion: 'INTERNSHIP_STATUS',
      required: 'OPEN',
      actual: internship.status,
      met: isStatusOpen,
      message: isStatusOpen
        ? 'Internship is currently open.'
        : `Internship is currently ${internship.status.toLowerCase()} and not accepting applications.`,
    });

    // 2. Application Deadline
    const now = new Date();
    let isDeadlineValid = false;
    let deadlineIso = internship.applicationDeadline;

    const parsedDeadline = new Date(internship.applicationDeadline);
    if (isNaN(parsedDeadline.getTime())) {
      throw AppError.badRequest(`Invalid application deadline format: '${internship.applicationDeadline}'`);
    } else {
      deadlineIso = parsedDeadline.toISOString();
      isDeadlineValid = now.getTime() <= parsedDeadline.getTime();
    }

    criteriaBreakdown.push({
      criterion: 'APPLICATION_DEADLINE',
      required: deadlineIso,
      actual: now.toISOString(),
      met: isDeadlineValid,
      message: isDeadlineValid
        ? 'Application deadline has not passed.'
        : 'Application deadline has passed.',
    });

    // 3. CGPA
    const studentCgpa = student.profile?.cgpa ?? 0;
    const isCgpaMet = studentCgpa >= internship.minCgpa;
    criteriaBreakdown.push({
      criterion: 'CGPA',
      required: internship.minCgpa,
      actual: studentCgpa,
      met: isCgpaMet,
      message: isCgpaMet
        ? 'Student CGPA meets the minimum requirement.'
        : `Student CGPA (${studentCgpa}) is below the minimum requirement (${internship.minCgpa}).`,
    });

    // 4. Backlogs (Isolated Rule)
    const studentBacklogs = student.profile?.backlogs ?? 0;
    const isBacklogMet = isBacklogEligible(studentBacklogs);
    criteriaBreakdown.push({
      criterion: 'BACKLOGS',
      required: MAX_ALLOWED_BACKLOGS,
      actual: studentBacklogs,
      met: isBacklogMet,
      message: isBacklogMet
        ? 'Student has no active backlogs.'
        : `Student has ${studentBacklogs} active backlog(s); maximum allowed is ${MAX_ALLOWED_BACKLOGS}.`,
    });

    // 5. Branch / Department
    const studentBranch = student.profile?.department || '';
    const normalizedStudentBranch = normalizeBranch(studentBranch);
    const allowedBranches = internship.allowedBranches || [];
    const isBranchMet = allowedBranches.some(
      (b) => normalizeBranch(b) === normalizedStudentBranch
    );
    criteriaBreakdown.push({
      criterion: 'BRANCH',
      required: allowedBranches,
      actual: studentBranch || 'Not specified',
      met: isBranchMet,
      message: isBranchMet
        ? 'Student branch is eligible.'
        : `Student branch '${studentBranch || 'Not specified'}' is not in allowed branches: [${allowedBranches.join(', ')}].`,
    });

    // 6. Required Skills (Projects do not count for eligibility)
    const requiredSkills = internship.requiredSkills || [];
    const studentSkillSet = new Set(
      (student.skills || []).map((s) => normalizeSkill(s.name))
    );
    const missingSkills = requiredSkills.filter(
      (reqSkill) => !studentSkillSet.has(normalizeSkill(reqSkill))
    );
    const isSkillsMet = missingSkills.length === 0;

    criteriaBreakdown.push({
      criterion: 'REQUIRED_SKILLS',
      required: requiredSkills,
      actual: (student.skills || []).map((s) => s.name),
      met: isSkillsMet,
      message: isSkillsMet
        ? 'Student has all required skills.'
        : `Student is missing ${missingSkills.length} required skill(s): [${missingSkills.join(', ')}].`,
    });

    // Compute overall eligibility and summary
    const isEligible = criteriaBreakdown.every((c) => c.met);
    const failedCount = criteriaBreakdown.filter((c) => !c.met).length;

    const summary = isEligible
      ? 'Student is eligible to apply for this internship.'
      : `Student is not eligible because ${failedCount} eligibility criteria were not met.`;

    return {
      isEligible,
      criteriaBreakdown,
      summary,
    };
  }

  /**
   * Check eligibility for a student user on an internship
   */
  async checkEligibility(studentUserIdOrId: string, internshipId: string): Promise<IEligibilityResult> {
    let student = await studentRepository.findByUserId(studentUserIdOrId);
    if (!student) {
      student = await studentRepository.findById(studentUserIdOrId);
    }
    if (!student) {
      throw AppError.notFound(`Student with ID '${studentUserIdOrId}' not found`);
    }

    const internship = await internshipRepository.findById(internshipId);
    if (!internship) {
      throw AppError.notFound(`Internship with ID '${internshipId}' not found`);
    }

    return this.evaluateCriteria(student, internship);
  }

  /**
   * Check eligibility for staff (TNP/Admin) or Company on an internship
   */
  async checkEligibilityForStaffOrCompany(
    internshipId: string,
    studentId: string,
    requestingUser: AuthUser
  ): Promise<IEligibilityResult> {
    const internship = await internshipRepository.findById(internshipId);
    if (!internship) {
      throw AppError.notFound(`Internship with ID '${internshipId}' not found`);
    }

    // Company ownership check: must return 404 if company does not own the internship
    if (requestingUser.role === UserRole.COMPANY && internship.companyId !== requestingUser.id) {
      throw AppError.notFound(`Internship with ID '${internshipId}' not found`);
    }

    let student = await studentRepository.findById(studentId);
    if (!student) {
      student = await studentRepository.findByUserId(studentId);
    }
    if (!student) {
      throw AppError.notFound(`Student with ID '${studentId}' not found`);
    }

    return this.evaluateCriteria(student, internship);
  }
}

export const eligibilityService = new EligibilityService();
export default eligibilityService;
