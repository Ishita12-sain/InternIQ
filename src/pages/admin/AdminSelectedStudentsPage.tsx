import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { mockSelectedStudents } from '../../types/adminTypes';
import { ArrowLeft, Search } from 'lucide-react';

export const AdminSelectedStudentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [joiningFilter, setJoiningFilter] = useState<string>('All');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const filteredSelections = mockSelectedStudents.filter((sel) => {
    const matchesSearch = sel.studentName.toLowerCase().includes(search.toLowerCase()) || sel.companyName.toLowerCase().includes(search.toLowerCase()) || sel.internshipTitle.toLowerCase().includes(search.toLowerCase());
    const matchesJoining = joiningFilter === 'All' || sel.joiningStatus === joiningFilter;
    return matchesSearch && matchesJoining;
  });

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onOpenSidebar={() => setIsSidebarOpen(true)} title="Selected Candidates" subtitle="Track official placement offers, candidate acceptances, and joining dates." />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto pb-safe text-left">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                navigate('/admin/dashboard');
              }}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-xl font-extrabold text-[#0f172a]">Selected Candidates</h2>
              <p className="text-xs text-slate-500">312 total successful placement selections</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-500">Total Selected</span>
              <p className="text-2xl font-black text-[#0f172a]">312</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-500">Joined</span>
              <p className="text-2xl font-black text-emerald-600">280</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-500">Pending Docs</span>
              <p className="text-2xl font-black text-amber-600">22</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-500">Scheduled</span>
              <p className="text-2xl font-black text-blue-600">10</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search candidate, company, internship..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#2563eb]"
              />
            </div>
            <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
              {['All', 'Joined', 'Pending Docs', 'Scheduled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setJoiningFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer ${
                    joiningFilter === st ? 'bg-[#2563eb] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs font-medium border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">Internship Position</th>
                    <th className="py-3 px-4">Selection Date</th>
                    <th className="py-3 px-4">Offer Status</th>
                    <th className="py-3 px-4">Joining Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSelections.map((sel) => (
                    <tr key={sel.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-bold text-[#0f172a]">{sel.studentName}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">{sel.companyName}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-600">{sel.internshipTitle}</td>
                      <td className="py-3.5 px-4 text-slate-500">{sel.selectionDate}</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-600">{sel.offerStatus}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          sel.joiningStatus === 'Joined' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {sel.joiningStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => navigate('/student/profile')}
                          className="px-3 py-1.5 bg-[#2563eb] text-white rounded-xl text-xs font-semibold hover:bg-blue-700 cursor-pointer"
                        >
                          View Candidate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 gap-3 md:hidden">
              {filteredSelections.map((sel) => (
                <div key={sel.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#0f172a]">{sel.studentName}</span>
                    <span className="text-emerald-700 font-bold">{sel.joiningStatus}</span>
                  </div>
                  <p className="text-slate-500">{sel.companyName} • {sel.internshipTitle}</p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-semibold text-slate-600">Selected: {sel.selectionDate}</span>
                    <button
                      onClick={() => navigate('/student/profile')}
                      className="px-3 py-1 bg-[#2563eb] text-white rounded-lg text-xs font-semibold"
                    >
                      View Candidate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
