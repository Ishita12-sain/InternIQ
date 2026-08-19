import React from 'react';
import { CheckCircle2, Clock, CircleDashed } from 'lucide-react';
import type { ApplicationStatusType } from './ApplicationCard';

interface ApplicationTimelineProps {
  currentStatus: ApplicationStatusType;
}

export const ApplicationTimeline: React.FC<ApplicationTimelineProps> = ({ currentStatus }) => {
  const allStages: { label: ApplicationStatusType; description: string }[] = [
    { label: 'Applied', description: 'Application submitted successfully' },
    { label: 'Under Review', description: 'HR & Technical team reviewing profile' },
    { label: 'Shortlisted', description: 'Profile selected for next evaluation' },
    { label: 'Interview Scheduled', description: 'Technical & HR interview rounds' },
    { label: 'Selected', description: 'Final internship offer extended' },
  ];

  const getStageStatus = (stageLabel: ApplicationStatusType) => {
    if (currentStatus === 'Rejected') {
      if (stageLabel === 'Applied') return 'completed';
      return 'rejected';
    }

    const order: ApplicationStatusType[] = [
      'Applied',
      'Under Review',
      'Shortlisted',
      'Interview Scheduled',
      'Selected',
    ];

    const currentIndex = order.indexOf(currentStatus);
    const stageIndex = order.indexOf(stageLabel);

    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="space-y-4 text-left pt-2">
      <h4 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider">
        Application Progress Timeline
      </h4>

      <div className="relative pl-4 space-y-4 border-l-2 border-slate-200">
        {allStages.map((stage) => {
          const state = getStageStatus(stage.label);

          return (
            <div key={stage.label} className="relative flex items-start space-x-3">
              {/* Timeline Indicator Badge */}
              <div className="absolute -left-[23px] top-0.5 bg-white rounded-full">
                {state === 'completed' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 bg-emerald-50 rounded-full" />
                )}
                {state === 'current' && (
                  <Clock className="w-4 h-4 text-[#2563eb] bg-blue-50 rounded-full animate-pulse" />
                )}
                {state === 'upcoming' && (
                  <CircleDashed className="w-4 h-4 text-slate-300 bg-white" />
                )}
                {state === 'rejected' && (
                  <CircleDashed className="w-4 h-4 text-slate-300 bg-white" />
                )}
              </div>

              {/* Stage Content */}
              <div className="space-y-0.5">
                <p
                  className={`text-xs font-bold ${
                    state === 'current'
                      ? 'text-[#2563eb]'
                      : state === 'completed'
                      ? 'text-slate-800'
                      : 'text-slate-400'
                  }`}
                >
                  {stage.label}
                </p>
                <p className="text-[11px] text-[#64748b]">{stage.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
