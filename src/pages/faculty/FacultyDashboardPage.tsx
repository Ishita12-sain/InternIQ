import React, { useState, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { FacultySidebar } from '../../components/faculty/FacultySidebar';
import { FacultyHeader } from '../../components/faculty/FacultyHeader';
import {
  generatedStudents,
  generatedApplications,
  generatedInternships,
  generatedPlacements,
} from '../../types/masterDataset';
import {
  Users,
  GraduationCap,
  Briefcase,
  FileText,
  CheckCircle2,
  Clock,
  Award,
  Search,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Plus,
} from 'lucide-react';

// ==================================================
// 1. FACULTY DASHBOARD COMPONENT
// ==================================================
export const FacultyDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filter mentees assigned to Faculty Mentor 1 (fac-1) or first 25 mentees
  const mentees = useMemo(() => {
    return generatedStudents.filter((s) => s.facultyId === 'fac-1' || parseInt(s.id.replace('st-', ''), 10) % 64 === 1);
  }, []);

  const menteeIds = useMemo(() => new Set(mentees.map((m) => m.id)), [mentees]);

  // Derived metrics from shared dataset
  const menteeApplications = useMemo(() => {
    return generatedApplications.filter((a) => menteeIds.has(a.studentId));
  }, [menteeIds]);

  const menteePlacements = useMemo(() => {
    return generatedPlacements.filter((p) => menteeIds.has(p.studentId));
  }, [menteeIds]);

  const metrics = useMemo(() => {
    const totalMentees = mentees.length;
    const activeInternships = generatedInternships.filter((i) => i.status === 'Active').length;
    const totalApps = menteeApplications.length;
    const shortlistedApps = menteeApplications.filter((a) => a.status === 'Shortlisted' || a.status === 'Interview').length;
    const selectedApps = menteeApplications.filter((a) => a.status === 'Selected').length;
    const ongoingInternships = menteePlacements.filter((p) => p.status === 'Ongoing' || p.status === 'Joining Soon').length;
    const completedInternships = menteePlacements.filter((p) => p.status === 'Completed').length;

    return {
      totalMentees,
      activeInternships,
      totalApps,
      shortlistedApps,
      selectedApps,
      ongoingInternships,
      completedInternships,
    };
  }, [mentees, menteeApplications, menteePlacements]);

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <FacultySidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <FacultyHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Faculty Dashboard"
          subtitle="Monitor your mentees, internship progress and student outcomes."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto pb-safe text-left">
          {/* 4 Primary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              type="button"
              onClick={() => navigate('/faculty/mentees')}
              className="p-4 bg-white border border-[#e2e8f0] rounded-2xl shadow-2xs hover:border-indigo-600 hover:shadow-xs transition-all text-left cursor-pointer space-y-1 group"
            >
              <span className="text-[10px] text-slate-500 font-bold uppercase block group-hover:text-indigo-600">ASSIGNED MENTEES</span>
              <strong className="text-xl text-[#0f172a] font-black group-hover:text-indigo-600">{metrics.totalMentees}</strong>
            </button>

            <button
              type="button"
              onClick={() => navigate('/faculty/applications')}
              className="p-4 bg-white border border-[#e2e8f0] rounded-2xl shadow-2xs hover:border-indigo-600 hover:shadow-xs transition-all text-left cursor-pointer space-y-1 group"
            >
              <span className="text-[10px] text-slate-500 font-bold uppercase block group-hover:text-indigo-600">APPLICATIONS FILED</span>
              <strong className="text-xl text-blue-600 font-black group-hover:text-indigo-600">{metrics.totalApps}</strong>
            </button>

            <button
              type="button"
              onClick={() => navigate('/faculty/applications?status=selected')}
              className="p-4 bg-white border border-[#e2e8f0] rounded-2xl shadow-2xs hover:border-indigo-600 hover:shadow-xs transition-all text-left cursor-pointer space-y-1 group"
            >
              <span className="text-[10px] text-slate-500 font-bold uppercase block group-hover:text-indigo-600">SELECTION OFFERS</span>
              <strong className="text-xl text-emerald-600 font-black group-hover:text-indigo-600">{metrics.selectedApps}</strong>
            </button>

            <button
              type="button"
              onClick={() => navigate('/faculty/reports')}
              className="p-4 bg-indigo-50/50 border border-indigo-200 rounded-2xl shadow-2xs hover:border-indigo-600 hover:shadow-xs transition-all text-left cursor-pointer space-y-1 group"
            >
              <span className="text-[10px] text-indigo-700 font-bold uppercase block group-hover:text-indigo-800">MENTEE SUCCESS RATE</span>
              <strong className="text-xl text-indigo-600 font-black">
                {metrics.totalMentees > 0 ? ((metrics.selectedApps / metrics.totalMentees) * 100).toFixed(1) : 0}%
              </strong>
            </button>
          </div>

          {/* 7 Clickable Summary Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {[
              { label: 'TOTAL MENTEES', val: metrics.totalMentees, path: '/faculty/mentees', icon: <Users className="w-4 h-4 text-indigo-600" /> },
              { label: 'ACTIVE INTERNSHIPS', val: metrics.activeInternships, path: '/faculty/internships?status=active', icon: <Briefcase className="w-4 h-4 text-[#2563eb]" /> },
              { label: 'APPLICATIONS', val: metrics.totalApps, path: '/faculty/applications', icon: <FileText className="w-4 h-4 text-slate-700" /> },
              { label: 'SHORTLISTED', val: metrics.shortlistedApps, path: '/faculty/applications?status=shortlisted', icon: <Clock className="w-4 h-4 text-amber-500" /> },
              { label: 'SELECTED', val: metrics.selectedApps, path: '/faculty/applications?status=selected', icon: <Award className="w-4 h-4 text-emerald-600" /> },
              { label: 'ONGOING', val: metrics.ongoingInternships, path: '/faculty/internships?status=ongoing', icon: <CheckCircle2 className="w-4 h-4 text-indigo-600" /> },
              { label: 'COMPLETED', val: metrics.completedInternships, path: '/faculty/internships?status=completed', icon: <GraduationCap className="w-4 h-4 text-purple-600" /> },
            ].map((c) => (
              <button
                key={c.label}
                type="button"
                onClick={() => navigate(c.path)}
                className="bg-white border border-[#e2e8f0] rounded-2xl p-3.5 shadow-2xs hover:border-indigo-600 hover:shadow-xs hover:-translate-y-0.5 transition-all text-left cursor-pointer space-y-1 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-extrabold tracking-wider text-slate-500 group-hover:text-indigo-600 truncate">{c.label}</span>
                  {c.icon}
                </div>
                <p className="text-xl font-black text-[#0f172a] group-hover:text-indigo-600">{c.val.toLocaleString()}</p>
              </button>
            ))}
          </div>

          {/* MY MENTEES OVERVIEW SECTION */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-[#0f172a]">My Assigned Mentees ({mentees.length})</h3>
                <p className="text-xs text-slate-500">Track student readiness, application status and internship progress.</p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/faculty/mentees')}
                className="px-3.5 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-bold text-xs rounded-xl cursor-pointer transition-colors"
              >
                View All Mentees →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {mentees.slice(0, 6).map((student) => (
                <div key={student.id} className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 hover:border-indigo-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                        {student.avatarInitials}
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => navigate(`/faculty/students/${student.id}`)}
                          className="font-extrabold text-xs text-[#0f172a] hover:text-indigo-600 text-left"
                        >
                          {student.name}
                        </button>
                        <p className="text-[10px] text-slate-400 font-mono">ID: {student.id}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold rounded-full">
                      {student.internshipStatus}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 space-y-0.5 pt-1">
                    <p>{student.course} ({student.year})</p>
                    <p>Applications: <strong>{student.applications || 0}</strong> • Selected: <strong className="text-emerald-600">{student.selected || 0}</strong></p>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => navigate(`/faculty/students/${student.id}`)}
                      className="px-3 py-1 bg-white border border-slate-200 hover:border-indigo-600 hover:text-indigo-600 font-bold text-[11px] rounded-lg cursor-pointer"
                    >
                      View Student Dossier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RECENT MENTEE APPLICATIONS TABLE */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-[#0f172a]">Recent Mentee Applications</h3>
              <button
                type="button"
                onClick={() => navigate('/faculty/applications')}
                className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
              >
                View All Applications →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Student</th>
                    <th className="py-3.5 px-4">Internship Role</th>
                    <th className="py-3.5 px-4">Company</th>
                    <th className="py-3.5 px-4">Applied Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {menteeApplications.slice(0, 8).map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#0f172a]">
                        <button type="button" onClick={() => navigate(`/faculty/students/${app.studentId}`)} className="hover:text-indigo-600">
                          {app.candidateName}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{app.internshipTitle}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{app.companyName}</td>
                      <td className="py-3.5 px-4 text-slate-500">{app.appliedDate}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          app.status === 'Selected' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => navigate(`/faculty/applications/${app.id}`)}
                          className="px-3 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 font-bold text-[11px] rounded-lg cursor-pointer"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// ==================================================
// 2. FACULTY STUDENTS LIST & DOSSIER PAGE
// ==================================================
export const FacultyStudentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const rawStatusParam = searchParams.get('status');

  const normalizeStatus = (param: string | null): string => {
    if (!param) return 'All';
    const lower = param.toLowerCase();
    if (lower === 'seeking') return 'Seeking';
    if (lower === 'applied') return 'Applied';
    if (lower === 'shortlisted') return 'Shortlisted';
    if (lower === 'selected') return 'Selected';
    if (lower === 'ongoing') return 'Ongoing';
    if (lower === 'completed') return 'Completed';
    return 'All';
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState(normalizeStatus(rawStatusParam));
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter students assigned to faculty mentor (fac-1)
  const mentees = useMemo(() => {
    return generatedStudents.filter((s) => s.facultyId === 'fac-1' || parseInt(s.id.replace('st-', ''), 10) % 64 === 1);
  }, []);

  // Summary Metrics calculated dynamically from assigned mentees
  const metrics = useMemo(() => {
    const totalMentees = mentees.length;
    const seeking = mentees.filter((s) => s.internshipStatus === 'Seeking' || s.internshipStatus === 'Looking').length;
    const applied = mentees.filter((s) => s.internshipStatus === 'Applied').length;
    const shortlisted = mentees.filter((s) => s.internshipStatus === 'Shortlisted').length;
    const selected = mentees.filter((s) => s.internshipStatus === 'Selected').length;
    const ongoing = mentees.filter((s) => s.internshipStatus === 'Ongoing').length;
    const completed = mentees.filter((s) => s.internshipStatus === 'Completed').length;

    return { totalMentees, seeking, applied, shortlisted, selected, ongoing, completed };
  }, [mentees]);

  const filteredMentees = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return mentees.filter((s) => {
      if (q) {
        const matchName = s.name.toLowerCase().includes(q);
        const matchId = s.id.toLowerCase().includes(q);
        const matchEmail = s.email.toLowerCase().includes(q);
        const matchCourse = s.course.toLowerCase().includes(q);
        if (!matchName && !matchId && !matchEmail && !matchCourse) return false;
      }
      if (courseFilter !== 'All' && s.course !== courseFilter) return false;
      if (deptFilter !== 'All' && !s.course.toLowerCase().includes(deptFilter.toLowerCase())) return false;
      if (statusFilter !== 'All') {
        if (statusFilter === 'Seeking' && !(s.internshipStatus === 'Seeking' || s.internshipStatus === 'Looking')) return false;
        if (statusFilter === 'Applied' && s.internshipStatus !== 'Applied') return false;
        if (statusFilter === 'Shortlisted' && s.internshipStatus !== 'Shortlisted') return false;
        if (statusFilter === 'Selected' && s.internshipStatus !== 'Selected') return false;
        if (statusFilter === 'Ongoing' && s.internshipStatus !== 'Ongoing') return false;
        if (statusFilter === 'Completed' && s.internshipStatus !== 'Completed') return false;
      }
      return true;
    });
  }, [mentees, searchQuery, courseFilter, deptFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredMentees.length / pageSize));
  const paginatedMentees = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMentees.slice(start, start + pageSize);
  }, [filteredMentees, currentPage, pageSize]);

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <FacultySidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <FacultyHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="My Mentees"
          subtitle="Monitor the academic and internship progress of your assigned students."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto pb-safe text-left">
          {/* Back Nav */}
          <button
            type="button"
            onClick={() => navigate('/faculty/dashboard')}
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-indigo-600 cursor-pointer border-b border-slate-200 pb-3 w-full"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          {/* Active Filter Banner */}
          {statusFilter !== 'All' && (
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center justify-between text-xs gap-2">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="font-bold text-[#0f172a]">
                  Active Filter: <strong className="text-indigo-600">{statusFilter}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('All');
                  setCurrentPage(1);
                  navigate('/faculty/mentees');
                }}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl font-bold text-[11px] cursor-pointer"
              >
                Clear Filter
              </button>
            </div>
          )}

          {/* 7 Clickable Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {[
              { label: 'TOTAL MENTEES', val: metrics.totalMentees, status: 'All', path: '/faculty/mentees', icon: <Users className="w-4 h-4 text-indigo-600" /> },
              { label: 'SEEKING INTERNSHIP', val: metrics.seeking, status: 'Seeking', path: '/faculty/mentees?status=seeking', icon: <Clock className="w-4 h-4 text-amber-500" /> },
              { label: 'APPLIED', val: metrics.applied, status: 'Applied', path: '/faculty/mentees?status=applied', icon: <FileText className="w-4 h-4 text-blue-600" /> },
              { label: 'SHORTLISTED', val: metrics.shortlisted, status: 'Shortlisted', path: '/faculty/mentees?status=shortlisted', icon: <Clock className="w-4 h-4 text-purple-600" /> },
              { label: 'SELECTED', val: metrics.selected, status: 'Selected', path: '/faculty/mentees?status=selected', icon: <Award className="w-4 h-4 text-emerald-600" /> },
              { label: 'ONGOING', val: metrics.ongoing, status: 'Ongoing', path: '/faculty/mentees?status=ongoing', icon: <CheckCircle2 className="w-4 h-4 text-indigo-600" /> },
              { label: 'COMPLETED', val: metrics.completed, status: 'Completed', path: '/faculty/mentees?status=completed', icon: <GraduationCap className="w-4 h-4 text-emerald-700" /> },
            ].map((c) => (
              <button
                key={c.label}
                type="button"
                onClick={() => {
                  setStatusFilter(c.status);
                  setCurrentPage(1);
                  navigate(c.path);
                }}
                className={`bg-white border rounded-2xl p-3.5 shadow-2xs hover:border-indigo-600 hover:shadow-xs hover:-translate-y-0.5 transition-all text-left cursor-pointer space-y-1 group ${
                  statusFilter === c.status
                    ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/20'
                    : 'border-[#e2e8f0]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-extrabold tracking-wider text-slate-500 group-hover:text-indigo-600 truncate">{c.label}</span>
                  {c.icon}
                </div>
                <p className="text-xl font-black text-[#0f172a] group-hover:text-indigo-600">{c.val.toLocaleString()}</p>
              </button>
            ))}
          </div>

          {/* Search & Filters */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs space-y-3">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search student by name, ID, course or department..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">Status: All</option>
                <option value="Seeking">Seeking Internship</option>
                <option value="Applied">Applied</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Selected">Selected</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>

              <select
                value={deptFilter}
                onChange={(e) => { setDeptFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">Department: All</option>
                <option value="Computer Science">Computer Science</option>
                <option value="IT">Information Tech</option>
                <option value="Electronics">Electronics</option>
              </select>

              <select
                value={courseFilter}
                onChange={(e) => { setCourseFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">Course: All</option>
                <option value="B.Tech Computer Science">B.Tech CS</option>
                <option value="B.Tech IT">B.Tech IT</option>
              </select>
            </div>
          </div>

          {/* Mentees Table */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Student</th>
                    <th className="py-3.5 px-4">Course & Year</th>
                    <th className="py-3.5 px-4">College</th>
                    <th className="py-3.5 px-4 text-center">Applications</th>
                    <th className="py-3.5 px-4 text-center">Selected</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {paginatedMentees.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 font-semibold">
                        No mentees match the active filter criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedMentees.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={() => navigate(`/faculty/students/${s.id}`)}
                            className="font-extrabold text-[#0f172a] hover:text-indigo-600 text-left cursor-pointer"
                          >
                            {s.name}
                          </button>
                          <p className="text-[10px] text-slate-400 font-mono">ID: {s.id}</p>
                        </td>
                        <td className="py-3.5 px-4">{s.course} ({s.year})</td>
                        <td className="py-3.5 px-4 text-slate-600">{s.college}</td>
                        <td className="py-3.5 px-4 text-center font-bold text-blue-600">{s.applications || 0}</td>
                        <td className="py-3.5 px-4 text-center font-black text-emerald-600">{s.selected || 0}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {s.internshipStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => navigate(`/faculty/students/${s.id}`)}
                            className="px-3 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 font-bold text-[11px] rounded-lg cursor-pointer"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredMentees.length > pageSize && (
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="text-slate-600 font-semibold">
                  Showing <strong>{(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredMentees.length)}</strong> of <strong>{filteredMentees.length}</strong> students
                </span>
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-xl border bg-white hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1 bg-white border rounded-xl font-bold text-indigo-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-xl border bg-white hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

// Full Faculty Student Detail Component
export const FacultyStudentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const student = generatedStudents.find((s) => s.id === id);

  // Mentor Notes State
  const [noteInput, setNoteInput] = useState('');
  const [notesList, setNotesList] = useState(student ? student.mentorNotes || [] : []);

  if (!student) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-2" />
        <h2 className="text-lg font-extrabold text-[#0f172a]">Student Record Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">Student ID #{id} does not exist in the faculty mentee ledger.</p>
        <button
          type="button"
          onClick={() => navigate('/faculty/students')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl cursor-pointer"
        >
          Back to My Mentees
        </button>
      </div>
    );
  }

  const studentApps = generatedApplications.filter((a) => a.studentId === student.id);
  const studentPlacement = generatedPlacements.find((p) => p.studentId === student.id);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;

    const newNoteObj = {
      id: `note-${Date.now()}`,
      note: noteInput.trim(),
      date: '20 Aug 2026',
      facultyName: 'Dr. Aristh (Faculty)',
    };

    const updated = [newNoteObj, ...notesList];
    setNotesList(updated);
    student.mentorNotes = updated;
    setNoteInput('');
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <FacultySidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <FacultyHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Mentee Profile Dossier"
          subtitle={`Student #${student.id} • ${student.name}`}
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-5xl w-full mx-auto pb-safe text-left">
          <button
            type="button"
            onClick={() => navigate('/faculty/students')}
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-indigo-600 cursor-pointer border-b border-slate-200 pb-3 w-full"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to My Mentees</span>
          </button>

          {/* Mentee Dossier Header */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-5 text-center sm:text-left">
                <div className="w-16 h-16 rounded-full bg-indigo-600 text-white font-black text-xl flex items-center justify-center shrink-0 border-2 border-indigo-400">
                  {student.avatarInitials}
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-[#0f172a]">{student.name}</h2>
                  <p className="text-xs text-slate-500 font-mono">Student ID: {student.id} • {student.email}</p>
                  <p className="text-xs text-slate-600 font-medium">{student.course} ({student.year}) • {student.college}</p>
                  <p className="text-xs font-bold text-indigo-600 mt-1">CGPA: {student.cgpa || '8.5 / 10.0'} • Phone: {student.phone || '+91 98765 43210'}</p>
                </div>
              </div>

              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-full">
                Status: {student.internshipStatus}
              </span>
            </div>

            {/* Skills Badges */}
            <div className="space-y-2">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase">Technical Skills & Competencies</h3>
              <div className="flex flex-wrap gap-1.5">
                {(student.skills || []).length === 0 ? (
                  <span className="text-xs text-slate-400 italic">No skills added</span>
                ) : (
                  student.skills?.map((sk) => (
                    <span key={sk} className="px-2.5 py-1 bg-slate-100 text-slate-700 border rounded-lg text-xs font-semibold">
                      {sk}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Visual Progress Timeline */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-extrabold text-[#0f172a]">Mentee Internship Progress Pipeline</h3>
              <div className="p-4 bg-slate-50 border rounded-2xl">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
                  {[
                    { title: 'Profile', active: true },
                    { title: 'Application', active: studentApps.length > 0 },
                    { title: 'Shortlisted', active: studentApps.some((a) => a.status === 'Shortlisted' || a.status === 'Interview' || a.status === 'Selected') },
                    { title: 'Interview', active: studentApps.some((a) => a.status === 'Interview' || a.status === 'Selected') },
                    { title: 'Selected', active: studentApps.some((a) => a.status === 'Selected') },
                    { title: 'Internship', active: studentPlacement !== undefined },
                    { title: 'Completed', active: studentPlacement?.status === 'Completed' },
                  ].map((step, idx) => (
                    <div key={step.title} className="flex items-center space-x-2">
                      <div className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold ${
                        step.active ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-white text-slate-400 border-slate-200'
                      }`}>
                        <span>{step.title}</span>
                        {step.active && <span className="ml-1">✓</span>}
                      </div>
                      {idx < 6 && <span className="text-slate-300">→</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Application History */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-extrabold text-[#0f172a]">Application History ({studentApps.length})</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b text-slate-600 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Internship Role</th>
                      <th className="py-3 px-4">Company</th>
                      <th className="py-3 px-4">Applied Date</th>
                      <th className="py-3 px-4 font-bold text-indigo-600">Match Score</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-medium text-slate-700">
                    {studentApps.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-slate-400">No applications filed yet.</td>
                      </tr>
                    ) : (
                      studentApps.map((a) => (
                        <tr key={a.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-bold text-[#0f172a]">{a.internshipTitle}</td>
                          <td className="py-3 px-4 text-slate-800">{a.companyName}</td>
                          <td className="py-3 px-4 text-slate-500">{a.appliedDate}</td>
                          <td className="py-3 px-4 font-bold text-indigo-600">{a.matchScore}%</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              {a.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => navigate(`/faculty/applications/${a.id}`)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 font-bold text-[11px] rounded-lg cursor-pointer"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Placement Information Card */}
            {studentPlacement ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2 text-xs text-emerald-900">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-emerald-950">Active Placement Confirmed</h4>
                    <p>Company: <strong>{studentPlacement.companyName}</strong> ({studentPlacement.internshipTitle})</p>
                    <p>Selection Date: <strong>{studentPlacement.selectionDate}</strong> • Joining Date: <strong>{studentPlacement.joiningDate}</strong></p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(`/tp/placements/${studentPlacement.id}`)}
                    className="px-3 py-1.5 bg-white border border-emerald-300 text-emerald-800 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    View Placement
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-500">
                No active placement confirmed for this mentee.
              </div>
            )}

            {/* Persistent Mentor Notes Section */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-extrabold text-[#0f172a]">Faculty Mentor Notes</h3>

              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add academic or career guidance note for this mentee..."
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-600"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl inline-flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Note</span>
                </button>
              </form>

              <div className="space-y-2 pt-1">
                {notesList.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No notes recorded yet.</p>
                ) : (
                  notesList.map((n) => (
                    <div key={n.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                        <span>{n.facultyName}</span>
                        <span>{n.date}</span>
                      </div>
                      <p className="text-slate-700 font-medium">{n.note}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
