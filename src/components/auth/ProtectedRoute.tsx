import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { RoleType } from '../../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: RoleType[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, role } = useAuth();

  if (!user || !role) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to user's assigned dashboard
    if (role === 'student') return <Navigate to="/dashboard/student" replace />;
    if (role === 'company') return <Navigate to="/dashboard/company" replace />;
    if (role === 'faculty') return <Navigate to="/faculty/dashboard" replace />;
    if (role === 'tnp') return <Navigate to="/tp/dashboard" replace />;
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
