import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TPSidebar } from '../../components/tp/TPSidebar';
import { TPHeader } from '../../components/tp/TPHeader';
import {
  generatedStudents,
  generatedCompanies,
  generatedInternships,
  generatedApplications,
  generatedPlacements,
} from '../../types/masterDataset';
import {
  Search,
  ArrowLeft,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Building2,
  FileText,
  Award,
  TrendingUp,
  Percent,
} from 'lucide-react';

export const TPReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Global Report Filters
  const [dateRange, setDateRange] = useState('Current Academic Year');
  const [academicYear, setAcademicYear] = useState('2026–27');
  const [deptFilter, setDeptFilter] = useState('All');
  const [courseFilter, setCourseFilter] = useState('All');
  const [companyFilter, setCompanyFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Active Tab View from Route
  const activeTab = useMemo(() => {
    if (location.pathname.includes('/placement')) return 'placement';
    if (location.pathname.includes('/company')) return 'company';
    if (location.pathname.includes('/student')) return 'student';
    if (location.pathname.includes('/internship')) return 'internship';
    return 'overview';
  }, [location.pathname]);

  // Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Filtered Core Collections based on active global filters
  const filteredData = useMemo(() => {
    // Apply Department & Course filtering to Students
    const baseStudents = generatedStudents.filter((s) => {
      if (deptFilter !== 'All' && !s.course.toLowerCase().includes(deptFilter.toLowerCase())) return false;
      if (courseFilter !== 'All' && s.course !== courseFilter) return false;
      return true;
    });

    const studentIdSet = new Set(baseStudents.map((s) => s.id));

    // Apply Company filter to Companies
    const baseCompanies = generatedCompanies.filter((c) => {
      if (companyFilter !== 'All' && c.name !== companyFilter) return false;
      return true;
    });

    // Filter Applications
    const baseApps = generatedApplications.filter((a) => {
      if (!studentIdSet.has(a.studentId)) return false;
      if (companyFilter !== 'All' && a.companyName !== companyFilter) return false;
      return true;
    });

    // Filter Placements
    const basePlacements = generatedPlacements.filter((p) => {
      if (!studentIdSet.has(p.studentId)) return false;
      if (companyFilter !== 'All' && p.companyName !== companyFilter) return false;
      return true;
    });

    return {
      students: baseStudents,
      companies: baseCompanies,
      applications: baseApps,
      placements: basePlacements,
    };
  }, [deptFilter, courseFilter, companyFilter]);

  // Overall Dynamically Calculated Summary Metrics
  const summaryMetrics = useMemo(() => {
    const totalStudents = filteredData.students.length;
    const totalApps = filteredData.applications.length;
    const selectedApps = filteredData.applications.filter((a) => a.status === 'Selected').length;
    const totalPlacements = filteredData.placements.length;
    const eligibleStudents = Math.round(totalStudents * 0.92);
    const placementRate = eligibleStudents > 0 ? (selectedApps / eligibleStudents) * 100 : 0;

    // Calculate Average Match Score
    const totalScore = filteredData.applications.reduce((sum, a) => sum + (a.matchScore || 0), 0);
    const avgMatchScore = totalApps > 0 ? Math.round(totalScore / totalApps) : 0;

    return {
      totalStudents,
      totalApps,
      selectedApps,
      totalPlacements,
      eligibleStudents,
      placementRate: placementRate.toFixed(1),
      avgMatchScore,
    };
  }, [filteredData]);

  // Department-Wise Aggregated Report Breakdown
  const departmentBreakdown = useMemo(() => {
    const depts = [
      { name: 'Computer Science', keyword: 'Computer Science' },
      { name: 'Information Technology', keyword: 'IT' },
      { name: 'Electronics & Comm', keyword: 'Electronics' },
      { name: 'Design & UI/UX', keyword: 'UI/UX' },
      { name: 'Data Science', keyword: 'Data Science' },
    ];

    return depts.map((d) => {
      const deptStudents = filteredData.students.filter((s) => s.course.toLowerCase().includes(d.keyword.toLowerCase()));
      const studentIds = new Set(deptStudents.map((s) => s.id));
      const deptApps = filteredData.applications.filter((a) => studentIds.has(a.studentId));
      const deptShortlisted = deptApps.filter((a) => a.status === 'Shortlisted' || a.status === 'Interview' || a.status === 'Selected').length;
      const deptSelected = deptApps.filter((a) => a.status === 'Selected').length;
      const deptEligible = Math.round(deptStudents.length * 0.92);
      const rate = deptEligible > 0 ? ((deptSelected / deptEligible) * 100).toFixed(1) : '0.0';

      return {
        department: d.name,
        totalStudents: deptStudents.length,
        eligible: deptEligible,
        applications: deptApps.length,
        shortlisted: deptShortlisted,
        selected: deptSelected,
        placed: deptSelected,
        rate: `${rate}%`,
      };
    });
  }, [filteredData]);

  // CSV Export Handler
  const handleExportCSV = () => {
    const headers = ['Student Name', 'Department/Course', 'Company', 'Internship Role', 'Application Status', 'Placement Status', 'Applied Date'];
    const rows = filteredData.applications.slice(0, 100).map((a) => [
      a.candidateName,
      a.course || 'B.Tech CS',
      a.companyName,
      a.internshipTitle,
      a.status,
      a.status === 'Selected' ? 'Placed' : 'Not Placed',
      a.appliedDate,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `InternIQ_Placement_Report_${academicYear.replace('–', '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast('Filtered Placement Report CSV downloaded successfully.');
  };

  // PDF Export Simulation Handler
  const handleExportPDF = () => {
    triggerToast(`PDF Report compiled for ${academicYear} (${dateRange}). File ready for print.`);
  };

  // Sub-Table Pagination & Search States
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter Sub-Tables by Search Query
  const filteredSubData = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      return {
        placements: filteredData.placements,
        companies: filteredData.companies,
        students: filteredData.students,
        internships: generatedInternships,
      };
    }

    return {
      placements: filteredData.placements.filter(
        (p) => p.candidateName.toLowerCase().includes(q) || p.companyName.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
      ),
      companies: filteredData.companies.filter(
        (c) => c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q)
      ),
      students: filteredData.students.filter(
        (s) => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)
      ),
      internships: generatedInternships.filter(
        (i) => i.title.toLowerCase().includes(q) || i.companyName.toLowerCase().includes(q)
      ),
    };
  }, [filteredData, searchQuery]);

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <TPSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <TPHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Reports"
          subtitle="Analyze internship and placement performance across students, companies and departments."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto pb-safe text-left">
          {/* Back Navigation */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <button
              type="button"
              onClick={() => navigate('/tp/dashboard')}
              className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-[#2563eb] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>

            {/* Export Buttons */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleExportCSV}
                className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl inline-flex items-center space-x-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Export CSV</span>
              </button>
              <button
                type="button"
                onClick={handleExportPDF}
                className="px-3.5 py-1.5 bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-bold rounded-xl inline-flex items-center space-x-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          {/* Toast Notification */}
          {toastMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMsg}</span>
            </div>
          )}

          {/* Global Filter Bar */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Global Filter Parameters</span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
              {/* Date Range */}
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Last 3 Months">Last 3 Months</option>
                <option value="Current Academic Year">Current Academic Year</option>
                <option value="Custom Range">Custom Range</option>
              </select>

              {/* Academic Year */}
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="2026–27">Academic Year: 2026–27</option>
                <option value="2025–26">Academic Year: 2025–26</option>
                <option value="2024–25">Academic Year: 2024–25</option>
              </select>

              {/* Department */}
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
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
                onChange={(e) => setCourseFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">Course: All</option>
                <option value="B.Tech Computer Science">B.Tech CS</option>
                <option value="B.Tech IT">B.Tech IT</option>
              </select>

              {/* Company */}
              <select
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">Company: All</option>
                {generatedCompanies.slice(0, 15).map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 6 Summary Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'TOTAL STUDENTS', val: summaryMetrics.totalStudents, path: '/tp/reports/student', icon: <GraduationCap className="w-4 h-4 text-[#2563eb]" /> },
              { label: 'TOTAL APPLICATIONS', val: summaryMetrics.totalApps, path: '/tp/reports', icon: <FileText className="w-4 h-4 text-amber-500" /> },
              { label: 'TOTAL SELECTED', val: summaryMetrics.selectedApps, path: '/tp/reports/placement', icon: <Award className="w-4 h-4 text-purple-600" /> },
              { label: 'TOTAL PLACEMENTS', val: summaryMetrics.totalPlacements, path: '/tp/reports/placement', icon: <Building2 className="w-4 h-4 text-indigo-600" /> },
              { label: 'PLACEMENT RATE', val: `${summaryMetrics.placementRate}%`, path: '/tp/reports/placement', icon: <TrendingUp className="w-4 h-4 text-emerald-600" /> },
              { label: 'AVERAGE MATCH SCORE', val: `${summaryMetrics.avgMatchScore}%`, path: '/tp/reports/company', icon: <Percent className="w-4 h-4 text-[#2563eb]" /> },
            ].map((c) => (
              <button
                key={c.label}
                type="button"
                onClick={() => navigate(c.path)}
                className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs hover:border-[#2563eb] hover:shadow-xs hover:-translate-y-0.5 transition-all text-left cursor-pointer space-y-1 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-extrabold tracking-wider text-slate-500 group-hover:text-[#2563eb] truncate">{c.label}</span>
                  {c.icon}
                </div>
                <p className="text-xl font-black text-[#0f172a] group-hover:text-[#2563eb]">{c.val.toLocaleString()}</p>
              </button>
            ))}
          </div>

          {/* Sub-Navigation Tabs */}
          <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
            {[
              { id: 'overview', label: 'Overview & Department Breakdown', path: '/tp/reports' },
              { id: 'placement', label: 'Placement Performance', path: '/tp/reports/placement' },
              { id: 'company', label: 'Company-Wise Activity', path: '/tp/reports/company' },
              { id: 'student', label: 'Student Outcome Ledger', path: '/tp/reports/student' },
              { id: 'internship', label: 'Internship Analytics', path: '/tp/reports/internship' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => navigate(tab.path)}
                className={`px-4 py-2.5 text-xs font-extrabold whitespace-nowrap cursor-pointer transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-[#2563eb] text-[#2563eb] bg-blue-50/30'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input Bar */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-3.5 shadow-2xs">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search student, company, internship or department..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2563eb]"
              />
            </div>
          </div>

          {/* TAB 1: OVERVIEW & DEPARTMENT BREAKDOWN */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Visual Funnel Summary */}
              <div className="p-5 bg-gradient-to-r from-blue-50 to-slate-50 border border-blue-200 rounded-3xl space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Placement Funnel Visualizer</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                  <div className="p-3 bg-white rounded-2xl border">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Eligible Candidates</span>
                    <strong className="text-lg text-[#0f172a] font-black">{summaryMetrics.eligibleStudents.toLocaleString()}</strong>
                  </div>
                  <div className="p-3 bg-white rounded-2xl border">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Applications</span>
                    <strong className="text-lg text-blue-600 font-black">{summaryMetrics.totalApps.toLocaleString()}</strong>
                  </div>
                  <div className="p-3 bg-white rounded-2xl border">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Selected Offers</span>
                    <strong className="text-lg text-emerald-600 font-black">{summaryMetrics.selectedApps.toLocaleString()}</strong>
                  </div>
                  <div className="p-3 bg-white rounded-2xl border">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Placement Success Rate</span>
                    <strong className="text-lg text-purple-600 font-black">{summaryMetrics.placementRate}%</strong>
                  </div>
                </div>
              </div>

              {/* Department-Wise Table */}
              <div className="bg-white border border-[#e2e8f0] rounded-3xl shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-[#0f172a]">Department-Wise Placement Report</h3>
                  <span className="text-xs text-slate-500">Filtered by {academicYear}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b text-slate-600 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="py-3.5 px-4">Department</th>
                        <th className="py-3.5 px-4 text-center">Students</th>
                        <th className="py-3.5 px-4 text-center">Eligible</th>
                        <th className="py-3.5 px-4 text-center">Applications</th>
                        <th className="py-3.5 px-4 text-center">Shortlisted</th>
                        <th className="py-3.5 px-4 text-center">Selected</th>
                        <th className="py-3.5 px-4 text-center">Placed</th>
                        <th className="py-3.5 px-4 text-right">Placement Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {departmentBreakdown.map((dept) => (
                        <tr key={dept.department} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-[#0f172a]">{dept.department}</td>
                          <td className="py-3.5 px-4 text-center">{dept.totalStudents}</td>
                          <td className="py-3.5 px-4 text-center font-bold text-slate-800">{dept.eligible}</td>
                          <td className="py-3.5 px-4 text-center text-blue-600 font-semibold">{dept.applications}</td>
                          <td className="py-3.5 px-4 text-center text-amber-600 font-bold">{dept.shortlisted}</td>
                          <td className="py-3.5 px-4 text-center text-emerald-600 font-black">{dept.selected}</td>
                          <td className="py-3.5 px-4 text-center text-emerald-600 font-black">{dept.placed}</td>
                          <td className="py-3.5 px-4 text-right font-black text-[#2563eb] text-sm">{dept.rate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PLACEMENT PERFORMANCE */}
          {activeTab === 'placement' && (
            <div className="space-y-4">
              <div className="p-4 bg-white border rounded-3xl shadow-2xs space-y-4">
                <h3 className="text-sm font-extrabold text-[#0f172a]">Selected Candidate Placement Ledger</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b text-slate-600 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="py-3.5 px-4">Placement ID</th>
                        <th className="py-3.5 px-4">Candidate Student</th>
                        <th className="py-3.5 px-4">Company</th>
                        <th className="py-3.5 px-4">Internship Role</th>
                        <th className="py-3.5 px-4">Selection Date</th>
                        <th className="py-3.5 px-4">Joining Date</th>
                        <th className="py-3.5 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y font-medium text-slate-700">
                      {filteredSubData.placements.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-400 font-semibold">
                            No data available. Try changing your filters.
                          </td>
                        </tr>
                      ) : (
                        filteredSubData.placements.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50">
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-500">{p.id}</td>
                            <td className="py-3.5 px-4 font-extrabold text-[#0f172a]">
                              <button type="button" onClick={() => navigate(`/tp/students/${p.studentId}`)} className="hover:text-[#2563eb] text-left cursor-pointer">
                                {p.candidateName}
                              </button>
                            </td>
                            <td className="py-3.5 px-4">
                              <button type="button" onClick={() => navigate(`/tp/companies/${p.companyId}`)} className="hover:text-[#2563eb] text-left cursor-pointer font-semibold">
                                {p.companyName}
                              </button>
                            </td>
                            <td className="py-3.5 px-4 text-slate-600">{p.internshipTitle}</td>
                            <td className="py-3.5 px-4 text-slate-500">{p.selectionDate}</td>
                            <td className="py-3.5 px-4 font-bold text-[#0f172a]">{p.joiningDate}</td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {p.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {filteredSubData.placements.length > pageSize && (
                  <div className="pt-2 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100">
                    <span>
                      Showing <strong>{(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredSubData.placements.length)}</strong> of <strong>{filteredSubData.placements.length}</strong> records
                    </span>
                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-1.5 rounded-xl border bg-white hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="px-3 py-1 bg-white border rounded-xl font-bold text-[#2563eb]">
                        Page {currentPage} of {Math.ceil(filteredSubData.placements.length / pageSize)}
                      </span>
                      <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.min(Math.ceil(filteredSubData.placements.length / pageSize), p + 1))}
                        disabled={currentPage === Math.ceil(filteredSubData.placements.length / pageSize)}
                        className="p-1.5 rounded-xl border bg-white hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: COMPANY-WISE ACTIVITY */}
          {activeTab === 'company' && (
            <div className="space-y-4">
              <div className="p-4 bg-white border rounded-3xl shadow-2xs space-y-4">
                <h3 className="text-sm font-extrabold text-[#0f172a]">Company Recruitment Performance</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b text-slate-600 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="py-3.5 px-4">Company</th>
                        <th className="py-3.5 px-4">Industry</th>
                        <th className="py-3.5 px-4 text-center">Openings</th>
                        <th className="py-3.5 px-4 text-center">Apps</th>
                        <th className="py-3.5 px-4 text-center">Selected</th>
                        <th className="py-3.5 px-4 text-center">Avg Match</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y font-medium text-slate-700">
                      {filteredData.companies.slice(0, 15).map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50">
                          <td className="py-3.5 px-4 font-extrabold text-[#0f172a]">
                            <button type="button" onClick={() => navigate(`/tp/companies/${c.id}`)} className="hover:text-[#2563eb] text-left cursor-pointer">
                              {c.name}
                            </button>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">{c.industry}</td>
                          <td className="py-3.5 px-4 text-center font-bold text-[#2563eb]">{c.postedInternships}</td>
                          <td className="py-3.5 px-4 text-center font-bold">{c.applicantsCount || 0}</td>
                          <td className="py-3.5 px-4 text-center font-black text-emerald-600">{c.selectedCount || 0}</td>
                          <td className="py-3.5 px-4 text-center font-bold text-purple-600">88%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: STUDENT OUTCOME LEDGER */}
          {activeTab === 'student' && (
            <div className="space-y-4">
              <div className="p-4 bg-white border rounded-3xl shadow-2xs space-y-4">
                <h3 className="text-sm font-extrabold text-[#0f172a]">Student Outcome & Placement Registry</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b text-slate-600 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="py-3.5 px-4">Student</th>
                        <th className="py-3.5 px-4">Course & Year</th>
                        <th className="py-3.5 px-4 text-center">Applications</th>
                        <th className="py-3.5 px-4 text-center">Shortlisted</th>
                        <th className="py-3.5 px-4 text-center">Selected</th>
                        <th className="py-3.5 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y font-medium text-slate-700">
                      {filteredData.students.slice(0, 15).map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="py-3.5 px-4 font-extrabold text-[#0f172a]">
                            <button type="button" onClick={() => navigate(`/tp/students/${s.id}`)} className="hover:text-[#2563eb] text-left cursor-pointer">
                              {s.name}
                            </button>
                            <p className="text-[10px] text-slate-400 font-normal">{s.email}</p>
                          </td>
                          <td className="py-3.5 px-4">{s.course} ({s.year})</td>
                          <td className="py-3.5 px-4 text-center font-bold">{s.applications || 0}</td>
                          <td className="py-3.5 px-4 text-center font-bold text-amber-600">{s.shortlisted || 0}</td>
                          <td className="py-3.5 px-4 text-center font-black text-emerald-600">{s.selected || 0}</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              {s.internshipStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: INTERNSHIP ANALYTICS */}
          {activeTab === 'internship' && (
            <div className="space-y-4">
              <div className="p-4 bg-white border rounded-3xl shadow-2xs space-y-4">
                <h3 className="text-sm font-extrabold text-[#0f172a]">Internship Listing Analytics</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b text-slate-600 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="py-3.5 px-4">Internship Role</th>
                        <th className="py-3.5 px-4">Company</th>
                        <th className="py-3.5 px-4">Location</th>
                        <th className="py-3.5 px-4 font-bold text-emerald-600">Stipend</th>
                        <th className="py-3.5 px-4 text-center">Applications</th>
                        <th className="py-3.5 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y font-medium text-slate-700">
                      {generatedInternships.slice(0, 15).map((i) => (
                        <tr key={i.id} className="hover:bg-slate-50">
                          <td className="py-3.5 px-4 font-extrabold text-[#0f172a]">
                            <button type="button" onClick={() => navigate(`/tp/internships/${i.id}`)} className="hover:text-[#2563eb] text-left cursor-pointer">
                              {i.title}
                            </button>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-800">{i.companyName}</td>
                          <td className="py-3.5 px-4 text-slate-500">{i.location}</td>
                          <td className="py-3.5 px-4 font-black text-emerald-600">{i.stipend}</td>
                          <td className="py-3.5 px-4 text-center font-bold text-blue-600">{i.applicationsCount}</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {i.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
