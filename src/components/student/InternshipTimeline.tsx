import React from 'react';
import { CheckCircle2, CircleDot } from 'lucide-react';

export const InternshipTimeline: React.FC = () => {
  const steps = [
    { title: 'Application Submitted', date: 'Aug 10', completed: true },
    { title: 'Shortlisted', date: 'Aug 12', completed: true },
    { title: 'Interview Cleared', date: 'Aug 15', completed: true },
    { title: 'Offer Received', date: 'Aug 17', completed: true },
    { title: 'Internship Started', date: 'In Progress', completed: false, current: true },
  ];

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-[#0f172a]">Internship Timeline</h3>
        <span className="text-xs font-semibold text-[#2563eb]">TechNova Solutions</span>
      </div>

      {/* Desktop Horizontal Timeline */}
      <div className="hidden md:flex items-center justify-between relative py-4">
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-200 -translate-y-1.5 z-0" />

        {steps.map((step, idx) => (
          <div key={idx} className="relative z-10 flex flex-col items-center text-center space-y-1 px-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                step.completed
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : step.current
                  ? 'bg-white border-blue-600 text-blue-600 ring-4 ring-blue-100'
                  : 'bg-white border-slate-300 text-slate-300'
              }`}
            >
              {step.completed ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <CircleDot className="w-4 h-4" />
              )}
            </div>
            <span className="text-xs font-bold text-[#0f172a] max-w-[100px] leading-tight">
              {step.title}
            </span>
            <span className="text-[10px] font-medium text-slate-400">{step.date}</span>
          </div>
        ))}
      </div>

      {/* Mobile Vertical Timeline */}
      <div className="md:hidden space-y-3 pt-2">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-start space-x-3 text-left">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center border-2 shrink-0 mt-0.5 ${
                step.completed
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : step.current
                  ? 'bg-white border-blue-600 text-blue-600 ring-2 ring-blue-100'
                  : 'bg-white border-slate-300 text-slate-300'
              }`}
            >
              {step.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <CircleDot className="w-3.5 h-3.5" />}
            </div>
            <div>
              <p className="text-xs font-bold text-[#0f172a]">{step.title}</p>
              <p className="text-[10px] text-slate-400">{step.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
