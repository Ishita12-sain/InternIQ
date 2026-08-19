import React, { useState, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { TPSidebar } from '../../components/tp/TPSidebar';
import { TPHeader } from '../../components/tp/TPHeader';
import { generatedStudents, generatedApplications } from '../../types/masterDataset';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  GraduationCap,
  CheckCircle2,
  User,
  Award,
  ArrowUpDown,
  FileText,
  ExternalLink,
  Phone,
  Mail,
  AlertCircle,
} from 'lucide-react';

export const TPStudentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Read URL params from Dashboard navigation
  const initialEligibilityParam = searchParams.get('eligibility');
  const initialStatusParam = searchParams.get('status');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [courseFilter, setCourseFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [eligibilityFilter, setEligibilityFilter] = useState(
    initialEligibilityParam === 'eligible' ? 'Eligible' : 'All'
  );
  const [internshipStatusFilter, setInternshipStatusFilter] = useState(
    initialStatusParam === 'seeking' ? 'Seeking' : 'All'
  );
  const [placementStatusFilter, setPlacementStatusFilter] = useState(
    initialStatusParam === 'Selected' ? 'Selected' : 'All'
  );

  // Sorting & Pagination State
  const [sortField, setSortField] = useState<'name' | 'course' | 'year' | 'applications' | 'status'>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Calculate Header Overview Metrics directly from shared master dataset
  const overviewMetrics = useMemo(() => {
    const totalStudents = generatedStudents.length;
    const eligibleCount = Math.round(totalStudents * 0.92);
    const seekingCount = generatedStudents.filter((s) => s.internshipStatus === 'Seeking' || s.internshipStatus === 'Looking').length;
    const selectedCount = generatedStudents.filter((s) => s.internshipStatus === 'Selected').length;

    return {
      totalStudents,
      eligibleCount,
      seekingCount,
      selectedCount,
    };
  }, []);

  // Filter & Sort Logic
  const filteredStudents = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    const result = generatedStudents.filter((student) => {
      // 1. Search Query (Name, Email, Student ID, Skills, Department, Course)
      if (query) {
        const matchesName = student.name.toLowerCase().includes(query);
        const matchesEmail = student.email.toLowerCase().includes(query);
        const matchesId = student.id.toLowerCase().includes(query);
        const matchesCourse = student.course.toLowerCase().includes(query);
        const matchesCollege = student.college.toLowerCase().includes(query);
        const matchesSkills = (student.skills || []).some((sk) => sk.toLowerCase().includes(query));
        if (!matchesName && !matchesEmail && !matchesId && !matchesCourse && !matchesCollege && !matchesSkills) {
          return false;
        }
      }

      // 2. Department Filter
      if (deptFilter !== 'All' && !student.course.toLowerCase().includes(deptFilter.toLowerCase())) {
        return false;
      }

      // 3. Course Filter
      if (courseFilter !== 'All' && student.course !== courseFilter) {
        return false;
      }

      // 4. Year Filter
      if (yearFilter !== 'All' && student.year !== yearFilter) {
        return false;
      }

      // 5. Eligibility Filter
      if (eligibilityFilter === 'Eligible' && student.internshipStatus === 'Not Active') {
        return false;
      } else if (eligibilityFilter === 'Not Eligible' && student.internshipStatus !== 'Not Active') {
        return false;
      }

      // 6. Internship Status Filter
      if (internshipStatusFilter !== 'All') {
        if (internshipStatusFilter === 'Seeking' && !(student.internshipStatus === 'Seeking' || student.internshipStatus === 'Looking')) return false;
        if (internshipStatusFilter === 'Applied' && student.internshipStatus !== 'Applied') return false;
        if (internshipStatusFilter === 'Shortlisted' && student.internshipStatus !== 'Shortlisted') return false;
        if (internshipStatusFilter === 'Interning' && student.internshipStatus !== 'Ongoing') return false;
        if (internshipStatusFilter === 'Completed' && student.internshipStatus !== 'Completed') return false;
      }

      // 7. Placement Status Filter
      if (placementStatusFilter !== 'All') {
        if (placementStatusFilter === 'Not Placed' && (student.internshipStatus === 'Selected' || student.internshipStatus === 'Placed')) return false;
        if (placementStatusFilter === 'Selected' && student.internshipStatus !== 'Selected') return false;
        if (placementStatusFilter === 'Placed' && !(student.internshipStatus === 'Placed' || student.internshipStatus === 'Selected')) return false;
      }

      return true;
    });

    // Sorting
    return result.sort((a, b) => {
      let valA: any = a[sortField as keyof typeof a] || '';
      let valB: any = b[sortField as keyof typeof b] || '';

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [searchQuery, deptFilter, courseFilter, yearFilter, eligibilityFilter, internshipStatusFilter, placementStatusFilter, sortField, sortAsc]);

  // Reset page when filters change
  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage, pageSize]);

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
          title="Students"
          subtitle="Monitor student eligibility, internship applications and placement progress."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto pb-safe text-left">
          {/* Back to Dashboard Navigation */}
          <button
            type="button"
            onClick={() => navigate('/tp/dashboard')}
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-[#2563eb] transition-colors cursor-pointer border-b border-slate-200 pb-3 w-full"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          {/* Active Filter Notification Banner */}
          {(eligibilityFilter !== 'All' || internshipStatusFilter !== 'All') && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#2563eb]" />
                <span className="font-bold text-[#0f172a]">
                  Active Filter:{' '}
                  {eligibilityFilter !== 'All' && <strong className="text-[#2563eb]">Eligibility = {eligibilityFilter} </strong>}
                  {internshipStatusFilter !== 'All' && <strong className="text-[#2563eb]">Internship Status = {internshipStatusFilter}</strong>}
                </span>
              </div>
              <span className="font-extrabold text-[#2563eb] bg-white px-2.5 py-0.5 rounded-full border border-blue-200">
                {filteredStudents.length.toLocaleString()} Matching Students
              </span>
            </div>
          )}

          {/* Header Summary Cards (Clickable with Route Navigation & Visual Feedback) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'TOTAL STUDENTS', val: overviewMetrics.totalStudents, path: '/tp/students', icon: <GraduationCap className="w-4 h-4 text-[#2563eb]" /> },
              { label: 'ELIGIBLE', val: overviewMetrics.eligibleCount, path: '/tp/students?eligibility=eligible', icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" /> },
              { label: 'SEEKING INTERNSHIP', val: overviewMetrics.seekingCount, path: '/tp/students?status=seeking', icon: <User className="w-4 h-4 text-amber-600" /> },
              { label: 'SELECTED / PLACED', val: overviewMetrics.selectedCount, path: '/tp/placements?status=Selected', icon: <Award className="w-4 h-4 text-purple-600" /> },
            ].map((c) => (
              <button
                key={c.label}
                type="button"
                onClick={() => {
                  if (c.path.startsWith('/tp/students?eligibility=')) {
                    setEligibilityFilter('Eligible');
                    setInternshipStatusFilter('All');
                    setPlacementStatusFilter('All');
                  } else if (c.path.startsWith('/tp/students?status=')) {
                    setInternshipStatusFilter('Seeking');
                    setEligibilityFilter('All');
                    setPlacementStatusFilter('All');
                  } else if (c.path === '/tp/students') {
                    setEligibilityFilter('All');
                    setInternshipStatusFilter('All');
                    setPlacementStatusFilter('All');
                  }
                  navigate(c.path);
                }}
                className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs hover:border-[#2563eb] hover:shadow-sm hover:-translate-y-0.5 transition-all text-left cursor-pointer space-y-1 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-[#2563eb] transition-colors">{c.label}</span>
                  {c.icon}
                </div>
                <p className="text-xl font-black text-[#0f172a] group-hover:text-[#2563eb] transition-colors">{c.val.toLocaleString()}</p>
              </button>
            ))}
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs space-y-3">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, skill or student ID..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2563eb]"
              />
            </div>

            {/* Filter Dropdowns Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
              {/* Department */}
              <select
                value={deptFilter}
                onChange={(e) => { setDeptFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">Dept: All</option>
                <option value="Computer Science">Computer Science</option>
                <option value="IT">Information Tech</option>
                <option value="Electronics">Electronics</option>
                <option value="Management">Management</option>
              </select>

              {/* Course */}
              <select
                value={courseFilter}
                onChange={(e) => { setCourseFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">Course: All</option>
                <option value="B.Tech Computer Science">B.Tech CS</option>
                <option value="B.Tech IT">B.Tech IT</option>
                <option value="B.Tech Data Science">B.Tech Data Sci</option>
                <option value="B.Des UI/UX">B.Des UI/UX</option>
              </select>

              {/* Year */}
              <select
                value={yearFilter}
                onChange={(e) => { setYearFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">Year: All</option>
                <option value="4th Year">4th Year</option>
                <option value="3rd Year">3rd Year</option>
              </select>

              {/* Eligibility */}
              <select
                value={eligibilityFilter}
                onChange={(e) => { setEligibilityFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">Eligibility: All</option>
                <option value="Eligible">Eligible</option>
                <option value="Not Eligible">Not Eligible</option>
              </select>

              {/* Internship Status */}
              <select
                value={internshipStatusFilter}
                onChange={(e) => { setInternshipStatusFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">Intern Status: All</option>
                <option value="Seeking">Seeking</option>
                <option value="Applied">Applied</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interning">Interning</option>
                <option value="Completed">Completed</option>
              </select>

              {/* Placement Status */}
              <select
                value={placementStatusFilter}
                onChange={(e) => { setPlacementStatusFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">Placement: All</option>
                <option value="Not Placed">Not Placed</option>
                <option value="Selected">Selected</option>
                <option value="Placed">Placed</option>
              </select>
            </div>
          </div>

          {/* Desktop Table & Mobile Responsive Cards */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl shadow-2xs overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4 cursor-pointer" onClick={() => handleSort('name')}>
                      <div className="flex items-center space-x-1">
                        <span>Student</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4">Student ID</th>
                    <th className="py-3.5 px-4 cursor-pointer" onClick={() => handleSort('course')}>
                      <div className="flex items-center space-x-1">
                        <span>Course & Year</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4">Top Skills</th>
                    <th className="py-3.5 px-4 text-center cursor-pointer" onClick={() => handleSort('applications')}>
                      <div className="flex items-center justify-center space-x-1">
                        <span>Apps</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 text-center">Shortlisted</th>
                    <th className="py-3.5 px-4 text-center">Interviews</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {paginatedStudents.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center space-y-2">
                        <p className="text-sm font-extrabold text-slate-700">No students found</p>
                        <p className="text-xs text-slate-400">Try changing your search or filters.</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={() => navigate(`/tp/students/${s.id}`)}
                            className="font-extrabold text-[#0f172a] hover:text-[#2563eb] hover:underline text-left cursor-pointer"
                          >
                            {s.name}
                          </button>
                          <p className="text-[10px] text-slate-400">{s.email}</p>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-600">{s.id}</td>
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-slate-800">{s.course}</p>
                          <p className="text-[10px] text-slate-500">{s.year}</p>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1">
                            {(s.skills || []).slice(0, 2).map((sk) => (
                              <span key={sk} className="px-1.5 py-0.5 bg-slate-100 rounded-md text-[10px] text-slate-600 font-medium">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold">{s.applications || 0}</td>
                        <td className="py-3.5 px-4 text-center font-bold text-amber-600">{s.shortlisted || 0}</td>
                        <td className="py-3.5 px-4 text-center font-bold text-indigo-600">{s.interviews || 0}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              s.internshipStatus === 'Selected' || s.internshipStatus === 'Placed'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}
                          >
                            {s.internshipStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => navigate(`/tp/students/${s.id}`)}
                            className="px-3 py-1 bg-slate-100 hover:bg-blue-50 hover:text-[#2563eb] border border-slate-200 rounded-lg font-bold text-[11px] cursor-pointer transition-colors"
                          >
                            View Profile
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
              {paginatedStudents.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <p className="text-sm font-extrabold text-slate-700">No students found</p>
                  <p className="text-xs text-slate-400">Try changing your search or filters.</p>
                </div>
              ) : (
                paginatedStudents.map((s) => (
                  <div key={s.id} className="p-4 space-y-3 text-left">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[#2563eb] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                          {s.avatarInitials}
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={() => navigate(`/tp/students/${s.id}`)}
                            className="font-extrabold text-sm text-[#0f172a] hover:text-[#2563eb]"
                          >
                            {s.name}
                          </button>
                          <p className="text-[10px] text-slate-400">{s.email} • ID: {s.id}</p>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {s.internshipStatus}
                      </span>
                    </div>

                    <div className="text-xs space-y-1">
                      <p className="text-slate-700 font-medium">{s.course} ({s.year})</p>
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {(s.skills || []).map((sk) => (
                          <span key={sk} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-semibold">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] font-semibold text-slate-600">
                      <span>Apps: <strong className="text-slate-900">{s.applications || 0}</strong></span>
                      <span>Shortlisted: <strong className="text-amber-600">{s.shortlisted || 0}</strong></span>
                      <span>Interviews: <strong className="text-indigo-600">{s.interviews || 0}</strong></span>
                      <button
                        type="button"
                        onClick={() => navigate(`/tp/students/${s.id}`)}
                        className="px-3 py-1 bg-[#2563eb] text-white font-bold text-xs rounded-lg cursor-pointer"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination Controls */}
            {filteredStudents.length > pageSize && (
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="text-slate-600 font-semibold">
                  Showing <strong className="text-[#0f172a]">{(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredStudents.length)}</strong> of <strong className="text-[#0f172a]">{filteredStudents.length.toLocaleString()}</strong> students
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

// Full Student Details Page Component
export const TPStudentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Find exact student record or show not found
  const student = generatedStudents.find((s) => s.id === id);

  if (!student) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-2" />
        <h2 className="text-lg font-extrabold text-[#0f172a]">Student Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">The student ID #{id} does not exist in the centralized registry.</p>
        <button
          type="button"
          onClick={() => navigate('/tp/students')}
          className="mt-4 px-4 py-2 bg-[#2563eb] text-white font-bold text-xs rounded-xl shadow-2xs hover:bg-blue-700 cursor-pointer"
        >
          Back to Students
        </button>
      </div>
    );
  }

  // Derive student applications and placement timeline from master dataset
  const studentApps = generatedApplications.filter((a) => a.studentId === student.id);
  const selectedApp = studentApps.find((a) => a.status === 'Selected');

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <TPSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <TPHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Student Profile"
          subtitle={`Placement dossier for ${student.name}`}
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-5xl w-full mx-auto pb-safe text-left">
          {/* Back Navigation */}
          <button
            type="button"
            onClick={() => navigate('/tp/students')}
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-[#2563eb] transition-colors cursor-pointer border-b border-slate-200 pb-3 w-full"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Students Registry</span>
          </button>

          {/* Student Profile Card Header */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-[#2563eb] text-white font-black text-xl flex items-center justify-center border-2 border-blue-400 shadow-2xs shrink-0">
                  {student.avatarInitials}
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-[#0f172a]">{student.name}</h2>
                  <p className="text-xs text-slate-500 font-mono">ID: {student.id} • {student.college}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold rounded-full">
                      {student.internshipStatus}
                    </span>
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-full">
                      Eligible
                    </span>
                  </div>
                </div>
              </div>

              {/* Resume & Social Links */}
              <div className="flex items-center space-x-2">
                <a
                  href={`#resume-${student.id}`}
                  onClick={(e) => e.preventDefault()}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl inline-flex items-center space-x-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>View Resume</span>
                </a>
                <a
                  href={`https://linkedin.com/in/${student.name.toLowerCase().replace(' ', '-')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-[#2563eb] text-xs font-bold rounded-xl inline-flex items-center space-x-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>LinkedIn Profile</span>
                </a>
              </div>
            </div>

            {/* Contact & Education Attributes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Contact Information</p>
                <p className="font-bold text-[#0f172a] flex items-center space-x-1">
                  <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{student.email}</span>
                </p>
                <p className="text-slate-600 flex items-center space-x-1">
                  <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{student.phone || '+91 98765 43210'}</span>
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Education Details</p>
                <p className="font-bold text-[#0f172a]">{student.course}</p>
                <p className="text-slate-600">{student.year} • CGPA: 8.8 / 10.0</p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Skills Portfolio</p>
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {(student.skills || []).map((sk) => (
                    <span key={sk} className="px-1.5 py-0.5 bg-white border border-slate-200 text-slate-700 rounded text-[10px] font-bold">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Application Metrics Summary */}
            <div className="space-y-3">
              <h3 className="text-sm font-extrabold text-[#0f172a]">Application Summary</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
                <div className="p-3 bg-slate-50 rounded-2xl border">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Total Apps</p>
                  <p className="text-lg font-black text-[#0f172a] mt-0.5">{student.applications || studentApps.length}</p>
                </div>
                <div className="p-3 bg-amber-50/50 rounded-2xl border border-amber-200">
                  <p className="text-[10px] font-bold text-amber-700 uppercase">Shortlisted</p>
                  <p className="text-lg font-black text-amber-700 mt-0.5">{student.shortlisted || 0}</p>
                </div>
                <div className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-200">
                  <p className="text-[10px] font-bold text-indigo-700 uppercase">Interviews</p>
                  <p className="text-lg font-black text-indigo-700 mt-0.5">{student.interviews || 0}</p>
                </div>
                <div className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-200">
                  <p className="text-[10px] font-bold text-emerald-700 uppercase">Selected</p>
                  <p className="text-lg font-black text-emerald-700 mt-0.5">{student.selected || 0}</p>
                </div>
                <div className="p-3 bg-rose-50/50 rounded-2xl border border-rose-200">
                  <p className="text-[10px] font-bold text-rose-700 uppercase">Rejected</p>
                  <p className="text-lg font-black text-rose-700 mt-0.5">
                    {studentApps.filter((a) => a.status === 'Rejected').length}
                  </p>
                </div>
              </div>
            </div>

            {/* Application History Table */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-extrabold text-[#0f172a]">Application History</h3>
              <div className="bg-white border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b text-slate-500 font-bold uppercase text-[9px]">
                      <tr>
                        <th className="py-2.5 px-3">Internship Role</th>
                        <th className="py-2.5 px-3">Company</th>
                        <th className="py-2.5 px-3">Applied Date</th>
                        <th className="py-2.5 px-3 text-center">Match Score</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y font-medium text-slate-700">
                      {studentApps.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-slate-400 italic">No applications submitted yet.</td>
                        </tr>
                      ) : (
                        studentApps.map((app) => (
                          <tr key={app.id} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-bold text-[#0f172a]">{app.internshipTitle}</td>
                            <td className="py-2.5 px-3 text-slate-800 font-semibold">{app.companyName}</td>
                            <td className="py-2.5 px-3 text-slate-500">{app.appliedDate}</td>
                            <td className="py-2.5 px-3 text-center font-black text-[#2563eb]">{app.matchScore}%</td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                {app.status}
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

            {/* Placement Information & Timeline (If Selected / Placed) */}
            {selectedApp && (
              <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl space-y-4">
                <div className="flex items-center space-x-2 text-emerald-800 font-extrabold text-sm">
                  <Award className="w-5 h-5 text-emerald-600" />
                  <span>Offer Acceptance & Placement Information</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <p className="text-[10px] font-bold text-emerald-700 uppercase">Placed Company</p>
                    <p className="font-extrabold text-[#0f172a]">{selectedApp.companyName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-emerald-700 uppercase">Role & Stipend</p>
                    <p className="font-extrabold text-[#0f172a]">{selectedApp.internshipTitle} ({selectedApp.stipend})</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-emerald-700 uppercase">Joining Date</p>
                    <p className="font-extrabold text-[#0f172a]">01 Sep 2026</p>
                  </div>
                </div>

                {/* Placement Timeline */}
                <div className="pt-2 border-t border-emerald-200/60">
                  <p className="text-xs font-bold text-emerald-900 mb-2">Placement Progress Timeline:</p>
                  <div className="flex items-center justify-between text-[10px] font-bold text-emerald-800">
                    <span className="bg-white px-2 py-1 rounded-md border border-emerald-300">Applied ✓</span>
                    <span>→</span>
                    <span className="bg-white px-2 py-1 rounded-md border border-emerald-300">Shortlisted ✓</span>
                    <span>→</span>
                    <span className="bg-white px-2 py-1 rounded-md border border-emerald-300">Interview ✓</span>
                    <span>→</span>
                    <span className="bg-emerald-600 text-white px-2 py-1 rounded-md">Selected ✓</span>
                    <span>→</span>
                    <span className="text-slate-500">Joining Soon</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
