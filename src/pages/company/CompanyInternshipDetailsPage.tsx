import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CompanySidebar } from '../../components/company/CompanySidebar';
import { CompanyHeader } from '../../components/company/CompanyHeader';
import {
  ArrowLeft,
  Users,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import type { CompanyInternshipItem } from './CompanyManageInternshipsPage';

export const CompanyInternshipDetailsPage: React.FC = () => {
  const { internshipId } = useParams<{ internshipId: string }>();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);

  // Retrieve item details from localStorage or fallback mock
  const [item, setItem] = useState<CompanyInternshipItem>(() => {
    const savedCustom: CompanyInternshipItem[] = JSON.parse(
      localStorage.getItem('interniq_company_custom_internships') || '[]'
    );
    const found = savedCustom.find((i) => i.id === internshipId);
    if (found) return found;

    return {
      id: internshipId || 'int-m1',
      title: 'Frontend Developer Intern',
      companyName: 'TechNova Solutions',
      department: 'Engineering',
      location: 'Bengaluru, KA',
      workMode: 'Remote',
      duration: '3 Months',
      stipend: '₹25,000 / month',
      openings: 3,
      applicantsCount: 42,
      applicationDeadline: '30 Aug 2026',
      postedDate: '10 Aug 2026',
      status: 'Active',
      description:
        'We are seeking an enthusiastic Frontend Developer Intern to join our web team. You will build high-performance React components, optimize UX design integrations, and collaborate closely with product engineering teams.',
      requiredSkills: 'React, TypeScript, Tailwind CSS, Git',
    };
  });

  const handleCloseConfirm = () => {
    const updated = { ...item, status: 'Closed' as const };
    setItem(updated);

    const savedCustom: CompanyInternshipItem[] = JSON.parse(
      localStorage.getItem('interniq_company_custom_internships') || '[]'
    );
    const updatedCustom = savedCustom.map((i) => (i.id === item.id ? updated : i));
    localStorage.setItem('interniq_company_custom_internships', JSON.stringify(updatedCustom));

    setIsCloseModalOpen(false);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <CompanySidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <CompanyHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Internship Details"
          subtitle={`Position overview for ${item.title}`}
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-5xl w-full mx-auto pb-safe text-left">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => navigate('/company/internships')}
                className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                title="Back to Internships"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h2 className="text-xl font-extrabold text-[#0f172a]">{item.title}</h2>
                <p className="text-xs text-[#64748b]">ID: {item.id} • Posted {item.postedDate}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => navigate('/company/applicants')}
                className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>View Applicants ({item.applicantsCount})</span>
              </button>

              {item.status !== 'Closed' && (
                <button
                  type="button"
                  onClick={() => setIsCloseModalOpen(true)}
                  className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Close Listing</span>
                </button>
              )}
            </div>
          </div>

          {/* Primary Meta Overview Card */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-[#2563eb] border border-blue-200 text-xs font-bold">
                {item.workMode}
              </span>
              <span
                className={`px-3 py-1 rounded-full border text-xs font-bold ${
                  item.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {item.status}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Location</span>
                <strong className="text-slate-900 font-bold">{item.location}</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Duration</span>
                <strong className="text-slate-900 font-bold">{item.duration}</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Monthly Stipend</span>
                <strong className="text-emerald-700 font-extrabold">{item.stipend}</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Application Deadline</span>
                <strong className="text-slate-900 font-bold">{item.applicationDeadline}</strong>
              </div>
            </div>
          </div>

          {/* Description & Requirements */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-[#0f172a] border-b border-slate-100 pb-3">
              Role Scope & Overview
            </h3>
            <p className="text-xs text-[#64748b] leading-relaxed font-medium">
              {item.description}
            </p>

            <div className="pt-2 space-y-2">
              <span className="text-xs font-bold text-slate-800 block">Required Skills</span>
              <div className="flex flex-wrap gap-1.5">
                {item.requiredSkills?.split(',').map((sk) => (
                  <span
                    key={sk}
                    className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#2563eb] font-bold text-xs border border-blue-200/60"
                  >
                    {sk.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Confirmation Modal */}
      {isCloseModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-xl text-left space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-amber-600">
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0f172a]">Close Internship Listing?</h3>
                <p className="text-xs text-slate-500">Students will no longer be able to apply.</p>
              </div>
            </div>

            <div className="flex justify-end space-x-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsCloseModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCloseConfirm}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-2xs cursor-pointer"
              >
                Confirm Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
