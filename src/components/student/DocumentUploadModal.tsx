import React, { useState } from 'react';
import { X, Upload, FileText } from 'lucide-react';
import type { DocumentType } from './DocumentCard';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (doc: { name: string; type: DocumentType; fileType: string; size: string }) => void;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
}) => {
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState<DocumentType>('Resume');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const docTypes: DocumentType[] = [
    'Resume',
    'Offer Letter',
    'Joining Letter',
    'NOC',
    'Internship Certificate',
    'Other',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) {
      setError('Please provide a document name.');
      return;
    }

    const fileType = selectedFile ? selectedFile.name.split('.').pop()?.toUpperCase() || 'PDF' : 'PDF';
    const size = selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : '1.2 MB';

    onUpload({
      name: docName.trim(),
      type: docType,
      fileType,
      size,
    });

    setDocName('');
    setDocType('Resume');
    setSelectedFile(null);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-xl relative text-left space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-[#2563eb]" />
            <h3 className="text-base font-bold text-[#0f172a]">Upload Document</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-semibold">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="upload-doc-name" className="block font-bold text-slate-700">
              Document Name *
            </label>
            <input
              id="upload-doc-name"
              type="text"
              placeholder="e.g. Google_Offer_Letter_2026"
              value={docName}
              onChange={(e) => {
                setDocName(e.target.value);
                setError('');
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563eb]"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="upload-doc-type" className="block font-bold text-slate-700">
              Document Type *
            </label>
            <select
              id="upload-doc-type"
              value={docType}
              onChange={(e) => setDocType(e.target.value as DocumentType)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563eb]"
            >
              {docTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label htmlFor="upload-file-input" className="block font-bold text-slate-700">
              Select File (PDF, DOCX, PNG)
            </label>
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-blue-300 transition-colors bg-slate-50/50">
              <input
                id="upload-file-input"
                type="file"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              <label htmlFor="upload-file-input" className="cursor-pointer space-y-1 block">
                <FileText className="w-8 h-8 text-[#2563eb] mx-auto opacity-80" />
                <p className="font-semibold text-slate-700">
                  {selectedFile ? selectedFile.name : 'Click to browse file'}
                </p>
                <p className="text-[11px] text-slate-400">Max file size: 10 MB</p>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white font-semibold shadow-2xs cursor-pointer"
            >
              Upload Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
