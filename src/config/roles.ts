import type { RoleType, UserRoleOption } from '../types/auth';

export const ROLE_OPTIONS: UserRoleOption[] = [
  {
    id: 'student',
    label: 'Student',
    shortLabel: 'Student',
    iconName: 'GraduationCap',
    description: 'Discover internships, check eligibility & track applications',
    accentColor: 'from-blue-600 to-indigo-600',
    badge: 'Student Portal'
  },
  {
    id: 'company',
    label: 'Company',
    shortLabel: 'Company',
    iconName: 'Building2',
    description: 'Post positions, shortlist talent & issue offer letters',
    accentColor: 'from-blue-700 to-indigo-700',
    badge: 'Recruiter Hub'
  },
  {
    id: 'faculty',
    label: 'Faculty Mentor',
    shortLabel: 'Faculty',
    iconName: 'UserCheck',
    description: 'Monitor student progress, review reports & guide learning',
    accentColor: 'from-blue-600 to-cyan-600',
    badge: 'Faculty Portal'
  },
  {
    id: 'tnp',
    label: 'T&P Cell',
    shortLabel: 'T&P',
    iconName: 'Briefcase',
    description: 'Verify offer letters, track stats & manage drives',
    accentColor: 'from-indigo-600 to-blue-800',
    badge: 'Placement Cell'
  },
  {
    id: 'admin',
    label: 'Admin / HOD',
    shortLabel: 'Admin',
    iconName: 'ShieldCheck',
    description: 'Institutional control, department analytics & settings',
    accentColor: 'from-slate-700 to-slate-900',
    badge: 'Admin Portal'
  }
];

export const MOCK_USERS: Record<RoleType, { email: string; name: string; department?: string; companyName?: string }> = {
  student: {
    email: 'student@interniq.edu',
    name: 'Aarav Sharma',
    department: 'Computer Science & Engineering'
  },
  company: {
    email: 'recruiter@techcorp.com',
    name: 'Sarah Jenkins',
    companyName: 'TechCorp Solutions'
  },
  faculty: {
    email: 'faculty@interniq.edu',
    name: 'Dr. Rajesh Verma',
    department: 'Information Technology'
  },
  tnp: {
    email: 'tnp@interniq.edu',
    name: 'Prof. Meenakshi Sundaram',
    department: 'Training & Placement Office'
  },
  admin: {
    email: 'admin@interniq.edu',
    name: 'Dr. K. S. Kulkarni',
    department: 'Head of Institution'
  }
};
