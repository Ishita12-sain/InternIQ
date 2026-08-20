import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { CompanySidebar } from '../../components/company/CompanySidebar';
import { CompanyHeader } from '../../components/company/CompanyHeader';
import {
  ArrowLeft,
  Search,
  Filter,
  Eye,
  X,
  Award,
  FileText,
  Download,
  Users,
  CheckCircle2,
  Briefcase,
  ExternalLink,
  Ban,
} from 'lucide-react';

export interface ComprehensiveApplicant {
  id: string;
  studentName: string;
  avatarInitials: string;
  avatarPhotoUrl?: string;
  internshipId: string;
  internshipTitle: string;
  college: string;
  degree: string;
  department: string;
  graduationYear: string;
  cgpa: string;
  matchPercentage: number;
  appliedDate: string;
  status: 'Applied' | 'Under Review' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected';
  skills: string[];
  email: string;
  phone: string;
  linkedinUrl: string;
  githubUrl: string;
  bio: string;
  resumeFileName: string;
  projects: { title: string; description: string; techStack: string }[];
  certifications: string[];
}

export const CompanyApplicantsPage: React.FC = () => {
  const navigate = useNavigate();
  const { internshipId: routeInternshipId } = useParams<{ internshipId?: string }>();
  const [searchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const applicantListRef = useRef<HTMLDivElement>(null);
  const detailsSectionRef = useRef<HTMLDivElement>(null);

  // Success Feedback Message banner
  const [feedback, setFeedback] = useState<string | null>(null);

  // Modals state
  const [selectedApplicant, setSelectedApplicant] = useState<ComprehensiveApplicant | null>(null);
  const [resumePreviewApplicant, setResumePreviewApplicant] = useState<ComprehensiveApplicant | null>(null);

  // Internship selector option
  const [selectedInternshipFilter, setSelectedInternshipFilter] = useState<string>(
    routeInternshipId || 'All'
  );

  // Query parameter status filter
  const urlStatusParam = searchParams.get('status');

  const getInitialStatus = (param: string | null): string => {
    if (!param) return 'All';
    const lower = param.toLowerCase();
    if (lower === 'applied') return 'Applied';
    if (lower === 'under review' || lower === 'review') return 'Under Review';
    if (lower === 'shortlisted') return 'Shortlisted';
    if (lower === 'interview') return 'Interview';
    if (lower === 'selected') return 'Selected';
    if (lower === 'rejected') return 'Rejected';
    return 'All';
  };

  const [statusFilter, setStatusFilter] = useState<string>(() => getInitialStatus(urlStatusParam));

  useEffect(() => {
    setStatusFilter(getInitialStatus(urlStatusParam));
  }, [urlStatusParam]);

  // Master Mock Applicants List
  const [applicants, setApplicants] = useState<ComprehensiveApplicant[]>([
    {
      id: 'app-1',
      studentName: 'Aarav Sharma',
      avatarInitials: 'AS',
      internshipId: 'int-m1',
      internshipTitle: 'Frontend Developer Intern',
      college: 'Indian Institute of Technology, Bombay',
      degree: 'B.Tech',
      department: 'Computer Science & Engineering',
      graduationYear: '2026',
      cgpa: '9.2',
      matchPercentage: 94,
      appliedDate: '18 Aug 2026',
      status: 'Shortlisted',
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Git'],
      email: 'aarav.sharma@iitb.ac.in',
      phone: '+91 98765 43210',
      linkedinUrl: 'https://linkedin.com/in/aaravsharma',
      githubUrl: 'https://github.com/aaravsharma',
      bio: 'Passionate frontend engineer experienced in building responsive React applications and component design systems.',
      resumeFileName: 'Aarav_Sharma_Resume_2026.pdf',
      projects: [
        {
          title: 'InternIQ Dashboard Portal',
          description: 'Designed full-stack applicant tracking UI using React, Vite, and Tailwind.',
          techStack: 'React, TypeScript, Tailwind',
        },
        {
          title: 'Smart Campus Event Hub',
          description: 'Real-time university event booking portal with automated email passes.',
          techStack: 'Node.js, Express, MongoDB',
        },
      ],
      certifications: ['AWS Certified Cloud Practitioner', 'Meta Frontend Developer Certificate'],
    },
    {
      id: 'app-2',
      studentName: 'Priya Patel',
      avatarInitials: 'PP',
      internshipId: 'int-m2',
      internshipTitle: 'Backend Developer Intern',
      college: 'College of Engineering, Pune (COEP)',
      degree: 'B.E.',
      department: 'Information Technology',
      graduationYear: '2025',
      cgpa: '8.8',
      matchPercentage: 88,
      appliedDate: '17 Aug 2026',
      status: 'Under Review',
      skills: ['Node.js', 'Express', 'PostgreSQL', 'Docker', 'REST APIs'],
      email: 'priya.patel@coep.ac.in',
      phone: '+91 98123 45678',
      linkedinUrl: 'https://linkedin.com/in/priyapatel',
      githubUrl: 'https://github.com/priyapatel',
      bio: 'Backend systems architect focused on microservices, database optimization, and secure API gateways.',
      resumeFileName: 'Priya_Patel_Backend_CV.pdf',
      projects: [
        {
          title: 'Distributed Payment Microservice',
          description: 'Built high-throughput payment transaction pipeline handling 1K req/sec.',
          techStack: 'Node.js, Redis, PostgreSQL',
        },
      ],
      certifications: ['Oracle Certified Associate Java SE', 'Docker Mastery Certificate'],
    },
    {
      id: 'app-3',
      studentName: 'Rohan Mehta',
      avatarInitials: 'RM',
      internshipId: 'int-m1',
      internshipTitle: 'Frontend Developer Intern',
      college: 'Vellore Institute of Technology (VIT)',
      degree: 'B.Tech',
      department: 'Software Engineering',
      graduationYear: '2026',
      cgpa: '8.5',
      matchPercentage: 91,
      appliedDate: '16 Aug 2026',
      status: 'Interview',
      skills: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Redux'],
      email: 'rohan.mehta@vit.ac.in',
      phone: '+91 97654 32109',
      linkedinUrl: 'https://linkedin.com/in/rohanmehta',
      githubUrl: 'https://github.com/rohanmehta',
      bio: 'Creative web developer with strong focus on responsive layouts and modern UI animations.',
      resumeFileName: 'Rohan_Mehta_Resume.pdf',
      projects: [
        {
          title: 'E-Learning Video Portal',
          description: 'Custom video streaming player with chapter bookmarks and notes.',
          techStack: 'React, Redux, Video.js',
        },
      ],
      certifications: ['FreeCodeCamp Responsive Web Design'],
    },
    {
      id: 'app-4',
      studentName: 'Ananya Verma',
      avatarInitials: 'AV',
      internshipId: 'int-m3',
      internshipTitle: 'UI/UX Design Intern',
      college: 'National Institute of Design (NID), Ahmedabad',
      degree: 'B.Des',
      department: 'Industrial & Interaction Design',
      graduationYear: '2026',
      cgpa: '9.4',
      matchPercentage: 96,
      appliedDate: '15 Aug 2026',
      status: 'Selected',
      skills: ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Usability Testing'],
      email: 'ananya.v@nid.ac.in',
      phone: '+91 99887 76655',
      linkedinUrl: 'https://linkedin.com/in/ananyaverma',
      githubUrl: '',
      bio: 'User experience designer dedicated to creating intuitive, elegant, and accessible SaaS web apps.',
      resumeFileName: 'Ananya_Verma_Design_Portfolio.pdf',
      projects: [
        {
          title: 'Healthcare Patient Portal Redesign',
          description: 'Comprehensive UI case study reducing appointment booking time by 40%.',
          techStack: 'Figma, Design Systems',
        },
      ],
      certifications: ['Google UX Design Professional Certificate'],
    },
    {
      id: 'app-5',
      studentName: 'Kabir Das',
      avatarInitials: 'KD',
      internshipId: 'int-m2',
      internshipTitle: 'Backend Developer Intern',
      college: 'BITS Pilani',
      degree: 'B.E.',
      department: 'Computer Science',
      graduationYear: '2026',
      cgpa: '8.9',
      matchPercentage: 82,
      appliedDate: '14 Aug 2026',
      status: 'Applied',
      skills: ['Python', 'Django', 'PostgreSQL', 'Celery', 'Git'],
      email: 'kabir.das@pilani.bits-pilani.ac.in',
      phone: '+91 91234 56789',
      linkedinUrl: 'https://linkedin.com/in/kabirdas',
      githubUrl: 'https://github.com/kabirdas',
      bio: 'Python developer interested in backend API architecture and automated background tasks.',
      resumeFileName: 'Kabir_Das_Resume.pdf',
      projects: [
        {
          title: 'Automated Job Scraper & Parser',
          description: 'Background worker parsing university placement notices.',
          techStack: 'Python, Celery, Redis',
        },
      ],
      certifications: ['Python Institute Certified Associate'],
    },
    {
      id: 'app-6',
      studentName: 'Sanya Malhotra',
      avatarInitials: 'SM',
      internshipId: 'int-m5',
      internshipTitle: 'Data Science & AI Intern',
      college: 'IIIT Hyderabad',
      degree: 'B.Tech',
      department: 'Data Science & AI',
      graduationYear: '2025',
      cgpa: '9.1',
      matchPercentage: 89,
      appliedDate: '12 Aug 2026',
      status: 'Rejected',
      skills: ['Python', 'SQL', 'TensorFlow', 'Pandas', 'Scikit-learn'],
      email: 'sanya.m@iiit.ac.in',
      phone: '+91 98450 12345',
      linkedinUrl: 'https://linkedin.com/in/sanyamalhotra',
      githubUrl: 'https://github.com/sanyamalhotra',
      bio: 'Machine learning practitioner specializing in predictive analytics and computer vision datasets.',
      resumeFileName: 'Sanya_Malhotra_ML_Resume.pdf',
      projects: [
        {
          title: 'Medical Image Classification Engine',
          description: 'Convolutional neural network for automated X-ray analysis.',
          techStack: 'PyTorch, OpenCV, Flask',
        },
      ],
      certifications: ['DeepLearning.AI TensorFlow Developer'],
    },
  ]);

  // Additional Filter Controls
  const [searchQuery, setSearchQuery] = useState('');

  // Status Filter Change with Smooth Scrolling
  const handleStatusCardClick = (st: string) => {
    setStatusFilter(st);
    if (applicantListRef.current) {
      applicantListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // View Candidate Details Handler with Smooth Scroll
  const handleViewCandidateDetails = (app: ComprehensiveApplicant) => {
    setSelectedApplicant(app);
    if (detailsSectionRef.current) {
      detailsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Status Workflow Change Handler
  const handleUpdateStatus = (
    applicantId: string,
    newStatus: ComprehensiveApplicant['status']
  ) => {
    setApplicants((prev) =>
      prev.map((app) => (app.id === applicantId ? { ...app, status: newStatus } : app))
    );

    if (selectedApplicant && selectedApplicant.id === applicantId) {
      setSelectedApplicant({ ...selectedApplicant, status: newStatus });
    }

    const appName = applicants.find((a) => a.id === applicantId)?.studentName || 'Candidate';
    setFeedback(`Application status for ${appName} updated to ${newStatus}.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  // Download Mock Resume handler
  const handleDownloadResume = (applicant: ComprehensiveApplicant) => {
    const mockContent = `InternIQ Resume - Candidate: ${applicant.studentName}\nEmail: ${applicant.email}\nCollege: ${applicant.college}\nDegree: ${applicant.degree} (${applicant.department})\nCGPA: ${applicant.cgpa}\nSkills: ${applicant.skills.join(', ')}`;
    const blob = new Blob([mockContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = applicant.resumeFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setFeedback(`Downloaded ${applicant.resumeFileName}`);
    setTimeout(() => setFeedback(null), 3500);
  };

  // Calculations for Filtered Candidates
  const filteredApplicants = applicants.filter((app) => {
    const matchesInternship =
      selectedInternshipFilter === 'All' || app.internshipId === selectedInternshipFilter;

    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;

    const matchesSearch =
      app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.internshipTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesInternship && matchesStatus && matchesSearch;
  });

  // Summary Metrics Breakdown
  const totalCount = applicants.length;
  const newCount = applicants.filter((a) => a.status === 'Applied').length;
  const reviewCount = applicants.filter((a) => a.status === 'Under Review').length;
  const shortlistedCount = applicants.filter((a) => a.status === 'Shortlisted').length;
  const interviewCount = applicants.filter((a) => a.status === 'Interview').length;
  const selectedCount = applicants.filter((a) => a.status === 'Selected').length;
  const rejectedCount = applicants.filter((a) => a.status === 'Rejected').length;

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <CompanySidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <CompanyHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Applicants Management"
          subtitle="Review candidate profiles, match metrics, resume previews, and pipeline stages."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto pb-safe">
          {/* Top Bar with Internship Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard/company')}
                className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h2 className="text-xl font-extrabold text-[#0f172a]">Applicant Management</h2>
                <p className="text-xs text-[#64748b]">
                  Showing {filteredApplicants.length} of {totalCount} total applications
                </p>
              </div>
            </div>

            {/* Internship Selector Dropdown */}
            <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-2xs w-full sm:w-auto max-w-full sm:max-w-md min-w-0">
              <Briefcase className="w-4 h-4 text-[#2563eb] shrink-0" />
              <select
                value={selectedInternshipFilter}
                onChange={(e) => setSelectedInternshipFilter(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer w-full min-w-0 truncate pr-1"
              >
                <option value="All">All Posted Positions ({totalCount})</option>
                <option value="int-m1">Frontend Developer Intern (2)</option>
                <option value="int-m2">Backend Developer Intern (2)</option>
                <option value="int-m3">UI/UX Design Intern (1)</option>
                <option value="int-m5">Data Science & AI Intern (1)</option>
              </select>
            </div>
          </div>

          {/* Non-blocking Success Banner */}
          {feedback && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2 animate-in fade-in duration-150 text-left">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          {/* 7 Clickable Applicant Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-left">
            {[
              { label: 'Total', count: totalCount, st: 'All', color: 'border-blue-500 text-[#2563eb] bg-blue-50/30' },
              { label: 'New', count: newCount, st: 'Applied', color: 'border-slate-400 text-slate-700 bg-slate-50' },
              { label: 'Under Review', count: reviewCount, st: 'Under Review', color: 'border-amber-500 text-amber-700 bg-amber-50/30' },
              { label: 'Shortlisted', count: shortlistedCount, st: 'Shortlisted', color: 'border-indigo-500 text-indigo-700 bg-indigo-50/30' },
              { label: 'Interview', count: interviewCount, st: 'Interview', color: 'border-purple-500 text-purple-700 bg-purple-50/30' },
              { label: 'Selected', count: selectedCount, st: 'Selected', color: 'border-emerald-500 text-emerald-700 bg-emerald-50/30' },
              { label: 'Rejected', count: rejectedCount, st: 'Rejected', color: 'border-rose-500 text-rose-700 bg-rose-50/30' },
            ].map((card) => (
              <div
                key={card.st}
                onClick={() => handleStatusCardClick(card.st)}
                className={`bg-white border rounded-2xl p-3 shadow-2xs space-y-1 cursor-pointer transition-all duration-150 transform hover:-translate-y-0.5 ${
                  statusFilter === card.st
                    ? `${card.color} ring-2 ring-blue-500/20 font-bold`
                    : 'border-[#e2e8f0] hover:border-slate-300'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block truncate">
                  {card.label}
                </span>
                <p className="text-xl font-black text-[#0f172a]">{card.count}</p>
              </div>
            ))}
          </div>

          {/* Search & Comprehensive Filters */}
          <div
            ref={applicantListRef}
            id="applicant-list-section"
            className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs space-y-3 text-left scroll-mt-6"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search candidate name or skill..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center space-x-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                <Filter className="w-4 h-4 text-[#2563eb] shrink-0 mr-1" />
                {['All', 'Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusCardClick(st)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                      statusFilter === st
                        ? 'bg-[#2563eb] text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Applicant Cards Container */}
          {filteredApplicants.length > 0 ? (
            <div className="space-y-4 text-left">
              {filteredApplicants.map((app) => (
                <div
                  key={app.id}
                  className="bg-white border border-[#e2e8f0] rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-blue-300 transition-all"
                >
                  {/* Candidate Primary Meta */}
                  <div className="flex items-start space-x-3.5 min-w-0 flex-1">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-[#2563eb] font-extrabold flex items-center justify-center text-sm shrink-0 border border-blue-200 shadow-2xs">
                      {app.avatarInitials}
                    </div>

                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <h3 className="text-base font-extrabold text-[#0f172a]">{app.studentName}</h3>
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                          <Award className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{app.matchPercentage}% Skill Match</span>
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${
                            app.status === 'Selected'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : app.status === 'Shortlisted'
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              : app.status === 'Interview'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : app.status === 'Under Review'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : app.status === 'Rejected'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>

                      <p className="text-xs text-[#64748b] font-medium leading-relaxed">
                        <strong className="text-slate-900">{app.degree}</strong> in {app.department} •{' '}
                        <span className="text-slate-700 font-semibold">{app.college}</span> ({app.graduationYear}) •{' '}
                        <strong className="text-slate-900">CGPA: {app.cgpa}</strong>
                      </p>

                      <p className="text-xs text-slate-500">
                        Applied for: <strong className="text-[#2563eb]">{app.internshipTitle}</strong> • {app.appliedDate}
                      </p>

                      {/* Skill Badges */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {app.skills.map((sk) => (
                          <span
                            key={sk}
                            className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-blue-50/70 text-[#2563eb] border border-blue-200/50"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 pt-3 lg:pt-0 border-t lg:border-0 border-slate-100 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleViewCandidateDetails(app)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Profile</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setResumePreviewApplicant(app)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#2563eb] text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Resume</span>
                    </button>

                    {/* Status Workflow Action Buttons */}
                    {app.status === 'Applied' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(app.id, 'Under Review')}
                        className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                      >
                        Review
                      </button>
                    )}

                    {(app.status === 'Applied' || app.status === 'Under Review') && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(app.id, 'Shortlisted')}
                        className="px-3 py-2 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                      >
                        Shortlist
                      </button>
                    )}

                    {app.status === 'Shortlisted' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(app.id, 'Interview')}
                        className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                      >
                        Interview
                      </button>
                    )}

                    {app.status === 'Interview' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(app.id, 'Selected')}
                        className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                      >
                        Select
                      </button>
                    )}

                    {app.status !== 'Rejected' && app.status !== 'Selected' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(app.id, 'Rejected')}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-semibold cursor-pointer"
                        title="Reject Candidate"
                      >
                        <Ban className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-12 text-center space-y-4 shadow-2xs max-w-md mx-auto my-6">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-[#2563eb] flex items-center justify-center mx-auto">
                <Users className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#0f172a]">No applicants found</h3>
                <p className="text-xs text-[#64748b]">No student applications match the selected status or filters.</p>
              </div>
            </div>
          )}

          {/* In-page Applicant Details Section */}
          {selectedApplicant && (
            <div
              ref={detailsSectionRef}
              id="applicant-details-section"
              className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-5 text-left scroll-mt-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-[#2563eb] font-extrabold text-base flex items-center justify-center border border-blue-200 shrink-0 shadow-2xs">
                    {selectedApplicant.avatarInitials}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0f172a]">{selectedApplicant.studentName}</h3>
                    <p className="text-xs text-[#64748b]">
                      Applied for <strong className="text-slate-900">{selectedApplicant.internshipTitle}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold text-xs">
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{selectedApplicant.matchPercentage}% Match</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedApplicant(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Comprehensive Details Grid */}
              <div className="space-y-4 text-xs font-medium">
                {/* Personal & Contact Info */}
                <div className="space-y-2">
                  <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Email</span>
                      <strong className="text-slate-900">{selectedApplicant.email}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Phone</span>
                      <strong className="text-slate-900">{selectedApplicant.phone}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Applied Date</span>
                      <strong className="text-slate-900">{selectedApplicant.appliedDate}</strong>
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="space-y-2">
                  <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
                    Academic Information
                  </h4>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <strong className="text-slate-900 text-sm block">{selectedApplicant.college}</strong>
                    <p className="text-slate-600">
                      {selectedApplicant.degree} in {selectedApplicant.department} ({selectedApplicant.graduationYear})
                    </p>
                    <p className="text-[#2563eb] font-bold">Academic CGPA: {selectedApplicant.cgpa}</p>
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
                    Verified Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedApplicant.skills.map((sk) => (
                      <span
                        key={sk}
                        className="px-3 py-1 rounded-xl bg-blue-50 text-[#2563eb] font-bold text-xs border border-blue-200"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certifications & Projects */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
                      Certifications
                    </h4>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                      {selectedApplicant.certifications.map((cert) => (
                        <p key={cert} className="text-slate-800 font-semibold">• {cert}</p>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
                      Key Projects
                    </h4>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                      {selectedApplicant.projects.map((proj) => (
                        <div key={proj.title}>
                          <strong className="text-slate-900 block">{proj.title}</strong>
                          <p className="text-slate-600 text-[11px]">{proj.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Social & Resume Links */}
                <div className="flex items-center space-x-3 pt-2">
                  {selectedApplicant.linkedinUrl && (
                    <a
                      href={selectedApplicant.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-blue-50 text-[#2563eb] border border-blue-200 font-bold hover:bg-blue-100"
                    >
                      <span>LinkedIn</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {selectedApplicant.githubUrl && (
                    <a
                      href={selectedApplicant.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 font-bold hover:bg-slate-200"
                    >
                      <span>GitHub</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDownloadResume(selectedApplicant)}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Resume</span>
                  </button>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-slate-100">
                <span className="text-slate-500 font-medium">
                  Current Status: <strong className="text-[#2563eb]">{selectedApplicant.status}</strong>
                </span>

                <div className="flex items-center space-x-2">
                  {selectedApplicant.status !== 'Shortlisted' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(selectedApplicant.id, 'Shortlisted')}
                      className="px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
                    >
                      Shortlist Candidate
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => navigate('/company/interviews')}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold cursor-pointer"
                  >
                    Schedule Interview
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Comprehensive Candidate Profile Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-xl relative text-left space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-[#2563eb] font-extrabold text-base flex items-center justify-center border border-blue-200 shrink-0">
                  {selectedApplicant.avatarInitials}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0f172a]">{selectedApplicant.studentName}</h3>
                  <p className="text-xs text-[#64748b]">
                    Applied for <strong className="text-slate-900">{selectedApplicant.internshipTitle}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApplicant(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Overview */}
            <div className="space-y-4 text-xs font-medium">
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-bold text-emerald-900 flex items-center space-x-1.5">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>Skill Match Score</span>
                  </span>
                  <p className="text-[11px] text-emerald-800">Based on required skills & academic qualifications</p>
                </div>
                <span className="text-2xl font-black text-emerald-700">{selectedApplicant.matchPercentage}%</span>
              </div>

              {/* Academic Details */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
                  Academic Background
                </h4>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <p className="font-bold text-slate-900">{selectedApplicant.college}</p>
                  <p className="text-slate-600">
                    {selectedApplicant.degree} in {selectedApplicant.department} ({selectedApplicant.graduationYear})
                  </p>
                  <p className="text-slate-900 font-bold">Minimum CGPA: {selectedApplicant.cgpa}</p>
                </div>
              </div>

              {/* Verified Skills */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
                  Technical Skills
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedApplicant.skills.map((sk) => (
                    <span
                      key={sk}
                      className="px-3 py-1 rounded-xl bg-blue-50 text-[#2563eb] font-bold text-xs border border-blue-200"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
                  Key Projects
                </h4>
                <div className="space-y-2">
                  {selectedApplicant.projects.map((proj) => (
                    <div key={proj.title} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                      <strong className="text-slate-900 block">{proj.title}</strong>
                      <p className="text-slate-600 text-[11px]">{proj.description}</p>
                      <span className="text-[10px] font-bold text-[#2563eb] block">Tech: {proj.techStack}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Online Links */}
              <div className="flex items-center space-x-3 pt-2">
                {selectedApplicant.linkedinUrl && (
                  <a
                    href={selectedApplicant.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-blue-50 text-[#2563eb] border border-blue-200 font-bold hover:bg-blue-100"
                  >
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {selectedApplicant.githubUrl && (
                  <a
                    href={selectedApplicant.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 font-bold hover:bg-slate-200"
                  >
                    <span>GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            {/* Modal Bottom Toolbar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleDownloadResume(selectedApplicant)}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Resume</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    handleUpdateStatus(selectedApplicant.id, 'Shortlisted');
                    setSelectedApplicant(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
                >
                  Shortlist Candidate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resume Viewer Modal */}
      {resumePreviewApplicant && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 w-full max-w-xl shadow-xl text-left space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0f172a]">Resume Preview</h3>
                <p className="text-xs text-slate-500">{resumePreviewApplicant.resumeFileName}</p>
              </div>
              <button
                type="button"
                onClick={() => setResumePreviewApplicant(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mock Resume Document Display */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 text-xs font-sans text-slate-800 max-h-96 overflow-y-auto">
              <div className="border-b border-slate-200 pb-3">
                <h2 className="text-base font-black text-slate-900">{resumePreviewApplicant.studentName}</h2>
                <p className="text-slate-600">{resumePreviewApplicant.email} • {resumePreviewApplicant.phone}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase text-[10px]">Education</h4>
                <p className="font-semibold">{resumePreviewApplicant.college}</p>
                <p className="text-slate-600">{resumePreviewApplicant.degree} in {resumePreviewApplicant.department} (CGPA: {resumePreviewApplicant.cgpa})</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase text-[10px]">Technical Skills</h4>
                <p>{resumePreviewApplicant.skills.join(', ')}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase text-[10px]">Projects & Experience</h4>
                {resumePreviewApplicant.projects.map((p) => (
                  <div key={p.title} className="mt-1">
                    <strong className="block">{p.title}</strong>
                    <p className="text-slate-600">{p.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => handleDownloadResume(resumePreviewApplicant)}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>

              <button
                type="button"
                onClick={() => setResumePreviewApplicant(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
