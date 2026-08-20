import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Award,
  Target,
  Sparkles,
  Search,
  FileText,
  Clock,
  Folder,
  BookOpen,
  Bell,
  LogOut,
  X,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface StudentSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudentSidebar: React.FC<StudentSidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleSignOut = () => {
    logout();
    navigate('/login', { replace: true });
    onClose();
  };

  const displayName = user?.name || 'Student';
  const displayEmail = user?.email || 'student@interniq.edu';
  const initials = user?.name
    ? user.name
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'ST';

  const navItems = [
    { label: 'Dashboard', path: '/dashboard/student', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Profile', path: '/student/profile', icon: <User className="w-4 h-4" /> },
    { label: 'Readiness Score', path: '/student/readiness', icon: <Award className="w-4 h-4" /> },
    { label: 'Skill Gap', path: '/student/skill-gap', icon: <Target className="w-4 h-4" /> },
    { label: 'Recommended Internships', path: '/student/recommended-internships', icon: <Sparkles className="w-4 h-4" /> },
    { label: 'Internship Search', path: '/student/internship-search', icon: <Search className="w-4 h-4" /> },
    { label: 'Applications', path: '/student/applications', icon: <FileText className="w-4 h-4" /> },
    { label: 'Internship Timeline', path: '/student/timeline', icon: <Clock className="w-4 h-4" /> },
    { label: 'Documents', path: '/student/documents', icon: <Folder className="w-4 h-4" /> },
    { label: 'Digital Logbook', path: '/student/logbook', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Notifications', path: '/student/notifications', icon: <Bell className="w-4 h-4" /> },
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
              className="lg:hidden p-1 text-slate-400 hover:text-slate-600 rounded-lg"
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

        {/* Bottom Student Profile Footer */}
        <div className="p-4 border-t border-[#e2e8f0] bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 truncate">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-[#2563eb] font-bold flex items-center justify-center text-xs shrink-0">
                {initials}
              </div>
              <div className="truncate text-left">
                <p className="text-xs font-bold text-[#0f172a] truncate">{displayName}</p>
                <p className="text-[11px] text-[#64748b] truncate">{displayEmail}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
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
