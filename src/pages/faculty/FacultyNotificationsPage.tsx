import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FacultySidebar } from '../../components/faculty/FacultySidebar';
import { FacultyHeader } from '../../components/faculty/FacultyHeader';
import { useNotification } from '../../context/NotificationContext';
import type { PlatformNotification } from '../../context/NotificationContext';
import {
  Bell,
  CheckCircle2,
  Search,
  CheckCheck,
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
  X,
  ExternalLink,
} from 'lucide-react';

export const FacultyNotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotification();

  // Filters & State
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const pageSize = 10;

  // Selected Notification for Detail Modal
  const [selectedNotif, setSelectedNotif] = useState<PlatformNotification | null>(null);
  const [deletingNotif, setDeletingNotif] = useState<PlatformNotification | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Filtered Notifications List
  const filteredNotifications = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return notifications.filter((n) => {
      // Category Filter
      if (categoryFilter !== 'All') {
        if (categoryFilter === 'Applications' && n.type !== 'Application') return false;
        if (categoryFilter === 'Interviews' && n.type !== 'Interview') return false;
        if (categoryFilter === 'Selections' && n.type !== 'Student') return false;
        if (categoryFilter === 'Placements' && n.type !== 'Verification' && n.type !== 'Company') return false;
        if (categoryFilter === 'System' && n.type !== 'System') return false;
      }

      // Search Query
      if (query) {
        const matchesTitle = n.title.toLowerCase().includes(query);
        const matchesMsg = n.message.toLowerCase().includes(query);
        const matchesType = n.type.toLowerCase().includes(query);
        return matchesTitle || matchesMsg || matchesType;
      }

      return true;
    });
  }, [notifications, categoryFilter, searchQuery]);

  // Reset pagination on search or category filter change
  const handleCategoryChange = (cat: string) => {
    setCategoryFilter(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  // Pagination Slice
  const totalPages = Math.max(1, Math.ceil(filteredNotifications.length / pageSize));
  const paginatedNotifications = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredNotifications.slice(start, start + pageSize);
  }, [filteredNotifications, currentPage, pageSize]);

  // Click Handler - Mark read and open detail
  const handleItemClick = (notif: PlatformNotification) => {
    markAsRead(notif.id);
    setSelectedNotif(notif);
  };

  const handleNavigateEntity = (notif: PlatformNotification) => {
    markAsRead(notif.id);
    if (notif.applicationId) navigate(`/faculty/applications/${notif.applicationId}`);
    else if (notif.companyId) navigate(`/faculty/companies/${notif.companyId}`);
    else if (notif.studentId) navigate(`/faculty/students/${notif.studentId}`);
    else if (notif.internshipId) navigate(`/faculty/internships/${notif.internshipId}`);
    else navigate('/faculty/applications');
  };

  // Notification Icon Helper
  const getNotificationIcon = (type: PlatformNotification['type']) => {
    switch (type) {
      case 'Verification':
        return <ShieldCheck className="w-4 h-4 text-blue-600" />;
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
      <FacultySidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <FacultyHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Notifications"
          subtitle="Stay updated on your mentees, applications, interviews and placements."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto pb-safe text-left">
          {toastMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMsg}</span>
            </div>
          )}

          {/* Controls Bar */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-extrabold text-[#0f172a]">Faculty Alerts Center</h2>
                <p className="text-xs text-slate-500">Live notifications regarding mentee progress and selection milestones.</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    markAllAsRead();
                    triggerToast('All notifications marked as read.');
                  }}
                  disabled={unreadCount === 0}
                  className="px-3.5 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 disabled:opacity-50 text-xs font-bold rounded-xl inline-flex items-center space-x-1.5 cursor-pointer transition-colors"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>Mark all as read</span>
                </button>
              </div>
            </div>

            {/* Categories & Search */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                {['All', 'Applications', 'Interviews', 'Selections', 'Placements', 'System'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                      categoryFilter === cat
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl shadow-2xs overflow-hidden">
            {filteredNotifications.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <Bell className="w-8 h-8 mx-auto text-slate-300" />
                <p className="font-bold text-slate-600 text-sm">
                  {notifications.length === 0 ? 'No notifications yet' : 'No notifications found'}
                </p>
                <p className="text-xs text-slate-400">
                  {notifications.length === 0
                    ? 'All mentee alerts and system events will appear here.'
                    : 'Try changing your search or category filter.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {paginatedNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 transition-colors flex items-start justify-between gap-4 group ${
                      !notif.read ? 'bg-indigo-50/40 font-semibold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div
                      onClick={() => handleItemClick(notif)}
                      className="flex items-start space-x-3.5 cursor-pointer flex-1 min-w-0 text-left"
                    >
                      <div className="p-2.5 bg-slate-100 rounded-2xl shrink-0 mt-0.5">
                        {getNotificationIcon(notif.type)}
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-xs font-extrabold text-[#0f172a] truncate">{notif.title}</h4>
                          {!notif.read && (
                            <span className="px-2 py-0.5 bg-indigo-600 text-white font-black text-[9px] rounded-full uppercase shrink-0">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{notif.message}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{notif.createdAt}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleNavigateEntity(notif)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer"
                        title="View Related Details"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingNotif(notif)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="Delete Notification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Footer */}
            {filteredNotifications.length > 0 && (
              <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="text-slate-500 font-medium">
                  Showing {Math.min((currentPage - 1) * pageSize + 1, filteredNotifications.length)}–
                  {Math.min(currentPage * pageSize, filteredNotifications.length)} of {filteredNotifications.length} notifications
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border rounded-xl disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-slate-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 border rounded-xl disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Detail Modal */}
      {selectedNotif && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                {getNotificationIcon(selectedNotif.type)}
                <h3 className="font-extrabold text-sm text-[#0f172a]">{selectedNotif.title}</h3>
              </div>
              <button type="button" onClick={() => setSelectedNotif(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{selectedNotif.message}</p>
            <p className="text-[10px] text-slate-400 font-medium">Received: {selectedNotif.createdAt}</p>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setSelectedNotif(null)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const n = selectedNotif;
                  setSelectedNotif(null);
                  handleNavigateEntity(n);
                }}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl"
              >
                Open Details →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingNotif && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-left">
            <h3 className="font-extrabold text-sm text-rose-900">Delete Notification?</h3>
            <p className="text-xs text-slate-600">Are you sure you want to remove this alert from your notification log?</p>
            <div className="flex items-center justify-end space-x-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setDeletingNotif(null)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteNotification(deletingNotif.id);
                  setDeletingNotif(null);
                  triggerToast('Notification deleted.');
                }}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
