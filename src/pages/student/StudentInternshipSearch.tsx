import React, { useState, useMemo } from 'react';
import { StudentSidebar } from '../../components/student/StudentSidebar';
import { DashboardHeader } from '../../components/student/DashboardHeader';
import { InternshipSearchBar } from '../../components/student/InternshipSearchBar';
import { InternshipFilters } from '../../components/student/InternshipFilters';
import type { InternshipTypeFilter } from '../../components/student/InternshipFilters';
import { InternshipSearchCard } from '../../components/student/InternshipSearchCard';
import type { SearchInternshipItem } from '../../components/student/InternshipSearchCard';
import { X, SearchX, RotateCcw } from 'lucide-react';

export const StudentInternshipSearch: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedType, setSelectedType] = useState<InternshipTypeFilter>('All');
  const [selectedDuration, setSelectedDuration] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [selectedInternship, setSelectedInternship] = useState<SearchInternshipItem | null>(null);

  // 8 Realistic Mock Internship Listings
  const mockInternships: SearchInternshipItem[] = [
    {
      id: 'search-1',
      companyName: 'TechNova Solutions',
      companyLogo: 'TN',
      title: 'Frontend Developer Intern',
      location: 'Bengaluru, KA',
      internshipType: 'Remote',
      duration: '3 Months',
      stipend: '₹25,000 / month',
      skills: ['React', 'TypeScript', 'Tailwind CSS'],
      matchPercentage: 94,
      description: 'Build modern responsive frontend applications using React and TypeScript.',
    },
    {
      id: 'search-2',
      companyName: 'DataSphere Systems',
      companyLogo: 'DS',
      title: 'Backend Developer Intern',
      location: 'Pune, MH',
      internshipType: 'Full Time',
      duration: '6 Months',
      stipend: '₹28,000 / month',
      skills: ['Node.js', 'Express', 'SQL', 'REST APIs'],
      matchPercentage: 88,
      description: 'Design and deploy secure RESTful web APIs and database backend logic.',
    },
    {
      id: 'search-3',
      companyName: 'StackCraft Labs',
      companyLogo: 'SC',
      title: 'Full Stack Developer Intern',
      location: 'Hyderabad, TS',
      internshipType: 'Hybrid',
      duration: '6 Months',
      stipend: '₹32,000 / month',
      skills: ['React', 'Node.js', 'MongoDB', 'JavaScript'],
      matchPercentage: 91,
      description: 'Develop full-stack enterprise portals with React frontend and Node services.',
    },
    {
      id: 'search-4',
      companyName: 'Insight Analytics',
      companyLogo: 'IA',
      title: 'Data Analyst Intern',
      location: 'Mumbai, MH',
      internshipType: 'Remote',
      duration: '3 Months',
      stipend: '₹20,000 / month',
      skills: ['SQL', 'Python', 'Excel', 'PowerBI'],
      matchPercentage: 81,
      description: 'Extract business insights, run SQL queries, and construct interactive reporting dashboards.',
    },
    {
      id: 'search-5',
      companyName: 'CreativeStudio Inc',
      companyLogo: 'CS',
      title: 'UI/UX Designer Intern',
      location: 'Delhi NCR',
      internshipType: 'Part Time',
      duration: '3 Months',
      stipend: '₹18,000 / month',
      skills: ['Figma', 'HTML', 'CSS', 'User Research'],
      matchPercentage: 79,
      description: 'Design user journeys, wireframes, and high-fidelity mobile app interfaces.',
    },
    {
      id: 'search-6',
      companyName: 'Cognitive AI Labs',
      companyLogo: 'CA',
      title: 'Machine Learning Intern',
      location: 'Bengaluru, KA',
      internshipType: 'Hybrid',
      duration: '6 Months',
      stipend: '₹35,000 / month',
      skills: ['Python', 'TensorFlow', 'SQL', 'Git'],
      matchPercentage: 85,
      description: 'Train deep learning models, preprocess dataset pipelines, and evaluate model performance.',
    },
    {
      id: 'search-7',
      companyName: 'Apex Systems',
      companyLogo: 'AS',
      title: 'Software Engineer Intern',
      location: 'Pune, MH',
      internshipType: 'Full Time',
      duration: '6 Months',
      stipend: '₹30,000 / month',
      skills: ['JavaScript', 'Git', 'System Design', 'C++'],
      matchPercentage: 87,
      description: 'Participate in core software development, code reviews, and automated unit testing.',
    },
    {
      id: 'search-8',
      companyName: 'CloudScale Infrastructure',
      companyLogo: 'CI',
      title: 'Cloud / DevOps Intern',
      location: 'Chennai, TN',
      internshipType: 'Remote',
      duration: '4 Months',
      stipend: '₹26,000 / month',
      skills: ['Docker', 'AWS', 'Linux', 'Git'],
      matchPercentage: 83,
      description: 'Assist in configuring Docker containers, CI/CD pipelines, and cloud monitoring tools.',
    },
  ];

  // Extract Unique Filter Options
  const locationOptions = useMemo(() => {
    return Array.from(new Set(mockInternships.map((i) => i.location)));
  }, [mockInternships]);

  const durationOptions = useMemo(() => {
    return Array.from(new Set(mockInternships.map((i) => i.duration)));
  }, [mockInternships]);

  const skillOptions = useMemo(() => {
    const all = mockInternships.flatMap((i) => i.skills);
    return Array.from(new Set(all));
  }, [mockInternships]);

  // Filtering Logic
  const filteredInternships = useMemo(() => {
    return mockInternships.filter((item) => {
      // Location Filter
      if (selectedLocation !== 'All' && item.location !== selectedLocation) {
        return false;
      }
      // Type Filter
      if (selectedType !== 'All' && item.internshipType !== selectedType) {
        return false;
      }
      // Duration Filter
      if (selectedDuration !== 'All' && item.duration !== selectedDuration) {
        return false;
      }
      // Skill Filter
      if (selectedSkill !== 'All' && !item.skills.includes(selectedSkill)) {
        return false;
      }
      // Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchCompany = item.companyName.toLowerCase().includes(q);
        const matchLocation = item.location.toLowerCase().includes(q);
        const matchSkill = item.skills.some((s) => s.toLowerCase().includes(q));
        return matchTitle || matchCompany || matchLocation || matchSkill;
      }
      return true;
    });
  }, [mockInternships, selectedLocation, selectedType, selectedDuration, selectedSkill, searchQuery]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedLocation('All');
    setSelectedType('All');
    setSelectedDuration('All');
    setSelectedSkill('All');
  };

  const handleApply = (internship: SearchInternshipItem) => {
    alert(`Applied successfully for "${internship.title}" at ${internship.companyName}!`);
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
          {/* Header Title & Subtitle */}
          <div className="text-left space-y-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f172a]">Internship Search</h1>
            <p className="text-xs sm:text-sm text-[#64748b]">
              Find internships that match your skills and interests.
            </p>
          </div>

          {/* Prominent Search Bar */}
          <InternshipSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearchSubmit={(e) => e.preventDefault()}
          />

          {/* Filter Controls */}
          <InternshipFilters
            selectedLocation={selectedLocation}
            onLocationChange={setSelectedLocation}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            selectedDuration={selectedDuration}
            onDurationChange={setSelectedDuration}
            selectedSkill={selectedSkill}
            onSkillChange={setSelectedSkill}
            onClearFilters={handleClearFilters}
            locationOptions={locationOptions}
            durationOptions={durationOptions}
            skillOptions={skillOptions}
          />

          {/* Results Count & Section Title */}
          <div className="flex items-center justify-between text-xs font-semibold text-[#64748b]">
            <span>Showing {filteredInternships.length} internships</span>
            {(searchQuery || selectedLocation !== 'All' || selectedType !== 'All' || selectedDuration !== 'All' || selectedSkill !== 'All') && (
              <span className="text-[#2563eb]">Filtered Results</span>
            )}
          </div>

          {/* Internship Search Cards Grid */}
          {filteredInternships.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredInternships.map((internship) => (
                <InternshipSearchCard
                  key={internship.id}
                  internship={internship}
                  onApply={handleApply}
                  onViewDetails={(item) => setSelectedInternship(item)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-12 text-center space-y-4 shadow-2xs">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-[#2563eb] flex items-center justify-center mx-auto">
                <SearchX className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#0f172a]">No Internships Found</h3>
                <p className="text-xs text-[#64748b] max-w-sm mx-auto">
                  No internship positions matched your current search query or active filter selections.
                </p>
              </div>
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#2563eb] text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear All Filters</span>
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Internship View Details Modal */}
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

              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 font-medium">
                <div>
                  <span className="text-slate-400">Location:</span>{' '}
                  <strong className="text-slate-800">{selectedInternship.location}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Type:</span>{' '}
                  <strong className="text-[#2563eb]">{selectedInternship.internshipType}</strong>
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
            </div>

            <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedInternship(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handleApply(selectedInternship);
                  setSelectedInternship(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs cursor-pointer"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
