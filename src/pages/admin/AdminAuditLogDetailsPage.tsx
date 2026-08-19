import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { useAuditLogs } from '../../context/AuditLogContext';
import {
  ArrowLeft,
  User,
  Tag,
  Layers,
  Calendar,
  Monitor,
  FileText,
  HelpCircle,
} from 'lucide-react';

export const AdminAuditLogDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const { auditLogs } = useAuditLogs();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const logItem = auditLogs.find((l) => l.id === id);

  if (!logItem) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-extrabold text-[#0f172a]">Audit Record Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">The requested audit record does not exist or has been archived.</p>
        <button
          type="button"
          onClick={() => navigate('/admin/audit-logs')}
          className="mt-4 px-4 py-2 bg-[#2563eb] text-white font-bold text-xs rounded-xl shadow-2xs hover:bg-blue-700 cursor-pointer"
        >
          Back to Audit Logs
        </button>
      </div>
    );
  }

  const formatFullDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      {/* Admin Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Audit Log Details"
          subtitle={`Detailed audit entry for event #${logItem.id}`}
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-4xl w-full mx-auto pb-safe text-left">
          {/* Back Navigation Bar */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <button
              type="button"
              onClick={() => navigate('/admin/audit-logs')}
              className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-[#2563eb] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Audit Logs</span>
            </button>

            <span className="text-xs font-extrabold text-slate-400">ID: {logItem.id}</span>
          </div>

          {/* Main Event Summary Card */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-[#2563eb] border border-blue-200">
                    {logItem.module}
                  </span>
                  <span className="text-xs font-bold text-slate-400">•</span>
                  <span className="text-xs font-bold text-slate-700">{logItem.action}</span>
                </div>
                <h2 className="text-lg font-black text-[#0f172a]">{logItem.description}</h2>
              </div>

              <div className="shrink-0">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                    logItem.status === 'Success'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : logItem.status === 'Failed'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {logItem.status}
                </span>
              </div>
            </div>

            {/* Grid Attributes Table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>User & Role</span>
                </p>
                <p className="font-extrabold text-[#0f172a]">{logItem.userName}</p>
                <p className="text-[11px] font-bold text-blue-600">Role: {logItem.role} (ID: {logItem.userId})</p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Exact Timestamp</span>
                </p>
                <p className="font-extrabold text-[#0f172a]">{formatFullDate(logItem.timestamp)}</p>
                <p className="text-[11px] text-slate-400">{logItem.timestamp}</p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                  <Layers className="w-3.5 h-3.5 text-slate-500" />
                  <span>Target Module & Action</span>
                </p>
                <p className="font-extrabold text-[#0f172a]">{logItem.module}</p>
                <p className="text-[11px] font-semibold text-slate-600">Action: {logItem.action}</p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                  <Tag className="w-3.5 h-3.5 text-slate-500" />
                  <span>Related Entity</span>
                </p>
                <p className="font-extrabold text-[#0f172a]">{logItem.relatedEntityName || 'N/A'}</p>
                <p className="text-[11px] text-slate-400">Entity ID: {logItem.relatedEntityId || 'N/A'}</p>
              </div>
            </div>

            {/* Value Transition Comparison */}
            {(logItem.previousValue || logItem.newValue) && (
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                <p className="text-xs font-extrabold text-[#0f172a] flex items-center space-x-1.5">
                  <FileText className="w-4 h-4 text-[#2563eb]" />
                  <span>State Change Values</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white border border-rose-200 rounded-xl">
                    <p className="text-[10px] font-bold text-rose-600 uppercase">Previous State / Value</p>
                    <p className="font-semibold text-slate-700 mt-1">{logItem.previousValue || 'N/A'}</p>
                  </div>
                  <div className="p-3 bg-white border border-emerald-200 rounded-xl">
                    <p className="text-[10px] font-bold text-emerald-600 uppercase">New State / Value</p>
                    <p className="font-semibold text-slate-700 mt-1">{logItem.newValue || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Technical Metadata */}
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 text-xs">
              <p className="text-xs font-extrabold text-[#0f172a] flex items-center space-x-1.5">
                <Monitor className="w-4 h-4 text-purple-600" />
                <span>Session Metadata</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 font-medium">
                <p>IP Address: <strong className="text-slate-800">{logItem.ipAddress || '192.168.1.45'}</strong></p>
                <p>User Agent: <strong className="text-slate-800">{logItem.userAgent || 'Chrome (Windows NT 10.0)'}</strong></p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
