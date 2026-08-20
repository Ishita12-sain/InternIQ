import React from 'react';
import { Calendar, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import type { LogbookEntryItem } from './LogbookEntryCard';

interface LogbookEntryDetailsProps {
  entry: LogbookEntryItem | null;
}

export const LogbookEntryDetails: React.FC<LogbookEntryDetailsProps> = ({ entry }) => {
  if (!entry) return null;

  return (
    <div
      id="logbook-entry-details-section"
      className="bg-white border border-[#e2e8f0] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5 text-left scroll-mt-24"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-[#2563eb]" />
          <h3 className="text-base font-bold text-[#0f172a]">Entry Details — {entry.date}</h3>
        </div>
        <span className="px-3 py-1 rounded-full bg-blue-50 text-[#2563eb] border border-blue-200 text-xs font-bold">
          {entry.status}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
        <div>
          <span className="text-slate-400 block mb-0.5 font-medium">Work Completed</span>
          <p className="text-slate-900 font-bold leading-snug">{entry.workCompleted}</p>
        </div>
        <div>
          <span className="text-slate-400 block mb-0.5 font-medium">Hours Worked</span>
          <p className="text-[#2563eb] text-sm font-extrabold">{entry.hoursWorked} Hours</p>
        </div>
      </div>

      {entry.skillsGained.length > 0 && (
        <div className="space-y-1.5 text-xs">
          <span className="font-bold text-[#0f172a] uppercase tracking-wider text-[11px] block">
            Learning / Skills Gained
          </span>
          <div className="flex flex-wrap gap-1.5">
            {entry.skillsGained.map((sk) => (
              <span
                key={sk}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-[#2563eb] border border-blue-200/60"
              >
                {sk}
              </span>
            ))}
          </div>
        </div>
      )}

      {entry.challengesFaced && (
        <div className="space-y-1.5 text-xs">
          <span className="font-bold text-[#0f172a] uppercase tracking-wider text-[11px] block">
            Challenges Faced
          </span>
          <p className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/60 text-amber-900 font-medium leading-relaxed">
            {entry.challengesFaced}
          </p>
        </div>
      )}

      {/* Faculty Review Section */}
      <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
        <span className="font-bold text-[#0f172a] uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-[#2563eb]" />
          <span>Faculty Review</span>
        </span>

        {entry.facultyReview ? (
          <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-200/60 space-y-1.5 text-left">
            <div className="flex items-center justify-between text-emerald-900 font-bold">
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Reviewed by: {entry.facultyReview.reviewerName}</span>
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold">
                {entry.facultyReview.reviewedDate}
              </span>
            </div>
            <p className="text-emerald-800 text-xs font-medium italic">
              “{entry.facultyReview.comment}”
            </p>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 font-medium flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-slate-400" />
            <span>Awaiting faculty review</span>
          </div>
        )}
      </div>
    </div>
  );
};
