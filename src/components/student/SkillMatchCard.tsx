import React from 'react';

interface SkillMatchCardProps {
  matchPercentage: number;
  recommendationMessage: string;
}

export const SkillMatchCard: React.FC<SkillMatchCardProps> = ({
  matchPercentage,
  recommendationMessage,
}) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (matchPercentage / 100) * circumference;

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-6 text-left">
      <div className="space-y-2 text-center md:text-left">
        <span className="inline-block text-[11px] font-semibold text-[#2563eb] bg-blue-50 border border-blue-200/60 px-3 py-1 rounded-full uppercase tracking-wider">
          Market Readiness Match
        </span>
        <h2 className="text-2xl font-extrabold text-[#0f172a]">Your Skill Match</h2>
        <p className="text-xs sm:text-sm text-[#64748b] max-w-md">
          Percentage match calculated against top software engineering and frontend internship postings.
        </p>
        <p className="text-xs font-semibold text-slate-700 pt-1">
          {recommendationMessage}
        </p>
      </div>

      {/* Circular Progress Meter */}
      <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
          <circle
            cx="64"
            cy="64"
            r={radius}
            className="text-slate-100"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            className="text-[#2563eb] transition-all duration-1000 ease-out"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-black text-[#0f172a]">{matchPercentage}%</span>
          <span className="text-[10px] font-bold text-[#64748b]">Matched</span>
        </div>
      </div>
    </div>
  );
};
