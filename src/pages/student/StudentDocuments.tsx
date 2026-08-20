import React, { useState, useMemo } from 'react';
import { StudentSidebar } from '../../components/student/StudentSidebar';
import { DashboardHeader } from '../../components/student/DashboardHeader';
import { DocumentCard } from '../../components/student/DocumentCard';
import type { DocumentItem, VerificationStatus, DocumentType } from '../../components/student/DocumentCard';
import { DocumentDetails } from '../../components/student/DocumentDetails';
import { DocumentUploadModal } from '../../components/student/DocumentUploadModal';
import { Upload, Search, FileX, X } from 'lucide-react';

export const StudentDocuments: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'All' | VerificationStatus>('All');
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);

  // Initial Mock Documents List
  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: 'doc-1',
      name: 'Aarav_Sharma_Resume.pdf',
      type: 'Resume',
      uploadedDate: '10 Aug 2026',
      fileType: 'PDF',
      size: '1.2 MB',
      status: 'Verified',
      uploadedBy: 'Aarav Sharma',
    },
    {
      id: 'doc-2',
      name: 'Google_Offer_Letter.pdf',
      type: 'Offer Letter',
      uploadedDate: '15 Aug 2026',
      fileType: 'PDF',
      size: '850 KB',
      status: 'Pending',
      uploadedBy: 'Aarav Sharma',
    },
    {
      id: 'doc-3',
      name: 'Internship_NOC_College.pdf',
      type: 'NOC',
      uploadedDate: '05 Aug 2026',
      fileType: 'PDF',
      size: '540 KB',
      status: 'Verified',
      uploadedBy: 'Faculty Advisor',
    },
    {
      id: 'doc-4',
      name: 'Infosys_Joining_Letter.pdf',
      type: 'Joining Letter',
      uploadedDate: '01 Aug 2026',
      fileType: 'PDF',
      size: '1.1 MB',
      status: 'Verified',
      uploadedBy: 'Aarav Sharma',
    },
    {
      id: 'doc-5',
      name: 'Previous_Internship_Certificate.pdf',
      type: 'Internship Certificate',
      uploadedDate: '25 Jul 2026',
      fileType: 'PDF',
      size: '2.4 MB',
      status: 'Rejected',
      uploadedBy: 'Aarav Sharma',
    },
  ]);

  const [selectedDocId, setSelectedDocId] = useState<string>('doc-1');

  // Filter Logic
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      if (selectedStatusFilter !== 'All' && doc.status !== selectedStatusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = doc.name.toLowerCase().includes(q);
        const matchType = doc.type.toLowerCase().includes(q);
        return matchName || matchType;
      }
      return true;
    });
  }, [documents, selectedStatusFilter, searchQuery]);

  const selectedDocument = useMemo(() => {
    return documents.find((d) => d.id === selectedDocId) || filteredDocuments[0] || null;
  }, [documents, selectedDocId, filteredDocuments]);

  // Actions
  const handleSelectDocument = (doc: DocumentItem) => {
    setSelectedDocId(doc.id);
    const detailsElem = document.getElementById('document-details-section');
    if (detailsElem) {
      detailsElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleUploadDocument = (newDocData: {
    name: string;
    type: DocumentType;
    fileType: string;
    size: string;
  }) => {
    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      name: newDocData.name.endsWith('.pdf') ? newDocData.name : `${newDocData.name}.pdf`,
      type: newDocData.type,
      uploadedDate: 'Today',
      fileType: newDocData.fileType,
      size: newDocData.size,
      status: 'Pending',
      uploadedBy: 'Aarav Sharma',
    };
    setDocuments((prev) => [newDoc, ...prev]);
    setSelectedDocId(newDoc.id);
  };

  const handleDeleteDocument = (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      if (selectedDocId === id) {
        const remaining = documents.filter((d) => d.id !== id);
        if (remaining.length > 0) setSelectedDocId(remaining[0].id);
      }
    }
  };

  const handleDownload = (doc: DocumentItem) => {
    alert(`Downloading mock file: "${doc.name}" (${doc.size})`);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      {/* Sidebar */}
      <StudentSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader onOpenSidebar={() => setIsSidebarOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto pb-safe">
          {/* Header & Upload CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f172a]">Documents</h1>
              <p className="text-xs sm:text-sm text-[#64748b]">
                Manage your internship documents
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer shrink-0"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Document</span>
            </button>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Search Field */}
              <div className="sm:col-span-2 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search documents by name or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563eb]"
                />
              </div>

              {/* Status Filter Dropdown */}
              <div>
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value as 'All' | VerificationStatus)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563eb]"
                >
                  <option value="All">All Statuses</option>
                  <option value="Verified">Verified</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Documents Grid or Empty State */}
          {filteredDocuments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDocuments.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  isSelected={selectedDocument?.id === doc.id}
                  onSelect={handleSelectDocument}
                  onView={(d) => setPreviewDoc(d)}
                  onDownload={handleDownload}
                  onDelete={handleDeleteDocument}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-12 text-center space-y-4 shadow-2xs">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-[#2563eb] flex items-center justify-center mx-auto">
                <FileX className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#0f172a]">No documents found</h3>
                <p className="text-xs text-[#64748b] max-w-sm mx-auto">
                  No uploaded documents matched your search term or selected status filter.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(true)}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Upload a Document</span>
              </button>
            </div>
          )}

          {/* Selected Document Details Section */}
          <DocumentDetails
            document={selectedDocument}
            onView={(d) => setPreviewDoc(d)}
            onDownload={handleDownload}
            onDelete={handleDeleteDocument}
          />
        </main>
      </div>

      {/* Document Upload Modal */}
      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadDocument}
      />

      {/* Document View Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-xl relative text-left space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#0f172a]">Document Preview</h3>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-2">
              <p className="text-sm font-bold text-[#0f172a]">{previewDoc.name}</p>
              <p className="text-xs text-[#64748b]">
                {previewDoc.type} • {previewDoc.fileType} • {previewDoc.size}
              </p>
              <p className="text-xs text-emerald-600 font-semibold pt-2">
                Mock Document Preview Ready
              </p>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
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
