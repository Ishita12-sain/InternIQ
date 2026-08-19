import React from 'react';
import { Building2, Sparkles } from 'lucide-react';

export interface InternshipSelectorItem {
  id: string;
  companyName: string;
  companyLogo: string;
  role: string;
  currentStage: string;
  matchScore: number;
}

interface InternshipSelectorProps {
  internships: InternshipSelectorItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export const InternshipSelector: React.FC<InternshipSelectorProps> = ({
  internships,
  selectedId,
  onSelect,
}) => {
  return (
    <div className="space-y-3 text-left">
      <div className="flex items-center justify-between">
        <h2 className="text-xs sm:text-sm font-bold text-[#0f172a] uppercase tracking-wider">
          Select Application Timeline
        </h2>
        <span className="text-[11px] text-[#64748b] font-medium">
          {internships.length} active applications
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {internships.map((item) => {
          const isSelected = item.id === selectedId;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer space-y-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                isSelected
                  ? 'bg-blue-50/40 border-2 border-[#2563eb] shadow-xs'
                  : 'bg-white border-[#e2e8f0] hover:border-blue-300 hover:bg-slate-50/60 shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-[#2563eb] font-black text-xs flex items-center justify-center">
                  {item.companyLogo}
                </div>
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-blue-50 text-[#2563eb] border border-blue-200/60 text-[10px] font-extrabold">
                  <Sparkles className="w-3 h-3" />
                  <span>{item.matchScore}% Match</span>
                </span>
              </div>

              <div>
                <p className="text-xs font-semibold text-[#64748b] flex items-center space-x-1">
                  <Building2 className="w-3 h-3 text-slate-400" />
                  <span>{item.companyName}</span>
                </p>
                <h3 className="text-sm font-bold text-[#0f172a] truncate">{item.role}</h3>
              </div>

              <div className="pt-1 flex items-center justify-between text-[11px] text-[#64748b]">
                <span>Stage:</span>
                <strong className={isSelected ? 'text-[#2563eb]' : 'text-slate-800'}>
                  {item.currentStage}
                </strong>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
