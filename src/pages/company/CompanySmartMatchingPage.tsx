import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompanySidebar } from '../../components/company/CompanySidebar';
import { CompanyHeader } from '../../components/company/CompanyHeader';
import {
  ArrowLeft,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  ArrowUpDown,
  X,
  Check,
  Ban,
} from 'lucide-react';

export interface SmartCandidateMatch {
  id: string;
  studentName: string;
  avatarInitials: string;
  college: string;
  department: string;
  cgpa: string;
  matchScore: number; // e.g. 94, 86, 72, 55
  applicationStatus: 'Applied' | 'Under Review' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected';
  requiredSkillsMatched: string[]; // ['React', 'TypeScript', 'REST API']
  missingSkills: string[]; // ['Docker', 'AWS']
  skillBreakdown: {
    skillName: string;
    studentProficiency: 'Strong' | 'Good' | 'Basic' | 'Missing';
    status: 'Matched' | 'Partial' | 'Missing';
  }[];
  recommendation: string;
  appliedDate: string;
  resumeFileName: string;
}

export const CompanySmartMatchingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);
  const candidateListRef = useRef<HTMLDivElement>(null);

  // Non-blocking Feedback Toast
  const [feedback, setFeedback] = useState<string | null>(null);

  // Top Internship Selector State
  const [selectedInternship, setSelectedInternship] = useState({
    id: 'int-m1',
    title: 'Software Engineering Intern',
    company: 'Google / TechNova Partner',
    requiredSkills: ['React', 'TypeScript', 'REST API', 'Docker', 'AWS'],
    cutoffCgpa: '8.0',
  });

  // Master Candidates List with Mock Matching Scores
  const [candidates, setCandidates] = useState<SmartCandidateMatch[]>([
    {
      id: 'sm-1',
      studentName: 'Aarav Sharma',
      avatarInitials: 'AS',
      college: 'IIT Bombay',
      department: 'Computer Science & Engineering',
      cgpa: '9.2',
      matchScore: 94,
      applicationStatus: 'Shortlisted',
      requiredSkillsMatched: ['React', 'TypeScript', 'REST API'],
      missingSkills: ['Docker', 'AWS'],
      skillBreakdown: [
        { skillName: 'React', studentProficiency: 'Strong', status: 'Matched' },
        { skillName: 'TypeScript', studentProficiency: 'Strong', status: 'Matched' },
        { skillName: 'REST API', studentProficiency: 'Strong', status: 'Matched' },
        { skillName: 'Docker', studentProficiency: 'Basic', status: 'Partial' },
        { skillName: 'AWS', studentProficiency: 'Missing', status: 'Missing' },
      ],
      recommendation: 'Strong candidate — matches 94% of core frontend & engineering criteria.',
      appliedDate: '18 Aug 2026',
      resumeFileName: 'Aarav_Sharma_Resume.pdf',
    },
    {
      id: 'sm-2',
      studentName: 'Rohan Mehta',
      avatarInitials: 'RM',
      college: 'VIT Vellore',
      department: 'Software Engineering',
      cgpa: '8.5',
      matchScore: 86,
      applicationStatus: 'Interview',
      requiredSkillsMatched: ['React', 'REST API'],
      missingSkills: ['TypeScript', 'AWS'],
      skillBreakdown: [
        { skillName: 'React', studentProficiency: 'Strong', status: 'Matched' },
        { skillName: 'REST API', studentProficiency: 'Good', status: 'Matched' },
        { skillName: 'TypeScript', studentProficiency: 'Basic', status: 'Partial' },
        { skillName: 'Docker', studentProficiency: 'Good', status: 'Matched' },
        { skillName: 'AWS', studentProficiency: 'Missing', status: 'Missing' },
      ],
      recommendation: 'Good candidate — consider interview after TypeScript & Docker verification.',
      appliedDate: '16 Aug 2026',
      resumeFileName: 'Rohan_Mehta_Resume.pdf',
    },
    {
      id: 'sm-3',
      studentName: 'Priya Patel',
      avatarInitials: 'PP',
      college: 'COEP Pune',
      department: 'Information Technology',
      cgpa: '8.8',
      matchScore: 78,
      applicationStatus: 'Under Review',
      requiredSkillsMatched: ['REST API', 'Docker'],
      missingSkills: ['React', 'AWS'],
      skillBreakdown: [
        { skillName: 'REST API', studentProficiency: 'Strong', status: 'Matched' },
        { skillName: 'Docker', studentProficiency: 'Strong', status: 'Matched' },
        { skillName: 'TypeScript', studentProficiency: 'Good', status: 'Matched' },
        { skillName: 'React', studentProficiency: 'Basic', status: 'Partial' },
        { skillName: 'AWS', studentProficiency: 'Missing', status: 'Missing' },
      ],
      recommendation: 'Moderate candidate — solid backend foundation; web UI requires mentorship.',
      appliedDate: '17 Aug 2026',
      resumeFileName: 'Priya_Patel_CV.pdf',
    },
    {
      id: 'sm-4',
      studentName: 'Kabir Das',
      avatarInitials: 'KD',
      college: 'BITS Pilani',
      department: 'Computer Science',
      cgpa: '8.9',
      matchScore: 61,
      applicationStatus: 'Applied',
      requiredSkillsMatched: ['REST API'],
      missingSkills: ['React', 'TypeScript', 'Docker', 'AWS'],
      skillBreakdown: [
        { skillName: 'REST API', studentProficiency: 'Good', status: 'Matched' },
        { skillName: 'React', studentProficiency: 'Missing', status: 'Missing' },
        { skillName: 'TypeScript', studentProficiency: 'Missing', status: 'Missing' },
        { skillName: 'Docker', studentProficiency: 'Basic', status: 'Partial' },
        { skillName: 'AWS', studentProficiency: 'Missing', status: 'Missing' },
      ],
      recommendation: 'Needs Improvement — low skill overlap with current frontend engineering stack.',
      appliedDate: '14 Aug 2026',
      resumeFileName: 'Kabir_Das_Resume.pdf',
    },
  ]);

  // Selected Candidate for Match Breakdown Details
  const [selectedCandidate, setSelectedCandidate] = useState<SmartCandidateMatch | null>(
    candidates[0]
  );

  // Filters & Sorting State
  const [matchCategoryFilter, setMatchCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'best' | 'lowest' | 'cgpa' | 'newest'>('best');

  // Match category helper
  const getMatchCategory = (score: number) => {
    if (score >= 90) return 'Excellent Match';
    if (score >= 75) return 'Good Match';
    if (score >= 60) return 'Moderate Match';
    return 'Needs Improvement';
  };

  // Card click handler for summary cards with smooth scroll
  const handleSummaryCardClick = (cat: string) => {
    setMatchCategoryFilter(cat);
    if (candidateListRef.current) {
      candidateListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Candidate selection with smooth scroll to breakdown details
  const handleSelectCandidate = (cand: SmartCandidateMatch) => {
    setSelectedCandidate(cand);
    if (detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Action Handlers
  const handleShortlist = (candId: string) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candId ? { ...c, applicationStatus: 'Shortlisted' } : c))
    );
    if (selectedCandidate && selectedCandidate.id === candId) {
      setSelectedCandidate({ ...selectedCandidate, applicationStatus: 'Shortlisted' });
    }
    const name = candidates.find((c) => c.id === candId)?.studentName;
    setFeedback(`Candidate ${name} shortlisted successfully.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleReject = (candId: string) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candId ? { ...c, applicationStatus: 'Rejected' } : c))
    );
    if (selectedCandidate && selectedCandidate.id === candId) {
      setSelectedCandidate({ ...selectedCandidate, applicationStatus: 'Rejected' });
    }
    setFeedback(`Candidate status updated to Rejected.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  // Filter & Search Calculations
  const filteredCandidates = candidates.filter((cand) => {
    const category = getMatchCategory(cand.matchScore);
    const matchesCategory =
      matchCategoryFilter === 'All' ||
      (matchCategoryFilter === 'Excellent' && category === 'Excellent Match') ||
      (matchCategoryFilter === 'Good' && category === 'Good Match') ||
      (matchCategoryFilter === 'Needs Improvement' && (category === 'Moderate Match' || category === 'Needs Improvement'));

    const matchesSearch =
      cand.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cand.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cand.requiredSkillsMatched.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  // Sorting
  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    if (sortBy === 'best') return b.matchScore - a.matchScore;
    if (sortBy === 'lowest') return a.matchScore - b.matchScore;
    if (sortBy === 'cgpa') return parseFloat(b.cgpa) - parseFloat(a.cgpa);
    return b.id.localeCompare(a.id);
  });

  // Summary Metrics Counts
  const totalCount = candidates.length;
  const excellentCount = candidates.filter((c) => c.matchScore >= 90).length;
  const goodCount = candidates.filter((c) => c.matchScore >= 75 && c.matchScore < 90).length;
  const needsImprovementCount = candidates.filter((c) => c.matchScore < 75).length;

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <CompanySidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <CompanyHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Smart Matching"
          subtitle="Find the best candidates for your internships"
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto pb-safe">
          {/* Top Bar with Internship Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard/company')}
                className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h2 className="text-xl font-extrabold text-[#0f172a]">Smart Matching Engine</h2>
                <p className="text-xs text-[#64748b]">
                  Showing AI-evaluated skill match scores for selected internship listing
                </p>
              </div>
            </div>

            {/* Position Selector Dropdown */}
            <div className="flex items-center space-x-2 bg-white border border-[#e2e8f0] rounded-xl px-3 py-2 sm:px-3.5 sm:py-2.5 shadow-2xs w-full sm:w-auto max-w-full sm:max-w-md min-w-0">
              <Sparkles className="w-4 h-4 text-[#2563eb] shrink-0" />
              <select
                value={selectedInternship.id}
                onChange={(e) =>
                  setSelectedInternship({
                    ...selectedInternship,
                    id: e.target.value,
                    title: e.target.options[e.target.selectedIndex].text,
                  })
                }
                className="bg-transparent text-xs font-extrabold text-slate-900 focus:outline-none cursor-pointer w-full min-w-0 truncate pr-1"
              >
                <option value="int-m1">Software Engineering Intern — Google / TechNova</option>
                <option value="int-m2">Backend Developer Intern — TechNova Solutions</option>
                <option value="int-m3">UI/UX Design Intern — TechNova Solutions</option>
              </select>
            </div>
          </div>

          {/* Feedback Toast Banner */}
          {feedback && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2 animate-in fade-in duration-150 text-left">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          {/* 4 Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            {[
              { label: 'Total Candidates', count: totalCount, key: 'All', color: 'border-blue-500 text-[#2563eb] bg-blue-50/30' },
              { label: 'Excellent Match', count: excellentCount, key: 'Excellent', color: 'border-emerald-500 text-emerald-700 bg-emerald-50/30' },
              { label: 'Good Match', count: goodCount, key: 'Good', color: 'border-blue-500 text-blue-700 bg-blue-50/30' },
              { label: 'Needs Improvement', count: needsImprovementCount, key: 'Needs Improvement', color: 'border-amber-500 text-amber-700 bg-amber-50/30' },
            ].map((card) => (
              <div
                key={card.key}
                onClick={() => handleSummaryCardClick(card.key)}
                className={`bg-white border rounded-2xl p-4 shadow-2xs space-y-1 cursor-pointer transition-all duration-150 transform hover:-translate-y-0.5 ${
                  matchCategoryFilter === card.key
                    ? `${card.color} ring-2 ring-blue-500/20 font-bold`
                    : 'border-[#e2e8f0] hover:border-slate-300'
                }`}
              >
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block truncate">
                  {card.label}
                </span>
                <p className="text-2xl font-black text-[#0f172a]">{card.count}</p>
              </div>
            ))}
          </div>

          {/* Search, Filter & Sort Controls */}
          <div
            ref={candidateListRef}
            id="smart-matching-list-section"
            className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs space-y-3 text-left scroll-mt-6"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search candidates, college or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              {/* Match Category Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                <Filter className="w-4 h-4 text-[#2563eb] shrink-0 mr-1" />
                {['All', 'Excellent', 'Good', 'Needs Improvement'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setMatchCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                      matchCategoryFilter === cat
                        ? 'bg-[#2563eb] text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Sorting selector */}
              <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#2563eb] shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#2563eb]"
                >
                  <option value="best">Best Match</option>
                  <option value="lowest">Lowest Match</option>
                  <option value="cgpa">Highest CGPA</option>
                  <option value="newest">Newest Application</option>
                </select>
              </div>
            </div>
          </div>

          {/* Candidate Match Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-left">
            {sortedCandidates.map((cand) => {
              const isSelected = selectedCandidate?.id === cand.id;

              return (
                <div
                  key={cand.id}
                  onClick={() => handleSelectCandidate(cand)}
                  className={`bg-white border rounded-2xl p-5 shadow-2xs space-y-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#2563eb] ring-2 ring-blue-500/20 bg-blue-50/10'
                      : 'border-[#e2e8f0] hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-blue-100 text-[#2563eb] font-extrabold flex items-center justify-center text-sm border border-blue-200 shrink-0 shadow-2xs">
                        {cand.avatarInitials}
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-[#0f172a]">{cand.studentName}</h3>
                        <p className="text-xs text-[#64748b] font-medium">{cand.college}</p>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {cand.department} • <strong className="text-slate-900">CGPA: {cand.cgpa}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Match Score Badge */}
                    <div className="text-right shrink-0">
                      <div
                        className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-black border ${
                          cand.matchScore >= 90
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : cand.matchScore >= 75
                            ? 'bg-blue-50 text-[#2563eb] border-blue-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{cand.matchScore}% Match</span>
                      </div>
                      <span className="block text-[10px] text-slate-400 font-bold mt-1 uppercase">
                        {getMatchCategory(cand.matchScore)}
                      </span>
                    </div>
                  </div>

                  {/* Recommendation Text */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium leading-relaxed">
                    <span className="font-bold text-[#2563eb]">AI Insight: </span>
                    {cand.recommendation}
                  </div>

                  {/* Required vs Missing Skills Badges */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                      <span className="text-[11px] font-bold text-slate-500 uppercase mr-1">Matched:</span>
                      {cand.requiredSkillsMatched.map((sk) => (
                        <span
                          key={sk}
                          className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold"
                        >
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>{sk}</span>
                        </span>
                      ))}
                    </div>

                    {cand.missingSkills.length > 0 && (
                      <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Missing:</span>
                        {cand.missingSkills.map((sk) => (
                          <span
                            key={sk}
                            className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold"
                          >
                            <X className="w-3 h-3 text-rose-500" />
                            <span>{sk}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs font-semibold">
                    <span className="text-slate-500 text-[11px]">
                      Status: <strong className="text-slate-900">{cand.applicationStatus}</strong>
                    </span>

                    <div className="flex items-center space-x-2">
                      {cand.applicationStatus !== 'Shortlisted' && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShortlist(cand.id);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#2563eb] text-xs font-semibold cursor-pointer"
                        >
                          Shortlist
                        </button>
                      )}

                      {cand.applicationStatus !== 'Rejected' && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReject(cand.id);
                          }}
                          className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-xs font-semibold cursor-pointer"
                          title="Reject Candidate"
                        >
                          <Ban className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/company/interviews');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs cursor-pointer"
                      >
                        Schedule Interview
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Skill Match Breakdown Details Section */}
          {selectedCandidate && (
            <div
              ref={detailsRef}
              id="match-details-section"
              className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-5 text-left scroll-mt-6"
            >
              <div className="grid grid-cols-[48px_minmax(0,1fr)_auto] sm:grid-cols-[56px_minmax(0,1fr)_auto] gap-3 sm:gap-4 items-center border-b border-slate-100 pb-4">
                {/* 1. Fixed-size circular avatar */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-100 text-[#2563eb] font-extrabold text-sm sm:text-base flex items-center justify-center border border-blue-200 shrink-0 shadow-2xs">
                  {selectedCandidate.avatarInitials}
                </div>

                {/* 2. Flexible Candidate Information */}
                <div className="min-w-0 space-y-0.5 leading-snug">
                  <h3 className="text-base sm:text-lg font-extrabold text-[#0f172a] truncate">
                    {selectedCandidate.studentName}
                  </h3>
                  <p className="text-xs text-[#64748b] leading-normal">
                    Match Analysis for{' '}
                    <strong className="text-slate-900 font-semibold inline">
                      {selectedInternship.title}
                    </strong>
                  </p>
                </div>

                {/* 3. Compact Responsive Match Badge */}
                <div className="shrink-0">
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-blue-50 text-[#2563eb] border border-blue-200 shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-[#2563eb]" />
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-1 text-left sm:text-center leading-tight">
                      <span className="font-extrabold text-xs sm:text-sm text-[#2563eb]">
                        {selectedCandidate.matchScore}%
                      </span>
                      <span className="text-[10px] sm:text-xs font-bold text-blue-700/80 whitespace-nowrap">
                        Overall Match
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Skill Breakdown Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                  Skill Match Breakdown Matrix
                </h4>

                <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs bg-white">
                  {/* Header Row */}
                  <div className="bg-slate-50 px-3 py-3.5 grid grid-cols-[30%_30%_40%] items-center font-bold text-slate-700">
                    <span className="truncate pr-1">Required Skill</span>
                    <span className="truncate pr-1">Student Proficiency</span>
                    <span className="truncate">Evaluation Status</span>
                  </div>

                  {/* Body Rows */}
                  {selectedCandidate.skillBreakdown.map((row) => (
                    <div
                      key={row.skillName}
                      className="px-3 py-3.5 grid grid-cols-[30%_30%_40%] items-center font-medium min-h-[44px]"
                    >
                      <div className="flex items-center min-w-0 pr-1">
                        <span className="font-bold text-slate-900 truncate">{row.skillName}</span>
                      </div>
                      <div className="flex items-center min-w-0 pr-1">
                        <span
                          className={`font-semibold truncate ${
                            row.studentProficiency === 'Strong'
                              ? 'text-emerald-700'
                              : row.studentProficiency === 'Good'
                              ? 'text-blue-700'
                              : 'text-slate-500'
                          }`}
                        >
                          {row.studentProficiency}
                        </span>
                      </div>
                      <div className="flex items-center min-w-0">
                        {row.status === 'Matched' && (
                          <span className="inline-flex items-center justify-center max-w-full px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold text-center leading-tight">
                            Fully Matched
                          </span>
                        )}
                        {row.status === 'Partial' && (
                          <span className="inline-flex items-center justify-center max-w-full px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold text-center leading-tight">
                            Partial Match
                          </span>
                        )}
                        {row.status === 'Missing' && (
                          <span className="inline-flex items-center justify-center max-w-full px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold text-center leading-tight">
                            Missing Skill
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full">
                  <button
                    type="button"
                    onClick={() => navigate('/company/applicants')}
                    className="w-full inline-flex items-center justify-center px-3 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer min-h-[40px] text-center"
                  >
                    View Full Profile
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShortlist(selectedCandidate.id)}
                    className="w-full inline-flex items-center justify-center px-3 py-2.5 rounded-xl bg-blue-50 border border-blue-200 text-[#2563eb] text-xs font-semibold hover:bg-blue-100 cursor-pointer min-h-[40px] text-center"
                  >
                    Shortlist Candidate
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/company/interviews')}
                    className="w-full inline-flex items-center justify-center px-3 py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs cursor-pointer min-h-[40px] text-center"
                  >
                    Schedule Interview
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
