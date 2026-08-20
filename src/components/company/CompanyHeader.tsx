import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell } from 'lucide-react';
import { NotificationDropdown } from '../student/NotificationDropdown';
import type { DropdownNotificationItem } from '../student/NotificationDropdown';
import { useAuth } from '../../context/AuthContext';

interface CompanyHeaderProps {
  onOpenSidebar: () => void;
  title?: string;
  subtitle?: string;
}

export const CompanyHeader: React.FC<CompanyHeaderProps> = ({
  onOpenSidebar,
  title = 'Company Dashboard',
  subtitle = 'Manage your internships, applications, and candidate evaluations.',
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [notifications, setNotifications] = useState<DropdownNotificationItem[]>([
    {
      id: 'notif-c1',
      title: 'New Application Received',
      shortMessage: 'Aarav Sharma applied for Frontend Developer Intern.',
      timestamp: '10:15 AM',
      isRead: false,
    },
    {
      id: 'notif-c2',
      title: 'Interview Confirmed',
      shortMessage: 'Rohan Mehta confirmed technical interview for 22 Aug 2026.',
      timestamp: 'Yesterday',
      isRead: false,
    },
    {
      id: 'notif-c3',
      title: 'Listing Approved',
      shortMessage: 'Your Backend Developer Intern position was verified & published.',
      timestamp: '18 Aug',
      isRead: true,
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

  // Profile photo state sync from localStorage
  const [profilePhoto, setProfilePhoto] = useState<string | null>(() => {
    return localStorage.getItem('interniq_company_logo') || null;
  });

  // Listen for storage changes
  React.useEffect(() => {
    const handleStorage = () => {
      setProfilePhoto(localStorage.getItem('interniq_company_logo') || null);
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('companyProfileUpdated', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('companyProfileUpdated', handleStorage);
    };
  }, []);

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
          <h1 className="text-lg font-bold text-[#0f172a] leading-none">{title}</h1>
          <p className="text-xs text-[#64748b] mt-1 hidden sm:block">{subtitle}</p>
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

        {/* Company Avatar & Profile */}
        <div
          onClick={() => navigate('/company/profile')}
          className="flex items-center space-x-2.5 pl-2 border-l border-slate-200 cursor-pointer hover:opacity-80 transition-opacity"
          title="Company Profile"
        >
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt="Company Profile Logo"
              className="w-8 h-8 rounded-full object-cover border border-blue-200 shadow-2xs shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-2xs shrink-0">
              {user?.companyName ? user.companyName.slice(0, 2).toUpperCase() : user?.name ? user.name.slice(0, 2).toUpperCase() : 'CO'}
            </div>
          )}
          <span className="text-xs font-bold text-[#0f172a] hidden md:inline-block">
            {user?.companyName || user?.name || 'Company Portal'}
          </span>
        </div>
      </div>
    </header>
  );
};
