import React, { useState } from 'react';
import { StudentSidebar } from '../../components/student/StudentSidebar';
import { DashboardHeader } from '../../components/student/DashboardHeader';
import { InternshipSelector } from '../../components/student/InternshipSelector';
import { TimelineStage } from '../../components/student/TimelineStage';
import type { StageData } from '../../components/student/TimelineStage';
import { StageDetails } from '../../components/student/StageDetails';
import { useApplication } from '../../context/ApplicationContext';

export const StudentTimelinePage: React.FC = () => {
  const { applications } = useApplication();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedInternshipId, setSelectedInternshipId] = useState<string>('');
  const [selectedStage, setSelectedStage] = useState<StageData | null>(null);

  // Map student applications from context to Timeline selector & stages
  const timelineInternships = React.useMemo(() => {
    return applications.map((app) => {
      const formattedDate = new Date(app.appliedAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

      const stages: StageData[] = [
        {
          id: `${app.id}-s1`,
          stageName: 'Applied',
          date: formattedDate,
          statusType: app.currentStage === 'Application Submitted' ? 'current' : 'completed',
          shortDescription: 'Application submitted successfully via InternIQ',
          detailedMessage: `Your application and resume details were received by ${app.companyName} University Recruiting.`,
          nextStep: 'Awaiting initial profile review by talent acquisition.',
          companyName: app.companyName,
          role: app.internshipTitle,
        },
        {
          id: `${app.id}-s2`,
          stageName: 'Under Review',
          date: app.status === 'Under Review' ? formattedDate : 'Pending',
          statusType: app.status === 'Under Review' ? 'current' : (app.status === 'Applied' ? 'upcoming' : 'completed'),
          shortDescription: 'Application is being reviewed by engineering team',
          detailedMessage: `${app.companyName} engineering managers are evaluating candidate skill benchmarks.`,
          nextStep: 'Shortlisting & interview scheduling.',
          companyName: app.companyName,
          role: app.internshipTitle,
        },
        {
          id: `${app.id}-s3`,
          stageName: 'Shortlisted',
          date: (app.status === 'Shortlisted' || app.status === 'Interview Scheduled') ? formattedDate : 'Pending',
          statusType: (app.status === 'Shortlisted' || app.status === 'Interview Scheduled') ? 'current' : (['Applied', 'Under Review'].includes(app.status) ? 'upcoming' : 'completed'),
          shortDescription: 'Candidate shortlisted for technical evaluation',
          detailedMessage: `Congratulations! High skill benchmark qualified you for interview rounds with ${app.companyName}.`,
          nextStep: 'Technical & behavioral discussion slot booking.',
          companyName: app.companyName,
          role: app.internshipTitle,
        },
        {
          id: `${app.id}-s4`,
          stageName: 'Selected',
          date: app.status === 'Selected' ? formattedDate : 'Pending',
          statusType: app.status === 'Selected' ? 'current' : 'upcoming',
          shortDescription: 'Final decision & official offer letter',
          detailedMessage: `Official internship offer letter extended by ${app.companyName}.`,
          nextStep: 'Complete digital logbook and joining compliance.',
          companyName: app.companyName,
          role: app.internshipTitle,
        },
      ];

      return {
        id: app.id,
        companyName: app.companyName,
        companyLogo: app.companyLogo,
        role: app.internshipTitle,
        currentStage: app.currentStage,
        matchScore: 92,
        stages,
      };
    });
  }, [applications]);

  // Set default selected internship if none explicitly set
  React.useEffect(() => {
    if (timelineInternships.length > 0 && (!selectedInternshipId || !timelineInternships.some(i => i.id === selectedInternshipId))) {
      setSelectedInternshipId(timelineInternships[0].id);
    }
  }, [timelineInternships, selectedInternshipId]);

  const currentInternship = timelineInternships.find((i) => i.id === selectedInternshipId) || timelineInternships[0];
  const activeStage = selectedStage || currentInternship?.stages.find((s) => s.statusType === 'current') || currentInternship?.stages[0];

  const handleStageClick = (stage: StageData) => {
    setSelectedStage(stage);
    const detailsElem = document.getElementById('stage-details-section');
    if (detailsElem) {
      detailsElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f8fafc] flex font-sans text-[#0f172a]">
      {/* Sidebar */}
      <StudentSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader onOpenSidebar={() => setIsSidebarOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto pb-safe">
          {/* Header */}
          <div className="text-left space-y-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f172a]">Internship Timeline</h1>
            <p className="text-xs sm:text-sm text-[#64748b]">
              Track your internship journey.
            </p>
          </div>

          {/* Internship Cards Selector */}
          <InternshipSelector
            internships={timelineInternships}
            selectedId={selectedInternshipId}
            onSelect={(id) => {
              setSelectedInternshipId(id);
              setSelectedStage(null);
              const timelineElem = document.getElementById('timeline-progress-section');
              if (timelineElem) {
                timelineElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
          />

          {/* Timeline Container */}
          <div
            id="timeline-progress-section"
            className="bg-white border border-[#e2e8f0] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-6 text-left scroll-mt-24"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-[#0f172a]">
                  {currentInternship.companyName} — {currentInternship.role}
                </h2>
                <p className="text-xs text-[#64748b]">Vertical Stage Progress</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-[#2563eb] border border-blue-200/60 text-xs font-bold">
                Current: {currentInternship.currentStage}
              </span>
            </div>

            {/* Stages Stack */}
            <div className="space-y-4">
              {currentInternship.stages.map((stg, index) => (
                <TimelineStage
                  key={stg.id}
                  stage={stg}
                  isLast={index === currentInternship.stages.length - 1}
                  isSelected={activeStage.id === stg.id}
                  onSelectStage={handleStageClick}
                />
              ))}
            </div>
          </div>

          {/* Stage Details Section */}
          <StageDetails stage={activeStage} />
        </main>
      </div>
    </div>
  );
};
