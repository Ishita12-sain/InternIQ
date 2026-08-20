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
import { SkillResourceView } from '../../components/student/SkillResourceView';
import type { SkillResourceData } from '../../components/student/SkillResourceView';
import { BookOpen, Code, Container, Layers, Info } from 'lucide-react';

export const StudentSkillGap: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);

  const skillResourceMap: Record<string, SkillResourceData> = {
    '1': {
      skillId: '1',
      skillTitle: 'Learn REST APIs',
      explanation: 'REST APIs are fundamental for client-server communication in modern web applications.',
      resources: [
        {
          id: 'r1',
          title: 'REST API Crash Course - Fundamentals & HTTP Methods',
          type: 'Video',
          platform: 'YouTube (freeCodeCamp)',
          durationOrTime: '45 mins',
          url: 'https://www.youtube.com/watch?v=-MTSQjw51EQ',
        },
        {
          id: 'r2',
          title: 'MDN Web Docs: Introduction to REST APIs & HTTP Requests',
          type: 'Article',
          platform: 'MDN Web Docs',
          durationOrTime: '15 min read',
          url: 'https://developer.mozilla.org/en-US/docs/Glossary/REST',
        },
        {
          id: 'r3',
          title: 'Postman API Network & Hands-on REST Practice',
          type: 'Practice',
          platform: 'Postman Academy',
          durationOrTime: 'Interactive',
          url: 'https://learning.postman.com/',
        },
      ],
    },
    '2': {
      skillId: '2',
      skillTitle: 'Practice Advanced React',
      explanation: 'Advanced React patterns like custom hooks, performance tuning, and context optimization are required for senior frontend roles.',
      resources: [
        {
          id: 'r4',
          title: 'Advanced React Patterns, Custom Hooks & Performance Optimization',
          type: 'Video',
          platform: 'YouTube (React Official Channel / Traversy)',
          durationOrTime: '1 hr 15 mins',
          url: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
        },
        {
          id: 'r5',
          title: 'React Official Documentation: Reusing Logic with Custom Hooks',
          type: 'Article',
          platform: 'React Official Docs',
          durationOrTime: '20 min read',
          url: 'https://react.dev/learn/reusing-logic-with-custom-hooks',
        },
        {
          id: 'r6',
          title: 'Frontend Mentor: Build a Complex React State Management App',
          type: 'Practice',
          platform: 'Frontend Mentor',
          durationOrTime: 'Hands-on Project',
          url: 'https://www.frontendmentor.io/',
        },
      ],
    },
    '3': {
      skillId: '3',
      skillTitle: 'Build a Docker Project',
      explanation: 'Containerization with Docker ensures application portability and is widely used across backend and DevOps teams.',
      resources: [
        {
          id: 'r7',
          title: 'Docker Tutorial for Beginners - Full Course',
          type: 'Video',
          platform: 'YouTube (TechWorld with Nana)',
          durationOrTime: '2 hrs',
          url: 'https://www.youtube.com/watch?v=3c-iBn73dDE',
        },
        {
          id: 'r8',
          title: 'Docker Official Get Started Documentation',
          type: 'Article',
          platform: 'Docker Docs',
          durationOrTime: '25 min read',
          url: 'https://docs.docker.com/get-started/',
        },
        {
          id: 'r9',
          title: 'Play with Docker: Online Interactive Lab',
          type: 'Practice',
          platform: 'Docker Labs',
          durationOrTime: 'Interactive Lab',
          url: 'https://labs.play-with-docker.com/',
        },
      ],
    },
    '4': {
      skillId: '4',
      skillTitle: 'Study System Design',
      explanation: 'System design fundamentals help you architect scalable microservices, implement caching, and understand load balancing.',
      resources: [
        {
          id: 'r10',
          title: 'System Design Primer for Beginners',
          type: 'Video',
          platform: 'YouTube (ByteByteGo)',
          durationOrTime: '55 mins',
          url: 'https://www.youtube.com/watch?v=i53Gi_K3o7I',
        },
        {
          id: 'r11',
          title: 'The System Design Primer - GitHub Master Reference',
          type: 'Article',
          platform: 'GitHub Reference',
          durationOrTime: 'Comprehensive Guide',
          url: 'https://github.com/donnemartin/system-design-primer',
        },
        {
          id: 'r12',
          title: 'LeetCode System Design Interview Practice',
          type: 'Practice',
          platform: 'LeetCode / Exponent',
          durationOrTime: 'Practice Problems',
          url: 'https://leetcode.com/explore/interview/card/system-design/',
        },
      ],
    },
  };

  const handleImproveSkill = (actionId: string) => {
    setSelectedSkillId(actionId);
    setTimeout(() => {
      const element = document.getElementById('skill-resource-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

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
            <RecommendedActions actions={recommendedActions} onImprove={handleImproveSkill} />
          </div>

          {/* Dedicated Skill Improvement & Resource View */}
          {selectedSkillId && skillResourceMap[selectedSkillId] && (
            <SkillResourceView
              data={skillResourceMap[selectedSkillId]}
              onBack={() => setSelectedSkillId(null)}
            />
          )}
        </main>
      </div>
    </div>
  );
};
