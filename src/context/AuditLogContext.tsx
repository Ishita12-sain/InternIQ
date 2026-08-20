import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import {
  generatedStudents,
  generatedCompanies,
  generatedFaculty,
  generatedInternships,
  generatedApplications,
  generatedPendingVerifications,
} from '../types/masterDataset';

export type ActionType =
  | 'Created'
  | 'Updated'
  | 'Deleted'
  | 'Approved'
  | 'Rejected'
  | 'Verified'
  | 'Shortlisted'
  | 'Selected'
  | 'Login'
  | 'Logout'
  | 'Status Changed'
  | 'Settings Updated';

export type LogModule =
  | 'Students'
  | 'Companies'
  | 'Faculty'
  | 'Internships'
  | 'Applications'
  | 'Verifications'
  | 'Interviews'
  | 'Notifications'
  | 'Settings';

export type UserRole = 'Admin' | 'Student' | 'Company' | 'Faculty' | 'T&P';

export interface AuditLogItem {
  id: string;
  userId: string;
  userName: string;
  role: UserRole;
  action: ActionType;
  module: LogModule;
  description: string;
  timestamp: string; // ISO date string e.g. "2026-08-19T10:42:00.000Z"
  status: 'Success' | 'Failed' | 'Pending';
  relatedEntityId?: string;
  relatedEntityName?: string;
  previousValue?: string;
  newValue?: string;
  ipAddress?: string;
  userAgent?: string;
}

// Initial seed audit logs generated directly from master dataset entities
const generateInitialAuditLogs = (): AuditLogItem[] => {
  const c1 = generatedCompanies[0];
  const c2 = generatedCompanies[1];
  const s1 = generatedStudents[0];
  const s2 = generatedStudents[1];
  const f1 = generatedFaculty[0];
  const i1 = generatedInternships[0];
  const a1 = generatedApplications[0];
  const v1 = generatedPendingVerifications[0];

  return [
    {
      id: 'log-101',
      userId: 'usr-admin-01',
      userName: 'Admin SuperUser',
      role: 'Admin',
      action: 'Verified',
      module: 'Verifications',
      description: `Company verification status for "${c1.name}" changed to Verified.`,
      timestamp: '2026-08-19T10:42:00.000Z',
      status: 'Success',
      relatedEntityId: v1.id,
      relatedEntityName: c1.name,
      previousValue: 'Pending',
      newValue: 'Verified',
      ipAddress: '192.168.1.45',
      userAgent: 'Chrome 127.0.0 (Windows 11)',
    },
    {
      id: 'log-102',
      userId: s1.id,
      userName: s1.name,
      role: 'Student',
      action: 'Created',
      module: 'Applications',
      description: `Submitted application for "${i1.title}" position at ${c1.name}.`,
      timestamp: '2026-08-19T09:15:00.000Z',
      status: 'Success',
      relatedEntityId: a1.id,
      relatedEntityName: i1.title,
      previousValue: 'None',
      newValue: 'Applied (Under Review)',
      ipAddress: '192.168.2.112',
      userAgent: 'Safari 17.4 (iOS 17.5)',
    },
    {
      id: 'log-103',
      userId: c2.id,
      userName: c2.name,
      role: 'Company',
      action: 'Created',
      module: 'Internships',
      description: `Posted new internship opportunity "${generatedInternships[1].title}" with ${generatedInternships[1].openings} openings.`,
      timestamp: '2026-08-18T16:30:00.000Z',
      status: 'Success',
      relatedEntityId: generatedInternships[1].id,
      relatedEntityName: generatedInternships[1].title,
      previousValue: 'Draft',
      newValue: 'Active Listing',
      ipAddress: '10.0.4.88',
      userAgent: 'Chrome 126.0.0 (macOS 14)',
    },
    {
      id: 'log-104',
      userId: 'usr-admin-01',
      userName: 'Admin SuperUser',
      role: 'Admin',
      action: 'Settings Updated',
      module: 'Settings',
      description: 'Updated application workflow policy (Max applications per student set to 10).',
      timestamp: '2026-08-18T14:10:00.000Z',
      status: 'Success',
      relatedEntityId: 'set-app-rules',
      relatedEntityName: 'Application Workflow Rules',
      previousValue: 'Max 5 Apps',
      newValue: 'Max 10 Apps',
      ipAddress: '192.168.1.45',
      userAgent: 'Chrome 127.0.0 (Windows 11)',
    },
    {
      id: 'log-105',
      userId: f1.id,
      userName: f1.name,
      role: 'Faculty',
      action: 'Approved',
      module: 'Students',
      description: `Faculty mentor approved digital logbook submission for ${s2.name}.`,
      timestamp: '2026-08-17T11:20:00.000Z',
      status: 'Success',
      relatedEntityId: s2.id,
      relatedEntityName: s2.name,
      previousValue: 'Pending Logbook Review',
      newValue: 'Logbook Verified',
      ipAddress: '172.16.0.14',
      userAgent: 'Firefox 128.0 (Windows 10)',
    },
    {
      id: 'log-106',
      userId: 'usr-admin-01',
      userName: 'Admin SuperUser',
      role: 'Admin',
      action: 'Deleted',
      module: 'Notifications',
      description: 'Purged expired compliance security audit alert notification.',
      timestamp: '2026-08-16T18:05:00.000Z',
      status: 'Success',
      relatedEntityId: 'notif-arch-99',
      relatedEntityName: 'Security Audit Alert',
      previousValue: 'Unread Alert',
      newValue: 'Deleted',
      ipAddress: '192.168.1.45',
    },
    {
      id: 'log-107',
      userId: c1.id,
      userName: c1.name,
      role: 'Company',
      action: 'Shortlisted',
      module: 'Applications',
      description: `Shortlisted candidate ${s1.name} for technical interview round.`,
      timestamp: '2026-08-15T15:45:00.000Z',
      status: 'Success',
      relatedEntityId: a1.id,
      relatedEntityName: s1.name,
      previousValue: 'Under Review',
      newValue: 'Shortlisted',
      ipAddress: '10.0.1.22',
    },
    {
      id: 'log-108',
      userId: 'usr-admin-01',
      userName: 'Admin SuperUser',
      role: 'Admin',
      action: 'Updated',
      module: 'Students',
      description: `Updated academic readiness score parameters for ${s2.name}.`,
      timestamp: '2026-08-14T09:00:00.000Z',
      status: 'Success',
      relatedEntityId: s2.id,
      relatedEntityName: s2.name,
      previousValue: 'Readiness Score: 78%',
      newValue: 'Readiness Score: 85%',
      ipAddress: '192.168.1.45',
    },
  ];
};

interface AuditLogContextType {
  auditLogs: AuditLogItem[];
  logActivity: (log: Omit<AuditLogItem, 'id' | 'timestamp'>) => void;
  clearAuditLogs: () => void;
}

const AuditLogContext = createContext<AuditLogContextType | undefined>(undefined);

export const AuditLogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    try {
      const saved = localStorage.getItem('interniq_audit_logs');
      if (saved) return JSON.parse(saved);
    } catch (err) {
      console.warn('Failed to parse audit logs from localStorage', err);
    }
    return generateInitialAuditLogs();
  });

  // Save to localStorage whenever logs change
  useEffect(() => {
    try {
      localStorage.setItem('interniq_audit_logs', JSON.stringify(auditLogs));
    } catch (err) {
      console.warn('Failed to save audit logs to localStorage', err);
    }
  }, [auditLogs]);

  const logActivity = (newLog: Omit<AuditLogItem, 'id' | 'timestamp'>) => {
    const item: AuditLogItem = {
      ...newLog,
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [item, ...prev]);
  };

  const clearAuditLogs = () => {
    setAuditLogs([]);
  };

  return (
    <AuditLogContext.Provider value={{ auditLogs, logActivity, clearAuditLogs }}>
      {children}
    </AuditLogContext.Provider>
  );
};

export const useAuditLogs = () => {
  const context = useContext(AuditLogContext);
  if (!context) {
    throw new Error('useAuditLogs must be used within an AuditLogProvider');
  }
  return context;
};
