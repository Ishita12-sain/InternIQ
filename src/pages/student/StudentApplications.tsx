import React, { useState, useMemo } from 'react';
import { StudentSidebar } from '../../components/student/StudentSidebar';
import { DashboardHeader } from '../../components/student/DashboardHeader';
import { ApplicationSummary } from '../../components/student/ApplicationSummary';
import type { SummaryCardKey } from '../../components/student/ApplicationSummary';
import { ApplicationFilters } from '../../components/student/ApplicationFilters';
import type { ApplicationStatusFilter, AppInternshipTypeFilter } from '../../components/student/ApplicationFilters';
import { ApplicationCard } from '../../components/student/ApplicationCard';
import type { ApplicationItem } from '../../components/student/ApplicationCard';
import { ApplicationTimeline } from '../../components/student/ApplicationTimeline';
import { X, SearchX, RotateCcw, FileText, Clock, Sparkles, CheckCircle2 } from 'lucide-react';

export const StudentApplications: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatusFilter>('All');
  const [selectedType, setSelectedType] = useState<AppInternshipTypeFilter>('All');
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null);
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);

  // Realistic Mock Applications Data (6 Applications)
  const mockApplications: ApplicationItem[] = [
    {
      id: 'app-1',
      companyName: 'TechNova Solutions',
      companyLogo: 'TN',
      role: 'Frontend Developer Intern',
      appliedDate: '12 Aug 2026',
      location: 'Bengaluru, KA',
      internshipType: 'Remote',
      stipend: '₹25,000 / month',
      status: 'Shortlisted',
      skills: ['React', 'TypeScript', 'Tailwind CSS'],
    },
    {
      id: 'app-2',
      companyName: 'DataSphere Systems',
      companyLogo: 'DS',
      role: 'Data Analyst Intern',
      appliedDate: '10 Aug 2026',
      location: 'Pune, MH',
      internshipType: 'Full Time',
      stipend: '₹20,000 / month',
      status: 'Under Review',
      skills: ['SQL', 'Python', 'Excel'],
    },
    {
      id: 'app-3',
      companyName: 'CreativeLabs',
      companyLogo: 'CL',
      role: 'UI/UX Design Intern',
      appliedDate: '08 Aug 2026',
      location: 'Mumbai, MH',
      internshipType: 'Hybrid',
      stipend: '₹18,000 / month',
      status: 'Interview Scheduled',
      skills: ['Figma', 'HTML', 'CSS'],
    },
    {
      id: 'app-4',
      companyName: 'Apex Cloud Systems',
      companyLogo: 'AC',
      role: 'Full Stack Developer Intern',
      appliedDate: '01 Aug 2026',
      location: 'Hyderabad, TS',
      internshipType: 'Remote',
      stipend: '₹30,000 / month',
      status: 'Selected',
      skills: ['React', 'Node.js', 'MongoDB'],
    },
    {
      id: 'app-5',
      companyName: 'NexGen Infotech',
      companyLogo: 'NG',
      role: 'Software Test Engineer Intern',
      appliedDate: '28 Jul 2026',
      location: 'Noida, UP',
      internshipType: 'Full Time',
      stipend: '₹15,000 / month',
      status: 'Applied',
      skills: ['JavaScript', 'QA Testing', 'Git'],
    },
    {
      id: 'app-6',
      companyName: 'CyberGuard Security',
      companyLogo: 'CG',
      role: 'Security Audit Intern',
      appliedDate: '20 Jul 2026',
      location: 'Gurugram, HR',
      internshipType: 'Hybrid',
      stipend: '₹16,000 / month',
      status: 'Rejected',
      skills: ['SQL', 'Linux', 'Security'],
    },
  ];

  // Filtering Logic
  const filteredApplications = useMemo(() => {
    return mockApplications.filter((app) => {
      if (selectedStatus !== 'All' && app.status !== selectedStatus) {
        return false;
      }
      if (selectedType !== 'All' && app.internshipType !== selectedType) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCompany = app.companyName.toLowerCase().includes(q);
        const matchRole = app.role.toLowerCase().includes(q);
        const matchLoc = app.location.toLowerCase().includes(q);
        return matchCompany || matchRole || matchLoc;
      }
      return true;
    });
  }, [mockApplications, selectedStatus, selectedType, searchQuery]);

  const underReviewApps = useMemo(() => mockApplications.filter((a) => a.status === 'Under Review'), [mockApplications]);
  const shortlistedApps = useMemo(() => mockApplications.filter((a) => a.status === 'Shortlisted' || a.status === 'Interview Scheduled'), [mockApplications]);
  const selectedApps = useMemo(() => mockApplications.filter((a) => a.status === 'Selected'), [mockApplications]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedStatus('All');
    setSelectedType('All');
  };

  const handleSummaryCardClick = (key: SummaryCardKey) => {
    const targetIdMap: Record<SummaryCardKey, string> = {
      total: 'all-applications-section',
      underReview: 'under-review-section',
      shortlisted: 'shortlisted-section',
      selected: 'selected-section',
    };

    const targetId = targetIdMap[key];
    const element = document.getElementById(targetId);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setHighlightedSection(targetId);
      setTimeout(() => {
        setHighlightedSection(null);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      {/* Sidebar */}
      <StudentSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader onOpenSidebar={() => setIsSidebarOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto max-w-7xl w-full mx-auto pb-safe">
          {/* Header */}
          <div className="text-left space-y-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f172a]">Applications</h1>
            <p className="text-xs sm:text-sm text-[#64748b]">
              Track and manage your internship applications.
            </p>
          </div>

          {/* 4 Summary Cards */}
          <ApplicationSummary
            total={mockApplications.length}
            underReview={underReviewApps.length}
            shortlisted={shortlistedApps.length}
            selected={selectedApps.length}
            onCardClick={handleSummaryCardClick}
          />

          {/* Filter Bar */}
          <ApplicationFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            onClearFilters={handleClearFilters}
          />

          {/* All Applications Section */}
          <div
            id="all-applications-section"
            className={`scroll-mt-24 space-y-4 text-left transition-all duration-300 rounded-2xl p-2 ${
              highlightedSection === 'all-applications-section'
                ? 'ring-2 ring-blue-500 bg-blue-50/30'
                : ''
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h2 className="text-base font-bold text-[#0f172a] flex items-center space-x-2">
                <FileText className="w-4 h-4 text-[#2563eb]" />
                <span>All Submitted Applications ({filteredApplications.length})</span>
              </h2>
            </div>

            {filteredApplications.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredApplications.map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    onViewDetails={(item) => setSelectedApp(item)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-8 text-center space-y-3 shadow-2xs">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-[#2563eb] flex items-center justify-center mx-auto">
                  <SearchX className="w-6 h-6" />
                </div>
                <p className="text-xs text-[#64748b]">No applications match the active filters.</p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#2563eb] text-xs font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Filters</span>
                </button>
              </div>
            )}
          </div>

          {/* Under Review Applications Section */}
          <div
            id="under-review-section"
            className={`scroll-mt-24 space-y-4 text-left transition-all duration-300 rounded-2xl p-2 ${
              highlightedSection === 'under-review-section'
                ? 'ring-2 ring-amber-500 bg-amber-50/30'
                : ''
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h2 className="text-base font-bold text-[#0f172a] flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Under Review Applications ({underReviewApps.length})</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {underReviewApps.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  onViewDetails={(item) => setSelectedApp(item)}
                />
              ))}
            </div>
          </div>

          {/* Shortlisted Applications Section */}
          <div
            id="shortlisted-section"
            className={`scroll-mt-24 space-y-4 text-left transition-all duration-300 rounded-2xl p-2 ${
              highlightedSection === 'shortlisted-section'
                ? 'ring-2 ring-indigo-500 bg-indigo-50/30'
                : ''
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h2 className="text-base font-bold text-[#0f172a] flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Shortlisted & Interview Scheduled ({shortlistedApps.length})</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {shortlistedApps.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  onViewDetails={(item) => setSelectedApp(item)}
                />
              ))}
            </div>
          </div>

          {/* Selected Applications Section */}
          <div
            id="selected-section"
            className={`scroll-mt-24 space-y-4 text-left transition-all duration-300 rounded-2xl p-2 ${
              highlightedSection === 'selected-section'
                ? 'ring-2 ring-emerald-500 bg-emerald-50/30'
                : ''
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h2 className="text-base font-bold text-[#0f172a] flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Selected Applications ({selectedApps.length})</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedApps.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  onViewDetails={(item) => setSelectedApp(item)}
                />
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Application Details Modal with Timeline */}
      {selectedApp && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-xl relative text-left space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-[#2563eb] font-black text-sm flex items-center justify-center">
                  {selectedApp.companyLogo}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0f172a]">{selectedApp.role}</h3>
                  <p className="text-xs text-[#64748b]">{selectedApp.companyName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 font-medium">
                <div>
                  <span className="text-slate-400">Applied Date:</span>{' '}
                  <strong className="text-slate-800">{selectedApp.appliedDate}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Location:</span>{' '}
                  <strong className="text-slate-800">{selectedApp.location}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Type:</span>{' '}
                  <strong className="text-[#2563eb]">{selectedApp.internshipType}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Stipend:</span>{' '}
                  <strong className="text-emerald-700">{selectedApp.stipend}</strong>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="space-y-1">
                <span className="font-bold text-slate-800">Required Skills:</span>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {selectedApp.skills.map((sk) => (
                    <span
                      key={sk}
                      className="px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-[#eff6ff] text-[#2563eb] border border-blue-200/60"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Progress Timeline */}
              <ApplicationTimeline currentStatus={selectedApp.status} />
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
