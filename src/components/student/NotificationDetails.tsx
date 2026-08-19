import React from 'react';
import { Bell, MailCheck, MailOpen, Trash2 } from 'lucide-react';
import type { NotificationItem } from './NotificationCard';

interface NotificationDetailsProps {
  notification: NotificationItem | null;
  onToggleRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export const NotificationDetails: React.FC<NotificationDetailsProps> = ({
  notification,
  onToggleRead,
  onDelete,
}) => {
  if (!notification) return null;

  return (
    <div
      id="notification-details-section"
      className="bg-white border border-[#e2e8f0] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5 text-left scroll-mt-24"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-start space-x-2.5 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-[#2563eb] flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-[#0f172a] break-words leading-tight">
              {notification.title}
            </h3>
            <p className="text-xs text-[#64748b]">Notification Details</p>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full border text-xs font-bold shrink-0 ${
            notification.isRead
              ? 'bg-slate-100 text-slate-600 border-slate-200'
              : 'bg-blue-50 text-[#2563eb] border-blue-200'
          }`}
        >
          {notification.isRead ? 'Read' : 'Unread'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs font-medium">
        <div>
          <span className="text-slate-400 block mb-0.5">Notification Category</span>
          <strong className="text-slate-900 text-sm font-bold">{notification.type}</strong>
        </div>
        <div>
          <span className="text-slate-400 block mb-0.5">Date & Time</span>
          <strong className="text-slate-900 text-sm font-bold">{notification.timestamp}</strong>
        </div>
        {notification.relatedCompany && (
          <div>
            <span className="text-slate-400 block mb-0.5">Related Company / Role</span>
            <strong className="text-[#2563eb] text-sm font-bold">
              {notification.relatedCompany}{' '}
              {notification.relatedRole ? `— ${notification.relatedRole}` : ''}
            </strong>
          </div>
        )}
      </div>

      <div className="space-y-1.5 text-xs">
        <span className="font-bold text-[#0f172a] uppercase tracking-wider text-[11px] block">
          Complete Message
        </span>
        <p className="p-4 rounded-xl bg-blue-50/30 border border-blue-100/60 text-slate-800 text-xs leading-relaxed font-medium">
          {notification.fullMessage}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
        <span className="font-bold text-[#0f172a] uppercase tracking-wider">Actions:</span>
        <div className="flex items-center space-x-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => onToggleRead(notification.id)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer transition-colors"
          >
            {notification.isRead ? (
              <>
                <MailOpen className="w-3.5 h-3.5" />
                <span>Mark as Unread</span>
              </>
            ) : (
              <>
                <MailCheck className="w-3.5 h-3.5 text-[#2563eb]" />
                <span>Mark as Read</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => onDelete(notification.id)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold cursor-pointer transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Notification</span>
          </button>
        </div>
      </div>
    </div>
  );
};
