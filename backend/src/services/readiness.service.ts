import studentRepository from '../repositories/student.repository';
import userRepository from '../repositories/user.repository';
import { AppError } from '../utils/appError';
import { UserRole } from '../types/user.types';
import {
  IDimensionScores,
  IReadinessResult,
  ReadinessBand,
} from '../types/intelligence.types';
import {
  ICertification,
  IProject,
  ISkill,
  IStudent,
  IStudentProfile,
  SkillProficiency,
} from '../types/student.types';

// ==========================================
// Named Constants & Dimension Weights
// ==========================================

export const PROFILE_WEIGHT = 0.15;
export const ACADEMIC_WEIGHT = 0.25;
export const SKILLS_WEIGHT = 0.25;
export const PROJECT_WEIGHT = 0.25;
export const CERTIFICATION_WEIGHT = 0.10;

const PROFICIENCY_VAL: Record<SkillProficiency, number> = {
  BEGINNER: 1,
  INTERMEDIATE: 2,
  ADVANCED: 3,
  EXPERT: 4,
};

// ==========================================
// Helper Scoring Functions
// ==========================================

export const getReadinessBand = (score: number): ReadinessBand => {
  if (score >= 80) return 'TOP_CANDIDATE';
  if (score >= 60) return 'JOB_READY';
  if (score >= 40) return 'EMERGING';
  return 'NEEDS_WORK';
};

export class ReadinessService {
  /**
   * 1. Profile Completeness (0-100)
   * 5 fields (phone, bio, githubUrl, linkedinUrl, resumeUrl), 20 points each.
   */
  calculateProfileScore(profile?: IStudentProfile): number {
    if (!profile) return 0;
    const fields = [
      profile.phone,
      profile.bio,
      profile.githubUrl,
      profile.linkedinUrl,
      profile.resumeUrl,
    ];
    const populatedCount = fields.filter(
      (f) => typeof f === 'string' && f.trim().length > 0
    ).length;
    return Math.min(100, Math.max(0, populatedCount * 20));
  }

  /**
   * 2. Academic Standing (0-100)
   * cgpaScore: min(cgpa / 10 * 100, 100) * 0.70
   * backlogScore: (0: 100, 1: 80, 2: 60, 3: 40, 4+: 20) * 0.30
   */
  calculateAcademicScore(profile?: IStudentProfile): number {
    if (!profile) return 0;

    // CGPA component
    let cgpaScore = 0;
    if (profile.cgpa !== undefined && profile.cgpa !== null && !isNaN(profile.cgpa)) {
      cgpaScore = Math.min(100, Math.max(0, (profile.cgpa / 10) * 100));
    }

    // Backlog component
    const backlogs = profile.backlogs ?? 0;
    let backlogScore = 20;
    if (backlogs <= 0) {
      backlogScore = 100;
    } else if (backlogs === 1) {
      backlogScore = 80;
    } else if (backlogs === 2) {
      backlogScore = 60;
    } else if (backlogs === 3) {
      backlogScore = 40;
    } else {
      backlogScore = 20;
    }

    const academicScore = (cgpaScore * 0.7) + (backlogScore * 0.3);
    return Math.min(100, Math.max(0, academicScore));
  }

  /**
   * 3. Technical Skill Depth (0-100)
   * proficiencyScore (70%): averageProficiency * 100
   * breadthScore (30%): (0: 0, 1-2: 25, 3-4: 50, 5-6: 75, 7+: 100)
   */
  calculateSkillsScore(skills?: ISkill[]): number {
    if (!skills || skills.length === 0) return 0;

    const skillCount = skills.length;
    const totalProf = skills.reduce(
      (sum, s) => sum + (PROFICIENCY_VAL[s.proficiency] || 1),
      0
    );
    const averageProficiency = totalProf / (skillCount * 4);
    const proficiencyScore = averageProficiency * 100;

    let breadthScore = 0;
    if (skillCount >= 7) {
      breadthScore = 100;
    } else if (skillCount >= 5) {
      breadthScore = 75;
    } else if (skillCount >= 3) {
      breadthScore = 50;
    } else if (skillCount >= 1) {
      breadthScore = 25;
    }

    const skillsScore = (proficiencyScore * 0.7) + (breadthScore * 0.3);
    return Math.min(100, Math.max(0, skillsScore));
  }

  /**
   * 4. Project Portfolio (0-100)
   * quantity (35%) + diversity (30%) + links (25%) + ongoing (10%)
   */
  calculateProjectScore(projects?: IProject[]): number {
    if (!projects || projects.length === 0) return 0;

    const projectCount = projects.length;

    // Quantity (35%)
    let quantityScore = 0;
    if (projectCount >= 4) {
      quantityScore = 100;
    } else if (projectCount === 3) {
      quantityScore = 75;
    } else if (projectCount === 2) {
      quantityScore = 50;
    } else if (projectCount === 1) {
      quantityScore = 25;
    }

    // Technology diversity (30%)
    const uniqueTechs = new Set<string>();
    for (const p of projects) {
      for (const t of p.technologies || []) {
        if (t && t.trim()) uniqueTechs.add(t.trim().toLowerCase());
      }
    }
    const techCount = uniqueTechs.size;
    let techDiversityScore = 0;
    if (techCount >= 7) {
      techDiversityScore = 100;
    } else if (techCount >= 5) {
      techDiversityScore = 75;
    } else if (techCount >= 3) {
      techDiversityScore = 50;
    } else if (techCount >= 1) {
      techDiversityScore = 25;
    }

    // Link quality (25%)
    let totalLinkScore = 0;
    for (const p of projects) {
      let pScore = 0;
      if (typeof p.githubUrl === 'string' && p.githubUrl.trim().length > 0) pScore += 50;
      if (typeof p.liveUrl === 'string' && p.liveUrl.trim().length > 0) pScore += 50;
      totalLinkScore += Math.min(100, pScore);
    }
    const linkScore = totalLinkScore / projectCount;

    // Ongoing activity (10%)
    const hasOngoing = projects.some((p) => p.isOngoing === true);
    const ongoingScore = hasOngoing ? 100 : 50;

    const projectScore =
      (quantityScore * 0.35) +
      (techDiversityScore * 0.30) +
      (linkScore * 0.25) +
      (ongoingScore * 0.10);

    return Math.min(100, Math.max(0, projectScore));
  }

  /**
   * 5. Certifications (0-100)
   * quantity (60%) + validity (40%)
   */
  calculateCertificationScore(certifications?: ICertification[]): number {
    if (!certifications || certifications.length === 0) return 0;

    const certCount = certifications.length;

    // Quantity (60%)
    let quantityScore = 0;
    if (certCount >= 3) {
      quantityScore = 100;
    } else if (certCount === 2) {
      quantityScore = 70;
    } else if (certCount === 1) {
      quantityScore = 40;
    }

    // Validity (40%)
    const now = Date.now();
    const validCount = certifications.filter((c) => {
      if (!c.expiryDate || !c.expiryDate.trim()) return true;
      const exp = new Date(c.expiryDate).getTime();
      return !isNaN(exp) && exp > now;
    }).length;

    const validityScore = (validCount / certCount) * 100;

    const certScore = (quantityScore * 0.6) + (validityScore * 0.4);
    return Math.min(100, Math.max(0, certScore));
  }

  /**
   * Deterministic next-best actions generation prioritized by lowest scoring dimension first.
   */
  generateNextBestActions(dimensionScores: {
    profile: number;
    academics: number;
    skills: number;
    projects: number;
    certifications: number;
  }): string[] {
    const candidates: { score: number; action: string }[] = [];

    if (dimensionScores.profile < 60) {
      candidates.push({
        score: dimensionScores.profile,
        action: 'Complete your profile with GitHub, LinkedIn, resume, phone, and bio.',
      });
    }
    if (dimensionScores.academics < 60) {
      candidates.push({
        score: dimensionScores.academics,
        action: 'Improve your academic standing and reduce active backlogs.',
      });
    }
    if (dimensionScores.skills < 60) {
      candidates.push({
        score: dimensionScores.skills,
        action: 'Add more relevant technical skills and improve proficiency levels.',
      });
    }
    if (dimensionScores.projects < 60) {
      candidates.push({
        score: dimensionScores.projects,
        action: 'Build more substantial projects and add GitHub or live-demo links.',
      });
    }
    if (dimensionScores.certifications < 60) {
      candidates.push({
        score: dimensionScores.certifications,
        action: 'Add relevant certifications to strengthen your profile.',
      });
    }

    if (candidates.length === 0) {
      return ['Maintain your current profile strength and focus on role-specific skill depth.'];
    }

    // Sort by lowest score first
    candidates.sort((a, b) => a.score - b.score);

    // Return at most 3 actions
    return candidates.slice(0, 3).map((c) => c.action);
  }

  /**
   * Pure deterministic computation of student readiness.
   */
  computeReadiness(student: IStudent): IReadinessResult {
    const profileScore = this.calculateProfileScore(student.profile);
    const academicScore = this.calculateAcademicScore(student.profile);
    const skillsScore = this.calculateSkillsScore(student.skills);
    const projectScore = this.calculateProjectScore(student.projects);
    const certificationScore = this.calculateCertificationScore(student.certifications);

    const rawOverall =
      (profileScore * PROFILE_WEIGHT) +
      (academicScore * ACADEMIC_WEIGHT) +
      (skillsScore * SKILLS_WEIGHT) +
      (projectScore * PROJECT_WEIGHT) +
      (certificationScore * CERTIFICATION_WEIGHT);

    const overallScore = Math.min(100, Math.max(0, Math.round(rawOverall)));

    const dimensionScores: IDimensionScores = {
      profile: Math.round(profileScore),
      academics: Math.round(academicScore),
      skills: Math.round(skillsScore),
      projects: Math.round(projectScore),
      certifications: Math.round(certificationScore),
    };

    const readinessBand = getReadinessBand(overallScore);
    const nextBestActions = this.generateNextBestActions(dimensionScores);

    return {
      overallScore,
      dimensionScores,
      readinessBand,
      nextBestActions,
    };
  }

  /**
   * Calculate readiness for a student user by ID or userId
   */
  async calculateStudentReadiness(studentUserIdOrId: string): Promise<IReadinessResult> {
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

    return this.computeReadiness(student);
  }
}

export const readinessService = new ReadinessService();
export default readinessService;
