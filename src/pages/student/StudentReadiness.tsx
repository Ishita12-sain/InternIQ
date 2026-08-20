import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudentSidebar } from '../../components/student/StudentSidebar';
import { DashboardHeader } from '../../components/student/DashboardHeader';
import { ReadinessOverview } from '../../components/student/ReadinessOverview';
import { ReadinessBreakdown } from '../../components/student/ReadinessBreakdown';
import type { CategoryScore } from '../../components/student/ReadinessBreakdown';
import { StrengthsSection } from '../../components/student/StrengthsSection';
import { ImprovementSection } from '../../components/student/ImprovementSection';
import { Code2, User, FileText, FolderGit2, Award } from 'lucide-react';

export const StudentReadiness: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const categories: CategoryScore[] = [
    {
      key: 'skills',
      name: 'Skills',
      percentage: 82,
      icon: <Code2 className="w-4 h-4" />,
      status: 'High Match',
    },
    {
      key: 'profile',
      name: 'Profile',
      percentage: 90,
      icon: <User className="w-4 h-4" />,
      status: 'Nearly Complete',
    },
    {
      key: 'resume',
      name: 'Resume',
      percentage: 75,
      icon: <FileText className="w-4 h-4" />,
      status: 'Good Format',
    },
    {
      key: 'projects',
      name: 'Projects',
      percentage: 70,
      icon: <FolderGit2 className="w-4 h-4" />,
      status: '2 Featured',
    },
    {
      key: 'certifications',
      name: 'Certifications',
      percentage: 65,
      icon: <Award className="w-4 h-4" />,
      status: '2 Verified',
    },
  ];

  const strengths = [
    'Strong technical skills in React, TypeScript, and Git',
    'Complete profile with high academic standing (8.4 CGPA)',
    'Good academic performance and institution alignment',
  ];

  const improvements = [
    {
      id: '1',
      title: 'Add more industry certifications to boost credibility',
      actionText: 'Add Certification',
      targetPath: '/student/profile',
    },
    {
      id: '2',
      title: 'Improve resume with quantifiable project metrics',
      actionText: 'Update Resume',
      targetPath: '/student/profile',
    },
    {
      id: '3',
      title: 'Add more full-stack showcase projects',
      actionText: 'Add Project',
      targetPath: '/student/profile',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-[#0f172a]">
      {/* Sidebar */}
      <StudentSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader onOpenSidebar={() => setIsSidebarOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {/* Header Description */}
          <div className="text-left space-y-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f172a]">Readiness Score</h1>
            <p className="text-xs sm:text-sm text-[#64748b]">
              Track your internship readiness and identify areas to improve.
            </p>
          </div>

          {/* Top Overview Score Card */}
          <ReadinessOverview score={78} status="Good Progress" />

          {/* Score Breakdown Cards */}
          <ReadinessBreakdown categories={categories} />

          {/* Strengths & Improvements 2-Column Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StrengthsSection strengths={strengths} />
            <ImprovementSection
              improvements={improvements}
              onActionClick={(path) => navigate(path)}
            />
          </div>
        </main>
      </div>
    </div>
  );
};
