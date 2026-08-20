import React from 'react';

export interface CurrentSkillItem {
  name: string;
  level: 'Strong' | 'Intermediate' | 'Basic';
}

interface CurrentSkillsProps {
  skills: CurrentSkillItem[];
}

export const CurrentSkills: React.FC<CurrentSkillsProps> = ({ skills }) => {
  const getBadgeStyle = (level: CurrentSkillItem['level']) => {
    switch (level) {
      case 'Strong':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Intermediate':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Basic':
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div id="current-skills" className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4 text-left scroll-mt-20">
      <h3 className="text-base font-bold text-[#0f172a]">Your Current Skills</h3>

      <div className="flex flex-wrap gap-2.5">
        {skills.map((skill) => (
          <div
            key={skill.name}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-[#0f172a]"
          >
            <span>{skill.name}</span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getBadgeStyle(
                skill.level
              )}`}
            >
              {skill.level}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
