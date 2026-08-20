import React, { useState } from 'react';
import { StudentSidebar } from '../../components/student/StudentSidebar';
import { DashboardHeader } from '../../components/student/DashboardHeader';
import { ProfileHeader } from '../../components/student/ProfileHeader';
import type { StudentProfileData } from '../../components/student/ProfileHeader';
import { PersonalInfo } from '../../components/student/PersonalInfo';
import { AcademicInfo } from '../../components/student/AcademicInfo';
import { SkillsSection } from '../../components/student/SkillsSection';
import { CertificationsSection } from '../../components/student/CertificationsSection';
import { ProjectsSection } from '../../components/student/ProjectsSection';
import { ResumeSection } from '../../components/student/ResumeSection';
import { ProfileCompletion } from '../../components/student/ProfileCompletion';
import { AddCertificationModal } from '../../components/student/AddCertificationModal';
import { AddProjectModal } from '../../components/student/AddProjectModal';
import { EditProfileModal } from '../../components/student/EditProfileModal';
import { useAuth } from '../../context/AuthContext';
import type { CertificationItem, ProjectItem } from '../../types/studentProfile';

export const StudentProfile: React.FC = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Per-user profile storage key
  const profileStorageKey = `interniq_student_profile_${user?.id || 'default'}`;
  const photoStorageKey = `interniq_student_photo_${user?.id || 'default'}`;

  const [profile, setProfile] = useState<StudentProfileData>(() => {
    const savedPhoto = localStorage.getItem(photoStorageKey);
    const savedProfile = localStorage.getItem(profileStorageKey);

    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        return {
          ...parsed,
          name: user?.name || parsed.name || 'Student',
          email: user?.email || parsed.email || 'student@interniq.edu',
          photoUrl: savedPhoto || parsed.photoUrl || undefined,
        };
      } catch (err) {
        // fallback
      }
    }

    return {
      name: user?.name || 'Student',
      email: user?.email || 'student@interniq.edu',
      studentId: `STU-${(user?.id || '001').slice(-6).toUpperCase()}`,
      department: user?.department || 'Computer Engineering',
      year: '3rd Year',
      phone: '+91 98765 43210',
      dob: '15 August 2005',
      gender: 'Prefer not to say',
      city: 'Pune, Maharashtra',
      college: 'ABC Institute of Technology',
      cgpa: '8.4 / 10',
      graduationYear: '2027',
      linkedinUrl: user?.name ? `https://www.linkedin.com/in/${user.name.toLowerCase().replace(/\s+/g, '-')}` : 'https://www.linkedin.com',
      photoUrl: savedPhoto || undefined,
    };
  });

  // Sync profile when logged-in user changes
  React.useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
        department: user.department || prev.department,
        studentId: prev.studentId || `STU-${user.id.slice(-6).toUpperCase()}`,
      }));
    }
  }, [user]);

  // Persist profile edits per user
  React.useEffect(() => {
    if (user?.id) {
      localStorage.setItem(profileStorageKey, JSON.stringify(profile));
    }
  }, [profile, profileStorageKey, user?.id]);

  const handlePhotoUpload = (photoUrl: string) => {
    setProfile((prev) => ({ ...prev, photoUrl }));
    localStorage.setItem(photoStorageKey, photoUrl);
  };

  const handlePhotoRemove = () => {
    setProfile((prev) => ({ ...prev, photoUrl: undefined }));
    localStorage.removeItem(photoStorageKey);
  };

  // Per-user storage keys for skills, certifications & projects
  const skillsStorageKey = `interniq_student_skills_${user?.id || 'default'}`;
  const certsStorageKey = `interniq_student_certs_${user?.id || 'default'}`;
  const projectsStorageKey = `interniq_student_projects_${user?.id || 'default'}`;

  const [skills, setSkills] = useState<string[]>(() => {
    const saved = localStorage.getItem(skillsStorageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) { }
    }
    return ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Node.js', 'Git', 'SQL'];
  });

  const [certifications, setCertifications] = useState<CertificationItem[]>(() => {
    const saved = localStorage.getItem(certsStorageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) { }
    }
    return [
      {
        id: '1',
        name: 'React Development Professional',
        issuer: 'Frontend Engineering Institute',
        issueDate: '2025-05-15',
        year: '2025',
        credentialId: 'CERT-FE-88190',
        credentialUrl: 'https://www.credly.com/badges/sample-react-cert',
        verificationStatus: 'verified',
        createdAt: '2025-05-15T00:00:00.000Z',
      },
      {
        id: '2',
        name: 'Python Programming Masterclass',
        issuer: 'Global Tech Academy',
        issueDate: '2024-11-10',
        year: '2024',
        credentialId: 'PY-994012',
        verificationStatus: 'pending',
        createdAt: '2024-11-10T00:00:00.000Z',
      },
    ];
  });

  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    const saved = localStorage.getItem(projectsStorageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) { }
    }
    return [
      {
        id: '1',
        title: 'InternIQ Platform',
        description: 'Intelligent Internship & Placement Management System for institutional placement drives.',
        role: 'Lead Frontend Developer',
        techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js'],
        startDate: '2025-01-10',
        endDate: '2025-06-30',
        githubUrl: 'https://github.com/sample/interniq',
        liveDemoUrl: 'https://interniq.app',
        verificationStatus: 'verified',
        createdAt: '2025-01-10T00:00:00.000Z',
      },
      {
        id: '2',
        title: 'E-Commerce Marketplace',
        description: 'Full Stack Web Application with product catalog, cart checkout & online payment integration.',
        role: 'Full Stack Engineer',
        techStack: ['React', 'Node.js', 'MongoDB', 'Express'],
        startDate: '2024-08-01',
        endDate: '2024-12-15',
        githubUrl: 'https://github.com/sample/ecommerce-store',
        verificationStatus: 'pending',
        createdAt: '2024-08-01T00:00:00.000Z',
      },
    ];
  });

  // Reload per-user data when authenticated user changes
  React.useEffect(() => {
    if (user?.id) {
      const savedSkills = localStorage.getItem(skillsStorageKey);
      if (savedSkills) setSkills(JSON.parse(savedSkills));

      const savedCerts = localStorage.getItem(certsStorageKey);
      if (savedCerts) setCertifications(JSON.parse(savedCerts));

      const savedProjects = localStorage.getItem(projectsStorageKey);
      if (savedProjects) setProjects(JSON.parse(savedProjects));
    }
  }, [user?.id, skillsStorageKey, certsStorageKey, projectsStorageKey]);

  // Persist per-user edits
  React.useEffect(() => {
    if (user?.id) {
      localStorage.setItem(skillsStorageKey, JSON.stringify(skills));
      localStorage.setItem(certsStorageKey, JSON.stringify(certifications));
      localStorage.setItem(projectsStorageKey, JSON.stringify(projects));
    }
  }, [skills, certifications, projects, skillsStorageKey, certsStorageKey, projectsStorageKey, user?.id]);

  // Modal Control States
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<CertificationItem | null>(null);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);

  const handleAddSkillPrompt = () => {
    const skillName = window.prompt('Enter new skill:');
    if (skillName && skillName.trim() && !skills.includes(skillName.trim())) {
      setSkills((prev) => [...prev, skillName.trim()]);
    }
  };

  // Certification Handlers
  const handleSaveCertification = (cert: CertificationItem) => {
    setCertifications((prev) => {
      const exists = prev.some((c) => c.id === cert.id);
      if (exists) {
        return prev.map((c) => (c.id === cert.id ? cert : c));
      }
      return [cert, ...prev];
    });
  };

  const handleDeleteCertification = (id: string) => {
    setCertifications((prev) => prev.filter((c) => c.id !== id));
  };

  // Project Handlers
  const handleSaveProject = (project: ProjectItem) => {
    setProjects((prev) => {
      const exists = prev.some((p) => p.id === project.id);
      if (exists) {
        return prev.map((p) => (p.id === project.id ? project : p));
      }
      return [project, ...prev];
    });
  };

  const handleDeleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-[#0f172a]">
      {/* Sidebar */}
      <StudentSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader onOpenSidebar={() => setIsSidebarOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {/* Top Page Subtitle & Profile Completion Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-6">
              <div className="text-left">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f172a]">My Profile</h1>
                <p className="text-xs sm:text-sm text-[#64748b] mt-1">
                  Manage your personal, academic, certification credentials & technical project showcase.
                </p>
              </div>

              {/* Profile Header Card */}
              <ProfileHeader
                profile={profile}
                onEditClick={() => setIsEditModalOpen(true)}
                onPhotoUpload={handlePhotoUpload}
                onPhotoRemove={handlePhotoRemove}
              />
            </div>

            {/* Profile Completion Indicator */}
            <div className="lg:col-span-4">
              <ProfileCompletion />
            </div>
          </div>

          {/* Detailed Sections Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Columns: Personal & Academic Info */}
            <div className="lg:col-span-7 space-y-6">
              <PersonalInfo profile={profile} />
              <AcademicInfo profile={profile} />
              <ResumeSection />
            </div>

            {/* Right 5 Columns: Skills, Certifications, Projects */}
            <div className="lg:col-span-5 space-y-6">
              <SkillsSection
                skills={skills}
                onAddSkill={handleAddSkillPrompt}
                onRemoveSkill={(skill) => setSkills((prev) => prev.filter((s) => s !== skill))}
              />
              <CertificationsSection
                certifications={certifications}
                onAddCertification={() => {
                  setEditingCert(null);
                  setIsCertModalOpen(true);
                }}
                onEditCertification={(cert) => {
                  setEditingCert(cert);
                  setIsCertModalOpen(true);
                }}
                onDeleteCertification={handleDeleteCertification}
              />
              <ProjectsSection
                projects={projects}
                onAddProject={() => {
                  setEditingProject(null);
                  setIsProjectModalOpen(true);
                }}
                onEditProject={(project) => {
                  setEditingProject(project);
                  setIsProjectModalOpen(true);
                }}
                onDeleteProject={handleDeleteProject}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Edit Profile UI Modal */}
      {/* Complete Profile Edit Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        onSave={(updated) => {
          setProfile(updated);
          if (updated.photoUrl) {
            localStorage.setItem(photoStorageKey, updated.photoUrl);
          } else {
            localStorage.removeItem(photoStorageKey);
          }
        }}
      />

      {/* Add / Edit Certification Modal */}
      <AddCertificationModal
        isOpen={isCertModalOpen}
        onClose={() => {
          setIsCertModalOpen(false);
          setEditingCert(null);
        }}
        onSave={handleSaveCertification}
        editingCert={editingCert}
      />

      {/* Add / Edit Project Modal */}
      <AddProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => {
          setIsProjectModalOpen(false);
          setEditingProject(null);
        }}
        onSave={handleSaveProject}
        editingProject={editingProject}
      />
    </div>
  );
};
