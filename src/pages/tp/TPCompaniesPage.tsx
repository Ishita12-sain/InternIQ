import React, { useState, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { TPSidebar } from '../../components/tp/TPSidebar';
import { TPHeader } from '../../components/tp/TPHeader';
import {
  generatedCompanies,
  generatedInternships,
  generatedApplications,
} from '../../types/masterDataset';
import {
  Search,
  ArrowLeft,
  Building2,
  Briefcase,
  Award,
  CheckCircle2,
  Globe,
  Mail,
  Phone,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  User,
  AlertCircle,
} from 'lucide-react';

export const TPCompaniesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // URL query params
  const initialStatusParam = searchParams.get('status');

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(
    initialStatusParam === 'active' ? 'Active' : 'All'
  );
  const [hiringStatusFilter, setHiringStatusFilter] = useState(
    initialStatusParam === 'hiring' ? 'Hiring' : 'All'
  );
  const [industryFilter, setIndustryFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');

  // Sorting & Pagination State
  const [sortField, setSortField] = useState<'name' | 'postedInternships' | 'applicantsCount' | 'selectedCount'>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Overview Header Metrics directly from master dataset
  const overviewMetrics = useMemo(() => {
    const totalCompanies = generatedCompanies.length; // 185
    const activeCompanies = generatedCompanies.filter((c) => c.verificationStatus === 'Verified').length;
    const hiringCompanies = generatedCompanies.filter((c) => c.postedInternships > 0 && c.verificationStatus === 'Verified').length;
    const totalOpenPositions = generatedInternships
      .filter((i) => i.status === 'Active')
      .reduce((sum, i) => sum + i.openings, 0);

    return {
      totalCompanies,
      activeCompanies,
      hiringCompanies,
      totalOpenPositions,
    };
  }, []);

  // Filtered & Sorted Companies List
  const filteredCompanies = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    const result = generatedCompanies.filter((c) => {
      // Search (Name, Industry, Location, Email, ID)
      if (query) {
        const matchesName = c.name.toLowerCase().includes(query);
        const matchesInd = c.industry.toLowerCase().includes(query);
        const matchesLoc = c.location.toLowerCase().includes(query);
        const matchesEmail = c.email.toLowerCase().includes(query);
        const matchesId = c.id.toLowerCase().includes(query);
        if (!matchesName && !matchesInd && !matchesLoc && !matchesEmail && !matchesId) {
          return false;
        }
      }

      // Verification Status Filter
      if (statusFilter !== 'All') {
        if (statusFilter === 'Active' && c.verificationStatus !== 'Verified') return false;
        if (statusFilter === 'Pending Verification' && c.verificationStatus !== 'Pending') return false;
        if (statusFilter === 'Rejected' && c.verificationStatus !== 'Rejected') return false;
        if (statusFilter === 'Inactive' && c.companyStatus !== 'Inactive') return false;
      }

      // Hiring Status Filter
      if (hiringStatusFilter !== 'All') {
        if (hiringStatusFilter === 'Hiring' && c.postedInternships === 0) return false;
        if (hiringStatusFilter === 'Not Hiring' && c.postedInternships > 0) return false;
      }

      // Industry Filter
      if (industryFilter !== 'All' && c.industry !== industryFilter) {
        return false;
      }

      // Location Filter
      if (locationFilter !== 'All' && !c.location.toLowerCase().includes(locationFilter.toLowerCase())) {
        return false;
      }

      return true;
    });

    // Sorting
    return result.sort((a, b) => {
      let valA: any = a[sortField] || '';
      let valB: any = b[sortField] || '';

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [searchQuery, statusFilter, hiringStatusFilter, industryFilter, locationFilter, sortField, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filteredCompanies.length / pageSize));
  const paginatedCompanies = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCompanies.slice(start, start + pageSize);
  }, [filteredCompanies, currentPage, pageSize]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <TPSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <TPHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Companies"
          subtitle="Manage hiring companies, internship opportunities and recruitment activity."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto pb-safe text-left">
          {/* Back Navigation */}
          <button
            type="button"
            onClick={() => navigate('/tp/dashboard')}
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-[#2563eb] transition-colors cursor-pointer border-b border-slate-200 pb-3 w-full"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          {/* Active Filter Notification Banner */}
          {(statusFilter !== 'All' || hiringStatusFilter !== 'All') && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#2563eb]" />
                <span className="font-bold text-[#0f172a]">
                  Active Filter:{' '}
                  {statusFilter !== 'All' && <strong className="text-[#2563eb]">Status = {statusFilter} </strong>}
                  {hiringStatusFilter !== 'All' && <strong className="text-[#2563eb]">Hiring Status = {hiringStatusFilter}</strong>}
                </span>
              </div>
              <span className="font-extrabold text-[#2563eb] bg-white px-2.5 py-0.5 rounded-full border border-blue-200">
                {filteredCompanies.length.toLocaleString()} Companies Matching
              </span>
            </div>
          )}

          {/* 4 Clickable Summary Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'TOTAL COMPANIES', val: overviewMetrics.totalCompanies, path: '/tp/companies', icon: <Building2 className="w-4 h-4 text-[#2563eb]" /> },
              { label: 'ACTIVE COMPANIES', val: overviewMetrics.activeCompanies, path: '/tp/companies?status=active', icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" /> },
              { label: 'HIRING COMPANIES', val: overviewMetrics.hiringCompanies, path: '/tp/companies?status=hiring', icon: <Briefcase className="w-4 h-4 text-amber-600" /> },
              { label: 'TOTAL OPEN POSITIONS', val: overviewMetrics.totalOpenPositions, path: '/tp/internships?status=Active', icon: <Award className="w-4 h-4 text-purple-600" /> },
            ].map((card) => (
              <button
                key={card.label}
                type="button"
                onClick={() => {
                  if (card.path.startsWith('/tp/companies?status=active')) {
                    setStatusFilter('Active');
                    setHiringStatusFilter('All');
                  } else if (card.path.startsWith('/tp/companies?status=hiring')) {
                    setHiringStatusFilter('Hiring');
                    setStatusFilter('All');
                  } else if (card.path === '/tp/companies') {
                    setStatusFilter('All');
                    setHiringStatusFilter('All');
                  }
                  navigate(card.path);
                }}
                className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs hover:border-[#2563eb] hover:shadow-sm hover:-translate-y-0.5 transition-all text-left cursor-pointer space-y-1 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-[#2563eb] transition-colors">{card.label}</span>
                  {card.icon}
                </div>
                <p className="text-xl font-black text-[#0f172a] group-hover:text-[#2563eb] transition-colors">{card.val.toLocaleString()}</p>
              </button>
            ))}
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs space-y-3">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search companies by name, industry or location..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2563eb]"
              />
            </div>

            {/* Filter Dropdowns Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {/* Verification Status */}
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">Status: All</option>
                <option value="Active">Active (Verified)</option>
                <option value="Pending Verification">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>

              {/* Hiring Status */}
              <select
                value={hiringStatusFilter}
                onChange={(e) => { setHiringStatusFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">Hiring: All</option>
                <option value="Hiring">Hiring (Has Openings)</option>
                <option value="Not Hiring">Not Hiring</option>
              </select>

              {/* Industry */}
              <select
                value={industryFilter}
                onChange={(e) => { setIndustryFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">Industry: All</option>
                <option value="Software & IT">Software & IT</option>
                <option value="FinTech">FinTech</option>
                <option value="Robotics & Automation">Robotics & Automation</option>
                <option value="Consulting & Cloud">Consulting & Cloud</option>
              </select>

              {/* Location */}
              <select
                value={locationFilter}
                onChange={(e) => { setLocationFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">Location: All</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Pune">Pune</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

          {/* Desktop Table & Mobile Cards */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl shadow-2xs overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4 cursor-pointer" onClick={() => handleSort('name')}>
                      <div className="flex items-center space-x-1">
                        <span>Company</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4">Industry</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4 text-center cursor-pointer" onClick={() => handleSort('postedInternships')}>
                      <div className="flex items-center justify-center space-x-1">
                        <span>Open Positions</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 text-center cursor-pointer" onClick={() => handleSort('applicantsCount')}>
                      <div className="flex items-center justify-center space-x-1">
                        <span>Applications</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 text-center">Shortlisted</th>
                    <th className="py-3.5 px-4 text-center cursor-pointer" onClick={() => handleSort('selectedCount')}>
                      <div className="flex items-center justify-center space-x-1">
                        <span>Selected</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {paginatedCompanies.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center space-y-2">
                        <p className="text-sm font-extrabold text-slate-700">No companies found</p>
                        <p className="text-xs text-slate-400">Try changing your search or filters.</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedCompanies.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={() => navigate(`/tp/companies/${c.id}`)}
                            className="font-extrabold text-[#0f172a] hover:text-[#2563eb] hover:underline text-left cursor-pointer"
                          >
                            {c.name}
                          </button>
                          <p className="text-[10px] text-slate-400">{c.email}</p>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">{c.industry}</td>
                        <td className="py-3.5 px-4 text-slate-500">{c.location}</td>
                        <td className="py-3.5 px-4 text-center font-bold text-[#2563eb]">{c.postedInternships}</td>
                        <td className="py-3.5 px-4 text-center font-bold">{c.applicantsCount || 0}</td>
                        <td className="py-3.5 px-4 text-center font-bold text-amber-600">
                          {Math.round((c.applicantsCount || 0) * 0.3)}
                        </td>
                        <td className="py-3.5 px-4 text-center font-black text-emerald-600">{c.selectedCount || 0}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              c.verificationStatus === 'Verified'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : c.verificationStatus === 'Rejected'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            {c.verificationStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => navigate(`/tp/companies/${c.id}`)}
                            className="px-3 py-1 bg-slate-100 hover:bg-blue-50 hover:text-[#2563eb] border border-slate-200 rounded-lg font-bold text-[11px] cursor-pointer transition-colors"
                          >
                            View Company
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Responsive Cards (<= 768px) */}
            <div className="md:hidden divide-y divide-slate-100">
              {paginatedCompanies.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <p className="text-sm font-extrabold text-slate-700">No companies found</p>
                  <p className="text-xs text-slate-400">Try changing your search or filters.</p>
                </div>
              ) : (
                paginatedCompanies.map((c) => (
                  <div key={c.id} className="p-4 space-y-3 text-left">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-[#2563eb] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                          {c.avatarInitials}
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={() => navigate(`/tp/companies/${c.id}`)}
                            className="font-extrabold text-sm text-[#0f172a] hover:text-[#2563eb]"
                          >
                            {c.name}
                          </button>
                          <p className="text-[10px] text-slate-400">{c.industry} • {c.location}</p>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          c.verificationStatus === 'Verified'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {c.verificationStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 p-2 bg-slate-50 border border-slate-200/60 rounded-xl text-center text-[10px]">
                      <div>
                        <span className="text-slate-400 uppercase block font-bold">Positions</span>
                        <strong className="text-sm text-[#2563eb]">{c.postedInternships}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase block font-bold">Apps</span>
                        <strong className="text-sm text-slate-800">{c.applicantsCount || 0}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase block font-bold">Selected</span>
                        <strong className="text-sm text-emerald-600">{c.selectedCount || 0}</strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-semibold text-slate-400">{c.email}</span>
                      <button
                        type="button"
                        onClick={() => navigate(`/tp/companies/${c.id}`)}
                        className="px-3 py-1 bg-[#2563eb] text-white font-bold text-xs rounded-lg cursor-pointer"
                      >
                        View Company
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination Controls */}
            {filteredCompanies.length > pageSize && (
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="text-slate-600 font-semibold">
                  Showing <strong className="text-[#0f172a]">{(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredCompanies.length)}</strong> of <strong className="text-[#0f172a]">{filteredCompanies.length.toLocaleString()}</strong> companies
                </span>

                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="px-3 py-1 bg-white border border-slate-200 rounded-xl font-bold text-[#2563eb]">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
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

// Complete Company Details Page Component
export const TPCompanyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Exact company record lookup
  const company = generatedCompanies.find((c) => c.id === id);

  if (!company) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-2" />
        <h2 className="text-lg font-extrabold text-[#0f172a]">Company Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">The company ID #{id} does not exist in the corporate partner directory.</p>
        <button
          type="button"
          onClick={() => navigate('/tp/companies')}
          className="mt-4 px-4 py-2 bg-[#2563eb] text-white font-bold text-xs rounded-xl shadow-2xs hover:bg-blue-700 cursor-pointer"
        >
          Back to Companies
        </button>
      </div>
    );
  }

  // Derive posted internships and applications from master dataset
  const companyInternships = generatedInternships.filter((i) => i.companyId === company.id);
  const companyApps = generatedApplications.filter((a) => a.companyId === company.id);
  const selectedApps = companyApps.filter((a) => a.status === 'Selected');

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <TPSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <TPHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Company Dossier"
          subtitle={`Hiring profile & activity for ${company.name}`}
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-5xl w-full mx-auto pb-safe text-left">
          {/* Back Navigation */}
          <button
            type="button"
            onClick={() => navigate('/tp/companies')}
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-[#2563eb] transition-colors cursor-pointer border-b border-slate-200 pb-3 w-full"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Companies</span>
          </button>

          {/* Company Profile Header */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-[#2563eb] text-white font-black text-xl flex items-center justify-center border-2 border-blue-400 shadow-2xs shrink-0">
                  {company.avatarInitials}
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-[#0f172a]">{company.name}</h2>
                  <p className="text-xs text-slate-500">{company.industry} • {company.location}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-full">
                      {company.verificationStatus}
                    </span>
                    <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold rounded-full">
                      CIN: {company.cin}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <a
                  href={`mailto:${company.email}`}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl inline-flex items-center space-x-1.5 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>Email Recruiter</span>
                </a>
                <a
                  href={`https://${company.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-[#2563eb] text-xs font-bold rounded-xl inline-flex items-center space-x-1.5 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Visit Website</span>
                </a>
              </div>
            </div>

            {/* Overview Description */}
            <div className="text-xs text-slate-600 leading-relaxed font-medium">
              <p>
                <strong>{company.name}</strong> is a leading corporate partner specializing in {company.industry}. Operating from {company.location}, the company actively recruits students across software development, AI, robotics, and cloud engineering domains.
              </p>
            </div>

            {/* Key Statistics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Internships Posted</p>
                <p className="text-lg font-black text-[#2563eb] mt-0.5">{companyInternships.length}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Total Applications</p>
                <p className="text-lg font-black text-[#0f172a] mt-0.5">{companyApps.length}</p>
              </div>
              <div className="p-3 bg-amber-50/50 rounded-2xl border border-amber-200">
                <p className="text-[10px] font-bold text-amber-700 uppercase">Shortlisted</p>
                <p className="text-lg font-black text-amber-700 mt-0.5">
                  {companyApps.filter((a) => a.status === 'Shortlisted' || a.status === 'Interview' || a.status === 'Selected').length}
                </p>
              </div>
              <div className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-200">
                <p className="text-[10px] font-bold text-emerald-700 uppercase">Selected Students</p>
                <p className="text-lg font-black text-emerald-700 mt-0.5">{selectedApps.length}</p>
              </div>
            </div>

            {/* Recruiter Contact Box */}
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 text-xs">
              <h4 className="font-extrabold text-[#0f172a]">Corporate Recruiter Contact</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-700 font-medium">
                <p className="flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Recruiter: <strong>Priya Mehta (Talent Lead)</strong></span>
                </p>
                <p className="flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Email: <strong>{company.email}</strong></span>
                </p>
                <p className="flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Phone: <strong>+91 80 4567 8900</strong></span>
                </p>
              </div>
            </div>

            {/* Open Internships Section */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-extrabold text-[#0f172a]">Posted Internship Opportunities</h3>
              <div className="bg-white border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b text-slate-500 font-bold uppercase text-[9px]">
                      <tr>
                        <th className="py-2.5 px-3">Role Title</th>
                        <th className="py-2.5 px-3">Location & Mode</th>
                        <th className="py-2.5 px-3">Stipend</th>
                        <th className="py-2.5 px-3 text-center">Openings</th>
                        <th className="py-2.5 px-3 text-center">Apps</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y font-medium text-slate-700">
                      {companyInternships.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-slate-400 italic">No active internship listings found.</td>
                        </tr>
                      ) : (
                        companyInternships.map((i) => (
                          <tr key={i.id} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-bold text-[#0f172a]">
                              <button
                                type="button"
                                onClick={() => navigate(`/tp/internships/${i.id}`)}
                                className="hover:text-[#2563eb] hover:underline cursor-pointer"
                              >
                                {i.title}
                              </button>
                            </td>
                            <td className="py-2.5 px-3 text-slate-600">{i.location} ({i.workMode})</td>
                            <td className="py-2.5 px-3 text-emerald-600 font-bold">{i.stipend}</td>
                            <td className="py-2.5 px-3 text-center font-bold">{i.openings}</td>
                            <td className="py-2.5 px-3 text-center font-bold text-blue-600">{i.applicationsCount}</td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {i.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Application Activity Section */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-extrabold text-[#0f172a]">Recent Candidate Applications</h3>
              <div className="space-y-2 text-xs">
                {companyApps.slice(0, 5).map((app) => (
                  <div key={app.id} className="p-3 bg-slate-50 border rounded-2xl flex items-center justify-between">
                    <div>
                      <button
                        type="button"
                        onClick={() => navigate(`/tp/students/${app.studentId}`)}
                        className="font-bold text-[#0f172a] hover:text-[#2563eb] hover:underline text-left cursor-pointer"
                      >
                        {app.candidateName}
                      </button>
                      <p className="text-[10px] text-slate-500">{app.internshipTitle} • Applied: {app.appliedDate}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 bg-[#2563eb]/10 text-[#2563eb] font-extrabold text-[10px] rounded-md">
                        {app.matchScore}%
                      </span>
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-[10px] font-bold">
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
