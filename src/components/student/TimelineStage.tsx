import React from 'react';
import { CheckCircle2, Clock, CircleDashed, XCircle } from 'lucide-react';

export type TimelineStageStatus = 'completed' | 'current' | 'upcoming' | 'rejected';

export interface StageData {
  id: string;
  stageName: 'Applied' | 'Under Review' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected';
  date: string;
  statusType: TimelineStageStatus;
  shortDescription: string;
  detailedMessage: string;
  nextStep?: string;
  companyName: string;
  role: string;
}

interface TimelineStageProps {
  stage: StageData;
  isLast: boolean;
  isSelected: boolean;
  onSelectStage: (stage: StageData) => void;
}

export const TimelineStage: React.FC<TimelineStageProps> = ({
  stage,
  isLast,
  isSelected,
  onSelectStage,
}) => {
  const getIcon = () => {
    switch (stage.statusType) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600 bg-white rounded-full" />;
      case 'current':
        return <Clock className="w-5 h-5 text-[#2563eb] bg-white rounded-full animate-pulse" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-rose-600 bg-white rounded-full" />;
      default:
        return <CircleDashed className="w-5 h-5 text-slate-300 bg-white" />;
    }
  };

  const getContainerStyle = () => {
    if (isSelected) {
      return 'bg-blue-50/50 border-2 border-[#2563eb] shadow-sm';
    }
    switch (stage.statusType) {
      case 'current':
        return 'bg-blue-50/30 border border-blue-200 shadow-2xs hover:border-blue-400';
      case 'completed':
        return 'bg-white border border-[#e2e8f0] hover:border-blue-300 shadow-2xs';
      case 'rejected':
        return 'bg-rose-50/30 border border-rose-200 hover:border-rose-300 shadow-2xs';
      default:
        return 'bg-slate-50/40 border border-slate-200 hover:border-slate-300 opacity-80';
    }
  };

  return (
    <div className="relative flex items-start space-x-4 text-left group">
      {/* Vertical Connecting Line */}
      {!isLast && (
        <div
          className={`absolute left-[19px] top-6 bottom-0 w-0.5 -mb-6 ${
            stage.statusType === 'completed' ? 'bg-emerald-400' : 'bg-slate-200'
          }`}
        />
      )}

      {/* Stage Node Icon */}
      <div className="relative z-10 shrink-0 mt-3">{getIcon()}</div>

      {/* Stage Interactive Card */}
      <button
        type="button"
        onClick={() => onSelectStage(stage)}
        className={`flex-1 p-4 rounded-2xl transition-all duration-200 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${getContainerStyle()}`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-extrabold text-[#0f172a]">{stage.stageName}</h4>
            {stage.statusType === 'current' && (
              <span className="px-2 py-0.5 rounded-full bg-[#2563eb] text-white text-[10px] font-extrabold">
                Current
              </span>
            )}
          </div>
          <span className="text-xs font-semibold text-[#64748b]">{stage.date}</span>
        </div>

        <p className="text-xs text-[#64748b] mt-1 font-medium">{stage.shortDescription}</p>
      </button>
    </div>
  );
};
