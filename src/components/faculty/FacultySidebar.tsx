import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Briefcase,
  FileText,
  PieChart,
  Bell,
  User,
  Settings,
  X,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useNotification } from '../../context/NotificationContext';

interface FacultySidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FacultySidebar: React.FC<FacultySidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useSettings();
  const { unreadCount } = useNotification();

  const navItems = [
    { label: 'Dashboard', path: '/faculty/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'My Mentees', path: '/faculty/mentees', icon: <Users className="w-4 h-4" /> },
    { label: 'Students', path: '/faculty/students', icon: <GraduationCap className="w-4 h-4" /> },
    { label: 'Internships', path: '/faculty/internships', icon: <Briefcase className="w-4 h-4" /> },
    { label: 'Applications', path: '/faculty/applications', icon: <FileText className="w-4 h-4" /> },
    { label: 'Reports', path: '/faculty/reports', icon: <PieChart className="w-4 h-4" /> },
    { label: 'Notifications', path: '/faculty/notifications', icon: <Bell className="w-4 h-4" /> },
    { label: 'Profile', path: '/faculty/profile', icon: <User className="w-4 h-4" /> },
    { label: 'Settings', path: '/faculty/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 w-64 bg-white border-r border-[#e2e8f0] z-50 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Header Brand */}
          <div className="h-16 px-6 border-b border-[#e2e8f0] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-xs tracking-tight shadow-2xs">
                IQ
              </div>
              <span className="font-black text-base text-[#0f172a] tracking-tight">
                Faculty<span className="text-indigo-600">Portal</span>
              </span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/faculty/dashboard' && location.pathname.startsWith(item.path));
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 font-extrabold shadow-2xs'
                      : 'text-[#64748b] hover:bg-slate-50 hover:text-[#0f172a]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={isActive ? 'text-indigo-600' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.label === 'Notifications' && unreadCount > 0 ? (
                    <span className="px-2 py-0.5 bg-indigo-600 text-white font-black text-[10px] rounded-full">
                      {unreadCount}
                    </span>
                  ) : isActive ? (
                    <ChevronRight className="w-3.5 h-3.5 text-indigo-600" />
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile Footer */}
        <div className="p-4 border-t border-[#e2e8f0] bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div
              onClick={() => {
                navigate('/faculty/profile');
                onClose();
              }}
              className="flex items-center space-x-3 truncate cursor-pointer hover:opacity-80 transition-opacity"
            >
              {settings.adminProfile.photoUrl ? (
                <img
                  src={settings.adminProfile.photoUrl}
                  alt={settings.adminProfile.name}
                  className="w-9 h-9 rounded-xl object-cover shrink-0 border border-slate-200 shadow-2xs"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs">
                  FM
                </div>
              )}
              <div className="truncate text-left">
                <p className="text-xs font-bold text-[#0f172a] truncate">Dr. Aristh (Faculty)</p>
                <p className="text-[11px] text-[#64748b] truncate">faculty@interniq.edu</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/login')}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
