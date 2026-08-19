import React from 'react';

export const ProfileCompletion: React.FC = () => {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-2xs space-y-3 text-left">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#0f172a]">Profile Completion</span>
        <span className="text-sm font-extrabold text-[#2563eb]">85%</span>
      </div>

      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-[#2563eb] rounded-full w-[85%] transition-all duration-300" />
      </div>

      <p className="text-xs text-[#64748b] leading-tight">
        Complete your profile to improve internship recommendations.
      </p>
    </div>
  );
};
