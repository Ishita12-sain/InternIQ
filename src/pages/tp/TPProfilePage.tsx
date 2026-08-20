import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TPSidebar } from '../../components/tp/TPSidebar';
import { TPHeader } from '../../components/tp/TPHeader';
import { useSettings } from '../../context/SettingsContext';
import { updateAccountPassword } from '../../utils/authStorage';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  Building2,
  Lock,
  Camera,
  CheckCircle2,
  Bell,
  Sun,
  Shield,
  LogOut,
  Laptop,
} from 'lucide-react';

// ==================================================
// 1. T&P PROFILE PAGE COMPONENT
// ==================================================
export const TPProfilePage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { settings, updateAdminProfile } = useSettings();

  // Mode & Toast State
  const [isEditing, setIsEditing] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Profile State fields
  const [fullName, setFullName] = useState(settings.adminProfile.name || 'Prof. Meenakshi Sundaram');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [officeLocation, setOfficeLocation] = useState('Building 4, Room 204, Campus East');
  const [officeContact, setOfficeContact] = useState('+91 80 2345 6789 (Ext. 402)');
  const [workingHours, setWorkingHours] = useState('Mon - Fri, 09:00 AM - 05:00 PM');
  const [photoPreview, setPhotoPreview] = useState<string | undefined>(settings.adminProfile.photoUrl);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Image Selection Handler
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        updateAdminProfile({ photoUrl: result });
        triggerToast('Profile photo updated successfully.');
      };
      reader.readAsDataURL(file);
    }
  };

  // Profile Form Save Handler
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    updateAdminProfile({
      name: fullName,
    });
    setIsEditing(false);
    triggerToast('Profile updated successfully');
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <TPSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <TPHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="My Profile"
          subtitle="Manage your T&P Cell profile and contact information."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-4xl w-full mx-auto pb-safe text-left">
          {/* Success Toast */}
          {toastMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center space-x-2 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMsg}</span>
            </div>
          )}

          {/* Profile Card Header */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-5 text-center sm:text-left">
                {/* Photo / Avatar */}
                <div className="relative group">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt={fullName}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-[#2563eb] shadow-xs"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-[#2563eb] text-white font-black text-2xl flex items-center justify-center border-2 border-blue-400 shadow-xs">
                      {settings.adminProfile.avatarInitials || 'MS'}
                    </div>
                  )}

                  <label className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full border border-slate-200 shadow-xs cursor-pointer hover:bg-slate-50 transition-colors">
                    <Camera className="w-3.5 h-3.5 text-[#2563eb]" />
                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                  </label>
                </div>

                <div>
                  <h2 className="text-xl font-extrabold text-[#0f172a]">{fullName}</h2>
                  <p className="text-xs font-bold text-[#2563eb]">Training & Placement Officer</p>
                  <p className="text-xs text-slate-500">Training & Placement Office • T&P Cell</p>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">tp@interniq.edu • {phone}</p>
                </div>
              </div>

              {/* Edit / Action Controls */}
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-2xs cursor-pointer transition-colors"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-2xs cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            {/* Profile Information Sections */}
            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* SECTION 1: PERSONAL INFORMATION */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <User className="w-4 h-4 text-[#2563eb]" />
                  <span>Personal Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      disabled={!isEditing}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium disabled:opacity-75 focus:outline-none focus:border-[#2563eb]"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Email Address (Read-Only)</label>
                    <input
                      type="email"
                      value="tp@interniq.edu"
                      disabled
                      className="w-full px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-xl font-medium text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Phone</label>
                    <input
                      type="text"
                      value={phone}
                      disabled={!isEditing}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium disabled:opacity-75 focus:outline-none focus:border-[#2563eb]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Designation (Read-Only)</label>
                    <input
                      type="text"
                      value="Training & Placement Officer"
                      disabled
                      className="w-full px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-xl font-medium text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: OFFICE INFORMATION */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Building2 className="w-4 h-4 text-[#2563eb]" />
                  <span>Office Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">T&P Cell</label>
                    <input
                      type="text"
                      value="Training & Placement Office"
                      disabled
                      className="w-full px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-xl font-medium text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Department</label>
                    <input
                      type="text"
                      value="Central Career Development & Placement"
                      disabled
                      className="w-full px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-xl font-medium text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Office Location</label>
                    <input
                      type="text"
                      value={officeLocation}
                      disabled={!isEditing}
                      onChange={(e) => setOfficeLocation(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium disabled:opacity-75 focus:outline-none focus:border-[#2563eb]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Office Contact</label>
                    <input
                      type="text"
                      value={officeContact}
                      disabled={!isEditing}
                      onChange={(e) => setOfficeContact(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium disabled:opacity-75 focus:outline-none focus:border-[#2563eb]"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-700">Working Hours</label>
                    <input
                      type="text"
                      value={workingHours}
                      disabled={!isEditing}
                      onChange={(e) => setWorkingHours(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium disabled:opacity-75 focus:outline-none focus:border-[#2563eb]"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: ACCOUNT INFORMATION */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Lock className="w-4 h-4 text-[#2563eb]" />
                  <span>Account Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-2xl border">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Role</span>
                    <strong className="text-[#0f172a]">T&P Officer</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Account Status</span>
                    <span className="font-bold text-emerald-600">Active / Verified</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Last Login</span>
                    <strong className="text-[#0f172a]">20 Aug 2026, 09:30 AM</strong>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

// ==================================================
// 2. T&P SETTINGS PAGE COMPONENT
// ==================================================
export const TPSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  const { settings, updateNotifications, setTheme } = useSettings();

  // Toast & Modal State
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Notification Toggles State (backed by NotificationContext)
  const [newAppAlerts, setNewAppAlerts] = useState(settings.notifications.newApplicationAlerts);
  const [interviewAlerts, setInterviewAlerts] = useState(settings.notifications.interviewAlerts);
  const [placementAlerts, setPlacementAlerts] = useState(settings.notifications.verificationAlerts);
  const [companyAlerts, setCompanyAlerts] = useState(settings.notifications.newCompanyRegistrationAlerts);
  const [systemAlerts, setSystemAlerts] = useState(settings.notifications.systemAlerts);

  const handleToggle = (key: string, val: boolean) => {
    if (key === 'newApp') {
      setNewAppAlerts(val);
      updateNotifications({ newApplicationAlerts: val });
    } else if (key === 'interview') {
      setInterviewAlerts(val);
      updateNotifications({ interviewAlerts: val });
    } else if (key === 'placement') {
      setPlacementAlerts(val);
      updateNotifications({ verificationAlerts: val });
    } else if (key === 'company') {
      setCompanyAlerts(val);
      updateNotifications({ newCompanyRegistrationAlerts: val });
    } else if (key === 'system') {
      setSystemAlerts(val);
      updateNotifications({ systemAlerts: val });
    }
    triggerToast('Notification preferences updated.');
  };

  // Change Password Handler
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      triggerToast('Current password is required.');
      return;
    }
    if (newPassword.length < 8) {
      triggerToast('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      triggerToast('New password and confirm password do not match.');
      return;
    }

    try {
      if (user?.email) {
        await updateAccountPassword(user.email, newPassword);
      } else {
        await updateAccountPassword('tnp@interniq.edu', newPassword);
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      triggerToast('Password updated successfully');
    } catch (err) {
      triggerToast(err instanceof Error ? err.message : 'Failed to update password');
    }
  };

  const handleSignOutConfirm = () => {
    setIsSignOutModalOpen(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <TPSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <TPHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Settings"
          subtitle="Manage your T&P account preferences."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-4xl w-full mx-auto pb-safe text-left">
          {/* Notification Toast Banner */}
          {toastMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center space-x-2 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMsg}</span>
            </div>
          )}

          {/* SECTION 1: ACCOUNT SETTINGS */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-[#0f172a] flex items-center space-x-2">
              <User className="w-4 h-4 text-[#2563eb]" />
              <span>Account Settings</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Email Address (Read-Only)</label>
                <input
                  type="text"
                  value="tp@interniq.edu"
                  disabled
                  className="w-full px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-xl font-medium text-slate-500 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Role (Read-Only)</label>
                <input
                  type="text"
                  value="T&P Officer"
                  disabled
                  className="w-full px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-xl font-medium text-slate-500 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">T&P Cell</label>
                <input
                  type="text"
                  value="Training & Placement Office"
                  disabled
                  className="w-full px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-xl font-medium text-slate-500 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Account Status</label>
                <input
                  type="text"
                  value="Active & Verified"
                  disabled
                  className="w-full px-3.5 py-2 bg-emerald-50 border border-emerald-200 rounded-xl font-bold text-emerald-700 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: NOTIFICATION PREFERENCES */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-[#0f172a] flex items-center space-x-2">
              <Bell className="w-4 h-4 text-[#2563eb]" />
              <span>Notification Preferences</span>
            </h3>

            <div className="divide-y divide-slate-100 text-xs">
              {[
                { key: 'newApp', title: 'New Applications', desc: 'Notify when students apply to active internships', val: newAppAlerts },
                { key: 'interview', title: 'Interview Updates', desc: 'Receive alerts on drive schedules and outcome updates', val: interviewAlerts },
                { key: 'placement', title: 'Placement Updates', desc: 'Alerts when offer acceptance status changes', val: placementAlerts },
                { key: 'company', title: 'Company Verification Updates', desc: 'Notifications on company document verification requests', val: companyAlerts },
                { key: 'system', title: 'Important System Notifications', desc: 'Critical system maintenance and platform updates', val: systemAlerts },
              ].map((item) => (
                <div key={item.key} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-[#0f172a]">{item.title}</p>
                    <p className="text-[11px] text-slate-500">{item.desc}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggle(item.key, !item.val)}
                    className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                      item.val ? 'bg-[#2563eb]' : 'bg-slate-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      item.val ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: APPEARANCE & THEME */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-[#0f172a] flex items-center space-x-2">
              <Sun className="w-4 h-4 text-[#2563eb]" />
              <span>Appearance</span>
            </h3>

            <div className="grid grid-cols-3 gap-3 text-xs">
              {(['System', 'Light', 'Dark'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setTheme(t);
                    triggerToast(`Theme set to ${t}.`);
                  }}
                  className={`p-3 border rounded-2xl font-bold cursor-pointer transition-all text-center ${
                    settings.theme === t
                      ? 'border-[#2563eb] bg-blue-50/50 text-[#2563eb] ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {t} Theme
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 4: SECURITY & PASSWORD CHANGE */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-[#0f172a] flex items-center space-x-2">
              <Shield className="w-4 h-4 text-[#2563eb]" />
              <span>Security & Passwords</span>
            </h3>

            <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#2563eb]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">New Password</label>
                  <input
                    type="password"
                    placeholder="Min 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#2563eb]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#2563eb]"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">Last password change: 14 July 2026</span>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-2xs cursor-pointer transition-colors"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>

          {/* SECTION 5: ACTIVE SESSIONS */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-extrabold text-[#0f172a] flex items-center space-x-2">
              <Laptop className="w-4 h-4 text-[#2563eb]" />
              <span>Active Sessions</span>
            </h3>

            <div className="p-3.5 bg-slate-50 border rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-[#2563eb] flex items-center justify-center font-bold">
                  <Laptop className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-[#0f172a]">Windows PC • Chrome Browser (Current Device)</p>
                  <p className="text-[11px] text-slate-500">IP: 192.168.1.45 • Bengaluru, India (Active Now)</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsSessionModalOpen(true)}
                className="px-3 py-1.5 bg-white border border-slate-200 text-rose-600 font-bold hover:bg-rose-50 text-[11px] rounded-xl cursor-pointer"
              >
                Sign out other sessions
              </button>
            </div>
          </div>

          {/* DANGER ZONE: SIGN OUT */}
          <div className="p-6 bg-rose-50/60 border border-rose-200 rounded-3xl space-y-3">
            <h3 className="text-sm font-extrabold text-rose-900 flex items-center space-x-2">
              <LogOut className="w-4 h-4 text-rose-600" />
              <span>Danger Zone</span>
            </h3>
            <p className="text-xs text-rose-700">Sign out of your T&P Officer session across this workspace.</p>
            <button
              type="button"
              onClick={() => setIsSignOutModalOpen(true)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-2xs cursor-pointer transition-colors"
            >
              Sign Out
            </button>
          </div>
        </main>
      </div>

      {/* CONFIRM SIGN OUT MODAL */}
      {isSignOutModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border rounded-3xl p-6 max-w-sm w-full space-y-4 text-left shadow-xl">
            <div className="flex items-center space-x-2 text-rose-600">
              <LogOut className="w-5 h-5" />
              <h3 className="font-extrabold text-base text-[#0f172a]">Confirm Sign Out</h3>
            </div>
            <p className="text-xs text-slate-600">Are you sure you want to end your current T&P Officer session and return to login?</p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsSignOutModalOpen(false)}
                className="px-3.5 py-1.5 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSignOutConfirm}
                className="px-4 py-1.5 bg-rose-600 text-white font-bold text-xs rounded-xl hover:bg-rose-700 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM OTHER SESSIONS MODAL */}
      {isSessionModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border rounded-3xl p-6 max-w-sm w-full space-y-4 text-left shadow-xl">
            <h3 className="font-extrabold text-base text-[#0f172a]">Sign Out Other Devices</h3>
            <p className="text-xs text-slate-600">This will invalidate all other active T&P login sessions on mobile devices or secondary browsers.</p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsSessionModalOpen(false)}
                className="px-3.5 py-1.5 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSessionModalOpen(false);
                  triggerToast('Signed out of 2 other active device sessions.');
                }}
                className="px-4 py-1.5 bg-[#2563eb] text-white font-bold text-xs rounded-xl hover:bg-blue-700 cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
