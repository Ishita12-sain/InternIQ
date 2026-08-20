import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, ExternalLink } from 'lucide-react';

export interface DropdownNotificationItem {
  id: string;
  title: string;
  shortMessage: string;
  timestamp: string;
  isRead: boolean;
  type?: string;
}

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: DropdownNotificationItem[];
  onMarkAllAsRead: () => void;
  onNotificationClick: (id: string) => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onNotificationClick,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-12 w-[calc(100vw-2rem)] max-w-sm sm:w-96 bg-white border border-[#e2e8f0] rounded-2xl shadow-xl z-50 overflow-hidden text-left animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center space-x-2">
          <h3 className="text-sm font-bold text-[#0f172a]">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#2563eb] border border-blue-200 text-[10px] font-black">
              {unreadCount} New
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllAsRead}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-[#2563eb] hover:text-blue-700 cursor-pointer focus:outline-none focus:underline"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Notifications List or Empty State */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                onNotificationClick(notif.id);
                onClose();
                navigate('/student/notifications');
              }}
              className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer space-y-1 ${
                !notif.isRead ? 'bg-blue-50/30' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-xs font-bold truncate ${
                    !notif.isRead ? 'text-[#2563eb]' : 'text-[#0f172a]'
                  }`}
                >
                  {notif.title}
                </span>
                <span className="text-[10px] text-slate-400 font-medium shrink-0">
                  {notif.timestamp}
                </span>
              </div>
              <p className="text-xs text-[#64748b] line-clamp-2 leading-relaxed">
                {notif.shortMessage}
              </p>
            </div>
          ))
        ) : (
          <div className="py-10 px-4 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-[#2563eb] flex items-center justify-center mx-auto">
              <Bell className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-[#0f172a]">No new notifications</h4>
            <p className="text-xs text-slate-400 font-medium">You're all caught up!</p>
          </div>
        )}
      </div>

      {/* Footer Link to Notifications Center */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-center">
        <button
          type="button"
          onClick={() => {
            onClose();
            navigate('/student/notifications');
          }}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#2563eb] hover:text-blue-700 cursor-pointer"
        >
          <span>View All Notifications</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
