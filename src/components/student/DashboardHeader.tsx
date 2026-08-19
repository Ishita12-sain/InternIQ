import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Bell } from 'lucide-react';
import { NotificationDropdown } from './NotificationDropdown';
import type { DropdownNotificationItem } from './NotificationDropdown';

interface DashboardHeaderProps {
  onOpenSidebar: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onOpenSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Mock Notifications for Header Dropdown
  const [notifications, setNotifications] = useState<DropdownNotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Interview Scheduled — Google',
      shortMessage: 'Your interview for Software Engineering Intern at Google is scheduled for 20 Aug 2026.',
      timestamp: '10:30 AM',
      isRead: false,
    },
    {
      id: 'notif-2',
      title: 'Shortlisted for Microsoft Internship',
      shortMessage: 'You have been shortlisted for Frontend Development Intern position.',
      timestamp: 'Yesterday',
      isRead: false,
    },
    {
      id: 'notif-3',
      title: 'Official Offer Letter — Infosys',
      shortMessage: 'Infosys released your official web development internship offer letter.',
      timestamp: '17 Aug',
      isRead: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const isProfilePage = location.pathname === '/student/profile';
  const isReadinessPage = location.pathname === '/student/readiness';
  const isSkillGapPage = location.pathname === '/student/skill-gap';
  const isRecommendedPage = location.pathname === '/student/recommended-internships';
  const isSearchPage = location.pathname === '/student/internship-search';
  const isApplicationsPage = location.pathname === '/student/applications';
  const isTimelinePage = location.pathname === '/student/timeline';
  const isDocumentsPage = location.pathname === '/student/documents';
  const isLogbookPage = location.pathname === '/student/logbook';
  const isNotificationsPage = location.pathname === '/student/notifications';

  const getTitle = () => {
    if (isProfilePage) return 'My Profile';
    if (isReadinessPage) return 'Readiness Score';
    if (isSkillGapPage) return 'Skill Gap Analysis';
    if (isRecommendedPage) return 'Recommended Internships';
    if (isSearchPage) return 'Internship Search';
    if (isApplicationsPage) return 'Applications';
    if (isTimelinePage) return 'Internship Timeline';
    if (isDocumentsPage) return 'Documents';
    if (isLogbookPage) return 'Digital Logbook';
    if (isNotificationsPage) return 'Notifications';
    return 'Dashboard';
  };

  const getSubtitle = () => {
    if (isProfilePage) return 'Manage your personal and academic information.';
    if (isReadinessPage) return 'Track your internship readiness and identify areas to improve.';
    if (isSkillGapPage) return 'Identify the skills you need to become internship-ready.';
    if (isRecommendedPage) return 'Internships matched with your skills and career interests.';
    if (isSearchPage) return 'Find internships that match your skills and interests.';
    if (isApplicationsPage) return 'Track and manage your internship applications.';
    if (isTimelinePage) return 'Track your internship journey.';
    if (isDocumentsPage) return 'Manage your internship documents';
    if (isLogbookPage) return 'Record your internship progress and learning';
    if (isNotificationsPage) return 'Stay updated with your internship journey';
    return 'Welcome back, Student!';
  };

  return (
    <header className="h-16 bg-white border-b border-[#e2e8f0] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="text-left">
          <h1 className="text-lg font-bold text-[#0f172a] leading-none">
            {getTitle()}
          </h1>
          <p className="text-xs text-[#64748b] mt-1 hidden sm:block">
            {getSubtitle()}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3 relative">
        {/* Notification Bell */}
        <button
          onClick={() => setIsNotificationsOpen((prev) => !prev)}
          className="relative p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
          )}
        </button>

        {/* Dropdown Panel */}
        <NotificationDropdown
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          notifications={notifications}
          onMarkAllAsRead={handleMarkAllAsRead}
          onNotificationClick={handleNotificationClick}
        />

        {/* Student Avatar */}
        <div
          onClick={() => navigate('/student/profile')}
          className="flex items-center space-x-2 pl-2 border-l border-slate-200 cursor-pointer hover:opacity-80 transition-opacity"
          title="View Profile"
        >
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
            AS
          </div>
          <span className="text-xs font-semibold text-[#0f172a] hidden md:inline-block">
            Aarav Sharma
          </span>
        </div>
      </div>
    </header>
  );
};
