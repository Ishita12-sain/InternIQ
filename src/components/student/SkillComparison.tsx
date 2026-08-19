import React from 'react';

export interface ComparisonSkill {
  name: string;
  currentPct: number;
  requiredPct: number;
}

interface SkillComparisonProps {
  skills: ComparisonSkill[];
}

export const SkillComparison: React.FC<SkillComparisonProps> = ({ skills }) => {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4 text-left">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-[#0f172a]">Current Level vs Required Level</h3>
        <div className="flex items-center space-x-4 text-[11px] font-semibold text-[#64748b]">
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span>Current</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
            <span>Required</span>
          </span>
        </div>
      </div>

      <div className="space-y-4 pt-1">
        {skills.map((skill) => (
          <div key={skill.name} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[#0f172a]">{skill.name}</span>
              <span className="text-[#64748b] text-[11px]">
                Current {skill.currentPct}% / Required {skill.requiredPct}%
              </span>
            </div>

            {/* Double Bar Comparison */}
            <div className="space-y-1">
              {/* Current Level Bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-400 rounded-full transition-all duration-500"
                  style={{ width: `${skill.currentPct}%` }}
                />
              </div>
              {/* Required Level Bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#2563eb] rounded-full transition-all duration-500"
                  style={{ width: `${skill.requiredPct}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
