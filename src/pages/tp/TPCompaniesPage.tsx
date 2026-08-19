import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TPSidebar } from '../../components/tp/TPSidebar';
import { TPHeader } from '../../components/tp/TPHeader';
import { mockAdminCompanies, mockAdminInternships } from '../../types/adminTypes';
import { Search, Filter, ArrowLeft } from 'lucide-react';

export const TPCompaniesPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('All');

  const filteredCompanies = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return mockAdminCompanies.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(query) || c.location.toLowerCase().includes(query);
      const matchesInd = industryFilter === 'All' || c.industry === industryFilter;
      return matchesSearch && matchesInd;
    });
  }, [searchQuery, industryFilter]);

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <TPSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <TPHeader onOpenSidebar={() => setIsSidebarOpen(true)} title="Partner Companies" subtitle="Corporate hiring partners and placement drives." />
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto text-left">
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search company or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2563eb]"
              />
            </div>
            <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select value={industryFilter} onChange={(e) => setIndustryFilter(e.target.value)} className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer">
                <option value="All">All Industries</option>
                <option value="Software & IT">Software & IT</option>
                <option value="Fintech & Banking">Fintech & Banking</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Robotics & Hardware">Robotics & Hardware</option>
              </select>
            </div>
          </div>

          <div className="bg-white border border-[#e2e8f0] rounded-3xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Company</th>
                    <th className="py-3.5 px-4">Industry</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4 text-center">Internships</th>
                    <th className="py-3.5 px-4 text-center">Applications</th>
                    <th className="py-3.5 px-4 text-center">Selected</th>
                    <th className="py-3.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredCompanies.slice(0, 15).map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4">
                        <button type="button" onClick={() => navigate(`/tp/companies/${c.id}`)} className="font-bold text-[#0f172a] hover:text-[#2563eb] hover:underline text-left cursor-pointer">
                          {c.name}
                        </button>
                      </td>
                      <td className="py-3.5 px-4">{c.industry}</td>
                      <td className="py-3.5 px-4 text-slate-500">{c.location}</td>
                      <td className="py-3.5 px-4 text-center font-bold">{c.postedInternships}</td>
                      <td className="py-3.5 px-4 text-center font-bold text-blue-600">{c.applicantsCount || 0}</td>
                      <td className="py-3.5 px-4 text-center font-bold text-emerald-600">{c.selectedCount || 0}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {c.verificationStatus}
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

export const TPCompanyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const company = mockAdminCompanies.find((c) => c.id === id) || mockAdminCompanies[0];
  const companyInternships = mockAdminInternships.filter((i) => i.companyId === company.id || i.companyName === company.name);

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <TPSidebar isOpen={false} onClose={() => {}} />
      <div className="flex-1 flex flex-col min-w-0">
        <TPHeader onOpenSidebar={() => {}} title="Company Details" subtitle={company.name} />
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl w-full mx-auto text-left">
          <button type="button" onClick={() => navigate('/tp/companies')} className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-[#2563eb] border-b pb-3 w-full cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Partner Companies</span>
          </button>
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
            <h2 className="text-xl font-extrabold text-[#0f172a]">{company.name}</h2>
            <p className="text-xs text-slate-500">{company.industry} • {company.location}</p>
            <div className="pt-4 border-t space-y-2">
              <h3 className="text-sm font-bold text-slate-800">Posted Internships ({companyInternships.length})</h3>
              {companyInternships.map((i) => (
                <div key={i.id} className="p-3 bg-slate-50 rounded-xl border text-xs flex justify-between items-center">
                  <span className="font-bold text-[#0f172a]">{i.title}</span>
                  <span className="text-slate-500">{i.openings} Openings • {i.status}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
