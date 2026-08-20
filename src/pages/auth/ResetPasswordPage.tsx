import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { updateAccountPassword } from '../../utils/authStorage';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validate Token on Load
  useEffect(() => {
    if (!token || token.length < 8) {
      setIsValidToken(false);
    } else {
      setIsValidToken(true);
    }
  }, [token]);

  // Live Password Strength & Checklist
  const evaluatePasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'Weak', color: 'bg-slate-200 text-slate-400' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 2) return { score: 33, label: 'Weak', color: 'text-rose-600' };
    if (score <= 4) return { score: 66, label: 'Medium', color: 'text-amber-600' };
    return { score: 100, label: 'Strong', color: 'text-emerald-600' };
  };

  const strength = evaluatePasswordStrength(newPassword);

  const isMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const isMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const isFormValid = isMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecial && isMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isFormValid) {
      if (!isMatch) {
        setError('Passwords do not match.');
      } else {
        setError('Please fulfill all password strength requirements.');
      }
      return;
    }

    setIsLoading(true);

    if (token) {
      try {
        const decoded = atob(token);
        const resetEmail = decoded.split(':')[0];
        if (resetEmail) {
          await updateAccountPassword(resetEmail, newPassword);
        }
      } catch (e) {
        console.warn('Failed to parse reset token email:', e);
      }
    }

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
    }, 600);
  };

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
            <p className="text-xs sm:text-sm text-[#64748b] mt-1">Secure Password Reset Service</p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE — RESET FORM AREA */}
      <div className="flex-1 lg:w-[62%] flex items-center justify-center p-4 sm:p-8 lg:p-14 relative bg-[#f8fafc]">
        <div className="w-full max-w-md bg-white border border-[#e2e8f0] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg shadow-slate-200/50 space-y-6 text-left">
          {isValidToken === false ? (
            <div className="space-y-4 text-center">
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl space-y-2">
                <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
                <h3 className="font-extrabold text-base">Invalid or Expired Reset Link</h3>
                <p className="text-xs text-rose-700">
                  The password reset link you clicked is invalid or has expired. Please request a new link.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-2xs inline-flex items-center justify-center space-x-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Request a new reset link</span>
              </button>
            </div>
          ) : isSuccess ? (
            <div className="space-y-5 text-center">
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h3 className="font-extrabold text-base text-emerald-950">Password Reset Successfully</h3>
                <p className="text-xs text-emerald-800">
                  Your portal password has been updated. You may now log in with your new credentials.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full py-3 bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-2xs"
              >
                Continue to Login →
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f172a] tracking-tight">
                  Set New Password
                </h1>
                <p className="text-xs text-[#64748b]">
                  Please enter and confirm your new secure password.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* New Password */}
                <div className="space-y-1">
                  <Input
                    label="New Password"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                    leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <Input
                    label="Confirm New Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                    leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                    required
                  />
                </div>

                {/* Strength Meter */}
                {newPassword && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-500">Strength:</span>
                      <span className={strength.color}>{strength.label}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          strength.label === 'Weak'
                            ? 'bg-rose-500 w-1/3'
                            : strength.label === 'Medium'
                            ? 'bg-amber-500 w-2/3'
                            : 'bg-emerald-500 w-full'
                        }`}
                      />
                    </div>
                  </div>
                )}

                {/* Requirements Checklist */}
                <div className="p-3 bg-slate-50 border rounded-2xl grid grid-cols-2 gap-2 text-[11px]">
                  <div className={`flex items-center space-x-1.5 ${isMinLength ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>8+ Characters</span>
                  </div>
                  <div className={`flex items-center space-x-1.5 ${hasUppercase ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>1 Uppercase Letter</span>
                  </div>
                  <div className={`flex items-center space-x-1.5 ${hasNumber ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>1 Number</span>
                  </div>
                  <div className={`flex items-center space-x-1.5 ${hasSpecial ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>1 Special Char</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full py-3 text-sm font-semibold rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white shadow-sm cursor-pointer disabled:opacity-50"
                  isLoading={isLoading}
                  disabled={!isFormValid}
                >
                  Reset Password
                </Button>
              </form>
            </>
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
