import React from 'react';
import { Filter, CheckCheck } from 'lucide-react';

export type NotificationFilterState = 'All' | 'Unread' | 'Read';

interface NotificationFiltersProps {
  currentFilter: NotificationFilterState;
  onFilterChange: (filter: NotificationFilterState) => void;
  onMarkAllAsRead: () => void;
  hasUnread: boolean;
}

export const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  currentFilter,
  onFilterChange,
  onMarkAllAsRead,
  hasUnread,
}) => {
  const options: NotificationFilterState[] = ['All', 'Unread', 'Read'];

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
      {/* LEFT: Filter Icon & Label */}
      <div className="flex items-center space-x-2 shrink-0">
        <Filter className="w-4 h-4 text-[#2563eb]" />
        <span className="text-xs font-bold text-[#0f172a] whitespace-nowrap">
          Filter Notifications:
        </span>
      </div>

      {/* CENTER: Filter Pills Row */}
      <div className="flex items-center justify-start md:justify-center flex-1 space-x-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onFilterChange(opt)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
              currentFilter === opt
                ? 'bg-[#2563eb] text-white shadow-2xs font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* RIGHT: Mark All As Read */}
      <div className="flex items-center justify-start md:justify-end shrink-0">
        {hasUnread ? (
          <button
            type="button"
            onClick={onMarkAllAsRead}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#2563eb] hover:text-blue-700 cursor-pointer whitespace-nowrap focus:outline-none focus:underline"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark all as read</span>
          </button>
        ) : (
          <div className="hidden md:block w-28" />
        )}
      </div>
    </div>
  );
};
