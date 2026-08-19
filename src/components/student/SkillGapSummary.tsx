import React from 'react';
import { CheckCircle, Target, AlertTriangle } from 'lucide-react';

interface SkillGapSummaryProps {
  currentCount: number;
  requiredCount: number;
  gapCount: number;
  onCardClick?: (targetId: string) => void;
}

export const SkillGapSummary: React.FC<SkillGapSummaryProps> = ({
  currentCount,
  requiredCount,
  gapCount,
  onCardClick,
}) => {
  const cards = [
    {
      targetId: 'current-skills',
      title: 'Current Skills',
      value: currentCount,
      label: 'Verified active skills',
      icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200/60',
    },
    {
      targetId: 'skills-to-improve',
      title: 'Required Skills',
      value: requiredCount,
      label: 'Target role benchmark',
      icon: <Target className="w-5 h-5 text-[#2563eb]" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200/60',
    },
    {
      targetId: 'skills-to-improve',
      title: 'Skill Gap',
      value: gapCount,
      label: 'Recommended to learn',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200/60',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
      {cards.map((card) => (
        <button
          key={card.title}
          type="button"
          onClick={() => onCardClick?.(card.targetId)}
          className={`bg-white border ${card.borderColor} rounded-2xl p-5 shadow-2xs space-y-2 flex items-center justify-between cursor-pointer hover:shadow-md hover:border-blue-300 transition-all duration-200 text-left w-full focus:outline-none`}
        >
          <div className="space-y-1">
            <p className="text-xs font-semibold text-[#64748b]">{card.title}</p>
            <p className="text-2xl font-black text-[#0f172a]">{card.value}</p>
            <p className="text-[11px] text-slate-400 font-medium">{card.label}</p>
          </div>
          <div className={`p-3 rounded-2xl ${card.bgColor} shrink-0`}>
            {card.icon}
          </div>
        </button>
      ))}
    </div>
  );
};
