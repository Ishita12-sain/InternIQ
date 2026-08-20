import React from 'react';
import { Edit, Building2, MapPin, CheckCircle2 } from 'lucide-react';

export interface CompanyProfileData {
  companyName: string;
  officialEmail: string;
  phone: string;
  website: string;
  industry: string;
  companySize: string;
  foundedYear: string;
  headquarters: string;
  companyId: string;
  about: string;
  linkedinUrl: string;
  githubUrl: string;
  verificationStatus: 'Verified' | 'Pending' | 'Unverified';
  totalPosted: number;
  activeInternships: number;
  totalApplicants: number;
  studentsSelected: number;
  profilePhotoUrl?: string;
}

interface CompanyProfileHeaderProps {
  profile: CompanyProfileData;
  onEditClick: () => void;
  onPhotoChange: (photoDataUrl: string) => void;
  onPhotoRemove: () => void;
}

export const CompanyProfileHeader: React.FC<CompanyProfileHeaderProps> = ({
  profile,
  onEditClick,
  onPhotoChange,
  onPhotoRemove,
}) => {
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        onPhotoChange(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-6 text-left">
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
        {/* Company Avatar / Circular Photo Container */}
        <div className="flex flex-col items-center space-y-2 shrink-0">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-blue-100 shadow-md bg-blue-600 text-white font-black text-3xl flex items-center justify-center">
            {profile.profilePhotoUrl ? (
              <img
                src={profile.profilePhotoUrl}
                alt={profile.companyName}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <span>{profile.companyName ? profile.companyName.slice(0, 2).toUpperCase() : 'CO'}</span>
            )}
          </div>

          <div className="flex items-center space-x-2 text-[11px] font-semibold pt-1">
            <label className="text-[#2563eb] hover:underline cursor-pointer">
              <span>Change Photo</span>
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
            {profile.profilePhotoUrl && (
              <>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={onPhotoRemove}
                  className="text-rose-600 hover:underline cursor-pointer"
                >
                  Remove
                </button>
              </>
            )}
          </div>
        </div>

        {/* Primary Meta */}
        <div className="text-center md:text-left space-y-1.5">
          <div className="flex items-center justify-center md:justify-start space-x-2 flex-wrap gap-y-1">
            <h2 className="text-2xl font-extrabold text-[#0f172a]">{profile.companyName}</h2>
            {profile.verificationStatus === 'Verified' && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Employer</span>
              </span>
            )}
          </div>

          <p className="text-xs text-[#64748b] font-medium">
            ID: {profile.companyId} • Founded in {profile.foundedYear}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
            <span className="inline-flex items-center space-x-1 text-xs font-semibold text-[#2563eb] bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 rounded-full">
              <Building2 className="w-3 h-3" />
              <span>{profile.industry}</span>
            </span>
            <span className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
              <MapPin className="w-3 h-3" />
              <span>{profile.headquarters}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={onEditClick}
        className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer shrink-0"
      >
        <Edit className="w-4 h-4" />
        <span>Edit Company Profile</span>
      </button>
    </div>
  );
};
