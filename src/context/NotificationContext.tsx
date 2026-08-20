import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import {
  generatedStudents,
  generatedCompanies,
  generatedInternships,
  generatedApplications,
  generatedPendingVerifications,
} from '../types/masterDataset';

export interface PlatformNotification {
  id: string;
  type: 'Application' | 'Company' | 'Verification' | 'Internship' | 'Student' | 'Interview' | 'System';
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  important: boolean;
  studentId?: string;
  companyId?: string;
  internshipId?: string;
  applicationId?: string;
  verificationId?: string;
}

// Deterministically generate seed notifications using real entities from masterDataset
const generateInitialNotifications = (): PlatformNotification[] => {
  const c1 = generatedCompanies[0];
  const c2 = generatedCompanies[1];
  const s1 = generatedStudents[0];
  const s2 = generatedStudents[1];
  const i1 = generatedInternships[0];
  const i2 = generatedInternships[1];
  const a1 = generatedApplications[0];
  const v1 = generatedPendingVerifications[0];

  return [
    {
      id: 'notif-1',
      type: 'Verification',
      title: 'New Company Verification Request',
      message: `${c1.name} submitted registration compliance dossier for vetting.`,
      createdAt: '18 Aug 2026, 10:30 AM',
      read: false,
      important: true,
      companyId: c1.id,
      verificationId: v1.id,
    },
    {
      id: 'notif-2',
      type: 'Application',
      title: 'High Match Candidate Application',
      message: `${s1.name} applied for "${i1.title}" at ${c1.name} (Match Score: 94%).`,
      createdAt: '18 Aug 2026, 09:15 AM',
      read: false,
      important: false,
      studentId: s1.id,
      internshipId: i1.id,
      applicationId: a1.id,
      companyId: c1.id,
    },
    {
      id: 'notif-3',
      type: 'Interview',
      title: 'Technical Interview Scheduled',
      message: `${s2.name} scheduled for technical round by ${c2.name}.`,
      createdAt: '17 Aug 2026, 04:45 PM',
      read: false,
      important: true,
      studentId: s2.id,
      companyId: c2.id,
    },
    {
      id: 'notif-4',
      type: 'Internship',
      title: 'New High-Capacity Internship Posted',
      message: `${c2.name} posted "${i2.title}" with ${i2.openings} openings.`,
      createdAt: '17 Aug 2026, 02:00 PM',
      read: true,
      important: false,
      companyId: c2.id,
      internshipId: i2.id,
    },
    {
      id: 'notif-5',
      type: 'Student',
      title: 'Student Placement Success',
      message: `${s1.name} accepted official internship offer at ${c1.name}.`,
      createdAt: '16 Aug 2026, 05:30 PM',
      read: true,
      important: true,
      studentId: s1.id,
      companyId: c1.id,
    },
    {
      id: 'notif-6',
      type: 'System',
      title: 'Platform Monthly Compliance Report Generated',
      message: 'System generated complete placement audit dossier for HOD review.',
      createdAt: '15 Aug 2026, 08:00 AM',
      read: true,
      important: false,
    },
    {
      id: 'notif-7',
      type: 'Company',
      title: 'New Corporate Employer Joined',
      message: `${generatedCompanies[3].name} registered corporate account on InternIQ.`,
      createdAt: '14 Aug 2026, 11:10 AM',
      read: true,
      important: false,
      companyId: generatedCompanies[3].id,
    },
    {
      id: 'notif-[#8]',
      type: 'Verification',
      title: 'Employer Verification Dossier Flagged',
      message: `${generatedPendingVerifications[1].name} compliance review requires admin attention.`,
      createdAt: '13 Aug 2026, 03:20 PM',
      read: false,
      important: true,
      verificationId: generatedPendingVerifications[1].id,
    },
  ];
};

interface NotificationContextType {
  notifications: PlatformNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  toggleImportant: (id: string) => void;
  deleteNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<PlatformNotification[]>(generateInitialNotifications());

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleImportant = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, important: !n.important } : n)));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        toggleImportant,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
