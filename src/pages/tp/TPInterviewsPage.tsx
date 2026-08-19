import React, { useState } from 'react';
import { TPSidebar } from '../../components/tp/TPSidebar';
import { TPHeader } from '../../components/tp/TPHeader';
import { mockAdminApplications } from '../../types/adminTypes';
import { CheckCircle2 } from 'lucide-react';

export const TPInterviewsPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [interviews, setInterviews] = useState([
    {
      id: 'iv-1',
      student: mockAdminApplications[0].candidateName,
      company: mockAdminApplications[0].companyName,
      internship: mockAdminApplications[0].internshipTitle,
      date: '21 Aug 2026',
      time: '10:30 AM',
      type: 'Technical Round 1',
      status: 'Scheduled',
    },
    {
      id: 'iv-2',
      student: mockAdminApplications[1].candidateName,
      company: mockAdminApplications[1].companyName,
      internship: mockAdminApplications[1].internshipTitle,
      date: '22 Aug 2026',
      time: '02:00 PM',
      type: 'HR Interview',
      status: 'Scheduled',
    },
    {
      id: 'iv-3',
      student: mockAdminApplications[2].candidateName,
      company: mockAdminApplications[2].companyName,
      internship: mockAdminApplications[2].internshipTitle,
      date: '20 Aug 2026',
      time: '11:00 AM',
      type: 'Technical Round 2',
      status: 'Completed',
    },
  ]);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleMarkCompleted = (id: string) => {
    setInterviews((prev) => prev.map((i) => (i.id === id ? { ...i, status: 'Completed' } : i)));
    triggerToast('Interview marked as Completed.');
  };

  const handleCancel = (id: string) => {
    setInterviews((prev) => prev.map((i) => (i.id === id ? { ...i, status: 'Cancelled' } : i)));
    triggerToast('Interview cancelled successfully.');
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <TPSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <TPHeader onOpenSidebar={() => setIsSidebarOpen(true)} title="Placement Interviews" subtitle="Schedule, track, and monitor candidate interview rounds." />
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto text-left">
          {toastMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMsg}</span>
            </div>
          )}

          <div className="bg-white border border-[#e2e8f0] rounded-3xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Student</th>
                    <th className="py-3.5 px-4">Company</th>
                    <th className="py-3.5 px-4">Internship</th>
                    <th className="py-3.5 px-4">Date & Time</th>
                    <th className="py-3.5 px-4">Round Type</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {interviews.map((iv) => (
                    <tr key={iv.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#0f172a]">{iv.student}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{iv.company}</td>
                      <td className="py-3.5 px-4 text-slate-600">{iv.internship}</td>
                      <td className="py-3.5 px-4 text-slate-500 font-semibold">{iv.date} • {iv.time}</td>
                      <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold">{iv.type}</span></td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${iv.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : iv.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                          {iv.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1">
                        {iv.status === 'Scheduled' && (
                          <>
                            <button type="button" onClick={() => handleMarkCompleted(iv.id)} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[10px] rounded-lg cursor-pointer">
                              Mark Completed
                            </button>
                            <button type="button" onClick={() => handleCancel(iv.id)} className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-[10px] rounded-lg cursor-pointer">
                              Cancel
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
