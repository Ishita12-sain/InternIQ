import React from 'react';
import { useParams, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { ROLE_OPTIONS } from '../../config/roles';
import type { RoleType } from '../../types/auth';
import { ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';

export const DummyDashboardPage: React.FC = () => {
  const { role } = useParams<{ role: RoleType }>();
  const location = useLocation();
  const navigate = useNavigate();

  if (role === 'company') {
    return <Navigate to="/dashboard/company" replace />;
  }

  const user = location.state?.user || {
    name: 'Authorized User',
    email: `${role || 'user'}@interniq.edu`,
    role: role || 'student',
  };

  const roleInfo = ROLE_OPTIONS.find((r) => r.id === role) || ROLE_OPTIONS[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 flex flex-col items-center justify-center relative">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl p-8 shadow-xs text-center space-y-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 mb-1">
          <Sparkles className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <div className="inline-block text-[11px] font-mono tracking-wider uppercase bg-blue-50 text-blue-700 border border-blue-200 px-3 py-0.5 rounded-full font-semibold">
            {roleInfo.label} Portal Placeholder
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Welcome, {user.name}
          </h1>
          <p className="text-xs text-slate-500">
            {user.email} • {user.department || user.companyName || roleInfo.badge}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2">
          <div className="flex items-center space-x-2 text-emerald-700 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Mock Authentication & Role Redirect Successful</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            You have authenticated as <strong className="text-blue-900">{roleInfo.label}</strong>.
            This placeholder page confirms routing integration.
          </p>
          <div className="text-[11px] text-slate-600 font-mono bg-white p-2 rounded-lg border border-slate-200 mt-2">
            Route: /dashboard/{role} <br />
            Module Target: src/modules/{role}/
          </div>
        </div>

        <div>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login Page</span>
          </button>
        </div>
      </div>
    </div>
  );
};
