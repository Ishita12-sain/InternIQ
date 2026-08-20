import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

export type WorkModeFilter = 'All' | 'Remote' | 'Hybrid' | 'On-site';
export type SortOption = 'Best Match' | 'Latest' | 'Highest Stipend';

interface RecommendedFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedMode: WorkModeFilter;
  onModeChange: (mode: WorkModeFilter) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const RecommendedFilters: React.FC<RecommendedFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedMode,
  onModeChange,
  sortBy,
  onSortChange,
}) => {
  const modes: WorkModeFilter[] = ['All', 'Remote', 'Hybrid', 'On-site'];
  const sortOptions: SortOption[] = ['Best Match', 'Latest', 'Highest Stipend'];

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4 text-left">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Field */}
        <div className="relative flex-1">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search internships by role, company, or skill..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563eb] placeholder-slate-400"
          />
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center space-x-2 shrink-0">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-[#64748b] hidden sm:inline-block">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563eb]"
          >
            {sortOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Work Mode Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
        <span className="text-xs font-semibold text-[#64748b] mr-1">Work Mode:</span>
        {modes.map((mode) => (
          <button
            key={mode}
            onClick={() => onModeChange(mode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
              selectedMode === mode
                ? 'bg-[#2563eb] text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>
    </div>
  );
};
