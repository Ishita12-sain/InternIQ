import React from 'react';
import { FileText, CheckCircle2, Clock, AlertTriangle, Eye, Download, Trash2 } from 'lucide-react';

export type VerificationStatus = 'Verified' | 'Pending' | 'Rejected';
export type DocumentType =
  | 'Resume'
  | 'Offer Letter'
  | 'Joining Letter'
  | 'NOC'
  | 'Internship Certificate'
  | 'Other';

export interface DocumentItem {
  id: string;
  name: string;
  type: DocumentType;
  uploadedDate: string;
  fileType: string;
  size: string;
  status: VerificationStatus;
  uploadedBy: string;
}

interface DocumentCardProps {
  document: DocumentItem;
  isSelected: boolean;
  onSelect: (doc: DocumentItem) => void;
  onView: (doc: DocumentItem) => void;
  onDownload: (doc: DocumentItem) => void;
  onDelete: (id: string) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  isSelected,
  onSelect,
  onView,
  onDownload,
  onDelete,
}) => {
  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'Verified':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Verified</span>
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Pending</span>
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            <span>Rejected</span>
          </span>
        );
    }
  };

  return (
    <div
      onClick={() => onSelect(document)}
      className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer space-y-4 text-left group ${
        isSelected
          ? 'bg-blue-50/40 border-2 border-[#2563eb] shadow-xs'
          : 'bg-white border-[#e2e8f0] hover:border-blue-300 hover:shadow-md'
      }`}
    >
      {/* Top Details & Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3">
        <div className="flex items-start space-x-3 min-w-0 flex-1 w-full">
          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-[#2563eb] flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="space-y-0.5 min-w-0 flex-1 text-left">
            <h3 className="text-sm font-bold text-[#0f172a] group-hover:text-[#2563eb] transition-colors break-words leading-tight">
              {document.name}
            </h3>
            <p className="text-xs text-[#64748b] font-medium">{document.type}</p>
          </div>
        </div>

        <div className="shrink-0 self-start sm:self-auto">
          {getStatusBadge(document.status)}
        </div>
      </div>

      {/* Meta Specs */}
      <div className="flex items-center justify-between text-xs text-[#64748b] pt-1 border-t border-slate-100">
        <span>Uploaded: {document.uploadedDate}</span>
        <span className="font-semibold text-slate-700">
          {document.fileType} • {document.size}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onView(document);
          }}
          className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
          title="View Document"
        >
          <Eye className="w-4 h-4 text-slate-600" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDownload(document);
          }}
          className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#2563eb] text-xs font-semibold cursor-pointer transition-colors"
          title="Download Document"
        >
          <Download className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(document.id);
          }}
          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold cursor-pointer transition-colors"
          title="Delete Document"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
