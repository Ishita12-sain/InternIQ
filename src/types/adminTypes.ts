export interface AdminPlatformSummary {
  totalStudents: number;
  totalCompanies: number;
  totalFacultyMentors: number;
  activeInternships: number;
  totalApplications: number;
  pendingVerifications: number;
  selectedStudents: number;
  ongoingInternships: number;
}

export interface UserManagementCategory {
  role: 'Students' | 'Companies' | 'Faculty Mentors' | 'T&P Officers' | 'Admins';
  total: number;
  active: number;
  pending: number;
  suspended: number;
}

export interface AdminStudentItem {
  id: string;
  name: string;
  email: string;
  course: string;
  year: string;
  internshipStatus: 'Looking' | 'Applied' | 'Under Review' | 'Shortlisted' | 'Interview' | 'Selected' | 'Ongoing' | 'Completed' | 'Not Active' | 'Placed' | 'Interviewing' | 'Seeking';
  profileCompletion: number;
  avatarInitials: string;
  college: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  skills?: string[];
  applications?: number;
  shortlisted?: number;
  interviews?: number;
  selected?: number;
  currentInternship?: {
    title: string;
    company: string;
    duration: string;
  };
  createdDate?: string;
  accountStatus?: 'Active' | 'Suspended';
}

export interface AdminCompanyItem {
  id: string;
  name: string;
  industry: string;
  location: string;
  postedInternships: number;
  verificationStatus: 'Verified' | 'Pending' | 'Rejected';
  email: string;
  cin: string;
  avatarInitials: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  size?: string;
  description?: string;
  companyStatus?: 'Active' | 'Inactive' | 'Suspended';
  submittedDate?: string;
  verifiedDate?: string;
  applicantsCount?: number;
  selectedCount?: number;
  recruitmentPerformance?: {
    applicationsReceived: number;
    shortlistRate: number;
    interviewRate: number;
    selectionRate: number;
    avgMatchScore: number;
  };
  internshipListings?: {
    id: string;
    title: string;
    status: 'Active' | 'Closed' | 'Draft';
    applications: number;
    shortlisted: number;
    interviews: number;
    selected: number;
    deadline: string;
  }[];
}

export interface AdminFacultyItem {
  id: string;
  name: string;
  department: string;
  assignedStudents: number;
  activeStatus: 'Active' | 'On Leave' | 'Inactive';
  email: string;
  avatarInitials: string;
  designation?: string;
  availability?: 'Available' | 'Limited' | 'Fully Assigned';
  phone?: string;
  experience?: string;
  joinedDate?: string;
  ongoingInternships?: number;
  completedInternships?: number;
  studentsSeeking?: number;
  mentorshipPerformance?: {
    studentsAssigned: number;
    studentsPlaced: number;
    internshipsCompleted: number;
    avgStudentProgress: number;
    placementSuccessRate: number;
  };
  menteeList?: {
    id: string;
    studentName: string;
    course: string;
    year: string;
    internshipStatus: string;
    company: string;
    internshipTitle: string;
    progress: number;
    avatarInitials: string;
  }[];
}

export interface PendingVerificationItem {
  id: string;
  entityId: string;
  entityType: 'Company' | 'Student' | 'Faculty';
  name: string;
  email: string;
  avatarInitials: string;
  phone?: string;
  role?: string;
  documentName: string;
  documentType: string;
  fileUrl?: string;
  fileType?: string;
  fileSize?: string;
  submittedDate: string;
  status: 'Pending' | 'Under Review' | 'Verified' | 'Rejected';
  reviewer?: string;
  reviewedDate?: string;
  rejectionReason?: string;
  notes?: string;
  industry?: string;
  location?: string;
  cin?: string;
}

export interface AdminInternshipItem {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  industry?: string;
  duration: string;
  stipend: string;
  stipendNumeric?: number;
  eligibility: string;
  openings: number;
  deadline: string;
  postedDate: string;
  status: 'Active' | 'Pending Review' | 'Draft' | 'Rejected' | 'Closed' | 'Expiring Soon';
  applicationsCount: number;
  underReview?: number;
  shortlisted?: number;
  interviews?: number;
  selected?: number;
  rejectionReason?: string;
  rejectedDate?: string;
  reviewedBy?: string;
}

export interface AdminApplicationItem {
  id: string;
  studentId: string;
  candidateName: string;
  studentEmail: string;
  avatarInitials: string;
  college?: string;
  course?: string;
  year?: string;
  skills?: string[];
  linkedin?: string;
  resumeUrl?: string;
  internshipId: string;
  internshipTitle: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  location?: string;
  workMode?: string;
  duration?: string;
  stipend?: string;
  appliedDate: string;
  matchScore: number;
  status: 'New' | 'Under Review' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected';
  coverLetter?: string;
  rejectionReason?: string;
  timeline?: {
    stage: string;
    date: string;
    time?: string;
    note?: string;
    completed: boolean;
  }[];
}

export interface AdminInterviewItem {
  id: string;
  applicationId: string;
  studentId: string;
  candidateName: string;
  studentEmail: string;
  avatarInitials: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  internshipId: string;
  internshipTitle: string;
  date: string; // ISO format or display string '2026-08-20' / '20 Aug 2026'
  isoDate: string; // '2026-08-20'
  time: string; // '10:30 AM'
  duration: string; // '45 mins'
  type: 'Technical' | 'HR' | 'Managerial' | 'Final' | 'Other';
  round: string; // 'Round 1'
  status: 'Upcoming' | 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled';
  location: string; // 'Google Meet Link'
  meetingLink?: string;
  notes?: string;
  cancellationReason?: string;
  outcome?: 'Selected' | 'Rejected' | 'Further Round' | 'On Hold';
  outcomeNotes?: string;
  history?: {
    action: string;
    date: string;
    time?: string;
    note?: string;
  }[];
}

export interface AdminPlacementItem {
  id: string;
  applicationId: string;
  studentId: string;
  candidateName: string;
  studentEmail: string;
  avatarInitials: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  internshipId: string;
  internshipTitle: string;
  selectionDate: string;
  offerDate: string;
  offerAcceptanceDate: string;
  joiningDate: string;
  expectedEndDate: string;
  duration: string;
  stipend: string;
  stipendNumeric: number;
  status: 'Offer Accepted' | 'Joining Soon' | 'Ongoing' | 'Completed' | 'Not Joined';
  workLocation: string;
  workMode: string;
  reportingContact?: string;
  mentorFeedback?: string;
  performanceRating?: string;
}

export interface AdminSelectedStudentItem {
  id: string;
  studentName: string;
  companyName: string;
  internshipTitle: string;
  selectionDate: string;
  offerStatus: 'Accepted' | 'Pending' | 'Declined';
  joiningStatus: 'Joined' | 'Pending Docs' | 'Scheduled';
  avatarInitials: string;
}

export interface AdminOngoingInternshipItem {
  id: string;
  studentName: string;
  companyName: string;
  internshipTitle: string;
  startDate: string;
  endDate: string;
  facultyMentor: string;
  progress: number;
  currentStatus: 'On Track' | 'Needs Review' | 'Completed';
  avatarInitials: string;
}

export interface RecentActivityItem {
  id: string;
  type: 'company_register' | 'student_profile' | 'internship_posted' | 'company_verified' | 'candidate_shortlisted' | 'candidate_selected';
  description: string;
  timestamp: string;
}

import {
  generatedStudents,
  generatedCompanies,
  generatedFaculty,
  generatedInternships,
  generatedApplications,
  generatedInterviews,
  generatedPlacements,
  generatedPendingVerifications,
  generatedPlatformSummary,
} from './masterDataset';

export const mockAdminPlatformSummary = generatedPlatformSummary;
export const mockAdminStudents = generatedStudents;
export const mockAdminCompanies = generatedCompanies;
export const mockAdminFaculty = generatedFaculty;
export const mockAdminInternships = generatedInternships;
export const mockAdminApplications = generatedApplications;
export const mockAdminInterviews = generatedInterviews;
export const mockAdminPlacements = generatedPlacements;
export const mockPendingVerifications = generatedPendingVerifications;

export const mockSelectedStudents: AdminSelectedStudentItem[] = [
  { id: 'sel-1', studentName: 'Aarav Sharma', companyName: 'TechNova Solutions', internshipTitle: 'Frontend Developer Intern', selectionDate: '15 Aug 2026', offerStatus: 'Accepted', joiningStatus: 'Joined', avatarInitials: 'AS' },
  { id: 'sel-2', studentName: 'Ananya Verma', companyName: 'TechNova Solutions', internshipTitle: 'UI/UX Design Intern', selectionDate: '16 Aug 2026', offerStatus: 'Accepted', joiningStatus: 'Joined', avatarInitials: 'AV' },
  { id: 'sel-3', studentName: 'Siddharth Rao', companyName: 'CloudMatrix Inc.', internshipTitle: 'DevOps & Cloud Engineer Intern', selectionDate: '17 Aug 2026', offerStatus: 'Pending', joiningStatus: 'Pending Docs', avatarInitials: 'SR' },
  { id: 'sel-4', studentName: 'Neha Kapoor', companyName: 'FinFlow Global Services', internshipTitle: 'Financial Analyst Intern', selectionDate: '18 Aug 2026', offerStatus: 'Accepted', joiningStatus: 'Scheduled', avatarInitials: 'NK' },
];

export const mockOngoingInternships: AdminOngoingInternshipItem[] = [
  { id: 'ong-1', studentName: 'Aarav Sharma', companyName: 'TechNova Solutions', internshipTitle: 'Frontend Developer Intern', startDate: '01 Jun 2026', endDate: '30 Nov 2026', facultyMentor: 'Dr. Rajesh Kulkarni', progress: 65, currentStatus: 'On Track', avatarInitials: 'AS' },
  { id: 'ong-2', studentName: 'Ananya Verma', companyName: 'TechNova Solutions', internshipTitle: 'UI/UX Design Intern', startDate: '15 Jun 2026', endDate: '15 Dec 2026', facultyMentor: 'Prof. Sunita Menon', progress: 50, currentStatus: 'On Track', avatarInitials: 'AV' },
  { id: 'ong-3', studentName: 'Rohan Mehta', companyName: 'CloudMatrix Inc.', internshipTitle: 'DevOps & Cloud Engineer Intern', startDate: '01 Jul 2026', endDate: '31 Dec 2026', facultyMentor: 'Dr. Amitav Ghosh', progress: 35, currentStatus: 'Needs Review', avatarInitials: 'RM' },
];

export const mockRecentActivities: RecentActivityItem[] = [
  { id: 'act-1', type: 'company_register', description: 'New company "Apex Robotics Labs" submitted registration dossier', timestamp: '10 minutes ago' },
  { id: 'act-2', type: 'student_profile', description: 'Student Rohan Mehta updated digital skill gap assessment score to 8.8', timestamp: '35 minutes ago' },
  { id: 'act-3', type: 'internship_posted', description: 'TechNova Solutions posted "Frontend Developer Intern" (3 openings)', timestamp: '2 hours ago' },
  { id: 'act-4', type: 'company_verified', description: 'Admin verified company identity for "TechNova Solutions Inc."', timestamp: '3 hours ago' },
  { id: 'act-5', type: 'candidate_shortlisted', description: 'Candidate Priya Patel shortlisted by TechNova Solutions for Backend Role', timestamp: '5 hours ago' },
  { id: 'act-6', type: 'candidate_selected', description: 'Aarav Sharma accepted internship offer at TechNova Solutions', timestamp: '1 day ago' },
];

export const mockUserManagementCategories: UserManagementCategory[] = [
  { role: 'Students', total: 1420, active: 1380, pending: 25, suspended: 15 },
  { role: 'Companies', total: 185, active: 162, pending: 18, suspended: 5 },
  { role: 'Faculty Mentors', total: 64, active: 62, pending: 2, suspended: 0 },
  { role: 'T&P Officers', total: 12, active: 12, pending: 0, suspended: 0 },
  { role: 'Admins', total: 4, active: 4, pending: 0, suspended: 0 },
];
