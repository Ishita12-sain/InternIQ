import React, { useState } from 'react';
import { StudentSidebar } from '../../components/student/StudentSidebar';
import { DashboardHeader } from '../../components/student/DashboardHeader';
import { SkillGapSummary } from '../../components/student/SkillGapSummary';
import { SkillMatchCard } from '../../components/student/SkillMatchCard';
import { CurrentSkills } from '../../components/student/CurrentSkills';
import type { CurrentSkillItem } from '../../components/student/CurrentSkills';
import { SkillsToImprove } from '../../components/student/SkillsToImprove';
import type { ImproveSkillItem } from '../../components/student/SkillsToImprove';
import { SkillComparison } from '../../components/student/SkillComparison';
import type { ComparisonSkill } from '../../components/student/SkillComparison';
import { RecommendedActions } from '../../components/student/RecommendedActions';
import type { ActionItem } from '../../components/student/RecommendedActions';
import { BookOpen, Code, Container, Layers, Info } from 'lucide-react';

export const StudentSkillGap: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const currentSkills: CurrentSkillItem[] = [
    { name: 'React', level: 'Strong' },
    { name: 'JavaScript', level: 'Strong' },
    { name: 'TypeScript', level: 'Strong' },
    { name: 'HTML', level: 'Strong' },
    { name: 'CSS', level: 'Strong' },
    { name: 'Node.js', level: 'Intermediate' },
    { name: 'SQL', level: 'Intermediate' },
    { name: 'Git', level: 'Strong' },
  ];

  const skillsToImprove: ImproveSkillItem[] = [
    { name: 'Advanced React', currentLevel: 'Intermediate', requiredLevel: 'Advanced', priority: 'High' },
    { name: 'REST APIs', currentLevel: 'Basic', requiredLevel: 'Advanced', priority: 'High' },
    { name: 'Docker', currentLevel: 'Basic', requiredLevel: 'Intermediate', priority: 'Medium' },
    { name: 'System Design', currentLevel: 'Basic', requiredLevel: 'Intermediate', priority: 'Medium' },
  ];

  const comparisonSkills: ComparisonSkill[] = [
    { name: 'React', currentPct: 80, requiredPct: 90 },
    { name: 'REST APIs', currentPct: 40, requiredPct: 85 },
    { name: 'Node.js', currentPct: 60, requiredPct: 75 },
    { name: 'SQL', currentPct: 65, requiredPct: 70 },
    { name: 'Docker', currentPct: 30, requiredPct: 65 },
    { name: 'System Design', currentPct: 35, requiredPct: 60 },
  ];

  const recommendedActions: ActionItem[] = [
    {
      id: '1',
      title: 'Learn REST APIs',
      subtitle: 'Master API design, HTTP methods & status codes',
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      id: '2',
      title: 'Practice Advanced React',
      subtitle: 'Custom hooks, performance & context patterns',
      icon: <Code className="w-4 h-4" />,
    },
    {
      id: '3',
      title: 'Build a Docker Project',
      subtitle: 'Containerize node apps and compose services',
      icon: <Container className="w-4 h-4" />,
    },
    {
      id: '4',
      title: 'Study System Design',
      subtitle: 'Caching, load balancers & database scaling',
      icon: <Layers className="w-4 h-4" />,
    },
  ];

  const handleScrollToSection = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

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

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {/* Header */}
          <div className="text-left space-y-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f172a]">Skill Gap Analysis</h1>
            <p className="text-xs sm:text-sm text-[#64748b]">
              Identify the skills you need to become internship-ready.
            </p>
          </div>

          {/* Top 3 Metric Summary Cards */}
          <SkillGapSummary
            currentCount={8}
            requiredCount={12}
            gapCount={4}
            onCardClick={handleScrollToSection}
          />

          {/* Skill Match Card & Overall Gap Status */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8">
              <SkillMatchCard
                matchPercentage={67}
                recommendationMessage="4 skills are recommended for improvement."
              />
            </div>

            {/* Overall Status Card */}
            <div className="lg:col-span-4 bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-2 text-left h-full flex flex-col justify-center">
              <div className="flex items-center space-x-2 text-emerald-600 font-bold text-xs">
                <Info className="w-4 h-4" />
                <span>Current Status</span>
              </div>
              <h3 className="text-base font-extrabold text-[#0f172a]">"You're making good progress."</h3>
              <p className="text-xs text-[#64748b] leading-relaxed">
                4 skills need improvement before you reach your target readiness level.
              </p>
            </div>
          </div>

          {/* Current & Missing Skills Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CurrentSkills skills={currentSkills} />
            <SkillsToImprove skills={skillsToImprove} />
          </div>

          {/* Level Comparison & Action Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkillComparison skills={comparisonSkills} />
            <RecommendedActions actions={recommendedActions} />
          </div>
        </main>
      </div>
    </div>
  );
};
