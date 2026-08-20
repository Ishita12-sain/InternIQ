import React from 'react';
import { Award, Plus, Calendar, Building, FileText, ExternalLink, ShieldCheck, Clock, ShieldAlert, Trash2, Edit2, Eye } from 'lucide-react';
import type { CertificationItem } from '../../types/studentProfile';

interface CertificationsSectionProps {
  certifications: CertificationItem[];
  onAddCertification: () => void;
  onEditCertification?: (cert: CertificationItem) => void;
  onDeleteCertification?: (id: string) => void;
}

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({
  certifications,
  onAddCertification,
  onEditCertification,
  onDeleteCertification,
}) => {

  const getStatusBadge = (status: CertificationItem['verificationStatus']) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>Verified</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
            <ShieldAlert className="w-3 h-3 text-rose-600" />
            <span>Rejected</span>
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200/80">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Pending Verification</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[#0f172a]">Certifications</h3>
          <p className="text-xs text-slate-500 mt-0.5">Verified credentials & uploaded proof documents.</p>
        </div>
        <button
          onClick={onAddCertification}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-[#2563eb] bg-blue-50 hover:bg-blue-100 border border-blue-200/60 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Certification</span>
        </button>
      </div>

      {certifications.length === 0 ? (
        <div className="p-6 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-2">
          <Award className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-xs font-medium text-slate-500">No certifications added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-3 transition-all hover:bg-white hover:border-blue-200 hover:shadow-2xs"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-[#2563eb] shrink-0 mt-0.5 border border-blue-100">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <h4 className="text-sm font-bold text-[#0f172a]">{cert.name}</h4>
                      {getStatusBadge(cert.verificationStatus)}
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-[#64748b] mt-1 flex-wrap gap-y-1">
                      <span className="flex items-center space-x-1">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-700">{cert.issuer}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Issued: {cert.issueDate || cert.year}</span>
                      </span>
                      {cert.credentialId && (
                        <>
                          <span>•</span>
                          <span className="text-slate-500 font-mono text-[11px]">ID: {cert.credentialId}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1 shrink-0">
                  {onEditCertification && (
                    <button
                      type="button"
                      onClick={() => onEditCertification(cert)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit Certification"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                  {onDeleteCertification && (
                    <button
                      type="button"
                      onClick={() => onDeleteCertification(cert.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Certification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Proof Document Preview Indicator & Actions */}
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  {cert.proofFile ? (
                    <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 text-[11px] font-medium">
                      {cert.proofFileType?.startsWith('image/') ? (
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <FileText className="w-3.5 h-3.5 text-rose-500" />
                      )}
                      <span className="truncate max-w-[180px] font-semibold">{cert.proofFileName || 'Certificate_Proof'}</span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">No proof uploaded</span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-600 hover:underline"
                    >
                      <span>Verify Credential</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {cert.proofFile && (
                    <button
                      type="button"
                      onClick={() => {
                        const win = window.open();
                        win?.document.write(`<iframe src="${cert.proofFile}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
                      }}
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold shadow-2xs transition-colors cursor-pointer"
                    >
                      View Certificate
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
