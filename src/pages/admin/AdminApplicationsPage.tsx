import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import type { AdminApplicationItem } from '../../types/adminTypes';
import { mockAdminApplications } from '../../types/adminTypes';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  UserCheck,
  AlertOctagon,
  ArrowUpDown,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  AlertTriangle,
  Building2,
  FileText,
} from 'lucide-react';

export const AdminApplicationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [applications, setApplications] = useState<AdminApplicationItem[]>(mockAdminApplications);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filter States
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [internshipFilter, setInternshipFilter] = useState<string>('All');
  const [companyFilter, setCompanyFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highestMatch' | 'lowestMatch'>('newest');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals State
  const [rejectingApp, setRejectingApp] = useState<AdminApplicationItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectError, setRejectError] = useState<string | null>(null);

  const [selectingApp, setSelectingApp] = useState<AdminApplicationItem | null>(null);

  const appListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Multi-Filter & Search Logic
  const filteredApps = applications.filter((app) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      app.candidateName.toLowerCase().includes(searchLower) ||
      app.studentEmail.toLowerCase().includes(searchLower) ||
      app.internshipTitle.toLowerCase().includes(searchLower) ||
      app.companyName.toLowerCase().includes(searchLower);

    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    const matchesInternship = internshipFilter === 'All' || app.internshipTitle === internshipFilter;
    const matchesCompany = companyFilter === 'All' || app.companyName === companyFilter;

    return matchesSearch && matchesStatus && matchesInternship && matchesCompany;
  });

  // Sort Logic
  const sortedApps = [...filteredApps].sort((a, b) => {
    if (sortBy === 'newest') return b.appliedDate > a.appliedDate ? 1 : -1;
    if (sortBy === 'oldest') return a.appliedDate > b.appliedDate ? 1 : -1;
    if (sortBy === 'highestMatch') return b.matchScore - a.matchScore;
    if (sortBy === 'lowestMatch') return a.matchScore - b.matchScore;
    return 0;
  });

  // Pagination Math
  const totalPages = Math.max(Math.ceil(sortedApps.length / itemsPerPage), 1);
  const paginatedApps = sortedApps.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCardFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
    if (appListRef.current) {
      appListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setInternshipFilter('All');
    setCompanyFilter('All');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const handleUpdateStatus = (id: string, newStatus: AdminApplicationItem['status']) => {
    const app = applications.find((a) => a.id === id);
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    setFeedback({
      type: 'success',
      message: `Application for "${app?.candidateName}" updated to ${newStatus}.`,
    });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingApp) return;
    if (!rejectionReason.trim()) {
      setRejectError('Please enter a reason for rejecting this application.');
      return;
    }
    const candName = rejectingApp.candidateName;
    setApplications((prev) =>
      prev.map((a) =>
        a.id === rejectingApp.id
          ? {
              ...a,
              status: 'Rejected',
              rejectionReason,
            }
          : a
      )
    );
    setRejectingApp(null);
    setRejectionReason('');
    setRejectError(null);
    setFeedback({ type: 'error', message: `Application for "${candName}" marked as Rejected.` });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleConfirmSelect = () => {
    if (!selectingApp) return;
    const candName = selectingApp.candidateName;
    setApplications((prev) =>
      prev.map((a) => (a.id === selectingApp.id ? { ...a, status: 'Selected' } : a))
    );
    setSelectingApp(null);
    setFeedback({ type: 'success', message: `Candidate "${candName}" has been Selected for placement!` });
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Applications Management"
          subtitle="Monitor and manage internship applications across the platform."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto pb-safe text-left">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-[#0f172a]">Application Pipeline Hub</h2>
              <p className="text-xs text-slate-500">
                3,850 total candidate applications across all internship postings
              </p>
            </div>
            {(statusFilter !== 'All' || internshipFilter !== 'All' || companyFilter !== 'All' || search) && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold shrink-0 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear Filters</span>
              </button>
            )}
          </div>

          {/* Toast Notification */}
          {feedback && (
            <div
              className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center space-x-2 animate-in fade-in duration-150 ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
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

          {/* 7 Clickable Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { label: 'Total Apps', val: '3,850', status: 'All', icon: <FileText className="w-4 h-4 text-[#2563eb]" /> },
              { label: 'New', val: '420', status: 'New', icon: <Clock className="w-4 h-4 text-blue-600" /> },
              { label: 'Under Review', val: '1,150', status: 'Under Review', icon: <Clock className="w-4 h-4 text-amber-600" /> },
              { label: 'Shortlisted', val: '840', status: 'Shortlisted', icon: <UserCheck className="w-4 h-4 text-purple-600" /> },
              { label: 'Interview', val: '480', status: 'Interview', icon: <UserCheck className="w-4 h-4 text-indigo-600" /> },
              { label: 'Selected', val: '312', status: 'Selected', icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" /> },
              { label: 'Rejected', val: '648', status: 'Rejected', icon: <ShieldAlert className="w-4 h-4 text-rose-600" /> },
            ].map((card) => (
              <button
                key={card.label}
                type="button"
                onClick={() => handleCardFilter(card.status)}
                className={`bg-white border rounded-2xl p-3.5 shadow-2xs space-y-1.5 cursor-pointer transition-all duration-150 text-left w-full focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 ${
                  statusFilter === card.status ? 'border-[#2563eb] ring-2 ring-[#2563eb]/20 bg-blue-50/20' : 'border-[#e2e8f0] hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 truncate">{card.label}</span>
                  {card.icon}
                </div>
                <p className="text-xl font-black text-[#0f172a]">{card.val}</p>
              </button>
            ))}
          </div>

          {/* Filters & Multi-Search Toolbar */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search candidate, email, title, company..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#2563eb]"
              />
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600">
                <Filter className="w-3.5 h-3.5 text-[#2563eb]" />
                <span>Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs text-slate-800 font-bold focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview">Interview</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600">
                <span>Company:</span>
                <select
                  value={companyFilter}
                  onChange={(e) => {
                    setCompanyFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs text-slate-800 font-bold focus:outline-none"
                >
                  <option value="All">All Companies</option>
                  <option value="TechNova Solutions">TechNova Solutions</option>
                  <option value="CloudMatrix Inc.">CloudMatrix Inc.</option>
                </select>
              </div>

              <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600 pl-2 border-l border-slate-200">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#2563eb]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs text-slate-800 font-bold focus:outline-none"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="highestMatch">Highest Match</option>
                  <option value="lowestMatch">Lowest Match</option>
                </select>
              </div>
            </div>
          </div>

          {/* Applications List Table / Mobile Cards */}
          <div ref={appListRef} className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4 scroll-mt-6">
            {paginatedApps.length > 0 ? (
              <>
                {/* Desktop View Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-xs font-medium border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                        <th className="py-3 px-4">Candidate</th>
                        <th className="py-3 px-4">Internship Title</th>
                        <th className="py-3 px-4">Company</th>
                        <th className="py-3 px-4">Applied Date</th>
                        <th className="py-3 px-4">Match Score</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedApps.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-4">
                            <button
                              type="button"
                              onClick={() => navigate(`/admin/students/${app.studentId}`)}
                              className="flex items-center space-x-3 text-left group cursor-pointer"
                            >
                              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                                {app.avatarInitials}
                              </div>
                              <div>
                                <p className="font-bold text-[#0f172a] group-hover:text-[#2563eb] group-hover:underline">
                                  {app.candidateName}
                                </p>
                                <p className="text-[11px] text-slate-400">{app.studentEmail}</p>
                              </div>
                            </button>
                          </td>
                          <td className="py-3.5 px-4">
                            <button
                              type="button"
                              onClick={() => navigate(`/admin/internships/${app.internshipId}`)}
                              className="font-bold text-slate-800 hover:text-[#2563eb] hover:underline text-left cursor-pointer"
                            >
                              {app.internshipTitle}
                            </button>
                          </td>
                          <td className="py-3.5 px-4">
                            <button
                              type="button"
                              onClick={() => navigate(`/admin/companies/${app.companyId}`)}
                              className="font-semibold text-slate-700 hover:text-[#2563eb] hover:underline flex items-center space-x-1 cursor-pointer"
                            >
                              <Building2 className="w-3.5 h-3.5 text-slate-400" />
                              <span>{app.companyName}</span>
                            </button>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 font-semibold">{app.appliedDate}</td>
                          <td className="py-3.5 px-4">
                            <div className="space-y-1 w-24">
                              <div className="flex justify-between text-[10px] font-bold text-slate-700">
                                <span>Match</span>
                                <span>{app.matchScore}%</span>
                              </div>
                              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    app.matchScore >= 90 ? 'bg-emerald-500' : app.matchScore >= 75 ? 'bg-[#2563eb]' : 'bg-amber-500'
                                  }`}
                                  style={{ width: `${app.matchScore}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                                app.status === 'Selected'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : app.status === 'Interview'
                                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                  : app.status === 'Shortlisted'
                                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                                  : app.status === 'Under Review'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : app.status === 'Rejected'
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : 'bg-blue-50 text-blue-700 border-blue-200'
                              }`}
                            >
                              {app.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-1">
                            <button
                              type="button"
                              onClick={() => navigate(`/admin/applications/${app.id}`)}
                              className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                            >
                              View
                            </button>
                            {app.status === 'New' && (
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(app.id, 'Under Review')}
                                className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 text-xs font-bold rounded-xl cursor-pointer"
                              >
                                Review
                              </button>
                            )}
                            {app.status === 'Under Review' && (
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(app.id, 'Shortlisted')}
                                className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 text-xs font-bold rounded-xl cursor-pointer"
                              >
                                Shortlist
                              </button>
                            )}
                            {app.status === 'Shortlisted' && (
                              <button
                                type="button"
                                onClick={() => navigate('/company/interviews')}
                                className="px-2.5 py-1 bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-bold rounded-xl shadow-2xs cursor-pointer"
                              >
                                Interview
                              </button>
                            )}
                            {app.status === 'Interview' && (
                              <button
                                type="button"
                                onClick={() => setSelectingApp(app)}
                                className="px-2.5 py-1 bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold rounded-xl shadow-2xs cursor-pointer"
                              >
                                Select
                              </button>
                            )}
                            {app.status !== 'Rejected' && app.status !== 'Selected' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setRejectingApp(app);
                                  setRejectionReason('');
                                  setRejectError(null);
                                }}
                                className="px-2 py-1 bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 text-xs font-bold rounded-xl cursor-pointer"
                              >
                                Reject
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View Stacked Cards */}
                <div className="grid grid-cols-1 gap-3 md:hidden">
                  {paginatedApps.map((app) => (
                    <div key={app.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#0f172a]">{app.candidateName}</span>
                        <span className="font-bold text-emerald-700">{app.status}</span>
                      </div>
                      <p className="text-slate-500">{app.internshipTitle} • {app.companyName}</p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="font-semibold text-slate-700">Match: {app.matchScore}%</span>
                        <button
                          onClick={() => navigate(`/admin/applications/${app.id}`)}
                          className="px-3 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-500">
                    Showing {(currentPage - 1) * itemsPerPage + 1}–
                    {Math.min(currentPage * itemsPerPage, sortedApps.length)} of {sortedApps.length} applications
                  </span>

                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                      <button
                        key={pg}
                        type="button"
                        onClick={() => setCurrentPage(pg)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer ${
                          currentPage === pg ? 'bg-[#2563eb] text-white shadow-2xs' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {pg}
                      </button>
                    ))}

                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="py-12 text-center bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                <AlertOctagon className="w-8 h-8 text-slate-400 mx-auto" />
                <div>
                  <p className="text-sm font-bold text-slate-800">No applications found</p>
                  <p className="text-xs text-slate-500">Try changing your filters or search terms.</p>
                </div>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-[#2563eb] text-white rounded-xl text-xs font-semibold hover:bg-blue-700 cursor-pointer shadow-2xs"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Reject Modal */}
      {rejectingApp && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-xl text-left space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 shrink-0">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0f172a]">Reject Candidate Application</h3>
                <p className="text-xs text-slate-500">{rejectingApp.candidateName}</p>
              </div>
            </div>

            <form onSubmit={handleConfirmReject} className="space-y-3 text-xs font-medium">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">
                  Rejection Reason <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Candidate skills do not meet minimum tech stack criteria."
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
                  onClick={() => setRejectingApp(null)}
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

      {/* Select Modal */}
      {selectingApp && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-xl text-left space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-[#2563eb]">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 shrink-0">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0f172a]">Confirm Candidate Selection</h3>
                <p className="text-xs text-slate-500">{selectingApp.candidateName}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Are you sure you want to select {selectingApp.candidateName} for {selectingApp.internshipTitle} at {selectingApp.companyName}?
            </p>

            <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectingApp(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSelect}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs cursor-pointer"
              >
                Confirm Selection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
