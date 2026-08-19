import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { StudentRegistrationPage } from './pages/auth/StudentRegistration';
import { RoleRegistrationPlaceholderPage } from './pages/auth/RoleRegistrationPlaceholderPage';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentProfile } from './pages/student/StudentProfile';
import { StudentReadiness } from './pages/student/StudentReadiness';
import { StudentSkillGap } from './pages/student/StudentSkillGap';
import { StudentRecommendedInternships } from './pages/student/StudentRecommendedInternships';
import { StudentInternshipSearch } from './pages/student/StudentInternshipSearch';
import { StudentApplications } from './pages/student/StudentApplications';
import { StudentTimelinePage } from './pages/student/StudentTimelinePage';
import { StudentDocuments } from './pages/student/StudentDocuments';
import { StudentLogbook } from './pages/student/StudentLogbook';
import { StudentNotifications } from './pages/student/StudentNotifications';
import { CompanyDashboard } from './pages/company/CompanyDashboard';
import { CompanyManageInternshipsPage } from './pages/company/CompanyManageInternshipsPage';
import { CompanyInternshipDetailsPage } from './pages/company/CompanyInternshipDetailsPage';
import { PostInternshipPage } from './pages/company/PostInternshipPage';
import { CompanyApplicantsPage } from './pages/company/CompanyApplicantsPage';
import { CompanyShortlistedPage } from './pages/company/CompanyShortlistedPage';
import { CompanyInterviewsPage } from './pages/company/CompanyInterviewsPage';
import { CompanyProfilePage } from './pages/company/CompanyProfilePage';
import { CompanyNotificationsPage } from './pages/company/CompanyNotificationsPage';
import { CompanySmartMatchingPage } from './pages/company/CompanySmartMatchingPage';
import { CompanyVerificationPage } from './pages/company/CompanyVerificationPage';
import { CompanyAnalyticsPage } from './pages/company/CompanyAnalyticsPage';
import { DummyDashboardPage } from './pages/dashboard/DummyDashboardPage';

export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Redirect root URL / to /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Login Page Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Register Role Selector Route */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Role Specific Registration Routes */}
        <Route path="/register/student" element={<StudentRegistrationPage />} />
        <Route path="/register/:role" element={<RoleRegistrationPlaceholderPage />} />

        {/* Student Dashboard Route */}
        <Route path="/dashboard/student" element={<StudentDashboard />} />

        {/* Student Profile Route */}
        <Route path="/student/profile" element={<StudentProfile />} />

        {/* Student Readiness Score Route */}
        <Route path="/student/readiness" element={<StudentReadiness />} />

        {/* Student Skill Gap Route */}
        <Route path="/student/skill-gap" element={<StudentSkillGap />} />

        {/* Student Recommended Internships Route */}
        <Route path="/student/recommended-internships" element={<StudentRecommendedInternships />} />

        {/* Student Internship Search Route */}
        <Route path="/student/internship-search" element={<StudentInternshipSearch />} />

        {/* Student Applications Route */}
        <Route path="/student/applications" element={<StudentApplications />} />

        {/* Student Internship Timeline Route */}
        <Route path="/student/timeline" element={<StudentTimelinePage />} />

        {/* Student Documents Route */}
        <Route path="/student/documents" element={<StudentDocuments />} />

        {/* Student Digital Logbook Route */}
        <Route path="/student/logbook" element={<StudentLogbook />} />

        {/* Student Notifications Route */}
        <Route path="/student/notifications" element={<StudentNotifications />} />

        {/* Company Dashboard & Features Routes */}
        <Route path="/dashboard/company" element={<CompanyDashboard />} />
        <Route path="/company/dashboard" element={<CompanyDashboard />} />
        <Route path="/company/analytics" element={<CompanyAnalyticsPage />} />
        <Route path="/company/internships" element={<CompanyManageInternshipsPage />} />
        <Route path="/company/internships/new" element={<PostInternshipPage />} />
        <Route path="/company/internships/:internshipId" element={<CompanyInternshipDetailsPage />} />
        <Route path="/company/internships/:internshipId/applicants" element={<CompanyApplicantsPage />} />
        <Route path="/company/post-internship" element={<PostInternshipPage />} />
        <Route path="/company/applicants" element={<CompanyApplicantsPage />} />
        <Route path="/company/shortlisted" element={<CompanyShortlistedPage />} />
        <Route path="/company/interviews" element={<CompanyInterviewsPage />} />
        <Route path="/company/smart-matching" element={<CompanySmartMatchingPage />} />
        <Route path="/company/profile" element={<CompanyProfilePage />} />
        <Route path="/company/verification" element={<CompanyVerificationPage />} />
        <Route path="/company/notifications" element={<CompanyNotificationsPage />} />

        {/* Scalable Placeholder Dashboard Routes for Other Roles */}
        <Route path="/dashboard/:role" element={<DummyDashboardPage />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
