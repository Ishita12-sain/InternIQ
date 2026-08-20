import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompanySidebar } from '../../components/company/CompanySidebar';
import { CompanyHeader } from '../../components/company/CompanyHeader';
import {
  ArrowLeft,
  Bell,
  CheckCheck,
  Search,
  Filter,
  UserPlus,
  UserCheck,
  Calendar,
  Clock,
  Award,
  XCircle,
  Briefcase,
  Building,
  Eye,
  Trash2,
  CheckCircle2,
  X,
  ExternalLink,
} from 'lucide-react';

export interface RecruiterNotification {
  id: string;
  type:
    | 'New Applicant'
    | 'Candidate Shortlisted'
    | 'Interview Scheduled'
    | 'Interview Rescheduled'
    | 'Interview Completed'
    | 'Candidate Selected'
    | 'Candidate Rejected'
    | 'Internship Application Deadline'
    | 'New Internship Posted'
    | 'Faculty Verification Update';
  title: string;
  shortDescription: string;
  fullMessage: string;
  internshipTitle: string;
  studentName?: string;
  dateTime: string;
  isRead: boolean;
  relatedActionTarget?: 'candidate' | 'interview' | 'internship';
}

export const CompanyNotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);

  // Inline Non-blocking Feedback Toast
  const [feedback, setFeedback] = useState<string | null>(null);

  // Master Notifications State
  const [notifications, setNotifications] = useState<RecruiterNotification[]>([
    {
      id: 'n-1',
      type: 'New Applicant',
      title: 'New Applicant Applied',
      shortDescription: 'Aarav Sharma submitted an application for Frontend Developer Intern.',
      fullMessage:
        'Aarav Sharma from IIT Bombay (CGPA 9.2) submitted an application for your Frontend Developer Intern opening. Skill match rating is 94%.',
      internshipTitle: 'Frontend Developer Intern',
      studentName: 'Aarav Sharma',
      dateTime: 'Today • 10:15 AM',
      isRead: false,
      relatedActionTarget: 'candidate',
    },
    {
      id: 'n-2',
      type: 'Interview Scheduled',
      title: 'Technical Round Interview Scheduled',
      shortDescription: 'Interview confirmed with Rohan Mehta for 22 Aug 2026.',
      fullMessage:
        'Technical Round interview session confirmed with candidate Rohan Mehta for Frontend Developer Intern position on 22 Aug 2026 at 02:30 PM via Google Meet.',
      internshipTitle: 'Frontend Developer Intern',
      studentName: 'Rohan Mehta',
      dateTime: 'Today • 09:30 AM',
      isRead: false,
      relatedActionTarget: 'interview',
    },
    {
      id: 'n-3',
      type: 'Candidate Shortlisted',
      title: 'Candidate Shortlisted for Technical Round',
      shortDescription: 'Priya Patel was moved to Shortlisted stage.',
      fullMessage:
        'Priya Patel (COEP Pune) has been successfully evaluated and shortlisted for the Backend Developer Intern opening.',
      internshipTitle: 'Backend Developer Intern',
      studentName: 'Priya Patel',
      dateTime: 'Yesterday • 04:45 PM',
      isRead: false,
      relatedActionTarget: 'candidate',
    },
    {
      id: 'n-4',
      type: 'Faculty Verification Update',
      title: 'University Partner MoU Verified',
      shortDescription: 'Bits Pilani Training & Placement Office verified TechNova corporate listing.',
      fullMessage:
        'Official university verification badge updated for TechNova Inc. by BITS Pilani placement administration.',
      internshipTitle: 'Corporate Partnership',
      dateTime: '18 Aug 2026 • 02:15 PM',
      isRead: true,
    },
    {
      id: 'n-5',
      type: 'Candidate Selected',
      title: 'Candidate Offer Letter Accepted',
      shortDescription: 'Ananya Verma accepted UI/UX Design Intern offer.',
      fullMessage:
        'Ananya Verma accepted the formal offer letter for UI/UX Design Intern starting 01 Sep 2026.',
      internshipTitle: 'UI/UX Design Intern',
      studentName: 'Ananya Verma',
      dateTime: '17 Aug 2026 • 11:20 AM',
      isRead: true,
      relatedActionTarget: 'candidate',
    },
    {
      id: 'n-6',
      type: 'Internship Application Deadline',
      title: 'Application Deadline Approaching',
      shortDescription: 'Frontend Developer Intern deadline ends in 3 days.',
      fullMessage:
        'Reminder: Application cutoff window for Frontend Developer Intern will close on 30 Aug 2026.',
      internshipTitle: 'Frontend Developer Intern',
      dateTime: '16 Aug 2026 • 08:00 AM',
      isRead: true,
      relatedActionTarget: 'internship',
    },
  ]);

  // Selected Notification for Detail Section
  const [selectedNotification, setSelectedNotification] = useState<RecruiterNotification | null>(
    notifications[0]
  );

  // Filters State
  const [statusFilter, setStatusFilter] = useState<'All' | 'Unread' | 'Read'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Read / Unread counts
  const totalCount = notifications.length;
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Notification Selection Handler with Smooth Scroll
  const handleSelectNotification = (notif: RecruiterNotification) => {
    // Mark as read
    if (!notif.isRead) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
      );
    }

    setSelectedNotification({ ...notif, isRead: true });

    if (detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Mark all as read handler
  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setFeedback('All notifications marked as read.');
    setTimeout(() => setFeedback(null), 3000);
  };

  // Delete notification handler
  const handleDeleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (selectedNotification && selectedNotification.id === id) {
      setSelectedNotification(null);
    }
    setFeedback('Notification deleted.');
    setTimeout(() => setFeedback(null), 3000);
  };

  // Filter & Search Logic
  const filteredNotifications = notifications.filter((notif) => {
    const matchesFilter =
      statusFilter === 'All' ||
      (statusFilter === 'Unread' && !notif.isRead) ||
      (statusFilter === 'Read' && notif.isRead);

    const matchesSearch =
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.internshipTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (notif.studentName && notif.studentName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const getNotificationIcon = (type: RecruiterNotification['type']) => {
    switch (type) {
      case 'New Applicant':
        return <UserPlus className="w-4 h-4 text-blue-600" />;
      case 'Candidate Shortlisted':
        return <UserCheck className="w-4 h-4 text-indigo-600" />;
      case 'Interview Scheduled':
      case 'Interview Rescheduled':
        return <Calendar className="w-4 h-4 text-purple-600" />;
      case 'Interview Completed':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'Candidate Selected':
        return <Award className="w-4 h-4 text-emerald-600" />;
      case 'Candidate Rejected':
        return <XCircle className="w-4 h-4 text-rose-600" />;
      case 'Internship Application Deadline':
      case 'New Internship Posted':
        return <Briefcase className="w-4 h-4 text-blue-600" />;
      case 'Faculty Verification Update':
        return <Building className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <CompanySidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <CompanyHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Notifications"
          subtitle="Stay updated with your recruitment activity"
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-5xl w-full mx-auto pb-safe">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard/company')}
                className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h2 className="text-xl font-extrabold text-[#0f172a]">Notifications Center</h2>
                <p className="text-xs text-[#64748b]">
                  {unreadCount} unread out of {totalCount} total updates
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-[#2563eb] text-xs font-semibold shadow-2xs transition-colors cursor-pointer shrink-0"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Mark all as read</span>
              </button>
            )}
          </div>

          {/* Toast Notification Banner */}
          {feedback && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2 animate-in fade-in duration-150 text-left">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          {/* Search & Filter Pills Bar */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs space-y-3 text-left">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              {/* Filter Pills */}
              <div className="flex items-center space-x-1.5 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-[#2563eb] shrink-0 mr-1" />
                {(['All', 'Unread', 'Read'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                      statusFilter === st
                        ? 'bg-[#2563eb] text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notifications List */}
          {filteredNotifications.length > 0 ? (
            <div className="space-y-3 text-left">
              {filteredNotifications.map((notif) => {
                const isSelected = selectedNotification?.id === notif.id;

                return (
                  <div
                    key={notif.id}
                    onClick={() => handleSelectNotification(notif)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      !notif.isRead
                        ? 'bg-blue-50/50 border-blue-200 shadow-2xs'
                        : 'bg-white border-[#e2e8f0]'
                    } ${isSelected ? 'ring-2 ring-[#2563eb] border-[#2563eb]' : 'hover:border-blue-300'}`}
                  >
                    <div className="flex items-start space-x-3.5 min-w-0 flex-1">
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs shrink-0 mt-0.5">
                        {getNotificationIcon(notif.type)}
                      </div>

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          {!notif.isRead && (
                            <span className="w-2 h-2 rounded-full bg-[#2563eb] shrink-0" />
                          )}
                          <h3
                            className={`text-xs sm:text-sm font-bold truncate ${
                              !notif.isRead ? 'text-[#0f172a] font-extrabold' : 'text-slate-700'
                            }`}
                          >
                            {notif.title}
                          </h3>
                        </div>

                        <p className="text-xs text-[#64748b] leading-relaxed line-clamp-2">
                          {notif.shortDescription}
                        </p>

                        <div className="flex items-center space-x-3 text-[11px] text-slate-400 pt-1">
                          <span className="font-semibold text-[#2563eb]">
                            {notif.internshipTitle}
                          </span>
                          <span>•</span>
                          <span>{notif.dateTime}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleDeleteNotification(notif.id, e)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
                      title="Delete Notification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-12 text-center space-y-4 shadow-2xs max-w-md mx-auto my-6">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-[#2563eb] flex items-center justify-center mx-auto">
                <Bell className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#0f172a]">No notifications found</h3>
                <p className="text-xs text-[#64748b]">You're all caught up.</p>
              </div>
            </div>
          )}

          {/* Notification Details Section */}
          {selectedNotification && (
            <div
              ref={detailsRef}
              id="notification-details-section"
              className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-5 text-left scroll-mt-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200">
                    {getNotificationIcon(selectedNotification.type)}
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2563eb]">
                      {selectedNotification.type}
                    </span>
                    <h3 className="text-base font-extrabold text-[#0f172a]">
                      {selectedNotification.title}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedNotification(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs font-medium">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Message</span>
                  <p className="text-slate-800 leading-relaxed font-semibold">
                    {selectedNotification.fullMessage}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Internship</span>
                    <strong className="text-[#0f172a]">{selectedNotification.internshipTitle}</strong>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Date & Time</span>
                    <strong className="text-slate-700">{selectedNotification.dateTime}</strong>
                  </div>
                </div>
              </div>

              {/* Related Page Navigation CTA */}
              <div className="flex justify-end pt-3 border-t border-slate-100">
                {selectedNotification.relatedActionTarget === 'candidate' && (
                  <button
                    type="button"
                    onClick={() => navigate('/company/applicants')}
                    className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Candidate</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                  </button>
                )}

                {selectedNotification.relatedActionTarget === 'interview' && (
                  <button
                    type="button"
                    onClick={() => navigate('/company/interviews')}
                    className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>View Interview</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                  </button>
                )}

                {selectedNotification.relatedActionTarget === 'internship' && (
                  <button
                    type="button"
                    onClick={() => navigate('/company/internships')}
                    className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>View Internships</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
