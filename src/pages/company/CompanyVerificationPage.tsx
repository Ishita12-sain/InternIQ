import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompanySidebar } from '../../components/company/CompanySidebar';
import { CompanyHeader } from '../../components/company/CompanyHeader';
import {
  ArrowLeft,
  ShieldCheck,
  Clock,
  AlertTriangle,
  Upload,
  Eye,
  Download,
  Trash2,
  CheckCircle2,
  FileText,
  Building,
  Edit,
  Filter,
  Check,
  X,
  Send,
} from 'lucide-react';

export interface CompanyVerificationDocument {
  id: string;
  name: string;
  code: 'registration' | 'gst' | 'pan' | 'authorization' | 'address_proof';
  uploadStatus: 'Not Uploaded' | 'Under Review' | 'Verified' | 'Rejected';
  verificationStatus: 'Not Uploaded' | 'Under Review' | 'Verified' | 'Rejected';
  uploadedDate?: string;
  fileName?: string;
  fileSize?: string;
  fileDataUrl?: string;
  rejectionReason?: string;
}

export const CompanyVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const docListRef = useRef<HTMLDivElement>(null);

  // Inline non-blocking feedback toast
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Overall Company Verification Status state: 'Verified' | 'Under Review' | 'Rejected' | 'Not Submitted'
  const [overallStatus, setOverallStatus] = useState<'Verified' | 'Under Review' | 'Rejected' | 'Not Submitted'>(() => {
    return (localStorage.getItem('interniq_company_verification_status') as any) || 'Verified';
  });

  const [submittedDate, setSubmittedDate] = useState<string>('12 Aug 2026');
  const [verifiedDate] = useState<string | undefined>('15 Aug 2026');

  // Company Information details
  const [companyInfo, setCompanyInfo] = useState({
    name: 'TechNova Solutions Inc.',
    email: 'compliance@technova.com',
    website: 'https://technova.com',
    industry: 'Software & Information Technology',
    location: 'Bengaluru, KA',
    registrationId: 'CIN-U72200KA2020PTC134567',
  });

  // Edit Company Info Modal State
  const [isEditingInfo, setIsEditingInfo] = useState(false);

  // Default initial required documents
  const defaultDocs: CompanyVerificationDocument[] = [
    {
      id: 'doc-1',
      name: 'Company Registration Certificate',
      code: 'registration',
      uploadStatus: 'Verified',
      verificationStatus: 'Verified',
      uploadedDate: '10 Aug 2026',
      fileName: 'ROC_Registration_Certificate_TechNova.pdf',
      fileSize: '2.4 MB',
    },
    {
      id: 'doc-2',
      name: 'GST Certificate',
      code: 'gst',
      uploadStatus: 'Verified',
      verificationStatus: 'Verified',
      uploadedDate: '11 Aug 2026',
      fileName: 'GSTIN_Certificate_2026.pdf',
      fileSize: '1.8 MB',
    },
    {
      id: 'doc-3',
      name: 'Company PAN',
      code: 'pan',
      uploadStatus: 'Verified',
      verificationStatus: 'Verified',
      uploadedDate: '11 Aug 2026',
      fileName: 'Company_PAN_TechNova.pdf',
      fileSize: '850 KB',
    },
    {
      id: 'doc-4',
      name: 'Address Proof',
      code: 'address_proof',
      uploadStatus: 'Verified',
      verificationStatus: 'Verified',
      uploadedDate: '12 Aug 2026',
      fileName: 'Office_Lease_Agreement.pdf',
      fileSize: '3.1 MB',
    },
    {
      id: 'doc-5',
      name: 'Authorization Letter',
      code: 'authorization',
      uploadStatus: 'Verified',
      verificationStatus: 'Verified',
      uploadedDate: '12 Aug 2026',
      fileName: 'Authorization_Letter_HR.pdf',
      fileSize: '1.2 MB',
    },
  ];

  // Required Documents List with localStorage persistence
  const [documents, setDocuments] = useState<CompanyVerificationDocument[]>(() => {
    const saved = localStorage.getItem('interniq_company_verification_docs');
    return saved ? JSON.parse(saved) : defaultDocs;
  });

  // Save documents to localStorage on change
  const updateDocs = (newDocs: CompanyVerificationDocument[]) => {
    setDocuments(newDocs);
    localStorage.setItem('interniq_company_verification_docs', JSON.stringify(newDocs));
  };

  // Modal File Viewer State
  const [viewingDoc, setViewingDoc] = useState<CompanyVerificationDocument | null>(null);

  // Filter state for documents: 'All' | 'Under Review' | 'Verified' | 'Rejected' | 'Not Uploaded'
  const [docFilter, setDocFilter] = useState<string>('All');

  // Summary Card Click Handler with Smooth Scrolling
  const handleSummaryCardClick = (filter: string) => {
    setDocFilter(filter);
    if (docListRef.current) {
      docListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Upload Document File Selected Handler
  const handleFileUpload = (docId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setFeedback({ type: 'error', message: 'Only PDF, JPG, JPEG, and PNG files are accepted.' });
      setTimeout(() => setFeedback(null), 4000);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      const formattedSize = file.size > 1024 * 1024 ? `${sizeMb} MB` : `${Math.round(file.size / 1024)} KB`;
      const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

      const updated = documents.map((d) =>
        d.id === docId
          ? {
              ...d,
              uploadStatus: 'Under Review' as const,
              verificationStatus: 'Under Review' as const,
              fileName: file.name,
              fileSize: formattedSize,
              uploadedDate: dateStr,
              fileDataUrl: dataUrl,
              rejectionReason: undefined,
            }
          : d
      );

      updateDocs(updated);
      setFeedback({ type: 'success', message: `${file.name} uploaded! Status is now "Under Review".` });
      setTimeout(() => setFeedback(null), 3500);
    };
    reader.readAsDataURL(file);
  };

  // Delete Document
  const handleDeleteDocument = (docId: string) => {
    const updated = documents.map((d) =>
      d.id === docId
        ? {
            ...d,
            uploadStatus: 'Not Uploaded' as const,
            verificationStatus: 'Not Uploaded' as const,
            fileName: undefined,
            fileSize: undefined,
            uploadedDate: undefined,
            fileDataUrl: undefined,
            rejectionReason: undefined,
          }
        : d
    );
    updateDocs(updated);
    setFeedback({ type: 'success', message: 'Document deleted successfully.' });
    setTimeout(() => setFeedback(null), 3000);
  };

  // Download Mock File
  const handleDownloadDoc = (doc: CompanyVerificationDocument) => {
    if (!doc.fileName) return;
    const content = `InternIQ Verification Document: ${doc.name}\nFile: ${doc.fileName}\nUploaded: ${doc.uploadedDate}\nStatus: ${doc.verificationStatus}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setFeedback({ type: 'success', message: `Downloaded ${doc.fileName}` });
    setTimeout(() => setFeedback(null), 3000);
  };

  // Submit for Verification
  const handleSubmitForVerification = () => {
    const missingDocs = documents.filter((d) => !d.fileName);
    if (missingDocs.length > 0) {
      setFeedback({
        type: 'error',
        message: `Missing mandatory documents: ${missingDocs.map((u) => u.name).join(', ')}. Please upload all required files.`,
      });
      setTimeout(() => setFeedback(null), 5000);
      return;
    }

    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    setOverallStatus('Under Review');
    setSubmittedDate(todayStr);
    localStorage.setItem('interniq_company_verification_status', 'Under Review');

    const updated = documents.map((d) =>
      d.verificationStatus !== 'Verified' ? { ...d, uploadStatus: 'Under Review' as const, verificationStatus: 'Under Review' as const } : d
    );
    updateDocs(updated);

    setFeedback({ type: 'success', message: 'Company verification dossier submitted! Your status is now Under Review.' });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Filter Calculation
  const filteredDocs = documents.filter((d) => {
    if (docFilter === 'Verified') return d.verificationStatus === 'Verified';
    if (docFilter === 'Under Review') return d.verificationStatus === 'Under Review';
    if (docFilter === 'Rejected') return d.verificationStatus === 'Rejected';
    if (docFilter === 'Not Uploaded') return d.verificationStatus === 'Not Uploaded';
    return true;
  });

  // 5 Summary Metrics Counts
  const submittedCount = documents.filter((d) => d.fileName).length;
  const underReviewCount = documents.filter((d) => d.verificationStatus === 'Under Review').length;
  const verifiedCount = documents.filter((d) => d.verificationStatus === 'Verified').length;
  const rejectedCount = documents.filter((d) => d.verificationStatus === 'Rejected').length;

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <CompanySidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <CompanyHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Company Verification"
          subtitle="Manage your company verification status and compliance documentation."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-6xl w-full mx-auto pb-safe">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
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
                <h2 className="text-xl font-extrabold text-[#0f172a]">Company Compliance Verification</h2>
                <p className="text-xs text-[#64748b]">
                  Verify enterprise identity to enable direct student recruitment & placement drives
                </p>
              </div>
            </div>

            {/* Verification Status Badge */}
            <div className="flex items-center space-x-2 shrink-0">
              {overallStatus === 'Verified' && (
                <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black shadow-2xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified</span>
                </span>
              )}
              {overallStatus === 'Under Review' && (
                <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-black shadow-2xs">
                  <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                  <span>Under Review</span>
                </span>
              )}
              {overallStatus === 'Rejected' && (
                <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-black shadow-2xs">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Rejected</span>
                </span>
              )}
              {overallStatus === 'Not Submitted' && (
                <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-black shadow-2xs">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>Not Submitted</span>
                </span>
              )}
            </div>
          </div>

          {/* Feedback Toast */}
          {feedback && (
            <div
              className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center space-x-2 animate-in fade-in duration-150 text-left ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Dedicated Rejection Alert Card: "Verification Requires Attention" */}
          {overallStatus === 'Rejected' && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-left space-y-3">
              <div className="flex items-center space-x-2 text-rose-800">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                <h3 className="text-sm font-extrabold">Verification Requires Attention</h3>
              </div>
              <p className="text-xs text-rose-700 leading-relaxed font-medium">
                Rejection Reason: Your GST Certificate image was blurry and unreadable. Please upload a clear document.
              </p>
              <button
                type="button"
                onClick={() => handleSummaryCardClick('Rejected')}
                className="inline-flex items-center space-x-1 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Replace Document</span>
              </button>
            </div>
          )}

          {/* 5 Clickable Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-left">
            {[
              { label: 'Verification Status', value: overallStatus, key: 'All', color: 'border-blue-500 text-[#2563eb] bg-blue-50/20' },
              { label: 'Submitted', value: `${submittedCount}/${documents.length}`, key: 'All', color: 'border-indigo-500 text-indigo-700 bg-indigo-50/20' },
              { label: 'Under Review', value: `${underReviewCount}`, key: 'Under Review', color: 'border-amber-500 text-amber-700 bg-amber-50/20' },
              { label: 'Verified', value: `${verifiedCount}`, key: 'Verified', color: 'border-emerald-500 text-emerald-700 bg-emerald-50/20' },
              { label: 'Rejected', value: `${rejectedCount}`, key: 'Rejected', color: 'border-rose-500 text-rose-700 bg-rose-50/20' },
            ].map((card) => (
              <div
                key={card.label}
                onClick={() => handleSummaryCardClick(card.key)}
                className={`bg-white border rounded-2xl p-4 shadow-2xs space-y-1 cursor-pointer transition-all duration-150 transform hover:-translate-y-0.5 ${
                  docFilter === card.key
                    ? `${card.color} ring-2 ring-blue-500/20 font-bold`
                    : 'border-[#e2e8f0] hover:border-slate-300'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block truncate">
                  {card.label}
                </span>
                <p className="text-xl font-black text-[#0f172a] truncate">{card.value}</p>
              </div>
            ))}
          </div>

          {/* Section: Company Information Details */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-[#2563eb]" />
                <h3 className="text-sm font-extrabold text-[#0f172a]">Company Information</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingInfo(true)}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-[#2563eb] text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Information</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-medium">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Company Name</span>
                <strong className="text-slate-900">{companyInfo.name}</strong>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Official Email</span>
                <strong className="text-slate-900">{companyInfo.email}</strong>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Company Website</span>
                <a href={companyInfo.website} target="_blank" rel="noreferrer" className="text-[#2563eb] font-bold underline">
                  {companyInfo.website}
                </a>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Industry</span>
                <strong className="text-slate-900">{companyInfo.industry}</strong>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Company Location</span>
                <strong className="text-slate-900">{companyInfo.location}</strong>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Registration / CIN</span>
                <strong className="text-slate-900">{companyInfo.registrationId}</strong>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Submitted Date</span>
                <strong className="text-slate-800">{submittedDate}</strong>
              </div>

              {verifiedDate && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Verified Date</span>
                  <strong className="text-emerald-700 font-extrabold">{verifiedDate}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Section: Verification Timeline */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4 text-left">
            <h3 className="text-sm font-extrabold text-[#0f172a] border-b border-slate-100 pb-3">
              Verification Workflow Timeline
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative text-xs">
              <div className={`p-4 rounded-xl border space-y-1 ${submittedCount === 0 ? 'bg-slate-50 border-slate-200' : 'bg-blue-50/60 border-blue-200'}`}>
                <div className="flex items-center space-x-1.5 font-bold">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>1. Documents Not Submitted</span>
                </div>
                <p className="text-[11px] text-slate-500">Initial Setup</p>
              </div>

              <div className={`p-4 rounded-xl border space-y-1 ${submittedCount > 0 ? 'bg-blue-50/60 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center space-x-1.5 font-bold">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>2. Documents Submitted</span>
                </div>
                <p className="text-[11px] text-slate-500">{submittedDate}</p>
              </div>

              <div className={`p-4 rounded-xl border space-y-1 ${overallStatus === 'Under Review' ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center space-x-1.5 font-bold">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>3. Under Review</span>
                </div>
                <p className="text-[11px] text-slate-500">Compliance Audit</p>
              </div>

              <div className={`p-4 rounded-xl border space-y-1 ${overallStatus === 'Verified' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center space-x-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>4. Verified / Rejected</span>
                </div>
                <p className="text-[11px] text-slate-500">{verifiedDate || 'Pending'}</p>
              </div>
            </div>
          </div>

          {/* Section: Required Documents List */}
          <div
            ref={docListRef}
            id="required-documents-section"
            className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-5 text-left scroll-mt-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-[#0f172a]">Required Compliance Documents</h3>
                <p className="text-xs text-[#64748b]">Upload valid PDF/Image certificates for automated verification</p>
              </div>

              {/* Document Status Filter Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto">
                <Filter className="w-4 h-4 text-[#2563eb] shrink-0 mr-1" />
                {(['All', 'Approved', 'Pending', 'Rejected'] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setDocFilter(filter)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                      docFilter === filter
                        ? 'bg-[#2563eb] text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Document Cards List */}
            <div className="space-y-4">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/40 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-200 transition-all"
                >
                  {/* Left Metadata */}
                  <div className="flex items-start space-x-3.5 min-w-0 flex-1">
                    <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs shrink-0 mt-0.5">
                      <FileText className="w-5 h-5 text-[#2563eb]" />
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <h4 className="text-sm font-bold text-[#0f172a]">{doc.name}</h4>
                        <span
                          className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${
                            doc.verificationStatus === 'Verified'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : doc.verificationStatus === 'Under Review'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : doc.verificationStatus === 'Rejected'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {doc.verificationStatus}
                        </span>
                      </div>

                      {doc.fileName ? (
                        <p className="text-xs text-slate-600 font-medium truncate">
                          File: <strong className="text-slate-900">{doc.fileName}</strong> ({doc.fileSize}) • Uploaded {doc.uploadedDate}
                        </p>
                      ) : (
                        <p className="text-xs text-slate-400 font-medium">No document uploaded yet</p>
                      )}

                      {doc.rejectionReason && (
                        <p className="text-xs font-semibold text-rose-700 pt-1">
                          Rejection Reason: {doc.rejectionReason}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="flex items-center space-x-2 shrink-0 border-t md:border-0 pt-3 md:pt-0 border-slate-200/60">
                    {doc.fileName && (
                      <>
                        <button
                          type="button"
                          onClick={() => setViewingDoc(doc)}
                          className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                          title="View Document"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownloadDoc(doc)}
                          className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                          title="Download Document"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    <label className="inline-flex items-center space-x-1 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#2563eb] text-xs font-semibold transition-colors cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{doc.fileName ? 'Replace' : 'Upload'}</span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(doc.id, e)}
                        className="hidden"
                      />
                    </label>

                    {doc.fileName && (
                      <button
                        type="button"
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-semibold cursor-pointer"
                        title="Delete Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Submit for Verification Button */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={handleSubmitForVerification}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit for Verification</span>
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Edit Company Info Modal */}
      {isEditingInfo && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-xl text-left space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#0f172a]">Edit Company Legal Details</h3>
              <button
                type="button"
                onClick={() => setIsEditingInfo(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsEditingInfo(false);
                setFeedback({ type: 'success', message: 'Company legal details updated successfully.' });
                setTimeout(() => setFeedback(null), 3000);
              }}
              className="space-y-3 text-xs font-medium"
            >
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">Legal Name</label>
                <input
                  type="text"
                  value={companyInfo.name}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563eb]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">Official Email</label>
                <input
                  type="email"
                  value={companyInfo.email}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563eb]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">Registration ID / CIN</label>
                <input
                  type="text"
                  value={companyInfo.registrationId}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, registrationId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563eb]"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditingInfo(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 w-full max-w-xl shadow-xl text-left space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0f172a]">{viewingDoc.name}</h3>
                <p className="text-xs text-slate-500">{viewingDoc.fileName}</p>
              </div>
              <button
                type="button"
                onClick={() => setViewingDoc(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Preview Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3 text-xs text-slate-800 text-center">
              {viewingDoc.fileDataUrl && viewingDoc.fileDataUrl.startsWith('data:image') ? (
                <img src={viewingDoc.fileDataUrl} alt={viewingDoc.name} className="max-h-80 mx-auto rounded-xl shadow-2xs object-contain" />
              ) : (
                <div className="py-8 space-y-2">
                  <FileText className="w-12 h-12 text-[#2563eb] mx-auto" />
                  <p className="font-bold text-slate-900">{viewingDoc.fileName}</p>
                  <p className="text-slate-500 text-[11px]">PDF Document • Verified by InternIQ T&P Compliance Board</p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => handleDownloadDoc(viewingDoc)}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download File</span>
              </button>
              <button
                type="button"
                onClick={() => setViewingDoc(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
