import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TPSidebar } from '../../components/tp/TPSidebar';
import { TPHeader } from '../../components/tp/TPHeader';
import { mockAdminStudents, mockAdminApplications } from '../../types/adminTypes';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';

export const TPStudentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filters & Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filtered Students List
  const filteredStudents = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return mockAdminStudents.filter((s) => {
      // Search
      const matchesSearch =
        s.name.toLowerCase().includes(query) ||
        s.email.toLowerCase().includes(query) ||
        s.college.toLowerCase().includes(query) ||
        (s.skills || []).some((sk) => sk.toLowerCase().includes(query));

      // Department Filter
      const matchesDept = departmentFilter === 'All' || s.course.includes(departmentFilter);

      // Placement Status Filter
      const matchesStatus = statusFilter === 'All' || s.internshipStatus === statusFilter;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [searchQuery, departmentFilter, statusFilter]);

  // Pagination Window Slice
  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage, pageSize]);

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      {/* T&P Responsive Sidebar */}
      <TPSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <TPHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Student Placement Registry"
          subtitle="Monitor student readiness, applications, and placement statuses."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto pb-safe text-left">
          {/* Header Sub-bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-[#0f172a]">Candidate Placement Management</h2>
              <p className="text-xs text-slate-500">Showing {filteredStudents.length.toLocaleString()} candidate records.</p>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, email, college or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2563eb]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Courses/Depts</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Tech">Information Tech</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Management">Management</option>
                </select>
              </div>

              <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Placement Statuses</option>
                  <option value="Seeking">Seeking Internship</option>
                  <option value="Selected">Selected / Placed</option>
                  <option value="Interning">Currently Interning</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Student</th>
                    <th className="py-3.5 px-4">College & Course</th>
                    <th className="py-3.5 px-4">Skills</th>
                    <th className="py-3.5 px-4 text-center">Applications</th>
                    <th className="py-3.5 px-4 text-center">Shortlisted</th>
                    <th className="py-3.5 px-4 text-center">Selected</th>
                    <th className="py-3.5 px-4">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {paginatedStudents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500 font-semibold">
                        No students match your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={() => navigate(`/tp/students/${s.id}`)}
                            className="font-bold text-[#0f172a] hover:text-[#2563eb] hover:underline text-left cursor-pointer"
                          >
                            {s.name}
                          </button>
                          <div className="text-[10px] text-slate-400">{s.email}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-800">{s.college}</div>
                          <div className="text-[10px] text-slate-500">{s.course}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1">
                            {(s.skills || []).slice(0, 3).map((sk) => (
                              <span key={sk} className="px-1.5 py-0.5 bg-slate-100 rounded-md text-[10px] text-slate-600">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold">{s.applications || 0}</td>
                        <td className="py-3.5 px-4 text-center font-bold text-amber-600">{s.shortlisted || 0}</td>
                        <td className="py-3.5 px-4 text-center font-bold text-emerald-600">{s.selected || 0}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            {s.internshipStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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

// Student Details Page Component
export const TPStudentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const student = mockAdminStudents.find((s) => s.id === id) || mockAdminStudents[0];
  const studentApps = mockAdminApplications.filter((a) => a.studentId === student.id || a.candidateName === student.name);

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <TPSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <TPHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Student Placement Profile"
          subtitle={`Detailed record for ${student.name}`}
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-4xl w-full mx-auto pb-safe text-left">
          <button
            type="button"
            onClick={() => navigate('/tp/students')}
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-[#2563eb] transition-colors cursor-pointer border-b border-slate-200 pb-3 w-full"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Student Registry</span>
          </button>

          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-[#2563eb] text-white font-black text-xl flex items-center justify-center border-2 border-blue-400 shadow-2xs">
                {student.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[#0f172a]">{student.name}</h2>
                <p className="text-xs text-slate-500">{student.course} • {student.college}</p>
                <span className="mt-1 inline-block px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold rounded-full">
                  {student.internshipStatus}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 bg-slate-50 border rounded-2xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Applications</p>
                <p className="text-lg font-black text-[#0f172a] mt-0.5">{student.applications || 0}</p>
              </div>
              <div className="p-3 bg-slate-50 border rounded-2xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Shortlisted</p>
                <p className="text-lg font-black text-amber-600 mt-0.5">{student.shortlisted || 0}</p>
              </div>
              <div className="p-3 bg-slate-50 border rounded-2xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Selected</p>
                <p className="text-lg font-black text-emerald-600 mt-0.5">{student.selected || 0}</p>
              </div>
            </div>

            {/* Applications List */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-extrabold text-[#0f172a]">Applications & Opportunities</h3>
              <div className="space-y-2">
                {studentApps.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No applications recorded for this student.</p>
                ) : (
                  studentApps.map((app) => (
                    <div key={app.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-[#0f172a]">{app.internshipTitle}</p>
                        <p className="text-[11px] text-slate-500">{app.companyName} • Applied: {app.appliedDate}</p>
                      </div>
                      <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-md font-bold text-[10px] text-slate-700">
                        {app.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
