import React, { useMemo } from 'react';
import { ReadinessScore } from './ReadinessScore';
import { useAuth } from '../../context/AuthContext';
import { useApplication } from '../../context/ApplicationContext';
import { calculateReadinessScore } from '../../utils/readinessScoreCalculator';
import type { StudentProfileData } from './ProfileHeader';

interface ReadinessCardProps {
  score?: number;
}

export const ReadinessCard: React.FC<ReadinessCardProps> = ({ score: propScore }) => {
  const { user } = useAuth();
  const { applications } = useApplication();

  const computedScore = useMemo(() => {
    if (typeof propScore === 'number') return propScore;
    if (!user?.id) return 78;

    const profileStorageKey = `interniq_student_profile_${user.id}`;
    const skillsStorageKey = `interniq_student_skills_${user.id}`;
    const certsStorageKey = `interniq_student_certs_${user.id}`;
    const projectsStorageKey = `interniq_student_projects_${user.id}`;

    let profile: Partial<StudentProfileData> = {};
    let skills: string[] = [];
    let certs: any[] = [];
    let projects: any[] = [];

    try {
      const savedProfile = localStorage.getItem(profileStorageKey);
      if (savedProfile) profile = JSON.parse(savedProfile);
    } catch (e) {}

    try {
      const savedSkills = localStorage.getItem(skillsStorageKey);
      if (savedSkills) skills = JSON.parse(savedSkills);
    } catch (e) {}

    try {
      const savedCerts = localStorage.getItem(certsStorageKey);
      if (savedCerts) certs = JSON.parse(savedCerts);
    } catch (e) {}

    try {
      const savedProjects = localStorage.getItem(projectsStorageKey);
      if (savedProjects) projects = JSON.parse(savedProjects);
    } catch (e) {}

    const evalResult = calculateReadinessScore(
      { name: user.name, email: user.email, ...profile },
      skills,
      certs,
      projects,
      applications
    );

    return evalResult.totalScore;
  }, [user, applications, propScore]);

  const readinessMetrics = [
    { label: 'Skills Alignment', score: Math.min(100, Math.max(60, computedScore + 4)) },
    { label: 'Profile Completeness', score: Math.min(100, Math.max(70, computedScore + 8)) },
    { label: 'Certifications', score: Math.min(100, Math.max(40, computedScore - 12)) },
    { label: 'Projects Completed', score: Math.min(100, Math.max(50, computedScore - 3)) },
  ];

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-[#0f172a]">Internship Readiness</h3>
        <span className="text-xs font-semibold text-[#2563eb] bg-[#eff6ff] border border-blue-200/60 px-2.5 py-1 rounded-full">
          {computedScore >= 75 ? 'High Match' : 'Active Progress'}
        </span>
      </div>

      {/* Reusable Animated Circular Readiness Score */}
      <div className="flex flex-col items-center justify-center py-1">
        <ReadinessScore score={computedScore} />
      </div>

      {/* Metric Breakdown Bars */}
      <div className="space-y-3 pt-2">
        {readinessMetrics.map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-600">{item.label}</span>
              <span className="text-[#0f172a] font-bold">{item.score}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2563eb] rounded-full transition-all duration-300"
                style={{ width: `${item.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
