import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompanySidebar } from '../../components/company/CompanySidebar';
import { CompanyHeader } from '../../components/company/CompanyHeader';
import {
  SearchableLocationSelector,
  INDIAN_CITIES_LIST,
} from '../../components/student/SearchableLocationSelector';
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Plus,
  X,
  Building,
  Loader2,
} from 'lucide-react';
import type { CompanyInternshipItem } from './CompanyManageInternshipsPage';

export interface CreateInternshipFormData {
  title: string;
  companyName: string;
  description: string;
  internshipType: string;
  department: string;
  requiredSkills: string[];
  location: string;
  workMode: 'Remote' | 'Full Time' | 'Hybrid';
  duration: string;
  stipend: string;
  openings: string;
  eligibilityCriteria: string;
  minCgpa: string;
  graduationYear: string;
  applicationDeadline: string;
}

export const PostInternshipPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Skill Chip input state
  const [skillInput, setSkillInput] = useState('');

  const [formData, setFormData] = useState<CreateInternshipFormData>({
    title: '',
    companyName: 'TechNova Solutions',
    description: '',
    internshipType: 'Full-Time Internship',
    department: 'Engineering',
    requiredSkills: ['React', 'TypeScript'],
    location: 'Bengaluru, KA',
    workMode: 'Remote',
    duration: '3 Months',
    stipend: '₹25,000 / month',
    openings: '2',
    eligibilityCriteria: 'B.Tech / B.E. / M.Tech in CS, IT or related branches.',
    minCgpa: '7.5',
    graduationYear: '2025 / 2026 Batch',
    applicationDeadline: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateInternshipFormData, string>>>({});

  // Skill Chip handlers
  const handleAddSkill = () => {
    if (!skillInput.trim()) return;
    if (!formData.requiredSkills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        requiredSkills: [...formData.requiredSkills, skillInput.trim()],
      });
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      requiredSkills: formData.requiredSkills.filter((s) => s !== skillToRemove),
    });
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof CreateInternshipFormData, string>> = {};
    if (!formData.title.trim()) newErrors.title = 'Internship Title is required';
    if (!formData.companyName.trim()) newErrors.companyName = 'Company Name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.requiredSkills.length === 0) newErrors.requiredSkills = 'At least one required skill is needed';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.stipend.trim()) newErrors.stipend = 'Stipend amount is required';
    if (!formData.applicationDeadline.trim()) newErrors.applicationDeadline = 'Application Deadline is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = () => {
    setIsSubmitting(true);

    const savedCustom: CompanyInternshipItem[] = JSON.parse(
      localStorage.getItem('interniq_company_custom_internships') || '[]'
    );

    const draftItem: CompanyInternshipItem = {
      id: `custom-int-${Date.now()}`,
      title: formData.title || 'Untitled Draft Position',
      companyName: formData.companyName,
      department: formData.department,
      location: formData.location,
      workMode: formData.workMode as any,
      duration: formData.duration,
      stipend: formData.stipend || 'Unpaid',
      openings: parseInt(formData.openings) || 1,
      applicantsCount: 0,
      applicationDeadline: formData.applicationDeadline || 'TBD',
      postedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Draft',
      description: formData.description,
      requiredSkills: formData.requiredSkills.join(', '),
    };

    localStorage.setItem(
      'interniq_company_custom_internships',
      JSON.stringify([draftItem, ...savedCustom])
    );

    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/company/internships?status=draft');
    }, 400);
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      setFeedback({ type: 'error', message: 'Please fill in all required fields highlighted in red.' });
      return;
    }

    setIsSubmitting(true);

    const savedCustom: CompanyInternshipItem[] = JSON.parse(
      localStorage.getItem('interniq_company_custom_internships') || '[]'
    );

    const activeItem: CompanyInternshipItem = {
      id: `custom-int-${Date.now()}`,
      title: formData.title,
      companyName: formData.companyName,
      department: formData.department,
      location: formData.location,
      workMode: formData.workMode as any,
      duration: formData.duration,
      stipend: formData.stipend,
      openings: parseInt(formData.openings) || 1,
      applicantsCount: 0,
      applicationDeadline: new Date(formData.applicationDeadline).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      postedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Active',
      description: formData.description,
      requiredSkills: formData.requiredSkills.join(', '),
    };

    localStorage.setItem(
      'interniq_company_custom_internships',
      JSON.stringify([activeItem, ...savedCustom])
    );

    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/company/internships?status=active');
    }, 400);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <CompanySidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <CompanyHeader
          onOpenSidebar={() => setIsSidebarOpen(true)}
          title="Create New Internship"
          subtitle="Publish an internship opening for student recruitment."
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-5xl w-full mx-auto pb-safe text-left">
          {/* Header Bar */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => navigate('/company/internships')}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
              title="Back to Manage Internships"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-xl font-extrabold text-[#0f172a]">Create Internship Position</h2>
              <p className="text-xs text-[#64748b]">Fill in position details, eligibility requirements, and stipend</p>
            </div>
          </div>

          {/* Inline Feedback Banner */}
          {feedback && (
            <div
              className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center space-x-2 animate-in fade-in duration-150 ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Multi-Section Form */}
          <form onSubmit={handlePublish} className="space-y-6">
            {/* Card Section 1: Basic Position Information */}
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <Briefcase className="w-4 h-4 text-[#2563eb]" />
                <h3 className="text-sm font-extrabold text-[#0f172a]">Basic Position Information</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">
                    Internship Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Frontend Developer Intern"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`w-full px-3 py-2.5 bg-slate-50 border rounded-xl text-slate-900 focus:outline-none ${
                      errors.title ? 'border-rose-500 focus:border-rose-500' : 'border-slate-300 focus:border-[#2563eb]'
                    }`}
                  />
                  {errors.title && <p className="text-[11px] text-rose-600 font-semibold">{errors.title}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">
                    Company Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Building className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. TechNova Solutions"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border rounded-xl text-slate-900 focus:outline-none ${
                        errors.companyName ? 'border-rose-500' : 'border-slate-300 focus:border-[#2563eb]'
                      }`}
                    />
                  </div>
                  {errors.companyName && <p className="text-[11px] text-rose-600 font-semibold">{errors.companyName}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">
                    Department / Domain
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563eb]"
                  >
                    <option value="Engineering">Engineering / Software</option>
                    <option value="Product Design">UI/UX & Product Design</option>
                    <option value="Data & AI">Data Science & AI</option>
                    <option value="Marketing">Marketing & Business Development</option>
                    <option value="Finance">Finance & Operations</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">
                    Internship Type
                  </label>
                  <select
                    value={formData.internshipType}
                    onChange={(e) => setFormData({ ...formData, internshipType: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563eb]"
                  >
                    <option value="Full-Time Internship">Full-Time Internship</option>
                    <option value="Part-Time Internship">Part-Time Internship</option>
                    <option value="Summer Internship">Summer Internship</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">
                    Number of Vacancies / Openings
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.openings}
                    onChange={(e) => setFormData({ ...formData, openings: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563eb]"
                  />
                </div>

                {/* Multi-select Required Skills */}
                <div className="space-y-2 sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">
                    Required Skills <span className="text-rose-500">*</span>
                  </label>

                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Type a skill and click Add..."
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                      className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563eb]"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="inline-flex items-center space-x-1 px-4 py-2.5 bg-blue-50 border border-blue-200 text-[#2563eb] rounded-xl text-xs font-semibold hover:bg-blue-100 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>

                  {/* Skill Chips */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {formData.requiredSkills.map((sk) => (
                      <span
                        key={sk}
                        className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-50 text-[#2563eb] border border-blue-200 rounded-xl text-xs font-bold"
                      >
                        <span>{sk}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(sk)}
                          className="hover:text-rose-600 transition-colors ml-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                  {errors.requiredSkills && (
                    <p className="text-[11px] text-rose-600 font-semibold">{errors.requiredSkills}</p>
                  )}
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">
                    Role Description & Responsibilities <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe daily tasks, engineering projects, and team expectations..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`w-full px-3 py-2.5 bg-slate-50 border rounded-xl text-slate-900 focus:outline-none ${
                      errors.description ? 'border-rose-500' : 'border-slate-300 focus:border-[#2563eb]'
                    }`}
                  />
                  {errors.description && (
                    <p className="text-[11px] text-rose-600 font-semibold">{errors.description}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Card Section 2: Location, Mode & Compensation */}
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <MapPin className="w-4 h-4 text-[#2563eb]" />
                <h3 className="text-sm font-extrabold text-[#0f172a]">Logistics & Stipend</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-medium">
                {/* Searchable Location Selector */}
                <div className="space-y-1">
                  <SearchableLocationSelector
                    selectedLocation={formData.location}
                    onLocationChange={(loc) => setFormData({ ...formData, location: loc })}
                    availableLocations={INDIAN_CITIES_LIST}
                  />
                  {errors.location && (
                    <p className="text-[11px] text-rose-600 font-semibold">{errors.location}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">
                    Work Mode
                  </label>
                  <select
                    value={formData.workMode}
                    onChange={(e) => setFormData({ ...formData, workMode: e.target.value as any })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563eb]"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Full Time">Full Time (On-site)</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">
                    Duration
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563eb]"
                  >
                    <option value="2 Months">2 Months</option>
                    <option value="3 Months">3 Months</option>
                    <option value="6 Months">6 Months</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">
                    Monthly Stipend <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹25,000 / month"
                    value={formData.stipend}
                    onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                    className={`w-full px-3 py-2.5 bg-slate-50 border rounded-xl text-slate-900 focus:outline-none ${
                      errors.stipend ? 'border-rose-500' : 'border-slate-300 focus:border-[#2563eb]'
                    }`}
                  />
                  {errors.stipend && <p className="text-[11px] text-rose-600 font-semibold">{errors.stipend}</p>}
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">
                    Application Deadline <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.applicationDeadline}
                    onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                    className={`w-full px-3 py-2.5 bg-slate-50 border rounded-xl text-slate-900 focus:outline-none ${
                      errors.applicationDeadline ? 'border-rose-500' : 'border-slate-300 focus:border-[#2563eb]'
                    }`}
                  />
                  {errors.applicationDeadline && (
                    <p className="text-[11px] text-rose-600 font-semibold">{errors.applicationDeadline}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Card Section 3: Eligibility & Cutoffs */}
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <GraduationCap className="w-4 h-4 text-[#2563eb]" />
                <h3 className="text-sm font-extrabold text-[#0f172a]">Candidate Eligibility</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium">
                <div className="space-y-1 sm:col-span-3">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">
                    Eligibility Criteria Summary
                  </label>
                  <input
                    type="text"
                    value={formData.eligibilityCriteria}
                    onChange={(e) => setFormData({ ...formData, eligibilityCriteria: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563eb]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">
                    Minimum CGPA Cutoff
                  </label>
                  <input
                    type="text"
                    value={formData.minCgpa}
                    onChange={(e) => setFormData({ ...formData, minCgpa: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563eb]"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">
                    Eligible Graduation Year
                  </label>
                  <input
                    type="text"
                    value={formData.graduationYear}
                    onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#2563eb]"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/company/internships')}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold cursor-pointer"
                disabled={isSubmitting}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveDraft}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center space-x-1">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </span>
                ) : (
                  'Save as Draft'
                )}
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center space-x-1">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Publishing...</span>
                  </span>
                ) : (
                  'Publish Internship'
                )}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};
