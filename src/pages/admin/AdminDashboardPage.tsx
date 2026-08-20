import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import type { PendingVerificationItem } from '../../types/adminTypes';
import {
  mockAdminPlatformSummary,
  mockUserManagementCategories,
  mockPendingVerifications,
  mockAdminInternships,
  mockRecentActivities,
} from '../../types/adminTypes';
import {
  Users,
  Building2,
  UserCheck,
  Briefcase,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  X,
  UserPlus,
  ShieldAlert,
  GraduationCap,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Non-blocking Feedback Toast
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Section Refs
  const userMgmtRef = useRef<HTMLDivElement>(null);
  const verificationsRef = useRef<HTMLDivElement>(null);
  const internshipsRef = useRef<HTMLDivElement>(null);
  const applicationsRef = useRef<HTMLDivElement>(null);
  const insightsRef = useRef<HTMLDivElement>(null);

  // Verification List State
  const [pendingVerifications, setPendingVerifications] = useState<PendingVerificationItem[]>(mockPendingVerifications);

  // Rejection Modal State
  const [rejectingCompany, setRejectingCompany] = useState<PendingVerificationItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectError, setRejectError] = useState<string | null>(null);

  // Viewing Company Modal State
  const [viewingCompany, setViewingCompany] = useState<PendingVerificationItem | null>(null);

  // Verify Action
  const handleApproveVerification = (id: string) => {
    const company = pendingVerifications.find((c) => c.id === id);
    setPendingVerifications((prev) => prev.filter((c) => c.id !== id));

    setFeedback({
      type: 'success',
      message: `Employer verification approved for "${company?.name || 'Company'}". Access granted.`,
    });
    setTimeout(() => setFeedback(null), 3500);
  };

  // Confirm Reject Action
  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingCompany) return;
    if (!rejectionReason.trim()) {
      setRejectError('Please provide a specific rejection reason for the employer.');
      return;
    }

    const name = rejectingCompany.name;
    setPendingVerifications((prev) => prev.filter((c) => c.id !== rejectingCompany.id));
    setRejectingCompany(null);
    setRejectionReason('');
    setRejectError(null);

    setFeedback({
      type: 'error',
      message: `Verification dossier for "${name}" rejected. Reason sent to compliance contact.`,
    });
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      {/* Admin Responsive Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Admin Dashboard"
          subtitle="Platform-wide monitoring, user management, and compliance oversight."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto pb-safe">
          {/* Header Sub-bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-[#0f172a]">System Administration & Insights</h2>
              <p className="text-xs text-[#64748b]">
                Real-time operational summary across students, corporate partners, and university mentors.
              </p>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>System Operational (100%)</span>
              </span>
            </div>
          </div>

          {/* Inline Feedback Toast */}
          {feedback && (
            <div
              className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center space-x-2 animate-in fade-in duration-150 text-left ${
                feedback.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* 8 Clickable Summary Cards (2 Columns on Mobile, 4 Columns on Desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-left">
            {[
              { label: 'Total Students', val: mockAdminPlatformSummary.totalStudents, icon: <GraduationCap className="w-4 h-4 text-[#2563eb]" />, route: '/admin/students' },
              { label: 'Total Companies', val: mockAdminPlatformSummary.totalCompanies, icon: <Building2 className="w-4 h-4 text-purple-600" />, route: '/admin/companies' },
              { label: 'Faculty Mentors', val: mockAdminPlatformSummary.totalFacultyMentors, icon: <UserCheck className="w-4 h-4 text-indigo-600" />, route: '/admin/faculty' },
              { label: 'Active Internships', val: mockAdminPlatformSummary.activeInternships, icon: <Briefcase className="w-4 h-4 text-emerald-600" />, route: '/admin/internships' },
              { label: 'Total Applications', val: mockAdminPlatformSummary.totalApplications, icon: <FileText className="w-4 h-4 text-amber-600" />, route: '/admin/applications' },
              { label: 'Pending Verifications', val: pendingVerifications.length, icon: <ShieldCheck className="w-4 h-4 text-rose-600" />, route: '/admin/verifications' },
              { label: 'Selected Students', val: mockAdminPlatformSummary.selectedStudents, icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />, route: '/admin/selected-students' },
              { label: 'Ongoing Internships', val: mockAdminPlatformSummary.ongoingInternships, icon: <Clock className="w-4 h-4 text-blue-600" />, route: '/admin/ongoing-internships' },
            ].map((card) => (
              <button
                key={card.label}
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  navigate(card.route);
                }}
                className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs space-y-1.5 cursor-pointer hover:border-blue-300 hover:shadow-xs transition-all duration-150 transform hover:-translate-y-0.5 text-left w-full focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate">{card.label}</span>
                  {card.icon}
                </div>
                <p className="text-2xl font-black text-[#0f172a]">{card.val}</p>
              </button>
            ))}
          </div>

          {/* Section 1: User Management Overview */}
          <div ref={userMgmtRef} className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4 text-left scroll-mt-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-[#2563eb]" />
                <h3 className="text-sm font-extrabold text-[#0f172a]">User Management Overview</h3>
              </div>
              <button
                type="button"
                onClick={() => navigate('/admin/users')}
                className="text-xs font-bold text-[#2563eb] hover:underline cursor-pointer"
              >
                View All Users
              </button>
            </div>

            {/* User Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {mockUserManagementCategories.map((cat) => (
                <div key={cat.role} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900">{cat.role}</span>
                    <span className="text-xs font-black text-[#2563eb] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      {cat.total}
                    </span>
                  </div>
                  <div className="space-y-1 text-[11px] text-slate-600 font-medium pt-1 border-t border-slate-200/60">
                    <div className="flex justify-between"><span>Active:</span> <strong className="text-emerald-700">{cat.active}</strong></div>
                    <div className="flex justify-between"><span>Pending:</span> <strong className="text-amber-700">{cat.pending}</strong></div>
                    <div className="flex justify-between"><span>Suspended:</span> <strong className="text-rose-700">{cat.suspended}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Pending Company Verifications */}
          <div ref={verificationsRef} className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4 text-left scroll-mt-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-extrabold text-[#0f172a]">
                  Pending Company Verifications ({pendingVerifications.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => navigate('/admin/verifications')}
                className="text-xs font-bold text-[#2563eb] hover:underline cursor-pointer"
              >
                Manage All Verifications
              </button>
            </div>

            {pendingVerifications.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingVerifications.map((comp) => (
                  <div
                    key={comp.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 flex flex-col justify-between hover:border-blue-300 transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                          {comp.status} Approval
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">{comp.submittedDate}</span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                          {comp.avatarInitials}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-[#0f172a] truncate">{comp.name}</h4>
                          <p className="text-xs text-slate-500 truncate">{comp.industry}</p>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-600 space-y-1 pt-1 bg-white p-2.5 rounded-xl border border-slate-100">
                        <div>Location: <strong>{comp.location}</strong></div>
                        <div>CIN: <strong>{comp.cin}</strong></div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-200/60">
                      <button
                        type="button"
                        onClick={() => setViewingCompany(comp)}
                        className="py-1.5 px-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold cursor-pointer text-center"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApproveVerification(comp.id)}
                        className="py-1.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs cursor-pointer text-center"
                      >
                        Verify
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRejectingCompany(comp);
                          setRejectionReason('');
                          setRejectError(null);
                        }}
                        className="py-1.5 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-xs font-bold cursor-pointer text-center"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-xs font-bold text-slate-800">All pending company verifications cleared!</p>
              </div>
            )}
          </div>

          {/* Section 3: Internship Activity & Application Funnel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
            {/* Internship Activity */}
            <div ref={internshipsRef} className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4 scroll-mt-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-[#2563eb]" />
                  <h3 className="text-sm font-extrabold text-[#0f172a]">Internship Activity</h3>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/admin/internships')}
                  className="text-xs font-bold text-[#2563eb] hover:underline cursor-pointer"
                >
                  Manage Postings
                </button>
              </div>

              <div className="space-y-3">
                {mockAdminInternships.map((int) => (
                  <div
                    key={int.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 hover:border-blue-200 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-900">{int.title}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${
                          int.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : int.status === 'Expiring Soon'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : int.status === 'Draft'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {int.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{int.companyName} • {int.location}</span>
                      <strong className="text-slate-800">{int.applicationsCount} Applications</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Funnel */}
            <div ref={applicationsRef} className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4 scroll-mt-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-[#2563eb]" />
                  <h3 className="text-sm font-extrabold text-[#0f172a]">Platform Application Activity</h3>
                </div>
                <span className="text-xs font-semibold text-slate-500">3,850 Total Applications</span>
              </div>

              <div className="space-y-3">
                {[
                  { stage: 'New Applications', count: 3850, percentage: 100 },
                  { stage: 'Under Review', count: 2640, percentage: 68.5 },
                  { stage: 'Shortlisted', count: 980, percentage: 37.1 },
                  { stage: 'Interviews Scheduled', count: 520, percentage: 53.0 },
                  { stage: 'Selected Candidates', count: 312, percentage: 60.0 },
                  { stage: 'Rejected Candidates', count: 1820, percentage: 47.2 },
                ].map((fnl) => (
                  <div key={fnl.stage} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>{fnl.stage}</span>
                      <span>{fnl.count} <span className="text-slate-400 font-normal">({fnl.percentage}%)</span></span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2563eb] rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(fnl.percentage, 8)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Platform Insights & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
            {/* Platform Insights Bar Chart */}
            <div ref={insightsRef} className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4 scroll-mt-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-[#2563eb]" />
                  <h3 className="text-sm font-extrabold text-[#0f172a]">Platform Growth Insights</h3>
                </div>
                <span className="text-xs font-semibold text-[#2563eb] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  Monthly Growth
                </span>
              </div>

              <div className="h-56 flex items-end justify-between gap-4 pt-6 pb-2 px-4 bg-slate-50 rounded-2xl border border-slate-100">
                {[
                  { month: 'Apr', applications: 450 },
                  { month: 'May', applications: 820 },
                  { month: 'Jun', applications: 1240 },
                  { month: 'Jul', applications: 1340 },
                ].map((ins) => {
                  const height = Math.round((ins.applications / 1340) * 100);
                  return (
                    <div key={ins.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <span className="text-[11px] font-bold text-slate-700">{ins.applications}</span>
                      <div
                        className="w-full max-w-[48px] bg-[#2563eb] rounded-t-xl transition-all duration-300 hover:bg-blue-700 shadow-2xs"
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{ins.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Platform Activity Feed */}
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-[#2563eb]" />
                  <h3 className="text-sm font-extrabold text-[#0f172a]">Recent Platform Activity</h3>
                </div>
                <span className="text-xs font-semibold text-slate-500">Live Event Feed</span>
              </div>

              <div className="space-y-3">
                {mockRecentActivities.map((act) => (
                  <div key={act.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start space-x-3 text-xs">
                    <div className="p-2 rounded-lg bg-blue-50 text-[#2563eb] shrink-0 mt-0.5 border border-blue-200">
                      {act.type === 'company_register' && <Building2 className="w-3.5 h-3.5" />}
                      {act.type === 'student_profile' && <UserPlus className="w-3.5 h-3.5" />}
                      {act.type === 'internship_posted' && <Briefcase className="w-3.5 h-3.5" />}
                      {act.type === 'company_verified' && <ShieldCheck className="w-3.5 h-3.5" />}
                      {act.type === 'candidate_shortlisted' && <UserCheck className="w-3.5 h-3.5" />}
                      {act.type === 'candidate_selected' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-800 leading-snug">{act.description}</p>
                      <span className="text-[10px] font-medium text-slate-400">{act.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Reject Verification Modal with Reason Input */}
      {rejectingCompany && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-xl text-left space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 shrink-0">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0f172a]">Reject Company Verification</h3>
                <p className="text-xs text-slate-500">{rejectingCompany.name}</p>
              </div>
            </div>

            <form onSubmit={handleConfirmReject} className="space-y-3 text-xs font-medium">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">
                  Rejection Reason <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Blurry CIN registration certificate uploaded. Please re-upload legible original scan."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-slate-900 focus:outline-none ${
                    rejectError ? 'border-rose-500' : 'border-slate-300 focus:border-[#2563eb]'
                  }`}
                  required
                />
                {rejectError && <p className="text-[11px] text-rose-600 font-semibold">{rejectError}</p>}
              </div>

              <div className="flex justify-end space-x-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRejectingCompany(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-2xs cursor-pointer"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Company Details Modal */}
      {viewingCompany && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-xl text-left space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                  {viewingCompany.avatarInitials}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0f172a]">{viewingCompany.name}</h3>
                  <p className="text-xs text-slate-500">{viewingCompany.industry}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingCompany(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-medium text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div><strong>Official Email:</strong> {viewingCompany.email}</div>
              <div><strong>Registration / CIN:</strong> {viewingCompany.cin}</div>
              <div><strong>Headquarters:</strong> {viewingCompany.location}</div>
              <div><strong>Dossier Submitted:</strong> {viewingCompany.submittedDate}</div>
              <div><strong>Current Status:</strong> <span className="font-bold text-amber-700">{viewingCompany.status}</span></div>
            </div>

            <div className="flex justify-end space-x-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setViewingCompany(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handleApproveVerification(viewingCompany.id);
                  setViewingCompany(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs cursor-pointer"
              >
                Verify Company
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
