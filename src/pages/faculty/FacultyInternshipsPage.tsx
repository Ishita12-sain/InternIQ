import React, { useState, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { FacultySidebar } from '../../components/faculty/FacultySidebar';
import { FacultyHeader } from '../../components/faculty/FacultyHeader';
import {
  generatedInternships,
  generatedApplications,
  generatedCompanies,
  generatedStudents,
  generatedInterviews,
  generatedPlacements,
} from '../../types/masterDataset';
import {
  Search,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  FileText,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  Calendar,
  Briefcase,
  GraduationCap,
} from 'lucide-react';

// ==================================================
// 1. FACULTY INTERNSHIPS PAGE COMPONENT
// ==================================================
export const FacultyInternshipsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const rawStatusParam = searchParams.get('status');
  const rawCompanyIdParam = searchParams.get('companyId');

  const normalizeStatus = (param: string | null): string => {
    if (!param) return 'All';
    const lower = param.toLowerCase();
    if (lower === 'active') return 'Active';
    if (lower === 'upcoming') return 'Upcoming';
    if (lower === 'ongoing') return 'Ongoing';
    if (lower === 'completed') return 'Completed';
    if (lower === 'closed') return 'Closed';
    return 'All';
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(normalizeStatus(rawStatusParam));
  const [workModeFilter, setWorkModeFilter] = useState('All');
  const [companyFilter, setCompanyFilter] = useState(
    rawCompanyIdParam ? generatedCompanies.find((c) => c.id === rawCompanyIdParam)?.name || 'All' : 'All'
  );
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Calculate summary metrics directly from shared datasets
  const metrics = useMemo(() => {
    const totalInternships = generatedInternships.length;
    const active = generatedInternships.filter((i) => i.status === 'Active').length;
    const upcoming = generatedInternships.filter((i) => i.status === 'Pending Review' || i.status === 'Draft' || i.status === 'Expiring Soon').length;
    const ongoing = generatedPlacements.filter((p) => p.status === 'Ongoing' || p.status === 'Joining Soon').length;
    const completed = generatedPlacements.filter((p) => p.status === 'Completed').length;
    const totalApps = generatedApplications.length;
    const selectedStudents = generatedApplications.filter((a) => a.status === 'Selected').length;

    return { totalInternships, active, upcoming, ongoing, completed, totalApps, selectedStudents };
  }, []);

  const filteredInternships = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return generatedInternships.filter((i) => {
      if (q) {
        const matchTitle = i.title.toLowerCase().includes(q);
        const matchCompany = i.companyName.toLowerCase().includes(q);
        const matchLocation = i.location.toLowerCase().includes(q);
        const matchId = i.id.toLowerCase().includes(q);
        const matchSkills = (i.skills || []).some((sk) => sk.toLowerCase().includes(q));
        if (!matchTitle && !matchCompany && !matchLocation && !matchId && !matchSkills) return false;
      }
      if (statusFilter !== 'All') {
        if (statusFilter === 'Active' && i.status !== 'Active') return false;
        if (statusFilter === 'Upcoming' && !(i.status === 'Pending Review' || i.status === 'Draft' || i.status === 'Expiring Soon')) return false;
        if (statusFilter === 'Closed' && i.status !== 'Closed') return false;
        if (statusFilter === 'Ongoing' && i.status !== 'Active') return false;
        if (statusFilter === 'Completed' && i.status !== 'Closed') return false;
      }
      if (workModeFilter !== 'All' && i.workMode !== workModeFilter) return false;
      if (companyFilter !== 'All' && i.companyName !== companyFilter) return false;
      return true;
    });
  }, [searchQuery, statusFilter, workModeFilter, companyFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredInternships.length / pageSize));
  const paginatedInternships = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredInternships.slice(start, start + pageSize);
  }, [filteredInternships, currentPage, pageSize]);

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <FacultySidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <FacultyHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Internships"
          subtitle="Monitor internship opportunities and the participation of your mentees."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto pb-safe text-left">
          <button
            type="button"
            onClick={() => navigate('/faculty/dashboard')}
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-indigo-600 cursor-pointer border-b border-slate-200 pb-3 w-full"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          {/* Active Filter Banner */}
          {statusFilter !== 'All' && (
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center justify-between text-xs gap-2">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="font-bold text-[#0f172a]">
                  Active Status Filter: <strong className="text-indigo-600">{statusFilter}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('All');
                  setCurrentPage(1);
                  navigate('/faculty/internships');
                }}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl font-bold text-[11px] cursor-pointer"
              >
                Clear Filter
              </button>
            </div>
          )}

          {/* 7 Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {[
              { label: 'TOTAL INTERNSHIPS', val: metrics.totalInternships, status: 'All', path: '/faculty/internships', icon: <Briefcase className="w-4 h-4 text-[#2563eb]" /> },
              { label: 'ACTIVE', val: metrics.active, status: 'Active', path: '/faculty/internships?status=active', icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" /> },
              { label: 'UPCOMING', val: metrics.upcoming, status: 'Upcoming', path: '/faculty/internships?status=upcoming', icon: <Clock className="w-4 h-4 text-amber-500" /> },
              { label: 'ONGOING', val: metrics.ongoing, status: 'Ongoing', path: '/faculty/internships?status=ongoing', icon: <Clock className="w-4 h-4 text-indigo-600" /> },
              { label: 'COMPLETED', val: metrics.completed, status: 'Completed', path: '/faculty/internships?status=completed', icon: <GraduationCap className="w-4 h-4 text-purple-600" /> },
              { label: 'APPLICATIONS', val: metrics.totalApps, status: 'All', path: '/faculty/applications', icon: <FileText className="w-4 h-4 text-slate-700" /> },
              { label: 'SELECTED STUDENTS', val: metrics.selectedStudents, status: 'All', path: '/faculty/applications?status=selected', icon: <Award className="w-4 h-4 text-emerald-600" /> },
            ].map((c) => (
              <button
                key={c.label}
                type="button"
                onClick={() => {
                  setStatusFilter(c.status);
                  setCurrentPage(1);
                  navigate(c.path);
                }}
                className={`bg-white border rounded-2xl p-3.5 shadow-2xs hover:border-indigo-600 hover:shadow-xs hover:-translate-y-0.5 transition-all text-left cursor-pointer space-y-1 group ${
                  statusFilter === c.status
                    ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/20'
                    : 'border-[#e2e8f0]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-extrabold tracking-wider text-slate-500 group-hover:text-indigo-600 truncate">{c.label}</span>
                  {c.icon}
                </div>
                <p className="text-xl font-black text-[#0f172a] group-hover:text-indigo-600">{c.val.toLocaleString()}</p>
              </button>
            ))}
          </div>

          {/* Search & Toolbar */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs space-y-3">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search internship, company or location..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">Status: All</option>
                <option value="Active">Active</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Closed">Closed</option>
              </select>

              <select
                value={workModeFilter}
                onChange={(e) => { setWorkModeFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">Work Mode: All</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>

              <select
                value={companyFilter}
                onChange={(e) => { setCompanyFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">Company: All</option>
                {generatedCompanies.slice(0, 15).map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Internships Table */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Internship Role</th>
                    <th className="py-3.5 px-4">Company</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Work Mode</th>
                    <th className="py-3.5 px-4">Duration</th>
                    <th className="py-3.5 px-4 font-bold text-emerald-600">Stipend</th>
                    <th className="py-3.5 px-4 text-center">Applications</th>
                    <th className="py-3.5 px-4 text-center font-bold text-emerald-600">Selected</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {paginatedInternships.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-slate-400 font-semibold space-y-1">
                        <p>No internships found</p>
                        <p className="text-[11px] text-slate-400 font-normal">Try changing your filters or search query.</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedInternships.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4 font-extrabold text-[#0f172a]">
                          <button
                            type="button"
                            onClick={() => navigate(`/faculty/internships/${item.id}`)}
                            className="hover:text-indigo-600 text-left cursor-pointer"
                          >
                            {item.title}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          <button
                            type="button"
                            onClick={() => navigate(`/faculty/companies/${item.companyId}`)}
                            className="hover:text-indigo-600 text-left cursor-pointer"
                          >
                            {item.companyName}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">{item.location}</td>
                        <td className="py-3.5 px-4 text-slate-600">{item.workMode}</td>
                        <td className="py-3.5 px-4 text-slate-600">{item.duration}</td>
                        <td className="py-3.5 px-4 font-black text-emerald-600">{item.stipend}</td>
                        <td className="py-3.5 px-4 text-center font-bold text-blue-600">{item.applicationsCount}</td>
                        <td className="py-3.5 px-4 text-center font-black text-emerald-600">{item.selected || 0}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => navigate(`/faculty/internships/${item.id}`)}
                            className="px-3 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 font-bold text-[11px] rounded-lg cursor-pointer"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredInternships.length > pageSize && (
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="text-slate-600 font-semibold">
                  Showing <strong>{(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredInternships.length)}</strong> of <strong>{filteredInternships.length}</strong> internships
                </span>
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-xl border bg-white hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1 bg-white border rounded-xl font-bold text-indigo-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-xl border bg-white hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
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

// Full Faculty Internship Details Component
export const FacultyInternshipDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const internship = generatedInternships.find((i) => i.id === id);

  if (!internship) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-2" />
        <h2 className="text-lg font-extrabold text-[#0f172a]">Internship Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">Listing ID #{id} does not exist in the master dataset.</p>
        <button
          type="button"
          onClick={() => navigate('/faculty/internships')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl cursor-pointer"
        >
          Back to Internships
        </button>
      </div>
    );
  }

  const company = generatedCompanies.find((c) => c.id === internship.companyId);

  // Applications belonging exclusively to THIS internship
  const internshipApps = useMemo(() => {
    return generatedApplications.filter((a) => a.internshipId === internship.id);
  }, [internship]);

  // Mentee Applications belonging to THIS internship
  const menteeIds = useMemo(() => {
    return new Set(
      generatedStudents
        .filter((s) => s.facultyId === 'fac-1' || parseInt(s.id.replace('st-', ''), 10) % 64 === 1)
        .map((s) => s.id)
    );
  }, []);

  const menteeAppsForInternship = useMemo(() => {
    return internshipApps.filter((a) => menteeIds.has(a.studentId));
  }, [internshipApps, menteeIds]);

  const selectedStudentsForInternship = useMemo(() => {
    return internshipApps.filter((a) => a.status === 'Selected');
  }, [internshipApps]);

  const appMetrics = useMemo(() => {
    const totalApps = internshipApps.length;
    const underReview = internshipApps.filter((a) => a.status === 'Under Review').length;
    const shortlisted = internshipApps.filter((a) => a.status === 'Shortlisted').length;
    const interview = internshipApps.filter((a) => a.status === 'Interview').length;
    const selected = internshipApps.filter((a) => a.status === 'Selected').length;
    const rejected = internshipApps.filter((a) => a.status === 'Rejected').length;

    return { totalApps, underReview, shortlisted, interview, selected, rejected };
  }, [internshipApps]);

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <FacultySidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <FacultyHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Internship Listing Dossier"
          subtitle={`Posting #${internship.id} • ${internship.title}`}
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-5xl w-full mx-auto pb-safe text-left">
          <button
            type="button"
            onClick={() => navigate('/faculty/internships')}
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-indigo-600 cursor-pointer border-b border-slate-200 pb-3 w-full"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Internships</span>
          </button>

          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Listing ID: #{internship.id}</span>
                <h2 className="text-xl font-extrabold text-[#0f172a]">{internship.title}</h2>
                <p className="text-xs text-slate-500">
                  <button type="button" onClick={() => navigate(`/faculty/companies/${internship.companyId}`)} className="hover:text-indigo-600 font-bold">
                    {internship.companyName}
                  </button>{' '}
                  • {internship.location} ({internship.workMode})
                </p>
                <p className="text-xs font-bold text-emerald-600 mt-1">{internship.stipend} • Duration: {internship.duration}</p>
              </div>

              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full">
                Status: {internship.status}
              </span>
            </div>

            {/* Company Information Card */}
            <div className="p-4 bg-slate-50 border rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-white font-bold flex items-center justify-center text-xs shrink-0">
                  {company?.avatarInitials || 'CO'}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => navigate(`/faculty/companies/${internship.companyId}`)}
                    className="font-extrabold text-[#0f172a] hover:text-indigo-600 text-left"
                  >
                    {internship.companyName}
                  </button>
                  <p className="text-slate-500 text-[11px]">{company?.industry || 'Technology & Engineering'} • {company?.location || internship.location}</p>
                </div>
              </div>

              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                {company?.verificationStatus || 'Verified Partner'}
              </span>
            </div>

            {/* Role Requirements & Specifications */}
            <div className="space-y-4 text-xs text-slate-700 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <h3 className="font-extrabold text-[#0f172a]">Role Description</h3>
                <p>{internship.description || 'Not provided'}</p>
              </div>

              <div className="space-y-1">
                <h3 className="font-extrabold text-[#0f172a]">Key Responsibilities</h3>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                  {(internship.responsibilities || []).length > 0
                    ? internship.responsibilities.map((r, i) => <li key={i}>{r}</li>)
                    : <li>Not provided</li>}
                </ul>
              </div>

              <div className="space-y-1">
                <h3 className="font-extrabold text-[#0f172a]">Eligibility & Required Skills</h3>
                <p className="text-slate-600">Eligibility: {internship.eligibility || 'Not provided'}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(internship.skills || []).map((sk) => (
                    <span key={sk} className="px-2 py-0.5 bg-slate-100 border text-slate-700 font-semibold text-[11px] rounded-lg">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Internship Participation Progress */}
            <div className="space-y-3 pt-1">
              <h3 className="text-sm font-extrabold text-[#0f172a]">Internship Candidate Pipeline</h3>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
                <button
                  type="button"
                  onClick={() => navigate(`/faculty/applications?internshipId=${internship.id}`)}
                  className="p-3 bg-slate-50 border rounded-2xl hover:border-indigo-600 transition-colors text-left"
                >
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Applications</span>
                  <strong className="text-base text-[#0f172a] font-black">{appMetrics.totalApps}</strong>
                </button>

                <div className="p-3 bg-slate-50 border rounded-2xl text-left">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Under Review</span>
                  <strong className="text-base text-amber-600 font-black">{appMetrics.underReview}</strong>
                </div>

                <div className="p-3 bg-slate-50 border rounded-2xl text-left">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Shortlisted</span>
                  <strong className="text-base text-purple-600 font-black">{appMetrics.shortlisted}</strong>
                </div>

                <div className="p-3 bg-slate-50 border rounded-2xl text-left">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Interview</span>
                  <strong className="text-base text-indigo-600 font-black">{appMetrics.interview}</strong>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/faculty/applications?internshipId=${internship.id}&status=selected`)}
                  className="p-3 bg-slate-50 border rounded-2xl hover:border-indigo-600 transition-colors text-left"
                >
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Selected</span>
                  <strong className="text-base text-emerald-600 font-black">{appMetrics.selected}</strong>
                </button>

                <button
                  type="button"
                  onClick={() => navigate(`/faculty/applications?internshipId=${internship.id}&status=ongoing`)}
                  className="p-3 bg-slate-50 border rounded-2xl hover:border-indigo-600 transition-colors text-left"
                >
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Ongoing</span>
                  <strong className="text-base text-blue-600 font-black">{appMetrics.selected}</strong>
                </button>
              </div>
            </div>

            {/* MENTEES PARTICIPATION SECTION */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-extrabold text-[#0f172a]">Your Mentees Applied ({menteeAppsForInternship.length})</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b text-slate-600 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Course & Year</th>
                      <th className="py-3 px-4">Applied Date</th>
                      <th className="py-3 px-4 font-bold text-indigo-600">Match Score</th>
                      <th className="py-3 px-4">Application Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-medium text-slate-700">
                    {menteeAppsForInternship.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-slate-400">
                          No mentees have applied to this internship.
                        </td>
                      </tr>
                    ) : (
                      menteeAppsForInternship.map((a) => (
                        <tr key={a.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-bold text-[#0f172a]">
                            <button type="button" onClick={() => navigate(`/faculty/students/${a.studentId}`)} className="hover:text-indigo-600">
                              {a.candidateName}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-slate-600">{a.course || 'B.Tech CS'} ({a.year || '4th Year'})</td>
                          <td className="py-3 px-4 text-slate-500">{a.appliedDate}</td>
                          <td className="py-3 px-4 font-bold text-indigo-600">{a.matchScore}%</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              {a.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => navigate(`/faculty/applications/${a.id}`)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 font-bold text-[11px] rounded-lg cursor-pointer"
                            >
                              Application
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SELECTION SUMMARY */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-extrabold text-[#0f172a]">Selected Candidates Summary ({selectedStudentsForInternship.length})</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b text-slate-600 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Course</th>
                      <th className="py-3 px-4">Selection Date</th>
                      <th className="py-3 px-4">Placement Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-medium text-slate-700">
                    {selectedStudentsForInternship.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-slate-400">
                          No candidates selected yet.
                        </td>
                      </tr>
                    ) : (
                      selectedStudentsForInternship.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-bold text-[#0f172a]">
                            <button type="button" onClick={() => navigate(`/faculty/students/${s.studentId}`)} className="hover:text-indigo-600">
                              {s.candidateName}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-slate-600">{s.course || 'B.Tech CS'}</td>
                          <td className="py-3 px-4 text-slate-500">{s.appliedDate}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Offer Confirmed
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
        </main>
      </div>
    </div>
  );
};

// ==================================================
// 2. FACULTY APPLICATIONS PAGE COMPONENT
// ==================================================
export const FacultyApplicationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const rawStatusParam = searchParams.get('status');
  const rawInternshipIdParam = searchParams.get('internshipId');

  const normalizeStatus = (param: string | null): string => {
    if (!param) return 'All';
    const lower = param.toLowerCase();
    if (lower === 'new') return 'New';
    if (lower === 'under-review' || lower === 'under review') return 'Under Review';
    if (lower === 'shortlisted') return 'Shortlisted';
    if (lower === 'interview') return 'Interview';
    if (lower === 'selected') return 'Selected';
    if (lower === 'rejected') return 'Rejected';
    return 'All';
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(normalizeStatus(rawStatusParam));
  const [companyFilter, setCompanyFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter applications belonging to assigned mentees
  const menteeIds = useMemo(() => {
    return new Set(
      generatedStudents
        .filter((s) => s.facultyId === 'fac-1' || parseInt(s.id.replace('st-', ''), 10) % 64 === 1)
        .map((s) => s.id)
    );
  }, []);

  const menteeApps = useMemo(() => {
    return generatedApplications.filter((a) => {
      if (rawInternshipIdParam && a.internshipId !== rawInternshipIdParam) return false;
      return menteeIds.has(a.studentId);
    });
  }, [menteeIds, rawInternshipIdParam]);

  // Summary Metrics calculated dynamically from shared dataset
  const metrics = useMemo(() => {
    const totalApps = menteeApps.length;
    const newApps = menteeApps.filter((a) => a.status === 'New').length;
    const underReview = menteeApps.filter((a) => a.status === 'Under Review').length;
    const shortlisted = menteeApps.filter((a) => a.status === 'Shortlisted').length;
    const interview = menteeApps.filter((a) => a.status === 'Interview').length;
    const selected = menteeApps.filter((a) => a.status === 'Selected').length;
    const rejected = menteeApps.filter((a) => a.status === 'Rejected').length;

    return { totalApps, newApps, underReview, shortlisted, interview, selected, rejected };
  }, [menteeApps]);

  const filteredApps = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return menteeApps.filter((a) => {
      if (q) {
        const matchStudent = a.candidateName.toLowerCase().includes(q);
        const matchStudentId = a.studentId.toLowerCase().includes(q);
        const matchCompany = a.companyName.toLowerCase().includes(q);
        const matchTitle = a.internshipTitle.toLowerCase().includes(q);
        const matchId = a.id.toLowerCase().includes(q);
        if (!matchStudent && !matchStudentId && !matchCompany && !matchTitle && !matchId) return false;
      }
      if (statusFilter !== 'All' && a.status !== statusFilter) return false;
      if (companyFilter !== 'All' && a.companyName !== companyFilter) return false;
      return true;
    });
  }, [menteeApps, searchQuery, statusFilter, companyFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredApps.length / pageSize));
  const paginatedApps = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredApps.slice(start, start + pageSize);
  }, [filteredApps, currentPage, pageSize]);

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <FacultySidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <FacultyHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Student Applications"
          subtitle="Track internship applications submitted by your mentees."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto pb-safe text-left">
          <button
            type="button"
            onClick={() => navigate('/faculty/dashboard')}
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-indigo-600 cursor-pointer border-b border-slate-200 pb-3 w-full"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          {/* Active Filter Banner */}
          {statusFilter !== 'All' && (
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center justify-between text-xs gap-2">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="font-bold text-[#0f172a]">
                  Active Status Filter: <strong className="text-indigo-600">{statusFilter}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('All');
                  setCurrentPage(1);
                  navigate('/faculty/applications');
                }}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl font-bold text-[11px] cursor-pointer"
              >
                Clear Filter
              </button>
            </div>
          )}

          {/* 7 Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {[
              { label: 'TOTAL APPLICATIONS', val: metrics.totalApps, status: 'All', path: '/faculty/applications', icon: <FileText className="w-4 h-4 text-slate-700" /> },
              { label: 'NEW', val: metrics.newApps, status: 'New', path: '/faculty/applications?status=new', icon: <Clock className="w-4 h-4 text-blue-500" /> },
              { label: 'UNDER REVIEW', val: metrics.underReview, status: 'Under Review', path: '/faculty/applications?status=under-review', icon: <Clock className="w-4 h-4 text-amber-500" /> },
              { label: 'SHORTLISTED', val: metrics.shortlisted, status: 'Shortlisted', path: '/faculty/applications?status=shortlisted', icon: <Clock className="w-4 h-4 text-purple-600" /> },
              { label: 'INTERVIEW', val: metrics.interview, status: 'Interview', path: '/faculty/applications?status=interview', icon: <Calendar className="w-4 h-4 text-indigo-600" /> },
              { label: 'SELECTED', val: metrics.selected, status: 'Selected', path: '/faculty/applications?status=selected', icon: <Award className="w-4 h-4 text-emerald-600" /> },
              { label: 'REJECTED', val: metrics.rejected, status: 'Rejected', path: '/faculty/applications?status=rejected', icon: <XCircle className="w-4 h-4 text-rose-500" /> },
            ].map((c) => (
              <button
                key={c.label}
                type="button"
                onClick={() => {
                  setStatusFilter(c.status);
                  setCurrentPage(1);
                  navigate(c.path);
                }}
                className={`bg-white border rounded-2xl p-3.5 shadow-2xs hover:border-indigo-600 hover:shadow-xs hover:-translate-y-0.5 transition-all text-left cursor-pointer space-y-1 group ${
                  statusFilter === c.status
                    ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/20'
                    : 'border-[#e2e8f0]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-extrabold tracking-wider text-slate-500 group-hover:text-indigo-600 truncate">{c.label}</span>
                  {c.icon}
                </div>
                <p className="text-xl font-black text-[#0f172a] group-hover:text-indigo-600">{c.val.toLocaleString()}</p>
              </button>
            ))}
          </div>

          {/* Search & Filter Controls */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs space-y-3">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search applications by student name, ID, company, internship..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">Status: All</option>
                <option value="New">New</option>
                <option value="Under Review">Under Review</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview">Interview</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>

              <select
                value={companyFilter}
                onChange={(e) => { setCompanyFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">Company: All</option>
                {generatedCompanies.slice(0, 15).map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4 font-mono">Application ID</th>
                    <th className="py-3.5 px-4">Student</th>
                    <th className="py-3.5 px-4">Internship Role</th>
                    <th className="py-3.5 px-4">Company</th>
                    <th className="py-3.5 px-4">Applied Date</th>
                    <th className="py-3.5 px-4 font-bold text-indigo-600">Match Score</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {paginatedApps.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400 font-semibold space-y-1">
                        <p>No applications found</p>
                        <p className="text-[11px] text-slate-400 font-normal">Try changing your filters or search query.</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedApps.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-500">
                          <button type="button" onClick={() => navigate(`/faculty/applications/${a.id}`)} className="hover:text-indigo-600">
                            {a.id}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[#0f172a]">
                          <button type="button" onClick={() => navigate(`/faculty/students/${a.studentId}`)} className="hover:text-indigo-600 text-left">
                            {a.candidateName}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          <button type="button" onClick={() => navigate(`/faculty/internships/${a.internshipId}`)} className="hover:text-indigo-600 text-left">
                            {a.internshipTitle}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          <button type="button" onClick={() => navigate(`/faculty/companies/${a.companyId}`)} className="hover:text-indigo-600 text-left">
                            {a.companyName}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">{a.appliedDate}</td>
                        <td className="py-3.5 px-4 font-black text-indigo-600">{a.matchScore}%</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            a.status === 'Selected' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>
                            {a.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => navigate(`/faculty/applications/${a.id}`)}
                            className="px-3 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 font-bold text-[11px] rounded-lg cursor-pointer"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredApps.length > pageSize && (
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="text-slate-600 font-semibold">
                  Showing <strong>{(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredApps.length)}</strong> of <strong>{filteredApps.length}</strong> applications
                </span>
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-xl border bg-white hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1 bg-white border rounded-xl font-bold text-indigo-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-xl border bg-white hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
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

// Full Faculty Application Details Component
export const FacultyApplicationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const app = generatedApplications.find((a) => a.id === id);

  if (!app) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-2" />
        <h2 className="text-lg font-extrabold text-[#0f172a]">Application Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">Application ID #{id} does not exist in the master dataset.</p>
        <button
          type="button"
          onClick={() => navigate('/faculty/applications')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl cursor-pointer"
        >
          Back to Applications
        </button>
      </div>
    );
  }

  const student = generatedStudents.find((s) => s.id === app.studentId);
  const interview = generatedInterviews.find((i) => i.applicationId === app.id);
  const placement = generatedPlacements.find((p) => p.applicationId === app.id || p.studentId === app.studentId);

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <FacultySidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <FacultyHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Application Details Dossier"
          subtitle={`Application #${app.id} • ${app.candidateName}`}
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-4xl w-full mx-auto pb-safe text-left">
          <button
            type="button"
            onClick={() => navigate('/faculty/applications')}
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-indigo-600 cursor-pointer border-b border-slate-200 pb-3 w-full"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Applications</span>
          </button>

          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Application ID: #{app.id}</span>
                <h2 className="text-xl font-extrabold text-[#0f172a]">
                  <button type="button" onClick={() => navigate(`/faculty/students/${app.studentId}`)} className="hover:text-indigo-600">
                    {app.candidateName}
                  </button>
                </h2>
                <p className="text-xs text-slate-500">
                  <button type="button" onClick={() => navigate(`/faculty/internships/${app.internshipId}`)} className="hover:text-indigo-600 font-bold">
                    {app.internshipTitle}
                  </button>{' '}
                  @{' '}
                  <button type="button" onClick={() => navigate(`/faculty/companies/${app.companyId}`)} className="hover:text-indigo-600 font-bold">
                    {app.companyName}
                  </button>
                </p>
              </div>

              <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-extrabold rounded-full">
                Status: {app.status}
              </span>
            </div>

            {/* Application Pipeline Timeline */}
            <div className="space-y-3">
              <h3 className="text-sm font-extrabold text-[#0f172a]">Application Status Pipeline</h3>
              <div className="p-4 bg-slate-50 border rounded-2xl">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
                  {[
                    { title: 'Applied', active: true },
                    { title: 'Under Review', active: app.status !== 'New' },
                    { title: 'Shortlisted', active: app.status === 'Shortlisted' || app.status === 'Interview' || app.status === 'Selected' },
                    { title: 'Interview', active: app.status === 'Interview' || app.status === 'Selected' },
                    { title: 'Selected', active: app.status === 'Selected' },
                  ].map((step, idx) => (
                    <div key={step.title} className="flex items-center space-x-2">
                      <div className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold ${
                        step.active ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-white text-slate-400 border-slate-200'
                      }`}>
                        <span>{step.title}</span>
                        {step.active && <span className="ml-1">✓</span>}
                      </div>
                      {idx < 4 && <span className="text-slate-300">→</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Application Details Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border rounded-2xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Applied Date</span>
                <strong className="text-[#0f172a]">{app.appliedDate}</strong>
              </div>
              <div className="p-3 bg-slate-50 border rounded-2xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Overall Match Score</span>
                <strong className="text-indigo-600 text-base font-black">{app.matchScore}%</strong>
              </div>
              <div className="p-3 bg-slate-50 border rounded-2xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Stipend</span>
                <strong className="text-emerald-600">{app.stipend || '₹35,000 / month'}</strong>
              </div>
              <div className="p-3 bg-slate-50 border rounded-2xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Course / Year</span>
                <strong className="text-slate-700">{student?.course || 'B.Tech CS'}</strong>
              </div>
            </div>

            {/* Skill Match Section */}
            <div className="space-y-2 pt-1">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase">Skill Match Analysis</h3>
              <div className="p-4 bg-slate-50 border rounded-2xl space-y-2 text-xs">
                <p>Matching Skills: <strong className="text-emerald-700">{(student?.skills || ['React', 'TypeScript', 'Node.js']).join(', ')}</strong></p>
                <p>Missing Skills: <span className="text-slate-500 italic">None identified</span></p>
              </div>
            </div>

            {/* Interview Information */}
            <div className="space-y-2 pt-1">
              <h3 className="text-sm font-extrabold text-[#0f172a]">Interview Information</h3>
              {interview ? (
                <div className="p-4 bg-indigo-50/50 border border-indigo-200 rounded-2xl space-y-1 text-xs text-indigo-950">
                  <p>Interview Date: <strong>{interview.date}</strong> @ <strong>{interview.time}</strong> ({interview.duration})</p>
                  <p>Round & Type: <strong>{interview.round}</strong> ({interview.type})</p>
                  <p>Location: <strong>{interview.location}</strong> • Status: <strong>{interview.status}</strong></p>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 border rounded-2xl text-xs text-slate-500">
                  No interview scheduled for this application.
                </div>
              )}
            </div>

            {/* Placement Information */}
            <div className="space-y-2 pt-1">
              <h3 className="text-sm font-extrabold text-[#0f172a]">Placement Information</h3>
              {placement ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1 text-xs text-emerald-950">
                  <p>Placement Status: <strong>{placement.status}</strong></p>
                  <p>Company: <strong>{placement.companyName}</strong> ({placement.internshipTitle})</p>
                  <p>Selection Date: <strong>{placement.selectionDate}</strong> • Joining Date: <strong>{placement.joiningDate}</strong></p>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 border rounded-2xl text-xs text-slate-500">
                  No placement record yet.
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate(`/faculty/students/${app.studentId}`)}
                className="px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-bold text-xs rounded-xl cursor-pointer"
              >
                View Mentee Profile →
              </button>
              <button
                type="button"
                onClick={() => navigate(`/faculty/internships/${app.internshipId}`)}
                className="px-4 py-2 bg-white border border-slate-200 hover:border-indigo-600 font-bold text-xs rounded-xl cursor-pointer"
              >
                View Internship Listing →
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
