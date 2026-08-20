import React from 'react';
import { Award, Plus, Calendar, Building } from 'lucide-react';

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

interface CertificationsSectionProps {
  certifications: CertificationItem[];
  onAddCertification: () => void;
}

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({
  certifications,
  onAddCertification,
}) => {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4 text-left">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-[#0f172a]">Certifications</h3>
        <button
          onClick={onAddCertification}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-[#2563eb] bg-blue-50 hover:bg-blue-100 border border-blue-200/60 px-2.5 py-1 rounded-xl transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Certification</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {certifications.map((cert) => (
          <div
            key={cert.id}
            className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-1.5 flex items-start space-x-3"
          >
            <div className="p-2 rounded-lg bg-blue-50 text-[#2563eb] shrink-0 mt-0.5">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#0f172a]">{cert.name}</h4>
              <div className="flex items-center space-x-3 text-[11px] text-[#64748b] mt-0.5">
                <span className="flex items-center space-x-1">
                  <Building className="w-3 h-3 text-slate-400" />
                  <span>{cert.issuer}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>{cert.year}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
