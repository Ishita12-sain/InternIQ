import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  onResetFilters: () => void;
}

export const RecommendedEmptyState: React.FC<EmptyStateProps> = ({ onResetFilters }) => {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-12 text-center space-y-4 shadow-2xs">
      <div className="w-16 h-16 rounded-full bg-blue-50 text-[#2563eb] flex items-center justify-center mx-auto">
        <SearchX className="w-8 h-8" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-[#0f172a]">No Internships Found</h3>
        <p className="text-xs text-[#64748b] max-w-sm mx-auto">
          We couldn't find any recommended internships matching your search query or selected filters.
        </p>
      </div>
      <button
        onClick={onResetFilters}
        className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#2563eb] text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset Filters</span>
      </button>
    </div>
  );
};
