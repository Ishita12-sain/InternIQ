export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  year?: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  proofFile?: string; // Data URL or object URL for proof preview/download
  proofFileName?: string;
  proofFileType?: string;
  proofFileSize?: number;
  verificationStatus: VerificationStatus;
  createdAt: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  role?: string;
  techStack: string[];
  startDate?: string;
  endDate?: string;
  githubUrl?: string;
  liveDemoUrl?: string;
  thumbnail?: string; // Main image preview URL or data URL
  thumbnailFileName?: string;
  screenshots?: Array<{
    id: string;
    url: string;
    name: string;
  }>;
  reportFile?: string; // PDF report Data URL
  reportFileName?: string;
  teamSize?: number;
  teamMembers?: string[];
  verificationStatus: VerificationStatus;
  createdAt: string;
}
