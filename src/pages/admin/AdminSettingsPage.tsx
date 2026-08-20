import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { useSettings } from '../../context/SettingsContext';
import type { SettingsState } from '../../context/SettingsContext';
import { useAuditLogs } from '../../context/AuditLogContext';
import {
  Globe,
  Bell,
  Shield,
  Briefcase,
  FileText,
  ShieldCheck,
  Palette,
  User,
  CheckCircle2,
  RotateCcw,
  Key,
  Smartphone,
  History,
  LogOut,
  Moon,
  Sun,
  Monitor,
  Camera,
  Upload,
  Trash2,
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    settings,
    updateAdminProfile,
    updatePlatform,
    updateNotifications,
    updateSecurity,
    updateInternships,
    updateApplications,
    updateVerifications,
    setTheme,
    resetSection,
  } = useSettings();

  const { logActivity } = useAuditLogs();

  // Active Category Tab
  const [activeTab, setActiveTab] = useState<keyof SettingsState>('platform');

  // Inline Feedback Toasts
  const [savedSection, setSavedSection] = useState<string | null>(null);

  // Profile Photo Upload & Preview State
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isRemovePhotoModalOpen, setIsRemovePhotoModalOpen] = useState(false);

  // Draft States for Editable Forms
  const [platformForm, setPlatformForm] = useState(settings.platform);
  const [notifForm, setNotifForm] = useState(settings.notifications);
  const [securityForm, setSecurityForm] = useState(settings.security);
  const [internshipForm, setInternshipForm] = useState(settings.internships);
  const [appForm, setAppForm] = useState(settings.applications);
  const [verifForm, setVerifForm] = useState(settings.verifications);
  const [profileForm, setProfileForm] = useState(settings.adminProfile);

  // Modals state
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [targetResetSection, setTargetResetSection] = useState<keyof SettingsState | null>(null);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState<'2FA' | 'Password' | 'Activity' | null>(null);

  const triggerToast = (msg: string) => {
    setSavedSection(msg);
    setTimeout(() => setSavedSection(null), 3500);
  };

  // Photo Select & Validation Handler
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSizeBytes = 5 * 1024 * 1024; // 5 MB

    if (!validTypes.includes(file.type) || file.size > maxSizeBytes) {
      setPhotoError('Please upload a JPG, PNG or WEBP image under 5 MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setPhotoPreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSavePhoto = () => {
    if (photoPreview) {
      updateAdminProfile({ photoUrl: photoPreview });
      logActivity({
        userId: 'usr-admin-01',
        userName: settings.adminProfile.name,
        role: 'Admin',
        action: 'Updated',
        module: 'Settings',
        description: 'Updated system administrator profile photo.',
        status: 'Success',
        relatedEntityId: 'admin-profile',
        relatedEntityName: 'Admin Profile Photo',
      });
      setPhotoPreview(null);
      setPhotoError(null);
      triggerToast('Profile photo updated successfully.');
    }
  };

  const handleCancelPhoto = () => {
    setPhotoPreview(null);
    setPhotoError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConfirmRemovePhoto = () => {
    updateAdminProfile({ photoUrl: undefined });
    logActivity({
      userId: 'usr-admin-01',
      userName: settings.adminProfile.name,
      role: 'Admin',
      action: 'Deleted',
      module: 'Settings',
      description: 'Removed system administrator profile photo.',
      status: 'Success',
      relatedEntityId: 'admin-profile',
      relatedEntityName: 'Admin Profile Photo',
    });
    setPhotoPreview(null);
    setPhotoError(null);
    setIsRemovePhotoModalOpen(false);
    triggerToast('Profile photo removed.');
  };

  // Section Save Handlers
  const handleSavePlatform = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlatform(platformForm);
    logActivity({
      userId: 'usr-admin-01',
      userName: settings.adminProfile.name,
      role: 'Admin',
      action: 'Settings Updated',
      module: 'Settings',
      description: 'Updated platform configuration metadata and regional parameters.',
      status: 'Success',
      relatedEntityId: 'platform-config',
      relatedEntityName: 'Platform Settings',
    });
    triggerToast('Platform settings saved successfully.');
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    updateNotifications(notifForm);
    logActivity({
      userId: 'usr-admin-01',
      userName: settings.adminProfile.name,
      role: 'Admin',
      action: 'Settings Updated',
      module: 'Settings',
      description: 'Updated system notification preferences and alert triggers.',
      status: 'Success',
      relatedEntityId: 'notification-config',
      relatedEntityName: 'Notification Preferences',
    });
    triggerToast('Notification preferences saved.');
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    updateSecurity(securityForm);
    logActivity({
      userId: 'usr-admin-01',
      userName: settings.adminProfile.name,
      role: 'Admin',
      action: 'Settings Updated',
      module: 'Settings',
      description: 'Updated security session timeout and authentication parameters.',
      status: 'Success',
      relatedEntityId: 'security-config',
      relatedEntityName: 'Security Configuration',
    });
    triggerToast('Security policy configuration saved.');
  };

  const handleSaveInternships = (e: React.FormEvent) => {
    e.preventDefault();
    updateInternships(internshipForm);
    logActivity({
      userId: 'usr-admin-01',
      userName: settings.adminProfile.name,
      role: 'Admin',
      action: 'Settings Updated',
      module: 'Settings',
      description: 'Updated internship listing rules and employer permissions.',
      status: 'Success',
      relatedEntityId: 'internship-config',
      relatedEntityName: 'Internship Rules',
    });
    triggerToast('Internship policy settings saved.');
  };

  const handleSaveApplications = (e: React.FormEvent) => {
    e.preventDefault();
    updateApplications(appForm);
    logActivity({
      userId: 'usr-admin-01',
      userName: settings.adminProfile.name,
      role: 'Admin',
      action: 'Settings Updated',
      module: 'Settings',
      description: 'Updated application workflow policy and candidate submission limits.',
      status: 'Success',
      relatedEntityId: 'application-config',
      relatedEntityName: 'Application Rules',
    });
    triggerToast('Application workflow settings saved.');
  };

  const handleSaveVerifications = (e: React.FormEvent) => {
    e.preventDefault();
    updateVerifications(verifForm);
    logActivity({
      userId: 'usr-admin-01',
      userName: settings.adminProfile.name,
      role: 'Admin',
      action: 'Settings Updated',
      module: 'Settings',
      description: 'Updated employer and student verification compliance rules.',
      status: 'Success',
      relatedEntityId: 'verification-config',
      relatedEntityName: 'Verification Rules',
    });
    triggerToast('Verification rules saved.');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminProfile(profileForm);
    logActivity({
      userId: 'usr-admin-01',
      userName: settings.adminProfile.name,
      role: 'Admin',
      action: 'Updated',
      module: 'Settings',
      description: `Updated administrator profile details for ${profileForm.name}.`,
      status: 'Success',
      relatedEntityId: 'admin-profile',
      relatedEntityName: 'Admin Profile',
    });
    triggerToast('Admin profile updated successfully.');
  };

  // Confirm Reset Execution
  const handleConfirmReset = () => {
    if (targetResetSection) {
      resetSection(targetResetSection);

      // Refresh draft state matching resetting section
      if (targetResetSection === 'platform') setPlatformForm(settings.platform);
      if (targetResetSection === 'notifications') setNotifForm(settings.notifications);
      if (targetResetSection === 'security') setSecurityForm(settings.security);
      if (targetResetSection === 'internships') setInternshipForm(settings.internships);
      if (targetResetSection === 'applications') setAppForm(settings.applications);
      if (targetResetSection === 'verifications') setVerifForm(settings.verifications);
      if (targetResetSection === 'adminProfile') setProfileForm(settings.adminProfile);

      triggerToast(`Reset ${targetResetSection} section to default values.`);
      setIsResetModalOpen(false);
      setTargetResetSection(null);
    }
  };

  const navSections = [
    { id: 'platform', label: 'Platform Settings', icon: <Globe className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notification Settings', icon: <Bell className="w-4 h-4" /> },
    { id: 'security', label: 'Security Settings', icon: <Shield className="w-4 h-4" /> },
    { id: 'internships', label: 'Internship Settings', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'applications', label: 'Application Settings', icon: <FileText className="w-4 h-4" /> },
    { id: 'verifications', label: 'Verification Settings', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'theme', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
    { id: 'adminProfile', label: 'Account Settings', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      {/* Responsive Admin Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Settings"
          subtitle="Manage platform configuration, preferences and administration."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto pb-safe text-left">
          {/* Toast Notification */}
          {savedSection && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-in fade-in duration-150 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{savedSection}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {/* Left Category Navigation Bar */}
            <div className="bg-white border border-[#e2e8f0] rounded-3xl p-3 shadow-2xs space-y-1">
              <p className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-slate-400">Settings Modules</p>
              {navSections.map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveTab(sec.id as keyof SettingsState)}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
                    activeTab === sec.id
                      ? 'bg-[#eff6ff] text-[#2563eb] border border-blue-200/60 shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className={activeTab === sec.id ? 'text-[#2563eb]' : 'text-slate-400'}>{sec.icon}</span>
                  <span className="truncate">{sec.label}</span>
                </button>
              ))}
            </div>

            {/* Right Active Configuration Panel */}
            <div className="lg:col-span-3 space-y-6">
              {/* A. PLATFORM SETTINGS */}
              {activeTab === 'platform' && (
                <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-base font-extrabold text-[#0f172a]">A. Platform Settings</h3>
                      <p className="text-xs text-slate-500">Configure global metadata, contact emails, and regional defaults.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setTargetResetSection('platform');
                        setIsResetModalOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Reset section to default"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSavePlatform} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Platform Name</label>
                        <input
                          type="text"
                          value={platformForm.platformName}
                          onChange={(e) => setPlatformForm({ ...platformForm, platformName: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#2563eb]"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Platform Admin Email</label>
                        <input
                          type="email"
                          value={platformForm.platformEmail}
                          onChange={(e) => setPlatformForm({ ...platformForm, platformEmail: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#2563eb]"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Support Desk Email</label>
                        <input
                          type="email"
                          value={platformForm.supportEmail}
                          onChange={(e) => setPlatformForm({ ...platformForm, supportEmail: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#2563eb]"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">System Timezone</label>
                        <select
                          value={platformForm.timezone}
                          onChange={(e) => setPlatformForm({ ...platformForm, timezone: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#2563eb] cursor-pointer"
                        >
                          <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
                          <option value="UTC">UTC (Universal Coordinated Time)</option>
                          <option value="America/New_York">America/New_York (EST)</option>
                          <option value="Europe/London">Europe/London (GMT)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Date Format</label>
                        <select
                          value={platformForm.dateFormat}
                          onChange={(e) => setPlatformForm({ ...platformForm, dateFormat: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#2563eb] cursor-pointer"
                        >
                          <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 19/08/2026)</option>
                          <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 08/19/2026)</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-08-19)</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-3 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* B. NOTIFICATION SETTINGS */}
              {activeTab === 'notifications' && (
                <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-base font-extrabold text-[#0f172a]">B. Notification Preferences</h3>
                      <p className="text-xs text-slate-500">Manage real-time dispatch alerts, email digest triggers, and push channels.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setTargetResetSection('notifications');
                        setIsResetModalOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Reset section to default"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveNotifications} className="space-y-4">
                    <div className="space-y-3">
                      {[
                        { key: 'emailNotifications', label: 'Email Notifications', desc: 'Send automated email digests to admin inbox.' },
                        { key: 'pushNotifications', label: 'Push Notifications', desc: 'Deliver browser push notifications for urgent events.' },
                        { key: 'newApplicationAlerts', label: 'New Application Alerts', desc: 'Trigger alerts when students submit applications.' },
                        { key: 'newCompanyRegistrationAlerts', label: 'New Company Registration Alerts', desc: 'Notify when corporate employer profiles register.' },
                        { key: 'verificationAlerts', label: 'Verification Alerts', desc: 'Alert on incoming KYC & employer document dossiers.' },
                        { key: 'interviewAlerts', label: 'Interview Alerts', desc: 'Track scheduled technical and HR interview rounds.' },
                        { key: 'systemAlerts', label: 'System Alerts', desc: 'Receive system health and periodic automated audit logs.' },
                      ].map((item) => {
                        const val = notifForm[item.key as keyof typeof notifForm];
                        return (
                          <div key={item.key} className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
                            <div>
                              <p className="text-xs font-bold text-[#0f172a]">{item.label}</p>
                              <p className="text-[11px] text-slate-500">{item.desc}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={val}
                                onChange={(e) => setNotifForm({ ...notifForm, [item.key]: e.target.checked })}
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2563eb]"></div>
                            </label>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-3 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
                      >
                        Save Notification Preferences
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* C. SECURITY SETTINGS */}
              {activeTab === 'security' && (
                <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-base font-extrabold text-[#0f172a]">C. Security Settings</h3>
                      <p className="text-xs text-slate-500">Session timeout parameters, authentication policies, and security credentials.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setTargetResetSection('security');
                        setIsResetModalOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Reset section to default"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveSecurity} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Session Timeout (Minutes)</label>
                        <input
                          type="number"
                          value={securityForm.sessionTimeoutMinutes}
                          onChange={(e) => setSecurityForm({ ...securityForm, sessionTimeoutMinutes: parseInt(e.target.value) || 15 })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#2563eb]"
                          min={5}
                          max={120}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Password Expiry (Days)</label>
                        <input
                          type="number"
                          value={securityForm.passwordExpiryDays}
                          onChange={(e) => setSecurityForm({ ...securityForm, passwordExpiryDays: parseInt(e.target.value) || 30 })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#2563eb]"
                          min={15}
                          max={180}
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-3">
                      <p className="text-xs font-bold text-slate-700">Security Administrative Actions</p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setIsSecurityModalOpen('2FA')}
                          className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold shadow-2xs cursor-pointer"
                        >
                          <Smartphone className="w-3.5 h-3.5 text-[#2563eb]" />
                          <span>{securityForm.twoFactorAuth ? 'Manage 2FA' : 'Enable 2FA'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsSecurityModalOpen('Password')}
                          className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold shadow-2xs cursor-pointer"
                        >
                          <Key className="w-3.5 h-3.5 text-amber-600" />
                          <span>Change Password</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsSecurityModalOpen('Activity')}
                          className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold shadow-2xs cursor-pointer"
                        >
                          <History className="w-3.5 h-3.5 text-emerald-600" />
                          <span>View Login Activity</span>
                        </button>
                      </div>
                    </div>

                    <div className="pt-3 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
                      >
                        Save Security Configuration
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* D. INTERNSHIP SETTINGS */}
              {activeTab === 'internships' && (
                <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-base font-extrabold text-[#0f172a]">D. Internship Rules & Controls</h3>
                      <p className="text-xs text-slate-500">Posting limits, verification prerequisites, and application permissions.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setTargetResetSection('internships');
                        setIsResetModalOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Reset section to default"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveInternships} className="space-y-4">
                    <div className="space-y-3">
                      {[
                        { key: 'allowStudentsToApply', label: 'Allow Students to Apply', desc: 'Enable candidate applications platform-wide.' },
                        { key: 'allowCompaniesToPost', label: 'Allow Companies to Post Internships', desc: 'Allow corporate employers to list active openings.' },
                        { key: 'requireCompanyVerificationBeforePosting', label: 'Require Company Verification Before Posting', desc: 'Mandate KYC verification before opening listings.' },
                        { key: 'applicationDeadlineRequired', label: 'Application Deadline Required', desc: 'Enforce strict closing dates on all posted opportunities.' },
                      ].map((item) => {
                        const val = internshipForm[item.key as keyof typeof internshipForm];
                        return (
                          <div key={item.key} className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
                            <div>
                              <p className="text-xs font-bold text-[#0f172a]">{item.label}</p>
                              <p className="text-[11px] text-slate-500">{item.desc}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={Boolean(val)}
                                onChange={(e) => setInternshipForm({ ...internshipForm, [item.key]: e.target.checked })}
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2563eb]"></div>
                            </label>
                          </div>
                        );
                      })}
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <label className="text-xs font-bold text-slate-700">Maximum Active Listings Per Company</label>
                      <input
                        type="number"
                        value={internshipForm.maxActiveListingsPerCompany}
                        onChange={(e) => setInternshipForm({ ...internshipForm, maxActiveListingsPerCompany: parseInt(e.target.value) || 5 })}
                        className="w-full sm:w-64 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#2563eb]"
                        min={1}
                        max={50}
                      />
                    </div>

                    <div className="pt-3 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
                      >
                        Save Internship Settings
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* E. APPLICATION SETTINGS */}
              {activeTab === 'applications' && (
                <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-base font-extrabold text-[#0f172a]">E. Application Workflow Rules</h3>
                      <p className="text-xs text-slate-500">Student application caps, match score thresholding, and archiving.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setTargetResetSection('applications');
                        setIsResetModalOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Reset section to default"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveApplications} className="space-y-4">
                    <div className="space-y-3">
                      {[
                        { key: 'allowMultipleApplications', label: 'Allow Multiple Applications', desc: 'Permit candidates to apply for multiple concurrent drives.' },
                        { key: 'autoArchiveRejected', label: 'Auto-Archive Rejected Applications', desc: 'Automatically move rejected records to archive storage.' },
                        { key: 'enableMatchScore', label: 'Enable Application Match Score', desc: 'AI-calculated skill compatibility match percentages.' },
                      ].map((item) => {
                        const val = appForm[item.key as keyof typeof appForm];
                        return (
                          <div key={item.key} className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
                            <div>
                              <p className="text-xs font-bold text-[#0f172a]">{item.label}</p>
                              <p className="text-[11px] text-slate-500">{item.desc}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={Boolean(val)}
                                onChange={(e) => setAppForm({ ...appForm, [item.key]: e.target.checked })}
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2563eb]"></div>
                            </label>
                          </div>
                        );
                      })}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Maximum Applications Per Student</label>
                        <input
                          type="number"
                          value={appForm.maxApplicationsPerStudent}
                          onChange={(e) => setAppForm({ ...appForm, maxApplicationsPerStudent: parseInt(e.target.value) || 5 })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#2563eb]"
                          min={1}
                          max={30}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Minimum Match Score (%)</label>
                        <input
                          type="number"
                          value={appForm.minimumMatchScore}
                          onChange={(e) => setAppForm({ ...appForm, minimumMatchScore: parseInt(e.target.value) || 50 })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#2563eb]"
                          min={0}
                          max={100}
                        />
                      </div>
                    </div>

                    <div className="pt-3 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
                      >
                        Save Application Settings
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* F. VERIFICATION SETTINGS */}
              {activeTab === 'verifications' && (
                <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-base font-extrabold text-[#0f172a]">F. Verification Prerequisites</h3>
                      <p className="text-xs text-slate-500">Corporate employer verification & document validation parameters.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setTargetResetSection('verifications');
                        setIsResetModalOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Reset section to default"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveVerifications} className="space-y-4">
                    <div className="space-y-3">
                      {[
                        { key: 'requireCompanyVerification', label: 'Require Company Verification', desc: 'Mandate CIN/PAN business registration verification.' },
                        { key: 'requireStudentDocumentVerification', label: 'Require Student Document Verification', desc: 'Validate official college ID and NOC documents.' },
                        { key: 'autoVerification', label: 'Auto-Verification', desc: 'Automatically approve credentials with valid digital signatures.' },
                      ].map((item) => {
                        const val = verifForm[item.key as keyof typeof verifForm];
                        return (
                          <div key={item.key} className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
                            <div>
                              <p className="text-xs font-bold text-[#0f172a]">{item.label}</p>
                              <p className="text-[11px] text-slate-500">{item.desc}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={Boolean(val)}
                                onChange={(e) => setVerifForm({ ...verifForm, [item.key]: e.target.checked })}
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2563eb]"></div>
                            </label>
                          </div>
                        );
                      })}
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <label className="text-xs font-bold text-slate-700">Verification Reminder Cycle (Days)</label>
                      <input
                        type="number"
                        value={verifForm.verificationReminderDays}
                        onChange={(e) => setVerifForm({ ...verifForm, verificationReminderDays: parseInt(e.target.value) || 3 })}
                        className="w-full sm:w-64 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#2563eb]"
                        min={1}
                        max={14}
                      />
                    </div>

                    <div className="pt-3 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
                      >
                        Save Verification Rules
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* G. APPEARANCE SETTINGS */}
              {activeTab === 'theme' && (
                <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-base font-extrabold text-[#0f172a]">G. Appearance & Visual Theme</h3>
                      <p className="text-xs text-slate-500">Customize portal theme preferences and accent styling.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { mode: 'Light', label: 'Light Mode', icon: <Sun className="w-5 h-5 text-amber-500" /> },
                      { mode: 'Dark', label: 'Dark Mode', icon: <Moon className="w-5 h-5 text-indigo-400" /> },
                      { mode: 'System', label: 'System Sync', icon: <Monitor className="w-5 h-5 text-blue-600" /> },
                    ].map((t) => (
                      <button
                        key={t.mode}
                        type="button"
                        onClick={() => {
                          setTheme(t.mode as any);
                          triggerToast(`Appearance set to ${t.label}.`);
                        }}
                        className={`p-4 border rounded-2xl flex flex-col items-center justify-center space-y-2 cursor-pointer transition-all ${
                          settings.theme === t.mode
                            ? 'border-[#2563eb] bg-blue-50/50 ring-2 ring-[#2563eb]/20'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        {t.icon}
                        <span className="text-xs font-bold text-[#0f172a]">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* H. ACCOUNT SETTINGS */}
              {activeTab === 'adminProfile' && (
                <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-2xs space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-base font-extrabold text-[#0f172a]">H. Account Settings</h3>
                      <p className="text-xs text-slate-500">Update system administrator profile identity, photo, and credentials.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setTargetResetSection('adminProfile');
                        setIsResetModalOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Reset section to default"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Profile Photo Upload & Management Block */}
                  <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
                    <p className="text-xs font-bold text-[#0f172a]">Profile Photo</p>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        {/* Circular Avatar / Preview */}
                        <div className="relative shrink-0">
                          {photoPreview ? (
                            <img
                              src={photoPreview}
                              alt="Profile Preview"
                              className="w-16 h-16 rounded-full object-cover border-2 border-[#2563eb] shadow-sm"
                            />
                          ) : settings.adminProfile.photoUrl ? (
                            <img
                              src={settings.adminProfile.photoUrl}
                              alt={profileForm.name}
                              className="w-16 h-16 rounded-full object-cover border-2 border-slate-300 shadow-sm"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-[#0f172a] text-blue-400 font-black text-xl flex items-center justify-center border-2 border-slate-700 shadow-sm">
                              {profileForm.avatarInitials || 'SU'}
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 p-1.5 bg-[#2563eb] text-white rounded-full shadow-2xs hover:bg-blue-700 cursor-pointer"
                            title="Change Photo"
                          >
                            <Camera className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="space-y-0.5">
                          <p className="text-xs font-extrabold text-[#0f172a]">{profileForm.name}</p>
                          <p className="text-[11px] text-slate-500">{profileForm.role}</p>
                          <p className="text-[10px] text-slate-400">JPG, PNG, WEBP under 5 MB</p>
                        </div>
                      </div>

                      {/* Hidden File Input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handlePhotoSelect}
                        className="hidden"
                      />

                      {/* Action Controls */}
                      <div className="flex flex-wrap items-center gap-2">
                        {photoPreview ? (
                          <>
                            <button
                              type="button"
                              onClick={handleSavePhoto}
                              className="px-3 py-1.5 bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
                            >
                              Save Photo
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelPhoto}
                              className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl shadow-2xs cursor-pointer inline-flex items-center space-x-1"
                            >
                              <Upload className="w-3.5 h-3.5 text-[#2563eb]" />
                              <span>Change Photo</span>
                            </button>

                            {settings.adminProfile.photoUrl && (
                              <button
                                type="button"
                                onClick={() => setIsRemovePhotoModalOpen(true)}
                                className="px-3 py-1.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition-all cursor-pointer inline-flex items-center space-x-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove Photo</span>
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Photo Error Banner */}
                    {photoError && (
                      <p className="text-xs font-bold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200 animate-in fade-in duration-150">
                        {photoError}
                      </p>
                    )}
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Admin Display Name</label>
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#2563eb]"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Admin Email Address</label>
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#2563eb]"
                          required
                        />
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-xs font-bold text-slate-700">Administrative Role</label>
                        <input
                          type="text"
                          value={profileForm.role}
                          disabled
                          className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 font-semibold cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => setIsSecurityModalOpen('Password')}
                          className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                        >
                          Change Password
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate('/login')}
                          className="px-3.5 py-2 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 text-xs font-bold rounded-xl cursor-pointer inline-flex items-center space-x-1"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Logout</span>
                        </button>
                      </div>

                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
                      >
                        Update Profile
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Reset Confirmation Modal */}
          {isResetModalOpen && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4 text-center animate-in zoom-in-95 duration-150">
                <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-100">
                  <RotateCcw className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-[#0f172a]">Reset Section Settings?</h3>
                  <p className="text-xs text-slate-500">
                    Are you sure you want to reset <strong className="text-slate-800">"{targetResetSection}"</strong> to default values?
                  </p>
                </div>

                <div className="flex items-center justify-center space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsResetModalOpen(false);
                      setTargetResetSection(null);
                    }}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmReset}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-2xs cursor-pointer"
                  >
                    Confirm Reset
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Security Action Modal */}
          {isSecurityModalOpen && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150 text-left">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-extrabold text-[#0f172a]">
                    {isSecurityModalOpen === '2FA' && 'Two-Factor Authentication (2FA)'}
                    {isSecurityModalOpen === 'Password' && 'Change Security Password'}
                    {isSecurityModalOpen === 'Activity' && 'Admin Login Activity'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsSecurityModalOpen(null)}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                {isSecurityModalOpen === '2FA' && (
                  <div className="space-y-3 text-xs text-slate-600">
                    <p>Enforce TOTP authenticator app verification on all admin logins.</p>
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-800 font-semibold">
                      Current Status: {settings.security.twoFactorAuth ? 'Enabled' : 'Disabled'}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        updateSecurity({ twoFactorAuth: !settings.security.twoFactorAuth });
                        triggerToast(`2FA has been ${!settings.security.twoFactorAuth ? 'enabled' : 'disabled'}.`);
                        setIsSecurityModalOpen(null);
                      }}
                      className="w-full py-2 bg-[#2563eb] text-white font-bold rounded-xl shadow-2xs hover:bg-blue-700 cursor-pointer"
                    >
                      {settings.security.twoFactorAuth ? 'Disable 2FA' : 'Enable 2FA Now'}
                    </button>
                  </div>
                )}

                {isSecurityModalOpen === 'Password' && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      triggerToast('Password updated successfully.');
                      setIsSecurityModalOpen(null);
                    }}
                    className="space-y-3"
                  >
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Current Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        required
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">New Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        required
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 bg-[#2563eb] text-white font-bold text-xs rounded-xl shadow-2xs hover:bg-blue-700 cursor-pointer"
                    >
                      Update Password
                    </button>
                  </form>
                )}

                {isSecurityModalOpen === 'Activity' && (
                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <p className="font-bold text-slate-800">19 Aug 2026, 11:24 PM</p>
                      <p className="text-slate-500">IP: 192.168.1.45 (Windows Chrome / Pune, IN)</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <p className="font-bold text-slate-800">18 Aug 2026, 09:10 AM</p>
                      <p className="text-slate-500">IP: 192.168.1.45 (Windows Chrome / Pune, IN)</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Remove Profile Photo Confirmation Modal */}
          {isRemovePhotoModalOpen && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4 text-center animate-in zoom-in-95 duration-150">
                <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
                  <Trash2 className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-[#0f172a]">Remove Profile Photo?</h3>
                  <p className="text-xs text-slate-500">
                    Your avatar will revert to displaying your initials (<strong className="text-slate-800">{settings.adminProfile.avatarInitials || 'SU'}</strong>).
                  </p>
                </div>

                <div className="flex items-center justify-center space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsRemovePhotoModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmRemovePhoto}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-2xs cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
