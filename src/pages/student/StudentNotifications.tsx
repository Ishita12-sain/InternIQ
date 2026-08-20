import React, { useState, useMemo } from 'react';
import { StudentSidebar } from '../../components/student/StudentSidebar';
import { DashboardHeader } from '../../components/student/DashboardHeader';
import { NotificationFilters } from '../../components/student/NotificationFilters';
import type { NotificationFilterState } from '../../components/student/NotificationFilters';
import { NotificationCard } from '../../components/student/NotificationCard';
import type { NotificationItem } from '../../components/student/NotificationCard';
import { NotificationDetails } from '../../components/student/NotificationDetails';
import { BellOff, CheckCheck, RotateCcw } from 'lucide-react';

export const StudentNotifications: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filterState, setFilterState] = useState<NotificationFilterState>('All');

  // Realistic Mock Notifications List (7 Items)
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      type: 'Interview',
      title: 'Interview Scheduled — Google',
      shortMessage: 'Your interview for Software Engineering Intern at Google is scheduled for 20 Aug 2026.',
      fullMessage:
        'Congratulations! Google University Recruiting has scheduled your technical interview for 20 Aug 2026 at 10:30 AM IST. Please prepare using the technical study materials in your readiness module.',
      timestamp: 'Today, 10:30 AM',
      isRead: false,
      relatedCompany: 'Google',
      relatedRole: 'Software Engineering Intern',
    },
    {
      id: 'notif-2',
      type: 'Shortlisted',
      title: 'Shortlisted for Microsoft Internship',
      shortMessage: 'You have been shortlisted for Frontend Development Intern position.',
      fullMessage:
        'Microsoft Talent Acquisition verified your React & TypeScript profile benchmarks. You have been shortlisted for candidate round evaluations.',
      timestamp: 'Yesterday, 04:15 PM',
      isRead: false,
      relatedCompany: 'Microsoft',
      relatedRole: 'Frontend Development Intern',
    },
    {
      id: 'notif-3',
      type: 'Offer Letter',
      title: 'Official Offer Letter Dispatched — Infosys',
      shortMessage: 'Infosys released your official web development internship offer letter.',
      fullMessage:
        'Official Offer Letter from Infosys InStep Program has been uploaded to your Documents vault. Please review and acknowledge your acceptance.',
      timestamp: '17 Aug 2026, 11:00 AM',
      isRead: false,
      relatedCompany: 'Infosys',
      relatedRole: 'Web Development Intern',
    },
    {
      id: 'notif-4',
      type: 'Document Verification',
      title: 'NOC Verification Completed',
      shortMessage: 'Faculty advisor approved your college No Objection Certificate.',
      fullMessage:
        'Your uploaded Internship NOC document has been reviewed and verified by Dr. Ramesh Kumar (Faculty Mentor). Status updated to Verified.',
      timestamp: '16 Aug 2026, 02:45 PM',
      isRead: true,
      relatedCompany: 'College Training & Placement Cell',
    },
    {
      id: 'notif-5',
      type: 'Faculty Review',
      title: 'Weekly Logbook Entry Reviewed',
      shortMessage: 'Faculty mentor left feedback on your Week 3 logbook submission.',
      fullMessage:
        'Dr. Ramesh Kumar reviewed your latest digital logbook entry: "Good progress on React components and responsive styling. Continue maintaining clean code standards."',
      timestamp: '15 Aug 2026, 09:20 AM',
      isRead: true,
    },
    {
      id: 'notif-6',
      type: 'Digital Logbook',
      title: 'Logbook Entry Reminder',
      shortMessage: 'Don’t forget to log your daily internship activities for this week.',
      fullMessage:
        'Reminder: Ensure all technical tasks, learning outcomes, and logged hours are submitted before Friday 5:00 PM for faculty review.',
      timestamp: '14 Aug 2026, 06:00 PM',
      isRead: true,
    },
    {
      id: 'notif-7',
      type: 'Internship Status',
      title: 'Application Under Review — DataSphere',
      shortMessage: 'DataSphere Systems started reviewing your Data Analyst application.',
      fullMessage:
        'DataSphere HR team opened your profile. Application status transitioned from Applied to Under Review.',
      timestamp: '12 Aug 2026, 01:10 PM',
      isRead: true,
      relatedCompany: 'DataSphere Systems',
      relatedRole: 'Data Analyst Intern',
    },
  ]);

  const [selectedNotifId, setSelectedNotifId] = useState<string>('notif-1');

  // Metrics
  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  // Filtering
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (filterState === 'Unread') return !n.isRead;
      if (filterState === 'Read') return n.isRead;
      return true;
    });
  }, [notifications, filterState]);

  const selectedNotification = useMemo(() => {
    return (
      notifications.find((n) => n.id === selectedNotifId) ||
      filteredNotifications[0] ||
      null
    );
  }, [notifications, selectedNotifId, filteredNotifications]);

  // Actions
  const handleSelectNotification = (notif: NotificationItem) => {
    setSelectedNotifId(notif.id);
    if (!notif.isRead) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
      );
    }
    const detailsElem = document.getElementById('notification-details-section');
    if (detailsElem) {
      detailsElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleToggleRead = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleDeleteNotification = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm('Are you sure you want to delete this notification?')) {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (selectedNotifId === id) {
        const remaining = notifications.filter((n) => n.id !== id);
        if (remaining.length > 0) setSelectedNotifId(remaining[0].id);
      }
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      {/* Sidebar */}
      <StudentSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader onOpenSidebar={() => setIsSidebarOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto pb-safe">
          {/* Header & Unread Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f172a]">Notifications</h1>
                {unreadCount > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563eb] border border-blue-200 text-xs font-black">
                    {unreadCount} Unread
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[#64748b]">
                Stay updated with your internship journey
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#2563eb] text-xs font-bold transition-colors cursor-pointer shrink-0"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Mark All as Read</span>
              </button>
            )}
          </div>

          {/* Filter Bar */}
          <NotificationFilters
            currentFilter={filterState}
            onFilterChange={setFilterState}
            onMarkAllAsRead={handleMarkAllAsRead}
            hasUnread={unreadCount > 0}
          />

          {/* Notifications List */}
          {filteredNotifications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredNotifications.map((notif) => (
                <NotificationCard
                  key={notif.id}
                  notification={notif}
                  isSelected={selectedNotification?.id === notif.id}
                  onSelect={handleSelectNotification}
                  onToggleRead={handleToggleRead}
                  onDelete={handleDeleteNotification}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-12 text-center space-y-4 shadow-2xs">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-[#2563eb] flex items-center justify-center mx-auto">
                <BellOff className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#0f172a]">No notifications found</h3>
                <p className="text-xs text-[#64748b] max-w-sm mx-auto">
                  You currently have no notifications in the selected filter view.
                </p>
              </div>
              {filterState !== 'All' && (
                <button
                  type="button"
                  onClick={() => setFilterState('All')}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#2563eb] text-xs font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Show All Notifications</span>
                </button>
              )}
            </div>
          )}

          {/* Notification Details Section */}
          <NotificationDetails
            notification={selectedNotification}
            onToggleRead={handleToggleRead}
            onDelete={handleDeleteNotification}
          />
        </main>
      </div>
    </div>
  );
};
