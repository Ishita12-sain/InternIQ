import React from 'react';
import { Search, RotateCcw, Filter } from 'lucide-react';

export type ApplicationStatusFilter =
  | 'All'
  | 'Applied'
  | 'Under Review'
  | 'Shortlisted'
  | 'Interview Scheduled'
  | 'Selected'
  | 'Rejected';

export type AppInternshipTypeFilter = 'All' | 'Full Time' | 'Part Time' | 'Remote' | 'Hybrid';

interface ApplicationFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedStatus: ApplicationStatusFilter;
  onStatusChange: (status: ApplicationStatusFilter) => void;
  selectedType: AppInternshipTypeFilter;
  onTypeChange: (type: AppInternshipTypeFilter) => void;
  onClearFilters: () => void;
}

export const ApplicationFilters: React.FC<ApplicationFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedType,
  onTypeChange,
  onClearFilters,
}) => {
  const statusOptions: ApplicationStatusFilter[] = [
    'All',
    'Applied',
    'Under Review',
    'Shortlisted',
    'Interview Scheduled',
    'Selected',
    'Rejected',
  ];

  const typeOptions: AppInternshipTypeFilter[] = ['All', 'Full Time', 'Part Time', 'Remote', 'Hybrid'];

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4 text-left">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#0f172a]">
          <Filter className="w-4 h-4 text-[#2563eb]" />
          <span>Filter Applications</span>
        </div>
        <button
          type="button"
          onClick={onClearFilters}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-[#2563eb] hover:text-blue-700 cursor-pointer focus:outline-none focus:underline"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Filters</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {/* Search Field */}
        <div className="relative">
          <label htmlFor="app-search" className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Search
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="app-search"
              type="text"
              placeholder="Search company, role or location..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563eb]"
            />
          </div>
        </div>

        {/* Status Dropdown */}
        <div>
          <label htmlFor="app-status" className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Status
          </label>
          <select
            id="app-status"
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value as ApplicationStatusFilter)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563eb]"
          >
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Internship Type Dropdown */}
        <div>
          <label htmlFor="app-type" className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Internship Type
          </label>
          <select
            id="app-type"
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value as AppInternshipTypeFilter)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563eb]"
          >
            {typeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
