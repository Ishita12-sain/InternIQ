import React from 'react';
import { Send, Sparkles, Clock, CheckCircle2, FileText } from 'lucide-react';

interface HiringOverviewSectionProps {
  stats: {
    received: number;
    underReview: number;
    shortlisted: number;
    interview: number;
    selected: number;
  };
}

export const HiringOverviewSection: React.FC<HiringOverviewSectionProps> = ({ stats }) => {
  const steps = [
    { label: 'Received', count: stats.received, icon: <Send className="w-4 h-4 text-blue-600" />, color: 'bg-blue-50 border-blue-200' },
    { label: 'Under Review', count: stats.underReview, icon: <FileText className="w-4 h-4 text-amber-600" />, color: 'bg-amber-50 border-amber-200' },
    { label: 'Shortlisted', count: stats.shortlisted, icon: <Sparkles className="w-4 h-4 text-indigo-600" />, color: 'bg-indigo-50 border-indigo-200' },
    { label: 'Interview', count: stats.interview, icon: <Clock className="w-4 h-4 text-purple-600" />, color: 'bg-purple-50 border-purple-200' },
    { label: 'Selected', count: stats.selected, icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />, color: 'bg-emerald-50 border-emerald-200' },
  ];

  return (
    <div
      id="company-hiring-overview-section"
      className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4 text-left scroll-mt-24"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-base font-bold text-[#0f172a]">Hiring Funnel Overview</h3>
        <span className="text-xs text-[#64748b] font-medium">Candidate pipeline breakdown</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {steps.map((step) => (
          <div
            key={step.label}
            className={`p-4 rounded-xl border ${step.color} flex flex-col items-center justify-center text-center space-y-1.5`}
          >
            <div className="p-2 rounded-lg bg-white shadow-2xs mb-0.5">
              {step.icon}
            </div>
            <span className="text-2xl font-black text-[#0f172a]">{step.count}</span>
            <span className="text-xs font-bold text-[#64748b]">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
