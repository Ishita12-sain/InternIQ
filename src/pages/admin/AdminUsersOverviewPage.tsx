import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import type { AdminUserListItem } from '../../types/adminUsersData';
import { mockAdminUsers } from '../../types/adminUsersData';
import {
  Search,
  Filter,
  Users,
  GraduationCap,
  Building2,
  UserCheck,
  Shield,
  CheckCircle2,
  AlertOctagon,
  ArrowUpDown,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export const AdminUsersOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [users, setUsers] = useState<AdminUserListItem[]>(mockAdminUsers);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filters State
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'name' | 'joinedDate' | 'role'>('joinedDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Suspend / Activate Confirm Modal State
  const [actionUser, setActionUser] = useState<AdminUserListItem | null>(null);
  const [actionType, setActionType] = useState<'suspend' | 'activate' | null>(null);

  const userListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Filter & Search Logic
  const filteredUsers = users.filter((usr) => {
    const matchesSearch =
      usr.name.toLowerCase().includes(search.toLowerCase()) ||
      usr.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'All' || usr.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || usr.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Sort Logic
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];
    if (sortOrder === 'asc') return valA > valB ? 1 : -1;
    return valA < valB ? 1 : -1;
  });

  // Pagination Math
  const totalPages = Math.max(Math.ceil(sortedUsers.length / itemsPerPage), 1);
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCardFilter = (role: string) => {
    setRoleFilter(role);
    setCurrentPage(1);
    if (userListRef.current) {
      userListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setRoleFilter('All');
    setStatusFilter('All');
    setSortBy('joinedDate');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  const handleConfirmStatusChange = () => {
    if (!actionUser || !actionType) return;
    const newStatus = actionType === 'suspend' ? 'Suspended' : 'Active';
    setUsers((prev) =>
      prev.map((u) => (u.id === actionUser.id ? { ...u, status: newStatus } : u))
    );

    setFeedback({
      type: actionType === 'suspend' ? 'error' : 'success',
      message: `User "${actionUser.name}" has been ${actionType === 'suspend' ? 'suspended' : 'activated'} successfully.`,
    });
    setActionUser(null);
    setActionType(null);
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Users Overview"
          subtitle="Manage and monitor all users across the InternIQ platform."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto pb-safe text-left">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-[#0f172a]">Platform User Management</h2>
              <p className="text-xs text-slate-500">
                1,685 total registered platform accounts across all roles
              </p>
            </div>
            {(roleFilter !== 'All' || statusFilter !== 'All' || search) && (
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
              { label: 'Total Users', val: '1,685', role: 'All', icon: <Users className="w-4 h-4 text-[#2563eb]" /> },
              { label: 'Students', val: '1,420', role: 'Student', icon: <GraduationCap className="w-4 h-4 text-emerald-600" /> },
              { label: 'Companies', val: '185', role: 'Company', icon: <Building2 className="w-4 h-4 text-purple-600" /> },
              { label: 'Faculty', val: '64', role: 'Faculty', icon: <UserCheck className="w-4 h-4 text-indigo-600" /> },
              { label: 'T&P Officers', val: '12', role: 'T&P', icon: <UserCheck className="w-4 h-4 text-amber-600" /> },
              { label: 'Admins', val: '4', role: 'Admin', icon: <Shield className="w-4 h-4 text-rose-600" /> },
            ].map((card) => (
              <button
                key={card.label}
                type="button"
                onClick={() => handleCardFilter(card.role)}
                className={`bg-white border rounded-2xl p-4 shadow-2xs space-y-1.5 cursor-pointer transition-all duration-150 text-left w-full focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 ${
                  roleFilter === card.role ? 'border-[#2563eb] ring-2 ring-[#2563eb]/20 bg-blue-50/20' : 'border-[#e2e8f0] hover:border-blue-300'
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

          {/* Filters & Search Toolbar */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search user by name or email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#2563eb]"
              />
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {/* Role Filter Selector */}
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600">
                <Filter className="w-3.5 h-3.5 text-[#2563eb]" />
                <span>Role:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs text-slate-800 font-bold focus:outline-none"
                >
                  <option value="All">All Roles</option>
                  <option value="Student">Student</option>
                  <option value="Company">Company</option>
                  <option value="Faculty">Faculty</option>
                  <option value="T&P">T&P</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              {/* Status Filter Selector */}
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600">
                <span>Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs text-slate-800 font-bold focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              {/* Sort Controls */}
              <div className="flex items-center space-x-1 text-xs font-semibold text-slate-600 pl-2 border-l border-slate-200">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#2563eb]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs text-slate-800 font-bold focus:outline-none"
                >
                  <option value="joinedDate">Joined Date</option>
                  <option value="name">Name</option>
                  <option value="role">Role</option>
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

          {/* User List Table Section */}
          <div ref={userListRef} className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4 scroll-mt-6">
            {paginatedUsers.length > 0 ? (
              <>
                {/* Desktop View Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-xs font-medium border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                        <th className="py-3 px-4">User</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Joined Date</th>
                        <th className="py-3 px-4">Last Active</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedUsers.map((usr) => (
                        <tr key={usr.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                                {usr.avatarInitials}
                              </div>
                              <div>
                                <p className="font-bold text-[#0f172a]">{usr.name}</p>
                                <p className="text-[11px] text-slate-400">{usr.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-extrabold border border-slate-200">
                              {usr.role}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                                usr.status === 'Active'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : usr.status === 'Pending'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}
                            >
                              {usr.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 font-semibold">{usr.joinedDate}</td>
                          <td className="py-3.5 px-4 text-slate-500 font-medium">{usr.lastActive}</td>
                          <td className="py-3.5 px-4 text-right space-x-1.5">
                            <button
                              type="button"
                              onClick={() => navigate(`/admin/users/${usr.id}`)}
                              className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                            >
                              View
                            </button>
                            {usr.status === 'Active' ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setActionUser(usr);
                                  setActionType('suspend');
                                }}
                                className="px-3 py-1 bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 text-xs font-bold rounded-xl cursor-pointer"
                              >
                                Suspend
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setActionUser(usr);
                                  setActionType('activate');
                                }}
                                className="px-3 py-1 bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold rounded-xl shadow-2xs cursor-pointer"
                              >
                                Activate
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
                  {paginatedUsers.map((usr) => (
                    <div key={usr.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                            {usr.avatarInitials}
                          </div>
                          <span className="font-bold text-[#0f172a]">{usr.name}</span>
                        </div>
                        <span className="font-bold text-emerald-700">{usr.status}</span>
                      </div>
                      <p className="text-slate-500">{usr.email} • Role: {usr.role}</p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-slate-400 text-[11px]">Joined: {usr.joinedDate}</span>
                        <div className="space-x-1">
                          <button
                            onClick={() => navigate(`/admin/users/${usr.id}`)}
                            className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                          >
                            View
                          </button>
                          {usr.status === 'Active' ? (
                            <button
                              onClick={() => {
                                setActionUser(usr);
                                setActionType('suspend');
                              }}
                              className="px-2.5 py-1 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg text-xs font-bold"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setActionUser(usr);
                                setActionType('activate');
                              }}
                              className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                            >
                              Activate
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-500">
                    Showing {(currentPage - 1) * itemsPerPage + 1}–
                    {Math.min(currentPage * itemsPerPage, sortedUsers.length)} of {sortedUsers.length} users
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
                  <p className="text-sm font-bold text-slate-800">No users found</p>
                  <p className="text-xs text-slate-500">Try changing your search or filter parameters.</p>
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

      {/* Confirmation Modal for Suspend/Activate */}
      {actionUser && actionType && (
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
                <p className="text-xs text-slate-500">{actionUser.name} ({actionUser.email})</p>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Are you sure you want to {actionType === 'suspend' ? 'suspend' : 'activate'} this {actionUser.role} account?
            </p>

            <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setActionUser(null);
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
