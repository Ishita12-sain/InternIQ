import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Bell } from 'lucide-react';

interface DashboardHeaderProps {
  onOpenSidebar: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onOpenSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isProfilePage = location.pathname === '/student/profile';
  const isReadinessPage = location.pathname === '/student/readiness';
  const isSkillGapPage = location.pathname === '/student/skill-gap';

  const getTitle = () => {
    if (isProfilePage) return 'My Profile';
    if (isReadinessPage) return 'Readiness Score';
    if (isSkillGapPage) return 'Skill Gap Analysis';
    return 'Dashboard';
  };

  const getSubtitle = () => {
    if (isProfilePage) return 'Manage your personal and academic information.';
    if (isReadinessPage) return 'Track your internship readiness and identify areas to improve.';
    if (isSkillGapPage) return 'Identify the skills you need to become internship-ready.';
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

      <div className="flex items-center space-x-3">
        {/* Notification Bell */}
        <button
          onClick={() => alert("No new notifications")}
          className="relative p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-blue-100"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
        </button>

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
