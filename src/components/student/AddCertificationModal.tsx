import React, { useState, useRef } from 'react';
import { X, Upload, FileText, Trash2, Info } from 'lucide-react';
import type { CertificationItem } from '../../types/studentProfile';

interface AddCertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cert: CertificationItem) => void;
  editingCert?: CertificationItem | null;
}

export const AddCertificationModal: React.FC<AddCertificationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingCert,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(editingCert?.name || '');
  const [issuer, setIssuer] = useState(editingCert?.issuer || '');
  const [issueDate, setIssueDate] = useState(editingCert?.issueDate || '');
  const [expiryDate, setExpiryDate] = useState(editingCert?.expiryDate || '');
  const [credentialId, setCredentialId] = useState(editingCert?.credentialId || '');
  const [credentialUrl, setCredentialUrl] = useState(editingCert?.credentialUrl || '');
  const [description, setDescription] = useState(editingCert?.description || '');

  const [proofFile, setProofFile] = useState<string | undefined>(editingCert?.proofFile);
  const [proofFileName, setProofFileName] = useState<string | undefined>(editingCert?.proofFileName);
  const [proofFileType, setProofFileType] = useState<string | undefined>(editingCert?.proofFileType);
  const [proofFileSize, setProofFileSize] = useState<number | undefined>(editingCert?.proofFileSize);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  const handleFileSelect = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        proofFile: 'Invalid file type. Please upload JPG, PNG, or PDF file.',
      }));
      return;
    }

    // Max 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        proofFile: 'File size exceeds 10 MB limit.',
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setProofFile(e.target?.result as string);
      setProofFileName(file.name);
      setProofFileType(file.type);
      setProofFileSize(file.size);
      setErrors((prev) => {
        const next = { ...prev };
        delete next.proofFile;
        return next;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Certification Name is required';
    if (!issuer.trim()) newErrors.issuer = 'Issuing Organization is required';
    if (!issueDate) newErrors.issueDate = 'Issue Date is required';
    if (!proofFile) newErrors.proofFile = 'Certificate proof document is required';

    if (credentialUrl.trim() && !/^https?:\/\/.+/i.test(credentialUrl.trim())) {
      newErrors.credentialUrl = 'Enter a valid URL starting with http:// or https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const certData: CertificationItem = {
        id: editingCert?.id || String(Date.now()),
        name: name.trim(),
        issuer: issuer.trim(),
        issueDate,
        expiryDate: expiryDate || undefined,
        credentialId: credentialId.trim() || undefined,
        credentialUrl: credentialUrl.trim() || undefined,
        description: description.trim() || undefined,
        proofFile,
        proofFileName,
        proofFileType,
        proofFileSize,
        verificationStatus: editingCert?.verificationStatus || 'pending',
        createdAt: editingCert?.createdAt || new Date().toISOString(),
      };

      onSave(certData);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 text-left">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {editingCert ? 'Edit Certification' : 'Add New Certification'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload official certificate evidence to verify your skill credentials.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verification Info Banner */}
        <div className="mx-6 mt-4 p-3 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-start space-x-3 text-amber-900 text-xs">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-amber-950">Verification Workflow Notice:</span> Uploaded certificate evidence will be reviewed by Faculty / T&P Officer before being marked as Verified.
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Certification Name */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700">
                Certification Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. AWS Certified Solutions Architect"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                  errors.name ? 'border-rose-500 bg-rose-50/20 focus:ring-2 focus:ring-rose-500/20' : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20'
                }`}
              />
              {errors.name && <p className="text-xs text-rose-600 font-medium">{errors.name}</p>}
            </div>

            {/* Issuing Organization */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Issuing Organization <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Amazon Web Services, Meta, Coursera"
                value={issuer}
                onChange={(e) => {
                  setIssuer(e.target.value);
                  if (errors.issuer) setErrors((prev) => ({ ...prev, issuer: '' }));
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                  errors.issuer ? 'border-rose-500 bg-rose-50/20 focus:ring-2 focus:ring-rose-500/20' : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20'
                }`}
              />
              {errors.issuer && <p className="text-xs text-rose-600 font-medium">{errors.issuer}</p>}
            </div>

            {/* Issue Date */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Issue Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => {
                  setIssueDate(e.target.value);
                  if (errors.issueDate) setErrors((prev) => ({ ...prev, issueDate: '' }));
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                  errors.issueDate ? 'border-rose-500 bg-rose-50/20 focus:ring-2 focus:ring-rose-500/20' : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20'
                }`}
              />
              {errors.issueDate && <p className="text-xs text-rose-600 font-medium">{errors.issueDate}</p>}
            </div>

            {/* Expiry Date */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Expiry Date <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Credential ID */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Credential ID <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. AWS-SEC-948102"
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Credential URL */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700">
                Credential Verification URL <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="url"
                placeholder="https://www.credly.com/badges/your-badge-id"
                value={credentialUrl}
                onChange={(e) => {
                  setCredentialUrl(e.target.value);
                  if (errors.credentialUrl) setErrors((prev) => ({ ...prev, credentialUrl: '' }));
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                  errors.credentialUrl ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20'
                }`}
              />
              {errors.credentialUrl && <p className="text-xs text-rose-600 font-medium">{errors.credentialUrl}</p>}
            </div>
          </div>

          {/* Certificate Proof Upload Area */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-slate-700">
              Certificate Proof / Document <span className="text-rose-500">*</span>
            </label>

            {!proofFile ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  isDragging ? 'border-blue-500 bg-blue-50/50 scale-[0.99]' : errors.proofFile ? 'border-rose-300 bg-rose-50/30 hover:bg-rose-50/50' : 'border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelect(e.target.files[0]);
                    }
                  }}
                />
                <div className="flex flex-col items-center space-y-2">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Drag & drop certificate proof or <span className="text-blue-600 hover:underline">browse files</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Supports JPG, PNG or PDF (Max 10 MB)
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-3 truncate">
                  {proofFileType?.startsWith('image/') ? (
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-white">
                      <img src={proofFile} alt="Certificate Proof Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="p-3 bg-rose-50 text-rose-600 rounded-xl shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                  )}

                  <div className="truncate text-left">
                    <p className="text-xs font-bold text-slate-900 truncate">{proofFileName || 'Uploaded_Certificate_Proof'}</p>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="uppercase font-semibold">{proofFileType?.split('/')[1] || 'DOC'}</span>
                      <span>•</span>
                      <span>{formatFileSize(proofFileSize)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (proofFile) {
                        const win = window.open();
                        win?.document.write(`<iframe src="${proofFile}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
                      }
                    }}
                    className="px-2.5 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                  >
                    Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProofFile(undefined);
                      setProofFileName(undefined);
                      setProofFileType(undefined);
                      setProofFileSize(undefined);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Remove File"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
            {errors.proofFile && <p className="text-xs text-rose-600 font-medium">{errors.proofFile}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Description / Key Skills Certified <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="Briefly describe what competencies were assessed..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50 inline-flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{editingCert ? 'Update Certification' : 'Submit Certification'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
