import React from 'react';
import { Calendar, Clock, CheckCircle2, FileEdit, Eye, Trash2 } from 'lucide-react';

export type LogbookStatus = 'Draft' | 'Submitted' | 'Reviewed';

export interface FacultyReviewData {
  reviewerName: string;
  comment: string;
  reviewedDate: string;
}

export interface LogbookEntryItem {
  id: string;
  date: string;
  workCompleted: string;
  skillsGained: string[];
  challengesFaced?: string;
  hoursWorked: number;
  status: LogbookStatus;
  facultyReview?: FacultyReviewData;
}

interface LogbookEntryCardProps {
  entry: LogbookEntryItem;
  isSelected: boolean;
  onSelect: (entry: LogbookEntryItem) => void;
  onEdit: (entry: LogbookEntryItem) => void;
  onDelete: (id: string) => void;
}

export const LogbookEntryCard: React.FC<LogbookEntryCardProps> = ({
  entry,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const getStatusBadge = (status: LogbookStatus) => {
    switch (status) {
      case 'Draft':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[11px] font-bold">
            Draft
          </span>
        );
      case 'Submitted':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563eb] border border-blue-200 text-[11px] font-bold">
            Submitted
          </span>
        );
      case 'Reviewed':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Reviewed</span>
          </span>
        );
    }
  };

  return (
    <div
      onClick={() => onSelect(entry)}
      className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer space-y-3 text-left group ${
        isSelected
          ? 'bg-blue-50/40 border-2 border-[#2563eb] shadow-xs'
          : 'bg-white border-[#e2e8f0] hover:border-blue-300 hover:shadow-md'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs text-[#64748b] font-bold">
          <Calendar className="w-3.5 h-3.5 text-[#2563eb]" />
          <span>{entry.date}</span>
        </div>
        {getStatusBadge(entry.status)}
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-bold text-[#0f172a] group-hover:text-[#2563eb] transition-colors line-clamp-2">
          {entry.workCompleted}
        </h3>
      </div>

      <div className="flex flex-wrap gap-1.5 pt-1">
        {entry.skillsGained.map((sk) => (
          <span
            key={sk}
            className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#eff6ff] text-[#2563eb] border border-blue-200/60"
          >
            {sk}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-[#64748b] pt-2 border-t border-slate-100">
        <span className="flex items-center space-x-1 font-semibold">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{entry.hoursWorked} hrs</span>
        </span>

        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(entry);
            }}
            className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
            title="View Details"
          >
            <Eye className="w-3.5 h-3.5 text-slate-600" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(entry);
            }}
            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#2563eb] text-xs font-semibold cursor-pointer"
            title="Edit Entry"
          >
            <FileEdit className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(entry.id);
            }}
            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold cursor-pointer"
            title="Delete Entry"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
