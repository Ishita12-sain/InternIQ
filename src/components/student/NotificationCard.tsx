import React from 'react';
import {
  Calendar,
  Sparkles,
  Award,
  FileCheck,
  CheckCircle2,
  BookOpen,
  Building2,
  Trash2,
  MailCheck,
  MailOpen
} from 'lucide-react';

export type NotificationType =
  | 'Application'
  | 'Interview'
  | 'Shortlisted'
  | 'Offer Letter'
  | 'Document Verification'
  | 'Faculty Review'
  | 'Digital Logbook'
  | 'Internship Status';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  shortMessage: string;
  fullMessage: string;
  timestamp: string;
  isRead: boolean;
  relatedCompany?: string;
  relatedRole?: string;
}

interface NotificationCardProps {
  notification: NotificationItem;
  isSelected: boolean;
  onSelect: (notif: NotificationItem) => void;
  onToggleRead: (id: string, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  isSelected,
  onSelect,
  onToggleRead,
  onDelete,
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'Interview':
        return <Calendar className="w-5 h-5 text-[#2563eb]" />;
      case 'Shortlisted':
        return <Sparkles className="w-5 h-5 text-indigo-600" />;
      case 'Offer Letter':
        return <Award className="w-5 h-5 text-emerald-600" />;
      case 'Document Verification':
        return <FileCheck className="w-5 h-5 text-amber-600" />;
      case 'Faculty Review':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'Digital Logbook':
        return <BookOpen className="w-5 h-5 text-purple-600" />;
      default:
        return <Building2 className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div
      onClick={() => onSelect(notification)}
      className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer space-y-3 text-left group ${
        isSelected
          ? 'bg-blue-50/50 border-2 border-[#2563eb] shadow-xs'
          : notification.isRead
          ? 'bg-white border-[#e2e8f0] hover:border-blue-300 hover:shadow-md'
          : 'bg-blue-50/30 border-blue-200 hover:border-blue-400 shadow-2xs'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-3 min-w-0 flex-1">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
              notification.isRead
                ? 'bg-slate-50 border-slate-200'
                : 'bg-blue-50 border-blue-100'
            }`}
          >
            {getIcon()}
          </div>

          <div className="space-y-0.5 min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <h3
                className={`text-sm tracking-tight break-words ${
                  notification.isRead
                    ? 'font-bold text-[#0f172a]'
                    : 'font-black text-[#0f172a] text-[#2563eb]'
                }`}
              >
                {notification.title}
              </h3>
              {!notification.isRead && (
                <span className="w-2 h-2 rounded-full bg-[#2563eb] shrink-0" title="Unread" />
              )}
            </div>

            <p className="text-xs text-[#64748b] line-clamp-2 leading-relaxed font-medium">
              {notification.shortMessage}
            </p>
          </div>
        </div>

        {/* Read / Unread Indicator Badge */}
        <span
          className={`px-2.5 py-0.5 rounded-full border text-[10px] font-extrabold shrink-0 ${
            notification.isRead
              ? 'bg-slate-100 text-slate-600 border-slate-200'
              : 'bg-blue-50 text-[#2563eb] border-blue-200'
          }`}
        >
          {notification.isRead ? 'Read' : 'Unread'}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-[#64748b] pt-2 border-t border-slate-100">
        <span className="font-semibold">{notification.timestamp}</span>

        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={(e) => onToggleRead(notification.id, e)}
            className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
            title={notification.isRead ? 'Mark as Unread' : 'Mark as Read'}
          >
            {notification.isRead ? (
              <MailOpen className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <MailCheck className="w-3.5 h-3.5 text-[#2563eb]" />
            )}
          </button>

          <button
            type="button"
            onClick={(e) => onDelete(notification.id, e)}
            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold cursor-pointer"
            title="Delete Notification"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
