import React from 'react';
import type { RoleType } from '../../types/auth';
import { ROLE_OPTIONS } from '../../config/roles';
import { GraduationCap, Building2, UserRound, BriefcaseBusiness, ShieldCheck } from 'lucide-react';

interface RoleSelectorProps {
  selectedRole: RoleType;
  onSelectRole: (role: RoleType) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  GraduationCap: <GraduationCap className="w-6 h-6 shrink-0 stroke-[1.75]" />,
  Building2: <Building2 className="w-6 h-6 shrink-0 stroke-[1.75]" />,
  UserCheck: <UserRound className="w-6 h-6 shrink-0 stroke-[1.75]" />,
  Briefcase: <BriefcaseBusiness className="w-6 h-6 shrink-0 stroke-[1.75]" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6 shrink-0 stroke-[1.75]" />,
};

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onSelectRole,
}) => {
  return (
    <div className="w-full space-y-2">
      <label className="block text-xs font-semibold text-[#0f172a] text-left">
        Select Your Role
      </label>

      {/* 5-column grid on desktop, compact grid on mobile */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 sm:gap-2.5">
        {ROLE_OPTIONS.map((role) => {
          const isSelected = selectedRole === role.id;
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onSelectRole(role.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all duration-200 cursor-pointer focus:outline-none h-[92px] w-full ${
                isSelected
                  ? 'bg-[#eff6ff] border-2 border-[#2563eb] text-[#2563eb] shadow-xs'
                  : 'bg-white border-[#e2e8f0] text-[#64748b] hover:border-blue-300 hover:bg-[#f8fafc] hover:text-[#2563eb] shadow-2xs hover:shadow-xs'
              }`}
            >
              <div className={`mb-2 transition-colors duration-200 ${isSelected ? 'text-[#2563eb]' : 'text-[#64748b]'}`}>
                {ICON_MAP[role.iconName]}
              </div>

              <span className={`text-[12px] tracking-tight whitespace-nowrap overflow-visible ${isSelected ? 'text-[#2563eb] font-semibold' : 'text-[#0f172a] font-medium'}`}>
                {role.shortLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
