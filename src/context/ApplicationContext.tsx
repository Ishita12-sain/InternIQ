import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';

export type ApplicationStage =
  | 'Application Submitted'
  | 'Under Review'
  | 'Shortlisted'
  | 'Interview Scheduled'
  | 'Selected'
  | 'Offer Received'
  | 'Accepted'
  | 'Rejected'
  | 'Withdrawn';

export type ApplicationStatus =
  | 'Applied'
  | 'Under Review'
  | 'Shortlisted'
  | 'Interview Scheduled'
  | 'Selected'
  | 'Rejected';

export interface StudentApplicationRecord {
  id: string;
  applicationId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  internshipId: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  internshipTitle: string;
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site' | 'Full Time';
  stipend: string;
  appliedAt: string;
  status: ApplicationStatus;
  currentStage: ApplicationStage;
  skills: string[];
}

interface ApplicationContextType {
  applications: StudentApplicationRecord[];
  isSubmitting: boolean;
  applyForInternship: (internship: {
    id: string;
    title: string;
    companyName: string;
    companyLogo?: string;
    companyId?: string;
    location: string;
    workMode: string;
    stipend: string;
    skills?: string[];
  }) => Promise<{ success: boolean; message: string; record?: StudentApplicationRecord }>;
  hasStudentApplied: (internshipId: string) => boolean;
  getApplicationByInternshipId: (internshipId: string) => StudentApplicationRecord | undefined;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const ApplicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initial seed applications for demonstration if no user-saved applications exist yet
  const [applications, setApplications] = useState<StudentApplicationRecord[]>(() => {
    if (!user?.id) return [];
    const saved = localStorage.getItem(`interniq_student_applications_${user.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {}
    }
    // Default seed application records mapped to current authenticated user
    return [
      {
        id: 'app-seed-1',
        applicationId: 'APP-2026-8801',
        studentId: user.id,
        studentName: user.name,
        studentEmail: user.email,
        internshipId: 'rec-1',
        companyId: 'comp-101',
        companyName: 'TechCorp Labs',
        companyLogo: 'TC',
        internshipTitle: 'Frontend Developer Intern',
        location: 'Bengaluru, KA',
        workMode: 'Remote',
        stipend: '₹25,000 / month',
        appliedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        status: 'Applied',
        currentStage: 'Application Submitted',
        skills: ['React', 'TypeScript', 'Tailwind CSS'],
      },
    ];
  });

  // Reload applications when authenticated user session changes
  useEffect(() => {
    if (user?.id) {
      const saved = localStorage.getItem(`interniq_student_applications_${user.id}`);
      if (saved) {
        try {
          setApplications(JSON.parse(saved));
          return;
        } catch (err) {}
      }
      // Re-initialize default record for new logged-in user
      setApplications([
        {
          id: `app-seed-${user.id}`,
          applicationId: `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          studentId: user.id,
          studentName: user.name,
          studentEmail: user.email,
          internshipId: 'rec-1',
          companyId: 'comp-101',
          companyName: 'TechCorp Labs',
          companyLogo: 'TC',
          internshipTitle: 'Frontend Developer Intern',
          location: 'Bengaluru, KA',
          workMode: 'Remote',
          stipend: '₹25,000 / month',
          appliedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          status: 'Applied',
          currentStage: 'Application Submitted',
          skills: ['React', 'TypeScript', 'Tailwind CSS'],
        },
      ]);
    } else {
      setApplications([]);
    }
  }, [user?.id, user?.name, user?.email]);

  // Persist applications state per student user ID
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`interniq_student_applications_${user.id}`, JSON.stringify(applications));
    }
  }, [applications, user?.id]);

  const hasStudentApplied = (internshipId: string): boolean => {
    return applications.some((app) => app.internshipId === internshipId);
  };

  const getApplicationByInternshipId = (internshipId: string): StudentApplicationRecord | undefined => {
    return applications.find((app) => app.internshipId === internshipId);
  };

  const applyForInternship = async (internship: {
    id: string;
    title: string;
    companyName: string;
    companyLogo?: string;
    companyId?: string;
    location: string;
    workMode: string;
    stipend: string;
    skills?: string[];
  }): Promise<{ success: boolean; message: string; record?: StudentApplicationRecord }> => {
    if (!user) {
      return { success: false, message: 'You must be logged in to apply for internships.' };
    }

    if (hasStudentApplied(internship.id)) {
      return { success: false, message: `You have already applied for ${internship.title} at ${internship.companyName}.` };
    }

    setIsSubmitting(true);

    try {
      // Simulate network request latency (400ms)
      await new Promise((resolve) => setTimeout(resolve, 400));

      const newRecord: StudentApplicationRecord = {
        id: `app-${Date.now()}`,
        applicationId: `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        studentId: user.id,
        studentName: user.name,
        studentEmail: user.email,
        internshipId: internship.id,
        companyId: internship.companyId || `comp-${internship.companyName.toLowerCase().replace(/\s+/g, '-')}`,
        companyName: internship.companyName,
        companyLogo: internship.companyLogo || internship.companyName.slice(0, 2).toUpperCase(),
        internshipTitle: internship.title,
        location: internship.location,
        workMode: (internship.workMode as any) || 'Remote',
        stipend: internship.stipend,
        appliedAt: new Date().toISOString(),
        status: 'Applied',
        currentStage: 'Application Submitted',
        skills: internship.skills || ['React', 'TypeScript'],
      };

      setApplications((prev) => [newRecord, ...prev]);

      return {
        success: true,
        message: `Your application for ${internship.title} at ${internship.companyName} has been submitted successfully.`,
        record: newRecord,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Unable to submit application. Please check your connection and try again.',
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ApplicationContext.Provider
      value={{
        applications,
        isSubmitting,
        applyForInternship,
        hasStudentApplied,
        getApplicationByInternshipId,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplication = () => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useApplication must be used within an ApplicationProvider');
  }
  return context;
};
