export type SkillProficiency = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export interface ISkill {
  id: string;
  name: string;
  category?: string;
  proficiency: SkillProficiency;
}

export interface IProject {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  startDate?: string;
  endDate?: string;
  isOngoing?: boolean;
}

export interface ICertification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface IStudentProfile {
  userId: string;
  rollNumber?: string;
  department?: string;
  batch?: string;
  semester?: number;
  cgpa?: number;
  backlogs?: number;
  phone?: string;
  gender?: string;
  bio?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStudent {
  id: string;
  userId: string;
  name: string;
  email: string;
  profile: IStudentProfile;
  skills: ISkill[];
  projects: IProject[];
  certifications: ICertification[];
}

export interface ResumeData {
  personalInfo: {
    id: string;
    userId: string;
    name: string;
    email: string;
    phone?: string;
    bio?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    portfolioUrl?: string;
    resumeUrl?: string;
  };
  academicInfo: {
    rollNumber?: string;
    department?: string;
    batch?: string;
    semester?: number;
    cgpa?: number;
    backlogs?: number;
  };
  skills: ISkill[];
  projects: IProject[];
  certifications: ICertification[];
}
