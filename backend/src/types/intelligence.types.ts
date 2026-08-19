import { SkillProficiency } from './student.types';
import { InternshipMode } from './company.types';

// ==========================================
// Phase 1: Eligibility Engine Types
// ==========================================

export type EligibilityCriterion =
  | 'INTERNSHIP_STATUS'
  | 'APPLICATION_DEADLINE'
  | 'CGPA'
  | 'BACKLOGS'
  | 'BRANCH'
  | 'REQUIRED_SKILLS';

export interface ICriterionResult {
  criterion: EligibilityCriterion;
  required: unknown;
  actual: unknown;
  met: boolean;
  message: string;
}

export interface IEligibilityResult {
  isEligible: boolean;
  criteriaBreakdown: ICriterionResult[];
  summary: string;
}

// ==========================================
// Phase 2: Skill Gap Engine Types
// ==========================================

export type SkillMatchSource = 'DECLARED_SKILL' | 'PROJECT_TECHNOLOGY';

export interface IMatchedSkill {
  name: string;
  source: SkillMatchSource;
  proficiency: SkillProficiency | null;
}

export interface ISkillGapResult {
  skillMatchPercentage: number;
  matchedSkills: IMatchedSkill[];
  missingSkills: string[];
  totalRequiredSkills: number;
  matchedSkillCount: number;
  remediationAdvice: string[];
}

// ==========================================
// Phase 3: Student Readiness Engine Types
// ==========================================

export type ReadinessBand =
  | 'NEEDS_WORK'
  | 'EMERGING'
  | 'JOB_READY'
  | 'TOP_CANDIDATE';

export interface IDimensionScores {
  profile: number;
  academics: number;
  skills: number;
  projects: number;
  certifications: number;
}

export interface IReadinessResult {
  overallScore: number;
  dimensionScores: IDimensionScores;
  readinessBand: ReadinessBand;
  nextBestActions: string[];
}

// ==========================================
// Phase 4: Student ↔ Internship Matching Types
// ==========================================

export interface IMatchScoreBreakdown {
  skillScore: number;
  academicScore: number;
  projectScore: number;
  certificationScore: number;
}

export interface IMatchSkillGap {
  matched: string[];
  missing: string[];
}

export interface IMatchResult {
  matchScore: number;
  isEligible: boolean;
  scoreBreakdown: IMatchScoreBreakdown;
  skillGap: IMatchSkillGap;
}

export interface ICandidateMatch {
  studentId: string;
  studentName?: string;
  studentEmail?: string;
  matchScore: number;
  isEligible: boolean;
  scoreBreakdown: IMatchScoreBreakdown;
  skillGap: IMatchSkillGap;
}

// ==========================================
// Phase 5: Student Recommendation Engine Types
// ==========================================

export interface IInternshipRecommendation {
  internshipId: string;
  title: string;
  companyName: string;
  location: string;
  mode: InternshipMode;
  stipend: number;
  duration: string;
  applicationDeadline: string;
  matchScore: number;
  isEligible: boolean;
  scoreBreakdown: IMatchScoreBreakdown;
  skillGap: IMatchSkillGap;
  missingSkills: string[];
  recommendationReason: string;
}
