import React from 'react';
import { Video, ExternalLink, Play, BookOpen, CheckCircle, ArrowLeft } from 'lucide-react';

export interface SkillResource {
  id: string;
  title: string;
  type: 'Video' | 'Article' | 'Practice';
  platform: string;
  durationOrTime?: string;
  url: string;
  thumbnailUrl?: string;
}

export interface SkillResourceData {
  skillId: string;
  skillTitle: string;
  explanation: string;
  resources: SkillResource[];
}

interface SkillResourceViewProps {
  data: SkillResourceData;
  onBack: () => void;
}

export const SkillResourceView: React.FC<SkillResourceViewProps> = ({ data, onBack }) => {
  return (
    <div
      id="skill-resource-section"
      className="bg-white border border-[#e2e8f0] rounded-2xl p-5 sm:p-7 shadow-2xs space-y-6 text-left scroll-mt-24"
    >
      {/* Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563eb] border border-blue-200 text-xs font-bold">
              Skill Improvement Path
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f172a]">{data.skillTitle}</h2>
          <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed">{data.explanation}</p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-colors shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Skill Gap</span>
        </button>
      </div>

      {/* Resource Cards Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[#0f172a] uppercase tracking-wider text-[11px]">
          Recommended Learning Resources & Tutorials
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.resources.map((res) => (
            <div
              key={res.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3 hover:border-blue-300 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold ${res.type === 'Video'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : res.type === 'Article'
                          ? 'bg-blue-50 text-[#2563eb] border border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                  >
                    {res.type === 'Video' && <Video className="w-3 h-3 text-rose-600" />}
                    {res.type === 'Article' && <BookOpen className="w-3 h-3 text-[#2563eb]" />}
                    {res.type === 'Practice' && <CheckCircle className="w-3 h-3 text-emerald-600" />}
                    <span>{res.type}</span>
                  </span>

                  {res.durationOrTime && (
                    <span className="text-[11px] font-medium text-slate-400">
                      {res.durationOrTime}
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-[#0f172a] line-clamp-2 leading-snug">
                  {res.title}
                </h4>

                <p className="text-xs text-slate-500 font-medium">Platform: {res.platform}</p>
              </div>

              <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center space-x-2 px-3.5 py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors"
              >
                {res.type === 'Video' ? <Play className="w-3.5 h-3.5 fill-current" /> : <ExternalLink className="w-3.5 h-3.5" />}
                <span>{res.type === 'Video' ? 'Watch Video' : 'Start Learning'}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
