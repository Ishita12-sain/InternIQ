import React from 'react';

export const ReadinessCard: React.FC = () => {
  const readinessMetrics = [
    { label: 'Skills Alignment', score: 82 },
    { label: 'Profile Completeness', score: 90 },
    { label: 'Certifications', score: 65 },
    { label: 'Projects Completed', score: 75 },
  ];

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-[#0f172a]">Internship Readiness</h3>
        <span className="text-xs font-semibold text-[#2563eb] bg-[#eff6ff] border border-blue-200/60 px-2.5 py-1 rounded-full">
          High Match
        </span>
      </div>

      {/* Circular Readiness Score */}
      <div className="flex flex-col items-center justify-center py-2">
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-100"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-[#2563eb]"
              strokeDasharray="78, 100"
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-extrabold text-[#0f172a]">78%</span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase">Ready</span>
          </div>
        </div>
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
