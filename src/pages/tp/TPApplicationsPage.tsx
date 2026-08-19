import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TPSidebar } from '../../components/tp/TPSidebar';
import { TPHeader } from '../../components/tp/TPHeader';
import { mockAdminApplications } from '../../types/adminTypes';
import { Search, Filter, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

export const TPApplicationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredApplications = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return mockAdminApplications.filter((a) => {
      const matchesSearch =
        a.candidateName.toLowerCase().includes(query) ||
        a.companyName.toLowerCase().includes(query) ||
        a.internshipTitle.toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredApplications.length / pageSize));
  const paginatedApps = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredApplications.slice(start, start + pageSize);
  }, [filteredApplications, currentPage, pageSize]);

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <TPSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <TPHeader onOpenSidebar={() => setIsSidebarOpen(true)} title="Student Applications" subtitle="Monitor application statuses across campus drives." />
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto text-left">
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search candidate, company, or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
              />
            </div>
            <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer">
                <option value="All">All Statuses</option>
                <option value="New">New</option>
                <option value="Under Review">Under Review</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview">Interview</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="bg-white border border-[#e2e8f0] rounded-3xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Student</th>
                    <th className="py-3.5 px-4">Internship Role</th>
                    <th className="py-3.5 px-4">Company</th>
                    <th className="py-3.5 px-4">Applied Date</th>
                    <th className="py-3.5 px-4 text-center">Match Score</th>
                    <th className="py-3.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {paginatedApps.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4">
                        <button type="button" onClick={() => navigate(`/tp/applications/${a.id}`)} className="font-bold text-[#0f172a] hover:text-[#2563eb] text-left cursor-pointer">
                          {a.candidateName}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{a.internshipTitle}</td>
                      <td className="py-3.5 px-4 text-slate-600">{a.companyName}</td>
                      <td className="py-3.5 px-4 text-slate-500">{a.appliedDate}</td>
                      <td className="py-3.5 px-4 text-center font-black text-[#2563eb]">{a.matchScore}%</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredApplications.length > pageSize && (
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
                <span>Showing <strong>{(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredApplications.length)}</strong> of <strong>{filteredApplications.length.toLocaleString()}</strong></span>
                <div className="flex items-center space-x-1.5">
                  <button type="button" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 rounded-xl border bg-white disabled:opacity-40 cursor-pointer">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1 font-bold text-[#2563eb]">Page {currentPage} of {totalPages}</span>
                  <button type="button" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 rounded-xl border bg-white disabled:opacity-40 cursor-pointer">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export const TPApplicationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const app = mockAdminApplications.find((a) => a.id === id) || mockAdminApplications[0];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <TPHeader onOpenSidebar={() => {}} title="Application Record" subtitle={app.candidateName} />
      <main className="p-6 max-w-4xl mx-auto w-full text-left space-y-4">
        <button type="button" onClick={() => navigate('/tp/applications')} className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-[#2563eb] cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Applications</span>
        </button>
        <div className="bg-white border rounded-3xl p-6 space-y-3">
          <h2 className="text-xl font-extrabold text-[#0f172a]">{app.candidateName}</h2>
          <p className="text-xs text-slate-500">{app.internshipTitle} @ {app.companyName}</p>
          <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
            <p>Applied Date: <strong>{app.appliedDate}</strong></p>
            <p>Match Score: <strong className="text-[#2563eb]">{app.matchScore}%</strong></p>
            <p>Status: <strong>{app.status}</strong></p>
          </div>
        </div>
      </main>
    </div>
  );
};
