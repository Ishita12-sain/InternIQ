import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoleSelector } from '../../components/auth/RoleSelector';
import type { RoleType } from '../../types/auth';
import { Button } from '../../components/ui/Button';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<RoleType>('student');

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate directly to role-specific registration route without alerts
    navigate(`/register/${selectedRole}`);
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-xl bg-white border border-[#e2e8f0] rounded-3xl p-8 sm:p-10 shadow-lg shadow-slate-200/50 relative z-10 text-center space-y-6">
        
        {/* Logo Icon */}
        <div className="mx-auto w-12 h-12 flex items-center justify-center cursor-pointer" onClick={() => navigate('/login')}>
          <svg className="w-12 h-12 text-[#2563eb]" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="12" r="6" fill="#2563EB" />
            <path d="M14 26C14 22 22 20 32 20C42 20 50 22 50 26L32 36L14 26Z" fill="#2563EB" />
            <path d="M16 29.5V40C16 44 23 48 32 48C41 48 48 44 48 40V29.5L32 39.5L16 29.5Z" fill="#1D4ED8" />
            <path d="M10 24L32 35L54 24" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
            Create Your Account
          </h1>
          <p className="text-sm text-[#64748b]">
            Register to get started with InternIQ.
          </p>
        </div>

        {/* Role Selection */}
        <form onSubmit={handleContinue} className="space-y-6 pt-2">
          <RoleSelector selectedRole={selectedRole} onSelectRole={setSelectedRole} />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full py-3.5 text-base font-semibold rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white shadow-sm transition-all"
          >
            Continue
          </Button>
        </form>

        {/* Back to Sign In Link */}
        <div className="pt-2 text-xs text-[#64748b]">
          Already have an account?{' '}
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
  );
};
