import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const validateEmail = (val: string) => {
    const trimmed = val.trim().toLowerCase();
    if (!trimmed) {
      return 'Please enter your email address.';
    }
    if (!/\S+@\S+\.\S+/.test(trimmed)) {
      return 'Please enter a valid email address.';
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown > 0) return;

    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setCooldown(30);

      const timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 600);
  };

  // Demo token generator helper for development environment preview
  const demoToken = btoa(`${email.trim().toLowerCase()}:${Date.now()}`);

  return (
    <div className="min-h-screen min-h-[100dvh] w-full bg-[#f8fafc] flex flex-col lg:flex-row font-sans text-[#0f172a]">
      {/* LEFT SIDE — BRANDING PANEL */}
      <div className="lg:w-[38%] bg-gradient-to-br from-[#eff6ff] via-[#f0f7ff] to-[#e6f0fa] relative flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 overflow-hidden border-b lg:border-b-0 lg:border-r border-[#e2e8f0] shrink-0 py-6 sm:py-8 lg:py-12">
        <div className="relative z-10 text-center max-w-sm mx-auto space-y-3 sm:space-y-4">
          <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-[#2563eb]" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="12" r="6" fill="#2563EB" />
              <path d="M14 26C14 22 22 20 32 20C42 20 50 22 50 26L32 36L14 26Z" fill="#2563EB" />
              <path d="M16 29.5V40C16 44 23 48 32 48C41 48 48 44 48 40V29.5L32 39.5L16 29.5Z" fill="#1D4ED8" />
            </svg>
          </div>

          <div>
            <span className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#0f172a]">
              Intern<span className="text-[#2563eb]">IQ</span>
            </span>
            <p className="text-xs sm:text-sm text-[#64748b] mt-1">Account Password Recovery Service</p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE — FORGOT PASSWORD FORM AREA */}
      <div className="flex-1 lg:w-[62%] flex items-center justify-center p-4 sm:p-8 lg:p-14 relative bg-[#f8fafc]">
        <div className="w-full max-w-md bg-white border border-[#e2e8f0] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg shadow-slate-200/50 space-y-6 text-left">
          {!isSubmitted ? (
            <>
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f172a] tracking-tight">
                  Forgot Password?
                </h1>
                <p className="text-xs text-[#64748b]">
                  Enter your registered email address and we'll help you reset your password.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full py-3 text-sm font-semibold rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white shadow-sm cursor-pointer"
                  isLoading={isLoading}
                  disabled={cooldown > 0}
                >
                  {cooldown > 0 ? `Please wait ${cooldown}s...` : 'Send Reset Link'}
                </Button>
              </form>
            </>
          ) : (
            <div className="space-y-5 text-left">
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start space-x-3 text-emerald-900">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <h3 className="font-extrabold text-sm text-emerald-950">Password Reset Requested</h3>
                  <p>
                    If an account exists for <strong className="font-bold text-emerald-900">{email.trim().toLowerCase()}</strong>, a password reset link has been dispatched.
                  </p>
                </div>
              </div>

              {/* Development Environment Reset Link Shortcut */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center space-x-1.5 text-slate-700 font-bold">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>Development Mode: Reset Link Available</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Since email dispatch is disabled in mock mode, click below to proceed directly to password reset:
                </p>
                <button
                  type="button"
                  onClick={() => navigate(`/reset-password?token=${demoToken}`)}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-2xs"
                >
                  Proceed to Reset Password Page →
                </button>
              </div>

              {cooldown > 0 && (
                <p className="text-[11px] text-slate-400 font-medium text-center">
                  Did not receive link? You can request another link in {cooldown}s.
                </p>
              )}
            </div>
          )}

          <div className="pt-2 border-t border-slate-100 flex items-center justify-center">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#64748b] hover:text-[#0f172a] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
