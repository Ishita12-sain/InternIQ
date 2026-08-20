import React from 'react';
import { Eye, Award } from 'lucide-react';

export interface ApplicantItem {
  id: string;
  studentName: string;
  avatarInitials: string;
  internshipTitle: string;
  matchPercentage: number;
  appliedDate: string;
  status: 'Under Review' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected';
  skills: string[];
}

interface RecentApplicationsSectionProps {
  applicants: ApplicantItem[];
  onViewApplicant: (applicant: ApplicantItem) => void;
}

export const RecentApplicationsSection: React.FC<RecentApplicationsSectionProps> = ({
  applicants,
  onViewApplicant,
}) => {
  const getStatusBadge = (status: ApplicantItem['status']) => {
    switch (status) {
      case 'Under Review':
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">Under Review</span>;
      case 'Shortlisted':
        return <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563eb] border border-blue-200 text-[11px] font-bold">Shortlisted</span>;
      case 'Interview':
        return <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-bold">Interview Scheduled</span>;
      case 'Selected':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">Selected</span>;
      case 'Rejected':
        return <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold">Rejected</span>;
    }
  };

  return (
    <div
      id="company-recent-applications-section"
      className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4 text-left scroll-mt-24"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-base font-bold text-[#0f172a]">Recent Applications</h3>
        <span className="text-xs text-[#64748b] font-medium">Top candidates</span>
      </div>

      <div className="space-y-3">
        {applicants.map((app) => (
          <div
            key={app.id}
            className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-blue-200 transition-colors"
          >
            <div className="flex items-start space-x-3.5 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-[#2563eb] font-bold flex items-center justify-center text-xs shrink-0 border border-blue-200">
                {app.avatarInitials}
              </div>

              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <h4 className="text-sm font-bold text-[#0f172a]">{app.studentName}</h4>
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold">
                    <Award className="w-3 h-3 text-emerald-600" />
                    <span>{app.matchPercentage}% Match</span>
                  </span>
                </div>

                <p className="text-xs text-slate-500 font-medium">
                  Applied for: <strong className="text-slate-900">{app.internshipTitle}</strong> • {app.appliedDate}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {app.skills.map((sk) => (
                    <span
                      key={sk}
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-200/60 text-slate-700"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0 border-t sm:border-0 pt-3 sm:pt-0 border-slate-200/60">
              {getStatusBadge(app.status)}
              <button
                type="button"
                onClick={() => onViewApplicant(app)}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
