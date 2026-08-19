import React, { useState } from 'react';
import { StudentSidebar } from '../../components/student/StudentSidebar';
import { DashboardHeader } from '../../components/student/DashboardHeader';
import { InternshipSelector } from '../../components/student/InternshipSelector';
import type { InternshipSelectorItem } from '../../components/student/InternshipSelector';
import { TimelineStage } from '../../components/student/TimelineStage';
import type { StageData } from '../../components/student/TimelineStage';
import { StageDetails } from '../../components/student/StageDetails';

export const StudentTimelinePage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedInternshipId, setSelectedInternshipId] = useState('goog-1');
  const [selectedStage, setSelectedStage] = useState<StageData | null>(null);

  // 3 Realistic Mock Internships with Complete Timelines
  const mockInternships: (InternshipSelectorItem & { stages: StageData[] })[] = [
    {
      id: 'goog-1',
      companyName: 'Google',
      companyLogo: 'GO',
      role: 'Software Engineering Intern',
      currentStage: 'Interview',
      matchScore: 95,
      stages: [
        {
          id: 'goog-s1',
          stageName: 'Applied',
          date: '12 Aug 2026',
          statusType: 'completed',
          shortDescription: 'Application submitted successfully via InternIQ',
          detailedMessage: 'Your resume and application details were received by Google University Recruiting.',
          nextStep: 'Awaiting initial profile review.',
          companyName: 'Google',
          role: 'Software Engineering Intern',
        },
        {
          id: 'goog-s2',
          stageName: 'Under Review',
          date: '14 Aug 2026',
          statusType: 'completed',
          shortDescription: 'Application is being reviewed by engineering team',
          detailedMessage: 'Google engineering managers evaluated your profile and skill benchmarks.',
          nextStep: 'Preparation for online coding assessment.',
          companyName: 'Google',
          role: 'Software Engineering Intern',
        },
        {
          id: 'goog-s3',
          stageName: 'Shortlisted',
          date: '16 Aug 2026',
          statusType: 'completed',
          shortDescription: 'You have been shortlisted for interview rounds',
          detailedMessage: 'Congratulations! Your score in the coding assessment qualified you for interview rounds.',
          nextStep: 'Schedule technical interview slots with recruiters.',
          companyName: 'Google',
          role: 'Software Engineering Intern',
        },
        {
          id: 'goog-s4',
          stageName: 'Interview',
          date: '20 Aug 2026',
          statusType: 'current',
          shortDescription: 'Technical & Data Structures interview scheduled',
          detailedMessage: 'Your 45-minute virtual technical interview is scheduled with a Senior Staff Engineer.',
          nextStep: 'Review Data Structures, Algorithms, and System Design fundamentals.',
          companyName: 'Google',
          role: 'Software Engineering Intern',
        },
        {
          id: 'goog-s5',
          stageName: 'Selected',
          date: 'Pending',
          statusType: 'upcoming',
          shortDescription: 'Final decision after interview evaluation',
          detailedMessage: 'Final hiring committee review will occur post-interview evaluation.',
          nextStep: 'Complete technical interview first.',
          companyName: 'Google',
          role: 'Software Engineering Intern',
        },
      ],
    },
    {
      id: 'msft-2',
      companyName: 'Microsoft',
      companyLogo: 'MS',
      role: 'Frontend Development Intern',
      currentStage: 'Under Review',
      matchScore: 88,
      stages: [
        {
          id: 'msft-s1',
          stageName: 'Applied',
          date: '10 Aug 2026',
          statusType: 'completed',
          shortDescription: 'Application submitted successfully',
          detailedMessage: 'Your profile was submitted for Microsoft Azure Experience Internships.',
          nextStep: 'Automated document processing.',
          companyName: 'Microsoft',
          role: 'Frontend Development Intern',
        },
        {
          id: 'msft-s2',
          stageName: 'Under Review',
          date: '15 Aug 2026',
          statusType: 'current',
          shortDescription: 'Profile under active recruiter evaluation',
          detailedMessage: 'Microsoft Talent Acquisition is reviewing your React and TypeScript portfolio projects.',
          nextStep: 'Keep an eye on email notifications for interview updates.',
          companyName: 'Microsoft',
          role: 'Frontend Development Intern',
        },
        {
          id: 'msft-s3',
          stageName: 'Shortlisted',
          date: 'Pending',
          statusType: 'upcoming',
          shortDescription: 'Potential candidate shortlisting',
          detailedMessage: 'Candidates will be shortlisted following recruiter verification.',
          nextStep: 'Await review results.',
          companyName: 'Microsoft',
          role: 'Frontend Development Intern',
        },
        {
          id: 'msft-s4',
          stageName: 'Interview',
          date: 'Pending',
          statusType: 'upcoming',
          shortDescription: 'Round 1 Technical Screening',
          detailedMessage: 'Interview details will be generated if shortlisted.',
          companyName: 'Microsoft',
          role: 'Frontend Development Intern',
        },
        {
          id: 'msft-s5',
          stageName: 'Selected',
          date: 'Pending',
          statusType: 'upcoming',
          shortDescription: 'Offer letter rollout',
          detailedMessage: 'Final selection decision pending evaluation.',
          companyName: 'Microsoft',
          role: 'Frontend Development Intern',
        },
      ],
    },
    {
      id: 'infy-3',
      companyName: 'Infosys',
      companyLogo: 'INF',
      role: 'Web Development Intern',
      currentStage: 'Selected',
      matchScore: 92,
      stages: [
        {
          id: 'infy-s1',
          stageName: 'Applied',
          date: '01 Aug 2026',
          statusType: 'completed',
          shortDescription: 'Application registered on InternIQ portal',
          detailedMessage: 'Applied for Infosys InStep Global Internship program.',
          companyName: 'Infosys',
          role: 'Web Development Intern',
        },
        {
          id: 'infy-s2',
          stageName: 'Under Review',
          date: '03 Aug 2026',
          statusType: 'completed',
          shortDescription: 'Resume verified by campus relations',
          detailedMessage: 'Verified academic GPA and core development skills.',
          companyName: 'Infosys',
          role: 'Web Development Intern',
        },
        {
          id: 'infy-s3',
          stageName: 'Shortlisted',
          date: '05 Aug 2026',
          statusType: 'completed',
          shortDescription: 'Shortlisted for direct interview',
          detailedMessage: 'High skill match qualified you directly for technical discussion.',
          companyName: 'Infosys',
          role: 'Web Development Intern',
        },
        {
          id: 'infy-s4',
          stageName: 'Interview',
          date: '08 Aug 2026',
          statusType: 'completed',
          shortDescription: 'Technical & HR interview completed',
          detailedMessage: 'Successfully cleared web technologies discussion with Lead Architect.',
          companyName: 'Infosys',
          role: 'Web Development Intern',
        },
        {
          id: 'infy-s5',
          stageName: 'Selected',
          date: '11 Aug 2026',
          statusType: 'current',
          shortDescription: 'Offer extended — Internship Accepted',
          detailedMessage: 'Congratulations! Official internship offer letter dispatched to your email.',
          nextStep: 'Submit Digital Logbook and onboarding compliance documents.',
          companyName: 'Infosys',
          role: 'Web Development Intern',
        },
      ],
    },
  ];

  const currentInternship = mockInternships.find((i) => i.id === selectedInternshipId) || mockInternships[0];
  const activeStage = selectedStage || currentInternship.stages.find((s) => s.statusType === 'current') || currentInternship.stages[0];

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
            internships={mockInternships}
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
