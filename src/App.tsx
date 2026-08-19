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
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminUsersOverviewPage } from './pages/admin/AdminUsersOverviewPage';
import { AdminUserDetailsPage } from './pages/admin/AdminUserDetailsPage';
import { AdminStudentsPage } from './pages/admin/AdminStudentsPage';
import { AdminStudentDetailsPage } from './pages/admin/AdminStudentDetailsPage';
import { AdminCompaniesPage } from './pages/admin/AdminCompaniesPage';
import { AdminCompanyDetailsPage } from './pages/admin/AdminCompanyDetailsPage';
import { AdminFacultyPage } from './pages/admin/AdminFacultyPage';
import { AdminFacultyDetailsPage } from './pages/admin/AdminFacultyDetailsPage';
import { AdminInternshipsPage } from './pages/admin/AdminInternshipsPage';
import { AdminInternshipDetailsPage } from './pages/admin/AdminInternshipDetailsPage';
import { AdminApplicationsPage } from './pages/admin/AdminApplicationsPage';
import { AdminApplicationDetailsPage } from './pages/admin/AdminApplicationDetailsPage';
import { AdminVerificationsPage } from './pages/admin/AdminVerificationsPage';
import { AdminVerificationDetailsPage } from './pages/admin/AdminVerificationDetailsPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminNotificationsPage } from './pages/admin/AdminNotificationsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage';
import { AdminAuditLogDetailsPage } from './pages/admin/AdminAuditLogDetailsPage';
import { TPDashboardPage } from './pages/tp/TPDashboardPage';
import { TPStudentsPage, TPStudentDetailsPage } from './pages/tp/TPStudentsPage';
import { TPCompaniesPage, TPCompanyDetailsPage } from './pages/tp/TPCompaniesPage';
import { TPInternshipsPage, TPInternshipDetailsPage } from './pages/tp/TPInternshipsPage';
import { TPApplicationsPage, TPApplicationDetailsPage } from './pages/tp/TPApplicationsPage';
import { TPInterviewsPage } from './pages/tp/TPInterviewsPage';
import { TPPlacementsPage, TPPlacementDetailsPage } from './pages/tp/TPPlacementsPage';
import { TPReportsPage } from './pages/tp/TPReportsPage';
import { TPProfilePage, TPSettingsPage } from './pages/tp/TPProfilePage';
import { NotificationProvider } from './context/NotificationContext';
import { SettingsProvider } from './context/SettingsContext';
import { AuditLogProvider } from './context/AuditLogContext';
import { AdminSelectedStudentsPage } from './pages/admin/AdminSelectedStudentsPage';
import { AdminOngoingInternshipsPage } from './pages/admin/AdminOngoingInternshipsPage';
import { DummyDashboardPage } from './pages/dashboard/DummyDashboardPage';

export const App: React.FC = () => {
  return (
    <SettingsProvider>
      <AuditLogProvider>
        <NotificationProvider>
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

          {/* Admin Dashboard & Feature Routes */}
          <Route path="/dashboard/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<AdminUsersOverviewPage />} />
          <Route path="/admin/users/:id" element={<AdminUserDetailsPage />} />
          <Route path="/admin/students" element={<AdminStudentsPage />} />
          <Route path="/admin/students/:id" element={<AdminStudentDetailsPage />} />
          <Route path="/admin/companies" element={<AdminCompaniesPage />} />
          <Route path="/admin/companies/:id" element={<AdminCompanyDetailsPage />} />
          <Route path="/admin/faculty" element={<AdminFacultyPage />} />
          <Route path="/admin/faculty/:id" element={<AdminFacultyDetailsPage />} />
          <Route path="/admin/internships" element={<AdminInternshipsPage />} />
          <Route path="/admin/internships/:id" element={<AdminInternshipDetailsPage />} />
          <Route path="/admin/applications" element={<AdminApplicationsPage />} />
          <Route path="/admin/applications/:id" element={<AdminApplicationDetailsPage />} />
          <Route path="/admin/verifications" element={<AdminVerificationsPage />} />
          <Route path="/admin/verifications/:id" element={<AdminVerificationDetailsPage />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
          <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
          <Route path="/admin/audit-logs" element={<AdminAuditLogsPage />} />
          <Route path="/admin/audit-logs/:id" element={<AdminAuditLogDetailsPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
          <Route path="/admin/selected-students" element={<AdminSelectedStudentsPage />} />
          <Route path="/admin/ongoing-internships" element={<AdminOngoingInternshipsPage />} />

          {/* T&P Officer Routes */}
          <Route path="/dashboard/tp" element={<TPDashboardPage />} />
          <Route path="/tp/dashboard" element={<TPDashboardPage />} />
          <Route path="/tp/students" element={<TPStudentsPage />} />
          <Route path="/tp/students/:id" element={<TPStudentDetailsPage />} />
          <Route path="/tp/companies" element={<TPCompaniesPage />} />
          <Route path="/tp/companies/:id" element={<TPCompanyDetailsPage />} />
          <Route path="/tp/internships" element={<TPInternshipsPage />} />
          <Route path="/tp/internships/:id" element={<TPInternshipDetailsPage />} />
          <Route path="/tp/applications" element={<TPApplicationsPage />} />
          <Route path="/tp/applications/:id" element={<TPApplicationDetailsPage />} />
          <Route path="/tp/interviews" element={<TPInterviewsPage />} />
          <Route path="/tp/placements" element={<TPPlacementsPage />} />
          <Route path="/tp/placements/:id" element={<TPPlacementDetailsPage />} />
          <Route path="/tp/reports" element={<TPReportsPage />} />
          <Route path="/tp/notifications" element={<AdminNotificationsPage />} />
          <Route path="/tp/profile" element={<TPProfilePage />} />
          <Route path="/tp/settings" element={<TPSettingsPage />} />

          {/* Scalable Placeholder Dashboard Routes for Other Roles */}
          <Route path="/dashboard/:role" element={<DummyDashboardPage />} />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </NotificationProvider>
  </AuditLogProvider>
</SettingsProvider>
  );
};

export default App;
