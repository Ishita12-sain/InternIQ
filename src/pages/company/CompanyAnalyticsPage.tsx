import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompanySidebar } from '../../components/company/CompanySidebar';
import { CompanyHeader } from '../../components/company/CompanyHeader';
import {
  ArrowLeft,
  BarChart3,
  Users,
  UserCheck,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Download,
  Filter,
  ArrowRight,
  Briefcase,
  Star,
  Award,
  Sparkles,
  ArrowUpDown,
} from 'lucide-react';

export interface SkillDemandItem {
  skill: string;
  applicantsCount: number;
  internshipsRequired: number;
  matchPercentage: number;
}

export interface CandidateRankItem {
  rank: number;
  candidateName: string;
  avatarInitials: string;
  internshipTitle: string;
  matchScore: number;
  status: string;
  college: string;
  applicantId: string;
}

export interface InternshipPerformanceItem {
  id: string;
  title: string;
  applications: number;
  shortlisted: number;
  interviews: number;
  selected: number;
  selectionRate: number;
  avgMatchScore: number;
}

export const CompanyAnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filters State
  const [selectedInternship, setSelectedInternship] = useState<string>('All Internships');
  const [dateRange, setDateRange] = useState<'Last 7 Days' | 'Last 30 Days' | 'Last 3 Months' | 'All Time'>('Last 30 Days');

  // Performance Table Sorting state
  const [sortField, setSortField] = useState<'applications' | 'selectionRate' | 'avgMatchScore'>('applications');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // References for Smooth Scrolling
  const funnelRef = useRef<HTMLDivElement>(null);
  const trendRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const matchDistRef = useRef<HTMLDivElement>(null);
  const topCandidatesRef = useRef<HTMLDivElement>(null);
  const performanceTableRef = useRef<HTMLDivElement>(null);

  // Mock Internship Options
  const internshipOptions = [
    'All Internships',
    'Software Engineering Intern — Google',
    'Frontend Developer Intern — TechNova',
    'Backend Developer Intern — TechNova',
    'UI/UX Design Intern — TechNova',
    'Data Science & AI Intern — TechNova',
  ];

  // 1. Funnel Data
  const funnelData = [
    { stage: 'Applications', count: 184, conversion: 100, color: 'bg-blue-600 text-white' },
    { stage: 'Under Review', count: 126, conversion: 68.5, color: 'bg-indigo-600 text-white' },
    { stage: 'Shortlisted', count: 58, conversion: 46.0, color: 'bg-purple-600 text-white' },
    { stage: 'Interview', count: 32, conversion: 55.1, color: 'bg-amber-500 text-white' },
    { stage: 'Selected', count: 14, conversion: 43.8, color: 'bg-emerald-600 text-white' },
  ];

  // 2. Application Trend Data (Mock for Last 30 Days / Date Range)
  const trendData = [
    { period: 'Week 1', count: 34 },
    { period: 'Week 2', count: 52 },
    { period: 'Week 3', count: 61 },
    { period: 'Week 4', count: 37 },
  ];
  const maxTrendValue = Math.max(...trendData.map((d) => d.count), 1);

  // 3. Skill Demand Data
  const skillDemandList: SkillDemandItem[] = [
    { skill: 'React', applicantsCount: 142, internshipsRequired: 4, matchPercentage: 92 },
    { skill: 'JavaScript', applicantsCount: 168, internshipsRequired: 5, matchPercentage: 88 },
    { skill: 'TypeScript', applicantsCount: 115, internshipsRequired: 3, matchPercentage: 85 },
    { skill: 'Node.js', applicantsCount: 98, internshipsRequired: 3, matchPercentage: 81 },
    { skill: 'Python', applicantsCount: 86, internshipsRequired: 2, matchPercentage: 79 },
    { skill: 'SQL', applicantsCount: 120, internshipsRequired: 4, matchPercentage: 84 },
    { skill: 'Docker', applicantsCount: 54, internshipsRequired: 2, matchPercentage: 72 },
    { skill: 'AWS', applicantsCount: 48, internshipsRequired: 2, matchPercentage: 68 },
  ];

  // 4. Candidate Match Distribution
  const matchDistribution = [
    { category: '90–100% Excellent', count: 48, percentage: 26, color: 'bg-emerald-500 text-emerald-700' },
    { category: '75–89% Good', count: 82, percentage: 45, color: 'bg-blue-500 text-blue-700' },
    { category: '60–74% Moderate', count: 38, percentage: 21, color: 'bg-amber-500 text-amber-700' },
    { category: 'Below 60% Low', count: 16, percentage: 8, color: 'bg-slate-400 text-slate-700' },
  ];

  // 5. Top Ranked Candidates
  const topCandidates: CandidateRankItem[] = [
    { rank: 1, candidateName: 'Aarav Sharma', avatarInitials: 'AS', internshipTitle: 'Frontend Developer Intern', matchScore: 94, status: 'Selected', college: 'IIT Bombay', applicantId: 'app-1' },
    { rank: 2, candidateName: 'Ananya Verma', avatarInitials: 'AV', internshipTitle: 'UI/UX Design Intern', matchScore: 96, status: 'Selected', college: 'NID Ahmedabad', applicantId: 'app-4' },
    { rank: 3, candidateName: 'Priya Patel', avatarInitials: 'PP', internshipTitle: 'Backend Developer Intern', matchScore: 91, status: 'Interview', college: 'COEP Pune', applicantId: 'app-2' },
    { rank: 4, candidateName: 'Rohan Mehta', avatarInitials: 'RM', internshipTitle: 'Frontend Developer Intern', matchScore: 88, status: 'Shortlisted', college: 'VIT Vellore', applicantId: 'app-3' },
    { rank: 5, candidateName: 'Kabir Das', avatarInitials: 'KD', internshipTitle: 'Backend Developer Intern', matchScore: 82, status: 'Under Review', college: 'BITS Pilani', applicantId: 'app-5' },
  ];

  // 6. Internship Performance List
  const internshipPerformanceList: InternshipPerformanceItem[] = [
    { id: 'int-m1', title: 'Frontend Developer Intern', applications: 78, shortlisted: 24, interviews: 14, selected: 6, selectionRate: 7.7, avgMatchScore: 89 },
    { id: 'int-m2', title: 'Backend Developer Intern', applications: 54, shortlisted: 16, interviews: 9, selected: 4, selectionRate: 7.4, avgMatchScore: 85 },
    { id: 'int-m3', title: 'UI/UX Design Intern', applications: 32, shortlisted: 12, interviews: 6, selected: 3, selectionRate: 9.3, avgMatchScore: 92 },
    { id: 'int-m5', title: 'Data Science & AI Intern', applications: 20, shortlisted: 6, interviews: 3, selected: 1, selectionRate: 5.0, avgMatchScore: 82 },
  ];

  // Sorted Internship Performance Calculation
  const sortedPerformance = [...internshipPerformanceList].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (sortOrder === 'asc') return valA > valB ? 1 : -1;
    return valA < valB ? 1 : -1;
  });

  // Handle Export CSV
  const handleExportCSV = () => {
    const headers = ['Internship Title', 'Applications', 'Shortlisted', 'Interviews', 'Selected', 'Selection Rate (%)', 'Avg Match Score (%)'];
    const rows = sortedPerformance.map((item) => [
      `"${item.title}"`,
      item.applications,
      item.shortlisted,
      item.interviews,
      item.selected,
      item.selectionRate,
      item.avgMatchScore,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `InternIQ_Recruitment_Analytics_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setFeedback({ type: 'success', message: 'Recruitment analytics report exported as CSV successfully!' });
    setTimeout(() => setFeedback(null), 3500);
  };

  // Card Click Scroll Handler
  const handleCardScroll = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <CompanySidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <CompanyHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Recruitment Analytics"
          subtitle="Track applications, hiring performance and candidate insights."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto pb-safe">
          {/* Header Bar with Export Button */}
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
                <h2 className="text-xl font-extrabold text-[#0f172a]">Recruitment Analytics</h2>
                <p className="text-xs text-[#64748b]">Real-time hiring metrics, skill demand, and application trends</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Export Report (CSV)</span>
            </button>
          </div>

          {/* Inline Feedback Banner */}
          {feedback && (
            <div
              className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center space-x-2 animate-in fade-in duration-150 text-left ${
                feedback.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Filters Bar: Internship Selector & Date Range Filter */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4 text-left">
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <Briefcase className="w-4 h-4 text-[#2563eb] shrink-0" />
              <select
                value={selectedInternship}
                onChange={(e) => setSelectedInternship(e.target.value)}
                className="w-full md:w-72 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#2563eb]"
              >
                {internshipOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Filter Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              <Filter className="w-4 h-4 text-[#2563eb] shrink-0 mr-1" />
              {(['Last 7 Days', 'Last 30 Days', 'Last 3 Months', 'All Time'] as const).map((rng) => (
                <button
                  key={rng}
                  type="button"
                  onClick={() => setDateRange(rng)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                    dateRange === rng ? 'bg-[#2563eb] text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {rng}
                </button>
              ))}
            </div>
          </div>

          {/* 6 Clickable Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-left">
            {[
              { label: 'Total Applications', val: '184', icon: <Users className="w-4 h-4 text-[#2563eb]" />, ref: funnelRef },
              { label: 'Shortlisted', val: '58', icon: <UserCheck className="w-4 h-4 text-purple-600" />, ref: funnelRef },
              { label: 'Interviews', val: '32', icon: <Calendar className="w-4 h-4 text-amber-600" />, ref: funnelRef },
              { label: 'Selected', val: '14', icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />, ref: funnelRef },
              { label: 'Selection Rate', val: '7.6%', icon: <TrendingUp className="w-4 h-4 text-emerald-600" />, ref: performanceTableRef },
              { label: 'Avg Match Score', val: '86.4%', icon: <Sparkles className="w-4 h-4 text-[#2563eb]" />, ref: matchDistRef },
            ].map((card) => (
              <div
                key={card.label}
                onClick={() => handleCardScroll(card.ref)}
                className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs space-y-1.5 cursor-pointer hover:border-blue-300 hover:shadow-xs transition-all duration-150 transform hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate">{card.label}</span>
                  {card.icon}
                </div>
                <p className="text-2xl font-black text-[#0f172a]">{card.val}</p>
              </div>
            ))}
          </div>

          {/* Hiring Funnel & Application Trend */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
            {/* Application Funnel */}
            <div ref={funnelRef} className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4 scroll-mt-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-[#2563eb]" />
                  <h3 className="text-sm font-extrabold text-[#0f172a]">Hiring Application Funnel</h3>
                </div>
                <span className="text-xs font-semibold text-slate-500">184 Total Pipeline</span>
              </div>

              <div className="space-y-3 pt-2">
                {funnelData.map((item, idx) => (
                  <div key={item.stage} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>{item.stage}</span>
                      <span>
                        {item.count} candidates <span className="text-slate-400 font-normal">({item.conversion}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-8 bg-slate-100 rounded-xl overflow-hidden relative flex items-center p-1">
                      <div
                        className={`h-full rounded-lg transition-all duration-500 ${item.color}`}
                        style={{ width: `${Math.max(item.conversion, 12)}%` }}
                      />
                    </div>
                    {idx < funnelData.length - 1 && (
                      <div className="flex justify-center my-0.5">
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 rotate-90" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Application Trend Chart */}
            <div ref={trendRef} className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4 scroll-mt-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-[#2563eb]" />
                  <h3 className="text-sm font-extrabold text-[#0f172a]">Application Volume Trend</h3>
                </div>
                <span className="text-xs font-semibold text-[#2563eb] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  {dateRange}
                </span>
              </div>

              {/* Visual Bar Chart */}
              <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-4 bg-slate-50 rounded-2xl border border-slate-100">
                {trendData.map((d) => {
                  const heightPercent = Math.round((d.count / maxTrendValue) * 100);
                  return (
                    <div key={d.period} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <span className="text-[11px] font-bold text-slate-700">{d.count}</span>
                      <div
                        className="w-full max-w-[48px] bg-[#2563eb] rounded-t-xl transition-all duration-300 hover:bg-blue-700 shadow-2xs"
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{d.period}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Skill Demand & Candidate Quality Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
            {/* Skill Demand */}
            <div ref={skillsRef} className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4 scroll-mt-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-[#2563eb]" />
                  <h3 className="text-sm font-extrabold text-[#0f172a]">Most Requested Skills</h3>
                </div>
                <span className="text-xs font-semibold text-slate-500">Applicant Skill Proficiency</span>
              </div>

              <div className="space-y-3">
                {skillDemandList.map((sk) => (
                  <div key={sk.skill} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                      <span className="text-[#2563eb]">{sk.skill}</span>
                      <span>
                        {sk.applicantsCount} Applicants • {sk.matchPercentage}% Avg Match
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#2563eb] h-full rounded-full" style={{ width: `${sk.matchPercentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Candidate Quality Distribution */}
            <div ref={matchDistRef} className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4 scroll-mt-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#2563eb]" />
                  <h3 className="text-sm font-extrabold text-[#0f172a]">Candidate Match Distribution</h3>
                </div>
                <span className="text-xs font-semibold text-slate-500">AI Scoring Range</span>
              </div>

              <div className="space-y-3.5 pt-1">
                {matchDistribution.map((dist) => (
                  <div key={dist.category} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                      <span>{dist.category}</span>
                      <span>
                        {dist.count} candidates ({dist.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${dist.color}`} style={{ width: `${dist.percentage * 2}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Useful Hiring Insights Cards */}
              <div className="pt-2 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Automated Hiring Insights</h4>
                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 space-y-1 font-medium">
                  <p>✨ <strong>Highest Performing:</strong> Frontend Developer Intern position receives the highest 94% quality applicants.</p>
                  <p>✨ <strong>Skill Alignment:</strong> React & TypeScript appear in 85%+ of shortlisted candidate profiles.</p>
                  <p>✨ <strong>Conversion Rate:</strong> Candidates scoring 85%+ overall match have a 3.4x higher interview pass rate.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ranked Top Candidates */}
          <div ref={topCandidatesRef} className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4 text-left scroll-mt-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-extrabold text-[#0f172a]">Top Ranked Candidate Pipeline</h3>
              </div>
              <button
                type="button"
                onClick={() => navigate('/company/applicants')}
                className="text-xs font-bold text-[#2563eb] hover:underline"
              >
                View All Applicants
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {topCandidates.map((cand) => (
                <div
                  key={cand.rank}
                  onClick={() => navigate('/company/applicants')}
                  className="py-3.5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/80 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-blue-50 text-[#2563eb] font-black text-xs flex items-center justify-center shrink-0 border border-blue-200">
                      #{cand.rank}
                    </span>
                    <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center shrink-0">
                      {cand.avatarInitials}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-[#0f172a] truncate">{cand.candidateName}</h4>
                      <p className="text-xs text-slate-500 truncate">
                        {cand.internshipTitle} • {cand.college}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black">
                      {cand.matchScore}% Match
                    </span>
                    <span className="text-xs font-semibold text-slate-600 hidden sm:inline-block">{cand.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Internship Performance Table */}
          <div ref={performanceTableRef} className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4 text-left scroll-mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-[#2563eb]" />
                <h3 className="text-sm font-extrabold text-[#0f172a]">Internship Performance Table</h3>
              </div>

              {/* Sort Controls */}
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#2563eb]" />
                <span>Sort by:</span>
                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs text-slate-800 font-bold focus:outline-none"
                >
                  <option value="applications">Applications</option>
                  <option value="selectionRate">Selection Rate</option>
                  <option value="avgMatchScore">Avg Match Score</option>
                </select>

                <button
                  type="button"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold"
                >
                  {sortOrder.toUpperCase()}
                </button>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs font-medium border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="py-3 px-4">Internship Position</th>
                    <th className="py-3 px-4">Applications</th>
                    <th className="py-3 px-4">Shortlisted</th>
                    <th className="py-3 px-4">Interviews</th>
                    <th className="py-3 px-4">Selected</th>
                    <th className="py-3 px-4">Selection Rate</th>
                    <th className="py-3 px-4">Avg Match</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedPerformance.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#0f172a]">{item.title}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">{item.applications}</td>
                      <td className="py-3.5 px-4 text-purple-700 font-semibold">{item.shortlisted}</td>
                      <td className="py-3.5 px-4 text-amber-700 font-semibold">{item.interviews}</td>
                      <td className="py-3.5 px-4 text-emerald-700 font-bold">{item.selected}</td>
                      <td className="py-3.5 px-4 font-bold text-[#2563eb]">{item.selectionRate}%</td>
                      <td className="py-3.5 px-4 font-extrabold text-emerald-600">{item.avgMatchScore}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Card View */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {sortedPerformance.map((item) => (
                <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <h4 className="font-bold text-[#0f172a]">{item.title}</h4>
                  <div className="grid grid-cols-2 gap-2 text-slate-600">
                    <div>Applications: <strong className="text-slate-900">{item.applications}</strong></div>
                    <div>Shortlisted: <strong className="text-purple-700">{item.shortlisted}</strong></div>
                    <div>Interviews: <strong className="text-amber-700">{item.interviews}</strong></div>
                    <div>Selected: <strong className="text-emerald-700">{item.selected}</strong></div>
                    <div>Selection Rate: <strong className="text-[#2563eb]">{item.selectionRate}%</strong></div>
                    <div>Avg Match: <strong className="text-emerald-600">{item.avgMatchScore}%</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
