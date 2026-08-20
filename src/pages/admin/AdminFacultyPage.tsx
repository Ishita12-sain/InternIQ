import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import type { AdminFacultyItem } from '../../types/adminTypes';
import { mockAdminFaculty } from '../../types/adminTypes';
import {
  Search,
  Filter,
  UserCheck,
  CheckCircle2,
  Clock,
  UserPlus,
  AlertOctagon,
  ArrowUpDown,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export const AdminFacultyPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [faculty, setFaculty] = useState<AdminFacultyItem[]>(mockAdminFaculty);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filter States
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'assignedStudents' | 'name' | 'department'>('assignedStudents');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals State
  const [assigningFaculty, setAssigningFaculty] = useState<AdminFacultyItem | null>(null);
  const [assignForm, setAssignForm] = useState({
    studentName: '',
    internshipTitle: '',
    startDate: '',
    notes: '',
  });

  const [actionFaculty, setActionFaculty] = useState<AdminFacultyItem | null>(null);
  const [actionType, setActionType] = useState<'deactivate' | 'activate' | null>(null);

  const facultyListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Multi-Filter & Search Logic
  const filteredFaculty = faculty.filter((fac) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      fac.name.toLowerCase().includes(searchLower) ||
      fac.email.toLowerCase().includes(searchLower) ||
      fac.department.toLowerCase().includes(searchLower);

    const matchesDepartment = departmentFilter === 'All' || fac.department === departmentFilter;
    const matchesStatus = statusFilter === 'All' || fac.activeStatus === statusFilter;
    const matchesAvailability = availabilityFilter === 'All' || fac.availability === availabilityFilter;

    return matchesSearch && matchesDepartment && matchesStatus && matchesAvailability;
  });

  // Sort Logic
  const sortedFaculty = [...filteredFaculty].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];
    if (sortOrder === 'asc') return valA > valB ? 1 : -1;
    return valA < valB ? 1 : -1;
  });

  // Pagination Math
  const totalPages = Math.max(Math.ceil(sortedFaculty.length / itemsPerPage), 1);
  const paginatedFaculty = sortedFaculty.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCardFilter = (sFilter: string, aFilter: string = 'All') => {
    setStatusFilter(sFilter);
    setAvailabilityFilter(aFilter);
    setCurrentPage(1);
    if (facultyListRef.current) {
      facultyListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setDepartmentFilter('All');
    setStatusFilter('All');
    setAvailabilityFilter('All');
    setSortBy('assignedStudents');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  const handleConfirmAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningFaculty) return;
    const facName = assigningFaculty.name;
    const stName = assignForm.studentName || 'New Mentee Student';

    setFaculty((prev) =>
      prev.map((f) => {
        if (f.id === assigningFaculty.id) {
          const updatedList = [
            ...(f.menteeList || []),
            {
              id: `st-new-${Date.now()}`,
              studentName: stName,
              course: 'B.Tech CS',
              year: '4th Year',
              internshipStatus: 'Ongoing',
              company: 'TechPartner Inc.',
              internshipTitle: assignForm.internshipTitle || 'Software Intern',
              progress: 10,
              avatarInitials: stName.substring(0, 2).toUpperCase(),
            },
          ];
          return {
            ...f,
            assignedStudents: f.assignedStudents + 1,
            menteeList: updatedList,
          };
        }
        return f;
      })
    );

    setAssigningFaculty(null);
    setAssignForm({ studentName: '', internshipTitle: '', startDate: '', notes: '' });
    setFeedback({ type: 'success', message: `Successfully assigned student "${stName}" to mentor ${facName}.` });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleConfirmStatusChange = () => {
    if (!actionFaculty || !actionType) return;
    const newStatus = actionType === 'deactivate' ? 'Inactive' : 'Active';
    setFaculty((prev) =>
      prev.map((f) => (f.id === actionFaculty.id ? { ...f, activeStatus: newStatus } : f))
    );
    setFeedback({
      type: actionType === 'deactivate' ? 'error' : 'success',
      message: `Faculty mentor "${actionFaculty.name}" has been ${actionType === 'deactivate' ? 'deactivated' : 'activated'} successfully.`,
    });
    setActionFaculty(null);
    setActionType(null);
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Faculty Management"
          subtitle="Manage faculty mentors and monitor student assignments."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto pb-safe text-left">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-[#0f172a]">Academic Faculty Directory</h2>
              <p className="text-xs text-slate-500">
                64 active faculty mentors across Computer Science, IT & Electronics
              </p>
            </div>
            {(departmentFilter !== 'All' || statusFilter !== 'All' || availabilityFilter !== 'All' || search) && (
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
              { label: 'Total Faculty', val: '64', sFilter: 'All', aFilter: 'All', icon: <UserCheck className="w-4 h-4 text-[#2563eb]" /> },
              { label: 'Active Mentors', val: '62', sFilter: 'Active', aFilter: 'All', icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" /> },
              { label: 'Available Mentors', val: '28', sFilter: 'Active', aFilter: 'Available', icon: <UserPlus className="w-4 h-4 text-indigo-600" /> },
              { label: 'Students Assigned', val: '450', sFilter: 'All', aFilter: 'All', icon: <UserCheck className="w-4 h-4 text-purple-600" /> },
              { label: 'Pending Assignments', val: '14', sFilter: 'All', aFilter: 'Limited', icon: <Clock className="w-4 h-4 text-amber-600" /> },
              { label: 'Inactive Faculty', val: '2', sFilter: 'Inactive', aFilter: 'All', icon: <ShieldAlert className="w-4 h-4 text-rose-600" /> },
            ].map((card) => (
              <button
                key={card.label}
                type="button"
                onClick={() => handleCardFilter(card.sFilter, card.aFilter)}
                className={`bg-white border rounded-2xl p-4 shadow-2xs space-y-1.5 cursor-pointer transition-all duration-150 text-left w-full focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 ${
                  statusFilter === card.sFilter && availabilityFilter === card.aFilter
                    ? 'border-[#2563eb] ring-2 ring-[#2563eb]/20 bg-blue-50/20'
                    : 'border-[#e2e8f0] hover:border-blue-300'
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
                placeholder="Search faculty by name, email, dept..."
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
                <span>Dept:</span>
                <select
                  value={departmentFilter}
                  onChange={(e) => {
                    setDepartmentFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs text-slate-800 font-bold focus:outline-none"
                >
                  <option value="All">All Departments</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">IT</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Management">Management</option>
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
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600">
                <span>Availability:</span>
                <select
                  value={availabilityFilter}
                  onChange={(e) => {
                    setAvailabilityFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs text-slate-800 font-bold focus:outline-none"
                >
                  <option value="All">All Availability</option>
                  <option value="Available">Available</option>
                  <option value="Limited">Limited</option>
                  <option value="Fully Assigned">Fully Assigned</option>
                </select>
              </div>

              <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600 pl-2 border-l border-slate-200">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#2563eb]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs text-slate-800 font-bold focus:outline-none"
                >
                  <option value="assignedStudents">Students</option>
                  <option value="name">Name</option>
                  <option value="department">Department</option>
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

          {/* Faculty List Table Section */}
          <div ref={facultyListRef} className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4 scroll-mt-6">
            {paginatedFaculty.length > 0 ? (
              <>
                {/* Desktop View Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-xs font-medium border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                        <th className="py-3 px-4">Faculty</th>
                        <th className="py-3 px-4">Department</th>
                        <th className="py-3 px-4">Designation</th>
                        <th className="py-3 px-4">Assigned Mentees</th>
                        <th className="py-3 px-4">Availability</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedFaculty.map((fac) => (
                        <tr key={fac.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                                {fac.avatarInitials}
                              </div>
                              <div>
                                <p className="font-bold text-[#0f172a]">{fac.name}</p>
                                <p className="text-[11px] text-slate-400">{fac.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-700">{fac.department}</td>
                          <td className="py-3.5 px-4 font-semibold text-slate-600">{fac.designation || 'Faculty Mentor'}</td>
                          <td className="py-3.5 px-4 font-bold text-indigo-700">{fac.assignedStudents} Students</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                                fac.availability === 'Available'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : fac.availability === 'Limited'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-purple-50 text-purple-700 border-purple-200'
                              }`}
                            >
                              {fac.availability || 'Available'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                                fac.activeStatus === 'Active'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}
                            >
                              {fac.activeStatus}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-1.5">
                            <button
                              type="button"
                              onClick={() => navigate(`/admin/faculty/${fac.id}`)}
                              className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                            >
                              View
                            </button>
                            <button
                              type="button"
                              onClick={() => setAssigningFaculty(fac)}
                              className="px-2.5 py-1 bg-blue-50 text-[#2563eb] border border-blue-200 hover:bg-blue-100 text-xs font-bold rounded-xl cursor-pointer"
                            >
                              Assign Student
                            </button>
                            {fac.activeStatus === 'Inactive' ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setActionFaculty(fac);
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
                                  setActionFaculty(fac);
                                  setActionType('deactivate');
                                }}
                                className="px-3 py-1 bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 text-xs font-bold rounded-xl cursor-pointer"
                              >
                                Deactivate
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View Stacked Cards */}
                <div className="grid grid-cols-1 gap-3 md:hidden">
                  {paginatedFaculty.map((fac) => (
                    <div key={fac.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                            {fac.avatarInitials}
                          </div>
                          <span className="font-bold text-[#0f172a]">{fac.name}</span>
                        </div>
                        <span className="font-bold text-emerald-700">{fac.activeStatus}</span>
                      </div>
                      <p className="text-slate-500">{fac.department} • {fac.designation || 'Faculty'}</p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="font-semibold text-slate-700">{fac.assignedStudents} Assigned</span>
                        <div className="space-x-1">
                          <button
                            onClick={() => navigate(`/admin/faculty/${fac.id}`)}
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
                    {Math.min(currentPage * itemsPerPage, sortedFaculty.length)} of {sortedFaculty.length} faculty members
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
                  <p className="text-sm font-bold text-slate-800">No faculty members found</p>
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

      {/* Assign Student Modal */}
      {assigningFaculty && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-xl text-left space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-[#2563eb]">
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 shrink-0">
                <UserPlus className="w-6 h-6 text-[#2563eb]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0f172a]">Assign Student Mentee</h3>
                <p className="text-xs text-slate-500">Assign to {assigningFaculty.name}</p>
              </div>
            </div>

            <form onSubmit={handleConfirmAssign} className="space-y-3 text-xs font-medium">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">Student Name</label>
                <input
                  type="text"
                  placeholder="e.g. Siddharth Rao"
                  value={assignForm.studentName}
                  onChange={(e) => setAssignForm({ ...assignForm, studentName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563eb]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">Internship Program Title</label>
                <input
                  type="text"
                  placeholder="e.g. Frontend Developer Intern"
                  value={assignForm.internshipTitle}
                  onChange={(e) => setAssignForm({ ...assignForm, internshipTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563eb]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">Mentorship Start Date</label>
                <input
                  type="date"
                  value={assignForm.startDate}
                  onChange={(e) => setAssignForm({ ...assignForm, startDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">Mentorship Notes</label>
                <textarea
                  rows={2}
                  placeholder="Optional mentor assignment notes..."
                  value={assignForm.notes}
                  onChange={(e) => setAssignForm({ ...assignForm, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              <div className="flex justify-end space-x-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAssigningFaculty(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs cursor-pointer"
                >
                  Assign Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deactivate / Activate Confirmation Modal */}
      {actionFaculty && actionType && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-xl text-left space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-slate-900">
              <div className={`p-2.5 rounded-xl border shrink-0 ${
                actionType === 'deactivate' ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-emerald-50 border-emerald-200 text-emerald-600'
              }`}>
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold">
                  Confirm Faculty Mentor {actionType === 'deactivate' ? 'Deactivation' : 'Activation'}
                </h3>
                <p className="text-xs text-slate-500">{actionFaculty.name} ({actionFaculty.email})</p>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Are you sure you want to {actionType === 'deactivate' ? 'deactivate' : 'activate'} faculty mentor {actionFaculty.name}?
            </p>

            <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setActionFaculty(null);
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
                  actionType === 'deactivate' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                Yes, {actionType === 'deactivate' ? 'Deactivate Faculty' : 'Activate Faculty'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
