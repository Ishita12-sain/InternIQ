import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FacultySidebar } from '../../components/faculty/FacultySidebar';
import { FacultyHeader } from '../../components/faculty/FacultyHeader';
import { useSettings } from '../../context/SettingsContext';
import {
  generatedStudents,
  generatedApplications,
  generatedPlacements,
  generatedCompanies,
} from '../../types/masterDataset';
import {
  FileSpreadsheet,
  CheckCircle2,
  Camera,
  Search,
  LogOut,
  Save,
} from 'lucide-react';

// ==================================================
// 1. FACULTY REPORTS PAGE COMPONENT
// ==================================================
export const FacultyReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Filters State
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateRange, setDateRange] = useState('All Time');
  const [searchQuery, setSearchQuery] = useState('');

  // Assigned Mentees
  const mentees = useMemo(() => {
    return generatedStudents.filter((s) => s.facultyId === 'fac-1' || parseInt(s.id.replace('st-', ''), 10) % 64 === 1);
  }, []);

  const menteeIds = useMemo(() => new Set(mentees.map((m) => m.id)), [mentees]);

  // Master applications & placements belonging to assigned mentees
  const rawMenteeApps = useMemo(() => {
    return generatedApplications.filter((a) => menteeIds.has(a.studentId));
  }, [menteeIds]);

  const rawMenteePlacements = useMemo(() => {
    return generatedPlacements.filter((p) => menteeIds.has(p.studentId));
  }, [menteeIds]);

  // Filtered Applications according to Search, Status, and Date Range
  const filteredApps = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return rawMenteeApps.filter((a) => {
      // 1. Search Query (Student, Company, Internship)
      if (q) {
        const matchStudent = a.candidateName.toLowerCase().includes(q);
        const matchCompany = a.companyName.toLowerCase().includes(q);
        const matchInternship = a.internshipTitle.toLowerCase().includes(q);
        if (!matchStudent && !matchCompany && !matchInternship) return false;
      }

      // 2. Status Filter
      if (statusFilter !== 'All') {
        if (statusFilter === 'Applied' && a.status !== 'New' && a.status !== 'Under Review') return false;
        if (statusFilter === 'Shortlisted' && a.status !== 'Shortlisted') return false;
        if (statusFilter === 'Interview' && a.status !== 'Interview') return false;
        if (statusFilter === 'Selected' && a.status !== 'Selected') return false;
        if (statusFilter === 'Rejected' && a.status !== 'Rejected') return false;
        if (statusFilter === 'Ongoing' && a.status !== 'Selected') return false;
        if (statusFilter === 'Completed' && a.status !== 'Selected') return false;
      }

      // 3. Date Range Filter
      if (dateRange !== 'All Time') {
        const day = parseInt(a.appliedDate.split(' ')[0], 10) || 15;
        if (dateRange === 'Last 7 Days' && day > 7) return false;
        if (dateRange === 'Last 30 Days' && day > 30) return false;
        if (dateRange === 'Last 3 Months' && day > 90) return false;
        if (dateRange === 'This Year' && day > 365) return false;
      }

      return true;
    });
  }, [rawMenteeApps, searchQuery, statusFilter, dateRange]);

  // Summary Card Numbers
  const metrics = useMemo(() => {
    const totalMentees = mentees.length;
    const appsCount = filteredApps.length;
    const selections = filteredApps.filter((a) => a.status === 'Selected').length;
    const successRate = totalMentees > 0 ? ((selections / totalMentees) * 100).toFixed(1) : '0.0';

    const underReview = filteredApps.filter((a) => a.status === 'Under Review' || a.status === 'New').length;
    const shortlisted = filteredApps.filter((a) => a.status === 'Shortlisted').length;
    const interview = filteredApps.filter((a) => a.status === 'Interview').length;
    const selected = filteredApps.filter((a) => a.status === 'Selected').length;
    const rejected = filteredApps.filter((a) => a.status === 'Rejected').length;

    return {
      totalMentees,
      appsCount,
      selections,
      successRate,
      underReview,
      shortlisted,
      interview,
      selected,
      rejected,
    };
  }, [mentees, filteredApps]);

  // Mentee Performance Table Data
  const menteePerformanceData = useMemo(() => {
    return mentees.map((s) => {
      const studentApps = filteredApps.filter((a) => a.studentId === s.id);
      const apps = studentApps.length;
      const shortlisted = studentApps.filter((a) => a.status === 'Shortlisted' || a.status === 'Interview' || a.status === 'Selected').length;
      const interviews = studentApps.filter((a) => a.status === 'Interview' || a.status === 'Selected').length;
      const selections = studentApps.filter((a) => a.status === 'Selected').length;
      const p = rawMenteePlacements.find((pl) => pl.studentId === s.id);
      const rate = apps > 0 ? ((selections / apps) * 100).toFixed(0) : '0';

      return {
        student: s,
        apps,
        shortlisted,
        interviews,
        selections,
        currentInternship: p ? p.internshipTitle : 'Not Placed',
        status: s.internshipStatus,
        successRate: `${rate}%`,
      };
    }).filter((m) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return m.student.name.toLowerCase().includes(q) || m.student.id.toLowerCase().includes(q);
      }
      return true;
    });
  }, [mentees, filteredApps, rawMenteePlacements, searchQuery]);

  // Top Performing Mentees
  const topMentees = useMemo(() => {
    return [...menteePerformanceData]
      .sort((a, b) => b.selections - a.selections || b.apps - a.apps)
      .slice(0, 5);
  }, [menteePerformanceData]);

  // Company Analytics
  const companyAnalytics = useMemo(() => {
    const compMap = new Map<string, { company: any; apps: number; shortlisted: number; selected: number }>();

    filteredApps.forEach((a) => {
      const comp = generatedCompanies.find((c) => c.name === a.companyName) || { id: 'c-1', name: a.companyName };
      const existing = compMap.get(a.companyName) || { company: comp, apps: 0, shortlisted: 0, selected: 0 };

      existing.apps += 1;
      if (a.status === 'Shortlisted' || a.status === 'Interview' || a.status === 'Selected') existing.shortlisted += 1;
      if (a.status === 'Selected') existing.selected += 1;

      compMap.set(a.companyName, existing);
    });

    return Array.from(compMap.values()).map((c) => ({
      ...c,
      successRate: c.apps > 0 ? `${((c.selected / c.apps) * 100).toFixed(0)}%` : '0%',
    }));
  }, [filteredApps]);

  // CSV Export Function
  const handleExportCSV = () => {
    const headers = ['Student Name', 'Student ID', 'Company', 'Internship Role', 'Application Status', 'Applied Date', 'Match Score'];
    const rows = filteredApps.map((a) => [
      `"${a.candidateName}"`,
      `"${a.studentId}"`,
      `"${a.companyName}"`,
      `"${a.internshipTitle}"`,
      `"${a.status}"`,
      `"${a.appliedDate}"`,
      `"${a.matchScore}%"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Faculty_Mentee_Reports_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMsg('Mentee Performance Report exported to CSV.');
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <FacultySidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <FacultyHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Reports & Insights"
          subtitle="Track mentee progress, applications, selections and internship outcomes."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto pb-safe text-left">
          {toastMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMsg}</span>
            </div>
          )}

          {/* Controls Bar: Export, Search, Date Range & Status Filter */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-extrabold text-[#0f172a]">Mentee Placement Overview</h3>
                <p className="text-xs text-slate-500">Live performance analytics dynamically calculated from master records.</p>
              </div>

              <button
                type="button"
                onClick={handleExportCSV}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl inline-flex items-center space-x-2 cursor-pointer shadow-2xs transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Export Report CSV</span>
              </button>
            </div>

            {/* Filter Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search student, company or internship..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">Status: All</option>
                <option value="Applied">Applied</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview">Interview</option>
                <option value="Selected">Selected</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
              </select>

              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All Time">Date Range: All Time</option>
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Last 3 Months">Last 3 Months</option>
                <option value="This Year">This Year</option>
              </select>
            </div>
          </div>

          {/* 4 Clickable Summary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <button
              type="button"
              onClick={() => navigate('/faculty/mentees')}
              className="p-4 bg-white border border-[#e2e8f0] rounded-2xl hover:border-indigo-600 hover:shadow-xs transition-all text-center cursor-pointer space-y-1 group shadow-2xs"
            >
              <span className="text-[10px] text-slate-500 font-bold uppercase block group-hover:text-indigo-600">ASSIGNED MENTEES</span>
              <strong className="text-xl text-[#0f172a] font-black group-hover:text-indigo-600">{metrics.totalMentees}</strong>
            </button>

            <button
              type="button"
              onClick={() => navigate('/faculty/applications')}
              className="p-4 bg-white border border-[#e2e8f0] rounded-2xl hover:border-indigo-600 hover:shadow-xs transition-all text-center cursor-pointer space-y-1 group shadow-2xs"
            >
              <span className="text-[10px] text-slate-500 font-bold uppercase block group-hover:text-indigo-600">APPLICATIONS FILED</span>
              <strong className="text-xl text-blue-600 font-black group-hover:text-indigo-600">{metrics.appsCount}</strong>
            </button>

            <button
              type="button"
              onClick={() => navigate('/faculty/applications?status=selected')}
              className="p-4 bg-white border border-[#e2e8f0] rounded-2xl hover:border-indigo-600 hover:shadow-xs transition-all text-center cursor-pointer space-y-1 group shadow-2xs"
            >
              <span className="text-[10px] text-slate-500 font-bold uppercase block group-hover:text-indigo-600">SELECTION OFFERS</span>
              <strong className="text-xl text-emerald-600 font-black group-hover:text-indigo-600">{metrics.selections}</strong>
            </button>

            <button
              type="button"
              onClick={() => navigate('/faculty/reports')}
              className="p-4 bg-indigo-50/50 border border-indigo-200 rounded-2xl hover:border-indigo-600 hover:shadow-xs transition-all text-center cursor-pointer space-y-1 group shadow-2xs"
            >
              <span className="text-[10px] text-indigo-700 font-bold uppercase block group-hover:text-indigo-800">MENTEE SUCCESS RATE</span>
              <strong className="text-xl text-indigo-600 font-black">{metrics.successRate}%</strong>
            </button>
          </div>

          {/* APPLICATION PERFORMANCE & SUCCESS FUNNEL */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Breakdown Card */}
            <div className="bg-white border border-[#e2e8f0] rounded-3xl p-5 shadow-2xs space-y-4">
              <h3 className="text-sm font-extrabold text-[#0f172a]">Application Performance Breakdown</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 border rounded-2xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Applications</span>
                  <strong className="text-base text-[#0f172a] font-black">{metrics.appsCount}</strong>
                </div>
                <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-2xl">
                  <span className="text-[10px] text-amber-700 font-bold uppercase block">Under Review</span>
                  <strong className="text-base text-amber-700 font-black">{metrics.underReview}</strong>
                </div>
                <div className="p-3 bg-purple-50/50 border border-purple-200 rounded-2xl">
                  <span className="text-[10px] text-purple-700 font-bold uppercase block">Shortlisted</span>
                  <strong className="text-base text-purple-700 font-black">{metrics.shortlisted}</strong>
                </div>
                <div className="p-3 bg-indigo-50/50 border border-indigo-200 rounded-2xl">
                  <span className="text-[10px] text-indigo-700 font-bold uppercase block">Interview</span>
                  <strong className="text-base text-indigo-700 font-black">{metrics.interview}</strong>
                </div>
                <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-2xl">
                  <span className="text-[10px] text-emerald-700 font-bold uppercase block">Selected</span>
                  <strong className="text-base text-emerald-700 font-black">{metrics.selected}</strong>
                </div>
                <div className="p-3 bg-rose-50/50 border border-rose-200 rounded-2xl">
                  <span className="text-[10px] text-rose-700 font-bold uppercase block">Rejected</span>
                  <strong className="text-base text-rose-700 font-black">{metrics.rejected}</strong>
                </div>
              </div>
            </div>

            {/* Mentee Success Funnel Card */}
            <div className="bg-white border border-[#e2e8f0] rounded-3xl p-5 shadow-2xs space-y-4">
              <h3 className="text-sm font-extrabold text-[#0f172a]">Mentee Success Funnel</h3>
              <div className="space-y-2 text-xs">
                {[
                  { label: 'Assigned Mentees', val: metrics.totalMentees, bg: 'bg-indigo-600 text-white' },
                  { label: 'Applied', val: metrics.appsCount, bg: 'bg-blue-600 text-white' },
                  { label: 'Shortlisted', val: metrics.shortlisted, bg: 'bg-purple-600 text-white' },
                  { label: 'Interviewed', val: metrics.interview, bg: 'bg-amber-600 text-white' },
                  { label: 'Selected', val: metrics.selected, bg: 'bg-emerald-600 text-white' },
                  { label: 'Completed', val: metrics.selected, bg: 'bg-emerald-700 text-white' },
                ].map((st, i) => (
                  <div key={st.label} className="flex items-center justify-between p-2.5 bg-slate-50 border rounded-xl">
                    <span className="font-bold text-slate-700">{i + 1}. {st.label}</span>
                    <span className={`px-2.5 py-0.5 rounded-full font-black text-xs ${st.bg}`}>{st.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* MENTEE PERFORMANCE TABLE */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-[#0f172a]">Mentee Performance Ledger</h3>
              <span className="text-xs text-slate-400 font-semibold">{menteePerformanceData.length} Mentees</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Student</th>
                    <th className="py-3.5 px-4">Department / Course</th>
                    <th className="py-3.5 px-4 text-center">Applications</th>
                    <th className="py-3.5 px-4 text-center">Shortlisted</th>
                    <th className="py-3.5 px-4 text-center">Interviews</th>
                    <th className="py-3.5 px-4 text-center">Selections</th>
                    <th className="py-3.5 px-4">Current Internship</th>
                    <th className="py-3.5 px-4">Success Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {menteePerformanceData.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400 font-semibold space-y-1">
                        <p>No report data available</p>
                        <p className="text-[11px] text-slate-400 font-normal">Try changing your filters.</p>
                      </td>
                    </tr>
                  ) : (
                    menteePerformanceData.map((m) => (
                      <tr key={m.student.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4 font-extrabold text-[#0f172a]">
                          <button
                            type="button"
                            onClick={() => navigate(`/faculty/students/${m.student.id}`)}
                            className="hover:text-indigo-600 text-left cursor-pointer"
                          >
                            {m.student.name}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{m.student.course}</td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-800">{m.apps}</td>
                        <td className="py-3.5 px-4 text-center font-bold text-purple-600">{m.shortlisted}</td>
                        <td className="py-3.5 px-4 text-center font-bold text-amber-600">{m.interviews}</td>
                        <td className="py-3.5 px-4 text-center font-black text-emerald-600">{m.selections}</td>
                        <td className="py-3.5 px-4 text-slate-600">{m.currentInternship}</td>
                        <td className="py-3.5 px-4 font-bold text-indigo-600">{m.successRate}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* TOP PERFORMING MENTEES & COMPANY ANALYTICS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Mentees */}
            <div className="bg-white border border-[#e2e8f0] rounded-3xl p-5 shadow-2xs space-y-4">
              <h3 className="text-sm font-extrabold text-[#0f172a]">Top Performing Mentees</h3>
              <div className="space-y-2.5 text-xs">
                {topMentees.map((tm) => (
                  <div key={tm.student.id} className="flex items-center justify-between p-3 bg-slate-50 border rounded-2xl hover:border-indigo-300 transition-colors">
                    <button
                      type="button"
                      onClick={() => navigate(`/faculty/students/${tm.student.id}`)}
                      className="font-extrabold text-[#0f172a] hover:text-indigo-600 text-left cursor-pointer"
                    >
                      {tm.student.name} ({tm.student.course})
                    </button>
                    <div className="text-right">
                      <span className="font-black text-emerald-600 block">{tm.selections} Selections</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{tm.apps} Apps filed</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Company Analytics */}
            <div className="bg-white border border-[#e2e8f0] rounded-3xl p-5 shadow-2xs space-y-4">
              <h3 className="text-sm font-extrabold text-[#0f172a]">Company Recruitment Analytics</h3>
              <div className="space-y-2.5 text-xs">
                {companyAnalytics.slice(0, 5).map((ca) => (
                  <div key={ca.company.name} className="flex items-center justify-between p-3 bg-slate-50 border rounded-2xl hover:border-indigo-300 transition-colors">
                    <button
                      type="button"
                      onClick={() => navigate(`/faculty/companies/${ca.company.id || 'c-1'}`)}
                      className="font-extrabold text-[#0f172a] hover:text-indigo-600 text-left cursor-pointer"
                    >
                      {ca.company.name}
                    </button>
                    <div className="text-right">
                      <span className="font-bold text-slate-700 block">{ca.apps} Apps ({ca.selected} Selected)</span>
                      <span className="text-[10px] text-indigo-600 font-extrabold">{ca.successRate} Success</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// ==================================================
// 2. FACULTY PROFILE PAGE COMPONENT
// ==================================================
export const FacultyProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { settings, updateAdminProfile } = useSettings();

  const [isEditing, setIsEditing] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Profile Form State
  const [fullName, setFullName] = useState(settings.adminProfile.name || 'Dr. Aristh (Faculty)');
  const [phone, setPhone] = useState('+91 97330 45678');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [designation, setDesignation] = useState('Faculty Mentor & Associate Professor');
  const [specialization, setSpecialization] = useState('Machine Learning & Distributed Systems');
  const [experience, setExperience] = useState('12 Years Academic & Research');
  const [college] = useState('Indian Institute of Technology, Madras');

  const [photoPreview, setPhotoPreview] = useState<string | undefined>(settings.adminProfile.photoUrl);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Calculate live statistics
  const mentees = useMemo(() => {
    return generatedStudents.filter((s) => s.facultyId === 'fac-1' || parseInt(s.id.replace('st-', ''), 10) % 64 === 1);
  }, []);

  const menteeIds = useMemo(() => new Set(mentees.map((m) => m.id)), [mentees]);

  const stats = useMemo(() => {
    const totalMentees = mentees.length;
    const apps = generatedApplications.filter((a) => menteeIds.has(a.studentId));
    const selections = apps.filter((a) => a.status === 'Selected').length;
    const successRate = totalMentees > 0 ? ((selections / totalMentees) * 100).toFixed(1) : '0.0';

    return { totalMentees, appsCount: apps.length, selections, successRate };
  }, [mentees, menteeIds]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        updateAdminProfile({ photoUrl: result });
        triggerToast('Profile photo synchronized.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminProfile({ name: fullName });
    setIsEditing(false);
    triggerToast('Profile updated successfully.');
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <FacultySidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <FacultyHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Faculty Profile"
          subtitle="Manage your academic mentor profile and office credentials."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-5xl w-full mx-auto pb-safe text-left">
          {toastMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMsg}</span>
            </div>
          )}

          {/* Profile Card Header */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-5 text-center sm:text-left">
                <div className="relative group">
                  {photoPreview ? (
                    <img src={photoPreview} alt={fullName} className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-600 shadow-xs" />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-indigo-600 text-white font-black text-2xl flex items-center justify-center border-2 border-indigo-400">
                      FM
                    </div>
                  )}
                  <label className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full border shadow-xs cursor-pointer hover:bg-slate-50">
                    <Camera className="w-3.5 h-3.5 text-indigo-600" />
                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                  </label>
                </div>

                <div>
                  <h2 className="text-xl font-extrabold text-[#0f172a]">{fullName}</h2>
                  <p className="text-xs font-bold text-indigo-600">{designation}</p>
                  <p className="text-xs text-slate-500">{department} • {college}</p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">Faculty ID: #FAC-2026-081</p>
                </div>
              </div>

              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-2xs"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-pointer inline-flex items-center space-x-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </div>

            {/* Profile Statistics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
              <div className="p-3.5 bg-slate-50 border rounded-2xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Assigned Mentees</span>
                <strong className="text-lg text-[#0f172a] font-black">{stats.totalMentees}</strong>
              </div>
              <div className="p-3.5 bg-slate-50 border rounded-2xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Applications Filed</span>
                <strong className="text-lg text-blue-600 font-black">{stats.appsCount}</strong>
              </div>
              <div className="p-3.5 bg-slate-50 border rounded-2xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Selection Offers</span>
                <strong className="text-lg text-emerald-600 font-black">{stats.selections}</strong>
              </div>
              <div className="p-3.5 bg-indigo-50/50 border border-indigo-200 rounded-2xl">
                <span className="text-[10px] text-indigo-700 font-bold uppercase block">Mentee Success Rate</span>
                <strong className="text-lg text-indigo-600 font-black">{stats.successRate}%</strong>
              </div>
            </div>

            {/* Editable Profile Information Form */}
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <h3 className="text-sm font-extrabold text-[#0f172a] border-b pb-2">Academic & Contact Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    disabled={!isEditing}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 disabled:opacity-60 disabled:bg-slate-100"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Email Address (Read-Only)</label>
                  <input
                    type="email"
                    value="faculty@interniq.edu"
                    disabled
                    className="w-full px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Faculty / Employee ID (Read-Only)</label>
                  <input
                    type="text"
                    value="#FAC-2026-081"
                    disabled
                    className="w-full px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    disabled={!isEditing}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 disabled:opacity-60 disabled:bg-slate-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Department</label>
                  <input
                    type="text"
                    value={department}
                    disabled={!isEditing}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 disabled:opacity-60 disabled:bg-slate-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    disabled={!isEditing}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 disabled:opacity-60 disabled:bg-slate-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Specialization</label>
                  <input
                    type="text"
                    value={specialization}
                    disabled={!isEditing}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 disabled:opacity-60 disabled:bg-slate-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Experience</label>
                  <input
                    type="text"
                    value={experience}
                    disabled={!isEditing}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 disabled:opacity-60 disabled:bg-slate-100"
                  />
                </div>
              </div>
            </form>

            {/* Quick Links */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-extrabold text-[#0f172a] border-b pb-2">Quick Navigation Links</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => navigate('/faculty/mentees')}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-2xl hover:border-indigo-600 hover:text-indigo-600 font-bold transition-all text-center cursor-pointer"
                >
                  My Mentees →
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/faculty/applications')}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-2xl hover:border-indigo-600 hover:text-indigo-600 font-bold transition-all text-center cursor-pointer"
                >
                  Applications →
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/faculty/internships')}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-2xl hover:border-indigo-600 hover:text-indigo-600 font-bold transition-all text-center cursor-pointer"
                >
                  Internships →
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/faculty/reports')}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-2xl hover:border-indigo-600 hover:text-indigo-600 font-bold transition-all text-center cursor-pointer"
                >
                  Reports →
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// ==================================================
// 3. FACULTY SETTINGS PAGE COMPONENT
// ==================================================
export const FacultySettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { settings, setTheme, updateNotifications } = useSettings();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Privacy State
  const [profileVisibility, setProfileVisibility] = useState('Public');
  const [contactVisibility, setContactVisibility] = useState('Mentees Only');

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <FacultySidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <FacultyHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Settings"
          subtitle="Manage your faculty mentor portal preferences and security controls."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-4xl w-full mx-auto pb-safe text-left">
          {toastMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMsg}</span>
            </div>
          )}

          {/* Account Settings */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-extrabold text-[#0f172a]">Account Details</h3>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => navigate('/faculty/settings/security')}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Security Settings →
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/faculty/profile')}
                  className="px-3 py-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Edit Profile →
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Name</label>
                <input type="text" value={settings.adminProfile.name || 'Dr. Aristh (Faculty)'} disabled className="w-full px-3.5 py-2 bg-slate-100 border rounded-xl text-slate-600" />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Email</label>
                <input type="text" value="faculty@interniq.edu" disabled className="w-full px-3.5 py-2 bg-slate-100 border rounded-xl text-slate-500 font-mono" />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Faculty ID</label>
                <input type="text" value="#FAC-2026-081" disabled className="w-full px-3.5 py-2 bg-slate-100 border rounded-xl text-slate-500 font-mono" />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Department</label>
                <input type="text" value="Computer Science & Engineering" disabled className="w-full px-3.5 py-2 bg-slate-100 border rounded-xl text-slate-600" />
              </div>
            </div>
          </div>

          {/* Notifications Settings */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-[#0f172a] border-b pb-3">Notification Preferences</h3>
            <div className="space-y-3 text-xs">
              {[
                { key: 'emailNotifications', label: 'Application Updates', desc: 'Receive notifications when mentees submit new applications.' },
                { key: 'verificationAlerts', label: 'Interview Updates', desc: 'Get notified when interviews are scheduled for your mentees.' },
                { key: 'weeklyReports', label: 'Selection Updates', desc: 'Receive immediate alerts upon student offer selections.' },
                { key: 'systemUpdates', label: 'Placement & System Updates', desc: 'Get weekly summaries and system platform notifications.' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3 bg-slate-50 border rounded-2xl">
                  <div>
                    <h4 className="font-bold text-slate-800">{item.label}</h4>
                    <p className="text-[11px] text-slate-500">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!settings.notifications[item.key as keyof typeof settings.notifications]}
                      onChange={(e) => {
                        updateNotifications({ [item.key]: e.target.checked });
                        triggerToast(`${item.label} setting updated.`);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-[#0f172a] border-b pb-3">Appearance & Theme</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {(['System', 'Light', 'Dark'] as const).map((t) => {
                const isSelected = settings.theme === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setTheme(t);
                      triggerToast(`Theme set to ${t} Theme.`);
                    }}
                    className={`p-3.5 border rounded-2xl font-bold cursor-pointer transition-all text-center flex flex-col items-center justify-center space-y-1 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 ring-2 ring-indigo-500/30'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300'
                    }`}
                  >
                    <span className="text-sm font-extrabold">{t} Theme</span>
                    {isSelected && <span className="text-[10px] uppercase font-black text-indigo-600">Active</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-[#0f172a] border-b pb-3">Privacy Controls</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Profile Visibility</label>
                <select
                  value={profileVisibility}
                  onChange={(e) => {
                    setProfileVisibility(e.target.value);
                    triggerToast('Profile visibility updated.');
                  }}
                  className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl font-medium focus:outline-none cursor-pointer"
                >
                  <option value="Public">Public (All Users)</option>
                  <option value="Institution Only">Institution Only</option>
                  <option value="Private">Private</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Contact Information Visibility</label>
                <select
                  value={contactVisibility}
                  onChange={(e) => {
                    setContactVisibility(e.target.value);
                    triggerToast('Contact visibility updated.');
                  }}
                  className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl font-medium focus:outline-none cursor-pointer"
                >
                  <option value="Mentees Only">Assigned Mentees Only</option>
                  <option value="All Students">All Students & T&P Officers</option>
                  <option value="Hidden">Hidden</option>
                </select>
              </div>
            </div>
          </div>

          {/* Logout Section */}
          <div className="p-6 bg-rose-50/60 border border-rose-200 rounded-3xl space-y-3">
            <h3 className="text-sm font-extrabold text-rose-900">Sign Out</h3>
            <p className="text-xs text-rose-700">Safely log out of your Faculty Mentor session.</p>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-2xs cursor-pointer transition-colors inline-flex items-center space-x-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};
