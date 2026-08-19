import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TPSidebar } from '../../components/tp/TPSidebar';
import { TPHeader } from '../../components/tp/TPHeader';
import {
  mockAdminStudents,
  mockAdminCompanies,
  mockAdminInternships,
  mockAdminApplications,
} from '../../types/adminTypes';
import {
  GraduationCap,
  Building2,
  Briefcase,
  FileText,
  CheckCircle2,
  Calendar,
  Award,
  TrendingUp,
  ChevronRight,
  User,
  Clock,
} from 'lucide-react';

export const TPDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 1. Calculate Summary Cards & Metrics directly from Master Datasets
  const metrics = useMemo(() => {
    const totalStudents = mockAdminStudents.length || 1420;
    const eligibleStudents = Math.round(totalStudents * 0.92); // 92% eligible
    const seekingStudents = mockAdminStudents.filter((s) => s.internshipStatus === 'Seeking' || s.internshipStatus === 'Looking').length;
    const totalApplications = mockAdminApplications.length || 3850;
    const shortlistedApps = mockAdminApplications.filter((a) => a.status === 'Shortlisted').length;
    const interviewApps = mockAdminApplications.filter((a) => a.status === 'Interview').length;
    const selectedApps = mockAdminApplications.filter((a) => a.status === 'Selected');
    const selectedCount = selectedApps.length || 312;
    const placementRate = ((selectedCount / eligibleStudents) * 100).toFixed(1);

    const activeInternships = mockAdminInternships.filter((i) => i.status === 'Active').length || 196;
    const closedInternships = mockAdminInternships.filter((i) => i.status === 'Closed').length;
    const hiringCompanies = mockAdminCompanies.filter((c) => c.verificationStatus === 'Verified').length || 185;

    return {
      totalStudents,
      eligibleStudents,
      notEligibleStudents: totalStudents - eligibleStudents,
      seekingStudents,
      currentlyInterning: Math.round(selectedCount * 0.7),
      completedStudents: Math.round(selectedCount * 0.3),
      totalApplications,
      shortlistedApps,
      interviewApps,
      selectedCount,
      placementRate,
      newApps: mockAdminApplications.filter((a) => a.status === 'New').length,
      underReviewApps: mockAdminApplications.filter((a) => a.status === 'Under Review').length,
      rejectedApps: mockAdminApplications.filter((a) => a.status === 'Rejected').length,
      activeInternships,
      closedInternships,
      hiringCompanies,
    };
  }, []);

  // 2. Upcoming Interviews Slice
  const upcomingInterviews = useMemo(() => {
    return mockAdminApplications
      .filter((a) => a.status === 'Interview' || a.status === 'Shortlisted')
      .slice(0, 4)
      .map((app, idx) => ({
        id: app.id,
        studentName: app.candidateName,
        companyName: app.companyName,
        internshipTitle: app.internshipTitle,
        date: `2${1 + idx} Aug 2026`,
        time: `${10 + idx}:30 AM`,
        type: idx % 2 === 0 ? 'Technical Round' : 'HR Interview',
        status: 'Scheduled',
      }));
  }, []);

  // 3. Recent Activity Stream
  const recentActivities = useMemo(() => {
    return [
      { id: 'act-1', text: `${mockAdminStudents[0].name} accepted internship offer at ${mockAdminCompanies[0].name}`, time: '10 mins ago', type: 'Selected' },
      { id: 'act-2', text: `${mockAdminCompanies[1].name} posted new listing for Software Engineering Intern`, time: '1 hour ago', type: 'Posted' },
      { id: 'act-3', text: `${mockAdminStudents[1].name} shortlisted for Technical Interview at Apex Robotics`, time: '3 hours ago', type: 'Shortlisted' },
      { id: 'act-4', text: `Employer verification approved for ${mockAdminCompanies[2].name}`, time: 'Yesterday', type: 'Verified' },
    ];
  }, []);

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      {/* T&P Responsive Sidebar */}
      <TPSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <TPHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Training & Placement Dashboard"
          subtitle="Monitor student placement progress and internship activities."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto pb-safe text-left">
          {/* Summary Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { label: 'Total Students', val: metrics.totalStudents, icon: <GraduationCap className="w-4 h-4 text-[#2563eb]" /> },
              { label: 'Eligible Students', val: metrics.eligibleStudents, icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" /> },
              { label: 'Seeking Internships', val: metrics.seekingStudents, icon: <User className="w-4 h-4 text-amber-600" /> },
              { label: 'Applications', val: metrics.totalApplications, icon: <FileText className="w-4 h-4 text-blue-600" /> },
              { label: 'Shortlisted', val: metrics.shortlistedApps, icon: <TrendingUp className="w-4 h-4 text-purple-600" /> },
              { label: 'Interviews', val: metrics.interviewApps, icon: <Calendar className="w-4 h-4 text-indigo-600" /> },
              { label: 'Selected', val: metrics.selectedCount, icon: <Award className="w-4 h-4 text-teal-600" /> },
              { label: 'Placement Rate', val: `${metrics.placementRate}%`, icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" /> },
            ].map((card) => (
              <div key={card.label} className="bg-white border border-[#e2e8f0] rounded-2xl p-3 shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 truncate">{card.label}</span>
                  {card.icon}
                </div>
                <p className="text-lg font-black text-[#0f172a]">{typeof card.val === 'number' ? card.val.toLocaleString() : card.val}</p>
              </div>
            ))}
          </div>

          {/* Placement Overview Progress & Status Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Student Placement Overview */}
            <div className="lg:col-span-2 bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-[#0f172a]">Student Placement Overview</h3>
                  <p className="text-xs text-slate-500">Live placement conversion pipeline and progress metrics.</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/tp/students')}
                  className="text-xs font-bold text-[#2563eb] hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <span>View All Students</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Visual Placement Progress Indicator */}
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700">Placement Conversion Rate</span>
                  <span className="text-[#2563eb] font-black text-sm">{metrics.placementRate}%</span>
                </div>
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${metrics.placementRate}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 pt-0.5">
                  Formula: ({metrics.selectedCount.toLocaleString()} Selected ÷ {metrics.eligibleStudents.toLocaleString()} Eligible) × 100
                </p>
              </div>

              {/* Status Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Eligible Students', val: metrics.eligibleStudents },
                  { label: 'Not Eligible', val: metrics.notEligibleStudents },
                  { label: 'Seeking Internship', val: metrics.seekingStudents },
                  { label: 'Currently Interning', val: metrics.currentlyInterning },
                  { label: 'Selected Students', val: metrics.selectedCount },
                  { label: 'Completed Drive', val: metrics.completedStudents },
                ].map((item) => (
                  <div key={item.label} className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-left">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{item.label}</p>
                    <p className="text-base font-black text-[#0f172a] mt-0.5">{item.val.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Overview Box */}
            <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-extrabold text-[#0f172a]">Application Overview</h3>
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
                      onClick={() => navigate('/tp/applications')}
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
                Manage Applications
              </button>
            </div>
          </div>

          {/* Internship & Company Quick Navigation Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <button
              type="button"
              onClick={() => navigate('/tp/internships')}
              className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs hover:border-[#2563eb] transition-all text-left cursor-pointer space-y-1 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wide">Active Internships</span>
                <Briefcase className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-black text-[#0f172a] group-hover:text-[#2563eb]">{metrics.activeInternships}</p>
            </button>

            <button
              type="button"
              onClick={() => navigate('/tp/internships')}
              className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs hover:border-[#2563eb] transition-all text-left cursor-pointer space-y-1 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wide">Upcoming Deadlines</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-2xl font-black text-[#0f172a] group-hover:text-[#2563eb]">18</p>
            </button>

            <button
              type="button"
              onClick={() => navigate('/tp/internships')}
              className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs hover:border-[#2563eb] transition-all text-left cursor-pointer space-y-1 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wide">Closed Listings</span>
                <CheckCircle2 className="w-4 h-4 text-slate-500" />
              </div>
              <p className="text-2xl font-black text-[#0f172a] group-hover:text-[#2563eb]">{metrics.closedInternships}</p>
            </button>

            <button
              type="button"
              onClick={() => navigate('/tp/companies')}
              className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs hover:border-[#2563eb] transition-all text-left cursor-pointer space-y-1 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wide">Companies Hiring</span>
                <Building2 className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-2xl font-black text-[#0f172a] group-hover:text-[#2563eb]">{metrics.hiringCompanies}</p>
            </button>
          </div>

          {/* Upcoming Interviews & Recent Activity Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upcoming Interviews */}
            <div className="lg:col-span-2 bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-[#0f172a]">Upcoming Interviews</h3>
                  <p className="text-xs text-slate-500">Scheduled candidate interviews requiring monitoring.</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/tp/interviews')}
                  className="text-xs font-bold text-[#2563eb] hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <span>View All Interviews</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {upcomingInterviews.map((iv) => (
                  <div key={iv.id} className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 text-left">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold rounded-md">
                        {iv.type}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500">{iv.date} • {iv.time}</span>
                    </div>

                    <div>
                      <p className="text-xs font-extrabold text-[#0f172a]">{iv.studentName}</p>
                      <p className="text-[11px] text-slate-600 font-medium">{iv.internshipTitle} @ <strong className="text-slate-800">{iv.companyName}</strong></p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {iv.status}
                      </span>
                      <button
                        type="button"
                        onClick={() => navigate(`/tp/applications/${iv.id}`)}
                        className="text-xs font-bold text-[#2563eb] hover:underline cursor-pointer"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity Stream */}
            <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-[#0f172a]">Recent Activity</h3>
                <p className="text-xs text-slate-500">Live placement updates stream.</p>
              </div>

              <div className="space-y-3">
                {recentActivities.map((act) => (
                  <div key={act.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-1 text-left">
                    <p className="text-xs font-semibold text-slate-800">{act.text}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium pt-0.5">
                      <span className="font-bold text-[#2563eb] uppercase">{act.type}</span>
                      <span>{act.time}</span>
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
