import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { mockAdminCompanies } from '../../types/adminTypes';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Globe,
  ExternalLink,
  Briefcase,
  BarChart3,
  FileCheck,
} from 'lucide-react';

export const AdminCompanyDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const company = mockAdminCompanies.find((c) => c.id === id) || mockAdminCompanies[0];
  const perf = company.recruitmentPerformance || {
    applicationsReceived: 184,
    shortlistRate: 31.5,
    interviewRate: 17.3,
    selectionRate: 7.6,
    avgMatchScore: 89.4,
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Company Account Details"
          subtitle={`Viewing employer profile, verification dossiers & recruitment analytics for ${company.name}`}
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-5xl w-full mx-auto pb-safe text-left">
          {/* Back Navigation Bar */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/admin/companies')}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-xl font-extrabold text-[#0f172a]">Employer Profile Record</h2>
              <p className="text-xs text-slate-500">CIN: {company.cin} • {company.location}</p>
            </div>
          </div>

          {/* Company Summary Card */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-md shrink-0">
                {company.avatarInitials}
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2 justify-center sm:justify-start">
                  <h3 className="text-lg font-bold text-[#0f172a]">{company.name}</h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                      company.verificationStatus === 'Verified'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : company.verificationStatus === 'Pending'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {company.verificationStatus}
                  </span>
                </div>
                <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start space-x-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{company.email}</span>
                </p>
                <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start space-x-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{company.phone || '+91 80 4567 8900'}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2 w-full sm:w-auto text-center sm:text-right">
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1 text-xs font-semibold text-[#2563eb] hover:underline"
                >
                  <Globe className="w-3.5 h-3.5 text-[#2563eb]" />
                  <span>Company Website</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {company.linkedin && (
                <a
                  href={company.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-600 hover:underline"
                >
                  <span>LinkedIn Page</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              <span className="text-xs text-slate-400 font-medium">Submitted {company.submittedDate || '10 Aug 2026'}</span>
            </div>
          </div>

          {/* Industry & Verification Specifics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
              <h3 className="text-sm font-extrabold text-[#0f172a] border-b border-slate-100 pb-3 flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-[#2563eb]" />
                <span>Company Identity & Dossier</span>
              </h3>
              <div className="space-y-3 text-xs font-medium text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-100"><span>Industry Sector:</span> <strong>{company.industry}</strong></div>
                <div className="flex justify-between py-1 border-b border-slate-100"><span>Workforce Size:</span> <strong>{company.size || '250-500 Employees'}</strong></div>
                <div className="flex justify-between py-1 border-b border-slate-100"><span>Headquarters:</span> <strong>{company.location}</strong></div>
                <div className="flex justify-between py-1 border-b border-slate-100"><span>Registration CIN:</span> <strong>{company.cin}</strong></div>
                <div className="flex justify-between py-1 border-b border-slate-100"><span>Verification Date:</span> <strong>{company.verifiedDate || 'Pending Review'}</strong></div>
              </div>
            </div>

            {/* Verification Documents Card */}
            <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
              <h3 className="text-sm font-extrabold text-[#0f172a] border-b border-slate-100 pb-3 flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-[#2563eb]" />
                <span>Compliance Verification Documents</span>
              </h3>
              <div className="space-y-2 text-xs font-medium">
                {['Certificate of Incorporation', 'GST Registration Dossier', 'Company PAN Card Proof'].map((doc) => (
                  <div key={doc} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <span className="font-bold text-slate-800">{doc}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200">
                      Uploaded & Clear
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Company Recruitment Performance Section */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-[#0f172a] border-b border-slate-100 pb-3 flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-[#2563eb]" />
              <span>Company Recruitment Performance</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Applications Received</span>
                <p className="text-xl font-black text-slate-900">{perf.applicationsReceived}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Shortlist Rate</span>
                <p className="text-xl font-black text-purple-600">{perf.shortlistRate}%</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Interview Rate</span>
                <p className="text-xl font-black text-amber-600">{perf.interviewRate}%</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Selection Rate</span>
                <p className="text-xl font-black text-emerald-600">{perf.selectionRate}%</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Match Score</span>
                <p className="text-xl font-black text-[#2563eb]">{perf.avgMatchScore}/100</p>
              </div>
            </div>
          </div>

          {/* Internship Listings Activity Table */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-[#0f172a] border-b border-slate-100 pb-3 flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-[#2563eb]" />
              <span>Posted Internship Listings</span>
            </h3>

            {company.internshipListings && company.internshipListings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-medium border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                      <th className="py-2.5 px-3">Internship Title</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Applications</th>
                      <th className="py-2.5 px-3">Shortlisted</th>
                      <th className="py-2.5 px-3">Interviews</th>
                      <th className="py-2.5 px-3">Selected</th>
                      <th className="py-2.5 px-3">Deadline</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {company.internshipListings.map((lst) => (
                      <tr
                        key={lst.id}
                        onClick={() => navigate('/admin/internships')}
                        className="hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-3 font-bold text-[#0f172a]">{lst.title}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold">
                            {lst.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-800">{lst.applications}</td>
                        <td className="py-3 px-3 font-semibold text-purple-700">{lst.shortlisted}</td>
                        <td className="py-3 px-3 font-semibold text-amber-700">{lst.interviews}</td>
                        <td className="py-3 px-3 font-bold text-emerald-700">{lst.selected}</td>
                        <td className="py-3 px-3 text-slate-500">{lst.deadline}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">No active internship listings posted yet.</p>
            )}
          </div>

          {/* Navigation Action Buttons */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-800">Quick Admin Navigation</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => navigate('/admin/internships')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl cursor-pointer"
              >
                View Internships
              </button>
              <button
                onClick={() => navigate('/admin/applications')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl cursor-pointer"
              >
                View Applicants
              </button>
              <button
                onClick={() => navigate('/admin/verifications')}
                className="px-4 py-2 bg-[#2563eb] text-white hover:bg-blue-700 text-xs font-semibold rounded-xl shadow-2xs cursor-pointer"
              >
                View Verification
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
