import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import type { AdminStudentItem } from '../../types/adminTypes';
import { mockAdminStudents } from '../../types/adminTypes';
import {
  Search,
  Filter,
  GraduationCap,
  CheckCircle2,
  Clock,
  Briefcase,
  UserCheck,
  AlertOctagon,
  ArrowUpDown,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export const AdminStudentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [students, setStudents] = useState<AdminStudentItem[]>(mockAdminStudents);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filter States
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState<string>('All');
  const [yearFilter, setYearFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [completionFilter, setCompletionFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'profileCompletion' | 'name' | 'internshipStatus'>('profileCompletion');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Suspend / Activate Confirm Modal State
  const [actionStudent, setActionStudent] = useState<AdminStudentItem | null>(null);
  const [actionType, setActionType] = useState<'suspend' | 'activate' | null>(null);

  const studentListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Multi-field Filter & Search Logic
  const filteredStudents = students.filter((st) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      st.name.toLowerCase().includes(searchLower) ||
      st.email.toLowerCase().includes(searchLower) ||
      st.college.toLowerCase().includes(searchLower) ||
      (st.skills && st.skills.some((sk) => sk.toLowerCase().includes(searchLower)));

    const matchesCourse = courseFilter === 'All' || st.course.includes(courseFilter);
    const matchesYear = yearFilter === 'All' || st.year === yearFilter;
    const matchesStatus = statusFilter === 'All' || st.internshipStatus === statusFilter;

    let matchesCompletion = true;
    if (completionFilter === 'Complete') matchesCompletion = st.profileCompletion >= 90;
    else if (completionFilter === 'Good') matchesCompletion = st.profileCompletion >= 70 && st.profileCompletion < 90;
    else if (completionFilter === 'Incomplete') matchesCompletion = st.profileCompletion >= 50 && st.profileCompletion < 70;
    else if (completionFilter === 'Needs Attention') matchesCompletion = st.profileCompletion < 50;

    return matchesSearch && matchesCourse && matchesYear && matchesStatus && matchesCompletion;
  });

  // Sort Logic
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];
    if (sortOrder === 'asc') return valA > valB ? 1 : -1;
    return valA < valB ? 1 : -1;
  });

  // Pagination Calculation
  const totalPages = Math.max(Math.ceil(sortedStudents.length / itemsPerPage), 1);
  const paginatedStudents = sortedStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCardFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
    if (studentListRef.current) {
      studentListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setCourseFilter('All');
    setYearFilter('All');
    setStatusFilter('All');
    setCompletionFilter('All');
    setSortBy('profileCompletion');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  const handleConfirmStatusChange = () => {
    if (!actionStudent || !actionType) return;
    const newStatus = actionType === 'suspend' ? 'Suspended' : 'Active';
    setStudents((prev) =>
      prev.map((s) => (s.id === actionStudent.id ? { ...s, accountStatus: newStatus } : s))
    );

    setFeedback({
      type: actionType === 'suspend' ? 'error' : 'success',
      message: `Student "${actionStudent.name}" account has been ${actionType === 'suspend' ? 'suspended' : 'activated'} successfully.`,
    });
    setActionStudent(null);
    setActionType(null);
    setTimeout(() => setFeedback(null), 3500);
  };

  // Helper Badge Color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Selected':
      case 'Placed':
      case 'Ongoing':
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Interview':
      case 'Shortlisted':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Applied':
      case 'Under Review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Looking':
      case 'Seeking':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  // Profile Completion Color Helper
  const getCompletionBadge = (score: number) => {
    if (score >= 90) return { label: 'Complete', color: 'bg-emerald-500' };
    if (score >= 70) return { label: 'Good', color: 'bg-blue-500' };
    if (score >= 50) return { label: 'Incomplete', color: 'bg-amber-500' };
    return { label: 'Needs Attention', color: 'bg-rose-500' };
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Students Management"
          subtitle="Manage student profiles, internship activity and placement progress."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto pb-safe text-left">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-[#0f172a]">Student Directory</h2>
              <p className="text-xs text-slate-500">
                1,420 total registered students across partner institutions
              </p>
            </div>
            {(courseFilter !== 'All' || yearFilter !== 'All' || statusFilter !== 'All' || completionFilter !== 'All' || search) && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold shrink-0 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear Filters</span>
              </button>
            )}
          </div>

          {/* Toast Notification */}
          {feedback && (
            <div
              className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center space-x-2 animate-in fade-in duration-150 ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* 6 Clickable Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {[
              { label: 'Total Students', val: '1,420', status: 'All', icon: <GraduationCap className="w-4 h-4 text-[#2563eb]" /> },
              { label: 'Active Students', val: '1,380', status: 'All', icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" /> },
              { label: 'Seeking Internship', val: '450', status: 'Looking', icon: <Clock className="w-4 h-4 text-purple-600" /> },
              { label: 'Internship Ongoing', val: '215', status: 'Ongoing', icon: <Briefcase className="w-4 h-4 text-amber-600" /> },
              { label: 'Completed', val: '180', status: 'Completed', icon: <UserCheck className="w-4 h-4 text-indigo-600" /> },
              { label: 'Selected Students', val: '312', status: 'Selected', icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" /> },
            ].map((card) => (
              <button
                key={card.label}
                type="button"
                onClick={() => handleCardFilter(card.status)}
                className={`bg-white border rounded-2xl p-4 shadow-2xs space-y-1.5 cursor-pointer transition-all duration-150 text-left w-full focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 ${
                  statusFilter === card.status ? 'border-[#2563eb] ring-2 ring-[#2563eb]/20 bg-blue-50/20' : 'border-[#e2e8f0] hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate">{card.label}</span>
                  {card.icon}
                </div>
                <p className="text-2xl font-black text-[#0f172a]">{card.val}</p>
              </button>
            ))}
          </div>

          {/* Filters & Multi-Search Toolbar */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by name, email, college, skill..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#2563eb]"
              />
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600">
                <Filter className="w-3.5 h-3.5 text-[#2563eb]" />
                <span>Course:</span>
                <select
                  value={courseFilter}
                  onChange={(e) => {
                    setCourseFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs text-slate-800 font-bold focus:outline-none"
                >
                  <option value="All">All Courses</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">IT</option>
                  <option value="Software Engineering">Software Eng</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Data Science">Data Science</option>
                </select>
              </div>

              <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600">
                <span>Year:</span>
                <select
                  value={yearFilter}
                  onChange={(e) => {
                    setYearFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs text-slate-800 font-bold focus:outline-none"
                >
                  <option value="All">All Years</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>

              <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600">
                <span>Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs text-slate-800 font-bold focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Looking">Looking</option>
                  <option value="Applied">Applied</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview">Interview</option>
                  <option value="Selected">Selected</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600 pl-2 border-l border-slate-200">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#2563eb]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs text-slate-800 font-bold focus:outline-none"
                >
                  <option value="profileCompletion">Completion</option>
                  <option value="name">Name</option>
                  <option value="internshipStatus">Status</option>
                </select>
                <button
                  type="button"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-2 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer"
                >
                  {sortOrder.toUpperCase()}
                </button>
              </div>
            </div>
          </div>

          {/* Student List Section */}
          <div ref={studentListRef} className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4 scroll-mt-6">
            {paginatedStudents.length > 0 ? (
              <>
                {/* Desktop View Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-xs font-medium border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                        <th className="py-3 px-4">Student</th>
                        <th className="py-3 px-4">Course & Year</th>
                        <th className="py-3 px-4">Skills</th>
                        <th className="py-3 px-4">Internship Status</th>
                        <th className="py-3 px-4">Profile Completion</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedStudents.map((st) => {
                        const completion = getCompletionBadge(st.profileCompletion);

                        return (
                          <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                                  {st.avatarInitials}
                                </div>
                                <div>
                                  <p className="font-bold text-[#0f172a]">{st.name}</p>
                                  <p className="text-[11px] text-slate-400">{st.email} • {st.college}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-slate-700">{st.course} • {st.year}</td>
                            <td className="py-3.5 px-4">
                              <div className="flex flex-wrap gap-1 max-w-[180px]">
                                {st.skills ? (
                                  st.skills.slice(0, 3).map((sk) => (
                                    <span key={sk} className="px-1.5 py-0.5 rounded bg-blue-50 text-[#2563eb] text-[10px] font-bold">
                                      {sk}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-slate-400">—</span>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getStatusBadge(st.internshipStatus)}`}>
                                {st.internshipStatus}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="space-y-1 w-28">
                                <div className="flex justify-between text-[10px] font-bold">
                                  <span className="text-slate-800">{st.profileCompletion}%</span>
                                  <span className="text-slate-500">{completion.label}</span>
                                </div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                  <div className={`h-full rounded-full ${completion.color}`} style={{ width: `${st.profileCompletion}%` }} />
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-right space-x-1.5">
                              <button
                                type="button"
                                onClick={() => navigate(`/admin/students/${st.id}`)}
                                className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                              >
                                View
                              </button>
                              {st.accountStatus === 'Suspended' ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActionStudent(st);
                                    setActionType('activate');
                                  }}
                                  className="px-3 py-1 bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold rounded-xl cursor-pointer"
                                >
                                  Activate
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActionStudent(st);
                                    setActionType('suspend');
                                  }}
                                  className="px-3 py-1 bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 text-xs font-bold rounded-xl cursor-pointer"
                                >
                                  Suspend
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View Stacked Cards */}
                <div className="grid grid-cols-1 gap-3 md:hidden">
                  {paginatedStudents.map((st) => (
                    <div key={st.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                            {st.avatarInitials}
                          </div>
                          <span className="font-bold text-[#0f172a]">{st.name}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(st.internshipStatus)}`}>
                          {st.internshipStatus}
                        </span>
                      </div>
                      <p className="text-slate-500">{st.email} • {st.course} ({st.year})</p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="font-bold text-slate-700">Completion: {st.profileCompletion}%</span>
                        <div className="space-x-1">
                          <button
                            onClick={() => navigate(`/admin/students/${st.id}`)}
                            className="px-3 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-500">
                    Showing {(currentPage - 1) * itemsPerPage + 1}–
                    {Math.min(currentPage * itemsPerPage, sortedStudents.length)} of {sortedStudents.length} students
                  </span>

                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                      <button
                        key={pg}
                        type="button"
                        onClick={() => setCurrentPage(pg)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer ${
                          currentPage === pg ? 'bg-[#2563eb] text-white shadow-2xs' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {pg}
                      </button>
                    ))}

                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="py-12 text-center bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                <AlertOctagon className="w-8 h-8 text-slate-400 mx-auto" />
                <div>
                  <p className="text-sm font-bold text-slate-800">No students found</p>
                  <p className="text-xs text-slate-500">Try changing your filters or search terms.</p>
                </div>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-[#2563eb] text-white rounded-xl text-xs font-semibold hover:bg-blue-700 cursor-pointer shadow-2xs"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Confirmation Modal for Suspend/Activate */}
      {actionStudent && actionType && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-xl text-left space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-slate-900">
              <div className={`p-2.5 rounded-xl border shrink-0 ${
                actionType === 'suspend' ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-emerald-50 border-emerald-200 text-emerald-600'
              }`}>
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold">
                  Confirm Student {actionType === 'suspend' ? 'Suspension' : 'Activation'}
                </h3>
                <p className="text-xs text-slate-500">{actionStudent.name} ({actionStudent.email})</p>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Are you sure you want to {actionType === 'suspend' ? 'suspend' : 'activate'} student {actionStudent.name}?
            </p>

            <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setActionStudent(null);
                  setActionType(null);
                }}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmStatusChange}
                className={`px-4 py-2 rounded-xl text-white text-xs font-bold shadow-2xs cursor-pointer ${
                  actionType === 'suspend' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                Yes, {actionType === 'suspend' ? 'Suspend Student' : 'Activate Student'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
