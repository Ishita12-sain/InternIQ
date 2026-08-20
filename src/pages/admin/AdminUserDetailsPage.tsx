import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { mockAdminUsers } from '../../types/adminUsersData';
import {
  ArrowLeft,
  Mail,
  Phone,
  Shield,
} from 'lucide-react';

export const AdminUserDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const user = mockAdminUsers.find((u) => u.id === id) || mockAdminUsers[0];

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="User Account Details"
          subtitle={`Viewing detailed account record and role specifics for ${user.name}`}
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-5xl w-full mx-auto pb-safe text-left">
          {/* Back Navigation Bar */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/admin/users')}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-xl font-extrabold text-[#0f172a]">User Profile Overview</h2>
              <p className="text-xs text-slate-500">System Record ID: {user.id}</p>
            </div>
          </div>

          {/* User Header Summary Card */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-md shrink-0">
                {user.avatarInitials}
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2 justify-center sm:justify-start">
                  <h3 className="text-lg font-bold text-[#0f172a]">{user.name}</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-extrabold border border-slate-200">
                    {user.role}
                  </span>
                </div>
                <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start space-x-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{user.email}</span>
                </p>
                <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start space-x-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{user.phone || '+91 98000 00000'}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2 w-full sm:w-auto text-center sm:text-right">
              <span
                className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                  user.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : user.status === 'Pending'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                Account {user.status}
              </span>
              <span className="text-xs text-slate-400 font-medium">Joined {user.joinedDate}</span>
              <span className="text-xs text-slate-400 font-medium">Last Active {user.lastActive}</span>
            </div>
          </div>

          {/* Role Specific Details Section */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-[#0f172a] border-b border-slate-100 pb-3 flex items-center space-x-2">
              <Shield className="w-4 h-4 text-[#2563eb]" />
              <span>Role Profile Specifics ({user.role})</span>
            </h3>

            {/* Student Role Specifics */}
            {user.role === 'Student' && user.studentDetails && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-slate-700">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">College / Institution</span>
                  <p className="text-sm font-bold text-slate-900">{user.studentDetails.college}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Degree & Course</span>
                  <p className="text-sm font-bold text-slate-900">{user.studentDetails.course}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Placement Status</span>
                  <p className="text-sm font-bold text-emerald-700">{user.studentDetails.internshipStatus}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Submitted Applications</span>
                  <p className="text-sm font-bold text-[#2563eb]">{user.studentDetails.applicationsCount} Applications</p>
                </div>
                <div className="sm:col-span-2 p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Assessed Skill Badges</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {user.studentDetails.skills.map((sk) => (
                      <span key={sk} className="px-2.5 py-1 rounded-full bg-blue-50 text-[#2563eb] border border-blue-200 font-bold text-xs">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Company Role Specifics */}
            {user.role === 'Company' && user.companyDetails && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-slate-700">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Company Legal Name</span>
                  <p className="text-sm font-bold text-slate-900">{user.companyDetails.companyName}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Industry Segment</span>
                  <p className="text-sm font-bold text-slate-900">{user.companyDetails.industry}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Headquarters Location</span>
                  <p className="text-sm font-bold text-slate-900">{user.companyDetails.location}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Active Postings</span>
                  <p className="text-sm font-bold text-[#2563eb]">{user.companyDetails.activeInternships} Internships</p>
                </div>
              </div>
            )}

            {/* Faculty Role Specifics */}
            {user.role === 'Faculty' && user.facultyDetails && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-slate-700">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Academic Department</span>
                  <p className="text-sm font-bold text-slate-900">{user.facultyDetails.department}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Faculty Designation</span>
                  <p className="text-sm font-bold text-slate-900">{user.facultyDetails.designation}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Assigned Student Mentees</span>
                  <p className="text-sm font-bold text-indigo-700">{user.facultyDetails.assignedStudentsCount} Mentees</p>
                </div>
              </div>
            )}

            {/* T&P Role Specifics */}
            {user.role === 'T&P' && user.tnpDetails && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-slate-700">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Institution / University</span>
                  <p className="text-sm font-bold text-slate-900">{user.tnpDetails.institution}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Cell / Department</span>
                  <p className="text-sm font-bold text-slate-900">{user.tnpDetails.department}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Managed Placement Cohort</span>
                  <p className="text-sm font-bold text-amber-700">{user.tnpDetails.managedStudentsCount} Students</p>
                </div>
              </div>
            )}

            {/* Admin Role Specifics */}
            {user.role === 'Admin' && user.adminDetails && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-slate-700">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Admin Authority Role</span>
                  <p className="text-sm font-bold text-rose-700">{user.adminDetails.adminRole}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Last Secure Login IP</span>
                  <p className="text-sm font-bold text-slate-900">{user.adminDetails.lastLoginIP}</p>
                </div>
                <div className="sm:col-span-2 p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400">System Permissions</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {user.adminDetails.permissions.map((perm) => (
                      <span key={perm} className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-800 font-bold text-xs">
                        {perm}
                      </span>
                    ))}
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
