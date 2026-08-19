import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import type { PendingVerificationItem } from '../../types/adminTypes';
import { mockPendingVerifications } from '../../types/adminTypes';
import {
  Search,
  Filter,
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
  FileCheck,
} from 'lucide-react';

export const AdminVerificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [requests, setRequests] = useState<PendingVerificationItem[]>(mockPendingVerifications);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filter States
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'recentlyReviewed' | 'oldestPending'>('newest');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Rejection Modal State
  const [rejectingItem, setRejectingItem] = useState<PendingVerificationItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [notes, setNotes] = useState('');
  const [rejectError, setRejectError] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Multi-Filter & Search Logic
  const filteredRequests = requests.filter((item) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(searchLower) ||
      item.email.toLowerCase().includes(searchLower) ||
      item.documentType.toLowerCase().includes(searchLower) ||
      item.documentName.toLowerCase().includes(searchLower);

    const matchesType = typeFilter === 'All' || item.entityType === typeFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Sort Logic
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (sortBy === 'newest') return b.submittedDate > a.submittedDate ? 1 : -1;
    if (sortBy === 'oldest') return a.submittedDate > b.submittedDate ? 1 : -1;
    if (sortBy === 'recentlyReviewed') return (b.reviewedDate || '') > (a.reviewedDate || '') ? 1 : -1;
    if (sortBy === 'oldestPending') return a.submittedDate > b.submittedDate ? 1 : -1;
    return 0;
  });

  // Pagination Math
  const totalPages = Math.max(Math.ceil(sortedRequests.length / pageSize), 1);
  
  // Guard against currentPage exceeding totalPages after filter or deletion changes
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginatedRequests = sortedRequests.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleCardFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
    if (listRef.current) {
      listRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setTypeFilter('All');
    setStatusFilter('All');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const handleApprove = (id: string) => {
    const item = requests.find((r) => r.id === id);
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'Verified',
              reviewer: 'Admin SuperUser',
              reviewedDate: '19 Aug 2026',
            }
          : r
      )
    );
    setFeedback({ type: 'success', message: `Verification approved successfully for "${item?.name}".` });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleStartReview = (id: string) => {
    const item = requests.find((r) => r.id === id);
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'Under Review',
              reviewer: 'Admin Moderator',
              reviewedDate: '19 Aug 2026',
            }
          : r
      )
    );
    setFeedback({ type: 'success', message: `Request for "${item?.name}" marked as Under Review.` });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingItem) return;
    if (!rejectionReason.trim()) {
      setRejectError('Please state a rejection reason.');
      return;
    }
    const name = rejectingItem.name;
    setRequests((prev) =>
      prev.map((r) =>
        r.id === rejectingItem.id
          ? {
              ...r,
              status: 'Rejected',
              rejectionReason,
              notes,
              reviewer: 'Admin SuperUser',
              reviewedDate: '19 Aug 2026',
            }
          : r
      )
    );
    setRejectingItem(null);
    setRejectionReason('');
    setNotes('');
    setRejectError(null);
    setFeedback({ type: 'error', message: `Verification request for "${name}" rejected.` });
    setTimeout(() => setFeedback(null), 3500);
  };

  // Dynamically calculated summary metrics from single source array
  const totalRequests = requests.length;
  const pendingCount = requests.filter((r) => r.status === 'Pending').length;
  const underReviewCount = requests.filter((r) => r.status === 'Under Review').length;
  const verifiedCount = requests.filter((r) => r.status === 'Verified').length;
  const rejectedCount = requests.filter((r) => r.status === 'Rejected').length;

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Verification Management"
          subtitle="Review and manage company, student and faculty verification requests."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto pb-safe text-left">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-[#0f172a]">Compliance Verification Queue</h2>
              <p className="text-xs text-slate-500">
                {totalRequests} total verification submissions from companies, students & faculty
              </p>
            </div>
            {(typeFilter !== 'All' || statusFilter !== 'All' || search) && (
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

          {/* 5 Clickable Summary Cards (Strictly Single Source Data) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
            {[
              { label: 'Total Requests', val: totalRequests, status: 'All', icon: <FileCheck className="w-4 h-4 text-[#2563eb]" /> },
              { label: 'Pending', val: pendingCount, status: 'Pending', icon: <Clock className="w-4 h-4 text-amber-600" /> },
              { label: 'Under Review', val: underReviewCount, status: 'Under Review', icon: <Clock className="w-4 h-4 text-blue-600" /> },
              { label: 'Verified', val: verifiedCount, status: 'Verified', icon: <ShieldCheck className="w-4 h-4 text-emerald-600" /> },
              { label: 'Rejected', val: rejectedCount, status: 'Rejected', icon: <ShieldAlert className="w-4 h-4 text-rose-600" /> },
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
                placeholder="Search name, email, document type..."
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
                <span>Type:</span>
                <select
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs text-slate-800 font-bold focus:outline-none"
                >
                  <option value="All">All Types</option>
                  <option value="Company">Company</option>
                  <option value="Student">Student</option>
                  <option value="Faculty">Faculty</option>
                </select>
              </div>

              <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600">
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
                  <option value="Pending">Pending</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Verified">Verified</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600 pl-2 border-l border-slate-200">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#2563eb]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs text-slate-800 font-bold focus:outline-none"
                >
                  <option value="newest">Newest Submissions</option>
                  <option value="oldest">Oldest Submissions</option>
                  <option value="recentlyReviewed">Recently Reviewed</option>
                  <option value="oldestPending">Oldest Pending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Verification Table / Cards Section */}
          <div ref={listRef} className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4 scroll-mt-6">
            {paginatedRequests.length > 0 ? (
              <>
                {/* Desktop View Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-xs font-medium border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                        <th className="py-3 px-4">Applicant / Entity</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Document Submitted</th>
                        <th className="py-3 px-4">Submitted Date</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Reviewer</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedRequests.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                                {item.avatarInitials}
                              </div>
                              <div>
                                <p className="font-bold text-[#0f172a]">{item.name}</p>
                                <p className="text-[11px] text-slate-400">{item.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-extrabold border border-slate-200">
                              {item.entityType}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-700">{item.documentType}</td>
                          <td className="py-3.5 px-4 text-slate-500 font-medium">{item.submittedDate}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                                item.status === 'Verified'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : item.status === 'Under Review'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : item.status === 'Pending'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 font-medium">{item.reviewer || 'Unassigned'}</td>
                          <td className="py-3.5 px-4 text-right space-x-1.5">
                            <button
                              type="button"
                              onClick={() => navigate(`/admin/verifications/${item.id}`)}
                              className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                            >
                              View
                            </button>
                            {item.status === 'Pending' && (
                              <button
                                type="button"
                                onClick={() => handleStartReview(item.id)}
                                className="px-2.5 py-1 bg-blue-50 text-[#2563eb] border border-blue-200 hover:bg-blue-100 text-xs font-bold rounded-xl cursor-pointer"
                              >
                                Review
                              </button>
                            )}
                            {(item.status === 'Pending' || item.status === 'Under Review') && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleApprove(item.id)}
                                  className="px-2.5 py-1 bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold rounded-xl shadow-2xs cursor-pointer"
                                >
                                  Verify
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setRejectingItem(item);
                                    setRejectionReason('');
                                    setNotes('');
                                    setRejectError(null);
                                  }}
                                  className="px-2.5 py-1 bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 text-xs font-bold rounded-xl cursor-pointer"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View Stacked Cards */}
                <div className="grid grid-cols-1 gap-3 md:hidden">
                  {paginatedRequests.map((item) => (
                    <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#0f172a]">{item.name}</span>
                        <span className="font-bold text-emerald-700">{item.status}</span>
                      </div>
                      <p className="text-slate-500">{item.entityType} • {item.documentType}</p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-slate-400 text-[11px]">Submitted: {item.submittedDate}</span>
                        <button
                          onClick={() => navigate(`/admin/verifications/${item.id}`)}
                          className="px-3 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
                    <span className="text-xs font-semibold text-slate-500">
                      Showing {(currentPage - 1) * pageSize + 1}–
                      {Math.min(currentPage * pageSize, sortedRequests.length)} of {sortedRequests.length} requests
                    </span>

                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 cursor-pointer"
                        aria-label="Previous Page"
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
                        aria-label="Next Page"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="py-12 text-center bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                <AlertOctagon className="w-8 h-8 text-slate-400 mx-auto" />
                <div>
                  <p className="text-sm font-bold text-slate-800">No verification requests found</p>
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

      {/* Reject Verification Modal */}
      {rejectingItem && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-xl text-left space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 shrink-0">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0f172a]">Reject Verification Request</h3>
                <p className="text-xs text-slate-500">{rejectingItem.name} ({rejectingItem.documentType})</p>
              </div>
            </div>

            <form onSubmit={handleConfirmReject} className="space-y-3 text-xs font-medium">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">
                  Rejection Reason <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Expired document or unreadable ID scan."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-slate-900 focus:outline-none ${
                    rejectError ? 'border-rose-500' : 'border-slate-300 focus:border-[#2563eb]'
                  }`}
                  required
                />
                {rejectError && <p className="text-[11px] text-rose-600 font-semibold">{rejectError}</p>}
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">Additional Audit Notes</label>
                <input
                  type="text"
                  placeholder="Optional internal review note..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              <div className="flex justify-end space-x-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRejectingItem(null)}
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
    </div>
  );
};
