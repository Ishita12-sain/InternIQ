import React, { useState, useMemo } from 'react';
import { StudentSidebar } from '../../components/student/StudentSidebar';
import { DashboardHeader } from '../../components/student/DashboardHeader';
import { LogbookEntryCard } from '../../components/student/LogbookEntryCard';
import type { LogbookEntryItem } from '../../components/student/LogbookEntryCard';
import { LogbookEntryForm } from '../../components/student/LogbookEntryForm';
import { LogbookEntryDetails } from '../../components/student/LogbookEntryDetails';
import { WeeklyProgress } from '../../components/student/WeeklyProgress';
import { Plus, BookOpen, Clock, Award, FileText } from 'lucide-react';

export const StudentLogbook: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<LogbookEntryItem | null>(null);

  // Selected Internship Option
  const [selectedInternship, setSelectedInternship] = useState('Google — Software Engineering Intern');
  const mockInternships = [
    'Google — Software Engineering Intern',
    'Microsoft — Frontend Development Intern',
    'Infosys — Web Development Intern',
  ];

  // Initial Mock Logbook Entries
  const [entries, setEntries] = useState<LogbookEntryItem[]>([
    {
      id: 'log-1',
      date: '18 Aug 2026',
      workCompleted: 'Completed the student dashboard UI and responsive layout.',
      skillsGained: ['React', 'TypeScript', 'Tailwind CSS'],
      challengesFaced: 'Configuring safe-area bottom padding for 390px mobile viewports.',
      hoursWorked: 8,
      status: 'Reviewed',
      facultyReview: {
        reviewerName: 'Dr. Ramesh Kumar (Faculty Mentor)',
        comment: 'Excellent UI implementation and responsive structure. Keep it up!',
        reviewedDate: '19 Aug 2026',
      },
    },
    {
      id: 'log-2',
      date: '17 Aug 2026',
      workCompleted: 'Implemented Student Applications tracking list and stage modal.',
      skillsGained: ['React Router v7', 'Lucide React'],
      challengesFaced: 'Ensuring modal triggers do not propagate card clicks.',
      hoursWorked: 8,
      status: 'Reviewed',
      facultyReview: {
        reviewerName: 'Dr. Ramesh Kumar (Faculty Mentor)',
        comment: 'Good application flow logic.',
        reviewedDate: '18 Aug 2026',
      },
    },
    {
      id: 'log-3',
      date: '16 Aug 2026',
      workCompleted: 'Developed Student Readiness Score gauge chart and breakdown cards.',
      skillsGained: ['SVG Gauges', 'CSS Animations'],
      hoursWorked: 7,
      status: 'Submitted',
    },
    {
      id: 'log-4',
      date: '14 Aug 2026',
      workCompleted: 'Drafted Skill Gap analysis comparison matrix and action recommendations.',
      skillsGained: ['Data Visualization', 'Tailwind Grid'],
      hoursWorked: 6,
      status: 'Draft',
    },
  ]);

  const [selectedEntryId, setSelectedEntryId] = useState<string>('log-1');

  // Summary Metrics
  const totalEntries = entries.length;
  const thisWeekEntries = entries.filter((e) => e.date.includes('Aug 2026')).length;
  const hoursLogged = entries.reduce((acc, curr) => acc + curr.hoursWorked, 0);
  const facultyReviewsCount = entries.filter((e) => e.facultyReview).length;

  const selectedEntry = useMemo(() => {
    return entries.find((e) => e.id === selectedEntryId) || entries[0] || null;
  }, [entries, selectedEntryId]);

  const handleSelectEntry = (entry: LogbookEntryItem) => {
    setSelectedEntryId(entry.id);
    const detailsElem = document.getElementById('logbook-entry-details-section');
    if (detailsElem) {
      detailsElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSaveEntry = (data: Omit<LogbookEntryItem, 'id' | 'facultyReview'> & { id?: string }) => {
    if (data.id) {
      // Edit Existing
      setEntries((prev) =>
        prev.map((e) => (e.id === data.id ? { ...e, ...data } : e))
      );
      setSelectedEntryId(data.id);
    } else {
      // Add New
      const newEntry: LogbookEntryItem = {
        ...data,
        id: `log-${Date.now()}`,
      };
      setEntries((prev) => [newEntry, ...prev]);
      setSelectedEntryId(newEntry.id);
    }
    setEditingEntry(null);
  };

  const handleDeleteEntry = (id: string) => {
    if (confirm('Are you sure you want to delete this logbook entry?')) {
      setEntries((prev) => prev.filter((e) => e.id !== id));
      if (selectedEntryId === id) {
        const remaining = entries.filter((e) => e.id !== id);
        if (remaining.length > 0) setSelectedEntryId(remaining[0].id);
      }
    }
  };

  // Mock Weekly Data
  const mockWeeklyProgress = [
    { weekName: 'Week 3 (Current)', entriesCount: 3, hoursCount: 23, reviewStatus: 'Reviewed' as const },
    { weekName: 'Week 2', entriesCount: 4, hoursCount: 28, reviewStatus: 'Reviewed' as const },
    { weekName: 'Week 1', entriesCount: 5, hoursCount: 32, reviewStatus: 'Reviewed' as const },
  ];

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

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto pb-safe">
          {/* Header & Add Entry CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f172a]">Digital Logbook</h1>
              <p className="text-xs sm:text-sm text-[#64748b]">
                Record your internship progress and learning
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingEntry(null);
                setIsFormOpen(true);
              }}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Entry</span>
            </button>
          </div>

          {/* Internship Selector Dropdown */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Active Internship
              </span>
              <p className="text-sm font-bold text-[#0f172a]">{selectedInternship}</p>
            </div>

            <div className="w-full sm:w-72">
              <select
                value={selectedInternship}
                onChange={(e) => setSelectedInternship(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563eb]"
              >
                {mockInternships.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4 Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <div className="bg-white border border-blue-200/60 rounded-2xl p-5 shadow-2xs space-y-1 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-[#64748b]">Total Entries</p>
                <p className="text-2xl font-black text-[#0f172a]">{totalEntries}</p>
                <p className="text-[11px] text-slate-400 font-medium">Logged activities</p>
              </div>
              <div className="p-3 rounded-2xl bg-blue-50 text-[#2563eb] shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white border border-indigo-200/60 rounded-2xl p-5 shadow-2xs space-y-1 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-[#64748b]">This Week</p>
                <p className="text-2xl font-black text-[#0f172a]">{thisWeekEntries} Entries</p>
                <p className="text-[11px] text-slate-400 font-medium">Active work days</p>
              </div>
              <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white border border-amber-200/60 rounded-2xl p-5 shadow-2xs space-y-1 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-[#64748b]">Hours Logged</p>
                <p className="text-2xl font-black text-[#0f172a]">{hoursLogged} hrs</p>
                <p className="text-[11px] text-slate-400 font-medium">Total workload</p>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white border border-emerald-200/60 rounded-2xl p-5 shadow-2xs space-y-1 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-[#64748b]">Faculty Reviews</p>
                <p className="text-2xl font-black text-[#0f172a]">{facultyReviewsCount}</p>
                <p className="text-[11px] text-slate-400 font-medium">Reviewed entries</p>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 shrink-0">
                <Award className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Weekly Progress Section */}
          <WeeklyProgress weeks={mockWeeklyProgress} />

          {/* Logbook Entries Stack */}
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h2 className="text-base font-bold text-[#0f172a]">Logbook Entries</h2>
              <span className="text-xs text-[#64748b]">Click any entry to view details</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {entries.map((entry) => (
                <LogbookEntryCard
                  key={entry.id}
                  entry={entry}
                  isSelected={selectedEntry?.id === entry.id}
                  onSelect={handleSelectEntry}
                  onEdit={(e) => {
                    setEditingEntry(e);
                    setIsFormOpen(true);
                  }}
                  onDelete={handleDeleteEntry}
                />
              ))}
            </div>
          </div>

          {/* Selected Entry Details */}
          <LogbookEntryDetails entry={selectedEntry} />
        </main>
      </div>

      {/* Add / Edit Entry Form Modal */}
      <LogbookEntryForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingEntry(null);
        }}
        onSave={handleSaveEntry}
        editingEntry={editingEntry}
      />
    </div>
  );
};
