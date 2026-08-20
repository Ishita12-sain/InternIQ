import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompanySidebar } from '../../components/company/CompanySidebar';
import { CompanyHeader } from '../../components/company/CompanyHeader';
import { CompanyProfileHeader } from '../../components/company/CompanyProfileHeader';
import type { CompanyProfileData } from '../../components/company/CompanyProfileHeader';
import {
  ArrowLeft,
  Globe,
  Users,
  CheckCircle2,
  Briefcase,
  UserCheck,
  X,
  FileCheck2,
  Code,
} from 'lucide-react';

export const CompanyProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [profile, setProfile] = useState<CompanyProfileData>(() => {
    const saved = localStorage.getItem('interniq_company_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        // Fallback to initial mock state
      }
    }
    return {
      companyName: 'TechNova Solutions Inc.',
      officialEmail: 'hr@technova.com',
      phone: '+91 20 6789 1234',
      website: 'https://technova.com',
      industry: 'Software & Information Technology',
      companySize: '250 - 500 Employees',
      foundedYear: '2018',
      headquarters: 'Bengaluru, Karnataka, India',
      companyId: 'CMP-2026-8890',
      about:
        'TechNova Solutions is a leading software innovation lab delivering cloud-native web platforms, AI integrations, and enterprise digital solutions across India and North America. We empower ambitious student talent through hands-on technical internships.',
      linkedinUrl: 'https://www.linkedin.com/company/technova-solutions',
      githubUrl: 'https://github.com/technova-labs',
      verificationStatus: 'Verified',
      totalPosted: 12,
      activeInternships: 3,
      totalApplicants: 89,
      studentsSelected: 18,
    };
  });

  const [editForm, setEditForm] = useState<CompanyProfileData>(profile);
  const [linkedinError, setLinkedinError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const validateLinkedinUrl = (url: string) => {
    if (!url.trim()) return true; // empty is allowed
    return /^https:\/\/(www\.)?linkedin\.com\/(company|in)\/[A-Za-z0-9_-]+\/?$/.test(url.trim());
  };

  const handlePhotoChange = (photoDataUrl: string) => {
    const updated = { ...profile, profilePhotoUrl: photoDataUrl };
    setProfile(updated);
    localStorage.setItem('interniq_company_profile', JSON.stringify(updated));
    localStorage.setItem('interniq_company_logo', photoDataUrl);
    window.dispatchEvent(new Event('companyProfileUpdated'));
    setFeedback('Company profile photo updated successfully.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handlePhotoRemove = () => {
    const updated = { ...profile, profilePhotoUrl: undefined };
    setProfile(updated);
    localStorage.setItem('interniq_company_profile', JSON.stringify(updated));
    localStorage.removeItem('interniq_company_logo');
    window.dispatchEvent(new Event('companyProfileUpdated'));
    setFeedback('Company profile photo removed.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editForm.linkedinUrl && !validateLinkedinUrl(editForm.linkedinUrl)) {
      setLinkedinError('Please enter a valid LinkedIn URL (e.g. https://www.linkedin.com/company/your-company)');
      return;
    }
    setLinkedinError(null);
    setProfile(editForm);
    localStorage.setItem('interniq_company_profile', JSON.stringify(editForm));
    setIsEditModalOpen(false);
    setFeedback('Company profile information saved.');
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      {/* Sidebar */}
      <CompanySidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <CompanyHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Company Profile"
          subtitle="Manage corporate details, official contact info, and employer verification."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto pb-safe">
          {/* Feedback Toast */}
          {feedback && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2 animate-in fade-in duration-150 text-left">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          {/* Top Bar with Back Button */}
          <div className="flex items-center space-x-3 text-left">
            <button
              type="button"
              onClick={() => navigate('/dashboard/company')}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-xl font-extrabold text-[#0f172a]">Company Profile</h2>
              <p className="text-xs text-[#64748b]">Public employer credentials and statistics</p>
            </div>
          </div>

          {/* Profile Header Card */}
          <CompanyProfileHeader
            profile={profile}
            onEditClick={() => {
              setEditForm(profile);
              setLinkedinError(null);
              setIsEditModalOpen(true);
            }}
            onPhotoChange={handlePhotoChange}
            onPhotoRemove={handlePhotoRemove}
          />

          {/* Internship Statistics Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs space-y-1">
              <div className="flex items-center space-x-2 text-[#2563eb]">
                <Briefcase className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Total Posted
                </span>
              </div>
              <p className="text-2xl font-black text-[#0f172a]">{profile.totalPosted}</p>
            </div>

            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs space-y-1">
              <div className="flex items-center space-x-2 text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Active Internships
                </span>
              </div>
              <p className="text-2xl font-black text-[#0f172a]">{profile.activeInternships}</p>
            </div>

            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs space-y-1">
              <div className="flex items-center space-x-2 text-amber-600">
                <Users className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Total Applicants
                </span>
              </div>
              <p className="text-2xl font-black text-[#0f172a]">{profile.totalApplicants}</p>
            </div>

            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4 shadow-2xs space-y-1">
              <div className="flex items-center space-x-2 text-indigo-600">
                <UserCheck className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Students Selected
                </span>
              </div>
              <p className="text-2xl font-black text-[#0f172a]">{profile.studentsSelected}</p>
            </div>
          </div>

          {/* 2-Column Desktop Grid for Info Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
            {/* Column 1: Company Information & About */}
            <div className="lg:col-span-2 space-y-6">
              {/* Company Information Card */}
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4">
                <h3 className="text-base font-bold text-[#0f172a] border-b border-slate-100 pb-3">
                  Company Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Company Name</span>
                    <strong className="text-slate-900 font-bold text-xs">{profile.companyName}</strong>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Official Email</span>
                    <a href={`mailto:${profile.officialEmail}`} className="text-[#2563eb] font-bold hover:underline">
                      {profile.officialEmail}
                    </a>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Phone Number</span>
                    <strong className="text-slate-900 font-bold">{profile.phone}</strong>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Industry Sector</span>
                    <strong className="text-slate-900 font-bold">{profile.industry}</strong>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Company Size</span>
                    <strong className="text-slate-900 font-bold">{profile.companySize}</strong>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Headquarters</span>
                    <strong className="text-slate-900 font-bold">{profile.headquarters}</strong>
                  </div>
                </div>
              </div>

              {/* About Company Card */}
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-3">
                <h3 className="text-base font-bold text-[#0f172a] border-b border-slate-100 pb-3">
                  About Company
                </h3>
                <p className="text-xs text-[#64748b] leading-relaxed font-medium">
                  {profile.about}
                </p>
              </div>
            </div>

            {/* Column 2: Social Links & Employer Verification */}
            <div className="space-y-6">
              {/* Social & Professional Links Card */}
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4">
                <h3 className="text-base font-bold text-[#0f172a] border-b border-slate-100 pb-3">
                  Online Links
                </h3>

                <div className="space-y-2.5 text-xs font-semibold">
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center space-x-3 text-slate-800 hover:text-[#2563eb] hover:bg-blue-50/50 transition-colors"
                  >
                    <Globe className="w-4 h-4 text-[#2563eb] shrink-0" />
                    <span className="truncate">{profile.website}</span>
                  </a>

                  {profile.linkedinUrl ? (
                    <a
                      href={profile.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-blue-50/50 border border-blue-200/80 flex items-center justify-between text-[#2563eb] hover:bg-blue-100/60 transition-colors group"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <svg className="w-4 h-4 text-[#2563eb] fill-current shrink-0" viewBox="0 0 24 24">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                        </svg>
                        <span className="truncate font-bold">{profile.linkedinUrl}</span>
                      </div>
                      <span className="text-[10px] text-blue-600 underline opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                        Open Tab
                      </span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setEditForm(profile);
                        setLinkedinError(null);
                        setIsEditModalOpen(true);
                      }}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-dashed border-slate-300 flex items-center justify-between text-slate-500 hover:text-[#2563eb] hover:bg-blue-50/40 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <svg className="w-4 h-4 text-slate-400 fill-current" viewBox="0 0 24 24">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                        </svg>
                        <span className="font-medium">+ Add LinkedIn Profile</span>
                      </div>
                    </button>
                  )}

                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center space-x-3 text-slate-800 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  >
                    <Code className="w-4 h-4 text-slate-800 shrink-0" />
                    <span className="truncate">GitHub Repository</span>
                  </a>
                </div>
              </div>

              {/* Employer Verification Status Card */}
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4">
                <h3 className="text-base font-bold text-[#0f172a] border-b border-slate-100 pb-3">
                  Company Verification
                </h3>

                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs">
                    <FileCheck2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Status: Verified Employer</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 leading-relaxed font-medium">
                    Corporate Certificate & Tax ID verified by University Internship Administration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 sm:p-8 w-full max-w-xl shadow-xl relative text-left space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#0f172a]">Edit Company Profile</h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs font-medium">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">
                  Company Name
                </label>
                <input
                  type="text"
                  value={editForm.companyName}
                  onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563eb]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">
                    Official Email
                  </label>
                  <input
                    type="email"
                    value={editForm.officialEmail}
                    onChange={(e) => setEditForm({ ...editForm, officialEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563eb]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563eb]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">
                    Industry
                  </label>
                  <input
                    type="text"
                    value={editForm.industry}
                    onChange={(e) => setEditForm({ ...editForm, industry: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563eb]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">
                    Headquarters
                  </label>
                  <input
                    type="text"
                    value={editForm.headquarters}
                    onChange={(e) => setEditForm({ ...editForm, headquarters: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563eb]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">
                  Website URL
                </label>
                <input
                  type="url"
                  value={editForm.website}
                  onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  placeholder="https://www.linkedin.com/company/your-company"
                  value={editForm.linkedinUrl}
                  onChange={(e) => {
                    setEditForm({ ...editForm, linkedinUrl: e.target.value });
                    setLinkedinError(null);
                  }}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-slate-900 focus:outline-none ${
                    linkedinError ? 'border-rose-500 focus:border-rose-500' : 'border-slate-300 focus:border-[#2563eb]'
                  }`}
                />
                {linkedinError && (
                  <p className="text-[11px] text-rose-600 font-semibold mt-1">{linkedinError}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">
                  About Company
                </label>
                <textarea
                  rows={4}
                  value={editForm.about}
                  onChange={(e) => setEditForm({ ...editForm, about: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
