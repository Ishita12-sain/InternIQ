import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StudentRegistrationForm } from '../../components/auth/StudentRegistrationForm';

export const StudentRegistrationPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-xl bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-10 shadow-lg shadow-slate-200/50 relative z-10 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 flex items-center justify-center cursor-pointer" onClick={() => navigate('/login')}>
            <svg className="w-12 h-12 text-[#2563eb]" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="12" r="6" fill="#2563EB" />
              <path d="M14 26C14 22 22 20 32 20C42 20 50 22 50 26L32 36L14 26Z" fill="#2563EB" />
              <path d="M16 29.5V40C16 44 23 48 32 48C41 48 48 44 48 40V29.5L32 39.5L16 29.5Z" fill="#1D4ED8" />
              <path d="M10 24L32 35L54 24" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
            Create Student Account
          </h1>
          <p className="text-xs sm:text-sm text-[#64748b]">
            Enter your details to create your InternIQ account.
          </p>
        </div>

        {/* Student Registration Form Component */}
        <StudentRegistrationForm />

      </div>
    </div>
  );
};
