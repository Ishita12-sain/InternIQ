import React from 'react';
import { Building2, BookOpen, GraduationCap, Award, Calendar } from 'lucide-react';
import type { StudentProfileData } from './ProfileHeader';

interface AcademicInfoProps {
  profile: StudentProfileData;
}

export const AcademicInfo: React.FC<AcademicInfoProps> = ({ profile }) => {
  const displayYearOrSemester = () => {
    if (profile.semester) {
      return typeof profile.semester === 'number' || !isNaN(Number(profile.semester))
        ? `Semester ${profile.semester}`
        : profile.semester;
    }
    if (profile.year) {
      return profile.year;
    }
    return 'Not provided';
  };

  const fields = [
    { label: 'College', value: profile.college || 'Not provided', icon: <Building2 className="w-4 h-4 text-slate-400" /> },
    { label: 'Department', value: profile.department || 'Not provided', icon: <BookOpen className="w-4 h-4 text-slate-400" /> },
    { label: 'Year / Semester', value: displayYearOrSemester(), icon: <GraduationCap className="w-4 h-4 text-slate-400" /> },
    { label: 'CGPA', value: profile.cgpa || 'Not provided', icon: <Award className="w-4 h-4 text-slate-400" /> },
    { label: 'Graduation Year', value: profile.graduationYear || 'Not provided', icon: <Calendar className="w-4 h-4 text-slate-400" /> },
  ];

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4 text-left">
      <h3 className="text-base font-bold text-[#0f172a]">Academic Information</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {fields.map((field) => (
          <div key={field.label} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
            <div className="flex items-center space-x-2 text-xs text-[#64748b] font-medium">
              {field.icon}
              <span>{field.label}</span>
            </div>
            <p className="text-sm font-semibold text-[#0f172a] pl-6">{field.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
