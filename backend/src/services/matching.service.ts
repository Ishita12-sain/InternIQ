import studentRepository from '../repositories/student.repository';
import internshipRepository from '../repositories/internship.repository';
import userRepository from '../repositories/user.repository';
import eligibilityService, { normalizeBranch } from './eligibility.service';
import skillGapService, { normalizeSkill } from './skillGap.service';
import { AppError } from '../utils/appError';
import {
  ICandidateMatch,
  IMatchResult,
  IMatchScoreBreakdown,
  IMatchSkillGap,
} from '../types/intelligence.types';
import { IStudent } from '../types/student.types';
import { IInternship } from '../types/company.types';
import { AuthUser, UserRole } from '../types/user.types';

// ==========================================
// Named Constants & Matching Weights
// ==========================================

export const SKILL_ALIGNMENT_WEIGHT = 0.45;
export const ACADEMIC_ELIGIBILITY_WEIGHT = 0.25;
export const PROJECT_OVERLAP_WEIGHT = 0.20;
export const CERTIFICATION_WEIGHT = 0.10;

export class MatchingService {
  /**
   * Pure deterministic calculation of the match score between a student and an internship.
   */
  computeMatch(student: IStudent, internship: IInternship): IMatchResult {
    // 1. Skill Alignment (45%)
    const skillGapResult = skillGapService.computeSkillGap(student, internship);
    const skillScore = skillGapResult.skillMatchPercentage;
    const skillGap: IMatchSkillGap = {
      matched: skillGapResult.matchedSkills.map((s) => s.name),
      missing: skillGapResult.missingSkills,
    };

    // 2. Academic & Eligibility Fit (25%)
    const eligibilityResult = eligibilityService.evaluateCriteria(student, internship);
    const isEligible = eligibilityResult.isEligible;

    // CGPA component: min(student.cgpa / internship.minCgpa * 100, 100)
    let cgpaComponent = 100;
    if (internship.minCgpa > 0) {
      const studentCgpa = student.profile?.cgpa ?? 0;
      cgpaComponent = Math.min(100, Math.max(0, (studentCgpa / internship.minCgpa) * 100));
    }

    // Backlog component: 0 -> 100, 1 -> 80, 2 -> 60, 3 -> 40, 4+ -> 20
    const backlogs = student.profile?.backlogs ?? 0;
    let backlogComponent = 20;
    if (backlogs <= 0) {
      backlogComponent = 100;
    } else if (backlogs === 1) {
      backlogComponent = 80;
    } else if (backlogs === 2) {
      backlogComponent = 60;
    } else if (backlogs === 3) {
      backlogComponent = 40;
    } else {
      backlogComponent = 20;
    }

    // Branch component: 100 for matching allowed branch, 0 for non-matching
    const allowedBranches = internship.allowedBranches || [];
    let branchComponent = 100;
    if (allowedBranches.length > 0) {
      const studentBranch = normalizeBranch(student.profile?.department || '');
      const isBranchMatch = allowedBranches.some(
        (b) => normalizeBranch(b) === studentBranch
      );
      branchComponent = isBranchMatch ? 100 : 0;
    }

    const academicScore = Math.min(
      100,
      Math.max(
        0,
        (cgpaComponent * 0.50) + (backlogComponent * 0.25) + (branchComponent * 0.25)
      )
    );

    // 3. Project Technology Overlap (20%)
    const requiredSkills = internship.requiredSkills || [];
    let projectScore = 100;
    if (requiredSkills.length > 0) {
      const projectTechSet = new Set<string>();
      for (const project of student.projects || []) {
        for (const tech of project.technologies || []) {
          if (tech && tech.trim()) {
            projectTechSet.add(normalizeSkill(tech));
          }
        }
      }
      const overlappingCount = requiredSkills.filter((req) =>
        projectTechSet.has(normalizeSkill(req))
      ).length;
      projectScore = Math.min(
        100,
        Math.max(0, Math.round((overlappingCount / requiredSkills.length) * 100))
      );
    }

    // 4. Certification Relevance (10%)
    const requiredCerts = internship.certifications || [];
    let certificationScore = 100;
    if (requiredCerts.length > 0) {
      const studentCertSet = new Set<string>();
      for (const cert of student.certifications || []) {
        if (cert && cert.title && cert.title.trim()) {
          studentCertSet.add(normalizeSkill(cert.title));
        }
      }
      const matchedCertCount = requiredCerts.filter((rc) =>
        studentCertSet.has(normalizeSkill(rc))
      ).length;
      certificationScore = Math.min(
        100,
        Math.max(0, Math.round((matchedCertCount / requiredCerts.length) * 100))
      );
    }

    // 5. Final Composite Match Score
    const rawMatch =
      (skillScore * SKILL_ALIGNMENT_WEIGHT) +
      (academicScore * ACADEMIC_ELIGIBILITY_WEIGHT) +
      (projectScore * PROJECT_OVERLAP_WEIGHT) +
      (certificationScore * CERTIFICATION_WEIGHT);

    const matchScore = Math.min(100, Math.max(0, Math.round(rawMatch)));

    const scoreBreakdown: IMatchScoreBreakdown = {
      skillScore: Math.round(skillScore),
      academicScore: Math.round(academicScore),
      projectScore: Math.round(projectScore),
      certificationScore: Math.round(certificationScore),
    };

    return {
      matchScore,
      isEligible,
      scoreBreakdown,
      skillGap,
    };
  }

  /**
   * Calculate match score for an authenticated student against an internship
   */
  async calculateMatch(
    studentUserIdOrId: string,
    internshipId: string
  ): Promise<IMatchResult> {
    let student = await studentRepository.findByUserId(studentUserIdOrId);
    if (!student) {
      student = await studentRepository.findById(studentUserIdOrId);
    }
    if (!student) {
      const user = await userRepository.findById(studentUserIdOrId);
      if (user && user.role === UserRole.STUDENT) {
        student = await studentRepository.getOrCreate(user.id, user.name, user.email);
      }
    }
    if (!student) {
      throw AppError.notFound(`Student with ID '${studentUserIdOrId}' not found`);
    }

    const internship = await internshipRepository.findById(internshipId);
    if (!internship) {
      throw AppError.notFound(`Internship with ID '${internshipId}' not found`);
    }

    return this.computeMatch(student, internship);
  }

  /**
   * Calculate match score for staff (TNP/Admin) or Company on a specific student
   */
  async calculateMatchForStaffOrCompany(
    internshipId: string,
    studentId: string,
    requestingUser: AuthUser
  ): Promise<IMatchResult> {
    const internship = await internshipRepository.findById(internshipId);
    if (!internship) {
      throw AppError.notFound(`Internship with ID '${internshipId}' not found`);
    }

    // Company ownership check
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

    return this.computeMatch(student, internship);
  }

  /**
   * Rank all registered candidates for a specific internship by matchScore descending
   */
  async rankCandidatesForInternship(
    internshipId: string,
    requestingUser: AuthUser
  ): Promise<ICandidateMatch[]> {
    const internship = await internshipRepository.findById(internshipId);
    if (!internship) {
      throw AppError.notFound(`Internship with ID '${internshipId}' not found`);
    }

    // Company ownership check
    if (requestingUser.role === UserRole.COMPANY && internship.companyId !== requestingUser.id) {
      throw AppError.notFound(`Internship with ID '${internshipId}' not found`);
    }

    const allStudents = await studentRepository.findAll();
    const candidates: ICandidateMatch[] = [];

    for (const student of allStudents) {
      const matchResult = this.computeMatch(student, internship);
      candidates.push({
        studentId: student.userId || student.id,
        studentName: student.name,
        studentEmail: student.email,
        matchScore: matchResult.matchScore,
        isEligible: matchResult.isEligible,
        scoreBreakdown: matchResult.scoreBreakdown,
        skillGap: matchResult.skillGap,
      });
    }

    // Sort descending by matchScore
    candidates.sort((a, b) => b.matchScore - a.matchScore);

    return candidates;
  }
}

export const matchingService = new MatchingService();
export default matchingService;
