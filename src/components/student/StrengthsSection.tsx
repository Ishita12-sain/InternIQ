import React from 'react';
import { CheckCircle2, Zap } from 'lucide-react';

interface StrengthsSectionProps {
  strengths: string[];
}

export const StrengthsSection: React.FC<StrengthsSectionProps> = ({ strengths }) => {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4 text-left">
      <div className="flex items-center space-x-2">
        <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
          <Zap className="w-4 h-4" />
        </div>
        <h3 className="text-base font-bold text-[#0f172a]">Your Strengths</h3>
      </div>

      <div className="space-y-2.5">
        {strengths.map((item, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/40 flex items-center space-x-3 text-xs font-semibold text-slate-800"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
