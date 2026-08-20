import React from 'react';
import { Award } from 'lucide-react';

interface WeeklyProgressProps {
  weeks: {
    weekName: string;
    entriesCount: number;
    hoursCount: number;
    reviewStatus: 'Reviewed' | 'Pending';
  }[];
}

export const WeeklyProgress: React.FC<WeeklyProgressProps> = ({ weeks }) => {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4 text-left">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-base font-bold text-[#0f172a] flex items-center space-x-2">
          <Award className="w-5 h-5 text-[#2563eb]" />
          <span>Weekly Progress</span>
        </h3>
        <span className="text-xs text-[#64748b] font-medium">Recent 3 Weeks</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {weeks.map((w) => (
          <div
            key={w.weekName}
            className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-left"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0f172a]">{w.weekName}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  w.reviewStatus === 'Reviewed'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {w.reviewStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/60">
              <div>
                <span className="text-slate-400 block text-[10px]">Entries</span>
                <strong className="text-slate-900 font-bold">{w.entriesCount} Entries</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Hours</span>
                <strong className="text-[#2563eb] font-bold">{w.hoursCount} hrs</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
