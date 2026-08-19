import React from 'react';
import { LoginForm } from '../../components/auth/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex flex-col lg:flex-row overflow-hidden font-sans">
      
      {/* LEFT SIDE — BRANDING PANEL (Approx 38% width) */}
      <div className="lg:w-[38%] bg-gradient-to-br from-[#eff6ff] via-[#f0f7ff] to-[#e6f0fa] relative flex flex-col items-center justify-center p-8 lg:p-12 overflow-hidden border-b lg:border-b-0 lg:border-r border-[#e2e8f0] min-h-[320px] lg:min-h-screen">
        
        {/* Top-Left Dotted Grid Pattern Decoration */}
        <div className="absolute top-6 left-6 w-28 h-28 opacity-25 bg-[radial-gradient(#2563eb_1.5px,transparent_1.5px)] [background-size:12px_12px] pointer-events-none" />

        {/* Top-Right Soft Blue Ring Decoration */}
        <div className="absolute top-10 right-10 w-44 h-44 rounded-full border-[18px] border-blue-200/30 blur-xs pointer-events-none" />

        {/* Bottom Curved Wave SVG Decoration */}
        <svg className="absolute bottom-0 left-0 right-0 w-full text-blue-100/70 pointer-events-none" viewBox="0 0 500 150" preserveAspectRatio="none">
          <path d="M0,80 C150,140 350,-20 500,60 L500,150 L0,150 Z" fill="currentColor" />
        </svg>

        {/* Bottom-Left Dotted Grid Pattern Decoration */}
        <div className="absolute bottom-6 left-6 w-28 h-28 opacity-25 bg-[radial-gradient(#2563eb_1.5px,transparent_1.5px)] [background-size:12px_12px] pointer-events-none" />

        {/* Vertically Centered Branding */}
        <div className="relative z-10 text-center max-w-sm mx-auto space-y-6">
          {/* Custom SVG Logo matching reference */}
          <div className="mx-auto w-16 h-16 flex items-center justify-center">
            <svg className="w-16 h-16 text-[#2563eb]" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="12" r="6" fill="#2563EB" />
              <path d="M14 26C14 22 22 20 32 20C42 20 50 22 50 26L32 36L14 26Z" fill="#2563EB" />
              <path d="M16 29.5V40C16 44 23 48 32 48C41 48 48 44 48 40V29.5L32 39.5L16 29.5Z" fill="#1D4ED8" />
              <path d="M10 24L32 35L54 24" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Wordmark: "Intern" dark navy, "IQ" professional blue */}
          <div className="flex items-center justify-center">
            <span className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0f172a]">
              Intern<span className="text-[#2563eb]">IQ</span>
            </span>
          </div>

          {/* Tagline */}
          <p className="text-base sm:text-lg font-medium text-[#64748b] leading-snug">
            From Skills to Opportunities,<br />
            From Internships to Success.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE — LOGIN AREA (Approx 62% width) */}
      <div className="lg:w-[62%] flex items-center justify-center p-6 sm:p-10 lg:p-14 relative bg-[#f8fafc]">
        
        {/* Top-Right Dotted Grid Pattern Accent */}
        <div className="absolute top-8 right-8 w-28 h-28 opacity-15 bg-[radial-gradient(#94a3b8_1.5px,transparent_1.5px)] [background-size:12px_12px] pointer-events-none" />

        {/* Large White Login Card */}
        <div className="w-full max-w-xl bg-white border border-[#e2e8f0] rounded-3xl p-8 sm:p-10 shadow-lg shadow-slate-200/50 relative z-10">
          
          <div className="text-center mb-8 space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
              Welcome to InternIQ
            </h1>
            <p className="text-sm text-[#64748b]">
              Sign in to continue to your portal
            </p>
          </div>

          {/* Login Form */}
          <LoginForm />
        </div>
      </div>

    </div>
  );
};
