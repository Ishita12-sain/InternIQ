import React from 'react';

interface ReadinessOverviewProps {
  score: number;
  status: string;
}

export const ReadinessOverview: React.FC<ReadinessOverviewProps> = ({ score, status }) => {
  // SVG Circular Gauge Calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 sm:p-8 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-6 text-left">
      <div className="space-y-2 text-center md:text-left">
        <div className="inline-block text-[11px] font-semibold text-[#2563eb] bg-blue-50 border border-blue-200/60 px-3 py-1 rounded-full uppercase tracking-wider">
          Performance Status
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a]">
          Internship Readiness Score
        </h2>
        <p className="text-xs sm:text-sm text-[#64748b] max-w-md">
          Your readiness score is evaluated based on profile completeness, skills, certifications, resume quality, and projects.
        </p>
        <div className="pt-1">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{status}</span>
          </span>
        </div>
      </div>

      {/* Modern Circular Score Gauge */}
      <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
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
          <span className="text-3xl font-black text-[#0f172a] leading-none">{score}</span>
          <span className="text-[11px] text-[#64748b] font-bold mt-0.5">out of 100</span>
        </div>
      </div>
    </div>
  );
};
