import React, { useState, useEffect } from 'react';
import { StudentSidebar } from '../../components/student/StudentSidebar';
import { DashboardHeader } from '../../components/student/DashboardHeader';
import { ProfileHeader } from '../../components/student/ProfileHeader';
import type { StudentProfileData } from '../../components/student/ProfileHeader';
import { PersonalInfo } from '../../components/student/PersonalInfo';
import { AcademicInfo } from '../../components/student/AcademicInfo';
import { SkillsSection } from '../../components/student/SkillsSection';
import { CertificationsSection } from '../../components/student/CertificationsSection';
import type { CertificationItem } from '../../components/student/CertificationsSection';
import { ProjectsSection } from '../../components/student/ProjectsSection';
import type { ProjectItem } from '../../components/student/ProjectsSection';
import { ResumeSection } from '../../components/student/ResumeSection';
import { ProfileCompletion } from '../../components/student/ProfileCompletion';
import { X, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const StudentProfile: React.FC = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [profile, setProfile] = useState<StudentProfileData>(() => {
    const savedPhoto = localStorage.getItem('interniq_student_photo');
    return {
      name: user?.name || 'Student',
      email: user?.email || 'student@interniq.edu',
      studentId: 'STU2026-001',
      department: 'Computer Engineering',
      year: '3rd Year',
      phone: '+91 98765 43210',
      dob: '15 August 2005',
      gender: 'Prefer not to say',
      city: 'Pune, Maharashtra',
      college: 'ABC Institute of Technology',
      cgpa: '8.4 / 10',
      graduationYear: '2027',
      linkedinUrl: 'https://www.linkedin.com/in/student',
      photoUrl: savedPhoto || undefined,
    };
  });

  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  const handlePhotoUpload = (photoUrl: string) => {
    setProfile((prev) => ({ ...prev, photoUrl }));
    localStorage.setItem('interniq_student_photo', photoUrl);
  };

  const handlePhotoRemove = () => {
    setProfile((prev) => ({ ...prev, photoUrl: undefined }));
    localStorage.removeItem('interniq_student_photo');
  };

  const [skills, setSkills] = useState<string[]>([
    'React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Node.js', 'Git', 'SQL'
  ]);

  const [certifications, setCertifications] = useState<CertificationItem[]>([
    { id: '1', name: 'React Development', issuer: 'Frontend Certification', year: '2025' },
    { id: '2', name: 'Python Programming', issuer: 'Programming Certification', year: '2024' },
  ]);

  const [projects, setProjects] = useState<ProjectItem[]>([
    {
      id: '1',
      title: 'InternIQ',
      description: 'Intelligent Internship & Placement Management Platform for institutions.',
      techStack: ['React', 'TypeScript', 'Tailwind CSS'],
    },
    {
      id: '2',
      title: 'E-Commerce Website',
      description: 'Full Stack Web Application with product catalog & cart checkout.',
      techStack: ['React', 'Node.js', 'MongoDB'],
    },
  ]);

  // Edit Modal Form State
  const [editForm, setEditForm] = useState({
    name: profile.name,
    phone: profile.phone,
    city: profile.city,
    newSkill: '',
  });

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile((prev) => ({
      ...prev,
      name: editForm.name,
      phone: editForm.phone,
      city: editForm.city,
    }));

    if (editForm.newSkill.trim() && !skills.includes(editForm.newSkill.trim())) {
      setSkills((prev) => [...prev, editForm.newSkill.trim()]);
    }

    setIsEditModalOpen(false);
  };

  const handleAddSkillPrompt = () => {
    const skillName = prompt('Enter new skill:');
    if (skillName && skillName.trim() && !skills.includes(skillName.trim())) {
      setSkills((prev) => [...prev, skillName.trim()]);
    }
  };

  const handleAddCertificationPrompt = () => {
    const certName = prompt('Enter Certification Name:');
    if (certName && certName.trim()) {
      setCertifications((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          name: certName.trim(),
          issuer: 'Verified Institution',
          year: String(new Date().getFullYear()),
        },
      ]);
    }
  };

  const handleAddProjectPrompt = () => {
    const projectTitle = prompt('Enter Project Title:');
    if (projectTitle && projectTitle.trim()) {
      setProjects((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          title: projectTitle.trim(),
          description: 'Custom Student Showcase Project.',
          techStack: ['React', 'TypeScript'],
        },
      ]);
    }
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
                  Manage your personal and academic information.
                </p>
              </div>

              {/* Profile Header Card */}
              <ProfileHeader
                profile={profile}
                onEditClick={() => {
                  setEditForm({
                    name: profile.name,
                    phone: profile.phone,
                    city: profile.city,
                    newSkill: '',
                  });
                  setIsEditModalOpen(true);
                }}
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
              <SkillsSection skills={skills} onAddSkill={handleAddSkillPrompt} />
              <CertificationsSection
                certifications={certifications}
                onAddCertification={handleAddCertificationPrompt}
              />
              <ProjectsSection
                projects={projects}
                onAddProject={handleAddProjectPrompt}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Edit Profile UI Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 w-full max-w-md shadow-xl relative animate-in fade-in zoom-in-95 duration-150 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#0f172a]">Edit Profile Details</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563eb]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Phone Number</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563eb]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">City</label>
                <input
                  type="text"
                  value={editForm.city}
                  onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563eb]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Add Skill (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Next.js"
                  value={editForm.newSkill}
                  onChange={(e) => setEditForm({ ...editForm, newSkill: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563eb]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
