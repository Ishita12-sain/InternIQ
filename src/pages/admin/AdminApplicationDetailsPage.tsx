import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { mockAdminApplications } from '../../types/adminTypes';
import {
  ArrowLeft,
  Mail,
  GraduationCap,
  Briefcase,
  Download,
  FileText,
  Clock,
  Check,
} from 'lucide-react';

export const AdminApplicationDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const application = mockAdminApplications.find((a) => a.id === id) || mockAdminApplications[0];

  const timelineStages = [
    { name: 'Application Submitted', completed: true },
    { name: 'Under Review', completed: ['Under Review', 'Shortlisted', 'Interview', 'Selected'].includes(application.status) },
    { name: 'Shortlisted', completed: ['Shortlisted', 'Interview', 'Selected'].includes(application.status) },
    { name: 'Interview', completed: ['Interview', 'Selected'].includes(application.status) },
    { name: 'Selected', completed: application.status === 'Selected' },
  ];

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Application Dossier Details"
          subtitle={`Viewing candidate application, evaluation funnel & resume submission for ${application.candidateName}`}
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-5xl w-full mx-auto pb-safe text-left">
          {/* Back Navigation Bar */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/admin/applications')}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-xl font-extrabold text-[#0f172a]">Application Record</h2>
              <p className="text-xs text-slate-500">ID: {application.id} • Submitted {application.appliedDate}</p>
            </div>
          </div>

          {/* Header Summary Card */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-md shrink-0">
                {application.avatarInitials}
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2 justify-center sm:justify-start">
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/students/${application.studentId}`)}
                    className="text-lg font-bold text-[#0f172a] hover:text-[#2563eb] hover:underline cursor-pointer"
                  >
                    {application.candidateName}
                  </button>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                      application.status === 'Selected'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : application.status === 'Interview'
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : application.status === 'Shortlisted'
                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}
                  >
                    {application.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start space-x-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{application.studentEmail}</span>
                </p>
                <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start space-x-2 pt-0.5">
                  <span>Applying for:</span>
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/internships/${application.internshipId}`)}
                    className="font-bold text-[#2563eb] hover:underline cursor-pointer"
                  >
                    {application.internshipTitle}
                  </button>
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2 w-full sm:w-auto text-center sm:text-right">
              <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-200 w-full sm:w-48 space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-blue-900">
                  <span>Match Score</span>
                  <span>{application.matchScore}%</span>
                </div>
                <div className="w-full bg-blue-200/80 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#2563eb] h-full rounded-full" style={{ width: `${application.matchScore}%` }} />
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate('/student/documents')}
                className="inline-flex items-center space-x-1 text-xs font-bold text-[#2563eb] hover:underline cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Candidate Resume CV</span>
              </button>
            </div>
          </div>

          {/* Application Timeline Section */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-[#0f172a] border-b border-slate-100 pb-3 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-[#2563eb]" />
              <span>Application Progress Workflow Timeline</span>
            </h3>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              {timelineStages.map((stg, idx) => (
                <div key={stg.name} className="flex flex-col items-center text-center space-y-1.5 flex-1 w-full">
                  <div
                    className={`w-9 h-9 rounded-full font-extrabold text-xs flex items-center justify-center border transition-all ${
                      stg.completed
                        ? 'bg-[#2563eb] text-white border-blue-600 shadow-2xs'
                        : 'bg-slate-100 text-slate-400 border-slate-200'
                    }`}
                  >
                    {stg.completed ? <Check className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span className={`text-xs font-bold ${stg.completed ? 'text-[#0f172a]' : 'text-slate-400'}`}>
                    {stg.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Candidate Profile vs Internship Detail Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
              <h3 className="text-sm font-extrabold text-[#0f172a] border-b border-slate-100 pb-3 flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-[#2563eb]" />
                <span>Candidate Academic Profile</span>
              </h3>
              <div className="space-y-3 text-xs font-medium text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-100"><span>Institution:</span> <strong>{application.college || 'IIT Bombay'}</strong></div>
                <div className="flex justify-between py-1 border-b border-slate-100"><span>Degree & Course:</span> <strong>{application.course || 'B.Tech CS'}</strong></div>
                <div className="flex justify-between py-1 border-b border-slate-100"><span>Academic Year:</span> <strong>{application.year || '4th Year'}</strong></div>
              </div>
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-700 uppercase">Assessed Technical Skills:</span>
                <div className="flex flex-wrap gap-1">
                  {(application.skills || ['React', 'TypeScript', 'Node.js']).map((sk) => (
                    <span key={sk} className="px-2 py-0.5 rounded-full bg-blue-50 text-[#2563eb] border border-blue-200 text-[10px] font-bold">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
              <h3 className="text-sm font-extrabold text-[#0f172a] border-b border-slate-100 pb-3 flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-[#2563eb]" />
                <span>Target Internship Specification</span>
              </h3>
              <div className="space-y-3 text-xs font-medium text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Company:</span>
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/companies/${application.companyId}`)}
                    className="font-bold text-[#2563eb] hover:underline cursor-pointer"
                  >
                    {application.companyName}
                  </button>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100"><span>Location:</span> <strong>{application.location || 'Bengaluru, KA'}</strong></div>
                <div className="flex justify-between py-1 border-b border-slate-100"><span>Work Mode:</span> <strong>{application.workMode || 'Hybrid'}</strong></div>
                <div className="flex justify-between py-1 border-b border-slate-100"><span>Stipend Offer:</span> <strong>{application.stipend || '₹25,000 / mo'}</strong></div>
              </div>
            </div>
          </div>

          {/* Cover Letter Section */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-3">
            <h3 className="text-sm font-extrabold text-[#0f172a] border-b border-slate-100 pb-3 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-[#2563eb]" />
              <span>Candidate Cover Letter Submission</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-4 rounded-2xl border border-slate-100">
              "{application.coverLetter || 'I am eager to contribute to TechNova Solutions as a Frontend Developer Intern. My hands-on experience with modern React architecture and component libraries makes me an ideal fit.'}"
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};
