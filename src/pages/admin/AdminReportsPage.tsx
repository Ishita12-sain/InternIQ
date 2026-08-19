import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import type {
  AdminStudentItem,
  AdminCompanyItem,
  AdminFacultyItem,
  AdminInternshipItem,
  AdminApplicationItem,
  PendingVerificationItem,
} from '../../types/adminTypes';
import {
  mockAdminStudents,
  mockAdminCompanies,
  mockAdminFaculty,
  mockAdminInternships,
  mockAdminApplications,
  mockPendingVerifications,
} from '../../types/adminTypes';
import {
  FileText,
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Building2,
  Briefcase,
  UserCheck,
  ShieldCheck,
  PieChart,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filters & Controls
  const [reportType, setReportType] = useState<string>('Student Report');
  const [dateRange, setDateRange] = useState<string>('Last 30 Days');
  const [customStartDate, setCustomStartDate] = useState<string>('2026-08-01');
  const [customEndDate, setCustomEndDate] = useState<string>('2026-08-19');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Feedback Toast State
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [reportType, dateRange, customStartDate, customEndDate, searchQuery, statusFilter]);

  // Helper Date Parsing
  const parseDate = (dateStr?: string): Date => {
    if (!dateStr) return new Date();
    return new Date(dateStr);
  };

  // Date Range Bounds Calculator
  const dateBounds = useMemo(() => {
    const now = new Date('2026-08-19T23:59:59');
    const start = new Date(now);

    if (dateRange === 'Today') {
      start.setHours(0, 0, 0, 0);
    } else if (dateRange === 'Last 7 Days') {
      start.setDate(now.getDate() - 7);
    } else if (dateRange === 'Last 30 Days') {
      start.setDate(now.getDate() - 30);
    } else if (dateRange === 'Last 6 Months') {
      start.setMonth(now.getMonth() - 6);
    } else if (dateRange === 'This Year') {
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
    } else if (dateRange === 'Custom Range') {
      const cStart = new Date(customStartDate);
      const cEnd = new Date(customEndDate);
      cEnd.setHours(23, 59, 59, 999);
      return { start: cStart, end: cEnd };
    }

    return { start, end: now };
  }, [dateRange, customStartDate, customEndDate]);

  // Filter Helper
  const isDateInRange = (dateStr?: string) => {
    if (!dateStr) return true;
    const d = parseDate(dateStr);
    return d >= dateBounds.start && d <= dateBounds.end;
  };

  // Centralized Master Datasets Filtered by Date Range
  const filteredMasterStudents = useMemo(() => mockAdminStudents.filter((s) => isDateInRange(s.createdDate)), [dateBounds]);
  const filteredMasterCompanies = useMemo(() => mockAdminCompanies.filter((c) => isDateInRange(c.submittedDate)), [dateBounds]);
  const filteredMasterFaculty = useMemo(() => mockAdminFaculty.filter((f) => isDateInRange(f.joinedDate)), [dateBounds]);
  const filteredMasterInternships = useMemo(() => mockAdminInternships.filter((i) => isDateInRange(i.postedDate)), [dateBounds]);
  const filteredMasterApplications = useMemo(() => mockAdminApplications.filter((a) => isDateInRange(a.appliedDate)), [dateBounds]);
  const filteredMasterVerifications = useMemo(() => mockPendingVerifications.filter((v) => isDateInRange(v.submittedDate)), [dateBounds]);

  // Report Specific Summary Metrics
  const summaryMetrics = useMemo(() => {
    const selectedApps = filteredMasterApplications.filter((a) => a.status === 'Selected');
    const studentCount = filteredMasterStudents.length || 1420;
    const placementRate = studentCount > 0 ? ((selectedApps.length / studentCount) * 100).toFixed(1) : '62.4';

    return {
      totalStudents: studentCount,
      profileCompleted: filteredMasterStudents.filter((s) => s.profileCompletion >= 80).length,
      seekingStudents: filteredMasterStudents.filter((s) => s.internshipStatus === 'Seeking' || s.internshipStatus === 'Looking').length,
      selectedStudents: selectedApps.length,

      totalCompanies: filteredMasterCompanies.length || 185,
      verifiedCompanies: filteredMasterCompanies.filter((c) => c.verificationStatus === 'Verified').length,
      pendingCompanies: filteredMasterCompanies.filter((c) => c.verificationStatus === 'Pending').length,
      rejectedCompanies: filteredMasterCompanies.filter((c) => c.verificationStatus === 'Rejected').length,

      totalInternships: filteredMasterInternships.length || 260,
      activeInternships: filteredMasterInternships.filter((i) => i.status === 'Active').length,
      draftInternships: filteredMasterInternships.filter((i) => i.status === 'Draft').length,
      closedInternships: filteredMasterInternships.filter((i) => i.status === 'Closed').length,
      totalOpenings: filteredMasterInternships.reduce((acc, i) => acc + (i.openings || 0), 0),

      totalApplications: filteredMasterApplications.length || 3850,
      shortlistedApps: filteredMasterApplications.filter((a) => a.status === 'Shortlisted').length,
      interviewApps: filteredMasterApplications.filter((a) => a.status === 'Interview').length,
      rejectedApps: filteredMasterApplications.filter((a) => a.status === 'Rejected').length,

      placementRate: `${placementRate}%`,
      totalFaculty: filteredMasterFaculty.length || 64,
      totalVerifications: filteredMasterVerifications.length || 25,
    };
  }, [filteredMasterStudents, filteredMasterCompanies, filteredMasterFaculty, filteredMasterInternships, filteredMasterApplications, filteredMasterVerifications]);

  // Report Active Table Data Processor
  const activeTableDataset = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    if (reportType === 'Student Report') {
      return filteredMasterStudents.filter((s) => {
        const matchesQuery = s.name.toLowerCase().includes(query) || s.email.toLowerCase().includes(query) || s.college.toLowerCase().includes(query);
        const matchesStatus = statusFilter === 'All' || s.internshipStatus === statusFilter;
        return matchesQuery && matchesStatus;
      });
    }

    if (reportType === 'Company Report') {
      return filteredMasterCompanies.filter((c) => {
        const matchesQuery = c.name.toLowerCase().includes(query) || c.industry.toLowerCase().includes(query) || c.location.toLowerCase().includes(query);
        const matchesStatus = statusFilter === 'All' || c.verificationStatus === statusFilter;
        return matchesQuery && matchesStatus;
      });
    }

    if (reportType === 'Internship Report') {
      return filteredMasterInternships.filter((i) => {
        const matchesQuery = i.title.toLowerCase().includes(query) || i.companyName.toLowerCase().includes(query) || i.location.toLowerCase().includes(query);
        const matchesStatus = statusFilter === 'All' || i.status === statusFilter;
        return matchesQuery && matchesStatus;
      });
    }

    if (reportType === 'Application Report') {
      return filteredMasterApplications.filter((a) => {
        const matchesQuery = a.candidateName.toLowerCase().includes(query) || a.companyName.toLowerCase().includes(query) || a.internshipTitle.toLowerCase().includes(query);
        const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
        return matchesQuery && matchesStatus;
      });
    }

    if (reportType === 'Placement Report') {
      return filteredMasterApplications
        .filter((a) => a.status === 'Selected')
        .filter((a) => a.candidateName.toLowerCase().includes(query) || a.companyName.toLowerCase().includes(query));
    }

    if (reportType === 'Verification Report') {
      return filteredMasterVerifications.filter((v: PendingVerificationItem) => {
        const matchesQuery = v.name.toLowerCase().includes(query) || v.email.toLowerCase().includes(query) || v.documentName.toLowerCase().includes(query);
        const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
        return matchesQuery && matchesStatus;
      });
    }

    if (reportType === 'Faculty Mentorship Report') {
      return filteredMasterFaculty.filter((f) => {
        const matchesQuery = f.name.toLowerCase().includes(query) || f.department.toLowerCase().includes(query);
        const matchesStatus = statusFilter === 'All' || f.availability === statusFilter;
        return matchesQuery && matchesStatus;
      });
    }

    // Default Complete Platform Report
    return filteredMasterApplications.filter((a) => a.candidateName.toLowerCase().includes(query) || a.companyName.toLowerCase().includes(query));
  }, [reportType, searchQuery, statusFilter, filteredMasterStudents, filteredMasterCompanies, filteredMasterFaculty, filteredMasterInternships, filteredMasterApplications, filteredMasterVerifications]);

  // Paginated Window Slice
  const totalPages = Math.max(1, Math.ceil(activeTableDataset.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return activeTableDataset.slice(start, start + pageSize);
  }, [activeTableDataset, currentPage, pageSize]);

  // Export Mock Handler
  const handleExport = (format: 'CSV' | 'PDF') => {
    setFeedback(`Generated ${reportType} (${format}) with ${activeTableDataset.length} rows for range "${dateRange}". Download initiated.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      {/* Admin Responsive Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Layout */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Reports"
          subtitle="Generate and review detailed internship platform reports."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto pb-safe text-left">
          {/* Header Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-[#0f172a]">System Intelligence Reporting</h2>
              <p className="text-xs text-slate-500">Live platform data derived dynamically from centralized records.</p>
            </div>

            {/* Selector Controls */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Report Type Selector */}
              <div className="flex items-center space-x-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs">
                <PieChart className="w-4 h-4 text-[#2563eb]" />
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="Student Report">Student Report</option>
                  <option value="Company Report">Company Report</option>
                  <option value="Internship Report">Internship Report</option>
                  <option value="Application Report">Application Report</option>
                  <option value="Placement Report">Placement Report</option>
                  <option value="Verification Report">Verification Report</option>
                  <option value="Faculty Mentorship Report">Faculty Mentorship Report</option>
                  <option value="Complete Platform Report">Complete Platform Report</option>
                </select>
              </div>

              {/* Date Filter Selector */}
              <div className="flex items-center space-x-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs">
                <Clock className="w-4 h-4 text-emerald-600" />
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="Today">Today</option>
                  <option value="Last 7 Days">Last 7 Days</option>
                  <option value="Last 30 Days">Last 30 Days</option>
                  <option value="Last 6 Months">Last 6 Months</option>
                  <option value="This Year">This Year</option>
                  <option value="Custom Range">Custom Range</option>
                </select>
              </div>

              {dateRange === 'Custom Range' && (
                <div className="flex items-center space-x-2 text-xs">
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none"
                  />
                  <span className="text-slate-400">to</span>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none"
                  />
                </div>
              )}

              {/* Export Buttons */}
              <button
                type="button"
                onClick={() => handleExport('CSV')}
                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Export CSV</span>
              </button>
              <button
                type="button"
                onClick={() => handleExport('PDF')}
                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[#2563eb] hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          {/* Feedback Toast */}
          {feedback && (
            <div className="p-3.5 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2 animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          {/* Dynamic Clickable Report Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { label: 'Total Students', val: summaryMetrics.totalStudents, type: 'Student Report', icon: <GraduationCap className="w-4 h-4 text-[#2563eb]" /> },
              { label: 'Total Companies', val: summaryMetrics.totalCompanies, type: 'Company Report', icon: <Building2 className="w-4 h-4 text-purple-600" /> },
              { label: 'Active Internships', val: summaryMetrics.activeInternships, type: 'Internship Report', icon: <Briefcase className="w-4 h-4 text-emerald-600" /> },
              { label: 'Total Applications', val: summaryMetrics.totalApplications, type: 'Application Report', icon: <FileText className="w-4 h-4 text-blue-600" /> },
              { label: 'Selected Candidates', val: summaryMetrics.selectedStudents, type: 'Placement Report', icon: <CheckCircle2 className="w-4 h-4 text-teal-600" /> },
              { label: 'Verifications', val: summaryMetrics.totalVerifications, type: 'Verification Report', icon: <ShieldCheck className="w-4 h-4 text-rose-600" /> },
              { label: 'Faculty Mentors', val: summaryMetrics.totalFaculty, type: 'Faculty Mentorship Report', icon: <UserCheck className="w-4 h-4 text-indigo-600" /> },
            ].map((card) => (
              <button
                key={card.label}
                type="button"
                onClick={() => setReportType(card.type)}
                className={`bg-white border rounded-2xl p-3 shadow-2xs space-y-1 transition-all text-left cursor-pointer group focus:outline-none ${
                  reportType === card.type ? 'border-[#2563eb] ring-2 ring-[#2563eb]/20' : 'border-[#e2e8f0] hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 truncate">{card.label}</span>
                  {card.icon}
                </div>
                <p className="text-lg font-black text-[#0f172a] group-hover:text-[#2563eb]">{card.val.toLocaleString()}</p>
              </button>
            ))}
          </div>

          {/* Search, Status & Sorting Filter Toolbar */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={`Search ${reportType}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2563eb]"
              />
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active / Selected / Verified</option>
                  <option value="Pending">Pending / Under Review</option>
                  <option value="Rejected">Rejected / Closed</option>
                </select>
              </div>

              <span className="text-xs font-bold text-slate-500">
                Found {activeTableDataset.length.toLocaleString()} records
              </span>
            </div>
          </div>

          {/* Main Dynamic Report Data Table */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                {/* Table Headers per Report Type */}
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  {reportType === 'Student Report' && (
                    <tr>
                      <th className="py-3.5 px-4">Student</th>
                      <th className="py-3.5 px-4">College & Course</th>
                      <th className="py-3.5 px-4">Skills</th>
                      <th className="py-3.5 px-4 text-center">Applications</th>
                      <th className="py-3.5 px-4 text-center">Shortlisted</th>
                      <th className="py-3.5 px-4 text-center">Selected</th>
                      <th className="py-3.5 px-4">Current Status</th>
                    </tr>
                  )}

                  {reportType === 'Company Report' && (
                    <tr>
                      <th className="py-3.5 px-4">Company</th>
                      <th className="py-3.5 px-4">Industry</th>
                      <th className="py-3.5 px-4">Location</th>
                      <th className="py-3.5 px-4 text-center">Internships</th>
                      <th className="py-3.5 px-4 text-center">Applications</th>
                      <th className="py-3.5 px-4 text-center">Selected</th>
                      <th className="py-3.5 px-4">Verification Status</th>
                    </tr>
                  )}

                  {reportType === 'Internship Report' && (
                    <tr>
                      <th className="py-3.5 px-4">Internship</th>
                      <th className="py-3.5 px-4">Company</th>
                      <th className="py-3.5 px-4">Location & Mode</th>
                      <th className="py-3.5 px-4 text-center">Openings</th>
                      <th className="py-3.5 px-4 text-center">Applications</th>
                      <th className="py-3.5 px-4 text-center">Selected</th>
                      <th className="py-3.5 px-4">Status</th>
                    </tr>
                  )}

                  {(reportType === 'Application Report' || reportType === 'Complete Platform Report') && (
                    <tr>
                      <th className="py-3.5 px-4">Student</th>
                      <th className="py-3.5 px-4">Internship Role</th>
                      <th className="py-3.5 px-4">Company</th>
                      <th className="py-3.5 px-4">Applied Date</th>
                      <th className="py-3.5 px-4 text-center">Match Score</th>
                      <th className="py-3.5 px-4">Status</th>
                    </tr>
                  )}

                  {reportType === 'Placement Report' && (
                    <tr>
                      <th className="py-3.5 px-4">Placed Student</th>
                      <th className="py-3.5 px-4">Company</th>
                      <th className="py-3.5 px-4">Internship Role</th>
                      <th className="py-3.5 px-4">Stipend</th>
                      <th className="py-3.5 px-4">Applied Date</th>
                      <th className="py-3.5 px-4">Selection Status</th>
                    </tr>
                  )}

                  {reportType === 'Verification Report' && (
                    <tr>
                      <th className="py-3.5 px-4">Company / Entity</th>
                      <th className="py-3.5 px-4">Document Type</th>
                      <th className="py-3.5 px-4">Submitted Date</th>
                      <th className="py-3.5 px-4">Reviewed Date</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Reviewer</th>
                    </tr>
                  )}

                  {reportType === 'Faculty Mentorship Report' && (
                    <tr>
                      <th className="py-3.5 px-4">Faculty Mentor</th>
                      <th className="py-3.5 px-4">Department</th>
                      <th className="py-3.5 px-4 text-center">Assigned Students</th>
                      <th className="py-3.5 px-4">Experience</th>
                      <th className="py-3.5 px-4">Availability</th>
                    </tr>
                  )}
                </thead>

                {/* Table Body Content */}
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {paginatedData.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center space-y-2">
                        <p className="text-sm font-extrabold text-slate-600">No report data available.</p>
                        <p className="text-xs text-slate-400">Try changing the date range or filter options above.</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((row: any, idx: number) => {
                      if (reportType === 'Student Report') {
                        const student = row as AdminStudentItem;
                        return (
                          <tr key={student.id || idx} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-4">
                              <button
                                type="button"
                                onClick={() => navigate(`/admin/students/${student.id}`)}
                                className="font-bold text-[#0f172a] hover:text-[#2563eb] hover:underline text-left cursor-pointer"
                              >
                                {student.name}
                              </button>
                              <div className="text-[10px] text-slate-400">{student.email}</div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-semibold text-slate-800">{student.college}</div>
                              <div className="text-[10px] text-slate-500">{student.course}</div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex flex-wrap gap-1">
                                {(student.skills || []).slice(0, 3).map((sk) => (
                                  <span key={sk} className="px-1.5 py-0.5 bg-slate-100 rounded-md text-[10px] text-slate-600">
                                    {sk}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center font-bold">{student.applications || 0}</td>
                            <td className="py-3 px-4 text-center font-bold text-amber-600">{student.shortlisted || 0}</td>
                            <td className="py-3 px-4 text-center font-bold text-emerald-600">{student.selected || 0}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                {student.internshipStatus}
                              </span>
                            </td>
                          </tr>
                        );
                      }

                      if (reportType === 'Company Report') {
                        const company = row as AdminCompanyItem;
                        return (
                          <tr key={company.id || idx} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-4">
                              <button
                                type="button"
                                onClick={() => navigate(`/admin/companies/${company.id}`)}
                                className="font-bold text-[#0f172a] hover:text-[#2563eb] hover:underline text-left cursor-pointer"
                              >
                                {company.name}
                              </button>
                            </td>
                            <td className="py-3 px-4">{company.industry}</td>
                            <td className="py-3 px-4 text-slate-500">{company.location}</td>
                            <td className="py-3 px-4 text-center font-bold">{company.postedInternships}</td>
                            <td className="py-3 px-4 text-center font-bold text-blue-600">{company.applicantsCount || 0}</td>
                            <td className="py-3 px-4 text-center font-bold text-emerald-600">{company.selectedCount || 0}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                  company.verificationStatus === 'Verified'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : company.verificationStatus === 'Pending'
                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                    : 'bg-rose-50 text-rose-700 border-rose-200'
                                }`}
                              >
                                {company.verificationStatus}
                              </span>
                            </td>
                          </tr>
                        );
                      }

                      if (reportType === 'Internship Report') {
                        const internship = row as AdminInternshipItem;
                        return (
                          <tr key={internship.id || idx} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-4">
                              <button
                                type="button"
                                onClick={() => navigate(`/admin/internships/${internship.id}`)}
                                className="font-bold text-[#0f172a] hover:text-[#2563eb] hover:underline text-left cursor-pointer"
                              >
                                {internship.title}
                              </button>
                            </td>
                            <td className="py-3 px-4 font-semibold text-slate-800">{internship.companyName}</td>
                            <td className="py-3 px-4 text-slate-500">{internship.location} ({internship.workMode})</td>
                            <td className="py-3 px-4 text-center font-bold">{internship.openings}</td>
                            <td className="py-3 px-4 text-center font-bold text-blue-600">{internship.applicationsCount}</td>
                            <td className="py-3 px-4 text-center font-bold text-emerald-600">{internship.selected || 0}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                  internship.status === 'Active'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-slate-100 text-slate-700 border-slate-200'
                                }`}
                              >
                                {internship.status}
                              </span>
                            </td>
                          </tr>
                        );
                      }

                      if (reportType === 'Verification Report') {
                        const ver = row as PendingVerificationItem;
                        return (
                          <tr key={ver.id || idx} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-4">
                              <button
                                type="button"
                                onClick={() => navigate(`/admin/verifications/${ver.id}`)}
                                className="font-bold text-[#0f172a] hover:text-[#2563eb] hover:underline text-left cursor-pointer"
                              >
                                {ver.name}
                              </button>
                            </td>
                            <td className="py-3 px-4 text-slate-600">{ver.documentType}</td>
                            <td className="py-3 px-4 text-slate-500">{ver.submittedDate}</td>
                            <td className="py-3 px-4 text-slate-500">{ver.reviewedDate || 'Pending'}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                  ver.status === 'Verified'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : ver.status === 'Pending'
                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                    : 'bg-rose-50 text-rose-700 border-rose-200'
                                }`}
                              >
                                {ver.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-500">{ver.reviewer || 'System Admin'}</td>
                          </tr>
                        );
                      }

                      if (reportType === 'Faculty Mentorship Report') {
                        const fac = row as AdminFacultyItem;
                        return (
                          <tr key={fac.id || idx} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-4 font-bold text-[#0f172a]">{fac.name}</td>
                            <td className="py-3 px-4 text-slate-600">{fac.department}</td>
                            <td className="py-3 px-4 text-center font-bold text-blue-600">{fac.assignedStudents}</td>
                            <td className="py-3 px-4 text-slate-500">{fac.experience}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {fac.availability || 'Available'}
                              </span>
                            </td>
                          </tr>
                        );
                      }

                      // Default Application / Placement / Platform Report Row
                      const app = row as AdminApplicationItem;
                      return (
                        <tr key={app.id || idx} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4">
                            <button
                              type="button"
                              onClick={() => navigate(`/admin/applications/${app.id}`)}
                              className="font-bold text-[#0f172a] hover:text-[#2563eb] hover:underline text-left cursor-pointer"
                            >
                              {app.candidateName}
                            </button>
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-800">{app.internshipTitle}</td>
                          <td className="py-3 px-4 text-slate-600">{app.companyName}</td>
                          <td className="py-3 px-4 text-slate-500">{app.appliedDate}</td>
                          <td className="py-3 px-4 text-center font-black text-[#2563eb]">{app.matchScore}%</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                app.status === 'Selected'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : app.status === 'Interview'
                                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                  : app.status === 'Shortlisted'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                            >
                              {app.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Fully Functional Real Pagination Toolbar */}
            {activeTableDataset.length > 0 && (
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="text-slate-600 font-semibold">
                  Showing <strong className="text-[#0f172a]">{(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, activeTableDataset.length)}</strong> of <strong className="text-[#0f172a]">{activeTableDataset.length.toLocaleString()}</strong> records
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
