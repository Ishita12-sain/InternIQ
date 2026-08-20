import React, { useState, useEffect } from 'react';

export interface ReadinessScoreProps {
  score: number;
}

export const ReadinessScore: React.FC<ReadinessScoreProps> = ({ score }) => {
  // Clamped score safely between 0 and 100
  const clampedScore = Math.min(100, Math.max(0, score));

  const [animatedScore, setAnimatedScore] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Smooth score ring animation on mount / prop update
  useEffect(() => {
    let start = 0;
    const end = clampedScore;
    const duration = 800; // ms
    const stepTime = 16;
    const increment = end / (duration / stepTime);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimatedScore(end);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [clampedScore]);

  // Dynamic Status Label
  const getStatusLabel = (val: number) => {
    if (val >= 100) return 'Internship Ready 🎉';
    if (val >= 90) return 'Almost Ready';
    if (val >= 75) return 'Good Progress';
    if (val >= 60) return 'Developing';
    if (val >= 40) return 'Getting Started';
    return 'Needs Improvement';
  };

  const statusText = getStatusLabel(clampedScore);

  // Next Milestone Calculation
  let nextMilestone = 85;
  if (clampedScore >= 85 && clampedScore < 90) nextMilestone = 90;
  if (clampedScore >= 90 && clampedScore < 100) nextMilestone = 100;
  if (clampedScore >= 100) nextMilestone = 100;

  const pointsToGo = Math.max(0, nextMilestone - clampedScore);

  // SVG ring parameters (Radius = 42, Perimeter ≈ 263.89)
  const radius = 42;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * animatedScore) / 100;

  return (
    <div className="flex flex-col items-center justify-center space-y-2 relative">
      {/* Circle Progress Container */}
      <div
        className="relative w-36 h-36 flex items-center justify-center cursor-pointer transition-transform duration-300 ease-out"
        style={{ transform: isHovered ? 'scale(1.03)' : 'scale(1)' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Soft Glow Filter Definition */}
          <defs>
            <filter id="blue-ring-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#2563eb" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* Background Light Gray Track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="text-slate-100 stroke-current"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Active Blue Progress Stroke */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="text-[#2563eb] stroke-current transition-all duration-700 ease-out"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            filter="url(#blue-ring-glow)"
          />
        </svg>

        {/* Center Text Container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
          {clampedScore >= 100 ? (
            <div className="space-y-0.5 animate-in fade-in duration-300">
              <span className="text-3xl font-black text-[#0f172a] leading-none">100</span>
              <span className="text-[11px] font-extrabold text-emerald-600 tracking-tight block">
                Internship Ready 🎉
              </span>
            </div>
          ) : (
            <div className="space-y-0.5">
              <span className="text-3xl font-black text-[#0f172a] leading-none tracking-tight">
                {animatedScore}
              </span>
              <span className="text-xs font-semibold text-slate-400 block">
                out of 100
              </span>
              <span className="text-[10px] font-bold text-[#2563eb] bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-0.5 border border-blue-100">
                {statusText}
              </span>
            </div>
          )}
        </div>

        {/* Subtle Hover Tooltip Overlay */}
        {isHovered && (
          <div className="absolute -top-12 z-20 bg-[#0f172a] text-white p-2.5 rounded-xl shadow-xl border border-slate-700 text-center animate-in fade-in duration-150 shrink-0 pointer-events-none">
            <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Internship Readiness</p>
            <p className="text-xs font-extrabold text-white">{statusText}</p>
            {clampedScore < 100 && (
              <p className="text-[10px] text-blue-300 font-semibold">{100 - clampedScore} points to go</p>
            )}
          </div>
        )}
      </div>

      {/* Progress Markers below circle */}
      <div className="flex items-center justify-between w-32 px-1 text-[10px] font-bold text-slate-400 border-t border-slate-100 pt-1.5">
        <span className={clampedScore >= 25 ? 'text-blue-600 font-black' : ''}>25</span>
        <span className={clampedScore >= 50 ? 'text-blue-600 font-black' : ''}>50</span>
        <span className={clampedScore >= 75 ? 'text-blue-600 font-black' : ''}>75</span>
        <span className={clampedScore >= 100 ? 'text-emerald-600 font-black' : ''}>100</span>
      </div>

      {/* Milestone Indicator */}
      {clampedScore < 100 && (
        <div className="text-[11px] font-semibold text-slate-600 bg-slate-50 border border-slate-200/80 px-3 py-1 rounded-full text-center">
          Next milestone: <strong className="text-blue-600 font-extrabold">{nextMilestone}</strong> ({pointsToGo} points to go)
        </div>
      )}
    </div>
  );
};
