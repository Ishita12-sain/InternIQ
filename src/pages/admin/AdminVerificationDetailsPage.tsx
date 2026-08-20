import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { mockPendingVerifications } from '../../types/adminTypes';
import {
  ArrowLeft,
  Mail,
  Phone,
  Shield,
  FileCheck,
  Download,
  Eye,
  X,
  FileText,
} from 'lucide-react';

export const AdminVerificationDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const verification = mockPendingVerifications.find((v) => v.id === id) || mockPendingVerifications[0];

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Verification Dossier Details"
          subtitle={`Reviewing compliance documentation and applicant dossier for ${verification.name}`}
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-5xl w-full mx-auto pb-safe text-left">
          {/* Back Navigation Bar */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/admin/verifications')}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-xl font-extrabold text-[#0f172a]">Verification Request Record</h2>
              <p className="text-xs text-slate-500">ID: {verification.id} • Submitted {verification.submittedDate}</p>
            </div>
          </div>

          {/* Applicant Header Card */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-md shrink-0">
                {verification.avatarInitials}
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2 justify-center sm:justify-start">
                  <h3 className="text-lg font-bold text-[#0f172a]">{verification.name}</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-extrabold border border-slate-200">
                    {verification.entityType}
                  </span>
                </div>
                <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start space-x-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{verification.email}</span>
                </p>
                <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start space-x-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{verification.phone || '+91 98000 00000'}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2 w-full sm:w-auto text-center sm:text-right">
              <span
                className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                  verification.status === 'Verified'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : verification.status === 'Under Review'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : verification.status === 'Pending'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                {verification.status}
              </span>
              <span className="text-xs text-slate-400 font-medium">Reviewer: {verification.reviewer || 'Unassigned'}</span>
              <span className="text-xs text-slate-400 font-medium">Reviewed Date: {verification.reviewedDate || 'Pending'}</span>
            </div>
          </div>

          {/* Verification Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
              <h3 className="text-sm font-extrabold text-[#0f172a] border-b border-slate-100 pb-3 flex items-center space-x-2">
                <Shield className="w-4 h-4 text-[#2563eb]" />
                <span>Verification Request Context</span>
              </h3>
              <div className="space-y-3 text-xs font-medium text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-100"><span>Verification Type:</span> <strong>{verification.entityType} Verification</strong></div>
                <div className="flex justify-between py-1 border-b border-slate-100"><span>Document Type:</span> <strong>{verification.documentType}</strong></div>
                <div className="flex justify-between py-1 border-b border-slate-100"><span>Submitted Date:</span> <strong>{verification.submittedDate}</strong></div>
                <div className="flex justify-between py-1 border-b border-slate-100"><span>Current Status:</span> <strong className="text-emerald-700">{verification.status}</strong></div>
              </div>
            </div>

            {/* Document Card */}
            <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
              <h3 className="text-sm font-extrabold text-[#0f172a] border-b border-slate-100 pb-3 flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-[#2563eb]" />
                <span>Submitted File Information</span>
              </h3>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center space-x-2.5">
                  <FileText className="w-5 h-5 text-[#2563eb] shrink-0" />
                  <div>
                    <p className="font-bold text-[#0f172a]">{verification.documentName}</p>
                    <p className="text-[11px] text-slate-400">{verification.fileType || 'PDF Document'} • {verification.fileSize || '2.4 MB'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2 border-t border-slate-200/60">
                  <button
                    type="button"
                    onClick={() => setIsPreviewOpen(true)}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Document</span>
                  </button>
                  <a
                    href={verification.fileUrl || '#'}
                    download
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Document Preview Section Modal / Drawer */}
          {isPreviewOpen && (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl text-left space-y-4 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-5 h-5 text-[#2563eb]" />
                    <h3 className="text-base font-bold text-[#0f172a]">Document Preview: {verification.documentName}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPreviewOpen(false)}
                    className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-slate-100 border border-slate-200 rounded-2xl p-6 min-h-[260px] flex flex-col items-center justify-center text-center space-y-3">
                  {verification.documentName.endsWith('.png') || verification.documentName.endsWith('.jpg') ? (
                    <img
                      src={verification.fileUrl}
                      alt={verification.documentName}
                      className="max-h-72 object-contain rounded-xl shadow-md border border-slate-200"
                    />
                  ) : (
                    <div className="space-y-2">
                      <FileText className="w-12 h-12 text-[#2563eb] mx-auto" />
                      <p className="text-sm font-bold text-slate-800">{verification.documentName}</p>
                      <p className="text-xs text-slate-500">PDF Document Preview Rendered in Secure Admin Viewer</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setIsPreviewOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-2xs cursor-pointer"
                  >
                    Back to Verification
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
