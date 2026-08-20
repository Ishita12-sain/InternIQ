import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Clock,
  Banknote,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ArrowRight
} from 'lucide-react';

export interface RecommendedInternshipItem {
  id: string;
  companyName: string;
  companyLogo: string;
  title: string;
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  duration: string;
  stipend: string;
  skills: string[];
  matchPercentage: number;
  description: string;
  matchReasons: string[];
  postedDate: string;
}

interface RecommendedCardProps {
  internship: RecommendedInternshipItem;
  onApply: (internship: RecommendedInternshipItem) => void;
  onViewDetails: (internship: RecommendedInternshipItem) => void;
}

export const RecommendedCard: React.FC<RecommendedCardProps> = ({
  internship,
  onApply,
  onViewDetails,
}) => {
  const [isMatchExpanded, setIsMatchExpanded] = useState(false);

  const getMatchBadgeStyle = (pct: number) => {
    if (pct >= 90) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (pct >= 80) return 'bg-blue-50 text-blue-700 border-blue-200';
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  const getWorkModeBadge = (mode: RecommendedInternshipItem['workMode']) => {
    switch (mode) {
      case 'Remote':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'Hybrid':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200/80';
      case 'On-site':
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white border border-[#e2e8f0] hover:border-blue-300 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 text-left group">
      <div className="space-y-3">
        {/* Top Header: Company Avatar, Info, and Match Badge */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-slate-100 border border-slate-200 flex items-center justify-center text-sm font-black text-[#2563eb] shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
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

          {/* Visually Prominent Match Percentage */}
          <div
            className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full border text-xs font-extrabold shrink-0 ${getMatchBadgeStyle(
              internship.matchPercentage
            )}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{internship.matchPercentage}% Match</span>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs text-[#64748b] leading-relaxed line-clamp-2">
          {internship.description}
        </p>

        {/* Key Metadata Info Pills */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748b] pt-1">
          <span className="flex items-center space-x-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{internship.location}</span>
          </span>
          <span
            className={`px-2.5 py-0.5 rounded-md border text-[11px] font-semibold ${getWorkModeBadge(
              internship.workMode
            )}`}
          >
            {internship.workMode}
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

        {/* Skill Tag Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {internship.skills.map((skill) => (
            <span
              key={skill}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#eff6ff] text-[#2563eb] border border-blue-200/60"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Expandable "Why this matches you" Section */}
        <div className="border-t border-slate-100 pt-3">
          <button
            onClick={() => setIsMatchExpanded(!isMatchExpanded)}
            className="flex items-center justify-between w-full text-xs font-semibold text-[#2563eb] hover:text-blue-700 cursor-pointer focus:outline-none"
          >
            <span className="flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#2563eb]" />
              <span>Why this matches you</span>
            </span>
            {isMatchExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {isMatchExpanded && (
            <div className="mt-2.5 p-3 rounded-xl bg-blue-50/50 border border-blue-100 space-y-1.5 animate-in fade-in duration-150">
              {internship.matchReasons.map((reason, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-2 text-xs text-slate-700 font-medium"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card CTA Actions */}
      <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-slate-100">
        <button
          onClick={() => onViewDetails(internship)}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
        >
          <span>View Details</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </button>

        <button
          onClick={() => onApply(internship)}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
        >
          <span>Apply Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
