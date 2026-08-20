import React from 'react';
import { Search } from 'lucide-react';

interface InternshipSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

export const InternshipSearchBar: React.FC<InternshipSearchBarProps> = ({
  value,
  onChange,
  onSearchSubmit,
}) => {
  return (
    <form onSubmit={onSearchSubmit} className="w-full relative">
      <label htmlFor="internship-search-input" className="sr-only">
        Search by role, skill or company
      </label>
      <div className="relative flex items-center">
        <div className="absolute left-4 text-slate-400 pointer-events-none">
          <Search className="w-5 h-5" />
        </div>
        <input
          id="internship-search-input"
          type="text"
          placeholder="Search by role, skill or company..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-11 pr-24 py-3 sm:py-3.5 bg-white border border-[#e2e8f0] rounded-2xl text-xs sm:text-sm text-[#0f172a] shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-[#2563eb] placeholder-slate-400 transition-all"
        />
        <button
          type="submit"
          className="absolute right-2 px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        >
          Search
        </button>
      </div>
    </form>
  );
};
