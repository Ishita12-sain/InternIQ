import React, { useState, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { TPSidebar } from '../../components/tp/TPSidebar';
import { TPHeader } from '../../components/tp/TPHeader';
import {
  generatedInterviews,
  generatedApplications,
  generatedStudents,
  generatedCompanies,
  generatedInternships,
} from '../../types/masterDataset';
import type { AdminInterviewItem } from '../../types/adminTypes';
import {
  Search,
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Video,
  Plus,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  Award,
} from 'lucide-react';

export const TPInterviewsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // URL Params
  const rawStatusParam = searchParams.get('status');
  const rawDateParam = searchParams.get('date');

  // Modals & Banners State
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Status Normalizer
  const normalizeStatus = (param: string | null): string => {
    if (!param) return 'All';
    const lower = param.toLowerCase();
    if (lower === 'upcoming') return 'Upcoming';
    if (lower === 'scheduled') return 'Scheduled';
    if (lower === 'completed') return 'Completed';
    if (lower === 'cancelled') return 'Cancelled';
    if (lower === 'rescheduled') return 'Rescheduled';
    return 'All';
  };

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(normalizeStatus(rawStatusParam));
  const [typeFilter, setTypeFilter] = useState('All');
  const [companyFilter, setCompanyFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState(rawDateParam === 'today' ? 'today' : 'All');

  // Sorting & Pagination State
  const [sortField, setSortField] = useState<'candidateName' | 'companyName' | 'date' | 'time' | 'type' | 'status'>('date');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // New Interview Form State
  const [newStudentId, setNewStudentId] = useState(generatedStudents[0]?.id || '');
  const [newInternshipId, setNewInternshipId] = useState(generatedInternships[0]?.id || '');
  const [newDate, setNewDate] = useState('2026-08-25');
  const [newTime, setNewTime] = useState('11:00 AM');
  const [newType, setNewType] = useState<'Technical' | 'HR' | 'Managerial' | 'Final' | 'Other'>('Technical');
  const [newRound, setNewRound] = useState('Round 1');
  const [newDuration] = useState('45 Mins');
  const [newLocation, setNewLocation] = useState('Google Meet Video Link');
  const [newNotes, setNewNotes] = useState('');

  // Summary Metrics calculated dynamically from generatedInterviews
  const metrics = useMemo(() => {
    const todayIso = '2026-08-20';
    const total = generatedInterviews.length;
    const upcoming = generatedInterviews.filter((i) => i.status === 'Upcoming' || i.status === 'Scheduled').length;
    const today = generatedInterviews.filter((i) => i.isoDate === todayIso).length;
    const completed = generatedInterviews.filter((i) => i.status === 'Completed').length;
    const cancelled = generatedInterviews.filter((i) => i.status === 'Cancelled').length;

    return { total, upcoming, today, completed, cancelled };
  }, []);

  // Filtered & Sorted Interviews
  const filteredInterviews = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const todayIso = '2026-08-20';

    const result = generatedInterviews.filter((i) => {
      // 1. Search Query (Student Name, Student ID, Company, Internship Title, Interview ID)
      if (query) {
        const matchesStudent = i.candidateName.toLowerCase().includes(query);
        const matchesStudentId = i.studentId.toLowerCase().includes(query);
        const matchesCompany = i.companyName.toLowerCase().includes(query);
        const matchesTitle = i.internshipTitle.toLowerCase().includes(query);
        const matchesId = i.id.toLowerCase().includes(query);
        if (!matchesStudent && !matchesStudentId && !matchesCompany && !matchesTitle && !matchesId) {
          return false;
        }
      }

      // 2. Status Filter
      if (statusFilter !== 'All') {
        if (statusFilter === 'Upcoming' && !(i.status === 'Upcoming' || i.status === 'Scheduled')) return false;
        if (statusFilter !== 'Upcoming' && i.status !== statusFilter) return false;
      }

      // 3. Type Filter
      if (typeFilter !== 'All' && i.type !== typeFilter) return false;

      // 4. Company Filter
      if (companyFilter !== 'All' && i.companyName !== companyFilter) return false;

      // 5. Date Filter ('today')
      if (dateFilter === 'today' && i.isoDate !== todayIso) return false;

      return true;
    });

    // Sorting
    return result.sort((a, b) => {
      let valA: any = a[sortField] || '';
      let valB: any = b[sortField] || '';

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [searchQuery, statusFilter, typeFilter, companyFilter, dateFilter, sortField, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filteredInterviews.length / pageSize));
  const paginatedInterviews = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredInterviews.slice(start, start + pageSize);
  }, [filteredInterviews, currentPage, pageSize]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Schedule Interview Submission Handler
  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const student = generatedStudents.find((s) => s.id === newStudentId) || generatedStudents[0];
    const internship = generatedInternships.find((i) => i.id === newInternshipId) || generatedInternships[0];
    const company = generatedCompanies.find((c) => c.id === internship.companyId) || generatedCompanies[0];

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const parts = newDate.split('-');
    const displayDate = `${parts[2]} ${months[parseInt(parts[1], 10) - 1]} ${parts[0]}`;

    const newInterviewItem: AdminInterviewItem = {
      id: `iv-${generatedInterviews.length + 1}`,
      applicationId: `app-${generatedApplications.length + 1}`,
      studentId: student.id,
      candidateName: student.name,
      studentEmail: student.email,
      avatarInitials: student.avatarInitials,
      companyId: company.id,
      companyName: company.name,
      companyLogo: company.avatarInitials,
      internshipId: internship.id,
      internshipTitle: internship.title,
      date: displayDate,
      isoDate: newDate,
      time: newTime,
      duration: newDuration,
      type: newType,
      round: newRound,
      status: 'Scheduled',
      location: newLocation,
      meetingLink: 'https://meet.google.com/new-drive-session',
      notes: newNotes,
      history: [{ action: 'Scheduled', date: displayDate, time: newTime, note: 'New interview scheduled by T&P Cell.' }],
    };

    generatedInterviews.unshift(newInterviewItem);
    setIsScheduleModalOpen(false);
    triggerToast(`Interview successfully scheduled for ${student.name}.`);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <TPSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <TPHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Interviews"
          subtitle="Manage candidate interviews, schedules and interview outcomes."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto pb-safe text-left">
          {/* Back Navigation Bar */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <button
              type="button"
              onClick={() => {
                if (statusFilter !== 'All' || dateFilter !== 'All' || searchQuery !== '') {
                  setStatusFilter('All');
                  setDateFilter('All');
                  setTypeFilter('All');
                  setCompanyFilter('All');
                  setSearchQuery('');
                  setCurrentPage(1);
                  navigate('/tp/interviews');
                } else {
                  navigate('/tp/dashboard');
                }
              }}
              className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-[#2563eb] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>
                {statusFilter !== 'All' || dateFilter !== 'All' || searchQuery !== ''
                  ? 'Clear Active Filters'
                  : 'Back to Dashboard'}
              </span>
            </button>

            {/* Schedule Interview Button */}
            <button
              type="button"
              onClick={() => setIsScheduleModalOpen(true)}
              className="px-4 py-2 bg-[#2563eb] hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-2xs inline-flex items-center space-x-1.5 cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Interview</span>
            </button>
          </div>

          {/* Toast Notification */}
          {toastMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMsg}</span>
            </div>
          )}

          {/* Active Filter Notification Banner */}
          {(statusFilter !== 'All' || dateFilter !== 'All') && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#2563eb]" />
                <span className="font-bold text-[#0f172a]">
                  Active Filter:{' '}
                  {statusFilter !== 'All' && <strong className="text-[#2563eb]">Status = {statusFilter} </strong>}
                  {dateFilter === 'today' && <strong className="text-[#2563eb]">Date = Today (20 Aug 2026)</strong>}
                </span>
              </div>
              <span className="font-extrabold text-[#2563eb] bg-white px-2.5 py-0.5 rounded-full border border-blue-200">
                {filteredInterviews.length.toLocaleString()} Matching Sessions
              </span>
            </div>
          )}

          {/* 5 Clickable Summary Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: 'TOTAL INTERVIEWS', val: metrics.total, path: '/tp/interviews', icon: <Calendar className="w-4 h-4 text-[#2563eb]" /> },
              { label: 'UPCOMING', val: metrics.upcoming, path: '/tp/interviews?status=upcoming', icon: <Clock className="w-4 h-4 text-amber-500" /> },
              { label: 'TODAY', val: metrics.today, path: '/tp/interviews?date=today', icon: <Video className="w-4 h-4 text-blue-600" /> },
              { label: 'COMPLETED', val: metrics.completed, path: '/tp/interviews?status=completed', icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" /> },
              { label: 'CANCELLED', val: metrics.cancelled, path: '/tp/interviews?status=cancelled', icon: <XCircle className="w-4 h-4 text-rose-500" /> },
            ].map((c) => (
              <button
                key={c.label}
                type="button"
                onClick={() => {
                  if (c.path.includes('date=today')) {
                    setDateFilter('today');
                    setStatusFilter('All');
                  } else if (c.path.includes('status=upcoming')) {
                    setStatusFilter('Upcoming');
                    setDateFilter('All');
                  } else if (c.path.includes('status=completed')) {
                    setStatusFilter('Completed');
                    setDateFilter('All');
                  } else if (c.path.includes('status=cancelled')) {
                    setStatusFilter('Cancelled');
                    setDateFilter('All');
                  } else {
                    setStatusFilter('All');
                    setDateFilter('All');
                  }
                  setCurrentPage(1);
                  navigate(c.path);
                }}
                className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs hover:border-[#2563eb] hover:shadow-xs hover:-translate-y-0.5 transition-all text-left cursor-pointer space-y-1 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold tracking-wider text-slate-500 group-hover:text-[#2563eb] truncate">{c.label}</span>
                  {c.icon}
                </div>
                <p className="text-xl font-black text-[#0f172a] group-hover:text-[#2563eb]">{c.val.toLocaleString()}</p>
              </button>
            ))}
          </div>

          {/* Search & Toolbar */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs space-y-3">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search student, company or internship..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2563eb]"
              />
            </div>

            {/* Filter Dropdowns Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {/* Status */}
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">Status: All</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Rescheduled">Rescheduled</option>
              </select>

              {/* Interview Type */}
              <select
                value={typeFilter}
                onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">Type: All</option>
                <option value="Technical">Technical</option>
                <option value="HR">HR</option>
                <option value="Managerial">Managerial</option>
                <option value="Final">Final</option>
                <option value="Other">Other</option>
              </select>

              {/* Date Filter */}
              <select
                value={dateFilter}
                onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">Date: All</option>
                <option value="today">Today (20 Aug 2026)</option>
              </select>

              {/* Company Filter */}
              <select
                value={companyFilter}
                onChange={(e) => { setCompanyFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">Company: All</option>
                {Array.from(new Set(generatedInterviews.slice(0, 30).map((i) => i.companyName))).map((cName) => (
                  <option key={cName} value={cName}>{cName}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl shadow-2xs overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4 font-mono">Interview ID</th>
                    <th className="py-3.5 px-4 cursor-pointer" onClick={() => handleSort('candidateName')}>
                      <div className="flex items-center space-x-1">
                        <span>Student</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4">Internship Role</th>
                    <th className="py-3.5 px-4 cursor-pointer" onClick={() => handleSort('companyName')}>
                      <div className="flex items-center space-x-1">
                        <span>Company</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 cursor-pointer" onClick={() => handleSort('date')}>
                      <div className="flex items-center space-x-1">
                        <span>Date & Time</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4">Round & Type</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {paginatedInterviews.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center space-y-2">
                        <p className="text-sm font-extrabold text-slate-700">No interviews found</p>
                        <p className="text-xs text-slate-400">Try changing your search or filters.</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedInterviews.map((iv) => (
                      <tr key={iv.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-500">{iv.id}</td>
                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={() => navigate(`/tp/students/${iv.studentId}`)}
                            className="font-extrabold text-[#0f172a] hover:text-[#2563eb] hover:underline text-left cursor-pointer"
                          >
                            {iv.candidateName}
                          </button>
                          <p className="text-[10px] text-slate-400">ID: {iv.studentId}</p>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          <button
                            type="button"
                            onClick={() => navigate(`/tp/internships/${iv.internshipId}`)}
                            className="hover:text-[#2563eb] hover:underline cursor-pointer"
                          >
                            {iv.internshipTitle}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          <button
                            type="button"
                            onClick={() => navigate(`/tp/companies/${iv.companyId}`)}
                            className="hover:text-[#2563eb] hover:underline cursor-pointer"
                          >
                            {iv.companyName}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          {iv.date} • {iv.time}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded text-[10px] font-bold">
                            {iv.type} ({iv.round})
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              iv.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : iv.status === 'Cancelled'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : iv.status === 'Rescheduled'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            {iv.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => navigate(`/tp/interviews/${iv.id}`)}
                            className="px-3 py-1 bg-slate-100 hover:bg-blue-50 hover:text-[#2563eb] border border-slate-200 rounded-lg font-bold text-[11px] cursor-pointer transition-colors"
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

            {/* Mobile Responsive Cards (<= 768px) */}
            <div className="md:hidden divide-y divide-slate-100">
              {paginatedInterviews.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <p className="text-sm font-extrabold text-slate-700">No interviews found</p>
                  <p className="text-xs text-slate-400">Try changing your search or filters.</p>
                </div>
              ) : (
                paginatedInterviews.map((iv) => (
                  <div key={iv.id} className="p-4 space-y-3 text-left">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[#2563eb] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                          {iv.avatarInitials}
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={() => navigate(`/tp/students/${iv.studentId}`)}
                            className="font-extrabold text-sm text-[#0f172a] hover:text-[#2563eb]"
                          >
                            {iv.candidateName}
                          </button>
                          <p className="text-[10px] text-slate-400 font-mono">IV ID: {iv.id} • Student ID: {iv.studentId}</p>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          iv.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {iv.status}
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-50 border border-slate-200/70 rounded-xl space-y-1 text-xs">
                      <p className="font-bold text-[#0f172a]">{iv.internshipTitle}</p>
                      <p className="text-[11px] text-slate-500">{iv.companyName}</p>
                      <p className="text-[11px] font-semibold text-[#2563eb]">{iv.date} at {iv.time}</p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-extrabold text-[10px] rounded-md border border-indigo-200">
                        {iv.type} ({iv.round})
                      </span>
                      <button
                        type="button"
                        onClick={() => navigate(`/tp/interviews/${iv.id}`)}
                        className="px-3 py-1 bg-[#2563eb] text-white font-bold text-xs rounded-lg cursor-pointer"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination Controls */}
            {filteredInterviews.length > pageSize && (
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="text-slate-600 font-semibold">
                  Showing <strong className="text-[#0f172a]">{(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredInterviews.length)}</strong> of <strong className="text-[#0f172a]">{filteredInterviews.length.toLocaleString()}</strong> interviews
                </span>

                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="px-3 py-1 bg-white border border-slate-200 rounded-xl font-bold text-[#2563eb]">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Schedule Interview Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-extrabold text-[#0f172a]">Schedule New Candidate Interview</h3>
              <button type="button" onClick={() => setIsScheduleModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Candidate Student *</label>
                <select
                  value={newStudentId}
                  onChange={(e) => setNewStudentId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-medium focus:outline-none"
                  required
                >
                  {generatedStudents.slice(0, 30).map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.course})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Internship & Company *</label>
                <select
                  value={newInternshipId}
                  onChange={(e) => setNewInternshipId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-medium focus:outline-none"
                  required
                >
                  {generatedInternships.slice(0, 30).map((i) => (
                    <option key={i.id} value={i.id}>{i.title} @ {i.companyName}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-medium focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time *</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-medium focus:outline-none"
                    placeholder="10:30 AM"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Interview Type *</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-medium focus:outline-none"
                    required
                  >
                    <option value="Technical">Technical</option>
                    <option value="HR">HR</option>
                    <option value="Managerial">Managerial</option>
                    <option value="Final">Final</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Round & Duration</label>
                  <input
                    type="text"
                    value={`${newRound} • ${newDuration}`}
                    onChange={(e) => setNewRound(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Location / Meeting Link</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notes for Candidate</label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-medium focus:outline-none"
                  placeholder="Additional instructions..."
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2563eb] text-white font-bold rounded-xl hover:bg-blue-700 cursor-pointer"
                >
                  Schedule Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Full Interview Details & Action Management Component
export const TPInterviewDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Lookup interview from master collection
  const interview = generatedInterviews.find((i) => i.id === id);

  // Interactive Management States
  const [currentStatus, setCurrentStatus] = useState(interview?.status || 'Scheduled');
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isOutcomeOpen, setIsOutcomeOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [actionToast, setActionToast] = useState<string | null>(null);

  // Action Form States
  const [rescheduleDate, setRescheduleDate] = useState('2026-08-26');
  const [rescheduleTime, setRescheduleTime] = useState('03:00 PM');
  const [outcomeVal, setOutcomeVal] = useState<'Selected' | 'Rejected' | 'Further Round' | 'On Hold'>('Selected');
  const [outcomeNotesVal, setOutcomeNotesVal] = useState('Candidate demonstrated exceptional technical prowess.');
  const [cancelReasonVal, setCancelReasonVal] = useState('Recruiter conflict with corporate board meeting.');

  if (!interview) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-2" />
        <h2 className="text-lg font-extrabold text-[#0f172a]">Interview Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">The interview session ID #{id} does not exist in the master schedule.</p>
        <button
          type="button"
          onClick={() => navigate('/tp/interviews')}
          className="mt-4 px-4 py-2 bg-[#2563eb] text-white font-bold text-xs rounded-xl shadow-2xs hover:bg-blue-700 cursor-pointer"
        >
          Back to Interviews
        </button>
      </div>
    );
  }

  // Cross-reference parent records
  const student = generatedStudents.find((s) => s.id === interview.studentId) || {
    id: interview.studentId,
    name: interview.candidateName,
    email: interview.studentEmail,
    course: 'B.Tech CS',
    year: '4th Year',
    department: 'Computer Science',
    skills: ['React', 'TypeScript', 'Node.js'],
  };

  const company = generatedCompanies.find((c) => c.id === interview.companyId) || {
    id: interview.companyId,
    name: interview.companyName,
    industry: 'Software & IT',
    location: 'Bengaluru',
    email: 'recruiter@company.com',
  };

  const internship = generatedInternships.find((i) => i.id === interview.internshipId) || {
    id: interview.internshipId,
    title: interview.internshipTitle,
    location: 'Remote',
    workMode: 'Remote',
    duration: '6 Months',
    stipend: '₹35,000 / month',
  };

  const app = generatedApplications.find((a) => a.id === interview.applicationId) || {
    id: interview.applicationId,
    appliedDate: '05 Aug 2026',
    matchScore: 94,
    status: 'Interview',
  };

  const triggerToast = (msg: string) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(null), 3500);
  };

  // Action Submit Handlers
  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    interview.status = 'Rescheduled';
    interview.date = rescheduleDate;
    interview.time = rescheduleTime;
    interview.history?.unshift({ action: 'Rescheduled', date: rescheduleDate, time: rescheduleTime, note: 'Session rescheduled by T&P Officer.' });
    setCurrentStatus('Rescheduled');
    setIsRescheduleOpen(false);
    triggerToast('Interview rescheduled successfully. Master timeline updated.');
  };

  const handleOutcomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    interview.status = 'Completed';
    interview.outcome = outcomeVal;
    interview.outcomeNotes = outcomeNotesVal;
    if (outcomeVal === 'Selected') {
      app.status = 'Selected';
    } else if (outcomeVal === 'Rejected') {
      app.status = 'Rejected';
    }
    interview.history?.unshift({ action: 'Completed', date: interview.date, time: '11:30 AM', note: `Outcome: ${outcomeVal} - ${outcomeNotesVal}` });
    setCurrentStatus('Completed');
    setIsOutcomeOpen(false);
    triggerToast(`Interview marked as Completed. Application status updated to "${app.status}".`);
  };

  const handleCancelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    interview.status = 'Cancelled';
    interview.cancellationReason = cancelReasonVal;
    interview.history?.unshift({ action: 'Cancelled', date: interview.date, time: '04:00 PM', note: `Reason: ${cancelReasonVal}` });
    setCurrentStatus('Cancelled');
    setIsCancelOpen(false);
    triggerToast('Interview marked as Cancelled. Session preserved in record log.');
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <TPSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <TPHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Interview Session Details"
          subtitle={`Session #${interview.id} • ${interview.candidateName}`}
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-5xl w-full mx-auto pb-safe text-left">
          {/* Back Navigation */}
          <button
            type="button"
            onClick={() => navigate('/tp/interviews')}
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-[#2563eb] transition-colors cursor-pointer border-b border-slate-200 pb-3 w-full"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Interviews</span>
          </button>

          {/* Action Toast Banner */}
          {actionToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{actionToast}</span>
            </div>
          )}

          {/* Details Header & Controls */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Interview ID: #{interview.id}</span>
                <h2 className="text-xl font-extrabold text-[#0f172a]">{interview.type} ({interview.round})</h2>
                <p className="text-xs text-slate-500">{interview.date} at {interview.time} • Duration: {interview.duration}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      currentStatus === 'Completed'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : currentStatus === 'Cancelled'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {currentStatus}
                  </span>
                  {interview.outcome && (
                    <span className="px-2.5 py-0.5 bg-emerald-600 text-white rounded-full text-[10px] font-extrabold">
                      Outcome: {interview.outcome}
                    </span>
                  )}
                </div>
              </div>

              {/* Management Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsRescheduleOpen(true)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl inline-flex items-center space-x-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Reschedule</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsOutcomeOpen(true)}
                  className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl inline-flex items-center space-x-1 cursor-pointer border border-emerald-200"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Mark Outcome</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsCancelOpen(true)}
                  className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl inline-flex items-center space-x-1 cursor-pointer border border-rose-200"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Cancel Session</span>
                </button>
              </div>
            </div>

            {/* Candidate Student Information */}
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-[#2563eb] text-white font-black text-sm flex items-center justify-center shrink-0">
                    {interview.avatarInitials}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#0f172a]">{student.name}</h3>
                    <p className="text-xs text-slate-500 font-mono">ID: {student.id} • {student.email}</p>
                    <p className="text-xs text-slate-600 font-medium">{student.course} ({student.year})</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/tp/students/${student.id}`)}
                  className="px-3 py-1.5 bg-white border rounded-xl hover:text-[#2563eb] font-bold text-xs cursor-pointer"
                >
                  View Student
                </button>
              </div>
            </div>

            {/* Company Information */}
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Hiring Corporate Partner</span>
                  <h4 className="font-extrabold text-sm text-[#0f172a]">{company.name}</h4>
                  <p className="text-xs text-slate-600">{company.industry} • {company.location}</p>
                  <p className="text-xs text-slate-500">Recruiter: {company.email}</p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/tp/companies/${company.id}`)}
                  className="px-3 py-1.5 bg-white border rounded-xl hover:text-[#2563eb] font-bold text-xs cursor-pointer"
                >
                  View Company
                </button>
              </div>
            </div>

            {/* Internship Information */}
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Target Internship</span>
                  <h4 className="font-extrabold text-sm text-[#0f172a]">{internship.title}</h4>
                  <p className="text-xs text-slate-600">{internship.stipend} • Duration: {internship.duration}</p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/tp/internships/${internship.id}`)}
                  className="px-3 py-1.5 bg-white border rounded-xl hover:text-[#2563eb] font-bold text-xs cursor-pointer"
                >
                  View Internship
                </button>
              </div>
            </div>

            {/* Application Information */}
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Linked Candidate Application</span>
                  <h4 className="font-extrabold text-sm text-[#0f172a]">Application #{app.id}</h4>
                  <p className="text-xs text-slate-600">Applied: {app.appliedDate} • Match Score: <strong className="text-[#2563eb]">{app.matchScore}%</strong></p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/tp/applications/${app.id}`)}
                  className="px-3 py-1.5 bg-white border rounded-xl hover:text-[#2563eb] font-bold text-xs cursor-pointer"
                >
                  View Application
                </button>
              </div>
            </div>

            {/* Interview Progression Timeline */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-extrabold text-[#0f172a]">Interview Timeline & History</h3>
              <div className="p-4 bg-slate-50 border rounded-2xl space-y-2 text-xs">
                {(interview.history || []).map((h: any, idx: number) => (
                  <div key={idx} className="flex items-start justify-between p-2.5 bg-white border rounded-xl">
                    <div>
                      <p className="font-bold text-[#0f172a]">{h.action}</p>
                      <p className="text-[11px] text-slate-500">{h.note}</p>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400">{h.date} {h.time || ''}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Reschedule Modal */}
      {isRescheduleOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left">
            <h3 className="text-base font-extrabold text-[#0f172a]">Reschedule Interview</h3>
            <form onSubmit={handleRescheduleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">New Date *</label>
                <input
                  type="text"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-medium focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">New Time *</label>
                <input
                  type="text"
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-medium focus:outline-none"
                  required
                />
              </div>
              <div className="flex items-center justify-end space-x-2 pt-2 border-t">
                <button type="button" onClick={() => setIsRescheduleOpen(false)} className="px-4 py-2 bg-slate-100 font-bold rounded-xl">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#2563eb] text-white font-bold rounded-xl">Save Reschedule</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Outcome Modal */}
      {isOutcomeOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left">
            <h3 className="text-base font-extrabold text-[#0f172a]">Mark Interview Outcome</h3>
            <form onSubmit={handleOutcomeSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Interview Outcome *</label>
                <select
                  value={outcomeVal}
                  onChange={(e) => setOutcomeVal(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-bold focus:outline-none"
                >
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Further Round">Further Round</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Outcome Notes</label>
                <textarea
                  value={outcomeNotesVal}
                  onChange={(e) => setOutcomeNotesVal(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-medium focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-end space-x-2 pt-2 border-t">
                <button type="button" onClick={() => setIsOutcomeOpen(false)} className="px-4 py-2 bg-slate-100 font-bold rounded-xl">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl">Save Outcome</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {isCancelOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left">
            <h3 className="text-base font-extrabold text-[#0f172a]">Cancel Interview Session</h3>
            <form onSubmit={handleCancelSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason for Cancellation *</label>
                <textarea
                  value={cancelReasonVal}
                  onChange={(e) => setCancelReasonVal(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-medium focus:outline-none"
                  required
                />
              </div>
              <div className="flex items-center justify-end space-x-2 pt-2 border-t">
                <button type="button" onClick={() => setIsCancelOpen(false)} className="px-4 py-2 bg-slate-100 font-bold rounded-xl">Back</button>
                <button type="submit" className="px-4 py-2 bg-rose-600 text-white font-bold rounded-xl">Confirm Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
