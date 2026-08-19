import studentRepository from '../repositories/student.repository';
import internshipRepository from '../repositories/internship.repository';
import { AppError } from '../utils/appError';
import {
  IMatchedSkill,
  ISkillGapResult,
} from '../types/intelligence.types';
import { IStudent, SkillProficiency } from '../types/student.types';
import { IInternship } from '../types/company.types';
import { AuthUser, UserRole } from '../types/user.types';

// ==========================================
// Helper Functions & Proficiency Weights
// ==========================================

const PROFICIENCY_RANK: Record<SkillProficiency, number> = {
  BEGINNER: 1,
  INTERMEDIATE: 2,
  ADVANCED: 3,
  EXPERT: 4,
};

export const normalizeSkill = (skill: string): string => {
  return skill.trim().toLowerCase();
};

export const getHigherProficiency = (
  p1: SkillProficiency,
  p2: SkillProficiency
): SkillProficiency => {
  return PROFICIENCY_RANK[p1] >= PROFICIENCY_RANK[p2] ? p1 : p2;
};

export class SkillGapService {
  /**
   * Pure deterministic computation comparing student skills & projects against internship required skills.
   */
  computeSkillGap(student: IStudent, internship: IInternship): ISkillGapResult {
    const requiredSkills = internship.requiredSkills || [];
    const totalRequiredSkills = requiredSkills.length;

    // Handle zero required skills edge case
    if (totalRequiredSkills === 0) {
      return {
        skillMatchPercentage: 100,
        matchedSkills: [],
        missingSkills: [],
        totalRequiredSkills: 0,
        matchedSkillCount: 0,
        remediationAdvice: [],
      };
    }

    // 1. Build declared skills map with highest resolved proficiency
    const declaredSkillsMap = new Map<string, SkillProficiency>();
    for (const skill of student.skills || []) {
      if (!skill.name) continue;
      const normalized = normalizeSkill(skill.name);
      const existing = declaredSkillsMap.get(normalized);
      if (existing) {
        declaredSkillsMap.set(normalized, getHigherProficiency(existing, skill.proficiency));
      } else {
        declaredSkillsMap.set(normalized, skill.proficiency);
      }
    }

    // 2. Build project technologies set
    const projectTechSet = new Set<string>();
    for (const project of student.projects || []) {
      for (const tech of project.technologies || []) {
        if (!tech) continue;
        projectTechSet.add(normalizeSkill(tech));
      }
    }

    // 3. Match each required skill
    const matchedSkills: IMatchedSkill[] = [];
    const missingSkills: string[] = [];
    const remediationAdvice: string[] = [];

    for (const reqSkill of requiredSkills) {
      const normalizedReq = normalizeSkill(reqSkill);

      if (declaredSkillsMap.has(normalizedReq)) {
        matchedSkills.push({
          name: reqSkill,
          source: 'DECLARED_SKILL',
          proficiency: declaredSkillsMap.get(normalizedReq)!,
        });
      } else if (projectTechSet.has(normalizedReq)) {
        matchedSkills.push({
          name: reqSkill,
          source: 'PROJECT_TECHNOLOGY',
          proficiency: null,
        });
      } else {
        missingSkills.push(reqSkill);
        remediationAdvice.push(`Learn ${reqSkill} to improve your match for this internship.`);
      }
    }

    const matchedSkillCount = matchedSkills.length;
    const skillMatchPercentage = Math.round((matchedSkillCount / totalRequiredSkills) * 100);

    return {
      skillMatchPercentage,
      matchedSkills,
      missingSkills,
      totalRequiredSkills,
      matchedSkillCount,
      remediationAdvice,
    };
  }

  /**
   * Analyze skill gap for an authenticated student
   */
  async analyzeStudentForInternship(
    studentUserIdOrId: string,
    internshipId: string
  ): Promise<ISkillGapResult> {
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

    return this.computeSkillGap(student, internship);
  }

  /**
   * Analyze skill gap for staff (TNP/Admin) or Company on a specific student
   */
  async analyzeStudentForStaffOrCompany(
    internshipId: string,
    studentId: string,
    requestingUser: AuthUser
  ): Promise<ISkillGapResult> {
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

    return this.computeSkillGap(student, internship);
  }
}

export const skillGapService = new SkillGapService();
export default skillGapService;
