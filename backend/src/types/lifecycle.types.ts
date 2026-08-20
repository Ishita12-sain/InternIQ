// ==========================================
// Phase 6: Internship Application Lifecycle Types
// ==========================================

export type OfferStatus = 'OFFERED' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';

export interface IOfferLetter {
  id: string;
  internshipId: string;
  applicationId: string;
  companyId: string;
  studentId: string;
  companyName: string;
  internshipTitle: string;
  studentName: string;
  studentEmail: string;
  startDate: string;
  duration: string;
  stipend: number;
  currency: string;
  status: OfferStatus;
  terms?: string;
  issuedAt: Date;
  respondedAt?: Date;
}

export type MentorAssignmentStatus = 'ACTIVE' | 'INACTIVE';

export interface IMentorAssignment {
  id: string;
  internshipId: string;
  studentId: string;
  companyId: string;
  mentorName: string;
  mentorEmail: string;
  mentorDesignation?: string;
  mentorDepartment?: string;
  assignedBy: string; // user id or name
  status: MentorAssignmentStatus;
  assignedAt: Date;
}

export type ProgressStatus = 'SUBMITTED' | 'APPROVED' | 'NEEDS_REVISION';

export interface IInternshipProgress {
  id: string;
  internshipId: string;
  studentId: string;
  milestoneTitle: string;
  tasksCompleted: string;
  learnings: string;
  blockers?: string;
  submittedAt: Date;
  status: ProgressStatus;
  reviewedBy?: string;
  reviewerComments?: string;
  reviewedAt?: Date;
}

export type CompletionStatus = 'COMPLETED';

export interface IInternshipCompletion {
  id: string;
  internshipId: string;
  studentId: string;
  companyId: string;
  companyName: string;
  internshipTitle: string;
  studentName: string;
  startDate: string;
  completionDate: string;
  finalRemarks: string;
  certificateUrl?: string;
  status: CompletionStatus;
  completedAt: Date;
}

export type PpoStatus =
  | 'UNDER_REVIEW'
  | 'RECOMMENDED'
  | 'OFFERED'
  | 'ACCEPTED'
  | 'DECLINED';

export interface IPpoDecision {
  id: string;
  internshipId: string;
  studentId: string;
  companyId: string;
  status: PpoStatus;
  packageLpa?: number;
  designation?: string;
  joiningDate?: string;
  remarks?: string;
  updatedAt: Date;
  updatedBy: string;
}
