import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface AdminProfile {
  name: string;
  email: string;
  role: string;
  avatarInitials: string;
  photoUrl?: string;
}

export interface PlatformSettings {
  platformName: string;
  platformEmail: string;
  supportEmail: string;
  timezone: string;
  dateFormat: string;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  newApplicationAlerts: boolean;
  newCompanyRegistrationAlerts: boolean;
  verificationAlerts: boolean;
  interviewAlerts: boolean;
  systemAlerts: boolean;
}

export interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeoutMinutes: number;
  passwordExpiryDays: number;
}

export interface InternshipRules {
  allowStudentsToApply: boolean;
  allowCompaniesToPost: boolean;
  requireCompanyVerificationBeforePosting: boolean;
  maxActiveListingsPerCompany: number;
  applicationDeadlineRequired: boolean;
}

export interface ApplicationRules {
  allowMultipleApplications: boolean;
  maxApplicationsPerStudent: number;
  autoArchiveRejected: boolean;
  enableMatchScore: boolean;
  minimumMatchScore: number;
}

export interface VerificationRules {
  requireCompanyVerification: boolean;
  requireStudentDocumentVerification: boolean;
  autoVerification: boolean;
  verificationReminderDays: number;
}

export interface SettingsState {
  adminProfile: AdminProfile;
  platform: PlatformSettings;
  notifications: NotificationPreferences;
  security: SecuritySettings;
  internships: InternshipRules;
  applications: ApplicationRules;
  verifications: VerificationRules;
  theme: 'Light' | 'Dark' | 'System';
}

const DEFAULT_SETTINGS: SettingsState = {
  adminProfile: {
    name: 'Admin SuperUser',
    email: 'admin@interniq.edu',
    role: 'Super Administrator',
    avatarInitials: 'SU',
  },
  platform: {
    platformName: 'InternIQ',
    platformEmail: 'admin@interniq.edu',
    supportEmail: 'support@interniq.edu',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    newApplicationAlerts: true,
    newCompanyRegistrationAlerts: true,
    verificationAlerts: true,
    interviewAlerts: true,
    systemAlerts: false,
  },
  security: {
    twoFactorAuth: false,
    sessionTimeoutMinutes: 30,
    passwordExpiryDays: 90,
  },
  internships: {
    allowStudentsToApply: true,
    allowCompaniesToPost: true,
    requireCompanyVerificationBeforePosting: true,
    maxActiveListingsPerCompany: 15,
    applicationDeadlineRequired: true,
  },
  applications: {
    allowMultipleApplications: true,
    maxApplicationsPerStudent: 10,
    autoArchiveRejected: false,
    enableMatchScore: true,
    minimumMatchScore: 60,
  },
  verifications: {
    requireCompanyVerification: true,
    requireStudentDocumentVerification: true,
    autoVerification: false,
    verificationReminderDays: 3,
  },
  theme: 'Light',
};

interface SettingsContextType {
  settings: SettingsState;
  updateAdminProfile: (profile: Partial<AdminProfile>) => void;
  updatePlatform: (platform: Partial<PlatformSettings>) => void;
  updateNotifications: (notifs: Partial<NotificationPreferences>) => void;
  updateSecurity: (security: Partial<SecuritySettings>) => void;
  updateInternships: (internships: Partial<InternshipRules>) => void;
  updateApplications: (applications: Partial<ApplicationRules>) => void;
  updateVerifications: (verifications: Partial<VerificationRules>) => void;
  setTheme: (theme: 'Light' | 'Dark' | 'System') => void;
  resetSection: (section: keyof SettingsState) => void;
  resetAllSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SettingsState>(() => {
    try {
      const savedTheme = localStorage.getItem('interniq-appearance');
      const saved = localStorage.getItem('interniq_admin_settings');
      let baseSettings = DEFAULT_SETTINGS;
      if (saved) {
        baseSettings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
      if (savedTheme) {
        baseSettings.theme = savedTheme === 'dark' ? 'Dark' : savedTheme === 'system' ? 'System' : 'Light';
      }
      return baseSettings;
    } catch (err) {
      console.warn('Failed to parse settings from localStorage', err);
    }
    return DEFAULT_SETTINGS;
  });

  // Save changes to localStorage and apply theme to html root
  useEffect(() => {
    try {
      localStorage.setItem('interniq_admin_settings', JSON.stringify(settings));
      const storageValue = settings.theme === 'Dark' ? 'dark' : settings.theme === 'System' ? 'system' : 'light';
      localStorage.setItem('interniq-appearance', storageValue);
    } catch (err) {
      console.warn('Failed to save settings to localStorage', err);
    }

    const root = document.documentElement;
    const applyTheme = (theme: 'Light' | 'Dark' | 'System') => {
      let isDark = false;
      if (theme === 'Dark') {
        isDark = true;
      } else if (theme === 'System') {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme(settings.theme);

    // System theme listener if set to System
    if (settings.theme === 'System') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('System');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [settings]);

  const updateAdminProfile = (profile: Partial<AdminProfile>) => {
    setSettings((prev) => {
      const updated = { ...prev.adminProfile, ...profile };
      const initials = updated.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
      return { ...prev, adminProfile: { ...updated, avatarInitials: initials || 'SU' } };
    });
  };

  const updatePlatform = (platform: Partial<PlatformSettings>) => {
    setSettings((prev) => ({ ...prev, platform: { ...prev.platform, ...platform } }));
  };

  const updateNotifications = (notifs: Partial<NotificationPreferences>) => {
    setSettings((prev) => ({ ...prev, notifications: { ...prev.notifications, ...notifs } }));
  };

  const updateSecurity = (security: Partial<SecuritySettings>) => {
    setSettings((prev) => ({ ...prev, security: { ...prev.security, ...security } }));
  };

  const updateInternships = (internships: Partial<InternshipRules>) => {
    setSettings((prev) => ({ ...prev, internships: { ...prev.internships, ...internships } }));
  };

  const updateApplications = (applications: Partial<ApplicationRules>) => {
    setSettings((prev) => ({ ...prev, applications: { ...prev.applications, ...applications } }));
  };

  const updateVerifications = (verifications: Partial<VerificationRules>) => {
    setSettings((prev) => ({ ...prev, verifications: { ...prev.verifications, ...verifications } }));
  };

  const setTheme = (theme: 'Light' | 'Dark' | 'System') => {
    setSettings((prev) => ({ ...prev, theme }));
  };

  const resetSection = (section: keyof SettingsState) => {
    setSettings((prev) => ({ ...prev, [section]: DEFAULT_SETTINGS[section] }));
  };

  const resetAllSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <SettingsContext.Provider
      value={{
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
        resetAllSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
