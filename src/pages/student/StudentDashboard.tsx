import React, { useState } from 'react';
import { StudentSidebar } from '../../components/student/StudentSidebar';
import { DashboardHeader } from '../../components/student/DashboardHeader';
import { SummaryCard } from '../../components/student/SummaryCard';
import { ReadinessCard } from '../../components/student/ReadinessCard';
import { InternshipCard } from '../../components/student/InternshipCard';
import type { InternshipItem } from '../../components/student/InternshipCard';
import { ApplicationStatus } from '../../components/student/ApplicationStatus';
import { InternshipTimeline } from '../../components/student/InternshipTimeline';
import { Award, FileText, Sparkles, CheckCircle2, Search, User, Eye } from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const mockInternships: InternshipItem[] = [
    {
      id: '1',
      role: 'Frontend Developer',
      company: 'TechNova Solutions',
      location: 'Remote',
      duration: '3 Months',
    },
    {
      id: '2',
      role: 'Data Analyst Intern',
      company: 'DataSphere',
      location: 'Pune',
      duration: '6 Months',
    },
    {
      id: '3',
      role: 'UI/UX Design Intern',
      company: 'CreativeLabs',
      location: 'Mumbai',
      duration: '3 Months',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-[#0f172a]">
      {/* Sidebar */}
      <StudentSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader onOpenSidebar={() => setIsSidebarOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {/* Welcome Card Section */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f172a]">
                Welcome back!
              </h2>
              <p className="text-xs sm:text-sm text-[#64748b] mt-1">
                Here’s an overview of your internship journey.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => alert("Search Internships triggered")}
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search Internships</span>
              </button>
              <button
                onClick={() => alert("Update Profile triggered")}
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-[#e2e8f0] text-xs font-semibold transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>Update Profile</span>
              </button>
              <button
                onClick={() => alert("View Applications triggered")}
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-[#e2e8f0] text-xs font-semibold transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>View Applications</span>
              </button>
            </div>
          </div>

          {/* 4 Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard
              title="Readiness Score"
              value="78%"
              icon={<Award className="w-5 h-5" />}
              accentText="Good"
            />
            <SummaryCard
              title="Applications"
              value="8"
              icon={<FileText className="w-5 h-5" />}
              accentText="Active"
            />
            <SummaryCard
              title="Shortlisted"
              value="3"
              icon={<Sparkles className="w-5 h-5" />}
              accentText="Matches"
            />
            <SummaryCard
              title="Active Internship"
              value="1"
              icon={<CheckCircle2 className="w-5 h-5" />}
              accentText="Ongoing"
            />
          </div>

          {/* Grid Layout: Readiness & Application Status / Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (8 cols): Application Status, Timeline, Recommended */}
            <div className="lg:col-span-8 space-y-6">
              <ApplicationStatus />
              <InternshipTimeline />

              {/* Recommended Internships Section */}
              <div className="space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#0f172a]">
                    Recommended Internships
                  </h3>
                  <span className="text-xs font-semibold text-[#2563eb] cursor-pointer hover:underline">
                    View All
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {mockInternships.map((internship) => (
                    <InternshipCard
                      key={internship.id}
                      internship={internship}
                      onApply={() => alert(`Applied for ${internship.role} at ${internship.company}`)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (4 cols): Readiness Card */}
            <div className="lg:col-span-4 space-y-6">
              <ReadinessCard />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
