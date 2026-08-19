import React from 'react';
import { User, Mail, Phone, Calendar, MapPin, Shield } from 'lucide-react';
import type { StudentProfileData } from './ProfileHeader';

interface PersonalInfoProps {
  profile: StudentProfileData;
}

export const PersonalInfo: React.FC<PersonalInfoProps> = ({ profile }) => {
  const fields = [
    { label: 'Full Name', value: profile.name, icon: <User className="w-4 h-4 text-slate-400" /> },
    { label: 'Email Address', value: profile.email, icon: <Mail className="w-4 h-4 text-slate-400" /> },
    { label: 'Phone Number', value: profile.phone, icon: <Phone className="w-4 h-4 text-slate-400" /> },
    { label: 'Date of Birth', value: profile.dob, icon: <Calendar className="w-4 h-4 text-slate-400" /> },
    { label: 'Gender', value: profile.gender, icon: <Shield className="w-4 h-4 text-slate-400" /> },
    { label: 'City', value: profile.city, icon: <MapPin className="w-4 h-4 text-slate-400" /> },
  ];

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4 text-left">
      <h3 className="text-base font-bold text-[#0f172a]">Personal Information</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
