import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { mockAdminInternships } from '../../types/adminTypes';
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  DollarSign,
  Building2,
  Users,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';

export const AdminInternshipDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const internship = mockAdminInternships.find((i) => i.id === id) || mockAdminInternships[0];

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Internship Posting Details"
          subtitle={`Viewing opportunity specification & applicant funnel for ${internship.title}`}
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-5xl w-full mx-auto pb-safe text-left">
          {/* Back Navigation Bar */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/admin/internships')}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-xl font-extrabold text-[#0f172a]">Internship Specification</h2>
              <p className="text-xs text-slate-500">ID: {internship.id} • Posted {internship.postedDate}</p>
            </div>
          </div>

          {/* Internship Summary Header Card */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-md shrink-0">
                {internship.companyLogo}
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#0f172a]">{internship.title}</h3>
                <button
                  type="button"
                  onClick={() => navigate(`/admin/companies/${internship.companyId}`)}
                  className="text-xs font-semibold text-[#2563eb] hover:underline flex items-center justify-center sm:justify-start space-x-1 cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{internship.companyName}</span>
                </button>
                <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start space-x-3 pt-0.5">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{internship.location} ({internship.workMode})</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                    <span>{internship.stipend}</span>
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2 w-full sm:w-auto text-center sm:text-right">
              <span
                className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                  internship.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : internship.status === 'Pending Review'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : internship.status === 'Rejected'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {internship.status}
              </span>
              <span className="text-xs text-slate-500 font-medium">Deadline: {internship.deadline}</span>
              <span className="text-xs text-slate-500 font-medium">{internship.openings} Openings</span>
            </div>
          </div>

          {/* Rejection Notice Banner if Rejected */}
          {internship.status === 'Rejected' && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
              <div className="flex items-center space-x-2 font-extrabold">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Internship Rejection Record</span>
              </div>
              <p className="font-semibold">Rejection Reason: {internship.rejectionReason || 'Compliance documentation mismatch.'}</p>
              <p className="text-[11px] text-rose-600">Reviewed By: {internship.reviewedBy || 'Admin'} on {internship.rejectedDate || '16 Aug 2026'}</p>
            </div>
          )}

          {/* Application Funnel Card */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-[#0f172a] flex items-center space-x-2">
                <Users className="w-4 h-4 text-[#2563eb]" />
                <span>Application Funnel Pipeline</span>
              </h3>
              <button
                type="button"
                onClick={() => navigate('/admin/applications')}
                className="inline-flex items-center space-x-1 text-xs font-bold text-[#2563eb] hover:underline cursor-pointer"
              >
                <span>View All Applications</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Applications</span>
                <p className="text-2xl font-black text-slate-900">{internship.applicationsCount}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Under Review</span>
                <p className="text-2xl font-black text-blue-600">{internship.underReview || 32}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Shortlisted</span>
                <p className="text-2xl font-black text-purple-600">{internship.shortlisted || 24}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Interviews</span>
                <p className="text-2xl font-black text-amber-600">{internship.interviews || 14}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Selected</span>
                <p className="text-2xl font-black text-emerald-600">{internship.selected || 6}</p>
              </div>
            </div>
          </div>

          {/* Job Specifications & Requirements */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
              <h3 className="text-sm font-extrabold text-[#0f172a] border-b border-slate-100 pb-3 flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-[#2563eb]" />
                <span>Description & Key Responsibilities</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">{internship.description}</p>
              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase">Responsibilities:</span>
                <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                  {internship.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
              <h3 className="text-sm font-extrabold text-[#0f172a] border-b border-slate-100 pb-3 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#2563eb]" />
                <span>Requirements & Required Skills</span>
              </h3>
              <div className="space-y-2 text-xs font-medium text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-100"><span>Eligibility:</span> <strong>{internship.eligibility}</strong></div>
                <div className="flex justify-between py-1 border-b border-slate-100"><span>Duration:</span> <strong>{internship.duration}</strong></div>
                <div className="flex justify-between py-1 border-b border-slate-100"><span>Work Mode:</span> <strong>{internship.workMode}</strong></div>
              </div>
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase">Required Skill Badges:</span>
                <div className="flex flex-wrap gap-1.5">
                  {internship.skills.map((sk) => (
                    <span key={sk} className="px-2.5 py-1 rounded-full bg-blue-50 text-[#2563eb] border border-blue-200 font-bold text-xs">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
