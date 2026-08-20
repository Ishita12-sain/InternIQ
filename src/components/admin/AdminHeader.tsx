import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, LogOut } from 'lucide-react';
import { NotificationDropdown } from '../student/NotificationDropdown';
import { useNotification } from '../../context/NotificationContext';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';

interface AdminHeaderProps {
  onOpenSidebar: () => void;
  title?: string;
  subtitle?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onOpenSidebar,
  title = 'Admin Dashboard',
  subtitle = 'Platform-wide monitoring, user management, and compliance oversight.',
}) => {
  const navigate = useNavigate();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
  const { settings } = useSettings();
  const { user, logout } = useAuth();

  const dropdownNotifications = notifications.map((n) => ({
    id: n.id,
    title: n.title,
    shortMessage: n.message,
    timestamp: n.createdAt,
    isRead: n.read,
  }));

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
    const targetNotif = notifications.find((n) => n.id === id);
    if (targetNotif) {
      if (targetNotif.applicationId) navigate(`/admin/applications/${targetNotif.applicationId}`);
      else if (targetNotif.companyId) navigate(`/admin/companies/${targetNotif.companyId}`);
      else if (targetNotif.studentId) navigate(`/admin/students/${targetNotif.studentId}`);
      else if (targetNotif.internshipId) navigate(`/admin/internships/${targetNotif.internshipId}`);
      else if (targetNotif.verificationId) navigate(`/admin/verifications/${targetNotif.verificationId}`);
      else navigate('/admin/notifications');
    }
  };

  return (
    <header className="h-16 bg-white border-b border-[#e2e8f0] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        {/* Brand & Page Title */}
        <div className="flex items-center space-x-3 text-left">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs tracking-tighter shrink-0 shadow-2xs">
            IQ
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#0f172a] leading-none">{title}</h1>
            <p className="text-xs text-[#64748b] mt-1 hidden sm:block">{subtitle}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3 relative">
        {/* Notification Bell */}
        <button
          onClick={() => setIsNotificationsOpen((prev) => !prev)}
          className="relative p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          title="Admin Notifications"
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
          notifications={dropdownNotifications}
          onMarkAllAsRead={markAllAsRead}
          onNotificationClick={handleNotificationClick}
        />

        {/* Admin Avatar & Profile Button */}
        <div
          onClick={() => navigate('/admin/settings')}
          className="flex items-center space-x-2.5 pl-2 border-l border-slate-200 cursor-pointer hover:opacity-80 transition-opacity"
          title="System Admin Profile Settings"
        >
          {settings.adminProfile.photoUrl ? (
            <img
              src={settings.adminProfile.photoUrl}
              alt={user?.name || settings.adminProfile.name}
              className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-300 shadow-2xs"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#0f172a] text-blue-400 font-extrabold text-xs flex items-center justify-center border border-slate-700 shadow-2xs shrink-0">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'SU'}
            </div>
          )}
          <span className="text-xs font-bold text-[#0f172a] hidden md:inline-block">
            {user?.name || settings.adminProfile.name}
          </span>
        </div>

        {/* Quick Sign Out */}
        <button
          onClick={() => {
            logout();
            navigate('/login', { replace: true });
          }}
          title="Sign Out"
          className="hidden sm:p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
