import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  Award,
  CheckCircle,
  BarChart2,
  Bell,
  Settings,
  X,
  ChevronRight,
  LogOut,
  Sliders,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useSettings();
  const { user, logout } = useAuth();

  const handleSignOut = () => {
    logout();
    navigate('/login', { replace: true });
    onClose();
  };

  const displayName = user?.name || settings.adminProfile.name || 'System Admin';
  const displayEmail = user?.email || settings.adminProfile.email || 'admin@interniq.edu';
  const initials = user?.name
    ? user.name.split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : settings.adminProfile.avatarInitials || 'AD';

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Users', path: '/admin/users', icon: <Users className="w-4 h-4" /> },
    { label: 'Students', path: '/admin/students', icon: <Users className="w-4 h-4" /> },
    { label: 'Companies', path: '/admin/companies', icon: <Building2 className="w-4 h-4" /> },
    { label: 'Internships', path: '/admin/internships', icon: <Briefcase className="w-4 h-4" /> },
    { label: 'Applications', path: '/admin/applications', icon: <Award className="w-4 h-4" /> },
    { label: 'Verifications', path: '/admin/verifications', icon: <CheckCircle className="w-4 h-4" /> },
    { label: 'Analytics', path: '/admin/analytics', icon: <BarChart2 className="w-4 h-4" /> },
    { label: 'Notifications', path: '/admin/notifications', icon: <Bell className="w-4 h-4" /> },
    { label: 'Portal Controls', path: '/admin/controls', icon: <Sliders className="w-4 h-4" /> },
    { label: 'Settings', path: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
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
        className={`fixed lg:static top-0 left-0 bottom-0 w-64 bg-[#0f172a] text-slate-300 z-50 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => navigate('/login')}>
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs tracking-tighter">
                AD
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Intern<span className="text-blue-500">IQ</span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md ml-1">
                Admin
              </span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            {navItems.map((item) => {
              const isItemActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);

              return (
                <button
                  key={item.label}
                  onClick={() => {
                    navigate(item.path);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    isItemActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className={isItemActive ? 'text-white' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {isItemActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center justify-between">
            <div
              onClick={() => {
                navigate('/admin/settings');
                onClose();
              }}
              className="flex items-center space-x-3 truncate cursor-pointer hover:opacity-80 transition-opacity"
            >
              {settings.adminProfile.photoUrl ? (
                <img
                  src={settings.adminProfile.photoUrl}
                  alt={displayName}
                  className="w-9 h-9 rounded-xl object-cover shrink-0 border border-slate-700 shadow-2xs"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-slate-800 text-blue-400 font-extrabold flex items-center justify-center text-xs border border-slate-700 shadow-2xs shrink-0">
                  {initials}
                </div>
              )}
              <div className="truncate text-left">
                <p className="text-xs font-bold text-slate-100 truncate">{displayName}</p>
                <p className="text-[11px] text-slate-400 truncate">{displayEmail}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
