import React from 'react';
import { FileText, Clock, Sparkles, CheckCircle2 } from 'lucide-react';

export type SummaryCardKey = 'total' | 'underReview' | 'shortlisted' | 'selected';

interface ApplicationSummaryProps {
  total: number;
  underReview: number;
  shortlisted: number;
  selected: number;
  onCardClick?: (key: SummaryCardKey) => void;
}

export const ApplicationSummary: React.FC<ApplicationSummaryProps> = ({
  total,
  underReview,
  shortlisted,
  selected,
  onCardClick,
}) => {
  const stats: {
    key: SummaryCardKey;
    title: string;
    value: number;
    label: string;
    icon: React.ReactNode;
    bgColor: string;
    borderColor: string;
  }[] = [
    {
      key: 'total',
      title: 'Total Applications',
      value: total,
      label: 'Submitted applications',
      icon: <FileText className="w-5 h-5 text-[#2563eb]" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200/60',
    },
    {
      key: 'underReview',
      title: 'Under Review',
      value: underReview,
      label: 'In review process',
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200/60',
    },
    {
      key: 'shortlisted',
      title: 'Shortlisted',
      value: shortlisted,
      label: 'Selected for interview',
      icon: <Sparkles className="w-5 h-5 text-indigo-600" />,
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200/60',
    },
    {
      key: 'selected',
      title: 'Selected',
      value: selected,
      label: 'Final offer accepted',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200/60',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
      {stats.map((stat) => (
        <button
          key={stat.title}
          type="button"
          onClick={() => onCardClick?.(stat.key)}
          className={`bg-white border ${stat.borderColor} rounded-2xl p-5 shadow-2xs space-y-1 flex items-center justify-between cursor-pointer hover:shadow-md hover:border-blue-300 transition-all duration-200 text-left w-full focus:outline-none focus:ring-2 focus:ring-blue-500/30`}
        >
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-[#64748b]">{stat.title}</p>
            <p className="text-2xl font-black text-[#0f172a]">{stat.value}</p>
            <p className="text-[11px] text-slate-400 font-medium">{stat.label}</p>
          </div>
          <div className={`p-3 rounded-2xl ${stat.bgColor} shrink-0`}>
            {stat.icon}
          </div>
        </button>
      ))}
    </div>
  );
};
