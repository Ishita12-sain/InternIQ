import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ROLE_OPTIONS } from '../../config/roles';
import type { RoleType } from '../../types/auth';

export const RoleRegistrationPlaceholderPage: React.FC = () => {
  const { role } = useParams<{ role: RoleType }>();
  const navigate = useNavigate();
  const roleInfo = ROLE_OPTIONS.find((r) => r.id === role) || ROLE_OPTIONS[0];

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-lg bg-white border border-[#e2e8f0] rounded-3xl p-8 shadow-lg text-center space-y-6">
        <div className="mx-auto w-12 h-12 flex items-center justify-center cursor-pointer" onClick={() => navigate('/login')}>
          <svg className="w-12 h-12 text-[#2563eb]" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="12" r="6" fill="#2563EB" />
            <path d="M14 26C14 22 22 20 32 20C42 20 50 22 50 26L32 36L14 26Z" fill="#2563EB" />
            <path d="M16 29.5V40C16 44 23 48 32 48C41 48 48 44 48 40V29.5L32 39.5L16 29.5Z" fill="#1D4ED8" />
            <path d="M10 24L32 35L54 24" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="space-y-1">
          <div className="inline-block text-[11px] font-mono tracking-wider uppercase bg-blue-50 text-blue-700 border border-blue-200 px-3 py-0.5 rounded-full font-semibold">
            {roleInfo.label} Registration
          </div>
          <h1 className="text-2xl font-bold text-[#0f172a]">
            Create {roleInfo.label} Account
          </h1>
          <p className="text-xs text-[#64748b]">
            Registration form for {roleInfo.label} will be built in subsequent steps.
          </p>
        </div>

        <div className="pt-2 flex justify-center space-x-3">
          <button
            onClick={() => navigate('/register')}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold shadow-2xs"
          >
            Change Role
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 rounded-xl bg-[#2563eb] text-white text-xs font-semibold shadow-2xs hover:bg-blue-700"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
