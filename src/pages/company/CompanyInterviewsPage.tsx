import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CompanySidebar } from '../../components/company/CompanySidebar';
import { CompanyHeader } from '../../components/company/CompanyHeader';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Video,
  Eye,
  PlusCircle,
  Search,
  MapPin,
  CheckCircle2,
  X,
  ExternalLink,
  UserCheck,
} from 'lucide-react';

export interface CompanyInterviewItem {
  id: string;
  studentName: string;
  avatarInitials: string;
  internshipId: string;
  internshipTitle: string;
  college: string;
  department: string;
  cgpa: string;
  skills: string[];
  matchScore: number;
  interviewDate: string; // YYYY-MM-DD or formatted
  interviewTime: string;
  interviewMode: 'Online' | 'Offline' | 'Google Meet' | 'Zoom' | 'Microsoft Teams' | 'Phone' | 'In-person';
  meetingLink?: string;
  location?: string;
  interviewer: string;
  notes?: string;
  status: 'Scheduled' | 'Upcoming' | 'Completed' | 'Selected' | 'Rejected' | 'Rescheduled' | 'Cancelled';
  email: string;
  phone: string;
  linkedinUrl: string;
  projects: { title: string; description: string }[];
  certifications: string[];
  resumeFileName: string;
}

export const CompanyInterviewsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const interviewListRef = useRef<HTMLDivElement>(null);
  const detailsSectionRef = useRef<HTMLDivElement>(null);

  // Non-blocking Feedback Banner
  const [feedback, setFeedback] = useState<string | null>(null);

  // Modals & Panels State
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<CompanyInterviewItem | null>(null);
  const [reschedulingItem, setReschedulingItem] = useState<CompanyInterviewItem | null>(null);

  // Reschedule Form state
  const [rescheduleForm, setRescheduleForm] = useState({
    interviewDate: '',
    interviewTime: '',
    interviewer: '',
    interviewMode: 'Online' as CompanyInterviewItem['interviewMode'],
    meetingLink: '',
    location: '',
  });

  // Filter & Search state
  const urlStatusParam = searchParams.get('status');

  const getInitialStatus = (param: string | null): string => {
    if (!param) return 'All';
    const lower = param.toLowerCase();
    if (lower === 'scheduled') return 'Scheduled';
    if (lower === 'upcoming') return 'Upcoming';
    if (lower === 'today') return 'Today';
    if (lower === 'completed') return 'Completed';
    if (lower === 'cancelled') return 'Cancelled';
    if (lower === 'rescheduled') return 'Rescheduled';
    return 'All';
  };

  const [statusFilter, setStatusFilter] = useState<string>(() => getInitialStatus(urlStatusParam));
  const [searchQuery, setSearchQuery] = useState('');
  const [modeFilter, setModeFilter] = useState<string>('All');

  useEffect(() => {
    setStatusFilter(getInitialStatus(urlStatusParam));
  }, [urlStatusParam]);

  // Master Mock Interviews List
  const [interviews, setInterviews] = useState<CompanyInterviewItem[]>([
    {
      id: 'intv-1',
      studentName: 'Rohan Mehta',
      avatarInitials: 'RM',
      internshipId: 'int-m1',
      internshipTitle: 'Frontend Developer Intern',
      college: 'Vellore Institute of Technology (VIT)',
      department: 'Software Engineering',
      cgpa: '8.5',
      skills: ['React', 'JavaScript', 'HTML/CSS', 'Redux'],
      matchScore: 91,
      interviewDate: '2026-08-22',
      interviewTime: '02:30 PM - 03:15 PM',
      interviewMode: 'Online',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      interviewer: 'David Miller (Lead Engineer)',
      notes: 'Focus on React state hooks, virtual DOM optimization, and CSS grid responsiveness.',
      status: 'Upcoming',
      email: 'rohan.mehta@vit.ac.in',
      phone: '+91 97654 32109',
      linkedinUrl: 'https://linkedin.com/in/rohanmehta',
      projects: [{ title: 'E-Learning Video Portal', description: 'Custom web video player with bookmarking.' }],
      certifications: ['FreeCodeCamp Responsive Web Design'],
      resumeFileName: 'Rohan_Mehta_Resume.pdf',
    },
    {
      id: 'intv-2',
      studentName: 'Aarav Sharma',
      avatarInitials: 'AS',
      internshipId: 'int-m1',
      internshipTitle: 'Frontend Developer Intern',
      college: 'IIT Bombay',
      department: 'Computer Science',
      cgpa: '9.2',
      skills: ['React', 'TypeScript', 'Next.js', 'Tailwind'],
      matchScore: 94,
      interviewDate: '2026-08-23',
      interviewTime: '11:00 AM - 11:45 AM',
      interviewMode: 'Online',
      meetingLink: 'https://meet.google.com/xyz-uvwx-rst',
      interviewer: 'Sarah Jenkins (VP Engineering)',
      notes: 'System design principles, RESTful integrations, and TypeScript types.',
      status: 'Scheduled',
      email: 'aarav.sharma@iitb.ac.in',
      phone: '+91 98765 43210',
      linkedinUrl: 'https://linkedin.com/in/aaravsharma',
      projects: [{ title: 'InternIQ Dashboard Portal', description: 'React applicant tracking portal UI.' }],
      certifications: ['AWS Certified Cloud Practitioner'],
      resumeFileName: 'Aarav_Sharma_Resume.pdf',
    },
    {
      id: 'intv-3',
      studentName: 'Priya Patel',
      avatarInitials: 'PP',
      internshipId: 'int-m2',
      internshipTitle: 'Backend Developer Intern',
      college: 'COEP Pune',
      department: 'Information Technology',
      cgpa: '8.8',
      skills: ['Node.js', 'Express', 'PostgreSQL', 'Docker'],
      matchScore: 88,
      interviewDate: '2026-08-20',
      interviewTime: '04:00 PM - 04:30 PM',
      interviewMode: 'Offline',
      location: 'TechNova HQ, Floor 4, Conference Room B, Bengaluru',
      interviewer: 'Alex Vance (Tech Lead)',
      notes: 'Backend database queries, indexing, and Express middleware architecture.',
      status: 'Completed',
      email: 'priya.patel@coep.ac.in',
      phone: '+91 98123 45678',
      linkedinUrl: 'https://linkedin.com/in/priyapatel',
      projects: [{ title: 'Distributed Payment Microservice', description: 'Express backend processing 1K req/sec.' }],
      certifications: ['Oracle Certified Associate Java SE'],
      resumeFileName: 'Priya_Patel_CV.pdf',
    },
    {
      id: 'intv-4',
      studentName: 'Ananya Verma',
      avatarInitials: 'AV',
      internshipId: 'int-m3',
      internshipTitle: 'UI/UX Design Intern',
      college: 'NID Ahmedabad',
      department: 'Interaction Design',
      cgpa: '9.4',
      skills: ['Figma', 'User Research', 'Prototyping', 'Wireframing'],
      matchScore: 96,
      interviewDate: '2026-08-18',
      interviewTime: '01:00 PM - 02:00 PM',
      interviewMode: 'Online',
      meetingLink: 'https://meet.google.com/des-ign-uiux',
      interviewer: 'Rachel Green (Design Lead)',
      notes: 'Figma prototype walkthrough and usability testing strategy.',
      status: 'Selected',
      email: 'ananya.v@nid.ac.in',
      phone: '+91 99887 76655',
      linkedinUrl: 'https://linkedin.com/in/ananyaverma',
      projects: [{ title: 'Healthcare Portal Redesign', description: 'Redesign reducing appointment booking time.' }],
      certifications: ['Google UX Design Professional Certificate'],
      resumeFileName: 'Ananya_Verma_Portfolio.pdf',
    },
    {
      id: 'intv-5',
      studentName: 'Kabir Das',
      avatarInitials: 'KD',
      internshipId: 'int-m2',
      internshipTitle: 'Backend Developer Intern',
      college: 'BITS Pilani',
      department: 'Computer Science',
      cgpa: '8.9',
      skills: ['Python', 'Django', 'PostgreSQL', 'Celery'],
      matchScore: 82,
      interviewDate: '2026-08-15',
      interviewTime: '03:00 PM - 03:45 PM',
      interviewMode: 'Online',
      meetingLink: 'https://meet.google.com/bits-python-qa',
      interviewer: 'David Miller (Lead Engineer)',
      notes: 'Python async logic evaluation.',
      status: 'Rejected',
      email: 'kabir.das@pilani.bits-pilani.ac.in',
      phone: '+91 91234 56789',
      linkedinUrl: 'https://linkedin.com/in/kabirdas',
      projects: [{ title: 'Job Notice Scraper', description: 'Celery worker parsing university notices.' }],
      certifications: ['Python Associate Certificate'],
      resumeFileName: 'Kabir_Das_Resume.pdf',
    },
  ]);

  // Schedule New Interview Form State
  const [scheduleForm, setScheduleForm] = useState({
    internshipTitle: 'Frontend Developer Intern',
    studentName: '',
    interviewDate: '',
    interviewTime: '10:00 AM - 10:45 AM',
    interviewMode: 'Online' as 'Online' | 'Offline',
    meetingLink: '',
    location: '',
    interviewer: 'David Miller (Lead Engineer)',
    notes: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Summary Card Click Handler with Smooth Scroll
  const handleStatusCardClick = (st: string) => {
    setStatusFilter(st);
    if (st === 'All') {
      searchParams.delete('status');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ ...Object.fromEntries(searchParams), status: st.toLowerCase() });
    }

    if (interviewListRef.current) {
      interviewListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Helper: check if date is today
  const isTodayDate = (dateStr: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    return dateStr === todayStr;
  };

  // Open Reschedule Modal with candidate prefilled data
  const handleOpenReschedule = (item: CompanyInterviewItem) => {
    setReschedulingItem(item);
    setRescheduleForm({
      interviewDate: item.interviewDate,
      interviewTime: item.interviewTime,
      interviewer: item.interviewer,
      interviewMode: item.interviewMode,
      meetingLink: item.meetingLink || '',
      location: item.location || '',
    });
  };

  // Submit Reschedule Form
  const handleSaveReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingItem) return;

    const updated = interviews.map((item) =>
      item.id === reschedulingItem.id
        ? {
            ...item,
            interviewDate: rescheduleForm.interviewDate,
            interviewTime: rescheduleForm.interviewTime,
            interviewer: rescheduleForm.interviewer,
            interviewMode: rescheduleForm.interviewMode,
            meetingLink: rescheduleForm.meetingLink,
            location: rescheduleForm.location,
            status: 'Rescheduled' as const,
          }
        : item
    );

    setInterviews(updated);
    const candidateName = reschedulingItem.studentName;
    setReschedulingItem(null);

    setFeedback(`Interview for ${candidateName} has been rescheduled.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  // Cancel Interview Action
  const handleCancelInterview = (id: string) => {
    const item = interviews.find((i) => i.id === id);
    if (!item) return;

    setInterviews((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: 'Cancelled' as const } : i))
    );

    setFeedback(`Interview for ${item.studentName} has been cancelled.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  // Schedule Form Handler
  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!scheduleForm.studentName.trim()) errs.studentName = 'Candidate Name is required';
    if (!scheduleForm.interviewDate) errs.interviewDate = 'Interview Date is required';
    if (scheduleForm.interviewMode === 'Online' && !scheduleForm.meetingLink.trim()) {
      errs.meetingLink = 'Meeting link is required for online interviews';
    }
    if (scheduleForm.interviewMode === 'Offline' && !scheduleForm.location.trim()) {
      errs.location = 'Location address is required for offline interviews';
    }

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    const newInterview: CompanyInterviewItem = {
      id: `intv-${Date.now()}`,
      studentName: scheduleForm.studentName,
      avatarInitials: scheduleForm.studentName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase(),
      internshipId: 'int-m1',
      internshipTitle: scheduleForm.internshipTitle,
      college: 'Partner University',
      department: 'Computer Science',
      cgpa: '8.7',
      skills: ['React', 'TypeScript'],
      matchScore: 90,
      interviewDate: scheduleForm.interviewDate,
      interviewTime: scheduleForm.interviewTime,
      interviewMode: scheduleForm.interviewMode,
      meetingLink: scheduleForm.meetingLink,
      location: scheduleForm.location,
      interviewer: scheduleForm.interviewer,
      notes: scheduleForm.notes,
      status: 'Upcoming',
      email: 'candidate@university.edu',
      phone: '+91 98000 00000',
      linkedinUrl: 'https://linkedin.com',
      projects: [],
      certifications: [],
      resumeFileName: 'Candidate_Resume.pdf',
    };

    setInterviews([newInterview, ...interviews]);
    setIsScheduleModalOpen(false);
    setScheduleForm({
      internshipTitle: 'Frontend Developer Intern',
      studentName: '',
      interviewDate: '',
      interviewTime: '10:00 AM - 10:45 AM',
      interviewMode: 'Online',
      meetingLink: '',
      location: '',
      interviewer: 'David Miller (Lead Engineer)',
      notes: '',
    });
    setFormErrors({});

    setFeedback(`Interview successfully scheduled for ${newInterview.studentName}!`);
    setTimeout(() => setFeedback(null), 3500);
  };

  // Filter Calculations
  const filteredList = interviews.filter((item) => {
    const matchesStatus =
      statusFilter === 'All'
        ? true
        : statusFilter === 'Today'
        ? isTodayDate(item.interviewDate)
        : item.status === statusFilter;

    const matchesMode = modeFilter === 'All' || item.interviewMode === modeFilter;
    const matchesSearch =
      item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.internshipTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.interviewer.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesMode && matchesSearch;
  });

  // Upcoming Interviews (Nearest date/time first)
  const upcomingList = [...interviews]
    .filter((i) => i.status === 'Upcoming' || i.status === 'Scheduled' || i.status === 'Rescheduled')
    .sort((a, b) => new Date(a.interviewDate).getTime() - new Date(b.interviewDate).getTime());

  // Metrics Summary Breakdown
  const totalCount = interviews.length;
  const upcomingCount = interviews.filter((i) => i.status === 'Upcoming' || i.status === 'Scheduled' || i.status === 'Rescheduled').length;
  const todayCount = interviews.filter((i) => isTodayDate(i.interviewDate)).length;
  const completedCount = interviews.filter((i) => i.status === 'Completed').length;
  const cancelledCount = interviews.filter((i) => i.status === 'Cancelled').length;

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <CompanySidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <CompanyHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Interview Management"
          subtitle="Manage candidate interviews, scheduling, and evaluation."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto pb-safe">
          {/* Header Bar */}
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
                <h2 className="text-xl font-extrabold text-[#0f172a]">Interview Management</h2>
                <p className="text-xs text-[#64748b]">
                  Showing {filteredList.length} of {totalCount} total candidate interviews
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsScheduleModalOpen(true)}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Schedule Interview</span>
            </button>
          </div>

          {/* Feedback Toast */}
          {feedback && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2 animate-in fade-in duration-150 text-left">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          {/* 5 Clickable Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-left">
            {[
              { label: 'Total Interviews', count: totalCount, st: 'All', color: 'border-blue-500 text-[#2563eb] bg-blue-50/30' },
              { label: 'Upcoming', count: upcomingCount, st: 'Upcoming', color: 'border-indigo-500 text-indigo-700 bg-indigo-50/30' },
              { label: 'Today', count: todayCount, st: 'Today', color: 'border-emerald-500 text-emerald-700 bg-emerald-50/30' },
              { label: 'Completed', count: completedCount, st: 'Completed', color: 'border-amber-500 text-amber-700 bg-amber-50/30' },
              { label: 'Cancelled', count: cancelledCount, st: 'Cancelled', color: 'border-rose-500 text-rose-700 bg-rose-50/30' },
            ].map((card) => (
              <div
                key={card.st}
                onClick={() => handleStatusCardClick(card.st)}
                className={`bg-white border rounded-2xl p-4 shadow-2xs space-y-1 cursor-pointer transition-all duration-150 transform hover:-translate-y-0.5 ${
                  statusFilter === card.st
                    ? `${card.color} ring-2 ring-blue-500/20 font-bold`
                    : 'border-[#e2e8f0] hover:border-slate-300'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block truncate">
                  {card.label}
                </span>
                <p className="text-2xl font-black text-[#0f172a]">{card.count}</p>
              </div>
            ))}
          </div>

          {/* Section: UPCOMING INTERVIEWS (Nearest date/time first) */}
          {upcomingList.length > 0 && (
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl space-y-4 text-left">
              <div className="flex items-center space-x-2 text-blue-200">
                <Clock className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider">
                  Upcoming Priority Interviews ({upcomingList.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingList.slice(0, 3).map((item) => (
                  <div
                    key={`up-${item.id}`}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-500/30 border border-blue-400/40 text-[10px] font-bold text-blue-200">
                        {item.interviewMode}
                      </span>
                      <span className="text-xs font-bold text-amber-300 flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{item.interviewDate}</span>
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-blue-500 text-white font-bold text-xs flex items-center justify-center border border-blue-400">
                        {item.avatarInitials}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{item.studentName}</h4>
                        <p className="text-[11px] text-blue-200">{item.internshipTitle}</p>
                      </div>
                    </div>

                    <div className="text-[11px] text-blue-100/90 space-y-1 pt-1 border-t border-white/10">
                      <div className="flex items-center space-x-1.5">
                        <Clock className="w-3 h-3 text-blue-300 shrink-0" />
                        <span>{item.interviewTime}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 truncate">
                        <UserCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate">{item.interviewer}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search & Filters Bar */}
          <div
            ref={interviewListRef}
            id="interview-list-section"
            className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs space-y-3 text-left scroll-mt-6"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search candidate or position..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              {/* Status & Mode Dropdowns */}
              <div className="flex items-center space-x-2 w-full md:w-auto flex-wrap gap-y-2">
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusCardClick(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#2563eb]"
                >
                  <option value="All">All Statuses</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Today">Today</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Rescheduled">Rescheduled</option>
                </select>

                <select
                  value={modeFilter}
                  onChange={(e) => setModeFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#2563eb]"
                >
                  <option value="All">All Modes</option>
                  <option value="Online">Online (Video Call)</option>
                  <option value="Google Meet">Google Meet</option>
                  <option value="Zoom">Zoom</option>
                  <option value="Microsoft Teams">Microsoft Teams</option>
                  <option value="Offline">Offline / In-person</option>
                </select>
              </div>
            </div>
          </div>

          {/* Interview Cards Grid */}
          {filteredList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
              {filteredList.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-4 hover:border-blue-300 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563eb] border border-blue-200 text-[11px] font-bold">
                        {item.interviewMode}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${
                          item.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : item.status === 'Cancelled'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : item.status === 'Rescheduled'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-[#2563eb] font-bold flex items-center justify-center text-xs shrink-0 border border-blue-200 shadow-2xs">
                        {item.avatarInitials}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#0f172a]">{item.studentName}</h3>
                        <p className="text-xs text-[#64748b] font-medium">{item.internshipTitle}</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                      <div className="flex items-center space-x-2 text-slate-800 font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-[#2563eb] shrink-0" />
                        <span>{item.interviewDate} • {item.interviewTime}</span>
                      </div>

                      {item.meetingLink && (
                        <a
                          href={item.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center space-x-1.5 text-indigo-600 hover:text-indigo-800 font-bold truncate"
                        >
                          <Video className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">Meeting Link</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      )}

                      {item.location && (
                        <div className="flex items-start space-x-1.5 text-slate-600">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span className="text-[11px] leading-tight">{item.location}</span>
                        </div>
                      )}

                      <div className="flex items-center space-x-1.5 text-slate-500 pt-1 border-t border-slate-200/60">
                        <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate font-medium">{item.interviewer}</span>
                      </div>
                    </div>
                  </div>

                  {/* Required Actions Toolbar: View Details, Join Interview, Reschedule, Cancel */}
                  <div className="space-y-2 pt-3 border-t border-slate-100">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCandidate(item);
                          setTimeout(() => {
                            if (detailsSectionRef.current) {
                              detailsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                          }, 100);
                        }}
                        className="inline-flex items-center justify-center space-x-1 py-1.5 px-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>

                      {item.meetingLink ? (
                        <a
                          href={item.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center space-x-1 py-1.5 px-2 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Join Interview</span>
                        </a>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="py-1.5 px-2 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold text-center cursor-not-allowed"
                        >
                          In-Person
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenReschedule(item)}
                        className="py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-xs font-bold cursor-pointer"
                      >
                        Reschedule
                      </button>

                      {item.status !== 'Cancelled' ? (
                        <button
                          type="button"
                          onClick={() => handleCancelInterview(item.id)}
                          className="py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-xs font-bold cursor-pointer"
                        >
                          Cancel
                        </button>
                      ) : (
                        <span className="py-1.5 text-center text-xs font-bold text-slate-400 bg-slate-100 rounded-xl">
                          Cancelled
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-12 text-center space-y-4 shadow-2xs max-w-md mx-auto my-6">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-[#2563eb] flex items-center justify-center mx-auto">
                <Calendar className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#0f172a]">No interviews scheduled</h3>
                <p className="text-xs text-[#64748b]">No candidates match the selected interview status or filter.</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Schedule Interview Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-xl text-left space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#0f172a]">Schedule Candidate Interview</h3>
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-3.5 text-xs font-medium">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">
                  Select Internship Position
                </label>
                <select
                  value={scheduleForm.internshipTitle}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, internshipTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563eb]"
                >
                  <option value="Frontend Developer Intern">Frontend Developer Intern</option>
                  <option value="Backend Developer Intern">Backend Developer Intern</option>
                  <option value="UI/UX Design Intern">UI/UX Design Intern</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">
                  Candidate Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Aarav Sharma"
                  value={scheduleForm.studentName}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, studentName: e.target.value })}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-slate-900 focus:outline-none ${
                    formErrors.studentName ? 'border-rose-500' : 'border-slate-300 focus:border-[#2563eb]'
                  }`}
                />
                {formErrors.studentName && <p className="text-[11px] text-rose-600 font-semibold">{formErrors.studentName}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">
                    Interview Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={scheduleForm.interviewDate}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, interviewDate: e.target.value })}
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-slate-900 focus:outline-none ${
                      formErrors.interviewDate ? 'border-rose-500' : 'border-slate-300 focus:border-[#2563eb]'
                    }`}
                  />
                  {formErrors.interviewDate && <p className="text-[11px] text-rose-600 font-semibold">{formErrors.interviewDate}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">
                    Interview Mode
                  </label>
                  <select
                    value={scheduleForm.interviewMode}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, interviewMode: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563eb]"
                  >
                    <option value="Google Meet">Google Meet</option>
                    <option value="Zoom">Zoom</option>
                    <option value="Microsoft Teams">Microsoft Teams</option>
                    <option value="Phone">Phone</option>
                    <option value="In-person">In-person</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">
                  Meeting Link / Location <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="https://meet.google.com/... or HQ Office Room 302"
                  value={scheduleForm.meetingLink}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, meetingLink: e.target.value })}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-slate-900 focus:outline-none ${
                    formErrors.meetingLink ? 'border-rose-500' : 'border-slate-300 focus:border-[#2563eb]'
                  }`}
                />
                {formErrors.meetingLink && <p className="text-[11px] text-rose-600 font-semibold">{formErrors.meetingLink}</p>}
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">
                  Interviewer Name & Role
                </label>
                <input
                  type="text"
                  value={scheduleForm.interviewer}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, interviewer: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">
                  Notes / Instructions
                </label>
                <textarea
                  rows={2}
                  placeholder="Additional guidelines, technical topics, or preparation materials..."
                  value={scheduleForm.notes}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs cursor-pointer"
                >
                  Schedule Interview
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Interview Modal */}
      {reschedulingItem && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-xl text-left space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0f172a]">Reschedule Candidate Interview</h3>
                <p className="text-xs text-[#64748b]">Candidate: {reschedulingItem.studentName}</p>
              </div>
              <button
                type="button"
                onClick={() => setReschedulingItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReschedule} className="space-y-3.5 text-xs font-medium">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">
                    New Date
                  </label>
                  <input
                    type="date"
                    value={rescheduleForm.interviewDate}
                    onChange={(e) => setRescheduleForm({ ...rescheduleForm, interviewDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563eb]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">
                    New Time Slot
                  </label>
                  <input
                    type="text"
                    value={rescheduleForm.interviewTime}
                    onChange={(e) => setRescheduleForm({ ...rescheduleForm, interviewTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563eb]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">
                    Interview Mode
                  </label>
                  <select
                    value={rescheduleForm.interviewMode}
                    onChange={(e) => setRescheduleForm({ ...rescheduleForm, interviewMode: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563eb]"
                  >
                    <option value="Google Meet">Google Meet</option>
                    <option value="Zoom">Zoom</option>
                    <option value="Microsoft Teams">Microsoft Teams</option>
                    <option value="Phone">Phone</option>
                    <option value="In-person">In-person</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">
                    Interviewer
                  </label>
                  <input
                    type="text"
                    value={rescheduleForm.interviewer}
                    onChange={(e) => setRescheduleForm({ ...rescheduleForm, interviewer: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563eb]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">
                  Meeting Link / Location
                </label>
                <input
                  type="text"
                  value={rescheduleForm.meetingLink}
                  onChange={(e) => setRescheduleForm({ ...rescheduleForm, meetingLink: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReschedulingItem(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs cursor-pointer"
                >
                  Save Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detailed Candidate & Interview Section */}
      {selectedCandidate && (
        <div
          ref={detailsSectionRef}
          id="interview-details-section"
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4"
        >
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-xl text-left space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-[#2563eb] font-black text-base flex items-center justify-center border border-blue-200">
                  {selectedCandidate.avatarInitials}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0f172a]">{selectedCandidate.studentName}</h3>
                  <p className="text-xs text-[#64748b]">
                    Interviewing for: <strong className="text-slate-900">{selectedCandidate.internshipTitle}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Structured Sections */}
            <div className="space-y-4 text-xs font-medium">
              {/* Candidate Info */}
              <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 space-y-2">
                <h4 className="font-extrabold text-[#0f172a] text-sm flex items-center space-x-1.5">
                  <UserCheck className="w-4 h-4 text-[#2563eb]" />
                  <span>Candidate Information</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                  <div><strong>College:</strong> {selectedCandidate.college}</div>
                  <div><strong>Department:</strong> {selectedCandidate.department}</div>
                  <div><strong>CGPA:</strong> {selectedCandidate.cgpa}</div>
                  <div><strong>Email:</strong> {selectedCandidate.email}</div>
                  <div><strong>Phone:</strong> {selectedCandidate.phone}</div>
                  <div>
                    <strong>LinkedIn:</strong>{' '}
                    <a href={selectedCandidate.linkedinUrl} target="_blank" rel="noreferrer" className="text-[#2563eb] underline">
                      View Profile
                    </a>
                  </div>
                </div>
              </div>

              {/* Interview & Meeting Information */}
              <div className="bg-blue-50/50 border border-blue-200/60 rounded-2xl p-4 space-y-2">
                <h4 className="font-extrabold text-[#0f172a] text-sm flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4 text-[#2563eb]" />
                  <span>Interview & Meeting Details</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                  <div><strong>Status:</strong> <span className="font-bold text-[#2563eb]">{selectedCandidate.status}</span></div>
                  <div><strong>Mode:</strong> {selectedCandidate.interviewMode}</div>
                  <div><strong>Date:</strong> {selectedCandidate.interviewDate}</div>
                  <div><strong>Time:</strong> {selectedCandidate.interviewTime}</div>
                  <div className="sm:col-span-2"><strong>Interviewer:</strong> {selectedCandidate.interviewer}</div>
                  {selectedCandidate.meetingLink && (
                    <div className="sm:col-span-2 truncate">
                      <strong>Meeting Link:</strong>{' '}
                      <a href={selectedCandidate.meetingLink} target="_blank" rel="noreferrer" className="text-indigo-600 font-bold underline">
                        {selectedCandidate.meetingLink}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedCandidate.notes && (
                <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 space-y-1">
                  <strong className="text-[#0f172a] font-bold block">Evaluation Notes & Instructions:</strong>
                  <p className="text-slate-600 leading-relaxed">{selectedCandidate.notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
