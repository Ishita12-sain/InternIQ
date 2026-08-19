import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CompanySidebar } from '../../components/company/CompanySidebar';
import { CompanyHeader } from '../../components/company/CompanyHeader';
import { ArrowLeft, Construction } from 'lucide-react';

interface CompanyPlaceholderPageProps {
  title: string;
  subtitle: string;
}

export const CompanyPlaceholderPage: React.FC<CompanyPlaceholderPageProps> = ({
  title,
  subtitle,
}) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-[#0f172a]">
      <CompanySidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <CompanyHeader onOpenSidebar={() => setIsSidebarOpen(true)} title={title} subtitle={subtitle} />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto pb-safe">
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-12 text-center space-y-4 shadow-2xs max-w-xl mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-[#2563eb] flex items-center justify-center mx-auto">
              <Construction className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-[#0f172a]">{title} Module</h2>
              <p className="text-xs text-[#64748b] leading-relaxed">{subtitle}</p>
            </div>
            <button
              onClick={() => navigate('/dashboard/company')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Company Dashboard</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};
