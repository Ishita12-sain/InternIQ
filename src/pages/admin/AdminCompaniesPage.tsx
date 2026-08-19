import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import type { AdminCompanyItem } from '../../types/adminTypes';
import { mockAdminCompanies } from '../../types/adminTypes';
import {
  Search,
  Filter,
  Building2,
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

export const AdminCompaniesPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [companies, setCompanies] = useState<AdminCompanyItem[]>(mockAdminCompanies);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filter States
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState<string>('All');
  const [locationFilter, setLocationFilter] = useState<string>('All');
  const [verificationFilter, setVerificationFilter] = useState<string>('All');
  const [activityFilter, setActivityFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'postedInternships' | 'name' | 'verificationStatus'>('postedInternships');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals State
  const [rejectingCompany, setRejectingCompany] = useState<AdminCompanyItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectError, setRejectError] = useState<string | null>(null);

  const [actionCompany, setActionCompany] = useState<AdminCompanyItem | null>(null);
  const [actionType, setActionType] = useState<'suspend' | 'activate' | null>(null);

  const companyListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Multi-Filter & Search Logic
  const filteredCompanies = companies.filter((cmp) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      cmp.name.toLowerCase().includes(searchLower) ||
      cmp.email.toLowerCase().includes(searchLower) ||
      cmp.industry.toLowerCase().includes(searchLower) ||
      cmp.location.toLowerCase().includes(searchLower);

    const matchesIndustry = industryFilter === 'All' || cmp.industry === industryFilter;
    const matchesLocation = locationFilter === 'All' || cmp.location.includes(locationFilter);
    const matchesVerification = verificationFilter === 'All' || cmp.verificationStatus === verificationFilter;

    let matchesActivity = true;
    if (activityFilter === 'Currently Hiring') matchesActivity = cmp.postedInternships > 0;
    else if (activityFilter === 'No Active Internship') matchesActivity = cmp.postedInternships === 0;

    return matchesSearch && matchesIndustry && matchesLocation && matchesVerification && matchesActivity;
  });

  // Sort Logic
  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];
    if (sortOrder === 'asc') return valA > valB ? 1 : -1;
    return valA < valB ? 1 : -1;
  });

  // Pagination Calculation
  const totalPages = Math.max(Math.ceil(sortedCompanies.length / itemsPerPage), 1);
  const paginatedCompanies = sortedCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCardFilter = (vFilter: string, aFilter: string = 'All') => {
    setVerificationFilter(vFilter);
    setActivityFilter(aFilter);
    setCurrentPage(1);
    if (companyListRef.current) {
      companyListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setIndustryFilter('All');
    setLocationFilter('All');
    setVerificationFilter('All');
    setActivityFilter('All');
    setSortBy('postedInternships');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  const handleApproveVerification = (id: string) => {
    const cmp = companies.find((c) => c.id === id);
    setCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, verificationStatus: 'Verified' } : c))
    );
    setFeedback({ type: 'success', message: `Employer verification approved for "${cmp?.name || 'Company'}".` });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingCompany) return;
    if (!rejectionReason.trim()) {
      setRejectError('Please enter a rejection reason.');
      return;
    }
    const name = rejectingCompany.name;
    setCompanies((prev) =>
      prev.map((c) => (c.id === rejectingCompany.id ? { ...c, verificationStatus: 'Rejected' } : c))
    );
    setRejectingCompany(null);
    setRejectionReason('');
    setRejectError(null);
    setFeedback({ type: 'error', message: `Verification dossier for "${name}" rejected. Reason logged.` });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleConfirmStatusChange = () => {
    if (!actionCompany || !actionType) return;
    const newStatus = actionType === 'suspend' ? 'Suspended' : 'Active';
    setCompanies((prev) =>
      prev.map((c) => (c.id === actionCompany.id ? { ...c, companyStatus: newStatus } : c))
    );
    setFeedback({
      type: actionType === 'suspend' ? 'error' : 'success',
      message: `Company account "${actionCompany.name}" has been ${actionType === 'suspend' ? 'suspended' : 'activated'} successfully.`,
    });
    setActionCompany(null);
    setActionType(null);
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Companies Management"
          subtitle="Manage registered companies, verification status and internship activity."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto pb-safe text-left">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-[#0f172a]">Corporate Employer Directory</h2>
              <p className="text-xs text-slate-500">
                185 total registered company accounts across software, fintech & healthcare
              </p>
            </div>
            {(industryFilter !== 'All' || locationFilter !== 'All' || verificationFilter !== 'All' || activityFilter !== 'All' || search) && (
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
              { label: 'Total Companies', val: '185', vFilter: 'All', aFilter: 'All', icon: <Building2 className="w-4 h-4 text-[#2563eb]" /> },
              { label: 'Verified', val: '162', vFilter: 'Verified', aFilter: 'All', icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" /> },
              { label: 'Pending Verification', val: '18', vFilter: 'Pending', aFilter: 'All', icon: <Clock className="w-4 h-4 text-amber-600" /> },
              { label: 'Rejected', val: '5', vFilter: 'Rejected', aFilter: 'All', icon: <ShieldAlert className="w-4 h-4 text-rose-600" /> },
              { label: 'Active Hiring', val: '124', vFilter: 'All', aFilter: 'Currently Hiring', icon: <ShieldCheck className="w-4 h-4 text-indigo-600" /> },
              { label: 'No Active Internship', val: '61', vFilter: 'All', aFilter: 'No Active Internship', icon: <Clock className="w-4 h-4 text-slate-500" /> },
            ].map((card) => (
              <button
                key={card.label}
                type="button"
                onClick={() => handleCardFilter(card.vFilter, card.aFilter)}
                className={`bg-white border rounded-2xl p-4 shadow-2xs space-y-1.5 cursor-pointer transition-all duration-150 text-left w-full focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 ${
                  verificationFilter === card.vFilter && activityFilter === card.aFilter
                    ? 'border-[#2563eb] ring-2 ring-[#2563eb]/20 bg-blue-50/20'
                    : 'border-[#e2e8f0] hover:border-blue-300'
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
                placeholder="Search company by name, email, industry..."
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
                  <option value="Healthcare">Healthcare</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Manufacturing">Manufacturing</option>
                </select>
              </div>

              <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600">
                <span>Verification:</span>
                <select
                  value={verificationFilter}
                  onChange={(e) => {
                    setVerificationFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs text-slate-800 font-bold focus:outline-none"
                >
                  <option value="All">All Verifications</option>
                  <option value="Verified">Verified</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600">
                <span>Hiring:</span>
                <select
                  value={activityFilter}
                  onChange={(e) => {
                    setActivityFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs text-slate-800 font-bold focus:outline-none"
                >
                  <option value="All">All Activity</option>
                  <option value="Currently Hiring">Currently Hiring</option>
                  <option value="No Active Internship">No Active Internship</option>
                </select>
              </div>

              <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600 pl-2 border-l border-slate-200">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#2563eb]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs text-slate-800 font-bold focus:outline-none"
                >
                  <option value="postedInternships">Internships</option>
                  <option value="name">Name</option>
                  <option value="verificationStatus">Verification</option>
                </select>
                <button
                  type="button"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-2 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer"
                >
                  {sortOrder.toUpperCase()}
                </button>
              </div>
            </div>
          </div>

          {/* Company List Section */}
          <div ref={companyListRef} className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4 scroll-mt-6">
            {paginatedCompanies.length > 0 ? (
              <>
                {/* Desktop View Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-xs font-medium border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                        <th className="py-3 px-4">Company</th>
                        <th className="py-3 px-4">Industry</th>
                        <th className="py-3 px-4">Location</th>
                        <th className="py-3 px-4">Internships</th>
                        <th className="py-3 px-4">Verification</th>
                        <th className="py-3 px-4">Account Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedCompanies.map((cmp) => (
                        <tr key={cmp.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                                {cmp.avatarInitials}
                              </div>
                              <div>
                                <p className="font-bold text-[#0f172a]">{cmp.name}</p>
                                <p className="text-[11px] text-slate-400">{cmp.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-700">{cmp.industry}</td>
                          <td className="py-3.5 px-4 font-semibold text-slate-600">{cmp.location}</td>
                          <td className="py-3.5 px-4 font-bold text-[#2563eb]">{cmp.postedInternships} Active</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                                cmp.verificationStatus === 'Verified'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : cmp.verificationStatus === 'Pending'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}
                            >
                              {cmp.verificationStatus}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-800">{cmp.companyStatus || 'Active'}</td>
                          <td className="py-3.5 px-4 text-right space-x-1.5">
                            <button
                              type="button"
                              onClick={() => navigate(`/admin/companies/${cmp.id}`)}
                              className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                            >
                              View
                            </button>
                            {cmp.verificationStatus === 'Pending' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleApproveVerification(cmp.id)}
                                  className="px-2.5 py-1 bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold rounded-xl shadow-2xs cursor-pointer"
                                >
                                  Verify
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setRejectingCompany(cmp);
                                    setRejectionReason('');
                                    setRejectError(null);
                                  }}
                                  className="px-2.5 py-1 bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 text-xs font-bold rounded-xl cursor-pointer"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {cmp.companyStatus === 'Suspended' ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setActionCompany(cmp);
                                  setActionType('activate');
                                }}
                                className="px-3 py-1 bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold rounded-xl cursor-pointer"
                              >
                                Activate
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setActionCompany(cmp);
                                  setActionType('suspend');
                                }}
                                className="px-3 py-1 bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 text-xs font-bold rounded-xl cursor-pointer"
                              >
                                Suspend
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
                  {paginatedCompanies.map((cmp) => (
                    <div key={cmp.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-7 h-7 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                            {cmp.avatarInitials}
                          </div>
                          <span className="font-bold text-[#0f172a]">{cmp.name}</span>
                        </div>
                        <span className="font-bold text-emerald-700">{cmp.verificationStatus}</span>
                      </div>
                      <p className="text-slate-500">{cmp.industry} • {cmp.location}</p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="font-semibold text-slate-700">{cmp.postedInternships} Internships</span>
                        <div className="space-x-1">
                          <button
                            onClick={() => navigate(`/admin/companies/${cmp.id}`)}
                            className="px-3 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-500">
                    Showing {(currentPage - 1) * itemsPerPage + 1}–
                    {Math.min(currentPage * itemsPerPage, sortedCompanies.length)} of {sortedCompanies.length} companies
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
                  <p className="text-sm font-bold text-slate-800">No companies found</p>
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
                  placeholder="e.g. Unreadable registration certificate scan uploaded."
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

      {/* Suspend / Activate Modal */}
      {actionCompany && actionType && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-xl text-left space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-slate-900">
              <div className={`p-2.5 rounded-xl border shrink-0 ${
                actionType === 'suspend' ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-emerald-50 border-emerald-200 text-emerald-600'
              }`}>
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold">
                  Confirm Account {actionType === 'suspend' ? 'Suspension' : 'Activation'}
                </h3>
                <p className="text-xs text-slate-500">{actionCompany.name} ({actionCompany.email})</p>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Are you sure you want to {actionType === 'suspend' ? 'suspend' : 'activate'} corporate employer {actionCompany.name}?
            </p>

            <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setActionCompany(null);
                  setActionType(null);
                }}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmStatusChange}
                className={`px-4 py-2 rounded-xl text-white text-xs font-bold shadow-2xs cursor-pointer ${
                  actionType === 'suspend' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                Yes, {actionType === 'suspend' ? 'Suspend Account' : 'Activate Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
