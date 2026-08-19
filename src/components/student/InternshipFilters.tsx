import React from 'react';
import { RotateCcw, Filter } from 'lucide-react';
import { SearchableLocationSelector } from './SearchableLocationSelector';

export type InternshipTypeFilter = 'All' | 'Full Time' | 'Part Time' | 'Remote' | 'Hybrid';

interface InternshipFiltersProps {
  selectedLocation: string;
  onLocationChange: (loc: string) => void;
  selectedType: InternshipTypeFilter;
  onTypeChange: (type: InternshipTypeFilter) => void;
  selectedDuration: string;
  onDurationChange: (dur: string) => void;
  selectedSkill: string;
  onSkillChange: (skill: string) => void;
  onClearFilters: () => void;
  locationOptions: string[];
  durationOptions: string[];
  skillOptions: string[];
}

export const InternshipFilters: React.FC<InternshipFiltersProps> = ({
  selectedLocation,
  onLocationChange,
  selectedType,
  onTypeChange,
  selectedDuration,
  onDurationChange,
  selectedSkill,
  onSkillChange,
  onClearFilters,
  locationOptions,
  durationOptions,
  skillOptions,
}) => {
  const typeOptions: InternshipTypeFilter[] = ['All', 'Full Time', 'Part Time', 'Remote', 'Hybrid'];

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4 text-left">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#0f172a]">
          <Filter className="w-4 h-4 text-[#2563eb]" />
          <span>Filter Internships</span>
        </div>
        <button
          onClick={onClearFilters}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-[#2563eb] hover:text-blue-700 cursor-pointer focus:outline-none focus:underline"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Filters</span>
        </button>
      </div>

      {/* Filter Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Searchable Location Popover Selector */}
        <SearchableLocationSelector
          selectedLocation={selectedLocation}
          onLocationChange={onLocationChange}
          availableLocations={locationOptions}
        />

        {/* Duration Dropdown */}
        <div className="space-y-1">
          <label htmlFor="filter-duration" className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            Duration
          </label>
          <select
            id="filter-duration"
            value={selectedDuration}
            onChange={(e) => onDurationChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563eb]"
          >
            <option value="All">All Durations</option>
            {durationOptions.map((dur) => (
              <option key={dur} value={dur}>
                {dur}
              </option>
            ))}
          </select>
        </div>

        {/* Skills Filter Dropdown */}
        <div className="space-y-1">
          <label htmlFor="filter-skill" className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            Skills
          </label>
          <select
            id="filter-skill"
            value={selectedSkill}
            onChange={(e) => onSkillChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563eb]"
          >
            <option value="All">All Skills</option>
            {skillOptions.map((sk) => (
              <option key={sk} value={sk}>
                {sk}
              </option>
            ))}
          </select>
        </div>

        {/* Internship Type Pills */}
        <div className="space-y-1 sm:col-span-2 lg:col-span-1">
          <span className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            Internship Type
          </span>
          <div className="flex flex-wrap gap-1">
            {typeOptions.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onTypeChange(t)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                  selectedType === t
                    ? 'bg-[#2563eb] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
