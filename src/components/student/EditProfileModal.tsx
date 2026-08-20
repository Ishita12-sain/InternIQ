import React, { useState, useRef } from 'react';
import { X, User, Camera, Save, Loader2, CheckCircle2 } from 'lucide-react';
import type { StudentProfileData } from './ProfileHeader';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfileData;
  onSave: (updatedProfile: StudentProfileData) => void;
}

const YEAR_OPTIONS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Post Graduate'];
const SEMESTER_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'personal' | 'academic' | 'skills' | 'photo'>('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<StudentProfileData>({
    name: profile.name || '',
    email: profile.email || '',
    studentId: profile.studentId || '',
    department: profile.department || '',
    year: profile.year || '3rd Year',
    semester: profile.semester || 5,
    phone: profile.phone || '',
    dob: profile.dob || '',
    gender: profile.gender || 'Prefer not to say',
    city: profile.city || '',
    college: profile.college || '',
    cgpa: profile.cgpa || '',
    graduationYear: profile.graduationYear || '2027',
    linkedinUrl: profile.linkedinUrl || '',
    photoUrl: profile.photoUrl || undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^[+0-9\s-]{8,15}$/.test(formData.phone.trim())) {
      errs.phone = 'Please enter a valid phone number';
    }

    if (formData.cgpa) {
      const numericCgpa = parseFloat(formData.cgpa.replace(/[^0-9.]/g, ''));
      if (isNaN(numericCgpa) || numericCgpa < 0 || numericCgpa > 10) {
        errs.cgpa = 'CGPA must be a valid number between 0 and 10';
      }
    }

    if (formData.graduationYear) {
      const yearNum = parseInt(formData.graduationYear, 10);
      if (isNaN(yearNum) || yearNum < 2020 || yearNum > 2035) {
        errs.graduationYear = 'Enter a valid graduation year (2020-2035)';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({ ...prev, photo: 'Photo must be JPG, PNG, or WEBP' }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, photo: 'Photo size must be less than 5 MB' }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const resultStr: string = reader.result;
          setFormData((prev) => ({ ...prev, photoUrl: resultStr }));
          setErrors((prev) => ({ ...prev, photo: '' }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 350));
    onSave(formData);
    setIsSaving(false);
    setToastMessage('Profile updated successfully!');
    setTimeout(() => {
      setToastMessage(null);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden my-4 sm:my-8 animate-in fade-in zoom-in-95 duration-200 text-left max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center space-x-2.5">
            <User className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Edit Complete Profile</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="px-6 pt-3 bg-white border-b border-slate-100 flex items-center space-x-4 overflow-x-auto text-xs font-semibold shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`pb-2.5 px-1 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'personal'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Personal Info
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('academic')}
            className={`pb-2.5 px-1 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'academic'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Academic Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('photo')}
            className={`pb-2.5 px-1 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'photo'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Profile Photo
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
          {/* Tab 1: Personal Info */}
          {activeTab === 'personal' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600"
                  required
                />
                {errors.name && <p className="text-[11px] text-rose-600">{errors.name}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600"
                  required
                />
                {errors.email && <p className="text-[11px] text-rose-600">{errors.email}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600"
                />
                {errors.phone && <p className="text-[11px] text-rose-600">{errors.phone}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Date of Birth</label>
                <input
                  type="text"
                  placeholder="15 August 2005"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">City</label>
                <input
                  type="text"
                  placeholder="Pune, Maharashtra"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700">LinkedIn Profile URL</label>
                <input
                  type="url"
                  placeholder="https://www.linkedin.com/in/yourprofile"
                  value={formData.linkedinUrl || ''}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>
          )}

          {/* Tab 2: Academic Details */}
          {activeTab === 'academic' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700">College / Institution</label>
                <input
                  type="text"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Department / Program</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Year of Study</label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 bg-white"
                >
                  {YEAR_OPTIONS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Semester</label>
                <select
                  value={formData.semester || 5}
                  onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value, 10) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 bg-white font-semibold text-blue-700"
                >
                  {SEMESTER_OPTIONS.map((s) => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">CGPA (0 - 10)</label>
                <input
                  type="text"
                  placeholder="8.4 / 10"
                  value={formData.cgpa}
                  onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600"
                />
                {errors.cgpa && <p className="text-[11px] text-rose-600">{errors.cgpa}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Expected Graduation Year</label>
                <input
                  type="text"
                  placeholder="2027"
                  value={formData.graduationYear}
                  onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600"
                />
                {errors.graduationYear && <p className="text-[11px] text-rose-600">{errors.graduationYear}</p>}
              </div>
            </div>
          )}

          {/* Tab 3: Photo */}
          {activeTab === 'photo' && (
            <div className="space-y-4 text-center py-4">
              <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-blue-100 shadow-md bg-slate-100 flex items-center justify-center">
                {formData.photoUrl ? (
                  <img src={formData.photoUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-blue-600 text-white font-extrabold text-2xl flex items-center justify-center">
                    {formData.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                )}
              </div>

              <input
                ref={photoInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                onChange={handlePhotoSelect}
                className="hidden"
              />

              <div className="flex items-center justify-center space-x-3">
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Upload Photo</span>
                </button>

                {formData.photoUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, photoUrl: undefined })}
                    className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Remove Photo
                  </button>
                )}
              </div>

              {errors.photo && <p className="text-xs text-rose-600 font-semibold">{errors.photo}</p>}
            </div>
          )}

          {/* Toast feedback */}
          {toastMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Footer Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-2xs cursor-pointer disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
