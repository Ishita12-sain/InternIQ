import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { StudentRegistrationPage } from './pages/auth/StudentRegistration';
import { RoleRegistrationPlaceholderPage } from './pages/auth/RoleRegistrationPlaceholderPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
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
import { FacultyDashboardPage, FacultyStudentsPage, FacultyStudentDetailsPage } from './pages/faculty/FacultyDashboardPage';
import { FacultyInternshipsPage, FacultyInternshipDetailsPage, FacultyApplicationsPage, FacultyApplicationDetailsPage } from './pages/faculty/FacultyInternshipsPage';
import { FacultyReportsPage, FacultyProfilePage, FacultySettingsPage } from './pages/faculty/FacultyReportsPage';
import { FacultyNotificationsPage } from './pages/faculty/FacultyNotificationsPage';
import { FacultySecuritySettingsPage } from './pages/faculty/FacultySecuritySettingsPage';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { SettingsProvider } from './context/SettingsContext';
import { AuditLogProvider } from './context/AuditLogContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminSelectedStudentsPage } from './pages/admin/AdminSelectedStudentsPage';
import { AdminOngoingInternshipsPage } from './pages/admin/AdminOngoingInternshipsPage';
import { DummyDashboardPage } from './pages/dashboard/DummyDashboardPage';

import { ApplicationProvider } from './context/ApplicationContext';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <SettingsProvider>
        <AuditLogProvider>
          <NotificationProvider>
            <ApplicationProvider>
              <Router>
              <Routes>
                {/* Public Auth Routes */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                {/* Public Registration Routes */}
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/register/student" element={<StudentRegistrationPage />} />
                <Route path="/register/:role" element={<RoleRegistrationPlaceholderPage />} />

                {/* Student Protected Routes */}
                <Route path="/dashboard/student" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
                <Route path="/student/profile" element={<ProtectedRoute allowedRoles={['student']}><StudentProfile /></ProtectedRoute>} />
                <Route path="/student/readiness" element={<ProtectedRoute allowedRoles={['student']}><StudentReadiness /></ProtectedRoute>} />
                <Route path="/student/skill-gap" element={<ProtectedRoute allowedRoles={['student']}><StudentSkillGap /></ProtectedRoute>} />
                <Route path="/student/recommended-internships" element={<ProtectedRoute allowedRoles={['student']}><StudentRecommendedInternships /></ProtectedRoute>} />
                <Route path="/student/internship-search" element={<ProtectedRoute allowedRoles={['student']}><StudentInternshipSearch /></ProtectedRoute>} />
                <Route path="/student/applications" element={<ProtectedRoute allowedRoles={['student']}><StudentApplications /></ProtectedRoute>} />
                <Route path="/student/timeline" element={<ProtectedRoute allowedRoles={['student']}><StudentTimelinePage /></ProtectedRoute>} />
                <Route path="/student/documents" element={<ProtectedRoute allowedRoles={['student']}><StudentDocuments /></ProtectedRoute>} />
                <Route path="/student/logbook" element={<ProtectedRoute allowedRoles={['student']}><StudentLogbook /></ProtectedRoute>} />
                <Route path="/student/notifications" element={<ProtectedRoute allowedRoles={['student']}><StudentNotifications /></ProtectedRoute>} />

                {/* Company Protected Routes */}
                <Route path="/dashboard/company" element={<ProtectedRoute allowedRoles={['company']}><CompanyDashboard /></ProtectedRoute>} />
                <Route path="/company/dashboard" element={<ProtectedRoute allowedRoles={['company']}><CompanyDashboard /></ProtectedRoute>} />
                <Route path="/company/analytics" element={<ProtectedRoute allowedRoles={['company']}><CompanyAnalyticsPage /></ProtectedRoute>} />
                <Route path="/company/internships" element={<ProtectedRoute allowedRoles={['company']}><CompanyManageInternshipsPage /></ProtectedRoute>} />
                <Route path="/company/internships/new" element={<ProtectedRoute allowedRoles={['company']}><PostInternshipPage /></ProtectedRoute>} />
                <Route path="/company/internships/:internshipId" element={<ProtectedRoute allowedRoles={['company']}><CompanyInternshipDetailsPage /></ProtectedRoute>} />
                <Route path="/company/internships/:internshipId/applicants" element={<ProtectedRoute allowedRoles={['company']}><CompanyApplicantsPage /></ProtectedRoute>} />
                <Route path="/company/post-internship" element={<ProtectedRoute allowedRoles={['company']}><PostInternshipPage /></ProtectedRoute>} />
                <Route path="/company/applicants" element={<ProtectedRoute allowedRoles={['company']}><CompanyApplicantsPage /></ProtectedRoute>} />
                <Route path="/company/shortlisted" element={<ProtectedRoute allowedRoles={['company']}><CompanyShortlistedPage /></ProtectedRoute>} />
                <Route path="/company/interviews" element={<ProtectedRoute allowedRoles={['company']}><CompanyInterviewsPage /></ProtectedRoute>} />
                <Route path="/company/smart-matching" element={<ProtectedRoute allowedRoles={['company']}><CompanySmartMatchingPage /></ProtectedRoute>} />
                <Route path="/company/profile" element={<ProtectedRoute allowedRoles={['company']}><CompanyProfilePage /></ProtectedRoute>} />
                <Route path="/company/verification" element={<ProtectedRoute allowedRoles={['company']}><CompanyVerificationPage /></ProtectedRoute>} />
                <Route path="/company/notifications" element={<ProtectedRoute allowedRoles={['company']}><CompanyNotificationsPage /></ProtectedRoute>} />

                {/* Admin Protected Routes */}
                <Route path="/dashboard/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboardPage /></ProtectedRoute>} />
                <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboardPage /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsersOverviewPage /></ProtectedRoute>} />
                <Route path="/admin/users/:id" element={<ProtectedRoute allowedRoles={['admin']}><AdminUserDetailsPage /></ProtectedRoute>} />
                <Route path="/admin/students" element={<ProtectedRoute allowedRoles={['admin']}><AdminStudentsPage /></ProtectedRoute>} />
                <Route path="/admin/students/:id" element={<ProtectedRoute allowedRoles={['admin']}><AdminStudentDetailsPage /></ProtectedRoute>} />
                <Route path="/admin/companies" element={<ProtectedRoute allowedRoles={['admin']}><AdminCompaniesPage /></ProtectedRoute>} />
                <Route path="/admin/companies/:id" element={<ProtectedRoute allowedRoles={['admin']}><AdminCompanyDetailsPage /></ProtectedRoute>} />
                <Route path="/admin/faculty" element={<ProtectedRoute allowedRoles={['admin']}><AdminFacultyPage /></ProtectedRoute>} />
                <Route path="/admin/faculty/:id" element={<ProtectedRoute allowedRoles={['admin']}><AdminFacultyDetailsPage /></ProtectedRoute>} />
                <Route path="/admin/internships" element={<ProtectedRoute allowedRoles={['admin']}><AdminInternshipsPage /></ProtectedRoute>} />
                <Route path="/admin/internships/:id" element={<ProtectedRoute allowedRoles={['admin']}><AdminInternshipDetailsPage /></ProtectedRoute>} />
                <Route path="/admin/applications" element={<ProtectedRoute allowedRoles={['admin']}><AdminApplicationsPage /></ProtectedRoute>} />
                <Route path="/admin/applications/:id" element={<ProtectedRoute allowedRoles={['admin']}><AdminApplicationDetailsPage /></ProtectedRoute>} />
                <Route path="/admin/verifications" element={<ProtectedRoute allowedRoles={['admin']}><AdminVerificationsPage /></ProtectedRoute>} />
                <Route path="/admin/verifications/:id" element={<ProtectedRoute allowedRoles={['admin']}><AdminVerificationDetailsPage /></ProtectedRoute>} />
                <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['admin']}><AdminAnalyticsPage /></ProtectedRoute>} />
                <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><AdminReportsPage /></ProtectedRoute>} />
                <Route path="/admin/notifications" element={<ProtectedRoute allowedRoles={['admin']}><AdminNotificationsPage /></ProtectedRoute>} />
                <Route path="/admin/audit-logs" element={<ProtectedRoute allowedRoles={['admin']}><AdminAuditLogsPage /></ProtectedRoute>} />
                <Route path="/admin/audit-logs/:id" element={<ProtectedRoute allowedRoles={['admin']}><AdminAuditLogDetailsPage /></ProtectedRoute>} />
                <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><AdminSettingsPage /></ProtectedRoute>} />
                <Route path="/admin/selected-students" element={<ProtectedRoute allowedRoles={['admin']}><AdminSelectedStudentsPage /></ProtectedRoute>} />
                <Route path="/admin/ongoing-internships" element={<ProtectedRoute allowedRoles={['admin']}><AdminOngoingInternshipsPage /></ProtectedRoute>} />

                {/* T&P Officer Protected Routes */}
                <Route path="/dashboard/tp" element={<ProtectedRoute allowedRoles={['tnp']}><TPDashboardPage /></ProtectedRoute>} />
                <Route path="/dashboard/tnp" element={<ProtectedRoute allowedRoles={['tnp']}><TPDashboardPage /></ProtectedRoute>} />
                <Route path="/tp/dashboard" element={<ProtectedRoute allowedRoles={['tnp']}><TPDashboardPage /></ProtectedRoute>} />
                <Route path="/tp/students" element={<ProtectedRoute allowedRoles={['tnp']}><TPStudentsPage /></ProtectedRoute>} />
                <Route path="/tp/students/:id" element={<ProtectedRoute allowedRoles={['tnp']}><TPStudentDetailsPage /></ProtectedRoute>} />
                <Route path="/tp/companies" element={<ProtectedRoute allowedRoles={['tnp']}><TPCompaniesPage /></ProtectedRoute>} />
                <Route path="/tp/companies/:id" element={<ProtectedRoute allowedRoles={['tnp']}><TPCompanyDetailsPage /></ProtectedRoute>} />
                <Route path="/tp/internships" element={<ProtectedRoute allowedRoles={['tnp']}><TPInternshipsPage /></ProtectedRoute>} />
                <Route path="/tp/internships/:id" element={<ProtectedRoute allowedRoles={['tnp']}><TPInternshipDetailsPage /></ProtectedRoute>} />
                <Route path="/tp/applications" element={<ProtectedRoute allowedRoles={['tnp']}><TPApplicationsPage /></ProtectedRoute>} />
                <Route path="/tp/applications/:id" element={<ProtectedRoute allowedRoles={['tnp']}><TPApplicationDetailsPage /></ProtectedRoute>} />
                <Route path="/tp/interviews" element={<ProtectedRoute allowedRoles={['tnp']}><TPInterviewsPage /></ProtectedRoute>} />
                <Route path="/tp/placements" element={<ProtectedRoute allowedRoles={['tnp']}><TPPlacementsPage /></ProtectedRoute>} />
                <Route path="/tp/placements/:id" element={<ProtectedRoute allowedRoles={['tnp']}><TPPlacementDetailsPage /></ProtectedRoute>} />
                <Route path="/tp/reports" element={<ProtectedRoute allowedRoles={['tnp']}><TPReportsPage /></ProtectedRoute>} />
                <Route path="/tp/reports/placement" element={<ProtectedRoute allowedRoles={['tnp']}><TPReportsPage /></ProtectedRoute>} />
                <Route path="/tp/reports/company" element={<ProtectedRoute allowedRoles={['tnp']}><TPReportsPage /></ProtectedRoute>} />
                <Route path="/tp/reports/student" element={<ProtectedRoute allowedRoles={['tnp']}><TPReportsPage /></ProtectedRoute>} />
                <Route path="/tp/reports/internship" element={<ProtectedRoute allowedRoles={['tnp']}><TPReportsPage /></ProtectedRoute>} />
                <Route path="/tp/notifications" element={<ProtectedRoute allowedRoles={['tnp']}><AdminNotificationsPage /></ProtectedRoute>} />
                <Route path="/tp/profile" element={<ProtectedRoute allowedRoles={['tnp']}><TPProfilePage /></ProtectedRoute>} />
                <Route path="/tp/settings" element={<ProtectedRoute allowedRoles={['tnp']}><TPSettingsPage /></ProtectedRoute>} />

                {/* Faculty Protected Routes */}
                <Route path="/dashboard/faculty" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyDashboardPage /></ProtectedRoute>} />
                <Route path="/faculty/dashboard" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyDashboardPage /></ProtectedRoute>} />
                <Route path="/faculty/mentees" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyStudentsPage /></ProtectedRoute>} />
                <Route path="/faculty/students" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyStudentsPage /></ProtectedRoute>} />
                <Route path="/faculty/students/:id" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyStudentDetailsPage /></ProtectedRoute>} />
                <Route path="/faculty/internships" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyInternshipsPage /></ProtectedRoute>} />
                <Route path="/faculty/internships/:id" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyInternshipDetailsPage /></ProtectedRoute>} />
                <Route path="/faculty/applications" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyApplicationsPage /></ProtectedRoute>} />
                <Route path="/faculty/applications/:id" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyApplicationDetailsPage /></ProtectedRoute>} />
                <Route path="/faculty/companies" element={<ProtectedRoute allowedRoles={['faculty']}><TPCompaniesPage /></ProtectedRoute>} />
                <Route path="/faculty/companies/:id" element={<ProtectedRoute allowedRoles={['faculty']}><TPCompanyDetailsPage /></ProtectedRoute>} />
                <Route path="/faculty/reports" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyReportsPage /></ProtectedRoute>} />
                <Route path="/faculty/notifications" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyNotificationsPage /></ProtectedRoute>} />
                <Route path="/faculty/profile" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyProfilePage /></ProtectedRoute>} />
                <Route path="/faculty/settings" element={<ProtectedRoute allowedRoles={['faculty']}><FacultySettingsPage /></ProtectedRoute>} />
                <Route path="/faculty/settings/security" element={<ProtectedRoute allowedRoles={['faculty']}><FacultySecuritySettingsPage /></ProtectedRoute>} />

                {/* Dynamic Role Dashboard Placeholder */}
                <Route path="/dashboard/:role" element={<DummyDashboardPage />} />

                {/* Fallback Route */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </Router>
          </ApplicationProvider>
        </NotificationProvider>
      </AuditLogProvider>
      </SettingsProvider>
    </AuthProvider>
  );
};

export default App;
