import React from 'react';
import { FileText, Eye, Download, Upload } from 'lucide-react';

export const ResumeSection: React.FC = () => {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4 text-left">
      <h3 className="text-base font-bold text-[#0f172a]">Resume</h3>

      <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-[#2563eb]">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#0f172a]">Aarav_Sharma_Resume.pdf</p>
            <p className="text-[11px] text-[#64748b]">Uploaded 2 weeks ago • 1.2 MB</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => alert("Previewing Resume.pdf")}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View</span>
          </button>
          <button
            onClick={() => alert("Downloading Resume.pdf")}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
          <button
            onClick={() => alert("Upload Resume dialog triggered")}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload New</span>
          </button>
        </div>
      </div>
    </div>
  );
};
