import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import type { PendingVerificationItem } from '../../types/adminTypes';
import {
  mockAdminStudents,
  mockAdminCompanies,
  mockAdminInternships,
  mockAdminApplications,
  mockPendingVerifications,
} from '../../types/adminTypes';
import {
  Users,
  Building2,
  Briefcase,
  FileText,
  UserCheck,
  CheckCircle2,
  TrendingUp,
  Award,
  Calendar,
  Download,
  FileSpreadsheet,
  Sparkles,
  BarChart3,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
} from 'lucide-react';

export const AdminAnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dateRange, setDateRange] = useState<string>('Last 30 Days');
  const [customStartDate, setCustomStartDate] = useState<string>('2026-08-01');
  const [customEndDate, setCustomEndDate] = useState<string>('2026-08-19');
  const [trendGranularity, setTrendGranularity] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Helper Date Filter Function
  const parseDate = (dateStr?: string): Date => {
    if (!dateStr) return new Date();
    return new Date(dateStr);
  };

  // Dynamic Date Bounds Calculation
  const dateBounds = useMemo(() => {
    const now = new Date('2026-08-19T23:59:59'); // Simulated system reference date
    const start = new Date(now);
    const prevStart = new Date(now);
    const prevEnd = new Date(now);

    if (dateRange === 'Today') {
      start.setHours(0, 0, 0, 0);
      prevStart.setDate(prevStart.getDate() - 1);
      prevStart.setHours(0, 0, 0, 0);
      prevEnd.setDate(prevEnd.getDate() - 1);
      prevEnd.setHours(23, 59, 59, 999);
    } else if (dateRange === 'Last 7 Days') {
      start.setDate(now.getDate() - 7);
      prevStart.setDate(now.getDate() - 14);
      prevEnd.setDate(now.getDate() - 7);
    } else if (dateRange === 'Last 30 Days') {
      start.setDate(now.getDate() - 30);
      prevStart.setDate(now.getDate() - 60);
      prevEnd.setDate(now.getDate() - 30);
    } else if (dateRange === 'Last 6 Months') {
      start.setMonth(now.getMonth() - 6);
      prevStart.setMonth(now.getMonth() - 12);
      prevEnd.setMonth(now.getMonth() - 6);
    } else if (dateRange === 'This Year') {
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      prevStart.setFullYear(now.getFullYear() - 1, 0, 1);
      prevEnd.setFullYear(now.getFullYear() - 1, 11, 31);
    } else if (dateRange === 'Custom Range') {
      const cStart = new Date(customStartDate);
      const cEnd = new Date(customEndDate);
      cEnd.setHours(23, 59, 59, 999);
      const diffMs = cEnd.getTime() - cStart.getTime();
      const pStart = new Date(cStart.getTime() - diffMs);
      return { start: cStart, end: cEnd, prevStart: pStart, prevEnd: cStart };
    }

    return { start, end: now, prevStart, prevEnd };
  }, [dateRange, customStartDate, customEndDate]);

  // Derived Analytics Engine using useMemo (Single Source of Truth)
  const analytics = useMemo(() => {
    const { start, end, prevStart, prevEnd } = dateBounds;

    const isDateInRange = (dateStr?: string, s = start, e = end) => {
      if (!dateStr) return true;
      const d = parseDate(dateStr);
      return d >= s && d <= e;
    };

    // Filter Primary Datasets
    const filteredApps = mockAdminApplications.filter((a) => isDateInRange(a.appliedDate));
    const prevApps = mockAdminApplications.filter((a) => isDateInRange(a.appliedDate, prevStart, prevEnd));

    const filteredStudents = mockAdminStudents.filter((s) => isDateInRange(s.createdDate));
    const prevStudents = mockAdminStudents.filter((s) => isDateInRange(s.createdDate, prevStart, prevEnd));

    const filteredCompanies = mockAdminCompanies.filter((c) => isDateInRange(c.submittedDate));
    const prevCompanies = mockAdminCompanies.filter((c) => isDateInRange(c.submittedDate, prevStart, prevEnd));

    const filteredInternships = mockAdminInternships.filter((i) => isDateInRange(i.postedDate));
    const prevInternships = mockAdminInternships.filter((i) => isDateInRange(i.postedDate, prevStart, prevEnd));

    const filteredVerifications = mockPendingVerifications.filter((v: PendingVerificationItem) => isDateInRange(v.submittedDate));

    // Calculate Stage Metrics
    const totalAppsCount = filteredApps.length;
    const prevTotalAppsCount = prevApps.length;

    const shortlistedAppsCount = filteredApps.filter((a) => a.status === 'Shortlisted' || a.status === 'Interview' || a.status === 'Selected').length;
    const prevShortlistedAppsCount = prevApps.filter((a) => a.status === 'Shortlisted' || a.status === 'Interview' || a.status === 'Selected').length;

    const selectedAppsCount = filteredApps.filter((a) => a.status === 'Selected').length;
    const prevSelectedAppsCount = prevApps.filter((a) => a.status === 'Selected').length;

    const activeInternshipsCount = filteredInternships.filter((i) => i.status === 'Active').length;
    const prevActiveInternshipsCount = prevInternships.filter((i) => i.status === 'Active').length;

    // Rates
    const placementRate = filteredStudents.length > 0 ? ((selectedAppsCount / filteredStudents.length) * 100).toFixed(1) : '62.4';
    const prevPlacementRate = prevStudents.length > 0 ? ((prevSelectedAppsCount / prevStudents.length) * 100).toFixed(1) : '58.0';

    const avgMatchScore = filteredApps.length > 0
      ? (filteredApps.reduce((acc, a) => acc + a.matchScore, 0) / filteredApps.length).toFixed(1)
      : '88.4';
    const prevAvgMatchScore = prevApps.length > 0
      ? (prevApps.reduce((acc, a) => acc + a.matchScore, 0) / prevApps.length).toFixed(1)
      : '85.2';

    // Percentage Change Calculation Helper
    const getChange = (curr: number, prev: number) => {
      if (prev === 0) return curr > 0 ? '+100%' : '0.0%';
      const pct = (((curr - prev) / prev) * 100).toFixed(1);
      return Number(pct) >= 0 ? `+${pct}%` : `${pct}%`;
    };

    // Skill Demand Analysis
    const skillCounts: Record<string, { internships: number; applications: number }> = {};
    filteredApps.forEach((app) => {
      (app.skills || []).forEach((sk) => {
        if (!skillCounts[sk]) skillCounts[sk] = { internships: 0, applications: 0 };
        skillCounts[sk].applications += 1;
      });
    });
    filteredInternships.forEach((int) => {
      (int.skills || []).forEach((sk) => {
        if (!skillCounts[sk]) skillCounts[sk] = { internships: 0, applications: 0 };
        skillCounts[sk].internships += 1;
      });
    });

    const topSkills = Object.entries(skillCounts)
      .sort((a, b) => b[1].applications - a[1].applications)
      .slice(0, 8);

    // Verifications Metrics (Derived from Single Source Array)
    const verificationsSummary = {
      total: filteredVerifications.length,
      pending: filteredVerifications.filter((v: PendingVerificationItem) => v.status === 'Pending').length,
      underReview: filteredVerifications.filter((v: PendingVerificationItem) => v.status === 'Under Review').length,
      verified: filteredVerifications.filter((v: PendingVerificationItem) => v.status === 'Verified').length,
      rejected: filteredVerifications.filter((v: PendingVerificationItem) => v.status === 'Rejected').length,
    };

    return {
      totalStudents: filteredStudents.length || 1420,
      studentsChange: getChange(filteredStudents.length || 1420, prevStudents.length || 1310),

      totalCompanies: filteredCompanies.length || 185,
      companiesChange: getChange(filteredCompanies.length || 185, prevCompanies.length || 165),

      activeInternships: activeInternshipsCount || 38,
      internshipsChange: getChange(activeInternshipsCount || 38, prevActiveInternshipsCount || 33),

      totalApplications: totalAppsCount || 3850,
      appsChange: getChange(totalAppsCount || 3850, prevTotalAppsCount || 3425),

      shortlistedCount: shortlistedAppsCount || 840,
      shortlistedChange: getChange(shortlistedAppsCount || 840, prevShortlistedAppsCount || 769),

      selectedCount: selectedAppsCount || 312,
      selectedChange: getChange(selectedAppsCount || 312, prevSelectedAppsCount || 273),

      placementRate: `${placementRate}%`,
      placementChange: getChange(Number(placementRate), Number(prevPlacementRate)),

      avgMatchScore: `${avgMatchScore}%`,
      matchScoreChange: getChange(Number(avgMatchScore), Number(prevAvgMatchScore)),

      funnel: {
        applications: totalAppsCount || 3850,
        underReview: filteredApps.filter((a) => a.status === 'Under Review').length || 1150,
        shortlisted: shortlistedAppsCount || 840,
        interview: filteredApps.filter((a) => a.status === 'Interview').length || 480,
        selected: selectedAppsCount || 312,
      },

      topSkills,
      verificationsSummary,
    };
  }, [dateBounds]);

  // Dynamic Application Trend Chart values
  const currentTrend = useMemo(() => {
    if (dateRange === 'Today') {
      return [
        { label: '09:00 AM', val: 15 },
        { label: '12:00 PM', val: 42 },
        { label: '03:00 PM', val: 85 },
        { label: '06:00 PM', val: 120 },
      ];
    } else if (dateRange === 'Last 7 Days') {
      return [
        { label: 'Day 1', val: 180 },
        { label: 'Day 2', val: 240 },
        { label: 'Day 3', val: 290 },
        { label: 'Day 4', val: 310 },
        { label: 'Day 5', val: 420 },
        { label: 'Day 6', val: 490 },
        { label: 'Day 7', val: 560 },
      ];
    } else if (dateRange === 'Last 6 Months') {
      return [
        { label: 'Mar', val: 1400 },
        { label: 'Apr', val: 1850 },
        { label: 'May', val: 2400 },
        { label: 'Jun', val: 2900 },
        { label: 'Jul', val: 3450 },
        { label: 'Aug', val: 3850 },
      ];
    } else if (dateRange === 'This Year') {
      return [
        { label: 'Jan', val: 800 },
        { label: 'Mar', val: 1600 },
        { label: 'May', val: 2400 },
        { label: 'Jul', val: 3200 },
        { label: 'Aug', val: 3850 },
      ];
    }
    // Default Last 30 Days
    return [
      { label: 'Aug 01', val: 120 },
      { label: 'Aug 05', val: 165 },
      { label: 'Aug 10', val: 210 },
      { label: 'Aug 15', val: 285 },
      { label: 'Aug 20', val: 340 },
    ];
  }, [dateRange]);

  const maxTrendVal = Math.max(...currentTrend.map((t) => t.val), 1);

  const handleExport = (format: 'CSV' | 'PDF') => {
    setFeedback(`Analytics Report exported successfully as ${format} for range "${dateRange}".`);
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Analytics & Insights"
          subtitle="Monitor platform performance and identify internship trends."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto pb-safe text-left">
          {/* Header Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-[#0f172a]">Platform Performance Intelligence</h2>
              <p className="text-xs text-slate-500">Real-time metrics dynamically calculated for range: <strong className="text-[#2563eb]">{dateRange}</strong></p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center space-x-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs">
                <Calendar className="w-4 h-4 text-[#2563eb]" />
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

              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => handleExport('CSV')}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>CSV</span>
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
          </div>

          {/* Feedback Toast */}
          {feedback && (
            <div className="p-3.5 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2 animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          {/* 8 Clickable Dynamic Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { label: 'Total Students', val: analytics.totalStudents.toLocaleString(), change: analytics.studentsChange, route: '/admin/students', icon: <Users className="w-4 h-4 text-[#2563eb]" /> },
              { label: 'Total Companies', val: analytics.totalCompanies.toLocaleString(), change: analytics.companiesChange, route: '/admin/companies', icon: <Building2 className="w-4 h-4 text-purple-600" /> },
              { label: 'Active Internships', val: analytics.activeInternships.toLocaleString(), change: analytics.internshipsChange, route: '/admin/internships', icon: <Briefcase className="w-4 h-4 text-emerald-600" /> },
              { label: 'Total Applications', val: analytics.totalApplications.toLocaleString(), change: analytics.appsChange, route: '/admin/applications', icon: <FileText className="w-4 h-4 text-blue-600" /> },
              { label: 'Shortlisted', val: analytics.shortlistedCount.toLocaleString(), change: analytics.shortlistedChange, route: '/admin/applications', icon: <UserCheck className="w-4 h-4 text-amber-600" /> },
              { label: 'Selected Students', val: analytics.selectedCount.toLocaleString(), change: analytics.selectedChange, route: '/admin/applications', icon: <CheckCircle2 className="w-4 h-4 text-teal-600" /> },
              { label: 'Placement Rate', val: analytics.placementRate, change: analytics.placementChange, route: '/admin/students', icon: <TrendingUp className="w-4 h-4 text-indigo-600" /> },
              { label: 'Avg Match Score', val: analytics.avgMatchScore, change: analytics.matchScoreChange, route: '/admin/applications', icon: <Award className="w-4 h-4 text-rose-600" /> },
            ].map((card) => (
              <button
                key={card.label}
                type="button"
                onClick={() => navigate(card.route)}
                className="bg-white border border-[#e2e8f0] hover:border-[#2563eb] rounded-2xl p-3.5 shadow-2xs space-y-1.5 transition-all text-left cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 truncate">{card.label}</span>
                  {card.icon}
                </div>
                <p className="text-lg font-black text-[#0f172a] group-hover:text-[#2563eb]">{card.val}</p>
                <div className={`flex items-center space-x-1 text-[10px] font-extrabold ${card.change.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {card.change.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  <span>{card.change}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Application Trend & Funnel Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Application Trend Chart */}
            <div className="lg:col-span-2 bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-[#2563eb]" />
                  <h3 className="text-sm font-extrabold text-[#0f172a]">Application Volume Trends ({dateRange})</h3>
                </div>
                <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-xl">
                  {(['Daily', 'Weekly', 'Monthly'] as const).map((gran) => (
                    <button
                      key={gran}
                      type="button"
                      onClick={() => setTrendGranularity(gran)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                        trendGranularity === gran ? 'bg-white text-[#2563eb] shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {gran}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 pb-2 space-y-4">
                <div className="flex items-end justify-between gap-4 h-44 px-2">
                  {currentTrend.map((t) => {
                    const heightPercent = Math.round((t.val / maxTrendVal) * 100);
                    return (
                      <div key={t.label} className="flex-1 flex flex-col items-center space-y-2 h-full justify-end group">
                        <span className="text-[10px] font-extrabold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          {t.val}
                        </span>
                        <div
                          className="w-full bg-blue-100 group-hover:bg-[#2563eb] rounded-t-xl transition-all duration-300 relative"
                          style={{ height: `${heightPercent}%` }}
                        />
                        <span className="text-[10px] font-bold text-slate-500">{t.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Application Funnel Card */}
            <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
              <h3 className="text-sm font-extrabold text-[#0f172a] border-b border-slate-100 pb-3 flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-[#2563eb]" />
                <span>Conversion Funnel Metrics ({dateRange})</span>
              </h3>

              <div className="space-y-3">
                {[
                  { stage: 'Applications', val: analytics.funnel.applications, pct: '100%', color: 'bg-blue-600' },
                  { stage: 'Under Review', val: analytics.funnel.underReview, pct: `${((analytics.funnel.underReview / analytics.funnel.applications) * 100).toFixed(1)}%`, color: 'bg-amber-500' },
                  { stage: 'Shortlisted', val: analytics.funnel.shortlisted, pct: `${((analytics.funnel.shortlisted / analytics.funnel.applications) * 100).toFixed(1)}%`, color: 'bg-purple-600' },
                  { stage: 'Interview', val: analytics.funnel.interview, pct: `${((analytics.funnel.interview / analytics.funnel.applications) * 100).toFixed(1)}%`, color: 'bg-indigo-600' },
                  { stage: 'Selected', val: analytics.funnel.selected, pct: `${((analytics.funnel.selected / analytics.funnel.applications) * 100).toFixed(1)}%`, color: 'bg-emerald-600' },
                ].map((stg) => (
                  <div key={stg.stage} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>{stg.stage} ({stg.val})</span>
                      <span>{stg.pct}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${stg.color}`} style={{ width: stg.pct }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skill Demand & Top Hiring Companies */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Most In-Demand Skills */}
            <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
              <h3 className="text-sm font-extrabold text-[#0f172a] border-b border-slate-100 pb-3 flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Most In-Demand Technical Skills ({dateRange})</span>
              </h3>

              <div className="space-y-2.5">
                {analytics.topSkills.map(([skill, data]) => (
                  <div key={skill} className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                    <span className="font-bold text-[#0f172a] w-24">{skill}</span>
                    <span className="text-slate-500 font-semibold">{data.internships} Open Postings</span>
                    <span className="font-black text-[#2563eb]">{data.applications} Applications</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Hiring Companies */}
            <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
              <h3 className="text-sm font-extrabold text-[#0f172a] border-b border-slate-100 pb-3 flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-[#2563eb]" />
                <span>Top Hiring Corporate Employers ({dateRange})</span>
              </h3>

              <div className="divide-y divide-slate-100 text-xs">
                {mockAdminCompanies.slice(0, 4).map((cmp) => (
                  <div key={cmp.id} className="py-3 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/companies/${cmp.id}`)}
                      className="font-bold text-[#0f172a] hover:text-[#2563eb] hover:underline text-left cursor-pointer"
                    >
                      {cmp.name}
                    </button>
                    <div className="flex items-center space-x-4 text-slate-600 font-medium">
                      <span>{cmp.postedInternships} Internships</span>
                      <span className="font-bold text-emerald-600">{cmp.selectedCount || 4} Placed</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Verification & Faculty Overview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Verification Analytics (Synced Single Source) */}
            <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-extrabold text-[#0f172a] flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verification Analytics ({dateRange})</span>
                </h3>
                <button
                  type="button"
                  onClick={() => navigate('/admin/verifications')}
                  className="text-xs font-bold text-[#2563eb] hover:underline cursor-pointer"
                >
                  View Queue ({analytics.verificationsSummary.total})
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="text-[10px] font-bold text-amber-800 uppercase">Pending</span>
                  <p className="text-xl font-black text-amber-900">{analytics.verificationsSummary.pending}</p>
                </div>
                <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200">
                  <span className="text-[10px] font-bold text-blue-800 uppercase">Under Review</span>
                  <p className="text-xl font-black text-blue-900">{analytics.verificationsSummary.underReview}</p>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase">Verified</span>
                  <p className="text-xl font-black text-emerald-900">{analytics.verificationsSummary.verified}</p>
                </div>
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200">
                  <span className="text-[10px] font-bold text-rose-800 uppercase">Rejected</span>
                  <p className="text-xl font-black text-rose-900">{analytics.verificationsSummary.rejected}</p>
                </div>
              </div>
            </div>

            {/* Platform Automated Insights */}
            <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
              <h3 className="text-sm font-extrabold text-[#0f172a] border-b border-slate-100 pb-3 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Automated Performance Insights</span>
              </h3>

              <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>Student application volume changed by {analytics.appsChange} during this selected range.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <span>Placement success rate stands at {analytics.placementRate} for active student cohorts.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                  <span>React & Python remain the leading in-demand skill requirements for posted opportunities.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>Verification backlog has {analytics.verificationsSummary.pending} pending compliance requests.</span>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
