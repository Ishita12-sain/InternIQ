import React from 'react';
import { CheckCircle2, Clock, Send, Sparkles } from 'lucide-react';

export const ApplicationStatus: React.FC = () => {
  const statusSteps = [
    { label: 'Applied', count: 8, icon: <Send className="w-4 h-4 text-blue-600" />, active: true },
    { label: 'Shortlisted', count: 3, icon: <Sparkles className="w-4 h-4 text-indigo-600" />, active: true },
    { label: 'Interview', count: 1, icon: <Clock className="w-4 h-4 text-amber-600" />, active: true },
    { label: 'Selected', count: 1, icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />, active: true },
  ];

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4">
      <h3 className="text-base font-bold text-[#0f172a] text-left">Application Status</h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statusSteps.map((step) => (
          <div
            key={step.label}
            className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col items-center justify-center text-center space-y-1"
          >
            <div className="p-2 rounded-lg bg-white shadow-2xs mb-1">
              {step.icon}
            </div>
            <span className="text-xl font-extrabold text-[#0f172a]">{step.count}</span>
            <span className="text-xs font-semibold text-[#64748b]">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
