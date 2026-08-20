import React, { useState, useRef } from 'react';
import { FileText, Eye, Download, Upload, RefreshCw, Trash2, X, AlertCircle, CheckCircle2 } from 'lucide-react';

export interface SavedResumeData {
  fileName: string;
  fileType: string;
  fileSize: string;
  uploadDate: string;
  fileDataUrl: string;
}

export const ResumeSection: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const [resume, setResume] = useState<SavedResumeData | null>(() => {
    const saved = localStorage.getItem('interniq_student_resume');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        return null;
      }
    }
    // Default initial mock resume if none uploaded yet
    return {
      fileName: 'Aarav_Sharma_Resume.pdf',
      fileType: 'PDF Document',
      fileSize: '1.2 MB',
      uploadDate: '15 Aug 2026',
      fileDataUrl: 'data:application/pdf;base64,JVBERi0xLjQK',
    };
  });

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  const processPdfFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      showFeedback('error', 'Only PDF files are allowed.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showFeedback('error', 'File size exceeds 10 MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        const sizeFormatted =
          file.size >= 1024 * 1024
            ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
            : `${Math.round(file.size / 1024)} KB`;

        const newResume: SavedResumeData = {
          fileName: file.name,
          fileType: 'PDF Document',
          fileSize: sizeFormatted,
          uploadDate: new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
          fileDataUrl: reader.result,
        };

        setResume(newResume);
        localStorage.setItem('interniq_student_resume', JSON.stringify(newResume));
        showFeedback('success', 'Resume uploaded successfully!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processPdfFile(file);
    }
  };

  const handleDelete = () => {
    setResume(null);
    localStorage.removeItem('interniq_student_resume');
    showFeedback('success', 'Resume removed successfully.');
  };

  const handleDownload = () => {
    if (!resume) return;
    const link = document.createElement('a');
    link.href = resume.fileDataUrl;
    link.download = resume.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4 text-left">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-[#0f172a]">Resume</h3>
        <span className="text-xs text-[#64748b] font-medium">PDF Only (Max 10MB)</span>
      </div>

      {/* Inline Feedback Banner */}
      {feedback && (
        <div
          className={`p-3 rounded-xl border text-xs font-semibold flex items-center space-x-2 animate-in fade-in duration-150 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {resume ? (
        <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3 min-w-0 flex-1">
            <div className="p-2.5 rounded-xl bg-blue-50 text-[#2563eb] shrink-0 mt-0.5 sm:mt-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="space-y-0.5 min-w-0 flex-1">
              <p className="text-xs font-bold text-[#0f172a] truncate" title={resume.fileName}>
                {resume.fileName}
              </p>
              <p className="text-[11px] text-[#64748b]">
                {resume.fileType} • {resume.fileSize} • Uploaded {resume.uploadDate}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto justify-start sm:justify-end border-t sm:border-0 pt-3 sm:pt-0 border-slate-200/60">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>

            <button
              type="button"
              onClick={() => replaceInputRef.current?.click()}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-[#2563eb] text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Replace</span>
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>

            <input
              ref={replaceInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      ) : (
        /* Empty Upload State */
        <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-[#2563eb] flex items-center justify-center mx-auto">
            <Upload className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[#0f172a]">No resume uploaded</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Upload your resume in PDF format to showcase your credentials to recruiters.
            </p>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Resume</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}

      {/* PDF Modal Viewer */}
      {isPreviewOpen && resume && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                <FileText className="w-5 h-5 text-[#2563eb] shrink-0" />
                <span className="text-sm font-bold text-[#0f172a] truncate">{resume.fileName}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/60 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal PDF Frame */}
            <div className="flex-1 bg-slate-100 p-2 overflow-hidden">
              <iframe
                src={resume.fileDataUrl}
                title="Resume Preview"
                className="w-full h-full rounded-xl border border-slate-200 bg-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
