import React from 'react';
import { Sparkles, Award, Briefcase } from 'lucide-react';

export type RecommendedSummaryCardKey = 'recommended' | 'bestMatch' | 'applications';

interface RecommendedSummaryProps {
  totalRecommended: number;
  topMatchPct: number;
  activeOpportunities: number;
  onCardClick?: (key: RecommendedSummaryCardKey) => void;
}

export const RecommendedSummary: React.FC<RecommendedSummaryProps> = ({
  totalRecommended,
  topMatchPct,
  activeOpportunities,
  onCardClick,
}) => {
  const stats: {
    key: RecommendedSummaryCardKey;
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ReactNode;
    bgColor: string;
    borderColor: string;
  }[] = [
    {
      key: 'recommended',
      title: 'Recommended for You',
      value: totalRecommended,
      subtitle: 'Based on your profile skills',
      icon: <Sparkles className="w-5 h-5 text-[#2563eb]" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200/60',
    },
    {
      key: 'bestMatch',
      title: 'Best Match Score',
      value: `${topMatchPct}%`,
      subtitle: 'Highest skill compatibility',
      icon: <Award className="w-5 h-5 text-emerald-600" />,
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200/60',
    },
    {
      key: 'applications',
      title: 'Applications Available',
      value: activeOpportunities,
      subtitle: 'Open positions hiring now',
      icon: <Briefcase className="w-5 h-5 text-indigo-600" />,
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200/60',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
      {stats.map((stat) => (
        <button
          key={stat.key}
          type="button"
          onClick={() => onCardClick?.(stat.key)}
          className={`bg-white border ${stat.borderColor} rounded-2xl p-5 shadow-2xs space-y-1.5 flex items-center justify-between cursor-pointer hover:shadow-md hover:border-blue-300 transition-all duration-200 text-left w-full focus:outline-none focus:ring-2 focus:ring-blue-500/30`}
        >
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-[#64748b]">{stat.title}</p>
            <p className="text-2xl font-black text-[#0f172a]">{stat.value}</p>
            <p className="text-[11px] text-slate-400 font-medium">{stat.subtitle}</p>
          </div>
          <div className={`p-3 rounded-2xl ${stat.bgColor} shrink-0`}>
            {stat.icon}
          </div>
        </button>
      ))}
    </div>
  );
};
