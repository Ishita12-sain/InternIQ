import React from 'react';
import { Building2, MapPin, Clock, Banknote, Sparkles, ExternalLink, ArrowRight } from 'lucide-react';

export interface SearchInternshipItem {
  id: string;
  companyName: string;
  companyLogo: string;
  title: string;
  location: string;
  internshipType: 'Full Time' | 'Part Time' | 'Remote' | 'Hybrid';
  duration: string;
  stipend: string;
  skills: string[];
  matchPercentage: number;
  description: string;
}

interface InternshipSearchCardProps {
  internship: SearchInternshipItem;
  onApply: (item: SearchInternshipItem) => void;
  onViewDetails: (item: SearchInternshipItem) => void;
}

export const InternshipSearchCard: React.FC<InternshipSearchCardProps> = ({
  internship,
  onApply,
  onViewDetails,
}) => {
  const getMatchBadgeStyle = (pct: number) => {
    if (pct >= 90) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (pct >= 80) return 'bg-blue-50 text-blue-700 border-blue-200';
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  const getTypeBadgeStyle = (type: SearchInternshipItem['internshipType']) => {
    switch (type) {
      case 'Remote':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Hybrid':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Full Time':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Part Time':
        return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  return (
    <div className="bg-white border border-[#e2e8f0] hover:border-blue-300 rounded-2xl p-5 sm:p-6 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 text-left group">
      <div className="space-y-3">
        {/* Header: Company Logo, Role, Match Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start space-x-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-50 to-slate-100 border border-slate-200 flex items-center justify-center text-xs font-black text-[#2563eb] shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              {internship.companyLogo}
            </div>
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-[#64748b] flex items-center space-x-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{internship.companyName}</span>
              </span>
              <h3 className="text-base font-bold text-[#0f172a] group-hover:text-[#2563eb] transition-colors">
                {internship.title}
              </h3>
            </div>
          </div>

          <span
            className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full border text-[11px] font-extrabold shrink-0 ${getMatchBadgeStyle(
              internship.matchPercentage
            )}`}
          >
            <Sparkles className="w-3 h-3" />
            <span>{internship.matchPercentage}% Match</span>
          </span>
        </div>

        {/* Short Description */}
        <p className="text-xs text-[#64748b] leading-relaxed line-clamp-2">
          {internship.description}
        </p>

        {/* Metadata Details */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748b] pt-1">
          <span className="flex items-center space-x-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{internship.location}</span>
          </span>
          <span
            className={`px-2.5 py-0.5 rounded-md border text-[11px] font-semibold ${getTypeBadgeStyle(
              internship.internshipType
            )}`}
          >
            {internship.internshipType}
          </span>
          <span className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{internship.duration}</span>
          </span>
          <span className="flex items-center space-x-1 text-[#0f172a] font-bold">
            <Banknote className="w-3.5 h-3.5 text-emerald-600" />
            <span>{internship.stipend}</span>
          </span>
        </div>

        {/* Skills Tag Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {internship.skills.map((skill) => (
            <span
              key={skill}
              className="px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-[#eff6ff] text-[#2563eb] border border-blue-200/60"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={() => onViewDetails(internship)}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        >
          <span>View Details</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </button>

        <button
          type="button"
          onClick={() => onApply(internship)}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        >
          <span>Apply Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
