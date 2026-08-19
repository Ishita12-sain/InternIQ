import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { useNotification } from '../../context/NotificationContext';
import type { PlatformNotification } from '../../context/NotificationContext';
import { useAuditLogs } from '../../context/AuditLogContext';
import {
  Bell,
  CheckCircle2,
  Search,
  Filter,
  CheckCheck,
  Star,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  GraduationCap,
  Briefcase,
  FileText,
  Calendar,
  Sparkles,
  ArrowLeft,
  X,
} from 'lucide-react';

export const AdminNotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    toggleImportant,
    deleteNotification,
  } = useNotification();

  const { logActivity } = useAuditLogs();

  // Filters & State
  const [activeTab, setActiveTab] = useState<'All' | 'Unread' | 'Read' | 'Important'>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All Types');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Selected Notification for Detail Modal
  const [selectedNotif, setSelectedNotif] = useState<PlatformNotification | null>(null);

  // Deletion Modal Confirmation State
  const [deletingNotif, setDeletingNotif] = useState<PlatformNotification | null>(null);

  // Summary Metrics calculated directly from the notifications context
  const summary = useMemo(() => {
    return {
      total: notifications.length,
      unread: unreadCount,
      read: notifications.filter((n) => n.read).length,
      important: notifications.filter((n) => n.important).length,
    };
  }, [notifications, unreadCount]);

  // Filtered Notifications List
  const filteredNotifications = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return notifications.filter((n) => {
      // Tab Filter
      if (activeTab === 'Unread' && n.read) return false;
      if (activeTab === 'Read' && !n.read) return false;
      if (activeTab === 'Important' && !n.important) return false;

      // Type Filter
      if (typeFilter !== 'All Types' && n.type !== typeFilter) return false;

      // Search Query
      if (query) {
        const matchesTitle = n.title.toLowerCase().includes(query);
        const matchesMsg = n.message.toLowerCase().includes(query);
        const matchesType = n.type.toLowerCase().includes(query);
        return matchesTitle || matchesMsg || matchesType;
      }

      return true;
    });
  }, [notifications, activeTab, typeFilter, searchQuery]);

  // Pagination Slice
  const totalPages = Math.max(1, Math.ceil(filteredNotifications.length / pageSize));
  const paginatedNotifications = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredNotifications.slice(start, start + pageSize);
  }, [filteredNotifications, currentPage, pageSize]);

  // Click Handler - Mark read and open detail / navigate
  const handleItemClick = (notif: PlatformNotification) => {
    markAsRead(notif.id);
    setSelectedNotif(notif);
  };

  const handleNavigateEntity = (notif: PlatformNotification) => {
    if (notif.applicationId) navigate(`/admin/applications/${notif.applicationId}`);
    else if (notif.companyId) navigate(`/admin/companies/${notif.companyId}`);
    else if (notif.studentId) navigate(`/admin/students/${notif.studentId}`);
    else if (notif.internshipId) navigate(`/admin/internships/${notif.internshipId}`);
    else if (notif.verificationId) navigate(`/admin/verifications/${notif.verificationId}`);
  };

  // Notification Icon Helper
  const getNotificationIcon = (type: PlatformNotification['type']) => {
    switch (type) {
      case 'Verification':
        return <ShieldCheck className="w-4 h-4 text-[#2563eb]" />;
      case 'Company':
        return <Building2 className="w-4 h-4 text-purple-600" />;
      case 'Student':
        return <GraduationCap className="w-4 h-4 text-emerald-600" />;
      case 'Internship':
        return <Briefcase className="w-4 h-4 text-amber-600" />;
      case 'Application':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'Interview':
        return <Calendar className="w-4 h-4 text-indigo-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-rose-600" />;
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      {/* Admin Responsive Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Layout Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Notifications"
          subtitle="Stay updated with important platform activities and alerts."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto pb-safe text-left">
          {/* Header Sub-bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-[#0f172a]">Platform Alerts Center</h2>
              <p className="text-xs text-slate-500">Real-time system events, application updates, and compliance alerts.</p>
            </div>

            <button
              type="button"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer"
            >
              <CheckCheck className="w-4 h-4 text-[#2563eb]" />
              <span>Mark all as read</span>
            </button>
          </div>

          {/* 4 Clickable Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {[
              { label: 'Total Notifications', val: summary.total, tab: 'All', icon: <Bell className="w-4 h-4 text-[#2563eb]" /> },
              { label: 'Unread Alerts', val: summary.unread, tab: 'Unread', icon: <Bell className="w-4 h-4 text-amber-500" /> },
              { label: 'Read Alerts', val: summary.read, tab: 'Read', icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" /> },
              { label: 'Important Flagged', val: summary.important, tab: 'Important', icon: <Star className="w-4 h-4 text-rose-500" /> },
            ].map((card) => (
              <button
                key={card.label}
                type="button"
                onClick={() => setActiveTab(card.tab as any)}
                className={`bg-white border rounded-2xl p-4 shadow-2xs space-y-1 transition-all text-left cursor-pointer group focus:outline-none ${
                  activeTab === card.tab ? 'border-[#2563eb] ring-2 ring-[#2563eb]/20' : 'border-[#e2e8f0] hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate">{card.label}</span>
                  {card.icon}
                </div>
                <p className="text-xl font-black text-[#0f172a] group-hover:text-[#2563eb]">{card.val}</p>
              </button>
            ))}
          </div>

          {/* Filter Bar: Tabs, Search & Type Selector */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
            {/* Tabs */}
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
              {(['All', 'Unread', 'Read', 'Important'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === tab ? 'bg-white text-[#2563eb] shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab} {tab === 'Unread' && summary.unread > 0 ? `(${summary.unread})` : ''}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              {/* Type Filter */}
              <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="All Types">All Types</option>
                  <option value="Application">Application</option>
                  <option value="Company">Company</option>
                  <option value="Verification">Verification</option>
                  <option value="Internship">Internship</option>
                  <option value="Student">Student</option>
                  <option value="Interview">Interview</option>
                  <option value="System">System</option>
                </select>
              </div>

              {/* Search Field */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search alerts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2563eb]"
                />
              </div>
            </div>
          </div>

          {/* Notifications List Container */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl shadow-2xs divide-y divide-slate-100 overflow-hidden">
            {paginatedNotifications.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <p className="text-sm font-extrabold text-slate-700">
                  {activeTab === 'Unread'
                    ? "You're all caught up."
                    : activeTab === 'Important'
                    ? 'No important notifications.'
                    : searchQuery
                    ? 'No notifications match your search.'
                    : 'No notifications yet.'}
                </p>
                <p className="text-xs text-slate-400">System alerts and activities will appear here in real-time.</p>
              </div>
            ) : (
              paginatedNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 sm:p-5 transition-colors grid grid-cols-[40px_minmax(0,1fr)_auto] sm:grid-cols-[48px_minmax(0,1fr)_auto] gap-3 sm:gap-4 items-start group ${
                    !notif.read ? 'bg-blue-50/40 hover:bg-blue-50/70' : 'hover:bg-slate-50'
                  }`}
                >
                  {/* 1. LEFT - Notification Icon */}
                  <div
                    onClick={() => handleItemClick(notif)}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center shrink-0 cursor-pointer mt-0.5"
                  >
                    {getNotificationIcon(notif.type)}
                  </div>

                  {/* 2. CENTER - Notification Content */}
                  <div
                    onClick={() => handleItemClick(notif)}
                    className="min-w-0 space-y-1.5 cursor-pointer pr-1"
                  >
                    {/* Title & Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 text-left">
                      <h4 className={`text-xs sm:text-sm leading-snug break-words ${!notif.read ? 'font-black text-[#0f172a]' : 'font-semibold text-slate-700'}`}>
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-[#2563eb] shrink-0 inline-block align-middle" />
                      )}
                      {notif.important && (
                        <span className="inline-flex items-center whitespace-nowrap px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-[9px] font-bold">
                          Important
                        </span>
                      )}
                    </div>

                    {/* Short Message */}
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 text-left break-words">
                      {notif.message}
                    </p>

                    {/* Metadata (Type + User-friendly Timestamp) */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-slate-400 font-medium pt-0.5 text-left whitespace-normal break-normal overflow-wrap-break-word">
                      <span className="font-bold text-slate-500 uppercase tracking-wide">{notif.type}</span>
                      <span>•</span>
                      <span className="whitespace-nowrap text-slate-500">{notif.createdAt}</span>
                    </div>
                  </div>

                  {/* 3 & 4. RIGHT - Actions Column (Mark as read TOP, Star + Delete BOTTOM) */}
                  <div className="flex flex-col items-end justify-between self-stretch shrink-0 space-y-2">
                    {/* 3. RIGHT TOP - Mark as Read */}
                    {!notif.read ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notif.id);
                        }}
                        className="px-2.5 py-1 text-[10px] sm:text-xs font-bold text-[#2563eb] hover:bg-blue-50 border border-transparent hover:border-blue-100 rounded-lg cursor-pointer transition-colors whitespace-nowrap"
                      >
                        Mark as read
                      </button>
                    ) : (
                      <div className="h-6" />
                    )}

                    {/* 4. RIGHT BOTTOM - Star + Delete */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleImportant(notif.id);
                        }}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          notif.important ? 'text-rose-600 bg-rose-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                        }`}
                        title="Toggle Important"
                        aria-label="Toggle Important"
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingNotif(notif);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Notification"
                        aria-label="Delete Notification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Working Pagination Bar */}
          {filteredNotifications.length > 0 && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-slate-600 font-semibold">
                Showing <strong className="text-[#0f172a]">{(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredNotifications.length)}</strong> of <strong className="text-[#0f172a]">{filteredNotifications.length}</strong> notifications
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

          {/* Notification Detail Modal */}
          {selectedNotif && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-150 text-left">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-xl bg-blue-50 border border-blue-100">
                      {getNotificationIcon(selectedNotif.type)}
                    </div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{selectedNotif.type} Alert</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedNotif(null)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-extrabold text-[#0f172a]">{selectedNotif.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    {selectedNotif.message}
                  </p>
                  <p className="text-[10px] text-slate-400 font-semibold pt-1">Logged on: {selectedNotif.createdAt}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedNotif(null)}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Notifications</span>
                  </button>

                  {(selectedNotif.applicationId || selectedNotif.companyId || selectedNotif.studentId || selectedNotif.internshipId || selectedNotif.verificationId) && (
                    <button
                      type="button"
                      onClick={() => {
                        handleNavigateEntity(selectedNotif);
                        setSelectedNotif(null);
                      }}
                      className="px-4 py-2 bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
                    >
                      View Entity Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {deletingNotif && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4 text-center animate-in zoom-in-95 duration-150">
                <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
                  <Trash2 className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-[#0f172a]">Delete Notification?</h3>
                  <p className="text-xs text-slate-500">
                    Are you sure you want to delete <strong className="text-slate-800">"{deletingNotif.title}"</strong>?
                  </p>
                </div>

                <div className="flex items-center justify-center space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setDeletingNotif(null)}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      logActivity({
                        userId: 'usr-admin-01',
                        userName: 'Admin SuperUser',
                        role: 'Admin',
                        action: 'Deleted',
                        module: 'Notifications',
                        description: `Deleted notification alert "${deletingNotif.title}".`,
                        status: 'Success',
                        relatedEntityId: deletingNotif.id,
                        relatedEntityName: deletingNotif.title,
                      });
                      deleteNotification(deletingNotif.id);
                      setDeletingNotif(null);
                    }}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-2xs cursor-pointer"
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
