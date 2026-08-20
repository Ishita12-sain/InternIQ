import React, { useState } from 'react';
import { Video, ExternalLink, Play, BookOpen, CheckCircle, ArrowLeft, X } from 'lucide-react';

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

/**
 * Helper to extract YouTube video ID from various URL formats
 */
export const getYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[1] && match[1].length === 11 ? match[1] : null;
};

/**
 * Helper to convert any YouTube URL into a valid embed playback URL
 */
export const getYouTubeEmbedUrl = (url: string): string => {
  const videoId = getYouTubeVideoId(url);
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  }
  if (url.includes('youtube.com/embed/')) return url;
  return url;
};

export const SkillResourceView: React.FC<SkillResourceViewProps> = ({ data, onBack }) => {
  const [activeVideo, setActiveVideo] = useState<{
    title: string;
    url: string;
    platform: string;
  } | null>(null);

  const handleResourceClick = (res: SkillResource, e: React.MouseEvent) => {
    if (res.type === 'Video') {
      e.preventDefault();
      setActiveVideo({
        title: res.title,
        url: res.url,
        platform: res.platform,
      });
    }
  };

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
          {data.resources.map((res) => {
            const videoId = res.type === 'Video' ? getYouTubeVideoId(res.url) : null;
            const thumbnailUrl = res.thumbnailUrl || (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : undefined);

            return (
              <div
                key={res.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3 hover:border-blue-300 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                        res.type === 'Video'
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

                  {/* Optional Video Thumbnail with Play Overlay */}
                  {res.type === 'Video' && thumbnailUrl && (
                    <div
                      onClick={(e) => handleResourceClick(res, e)}
                      className="relative rounded-lg overflow-hidden border border-slate-200 aspect-video bg-slate-900 group cursor-pointer"
                      title="Click to play video"
                    >
                      <img
                        src={thumbnailUrl}
                        alt={res.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200 opacity-90 group-hover:opacity-100"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center group-hover:bg-slate-900/10 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>
                  )}

                  <h4 className="text-sm font-bold text-[#0f172a] line-clamp-2 leading-snug">
                    {res.title}
                  </h4>

                  <p className="text-xs text-slate-500 font-medium">Platform: {res.platform}</p>
                </div>

                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => handleResourceClick(res, e)}
                  className={`w-full inline-flex items-center justify-center space-x-2 px-3.5 py-2.5 rounded-xl text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer ${
                    res.type === 'Video' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-[#2563eb] hover:bg-blue-700'
                  }`}
                >
                  {res.type === 'Video' ? <Play className="w-3.5 h-3.5 fill-current" /> : <ExternalLink className="w-3.5 h-3.5" />}
                  <span>{res.type === 'Video' ? 'Watch Video' : 'Start Learning'}</span>
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* Video Player Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="space-y-0.5 text-left pr-4">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                  {activeVideo.platform}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-[#0f172a] line-clamp-1 mt-1">
                  {activeVideo.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
                title="Close Video"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player (Responsive 16:9) */}
            <div className="relative w-full aspect-video bg-black">
              <iframe
                src={getYouTubeEmbedUrl(activeVideo.url)}
                title={activeVideo.title}
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 hidden sm:inline-block">
                Playing tutorial inside InternIQ
              </span>
              <div className="flex items-center space-x-2 ml-auto">
                <a
                  href={activeVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open on YouTube</span>
                </a>
                <button
                  type="button"
                  onClick={() => setActiveVideo(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
