export interface ICompanyProfile {
  id: string;
  userId: string;
  companyName: string;
  industry?: string;
  website?: string;
  location?: string;
  description?: string;
  size?: string;
  contactEmail: string;
  contactPhone?: string;
  logoUrl?: string;
  linkedinUrl?: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type InternshipMode = 'ON_SITE' | 'REMOTE' | 'HYBRID';
export type InternshipStatus = 'OPEN' | 'CLOSED' | 'DRAFT';

export interface IInternship {
  id: string;
  companyId: string; // references userId / company
  companyName: string;
  title: string;
  description: string;
  duration: string;
  mode: InternshipMode;
  location: string;
  stipend: number;
  currency: string;
  vacancies: number;
  applicationDeadline: string;
  minCgpa: number;
  allowedBranches: string[];
  requiredSkills: string[];
  certifications?: string[];
  experience?: string;
  status: InternshipStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type ApplicationStatus = 'APPLIED' | 'SHORTLISTED' | 'SELECTED' | 'REJECTED';

export interface IApplicationStatusHistory {
  status: ApplicationStatus;
  changedAt: Date;
  changedBy: string;
  comment?: string;
}

export interface IApplication {
  id: string;
  internshipId: string;
  companyId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentRollNumber?: string;
  studentDepartment?: string;
  studentCgpa?: number;
  studentSkills?: string[];
  studentResumeUrl?: string;
  status: ApplicationStatus;
  appliedAt: Date;
  updatedAt: Date;
  statusHistory: IApplicationStatusHistory[];
}

export type PpoRecommendation = 'RECOMMENDED' | 'NOT_RECOMMENDED' | 'UNDER_REVIEW';

export interface IEvaluation {
  id: string;
  internshipId: string;
  companyId: string;
  studentId: string;
  applicationId: string;
  studentName?: string;
  performanceRating: number; // 1 to 5
  technicalSkillsRating: number; // 1 to 5
  softSkillsRating: number; // 1 to 5
  workQualityRating: number; // 1 to 5
  attendanceRating: number; // 1 to 5
  comments: string;
  ppoRecommendation: PpoRecommendation;
  evaluatedAt: Date;
}
