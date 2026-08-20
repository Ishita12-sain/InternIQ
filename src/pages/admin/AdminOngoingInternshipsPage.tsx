import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { mockOngoingInternships } from '../../types/adminTypes';
import { ArrowLeft, Search } from 'lucide-react';

export const AdminOngoingInternshipsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const filteredOngoing = mockOngoingInternships.filter((ong) => {
    const matchesSearch = ong.studentName.toLowerCase().includes(search.toLowerCase()) || ong.companyName.toLowerCase().includes(search.toLowerCase()) || ong.internshipTitle.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || ong.currentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onOpenSidebar={() => setIsSidebarOpen(true)} title="Ongoing Internships" subtitle="Track active student internship placements, progress logs, and faculty supervision." />

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
              <h2 className="text-xl font-extrabold text-[#0f172a]">Ongoing Placements</h2>
              <p className="text-xs text-slate-500">215 currently active internships</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-500">Total Ongoing</span>
              <p className="text-2xl font-black text-[#0f172a]">215</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-500">On Track</span>
              <p className="text-2xl font-black text-emerald-600">198</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-500">Needs Review</span>
              <p className="text-2xl font-black text-amber-600">12</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-500">Completed</span>
              <p className="text-2xl font-black text-[#2563eb]">5</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search student, company, mentor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#2563eb]"
              />
            </div>
            <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
              {['All', 'On Track', 'Needs Review', 'Completed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer ${
                    statusFilter === st ? 'bg-[#2563eb] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">Internship Position</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Faculty Mentor</th>
                    <th className="py-3 px-4">Progress</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOngoing.map((ong) => (
                    <tr key={ong.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-bold text-[#0f172a]">{ong.studentName}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">{ong.companyName}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-600">{ong.internshipTitle}</td>
                      <td className="py-3.5 px-4 text-slate-500">{ong.startDate} - {ong.endDate}</td>
                      <td className="py-3.5 px-4 text-indigo-700 font-semibold">{ong.facultyMentor}</td>
                      <td className="py-3.5 px-4 font-bold text-[#2563eb]">{ong.progress}%</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          ong.currentStatus === 'On Track' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {ong.currentStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1.5">
                        <button
                          onClick={() => navigate('/company/internships/int-m1')}
                          className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                        >
                          Internship
                        </button>
                        <button
                          onClick={() => navigate('/student/profile')}
                          className="px-2.5 py-1 bg-[#2563eb] text-white rounded-lg text-xs font-semibold hover:bg-blue-700 cursor-pointer"
                        >
                          Student
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 gap-3 md:hidden">
              {filteredOngoing.map((ong) => (
                <div key={ong.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#0f172a]">{ong.studentName}</span>
                    <span className="text-emerald-700 font-bold">{ong.currentStatus}</span>
                  </div>
                  <p className="text-slate-500">{ong.companyName} • {ong.internshipTitle}</p>
                  <p className="text-slate-400">Mentor: {ong.facultyMentor}</p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-semibold text-slate-600">Progress: {ong.progress}%</span>
                    <div className="space-x-1">
                      <button onClick={() => navigate('/company/internships/int-m1')} className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-semibold">Internship</button>
                      <button onClick={() => navigate('/student/profile')} className="px-2 py-1 bg-[#2563eb] text-white rounded text-xs font-semibold">Student</button>
                    </div>
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
