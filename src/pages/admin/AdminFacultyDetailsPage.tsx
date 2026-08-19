import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { mockAdminFaculty } from '../../types/adminTypes';
import {
  ArrowLeft,
  Mail,
  Phone,
  GraduationCap,
  UserCheck,
  BarChart3,
} from 'lucide-react';

export const AdminFacultyDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const faculty = mockAdminFaculty.find((f) => f.id === id) || mockAdminFaculty[0];
  const perf = faculty.mentorshipPerformance || {
    studentsAssigned: 18,
    studentsPlaced: 16,
    internshipsCompleted: 6,
    avgStudentProgress: 78.4,
    placementSuccessRate: 88.8,
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Faculty Mentor Details"
          subtitle={`Viewing academic record, assigned mentees & evaluation metrics for ${faculty.name}`}
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-5xl w-full mx-auto pb-safe text-left">
          {/* Back Navigation Bar */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/admin/faculty')}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-xl font-extrabold text-[#0f172a]">Faculty Record Profile</h2>
              <p className="text-xs text-slate-500">ID: {faculty.id} • {faculty.department}</p>
            </div>
          </div>

          {/* Faculty Header Card */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-md shrink-0">
                {faculty.avatarInitials}
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2 justify-center sm:justify-start">
                  <h3 className="text-lg font-bold text-[#0f172a]">{faculty.name}</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold">
                    {faculty.activeStatus}
                  </span>
                </div>
                <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start space-x-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{faculty.email}</span>
                </p>
                <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start space-x-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{faculty.phone || '+91 94220 12345'}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2 w-full sm:w-auto text-center sm:text-right">
              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold">
                Availability: {faculty.availability || 'Available'}
              </span>
              <span className="text-xs text-slate-400 font-medium">Experience: {faculty.experience || '10 Years'}</span>
              <span className="text-xs text-slate-400 font-medium">Joined {faculty.joinedDate || '12 Jul 2021'}</span>
            </div>
          </div>

          {/* Mentorship Overview Metrics */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-[#0f172a] border-b border-slate-100 pb-3 flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-[#2563eb]" />
              <span>Mentorship Capacity & Overview</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Assigned Students</span>
                <p className="text-2xl font-black text-[#2563eb]">{faculty.assignedStudents}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Ongoing Internships</span>
                <p className="text-2xl font-black text-amber-600">{faculty.ongoingInternships || 12}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Completed Internships</span>
                <p className="text-2xl font-black text-emerald-600">{faculty.completedInternships || 6}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Students Seeking</span>
                <p className="text-2xl font-black text-purple-600">{faculty.studentsSeeking || 2}</p>
              </div>
            </div>
          </div>

          {/* Mentorship Performance Section */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-[#0f172a] border-b border-slate-100 pb-3 flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-[#2563eb]" />
              <span>Mentorship Performance Analytics</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Assigned Mentees</span>
                <p className="text-xl font-black text-slate-900">{perf.studentsAssigned}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Students Placed</span>
                <p className="text-xl font-black text-emerald-600">{perf.studentsPlaced}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Internships Done</span>
                <p className="text-xl font-black text-indigo-600">{perf.internshipsCompleted}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Student Progress</span>
                <p className="text-xl font-black text-amber-600">{perf.avgStudentProgress}%</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Success Rate</span>
                <p className="text-xl font-black text-[#2563eb]">{perf.placementSuccessRate}%</p>
              </div>
            </div>
          </div>

          {/* Assigned Students Section */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-[#0f172a] border-b border-slate-100 pb-3 flex items-center space-x-2">
              <GraduationCap className="w-4 h-4 text-[#2563eb]" />
              <span>Assigned Student Mentees</span>
            </h3>

            {faculty.menteeList && faculty.menteeList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {faculty.menteeList.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => navigate(`/admin/students/${m.id}`)}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 cursor-pointer hover:border-blue-300 transition-all text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {m.avatarInitials}
                        </div>
                        <div>
                          <p className="font-bold text-[#0f172a]">{m.studentName}</p>
                          <p className="text-[11px] text-slate-400">{m.course} • {m.year}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold">
                        {m.internshipStatus}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-slate-100 space-y-1">
                      <p className="font-bold text-slate-800">{m.internshipTitle}</p>
                      <p className="text-[11px] text-slate-500">{m.company}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-600">
                        <span>Internship Progress</span>
                        <span>{m.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#2563eb] h-full rounded-full" style={{ width: `${m.progress}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-500">
                No active mentee students assigned yet. Click "Assign Student" on the faculty page to assign.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
