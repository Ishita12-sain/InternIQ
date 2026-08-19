import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export interface ActionItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

interface RecommendedActionsProps {
  actions: ActionItem[];
  onImprove: (actionId: string) => void;
}

export const RecommendedActions: React.FC<RecommendedActionsProps> = ({ actions, onImprove }) => {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4 text-left">
      <h3 className="text-base font-bold text-[#0f172a]">Recommended Actions</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action) => (
          <div
            key={action.id}
            className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between gap-3"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-[#2563eb] shrink-0">
                {action.icon}
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-[#0f172a]">{action.title}</h4>
                <p className="text-[11px] text-[#64748b]">{action.subtitle}</p>
              </div>
            </div>

            <button
              onClick={() => onImprove(action.id)}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-[#2563eb] text-xs font-bold shadow-2xs transition-colors cursor-pointer shrink-0"
            >
              <span>Improve</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
