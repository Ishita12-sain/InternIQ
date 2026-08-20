import React from 'react';
import { Plus, X } from 'lucide-react';

interface SkillsSectionProps {
  skills: string[];
  onAddSkill: () => void;
  onRemoveSkill?: (skill: string) => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills, onAddSkill, onRemoveSkill }) => {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4 text-left">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-[#0f172a]">Skills</h3>
        <button
          onClick={onAddSkill}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-[#2563eb] bg-blue-50 hover:bg-blue-100 border border-blue-200/60 px-2.5 py-1 rounded-xl transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Skill</span>
        </button>
      </div>

      {skills.length === 0 ? (
        <p className="text-xs text-slate-400 italic">No skills added yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2 pt-1">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#eff6ff] text-[#2563eb] border border-blue-200/60 shadow-2xs"
            >
              <span>{skill}</span>
              {onRemoveSkill && (
                <button
                  type="button"
                  onClick={() => onRemoveSkill(skill)}
                  className="hover:text-rose-600 transition-colors cursor-pointer"
                  title={`Remove ${skill}`}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
