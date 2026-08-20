import React, { useState, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { TPSidebar } from '../../components/tp/TPSidebar';
import { TPHeader } from '../../components/tp/TPHeader';
import {
  generatedApplications,
  generatedStudents,
  generatedCompanies,
  generatedInternships,
} from '../../types/masterDataset';
import type { AdminApplicationItem } from '../../types/adminTypes';
import {
  Search,
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle2,
  Calendar,
  Award,
  XCircle,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  FileCheck,
  Zap,
} from 'lucide-react';

export const TPApplicationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Read URL status param
  const rawStatusParam = searchParams.get('status');

  const normalizeStatus = (param: string | null): string => {
    if (!param) return 'All';
    const lower = param.toLowerCase();
    if (lower === 'new') return 'New';
    if (lower === 'under-review' || lower === 'under review') return 'Under Review';
    if (lower === 'shortlisted') return 'Shortlisted';
    if (lower === 'interview') return 'Interview';
    if (lower === 'selected') return 'Selected';
    if (lower === 'rejected') return 'Rejected';
    return 'All';
  };

  // Synchronize statusFilter when searchParams change
  React.useEffect(() => {
    const statusParam = searchParams.get('status');
    const newStatus = normalizeStatus(statusParam);
    setStatusFilter(newStatus);
    setCurrentPage(1);
  }, [searchParams]);

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(normalizeStatus(rawStatusParam));
  const [companyFilter, setCompanyFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [courseFilter, setCourseFilter] = useState('All');

  // Sorting & Pagination State
  const [sortField, setSortField] = useState<'candidateName' | 'internshipTitle' | 'companyName' | 'appliedDate' | 'matchScore' | 'status'>('appliedDate');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Header Summary Cards (Calculated dynamically from master dataset)
  const metrics = useMemo(() => {
    const total = generatedApplications.length; // 3,850
    const newCount = generatedApplications.filter((a) => a.status === 'New').length;
    const underReviewCount = generatedApplications.filter((a) => a.status === 'Under Review').length;
    const shortlistedCount = generatedApplications.filter((a) => a.status === 'Shortlisted').length;
    const interviewCount = generatedApplications.filter((a) => a.status === 'Interview').length;
    const selectedCount = generatedApplications.filter((a) => a.status === 'Selected').length;
    const rejectedCount = generatedApplications.filter((a) => a.status === 'Rejected').length;

    return {
      total,
      newCount,
      underReviewCount,
      shortlistedCount,
      interviewCount,
      selectedCount,
      rejectedCount,
    };
  }, []);

  // Filter & Sort Applications
  const filteredApplications = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    const result = generatedApplications.filter((a) => {
      // 1. Search across Student Name, Student ID, Company, Internship Title, App ID
      if (query) {
        const matchesStudent = a.candidateName.toLowerCase().includes(query);
        const matchesStudentId = a.studentId.toLowerCase().includes(query);
        const matchesCompany = a.companyName.toLowerCase().includes(query);
        const matchesTitle = a.internshipTitle.toLowerCase().includes(query);
        const matchesAppId = a.id.toLowerCase().includes(query);
        if (!matchesStudent && !matchesStudentId && !matchesCompany && !matchesTitle && !matchesAppId) {
          return false;
        }
      }

      // 2. Status Filter
      if (statusFilter !== 'All' && a.status !== statusFilter) {
        return false;
      }

      // 3. Company Filter
      if (companyFilter !== 'All' && a.companyName !== companyFilter) {
        return false;
      }

      // 4. Department / Course Filter
      if (deptFilter !== 'All' && a.course && !a.course.toLowerCase().includes(deptFilter.toLowerCase())) {
        return false;
      }
      if (courseFilter !== 'All' && a.course !== courseFilter) {
        return false;
      }

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
  }, [searchQuery, statusFilter, companyFilter, deptFilter, courseFilter, sortField, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filteredApplications.length / pageSize));
  const paginatedApps = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredApplications.slice(start, start + pageSize);
  }, [filteredApplications, currentPage, pageSize]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <TPSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <TPHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Applications"
          subtitle="Track student applications and manage the recruitment pipeline."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto pb-safe text-left">
          {/* Back Navigation & Clear Filter Bar */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <button
              type="button"
              onClick={() => {
                if (statusFilter !== 'All' || companyFilter !== 'All' || deptFilter !== 'All' || searchQuery !== '') {
                  setStatusFilter('All');
                  setCompanyFilter('All');
                  setDeptFilter('All');
                  setCourseFilter('All');
                  setSearchQuery('');
                  setCurrentPage(1);
                  navigate('/tp/applications');
                } else {
                  navigate('/tp/dashboard');
                }
              }}
              className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-[#2563eb] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>
                {statusFilter !== 'All' || companyFilter !== 'All' || deptFilter !== 'All' || searchQuery !== ''
                  ? 'Clear Active Filters'
                  : 'Back to Dashboard'}
              </span>
            </button>
          </div>

          {/* Active Status Banner */}
          {statusFilter !== 'All' && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#2563eb]" />
                <span className="font-bold text-[#0f172a]">
                  Active Filter: <strong className="text-[#2563eb]">Status = {statusFilter}</strong>
                </span>
              </div>
              <span className="font-extrabold text-[#2563eb] bg-white px-2.5 py-0.5 rounded-full border border-blue-200">
                {filteredApplications.length.toLocaleString()} Applications Found
              </span>
            </div>
          )}

          {/* 7 Clickable Summary Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {[
              { label: 'TOTAL', val: metrics.total, status: 'All', path: '/tp/applications', icon: <FileText className="w-3.5 h-3.5 text-[#2563eb]" /> },
              { label: 'NEW', val: metrics.newCount, status: 'New', path: '/tp/applications?status=new', icon: <Zap className="w-3.5 h-3.5 text-blue-500" /> },
              { label: 'REVIEW', val: metrics.underReviewCount, status: 'Under Review', path: '/tp/applications?status=under-review', icon: <Clock className="w-3.5 h-3.5 text-amber-500" /> },
              { label: 'SHORTLISTED', val: metrics.shortlistedCount, status: 'Shortlisted', path: '/tp/applications?status=shortlisted', icon: <FileCheck className="w-3.5 h-3.5 text-indigo-500" /> },
              { label: 'INTERVIEW', val: metrics.interviewCount, status: 'Interview', path: '/tp/applications?status=interview', icon: <Calendar className="w-3.5 h-3.5 text-purple-500" /> },
              { label: 'SELECTED', val: metrics.selectedCount, status: 'Selected', path: '/tp/applications?status=selected', icon: <Award className="w-3.5 h-3.5 text-emerald-600" /> },
              { label: 'REJECTED', val: metrics.rejectedCount, status: 'Rejected', path: '/tp/applications?status=rejected', icon: <XCircle className="w-3.5 h-3.5 text-rose-500" /> },
            ].map((c) => (
              <button
                key={c.label}
                type="button"
                onClick={() => {
                  setStatusFilter(c.status);
                  setCurrentPage(1);
                  navigate(c.path);
                }}
                className={`bg-white border rounded-2xl p-3 shadow-2xs hover:border-[#2563eb] hover:shadow-xs transition-all text-left cursor-pointer space-y-1 group ${
                  statusFilter === c.status ? 'border-[#2563eb] ring-2 ring-blue-500/10' : 'border-[#e2e8f0]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-extrabold tracking-wider text-slate-500 group-hover:text-[#2563eb] truncate">{c.label}</span>
                  {c.icon}
                </div>
                <p className="text-lg font-black text-[#0f172a] group-hover:text-[#2563eb]">{c.val.toLocaleString()}</p>
              </button>
            ))}
          </div>

          {/* Search & Toolbar */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs space-y-3">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search student, company, internship or application ID..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2563eb]"
              />
            </div>

            {/* Filter Dropdowns Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {/* Application Status */}
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">Status: All</option>
                <option value="New">New</option>
                <option value="Under Review">Under Review</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview">Interview</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>

              {/* Company Filter */}
              <select
                value={companyFilter}
                onChange={(e) => { setCompanyFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">Company: All</option>
                {Array.from(new Set(generatedApplications.slice(0, 50).map((a) => a.companyName))).map((cName) => (
                  <option key={cName} value={cName}>{cName}</option>
                ))}
              </select>

              {/* Department */}
              <select
                value={deptFilter}
                onChange={(e) => { setDeptFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">Dept: All</option>
                <option value="Computer Science">Computer Science</option>
                <option value="IT">Information Tech</option>
                <option value="Electronics">Electronics</option>
              </select>

              {/* Course */}
              <select
                value={courseFilter}
                onChange={(e) => { setCourseFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">Course: All</option>
                <option value="B.Tech Computer Science">B.Tech CS</option>
                <option value="B.Tech IT">B.Tech IT</option>
                <option value="B.Tech Software Engineering">B.Tech Software Eng</option>
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
                    <th className="py-3.5 px-4 font-mono">App ID</th>
                    <th className="py-3.5 px-4 cursor-pointer" onClick={() => handleSort('candidateName')}>
                      <div className="flex items-center space-x-1">
                        <span>Student</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 cursor-pointer" onClick={() => handleSort('internshipTitle')}>
                      <div className="flex items-center space-x-1">
                        <span>Internship Role</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 cursor-pointer" onClick={() => handleSort('companyName')}>
                      <div className="flex items-center space-x-1">
                        <span>Company</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 cursor-pointer" onClick={() => handleSort('appliedDate')}>
                      <div className="flex items-center space-x-1">
                        <span>Applied Date</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 text-center cursor-pointer" onClick={() => handleSort('matchScore')}>
                      <div className="flex items-center justify-center space-x-1">
                        <span>Match</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {paginatedApps.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center space-y-2">
                        <p className="text-sm font-extrabold text-slate-700">No applications found</p>
                        <p className="text-xs text-slate-400">Try changing your search or filters.</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedApps.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-500">{a.id}</td>
                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={() => navigate(`/tp/students/${a.studentId}`)}
                            className="font-extrabold text-[#0f172a] hover:text-[#2563eb] hover:underline text-left cursor-pointer"
                          >
                            {a.candidateName}
                          </button>
                          <p className="text-[10px] text-slate-400">ID: {a.studentId}</p>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          <button
                            type="button"
                            onClick={() => navigate(`/tp/internships/${a.internshipId}`)}
                            className="hover:text-[#2563eb] hover:underline cursor-pointer"
                          >
                            {a.internshipTitle}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          <button
                            type="button"
                            onClick={() => navigate(`/tp/companies/${a.companyId}`)}
                            className="hover:text-[#2563eb] hover:underline cursor-pointer"
                          >
                            {a.companyName}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">{a.appliedDate}</td>
                        <td className="py-3.5 px-4 text-center font-black text-[#2563eb]">{a.matchScore}%</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              a.status === 'Selected'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : a.status === 'Rejected'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : a.status === 'Interview'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : a.status === 'Shortlisted'
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}
                          >
                            {a.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => navigate(`/tp/applications/${a.id}`)}
                            className="px-3 py-1 bg-slate-100 hover:bg-blue-50 hover:text-[#2563eb] border border-slate-200 rounded-lg font-bold text-[11px] cursor-pointer transition-colors"
                          >
                            View Application
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
              {paginatedApps.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <p className="text-sm font-extrabold text-slate-700">No applications found</p>
                  <p className="text-xs text-slate-400">Try changing your search or filters.</p>
                </div>
              ) : (
                paginatedApps.map((a) => (
                  <div key={a.id} className="p-4 space-y-3 text-left">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[#2563eb] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                          {a.avatarInitials || 'ST'}
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={() => navigate(`/tp/students/${a.studentId}`)}
                            className="font-extrabold text-sm text-[#0f172a] hover:text-[#2563eb]"
                          >
                            {a.candidateName}
                          </button>
                          <p className="text-[10px] text-slate-400 font-mono">App ID: {a.id} • Student ID: {a.studentId}</p>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          a.status === 'Selected'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {a.status}
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-50 border border-slate-200/70 rounded-xl space-y-1 text-xs">
                      <p className="font-bold text-[#0f172a]">{a.internshipTitle}</p>
                      <p className="text-[11px] text-slate-500">{a.companyName} • Applied: {a.appliedDate}</p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="px-2 py-0.5 bg-blue-50 text-[#2563eb] font-extrabold text-[10px] rounded-md border border-blue-200">
                        {a.matchScore}% Overall Match
                      </span>
                      <button
                        type="button"
                        onClick={() => navigate(`/tp/applications/${a.id}`)}
                        className="px-3 py-1 bg-[#2563eb] text-white font-bold text-xs rounded-lg cursor-pointer"
                      >
                        View Application
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination Controls */}
            {filteredApplications.length > pageSize && (
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="text-slate-600 font-semibold">
                  Showing <strong className="text-[#0f172a]">{(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredApplications.length)}</strong> of <strong className="text-[#0f172a]">{filteredApplications.length.toLocaleString()}</strong> applications
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
    </div>
  );
};

// Full Application Details & Status Management Page Component
export const TPApplicationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Find exact application record from master dataset
  const app = generatedApplications.find((a) => a.id === id);

  // Dynamic state for real-time status updating across shared dataset
  const [currentStatus, setCurrentStatus] = useState<AdminApplicationItem['status']>(
    app ? app.status : 'New'
  );
  const [statusUpdatedMessage, setStatusUpdatedMessage] = useState(false);

  if (!app) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-2" />
        <h2 className="text-lg font-extrabold text-[#0f172a]">Application Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">The application ID #{id} does not exist in the master pipeline registry.</p>
        <button
          type="button"
          onClick={() => navigate('/tp/applications')}
          className="mt-4 px-4 py-2 bg-[#2563eb] text-white font-bold text-xs rounded-xl shadow-2xs hover:bg-blue-700 cursor-pointer"
        >
          Back to Applications
        </button>
      </div>
    );
  }

  // Cross-reference parent records
  const student = generatedStudents.find((s) => s.id === app.studentId) || {
    id: app.studentId,
    name: app.candidateName,
    email: app.studentEmail,
    course: app.course || 'B.Tech CS',
    year: app.year || '4th Year',
    college: app.college || 'IIT Bombay',
    skills: app.skills || ['React', 'TypeScript', 'Node.js'],
  };

  const company = generatedCompanies.find((c) => c.id === app.companyId) || {
    id: app.companyId,
    name: app.companyName,
    location: app.location || 'Bengaluru',
  };

  const internship = generatedInternships.find((i) => i.id === app.internshipId) || {
    id: app.internshipId,
    title: app.internshipTitle,
    stipend: app.stipend || '₹30,000 / month',
    duration: app.duration || '6 Months',
    workMode: app.workMode || 'Remote',
    skills: ['React', 'Node.js'],
  };

  // Status Change Handler (Modifies shared application object directly)
  const handleStatusChange = (newStatus: AdminApplicationItem['status']) => {
    app.status = newStatus;
    setCurrentStatus(newStatus);
    setStatusUpdatedMessage(true);
    setTimeout(() => setStatusUpdatedMessage(false), 3000);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <TPSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <TPHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Application Record"
          subtitle={`Application #${app.id} • ${app.candidateName}`}
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-5xl w-full mx-auto pb-safe text-left">
          {/* Back Navigation */}
          <button
            type="button"
            onClick={() => navigate('/tp/applications')}
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-[#2563eb] transition-colors cursor-pointer border-b border-slate-200 pb-3 w-full"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Applications</span>
          </button>

          {/* Success Banner */}
          {statusUpdatedMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-2 text-xs text-emerald-800 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Application status successfully updated to "{currentStatus}". Shared datasets synchronized.</span>
            </div>
          )}

          {/* Header Card */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Application ID: #{app.id}</span>
                <h2 className="text-xl font-extrabold text-[#0f172a]">{app.candidateName}</h2>
                <p className="text-xs text-slate-500">{app.internshipTitle} @ {app.companyName} • Applied: {app.appliedDate}</p>
              </div>

              {/* Status Update Control */}
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-500">Update Status:</span>
                <select
                  value={currentStatus}
                  onChange={(e) => handleStatusChange(e.target.value as any)}
                  className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-xl font-extrabold text-xs text-[#2563eb] focus:outline-none cursor-pointer"
                >
                  <option value="New">New</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview">Interview</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Candidate Summary Block */}
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-[#2563eb] text-white font-black text-sm flex items-center justify-center shrink-0">
                    {app.avatarInitials || 'ST'}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#0f172a]">{student.name}</h3>
                    <p className="text-xs text-slate-500 font-mono">ID: {student.id} • {student.email}</p>
                    <p className="text-xs text-slate-600 font-medium">{student.course} ({student.year}) • {student.college}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/tp/students/${student.id}`)}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:border-[#2563eb] hover:text-[#2563eb] font-bold text-xs rounded-xl shadow-2xs transition-colors cursor-pointer"
                >
                  View Student Profile
                </button>
              </div>
            </div>

            {/* Internship Information Block */}
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Target Internship Listing</span>
                  <h4 className="font-extrabold text-sm text-[#0f172a]">{internship.title}</h4>
                  <p className="text-xs text-slate-600 font-semibold">{company.name} • {internship.stipend}</p>
                  <p className="text-xs text-slate-500">{app.location || company.location} ({app.workMode || 'Remote'}) • Duration: {app.duration || '6 Months'}</p>
                </div>

                <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/tp/companies/${company.id}`)}
                    className="px-3 py-1 bg-white border border-slate-200 hover:text-[#2563eb] font-bold text-xs rounded-xl cursor-pointer"
                  >
                    View Company
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/tp/internships/${internship.id}`)}
                    className="px-3 py-1 bg-[#2563eb] text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    View Internship
                  </button>
                </div>
              </div>
            </div>

            {/* Match Score & Analysis */}
            <div className="space-y-3">
              <h3 className="text-sm font-extrabold text-[#0f172a]">Automated Match Analysis</h3>
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Overall Qualification Fit</span>
                  <span className="text-lg font-black text-[#2563eb]">{app.matchScore}% Match Score</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                  <div className="p-2.5 bg-white rounded-xl border">
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Skills Match</span>
                    <strong className="text-emerald-600 font-black">95%</strong>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border">
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Education Fit</span>
                    <strong className="text-emerald-600 font-black">100%</strong>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border">
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Experience Fit</span>
                    <strong className="text-blue-600 font-black">88%</strong>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border">
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Location Fit</span>
                    <strong className="text-emerald-600 font-black">90%</strong>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border">
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Eligibility</span>
                    <strong className="text-emerald-600 font-black">Verified ✓</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Recruitment Progression Timeline */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-extrabold text-[#0f172a]">Recruitment Progression Pipeline</h3>
              <div className="p-4 bg-slate-50 border rounded-2xl space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
                  {[
                    { title: 'Applied', date: app.appliedDate, active: true },
                    { title: 'Under Review', date: '05 Aug 2026', active: currentStatus !== 'New' },
                    { title: 'Shortlisted', date: '10 Aug 2026', active: ['Shortlisted', 'Interview', 'Selected'].includes(currentStatus) },
                    { title: 'Interview', date: '15 Aug 2026', active: ['Interview', 'Selected'].includes(currentStatus) },
                    { title: 'Selected', date: '18 Aug 2026', active: currentStatus === 'Selected' },
                  ].map((step, idx) => (
                    <div key={step.title} className="flex items-center space-x-2">
                      <div className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold ${
                        step.active ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-white text-slate-400 border-slate-200'
                      }`}>
                        <span>{step.title}</span>
                        {step.active && <span className="ml-1">✓</span>}
                      </div>
                      {idx < 4 && <span className="text-slate-300">→</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Interview Information (If scheduled) */}
            {(currentStatus === 'Interview' || currentStatus === 'Selected') && (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-purple-900 font-extrabold text-xs">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span>Scheduled Technical Interview</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(`/tp/interviews/int-1`)}
                    className="px-3 py-1 bg-purple-600 text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    View Interview Details
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-purple-900 font-medium">
                  <div>
                    <span className="text-[10px] text-purple-700 font-bold uppercase block">Date & Time</span>
                    <strong>22 Aug 2026 • 10:30 AM</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-700 font-bold uppercase block">Round</span>
                    <strong>Round 1 Technical</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-700 font-bold uppercase block">Mode</span>
                    <strong>Google Meet Video</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-700 font-bold uppercase block">Status</span>
                    <strong>Scheduled</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
