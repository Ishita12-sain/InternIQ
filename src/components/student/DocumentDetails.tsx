import React from 'react';
import { FileText, CheckCircle2, Clock, AlertTriangle, Eye, Download, Trash2 } from 'lucide-react';
import type { DocumentItem } from './DocumentCard';

interface DocumentDetailsProps {
  document: DocumentItem | null;
  onView: (doc: DocumentItem) => void;
  onDownload: (doc: DocumentItem) => void;
  onDelete: (id: string) => void;
}

export const DocumentDetails: React.FC<DocumentDetailsProps> = ({
  document,
  onView,
  onDownload,
  onDelete,
}) => {
  if (!document) return null;

  const getStatusBadge = (status: DocumentItem['status']) => {
    switch (status) {
      case 'Verified':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified</span>
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Pending Verification</span>
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Rejected</span>
          </span>
        );
    }
  };

  return (
    <div
      id="document-details-section"
      className="bg-white border border-[#e2e8f0] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5 text-left scroll-mt-24"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-start space-x-2.5 min-w-0 flex-1 w-full">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-[#2563eb] flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1 text-left">
            <h3 className="text-base font-bold text-[#0f172a] break-words leading-tight">
              {document.name}
            </h3>
            <p className="text-xs text-[#64748b]">Document Details</p>
          </div>
        </div>
        <div className="shrink-0 self-start sm:self-auto">
          {getStatusBadge(document.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs font-medium">
        <div>
          <span className="text-slate-400 block mb-0.5">Document Type</span>
          <strong className="text-slate-900 text-sm font-bold">{document.type}</strong>
        </div>
        <div>
          <span className="text-slate-400 block mb-0.5">Uploaded Date</span>
          <strong className="text-slate-900 text-sm font-bold">{document.uploadedDate}</strong>
        </div>
        <div>
          <span className="text-slate-400 block mb-0.5">File Format & Size</span>
          <strong className="text-[#2563eb] text-sm font-bold">
            {document.fileType} • {document.size}
          </strong>
        </div>
        <div>
          <span className="text-slate-400 block mb-0.5">Uploaded By</span>
          <strong className="text-slate-900 text-sm font-bold">{document.uploadedBy}</strong>
        </div>
      </div>

      {/* Available Actions */}
      <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
        <span className="font-bold text-[#0f172a] uppercase tracking-wider block text-left">
          Available Actions:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
          <button
            type="button"
            onClick={() => onView(document)}
            className="w-full min-h-[44px] inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            <Eye className="w-4 h-4 text-slate-600 shrink-0" />
            <span>View Preview</span>
          </button>
          <button
            type="button"
            onClick={() => onDownload(document)}
            className="w-full min-h-[44px] inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white font-semibold shadow-2xs cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            <Download className="w-4 h-4 shrink-0" />
            <span>Download File</span>
          </button>
          <button
            type="button"
            onClick={() => onDelete(document.id)}
            className="w-full min-h-[44px] inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/30"
          >
            <Trash2 className="w-4 h-4 shrink-0" />
            <span>Delete Document</span>
          </button>
        </div>
      </div>
    </div>
  );
};
