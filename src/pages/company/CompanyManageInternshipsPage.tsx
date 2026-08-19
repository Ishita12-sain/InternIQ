import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CompanySidebar } from '../../components/company/CompanySidebar';
import { CompanyHeader } from '../../components/company/CompanyHeader';
import {
  ArrowLeft,
  PlusCircle,
  Search,
  Filter,
  Briefcase,
  Users,
  CheckCircle2,
  FileText,
  XCircle,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Eye,
  Edit,
  Trash2,
  X,
  AlertTriangle,
  ArrowUpDown,
} from 'lucide-react';

export interface CompanyInternshipItem {
  id: string;
  title: string;
  companyName: string;
  department: string;
  location: string;
  workMode: 'Remote' | 'Full Time' | 'Hybrid' | 'Part Time';
  duration: string;
  stipend: string;
  openings: number;
  applicantsCount: number;
  applicationDeadline: string;
  postedDate: string;
  status: 'Active' | 'Draft' | 'Closed';
  description?: string;
  requiredSkills?: string;
}

export const CompanyManageInternshipsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const listingsRef = useRef<HTMLDivElement>(null);

  // Parse status query parameter (?status=all, ?status=active, ?status=draft, ?status=closed)
  const urlStatusParam = searchParams.get('status');

  const getInitialStatus = (param: string | null): string => {
    if (!param) return 'All';
    const lower = param.toLowerCase();
    if (lower === 'active') return 'Active';
    if (lower === 'draft') return 'Draft';
    if (lower === 'closed') return 'Closed';
    return 'All';
  };

  const [statusFilter, setStatusFilter] = useState<string>(() => getInitialStatus(urlStatusParam));

  // Keep status filter synced when URL search parameter changes
  useEffect(() => {
    setStatusFilter(getInitialStatus(urlStatusParam));
  }, [urlStatusParam]);

  const handleStatusFilterChange = (newStatus: string, scrollToListings = true) => {
    setStatusFilter(newStatus);
    if (newStatus === 'All') {
      searchParams.delete('status');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ ...Object.fromEntries(searchParams), status: newStatus.toLowerCase() });
    }

    if (scrollToListings && listingsRef.current) {
      listingsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Default Mock Internships
  const defaultList: CompanyInternshipItem[] = [
    {
      id: 'int-m1',
      title: 'Frontend Developer Intern',
      companyName: 'TechNova Solutions',
      department: 'Engineering',
      location: 'Bengaluru, KA',
      workMode: 'Remote',
      duration: '3 Months',
      stipend: '₹25,000 / month',
      openings: 3,
      applicantsCount: 42,
      applicationDeadline: '30 Aug 2026',
      postedDate: '10 Aug 2026',
      status: 'Active',
      description: 'Build modern responsive frontend applications using React and TypeScript.',
      requiredSkills: 'React, TypeScript, Tailwind CSS',
    },
    {
      id: 'int-m2',
      title: 'Backend Developer Intern',
      companyName: 'TechNova Solutions',
      department: 'Software Architecture',
      location: 'Pune, MH',
      workMode: 'Full Time',
      duration: '6 Months',
      stipend: '₹28,000 / month',
      openings: 2,
      applicantsCount: 28,
      applicationDeadline: '05 Sep 2026',
      postedDate: '05 Aug 2026',
      status: 'Active',
      description: 'Design and deploy secure RESTful web APIs and database backend logic.',
      requiredSkills: 'Node.js, Express, SQL',
    },
    {
      id: 'int-m3',
      title: 'UI/UX Design Intern',
      companyName: 'TechNova Solutions',
      department: 'Product Design',
      location: 'Mumbai, MH',
      workMode: 'Hybrid',
      duration: '3 Months',
      stipend: '₹18,000 / month',
      openings: 1,
      applicantsCount: 19,
      applicationDeadline: '25 Aug 2026',
      postedDate: '12 Aug 2026',
      status: 'Active',
      description: 'Design user journeys, wireframes, and high-fidelity mobile app interfaces.',
      requiredSkills: 'Figma, User Research',
    },
    {
      id: 'int-m4',
      title: 'Cloud DevOps Intern',
      companyName: 'TechNova Solutions',
      department: 'Infrastructure',
      location: 'Noida, UP',
      workMode: 'Remote',
      duration: '3 Months',
      stipend: '₹22,000 / month',
      openings: 2,
      applicantsCount: 0,
      applicationDeadline: '15 Sep 2026',
      postedDate: '17 Aug 2026',
      status: 'Draft',
      description: 'Configure Docker containers and CI/CD pipelines.',
      requiredSkills: 'Docker, AWS, Linux',
    },
    {
      id: 'int-m5',
      title: 'Data Science & AI Intern',
      companyName: 'TechNova Solutions',
      department: 'Analytics',
      location: 'Hyderabad, TS',
      workMode: 'Remote',
      duration: '6 Months',
      stipend: '₹30,000 / month',
      openings: 2,
      applicantsCount: 34,
      applicationDeadline: '01 Aug 2026',
      postedDate: '01 Jul 2026',
      status: 'Closed',
      description: 'Train machine learning models and dataset pipelines.',
      requiredSkills: 'Python, SQL, TensorFlow',
    },
  ];

  // Combined State with localStorage
  const [internships, setInternships] = useState<CompanyInternshipItem[]>(() => {
    const savedCustom = localStorage.getItem('interniq_company_custom_internships');
    const custom: CompanyInternshipItem[] = savedCustom ? JSON.parse(savedCustom) : [];
    return [...custom, ...defaultList];
  });

  // Filter & Search Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [workModeFilter, setWorkModeFilter] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Feedback Toast state
  const [feedback, setFeedback] = useState<string | null>(null);

  // Modals & Confirmation state
  const [closingItem, setClosingItem] = useState<CompanyInternshipItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<CompanyInternshipItem | null>(null);
  const [editingItem, setEditingItem] = useState<CompanyInternshipItem | null>(null);

  // Confirm Close Action
  const handleConfirmClose = () => {
    if (!closingItem) return;
    const updated = internships.map((item) =>
      item.id === closingItem.id ? { ...item, status: 'Closed' as const } : item
    );
    setInternships(updated);

    const customList = updated.filter((item) => item.id.startsWith('custom-int-'));
    localStorage.setItem('interniq_company_custom_internships', JSON.stringify(customList));

    const itemTitle = closingItem.title;
    setClosingItem(null);
    setFeedback(`Internship "${itemTitle}" has been closed.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  // Confirm Delete Action
  const handleConfirmDelete = () => {
    if (!deletingItem) return;
    const updated = internships.filter((item) => item.id !== deletingItem.id);
    setInternships(updated);

    const customList = updated.filter((item) => item.id.startsWith('custom-int-'));
    localStorage.setItem('interniq_company_custom_internships', JSON.stringify(customList));

    const itemTitle = deletingItem.title;
    setDeletingItem(null);
    setFeedback(`Internship "${itemTitle}" has been deleted.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  // Publish Draft Action
  const handlePublishDraft = (item: CompanyInternshipItem) => {
    const updated = internships.map((i) =>
      i.id === item.id ? { ...i, status: 'Active' as const } : i
    );
    setInternships(updated);

    const customList = updated.filter((i) => i.id.startsWith('custom-int-'));
    localStorage.setItem('interniq_company_custom_internships', JSON.stringify(customList));

    setFeedback(`Draft "${item.title}" is now published and active.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  // Save Edit Action
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const updated = internships.map((item) =>
      item.id === editingItem.id ? editingItem : item
    );
    setInternships(updated);

    const customList = updated.filter((item) => item.id.startsWith('custom-int-'));
    localStorage.setItem('interniq_company_custom_internships', JSON.stringify(customList));

    setEditingItem(null);
  };

  // Filter & Sort Calculations
  const filteredList = internships.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.requiredSkills && item.requiredSkills.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesWorkMode = workModeFilter === 'All' || item.workMode === workModeFilter;

    return matchesSearch && matchesStatus && matchesWorkMode;
  });

  const sortedList = [...filteredList].sort((a, b) => {
    if (sortOrder === 'newest') {
      return b.id.localeCompare(a.id);
    }
    return a.id.localeCompare(b.id);
  });

  // Metrics Summary
  const activeCount = internships.filter((i) => i.status === 'Active').length;
  const draftCount = internships.filter((i) => i.status === 'Draft').length;
  const closedCount = internships.filter((i) => i.status === 'Closed').length;

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <CompanySidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <CompanyHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Manage Internships"
          subtitle="View, edit, pause, or close corporate internship listings."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto pb-safe">
          {/* Header Bar */}
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
                <h2 className="text-xl font-extrabold text-[#0f172a]">Manage Internships</h2>
                <p className="text-xs text-[#64748b]">
                  Showing {sortedList.length} total internship postings
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/company/internships/new')}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Internship</span>
            </button>
          </div>

          {/* Toast Notification Banner */}
          {feedback && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2 animate-in fade-in duration-150 text-left">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          {/* 4 Clickable Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div
              onClick={() => handleStatusFilterChange('All')}
              className={`bg-white border rounded-2xl p-4 shadow-2xs space-y-1 cursor-pointer transition-all duration-150 transform hover:-translate-y-0.5 ${
                statusFilter === 'All'
                  ? 'border-[#2563eb] ring-2 ring-blue-500/20 bg-blue-50/20'
                  : 'border-[#e2e8f0] hover:border-blue-300'
              }`}
            >
              <div className="flex items-center space-x-2 text-[#2563eb]">
                <Briefcase className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Total Listings
                </span>
              </div>
              <p className="text-2xl font-black text-[#0f172a]">{internships.length}</p>
            </div>

            <div
              onClick={() => handleStatusFilterChange('Active')}
              className={`bg-white border rounded-2xl p-4 shadow-2xs space-y-1 cursor-pointer transition-all duration-150 transform hover:-translate-y-0.5 ${
                statusFilter === 'Active'
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20'
                  : 'border-[#e2e8f0] hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center space-x-2 text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Active
                </span>
              </div>
              <p className="text-2xl font-black text-[#0f172a]">{activeCount}</p>
            </div>

            <div
              onClick={() => handleStatusFilterChange('Draft')}
              className={`bg-white border rounded-2xl p-4 shadow-2xs space-y-1 cursor-pointer transition-all duration-150 transform hover:-translate-y-0.5 ${
                statusFilter === 'Draft'
                  ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/20'
                  : 'border-[#e2e8f0] hover:border-amber-300'
              }`}
            >
              <div className="flex items-center space-x-2 text-amber-600">
                <FileText className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Draft
                </span>
              </div>
              <p className="text-2xl font-black text-[#0f172a]">{draftCount}</p>
            </div>

            <div
              onClick={() => handleStatusFilterChange('Closed')}
              className={`bg-white border rounded-2xl p-4 shadow-2xs space-y-1 cursor-pointer transition-all duration-150 transform hover:-translate-y-0.5 ${
                statusFilter === 'Closed'
                  ? 'border-slate-500 ring-2 ring-slate-500/20 bg-slate-100/60'
                  : 'border-[#e2e8f0] hover:border-slate-300'
              }`}
            >
              <div className="flex items-center space-x-2 text-slate-500">
                <XCircle className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Closed
                </span>
              </div>
              <p className="text-2xl font-black text-[#0f172a]">{closedCount}</p>
            </div>
          </div>

          {/* Search & Filters Controls */}
          <div
            ref={listingsRef}
            id="listings-section"
            className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs space-y-3 text-left scroll-mt-6"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search title, skills or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                <Filter className="w-4 h-4 text-[#2563eb] shrink-0 mr-1" />
                {['All', 'Active', 'Draft', 'Closed'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusFilterChange(st)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                      statusFilter === st
                        ? 'bg-[#2563eb] text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Work Mode & Sort Dropdowns */}
              <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
                <select
                  value={workModeFilter}
                  onChange={(e) => setWorkModeFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#2563eb]"
                >
                  <option value="All">All Modes</option>
                  <option value="Remote">Remote</option>
                  <option value="Full Time">Full Time</option>
                  <option value="Hybrid">Hybrid</option>
                </select>

                <button
                  type="button"
                  onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
                  className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#2563eb]" />
                  <span>{sortOrder === 'newest' ? 'Newest' : 'Oldest'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Cards Grid or Empty State */}
          {sortedList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
              {sortedList.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-4 hover:border-blue-300 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563eb] border border-blue-200 text-[11px] font-bold">
                        {item.workMode}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${
                          item.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : item.status === 'Draft'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-[#0f172a]">{item.title}</h3>
                      <p className="text-xs text-[#64748b] font-medium">{item.department}</p>
                    </div>

                    <div className="space-y-1.5 text-xs text-[#64748b] pt-1">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{item.duration} • Posted {item.postedDate}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-bold text-emerald-700">{item.stipend}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Deadline: {item.applicationDeadline}</span>
                      </div>
                      {item.requiredSkills && (
                        <p className="text-[11px] text-[#2563eb] font-semibold truncate pt-0.5">
                          Skills: {item.requiredSkills}
                        </p>
                      )}
                      <div className="flex items-center space-x-2 font-bold text-[#0f172a] pt-1">
                        <Users className="w-3.5 h-3.5 text-[#2563eb] shrink-0" />
                        <span>{item.applicantsCount} Applicants ({item.openings} Openings)</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="space-y-2 pt-3 border-t border-slate-100">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/company/internships/${item.id}`)}
                        className="inline-flex items-center justify-center space-x-1 py-1.5 px-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditingItem(item)}
                        className="inline-flex items-center justify-center space-x-1 py-1.5 px-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-[#2563eb] text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => navigate(`/company/internships/${item.id}/applicants`)}
                        className="inline-flex items-center justify-center space-x-1 py-1.5 px-1 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#2563eb] text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Applicants</span>
                      </button>

                      {item.status === 'Draft' ? (
                        <button
                          type="button"
                          onClick={() => handlePublishDraft(item)}
                          className="inline-flex items-center justify-center space-x-1 py-1.5 px-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Publish</span>
                        </button>
                      ) : item.status === 'Active' ? (
                        <button
                          type="button"
                          onClick={() => setClosingItem(item)}
                          className="inline-flex items-center justify-center space-x-1 py-1.5 px-1 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Close</span>
                        </button>
                      ) : (
                        <span className="py-1.5 text-center text-xs font-bold text-slate-400 bg-slate-100 rounded-xl">
                          Closed
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => setDeletingItem(item)}
                        className="inline-flex items-center justify-center space-x-1 py-1.5 px-1 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-xs font-semibold transition-colors cursor-pointer"
                        title="Delete Internship"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Attractive Empty State */
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-12 text-center space-y-4 shadow-2xs max-w-xl mx-auto my-6">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-[#2563eb] flex items-center justify-center mx-auto">
                <Briefcase className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#0f172a]">No internships posted yet</h3>
                <p className="text-xs text-[#64748b] leading-relaxed">
                  Start by posting your first internship position to attract top candidate talent from partner universities.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/company/internships/new')}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post Your First Internship</span>
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Confirmation Modal for Delete Internship */}
      {deletingItem && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-xl text-left space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 shrink-0">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0f172a]">Delete Internship Listing?</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              Are you sure you want to permanently delete <strong className="text-slate-900">"{deletingItem.title}"</strong>?
            </p>

            <div className="flex justify-end space-x-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-2xs cursor-pointer"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Close Internship */}
      {closingItem && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-xl text-left space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-amber-600">
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0f172a]">Close Internship Listing?</h3>
                <p className="text-xs text-slate-500">This action will mark the listing as closed.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              Are you sure you want to close <strong className="text-slate-900">"{closingItem.title}"</strong>? Students will no longer be able to submit new applications.
            </p>

            <div className="flex justify-end space-x-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setClosingItem(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmClose}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-2xs cursor-pointer"
              >
                Confirm & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Internship Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-xl text-left space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#0f172a]">Edit Internship Position</h3>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs font-medium">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">
                  Internship Title
                </label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563eb]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editingItem.location}
                    onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563eb]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">
                    Work Mode
                  </label>
                  <select
                    value={editingItem.workMode}
                    onChange={(e) => setEditingItem({ ...editingItem, workMode: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563eb]"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">
                    Monthly Stipend
                  </label>
                  <input
                    type="text"
                    value={editingItem.stipend}
                    onChange={(e) => setEditingItem({ ...editingItem, stipend: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563eb]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">
                    Status
                  </label>
                  <select
                    value={editingItem.status}
                    onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563eb]"
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
