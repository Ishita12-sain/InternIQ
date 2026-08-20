import React, { useState, useMemo } from 'react';
import { StudentSidebar } from '../../components/student/StudentSidebar';
import { DashboardHeader } from '../../components/student/DashboardHeader';
import { RecommendedSummary } from '../../components/student/RecommendedSummary';
import type { RecommendedSummaryCardKey } from '../../components/student/RecommendedSummary';
import { RecommendedFilters } from '../../components/student/RecommendedFilters';
import type { WorkModeFilter, SortOption } from '../../components/student/RecommendedFilters';
import { RecommendedCard } from '../../components/student/RecommendedCard';
import type { RecommendedInternshipItem } from '../../components/student/RecommendedCard';
import { RecommendedEmptyState } from '../../components/student/RecommendedEmptyState';
import { X, CheckCircle2, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { useApplication } from '../../context/ApplicationContext';

export const StudentRecommendedInternships: React.FC = () => {
  const { applyForInternship, hasStudentApplied, isSubmitting } = useApplication();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState<WorkModeFilter>('All');
  const [sortBy, setSortBy] = useState<SortOption>('Best Match');
  const [selectedInternship, setSelectedInternship] = useState<RecommendedInternshipItem | null>(null);

  // Application Modal States
  const [confirmInternship, setConfirmInternship] = useState<RecommendedInternshipItem | null>(null);
  const [successInternship, setSuccessInternship] = useState<RecommendedInternshipItem | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Mock Realistic Internship Data (6 Internships)
  const mockInternships: RecommendedInternshipItem[] = [
    {
      id: 'rec-1',
      companyName: 'TechCorp Labs',
      companyLogo: 'TC',
      title: 'Frontend Developer Intern',
      location: 'Bengaluru, KA',
      workMode: 'Remote',
      duration: '6 Months',
      stipend: '₹25,000 / month',
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Git'],
      matchPercentage: 95,
      description:
        'Work on cutting-edge Web applications using React, TypeScript, and modern state management tools.',
      matchReasons: [
        'React skill matches (Strong match)',
        'TypeScript skill matches (Strong match)',
        'Frontend development career interest alignment',
      ],
      postedDate: '2026-08-18',
    },
    {
      id: 'rec-2',
      companyName: 'InnovateX Solutions',
      companyLogo: 'IX',
      title: 'Full Stack Web Intern',
      location: 'Pune, MH',
      workMode: 'Hybrid',
      duration: '3 Months',
      stipend: '₹20,000 / month',
      skills: ['React', 'Node.js', 'Express', 'SQL'],
      matchPercentage: 88,
      description:
        'Develop scalable REST APIs and responsive user interfaces for modern web platforms.',
      matchReasons: [
        'React & Node.js skill stack match',
        'SQL database experience match',
        'High institution compatibility rating',
      ],
      postedDate: '2026-08-17',
    },
    {
      id: 'rec-3',
      companyName: 'CloudScale Technologies',
      companyLogo: 'CS',
      title: 'Software Engineer Intern',
      location: 'Hyderabad, TS',
      workMode: 'On-site',
      duration: '6 Months',
      stipend: '₹30,000 / month',
      skills: ['JavaScript', 'Python', 'Git', 'REST APIs'],
      matchPercentage: 84,
      description:
        'Join cloud services team to build automated CI/CD tools and microservice integration pipelines.',
      matchReasons: [
        'JavaScript & Git core proficiency match',
        'Strong academic standing (8.4 CGPA)',
      ],
      postedDate: '2026-08-16',
    },
    {
      id: 'rec-4',
      companyName: 'DataPulse Analytics',
      companyLogo: 'DP',
      title: 'Frontend UI/UX Engineer Intern',
      location: 'Mumbai, MH',
      workMode: 'Remote',
      duration: '4 Months',
      stipend: '₹22,000 / month',
      skills: ['React', 'HTML', 'CSS', 'Figma'],
      matchPercentage: 82,
      description:
        'Transform complex analytics dashboards into clean, pixel-perfect user interface components.',
      matchReasons: [
        'HTML & CSS design mastery match',
        'React component architectural skills',
      ],
      postedDate: '2026-08-15',
    },
    {
      id: 'rec-5',
      companyName: 'NexGen Systems',
      companyLogo: 'NG',
      title: 'React Native Mobile Intern',
      location: 'Noida, UP',
      workMode: 'Hybrid',
      duration: '6 Months',
      stipend: '₹18,000 / month',
      skills: ['JavaScript', 'React', 'Mobile UI'],
      matchPercentage: 78,
      description:
        'Assist in building cross-platform mobile apps for Android and iOS using React Native framework.',
      matchReasons: ['React & JavaScript foundational skills match'],
      postedDate: '2026-08-14',
    },
    {
      id: 'rec-6',
      companyName: 'CyberGuard Inc',
      companyLogo: 'CG',
      title: 'Web Security & QA Intern',
      location: 'Gurugram, HR',
      workMode: 'On-site',
      duration: '3 Months',
      stipend: '₹15,000 / month',
      skills: ['SQL', 'Git', 'Security Testing'],
      matchPercentage: 72,
      description:
        'Participate in vulnerability testing, SQL query audits, and web application security logging.',
      matchReasons: ['SQL database knowledge match'],
      postedDate: '2026-08-12',
    },
  ];

  // Filter and Sort Logic
  const filteredInternships = useMemo(() => {
    return mockInternships
      .filter((item) => {
        // Work Mode Filter
        if (selectedMode !== 'All' && item.workMode !== selectedMode) {
          return false;
        }
        // Search Query Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchCompany = item.companyName.toLowerCase().includes(q);
          const matchSkill = item.skills.some((s) => s.toLowerCase().includes(q));
          return matchTitle || matchCompany || matchSkill;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'Best Match') return b.matchPercentage - a.matchPercentage;
        if (sortBy === 'Latest') return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
        if (sortBy === 'Highest Stipend') {
          const parseStipend = (str: string) => parseInt(str.replace(/[^0-9]/g, '')) || 0;
          return parseStipend(b.stipend) - parseStipend(a.stipend);
        }
        return 0;
      });
  }, [selectedMode, searchQuery, sortBy]);

  const handleApplyClick = (internship: RecommendedInternshipItem) => {
    setErrorMessage(null);
    if (hasStudentApplied(internship.id)) {
      setErrorMessage(`You have already applied for "${internship.title}" at ${internship.companyName}.`);
      return;
    }
    setConfirmInternship(internship);
  };

  const handleConfirmApplication = async () => {
    if (!confirmInternship) return;
    setErrorMessage(null);

    const result = await applyForInternship({
      id: confirmInternship.id,
      title: confirmInternship.title,
      companyName: confirmInternship.companyName,
      companyLogo: confirmInternship.companyLogo,
      location: confirmInternship.location,
      workMode: confirmInternship.workMode,
      stipend: confirmInternship.stipend,
      skills: confirmInternship.skills,
    });

    if (result.success) {
      const appliedItem = confirmInternship;
      setConfirmInternship(null);
      setSuccessInternship(appliedItem);
    } else {
      setErrorMessage(result.message);
    }
  };

  const handleSummaryCardClick = (key: RecommendedSummaryCardKey) => {
    if (key === 'recommended') {
      setSelectedMode('All');
      setSearchQuery('');
      setSortBy('Best Match');
    } else if (key === 'bestMatch') {
      setSortBy('Best Match');
    } else if (key === 'applications') {
      setSelectedMode('All');
      setSearchQuery('');
    }

    const listElement = document.getElementById('recommended-listings');
    if (listElement) {
      listElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-[#0f172a]">
      {/* Sidebar */}
      <StudentSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader onOpenSidebar={() => setIsSidebarOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {/* Page Header */}
          <div className="text-left space-y-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f172a]">Recommended Internships</h1>
            <p className="text-xs sm:text-sm text-[#64748b]">
              Internships matched with your skills and career interests.
            </p>
          </div>

          {/* Top Summary Metrics */}
          <RecommendedSummary
            totalRecommended={6}
            topMatchPct={95}
            activeOpportunities={18}
            onCardClick={handleSummaryCardClick}
          />

          {/* Search, Sort & Filter Toolbar */}
          <RecommendedFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedMode={selectedMode}
            onModeChange={setSelectedMode}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {/* Recommended Internship Cards Grid */}
          <div id="recommended-listings" className="scroll-mt-20">
            {filteredInternships.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredInternships.map((internship) => (
                  <RecommendedCard
                    key={internship.id}
                    internship={internship}
                    isApplied={hasStudentApplied(internship.id)}
                    onApply={handleApplyClick}
                    onViewDetails={(item) => setSelectedInternship(item)}
                  />
                ))}
              </div>
            ) : (
              <RecommendedEmptyState
                onResetFilters={() => {
                  setSearchQuery('');
                  setSelectedMode('All');
                  setSortBy('Best Match');
                }}
              />
            )}
          </div>
        </main>
      </div>

      {/* Internship Details Modal */}
      {selectedInternship && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-xl relative text-left space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-[#2563eb] font-black text-sm flex items-center justify-center">
                  {selectedInternship.companyLogo}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0f172a]">{selectedInternship.title}</h3>
                  <p className="text-xs text-[#64748b]">{selectedInternship.companyName}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInternship(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-[#64748b] leading-relaxed">{selectedInternship.description}</p>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 font-medium">
                <div>
                  <span className="text-slate-400">Location:</span>{' '}
                  <strong className="text-slate-800">{selectedInternship.location}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Work Mode:</span>{' '}
                  <strong className="text-[#2563eb]">{selectedInternship.workMode}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Duration:</span>{' '}
                  <strong className="text-slate-800">{selectedInternship.duration}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Stipend:</span>{' '}
                  <strong className="text-emerald-700">{selectedInternship.stipend}</strong>
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <span className="font-bold text-slate-800">Why You Match ({selectedInternship.matchPercentage}%):</span>
                <div className="space-y-1">
                  {selectedInternship.matchReasons.map((reason, i) => (
                    <div key={i} className="flex items-center space-x-2 text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedInternship(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              {hasStudentApplied(selectedInternship.id) ? (
                <button
                  disabled
                  className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold shadow-2xs cursor-not-allowed"
                >
                  Applied ✓
                </button>
              ) : (
                <button
                  onClick={() => {
                    const target = selectedInternship;
                    setSelectedInternship(null);
                    handleApplyClick(target);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs cursor-pointer"
                >
                  Apply Now
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmInternship && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2 text-[#2563eb]">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-base font-bold text-[#0f172a]">Apply for Internship?</h3>
              </div>
              <button
                onClick={() => setConfirmInternship(null)}
                disabled={isSubmitting}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  {confirmInternship.companyLogo}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{confirmInternship.title}</h4>
                  <p className="text-xs text-blue-600 font-semibold">{confirmInternship.companyName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-blue-100 text-slate-700">
                <div><span className="text-slate-400">Location:</span> {confirmInternship.location}</div>
                <div><span className="text-slate-400">Mode:</span> {confirmInternship.workMode}</div>
                <div><span className="text-slate-400">Duration:</span> {confirmInternship.duration}</div>
                <div><span className="text-slate-400">Stipend:</span> {confirmInternship.stipend}</div>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Your profile details, resume, and benchmark skills will be submitted directly to {confirmInternship.companyName}'s recruitment team.
            </p>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex justify-end space-x-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmInternship(null)}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmApplication}
                disabled={isSubmitting}
                className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting application...</span>
                  </>
                ) : (
                  <span>Confirm Application</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Application Success Modal */}
      {successInternship && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-slate-900">Application Submitted Successfully!</h3>
              <p className="text-xs text-slate-500">
                You have applied for <strong className="text-slate-800">{successInternship.title}</strong> at <strong className="text-blue-600">{successInternship.companyName}</strong>.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-left space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Application Status:</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                  Applied
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Current Stage:</span>
                <span className="font-semibold text-slate-800">Application Submitted</span>
              </div>
            </div>

            <button
              onClick={() => setSuccessInternship(null)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
