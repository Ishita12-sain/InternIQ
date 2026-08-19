import React, { useState, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { TPSidebar } from '../../components/tp/TPSidebar';
import { TPHeader } from '../../components/tp/TPHeader';
import { mockAdminInternships } from '../../types/adminTypes';
import { Search, Filter, ArrowLeft } from 'lucide-react';

export const TPInternshipsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const initialStatus = searchParams.get('status') || 'All';
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInternships = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return mockAdminInternships.filter((i) => {
      const matchesSearch = i.title.toLowerCase().includes(query) || i.companyName.toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'All' || i.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <TPSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <TPHeader onOpenSidebar={() => setIsSidebarOpen(true)} title="Internship Opportunities" subtitle="Review active and closed campus drive listings." />
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto text-left">
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search title or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
              />
            </div>
            <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer">
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="bg-white border border-[#e2e8f0] rounded-3xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Internship</th>
                    <th className="py-3.5 px-4">Company</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4 text-center">Openings</th>
                    <th className="py-3.5 px-4 text-center">Applications</th>
                    <th className="py-3.5 px-4 text-center">Selected</th>
                    <th className="py-3.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredInternships.slice(0, 15).map((i) => (
                    <tr key={i.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4">
                        <button type="button" onClick={() => navigate(`/tp/internships/${i.id}`)} className="font-bold text-[#0f172a] hover:text-[#2563eb] text-left cursor-pointer">
                          {i.title}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{i.companyName}</td>
                      <td className="py-3.5 px-4 text-slate-500">{i.location}</td>
                      <td className="py-3.5 px-4 text-center font-bold">{i.openings}</td>
                      <td className="py-3.5 px-4 text-center font-bold text-blue-600">{i.applicationsCount}</td>
                      <td className="py-3.5 px-4 text-center font-bold text-emerald-600">{i.selected || 0}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${i.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                          {i.status}
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

export const TPInternshipDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const internship = mockAdminInternships.find((i) => i.id === id) || mockAdminInternships[0];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <TPHeader onOpenSidebar={() => {}} title="Internship Details" subtitle={internship.title} />
      <main className="p-6 max-w-4xl mx-auto w-full text-left space-y-4">
        <button type="button" onClick={() => navigate('/tp/internships')} className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-[#2563eb] cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Internships</span>
        </button>
        <div className="bg-white border rounded-3xl p-6 space-y-3">
          <h2 className="text-xl font-extrabold text-[#0f172a]">{internship.title}</h2>
          <p className="text-xs text-slate-500">{internship.companyName} • {internship.location} ({internship.workMode})</p>
          <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
            <p>Stipend: <strong>{internship.stipend}</strong></p>
            <p>Duration: <strong>{internship.duration}</strong></p>
            <p>Openings: <strong>{internship.openings}</strong></p>
          </div>
        </div>
      </main>
    </div>
  );
};
