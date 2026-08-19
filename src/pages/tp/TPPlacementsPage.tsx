import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TPSidebar } from '../../components/tp/TPSidebar';
import { TPHeader } from '../../components/tp/TPHeader';
import { mockAdminStudents, mockAdminCompanies, mockAdminInternships } from '../../types/adminTypes';
import { ArrowLeft } from 'lucide-react';

export const TPPlacementsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const placements = [
    {
      id: 'plc-1',
      student: mockAdminStudents[0].name,
      company: mockAdminCompanies[0].name,
      internship: mockAdminInternships[0].title,
      selectionDate: '15 Aug 2026',
      joiningDate: '01 Sep 2026',
      status: 'Joining Soon',
      stipend: '₹45,000 / month',
    },
    {
      id: 'plc-2',
      student: mockAdminStudents[1].name,
      company: mockAdminCompanies[1].name,
      internship: mockAdminInternships[1].title,
      selectionDate: '10 Aug 2026',
      joiningDate: '15 Aug 2026',
      status: 'Ongoing',
      stipend: '₹38,000 / month',
    },
    {
      id: 'plc-3',
      student: mockAdminStudents[2].name,
      company: mockAdminCompanies[2].name,
      internship: mockAdminInternships[2].title,
      selectionDate: '01 Aug 2026',
      joiningDate: '05 Aug 2026',
      status: 'Completed',
      stipend: '₹50,000 / month',
    },
  ];

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <TPSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <TPHeader onOpenSidebar={() => setIsSidebarOpen(true)} title="Placement Management" subtitle="Track candidate offer acceptance, joining dates, and completion timelines." />
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto text-left">
          <div className="bg-white border border-[#e2e8f0] rounded-3xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Student</th>
                    <th className="py-3.5 px-4">Company</th>
                    <th className="py-3.5 px-4">Internship Role</th>
                    <th className="py-3.5 px-4">Selection Date</th>
                    <th className="py-3.5 px-4">Joining Date</th>
                    <th className="py-3.5 px-4 font-bold text-emerald-600">Stipend</th>
                    <th className="py-3.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {placements.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4">
                        <button type="button" onClick={() => navigate(`/tp/placements/${p.id}`)} className="font-bold text-[#0f172a] hover:text-[#2563eb] text-left cursor-pointer">
                          {p.student}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{p.company}</td>
                      <td className="py-3.5 px-4 text-slate-600">{p.internship}</td>
                      <td className="py-3.5 px-4 text-slate-500">{p.selectionDate}</td>
                      <td className="py-3.5 px-4 text-slate-500">{p.joiningDate}</td>
                      <td className="py-3.5 px-4 font-black text-emerald-600">{p.stipend}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {p.status}
                        </span>
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

export const TPPlacementDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <TPHeader onOpenSidebar={() => {}} title="Placement Record & Timeline" subtitle="Detailed joining timeline and progress tracker." />
      <main className="p-6 max-w-4xl mx-auto w-full text-left space-y-4">
        <button type="button" onClick={() => navigate('/tp/placements')} className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-[#2563eb] cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Placement Management</span>
        </button>
        <div className="bg-white border rounded-3xl p-6 space-y-4">
          <h2 className="text-xl font-extrabold text-[#0f172a]">Placement Record #{id || 'PLC-101'}</h2>
          <div className="p-4 bg-slate-50 rounded-2xl space-y-3 text-xs">
            <p className="font-bold text-[#0f172a]">Timeline Flow:</p>
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 border-t pt-2">
              <span className="text-emerald-600">Selected ✓</span>
              <span>↓</span>
              <span className="text-blue-600">Joining Soon</span>
              <span>↓</span>
              <span>Internship Started</span>
              <span>↓</span>
              <span>Completed</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
