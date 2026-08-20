import React from 'react';
import { MapPin, Clock, Users, ArrowUpRight } from 'lucide-react';

export interface CompanyInternshipItem {
  id: string;
  title: string;
  location: string;
  workMode: 'Remote' | 'Full Time' | 'Hybrid' | 'Part Time';
  duration: string;
  applicantsCount: number;
  status: 'Active' | 'Draft' | 'Closed';
}

interface ActiveInternshipsSectionProps {
  internships: CompanyInternshipItem[];
  onManage: (internship: CompanyInternshipItem) => void;
}

export const ActiveInternshipsSection: React.FC<ActiveInternshipsSectionProps> = ({
  internships,
  onManage,
}) => {
  return (
    <div
      id="company-active-internships-section"
      className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4 text-left scroll-mt-24"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-base font-bold text-[#0f172a]">Active Internships</h3>
        <span className="text-xs text-[#64748b] font-medium">Currently posted positions</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {internships.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4 text-left group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563eb] border border-blue-200 text-[10px] font-bold">
                  {item.workMode}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                  {item.status}
                </span>
              </div>

              <h4 className="text-sm font-bold text-[#0f172a] group-hover:text-[#2563eb] transition-colors leading-tight">
                {item.title}
              </h4>

              <div className="space-y-1 text-xs text-[#64748b] pt-1">
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{item.duration}</span>
                </div>
                <div className="flex items-center space-x-1.5 font-bold text-slate-800 pt-1">
                  <Users className="w-3.5 h-3.5 text-[#2563eb] shrink-0" />
                  <span>{item.applicantsCount} Applicants</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onManage(item)}
              className="w-full inline-flex items-center justify-center space-x-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
            >
              <span>Manage Listing</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-600" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
