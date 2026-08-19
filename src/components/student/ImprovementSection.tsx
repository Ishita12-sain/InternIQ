import React from 'react';
import { Target, ArrowUpRight } from 'lucide-react';

interface ImprovementItem {
  id: string;
  title: string;
  actionText: string;
  targetPath: string;
}

interface ImprovementSectionProps {
  improvements: ImprovementItem[];
  onActionClick: (path: string) => void;
}

export const ImprovementSection: React.FC<ImprovementSectionProps> = ({
  improvements,
  onActionClick,
}) => {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4 text-left">
      <div className="flex items-center space-x-2">
        <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
          <Target className="w-4 h-4" />
        </div>
        <h3 className="text-base font-bold text-[#0f172a]">Areas to Improve</h3>
      </div>

      <div className="space-y-2.5">
        {improvements.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between gap-3 text-xs"
          >
            <span className="font-semibold text-slate-800">{item.title}</span>
            <button
              onClick={() => onActionClick(item.targetPath)}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-[#2563eb] font-bold shadow-2xs transition-colors cursor-pointer shrink-0"
            >
              <span>{item.actionText}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
