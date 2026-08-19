export interface AdminUserListItem {
  id: string;
  name: string;
  email: string;
  role: 'Student' | 'Company' | 'Faculty' | 'T&P' | 'Admin';
  status: 'Active' | 'Pending' | 'Suspended';
  joinedDate: string;
  lastActive: string;
  phone?: string;
  avatarInitials: string;
  // Role-specific details
  studentDetails?: {
    college: string;
    course: string;
    skills: string[];
    internshipStatus: string;
    applicationsCount: number;
  };
  companyDetails?: {
    companyName: string;
    industry: string;
    location: string;
    verificationStatus: string;
    activeInternships: number;
  };
  facultyDetails?: {
    department: string;
    designation: string;
    assignedStudentsCount: number;
  };
  tnpDetails?: {
    institution: string;
    department: string;
    managedStudentsCount: number;
  };
  adminDetails?: {
    adminRole: string;
    permissions: string[];
    lastLoginIP: string;
  };
}

export const mockAdminUsers: AdminUserListItem[] = [
  {
    id: 'usr-1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@interniq.edu',
    role: 'Student',
    status: 'Active',
    joinedDate: '10 Jan 2026',
    lastActive: '10 mins ago',
    phone: '+91 98765 43210',
    avatarInitials: 'AS',
    studentDetails: {
      college: 'IIT Bombay',
      course: 'B.Tech Computer Science',
      skills: ['React', 'TypeScript', 'Node.js', 'Python'],
      internshipStatus: 'Placed at TechNova Solutions',
      applicationsCount: 4,
    },
  },
  {
    id: 'usr-2',
    name: 'TechNova HR Portal',
    email: 'hr@technova.com',
    role: 'Company',
    status: 'Active',
    joinedDate: '15 Feb 2026',
    lastActive: '1 hour ago',
    phone: '+91 80 4567 8900',
    avatarInitials: 'TN',
    companyDetails: {
      companyName: 'TechNova Solutions Inc.',
      industry: 'Software & Cloud Infrastructure',
      location: 'Bengaluru, KA',
      verificationStatus: 'Verified',
      activeInternships: 6,
    },
  },
  {
    id: 'usr-3',
    name: 'Dr. Rajesh Kulkarni',
    email: 'r.kulkarni@interniq.edu',
    role: 'Faculty',
    status: 'Active',
    joinedDate: '01 Dec 2025',
    lastActive: '25 mins ago',
    phone: '+91 94220 12345',
    avatarInitials: 'RK',
    facultyDetails: {
      department: 'Computer Science & Engineering',
      designation: 'Associate Professor & Mentor Lead',
      assignedStudentsCount: 18,
    },
  },
  {
    id: 'usr-4',
    name: 'Prof. Suresh Varma',
    email: 'tnp@coep.ac.in',
    role: 'T&P',
    status: 'Active',
    joinedDate: '05 Nov 2025',
    lastActive: '3 hours ago',
    phone: '+91 20 2550 7000',
    avatarInitials: 'SV',
    tnpDetails: {
      institution: 'College of Engineering Pune (COEP)',
      department: 'Training & Placement Cell',
      managedStudentsCount: 450,
    },
  },
  {
    id: 'usr-5',
    name: 'System SuperAdmin',
    email: 'admin@interniq.edu',
    role: 'Admin',
    status: 'Active',
    joinedDate: '01 Oct 2025',
    lastActive: 'Just now',
    phone: '+91 11 4000 9999',
    avatarInitials: 'SA',
    adminDetails: {
      adminRole: 'Super Administrator',
      permissions: ['Full Access', 'User Management', 'Compliance Verification', 'System Auditing'],
      lastLoginIP: '192.168.1.1',
    },
  },
  {
    id: 'usr-6',
    name: 'Priya Patel',
    email: 'priya.patel@interniq.edu',
    role: 'Student',
    status: 'Active',
    joinedDate: '18 Jan 2026',
    lastActive: '2 hours ago',
    phone: '+91 98230 54321',
    avatarInitials: 'PP',
    studentDetails: {
      college: 'COEP Pune',
      course: 'B.Tech Information Technology',
      skills: ['Java', 'Spring Boot', 'PostgreSQL'],
      internshipStatus: 'Interviewing',
      applicationsCount: 3,
    },
  },
  {
    id: 'usr-7',
    name: 'Apex Robotics Admin',
    email: 'hr@apexrobotics.io',
    role: 'Company',
    status: 'Pending',
    joinedDate: '18 Aug 2026',
    lastActive: 'Yesterday',
    phone: '+91 80 9988 7766',
    avatarInitials: 'AR',
    companyDetails: {
      companyName: 'Apex Robotics Labs',
      industry: 'Robotics & Automation',
      location: 'Bengaluru, KA',
      verificationStatus: 'Pending Verification',
      activeInternships: 2,
    },
  },
  {
    id: 'usr-8',
    name: 'Rohan Mehta',
    email: 'rohan.mehta@interniq.edu',
    role: 'Student',
    status: 'Suspended',
    joinedDate: '20 Feb 2026',
    lastActive: '5 days ago',
    phone: '+91 97110 88990',
    avatarInitials: 'RM',
    studentDetails: {
      college: 'VIT Vellore',
      course: 'B.Tech Software Engineering',
      skills: ['React', 'Docker', 'Kubernetes'],
      internshipStatus: 'Seeking Opportunities',
      applicationsCount: 5,
    },
  },
];
