import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Briefcase, Users, Sparkles } from 'lucide-react';

export const CompanyQuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-3 text-left">
      <h3 className="text-sm font-extrabold text-[#0f172a] uppercase tracking-wider text-[11px]">
        Quick Management Actions
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => navigate('/company/post-internship')}
          className="w-full inline-flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Internship</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/company/internships')}
          className="w-full inline-flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
        >
          <Briefcase className="w-4 h-4 text-[#2563eb]" />
          <span>Manage Internships</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/company/applicants')}
          className="w-full inline-flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
        >
          <Users className="w-4 h-4 text-[#2563eb]" />
          <span>View Applicants</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/company/smart-matching')}
          className="w-full inline-flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#2563eb] text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#2563eb]" />
          <span>Smart Matching</span>
        </button>
      </div>
    </div>
  );
};
