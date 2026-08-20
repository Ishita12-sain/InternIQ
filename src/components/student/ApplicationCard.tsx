import React from 'react';
import { Building2, MapPin, Calendar, Banknote, Eye } from 'lucide-react';

export type ApplicationStatusType =
  | 'Applied'
  | 'Under Review'
  | 'Shortlisted'
  | 'Interview Scheduled'
  | 'Selected'
  | 'Rejected';

export interface ApplicationItem {
  id: string;
  companyName: string;
  companyLogo: string;
  role: string;
  appliedDate: string;
  location: string;
  internshipType: 'Full Time' | 'Part Time' | 'Remote' | 'Hybrid';
  stipend: string;
  status: ApplicationStatusType;
  skills: string[];
}

interface ApplicationCardProps {
  application: ApplicationItem;
  onViewDetails: (item: ApplicationItem) => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, onViewDetails }) => {
  const getStatusBadge = (status: ApplicationStatusType) => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Under Review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Shortlisted':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Interview Scheduled':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Selected':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  return (
    <div className="bg-white border border-[#e2e8f0] hover:border-blue-300 rounded-2xl p-5 sm:p-6 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 text-left group">
      <div className="space-y-3">
        {/* Company & Status Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start space-x-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-50 to-slate-100 border border-slate-200 flex items-center justify-center text-xs font-black text-[#2563eb] shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              {application.companyLogo}
            </div>
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-[#64748b] flex items-center space-x-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{application.companyName}</span>
              </span>
              <h3 className="text-base font-bold text-[#0f172a] group-hover:text-[#2563eb] transition-colors">
                {application.role}
              </h3>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full border text-xs font-bold shrink-0 ${getStatusBadge(
              application.status
            )}`}
          >
            {application.status}
          </span>
        </div>

        {/* Metadata Details */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748b] pt-1">
          <span className="flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Applied {application.appliedDate}</span>
          </span>
          <span className="flex items-center space-x-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{application.location}</span>
          </span>
          <span className="px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-700">
            {application.internshipType}
          </span>
          <span className="flex items-center space-x-1 text-[#0f172a] font-bold">
            <Banknote className="w-3.5 h-3.5 text-emerald-600" />
            <span>{application.stipend}</span>
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={() => onViewDetails(application)}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        >
          <Eye className="w-3.5 h-3.5 text-slate-500" />
          <span>View Details</span>
        </button>
      </div>
    </div>
  );
};
