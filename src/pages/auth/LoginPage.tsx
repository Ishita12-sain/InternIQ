import React from 'react';
import { LoginForm } from '../../components/auth/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen min-h-[100dvh] w-full bg-[#f8fafc] flex flex-col lg:flex-row font-sans overflow-y-auto">
      {/* LEFT SIDE — BRANDING PANEL */}
      <div className="lg:w-[36%] xl:w-[38%] bg-gradient-to-br from-[#eff6ff] via-[#f0f7ff] to-[#e6f0fa] relative flex flex-col items-center justify-center p-4 sm:p-6 lg:p-12 overflow-hidden border-b lg:border-b-0 lg:border-r border-[#e2e8f0] shrink-0 py-4 sm:py-6 lg:py-12">
        {/* Top-Left Dotted Grid Pattern Decoration */}
        <div className="absolute top-4 left-4 w-20 h-20 sm:w-24 sm:h-24 opacity-25 bg-[radial-gradient(#2563eb_1.5px,transparent_1.5px)] [background-size:12px_12px] pointer-events-none" />

        {/* Top-Right Soft Blue Ring Decoration */}
        <div className="absolute top-4 right-4 w-24 h-24 sm:w-32 sm:h-32 rounded-full border-[14px] border-blue-200/30 blur-xs pointer-events-none" />

        {/* Bottom Curved Wave SVG Decoration */}
        <svg className="absolute bottom-0 left-0 right-0 w-full text-blue-100/70 pointer-events-none hidden sm:block" viewBox="0 0 500 150" preserveAspectRatio="none">
          <path d="M0,80 C150,140 350,-20 500,60 L500,150 L0,150 Z" fill="currentColor" />
        </svg>

        {/* Vertically Centered Branding */}
        <div className="relative z-10 text-center max-w-sm mx-auto space-y-1.5 sm:space-y-4">
          <div className="mx-auto w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center">
            <svg className="w-9 h-9 sm:w-16 sm:h-16 text-[#2563eb]" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="12" r="6" fill="#2563EB" />
              <path d="M14 26C14 22 22 20 32 20C42 20 50 22 50 26L32 36L14 26Z" fill="#2563EB" />
              <path d="M16 29.5V40C16 44 23 48 32 48C41 48 48 44 48 40V29.5L32 39.5L16 29.5Z" fill="#1D4ED8" />
              <path d="M10 24L32 35L54 24" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="flex items-center justify-center">
            <span className="text-xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0f172a]">
              Intern<span className="text-[#2563eb]">IQ</span>
            </span>
          </div>

          <p className="text-[11px] sm:text-base font-medium text-[#64748b] leading-snug">
            From Skills to Opportunities,<br className="hidden sm:inline" />
            From Internships to Success.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE — LOGIN AREA */}
      <div className="flex-1 lg:w-[64%] xl:w-[62%] flex items-center justify-center p-3 sm:p-6 lg:p-14 relative bg-[#f8fafc] py-4 sm:py-8 overflow-y-auto">
        <div className="w-full max-w-xl bg-white border border-[#e2e8f0] rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 shadow-lg shadow-slate-200/50 relative z-10 my-auto">
          <div className="text-center mb-4 sm:mb-6 space-y-0.5 sm:space-y-1">
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-extrabold text-[#0f172a] tracking-tight">
              Welcome to InternIQ
            </h1>
            <p className="text-xs sm:text-sm text-[#64748b]">
              Sign in to continue to your portal
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
};
