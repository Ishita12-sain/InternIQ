import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Building2,
  UserCheck,
  Briefcase,
  FileText,
  ShieldCheck,
  BarChart3,
  PieChart,
  Bell,
  Settings,
  LogOut,
  X,
  ChevronRight,
  History,
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

import { useSettings } from '../../context/SettingsContext';

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useSettings();

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Users Overview', path: '/admin/users', icon: <Users className="w-4 h-4" /> },
    { label: 'Students', path: '/admin/students', icon: <GraduationCap className="w-4 h-4" /> },
    { label: 'Companies', path: '/admin/companies', icon: <Building2 className="w-4 h-4" /> },
    { label: 'Faculty', path: '/admin/faculty', icon: <UserCheck className="w-4 h-4" /> },
    { label: 'Internships', path: '/admin/internships', icon: <Briefcase className="w-4 h-4" /> },
    { label: 'Applications', path: '/admin/applications', icon: <FileText className="w-4 h-4" /> },
    { label: 'Verifications', path: '/admin/verifications', icon: <ShieldCheck className="w-4 h-4" /> },
    { label: 'Analytics', path: '/admin/analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'Reports', path: '/admin/reports', icon: <PieChart className="w-4 h-4" /> },
    { label: 'Notifications', path: '/admin/notifications', icon: <Bell className="w-4 h-4" /> },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: <History className="w-4 h-4" /> },
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
        className={`fixed lg:static top-0 left-0 bottom-0 w-64 bg-white border-r border-[#e2e8f0] z-50 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-[#e2e8f0]">
            <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => navigate('/login')}>
              <div className="w-8 h-8 rounded-lg bg-[#2563eb] flex items-center justify-center text-white font-black text-lg tracking-tighter">
                IQ
              </div>
              <span className="text-xl font-extrabold tracking-tight text-[#0f172a]">
                Intern<span className="text-[#2563eb]">IQ</span>
              </span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            {navItems.map((item) => {
              const isItemActive = location.pathname === item.path;

              return (
                <button
                  key={item.label}
                  onClick={() => {
                    navigate(item.path);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    isItemActive
                      ? 'bg-[#eff6ff] text-[#2563eb] border border-blue-200/60 shadow-2xs'
                      : 'text-[#64748b] hover:bg-slate-50 hover:text-[#0f172a]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className={isItemActive ? 'text-[#2563eb]' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {isItemActive && <ChevronRight className="w-3.5 h-3.5 text-[#2563eb]" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Admin Profile Footer */}
        <div className="p-4 border-t border-[#e2e8f0] bg-slate-50/50">
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
                  alt={settings.adminProfile.name}
                  className="w-9 h-9 rounded-xl object-cover shrink-0 border border-slate-200 shadow-2xs"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs">
                  {settings.adminProfile.avatarInitials || 'SU'}
                </div>
              )}
              <div className="truncate text-left">
                <p className="text-xs font-bold text-[#0f172a] truncate">{settings.adminProfile.name}</p>
                <p className="text-[11px] text-[#64748b] truncate">{settings.adminProfile.email}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/login')}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
