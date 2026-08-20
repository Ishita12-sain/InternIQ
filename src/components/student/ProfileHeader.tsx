import React, { useRef } from 'react';
import { Edit, Building, Award, Camera, Trash2 } from 'lucide-react';

export interface StudentProfileData {
  name: string;
  email: string;
  studentId: string;
  department: string;
  year: string;
  semester?: string | number;
  phone: string;
  dob: string;
  gender: string;
  city: string;
  college: string;
  cgpa: string;
  graduationYear: string;
  linkedinUrl?: string;
  photoUrl?: string;
}

interface ProfileHeaderProps {
  profile: StudentProfileData;
  onEditClick: () => void;
  onPhotoUpload: (photoUrl: string) => void;
  onPhotoRemove: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  onEditClick,
  onPhotoUpload,
  onPhotoRemove,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg') {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            onPhotoUpload(reader.result);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-6 text-left">
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
        {/* Large Avatar Container */}
        <div className="relative group shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#eff6ff] text-[#2563eb] border-4 border-blue-100 flex items-center justify-center text-2xl font-bold shrink-0 shadow-sm overflow-hidden">
            {profile.photoUrl ? (
              <img
                src={profile.photoUrl}
                alt={profile.name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span>{getInitials(profile.name)}</span>
            )}
          </div>

          {/* Camera Edit Badge */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#2563eb] hover:bg-blue-700 text-white flex items-center justify-center shadow-md cursor-pointer border-2 border-white transition-all transform hover:scale-110"
            title="Upload Profile Photo"
          >
            <Camera className="w-4 h-4" />
          </button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Student Primary Meta & Remove Photo CTA */}
        <div className="text-center md:text-left space-y-1.5">
          <h2 className="text-2xl font-extrabold text-[#0f172a]">{profile.name}</h2>
          <p className="text-xs text-[#64748b] font-medium">{profile.email} • ID: {profile.studentId}</p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
            <span className="inline-flex items-center space-x-1 text-xs font-semibold text-[#2563eb] bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 rounded-full">
              <Building className="w-3 h-3" />
              <span>{profile.department}</span>
            </span>
            <span className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
              <Award className="w-3 h-3" />
              <span>{profile.year}</span>
            </span>

            {profile.photoUrl && (
              <button
                type="button"
                onClick={onPhotoRemove}
                className="inline-flex items-center space-x-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full cursor-pointer transition-colors"
                title="Remove Photo"
              >
                <Trash2 className="w-3 h-3" />
                <span>Remove Photo</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onEditClick}
        className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer shrink-0"
      >
        <Edit className="w-4 h-4" />
        <span>Edit Profile</span>
      </button>
    </div>
  );
};
