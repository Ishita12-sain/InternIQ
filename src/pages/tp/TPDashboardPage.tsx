import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TPSidebar } from '../../components/tp/TPSidebar';
import { TPHeader } from '../../components/tp/TPHeader';
import {
  generatedStudents,
  generatedCompanies,
  generatedInternships,
  generatedApplications,
} from '../../types/masterDataset';
import {
  GraduationCap,
  Briefcase,
  FileText,
  CheckCircle2,
  Calendar,
  Award,
  TrendingUp,
  ChevronRight,
  User,
  Search,
  Sparkles,
} from 'lucide-react';

export const TPDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Date Range Filter State
  const [dateRange, setDateRange] = useState<string>('Last 30 Days');
  const [dashboardSearch, setDashboardSearch] = useState<string>('');

  // 1. Date Range Boundary Calculator
  const dateBounds = useMemo(() => {
    const now = new Date('2026-08-20T23:59:59');
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
    }

    return { start, end: now };
  }, [dateRange]);

  // Helper date validator
  const isDateInRange = (dateStr?: string) => {
    if (!dateStr) return true;
    const d = new Date(dateStr);
    return d >= dateBounds.start && d <= dateBounds.end;
  };

  // 2. Dynamic Filtering & Metrics Calculation from Centralized Dataset
  const metrics = useMemo(() => {
    // Total Students from master dataset
    const totalStudents = generatedStudents.length; // 1,420
    const eligibleStudents = Math.round(totalStudents * 0.92); // 1,306
    const notEligibleStudents = totalStudents - eligibleStudents;
    const seekingStudents = generatedStudents.filter(
      (s) => s.internshipStatus === 'Seeking' || s.internshipStatus === 'Looking'
    ).length;

    // Applications filtered by Date Range
    const dateFilteredApps = generatedApplications.filter((a) => isDateInRange(a.appliedDate));
    const totalApplications = dateFilteredApps.length;

    // Application Status Counts
    const newApps = dateFilteredApps.filter((a) => a.status === 'New').length;
    const underReviewApps = dateFilteredApps.filter((a) => a.status === 'Under Review').length;
    const shortlistedApps = dateFilteredApps.filter((a) => a.status === 'Shortlisted').length;
    const interviewApps = dateFilteredApps.filter((a) => a.status === 'Interview').length;
    const selectedApps = dateFilteredApps.filter((a) => a.status === 'Selected');
    const selectedCount = selectedApps.length;
    const rejectedApps = dateFilteredApps.filter((a) => a.status === 'Rejected').length;

    // Placement Rate Formula: Selected / Eligible * 100
    const placementRate = eligibleStudents > 0 ? Math.round((selectedCount / eligibleStudents) * 100) : 0;

    // Internship & Company metrics
    const activeInternships = generatedInternships.filter((i) => i.status === 'Active').length;
    const hiringCompanies = generatedCompanies.filter((c) => c.verificationStatus === 'Verified').length;

    return {
      totalStudents,
      eligibleStudents,
      notEligibleStudents,
      seekingStudents,
      currentlyInterning: Math.round(selectedCount * 0.7),
      completedStudents: Math.round(selectedCount * 0.3),
      totalApplications,
      newApps,
      underReviewApps,
      shortlistedApps,
      interviewApps,
      selectedCount,
      rejectedApps,
      placementRate,
      activeInternships,
      hiringCompanies,
      dateFilteredApps,
    };
  }, [dateBounds]);

  // 3. Upcoming Interviews (Date-sensitive slice)
  const upcomingInterviews = useMemo(() => {
    return metrics.dateFilteredApps
      .filter((a) => a.status === 'Interview' || a.status === 'Shortlisted')
      .slice(0, 5)
      .map((app, idx) => ({
        id: app.id,
        studentName: app.candidateName,
        studentId: app.studentId,
        companyName: app.companyName,
        internshipTitle: app.internshipTitle,
        date: app.appliedDate || `18 Aug 2026`,
        time: `${10 + (idx % 4)}:30 AM`,
        type: idx % 2 === 0 ? 'Technical Interview' : 'HR Interview',
        status: 'Scheduled',
      }));
  }, [metrics.dateFilteredApps]);

  // 4. Recent Applications (Date-sensitive slice)
  const recentApplications = useMemo(() => {
    return metrics.dateFilteredApps.slice(0, 5);
  }, [metrics.dateFilteredApps]);

  // 5. Top Hiring Companies (Derived dynamically from Selected Applications)
  const topHiringCompanies = useMemo(() => {
    const counts: Record<string, { companyName: string; companyId: string; selected: number; apps: number; internships: number }> = {};

    metrics.dateFilteredApps.forEach((app) => {
      if (!counts[app.companyId]) {
        const compObj = generatedCompanies.find((c) => c.id === app.companyId);
        counts[app.companyId] = {
          companyName: app.companyName,
          companyId: app.companyId,
          selected: 0,
          apps: 0,
          internships: compObj ? compObj.postedInternships : 1,
        };
      }
      counts[app.companyId].apps += 1;
      if (app.status === 'Selected') {
        counts[app.companyId].selected += 1;
      }
    });

    return Object.values(counts)
      .sort((a, b) => b.selected - a.selected || b.apps - a.apps)
      .slice(0, 5);
  }, [metrics.dateFilteredApps]);

  // 6. Recent Placement Activities Stream
  const recentPlacementActivities = useMemo(() => {
    const apps = metrics.dateFilteredApps;
    const activities = [];

    const selectedApp = apps.find((a) => a.status === 'Selected') || apps[0];
    if (selectedApp) {
      activities.push({
        id: 'act-1',
        title: 'Student Selected',
        student: selectedApp.candidateName,
        company: selectedApp.companyName,
        internship: selectedApp.internshipTitle,
        date: selectedApp.appliedDate,
        status: 'Selected',
      });
    }

    const interviewApp = apps.find((a) => a.status === 'Interview') || apps[1];
    if (interviewApp) {
      activities.push({
        id: 'act-2',
        title: 'Interview Scheduled',
        student: interviewApp.candidateName,
        company: interviewApp.companyName,
        internship: interviewApp.internshipTitle,
        date: interviewApp.appliedDate,
        status: 'Interview',
      });
    }

    const shortlistedApp = apps.find((a) => a.status === 'Shortlisted') || apps[2];
    if (shortlistedApp) {
      activities.push({
        id: 'act-3',
        title: 'Student Shortlisted',
        student: shortlistedApp.candidateName,
        company: shortlistedApp.companyName,
        internship: shortlistedApp.internshipTitle,
        date: shortlistedApp.appliedDate,
        status: 'Shortlisted',
      });
    }

    if (selectedApp) {
      activities.push({
        id: 'act-4',
        title: 'Internship Started',
        student: selectedApp.candidateName,
        company: selectedApp.companyName,
        internship: selectedApp.internshipTitle,
        date: selectedApp.appliedDate,
        status: 'Ongoing',
      });
      activities.push({
        id: 'act-5',
        title: 'Internship Completed',
        student: generatedStudents[3]?.name || 'Meera Deshmukh',
        company: generatedCompanies[1]?.name || 'Apex Robotics',
        internship: 'Robotics Engineering Intern',
        date: '10 Aug 2026',
        status: 'Completed',
      });
    }

    return activities;
  }, [metrics.dateFilteredApps]);

  // 7. Dashboard Search Handler
  const handleDashboardSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = dashboardSearch.trim().toLowerCase();
    if (!query) return;

    const matchStudent = generatedStudents.find((s) => s.name.toLowerCase().includes(query));
    if (matchStudent) {
      navigate(`/tp/students/${matchStudent.id}`);
      return;
    }

    const matchCompany = generatedCompanies.find((c) => c.name.toLowerCase().includes(query));
    if (matchCompany) {
      navigate(`/tp/companies/${matchCompany.id}`);
      return;
    }

    const matchInternship = generatedInternships.find((i) => i.title.toLowerCase().includes(query));
    if (matchInternship) {
      navigate(`/tp/internships/${matchInternship.id}`);
      return;
    }

    navigate(`/tp/students`);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      {/* Responsive T&P Sidebar */}
      <TPSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TPHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Training & Placement Dashboard"
          subtitle="Monitor student placement progress and internship activities."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto pb-safe text-left">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#2563eb] rounded-3xl p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  T&P Cell Portal
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-1">Welcome back, Prof. Meenakshi</h1>
              <p className="text-xs text-slate-300 mt-1">
                Monitor internships, applications, interviews and student placements.
              </p>
            </div>

            {/* Date Range Selector */}
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-2 rounded-2xl text-xs shrink-0">
              <Calendar className="w-4 h-4 text-blue-300 shrink-0" />
              <span className="font-bold text-slate-200">Date Range:</span>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-transparent font-bold text-white focus:outline-none cursor-pointer"
              >
                <option value="Today" className="text-slate-900">Today</option>
                <option value="Last 7 Days" className="text-slate-900">Last 7 Days</option>
                <option value="Last 30 Days" className="text-slate-900">Last 30 Days</option>
                <option value="Last 6 Months" className="text-slate-900">Last 6 Months</option>
                <option value="This Year" className="text-slate-900">This Year</option>
              </select>
            </div>
          </div>

          {/* Unified Search Bar */}
          <form onSubmit={handleDashboardSearch} className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search students, companies or internships..."
              value={dashboardSearch}
              onChange={(e) => setDashboardSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e2e8f0] rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2563eb] shadow-2xs"
            />
          </form>

          {/* 9 Summary Cards in Responsive Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
            {[
              { label: 'TOTAL STUDENTS', val: metrics.totalStudents, desc: 'All registered students', path: '/tp/students', icon: <GraduationCap className="w-4 h-4 text-[#2563eb]" /> },
              { label: 'ELIGIBLE STUDENTS', val: metrics.eligibleStudents, desc: '92% overall eligibility', path: '/tp/students?eligibility=eligible', icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" /> },
              { label: 'SEEKING INTERNSHIP', val: metrics.seekingStudents, desc: 'Active job seekers', path: '/tp/students?status=seeking', icon: <User className="w-4 h-4 text-amber-600" /> },
              { label: 'ACTIVE INTERNSHIPS', val: metrics.activeInternships, desc: 'Open listings', path: '/tp/internships?status=Active', icon: <Briefcase className="w-4 h-4 text-teal-600" /> },
              { label: 'TOTAL APPLICATIONS', val: metrics.totalApplications, desc: 'Submitted applications', path: '/tp/applications', icon: <FileText className="w-4 h-4 text-blue-600" /> },
              { label: 'SHORTLISTED', val: metrics.shortlistedApps, desc: 'Candidates shortlisted', path: '/tp/applications?status=Shortlisted', icon: <TrendingUp className="w-4 h-4 text-purple-600" /> },
              { label: 'INTERVIEWS', val: metrics.interviewApps, desc: 'Scheduled rounds', path: '/tp/interviews', icon: <Calendar className="w-4 h-4 text-indigo-600" /> },
              { label: 'SELECTED STUDENTS', val: metrics.selectedCount, desc: 'Offers accepted', path: '/tp/placements?status=Selected', icon: <Award className="w-4 h-4 text-emerald-600" /> },
              { label: 'PLACEMENT RATE', val: `${metrics.placementRate}%`, desc: 'Conversion rate', path: '/tp/placements', icon: <Sparkles className="w-4 h-4 text-purple-600" /> },
            ].map((card) => (
              <button
                key={card.label}
                type="button"
                onClick={() => navigate(card.path)}
                className="bg-white border border-[#e2e8f0] rounded-2xl p-3 shadow-2xs hover:border-[#2563eb] hover:shadow-xs transition-all text-left cursor-pointer space-y-1 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 truncate">{card.label}</span>
                  {card.icon}
                </div>
                <p className="text-lg font-black text-[#0f172a] group-hover:text-[#2563eb]">
                  {typeof card.val === 'number' ? card.val.toLocaleString() : card.val}
                </p>
                <p className="text-[9px] text-slate-400 font-medium truncate">{card.desc}</p>
              </button>
            ))}
          </div>

          {/* Placement Overview & Application Status Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Placement Overview */}
            <div className="lg:col-span-2 bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-[#0f172a]">Placement Overview</h3>
                  <p className="text-xs text-slate-500">Live placement conversion progress for eligible candidates.</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/tp/placements')}
                  className="text-xs font-bold text-[#2563eb] hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <span>Placement Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700">Calculated Placement Rate</span>
                  <span className="text-[#2563eb] font-black text-sm">{metrics.placementRate}%</span>
                </div>
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, metrics.placementRate)}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 pt-0.5">
                  Formula: ({metrics.selectedCount.toLocaleString()} Selected ÷ {metrics.eligibleStudents.toLocaleString()} Eligible) × 100 = {metrics.placementRate}%
                </p>
              </div>

              {/* Status Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Eligible Students', val: metrics.eligibleStudents },
                  { label: 'Selected Students', val: metrics.selectedCount },
                  { label: 'Currently Interning', val: metrics.currentlyInterning },
                  { label: 'Completed', val: metrics.completedStudents },
                ].map((item) => (
                  <div key={item.label} className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-left">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{item.label}</p>
                    <p className="text-base font-black text-[#0f172a] mt-0.5">{item.val.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Status Pipeline */}
            <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-extrabold text-[#0f172a]">Application Status</h3>
                  <p className="text-xs text-slate-500">Pipeline distribution across status states.</p>
                </div>

                <div className="space-y-2 mt-4">
                  {[
                    { label: 'New', val: metrics.newApps, color: 'bg-blue-50 text-blue-700 border-blue-200' },
                    { label: 'Under Review', val: metrics.underReviewApps, color: 'bg-purple-50 text-purple-700 border-purple-200' },
                    { label: 'Shortlisted', val: metrics.shortlistedApps, color: 'bg-amber-50 text-amber-700 border-amber-200' },
                    { label: 'Interview', val: metrics.interviewApps, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
                    { label: 'Selected', val: metrics.selectedCount, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                    { label: 'Rejected', val: metrics.rejectedApps, color: 'bg-rose-50 text-rose-700 border-rose-200' },
                  ].map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => navigate(`/tp/applications?status=${item.label}`)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl border hover:bg-slate-50 transition-colors text-xs font-bold cursor-pointer"
                    >
                      <span className="text-slate-700">{item.label}</span>
                      <span className={`px-2 py-0.5 rounded-md border text-[11px] font-black ${item.color}`}>
                        {item.val.toLocaleString()}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/tp/applications')}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer mt-4"
              >
                Manage All Applications
              </button>
            </div>
          </div>

          {/* Upcoming Interviews & Recent Applications Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Interviews */}
            <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-[#0f172a]">Upcoming Interviews</h3>
                  <p className="text-xs text-slate-500">Next 5 scheduled candidate interview sessions.</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/tp/interviews')}
                  className="text-xs font-bold text-[#2563eb] hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {upcomingInterviews.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs font-semibold">
                  No upcoming interviews
                </div>
              ) : (
                <div className="space-y-2.5">
                  {upcomingInterviews.map((iv) => (
                    <div
                      key={iv.id}
                      onClick={() => navigate(`/tp/applications/${iv.id}`)}
                      className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between text-xs hover:border-[#2563eb] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-[#2563eb] text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {iv.studentName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-extrabold text-[#0f172a]">{iv.studentName}</p>
                          <p className="text-[11px] text-slate-600 font-medium">{iv.internshipTitle} @ <strong className="text-slate-800">{iv.companyName}</strong></p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold rounded-md block">
                          {iv.type}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 mt-1 block">{iv.date} • {iv.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Applications */}
            <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-[#0f172a]">Recent Applications</h3>
                  <p className="text-xs text-slate-500">Latest candidate submissions.</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/tp/applications')}
                  className="text-xs font-bold text-[#2563eb] hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {recentApplications.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs font-semibold">
                  No recent applications
                </div>
              ) : (
                <div className="space-y-2.5">
                  {recentApplications.map((app) => (
                    <div key={app.id} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between text-xs">
                      <div>
                        <button
                          type="button"
                          onClick={() => navigate(`/tp/students/${app.studentId}`)}
                          className="font-bold text-[#0f172a] hover:text-[#2563eb] hover:underline text-left cursor-pointer"
                        >
                          {app.candidateName}
                        </button>
                        <p className="text-[11px] text-slate-500">{app.internshipTitle} @ {app.companyName}</p>
                      </div>

                      <div className="text-right space-y-1 shrink-0">
                        <span className="px-2 py-0.5 bg-[#2563eb]/10 text-[#2563eb] font-extrabold text-[10px] rounded-md mr-1.5">
                          {app.matchScore}%
                        </span>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-[10px] font-bold">
                          {app.status}
                        </span>
                        <p className="text-[10px] text-slate-400 font-semibold">{app.appliedDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Top Hiring Companies & Recent Placement Activity Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Hiring Companies */}
            <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-[#0f172a]">Top Hiring Companies</h3>
                <p className="text-xs text-slate-500">Ranked by actual selected candidates.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b text-slate-500 uppercase text-[9px] font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Company</th>
                      <th className="py-2.5 px-3 text-center">Open Internships</th>
                      <th className="py-2.5 px-3 text-center">Applications</th>
                      <th className="py-2.5 px-3 text-center text-emerald-600">Selected</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-medium text-slate-700">
                    {topHiringCompanies.map((c) => (
                      <tr key={c.companyId} className="hover:bg-slate-50">
                        <td className="py-3 px-3">
                          <button
                            type="button"
                            onClick={() => navigate(`/tp/companies/${c.companyId}`)}
                            className="font-bold text-[#0f172a] hover:text-[#2563eb] hover:underline cursor-pointer"
                          >
                            {c.companyName}
                          </button>
                        </td>
                        <td className="py-3 px-3 text-center font-bold">{c.internships}</td>
                        <td className="py-3 px-3 text-center font-bold text-blue-600">{c.apps}</td>
                        <td className="py-3 px-3 text-center font-black text-emerald-600">{c.selected}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Placement Activity */}
            <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-[#0f172a]">Recent Placement Activity</h3>
                <p className="text-xs text-slate-500">Live placement updates stream.</p>
              </div>

              {recentPlacementActivities.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs font-semibold">
                  No placement activity yet
                </div>
              ) : (
                <div className="space-y-2.5">
                  {recentPlacementActivities.map((act) => (
                    <div key={act.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-1 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#0f172a]">{act.title}</span>
                        <span className="text-[10px] font-bold text-slate-400">{act.date}</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        <strong className="text-slate-800">{act.student}</strong> • {act.internship} @ <strong className="text-slate-800">{act.company}</strong>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
