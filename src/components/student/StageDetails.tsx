import React from 'react';
import { ArrowRight, Award } from 'lucide-react';
import type { StageData } from './TimelineStage';

interface StageDetailsProps {
  stage: StageData | null;
}

export const StageDetails: React.FC<StageDetailsProps> = ({ stage }) => {
  if (!stage) return null;

  const getStatusBadge = (statusType: StageData['statusType']) => {
    switch (statusType) {
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'current':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div
      id="stage-details-section"
      className="bg-white border border-[#e2e8f0] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4 text-left scroll-mt-24 transition-all duration-300"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <Award className="w-5 h-5 text-[#2563eb]" />
          <h3 className="text-base font-extrabold text-[#0f172a]">Stage Details — {stage.stageName}</h3>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full border text-xs font-extrabold ${getStatusBadge(stage.statusType)}`}>
          {stage.stageName}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
        <div>
          <span className="text-slate-400 font-medium">Company:</span>{' '}
          <strong className="text-slate-800 font-bold">{stage.companyName}</strong>
        </div>
        <div>
          <span className="text-slate-400 font-medium">Job Role:</span>{' '}
          <strong className="text-[#2563eb] font-bold">{stage.role}</strong>
        </div>
        <div>
          <span className="text-slate-400 font-medium">Date:</span>{' '}
          <strong className="text-slate-800 font-bold">{stage.date}</strong>
        </div>
      </div>

      <div className="space-y-1.5 text-xs">
        <h4 className="font-bold text-[#0f172a] uppercase tracking-wider text-[11px]">Information</h4>
        <p className="text-[#64748b] leading-relaxed bg-blue-50/30 p-3.5 rounded-xl border border-blue-100/60 font-medium">
          “{stage.detailedMessage}”
        </p>
      </div>

      {stage.nextStep && (
        <div className="space-y-1.5 text-xs pt-1">
          <h4 className="font-bold text-[#0f172a] uppercase tracking-wider text-[11px] flex items-center space-x-1">
            <ArrowRight className="w-3.5 h-3.5 text-[#2563eb]" />
            <span>Next Recommended Step</span>
          </h4>
          <div className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-200/60 text-emerald-900 font-semibold">
            {stage.nextStep}
          </div>
        </div>
      )}
    </div>
  );
};
