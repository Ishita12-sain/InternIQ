import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface ImproveSkillItem {
  name: string;
  currentLevel: string;
  requiredLevel: string;
  priority: 'High' | 'Medium' | 'Low';
}

interface SkillsToImproveProps {
  skills: ImproveSkillItem[];
}

export const SkillsToImprove: React.FC<SkillsToImproveProps> = ({ skills }) => {
  const getPriorityStyle = (priority: ImproveSkillItem['priority']) => {
    switch (priority) {
      case 'High':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Low':
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div id="skills-to-improve" className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4 text-left scroll-mt-20">
      <div className="flex items-center space-x-2">
        <AlertCircle className="w-4 h-4 text-[#2563eb]" />
        <h3 className="text-base font-bold text-[#0f172a]">Skills to Improve</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {skills.map((skill) => (
          <div
            key={skill.name}
            className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#0f172a]">{skill.name}</h4>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${getPriorityStyle(
                  skill.priority
                )}`}
              >
                {skill.priority} Priority
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#64748b] pt-1">
              <span>Current: <strong className="text-slate-800">{skill.currentLevel}</strong></span>
              <span>Required: <strong className="text-[#2563eb]">{skill.requiredLevel}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
