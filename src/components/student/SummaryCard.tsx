import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  accentText?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, accentText }) => {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wide">
          {title}
        </span>
        <div className="p-2 rounded-xl bg-[#eff6ff] text-[#2563eb]">
          {icon}
        </div>
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-2xl sm:text-3xl font-extrabold text-[#0f172a]">
          {value}
        </span>
        {accentText && (
          <span className="text-xs font-medium text-[#2563eb] bg-blue-50 px-2 py-0.5 rounded-md">
            {accentText}
          </span>
        )}
      </div>
    </div>
  );
};
