import React from 'react';
import { Edit, Building, Award } from 'lucide-react';

export interface StudentProfileData {
  name: string;
  email: string;
  studentId: string;
  department: string;
  year: string;
  phone: string;
  dob: string;
  gender: string;
  city: string;
  college: string;
  cgpa: string;
  graduationYear: string;
}

interface ProfileHeaderProps {
  profile: StudentProfileData;
  onEditClick: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, onEditClick }) => {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-6 text-left">
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
        {/* Large Avatar */}
        <div className="w-20 h-20 rounded-full bg-[#eff6ff] text-[#2563eb] border-2 border-blue-200 flex items-center justify-center text-2xl font-bold shrink-0 shadow-2xs">
          AS
        </div>

        {/* Student Primary Meta */}
        <div className="text-center md:text-left space-y-1">
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
