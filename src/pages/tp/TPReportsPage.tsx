import React, { useState } from 'react';
import { TPSidebar } from '../../components/tp/TPSidebar';
import { TPHeader } from '../../components/tp/TPHeader';
import { PieChart, Download, FileSpreadsheet } from 'lucide-react';

export const TPReportsPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [reportType, setReportType] = useState('Student Placement Report');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleExport = (fmt: 'CSV' | 'PDF') => {
    setToastMsg(`Generated ${reportType} (${fmt}). Download started.`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <TPSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <TPHeader onOpenSidebar={() => setIsSidebarOpen(true)} title="T&P Reports & Analytics" subtitle="Generate campus hiring reports and placement analytics." />
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto text-left">
          {toastMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl">
              {toastMsg}
            </div>
          )}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2 bg-slate-50 border px-3 py-2 rounded-xl text-xs">
                <PieChart className="w-4 h-4 text-[#2563eb]" />
                <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="bg-transparent font-bold text-slate-800 focus:outline-none">
                  <option value="Student Placement Report">Student Placement Report</option>
                  <option value="Company Hiring Report">Company Hiring Report</option>
                  <option value="Internship Report">Internship Report</option>
                  <option value="Application Report">Application Report</option>
                  <option value="Selection Report">Selection Report</option>
                  <option value="Placement Rate Report">Placement Rate Report</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button type="button" onClick={() => handleExport('CSV')} className="px-3 py-1.5 border hover:bg-slate-50 text-xs font-bold rounded-xl cursor-pointer inline-flex items-center space-x-1">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Export CSV</span>
                </button>
                <button type="button" onClick={() => handleExport('PDF')} className="px-3 py-1.5 bg-[#2563eb] text-white hover:bg-blue-700 text-xs font-bold rounded-xl shadow-2xs cursor-pointer inline-flex items-center space-x-1">
                  <Download className="w-3.5 h-3.5" />
                  <span>Export PDF</span>
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-500">Live dataset reports generated dynamically from master centralized records.</p>
          </div>
        </main>
      </div>
    </div>
  );
};
