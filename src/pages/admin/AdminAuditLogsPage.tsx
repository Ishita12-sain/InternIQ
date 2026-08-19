import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { useAuditLogs } from '../../context/AuditLogContext';
import type { AuditLogItem } from '../../context/AuditLogContext';
import {
  History,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  GraduationCap,
  UserCheck,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Calendar,
  Layers,
  User,
  ArrowUpDown,
} from 'lucide-react';

export const AdminAuditLogsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { auditLogs } = useAuditLogs();

  // Filters & State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [actionFilter, setActionFilter] = useState<string>('All');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [moduleFilter, setModuleFilter] = useState<string>('All');
  const [dateRange, setDateRange] = useState<string>('Last 30 Days');
  const [customStartDate, setCustomStartDate] = useState<string>('2026-08-01');
  const [customEndDate, setCustomEndDate] = useState<string>('2026-08-20');
  const [sortOrder, setSortOrder] = useState<'Newest First' | 'Oldest First'>('Newest First');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, actionFilter, roleFilter, moduleFilter, dateRange, customStartDate, customEndDate, sortOrder]);

  // Date Range Calculator
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
    } else if (dateRange === 'Custom Range') {
      const cStart = new Date(customStartDate);
      const cEnd = new Date(customEndDate);
      cEnd.setHours(23, 59, 59, 999);
      return { start: cStart, end: cEnd };
    }

    return { start, end: now };
  }, [dateRange, customStartDate, customEndDate]);

  // Helper Date Filter
  const isDateInRange = (dateStr: string) => {
    const d = new Date(dateStr);
    return d >= dateBounds.start && d <= dateBounds.end;
  };

  // 1. Calculated Summary Cards
  const summary = useMemo(() => {
    const now = new Date('2026-08-20T23:59:59');
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    return {
      total: auditLogs.length,
      today: auditLogs.filter((l) => new Date(l.timestamp) >= todayStart).length,
      adminActions: auditLogs.filter((l) => l.role === 'Admin').length,
      studentActions: auditLogs.filter((l) => l.role === 'Student').length,
      companyActions: auditLogs.filter((l) => l.role === 'Company').length,
      facultyActions: auditLogs.filter((l) => l.role === 'Faculty').length,
    };
  }, [auditLogs]);

  // 2. Filtered & Sorted Audit Logs
  const filteredLogs = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    const filtered = auditLogs.filter((log) => {
      // Date Range Filter
      if (!isDateInRange(log.timestamp)) return false;

      // Action Type Filter
      if (actionFilter !== 'All' && log.action !== actionFilter) return false;

      // Role Filter
      if (roleFilter !== 'All' && log.role !== roleFilter) return false;

      // Module Filter
      if (moduleFilter !== 'All' && log.module !== moduleFilter) return false;

      // Search Query
      if (query) {
        const matchesUser = log.userName.toLowerCase().includes(query);
        const matchesAction = log.action.toLowerCase().includes(query);
        const matchesModule = log.module.toLowerCase().includes(query);
        const matchesDesc = log.description.toLowerCase().includes(query);
        const matchesEntity = (log.relatedEntityName || '').toLowerCase().includes(query);
        return matchesUser || matchesAction || matchesModule || matchesDesc || matchesEntity;
      }

      return true;
    });

    // Sorting
    return filtered.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return sortOrder === 'Newest First' ? timeB - timeA : timeA - timeB;
    });
  }, [auditLogs, actionFilter, roleFilter, moduleFilter, dateRange, customStartDate, customEndDate, searchQuery, sortOrder]);

  // 3. Pagination Window
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, currentPage, pageSize]);

  // Date Formatting Helper
  const formatTimestamp = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Status Badge Helper
  const getStatusBadge = (status: AuditLogItem['status']) => {
    switch (status) {
      case 'Success':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Success</span>
          </span>
        );
      case 'Failed':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 inline-flex items-center space-x-1">
            <XCircle className="w-3 h-3 text-rose-600" />
            <span>Failed</span>
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 inline-flex items-center space-x-1">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Pending</span>
          </span>
        );
    }
  };

  // Clear Filters Reset
  const handleClearFilters = () => {
    setSearchQuery('');
    setActionFilter('All');
    setRoleFilter('All');
    setModuleFilter('All');
    setDateRange('Last 30 Days');
    setSortOrder('Newest First');
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      {/* Responsive Admin Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Audit Logs"
          subtitle="Track important actions and activities performed across the InternIQ platform."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto pb-safe text-left">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-[#0f172a]">System Audit Trail</h2>
              <p className="text-xs text-slate-500">Comprehensive security and operational event registry.</p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset Filters</span>
              </button>
            </div>
          </div>

          {/* 6 Clickable Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Total Activities', val: summary.total, icon: <History className="w-4 h-4 text-[#2563eb]" /> },
              { label: 'Today Actions', val: summary.today, icon: <Clock className="w-4 h-4 text-emerald-600" /> },
              { label: 'Admin Actions', val: summary.adminActions, icon: <ShieldCheck className="w-4 h-4 text-purple-600" /> },
              { label: 'Student Actions', val: summary.studentActions, icon: <GraduationCap className="w-4 h-4 text-blue-600" /> },
              { label: 'Company Actions', val: summary.companyActions, icon: <Building2 className="w-4 h-4 text-amber-600" /> },
              { label: 'Faculty Actions', val: summary.facultyActions, icon: <UserCheck className="w-4 h-4 text-teal-600" /> },
            ].map((card) => (
              <div key={card.label} className="bg-white border border-[#e2e8f0] rounded-2xl p-3.5 shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 truncate">{card.label}</span>
                  {card.icon}
                </div>
                <p className="text-lg font-black text-[#0f172a]">{card.val.toLocaleString()}</p>
              </div>
            ))}
          </div>

          {/* Comprehensive Filter & Search Controls */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Search Bar */}
              <div className="relative lg:col-span-2">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search logs by user, entity or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              {/* Action Type Filter */}
              <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <select
                  value={actionFilter}
                  onChange={(e) => setActionFilter(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Actions</option>
                  <option value="Created">Created</option>
                  <option value="Updated">Updated</option>
                  <option value="Deleted">Deleted</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Verified">Verified</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Selected">Selected</option>
                  <option value="Login">Login</option>
                  <option value="Logout">Logout</option>
                  <option value="Status Changed">Status Changed</option>
                  <option value="Settings Updated">Settings Updated</option>
                </select>
              </div>

              {/* Role Filter */}
              <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs">
                <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Roles</option>
                  <option value="Admin">Admin</option>
                  <option value="Student">Student</option>
                  <option value="Company">Company</option>
                  <option value="Faculty">Faculty</option>
                  <option value="T&P">T&P Cell</option>
                </select>
              </div>

              {/* Module Filter */}
              <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs">
                <Layers className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <select
                  value={moduleFilter}
                  onChange={(e) => setModuleFilter(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Modules</option>
                  <option value="Students">Students</option>
                  <option value="Companies">Companies</option>
                  <option value="Faculty">Faculty</option>
                  <option value="Internships">Internships</option>
                  <option value="Applications">Applications</option>
                  <option value="Verifications">Verifications</option>
                  <option value="Interviews">Interviews</option>
                  <option value="Notifications">Notifications</option>
                  <option value="Settings">Settings</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
              {/* Date Filter & Sort */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
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
                  <div className="flex items-center space-x-1 text-xs">
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

                <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#2563eb] shrink-0" />
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as any)}
                    className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value="Newest First">Newest First</option>
                    <option value="Oldest First">Oldest First</option>
                  </select>
                </div>
              </div>

              <span className="text-xs font-bold text-slate-500">
                Found {filteredLogs.length.toLocaleString()} activity records
              </span>
            </div>
          </div>

          {/* Desktop Table & Mobile Cards */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl shadow-2xs overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Date & Time</th>
                    <th className="py-3.5 px-4">User</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Action</th>
                    <th className="py-3.5 px-4">Module</th>
                    <th className="py-3.5 px-4">Description</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Details</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {paginatedLogs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center space-y-3">
                        <p className="text-sm font-extrabold text-slate-700">No activity found</p>
                        <p className="text-xs text-slate-400">Try changing your search or filters.</p>
                        <button
                          type="button"
                          onClick={handleClearFilters}
                          className="px-3.5 py-1.5 bg-[#2563eb] text-white font-bold text-xs rounded-xl shadow-2xs hover:bg-blue-700 cursor-pointer"
                        >
                          Clear Filters
                        </button>
                      </td>
                    </tr>
                  ) : (
                    paginatedLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 font-semibold">
                          {formatTimestamp(log.timestamp)}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[#0f172a]">{log.userName}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              log.role === 'Admin'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : log.role === 'Company'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : log.role === 'Faculty'
                                ? 'bg-teal-50 text-teal-700 border-teal-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}
                          >
                            {log.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-800">{log.action}</td>
                        <td className="py-3.5 px-4 text-slate-600 font-semibold">{log.module}</td>
                        <td className="py-3.5 px-4 max-w-xs truncate text-slate-600" title={log.description}>
                          {log.description}
                        </td>
                        <td className="py-3.5 px-4">{getStatusBadge(log.status)}</td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => navigate(`/admin/audit-logs/${log.id}`)}
                            className="px-3 py-1 bg-slate-100 hover:bg-blue-50 hover:text-[#2563eb] border border-slate-200 rounded-lg font-bold text-[11px] cursor-pointer transition-colors"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View (width <= 768px) */}
            <div className="md:hidden divide-y divide-slate-100">
              {paginatedLogs.length === 0 ? (
                <div className="p-8 text-center space-y-3">
                  <p className="text-sm font-extrabold text-slate-700">No activity found</p>
                  <p className="text-xs text-slate-400">Try changing your search or filters.</p>
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="px-3.5 py-1.5 bg-[#2563eb] text-white font-bold text-xs rounded-xl shadow-2xs hover:bg-blue-700 cursor-pointer"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                paginatedLogs.map((log) => (
                  <div key={log.id} className="p-4 space-y-2.5 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400">{formatTimestamp(log.timestamp)}</span>
                      {getStatusBadge(log.status)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-xs font-black text-[#0f172a]">{log.userName}</h4>
                        <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[9px] font-bold">
                          {log.role}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">{log.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{log.module} • {log.action}</span>
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/audit-logs/${log.id}`)}
                        className="px-3 py-1 bg-[#2563eb] text-white font-bold text-xs rounded-lg shadow-2xs cursor-pointer"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Working Pagination Bar */}
            {filteredLogs.length > pageSize && (
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="text-slate-600 font-semibold">
                  Showing <strong className="text-[#0f172a]">{(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredLogs.length)}</strong> of <strong className="text-[#0f172a]">{filteredLogs.length.toLocaleString()}</strong> activities
                </span>

                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="px-3 py-1 bg-white border border-slate-200 rounded-xl font-bold text-[#2563eb]">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
