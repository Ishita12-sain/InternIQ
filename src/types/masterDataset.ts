import type {
  AdminStudentItem,
  AdminCompanyItem,
  AdminFacultyItem,
  AdminInternshipItem,
  AdminApplicationItem,
  PendingVerificationItem,
  AdminPlatformSummary,
} from './adminTypes';

// Seeded PRNG for Deterministic Master Dataset Generation
function pseudoRandom(seed: number) {
  let value = seed;
  return function () {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

const rng = pseudoRandom(42);

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

// Master Collections Arrays
const INDIAN_CITIES = [
  'Mumbai, MH',
  'Bengaluru, KA',
  'Pune, MH',
  'Hyderabad, TS',
  'Delhi NCR',
  'Gurugram, HR',
  'Noida, UP',
  'Chennai, TN',
  'Kolkata, WB',
  'Ahmedabad, GJ',
  'Jaipur, RJ',
  'Indore, MP',
  'Remote',
];

const INDUSTRIES = [
  'Software & IT',
  'FinTech',
  'Healthcare Tech',
  'Robotics & Automation',
  'Consulting & Cloud',
  'E-Commerce',
  'Manufacturing',
  'Education Tech',
];

const SKILL_POOL = [
  'React',
  'TypeScript',
  'Node.js',
  'Python',
  'Java',
  'Spring Boot',
  'PostgreSQL',
  'Docker',
  'AWS',
  'Kubernetes',
  'Tailwind CSS',
  'Figma',
  'C++',
  'Pandas',
  'SQL',
];

const FIRST_NAMES = [
  'Aarav', 'Priya', 'Rohan', 'Ananya', 'Kabir', 'Neha', 'Siddharth', 'Isha', 'Vikram', 'Diya',
  'Aditya', 'Manish', 'Kavita', 'Rahul', 'Sneha', 'Amit', 'Pooja', 'Varun', 'Tanvi', 'Karan',
  'Riya', 'Dev', 'Meera', 'Yash', 'Shruti', 'Nikhil', 'Simran', 'Akash', 'Bhavna', 'Gaurav',
];

const LAST_NAMES = [
  'Sharma', 'Patel', 'Mehta', 'Verma', 'Das', 'Kapoor', 'Rao', 'Nair', 'Singh', 'Sen',
  'Roy', 'Pandey', 'Joshi', 'Kulkarni', 'Ghosh', 'Pillai', 'Deshmukh', 'Gupta', 'Bhat', 'Bhasin',
];

const COLLEGES = [
  'IIT Bombay', 'COEP Pune', 'VIT Vellore', 'NID Ahmedabad', 'BITS Pilani',
  'IIT Delhi', 'SRM Chennai', 'Jadavpur University', 'DU Delhi', 'BHU Varanasi',
];

const COURSES = [
  'B.Tech Computer Science', 'B.Tech IT', 'B.Tech Software Engineering',
  'B.Des UI/UX', 'B.Tech Data Science', 'B.Tech Electronics', 'MBA Finance',
];

// 1. Generate 185 Realistic Companies
export const generatedCompanies: AdminCompanyItem[] = Array.from({ length: 185 }, (_, i) => {
  const namePrefix = getRandomItem(['TechNova', 'Apex Robotics', 'Quantum Bio', 'CloudMatrix', 'FinFlow', 'Nexus AI', 'Vanguard', 'CodeCraft', 'ByteWave', 'CyberCore', 'DataPulse', 'InfraScale', 'OmniTech', 'Zenith', 'AeroSys']);
  const nameSuffix = getRandomItem(['Solutions', 'Inc.', 'Labs', 'Global', 'Technologies', 'Systems', 'Digital', 'Soft']);
  const companyName = i === 0 ? 'TechNova Solutions' : i === 1 ? 'Apex Robotics Labs' : i === 2 ? 'Quantum BioHealth' : i === 3 ? 'FinFlow Global Services' : i === 4 ? 'CloudMatrix Inc.' : `${namePrefix} ${nameSuffix} #${i + 1}`;
  const industry = getRandomItem(INDUSTRIES);
  const location = getRandomItem(INDIAN_CITIES);
  const verStatus = i % 10 === 0 ? 'Pending' : i % 25 === 0 ? 'Rejected' : 'Verified';
  const day = (i % 28) + 1;
  const month = (i % 7) + 1;

  return {
    id: `cmp-${i + 1}`,
    name: companyName,
    industry,
    location,
    postedInternships: 0,
    verificationStatus: verStatus,
    email: `hr@cmp${i + 1}.example.com`,
    cin: `U72900KA202${i % 5}PTC145${100 + i}`,
    avatarInitials: companyName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(),
    companyStatus: 'Active',
    submittedDate: `${day < 10 ? '0' + day : day} 0${month} 2026`,
    verifiedDate: verStatus === 'Verified' ? `${day < 10 ? '0' + day : day} 0${month} 2026` : undefined,
    applicantsCount: 0,
    selectedCount: 0,
  };
});

// 2. Generate 260 Realistic Internships belonging to generatedCompanies
export const generatedInternships: AdminInternshipItem[] = Array.from({ length: 260 }, (_, i) => {
  const company = generatedCompanies[i % generatedCompanies.length];
  const titles = [
    'Frontend Developer Intern', 'Backend Developer Intern', 'Full Stack Engineer Intern',
    'UI/UX Design Intern', 'DevOps & Cloud Engineer Intern', 'Data Science & AI Intern',
    'Cybersecurity Analyst Intern', 'Mobile App Developer Intern', 'Embedded Systems & Robotics Intern',
    'Financial Risk Analyst Intern',
  ];
  const title = titles[i % titles.length];
  const openings = getRandomInt(2, 10);
  const status = i < 196 ? 'Active' : i < 230 ? 'Pending Review' : i < 245 ? 'Closed' : 'Draft';
  const day = (i % 25) + 1;
  const postedDate = `${day < 10 ? '0' + day : day} 08 2026`;
  const deadline = `${(day + 10) % 28 + 1} 09 2026`;

  // Update company posted count
  company.postedInternships += 1;

  return {
    id: `aint-${i + 1}`,
    title,
    companyId: company.id,
    companyName: company.name,
    companyLogo: company.avatarInitials,
    description: `Build cutting-edge ${title} modules for ${company.name} utilizing modern industry frameworks.`,
    responsibilities: ['Write high quality clean code', 'Participate in daily agile standups', 'Collaborate with senior engineering team'],
    requirements: ['Solid CS fundamentals', 'Hands-on project experience', 'Strong team communication'],
    skills: [getRandomItem(SKILL_POOL), getRandomItem(SKILL_POOL), getRandomItem(SKILL_POOL)],
    location: company.location,
    workMode: i % 3 === 0 ? 'Remote' : i % 3 === 1 ? 'Hybrid' : 'On-site',
    industry: company.industry,
    duration: '6 Months',
    stipend: `₹${getRandomInt(15, 35)},000 / month`,
    stipendNumeric: getRandomInt(15, 35) * 1000,
    eligibility: 'B.Tech / M.Tech / B.Des 2026/2027 Cohort',
    openings,
    deadline,
    postedDate,
    status,
    applicationsCount: 0,
    underReview: 0,
    shortlisted: 0,
    interviews: 0,
    selected: 0,
  };
});

// 3. Generate 1,420 Realistic Students
export const generatedStudents: AdminStudentItem[] = Array.from({ length: 1420 }, (_, i) => {
  const fn = FIRST_NAMES[i % FIRST_NAMES.length];
  const ln = LAST_NAMES[(i + 3) % LAST_NAMES.length];
  const name = `${fn} ${ln}`;
  const status = i < 312 ? 'Selected' : i < 732 ? 'Applied' : i < 1152 ? 'Seeking' : 'Interviewing';
  const day = (i % 28) + 1;

  return {
    id: `st-${i + 1}`,
    name,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i + 1}@interniq.edu`,
    course: getRandomItem(COURSES),
    year: i % 2 === 0 ? '4th Year' : '3rd Year',
    internshipStatus: status as any,
    profileCompletion: getRandomInt(75, 100),
    avatarInitials: `${fn[0]}${ln[0]}`,
    college: getRandomItem(COLLEGES),
    phone: `+91 ${getRandomInt(90000, 99999)} ${getRandomInt(10000, 99999)}`,
    location: getRandomItem(INDIAN_CITIES),
    skills: [getRandomItem(SKILL_POOL), getRandomItem(SKILL_POOL), getRandomItem(SKILL_POOL)],
    applications: 0,
    shortlisted: 0,
    interviews: 0,
    selected: 0,
    createdDate: `${day < 10 ? '0' + day : day} 08 2026`,
    accountStatus: 'Active',
  };
});

// 4. Generate 3,850 Interconnected Applications
export const generatedApplications: AdminApplicationItem[] = Array.from({ length: 3850 }, (_, i) => {
  const student = generatedStudents[i % generatedStudents.length];
  const internship = generatedInternships[i % generatedInternships.length];
  const company = generatedCompanies.find((c) => c.id === internship.companyId)!;

  // Realistic Status Pipeline Distribution
  let status: AdminApplicationItem['status'] = 'New';
  if (i < 312) {
    status = 'Selected';
  } else if (i < 732) {
    status = 'Interview';
  } else if (i < 1572) {
    status = 'Shortlisted';
  } else if (i < 2222) {
    status = 'Under Review';
  } else if (i < 2872) {
    status = 'Rejected';
  } else {
    status = 'New';
  }

  // Increment counters on parent entities to guarantee 100% data consistency
  student.applications! += 1;
  internship.applicationsCount += 1;
  company.applicantsCount = (company.applicantsCount || 0) + 1;

  if (status === 'Shortlisted' || status === 'Interview' || status === 'Selected') {
    student.shortlisted! += 1;
    internship.shortlisted! += 1;
  }
  if (status === 'Interview' || status === 'Selected') {
    student.interviews! += 1;
    internship.interviews! += 1;
  }
  if (status === 'Selected') {
    student.selected! += 1;
    internship.selected! += 1;
    company.selectedCount = (company.selectedCount || 0) + 1;
  }

  const day = (i % 20) + 1;
  const appliedDate = `${day < 10 ? '0' + day : day} 08 2026`;

  return {
    id: `app-${i + 1}`,
    studentId: student.id,
    candidateName: student.name,
    studentEmail: student.email,
    avatarInitials: student.avatarInitials,
    college: student.college,
    course: student.course,
    year: student.year,
    skills: student.skills,
    internshipId: internship.id,
    internshipTitle: internship.title,
    companyId: company.id,
    companyName: company.name,
    companyLogo: company.avatarInitials,
    location: internship.location,
    workMode: internship.workMode,
    duration: internship.duration,
    stipend: internship.stipend,
    appliedDate,
    matchScore: getRandomInt(70, 98),
    status,
    coverLetter: `I am passionate about contributing to ${internship.title} at ${company.name}.`,
    timeline: [
      { stage: 'Application Submitted', date: appliedDate, time: '10:00 AM', completed: true },
      { stage: 'Under Review', date: appliedDate, completed: status !== 'New' },
      { stage: 'Shortlisted', date: appliedDate, completed: ['Shortlisted', 'Interview', 'Selected'].includes(status) },
      { stage: 'Interview', date: appliedDate, completed: ['Interview', 'Selected'].includes(status) },
      { stage: 'Selected', date: appliedDate, completed: status === 'Selected' },
    ],
  };
});

// 5. Generate 64 Faculty Mentors
export const generatedFaculty: AdminFacultyItem[] = Array.from({ length: 64 }, (_, i) => {
  const fn = FIRST_NAMES[(i + 5) % FIRST_NAMES.length];
  const ln = LAST_NAMES[(i + 7) % LAST_NAMES.length];
  return {
    id: `fac-${i + 1}`,
    name: `Dr. ${fn} ${ln}`,
    department: getRandomItem(['Computer Science', 'Information Technology', 'Electronics', 'Management']),
    assignedStudents: getRandomInt(8, 25),
    activeStatus: 'Active',
    email: `${fn[0].toLowerCase()}.${ln.toLowerCase()}@interniq.edu`,
    avatarInitials: `${fn[0]}${ln[0]}`,
    availability: 'Available',
    phone: `+91 97330 ${getRandomInt(10000, 99999)}`,
    experience: `${getRandomInt(5, 15)} Years`,
    joinedDate: '15 Aug 2022',
  };
});

// 7. Generate Pending Verifications
export const generatedPendingVerifications: PendingVerificationItem[] = Array.from({ length: 25 }, (_, i) => {
  const company = generatedCompanies[i % generatedCompanies.length];
  const status = i < 5 ? 'Rejected' : i < 11 ? 'Under Review' : i < 17 ? 'Pending' : 'Verified';
  const day = (i % 25) + 1;

  return {
    id: `ver-${i + 1}`,
    entityId: company.id,
    entityType: 'Company',
    name: company.name,
    email: company.email,
    avatarInitials: company.avatarInitials,
    phone: company.phone || '+91 80 4567 8900',
    documentName: 'Incorporation_Certificate.pdf',
    documentType: 'Corporate Registration Dossier',
    submittedDate: `${day < 10 ? '0' + day : day} 08 2026`,
    status,
    reviewer: status !== 'Pending' ? 'Admin SuperUser' : undefined,
    reviewedDate: status !== 'Pending' ? `${(day + 1) % 28 + 1} 08 2026` : undefined,
    rejectionReason: status === 'Rejected' ? 'Invalid CIN certificate uploaded during compliance audit.' : undefined,
    cin: company.cin,
    location: company.location,
    industry: company.industry,
  };
});

// 8. Platform Summary derived dynamically from master records
export const generatedPlatformSummary: AdminPlatformSummary = {
  totalStudents: generatedStudents.length, // 1,420
  totalCompanies: generatedCompanies.length, // 185
  totalFacultyMentors: generatedFaculty.length, // 64
  activeInternships: generatedInternships.filter((i) => i.status === 'Active').length, // 196
  totalApplications: generatedApplications.length, // 3,850
  pendingVerifications: generatedPendingVerifications.filter((v) => v.status === 'Pending').length,
  selectedStudents: generatedApplications.filter((a) => a.status === 'Selected').length, // 312
  ongoingInternships: 215,
};

// Data Integrity Validator Function
export function validateMasterDataset(): boolean {
  const invalidApps = generatedApplications.filter(
    (app) =>
      !generatedStudents.some((s) => s.id === app.studentId) ||
      !generatedInternships.some((i) => i.id === app.internshipId) ||
      !generatedCompanies.some((c) => c.id === app.companyId)
  );

  if (invalidApps.length > 0) {
    console.error('Master Dataset Integrity Error: Invalid orphan applications found', invalidApps.length);
    return false;
  }
  return true;
}

validateMasterDataset();
