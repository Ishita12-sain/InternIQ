import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import type { AdminInternshipItem } from '../../types/adminTypes';
import { mockAdminInternships } from '../../types/adminTypes';
import {
  Search,
  Filter,
  Briefcase,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertOctagon,
  ArrowUpDown,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  AlertTriangle,
} from 'lucide-react';

export const AdminInternshipsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [internships, setInternships] = useState<AdminInternshipItem[]>(mockAdminInternships);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filter States
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [workModeFilter, setWorkModeFilter] = useState<string>('All');
  const [industryFilter, setIndustryFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'applications' | 'deadline' | 'stipend'>('newest');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals State
  const [rejectingInternship, setRejectingInternship] = useState<AdminInternshipItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectError, setRejectError] = useState<string | null>(null);

  const [closingInternship, setClosingInternship] = useState<AdminInternshipItem | null>(null);

  const internshipListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Multi-Filter & Search Logic
  const filteredInternships = internships.filter((item) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(searchLower) ||
      item.companyName.toLowerCase().includes(searchLower) ||
      item.location.toLowerCase().includes(searchLower) ||
      (item.skills && item.skills.some((sk) => sk.toLowerCase().includes(searchLower)));

    const matchesStatus =
      statusFilter === 'All'
        ? true
        : statusFilter === 'Closing Soon'
        ? item.status === 'Active' && item.deadline.includes('22 Aug')
        : item.status === statusFilter;

    const matchesWorkMode = workModeFilter === 'All' || item.workMode === workModeFilter;
    const matchesIndustry = industryFilter === 'All' || item.industry === industryFilter;

    return matchesSearch && matchesStatus && matchesWorkMode && matchesIndustry;
  });

  // Sort Logic
  const sortedInternships = [...filteredInternships].sort((a, b) => {
    if (sortBy === 'newest') return b.postedDate > a.postedDate ? 1 : -1;
    if (sortBy === 'oldest') return a.postedDate > b.postedDate ? 1 : -1;
    if (sortBy === 'applications') return b.applicationsCount - a.applicationsCount;
    if (sortBy === 'stipend') return (b.stipendNumeric || 0) - (a.stipendNumeric || 0);
    if (sortBy === 'deadline') return a.deadline > b.deadline ? 1 : -1;
    return 0;
  });

  // Pagination Math
  const totalPages = Math.max(Math.ceil(sortedInternships.length / itemsPerPage), 1);
  const paginatedInternships = sortedInternships.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCardFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
    if (internshipListRef.current) {
      internshipListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setWorkModeFilter('All');
    setIndustryFilter('All');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const handleApprove = (id: string) => {
    const item = internships.find((i) => i.id === id);
    setInternships((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: 'Active' } : i))
    );
    setFeedback({ type: 'success', message: `Internship opportunity "${item?.title}" approved and published.` });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingInternship) return;
    if (!rejectionReason.trim()) {
      setRejectError('Please state a reason for rejecting this internship posting.');
      return;
    }
    const title = rejectingInternship.title;
    setInternships((prev) =>
      prev.map((i) =>
        i.id === rejectingInternship.id
          ? {
              ...i,
              status: 'Rejected',
              rejectionReason,
              rejectedDate: '19 Aug 2026',
              reviewedBy: 'Admin Moderator',
            }
          : i
      )
    );
    setRejectingInternship(null);
    setRejectionReason('');
    setRejectError(null);
    setFeedback({ type: 'error', message: `Internship "${title}" rejected. Notification sent to recruiter.` });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleConfirmClose = () => {
    if (!closingInternship) return;
    const title = closingInternship.title;
    setInternships((prev) =>
      prev.map((i) => (i.id === closingInternship.id ? { ...i, status: 'Closed' } : i))
    );
    setClosingInternship(null);
    setFeedback({ type: 'success', message: `Internship "${title}" closed to new student applications.` });
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Internship Management"
          subtitle="Review, monitor and manage internship opportunities posted by companies."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto pb-safe text-left">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-[#0f172a]">Platform Internship Opportunity Hub</h2>
              <p className="text-xs text-slate-500">
                48 total corporate listings across Remote, Hybrid & On-site work modes
              </p>
            </div>
            {(statusFilter !== 'All' || workModeFilter !== 'All' || industryFilter !== 'All' || search) && (
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

          {/* 6 Clickable Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {[
              { label: 'Total Internships', val: '48', status: 'All', icon: <Briefcase className="w-4 h-4 text-[#2563eb]" /> },
              { label: 'Active', val: '38', status: 'Active', icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" /> },
              { label: 'Pending Review', val: '4', status: 'Pending Review', icon: <Clock className="w-4 h-4 text-amber-600" /> },
              { label: 'Rejected', val: '2', status: 'Rejected', icon: <ShieldAlert className="w-4 h-4 text-rose-600" /> },
              { label: 'Draft', val: '2', status: 'Draft', icon: <Clock className="w-4 h-4 text-slate-500" /> },
              { label: 'Closing Soon', val: '6', status: 'Closing Soon', icon: <ShieldCheck className="w-4 h-4 text-indigo-600" /> },
            ].map((card) => (
              <button
                key={card.label}
                type="button"
                onClick={() => handleCardFilter(card.status)}
                className={`bg-white border rounded-2xl p-4 shadow-2xs space-y-1.5 cursor-pointer transition-all duration-150 text-left w-full focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 ${
                  statusFilter === card.status ? 'border-[#2563eb] ring-2 ring-[#2563eb]/20 bg-blue-50/20' : 'border-[#e2e8f0] hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate">{card.label}</span>
                  {card.icon}
                </div>
                <p className="text-2xl font-black text-[#0f172a]">{card.val}</p>
              </button>
            ))}
          </div>

          {/* Filters & Multi-Search Toolbar */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by title, company, skill, location..."
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
                  <option value="Active">Active</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="Draft">Draft</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600">
                <span>Work Mode:</span>
                <select
                  value={workModeFilter}
                  onChange={(e) => {
                    setWorkModeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs text-slate-800 font-bold focus:outline-none"
                >
                  <option value="All">All Modes</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>

              <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600">
                <span>Industry:</span>
                <select
                  value={industryFilter}
                  onChange={(e) => {
                    setIndustryFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs text-slate-800 font-bold focus:outline-none"
                >
                  <option value="All">All Industries</option>
                  <option value="Software">Software</option>
                  <option value="FinTech">FinTech</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Manufacturing">Manufacturing</option>
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
                  <option value="applications">Most Applications</option>
                  <option value="deadline">Deadline</option>
                  <option value="stipend">Highest Stipend</option>
                </select>
              </div>
            </div>
          </div>

          {/* Internship Table / Cards Section */}
          <div ref={internshipListRef} className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4 scroll-mt-6">
            {paginatedInternships.length > 0 ? (
              <>
                {/* Desktop View Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-xs font-medium border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                        <th className="py-3 px-4">Internship</th>
                        <th className="py-3 px-4">Company</th>
                        <th className="py-3 px-4">Location / Mode</th>
                        <th className="py-3 px-4">Applications</th>
                        <th className="py-3 px-4">Deadline</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedInternships.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="space-y-1">
                              <p className="font-bold text-[#0f172a]">{item.title}</p>
                              <div className="flex flex-wrap gap-1">
                                {item.skills.slice(0, 3).map((sk) => (
                                  <span key={sk} className="px-1.5 py-0.5 rounded bg-blue-50 text-[#2563eb] text-[10px] font-bold">
                                    {sk}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <button
                              type="button"
                              onClick={() => navigate(`/admin/companies/${item.companyId}`)}
                              className="flex items-center space-x-2 text-left group cursor-pointer"
                            >
                              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                                {item.companyLogo}
                              </div>
                              <span className="font-bold text-slate-800 group-hover:text-[#2563eb] group-hover:underline">
                                {item.companyName}
                              </span>
                            </button>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-700">
                            {item.location} <span className="text-slate-400">({item.workMode})</span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-[#2563eb]">{item.applicationsCount} Applicants</td>
                          <td className="py-3.5 px-4 text-slate-500 font-semibold">{item.deadline}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                                item.status === 'Active'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : item.status === 'Pending Review'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : item.status === 'Rejected'
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : 'bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-1.5">
                            <button
                              type="button"
                              onClick={() => navigate(`/admin/internships/${item.id}`)}
                              className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                            >
                              View
                            </button>
                            {item.status === 'Pending Review' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleApprove(item.id)}
                                  className="px-2.5 py-1 bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold rounded-xl cursor-pointer"
                                >
                                  Approve
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setRejectingInternship(item);
                                    setRejectionReason('');
                                    setRejectError(null);
                                  }}
                                  className="px-2.5 py-1 bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 text-xs font-bold rounded-xl cursor-pointer"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {item.status === 'Active' && (
                              <button
                                type="button"
                                onClick={() => setClosingInternship(item)}
                                className="px-2.5 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 text-xs font-bold rounded-xl cursor-pointer"
                              >
                                Close
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
                  {paginatedInternships.map((item) => (
                    <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#0f172a]">{item.title}</span>
                        <span className="font-bold text-emerald-700">{item.status}</span>
                      </div>
                      <p className="text-slate-500">{item.companyName} • {item.location} ({item.workMode})</p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="font-semibold text-slate-700">{item.applicationsCount} Applications</span>
                        <button
                          onClick={() => navigate(`/admin/internships/${item.id}`)}
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
                    {Math.min(currentPage * itemsPerPage, sortedInternships.length)} of {sortedInternships.length} internships
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
                  <p className="text-sm font-bold text-slate-800">No internships found</p>
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

      {/* Reject Moderation Modal */}
      {rejectingInternship && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-xl text-left space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 shrink-0">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0f172a]">Reject Internship Listing</h3>
                <p className="text-xs text-slate-500">{rejectingInternship.title} ({rejectingInternship.companyName})</p>
              </div>
            </div>

            <form onSubmit={handleConfirmReject} className="space-y-3 text-xs font-medium">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">
                  Rejection Reason <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Unrealistic stipend or incomplete job description details."
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
                  onClick={() => setRejectingInternship(null)}
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

      {/* Close Internship Modal */}
      {closingInternship && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-xl text-left space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-slate-900">
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 shrink-0">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-base font-bold">Close Internship Listing</h3>
                <p className="text-xs text-slate-500">{closingInternship.title}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Are you sure you want to close this internship posting? Students will no longer be able to apply.
            </p>

            <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setClosingInternship(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmClose}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-2xs cursor-pointer"
              >
                Confirm Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
