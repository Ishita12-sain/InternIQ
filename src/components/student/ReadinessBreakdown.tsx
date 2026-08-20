import React from 'react';

export interface CategoryScore {
  key: string;
  name: string;
  percentage: number;
  icon: React.ReactNode;
  status: string;
}

interface ReadinessBreakdownProps {
  categories: CategoryScore[];
}

export const ReadinessBreakdown: React.FC<ReadinessBreakdownProps> = ({ categories }) => {
  return (
    <div className="space-y-4 text-left">
      <h3 className="text-base font-bold text-[#0f172a]">Score Breakdown</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((item) => (
          <div
            key={item.key}
            className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-2xs space-y-3 hover:border-blue-200 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-[#2563eb]">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0f172a]">{item.name}</h4>
                  <span className="text-[11px] font-medium text-[#64748b]">{item.status}</span>
                </div>
              </div>
              <span className="text-base font-extrabold text-[#2563eb]">{item.percentage}%</span>
            </div>

            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2563eb] rounded-full transition-all duration-500"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
