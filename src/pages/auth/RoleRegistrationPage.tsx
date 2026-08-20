import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ROLE_OPTIONS } from '../../config/roles';
import type { RoleType } from '../../types/auth';

import { StudentRegistrationForm } from '../../components/auth/StudentRegistrationForm';
import { CompanyRegistrationForm } from '../../components/auth/CompanyRegistrationForm';
import { FacultyRegistrationForm } from '../../components/auth/FacultyRegistrationForm';
import { TNPRegistrationForm } from '../../components/auth/TNPRegistrationForm';
import { AdminRegistrationForm } from '../../components/auth/AdminRegistrationForm';

export const RoleRegistrationPage: React.FC = () => {
  const { role } = useParams<{ role: RoleType }>();
  const navigate = useNavigate();

  const currentRole: RoleType = (['student', 'company', 'faculty', 'tnp', 'admin'].includes(role || '')
    ? role
    : 'student') as RoleType;

  const roleInfo = ROLE_OPTIONS.find((r) => r.id === currentRole) || ROLE_OPTIONS[0];

  const renderRoleForm = () => {
    switch (currentRole) {
      case 'student':
        return <StudentRegistrationForm />;
      case 'company':
        return <CompanyRegistrationForm />;
      case 'faculty':
        return <FacultyRegistrationForm />;
      case 'tnp':
        return <TNPRegistrationForm />;
      case 'admin':
        return <AdminRegistrationForm />;
      default:
        return <StudentRegistrationForm />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex items-center justify-center p-4 sm:p-6 font-sans my-4">
      <div className="w-full max-w-xl bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-10 shadow-lg shadow-slate-200/50 relative z-10 text-center space-y-6">
        {/* Header Logo */}
        <div
          className="mx-auto w-12 h-12 flex items-center justify-center cursor-pointer"
          onClick={() => navigate('/login')}
        >
          <svg className="w-12 h-12 text-[#2563eb]" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="12" r="6" fill="#2563EB" />
            <path d="M14 26C14 22 22 20 32 20C42 20 50 22 50 26L32 36L14 26Z" fill="#2563EB" />
            <path d="M16 29.5V40C16 44 23 48 32 48C41 48 48 44 48 40V29.5L32 39.5L16 29.5Z" fill="#1D4ED8" />
            <path d="M10 24L32 35L54 24" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Role Header Badge & Title */}
        <div className="space-y-1">
          <div className="inline-block text-[11px] font-mono tracking-wider uppercase bg-blue-50 text-blue-700 border border-blue-200 px-3 py-0.5 rounded-full font-semibold">
            {roleInfo.label} Registration
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
            Create {roleInfo.label} Account
          </h1>
          <p className="text-xs sm:text-sm text-[#64748b]">
            Fill in your official {roleInfo.shortLabel} credentials to join InternIQ.
          </p>
        </div>

        {/* Dynamic Form Render */}
        <div className="pt-2">
          {renderRoleForm()}
        </div>

        {/* Footer Navigation */}
        <div className="pt-2 flex items-center justify-between text-xs text-[#64748b] border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
          >
            ← Change Role
          </button>

          <div>
            Already registered?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-[#2563eb] font-semibold hover:underline cursor-pointer focus:outline-none"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
