import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FacultySidebar } from '../../components/faculty/FacultySidebar';
import { FacultyHeader } from '../../components/faculty/FacultyHeader';
import { useSettings } from '../../context/SettingsContext';
import {
  Lock,
  Smartphone,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  ArrowLeft,
  Activity,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';

export const FacultySecuritySettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { settings, updateSecurity } = useSettings();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Active Sessions & Modals State
  const [activeSessions, setActiveSessions] = useState([
    { id: 'sess-1', device: 'Chrome on Windows 11', ip: '192.168.1.45', lastActive: 'Active Now', isCurrent: true },
    { id: 'sess-2', device: 'Safari on iPhone 15 Pro', ip: '10.0.4.12', lastActive: '2 hours ago', isCurrent: false },
    { id: 'sess-3', device: 'Firefox on macOS Sonoma', ip: '172.16.0.89', lastActive: '1 day ago', isCurrent: false },
  ]);

  const [showSignOutOthersModal, setShowSignOutOthersModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deletePasswordInput, setDeletePasswordInput] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Password Strength Evaluation
  const evaluatePasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'Weak', color: 'bg-slate-200 text-slate-400' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 2) return { score: 33, label: 'Weak', color: 'bg-rose-500 text-rose-600' };
    if (score <= 4) return { score: 66, label: 'Medium', color: 'bg-amber-500 text-amber-600' };
    return { score: 100, label: 'Strong', color: 'bg-emerald-500 text-emerald-600' };
  };

  const strength = evaluatePasswordStrength(newPassword);

  // Live Inline Password Validations
  const isMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const isMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const isDifferentFromCurrent = newPassword.length > 0 && newPassword !== currentPassword;

  const isPasswordFormValid =
    currentPassword.length > 0 &&
    isMinLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecial &&
    isMatch &&
    isDifferentFromCurrent;

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (!isPasswordFormValid) {
      if (!isMatch) {
        setPasswordError('New password and confirm password do not match.');
      } else if (!isDifferentFromCurrent) {
        setPasswordError('New password must be different from current password.');
      } else {
        setPasswordError('Please meet all password strength requirements.');
      }
      return;
    }

    // Success update logic (clean abstraction)
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    triggerToast('Password changed successfully.');
  };

  const handleSignOutOtherSessions = () => {
    setActiveSessions((prev) => prev.filter((s) => s.isCurrent));
    setShowSignOutOthersModal(false);
    triggerToast('Signed out of all other active devices.');
  };

  const handleDeleteAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteError(null);

    if (deleteConfirmText !== 'DELETE') {
      setDeleteError('Please type DELETE to confirm.');
      return;
    }

    if (!deletePasswordInput) {
      setDeleteError('Current password is required to request deletion.');
      return;
    }

    setDeleteError('Account deletion requires backend authentication service support.');
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <FacultySidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <FacultyHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Account Security"
          subtitle="Manage credentials, active sessions, and 2FA authentication settings."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-5xl w-full mx-auto pb-safe text-left">
          {toastMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMsg}</span>
            </div>
          )}

          {/* Navigation Back Link */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/faculty/settings')}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl inline-flex items-center space-x-1.5 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Settings</span>
            </button>
          </div>

          {/* 1. Account Security Overview Status Card */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center space-x-2 border-b pb-3">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-extrabold text-[#0f172a]">Account Security Overview</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 border rounded-2xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Password Status</span>
                <strong className="text-sm text-emerald-600 font-extrabold flex items-center space-x-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Strong & Valid</span>
                </strong>
              </div>

              <div className="p-3.5 bg-slate-50 border rounded-2xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">2FA Status</span>
                <strong className={`text-sm font-extrabold flex items-center space-x-1 mt-0.5 ${settings.security.twoFactorAuth ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {settings.security.twoFactorAuth ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                  <span>{settings.security.twoFactorAuth ? 'Enabled' : 'Disabled'}</span>
                </strong>
              </div>

              <div className="p-3.5 bg-slate-50 border rounded-2xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Sessions</span>
                <strong className="text-sm text-indigo-600 font-black mt-0.5 block">{activeSessions.length} Active Devices</strong>
              </div>

              <div className="p-3.5 bg-slate-50 border rounded-2xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Recent Login</span>
                <strong className="text-sm text-slate-800 font-extrabold mt-0.5 block">Secure (20 Aug 2026)</strong>
              </div>
            </div>
          </div>

          {/* 2. Change Password Form */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-6">
            <div className="flex items-center space-x-2 border-b pb-3">
              <Lock className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-extrabold text-[#0f172a]">Change Password</h3>
            </div>

            {passwordError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-2xl flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Current Password */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-3.5 pr-10 py-2 bg-slate-50 border rounded-xl text-slate-800 focus:outline-none focus:border-indigo-600"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-3.5 pr-10 py-2 bg-slate-50 border rounded-xl text-slate-800 focus:outline-none focus:border-indigo-600"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-3.5 pr-10 py-2 bg-slate-50 border rounded-xl text-slate-800 focus:outline-none focus:border-indigo-600"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Strength Bar */}
              {newPassword && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-500">Password Strength:</span>
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

              {/* Live Checklist Requirements */}
              <div className="p-3 bg-slate-50 border rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
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

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={!isPasswordFormValid}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl cursor-pointer shadow-2xs transition-colors"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>

          {/* 3. Two-Factor Authentication (2FA) */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="text-sm font-extrabold text-[#0f172a]">Two-Factor Authentication (2FA)</h3>
                  <p className="text-xs text-slate-500">Add an extra layer of security using TOTP authenticator apps.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  updateSecurity({ twoFactorAuth: !settings.security.twoFactorAuth });
                  triggerToast(
                    settings.security.twoFactorAuth ? '2FA disabled.' : '2FA activated successfully.'
                  );
                }}
                className={`px-4 py-2 text-xs font-bold rounded-xl cursor-pointer transition-colors ${
                  settings.security.twoFactorAuth
                    ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-2xs'
                }`}
              >
                {settings.security.twoFactorAuth ? 'Disable 2FA' : 'Enable 2FA'}
              </button>
            </div>

            <p className="text-xs text-slate-500 italic bg-amber-50/60 border border-amber-200 p-3 rounded-2xl text-amber-800">
              Note: 2FA setup relies on TOTP secret generation. For production deployment, backend authentication service integration is required.
            </p>
          </div>

          {/* 4. Active Sessions */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
              <div className="flex items-center space-x-2">
                <Laptop className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-extrabold text-[#0f172a]">Active Device Sessions</h3>
              </div>

              {activeSessions.length > 1 && (
                <button
                  type="button"
                  onClick={() => setShowSignOutOthersModal(true)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Sign out of all other devices
                </button>
              )}
            </div>

            <div className="space-y-3 text-xs">
              {activeSessions.map((sess) => (
                <div key={sess.id} className="flex items-center justify-between p-3.5 bg-slate-50 border rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-xl border">
                      <Laptop className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-[#0f172a]">{sess.device}</span>
                        {sess.isCurrent && (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full uppercase">
                            This Device
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">IP: {sess.ip} • {sess.lastActive}</p>
                    </div>
                  </div>

                  {!sess.isCurrent && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSessions((prev) => prev.filter((s) => s.id !== sess.id));
                        triggerToast('Session terminated.');
                      }}
                      className="px-3 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Sign Out
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 5. Recent Login Activity */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center space-x-2 border-b pb-3">
              <Activity className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-extrabold text-[#0f172a]">Recent Login Activity</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b text-slate-500 font-bold text-[10px] uppercase">
                  <tr>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Device & Browser</th>
                    <th className="py-3 px-4">IP Address</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-800">20 Aug 2026, 02:25 AM</td>
                    <td className="py-3 px-4 text-slate-600">Chrome on Windows 11</td>
                    <td className="py-3 px-4 font-mono text-slate-500">192.168.1.45</td>
                    <td className="py-3 px-4 font-bold text-emerald-600">Successful</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-800">19 Aug 2026, 09:14 AM</td>
                    <td className="py-3 px-4 text-slate-600">Safari on iPhone 15 Pro</td>
                    <td className="py-3 px-4 font-mono text-slate-500">10.0.4.12</td>
                    <td className="py-3 px-4 font-bold text-emerald-600">Successful</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-800">18 Aug 2026, 04:30 PM</td>
                    <td className="py-3 px-4 text-slate-600">Firefox on Unknown OS</td>
                    <td className="py-3 px-4 font-mono text-slate-500">172.16.0.89</td>
                    <td className="py-3 px-4 font-bold text-rose-600">Failed (Invalid Pass)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 6. Danger Zone - Account Deletion */}
          <div className="p-6 bg-rose-50/60 border border-rose-200 rounded-3xl space-y-4 text-left">
            <div className="flex items-center space-x-2 border-b border-rose-200 pb-3">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <h3 className="text-sm font-extrabold text-rose-900">Danger Zone</h3>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <h4 className="font-extrabold text-rose-900">Delete Faculty Account</h4>
                <p className="text-slate-600 mt-0.5">Permanently delete your profile and revoke access. This action cannot be undone.</p>
              </div>

              <button
                type="button"
                onClick={() => setShowDeleteAccountModal(true)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-2xs cursor-pointer transition-colors shrink-0"
              >
                Delete Account
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Sign Out Other Devices Confirmation Modal */}
      {showSignOutOthersModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-left">
            <h3 className="font-extrabold text-sm text-[#0f172a]">Sign out of all other devices?</h3>
            <p className="text-xs text-slate-600">This will invalidate all active sessions except your current browser session.</p>
            <div className="flex items-center justify-end space-x-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setShowSignOutOthersModal(false)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSignOutOtherSessions}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl"
              >
                Sign Out Others
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteAccountModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form onSubmit={handleDeleteAccountSubmit} className="bg-white border rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left">
            <h3 className="font-extrabold text-sm text-rose-900">Confirm Account Deletion</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              To request account deletion, please enter your current password and type <strong className="text-rose-700 font-mono">DELETE</strong> in the box below.
            </p>

            {deleteError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl">
                {deleteError}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Current Password</label>
                <input
                  type="password"
                  value={deletePasswordInput}
                  onChange={(e) => setDeletePasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Type DELETE to confirm</label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl font-mono text-rose-700 font-bold"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteAccountModal(false);
                  setDeleteError(null);
                }}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl"
              >
                Confirm Delete
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
