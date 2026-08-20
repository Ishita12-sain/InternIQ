import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { mockAdminStudents } from '../../types/adminTypes';
import {
  ArrowLeft,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  ExternalLink,
  Award,
  Download,
} from 'lucide-react';

export const AdminStudentDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const student = mockAdminStudents.find((s) => s.id === id) || mockAdminStudents[0];

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Student Record & Placement Details"
          subtitle={`Viewing complete profile and internship evaluations for ${student.name}`}
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-5xl w-full mx-auto pb-safe text-left">
          {/* Back Navigation Bar */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/admin/students')}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-xl font-extrabold text-[#0f172a]">Student Profile Record</h2>
              <p className="text-xs text-slate-500">ID: {student.id} • {student.college}</p>
            </div>
          </div>

          {/* Student Header Summary Card */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-md shrink-0">
                {student.avatarInitials}
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2 justify-center sm:justify-start">
                  <h3 className="text-lg font-bold text-[#0f172a]">{student.name}</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold">
                    {student.internshipStatus}
                  </span>
                </div>
                <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start space-x-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{student.email}</span>
                </p>
                <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start space-x-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{student.phone || '+91 98765 43210'}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2 w-full sm:w-auto text-center sm:text-right">
              <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-200 w-full sm:w-48 space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-blue-900">
                  <span>Profile Completion</span>
                  <span>{student.profileCompletion}%</span>
                </div>
                <div className="w-full bg-blue-200/80 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#2563eb] h-full rounded-full" style={{ width: `${student.profileCompletion}%` }} />
                </div>
              </div>

              {student.linkedin && (
                <a
                  href={student.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1 text-xs font-semibold text-[#2563eb] hover:underline"
                >
                  <span>LinkedIn Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* Academic & Skill Specifics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
              <h3 className="text-sm font-extrabold text-[#0f172a] border-b border-slate-100 pb-3 flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-[#2563eb]" />
                <span>Academic & Profile Information</span>
              </h3>
              <div className="space-y-3 text-xs font-medium text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-100"><span>Institution:</span> <strong>{student.college}</strong></div>
                <div className="flex justify-between py-1 border-b border-slate-100"><span>Course / Degree:</span> <strong>{student.course}</strong></div>
                <div className="flex justify-between py-1 border-b border-slate-100"><span>Academic Year:</span> <strong>{student.year}</strong></div>
                <div className="flex justify-between py-1 border-b border-slate-100"><span>Location:</span> <strong>{student.location || 'Mumbai, MH'}</strong></div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Verified Resume:</span>
                  <button onClick={() => navigate('/student/documents')} className="inline-flex items-center space-x-1 text-[#2563eb] font-bold hover:underline cursor-pointer">
                    <Download className="w-3.5 h-3.5" />
                    <span>Download CV</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Internship Metrics */}
            <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
              <h3 className="text-sm font-extrabold text-[#0f172a] border-b border-slate-100 pb-3 flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-[#2563eb]" />
                <span>Internship Activity & Offer Status</span>
              </h3>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Applications</span>
                  <p className="text-xl font-black text-slate-900">{student.applications || 4}</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Shortlisted</span>
                  <p className="text-xl font-black text-purple-600">{student.shortlisted || 2}</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Interviews</span>
                  <p className="text-xl font-black text-amber-600">{student.interviews || 2}</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Selections</span>
                  <p className="text-xl font-black text-emerald-600">{student.selected || 1}</p>
                </div>
              </div>

              {student.currentInternship && (
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-1">
                  <span className="font-extrabold text-emerald-800 uppercase text-[10px]">Active Internship Placement</span>
                  <p className="font-bold text-emerald-950">{student.currentInternship.title}</p>
                  <p className="text-emerald-800">{student.currentInternship.company} • {student.currentInternship.duration}</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Action Navigation CTAs */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-[#2563eb]" />
              <span className="text-xs font-bold text-slate-800">Quick Portal Navigation Links</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => navigate('/admin/applications')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl cursor-pointer"
              >
                View Applications
              </button>
              <button
                onClick={() => navigate('/admin/ongoing-internships')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl cursor-pointer"
              >
                View Internship
              </button>
              <button
                onClick={() => navigate('/student/profile')}
                className="px-4 py-2 bg-[#2563eb] text-white hover:bg-blue-700 text-xs font-semibold rounded-xl shadow-2xs cursor-pointer"
              >
                View Full Profile
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
