import React, { useState } from 'react';
import { CompanySidebar } from '../../components/company/CompanySidebar';
import { CompanyHeader } from '../../components/company/CompanyHeader';
import { useAuth } from '../../context/AuthContext';
import { CompanyOverviewCards } from '../../components/company/CompanyOverviewCards';
import { CompanyQuickActions } from '../../components/company/CompanyQuickActions';
import { RecentApplicationsSection } from '../../components/company/RecentApplicationsSection';
import type { ApplicantItem } from '../../components/company/RecentApplicationsSection';
import { ActiveInternshipsSection } from '../../components/company/ActiveInternshipsSection';
import type { CompanyInternshipItem } from '../../components/company/ActiveInternshipsSection';
import { HiringOverviewSection } from '../../components/company/HiringOverviewSection';
import { X, Award } from 'lucide-react';

export const CompanyDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantItem | null>(null);

  // Mock Company Active Listings
  const mockInternships: CompanyInternshipItem[] = [
    {
      id: 'c-int-1',
      title: 'Frontend Developer Intern',
      location: 'Bengaluru, KA',
      workMode: 'Remote',
      duration: '3 Months',
      applicantsCount: 42,
      status: 'Active',
    },
    {
      id: 'c-int-2',
      title: 'Backend Developer Intern',
      location: 'Pune, MH',
      workMode: 'Full Time',
      duration: '6 Months',
      applicantsCount: 28,
      status: 'Active',
    },
    {
      id: 'c-int-3',
      title: 'UI/UX Design Intern',
      location: 'Mumbai, MH',
      workMode: 'Hybrid',
      duration: '3 Months',
      applicantsCount: 19,
      status: 'Active',
    },
  ];

  // Mock Recent Candidate Applications
  const mockApplicants: ApplicantItem[] = [
    {
      id: 'app-1',
      studentName: 'Aarav Sharma',
      avatarInitials: 'AS',
      internshipTitle: 'Frontend Developer Intern',
      matchPercentage: 94,
      appliedDate: '18 Aug 2026',
      status: 'Shortlisted',
      skills: ['React', 'TypeScript', 'Tailwind CSS'],
    },
    {
      id: 'app-2',
      studentName: 'Priya Patel',
      avatarInitials: 'PP',
      internshipTitle: 'Backend Developer Intern',
      matchPercentage: 88,
      appliedDate: '17 Aug 2026',
      status: 'Under Review',
      skills: ['Node.js', 'Express', 'SQL', 'REST APIs'],
    },
    {
      id: 'app-3',
      studentName: 'Rohan Mehta',
      avatarInitials: 'RM',
      internshipTitle: 'Frontend Developer Intern',
      matchPercentage: 91,
      appliedDate: '16 Aug 2026',
      status: 'Interview',
      skills: ['React', 'JavaScript', 'HTML/CSS'],
    },
    {
      id: 'app-4',
      studentName: 'Ananya Verma',
      avatarInitials: 'AV',
      internshipTitle: 'UI/UX Design Intern',
      matchPercentage: 85,
      appliedDate: '15 Aug 2026',
      status: 'Selected',
      skills: ['Figma', 'User Research', 'Prototyping'],
    },
  ];

  // Mock Hiring Funnel Statistics
  const hiringStats = {
    received: 89,
    underReview: 35,
    shortlisted: 22,
    interview: 14,
    selected: 6,
  };

  const handleCardScroll = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      {/* Sidebar */}
      <CompanySidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col min-w-0">
        <CompanyHeader onOpenSidebar={() => setIsSidebarOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto pb-safe">
          {/* Welcome Banner Card */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563eb] border border-blue-200 text-xs font-bold">
                  Verified Employer
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f172a]">
                Welcome back, {user?.companyName || user?.name || 'Company Partner'}!
              </h2>
              <p className="text-xs sm:text-sm text-[#64748b]">
                Here is an overview of your active internship postings and candidate applications.
              </p>
            </div>

            <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200/80 p-3 rounded-xl shrink-0">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow-2xs">
                {user?.companyName ? user.companyName.slice(0, 2).toUpperCase() : user?.name ? user.name.slice(0, 2).toUpperCase() : 'CO'}
              </div>
              <div className="text-left text-xs">
                <p className="font-bold text-[#0f172a]">{user?.companyName || user?.name || 'Company Partner'}</p>
                <p className="text-[#64748b] font-medium">Enterprise Employer</p>
              </div>
            </div>
          </div>

          {/* 5 Quick Overview Metrics Cards */}
          <CompanyOverviewCards
            activeCount={3}
            totalApplicants={89}
            shortlistedCount={22}
            interviewsCount={14}
            selectedCount={6}
          />

          {/* Quick Management Actions */}
          <CompanyQuickActions />

          {/* Recent Applications Section */}
          <RecentApplicationsSection
            applicants={mockApplicants}
            onViewApplicant={(app) => setSelectedApplicant(app)}
          />

          {/* Active Internships Section */}
          <ActiveInternshipsSection
            internships={mockInternships}
            onManage={(_item) => handleCardScroll('company-recent-applications-section')}
          />

          {/* Hiring Funnel Overview */}
          <HiringOverviewSection stats={hiringStats} />
        </main>
      </div>

      {/* Candidate View Details Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-xl relative text-left space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-[#2563eb] font-bold text-sm flex items-center justify-center border border-blue-200">
                  {selectedApplicant.avatarInitials}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0f172a]">{selectedApplicant.studentName}</h3>
                  <p className="text-xs text-[#64748b]">Applied for {selectedApplicant.internshipTitle}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApplicant(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200 flex items-center justify-between">
                <span className="font-bold text-emerald-900 flex items-center space-x-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Profile Match Score</span>
                </span>
                <strong className="text-emerald-700 text-sm font-extrabold">{selectedApplicant.matchPercentage}%</strong>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 font-medium">
                <div>
                  <span className="text-slate-400 block text-[10px]">Application Date</span>
                  <strong className="text-slate-800">{selectedApplicant.appliedDate}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Current Status</span>
                  <strong className="text-[#2563eb]">{selectedApplicant.status}</strong>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 font-bold block">Verified Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedApplicant.skills.map((sk) => (
                    <span key={sk} className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#2563eb] font-bold border border-blue-200/60">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedApplicant(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => setSelectedApplicant(null)}
                className="px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs cursor-pointer"
              >
                Shortlist Candidate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
