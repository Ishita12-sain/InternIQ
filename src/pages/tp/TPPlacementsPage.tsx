import React, { useState, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { TPSidebar } from '../../components/tp/TPSidebar';
import { TPHeader } from '../../components/tp/TPHeader';
import {
  generatedPlacements,
  generatedStudents,
  generatedCompanies,
  generatedInternships,
} from '../../types/masterDataset';
import type { AdminPlacementItem } from '../../types/adminTypes';
import {
  Search,
  ArrowLeft,
  Award,
  CheckCircle2,
  Clock,
  Briefcase,
  XCircle,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  FileCheck,
  Star,
} from 'lucide-react';

export const TPPlacementsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Read query params
  const rawStatusParam = searchParams.get('status');

  const normalizeStatus = (param: string | null): string => {
    if (!param) return 'All';
    const lower = param.toLowerCase();
    if (lower === 'offer-accepted' || lower === 'offer accepted') return 'Offer Accepted';
    if (lower === 'joining-soon' || lower === 'joining soon') return 'Joining Soon';
    if (lower === 'ongoing') return 'Ongoing';
    if (lower === 'completed') return 'Completed';
    if (lower === 'not-joined' || lower === 'not joined') return 'Not Joined';
    if (lower === 'selected') return 'All'; // Total Selected
    return 'All';
  };

  // Synchronize status filter on searchParams change
  React.useEffect(() => {
    const statusParam = searchParams.get('status');
    setStatusFilter(normalizeStatus(statusParam));
    setCurrentPage(1);
  }, [searchParams]);

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(normalizeStatus(rawStatusParam));
  const [companyFilter, setCompanyFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [courseFilter, setCourseFilter] = useState('All');

  // Sorting & Pagination State
  const [sortField, setSortField] = useState<'candidateName' | 'companyName' | 'selectionDate' | 'joiningDate' | 'stipendNumeric' | 'status'>('selectionDate');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Calculate Header Overview Metrics directly from generatedPlacements (312 total items)
  const metrics = useMemo(() => {
    const totalSelected = generatedPlacements.length; // 312
    const offerAccepted = generatedPlacements.filter((p) => p.status === 'Offer Accepted').length;
    const joiningSoon = generatedPlacements.filter((p) => p.status === 'Joining Soon').length;
    const ongoing = generatedPlacements.filter((p) => p.status === 'Ongoing').length;
    const completed = generatedPlacements.filter((p) => p.status === 'Completed').length;
    const notJoined = generatedPlacements.filter((p) => p.status === 'Not Joined').length;

    return {
      totalSelected,
      offerAccepted,
      joiningSoon,
      ongoing,
      completed,
      notJoined,
    };
  }, []);

  // Filter & Sort Placements
  const filteredPlacements = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    const result = generatedPlacements.filter((p) => {
      // 1. Search across Student Name, Student ID, Company Name, Internship Title, Placement ID
      if (query) {
        const matchesStudent = p.candidateName.toLowerCase().includes(query);
        const matchesStudentId = p.studentId.toLowerCase().includes(query);
        const matchesCompany = p.companyName.toLowerCase().includes(query);
        const matchesTitle = p.internshipTitle.toLowerCase().includes(query);
        const matchesId = p.id.toLowerCase().includes(query);
        if (!matchesStudent && !matchesStudentId && !matchesCompany && !matchesTitle && !matchesId) {
          return false;
        }
      }

      // 2. Status Filter
      if (statusFilter !== 'All' && p.status !== statusFilter) {
        return false;
      }

      // 3. Company Filter
      if (companyFilter !== 'All' && p.companyName !== companyFilter) {
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
  }, [searchQuery, statusFilter, companyFilter, sortField, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filteredPlacements.length / pageSize));
  const paginatedPlacements = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPlacements.slice(start, start + pageSize);
  }, [filteredPlacements, currentPage, pageSize]);

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
          title="Placements"
          subtitle="Track selected students from offer acceptance through joining and placement completion."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto pb-safe text-left">
          {/* Back Navigation Bar */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <button
              type="button"
              onClick={() => {
                if (statusFilter !== 'All' || companyFilter !== 'All' || searchQuery !== '') {
                  setStatusFilter('All');
                  setCompanyFilter('All');
                  setDeptFilter('All');
                  setCourseFilter('All');
                  setSearchQuery('');
                  setCurrentPage(1);
                  navigate('/tp/placements');
                } else {
                  navigate('/tp/dashboard');
                }
              }}
              className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-[#2563eb] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>
                {statusFilter !== 'All' || companyFilter !== 'All' || searchQuery !== ''
                  ? 'Clear Active Filters'
                  : 'Back to Dashboard'}
              </span>
            </button>
          </div>

          {/* Active Status Banner & Clear Filter */}
          {statusFilter !== 'All' && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between text-xs gap-2">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#2563eb] shrink-0" />
                <span className="font-bold text-[#0f172a]">
                  Active Filter: <strong className="text-[#2563eb]">{statusFilter}</strong>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-[#2563eb] bg-white px-2.5 py-0.5 rounded-full border border-blue-200 text-[11px]">
                  {filteredPlacements.length.toLocaleString()} Records
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter('All');
                    setCurrentPage(1);
                    navigate('/tp/placements');
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl font-bold text-[11px] cursor-pointer transition-colors"
                >
                  Clear Filter
                </button>
              </div>
            </div>
          )}

          {/* 6 Clickable Summary Cards Grid (2 columns on mobile, 3 on tablet, 6 on desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {[
              { label: 'TOTAL SELECTED', val: metrics.totalSelected, status: 'All', path: '/tp/placements', icon: <Award className="w-4 h-4 text-[#2563eb]" /> },
              { label: 'OFFER ACCEPTED', val: metrics.offerAccepted, status: 'Offer Accepted', path: '/tp/placements?status=offer-accepted', icon: <FileCheck className="w-4 h-4 text-[#2563eb]" /> },
              { label: 'JOINING SOON', val: metrics.joiningSoon, status: 'Joining Soon', path: '/tp/placements?status=joining-soon', icon: <Clock className="w-4 h-4 text-amber-500" /> },
              { label: 'ONGOING', val: metrics.ongoing, status: 'Ongoing', path: '/tp/placements?status=ongoing', icon: <Briefcase className="w-4 h-4 text-indigo-600" /> },
              { label: 'COMPLETED', val: metrics.completed, status: 'Completed', path: '/tp/placements?status=completed', icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" /> },
              { label: 'NOT JOINED', val: metrics.notJoined, status: 'Not Joined', path: '/tp/placements?status=not-joined', icon: <XCircle className="w-4 h-4 text-rose-500" /> },
            ].map((c) => (
              <button
                key={c.label}
                type="button"
                onClick={() => {
                  setStatusFilter(c.status);
                  setCurrentPage(1);
                  navigate(c.path);
                }}
                className={`bg-white border rounded-2xl p-3.5 shadow-2xs hover:border-[#2563eb] hover:shadow-xs hover:-translate-y-0.5 transition-all text-left cursor-pointer space-y-1 group ${
                  statusFilter === c.status
                    ? 'border-[#2563eb] ring-2 ring-blue-500/20 bg-blue-50/20'
                    : 'border-[#e2e8f0]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-extrabold tracking-wider text-slate-500 group-hover:text-[#2563eb] truncate">{c.label}</span>
                  {c.icon}
                </div>
                <p className="text-xl font-black text-[#0f172a] group-hover:text-[#2563eb]">{c.val.toLocaleString()}</p>
              </button>
            ))}
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs space-y-3">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search student, company, internship or placement ID..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2563eb]"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">Status: All</option>
                <option value="Offer Accepted">Offer Accepted</option>
                <option value="Joining Soon">Joining Soon</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Not Joined">Not Joined</option>
              </select>

              <select
                value={companyFilter}
                onChange={(e) => { setCompanyFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">Company: All</option>
                {Array.from(new Set(generatedPlacements.map((p) => p.companyName))).map((cName) => (
                  <option key={cName} value={cName}>{cName}</option>
                ))}
              </select>

              <select
                value={deptFilter}
                onChange={(e) => { setDeptFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">Dept: All</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Tech">Information Tech</option>
                <option value="Electronics">Electronics</option>
              </select>

              <select
                value={courseFilter}
                onChange={(e) => { setCourseFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">Course: All</option>
                <option value="B.Tech Computer Science">B.Tech CS</option>
                <option value="B.Tech IT">B.Tech IT</option>
              </select>
            </div>
          </div>

          {/* Desktop Table & Mobile Cards Container */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl shadow-2xs overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4 font-mono">Placement ID</th>
                    <th className="py-3.5 px-4 cursor-pointer" onClick={() => handleSort('candidateName')}>
                      <div className="flex items-center space-x-1">
                        <span>Student</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 cursor-pointer" onClick={() => handleSort('companyName')}>
                      <div className="flex items-center space-x-1">
                        <span>Company</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4">Internship Role</th>
                    <th className="py-3.5 px-4 cursor-pointer" onClick={() => handleSort('selectionDate')}>
                      <div className="flex items-center space-x-1">
                        <span>Selection Date</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 cursor-pointer" onClick={() => handleSort('joiningDate')}>
                      <div className="flex items-center space-x-1">
                        <span>Joining Date</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4">Duration & Stipend</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {paginatedPlacements.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center space-y-2">
                        <p className="text-sm font-extrabold text-slate-700">No placements found</p>
                        <p className="text-xs text-slate-400">Try changing your search or filters.</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedPlacements.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-500">{p.id}</td>
                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={() => navigate(`/tp/students/${p.studentId}`)}
                            className="font-extrabold text-[#0f172a] hover:text-[#2563eb] hover:underline text-left cursor-pointer"
                          >
                            {p.candidateName}
                          </button>
                          <p className="text-[10px] text-slate-400">ID: {p.studentId}</p>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          <button
                            type="button"
                            onClick={() => navigate(`/tp/companies/${p.companyId}`)}
                            className="hover:text-[#2563eb] hover:underline cursor-pointer"
                          >
                            {p.companyName}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          <button
                            type="button"
                            onClick={() => navigate(`/tp/internships/${p.internshipId}`)}
                            className="hover:text-[#2563eb] hover:underline cursor-pointer"
                          >
                            {p.internshipTitle}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">{p.selectionDate}</td>
                        <td className="py-3.5 px-4 font-semibold text-[#0f172a]">{p.joiningDate}</td>
                        <td className="py-3.5 px-4">
                          <span className="font-extrabold text-emerald-600 block">{p.stipend}</span>
                          <span className="text-[10px] text-slate-400">{p.duration}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              p.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : p.status === 'Ongoing'
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                : p.status === 'Joining Soon'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : p.status === 'Not Joined'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => navigate(`/tp/placements/${p.id}`)}
                            className="px-3 py-1 bg-slate-100 hover:bg-blue-50 hover:text-[#2563eb] border border-slate-200 rounded-lg font-bold text-[11px] cursor-pointer transition-colors"
                          >
                            View Placement
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
              {paginatedPlacements.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <p className="text-sm font-extrabold text-slate-700">No placements found</p>
                  <p className="text-xs text-slate-400">Try changing your search or filters.</p>
                </div>
              ) : (
                paginatedPlacements.map((p) => (
                  <div key={p.id} className="p-4 space-y-3 text-left">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[#2563eb] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                          {p.avatarInitials}
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={() => navigate(`/tp/students/${p.studentId}`)}
                            className="font-extrabold text-sm text-[#0f172a] hover:text-[#2563eb]"
                          >
                            {p.candidateName}
                          </button>
                          <p className="text-[10px] text-slate-400 font-mono">PLC ID: {p.id} • Student ID: {p.studentId}</p>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          p.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-50 border border-slate-200/70 rounded-xl space-y-1 text-xs">
                      <p className="font-bold text-[#0f172a]">{p.internshipTitle}</p>
                      <p className="text-[11px] text-slate-500">{p.companyName}</p>
                      <p className="text-[11px] text-slate-600">Selected: {p.selectionDate} • Joining: <strong>{p.joiningDate}</strong></p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="font-black text-emerald-600 text-xs">{p.stipend}</span>
                      <button
                        type="button"
                        onClick={() => navigate(`/tp/placements/${p.id}`)}
                        className="px-3 py-1 bg-[#2563eb] text-white font-bold text-xs rounded-lg cursor-pointer"
                      >
                        View Placement
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination Controls */}
            {filteredPlacements.length > pageSize && (
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="text-slate-600 font-semibold">
                  Showing <strong className="text-[#0f172a]">{(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredPlacements.length)}</strong> of <strong className="text-[#0f172a]">{filteredPlacements.length.toLocaleString()}</strong> placements
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

// Full Placement Details Page Component
export const TPPlacementDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Exact Placement Lookup from master dataset
  const placement = generatedPlacements.find((p) => p.id === id);

  // Status Change State
  const [currentStatus, setCurrentStatus] = useState<AdminPlacementItem['status']>(
    placement ? placement.status : 'Offer Accepted'
  );
  const [statusToast, setStatusToast] = useState<string | null>(null);

  if (!placement) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-2" />
        <h2 className="text-lg font-extrabold text-[#0f172a]">Placement Record Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">The placement ID #{id} does not exist in the master placement ledger.</p>
        <button
          type="button"
          onClick={() => navigate('/tp/placements')}
          className="mt-4 px-4 py-2 bg-[#2563eb] text-white font-bold text-xs rounded-xl shadow-2xs hover:bg-blue-700 cursor-pointer"
        >
          Back to Placements
        </button>
      </div>
    );
  }

  // Cross-reference parent records
  const student = generatedStudents.find((s) => s.id === placement.studentId) || {
    id: placement.studentId,
    name: placement.candidateName,
    email: placement.studentEmail,
    phone: '+91 98765 43210',
    course: 'B.Tech CS',
    year: '4th Year',
    department: 'Computer Science',
  };

  const company = generatedCompanies.find((c) => c.id === placement.companyId) || {
    id: placement.companyId,
    name: placement.companyName,
    industry: 'Software & IT',
    location: 'Bengaluru',
    email: 'hr@partnercompany.com',
  };

  const internship = generatedInternships.find((i) => i.id === placement.internshipId) || {
    id: placement.internshipId,
    title: placement.internshipTitle,
    location: 'Remote',
    workMode: 'Remote',
    duration: '6 Months',
    stipend: placement.stipend,
  };

  const handleStatusUpdate = (newStatus: AdminPlacementItem['status']) => {
    placement.status = newStatus;
    setCurrentStatus(newStatus);
    setStatusToast(`Placement status updated to "${newStatus}". Shared datasets synchronized.`);
    setTimeout(() => setStatusToast(null), 3500);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <TPSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <TPHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Placement Dossier"
          subtitle={`Placement #${placement.id} • ${placement.candidateName}`}
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-5xl w-full mx-auto pb-safe text-left">
          {/* Back Navigation */}
          <button
            type="button"
            onClick={() => navigate('/tp/placements')}
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-[#2563eb] transition-colors cursor-pointer border-b border-slate-200 pb-3 w-full"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Placements</span>
          </button>

          {/* Toast Notification Banner */}
          {statusToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{statusToast}</span>
            </div>
          )}

          {/* Dossier Header */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Placement ID: #{placement.id}</span>
                <h2 className="text-xl font-extrabold text-[#0f172a]">{placement.candidateName}</h2>
                <p className="text-xs text-slate-500">{placement.internshipTitle} @ {placement.companyName}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold rounded-full">
                    {currentStatus}
                  </span>
                  {currentStatus === 'Joining Soon' && (
                    <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold rounded-full">
                      Joining Soon (01 Sep 2026)
                    </span>
                  )}
                </div>
              </div>

              {/* Status Update Dropdown */}
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-500">Manage Status:</span>
                <select
                  value={currentStatus}
                  onChange={(e) => handleStatusUpdate(e.target.value as any)}
                  className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-xl font-extrabold text-xs text-[#2563eb] focus:outline-none cursor-pointer"
                >
                  <option value="Offer Accepted">Offer Accepted</option>
                  <option value="Joining Soon">Joining Soon</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Not Joined">Not Joined</option>
                </select>
              </div>
            </div>

            {/* Key Dates Timeline & Offer Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-700 font-medium">
              <div className="p-3 bg-slate-50 rounded-2xl border">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Selection Date</span>
                <strong className="text-[#0f172a] text-sm">{placement.selectionDate}</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Offer Accepted Date</span>
                <strong className="text-[#0f172a] text-sm">{placement.offerAcceptanceDate}</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Joining Date</span>
                <strong className="text-[#2563eb] text-sm">{placement.joiningDate}</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Expected End Date</span>
                <strong className="text-[#0f172a] text-sm">{placement.expectedEndDate}</strong>
              </div>
            </div>

            {/* Student Information Section */}
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-[#2563eb] text-white font-black text-sm flex items-center justify-center shrink-0">
                    {placement.avatarInitials}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#0f172a]">{student.name}</h3>
                    <p className="text-xs text-slate-500 font-mono">ID: {student.id} • {student.email}</p>
                    <p className="text-xs text-slate-600 font-medium">{student.course} ({student.year}) • {student.phone}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/tp/students/${student.id}`)}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:text-[#2563eb] font-bold text-xs rounded-xl cursor-pointer"
                >
                  View Student
                </button>
              </div>
            </div>

            {/* Company Information Section */}
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Hiring Corporate Partner</span>
                  <h4 className="font-extrabold text-sm text-[#0f172a]">{company.name}</h4>
                  <p className="text-xs text-slate-600">{company.industry} • {company.location}</p>
                  <p className="text-xs text-slate-500">Recruiter: {company.email}</p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/tp/companies/${company.id}`)}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:text-[#2563eb] font-bold text-xs rounded-xl cursor-pointer"
                >
                  View Company
                </button>
              </div>
            </div>

            {/* Internship Information Section */}
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Internship Position</span>
                  <h4 className="font-extrabold text-sm text-[#0f172a]">{internship.title}</h4>
                  <p className="text-xs text-slate-600">{placement.stipend} • Duration: {placement.duration}</p>
                  <p className="text-xs text-slate-500">Mode: {placement.workMode} ({placement.workLocation})</p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/tp/internships/${internship.id}`)}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:text-[#2563eb] font-bold text-xs rounded-xl cursor-pointer"
                >
                  View Internship
                </button>
              </div>
            </div>

            {/* Placement Progress Timeline */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-extrabold text-[#0f172a]">Placement Progress Pipeline</h3>
              <div className="p-4 bg-slate-50 border rounded-2xl space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
                  {[
                    { title: 'Selected', date: placement.selectionDate, active: true },
                    { title: 'Offer Received', date: placement.offerDate, active: true },
                    { title: 'Offer Accepted', date: placement.offerAcceptanceDate, active: true },
                    { title: 'Joining', date: placement.joiningDate, active: ['Joining Soon', 'Ongoing', 'Completed'].includes(currentStatus) },
                    { title: 'Ongoing', date: '15 Aug 2026', active: ['Ongoing', 'Completed'].includes(currentStatus) },
                    { title: 'Completed', date: placement.expectedEndDate, active: currentStatus === 'Completed' },
                  ].map((step, idx) => (
                    <div key={step.title} className="flex items-center space-x-2">
                      <div className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold ${
                        step.active ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-white text-slate-400 border-slate-200'
                      }`}>
                        <span>{step.title}</span>
                        {step.active && <span className="ml-1">✓</span>}
                      </div>
                      {idx < 5 && <span className="text-slate-300">→</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Joining Information Card */}
            <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl space-y-2 text-xs">
              <h4 className="font-extrabold text-[#0f172a]">Joining & Onboarding Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-700 font-medium">
                <p>Joining Date: <strong>{placement.joiningDate}</strong></p>
                <p>Work Mode: <strong>{placement.workMode}</strong></p>
                <p>Reporting Contact: <strong>{placement.reportingContact}</strong></p>
              </div>
            </div>

            {/* Completion Information (If status == Completed) */}
            {currentStatus === 'Completed' && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2 text-xs text-emerald-900 font-medium">
                <h4 className="font-extrabold text-emerald-950 flex items-center space-x-1.5">
                  <Star className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                  <span>Placement Completion Summary & Feedback</span>
                </h4>
                <p>Completion Date: <strong>{placement.expectedEndDate}</strong></p>
                <p>Performance Rating: <strong className="text-emerald-700">{placement.performanceRating || 'N/A'}</strong></p>
                <p>Mentor Feedback: <em>"{placement.mentorFeedback || 'N/A'}"</em></p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
