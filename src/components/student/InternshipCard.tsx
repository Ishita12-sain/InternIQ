import React from 'react';
import { MapPin, Clock, Building2 } from 'lucide-react';

export interface InternshipItem {
  id: string;
  role: string;
  company: string;
  location: string;
  duration: string;
}

interface InternshipCardProps {
  internship: InternshipItem;
  onApply?: () => void;
}

export const InternshipCard: React.FC<InternshipCardProps> = ({ internship, onApply }) => {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4">
      <div className="space-y-2 text-left">
        <div className="flex items-start justify-between">
          <h4 className="text-sm font-bold text-[#0f172a] hover:text-[#2563eb] transition-colors cursor-pointer">
            {internship.role}
          </h4>
          <span className="text-[10px] font-semibold text-[#2563eb] bg-[#eff6ff] border border-blue-200/60 px-2 py-0.5 rounded-md shrink-0">
            Recommended
          </span>
        </div>

        <div className="flex items-center space-x-1.5 text-xs text-[#64748b] font-medium">
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          <span>{internship.company}</span>
        </div>

        <div className="flex items-center space-x-4 text-xs text-slate-500 pt-1">
          <div className="flex items-center space-x-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{internship.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{internship.duration}</span>
          </div>
        </div>
      </div>

      <button
        onClick={onApply}
        className="w-full py-2 px-3 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
      >
        Apply Now
      </button>
    </div>
  );
};
