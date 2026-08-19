import React from 'react';
import { User, Mail, Phone, Calendar, MapPin, Shield, ExternalLink, QrCode } from 'lucide-react';
import type { StudentProfileData } from './ProfileHeader';

interface PersonalInfoProps {
  profile: StudentProfileData;
}

export const PersonalInfo: React.FC<PersonalInfoProps> = ({ profile }) => {
  const linkedinUrl = profile.linkedinUrl || 'https://www.linkedin.com/in/aarav-sharma';

  // Generate dynamic QR Code matrix URL using QuickChart QR API
  const qrApiUrl = `https://quickchart.io/qr?text=${encodeURIComponent(linkedinUrl)}&size=160&margin=1`;

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-6 text-left">
      <h3 className="text-base font-bold text-[#0f172a]">Personal & Contact Information</h3>

      {/* Main Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
          <div className="flex items-center space-x-2 text-xs text-[#64748b] font-medium">
            <User className="w-4 h-4 text-slate-400" />
            <span>Full Name</span>
          </div>
          <p className="text-sm font-semibold text-[#0f172a] pl-6">{profile.name}</p>
        </div>

        {/* Email Address (Clickable mailto) */}
        <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
          <div className="flex items-center space-x-2 text-xs text-[#64748b] font-medium">
            <Mail className="w-4 h-4 text-[#2563eb]" />
            <span>Email Address</span>
          </div>
          <a
            href={`mailto:${profile.email}`}
            className="text-sm font-semibold text-[#2563eb] hover:underline pl-6 block truncate"
            title={profile.email}
          >
            {profile.email}
          </a>
        </div>

        {/* Phone Number */}
        <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
          <div className="flex items-center space-x-2 text-xs text-[#64748b] font-medium">
            <Phone className="w-4 h-4 text-slate-400" />
            <span>Phone Number</span>
          </div>
          <p className="text-sm font-semibold text-[#0f172a] pl-6">{profile.phone}</p>
        </div>

        {/* Date of Birth */}
        <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
          <div className="flex items-center space-x-2 text-xs text-[#64748b] font-medium">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Date of Birth</span>
          </div>
          <p className="text-sm font-semibold text-[#0f172a] pl-6">{profile.dob}</p>
        </div>

        {/* Gender */}
        <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
          <div className="flex items-center space-x-2 text-xs text-[#64748b] font-medium">
            <Shield className="w-4 h-4 text-slate-400" />
            <span>Gender</span>
          </div>
          <p className="text-sm font-semibold text-[#0f172a] pl-6">{profile.gender}</p>
        </div>

        {/* City */}
        <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
          <div className="flex items-center space-x-2 text-xs text-[#64748b] font-medium">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span>City</span>
          </div>
          <p className="text-sm font-semibold text-[#0f172a] pl-6">{profile.city}</p>
        </div>
      </div>

      {/* Professional Social & LinkedIn Section */}
      <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* LinkedIn Link Column */}
        <div className="space-y-1.5 min-w-0 flex-1 w-full text-left">
          <div className="flex items-center space-x-2 text-xs text-[#0077b5] font-extrabold">
            <svg className="w-4 h-4 fill-current text-[#0077b5]" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
            <span>LinkedIn Profile</span>
          </div>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-[#0077b5] hover:underline inline-flex items-center space-x-1.5 max-w-full break-all sm:break-normal"
          >
            <span className="truncate">{linkedinUrl}</span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          </a>
        </div>

        {/* LinkedIn Dynamic QR Code Badge */}
        <div className="flex flex-col items-center space-y-1 bg-white p-2.5 rounded-xl border border-slate-200 shrink-0 shadow-2xs">
          <img
            src={qrApiUrl}
            alt="LinkedIn Profile QR Code"
            className="w-24 h-24 rounded-lg object-contain"
          />
          <span className="text-[10px] font-bold text-slate-500 text-center flex items-center space-x-1">
            <QrCode className="w-3 h-3 text-[#2563eb]" />
            <span>Scan to view profile</span>
          </span>
        </div>
      </div>
    </div>
  );
};
