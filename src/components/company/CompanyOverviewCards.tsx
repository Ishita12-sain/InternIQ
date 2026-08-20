import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, UserCheck, Calendar, CheckCircle2 } from 'lucide-react';
import { SummaryCard } from '../student/SummaryCard';

interface CompanyOverviewCardsProps {
  activeCount: number;
  totalApplicants: number;
  shortlistedCount: number;
  interviewsCount: number;
  selectedCount: number;
}

export const CompanyOverviewCards: React.FC<CompanyOverviewCardsProps> = ({
  activeCount,
  totalApplicants,
  shortlistedCount,
  interviewsCount,
  selectedCount,
}) => {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Active Internships',
      value: String(activeCount),
      icon: <Briefcase className="w-5 h-5" />,
      accentText: 'Open',
      path: '/company/internships',
    },
    {
      title: 'Total Applicants',
      value: String(totalApplicants),
      icon: <Users className="w-5 h-5" />,
      accentText: 'Total',
      path: '/company/applicants',
    },
    {
      title: 'Shortlisted',
      value: String(shortlistedCount),
      icon: <UserCheck className="w-5 h-5" />,
      accentText: 'Candidates',
      path: '/company/shortlisted',
    },
    {
      title: 'Interviews',
      value: String(interviewsCount),
      icon: <Calendar className="w-5 h-5" />,
      accentText: 'Scheduled',
      path: '/company/interviews',
    },
    {
      title: 'Selected Candidates',
      value: String(selectedCount),
      icon: <CheckCircle2 className="w-5 h-5" />,
      accentText: 'Hired',
      path: '/company/applicants',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((c) => (
        <div
          key={c.title}
          onClick={() => navigate(c.path)}
          className="cursor-pointer group transform hover:-translate-y-0.5 transition-all duration-150"
        >
          <SummaryCard
            title={c.title}
            value={c.value}
            icon={c.icon}
            accentText={c.accentText}
          />
        </div>
      ))}
    </div>
  );
};
