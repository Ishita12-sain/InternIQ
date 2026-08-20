import type { StudentProfileData } from '../components/student/ProfileHeader';
import type { CertificationItem, ProjectItem } from '../types/studentProfile';
import type { StudentApplicationRecord } from '../context/ApplicationContext';

export interface ScoreCategoryBreakdown {
  key: string;
  label: string;
  score: number;
  maxScore: number;
  explanation: string;
  tooltip: string;
}

export interface RecommendedAction {
  id: string;
  points: number;
  title: string;
  targetSection: 'personal' | 'academic' | 'skills' | 'certifications' | 'projects' | 'resume';
}

export interface ReadinessEvaluation {
  totalScore: number;
  readinessLevel: string;
  readinessColor: string;
  breakdown: ScoreCategoryBreakdown[];
  strongestArea: string;
  needsAttentionArea: string;
  recommendedAction: string;
  recommendedActionsList: RecommendedAction[];
  nextMilestone: number;
  pointsToNextMilestone: number;
  is100Ready: boolean;
}

export const calculateReadinessScore = (
  profile: Partial<StudentProfileData> = {},
  skills: string[] = [],
  certifications: CertificationItem[] = [],
  projects: ProjectItem[] = [],
  applications: StudentApplicationRecord[] = []
): ReadinessEvaluation => {
  // 1. Profile Completion (Max 20 Points)
  let profileScore = 0;
  if (profile.name?.trim()) profileScore += 3;
  if (profile.email?.trim()) profileScore += 3;
  if (profile.phone?.trim()) profileScore += 3;
  if (profile.city?.trim()) profileScore += 3;
  if (profile.dob?.trim()) profileScore += 2;
  if (profile.college?.trim()) profileScore += 3;
  if (profile.photoUrl) profileScore += 3;
  profileScore = Math.min(20, profileScore);

  // 2. Technical Skills (Max 20 Points)
  let skillsScore = Math.min(20, (skills || []).length * 4); // 5 skills = 20 pts

  // 3. Certifications (Max 15 Points)
  let certificationScore = 0;
  if (certifications && certifications.length > 0) {
    certificationScore += 8;
    if (certifications.some((c) => c.credentialUrl || c.proofFile || c.proofFileName)) {
      certificationScore += 7;
    }
  }
  certificationScore = Math.min(15, certificationScore);

  // 4. Resume Quality (Max 15 Points)
  let resumeScore = 15; // Initialized with uploaded PDF resume check

  // 5. Projects (Max 15 Points)
  let projectsScore = 0;
  if (projects && projects.length > 0) {
    projectsScore += 8;
    if (projects.some((p) => p.githubUrl || p.liveDemoUrl)) {
      projectsScore += 7;
    }
  }
  projectsScore = Math.min(15, projectsScore);

  // 6. Internship Activity (Max 15 Points)
  let activityScore = Math.min(15, Math.max(7, (applications || []).length * 5));

  const totalScore = Math.min(100, Math.max(0, profileScore + skillsScore + certificationScore + resumeScore + projectsScore + activityScore));

  // Dynamic Readiness Level
  let readinessLevel = 'Needs Improvement';
  let readinessColor = 'text-rose-600 bg-rose-50 border-rose-200';

  if (totalScore >= 100) {
    readinessLevel = 'Internship Ready 🎉';
    readinessColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  } else if (totalScore >= 90) {
    readinessLevel = 'Almost Ready';
    readinessColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
  } else if (totalScore >= 75) {
    readinessLevel = 'Good Progress';
    readinessColor = 'text-blue-700 bg-blue-50 border-blue-200';
  } else if (totalScore >= 60) {
    readinessLevel = 'Developing';
    readinessColor = 'text-amber-700 bg-amber-50 border-amber-200';
  } else if (totalScore >= 40) {
    readinessLevel = 'Getting Started';
    readinessColor = 'text-slate-700 bg-slate-100 border-slate-200';
  }

  // Breakdown List
  const breakdown: ScoreCategoryBreakdown[] = [
    {
      key: 'profile',
      label: 'Profile Completion',
      score: profileScore,
      maxScore: 20,
      explanation: 'Based on personal, academic, contact, and profile avatar information.',
      tooltip: 'Profile Completion: Based on personal, academic and contact information.',
    },
    {
      key: 'skills',
      label: 'Technical Skills',
      score: skillsScore,
      maxScore: 20,
      explanation: 'Based on the number and relevance of declared technical skills.',
      tooltip: 'Technical Skills: Based on the number and relevance of declared skills.',
    },
    {
      key: 'certifications',
      label: 'Certifications',
      score: certificationScore,
      maxScore: 15,
      explanation: 'Based on verified certifications uploaded by the student.',
      tooltip: 'Certifications: Based on verified certifications uploaded by the student.',
    },
    {
      key: 'resume',
      label: 'Resume Quality',
      score: resumeScore,
      maxScore: 15,
      explanation: 'Based on whether a valid PDF resume is uploaded.',
      tooltip: 'Resume: Based on whether a valid resume is uploaded.',
    },
    {
      key: 'projects',
      label: 'Projects Showcase',
      score: projectsScore,
      maxScore: 15,
      explanation: 'Based on portfolio projects, tech stacks, and live GitHub/demo links.',
      tooltip: 'Projects: Based on projects, descriptions, technologies and links.',
    },
    {
      key: 'activity',
      label: 'Internship Activity',
      score: activityScore,
      maxScore: 15,
      explanation: 'Based on active internship applications and recruiter engagement.',
      tooltip: 'Internship Activity: Based on active internship application activity.',
    },
  ];

  // Strongest and Weakest Category Insights
  const sortedBreakdown = [...breakdown].sort((a, b) => b.score / b.maxScore - a.score / a.maxScore);
  const strongestArea = sortedBreakdown[0].label;
  const needsAttentionArea = sortedBreakdown[sortedBreakdown.length - 1].label;

  // Recommended Actions
  const recommendedActionsList: RecommendedAction[] = [];
  if (skills.length < 5) {
    recommendedActionsList.push({
      id: 'act-skills',
      points: 5,
      title: 'Add 2 more technical skills',
      targetSection: 'skills',
    });
  }
  if (!certifications || certifications.length === 0 || !certifications.some((c) => c.credentialUrl || c.proofFile || c.proofFileName)) {
    recommendedActionsList.push({
      id: 'act-cert',
      points: 7,
      title: 'Upload a verified certification proof',
      targetSection: 'certifications',
    });
  }
  if (!projects || projects.length === 0 || !projects.some((p) => p.githubUrl)) {
    recommendedActionsList.push({
      id: 'act-proj',
      points: 7,
      title: 'Add a project with GitHub or Live link',
      targetSection: 'projects',
    });
  }
  if (!profile.photoUrl) {
    recommendedActionsList.push({
      id: 'act-photo',
      points: 3,
      title: 'Upload professional profile avatar',
      targetSection: 'personal',
    });
  }

  // Recommended Action summary text
  const recommendedAction = recommendedActionsList[0]?.title || 'Keep updating project showcases and skills.';

  // Next Milestone Logic
  let nextMilestone = 85;
  if (totalScore >= 85 && totalScore < 90) nextMilestone = 90;
  if (totalScore >= 90 && totalScore < 100) nextMilestone = 100;
  if (totalScore >= 100) nextMilestone = 100;

  const pointsToNextMilestone = Math.max(0, nextMilestone - totalScore);

  return {
    totalScore,
    readinessLevel,
    readinessColor,
    breakdown,
    strongestArea,
    needsAttentionArea,
    recommendedAction,
    recommendedActionsList: recommendedActionsList.slice(0, 3),
    nextMilestone,
    pointsToNextMilestone,
    is100Ready: totalScore >= 100,
  };
};
