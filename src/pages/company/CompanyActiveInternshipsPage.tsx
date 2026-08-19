import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompanySidebar } from '../../components/company/CompanySidebar';
import { CompanyHeader } from '../../components/company/CompanyHeader';
import { ArrowLeft, MapPin, Clock, Users, PlusCircle, Filter } from 'lucide-react';

export interface DedicatedInternshipItem {
  id: string;
  title: string;
  department: string;
  location: string;
  workMode: 'Remote' | 'Full Time' | 'Hybrid' | 'Part Time';
  duration: string;
  applicantsCount: number;
  postedDate: string;
  status: 'Active' | 'Draft' | 'Closed';
}

export const CompanyActiveInternshipsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const defaultInternships: DedicatedInternshipItem[] = [
    {
      id: 'int-page-1',
      title: 'Frontend Developer Intern',
      department: 'Engineering',
      location: 'Bengaluru, KA',
      workMode: 'Remote',
      duration: '3 Months',
      applicantsCount: 42,
      postedDate: '10 Aug 2026',
      status: 'Active',
    },
    {
      id: 'int-page-2',
      title: 'Backend Developer Intern',
      department: 'Software Architecture',
      location: 'Pune, MH',
      workMode: 'Full Time',
      duration: '6 Months',
      applicantsCount: 28,
      postedDate: '05 Aug 2026',
      status: 'Active',
    },
    {
      id: 'int-page-3',
      title: 'UI/UX Design Intern',
      department: 'Product Design',
      location: 'Mumbai, MH',
      workMode: 'Hybrid',
      duration: '3 Months',
      applicantsCount: 19,
      postedDate: '12 Aug 2026',
      status: 'Active',
    },
    {
      id: 'int-page-4',
      title: 'Data Science & AI Intern',
      department: 'Analytics',
      location: 'Hyderabad, TS',
      workMode: 'Remote',
      duration: '6 Months',
      applicantsCount: 34,
      postedDate: '01 Aug 2026',
      status: 'Closed',
    },
  ];

  const customInternships: DedicatedInternshipItem[] = JSON.parse(
    localStorage.getItem('interniq_company_custom_internships') || '[]'
  );

  const internshipsList = [...customInternships, ...defaultInternships];

  const filteredInternships = internshipsList.filter((item) =>
    statusFilter === 'All' ? true : item.status === statusFilter
  );

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <CompanySidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <CompanyHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Active Internships"
          subtitle="Manage all open internship positions and track applicant responses."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto pb-safe">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard/company')}
                className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="text-left">
                <h2 className="text-xl font-extrabold text-[#0f172a]">Active Internships</h2>
                <p className="text-xs text-[#64748b]">
                  Showing {filteredInternships.length} posted positions
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/company/post-internship')}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Internship</span>
            </button>
          </div>

          {/* Filter Pills */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs flex items-center justify-between text-left flex-wrap gap-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
              <Filter className="w-4 h-4 text-[#2563eb]" />
              <span>Status Filter:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['All', 'Active', 'Closed'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-[#2563eb] text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Internships Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredInternships.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-4 text-left hover:border-blue-300 transition-colors"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563eb] border border-blue-200 text-[11px] font-bold">
                      {item.workMode}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${
                        item.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#0f172a]">{item.title}</h3>
                    <p className="text-xs text-[#64748b] font-medium">{item.department}</p>
                  </div>

                  <div className="space-y-1.5 text-xs text-[#64748b] pt-1">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{item.duration} • Posted {item.postedDate}</span>
                    </div>
                    <div className="flex items-center space-x-2 font-bold text-[#0f172a] pt-1">
                      <Users className="w-3.5 h-3.5 text-[#2563eb] shrink-0" />
                      <span>{item.applicantsCount} Applicants</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => navigate('/company/applicants')}
                    className="w-full py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#2563eb] border border-blue-200 text-xs font-semibold transition-colors cursor-pointer text-center"
                  >
                    View Applicants ({item.applicantsCount})
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
