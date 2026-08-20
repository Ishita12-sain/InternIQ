import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompanySidebar } from '../../components/company/CompanySidebar';
import { CompanyHeader } from '../../components/company/CompanyHeader';
import { ArrowLeft, Award, Eye, Calendar, Sparkles } from 'lucide-react';

export interface ShortlistedStudentItem {
  id: string;
  studentName: string;
  avatarInitials: string;
  internshipTitle: string;
  matchScore: number;
  skills: string[];
  shortlistedDate: string;
  interviewStatus: 'Scheduled' | 'Pending Schedule' | 'Completed';
}

export const CompanyShortlistedPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const shortlistedList: ShortlistedStudentItem[] = [
    {
      id: 'sh-1',
      studentName: 'Aarav Sharma',
      avatarInitials: 'AS',
      internshipTitle: 'Frontend Developer Intern',
      matchScore: 94,
      skills: ['React', 'TypeScript', 'Tailwind CSS'],
      shortlistedDate: '18 Aug 2026',
      interviewStatus: 'Scheduled',
    },
    {
      id: 'sh-2',
      studentName: 'Rohan Mehta',
      avatarInitials: 'RM',
      internshipTitle: 'Frontend Developer Intern',
      matchScore: 91,
      skills: ['React', 'JavaScript', 'HTML/CSS'],
      shortlistedDate: '16 Aug 2026',
      interviewStatus: 'Scheduled',
    },
    {
      id: 'sh-3',
      studentName: 'Neha Gupta',
      avatarInitials: 'NG',
      internshipTitle: 'Backend Developer Intern',
      matchScore: 89,
      skills: ['Node.js', 'Express', 'MongoDB'],
      shortlistedDate: '17 Aug 2026',
      interviewStatus: 'Pending Schedule',
    },
  ];

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <CompanySidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <CompanyHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Shortlisted Candidates"
          subtitle="Top matching candidate profiles selected for interview evaluation."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto pb-safe">
          {/* Header Bar */}
          <div className="flex items-center justify-between text-left">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard/company')}
                className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h2 className="text-xl font-extrabold text-[#0f172a]">Shortlisted Candidates</h2>
                <p className="text-xs text-[#64748b]">
                  Showing {shortlistedList.length} shortlisted candidates
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/company/interviews')}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Schedule Interviews</span>
            </button>
          </div>

          {/* Candidates List Container */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 sm:p-6 shadow-2xs space-y-3 text-left">
            {shortlistedList.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-blue-200 transition-colors"
              >
                <div className="flex items-start space-x-3.5 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-[#2563eb] font-bold flex items-center justify-center text-xs shrink-0 border border-blue-200">
                    {item.avatarInitials}
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <h4 className="text-sm font-bold text-[#0f172a]">{item.studentName}</h4>
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold">
                        <Award className="w-3 h-3 text-emerald-600" />
                        <span>{item.matchScore}% Match</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 font-medium">
                      Applied for: <strong className="text-slate-900">{item.internshipTitle}</strong> • Shortlisted {item.shortlistedDate}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.skills.map((sk) => (
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
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-bold">
                    <Sparkles className="w-3 h-3 text-indigo-600" />
                    <span>{item.interviewStatus}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => navigate('/company/applicants')}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Profile</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};
